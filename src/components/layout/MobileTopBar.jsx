import { useState } from "react";
import { Radar, Settings } from "lucide-react";
import AccountDeleteSheet from "@/components/layout/AccountDeleteSheet";

// Mobile-only top bar (sticky). Mirrors the desktop status bar at a glance:
// brand, live status, threat count, and a settings action that opens the
// account self-service sheet.
export default function MobileTopBar({ telemetry, threatCount }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <>
      <div
        className="md:hidden sticky top-0 z-40 bg-card border-b border-border"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex items-center justify-between h-[48px] px-3">
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-primary" />
            <span className="font-heading text-[13px] tracking-tight text-foreground font-bold">Threat Monitor</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success pulse-dot" />
              <span className="font-mono text-[9px] text-success uppercase">Live</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-background border border-destructive/40 rounded-md">
              <span className="font-mono text-[10px] font-bold text-destructive">{threatCount}</span>
              <span className="font-mono text-[8px] text-muted-foreground uppercase">threats</span>
            </div>
            <button
              type="button"
              aria-label="Settings"
              onClick={() => setSheetOpen(true)}
              className="flex items-center justify-center w-8 h-8 -mr-1 text-muted-foreground hover:text-foreground active:text-primary"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <AccountDeleteSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}