import { THREAT_CATALOG } from "@/lib/threatData";

export default function Classifier() {
  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <header className="mb-4">
        <h1 className="font-heading text-[18px] md:text-[22px] font-bold tracking-tight">Inference and confidence</h1>
        <p className="font-body text-[12px] text-muted-foreground mt-1">A calibrated classifier combines window features with deterministic detector evidence</p>
      </header>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-3">
          <Panel title="Model contract">
            <div className="space-y-2 font-mono text-[11px]">
              <Metric label="Input" value="5 s flow windows · 1 s step" />
              <Metric label="Inference" value="Random Forest + detector rules" />
              <Metric label="Output" value="class · severity · confidence · evidence" />
              <Metric label="Constraint" value="No payload decryption or active probing" />
            </div>
          </Panel>
          <Panel title="Validation protocol">
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Train", "70% synthetic + lab flows"],
                ["Validation", "15% time-separated flows"],
                ["Test", "15% held-out scenarios"],
                ["Leakage guard", "split by capture session"],
              ].map(([label, value]) => <Metric key={label} label={label} value={value} />)}
            </div>
          </Panel>
        </div>
        <div className="space-y-3">
          <Panel title="Confusion matrix"><div className="py-6 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.05em]">Awaiting classifier metrics</div></Panel>
          <Panel title="Classes in the model">
            <div className="flex flex-wrap gap-2">
              {THREAT_CATALOG.map((item) => <span key={item.id} className="font-mono text-[9px] uppercase tracking-[0.05em] px-2 py-1 border border-border rounded-sm text-info">{item.id}</span>)}
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
}

function Panel({ title, children }) {
  return <section className="bg-card border border-border rounded-lg"><div className="px-3 py-2 border-b border-border font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">{title}</div><div className="p-3">{children}</div></section>;
}

function Metric({ label, value }) {
  return <div className="bg-secondary border border-border rounded-md p-2"><div className="text-[9px] text-muted-foreground uppercase tracking-[0.06em]">{label}</div><div className="text-foreground mt-1">{value}</div></div>;
}