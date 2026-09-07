import PageShell, { Panel } from "@/components/layout/PageShell";
import { ShieldCheck, ArrowDownToLine, EyeOff } from "lucide-react";
import { PIPELINE_STAGES } from "@/lib/threatData";

// Ingest contract: traffic enters the enclave once and is never queried or
// modified. The live counters are supplied by the backend when configured.
export default function Ingestion() {
  return (
    <PageShell title="Read-only traffic ingest" subtitle="One-way observation from mirrored IP traffic into the analytics enclave">
      <div className="grid md:grid-cols-3 gap-3 mb-3">
        <Info icon={ShieldCheck} label="Isolation" value="No return path" detail="The detector cannot probe, handshake, or block." />
        <Info icon={ArrowDownToLine} label="Accepted sources" value="PCAP · NetFlow · IPFIX · sFlow" detail="Packet and flow records are consumed incrementally." />
        <Info icon={EyeOff} label="Payload policy" value="Metadata only" detail="TLS and QUIC payloads are never decrypted." />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Panel title="Ingest boundary">
          <div className="space-y-2">
            {PIPELINE_STAGES.map((stage, index) => (
              <div key={stage.id} className="flex items-center gap-3 border-b border-border/60 pb-2 last:border-0 last:pb-0">
                <span className="font-mono text-[10px] text-info">0{index + 1}</span>
                <div className="min-w-0">
                  <div className="font-mono text-[11px] text-foreground">{stage.label}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{stage.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Observed record contract">
          <div className="grid grid-cols-2 gap-2">
            {[
              "timestamp", "src/dst IP", "src/dst port", "protocol", "packet length", "TCP flags", "flow bytes", "direction",
            ].map((field) => <div key={field} className="bg-secondary border border-border rounded-md p-2 font-mono text-[10px] text-info">{field}</div>)}
          </div>
          <p className="font-mono text-[10px] text-muted-foreground mt-3">No command, probe, or mitigation action is emitted on this path.</p>
        </Panel>
      </div>
    </PageShell>
  );
}

function Info({ icon: Icon, label, value, detail }) {
  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <Icon className="w-4 h-4 text-success mb-3" aria-hidden="true" />
      <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.08em]">{label}</div>
      <div className="font-mono text-[13px] text-foreground mt-1">{value}</div>
      <div className="font-body text-[11px] text-muted-foreground mt-1">{detail}</div>
    </div>
  );
}