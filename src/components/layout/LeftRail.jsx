import { NavLink } from "react-router-dom";
import {
  Activity, Network, GitBranch, Sliders, ShieldAlert,
  BrainCircuit, Radio, BellRing, Gauge, Radar, Workflow,
} from "lucide-react";

// Desktop navigation rail. Hidden on mobile (mobile uses MobileNav instead).
// Active route is highlighted with the primary brand color; the live-pipeline
// indicator uses the success token (green = healthy).
const NAV = [
  { to: "/", label: "Command Center", icon: Radar },
  { to: "/ingestion", label: "Traffic Ingestion", icon: Network },
  { to: "/flows", label: "Flow Engine", icon: GitBranch },
  { to: "/features", label: "Feature Extraction", icon: Sliders },
  { to: "/detectors", label: "Rule Detectors", icon: ShieldAlert },
  { to: "/classifier", label: "ML Classifier", icon: BrainCircuit },
  { to: "/streaming", label: "Streaming Engine", icon: Radio },
  { to: "/alerts", label: "Alert Feed", icon: BellRing },
  { to: "/benchmarks", label: "System Benchmarks", icon: Gauge },
  { to: "/architecture", label: "Architecture", icon: Workflow },
];

/** @param {any} props */
export default function LeftRail(props) {
  /** @type {{ telemetry: { pcapTarget: string, windowId: string | number } }} */
  const typedProps = props;
  const { telemetry } = typedProps;
  return (
    <aside className="hidden md:flex flex-col w-[220px] shrink-0 bg-card border-r border-border">
      {/* Brand */}
      <div className="h-[56px] flex items-center gap-2 px-4 border-b border-border">
        <Activity className="w-5 h-5 text-success" />
        <div className="leading-none">
          <div className="font-heading text-[13px] font-bold tracking-tight text-foreground">Nexus Passive Detector</div>
          <div className="font-mono text-[9px] text-muted-foreground tracking-[0.1em] uppercase">v1.0 · one-way analytics</div>
        </div>
      </div>

      {/* Live pipeline status */}
      <div className="px-3 py-3 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-success pulse-dot" />
          <span className="font-mono text-[10px] tracking-[0.1em] text-success uppercase">Pipeline Live</span>
        </div>
        <div className="font-mono text-[9px] text-muted-foreground">PCAP: {telemetry.pcapTarget}</div>
        <div className="font-mono text-[9px] text-muted-foreground">WIN #{String(telemetry.windowId).padStart(5, "0")}</div>
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 font-mono text-[11px] tracking-[0.05em] uppercase border-l-2 transition-colors ${
                isActive
                  ? "bg-background text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-background"
              }`
            }
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-border font-mono text-[9px] text-muted-foreground tracking-[0.05em] uppercase">
        Unidirectional · Passive
      </div>
    </aside>
  );
}