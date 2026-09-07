import { THREAT_META, SEVERITY, formatTime } from "@/lib/threatData";

// Mobile alert feed — expandable cards. Controlled by the parent (openId +
// onToggle) so the open alert is bound to the URL: tapping an alert pushes
// ?alertId=, tapping it again (or pressing Back) collapses it instead of
// leaving the app.
export default function MobileAlertFeed({ alerts, openId, onToggle }) {
  return (
    <div className="space-y-2">
      {alerts.slice(0, 40).map((a) => {
        const meta = THREAT_META[a.threat_class];
        const sev = SEVERITY[a.severity];
        const open = openId === a.id;
        return (
          <div key={a.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => onToggle?.(a.id)}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: meta.color }} />
              <span className="font-mono text-[11px] font-bold tracking-[0.03em]" style={{ color: meta.color }}>{a.threat_class}</span>
              <span
                className="font-mono text-[8px] font-bold px-1 py-0.5 uppercase rounded-sm"
                style={{ color: sev.color, border: `1px solid ${sev.color}55` }}
              >
                {sev.label}
              </span>
              <span className="font-mono text-[11px] text-foreground ml-auto">{Math.round(a.confidence * 100)}%</span>
            </button>
            {open && (
              <div className="px-3 pb-3 border-t border-border pt-2 space-y-1">
                <Line label="flow" value={a.flow_id} />
                <Line label="src" value={`${a.src_ip}:${a.src_port}`} />
                <Line label="dst" value={`${a.dst_ip}:${a.dst_port}`} />
                <Line label="proto" value={a.protocol} />
                <Line label="time" value={formatTime(a.timestamp)} />
                <div className="mt-2">
                  <div className="font-mono text-[8px] text-muted-foreground uppercase tracking-[0.05em] mb-1">Evidence</div>
                  <pre className="font-mono text-[9px] text-info bg-background border border-border rounded-md p-2 overflow-x-auto">
{JSON.stringify(a.evidence, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Line({ label, value }) {
  return (
    <div className="flex justify-between font-mono text-[10px]">
      <span className="text-muted-foreground uppercase tracking-[0.05em]">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}