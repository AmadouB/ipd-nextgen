"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3-force";
import { DEP_NODES, DEP_LINKS, type DepNode } from "@/lib/mock-data/dependencies";

const GROUP_COLOR: Record<string, string> = {
  production: "#0089D0",
  recherche: "#1BA572",
  diagnostic: "#86B4DD",
  support: "#F2B33D",
};

const HEALTH_RING: Record<string, string> = {
  green: "#1BA572",
  amber: "#F2B33D",
  red: "#E5484D",
};

export function ForceDependencies({ height = 380 }: { height?: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<DepNode | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const width = svgRef.current.clientWidth || 720;
    const nodes = DEP_NODES.map((n) => ({ ...n }));
    const links = DEP_LINKS.map((l) => ({ ...l }));

    const sim = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3.forceLink(links).id((d: any) => d.id).distance(80).strength(0.7)
      )
      .force("charge", d3.forceManyBody().strength(-260))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => 8 + Math.sqrt(d.size) * 1.5));

    function tick() {
      if (!svgRef.current) return;
      // update DOM
      svgRef.current
        .querySelectorAll<SVGLineElement>("line.dep-link")
        .forEach((line, i) => {
          const l: any = links[i];
          line.setAttribute("x1", l.source.x);
          line.setAttribute("y1", l.source.y);
          line.setAttribute("x2", l.target.x);
          line.setAttribute("y2", l.target.y);
        });
      svgRef.current.querySelectorAll<SVGGElement>("g.dep-node").forEach((g, i) => {
        const n: any = nodes[i];
        g.setAttribute("transform", `translate(${n.x},${n.y})`);
      });
    }

    sim.on("tick", tick);
    return () => {
      sim.stop();
    };
  }, [height]);

  return (
    <div className="relative w-full" style={{ height }}>
      <svg ref={svgRef} className="w-full h-full">
        {/* Links */}
        {DEP_LINKS.map((l, i) => (
          <line
            key={i}
            className="dep-link"
            stroke={
              l.status === "retard"
                ? "#E5484D"
                : l.status === "bloqueur"
                ? "#F2B33D"
                : "#86B4DD"
            }
            strokeWidth={l.status === "retard" ? 2.5 : 1.5}
            strokeOpacity={0.6}
            strokeDasharray={l.type === "blocks" ? "4 3" : undefined}
          />
        ))}
        {/* Nodes */}
        {DEP_NODES.map((n) => {
          const radius = 12 + Math.sqrt(n.size) * 1.4;
          return (
            <g
              key={n.id}
              className="dep-node cursor-pointer"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
            >
              <circle
                r={radius + 3}
                fill="none"
                stroke={HEALTH_RING[n.health]}
                strokeWidth={3}
              />
              <circle r={radius} fill={GROUP_COLOR[n.group]} opacity={0.9} />
              <text
                textAnchor="middle"
                dy={radius + 14}
                fontSize={9}
                fontWeight={600}
                fill="currentColor"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute top-2 right-2 rounded-md bg-background/95 backdrop-blur border p-2 text-[10px] space-y-1">
        <div className="font-semibold text-muted-foreground uppercase tracking-widest mb-1">
          Groupes
        </div>
        {Object.entries(GROUP_COLOR).map(([k, c]) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c }} />
            <span className="capitalize">{k}</span>
          </div>
        ))}
      </div>

      {hover && (
        <div className="absolute bottom-2 left-2 rounded-md bg-background border shadow-md p-2 text-xs">
          <div className="font-semibold">{hover.label}</div>
          <div className="text-muted-foreground">
            Budget {hover.size.toLocaleString("fr-FR")} M FCFA · Santé{" "}
            <span style={{ color: HEALTH_RING[hover.health] }}>{hover.health}</span>
          </div>
        </div>
      )}
    </div>
  );
}
