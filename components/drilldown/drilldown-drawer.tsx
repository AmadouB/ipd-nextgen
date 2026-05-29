"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  Info,
  Sigma,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useDrillDownStore } from "@/lib/store/drilldown-store";
import { useAskiaStore } from "@/lib/store/askia-store";
import { PROJECTS, healthCounts } from "@/lib/mock-data/projects";
import { ENTITIES } from "@/lib/mock-data/entities";
import { BAILLEURS } from "@/lib/mock-data/bailleurs";
import { HOSHIN_PILLARS } from "@/lib/mock-data/hoshin";
import { MILESTONES } from "@/lib/mock-data/milestones";
import { ESCALADES, URGENCY_COLORS, URGENCY_LABEL } from "@/lib/mock-data/escalades";
import { ALERTS } from "@/lib/mock-data/alerts";
import { MATURITY } from "@/lib/mock-data/maturity";
import { KPI_AG, KPI_CABINET, KPI_PM, type KpiVedette } from "@/lib/mock-data/kpis";
import {
  cn,
  formatNumber,
  healthBg,
  healthBgSoft,
  healthBorder,
  healthLabel,
  healthText,
} from "@/lib/utils";

const ALL_KPIS: KpiVedette[] = [...KPI_AG, ...KPI_CABINET, ...KPI_PM];

export function DrillDownDrawer() {
  const isOpen = useDrillDownStore((s) => s.isOpen);
  const payload = useDrillDownStore((s) => s.payload);
  const close = useDrillDownStore((s) => s.close);
  const openAskia = useAskiaStore((s) => s.open);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(o) => {
        if (!o) close();
      }}
    >
      <SheetContent className="overflow-y-auto p-0">
        {payload && (
          <div className="flex flex-col h-full">
            <Header payload={payload} />
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <DrillDownBody payload={payload} />
            </div>
            <div className="border-t p-4 flex items-center justify-between bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  close();
                  openAskia();
                }}
              >
                <Sparkles className="h-3.5 w-3.5" /> Demander à ASKIA
              </Button>
              <Button variant="outline" size="sm" onClick={close}>
                Fermer
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ---------------- Header ---------------- */
function Header({ payload }: { payload: NonNullable<ReturnType<typeof useDrillDownStore.getState>["payload"]> }) {
  const title = headerTitleFor(payload);
  const subtitle = headerSubtitleFor(payload);
  return (
    <SheetHeader className="bg-gradient-hero text-white p-6 pr-12 space-y-1">
      <div className="text-[10px] uppercase tracking-widest text-white/70 font-semibold">
        {title.eyebrow}
      </div>
      <SheetTitle className="text-white text-xl">{title.label}</SheetTitle>
      {subtitle && <SheetDescription className="text-white/80">{subtitle}</SheetDescription>}
    </SheetHeader>
  );
}

function headerTitleFor(p: NonNullable<ReturnType<typeof useDrillDownStore.getState>["payload"]>) {
  switch (p.type) {
    case "kpi":
      return { eyebrow: "Indicateur clé · drill-down", label: ALL_KPIS.find((k) => k.code === p.code)?.label ?? p.code };
    case "health-segment":
      return { eyebrow: "Santé portefeuille · drill-down", label: `Projets en statut ${healthLabel[p.status]}` };
    case "project":
      return { eyebrow: "Projet · drill-down", label: PROJECTS.find((x) => x.id === p.projectId)?.name ?? "Projet" };
    case "pillar":
      return { eyebrow: "Pilier Hoshin · drill-down", label: HOSHIN_PILLARS.find((x) => x.id === p.pillarId)?.title ?? "Pilier" };
    case "bailleur":
      return { eyebrow: "Bailleur · drill-down", label: BAILLEURS.find((x) => x.id === p.bailleurId)?.name ?? "Bailleur" };
    case "entity-pillar":
      return {
        eyebrow: "Entité × Pilier · drill-down",
        label: `${ENTITIES.find((x) => x.id === p.entityId)?.shortName} × ${HOSHIN_PILLARS.find((x) => x.id === p.pillarId)?.title}`,
      };
    case "milestone":
      return { eyebrow: "Jalon · drill-down", label: MILESTONES.find((x) => x.id === p.milestoneId)?.title ?? "Jalon" };
    case "escalade":
      return { eyebrow: "Escalade · drill-down", label: ESCALADES.find((x) => x.id === p.escaladeId)?.title ?? "Escalade" };
    case "alert":
      return { eyebrow: "Alerte · drill-down", label: ALERTS.find((x) => x.id === p.alertId)?.title ?? "Alerte" };
    case "maturity-dimension":
      return { eyebrow: "Maturité PMO · drill-down", label: MATURITY.find((x) => x.id === p.dimensionId)?.title ?? "Dimension" };
    default:
      return { eyebrow: "Détail", label: "" };
  }
}

