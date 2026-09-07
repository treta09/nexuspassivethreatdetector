# Passive Detection Backend

This reference FastAPI service implements the prototype pipeline described by the project brief:

1. `POST /ingest/flow` accepts one observed flow record.
2. Features are calculated from rates, entropy, timing, fan-out, DNS metadata, TLS fingerprints, and byte asymmetry.
3. Explainable passive detectors classify DDoS, beaconing, DNS tunnelling, DGA, suspicious TLS/QUIC, scanning, and exfiltration.
4. The result is stored as a standardized alert with confidence and evidence.
5. `GET /alerts`, `GET /telemetry`, and `GET /benchmarks` expose read-only dashboard data.

The service never accepts payload content, sends a probe, completes a handshake, or emits a mitigation command. It is intentionally an in-memory reference implementation for replay and lab traffic. Use a durable stream/state store for production capture rates.

Run locally:

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
