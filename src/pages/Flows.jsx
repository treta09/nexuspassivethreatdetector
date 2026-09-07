import PageShell, { Panel } from "@/components/layout/PageShell";
import { useThreatStream } from "@/hooks/useThreatStream";

export default function Flows() {
  const { alerts, status } = useThreatStream();
  return (
    <PageShell title="Flow assembly" subtitle="Incremental 5-tuple aggregation from the one-way stream; source and destination are never contacted">
      <Panel title="Observed flow records">
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
                <th className="text-right px-2 py-1.5">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {alerts.slice(0, 30).map((flow) => <tr key={flow.id} className="border-b border-border/60 font-mono text-[10px]">
                <td className="px-2 py-1.5 text-info">{flow.flow_id}</td>
                <td className="px-2 py-1.5">{flow.src_ip}</td>
                <td className="px-2 py-1.5">{flow.dst_ip}</td>
                <td className="px-2 py-1.5">{flow.protocol}</td>
                <td className="px-2 py-1.5 text-right">{flow.packet_count?.toLocaleString?.() || "—"}</td>
                <td className="px-2 py-1.5 text-right">{flow.byte_count?.toLocaleString?.() || "—"}</td>
                <td className="px-2 py-1.5 text-right">{Math.round((flow.confidence || 0) * 100)}%</td>
              </tr>)}
              {!alerts.length && <tr><td colSpan={7} className="px-2 py-10 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.05em]">{status === "live" ? "No flow records in the current window" : "Connect a read-only capture source to receive flow records"}</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
    </PageShell>
  );
}