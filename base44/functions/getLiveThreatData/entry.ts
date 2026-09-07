import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { getConfig, fetchResource } from '../../shared/fastapiClient.ts';

// Secure, admin-only proxy to the Python FastAPI detection backend.
// Returns live alerts + telemetry for the command center. No simulated data:
// if the backend is not configured it reports `configured: false`; if it is
// unreachable it reports an error. The dashboard renders an empty state in
// both cases — it never fabricates data.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { baseUrl, apiKey, configured } = getConfig();
    if (!configured) return Response.json({ configured: false });

    const [alertsRaw, telemetryRaw] = await Promise.all([
      fetchResource(baseUrl, '/alerts?limit=120', apiKey),
      fetchResource(baseUrl, '/telemetry', apiKey),
    ]);

    const alerts = Array.isArray(alertsRaw)
      ? alertsRaw
      : (alertsRaw && Array.isArray(alertsRaw.alerts) ? alertsRaw.alerts : []);

    const telemetry = (telemetryRaw && typeof telemetryRaw === 'object' && !Array.isArray(telemetryRaw))
      ? telemetryRaw
      : {};

    return Response.json({ configured: true, source: 'live', alerts, telemetry });
  } catch (error) {
    // Log full detail server-side (visible in the Logs explorer) for debugging;
    // return only a stable code to the (admin-only) client so no upstream
    // internals leak.
    console.error('[getLiveThreatData]', error?.code || 'unexpected', error?.message || error);
    return Response.json({ configured: true, error: error?.code || 'upstream_unavailable' });
  }
}