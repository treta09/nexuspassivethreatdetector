import { DATA_COLORS } from "@/lib/threatData";

// A labeled meter bar. `color` is a data-viz hue (passed from the parent based
// on thresholds) so health states stay semantically colored.
function Meter({ label, value, unit, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">{label}</span>
        <span className="font-mono text-[11px] font-bold" style={{ color }}>{value}<span className="text-[9px] text-muted-foreground ml-0.5 font-normal">{unit}</span></span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full transition-all duration-500 rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

// System telemetry panel — CPU/RAM meters + pipeline latency breakdown.
// Thresholds pick danger/warning/success hues from the data palette.
export default function SystemTelemetry({ telemetry }) {
  return (
    <div className="bg-card border border-border rounded-lg p-3 space-y-3">
      <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">System Telemetry</span>
      <Meter label="CPU" value={telemetry.cpu} unit="%" color={telemetry.cpu > 80 ? DATA_COLORS.danger : telemetry.cpu > 60 ? DATA_COLORS.warning : DATA_COLORS.success} />
      <Meter label="RAM" value={telemetry.ram} unit="%" color={telemetry.ram > 80 ? DATA_COLORS.danger : DATA_COLORS.info} />
      <div>
        <div className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase mb-1">Pipeline Latency</div>
        <div className="grid grid-cols-3 gap-2">
          <LatencyCell label="p50" value={telemetry.latencyP50} colorClass="text-success" />
          <LatencyCell label="p95" value={telemetry.latencyP95} colorClass="text-warning" />
          <LatencyCell label="max" value={telemetry.latencyMax} colorClass="text-destructive" />
        </div>
      </div>
    </div>
  );
}

function LatencyCell({ label, value, colorClass }) {
  return (
    <div className="bg-secondary border border-border rounded-md p-1.5 text-center">
      <div className="font-mono text-[8px] text-muted-foreground uppercase">{label}</div>
      <div className={`font-mono text-[13px] font-bold ${colorClass}`}>{value}<span className="text-[8px] text-muted-foreground">ms</span></div>
    </div>
  );
}