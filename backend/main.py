"""Read-only streaming detector for passive IP flow records.

The service never opens a connection to a flow endpoint, decrypts payloads, or
returns a mitigation command. It accepts observations, derives metadata-only
features, and emits evidence-backed alerts.
"""

from __future__ import annotations

import math
import time
from collections import deque
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Nexus Passive Threat Detector", version="1.0.0")
alerts: deque[dict[str, Any]] = deque(maxlen=5000)
flow_count = 0
window_started = time.monotonic()


class FlowRecord(BaseModel):
    """Observed flow fields. Payload bytes are deliberately not accepted."""

    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    flow_id: str
    src_ip: str
    dst_ip: str
    src_port: int = 0
    dst_port: int = 0
    protocol: str = "UNKNOWN"
    packet_count: int = 0
    byte_count: int = 0
    duration: float = 0.0
    direction: str = "unknown"
    syn_count: int = 0
    ack_count: int = 0
    unique_dest_ports: int = 0
    unique_dest_hosts: int = 0
    source_ip_entropy: float = 0.0
    amplification_ratio: float = 0.0
    inter_arrival_mean_ms: float = 0.0
    inter_arrival_jitter_ms: float = 0.0
    periodicity_score: float = 0.0
    dns_query: str | None = None
    dns_record_type: str | None = None
    ja3: str | None = None
    ja3s: str | None = None
    ja4: str | None = None
    outbound_bytes: int = 0
    inbound_bytes: int = 0


def entropy(value: str) -> float:
    """Calculate Shannon entropy from an observed DNS label."""
    if not value:
        return 0.0
    counts = {char: value.count(char) for char in set(value)}
    length = len(value)
    return -sum((count / length) * math.log2(count / length) for count in counts.values())


def extract_features(flow: FlowRecord) -> dict[str, float]:
    duration = max(flow.duration, 0.001)
    query = flow.dns_query or ""
    outbound = flow.outbound_bytes or flow.byte_count
    inbound = flow.inbound_bytes
    return {
        "packets_per_second": flow.packet_count / duration,
        "bytes_per_second": flow.byte_count / duration,
        "syn_ratio": flow.syn_count / max(flow.packet_count, 1),
        "syn_ack_ratio": flow.ack_count / max(flow.syn_count, 1),
        "dns_entropy": entropy(query),
        "dns_length": float(len(query)),
        "dns_digit_ratio": sum(char.isdigit() for char in query) / max(len(query), 1),
        "outbound_inbound_ratio": outbound / max(inbound, 1),
        "amplification_ratio": flow.amplification_ratio,
        "source_ip_entropy": flow.source_ip_entropy,
        "periodicity_score": flow.periodicity_score,
        "inter_arrival_jitter_ms": flow.inter_arrival_jitter_ms,
    }


