import PageShell, { Panel } from "@/components/layout/PageShell";
import { PASSIVE_FEATURE_GROUPS } from "@/lib/threatData";

export default function Features() {
  return (
    <PageShell title="Passive feature extraction" subtitle="Features are derived from flow records and protocol metadata inside bounded streaming windows">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mb-3">
        {PASSIVE_FEATURE_GROUPS.map((group) => (
          <Panel key={group.name} title={group.name}>
            <div className="font-mono text-[11px] text-info leading-relaxed">{group.fields}</div>
          </Panel>
        ))}
      </div>
      <Panel title="Feature window contract · PCAP / flow export → vector">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full font-mono text-[11px]">
            <thead>
              <tr className="text-[9px] tracking-[0.05em] text-muted-foreground uppercase border-b border-border">
                <th className="text-left px-2 py-1.5">Window</th>
                <th className="text-right px-2 py-1.5">pkt/s</th>
                <th className="text-right px-2 py-1.5">bytes/s</th>
                <th className="text-right px-2 py-1.5">entropy</th>
                <th className="text-right px-2 py-1.5">fan-out</th>
                <th className="text-right px-2 py-1.5">timing jitter</th>
                <th className="text-right px-2 py-1.5">out/in bytes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-2 py-10 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.05em]">
                  Live vectors appear when a read-only capture source is connected
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </PageShell>
  );
}