function headerSubtitleFor(p: NonNullable<ReturnType<typeof useDrillDownStore.getState>["payload"]>): string | null {
  switch (p.type) {
    case "kpi": {
      const k = ALL_KPIS.find((x) => x.code === p.code);
      if (!k) return null;
      return `Code ${k.code} · ${k.source} · ${k.freshness}`;
    }
    case "project": {
      const proj = PROJECTS.find((x) => x.id === p.projectId);
      if (!proj) return null;
      return `${proj.code} · ${ENTITIES.find((e) => e.id === proj.entityId)?.shortName} · ${proj.pmName}`;
    }
    default:
      return null;
  }
}

/* ---------------- Body : aiguillage ---------------- */
function DrillDownBody({ payload }: { payload: NonNullable<ReturnType<typeof useDrillDownStore.getState>["payload"]> }) {
  switch (payload.type) {
    case "kpi":
      return <KpiBody code={payload.code} />;
    case "health-segment":
      return <HealthSegmentBody status={payload.status} />;
    case "project":
      return <ProjectBody projectId={payload.projectId} />;
    case "pillar":
      return <PillarBody pillarId={payload.pillarId} />;
    case "bailleur":
      return <BailleurBody bailleurId={payload.bailleurId} />;
    case "entity-pillar":
      return <EntityPillarBody entityId={payload.entityId} pillarId={payload.pillarId} />;
    case "milestone":
      return <MilestoneBody milestoneId={payload.milestoneId} />;
    case "escalade":
      return <EscaladeBody escaladeId={payload.escaladeId} />;
    case "alert":
      return <AlertBody alertId={payload.alertId} />;
    case "maturity-dimension":
      return <MaturityBody dimensionId={payload.dimensionId} />;
  }
}

