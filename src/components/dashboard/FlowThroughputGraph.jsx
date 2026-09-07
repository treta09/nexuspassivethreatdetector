import { Area, AreaChart, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import { DATA_COLORS } from "@/lib/threatData";

// Flow throughput sparkline. Uses the info (blue) data color for the line and
// a matching gradient fill. Tooltip styling tracks the card/border tokens.
export default function FlowThroughputGraph({ data }) {
  const chartData = data.map((v, i) => ({ i, v }));
  const line = DATA_COLORS.info;
  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">Flow Throughput</span>
        <span className="font-mono text-[12px] font-bold text-info">
          {data[data.length - 1]?.toLocaleString() || 0}<span className="text-[9px] text-muted-foreground ml-1 font-normal">F/s</span>
        </span>
      </div>
      <div style={{ height: 90 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="tp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={line} stopOpacity={0.5} />
                <stop offset="100%" stopColor={line} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={["dataMin - 200", "dataMax + 200"]} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem", fontFamily: "JetBrains Mono", fontSize: 10 }}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              itemStyle={{ color: line }}
              formatter={(v) => [v.toLocaleString() + " F/s", ""]}
              labelFormatter={() => ""}
            />
            <Area type="monotone" dataKey="v" stroke={line} strokeWidth={1.5} fill="url(#tp)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}