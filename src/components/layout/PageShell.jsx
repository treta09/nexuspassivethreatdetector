import LeftRail from "@/components/layout/LeftRail";
import TopStatusBar from "@/components/layout/TopStatusBar";
import MobileTopBar from "@/components/layout/MobileTopBar";
import MobileNav from "@/components/layout/MobileNav";
import PullToRefresh from "@/components/PullToRefresh";
import { useThreatStream } from "@/hooks/useThreatStream";

// Shared shell wrapping the focused pipeline-stage pages. Provides the left
// rail, top bars, and scroll area. Pass `onRefresh` to enable native
// pull-to-refresh on the scroll container (used by data feeds like Alerts).
/** @param {{ title?: any, subtitle?: any, children?: any, onRefresh?: any }} props */
export default function PageShell(props) {
  const { title, subtitle, children, onRefresh = null } = props;
  const { telemetry, alerts } = useThreatStream();
  const threatCount = alerts.filter((a) => a.threat_class !== "BENIGN").length;

  const body = (
    <>
      <header className="mb-4">
        <h1 className="font-heading text-[18px] md:text-[22px] font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="font-body text-[12px] text-muted-foreground mt-1">{subtitle}</p>}
      </header>
      {children}
    </>
  );

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground">
      <LeftRail telemetry={telemetry} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopStatusBar telemetry={telemetry} />
        <MobileTopBar telemetry={telemetry} threatCount={threatCount} />
        {onRefresh ? (
          <PullToRefresh onRefresh={onRefresh} className="flex-1 scrollbar-thin p-4 md:p-6 pb-[64px] md:pb-6">
            {body}
          </PullToRefresh>
        ) : (
          <main className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6 pb-[64px] md:pb-6">
            {body}
          </main>
        )}
      </div>
      <MobileNav />
    </div>
  );
}

// Bordered panel with an optional title row. The standard card surface used
// across pipeline-stage pages.
/** @param {{ title?: any, children?: any, right?: any }} props */
export function Panel(props) {
  const { title, children, right = null } = props;
  return (
    <div className="bg-card border border-border rounded-lg">
      {title && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">{title}</span>
          {right}
        </div>
      )}
      <div className="p-3">{children}</div>
    </div>
  );
}

export function CodeLine({ children, color = "hsl(var(--info))" }) {
  return <div className="font-mono text-[11px] leading-relaxed" style={{ color }}>{children}</div>;
}