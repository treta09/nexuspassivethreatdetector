import PageShell, { Panel } from "@/components/layout/PageShell";
import { THREAT_CATALOG } from "@/lib/threatData";

export default function Detectors() {
  return (
    <PageShell title="Threat detectors" subtitle="Streaming statistical signals and model features derived from passive flow metadata">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mb-3">
        {THREAT_CATALOG.filter((item) => item.id !== "BENIGN").map((detector) => (
          <Panel key={detector.id} title={detector.label}>
            <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-info mb-2">{detector.family}</div>
            <div className="font-mono text-[11px] text-foreground leading-relaxed">{detector.evidence}</div>
            <div className="mt-3 flex items-center gap-2 font-mono text-[9px] text-success uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-success" /> windowed detector ready
            </div>
          </Panel>
        ))}
      </div>
      <Panel title="Detector boundary">
        <div className="grid md:grid-cols-3 gap-3 font-mono text-[10px]">
          <Rule label="DDoS and spoofing" value="rate + source entropy + amplification" />
          <Rule label="Beaconing" value="periodicity + inter-arrival variance" />
          <Rule label="Recon and exfil" value="fan-out + byte asymmetry" />
        </div>
      </Panel>
    </PageShell>
  );
}

function Rule({ label, value }) {
  return <div className="border-l-2 border-info pl-2"><div className="text-muted-foreground uppercase tracking-[0.06em]">{label}</div><div className="text-foreground mt-1">{value}</div></div>;
}