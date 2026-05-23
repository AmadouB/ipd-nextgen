"use client";

import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { PROJECTS } from "@/lib/mock-data/projects";
import { ENTITIES } from "@/lib/mock-data/entities";
import { useDrillDownStore } from "@/lib/store/drilldown-store";

const COLORS = {
  green: "#1BA572",
  amber: "#F2B33D",
  red: "#E5484D",
};

export function TreemapPortfolio() {
  const open = useDrillDownStore((s) => s.open);
  const data = ENTITIES.map((e) => {
    const projets = PROJECTS.filter((p) => p.entityId === e.id);
    return {
      name: e.shortName,
      children: projets.map((p) => ({
        name: `${p.code}`,
        projectId: p.id,
        fullName: p.name,
        size: p.budget,
        health: p.health,
        color: COLORS[p.health],
      })),
    };
  });

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#FFFFFF"
          fill="#0089D0"
          onClick={(item: any) => {
            if (item?.projectId) open({ type: "project", projectId: item.projectId });
          }}
          // @ts-ignore custom content
          content={<CustomCell />}
        >
          <Tooltip
            // @ts-ignore custom payload
            content={({ payload }) => {
              if (!payload?.[0]) return null;
              const p = payload[0].payload;
              return (
                <div className="rounded-md bg-background border shadow-md p-2 text-xs">
                  <div className="font-semibold">{p.fullName ?? p.name}</div>
                  {p.size && (
                    <div className="text-muted-foreground">
                      Budget : {p.size.toLocaleString("fr-FR")} M FCFA
                    </div>
                  )}
                </div>
              );
            }}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}

function CustomCell(props: any) {
  const { x, y, width, height, name, color, depth } = props;
  if (depth === 0 || width < 24 || height < 18) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color ?? "#86B4DD"}
          stroke="#FFFFFF"
          strokeWidth={2}
        />
      </g>
    );
  }
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color ?? "#86B4DD"}
        stroke="#FFFFFF"
        strokeWidth={2}
      />
      <text
        x={x + 6}
        y={y + 16}
        fill="#FFFFFF"
        fontSize={10}
        fontWeight="700"
        style={{ pointerEvents: "none" }}
      >
        {name}
      </text>
    </g>
  );
}
