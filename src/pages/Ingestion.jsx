import PageShell, { Panel } from "@/components/layout/PageShell";

// Traffic Ingestion stage — shows pipeline output & ingest counters. Empty
// until the backend streams live packets.
export default function Ingestion() {
  return (
    <PageShell title="Traffic Ingestion" subtitle="PCAP → Scapy → Packet → basic fields (timestamp, IPs, proto, ports, length, flags)">
      <div className="grid md:grid-cols-2 gap-3">
        <Panel title="Pipeline Output">
          <Empty text="Awaiting live packet stream from backend" />
        </Panel>
        <Panel title="Processed Counts">
          <Empty text="Awaiting ingest counters from backend" />
        </Panel>
      </div>
    </PageShell>
  );
}

function Empty({ text }) {
  return <div className="py-10 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.05em]">{text}</div>;
}