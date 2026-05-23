"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Clock,
  FileSignature,
  Flag,
  PlusCircle,
  Target,
  XCircle,
} from "lucide-react";
import { RowActions } from "@/components/crud/row-actions";
import { EditModal, type EditField } from "@/components/crud/edit-modal";
import { DeleteConfirm } from "@/components/crud/delete-confirm";
import { toast } from "@/lib/store/toast-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/kpi/kpi-card";
import { KPI_PM } from "@/lib/mock-data/kpis";
import { PROJECTS } from "@/lib/mock-data/projects";
import { RISKS } from "@/lib/mock-data/risks";
import { MILESTONES } from "@/lib/mock-data/milestones";
import { FICHES } from "@/lib/mock-data/fiches";
import { cn, formatNumber, healthBg, healthText } from "@/lib/utils";

const RISK_LEVEL_COLOR = {
  eleve: "bg-feedback-danger text-white",
  moyen: "bg-feedback-warning text-white",
  faible: "bg-feedback-success text-white",
};

export default function DashboardPMPage() {
  // Focus sur le projet MADIBA-2 (vue PM Ibrahima Faye)
  const project = PROJECTS.find((p) => p.id === "madiba-2")!;
  const risks = RISKS.filter((r) => r.projectId === project.id);
  const milestones = MILESTONES.filter((m) => m.projectId === project.id);
  const fiche = FICHES.find((f) => f.entityId === project.entityId);

  // CRUD modals state pour le registre des risques
  const [riskEdit, setRiskEdit] = useState<any | null>(null);
  const [riskDelete, setRiskDelete] = useState<any | null>(null);
  const [riskAddOpen, setRiskAddOpen] = useState(false);

  const riskFields: EditField[] = [
    { key: "description", label: "Description du risque", type: "textarea", required: true },
    { key: "probability", label: "Probabilité (1-5)", type: "number", required: true },
    { key: "impact", label: "Impact (1-5)", type: "number", required: true },
    { key: "mitigation", label: "Action de mitigation", type: "textarea", required: true },
    { key: "ownerInitials", label: "Responsable (initiales)", type: "text" },
    { key: "dueDate", label: "Échéance", type: "date" },
    { key: "status", label: "Statut", type: "select", required: true, options: [
      { value: "ouvert", label: "Ouvert" },
      { value: "mitige", label: "Mitigé" },
      { value: "ferme", label: "Fermé" },
    ]},
  ];

  const conformity = [
    { label: "Charte projet signée", done: true },
    { label: "Plan de travail à jour (< 14j)", done: true },
    { label: "Registre des risques actif", done: true },
    { label: "Reporting bailleurs à jour", done: false },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Dashboard projet · §14"
        title={`Projet ${project.code} — ${project.name}`}
        subtitle={`Pilotage opérationnel du projet sur la semaine. Santé actuelle : ${project.health.toUpperCase()}.`}
        decisionMoment="Quel risque traiter en priorité ?"
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_PM.map((kpi, i) => (
          <KpiCard key={kpi.code} kpi={kpi} emphasized={i === 0} />
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Avancement plan de travail */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-brand-pasteur" /> Avancement du plan de travail
              </CardTitle>
              <Badge variant="soft">Vue Kanban</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {(["en_cours", "completee", "en_retard"] as const).map((state) => {
                const STATE_LABEL = {
                  en_cours: "En cours",
                  completee: "Complétées",
                  en_retard: "En retard",
                };
                const STATE_COLOR = {
                  en_cours: "border-brand-pasteur/30",
                  completee: "border-feedback-success/30",
                  en_retard: "border-feedback-danger/30",
                };
                const STATE_ICON = {
                  en_cours: Clock,
                  completee: CheckCircle2,
                  en_retard: AlertTriangle,
                };
                const items = (fiche?.activities ?? []).filter((a) => a.state === state);
                const Icon = STATE_ICON[state];
                return (
                  <div key={state} className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5",
                          state === "en_cours" && "text-brand-pasteur",
                          state === "completee" && "text-feedback-success",
                          state === "en_retard" && "text-feedback-danger"
                        )}
                      />
                      <div className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
                        {STATE_LABEL[state]}
                      </div>
                      <Badge variant="outline" className="ml-auto text-[10px] h-5">
                        {items.length}
                      </Badge>
                    </div>
                    <div className="space-y-2 min-h-24">
                      {items.map((a) => (
                        <div
                          key={a.id}
                          className={cn(
                            "rounded-md border-l-2 bg-card p-2.5 text-xs shadow-sm",
                            STATE_COLOR[state]
                          )}
                        >
                          <div className="font-semibold leading-tight mb-1.5">{a.title}</div>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>{a.ownerInitials}</span>
                            <span>
                              {new Date(a.dueDate).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </span>
                          </div>
                          <div className="mt-1.5">
                            <Progress value={a.progress} className="h-1" />
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

        {/* Conformité projet §14.2.7 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileSignature className="h-4 w-4 text-brand-pasteur" /> Conformité projet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {conformity.map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  {c.done ? (
                    <CheckCircle2 className="h-4 w-4 text-feedback-success shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-feedback-danger shrink-0" />
                  )}
                  <span className={c.done ? "" : "text-feedback-danger"}>{c.label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-md bg-feedback-warning/10 border border-feedback-warning/30 p-2 text-[11px] text-feedback-warning">
              Score conformité : <strong>3 / 4</strong>. Action : reporting bailleur CEPI à mettre
              à jour.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Registre risques §14.2.3 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-brand-pasteur" /> Registre des risques de
                proximité
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setRiskAddOpen(true)}>
                <PlusCircle className="h-3 w-3" /> Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground border-b">
                  <th className="py-2">Code</th>
                  <th className="py-2 pl-2">Description</th>
                  <th className="py-2 px-2 text-center">P × I</th>
                  <th className="py-2 px-2">Niveau</th>
                  <th className="py-2 pl-2">Mitigation</th>
                  <th className="py-2 px-2">Owner</th>
                  <th className="py-2 pl-2">Échéance</th>
                  <th className="py-2 px-1 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {risks.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/40">
                    <td className="py-2 pr-2 font-mono text-[10px] text-muted-foreground">{r.code}</td>
                    <td className="py-2 px-2 max-w-xs">
                      <div className="leading-tight font-medium">{r.description}</div>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="font-mono tabular text-xs">
                        {r.probability}×{r.impact}={r.probability * r.impact}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <Badge className={cn("text-[9px] uppercase", RISK_LEVEL_COLOR[r.level])}>
                        {r.level}
                      </Badge>
                    </td>
                    <td className="py-2 px-2 max-w-xs text-muted-foreground leading-tight">{r.mitigation}</td>
                    <td className="py-2 px-2 font-mono text-[10px]">{r.ownerInitials}</td>
                    <td className="py-2 pl-2 text-[10px]">
                      {new Date(r.dueDate).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-2 px-1 text-right">
                      <RowActions
                        label={r.code}
                        onEdit={() => setRiskEdit(r)}
                        onRefresh={() => toast.info("Score recalculé", `${r.code} · P×I = ${r.probability * r.impact}.`)}
                        onDuplicate={() => toast.success("Risque dupliqué", `Copie de ${r.code}.`)}
                        onDelete={() => setRiskDelete(r)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <EditModal
          open={!!riskEdit}
          onOpenChange={(v) => !v && setRiskEdit(null)}
          title="Modifier le risque"
          description={`${riskEdit?.code} · projet ${project.code}`}
          fields={riskFields.map((f) => ({ ...f, defaultValue: riskEdit?.[f.key] }))}
          onSave={(v) => toast.success("Risque mis à jour", v.description?.slice(0, 60))}
        />
        <EditModal
          open={riskAddOpen}
          onOpenChange={setRiskAddOpen}
          title="Ajouter un risque"
          description={`Nouveau risque sur projet ${project.code}`}
          fields={riskFields}
          onSave={(v) => toast.success("Risque ajouté", v.description?.slice(0, 60))}
        />
        <DeleteConfirm
          open={!!riskDelete}
          onOpenChange={(v) => !v && setRiskDelete(null)}
          title="Supprimer ce risque ?"
          itemLabel={riskDelete?.code + " — " + riskDelete?.description?.slice(0, 60)}
          onConfirm={() => toast.danger("Risque supprimé", riskDelete?.code)}
        />

        {/* Jalons du projet */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Flag className="h-4 w-4 text-brand-pasteur" /> Jalons à venir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {milestones.map((m) => {
              const STATUS_COLOR = {
                atteint: "text-feedback-success",
                à_risque: "text-feedback-warning",
                en_retard: "text-feedback-danger",
                à_venir: "text-brand-pasteur",
              };
              return (
                <div key={m.id} className="rounded-md border p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Flag className={cn("h-3 w-3", STATUS_COLOR[m.status])} />
                    <Badge
                      variant="outline"
                      className={cn("text-[9px] py-0", STATUS_COLOR[m.status])}
                    >
                      {m.status.replace("_", " ")}
                    </Badge>
                    <span className="ml-auto text-[10px] font-mono">
                      J{m.daysFromNow > 0 ? "+" : ""}{m.daysFromNow}
                    </span>
                  </div>
                  <div className="text-xs font-semibold leading-tight">{m.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Échéance : {new Date(m.dateExpected).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      {/* Budget execution */}
      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exécution budgétaire {project.code}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Budget engagé
                </div>
                <div className="text-2xl font-display font-bold tabular">
                  {formatNumber(project.budget)} M
                </div>
                <div className="text-[10px] text-muted-foreground">FCFA</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Consommé YTD
                </div>
                <div className="text-2xl font-display font-bold tabular text-brand-pasteur">
                  {formatNumber(project.budgetConsumed)} M
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {Math.round((project.budgetConsumed / project.budget) * 100)} %
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  SPI
                </div>
                <div
                  className={cn(
                    "text-2xl font-display font-bold tabular",
                    healthText[project.spi >= 0.95 ? "green" : project.spi >= 0.85 ? "amber" : "red"]
                  )}
                >
                  {project.spi.toFixed(2)}
                </div>
                <div className="text-[10px] text-muted-foreground">Schedule perf. index</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  CPI
                </div>
                <div
                  className={cn(
                    "text-2xl font-display font-bold tabular",
                    healthText[project.cpi >= 0.95 ? "green" : project.cpi >= 0.85 ? "amber" : "red"]
                  )}
                >
                  {project.cpi.toFixed(2)}
                </div>
                <div className="text-[10px] text-muted-foreground">Cost perf. index</div>
              </div>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden bg-muted">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-pasteur to-brand-clair"
                style={{ width: `${(project.budgetConsumed / project.budget) * 100}%` }}
              />
              <div
                className="absolute inset-y-0 w-0.5 bg-brand-nuit"
                style={{ left: `${project.progress}%` }}
                title="Avancement physique"
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
              <span>0 %</span>
              <span>
                Avancement physique : <strong>{project.progress} %</strong>
              </span>
              <span>100 %</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
