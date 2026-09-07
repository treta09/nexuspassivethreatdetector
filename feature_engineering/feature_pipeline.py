"""Small, deterministic metadata feature boundary for trained models."""

from ingestion.schemas import FlowRecord
from .entropy_features import shannon_entropy


def extract_features(flow: FlowRecord) -> dict[str, float]:
    duration = max(flow.duration, 0.001)
    query = str(flow.metadata.get("dns_query", ""))
    return {
        "packets_per_second": flow.packet_count / duration,
        "bytes_per_second": flow.byte_count / duration,
        "dns_entropy": shannon_entropy(query),
        "dns_length": float(len(query)),
        "flow_duration": flow.duration,
    }