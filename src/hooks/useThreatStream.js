import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "@/api/client";
import { THREAT_CLASSES } from "@/lib/threatData";

// Live-only streaming engine. Polls the FastAPI detection backend through the
// secure server-side proxy every 2s. No simulated or fallback data — when the
// backend is not configured or unreachable, state stays empty and `status`
// tells the UI to render an empty state. Read-only: the dashboard never writes
// back to the ingest path.
export function useThreatStream() {
  const [alerts, setAlerts] = useState([]);
  const [throughput, setThroughput] = useState([]);
  const [telemetry, setTelemetry] = useState({
    cpu: 0,
    ram: 0,
    flowsPerSec: 0,
    latencyP50: 0,
    latencyP95: 0,
    latencyMax: 0,
    uptimeSec: 0,
    pcapTarget: "—",
    windowId: 0,
  });
  const [threatCounts, setThreatCounts] = useState(() => {
    const c = {};
    THREAT_CLASSES.forEach((t) => (c[t] = 0));
    return c;
  });
  // loading | live | unconfigured | error
  const [status, setStatus] = useState("loading");
  // Stable error code from the proxy (e.g. "upstream_timeout", "invalid_config")
  // — surfaced in the UI banner to aid debugging. Null when healthy.
  const [lastError, setLastError] = useState(null);

  const activeRef = useRef(true);

  const poll = useCallback(async () => {
    try {
      const res = await api.functions.invoke("getLiveThreatData", {});
      if (!activeRef.current) return;
      const data = res.data;
      if (!data?.configured) {
        setStatus("unconfigured");
        return;
      }
      if (data.source !== "live") {
        setStatus("error");
        setLastError(data.error || "upstream_unavailable");
        return;
      }
      setStatus("live");
      setLastError(null);
      if (Array.isArray(data.alerts)) setAlerts(data.alerts.slice(0, 120));
      if (data.telemetry && typeof data.telemetry === "object") {
        setTelemetry((prev) => ({ ...prev, ...data.telemetry }));
        setThroughput((prev) => [...prev.slice(-59), data.telemetry.flowsPerSec ?? 0]);
      }
    } catch (err) {
      if (activeRef.current) {
        setStatus("error");
        setLastError(err?.code || "unexpected");
      }
    }
  }, []);

  useEffect(() => {
    activeRef.current = true;
    poll();
    const interval = setInterval(poll, 2000);
    return () => {
      activeRef.current = false;
      clearInterval(interval);
    };
  }, [poll]);

  // Recompute threat distribution from current alerts.
  useEffect(() => {
    setThreatCounts(() => {
      const c = {};
      THREAT_CLASSES.forEach((t) => (c[t] = 0));
      alerts.forEach((a) => {
        c[a.threat_class] = (c[a.threat_class] || 0) + 1;
      });
      return c;
    });
  }, [alerts]);

  return { alerts, throughput, telemetry, threatCounts, status, lastError, refresh: poll };
}