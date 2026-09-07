import { formatUptime } from "@/lib/format";

// Desktop top status bar. Renders global telemetry stats; each stat can carry
// a status accent color (info/warning/success). Hidden on mobile.
function Stat({ label, value, unit, accent }) {
  return (
    <div className="flex flex-col px-4 border-l border-border">
      <span className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">{label}</span>
      <span className="font-mono text-[13px] font-bold tracking-[0.05em]" style={{ color: accent || "hsl(var(--foreground))" }}>
        {value}<span className="text-[10px] text-muted-foreground ml-0.5 font-normal">{unit}</span>
      </span>
    </div>
  );
}

export default function TopStatusBar({ telemetry }) {
  return (
    <header className="hidden md:flex h-[56px] shrink-0 items-stretch bg-card border-b border-border">
      <div className="flex items-center gap-2 px-4">
        <span className="w-2 h-2 rounded-full bg-success pulse-dot" />
        <span className="font-mono text-[11px] tracking-[0.1em] text-success uppercase font-bold">System Online</span>
      </div>
      <div className="flex-1" />
      <Stat label="Uptime" value={formatUptime(telemetry.uptimeSec)} />
      <Stat label="Throughput" value={telemetry.flowsPerSec.toLocaleString()} unit="F/s" accent="hsl(var(--info))" />
      <Stat label="Latency p95" value={telemetry.latencyP95} unit="ms" accent="hsl(var(--warning))" />
      <Stat label="PCAP Target" value={telemetry.pcapTarget} accent="hsl(var(--success))" />
    </header>
  );
}