"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { healthCounts } from "@/lib/mock-data/projects";
import { useDrillDownStore } from "@/lib/store/drilldown-store";

const COLORS = {
  green: "#1BA572",
  amber: "#F2B33D",
  red: "#E5484D",
};

export function DonutHealth() {
  const c = healthCounts();
  const open = useDrillDownStore((s) => s.open);
  const data = [
    { name: "Vert", value: c.green, key: "green" as const },
    { name: "Ambre", value: c.amber, key: "amber" as const },
    { name: "Rouge", value: c.red, key: "red" as const },
  ];

  const greenPct = Math.round((c.green / c.total) * 100);

  return (
    <div className="relative w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={88}
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
            onClick={(_, idx) => open({ type: "health-segment", status: data[idx].key })}
            cursor="pointer"
          >
            {data.map((entry) => (
              <Cell
                key={entry.key}
                fill={COLORS[entry.key]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #D7D8DB",
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-3xl font-display font-bold tabular">{greenPct}%</div>
        <div className="text-[11px] text-muted-foreground uppercase tracking-widest">
          en santé
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">{c.total} projets · cliquez un segment</div>
      </div>
    </div>
  );
}