def classify(flow: FlowRecord, features: dict[str, float]) -> tuple[str, str, float, dict[str, Any]]:
    """Apply explainable passive detectors in priority order."""
    if flow.protocol.upper() == "UDP" and features["amplification_ratio"] >= 5:
        return "UDP_REFLECTION", "CRITICAL", 0.97, {"amplification_ratio": features["amplification_ratio"], "packet_rate": features["packets_per_second"]}
    if flow.syn_count >= 20 and features["syn_ack_ratio"] < 0.1:
        return "SYN_FLOOD", "CRITICAL", 0.95, {"syn_count": flow.syn_count, "syn_ack_ratio": features["syn_ack_ratio"], "source_ip_entropy": flow.source_ip_entropy}
    if flow.unique_dest_ports >= 20 or flow.unique_dest_hosts >= 20:
        return "PORT_SCAN", "HIGH", 0.92, {"unique_dest_ports": flow.unique_dest_ports, "unique_dest_hosts": flow.unique_dest_hosts, "connection_rate": features["packets_per_second"]}
    if flow.dns_query and features["dns_entropy"] >= 3.5 and features["dns_length"] >= 30:
        return "DNS_TUNNEL", "HIGH", 0.91, {"query_entropy": features["dns_entropy"], "query_length": features["dns_length"], "record_type": flow.dns_record_type}
    if flow.dns_query and (features["dns_digit_ratio"] >= 0.25 or features["dns_entropy"] >= 3.2):
        return "DGA_DOMAIN", "HIGH", 0.86, {"query_entropy": features["dns_entropy"], "digit_ratio": features["dns_digit_ratio"], "query_length": features["dns_length"]}
    if (flow.ja3 or flow.ja4) and features["inter_arrival_jitter_ms"] > 0 and features["inter_arrival_jitter_ms"] < 50:
        return "TLS_SUSPICIOUS", "MEDIUM", 0.78, {"ja3": flow.ja3, "ja3s": flow.ja3s, "ja4": flow.ja4, "timing_jitter_ms": features["inter_arrival_jitter_ms"]}
    if features["periodicity_score"] >= 0.85:
        return "C2_BEACON", "HIGH", 0.89, {"periodicity_score": features["periodicity_score"], "inter_arrival_mean_ms": flow.inter_arrival_mean_ms, "destination": flow.dst_ip}
    if features["outbound_inbound_ratio"] >= 10 and (flow.outbound_bytes or flow.byte_count) >= 1_000_000:
        return "EXFILTRATION", "CRITICAL", 0.9, {"outbound_inbound_ratio": features["outbound_inbound_ratio"], "outbound_bytes": flow.outbound_bytes or flow.byte_count, "inbound_bytes": flow.inbound_bytes}
    return "BENIGN", "LOW", 0.62, {"packets_per_second": features["packets_per_second"], "bytes_per_second": features["bytes_per_second"]}


@app.get("/health")
def health() -> dict[str, Any]:
    return {"ok": True, "service": "nexus-passive-threat-detector", "read_only": True}


@app.post("/ingest/flow")
def ingest_flow(flow: FlowRecord) -> dict[str, Any]:
    """Process one observed record; the endpoint has no response/action channel."""
    global flow_count, window_started
    flow_count += 1
    features = extract_features(flow)
    threat_class, severity, confidence, evidence = classify(flow, features)
    alert = {
        "timestamp": flow.timestamp.isoformat(),
        "flow_id": flow.flow_id,
        "threat_class": threat_class,
        "severity": severity,
        "confidence": confidence,
        "src_ip": flow.src_ip,
        "dst_ip": flow.dst_ip,
        "src_port": flow.src_port,
        "dst_port": flow.dst_port,
        "protocol": flow.protocol,
        "packet_count": flow.packet_count,
        "byte_count": flow.byte_count,
        "duration": flow.duration,
        "evidence": evidence,
        "dns_query": flow.dns_query,
        "ja3": flow.ja3,
        "ja3s": flow.ja3s,
        "ja4": flow.ja4,
    }
    alerts.appendleft(alert)
    return {"accepted": True, "alert": alert, "features": features}


@app.get("/alerts")
def list_alerts(limit: int = 120) -> list[dict[str, Any]]:
    return list(alerts)[: max(1, min(limit, 500))]


@app.get("/telemetry")
def telemetry() -> dict[str, Any]:
    elapsed = max(time.monotonic() - window_started, 0.001)
    return {
        "flowsPerSec": round(flow_count / elapsed, 2),
        "latencyP50": None,
        "latencyP95": None,
        "latencyMax": None,
        "uptimeSec": int(time.monotonic()),
        "pcapTarget": "read-only mirror",
        "windowId": int(time.monotonic() // 5),
    }


@app.get("/benchmarks")
def benchmarks() -> dict[str, Any]:
    return {
        "throughput": [],
        "detection": [],
        "performance": [{"metric": "payload access", "value": "none"}, {"metric": "return path", "value": "none"}],
    }
