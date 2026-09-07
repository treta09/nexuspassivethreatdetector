# Architecture

Passive traffic enters through a TAP, hardware data diode, mirror, PCAP, or flow-record collector and moves one way into the monitoring enclave. The pipeline constructs flows, extracts metadata-only features, applies trained ML plus statistical and rule-based detectors, and emits standardized alerts to the FastAPI services and dashboard.

There is no return path, active probing, payload decryption, packet injection, inline mitigation, or automated blocking.