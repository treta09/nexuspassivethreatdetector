import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell, { Panel } from "@/components/layout/PageShell";
import { useThreatStream } from "@/hooks/useThreatStream";
import AlertInspector from "@/components/dashboard/AlertInspector";
import AlertConsole from "@/components/dashboard/AlertConsole";

// Alert Feed page. The selected alert is bound to ?alertId= via useSearchParams
// (back button deselects; tapping the selected row toggles it off). The page
// scroll container is pull-to-refresh enabled via PageShell's onRefresh.
const FILTERS = ["ALL", "CRITICAL", "HIGH", "MEDIUM"];

export default function Alerts() {
  const { alerts, refresh } = useThreatStream();
  const [filter, setFilter] = useState("ALL");
  const [searchParams, setSearchParams] = useSearchParams();
  const alertId = searchParams.get("alertId");
  const selected = alerts.find((a) => a.id === alertId) || null;

  const handleSelect = (a) => {
    if (a) setSearchParams({ alertId: a.id });
    else setSearchParams({}, { replace: true });
  };

  const filtered = filter === "ALL" ? alerts : alerts.filter((a) => a.severity === filter);

  return (
    <PageShell title="Alert Feed" subtitle="Standardized alert schema exposed via FastAPI → dashboard" onRefresh={refresh}>
      {/* Severity filters */}
      <div className="flex gap-2 mb-3">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-mono text-[10px] tracking-[0.05em] uppercase px-3 py-1.5 border rounded-md transition-colors ${
              filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="h-[600px]">
          <AlertConsole alerts={filtered} selectedId={selected?.id} onSelect={handleSelect} />
        </div>
        <AlertInspector alert={selected} />
      </div>
      <div className="mt-3">
        <Panel title="Alert Schema (JSON)">
          <pre className="font-mono text-[10px] text-info overflow-x-auto scrollbar-thin leading-relaxed">
{`{
  "timestamp": "...",
  "flow_id": "F1023",
  "threat_class": "PORT_SCAN",
  "severity": "HIGH",
  "confidence": 0.91,
  "evidence": {
    "unique_ports": 147,
    "connection_rate": 192
  }
}`}
          </pre>
        </Panel>
      </div>
    </PageShell>
  );
}