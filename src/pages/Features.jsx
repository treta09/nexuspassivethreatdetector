import PageShell, { Panel } from "@/components/layout/PageShell";

// Feature Extraction stage — flow/behaviour/DNS feature groups + window table.
export default function Features() {
  return (
    <PageShell title="Feature Extraction" subtitle="Flows → features: generic (pkt/s, bytes/s) + behavioural (unique ports/hosts, entropy, connection rate)">
      <div className="grid md:grid-cols-3 gap-3 mb-3">
        <Panel title="Flow Features"><List items={["packet_count", "byte_count", "duration", "packets_per_second", "bytes_per_second"]} /></Panel>
        <Panel title="Behaviour Features"><List items={["unique_destination_ports", "unique_destination_hosts", "unique_source_ips", "connection_rate", "source_entropy", "destination_entropy"]} /></Panel>
        <Panel title="DNS Features"><List items={["domain_length", "entropy", "digit_ratio", "unique_character_ratio", "subdomain_length", "query_frequency", "record_type"]} /></Panel>
      </div>
      <Panel title="Feature Windows · PCAP → flows → feature CSV">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full font-mono text-[11px]">
            <thead>
              <tr className="text-[9px] tracking-[0.05em] text-muted-foreground uppercase border-b border-border">
                <th className="text-left px-2 py-1.5">Window</th>
                <th className="text-right px-2 py-1.5">pkt/s</th>
                <th className="text-right px-2 py-1.5">bytes/s</th>
                <th className="text-right px-2 py-1.5">unique ports</th>
                <th className="text-right px-2 py-1.5">unique hosts</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-2 py-10 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.05em]">
                  Awaiting feature windows from backend
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </PageShell>
  );
}

// Feature name list — info-colored with a muted chevron.
function List({ items }) {
  return (
    <div className="space-y-1">
      {items.map((i) => (
        <div key={i} className="font-mono text-[10px] text-info flex items-center gap-1.5">
          <span className="text-border">›</span>{i}
        </div>
      ))}
    </div>
  );
}