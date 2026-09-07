# Deployment

Deploy the Vite dashboard to Vercel with `npm run build`. Run FastAPI separately on infrastructure permitted to receive the passive feed. Set `FASTAPI_BASE_URL` in Vercel and keep `FASTAPI_API_KEY` server-side. Do not expose capture interfaces or ingestion credentials to browser code.