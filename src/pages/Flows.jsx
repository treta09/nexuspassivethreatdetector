import PageShell, { Panel } from "@/components/layout/PageShell";

// Flow Engine stage — packets → flows via the 5-tuple. Table is empty until
// the backend emits flow records.
export default function Flows() {
  return (
    <PageShell title="Flow Engine" subtitle="Packets → flows via the 5-tuple (src_ip, dst_ip, src_port, dst_port, protocol)">
      <Panel title="Flows · data/processed/flows.csv">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full font-mono text-[11px]">
            <thead>
              <tr className="text-[9px] tracking-[0.05em] text-muted-foreground uppercase border-b border-border">
                <th className="text-left px-2 py-1.5">Flow</th>
                <th className="text-left px-2 py-1.5">Source</th>
                <th className="text-left px-2 py-1.5">Destination</th>
                <th className="text-left px-2 py-1.5">Protocol</th>
                <th className="text-right px-2 py-1.5">Packets</th>
                <th className="text-right px-2 py-1.5">Bytes</th>
                <th className="text-right px-2 py-1.5">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-2 py-10 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.05em]">
                  Awaiting flow records from backend
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </PageShell>
  );
}