"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  Network,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/kpi/kpi-card";
import { ForceDependencies } from "@/components/charts/force-dependencies";
import { KPI_CABINET } from "@/lib/mock-data/kpis";
import { ENTITIES } from "@/lib/mock-data/entities";
import { PROJECTS } from "@/lib/mock-data/projects";
import {
  ESCALADES,
  ESCALADE_STATUS_COLORS,
  ESCALADE_STATUS_LABELS,
  type EscaladeStatus,
} from "@/lib/mock-data/escalades";
import { PATTERNS } from "@/lib/mock-data/patterns";
import { BAILLEURS } from "@/lib/mock-data/bailleurs";
import { cn, healthBg, relativeTimeFR } from "@/lib/utils";
import { useDrillDownStore } from "@/lib/store/drilldown-store";

const KANBAN_COLUMNS: EscaladeStatus[] = [
  "nouveau",
  "qualifie",
  "preparation_ag",
  "decide",
  "clos",
];

export default function DashboardCabinetPage() {
  const openDrill = useDrillDownStore((s) => s.open);
  return (
    <>
      <PageHeader
        eyebrow="Coordination · §13"
        title="Cockpit Cabinet & PMO Stratégique"
        subtitle="Piloter la coordination inter-entités, anticiper les bloqueurs, préparer les arbitrages."
        decisionMoment="Quelles escalades préparer pour la réunion ?"
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_CABINET.map((kpi, i) => (
          <KpiCard key={kpi.code} kpi={kpi} emphasized={i === 0} />
        ))}
      </section>

      {/* Statut croisé Entités */}
      <section className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Statut croisé Entité × Indicateurs</CardTitle>
              <Badge variant="outline" className="text-[10px]">
                8 entités IPD
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-widest text-muted-foreground border-b">
                  <th className="py-2 pr-2">Entité</th>
                  <th className="py-2 px-2">Santé</th>
                  <th className="py-2 px-2">Projets</th>
                  <th className="py-2 px-2 text-right">Budget engagé</th>
                  <th className="py-2 px-2 text-right">Consommé</th>
                  <th className="py-2 px-2 text-right">Risques Élevés</th>
                  <th className="py-2 pl-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ENTITIES.map((e) => {
                  const projets = PROJECTS.filter((p) => p.entityId === e.id);
                  const risksHigh = projets.reduce((s, p) => s + p.risksHighCount, 0);
                  // Trouver le 1er projet pour drill-down de l'entité
                  const firstProject = projets[0];
                  return (
                    <tr
                      key={e.id}
                      onClick={() =>
                        firstProject &&
                        openDrill({ type: "project", projectId: firstProject.id })
                      }
                      className="hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 pr-2">
                        <div className="font-semibold text-sm">{e.shortName}</div>
                        <div className="text-[10px] text-muted-foreground">{e.director}</div>
                      </td>
                      <td className="py-2.5 px-2">
                        <span
                          className={cn(
                            "inline-flex h-3 w-3 rounded-full ring-2 ring-offset-1 ring-offset-background",
                            healthBg[e.health]
                          )}
                          style={{
                            boxShadow:
                              e.health === "red"
                                ? "0 0 12px rgba(229,72,77,0.45)"
                                : undefined,
                          }}
                        />
                      </td>
                      <td className="py-2.5 px-2 text-sm">{projets.length}</td>
                      <td className="py-2.5 px-2 text-sm font-mono tabular text-right">
                        {e.budget.toLocaleString("fr-FR")} M
                      </td>
                      <td className="py-2.5 px-2 text-sm font-mono tabular text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-brand-pasteur"
                              style={{ width: `${(e.budgetConsumed / e.budget) * 100}%` }}
                            />
                          </div>
                          <span>{Math.round((e.budgetConsumed / e.budget) * 100)} %</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-sm text-right">
                        {risksHigh > 0 ? (
                          <Badge variant="soft-danger" className="font-mono">
                            {risksHigh}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-2.5 pl-2 text-right">
                        <ChevronRight className="h-4 w-4 text-muted-foreground inline" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* Dépendances graph */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Network className="h-4 w-4 text-brand-pasteur" /> Carte des dépendances
                inter-projets
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">
                Force graph · interactif
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ForceDependencies />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4 text-brand-pasteur" /> Pattern Detection (IA)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PATTERNS.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="rounded-lg border p-3 hover:border-brand-pasteur/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="h-3 w-3 text-brand-pasteur" />
                  <Badge
                    variant={p.urgency === "eleve" ? "destructive" : "soft-warning"}
                    className="text-[10px]"
                  >
                    {p.urgency === "eleve" ? "Urgence élevée" : p.urgency}
                  </Badge>
                  <div className="ml-auto text-[10px] font-mono text-muted-foreground">
                    Conf. {Math.round(p.confidence * 100)} %
                  </div>
                </div>
                <div className="text-xs font-semibold mb-1 leading-tight">{p.title}</div>
                <div className="text-[11px] text-muted-foreground line-clamp-3 mb-2">
                  {p.description}
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex flex-wrap gap-1">
                    {p.sources.slice(0, 2).map((s, i) => (
                      <span
                        key={i}
                        className="rounded bg-brand-pasteur/10 text-brand-pasteur px-1.5 py-0.5"
                      >
                        {s.label}
                      </span>
                    ))}
                  </div>
                  {p.validated === "validated" && (
                    <span className="text-feedback-success flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Validé
                    </span>
                  )}
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
              <Link href="/askia">
                Voir tous les patterns <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Pipeline Kanban Escalades */}
      <section className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Workflow className="h-4 w-4 text-brand-pasteur" /> File d'escalades — Pipeline
                Kanban
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/escalades">Vue complète</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="grid grid-cols-5 gap-3 min-w-[900px]">
              {KANBAN_COLUMNS.map((status) => {
                const items = ESCALADES.filter((e) => e.status === status);
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <div className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
                        {ESCALADE_STATUS_LABELS[status]}
                      </div>
                      <Badge variant="outline" className="text-[10px] h-5">
                        {items.length}
                      </Badge>
                    </div>
                    <div className="space-y-2 min-h-32">
                      {items.length === 0 && (
                        <div className="rounded-md border border-dashed bg-muted/20 p-3 text-[10px] text-center text-muted-foreground">
                          Aucune escalade
                        </div>
                      )}
                      {items.map((e) => (
                        <div
                          key={e.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => openDrill({ type: "escalade", escaladeId: e.id })}
                          onKeyDown={(ev) => {
                            if (ev.key === "Enter" || ev.key === " ") {
                              ev.preventDefault();
                              openDrill({ type: "escalade", escaladeId: e.id });
                            }
                          }}
                          className={cn(
                            "rounded-md border bg-card p-2.5 text-xs space-y-1.5 shadow-sm hover:shadow-md hover:border-brand-pasteur/40 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pasteur",
                            e.urgency === "haute" && "border-feedback-danger/40"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant={
                                e.urgency === "haute"
                                  ? "destructive"
                                  : e.urgency === "moyenne"
                                  ? "soft-warning"
                                  : "soft"
                              }
                              className="text-[9px] py-0 h-4"
                            >
                              {e.urgency.toUpperCase()}
                            </Badge>
                            <span className="text-[9px] font-mono text-muted-foreground">
                              {e.code}
                            </span>
                          </div>
                          <div className="text-xs font-semibold leading-tight line-clamp-2">
                            {e.title}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>{e.submittedInitials}</span>
                            <span>{relativeTimeFR(e.submittedAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Conformité bailleurs */}
      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conformité bailleurs — Obligations à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {BAILLEURS.slice(0, 8).map((b) => {
                const urgent = b.nextReportDueDays <= 7;
                return (
                  <div
                    key={b.id}
                    className={cn(
                      "rounded-lg border p-3 transition-all",
                      urgent && "border-feedback-warning/40 bg-feedback-warning/5"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-semibold">{b.shortName}</div>
                      <span className={cn("h-2 w-2 rounded-full", healthBg[b.health])} />
                    </div>
                    <div className="text-[10px] text-muted-foreground mb-2">{b.region}</div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] text-muted-foreground">Reporting J-</span>
                      <span
                        className={cn(
                          "font-display font-bold text-xl tabular",
                          urgent ? "text-feedback-warning" : "text-foreground"
                        )}
                      >
                        {b.nextReportDueDays}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
