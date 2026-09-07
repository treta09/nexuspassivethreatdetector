# Passive Detection Design

## Operating constraints

The detector runs inside a one-way monitoring enclave. Its input is a read-only stream of mirrored packets or exported flow records. It never contacts an observed source or destination, completes a handshake, decrypts TLS/QUIC payloads, or emits a mitigation command.

## Streaming pipeline

`capture -> 5-tuple flow assembly -> 5 second window / 1 second step -> feature extraction -> rules and classifier -> alert`

The reference backend accepts one flow at a time at `POST /ingest/flow`. The bounded window gives the dashboard a target alert latency of 6 seconds or less. The initial benchmark target is 1,000 flows per second; benchmark values must be replaced with measurements from the deployment environment.

## Features

- Volumetric DDoS: packet rate, SYN rate, SYN/ACK ratio, amplification ratio, and source-IP entropy.
- Beaconing: inter-arrival mean, timing jitter, periodicity score, and destination cardinality.
- DNS abuse: query length, Shannon entropy, digit ratio, n-gram score, and record type.
- TLS/QUIC: JA3, JA3S, JA4, packet-size sequence, and timing metadata only.
- Reconnaissance: unique destination ports, unique destination hosts, and connection rate.
- Exfiltration: outbound and inbound byte totals, duration, and outbound/inbound ratio.

## Models and validation

The prototype combines explainable threshold detectors with a classifier contract. Training data should combine benign iperf3, Ostinato, or TRex captures with lab attack captures from hping3, dnscat2, iodine, Slowloris, and a controlled beacon/DGA generator. Split by capture session, not by individual flow, to prevent near-duplicate leakage. Use a 70/15/15 train/validation/test split, report per-class precision, recall, F1, calibration, and false-positive rate, and keep a separate time-based test capture.

## Alert schema

```json
{
  "timestamp": "2026-09-07T12:00:00Z",
  "flow_id": "flow-1023",
  "threat_class": "PORT_SCAN",
  "severity": "HIGH",
  "confidence": 0.92,
  "evidence": {
    "unique_dest_ports": 147,
    "unique_dest_hosts": 23,
    "connection_rate": 192
  }
}
```
