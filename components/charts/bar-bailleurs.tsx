"use client";

import { BAILLEURS } from "@/lib/mock-data/bailleurs";
import { cn, healthBg } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import { useDrillDownStore } from "@/lib/store/drilldown-store";

export function BarBailleurs() {
  const maxTotal = Math.max(...BAILLEURS.map((b) => b.totalEngaged));
  const open = useDrillDownStore((s) => s.open);

  return (
    <div className="space-y-3">
      {BAILLEURS.map((b) => {
        const consumedPct = (b.totalConsumed / b.totalEngaged) * 100;
        const availablePct = (b.available / b.totalEngaged) * 100;
        const barWidth = (b.totalEngaged / maxTotal) * 100;
        return (
          <button
            key={b.id}
            onClick={() => open({ type: "bailleur", bailleurId: b.id })}
            className="group block w-full text-left rounded-md p-1.5 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pasteur transition-colors"
          >
            <div className="flex items-baseline justify-between mb-1 text-xs">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", healthBg[b.health])} />
                <span className="font-semibold">{b.shortName}</span>
                <span className="text-[10px] text-muted-foreground">({b.region})</span>
              </div>
              <div className="font-mono tabular text-muted-foreground">
                {formatNumber(b.totalEngaged)} M FCFA
              </div>
            </div>
            <div
              className="relative h-6 rounded-md overflow-hidden bg-muted/40"
              style={{ width: `${Math.max(barWidth, 25)}%` }}
            >
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-pasteur to-brand-clair"
                style={{ width: `${consumedPct}%` }}
              >
                {consumedPct > 25 && (
                  <span className="absolute inset-0 flex items-center px-2 text-[10px] font-semibold text-white">
                    Consommé {Math.round(consumedPct)}%
                  </span>
                )}
              </div>
              <div
                className="absolute inset-y-0 right-0 border-l border-white/40 bg-brand-pasteur/15"
                style={{ width: `${availablePct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
              <span>
                Absorption YTD : <span className="font-semibold text-foreground">{b.ytdAbsorption}%</span>
              </span>
              <span>
                Prochain reporting : {b.nextReportDueDays}j
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
