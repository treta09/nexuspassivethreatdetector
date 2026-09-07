import { useEffect, useRef } from "react";
import { THREAT_META } from "@/lib/threatData";

// Live threat radar (canvas). Renders ONLY real alert blips emitted by the
// backend — no cosmetic waveforms or fake sweeps. Blips scroll left and fade;
// an empty grid is shown until real alerts arrive. Grid lines use the border
// token color so the chart tracks the theme.
export default function ThreatRadarStream({ alerts, height = 350 }) {
  const canvasRef = useRef(null);
  const alertsRef = useRef(alerts);
  const blippedRef = useRef(new Set());
  const blipsRef = useRef([]);
  alertsRef.current = alerts;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const dpr = window.devicePixelRatio || 1;
    // Border token resolved to a usable stroke color for the grid.
    const gridColor = "hsl(var(--border))";

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) { raf = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, w, h);

      // Grid backdrop (chart axes — not data).
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = gridColor;
      ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

      // Spawn blips for real alerts not yet blipped.
      const recent = alertsRef.current || [];
      recent.slice(0, 5).forEach((a) => {
        if (a.id != null && !blippedRef.current.has(a.id)) {
          blippedRef.current.add(a.id);
          blipsRef.current.push({
            x: w + 10,
            y: h / 2 + (Math.random() - 0.5) * (h * 0.5),
            color: THREAT_META[a.threat_class]?.color || "hsl(var(--success))",
            life: 1,
          });
        }
      });
      if (blippedRef.current.size > 200) blippedRef.current = new Set(recent.map((a) => a.id));

      // Move + draw real alert blips.
      const blips = blipsRef.current;
      for (let i = blips.length - 1; i >= 0; i--) {
        const b = blips[i];
        b.x -= 1.6;
        b.life -= 0.004;
        if (b.x < -20 || b.life <= 0) { blips.splice(i, 1); continue; }
        const r = 4 + (1 - b.life) * 6;
        ctx.globalAlpha = b.life;
        ctx.fillStyle = b.color;
        ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = b.life * 0.4;
        ctx.beginPath(); ctx.arc(b.x, b.y, r + 6, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  const empty = !alerts || alerts.length === 0;

  return (
    <div className="relative bg-card border border-border rounded-lg overflow-hidden" style={{ height }}>
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2 z-10">
        <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">Live Threat Radar · Sliding Window 5s</span>
        {empty ? (
          <span className="font-mono text-[9px] text-warning uppercase tracking-[0.1em]">Awaiting</span>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success pulse-dot" />
            <span className="font-mono text-[9px] text-success uppercase tracking-[0.1em]">Streaming</span>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
      {empty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">Awaiting live alert stream</span>
        </div>
      )}
    </div>
  );
}