/* ---------------- KPI body ---------------- */
function KpiBody({ code }: { code: string }) {
  const k = ALL_KPIS.find((x) => x.code === code);
  if (!k) return <NotFound label={code} />;
  const components = getKpiComponents(code);

  return (
    <div className="space-y-5 pt-5">
      {/* Big value */}
      <div className="flex items-end gap-4">
        <div
          className={cn(
            "font-display text-5xl font-bold tabular leading-none",
            healthText[k.health]
          )}
        >
          {formatNumber(k.value, {
            minimumFractionDigits: k.format === "decimal" ? 2 : 0,
            maximumFractionDigits: k.format === "decimal" ? 2 : 0,
          })}
          <span className="text-2xl ml-1">{k.unit}</span>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 mb-2 px-2 py-0.5 rounded text-xs font-semibold",
            k.delta >= 0
              ? "bg-feedback-success/10 text-feedback-success"
              : "bg-feedback-danger/10 text-feedback-danger"
          )}
        >
          {k.delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(k.delta)} {k.unit === "%" ? "pts" : ""}
        </div>
      </div>

      {/* Statut tricolore */}
      <Section title="Statut">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border-2",
              healthBorder[k.health],
              healthBgSoft[k.health],
              healthText[k.health]
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", healthBg[k.health])} />
            {healthLabel[k.health]}
          </span>
          <span className="text-xs text-muted-foreground">
            Mis à jour {k.freshness} · source {k.source}
          </span>
        </div>
      </Section>

      {/* Méthodologie */}
      <Section title="Méthodologie de calcul" icon={Sigma}>
        <div className="rounded-lg border bg-muted/30 p-3 space-y-2 text-sm">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mr-2">
              Formule
            </span>
            <span className="font-mono text-xs">{components.formula}</span>
          </div>
          <div className="text-xs text-muted-foreground">{components.description}</div>
        </div>
      </Section>

      {/* Seuils */}
      <Section title="Seuils tricolores §11.4">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <ThresholdBox color="green" range={k.thresholdGreen} label="Vert" />
          <ThresholdBox color="amber" range={k.thresholdAmber} label="Ambre" />
          <ThresholdBox color="red" range={k.thresholdRed} label="Rouge" />
        </div>
      </Section>

      {/* Composantes */}
      {components.rows.length > 0 && (
        <Section title={`Composantes (${components.rows.length})`}>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="text-left py-2 px-3">{components.colLabel}</th>
                  <th className="text-right py-2 px-3">{components.colValue}</th>
                  <th className="text-right py-2 pr-3 w-16">Poids</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {components.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        {row.color && (
                          <span className={cn("h-2 w-2 rounded-full shrink-0", healthBg[row.color])} />
                        )}
                        <span className="font-medium">{row.label}</span>
                        {row.subLabel && (
                          <span className="text-[10px] text-muted-foreground">{row.subLabel}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular font-semibold">
                      {row.value}
                    </td>
                    <td className="py-2 pr-3 text-right text-muted-foreground text-[10px]">
                      {row.weight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Historique sparkline */}
      <Section title="Tendance — 7 dernières mesures">
        <div className="grid grid-cols-7 gap-1 items-end h-20">
          {k.sparkline.map((v, i) => {
            const max = Math.max(...k.sparkline);
            const min = Math.min(...k.sparkline);
            const norm = (v - min) / (max - min || 1);
            return (
              <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                <div
                  className={cn("w-full rounded-t bg-brand-pasteur/70", i === 6 && "bg-brand-pasteur")}
                  style={{ height: `${Math.max(15, norm * 100)}%` }}
                />
                <span className="text-[9px] font-mono text-muted-foreground">{v}</span>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function ThresholdBox({ color, range, label }: { color: "green" | "amber" | "red"; range: string; label: string }) {
  return (
    <div
      className={cn(
        "rounded-md border-2 p-2",
        healthBorder[color],
        healthBgSoft[color]
      )}
    >
      <div className={cn("text-[10px] uppercase tracking-widest font-semibold", healthText[color])}>
        {label}
      </div>
      <div className="font-mono text-xs font-bold mt-0.5">{range}</div>
    </div>
  );
}

/* ---------------- KPI components computation ---------------- */
interface KpiBreakdown {
  formula: string;
  description: string;
  colLabel: string;
  colValue: string;
  rows: Array<{
    label: string;
    subLabel?: string;
    value: string;
    weight?: string;
    color?: "green" | "amber" | "red";
  }>;
}

function getKpiComponents(code: string): KpiBreakdown {
  switch (code) {
    case "EXE-01": // Santé portefeuille
      {
        const counts = healthCounts();
        return {
          formula: "(Projets Vert / Projets actifs) × 100",
          description:
            "% des projets actifs en statut Vert (santé globale OK) au sens §11.4. Calculé quotidiennement à partir des indicateurs SPI, CPI, risques et conformité.",
          colLabel: "Projet",
          colValue: "Statut",
          rows: PROJECTS.map((p) => ({
            label: p.name,
            subLabel: p.code,
            value: healthLabel[p.health],
            color: p.health,
            weight: `${Math.round((p.budget / PROJECTS.reduce((s, x) => s + x.budget, 0)) * 100)} %`,
          })),
        };
      }
    case "EXE-04": // Avancement Hoshin global
      return {
        formula: "Moyenne pondérée des % d'avancement par objectif",
        description:
          "Moyenne pondérée des % d'avancement des 5 piliers du Plan Stratégique Hoshin. La pondération reflète l'importance stratégique de chaque pilier.",
        colLabel: "Pilier Hoshin",
        colValue: "Avancement",
        rows: HOSHIN_PILLARS.map((p) => ({
          label: p.title,
          subLabel: p.code,
          value: `${p.progress} %`,
          color: p.progress >= p.target ? "green" : p.progress >= p.target * 0.8 ? "amber" : "red",
          weight: "20 %",
        })),
      };
    case "EXE-05": // Absorption bailleurs
      return {
        formula: "(Décaissements YTD / Budget YTD annualisé) × 100",
        description:
          "Taux d'absorption budgétaire moyen pondéré sur l'ensemble des bailleurs partenaires. Une absorption trop faible (< 70 %) ou trop forte (> 120 %) signale un défaut de pilotage.",
        colLabel: "Bailleur",
        colValue: "Absorption YTD",
        rows: BAILLEURS.map((b) => ({
          label: b.name,
          subLabel: b.region,
          value: `${b.ytdAbsorption} %`,
          color: b.health,
          weight: `${Math.round((b.totalEngaged / BAILLEURS.reduce((s, x) => s + x.totalEngaged, 0)) * 100)} %`,
        })),
      };
    case "EXE-06": // Escalades urgence Haute en attente
      {
        const haute = ESCALADES.filter((e) => e.urgency === "haute" && e.status !== "clos" && e.status !== "decide");
        return {
          formula: "Nombre d'escalades statut ≠ {clos, décidé} et urgence = Haute",
          description:
            "Compteur temps réel des escalades d'urgence Haute non encore décidées par l'AG. Toute valeur ≥ 3 déclenche un bandeau d'alerte rouge sur le dashboard.",
          colLabel: "Escalade",
          colValue: "Statut",
          rows: haute.map((e) => ({
            label: e.title,
            subLabel: e.code,
            value: e.status.replace("_", " "),
            color: "red",
            weight: e.submittedInitials,
          })),
        };
      }
    case "COO-01": // Délai moyen escalade
      {
        const closed = ESCALADES.filter((e) => e.status === "clos" || e.status === "decide");
        return {
          formula: "Σ (date_clôture − date_création) / N sur 30 j glissants",
          description:
            "Temps moyen entre la création d'une escalade et sa clôture/décision finale, sur les 30 derniers jours.",
          colLabel: "Escalade clôturée",
          colValue: "Durée",
          rows: closed.map((e) => ({
            label: e.title,
            subLabel: e.code,
            value: "≈ 38 h",
            color: "green",
          })),
        };
      }
    case "COO-02": // Taux résolues sans AG
      return {
        formula: "(Escalades clôturées Cabinet/PMO / Total clôturées) × 100",
        description: "% des escalades résolues sans nécessiter d'arbitrage AG.",
        colLabel: "Pipeline",
        colValue: "Volume",
        rows: [
          { label: "Résolues niveau Cabinet", value: "4", color: "green" },
          { label: "Résolues niveau PMO", value: "1", color: "green" },
          { label: "Escaladées à l'AG", value: "2", color: "amber" },
          { label: "Bloquées en attente AG", value: "0", color: "green" },
        ],
      };
    case "COO-03": // Indice collaboration
      return {
        formula: "0.4 × Co-édition + 0.3 × Dépendances résolues + 0.3 × Escalades croisées",
        description: "Score composite agrégeant 3 dimensions de collaboration inter-entités.",
        colLabel: "Composante",
        colValue: "Score",
        rows: [
          { label: "Co-édition fiches entités", value: "82 / 100", color: "green", weight: "40 %" },
          { label: "Dépendances résolues à temps", value: "68 / 100", color: "amber", weight: "30 %" },
          { label: "Escalades croisées clôturées", value: "58 / 100", color: "red", weight: "30 %" },
        ],
      };
    case "COO-04": // Conformité reporting bailleurs
      return {
        formula: "(Livrables remis à temps / Livrables attendus) × 100, 90 jours",
        description: "Taux de conformité des livrables bailleurs sur la fenêtre glissante de 90 j.",
        colLabel: "Bailleur",
        colValue: "Conformité",
        rows: BAILLEURS.map((b) => ({
          label: b.shortName,
          subLabel: b.region,
          value: b.nextReportDueDays <= 7 ? "À risque" : "OK",
          color: b.health,
        })),
      };
    case "PM-01": // Avancement vs plan
      return {
        formula: "(Tâches OK / Tâches attendues à date) × 100",
        description: "Avancement du projet vs le plan prévisionnel à la date du jour.",
        colLabel: "Phase",
        colValue: "Avancement",
        rows: [
          { label: "Préparation BSL-3", value: "100 %", color: "green" },
          { label: "Sourcing fournisseurs", value: "45 %", color: "amber" },
          { label: "Industrialisation lyo", value: "20 %", color: "red" },
          { label: "Formation opérateurs", value: "32 %", color: "amber" },
        ],
      };
    case "PM-02": // Consommation budgétaire
      return {
        formula: "(AC / Budget prévu à date) × 100",
        description: "Consommation budgétaire actuelle vs ce qui devait être dépensé à cette date.",
        colLabel: "Ligne budgétaire",
        colValue: "Consommé",
        rows: [
          { label: "Équipement (CEPI)", value: "92 % / 100 %", color: "green", weight: "5 600 M FCFA" },
          { label: "Formation continue (CEPI)", value: "41 % / 100 %", color: "red", weight: "1 200 M FCFA" },
          { label: "RH (BMZ)", value: "78 % / 100 %", color: "amber", weight: "3 100 M FCFA" },
          { label: "Consommables (Gates)", value: "88 % / 100 %", color: "green", weight: "2 400 M FCFA" },
        ],
      };
    case "PM-03": // Risques Élevés non mitigés
      return {
        formula: "Compte des risques niveau Élevé avec status = ouvert sans action active",
        description: "Risques nécessitant un plan de mitigation immédiat.",
        colLabel: "Risque",
        colValue: "Score P×I",
        rows: [
          { label: "Rupture lyophilisateur", subLabel: "RSK-MAD-014", value: "4×5=20", color: "red" },
          { label: "Cert. BSL-3 phase 2", subLabel: "RSK-MAD-011", value: "3×5=15", color: "red" },
        ],
      };
    case "PM-06": // Conformité projet
      return {
        formula: "Σ (charte signée + plan à jour + registre à jour + reporting à jour) / 4",
        description: "Score de conformité projet sur 4 dimensions de gouvernance.",
        colLabel: "Critère",
        colValue: "Statut",
        rows: [
          { label: "Charte projet signée", value: "✓", color: "green" },
          { label: "Plan de travail < 14j", value: "✓", color: "green" },
          { label: "Registre risques actif", value: "✓", color: "green" },
          { label: "Reporting bailleurs à jour", value: "✗", color: "red" },
        ],
      };
    default:
      return {
        formula: "—",
        description: "Cet indicateur n'a pas encore de breakdown détaillé.",
        colLabel: "—",
        colValue: "—",
        rows: [],
      };
  }
}

/* ---------------- Health segment body ---------------- */
function HealthSegmentBody({ status }: { status: "green" | "amber" | "red" }) {
  const projects = PROJECTS.filter((p) => p.health === status);
  return (
    <div className="space-y-4 pt-5">
      <div className="flex items-center gap-3">
        <span className={cn("h-4 w-4 rounded-full", healthBg[status])} />
        <div className="font-display font-bold text-2xl">{projects.length} projets</div>
        <Badge variant="outline" className="ml-auto">
          {healthLabel[status]}
        </Badge>
      </div>
      <ProjectsList projects={projects} />
    </div>
  );
}

/* ---------------- Project body ---------------- */
function ProjectBody({ projectId }: { projectId: string }) {
  const p = PROJECTS.find((x) => x.id === projectId);
  const close = useDrillDownStore((s) => s.close);
  if (!p) return <NotFound label={projectId} />;
  const entity = ENTITIES.find((e) => e.id === p.entityId);
  const bailleurs = BAILLEURS.filter((b) => p.bailleurIds.includes(b.id));
  const pillar = HOSHIN_PILLARS.find((h) => h.id === p.pillarId);
  const milestones = MILESTONES.filter((m) => m.projectId === p.id);

  return (
    <div className="space-y-4 pt-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Santé" value={healthLabel[p.health]} color={p.health} />
        <Stat label="Avancement" value={`${p.progress} %`} />
        <Stat label="Budget" value={`${formatNumber(p.budget)} M`} />
        <Stat label="SPI" value={p.spi.toFixed(2)} color={p.spi >= 0.95 ? "green" : p.spi >= 0.85 ? "amber" : "red"} />
        <Stat label="CPI" value={p.cpi.toFixed(2)} color={p.cpi >= 0.95 ? "green" : p.cpi >= 0.85 ? "amber" : "red"} />
        <Stat label="Risques Élevés" value={String(p.risksHighCount)} color={p.risksHighCount === 0 ? "green" : p.risksHighCount <= 2 ? "amber" : "red"} />
      </div>

      <Section title="Contexte">
        <ul className="space-y-1.5 text-sm">
          <Li label="Entité" value={entity?.name ?? "—"} />
          <Li label="Pilier Hoshin" value={pillar ? `${pillar.code} — ${pillar.title}` : "—"} />
          <Li label="Chef de projet" value={`${p.pmInitials} — ${p.pmName}`} />
          <Li label="Période" value={`${p.startDate} → ${p.endDate}`} />
        </ul>
      </Section>

      <Section title={`Bailleurs (${bailleurs.length})`}>
        <div className="flex flex-wrap gap-2">
          {bailleurs.map((b) => (
            <Badge key={b.id} variant="soft" className="text-[11px]">
              {b.shortName}
            </Badge>
          ))}
        </div>
      </Section>

      {milestones.length > 0 && (
        <Section title={`Jalons (${milestones.length})`}>
          <ul className="space-y-1.5">
            {milestones.map((m) => (
              <li
                key={m.id}
                className="rounded-md border p-2 text-xs flex items-center justify-between"
              >
                <span className="font-medium">{m.title}</span>
                <span className="text-muted-foreground">J{m.daysFromNow > 0 ? "+" : ""}{m.daysFromNow}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Button variant="primary" size="sm" asChild className="w-full">
        <Link href={`/dashboard-pm?project=${p.id}`} onClick={close}>
          Ouvrir dashboard PM <ArrowRight className="h-3 w-3" />
        </Link>
      </Button>
    </div>
  );
}

/* ---------------- Pillar body ---------------- */
function PillarBody({ pillarId }: { pillarId: string }) {
  const pillar = HOSHIN_PILLARS.find((x) => x.id === pillarId);
  if (!pillar) return <NotFound label={pillarId} />;
  const projects = PROJECTS.filter((p) => p.pillarId === pillarId);
  return (
    <div className="space-y-4 pt-5">
      <div className="rounded-lg border bg-muted/30 p-3">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
          {pillar.code}
        </div>
        <div className="text-sm">{pillar.description}</div>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={pillar.progress} className="flex-1 h-2" />
          <span className="font-mono tabular text-sm font-bold">
            {pillar.progress}% / {pillar.target}%
          </span>
        </div>
      </div>
      <Section title={`Projets rattachés (${projects.length})`}>
        <ProjectsList projects={projects} />
      </Section>
    </div>
  );
}

/* ---------------- Bailleur body ---------------- */
function BailleurBody({ bailleurId }: { bailleurId: string }) {
  const b = BAILLEURS.find((x) => x.id === bailleurId);
  if (!b) return <NotFound label={bailleurId} />;
  const projects = PROJECTS.filter((p) => p.bailleurIds.includes(b.id));
  return (
    <div className="space-y-4 pt-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Engagé" value={`${formatNumber(b.totalEngaged)} M`} />
        <Stat label="Consommé" value={`${formatNumber(b.totalConsumed)} M`} />
        <Stat label="Disponible" value={`${formatNumber(b.available)} M`} />
        <Stat label="Absorption YTD" value={`${b.ytdAbsorption} %`} color={b.health} />
        <Stat label="Prochain reporting" value={`J-${b.nextReportDueDays}`} color={b.nextReportDueDays <= 7 ? "red" : "green"} />
        <Stat label="Région" value={b.region} />
      </div>
      <Section title={`Projets financés (${projects.length})`}>
        <ProjectsList projects={projects} />
      </Section>
    </div>
  );
}

/* ---------------- Entity × Pillar ---------------- */
function EntityPillarBody({ entityId, pillarId }: { entityId: string; pillarId: string }) {
  const ent = ENTITIES.find((e) => e.id === entityId);
  const pil = HOSHIN_PILLARS.find((p) => p.id === pillarId);
  const projects = PROJECTS.filter((p) => p.entityId === entityId && p.pillarId === pillarId);
  if (!ent || !pil) return <NotFound label={`${entityId}/${pillarId}`} />;
  return (
    <div className="space-y-4 pt-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Entité</div>
          <div className="font-semibold text-sm">{ent.name}</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Pilier</div>
          <div className="font-semibold text-sm">{pil.code} — {pil.title}</div>
        </div>
      </div>
      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          Aucun projet à l'intersection de {ent.shortName} et {pil.code}.
        </div>
      ) : (
        <Section title={`Projets à l'intersection (${projects.length})`}>
          <ProjectsList projects={projects} />
        </Section>
      )}
    </div>
  );
}

/* ---------------- Milestone body ---------------- */
function MilestoneBody({ milestoneId }: { milestoneId: string }) {
  const m = MILESTONES.find((x) => x.id === milestoneId);
  if (!m) return <NotFound label={milestoneId} />;
  const project = PROJECTS.find((p) => p.id === m.projectId);
  return (
    <div className="space-y-4 pt-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Statut" value={m.status.replace("_", " ")} />
        <Stat label="Importance" value={m.importance} />
        <Stat label="Échéance" value={new Date(m.dateExpected).toLocaleDateString("fr-FR")} />
      </div>
      <Section title="Projet rattaché">
        {project && <ProjectsList projects={[project]} />}
      </Section>
    </div>
  );
}

/* ---------------- Escalade body ---------------- */
function EscaladeBody({ escaladeId }: { escaladeId: string }) {
  const e = ESCALADES.find((x) => x.id === escaladeId);
  if (!e) return <NotFound label={escaladeId} />;
  const entity = ENTITIES.find((en) => en.id === e.entityId);
  return (
    <div className="space-y-4 pt-5">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge className={URGENCY_COLORS[e.urgency]}>{URGENCY_LABEL[e.urgency]}</Badge>
        <Badge variant="outline">{e.status.replace("_", " ")}</Badge>
        <span className="text-[10px] font-mono text-muted-foreground">{e.code}</span>
      </div>
      <Section title="Description">
        <div className="text-sm leading-relaxed">{e.description}</div>
      </Section>
      <Section title="Impact si non-traité">
        <div className="rounded-lg bg-feedback-danger/5 border border-feedback-danger/30 p-3 text-sm">
          {e.impactIfUnresolved}
        </div>
      </Section>
      <Section title="Détail">
        <ul className="space-y-1.5">
          <Li label="Entité" value={entity?.name ?? "—"} />
          <Li label="Soumise par" value={e.submittedBy} />
          <Li label="Décision attendue avant" value={new Date(e.decisionExpectedBy).toLocaleDateString("fr-FR")} />
          <Li label="Pièces jointes" value={`${e.attachments}`} />
        </ul>
      </Section>
    </div>
  );
}

/* ---------------- Alert body ---------------- */
function AlertBody({ alertId }: { alertId: string }) {
  const a = ALERTS.find((x) => x.id === alertId);
  if (!a) return <NotFound label={alertId} />;
  return (
    <div className="space-y-4 pt-5">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={a.criticality === "critique" ? "destructive" : a.criticality === "importante" ? "warning" : "soft"}>
          {a.criticality}
        </Badge>
        <span className="text-[10px] font-mono text-muted-foreground">{a.code}</span>
      </div>
      <Section title="Message">
        <div className="text-sm leading-relaxed">{a.message}</div>
      </Section>
      <Section title="Détail">
        <ul className="space-y-1.5">
          <Li label="Source" value={a.source} />
          <Li label="Destinataires" value={a.recipients.join(", ")} />
          <Li label="Canaux" value={a.channels.join(", ")} />
          <Li label="SLA réaction" value={`${a.slaReactionH} h`} />
        </ul>
      </Section>
    </div>
  );
}

/* ---------------- Maturity body ---------------- */
function MaturityBody({ dimensionId }: { dimensionId: string }) {
  const d = MATURITY.find((x) => x.id === dimensionId);
  if (!d) return <NotFound label={dimensionId} />;
  return (
    <div className="space-y-4 pt-5">
      <div className="text-center">
        <div className="font-display font-bold text-5xl text-brand-pasteur tabular">
          {d.score.toFixed(1)}
        </div>
        <div className="text-sm text-muted-foreground">/ {d.target.toFixed(1)} Niveau 4 cible</div>
      </div>
      <Section title={`KPI de la dimension (${d.kpis.length})`}>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left py-2 px-3">Indicateur</th>
                <th className="text-right py-2 px-3">Actuel</th>
                <th className="text-right py-2 pr-3">Cible</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {d.kpis.map((k, i) => (
                <tr key={i}>
                  <td className="py-2 px-3">
                    <span className={cn("inline-block h-2 w-2 rounded-full mr-2", healthBg[k.health])} />
                    {k.label}
                  </td>
                  <td className={cn("py-2 px-3 text-right font-mono tabular font-semibold", healthText[k.health])}>
                    {k.actual}
                  </td>
                  <td className="py-2 pr-3 text-right text-muted-foreground">{k.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section title="Historique 6 mois">
        <div className="flex items-end gap-1 h-16">
          {d.history.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-brand-pasteur/70"
              style={{ height: `${(v / 4) * 100}%` }}
              title={`${v.toFixed(1)}/4`}
            />
          ))}
        </div>
        <div className="text-[10px] text-muted-foreground text-center mt-1">
          Du plus ancien au plus récent
        </div>
      </Section>
    </div>
  );
}

/* ---------------- Helpers ---------------- */
function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
        {Icon && <Icon className="h-3 w-3" />}
        {title}
      </div>
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: "green" | "amber" | "red";
}) {
  return (
    <div className="rounded-lg border p-2.5">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={cn("font-display font-bold text-lg tabular", color && healthText[color])}>
        {value}
      </div>
    </div>
  );
}

function Li({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between text-sm gap-3">
      <span className="text-muted-foreground text-xs shrink-0">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </li>
  );
}

function ProjectsList({ projects }: { projects: typeof PROJECTS }) {
  if (projects.length === 0) {
    return <div className="text-sm text-muted-foreground italic">Aucun projet.</div>;
  }
  const open = useDrillDownStore.getState().open;
  return (
    <ul className="space-y-1.5">
      {projects.map((p) => (
        <li key={p.id}>
          <button
            onClick={() => open({ type: "project", projectId: p.id })}
            className="w-full text-left rounded-md border p-2.5 hover:border-brand-pasteur hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={cn("h-2 w-2 rounded-full", healthBg[p.health])} />
              <span className="text-[10px] font-mono text-muted-foreground">{p.code}</span>
              <Badge variant="outline" className="text-[9px] py-0">
                {ENTITIES.find((e) => e.id === p.entityId)?.shortName}
              </Badge>
            </div>
            <div className="text-xs font-medium leading-tight">{p.name}</div>
            <div className="flex items-center justify-between mt-1.5 text-[10px] text-muted-foreground">
              <span>SPI {p.spi.toFixed(2)} · CPI {p.cpi.toFixed(2)}</span>
              <span>{p.progress} %</span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

function NotFound({ label }: { label: string }) {
  return (
    <div className="py-8 text-center text-sm text-muted-foreground">
      Aucune donnée pour <code className="font-mono">{label}</code>.
    </div>
  );
}
