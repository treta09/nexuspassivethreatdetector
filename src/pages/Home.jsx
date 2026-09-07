import { useSearchParams } from "react-router-dom";
import { useThreatStream } from "@/hooks/useThreatStream";
import LeftRail from "@/components/layout/LeftRail";
import TopStatusBar from "@/components/layout/TopStatusBar";
import MobileTopBar from "@/components/layout/MobileTopBar";
import MobileNav from "@/components/layout/MobileNav";
import ThreatRadarStream from "@/components/dashboard/ThreatRadarStream";
import FlowThroughputGraph from "@/components/dashboard/FlowThroughputGraph";
import AlertConsole from "@/components/dashboard/AlertConsole";
import AlertInspector from "@/components/dashboard/AlertInspector";
import SystemTelemetry from "@/components/dashboard/SystemTelemetry";
import ConfusionMatrix from "@/components/dashboard/ConfusionMatrix";
import ThreatDistribution from "@/components/dashboard/ThreatDistribution";
import MobileAlertFeed from "@/components/dashboard/MobileAlertFeed";
import PullToRefresh from "@/components/PullToRefresh";

// Command Center — the main dashboard. The selected alert (desktop inspector
// + mobile feed expand) is bound to ?alertId= via useSearchParams so the back
// button deselects instead of leaving the app. The mobile feed is wrapped in
// PullToRefresh for manual polling.
export default function Home() {
  const { alerts, throughput, telemetry, threatCounts, status, lastError, refresh } = useThreatStream();
  const [searchParams, setSearchParams] = useSearchParams();
  const alertId = searchParams.get("alertId");
  const selected = alerts.find((a) => a.id === alertId) || null;

  // Selecting pushes ?alertId (so Back deselects); toggling off replaces the
  // entry so Back doesn't re-select.
  const handleSelect = (a) => {
    if (a) setSearchParams({ alertId: a.id });
    else setSearchParams({}, { replace: true });
  };
  const handleToggle = (id) => {
    if (id === alertId) setSearchParams({}, { replace: true });
    else setSearchParams({ alertId: id });
  };

  const threatCount = alerts.filter((a) => a.threat_class !== "BENIGN").length;
  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL").length;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground">
      <LeftRail telemetry={telemetry} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopStatusBar telemetry={telemetry} />
        <MobileTopBar telemetry={telemetry} threatCount={threatCount} />

        {/* Desktop command center */}
        <main className="hidden md:flex flex-1 min-h-0 overflow-hidden">
          {status !== "live" && <StatusBanner status={status} error={lastError} />}
          {/* Left stage: radar + console */}
          <div className="flex-[2] flex flex-col min-w-0 border-r border-border">
            <div className="p-2 space-y-2 overflow-y-auto scrollbar-thin">
              <SummaryStrip telemetry={telemetry} threatCount={threatCount} criticalCount={criticalCount} />
              <ThreatRadarStream alerts={alerts} />
              <FlowThroughputGraph data={throughput} />
            </div>
            <div className="flex-1 min-h-0 px-2 pb-2">
              <AlertConsole alerts={alerts} selectedId={selected?.id} onSelect={handleSelect} />
            </div>
          </div>

          {/* Right stage: inspector + telemetry */}
          <div className="flex-[1] flex flex-col min-w-0 overflow-y-auto scrollbar-thin">
            <div className="p-2 space-y-2">
              <AlertInspector alert={selected} />
              <SystemTelemetry telemetry={telemetry} />
              <ConfusionMatrix />
              <ThreatDistribution counts={threatCounts} />
            </div>
          </div>
        </main>

        {/* Mobile command center */}
        <PullToRefresh onRefresh={refresh} className="md:hidden flex-1 scrollbar-thin p-3 pb-[64px] space-y-3">
          {status !== "live" && <StatusBanner status={status} error={lastError} />}
          <MobileSummary telemetry={telemetry} threatCount={threatCount} criticalCount={criticalCount} />
          <ThreatRadarStream alerts={alerts} height={220} />
          <FlowThroughputGraph data={throughput} />
          <ThreatDistribution counts={threatCounts} />
          <MobileSectionTitle>Latest Alerts</MobileSectionTitle>
          <MobileAlertFeed alerts={alerts} openId={alertId} onToggle={handleToggle} />
        </PullToRefresh>
      </div>

      <MobileNav />
    </div>
  );
}

// Desktop summary strip — four key stats with status accents.
function SummaryStrip({ telemetry, threatCount, criticalCount }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      <Stat label="Flows/sec" value={telemetry.flowsPerSec.toLocaleString()} accent="hsl(var(--info))" />
      <Stat label="Threats" value={threatCount} accent="hsl(var(--warning))" />
      <Stat label="Critical" value={criticalCount} accent="hsl(var(--destructive))" />
      <Stat label="Window" value={`#${telemetry.windowId}`} accent="hsl(var(--success))" />
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2">
      <div className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">{label}</div>
      <div className="font-mono text-[20px] font-bold" style={{ color: accent }}>{value}</div>
    </div>
  );
}

// Mobile summary — condensed to two stats.
function MobileSummary({ telemetry, threatCount, criticalCount }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Stat label="Flows/sec" value={telemetry.flowsPerSec.toLocaleString()} accent="hsl(var(--info))" />
      <Stat label="Critical Threats" value={criticalCount} accent="hsl(var(--destructive))" />
    </div>
  );
}

// Backend connection banner — shown whenever the stream isn't live.
function StatusBanner({ status, error }) {
  const map = {
    loading: { color: "hsl(var(--warning))", text: "CONNECTING TO DETECTION BACKEND…" },
    unconfigured: { color: "hsl(var(--warning))", text: "AWAITING BACKEND — SET FASTAPI_BASE_URL TO RECEIVE LIVE ALERTS" },
    error: { color: "hsl(var(--destructive))", text: `BACKEND ERROR${error ? " · " + error : ""} — NO DATA UNTIL THE PIPELINE RESPONDS` },
  };
  const m = map[status] || map.loading;
  return (
    <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-card border border-border rounded-lg" style={{ borderLeftColor: m.color, borderLeftWidth: 2 }}>
      <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: m.color }} />
      <span className="font-mono text-[10px] tracking-[0.1em] uppercase" style={{ color: m.color }}>{m.text}</span>
    </div>
  );
}

function MobileSectionTitle({ children }) {
  return <div className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase pt-1">{children}</div>;
}