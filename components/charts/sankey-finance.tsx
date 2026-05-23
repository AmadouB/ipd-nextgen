"use client";

import { Sankey, ResponsiveContainer, Tooltip, Rectangle } from "recharts";
import { BAILLEURS } from "@/lib/mock-data/bailleurs";
import { PROJECTS } from "@/lib/mock-data/projects";

export function SankeyFinance({ height = 360 }: { height?: number }) {
  // Construction nodes: bailleurs + projets
  const bailleurNodes = BAILLEURS.map((b) => ({ name: b.shortName }));
  const projectNodes = PROJECTS.slice(0, 8).map((p) => ({ name: p.code }));
  const nodes = [...bailleurNodes, ...projectNodes];

  const links: { source: number; target: number; value: number }[] = [];
  PROJECTS.slice(0, 8).forEach((p, pi) => {
    const targetIdx = bailleurNodes.length + pi;
    p.bailleurIds.forEach((bid) => {
      const srcIdx = BAILLEURS.findIndex((b) => b.id === bid);
      if (srcIdx >= 0) {
        const value = Math.round(p.budget / p.bailleurIds.length);
        links.push({ source: srcIdx, target: targetIdx, value });
      }
    });
  });

  const data = { nodes, links };

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          nodePadding={20}
          margin={{ top: 8, right: 100, bottom: 8, left: 80 }}
          link={{ stroke: "#86B4DD", strokeOpacity: 0.5 }}
          node={<SankeyNode />}
        >
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #D7D8DB",
              fontSize: 12,
            }}
          />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
}

function SankeyNode(props: any) {
  const { x, y, width, height, index, payload } = props;
  const isBailleur = index < BAILLEURS.length;
  return (
    <g>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={isBailleur ? "#052A62" : "#0089D0"}
      />
      <text
        x={isBailleur ? x - 6 : x + width + 6}
        y={y + height / 2}
        dy="0.35em"
        textAnchor={isBailleur ? "end" : "start"}
        fontSize={10}
        fontWeight={600}
        fill="currentColor"
      >
        {payload.name}
      </text>
    </g>
  );
}
