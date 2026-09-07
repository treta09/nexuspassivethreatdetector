import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { getConfig, fetchResource } from '../../shared/fastapiClient.ts';

// Secure admin-only proxy: pulls measured benchmark results from the FastAPI
// backend. Returns { configured: false } when no backend is configured, so the
// page shows an empty state (no invented numbers).
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { baseUrl, apiKey, configured } = getConfig();
    if (!configured) return Response.json({ configured: false });

    const raw = await fetchResource(baseUrl, '/benchmarks', apiKey);
    const benchmarks = (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw : {};
    return Response.json({ configured: true, benchmarks });
  } catch (error) {
    console.error('[getBenchmarks]', error?.code || 'unexpected', error?.message || error);
    return Response.json({ configured: true, error: error?.code || 'upstream_unavailable' });
  }
}