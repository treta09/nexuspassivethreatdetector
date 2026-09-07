import { THREAT_META, SEVERITY, formatTime, formatBytes } from "@/lib/threatData";

// A single key/value row inside the inspector panels.
function Row({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/60">
      <span className="font-mono text-[10px] tracking-[0.05em] text-muted-foreground uppercase">{label}</span>
      <span className="font-mono text-[11px]" style={{ color: accent || "hsl(var(--foreground))" }}>{value}</span>
    </div>
  );
}

// Entropy gauge — color shifts with value (green → amber → red).
function EntropyGauge({ value }) {
  const pct = Math.min(100, (value / 5) * 100);
  const color = value > 4 ? "hsl(var(--destructive))" : value > 3 ? "hsl(var(--warning))" : "hsl(var(--success))";
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[10px] tracking-[0.05em] text-muted-foreground uppercase">Entropy</span>
        <span className="font-mono text-[11px] font-bold" style={{ color }}>{value.toFixed(2)}</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full transition-all rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function EvidenceBlock({ alert }) {
  const ev = alert.evidence || {};
  return (
    <div>
      <div className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase mb-2">Evidence</div>
      <pre className="font-mono text-[10px] text-info bg-background border border-border rounded-md p-2 overflow-x-auto scrollbar-thin leading-relaxed">
{JSON.stringify(ev, null, 2)}
      </pre>
    </div>
  );
}

// Inspector — full detail view for the selected alert. Shows an empty state
// when nothing is selected (driven by the URL-bound `alert` prop).
export default function AlertInspector({ alert }) {
  if (!alert) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 flex-1 flex items-center justify-center">
        <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">Select an alert to inspect</span>
      </div>
    );
  }
  const meta = THREAT_META[alert.threat_class];
  const sev = SEVERITY[alert.severity];
  const entropy = alert.evidence?.entropy ?? (alert.threat_class === "DNS_TUNNEL" ? 4.2 : 2.1);

  return (
    <div className="bg-card border border-border rounded-lg flex-1 flex flex-col min-h-0">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">Inspector</span>
        <span className="font-mono text-[10px] text-foreground">{alert.flow_id}</span>
      </div>

      <div className="overflow-y-auto scrollbar-thin p-3 flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
          <span className="font-mono text-[14px] font-bold tracking-[0.05em]" style={{ color: meta.color }}>{alert.threat_class}</span>
          <span
            className="font-mono text-[9px] font-bold px-1.5 py-0.5 uppercase ml-auto rounded-sm"
            style={{ color: sev.color, border: `1px solid ${sev.color}55`, background: `${sev.color}14` }}
          >
            {sev.label}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-muted-foreground">Confidence</span>
          <span className="font-mono text-[18px] font-bold" style={{ color: meta.color }}>{Math.round(alert.confidence * 100)}%</span>
        </div>

        <div>
          <div className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase mb-1">5-Tuple</div>
          <div className="bg-secondary border border-border rounded-md p-2 space-y-0.5">
            <Row label="src_ip" value={alert.src_ip} accent="hsl(var(--info))" />
            <Row label="dst_ip" value={alert.dst_ip} accent="hsl(var(--info))" />
            <Row label="src_port" value={alert.src_port} />
            <Row label="dst_port" value={alert.dst_port} />
            <Row label="protocol" value={alert.protocol} accent="hsl(var(--success))" />
          </div>
        </div>

        <div>
          <div className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase mb-1">Flow Metrics</div>
          <div className="bg-secondary border border-border rounded-md p-2 space-y-0.5">
            <Row label="packets" value={alert.packet_count.toLocaleString()} />
            <Row label="bytes" value={formatBytes(alert.byte_count)} />
            <Row label="duration" value={alert.duration + "s"} />
            <Row label="timestamp" value={formatTime(alert.timestamp)} />
          </div>
        </div>

        <EntropyGauge value={entropy} />

        {alert.ja3 && (
          <div>
            <div className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase mb-1">JA3 Fingerprint</div>
            <div className="bg-secondary border border-border rounded-md p-2">
              <Row label="ja3" value={alert.ja3} accent="hsl(var(--warning))" />
              {alert.sni && <Row label="sni" value={alert.sni} accent="hsl(var(--warning))" />}
            </div>
          </div>
        )}

        {alert.dns_query && (
          <div>
            <div className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase mb-1">DNS Query</div>
            <div className="bg-secondary border border-border rounded-md p-2">
              <Row label="query" value={alert.dns_query} accent="hsl(var(--info))" />
            </div>
          </div>
        )}

        <EvidenceBlock alert={alert} />
      </div>
    </div>
  );
}