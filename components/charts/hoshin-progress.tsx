"use client";

import * as Lucide from "lucide-react";
import { HOSHIN_PILLARS } from "@/lib/mock-data/hoshin";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useDrillDownStore } from "@/lib/store/drilldown-store";

export function HoshinProgress() {
  const open = useDrillDownStore((s) => s.open);
  return (
    <div className="space-y-3">
      {HOSHIN_PILLARS.map((p) => {
        const Icon =
          ((Lucide as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[
            p.icon
          ] || Lucide.Target;
        const onTrack = p.progress >= p.target * 0.95;
        return (
          <button
            key={p.id}
            onClick={() => open({ type: "pillar", pillarId: p.id })}
            className="block w-full text-left space-y-1.5 rounded-md p-2 -mx-2 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pasteur transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-7 w-7 rounded-md flex items-center justify-center text-white",
                  onTrack ? "bg-feedback-success" : "bg-brand-pasteur"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{p.title}</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {p.description}
                </div>
              </div>
              <div className="text-right font-mono tabular text-xs">
                <span className="font-bold">{p.progress}%</span>
                <span className="text-muted-foreground"> / {p.target}%</span>
              </div>
            </div>
            <div className="relative pl-9">
              <Progress
                value={p.progress}
                className="h-1.5"
                indicatorClassName={onTrack ? "bg-feedback-success" : "bg-brand-pasteur"}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-brand-nuit"
                style={{ left: `calc(${p.target}% * 0.93 + 36px)` }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
