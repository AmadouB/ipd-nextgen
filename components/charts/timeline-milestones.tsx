"use client";

import { MILESTONES } from "@/lib/mock-data/milestones";
import { PROJECTS } from "@/lib/mock-data/projects";
import { cn } from "@/lib/utils";
import { Flag, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useDrillDownStore } from "@/lib/store/drilldown-store";

const STATUS_STYLE = {
  atteint: {
    color: "bg-feedback-success text-white",
    border: "border-feedback-success",
    icon: CheckCircle2,
  },
  à_risque: {
    color: "bg-feedback-warning text-white animate-pulse-danger",
    border: "border-feedback-warning",
    icon: AlertTriangle,
  },
  en_retard: {
    color: "bg-feedback-danger text-white",
    border: "border-feedback-danger",
    icon: AlertTriangle,
  },
  à_venir: {
    color: "bg-brand-pasteur text-white",
    border: "border-brand-pasteur",
    icon: Flag,
  },
};

export function TimelineMilestones() {
  const open = useDrillDownStore((s) => s.open);
  const sorted = [...MILESTONES].sort((a, b) => a.daysFromNow - b.daysFromNow);
  // Timeline va de -15 à +90j
  const MIN = -15;
  const MAX = 90;
  const span = MAX - MIN;

  function posFor(days: number) {
    const clamped = Math.max(MIN, Math.min(MAX, days));
    return ((clamped - MIN) / span) * 100;
  }

  const todayPos = posFor(0);

  // Distribution sur plusieurs lignes pour éviter le chevauchement
  // 2 lignes au-dessus + 2 lignes en-dessous = 4 emplacements
  // Approche : pour chaque jalon, on cherche la première ligne libre (>= 7% d'écart)
  const SLOT_OFFSETS = [-66, -38, 22, 50]; // pixels depuis l'axe
  const MIN_GAP = 6; // % d'écart minimum
  const slotsLastPos: number[] = Array(SLOT_OFFSETS.length).fill(-Infinity);
  const placements: { milestone: typeof sorted[number]; top: number }[] = sorted.map((m) => {
    const x = posFor(m.daysFromNow);
    const freeSlot = slotsLastPos.findIndex((p) => x - p >= MIN_GAP);
    const idx = freeSlot >= 0 ? freeSlot : slotsLastPos.indexOf(Math.min(...slotsLastPos));
    slotsLastPos[idx] = x;
    return { milestone: m, top: SLOT_OFFSETS[idx] };
  });

  return (
    <div className="relative py-20">
      {/* Axis */}
      <div className="relative h-1 bg-border rounded-full">
        {/* Markers */}
        {[-15, 0, 15, 30, 45, 60, 75, 90].map((d) => (
          <div
            key={d}
            className="absolute -top-1.5 h-3 w-px bg-border"
            style={{ left: `${posFor(d)}%` }}
          >
            <div
              className={cn(
                "absolute top-4 text-[10px] -translate-x-1/2 whitespace-nowrap",
                d === 0 ? "text-brand-pasteur font-bold" : "text-muted-foreground"
              )}
            >
              {d === 0 ? "Aujourd'hui" : d > 0 ? `J+${d}` : `J${d}`}
            </div>
          </div>
        ))}

        {/* Today marker */}
        <div
          className="absolute -top-3 h-7 w-0.5 bg-brand-pasteur"
          style={{ left: `${todayPos}%` }}
        />

        {/* Milestones — placés en 4 rangs pour éviter le chevauchement */}
        {placements.map(({ milestone: m, top }) => {
          const style = STATUS_STYLE[m.status];
          const Icon = style.icon;
          const project = PROJECTS.find((p) => p.id === m.projectId);
          const x = posFor(m.daysFromNow);
          const above = top < 0;
          return (
            <button
              key={m.id}
              onClick={() => open({ type: "milestone", milestoneId: m.id })}
              className="absolute group cursor-pointer focus-visible:outline-none"
              style={{ left: `${x}%`, top: `${top}px` }}
            >
              {/* Connecting line to axis */}
              <div
                className="absolute left-0 -translate-x-px w-px bg-border"
                style={
                  above
                    ? { top: 18, height: -top - 18 }
                    : { bottom: 18, height: top - 18 }
                }
              />
              <div
                className={cn(
                  "relative -translate-x-1/2 flex items-center justify-center h-7 w-7 rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-110 group-hover:z-10",
                  style.color
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              {/* Tooltip on hover */}
              <div
                className={cn(
                  "invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute z-20 -translate-x-1/2 w-56 rounded-md bg-popover border shadow-lg p-2 pointer-events-none",
                  above ? "top-9" : "bottom-9"
                )}
              >
                <div className="text-[11px] font-semibold leading-tight">{m.title}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {project?.code} · J{m.daysFromNow > 0 ? "+" : ""}{m.daysFromNow}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
