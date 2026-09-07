import { THREAT_META } from "@/lib/threatData";

// Threat distribution — per-class counts and share bars. Colors come from the
// centralized THREAT_META palette so they match the radar and console.
/** @type {Array<keyof typeof THREAT_META>} */
const ORDER = ["SYN_FLOOD", "UDP_REFLECTION", "PORT_SCAN", "DNS_TUNNEL", "DGA_DOMAIN", "EXFILTRATION", "C2_BEACON", "TLS_SUSPICIOUS"];

/** @param {{ counts: Record<string, number> }} props */
export default function ThreatDistribution({ counts }) {
  const total = ORDER.reduce((s, t) => s + (counts[t] || 0), 0) || 1;
  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase mb-2">Threat Distribution</div>
      <div className="space-y-1.5">
        {ORDER.map((t) => {
          const meta = THREAT_META[t] || THREAT_META.BENIGN;
          const n = counts[t] || 0;
          const pct = (n / total) * 100;
          return (
            <div key={t}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-mono text-[10px] tracking-[0.03em]" style={{ color: meta.color }}>{t}</span>
                <span className="font-mono text-[10px] text-foreground">{n}</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500 rounded-full" style={{ width: `${pct}%`, background: meta.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}