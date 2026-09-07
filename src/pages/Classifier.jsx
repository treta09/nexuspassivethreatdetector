import PageShell, { Panel } from "@/components/layout/PageShell";
import ConfusionMatrix from "@/components/dashboard/ConfusionMatrix";

// ML Classifier stage — Random Forest performance metrics, data split, and the
// confusion matrix (rendered from backend metrics when available).
export default function Classifier() {
  return (
    <PageShell title="ML Classifier" subtitle="Random Forest · features → label (BENIGN, SYN_FLOOD, PORT_SCAN, EXFILTRATION, DNS_TUNNEL, DGA)">
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-3">
          <Panel title="Performance Metrics">
            <div className="py-10 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.05em]">Awaiting model metrics from backend</div>
          </Panel>
          <Panel title="Data Split">
            <div className="py-10 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.05em]">Awaiting training split from backend</div>
          </Panel>
        </div>
        <ConfusionMatrix />
      </div>
    </PageShell>
  );
}