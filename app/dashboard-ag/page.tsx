"use client";

import Link from "next/link";
import {
  Activity,
  AlertOctagon,
  ArrowRight,
  Brain,
  Building2,
  Crown,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/page-header";
import { AlertBanner } from "@/components/alerts/alert-banner";
import { KpiCard } from "@/components/kpi/kpi-card";
import { DonutHealth } from "@/components/charts/donut-health";
import { TreemapPortfolio } from "@/components/charts/treemap-portfolio";
import { HeatmapHoshin } from "@/components/charts/heatmap-hoshin";
import { HoshinProgress } from "@/components/charts/hoshin-progress";
import { BarBailleurs } from "@/components/charts/bar-bailleurs";
import { TimelineMilestones } from "@/components/charts/timeline-milestones";
import { KPI_AG } from "@/lib/mock-data/kpis";
import { ESCALADES } from "@/lib/mock-data/escalades";
import { ENTITIES } from "@/lib/mock-data/entities";
import { PROJECTS } from "@/lib/mock-data/projects";
import { cn, formatNumber, healthBg, relativeTimeFR } from "@/lib/utils";
import { useDrillDownStore } from "@/lib/store/drilldown-store";

export default function DashboardAGPage() {
  const openDrill = useDrillDownStore((s) => s.open);
  const escalades = ESCALADES.filter((e) => e.urgency === "haute" && e.status !== "clos").slice(
    0,
    3
  );
  const totalBudget = ENTITIES.reduce((s, e) => s + e.budget, 0);
  const totalConsumed = ENTITIES.reduce((s, e) => s + e.budgetConsumed, 0);

  return (
    <>
      <PageHeader
        eyebrow="Dashboard exécutif · §12"
        title="Bonjour Dr. Sall — voici votre semaine en un coup d'œil"
        subtitle="Vue temps réel du portefeuille IPD. 12 projets actifs · 8 entités · 8 bailleurs partenaires."
        decisionMoment="Sur quoi dois-je arbitrer aujourd'hui ?"
        actions={
          <Button variant="ghost" size="sm" className="bg-white/15 text-white hover:bg-white/25" asChild>
            <Link href="/askia">
              <Sparkles className="h-4 w-4" /> Synthèse ASKIA
            </Link>
          </Button>
        }
      />

      {/* Bandeau alertes critiques */}
      <AlertBanner />

      {/* Ligne KPI principaux §12.3 */}
      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_AG.map((kpi, i) => (
          <KpiCard key={kpi.code} kpi={kpi} emphasized={i === 0} />
        ))}
      </section>

      {/* Santé portefeuille + Treemap */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-brand-pasteur" /> Santé portefeuille
              </CardTitle>
              <Badge variant="soft">12 projets actifs</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <DonutHealth />
            <Separator className="my-3" />
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center">
                <div className="h-2 w-full rounded bg-feedback-success mb-1" />
                <div className="font-bold text-feedback-success">5</div>
                <div className="text-[10px] text-muted-foreground">Vert</div>
              </div>
              <div className="text-center">
                <div className="h-2 w-full rounded bg-feedback-warning mb-1" />
                <div className="font-bold text-feedback-warning">5</div>
                <div className="text-[10px] text-muted-foreground">Ambre</div>
              </div>
              <div className="text-center">
                <div className="h-2 w-full rounded bg-feedback-danger mb-1" />
                <div className="font-bold text-feedback-danger">2</div>
                <div className="text-[10px] text-muted-foreground">Rouge</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-brand-pasteur" /> Portefeuille par entité (taille =
                budget)
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">
                Survol pour détail
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <TreemapPortfolio />
            <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded bg-feedback-success" /> En santé
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded bg-feedback-warning" /> Vigilance
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded bg-feedback-danger" /> Action urgente
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Alignement Hoshin */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Crown className="h-4 w-4 text-brand-pasteur" /> Alignement Hoshin — Avancement par
              pilier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HoshinProgress />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-pasteur" /> Matrice Entités × Piliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HeatmapHoshin />
          </CardContent>
        </Card>
      </section>

      {/* Situation financière bailleurs */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Situation financière par bailleur</CardTitle>
              <div className="text-xs text-muted-foreground">
                Engagé / Consommé / Disponible — YTD
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BarBailleurs />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vue institutionnelle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Budget total engagé
              </div>
              <div className="text-2xl font-display font-bold tabular">
                {formatNumber(totalBudget)} M FCFA
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Consommé YTD
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-display font-bold tabular text-brand-pasteur">
                  {formatNumber(totalConsumed)} M FCFA
                </div>
                <div className="text-xs text-muted-foreground">
                  ({Math.round((totalConsumed / totalBudget) * 100)} %)
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <div className="text-xs font-semibold mb-2">Top 3 absorption</div>
              <div className="space-y-1.5">
                {ENTITIES.sort(
                  (a, b) => b.budgetConsumed / b.budget - a.budgetConsumed / a.budget
                )
                  .slice(0, 3)
                  .map((e) => (
                    <div key={e.id} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2">
                        <span className={cn("h-1.5 w-1.5 rounded-full", healthBg[e.health])} />
                        {e.shortName}
                      </span>
                      <span className="font-mono tabular">
                        {Math.round((e.budgetConsumed / e.budget) * 100)} %
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Escalades + Jalons */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertOctagon className="h-4 w-4 text-feedback-danger" /> Escalades · décisions
                requises
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/escalades">
                  Pipeline complet <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {escalades.map((e) => (
              <button
                key={e.id}
                onClick={() => openDrill({ type: "escalade", escaladeId: e.id })}
                className="block w-full text-left rounded-lg border bg-card hover:border-feedback-danger/40 hover:shadow-md p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pasteur"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md bg-feedback-danger/10 text-feedback-danger flex items-center justify-center shrink-0">
                    <AlertOctagon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-muted-foreground">{e.code}</span>
                      <Badge variant="destructive" className="text-[10px] py-0">
                        Urgence Haute
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {relativeTimeFR(e.submittedAt)}
                      </span>
                    </div>
                    <div className="text-sm font-semibold leading-tight mb-1">{e.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{e.description}</div>
                    <div className="mt-2 text-[10px] text-feedback-danger font-semibold">
                      Décision attendue avant :{" "}
                      {new Date(e.decisionExpectedBy).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4 text-brand-pasteur" /> Synthèse ASKIA hebdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-gradient-to-br from-brand-pasteur/5 to-brand-clair/10 border border-brand-pasteur/20 p-3 text-xs space-y-2">
              <p>
                <strong>3 sujets prioritaires</strong> cette semaine : (1) réallocation budgétaire
                MADIBA-2, (2) recrutement ingénieurs Vaccinopôle, (3) audit CEPI 12-14 juin.
              </p>
              <p>
                Le service <strong>Achats</strong> est cité dans <strong>41 %</strong> des
                bloqueurs des 30 derniers jours.
              </p>
              <p>
                Sur le portefeuille, <strong>2 projets en Rouge</strong> (MADIBA-2, Plateforme
                rougeole) nécessitent une attention immédiate.
              </p>
            </div>
            <Button variant="link" size="sm" className="px-0 mt-2 h-auto text-xs" asChild>
              <Link href="/askia">
                Discuter avec ASKIA <ArrowRight className="h-3 w-3 ml-0.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Jalons */}
      <section className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Jalons majeurs portefeuille (90 jours)</CardTitle>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-feedback-success" /> Atteints
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-feedback-warning" /> À risque
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-feedback-danger" /> Retard
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-brand-pasteur" /> À venir
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TimelineMilestones />
          </CardContent>
        </Card>
      </section>

      <div className="mt-6 text-[10px] text-muted-foreground text-center">
        Dernière mise à jour des données : il y a 14 minutes · Sources : MS Project, Zoho, ERP,
        Grant Office, Portail · Plateforme NextGen IPD v0.1
      </div>
    </>
  );
}
