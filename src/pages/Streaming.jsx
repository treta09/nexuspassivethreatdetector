import PageShell, { Panel } from "@/components/layout/PageShell";

// Streaming Engine stage — sliding window (5s window, 1s step) live stream.
export default function Streaming() {
  return (
    <PageShell title="Streaming Engine" subtitle="Sliding window: 5s window, 1s step. packet → flow → window → features → detector → alert">
      <Panel title="Live Window Stream">
        <div className="grid md:grid-cols-3 gap-2 mb-3">
          <Mini label="Window" value="5s" />
          <Mini label="Step" value="1s" />
          <Mini label="Current" value="—" color="hsl(var(--muted-foreground))" />
        </div>
        <div className="h-[320px] overflow-y-auto scrollbar-thin bg-background border border-border rounded-md p-2 font-mono text-[11px] space-y-0.5">
          <div className="py-10 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.05em]">Awaiting live window stream from backend</div>
        </div>
      </Panel>
    </PageShell>
  );
}

// Mini stat tile for the window config row.
function Mini({ label, value, color = "hsl(var(--foreground))" }) {
  return (
    <div className="bg-secondary border border-border rounded-md p-2">
      <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.05em]">{label}</div>
      <div className="font-mono text-[16px] font-bold" style={{ color }}>{value}</div>
    </div>
  );
}