"use client";

import { ArrowDownRight, ArrowUpRight, Info, ChevronRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { Card } from "@/components/ui/card";
import { cn, healthBg, healthBorder, healthLabel, healthText } from "@/lib/utils";
import type { KpiVedette } from "@/lib/mock-data/kpis";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDrillDownStore } from "@/lib/store/drilldown-store";

interface Props {
  kpi: KpiVedette;
  emphasized?: boolean;
}

export function KpiCard({ kpi, emphasized }: Props) {
  const data = kpi.sparkline.map((v, i) => ({ x: i, v }));
  const isUp = kpi.delta >= 0;
  const deltaPositive =
    (kpi.health === "green" && isUp) || (kpi.health === "red" && !isUp);
  const openDrillDown = useDrillDownStore((s) => s.open);

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => openDrillDown({ type: "kpi", code: kpi.code })}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDrillDown({ type: "kpi", code: kpi.code });
        }
      }}
      className={cn(
        "relative overflow-hidden p-5 flex flex-col gap-3 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pasteur",
        emphasized && "shadow-glow-brand bg-gradient-kpi text-white border-0"
      )}
    >
      {/* Chevron drill-down */}
      <ChevronRight
        className={cn(
          "absolute right-2 top-2 h-3.5 w-3.5 opacity-40 group-hover:opacity-100",
          emphasized ? "text-white" : "text-muted-foreground"
        )}
      />
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <div
            className={cn(
              "text-[11px] uppercase tracking-widest font-semibold",
              emphasized ? "text-white/70" : "text-muted-foreground"
            )}
          >
            {kpi.code}
          </div>
          <h3
            className={cn(
              "text-sm font-semibold leading-tight font-display",
              emphasized && "text-white"
            )}
          >
            {kpi.label}
          </h3>
        </div>
        <UITooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors relative z-10",
                emphasized && "text-white/70 hover:text-white"
              )}
              aria-label="Informations KPI"
            >
              <Info className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-1 text-[11px]">
              <div>Vert : {kpi.thresholdGreen}</div>
              <div>Ambre : {kpi.thresholdAmber}</div>
              <div>Rouge : {kpi.thresholdRed}</div>
              <div className="opacity-70 pt-1">Source : {kpi.source}</div>
            </div>
          </TooltipContent>
        </UITooltip>
      </div>

      <div className="flex items-end gap-3">
        <div
          className={cn(
            "font-display font-bold text-4xl tabular",
            emphasized ? "text-white text-shadow-glow" : ""
          )}
        >
          {kpi.value.toLocaleString("fr-FR", {
            minimumFractionDigits: kpi.format === "decimal" ? 2 : 0,
            maximumFractionDigits: kpi.format === "decimal" ? 2 : 0,
          })}
          <span className="text-xl font-semibold ml-0.5 opacity-80">{kpi.unit}</span>
        </div>
        <div
          className={cn(
            "flex items-center gap-0.5 pb-1.5 text-xs font-semibold rounded px-1.5 py-0.5",
            deltaPositive
              ? emphasized
                ? "bg-white/20 text-white"
                : "bg-feedback-success/10 text-feedback-success"
              : emphasized
              ? "bg-white/20 text-white"
              : "bg-feedback-danger/10 text-feedback-danger"
          )}
        >
          {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(kpi.delta)}
          {kpi.unit === "%" ? " pts" : ""}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold border",
            emphasized
              ? "bg-white/20 text-white border-white/30"
              : cn("border-current", healthText[kpi.health])
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", healthBg[kpi.health])} />
          {healthLabel[kpi.health]}
        </span>
        <span
          className={cn(
            "text-[10px]",
            emphasized ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {kpi.freshness}
        </span>
      </div>

      {/* Sparkline */}
      <div className="h-12 -mx-2 -mb-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`spark-${kpi.code}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={emphasized ? "#FFFFFF" : "#0089D0"}
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor={emphasized ? "#FFFFFF" : "#0089D0"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={emphasized ? "#FFFFFF" : "#0089D0"}
              strokeWidth={2}
              fill={`url(#spark-${kpi.code})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
