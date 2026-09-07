import { useEffect, useState } from "react";
import PageShell, { Panel } from "@/components/layout/PageShell";
import { useThreatStream } from "@/hooks/useThreatStream";
import { api } from "@/api/client";
import { DATA_COLORS } from "@/lib/threatData";

// System Benchmarks — throughput saturation, detection latency/performance,
// and live resource usage. All values come from the backend (getBenchmarks);
// nothing is invented. Status colors use the centralized data palette.
export default function Benchmarks() {
  const { telemetry, status } = useThreatStream();
  const [live, setLive] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.functions.invoke("getBenchmarks", {});
        if (mounted && res.data?.configured && res.data.benchmarks) setLive(res.data.benchmarks);
      } catch {
        /* keep empty — backend not configured */
      }
    })();
    return () => { mounted = false; };
  }, []);

  const throughput = live?.throughput;
  const detection = live?.detection;
  const perf = live?.performance;

  return (
    <PageShell title="System Benchmarks" subtitle="Throughput · detection latency · detection performance · resource usage — measured, not invented">
      <div className="mb-3 font-mono text-[10px] tracking-[0.05em] uppercase">
        <span style={{ color: status === "live" ? "hsl(var(--success))" : "hsl(var(--warning))" }}>
          {status === "live" ? "● LIVE" : "● AWAITING BACKEND"}
        </span>
        <span className="text-muted-foreground"> · data source: {live ? "FastAPI backend" : "no backend connected"}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <Panel title="Throughput Saturation">
          {throughput?.length ? (
            <div className="space-y-2">
              {throughput.map((t) => (
                <div key={t.rate} className="bg-secondary border border-border rounded-md p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[12px] text-foreground">{t.rate}</span>
                    <span className="font-mono text-[10px] font-bold" style={{ color: t.color }}>{t.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Bar label="CPU" value={t.cpu} color={DATA_COLORS.info} />
                    <Bar label="RAM" value={t.ram} color={DATA_COLORS.success} />
                  </div>
                </div>
              ))}
            </div>
          ) : <Empty text="Awaiting throughput saturation data from backend" />}
        </Panel>
        <div className="space-y-3">
          <Panel title="Detection Latency">
            {detection?.length ? (
              <div className="space-y-2">
                {detection.map((d) => (
                  <div key={d.metric} className="flex justify-between border-b border-border/60 pb-1">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.05em]">{d.metric}</span>
                    <span className="font-mono text-[14px] font-bold" style={{ color: d.color }}>{d.value}</span>
                  </div>
                ))}
              </div>
            ) : <Empty text="Awaiting detection latency data from backend" />}
          </Panel>
          <Panel title="Detection Performance">
            {perf?.length ? (
              <div className="grid grid-cols-2 gap-2">
                {perf.map((p) => (
                  <div key={p.metric} className="bg-secondary border border-border rounded-md p-2">
                    <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.05em]">{p.metric}</div>
                    <div className="font-mono text-[18px] font-bold" style={{ color: p.color }}>{p.value}</div>
                  </div>
                ))}
              </div>
            ) : <Empty text="Awaiting detection performance data from backend" />}
          </Panel>
        </div>
      </div>
      <Panel title="Live Resource Usage">
        <div className="grid grid-cols-2 gap-3">
          <Bar label="CPU" value={telemetry.cpu} color={DATA_COLORS.info} big />
          <Bar label="RAM" value={telemetry.ram} color={DATA_COLORS.success} big />
        </div>
      </Panel>
    </PageShell>
  );
}

function Empty({ text }) {
  return <div className="py-10 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.05em]">{text}</div>;
}

// Resource bar — label + percentage + filled track. `color` is a data-viz hue.
function Bar({ label, value, color, big }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.05em]">{label}</span>
        <span className="font-mono text-[10px] font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className={`bg-secondary rounded-full overflow-hidden ${big ? "h-3" : "h-1.5"}`}>
        <div className="h-full transition-all duration-500 rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}