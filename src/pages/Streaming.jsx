import PageShell, { Panel } from "@/components/layout/PageShell";
import { PIPELINE_STAGES } from "@/lib/threatData";

export default function Streaming() {
  return (
    <PageShell title="Streaming pipeline" subtitle="Bounded-latency processing of one-way traffic: packet or record → flow → window → alert">
      <Panel title="Window policy">
        <div className="grid md:grid-cols-4 gap-2 mb-3">
          <Mini label="Window" value="5s" />
          <Mini label="Step" value="1s" />
          <Mini label="State" value="Read-only" color="hsl(var(--success))" />
          <Mini label="Target" value="1,000 F/s" color="hsl(var(--info))" />
        </div>
        <div className="grid md:grid-cols-5 gap-2">
          {PIPELINE_STAGES.map((stage, index) => (
            <div key={stage.id} className="relative bg-secondary border border-border rounded-md p-2 min-h-[92px]">
              <div className="font-mono text-[9px] text-info">STAGE 0{index + 1}</div>
              <div className="font-mono text-[11px] text-foreground mt-2">{stage.label}</div>
              <div className="font-body text-[10px] text-muted-foreground mt-1">{stage.detail}</div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Latency and safety guarantees">
        <div className="grid md:grid-cols-3 gap-3 font-mono text-[10px]">
          <Mini label="Alert latency" value="≤ 6 s target" />
          <Mini label="Backpressure" value="drop oldest window" />
          <Mini label="Egress" value="zero commands" color="hsl(var(--success))" />
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