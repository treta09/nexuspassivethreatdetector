const ALLOWED_FUNCTIONS = {
  getLiveThreatData: {
    path: "/alerts?limit=120",
    telemetryPath: "/telemetry",
  },
  getBenchmarks: {
    path: "/benchmarks",
  },
};

function backendConfig() {
  const baseUrl = (process.env.FASTAPI_BASE_URL || "").trim().replace(/\/+$/, "");
  const apiKey = (process.env.FASTAPI_API_KEY || "").trim();
  return { baseUrl, apiKey };
}

async function fetchJson(baseUrl, path, apiKey) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        Accept: "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`upstream_${response.status}`);
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(request, response) {
  const name = request.query?.name;
  const definition = ALLOWED_FUNCTIONS[name];
  if (!definition) {
    return response.status(404).json({ error: "function_not_found" });
  }

  const { baseUrl, apiKey } = backendConfig();
  if (!baseUrl) return response.status(200).json({ configured: false });
  if (!/^https?:\/\//i.test(baseUrl)) {
    return response.status(200).json({ configured: true, error: "invalid_config" });
  }

  try {
    if (name === "getLiveThreatData") {
      const [alertsRaw, telemetryRaw] = await Promise.all([
        fetchJson(baseUrl, definition.path, apiKey),
        fetchJson(baseUrl, definition.telemetryPath, apiKey),
      ]);
      const alerts = Array.isArray(alertsRaw) ? alertsRaw : alertsRaw?.alerts || [];
      const telemetry = telemetryRaw && typeof telemetryRaw === "object" && !Array.isArray(telemetryRaw)
        ? telemetryRaw
        : {};
      return response.status(200).json({ configured: true, source: "live", alerts, telemetry });
    }

    const benchmarks = await fetchJson(baseUrl, definition.path, apiKey);
    return response.status(200).json({ configured: true, benchmarks });
  } catch (error) {
    const code = error?.name === "AbortError" ? "upstream_timeout" : error?.message || "upstream_unavailable";
    return response.status(200).json({ configured: true, error: code });
  }
}
