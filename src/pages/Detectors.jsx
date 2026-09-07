import PageShell, { Panel } from "@/components/layout/PageShell";

// Rule Detectors stage — statistical/rule-based detection (no ML). Three
// detectors, each with its file, logic, and a status color from the data palette.
const DETECTORS = [
  { name: "SYN Flood", file: "ddos_detector.py", logic: "SYN rate > threshold AND SYN/ACK ratio > threshold → SYN_FLOOD", color: "#EF4444" },
  { name: "Port Scan", file: "scan_detector.py", logic: "one source → many ports → short window → PORT_SCAN", color: "#F59E0B" },
  { name: "Exfiltration", file: "exfil_detector.py", logic: "large outbound + abnormal out/in ratio → EXFILTRATION", color: "#EC4899" },
];

export default function Detectors() {
  return (
    <PageShell title="Rule Detectors" subtitle="Statistical / rule-based detection — no ML. Three detectors, three PCAPs, three verdicts.">
      <div className="grid md:grid-cols-3 gap-3 mb-3">
        {DETECTORS.map((d) => (
          <Panel key={d.name} title={d.name}>
            <div className="font-mono text-[10px] text-muted-foreground mb-2">{d.file}</div>
            <div className="font-mono text-[11px]" style={{ color: d.color }}>{d.logic}</div>
          </Panel>
        ))}
      </div>
      <Panel title="Detection Results">
        <div className="py-10 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.05em]">Awaiting detector verdicts from backend</div>
      </Panel>
    </PageShell>
  );
}