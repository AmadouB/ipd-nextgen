"use client";

import { HOSHIN_PILLARS } from "@/lib/mock-data/hoshin";
import { PROJECTS } from "@/lib/mock-data/projects";
import { ENTITIES } from "@/lib/mock-data/entities";
import { cn } from "@/lib/utils";
import { useDrillDownStore } from "@/lib/store/drilldown-store";

export function HeatmapHoshin() {
  const open = useDrillDownStore((s) => s.open);
  // Pour chaque entité × pilier, calculer la moyenne progress des projets concernés
  const cells = ENTITIES.map((e) => {
    return HOSHIN_PILLARS.map((p) => {
      const projets = PROJECTS.filter(
        (proj) => proj.entityId === e.id && proj.pillarId === p.id
      );
      if (projets.length === 0) return { value: null, count: 0 };
      const avg = projets.reduce((s, x) => s + x.progress, 0) / projets.length;
      return { value: Math.round(avg), count: projets.length };
    });
  });

  function bgFor(value: number | null): string {
    if (value === null) return "bg-muted/30";
    if (value >= 70) return "bg-feedback-success/80 text-white";
    if (value >= 50) return "bg-feedback-warning/80 text-white";
    if (value >= 30) return "bg-brand-clair/70 text-brand-nuit";
    return "bg-feedback-danger/70 text-white";
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left font-semibold text-muted-foreground py-2 px-2">
              Entité \\ Pilier Hoshin
            </th>
            {HOSHIN_PILLARS.map((p) => (
              <th
                key={p.id}
                className="text-center font-semibold text-muted-foreground py-2 px-1"
              >
                <div className="text-[10px] uppercase tracking-wider mb-1">{p.code}</div>
                <div className="text-[10px] normal-case max-w-[80px] mx-auto font-normal">
                  {p.title}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ENTITIES.map((e, i) => (
            <tr key={e.id}>
              <td className="py-1 px-2 font-medium text-foreground text-xs whitespace-nowrap">
                {e.shortName}
              </td>
              {cells[i].map((c, j) => (
                <td key={j} className="p-1">
                  <button
                    onClick={() =>
                      open({
                        type: "entity-pillar",
                        entityId: e.id,
                        pillarId: HOSHIN_PILLARS[j].id,
                      })
                    }
                    className={cn(
                      "w-full h-9 rounded-md flex flex-col items-center justify-center font-mono text-xs font-bold transition-all hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pasteur",
                      bgFor(c.value)
                    )}
                    title={c.value === null ? "Aucun projet" : `${c.value}% (${c.count} projet${c.count > 1 ? "s" : ""})`}
                  >
                    {c.value === null ? (
                      <span className="text-muted-foreground/50">—</span>
                    ) : (
                      <span>{c.value}%</span>
                    )}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground">
        <span>Légende :</span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-feedback-danger/70" /> &lt; 30%
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-brand-clair/70" /> 30–49%
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-feedback-warning/80" /> 50–69%
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-feedback-success/80" /> ≥ 70%
        </span>
      </div>
    </div>
  );
}
