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
  "UDP_REFLECTION",
  "PORT_SCAN",
  "DNS_TUNNEL",
  "DGA_DOMAIN",
  "EXFILTRATION",
  "C2_BEACON",
  "TLS_SUSPICIOUS",
];

// Threat catalog for the passive detector. Every class is inferred from
// observed flow or protocol metadata; no detector sends traffic back.
export const THREAT_CATALOG = [
  { id: "SYN_FLOOD", label: "SYN flood", family: "Volumetric DDoS", evidence: "SYN rate, SYN/ACK ratio, source entropy" },
  { id: "UDP_REFLECTION", label: "UDP reflection", family: "Volumetric DDoS", evidence: "amplification ratio, packet rate, spoofed-source entropy" },
  { id: "C2_BEACON", label: "Botnet C2 beacon", family: "Command and control", evidence: "periodicity, inter-arrival variance, destination set" },
  { id: "DNS_TUNNEL", label: "DNS tunnelling", family: "DNS abuse", evidence: "query entropy, length, n-grams, record type" },
  { id: "DGA_DOMAIN", label: "DGA domain", family: "DNS abuse", evidence: "domain entropy, digit ratio, n-gram likelihood" },
  { id: "TLS_SUSPICIOUS", label: "Suspicious TLS/QUIC", family: "Encrypted metadata", evidence: "JA3/JA4, packet sizes, timing sequence" },
  { id: "PORT_SCAN", label: "Port scan", family: "Reconnaissance", evidence: "destination fan-out, port cardinality, connection rate" },
  { id: "EXFILTRATION", label: "Data exfiltration", family: "Data loss", evidence: "outbound/inbound byte ratio, asymmetric duration" },
  { id: "BENIGN", label: "Benign", family: "Baseline", evidence: "within learned baseline" },
];

export const PASSIVE_FEATURE_GROUPS = [
  { name: "Flow statistics", fields: "packets, bytes, duration, packets/sec, bytes/sec" },
  { name: "DDoS and entropy", fields: "SYN ratio, amplification, source-IP entropy, destination fan-out" },
  { name: "Beacon behaviour", fields: "inter-arrival mean, jitter, periodicity, destination cardinality" },
  { name: "DNS metadata", fields: "query length, entropy, n-grams, digit ratio, record type" },
  { name: "TLS/QUIC metadata", fields: "JA3/JA3S/JA4, packet sizes, timing, handshake metadata" },
  { name: "Exfiltration signals", fields: "outbound/inbound ratio, burst size, asymmetric flow volume" },
];

export const PIPELINE_STAGES = [
  { id: "ingest", label: "Read-only ingest", detail: "PCAP, NetFlow/IPFIX, sFlow" },
  { id: "flow", label: "Flow assembly", detail: "5-tuple windows with bounded state" },
  { id: "features", label: "Feature extraction", detail: "Behaviour and protocol metadata" },
  { id: "inference", label: "Inference", detail: "Rules plus trained classifier" },
  { id: "alerts", label: "Alert output", detail: "Evidence-backed standardized records" },
];

export const ALERT_SCHEMA_FIELDS = [
  "timestamp", "flow_id", "threat_class", "severity", "confidence", "evidence",
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
  UDP_REFLECTION: { color: DATA_COLORS.danger, short: "UDP" },
  PORT_SCAN: { color: DATA_COLORS.warning, short: "SCN" },
  DNS_TUNNEL: { color: DATA_COLORS.info, short: "DNS" },
  DGA_DOMAIN: { color: DATA_COLORS.info, short: "DGA" },
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