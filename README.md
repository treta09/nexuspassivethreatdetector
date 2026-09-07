# Nexus Passive Threat Detector

AI-assisted detection of cyber threats in unidirectional IP traffic for a passive, read-only monitoring enclave.

## Safety boundary

- Traffic is observed through a passive TAP, hardware data diode, mirror, PCAP, or flow records.
- The pipeline never probes, injects packets, decrypts payloads, sends mitigation commands, or returns traffic toward production.
- ML models are trained from operator-supplied datasets. This repository does not generate attack or benign traffic.

## Repository layout

The Python pipeline is organized into `ingestion/`, `feature_engineering/`, `ml/`, `detection/`, and `backend/`. The existing Vite dashboard remains at the repository root for Vercel deployment; `frontend/` contains the frontend boundary documentation for the planned split layout.

## Local development

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
npm install
npm run dev
```

## Vercel

Deploy the root Vite app with `npm run build`. Set `FASTAPI_BASE_URL` and optionally `FASTAPI_API_KEY` in Vercel. Vercel serves the dashboard and proxies read-only dashboard requests through `api/functions/[name].js`; the FastAPI capture service should run separately.