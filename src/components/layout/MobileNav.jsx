import { NavLink } from "react-router-dom";
import { BellRing, Radio, GitBranch, Gauge } from "lucide-react";

// Mobile bottom navigation (fixed). Active tab uses the primary brand color.
const NAV = [
  { to: "/alerts", label: "Alerts", icon: BellRing },
  { to: "/", label: "Live Stream", icon: Radio },
  { to: "/flows", label: "Flow Metrics", icon: GitBranch },
  { to: "/benchmarks", label: "Benchmarks", icon: Gauge },
];

export default function MobileNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-[56px]">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 font-mono text-[9px] tracking-[0.05em] uppercase transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}