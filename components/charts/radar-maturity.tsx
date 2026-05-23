"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { maturityRadarData } from "@/lib/mock-data/maturity";

export function RadarMaturity({ height = 320 }: { height?: number }) {
  const data = maturityRadarData();

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="78%">
          <PolarGrid stroke="#D7D8DB" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 11, fill: "#052A62" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 4]}
            tickCount={5}
            tick={{ fontSize: 10, fill: "#86B4DD" }}
          />
          <Radar
            name="Cible Niveau 4"
            dataKey="target"
            stroke="#86B4DD"
            fill="#86B4DD"
            fillOpacity={0.15}
            strokeDasharray="4 3"
          />
          <Radar
            name="État actuel"
            dataKey="actual"
            stroke="#0089D0"
            fill="#0089D0"
            fillOpacity={0.45}
            strokeWidth={2}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #D7D8DB",
              fontSize: 12,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
