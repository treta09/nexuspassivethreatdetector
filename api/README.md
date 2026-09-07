# Backend API

The `api/` directory contains Vercel serverless functions for the threat dashboard.

- `GET /api/health` checks that the deployment is running.
- `POST /api/functions/getLiveThreatData` proxies alerts and telemetry.
- `POST /api/functions/getBenchmarks` proxies benchmark data.

Set `FASTAPI_BASE_URL` and `FASTAPI_API_KEY` in Vercel project settings. The proxy keeps the upstream API key server-side and returns an explicit unconfigured state when the detection service is unavailable.

The reference detector in `backend/` can be run locally and used as the value of `FASTAPI_BASE_URL`.

Authentication routes used by the frontend (`/api/auth/*`) must be supplied by the deployment's auth service. The frontend sends bearer tokens from `access_token` and supports cookie-backed sessions.
