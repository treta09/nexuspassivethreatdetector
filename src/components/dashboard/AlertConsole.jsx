import { THREAT_META, SEVERITY, formatTime } from "@/lib/threatData";

/** @typedef {"SYN_FLOOD" | "UDP_REFLECTION" | "PORT_SCAN" | "DNS_TUNNEL" | "DGA_DOMAIN" | "EXFILTRATION" | "C2_BEACON" | "TLS_SUSPICIOUS" | "BENIGN"} ThreatClass */
/** @typedef {keyof typeof SEVERITY} Severity */
/** @typedef {{ id: string | number, flow_id: string, threat_class: ThreatClass, severity: Severity, confidence: number, src_ip: string, dst_ip: string, timestamp: string | number }} Alert */

// Severity chip — colored badge driven by the centralized SEVERITY palette.
/** @param {{ severity: Severity }} props */
function SeverityChip({ severity }) {
  const s = SEVERITY[severity] || SEVERITY.LOW;
  return (
    <span
      className="font-mono text-[9px] font-bold tracking-[0.05em] px-1.5 py-0.5 uppercase rounded-sm"
      style={{ color: s.color, border: `1px solid ${s.color}55`, background: `${s.color}14` }}
    >
      {s.label}
    </span>
  );
}

// Alert console — the live feed table. Clicking a row selects that alert
// (onSelect); clicking the already-selected row toggles it off (passes null)
// so the URL-bound detail view deselects. `selectedId` controls the highlight.
/** @param {{ alerts: Alert[], selectedId?: string | number, onSelect: (alert: Alert | null) => void }} props */
export default function AlertConsole({ alerts, selectedId, onSelect }) {
  return (
    <div className="flex flex-col bg-card border border-border rounded-lg flex-1 min-h-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">Alert Console</span>
        <span className="font-mono text-[9px] text-muted-foreground">{alerts.length} events</span>
      </div>
      <div className="overflow-y-auto scrollbar-thin flex-1">
        <table className="w-full font-mono text-[11px]">
          <thead className="sticky top-0 bg-secondary">
            <tr className="text-[9px] tracking-[0.05em] text-muted-foreground uppercase">
              <th className="text-left font-medium px-2 py-1.5">Flow</th>
              <th className="text-left font-medium px-2 py-1.5">Threat</th>
              <th className="text-left font-medium px-2 py-1.5">Sev</th>
              <th className="text-right font-medium px-2 py-1.5">Conf</th>
              <th className="text-left font-medium px-2 py-1.5 hidden lg:table-cell">Src → Dst</th>
              <th className="text-left font-medium px-2 py-1.5 hidden sm:table-cell">Time</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => {
              const meta = THREAT_META[a.threat_class] || THREAT_META.BENIGN;
              const active = a.id === selectedId;
              return (
                <tr
                  key={a.id}
                  onClick={() => onSelect(active ? null : a)}
                  className={`cursor-pointer border-b border-border/60 transition-colors ${
                    active ? "bg-primary/10" : "hover:bg-secondary"
                  }`}
                >
                  <td className="px-2 py-1.5 text-muted-foreground">{a.flow_id}</td>
                  <td className="px-2 py-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                      <span style={{ color: meta.color }} className="font-medium tracking-[0.03em]">{a.threat_class}</span>
                    </span>
                  </td>
                  <td className="px-2 py-1.5"><SeverityChip severity={a.severity} /></td>
                  <td className="px-2 py-1.5 text-right text-foreground">{Math.round(a.confidence * 100)}<span className="text-muted-foreground">%</span></td>
                  <td className="px-2 py-1.5 text-muted-foreground hidden lg:table-cell">{a.src_ip} → {a.dst_ip}</td>
                  <td className="px-2 py-1.5 text-muted-foreground hidden sm:table-cell">{formatTime(a.timestamp)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}