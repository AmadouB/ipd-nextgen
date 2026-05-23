"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { RadarMaturity } from "@/components/charts/radar-maturity";
import { MATURITY, maturityAverage } from "@/lib/mock-data/maturity";
import { cn, healthBg, healthText } from "@/lib/utils";
import { useDrillDownStore } from "@/lib/store/drilldown-store";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  YAxis,
} from "recharts";

export default function DashboardMaturitePage() {
  const avg = maturityAverage();
  const openDrill = useDrillDownStore((s) => s.open);
  const trendData = MATURITY[0].history.map((_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (5 - i));
    return {
      month: month.toLocaleString("fr-FR", { month: "short" }),
      ...Object.fromEntries(MATURITY.map((d) => [d.code, d.history[i]])),
    };
  });

  return (
    <>
      <PageHeader
        eyebrow="Maturité PMO · §15"
        title="Tableau de bord Maturité du Système PMO"
        subtitle="Mesurer la maturité du système institutionnel de gestion de projet et piloter sa progression vers le Niveau 4."
        decisionMoment="Où porter l'effort pour atteindre le Niveau 4 ?"
      />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Gauge className="h-4 w-4 text-brand-pasteur" /> Radar de maturité — 6 dimensions
              </CardTitle>
              <Badge variant="soft">Cible Niveau 4 / 4</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <RadarMaturity height={380} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Note globale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="font-display text-6xl font-bold text-brand-pasteur tabular text-shadow-glow">
                {avg.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">/ 4,0</div>
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-feedback-success/10 px-2 py-1 text-[11px] text-feedback-success font-semibold">
                <TrendingUp className="h-3 w-3" />
                +0,2 vs mois dernier
              </div>
            </div>
            <div className="border-t pt-4 space-y-2 text-xs">
              <div className="font-semibold">Interprétation</div>
              <p className="text-muted-foreground leading-relaxed">
                Le système PMO de l'IPD se situe entre le <strong>Niveau 3</strong> (Défini) et le{" "}
                <strong>Niveau 4</strong> (Mature). Progression continue sur les 6 derniers mois.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Dimension la plus faible : <strong>F — Numérisation & data</strong> (2,5/4) —
                point d'attention principal.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Détail par dimension */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MATURITY.map((d) => (
          <Card
            key={d.id}
            role="button"
            tabIndex={0}
            onClick={() => openDrill({ type: "maturity-dimension", dimensionId: d.id })}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openDrill({ type: "maturity-dimension", dimensionId: d.id });
              }
            }}
            className="cursor-pointer hover:shadow-md hover:border-brand-pasteur/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pasteur"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="h-7 w-7 rounded-md bg-brand-pasteur/10 text-brand-pasteur flex items-center justify-center font-display font-bold text-sm">
                    {d.code}
                  </span>
                  {d.title}
                </CardTitle>
                <div className="text-right">
                  <div className="font-display font-bold text-2xl tabular text-brand-pasteur">
                    {d.score.toFixed(1)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">/ {d.target.toFixed(1)}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {d.kpis.map((k, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className={cn("h-2 w-2 rounded-full shrink-0", healthBg[k.health])} />
                    <span className="flex-1 min-w-0 truncate" title={k.label}>
                      {k.label}
                    </span>
                    <div className="text-right shrink-0">
                      <div className={cn("font-mono font-bold tabular", healthText[k.health])}>
                        {k.actual}
                      </div>
                      <div className="text-[9px] text-muted-foreground">{k.target}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={d.history.map((v, i) => ({ i, v }))}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id={`mat-${d.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0089D0" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#0089D0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="#0089D0"
                      strokeWidth={1.5}
                      fill={`url(#mat-${d.id})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>6 mois</span>
                <span>Aujourd'hui</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Historique progression */}
      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progression mois par mois — 6 dimensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    {["A", "B", "C", "D", "E", "F"].map((code, i) => (
                      <linearGradient key={code} id={`grad-${code}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={["#0089D0", "#86B4DD", "#1BA572", "#F2B33D", "#E5484D", "#052A62"][i]} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={["#0089D0", "#86B4DD", "#1BA572", "#F2B33D", "#E5484D", "#052A62"][i]} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D7D8DB" />
                  <YAxis domain={[0, 4]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  {["A", "B", "C", "D", "E", "F"].map((code, i) => (
                    <Area
                      key={code}
                      type="monotone"
                      dataKey={code}
                      name={`${code} — ${MATURITY[i].title}`}
                      stroke={["#0089D0", "#86B4DD", "#1BA572", "#F2B33D", "#E5484D", "#052A62"][i]}
                      strokeWidth={2}
                      fill={`url(#grad-${code})`}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
