// ─────────────────────────────────────────────────────────────────────────
// Data-visualization palette + standardized alert schema metadata.
//
// This is the ONLY place data colors are defined. Every component reads from
// here (or from the status tokens in index.css), so retheming the data layer
// is a one-file change. The dashboard renders exclusively real alerts emitted
// by the Python detection pipeline (FastAPI) — nothing here is fabricated.
// ─────────────────────────────────────────────────────────────────────────

// Distinct, color-blind-aware hues for threat classes & severity. Kept
// cohesive with the slate+blue app theme (see src/index.css).
export const DATA_COLORS = {
  danger: "#EF4444",   // critical / syn_flood / exfiltration
  warning: "#F59E0B",  // high / port_scan
  info: "#3B82F6",     // medium / dns_tunnel
  cyan: "#06B6D4",     // tls_suspicious
  violet: "#8B5CF6",   // c2_beacon
  pink: "#EC4899",     // exfiltration
  success: "#10B981",  // benign / healthy
  muted: "#94A3B8",    // low severity / disabled
};

export const THREAT_CLASSES = [
  "BENIGN",
  "SYN_FLOOD",
  "PORT_SCAN",
  "DNS_TUNNEL",
  "EXFILTRATION",
  "C2_BEACON",
  "TLS_SUSPICIOUS",
];

// Severity → color. Used by chips, meters, and the inspector.
export const SEVERITY = {
  CRITICAL: { label: "CRITICAL", color: DATA_COLORS.danger },
  HIGH: { label: "HIGH", color: DATA_COLORS.warning },
  MEDIUM: { label: "MEDIUM", color: DATA_COLORS.info },
  LOW: { label: "LOW", color: DATA_COLORS.muted },
};

// Threat class → color + short tag. Drives the radar blips, distribution bars,
// and console indicators.
export const THREAT_META = {
  SYN_FLOOD: { color: DATA_COLORS.danger, short: "SYN" },
  PORT_SCAN: { color: DATA_COLORS.warning, short: "SCN" },
  DNS_TUNNEL: { color: DATA_COLORS.info, short: "DNS" },
  EXFILTRATION: { color: DATA_COLORS.pink, short: "EXF" },
  C2_BEACON: { color: DATA_COLORS.violet, short: "C2" },
  TLS_SUSPICIOUS: { color: DATA_COLORS.cyan, short: "TLS" },
  BENIGN: { color: DATA_COLORS.success, short: "OK" },
};

// Timestamp → HH:MM:SS.mmm (24h, locale-stable for log alignment).
export function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-GB", { hour12: false }) + "." + String(d.getMilliseconds()).padStart(3, "0");
}

// Byte count → human-readable B / KB / MB.
export function formatBytes(n) {
  if (n == null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + " MB";
  if (n >= 1000) return (n / 1000).toFixed(1) + " KB";
  return n + " B";
}