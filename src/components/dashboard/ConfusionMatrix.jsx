// Confusion matrix rendered from backend-provided data (labels, matrix, f1).
// Shows an empty state until the classifier publishes metrics. No hardcoded
// numbers. Diagonal = correct (success), off-diagonal = misclass (danger);
// cell intensity scales with the count.
export default function ConfusionMatrix({ labels = [], matrix = [], f1 }) {
  const hasData = Array.isArray(matrix) && matrix.length > 0 && labels.length === matrix.length;
  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">Confusion Matrix</span>
        <span className="font-mono text-[9px] text-success">{hasData ? `F1 ${f1 ?? "—"}` : "—"}</span>
      </div>
      {hasData ? (
        <>
          <div className="grid gap-px" style={{ gridTemplateColumns: `auto repeat(${labels.length}, 1fr)` }}>
            <div />
            {labels.map((l) => (
              <div key={l} className="font-mono text-[7px] text-muted-foreground text-center uppercase tracking-[0.05em] pb-0.5">{l}</div>
            ))}
            {matrix.map((row, ri) => (
              <Fragment key={ri} label={labels[ri]} row={row} diag={ri} max={Math.max(...matrix.flat()) || 1} />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-3 font-mono text-[8px] text-muted-foreground uppercase tracking-[0.05em]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-success rounded-sm" />Correct</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-destructive rounded-sm" />Misclass</span>
          </div>
        </>
      ) : (
        <div className="py-6 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.05em]">
          Awaiting classifier metrics
        </div>
      )}
    </div>
  );
}

function Fragment({ label, row, diag, max }) {
  return (
    <>
      <div className="font-mono text-[7px] text-muted-foreground uppercase tracking-[0.05em] flex items-center pr-1">{label}</div>
      {row.map((v, ci) => {
        const isDiag = ci === diag;
        const intensity = v / max;
        const color = isDiag ? "hsl(var(--success))" : "hsl(var(--destructive))";
        const alpha = Math.round(intensity * 200 + 20).toString(16).padStart(2, "0");
        return (
          <div
            key={ci}
            className="aspect-square flex items-center justify-center font-mono text-[8px]"
            style={{ background: `${color}${alpha}`, color: intensity > 0.4 ? "hsl(var(--background))" : "hsl(var(--muted-foreground))" }}
          >
            {v > 0 ? v : ""}
          </div>
        );
      })}
    </>
  );
}