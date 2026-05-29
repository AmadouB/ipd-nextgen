"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  AlertOctagon,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileSignature,
  FileText,
  History,
  Info as InfoIcon,
  Lock,
  MessageCircle,
  PlusCircle,
  Send,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { EscaladeWizard } from "@/components/fiche/escalade-wizard";
import { SignatureDialog } from "@/components/fiche/signature-dialog";
import { RowActions } from "@/components/crud/row-actions";
import { DeleteConfirm } from "@/components/crud/delete-confirm";
import { EditModal, type EditField } from "@/components/crud/edit-modal";
import { ENTITIES } from "@/lib/mock-data/entities";
import { ficheByEntity } from "@/lib/mock-data/fiches";
import { HOSHIN_PILLARS } from "@/lib/mock-data/hoshin";
import { ESCALADES } from "@/lib/mock-data/escalades";
import { RISKS } from "@/lib/mock-data/risks";
import { PROJECTS } from "@/lib/mock-data/projects";
import { cn, formatDateFR, healthBg, healthBgSoft, healthBorder, healthText, relativeTimeFR, type HealthColor } from "@/lib/utils";
import { toast } from "@/lib/store/toast-store";

const SECTIONS = [
  { key: "infos", label: "Infos générales", icon: InfoIcon },
  { key: "priorites", label: "Priorités", icon: Target },
  { key: "activites", label: "Activités", icon: TrendingUp },
  { key: "kpi", label: "KPI", icon: TrendingUp },
  { key: "risques", label: "Risques", icon: AlertOctagon },
  { key: "roadmap", label: "Feuille de route", icon: Calendar },
  { key: "escalades", label: "Demandes de soutien", icon: AlertOctagon },
  { key: "notes", label: "Notes", icon: FileText },
  { key: "signature", label: "Validation", icon: FileSignature },
] as const;

export default function FichePage({ params }: { params: Promise<{ entiteId: string }> }) {
  const { entiteId } = use(params);
  const entity = ENTITIES.find((e) => e.id === entiteId);
  const fiche = entity ? ficheByEntity(entity.id) : undefined;
  const myEscalades = entity ? ESCALADES.filter((e) => e.entityId === entity.id) : [];
  const entityProjects = entity ? PROJECTS.filter((p) => p.entityId === entity.id) : [];
  const entityRisks = RISKS.filter((r) => entityProjects.some((p) => p.id === r.projectId));

  const [active, setActive] = useState<typeof SECTIONS[number]["key"]>("priorites");
  const [escaladeOpen, setEscaladeOpen] = useState(false);
  const [signOpen, setSignOpen] = useState(false);

  if (!entity) {
    return (
      <div className="text-center py-16 space-y-4">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
        <div className="space-y-1">
          <div className="text-lg font-semibold">Entité introuvable</div>
          <div className="text-sm text-muted-foreground">
            Aucune entité ne correspond à l'identifiant <code className="font-mono">{entiteId}</code>.
          </div>
        </div>
        <Button variant="primary" asChild>
          <Link href="/mes-fiches">Voir toutes les fiches</Link>
        </Button>
      </div>
    );
  }

  if (!fiche) {
    return (
      <div className="text-center py-16 space-y-4">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
        <div className="space-y-1">
          <div className="text-lg font-semibold">Aucune fiche pour {entity.shortName} cette semaine</div>
          <div className="text-sm text-muted-foreground">
            Le cycle hebdomadaire reprend mardi à l'ouverture du portail (§18.1).
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/mes-fiches">Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const statusBadge = {
    DRAFT: { label: "Brouillon", color: "soft-warning" },
    SUBMITTED: { label: "Soumise", color: "soft" },
    LOCKED: { label: "Verrouillée", color: "soft-warning" },
    SIGNED: { label: "Signée", color: "soft-success" },
  }[fiche.status];

  return (
    <>
      {/* Header fiche */}
      <PageHeader
        eyebrow={`Portail des priorités · ${entity.shortName}`}
        title={`Fiche entité — Semaine du ${formatDateFR(fiche.periodStart)}`}
        subtitle={`${entity.director} · Réunion AG : ${formatDateFR(fiche.meetingDate)}`}
        decisionMoment="Que dois-je dire à l'AG cette semaine ?"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={statusBadge.color as any}>{statusBadge.label}</Badge>
            {fiche.status === "DRAFT" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSignOpen(true)}
                className="bg-white text-brand-nuit hover:bg-white/90"
              >
                <FileSignature className="h-4 w-4" /> Soumettre & Signer
              </Button>
            )}
          </div>
        }
      />

      {/* Complétude + presence */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Anneau complétude */}
            <div className="relative h-20 w-20 shrink-0">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-muted"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(fiche.completeness / 100) * 213.6} 213.6`}
                  className={cn(
                    fiche.completeness >= 90
                      ? "text-feedback-success"
                      : fiche.completeness >= 70
                      ? "text-brand-pasteur"
                      : "text-feedback-warning"
                  )}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-display text-xl font-bold tabular">
                  {fiche.completeness}%
                </div>
                <div className="text-[8px] uppercase tracking-widest text-muted-foreground">
                  complétude
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Clock className="h-3 w-3" />
                Verrouillage automatique vendredi 22 mai 17h00 (dans 2 jours)
              </div>
              <Progress
                value={fiche.completeness}
                className="h-2 max-w-md"
                indicatorClassName={cn(
                  fiche.completeness >= 90
                    ? "bg-feedback-success"
                    : fiche.completeness >= 70
                    ? "bg-brand-pasteur"
                    : "bg-feedback-warning"
                )}
              />
              <div className="text-[11px] text-muted-foreground mt-1">
                §17.3 — Soumission possible quand ≥ 90 % de complétude
              </div>
            </div>

            <div className="hidden md:block">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                En cours d'édition (3)
              </div>
              <div className="flex -space-x-1">
                {["FD", "KS", "AN"].map((init, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-background ring-2",
                      i === 0 && "bg-brand-pasteur ring-brand-pasteur/30",
                      i === 1 && "bg-feedback-warning ring-feedback-warning/30",
                      i === 2 && "bg-feedback-success ring-feedback-success/30"
                    )}
                  >
                    {init}
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                Co-édition CRDT temps réel
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout principal : sidebar sections / contenu / activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_300px] gap-6">
        {/* Sidebar sections */}
        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">
              Sections
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <nav>
              <ul className="space-y-0.5">
                {SECTIONS.map((s) => {
                  const Icon = s.icon;
                  const isActive = active === s.key;
                  const sectionCompleteness = sectionFakeCompleteness(s.key, fiche.completeness);
                  return (
                    <li key={s.key}>
                      <button
                        onClick={() => setActive(s.key)}
                        className={cn(
                          "w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-left transition-colors",
                          isActive
                            ? "bg-brand-pasteur/10 text-brand-pasteur font-semibold"
                            : "hover:bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span className="flex-1 min-w-0 truncate">{s.label}</span>
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            sectionCompleteness >= 90
                              ? "bg-feedback-success"
                              : sectionCompleteness >= 50
                              ? "bg-feedback-warning"
                              : "bg-muted-foreground"
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </CardContent>
        </Card>

        {/* Contenu central */}
        <div className="min-w-0 space-y-4">
          {active === "infos" && <SectionInfos entity={entity} fiche={fiche} />}
          {active === "priorites" && <SectionPriorites fiche={fiche} />}
          {active === "activites" && <SectionActivites fiche={fiche} />}
          {active === "kpi" && <SectionKpis fiche={fiche} />}
          {active === "risques" && <SectionRisques risks={entityRisks} />}
          {active === "roadmap" && <SectionRoadmap fiche={fiche} />}
          {active === "escalades" && (
            <SectionEscalades
              escalades={myEscalades}
              onNew={() => setEscaladeOpen(true)}
            />
          )}
          {active === "notes" && <SectionNotes fiche={fiche} />}
          {active === "signature" && (
            <SectionSignature fiche={fiche} onSign={() => setSignOpen(true)} entity={entity} />
          )}
        </div>

        {/* Sidebar activity */}
        <Card className="h-fit lg:sticky lg:top-20 hidden lg:block">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="h-3.5 w-3.5" /> Flux d'activité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { who: "Khadija S.", what: "a complété la section KPI", when: "il y a 12 min", initials: "KS", color: "bg-feedback-warning" },
              { who: "Awa N.", what: "a ajouté un commentaire sur 'Priorité 3'", when: "il y a 28 min", initials: "AN", color: "bg-feedback-success" },
              { who: "Pr. Fatou D.", what: "a verrouillé la section 'Risques'", when: "il y a 1 h", initials: "FD", color: "bg-brand-pasteur" },
              { who: "Pape D.", what: "a soumis l'escalade ESC-038", when: "il y a 3 h", initials: "PD", color: "bg-brand-pasteur" },
              { who: "ASKIA", what: "a suggéré une reformulation", when: "il y a 4 h", initials: "AI", color: "bg-gradient-hero" },
            ].map((a, i) => (
              <div key={i} className="flex gap-2 text-[11px]">
                <div
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-white font-bold text-[9px] shrink-0",
                    a.color
                  )}
                >
                  {a.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div>
                    <strong>{a.who}</strong> {a.what}
                  </div>
                  <div className="text-muted-foreground text-[10px]">{a.when}</div>
                </div>
              </div>
            ))}

            <Separator />
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() =>
                toast.info(
                  "Time-travel UI",
                  "Sélecteur de version (§20.2) — snapshots tous les 5 min, rétention 2 ans."
                )
              }
            >
              <History className="h-3 w-3" /> Voir tout l'historique
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bandeau bas — workflow J-X */}
      <div className="mt-6 rounded-xl border-2 border-dashed border-brand-pasteur/30 bg-brand-pasteur/5 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-brand-pasteur/15 flex items-center justify-center">
            <Clock className="h-5 w-5 text-brand-pasteur" />
          </div>
          <div>
            <div className="font-semibold text-sm">Workflow hebdomadaire — J-2</div>
            <div className="text-xs text-muted-foreground">
              §18.1 — Verrouillage automatique vendredi 22 mai 17h00 · Réunion AG lundi 25 mai 9h00
            </div>
          </div>
        </div>
        <Button variant="primary" onClick={() => setSignOpen(true)}>
          <Send className="h-4 w-4" /> Soumettre pour validation
        </Button>
      </div>

      <EscaladeWizard open={escaladeOpen} onOpenChange={setEscaladeOpen} />
      <SignatureDialog
        open={signOpen}
        onOpenChange={setSignOpen}
        signerName={entity.director}
        signerRole={`Directrice — ${entity.name}`}
      />
    </>
  );
}

function sectionFakeCompleteness(key: string, base: number): number {
  const offsets: Record<string, number> = {
    infos: 100,
    priorites: 95,
    activites: 80,
    kpi: 75,
    risques: 70,
    roadmap: 60,
    escalades: 90,
    notes: 50,
    signature: base >= 100 ? 100 : 0,
  };
  return offsets[key] ?? base;
}

/* -------------- Sections -------------- */

function SectionInfos({ entity, fiche }: { entity: any; fiche: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <InfoIcon className="h-4 w-4 text-brand-pasteur" /> Informations générales
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        <Info label="Entité" value={entity.name} />
        <Info label="Direction" value={entity.director} />
        <Info label="Site" value={entity.site} />
        <Info label="Période" value={`${formatDateFR(fiche.periodStart)} → ${formatDateFR(fiche.periodEnd)}`} />
        <Info label="Prochaine réunion AG" value={formatDateFR(fiche.meetingDate)} />
        <Info label="Participants prévus" value="AG · Cabinet · Directrice · PM MADIBA-2" />
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function SectionPriorites({ fiche }: { fiche: any }) {
  const HORIZON_LABEL = { court: "< 1 mois", moyen: "1-3 mois", long: "> 3 mois" };
  const HORIZON_COLOR = { court: "destructive", moyen: "soft-warning", long: "soft" } as const;
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const priorityFields: EditField[] = [
    { key: "description", label: "Description de la priorité", type: "textarea", required: true, placeholder: "Sécuriser la chaîne d'approvisionnement…" },
    { key: "horizon", label: "Horizon", type: "select", required: true, options: [
      { value: "court", label: "Court terme (< 1 mois)" },
      { value: "moyen", label: "Moyen terme (1-3 mois)" },
      { value: "long", label: "Long terme (> 3 mois)" },
    ]},
    { key: "pillarId", label: "Pilier Hoshin", type: "select", required: true, options: HOSHIN_PILLARS.map((h) => ({ value: h.id, label: `${h.code} — ${h.title}` })) },
    { key: "progress", label: "Avancement (%)", type: "number", placeholder: "0-100" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-brand-pasteur" /> Priorités de la période
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
            <PlusCircle className="h-3 w-3" /> Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {fiche.priorities.map((p: any) => {
          const pillar = HOSHIN_PILLARS.find((h) => h.id === p.pillarId);
          return (
            <div
              key={p.id}
              className="rounded-lg border p-3 hover:border-brand-pasteur/40 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 shrink-0 rounded-md bg-brand-pasteur text-white flex items-center justify-center font-display font-bold text-sm">
                  {p.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Badge variant={HORIZON_COLOR[p.horizon as keyof typeof HORIZON_COLOR]} className="text-[10px]">
                      Horizon {HORIZON_LABEL[p.horizon as keyof typeof HORIZON_LABEL]}
                    </Badge>
                    {pillar && (
                      <Badge variant="outline" className="text-[10px]">
                        {pillar.code} · {pillar.title}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm font-semibold mb-2">{p.description}</div>
                  <div className="flex items-center gap-3">
                    <Progress value={p.progress} className="h-1.5 flex-1" />
                    <span className="text-xs font-mono tabular font-bold text-brand-pasteur">
                      {p.progress}%
                    </span>
                  </div>
                </div>
                <RowActions
                  label={`Priorité P${p.num}`}
                  onEdit={() => setEditTarget(p)}
                  onRefresh={() => toast.info("Actualisation", `Recalcul de l'avancement de la priorité ${p.num} depuis les activités liées.`)}
                  onDelete={() => setDeleteTarget(p)}
                />
              </div>
            </div>
          );
        })}
      </CardContent>

      <EditModal
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        title="Modifier la priorité"
        description={`P${editTarget?.num} · §17.1.2 — Auto-save CRDT activée`}
        fields={priorityFields.map((f) => ({ ...f, defaultValue: editTarget?.[f.key] }))}
        onSave={(v) => toast.success("Priorité mise à jour", v.description?.slice(0, 60))}
      />
      <EditModal
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Ajouter une priorité"
        description="§17.1.2 — 3 à 5 priorités max par période"
        fields={priorityFields}
        onSave={(v) => toast.success("Priorité ajoutée", v.description?.slice(0, 60))}
      />
      <DeleteConfirm
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Supprimer cette priorité ?"
        description="Les activités rattachées resteront, mais ne seront plus liées à une priorité."
        itemLabel={deleteTarget?.description}
        onConfirm={() => {
          toast.danger("Priorité supprimée", `P${deleteTarget.num} — entrée audit log`);
          setDeleteTarget(null);
        }}
      />
    </Card>
  );
}

function SectionActivites({ fiche }: { fiche: any }) {
  const STATE_COLOR = {
    en_cours: "soft",
    completee: "soft-success",
    en_retard: "soft-danger",
  } as const;
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const activityFields: EditField[] = [
    { key: "title", label: "Intitulé de l'activité", type: "text", required: true },
    { key: "priorityId", label: "Priorité liée", type: "select", required: true, options: fiche.priorities.map((p: any) => ({ value: p.id, label: `P${p.num} — ${p.description.slice(0, 40)}` })) },
    { key: "state", label: "État", type: "select", required: true, options: [
      { value: "en_cours", label: "En cours" },
      { value: "completee", label: "Complétée" },
      { value: "en_retard", label: "En retard" },
    ]},
    { key: "progress", label: "Avancement (%)", type: "number", placeholder: "0-100" },
    { key: "ownerInitials", label: "Responsable (initiales)", type: "text", placeholder: "IF" },
    { key: "dueDate", label: "Échéance", type: "date" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Activités en cours</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
            <PlusCircle className="h-3 w-3" /> Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground border-b">
              <th className="py-2">Activité</th>
              <th className="py-2 px-2">Priorité</th>
              <th className="py-2 px-2">Statut</th>
              <th className="py-2 px-2 w-32">Avancement</th>
              <th className="py-2 px-2">Owner</th>
              <th className="py-2 px-2">Échéance</th>
              <th className="py-2 px-1 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {fiche.activities.map((a: any) => (
              <tr key={a.id} className="hover:bg-muted/40 group">
                <td className="py-2.5 pr-2 font-medium">{a.title}</td>
                <td className="py-2.5 px-2 text-muted-foreground">P{fiche.priorities.find((p:any)=>p.id===a.priorityId)?.num ?? "—"}</td>
                <td className="py-2.5 px-2">
                  <Badge variant={STATE_COLOR[a.state as keyof typeof STATE_COLOR]} className="text-[10px]">
                    {a.state.replace("_", " ")}
                  </Badge>
                </td>
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2">
                    <Progress value={a.progress} className="h-1.5 flex-1" />
                    <span className="text-[10px] font-mono w-8">{a.progress}%</span>
                  </div>
                </td>
                <td className="py-2.5 px-2 text-xs">{a.ownerInitials}</td>
                <td className="py-2.5 px-2 text-xs">
                  {new Date(a.dueDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                </td>
                <td className="py-2.5 px-1 text-right">
                  <RowActions
                    label={a.title.slice(0, 30)}
                    onEdit={() => setEditTarget(a)}
                    onRefresh={() => toast.info("Synchro PMS", `Activité ${a.title.slice(0,30)} re-synchronisée depuis MS Project.`)}
                    onDuplicate={() => toast.success("Activité dupliquée", `Copie de "${a.title.slice(0,40)}".`)}
                    onDelete={() => setDeleteTarget(a)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>

      <EditModal
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        title="Modifier l'activité"
        description="§17.1.3 — Une activité doit toujours être liée à une priorité"
        fields={activityFields.map((f) => ({ ...f, defaultValue: editTarget?.[f.key] }))}
        onSave={(v) => toast.success("Activité mise à jour", v.title?.slice(0, 60))}
      />
      <EditModal
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Ajouter une activité"
        description="§17.1.3 — Lier obligatoirement à une priorité"
        fields={activityFields}
        onSave={(v) => toast.success("Activité ajoutée", v.title?.slice(0, 60))}
      />
      <DeleteConfirm
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Supprimer cette activité ?"
        itemLabel={deleteTarget?.title}
        onConfirm={() => toast.danger("Activité supprimée", deleteTarget?.title?.slice(0, 60))}
      />
    </Card>
  );
}

function SectionKpis({ fiche }: { fiche: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Indicateurs de performance</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fiche.kpis.map((k: any, i: number) => (
          <div
            key={i}
            className={cn(
              "rounded-lg border-2 p-3",
              healthBorder[k.health as HealthColor],
              healthBgSoft[k.health as HealthColor]
            )}
          >
            <div className="text-xs font-semibold mb-2">{k.label}</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Cible</div>
                <div className="font-mono font-bold tabular">{k.target} {k.unit}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Réalisé</div>
                <div className={cn("font-mono font-bold tabular text-lg", healthText[k.health as HealthColor])}>{k.actual} {k.unit}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Écart</div>
                <div className="font-mono font-bold tabular">
                  {k.delta >= 0 ? "+" : ""}{k.delta} {k.unit}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SectionRisques({ risks }: { risks: any[] }) {
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const riskFields: EditField[] = [
    { key: "description", label: "Description du risque", type: "textarea", required: true },
    { key: "probability", label: "Probabilité (1-5)", type: "number", required: true, hint: "1 = très faible, 5 = quasi certaine" },
    { key: "impact", label: "Impact (1-5)", type: "number", required: true, hint: "1 = mineur, 5 = critique" },
    { key: "mitigation", label: "Action de mitigation", type: "textarea", required: true },
    { key: "ownerInitials", label: "Responsable (initiales)", type: "text" },
    { key: "dueDate", label: "Échéance de mitigation", type: "date" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Risques, défis et blocages</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
            <PlusCircle className="h-3 w-3" /> Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {risks.map((r) => (
          <div
            key={r.id}
            className={cn(
              "rounded-lg border p-3",
              r.level === "eleve"
                ? "border-feedback-danger/40 bg-feedback-danger/5"
                : r.level === "moyen"
                ? "border-feedback-warning/40 bg-feedback-warning/5"
                : ""
            )}
          >
            <div className="flex items-start gap-2">
              <AlertOctagon
                className={cn(
                  "h-4 w-4 shrink-0 mt-0.5",
                  r.level === "eleve" ? "text-feedback-danger" : r.level === "moyen" ? "text-feedback-warning" : "text-muted-foreground"
                )}
              />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-muted-foreground">{r.code}</span>
                  <Badge
                    variant={r.level === "eleve" ? "destructive" : r.level === "moyen" ? "warning" : "soft-success"}
                    className="text-[9px]"
                  >
                    {r.level.toUpperCase()}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    P={r.probability} × I={r.impact}
                  </span>
                </div>
                <div className="text-sm font-medium">{r.description}</div>
                <div className="text-xs text-muted-foreground">
                  <strong>Mitigation :</strong> {r.mitigation}
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Owner : {r.ownerInitials}</span>
                  <span>Échéance : {new Date(r.dueDate).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
              <RowActions
                label={r.code}
                onEdit={() => setEditTarget(r)}
                onRefresh={() => toast.info("Recalcul du score", `Score P×I=${r.probability * r.impact} mis à jour.`)}
                onDuplicate={() => toast.success("Risque dupliqué", `Copie de ${r.code}.`)}
                onDelete={() => setDeleteTarget(r)}
              />
            </div>
          </div>
        ))}
      </CardContent>

      <EditModal
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        title="Modifier le risque"
        description={`${editTarget?.code} · §17.1.5 — Un risque niveau Élevé doit avoir une action de mitigation`}
        fields={riskFields.map((f) => ({ ...f, defaultValue: editTarget?.[f.key] }))}
        onSave={(v) => toast.success("Risque mis à jour", v.description?.slice(0, 60))}
      />
      <EditModal
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Ajouter un risque"
        description="§17.1.5 — Probabilité × Impact détermine la criticité"
        fields={riskFields}
        onSave={(v) => toast.success("Risque ajouté", v.description?.slice(0, 60))}
      />
      <DeleteConfirm
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Supprimer ce risque ?"
        description="L'historique de mitigation sera conservé dans l'audit log."
        itemLabel={deleteTarget?.code + " — " + deleteTarget?.description?.slice(0, 60)}
        onConfirm={() => toast.danger("Risque supprimé", deleteTarget?.code)}
      />
    </Card>
  );
}

function SectionRoadmap({ fiche }: { fiche: any }) {
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const roadmapFields: EditField[] = [
    { key: "action", label: "Action", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea" },
    { key: "targetDate", label: "Date cible", type: "date", required: true },
    { key: "ownerInitials", label: "Responsable", type: "text" },
    { key: "status", label: "Statut", type: "select", required: true, options: [
      { value: "planifie", label: "Planifié" },
      { value: "en_cours", label: "En cours" },
      { value: "fait", label: "Fait" },
    ]},
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Feuille de route 2-4 semaines</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
            <PlusCircle className="h-3 w-3" /> Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {fiche.roadmap.map((r: any) => (
          <div key={r.id} className="rounded-lg border p-3 flex items-start gap-3">
            <div className="h-8 w-8 rounded-md bg-brand-pasteur/10 text-brand-pasteur flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{r.action}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{r.description}</div>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                <span>📅 {new Date(r.targetDate).toLocaleDateString("fr-FR")}</span>
                <span>👤 {r.ownerInitials}</span>
                <Badge variant="outline" className="text-[9px] uppercase">
                  {r.status}
                </Badge>
              </div>
            </div>
            <RowActions
              label={r.action.slice(0, 30)}
              onEdit={() => setEditTarget(r)}
              onDuplicate={() => toast.success("Étape dupliquée", r.action.slice(0, 50))}
              onDelete={() => setDeleteTarget(r)}
            />
          </div>
        ))}
      </CardContent>

      <EditModal
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        title="Modifier l'étape"
        description="§17.1.6 — Feuille de route à 2-4 semaines"
        fields={roadmapFields.map((f) => ({ ...f, defaultValue: editTarget?.[f.key] }))}
        onSave={(v) => toast.success("Étape mise à jour", v.action?.slice(0, 60))}
      />
      <EditModal
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Ajouter une étape"
        description="§17.1.6 — Action à 2-4 semaines"
        fields={roadmapFields}
        onSave={(v) => toast.success("Étape ajoutée", v.action?.slice(0, 60))}
      />
      <DeleteConfirm
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Supprimer cette étape ?"
        itemLabel={deleteTarget?.action}
        onConfirm={() => toast.danger("Étape supprimée", deleteTarget?.action?.slice(0, 60))}
      />
    </Card>
  );
}

function SectionEscalades({ escalades, onNew }: { escalades: any[]; onNew: () => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 text-feedback-danger" /> Demandes de soutien
            (escalades)
          </CardTitle>
          <Button variant="destructive" size="sm" onClick={onNew}>
            <PlusCircle className="h-3 w-3" /> Nouvelle escalade
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {escalades.length === 0 && (
          <div className="text-center py-6 text-sm text-muted-foreground">
            Aucune escalade pour cette entité.
          </div>
        )}
        {escalades.map((e) => (
          <div key={e.id} className="rounded-lg border p-3">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge
                variant={e.urgency === "haute" ? "destructive" : e.urgency === "moyenne" ? "warning" : "soft"}
                className="text-[10px]"
              >
                {e.urgency.toUpperCase()}
              </Badge>
              <span className="text-[10px] font-mono text-muted-foreground">{e.code}</span>
              <Badge variant="outline" className="text-[10px]">
                {e.status.replace("_", " ")}
              </Badge>
              <span className="ml-auto text-[10px] text-muted-foreground">
                Décision avant : {new Date(e.decisionExpectedBy).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div className="text-sm font-semibold mb-1">{e.title}</div>
            <div className="text-xs text-muted-foreground line-clamp-2">{e.description}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SectionNotes({ fiche }: { fiche: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Notes et recommandations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="Saisissez votre note… (mention @utilisateur, joindre des fichiers, ASKIA suggère des reformulations)"
          rows={4}
          defaultValue={fiche.notes[0]?.content ?? ""}
        />
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() =>
              toast.info("Outils de rédaction", "@mention · pièce jointe · suggestion ASKIA (démo).")
            }
          >
            <MessageCircle className="h-3 w-3" /> Mentionner @ · Pièce jointe · IA
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Note sauvegardée", "Auto-save CRDT activée.")}
          >
            Sauvegarder
          </Button>
        </div>

        {fiche.notes.length > 0 && (
          <div className="border-t pt-3 space-y-3">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
              Historique de cette section
            </div>
            {fiche.notes.map((n: any) => (
              <div key={n.id} className="rounded-md bg-muted/30 p-3 text-sm">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
                  <strong className="text-foreground">{n.author}</strong>
                  <span>·</span>
                  <span>{relativeTimeFR(n.date)}</span>
                </div>
                <div>{n.content}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SectionSignature({
  fiche,
  onSign,
  entity,
}: {
  fiche: any;
  onSign: () => void;
  entity: any;
}) {
  if (fiche.status === "SIGNED" && fiche.signedDirector && fiche.signedAG) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-feedback-success">
            <CheckCircle2 className="h-5 w-5" /> Document signé et intègre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignatureBlock
            label="Signature Directrice"
            signer={fiche.signedDirector}
            role={`Directrice — ${entity.name}`}
          />
          <SignatureBlock
            label="Signature AG"
            signer={fiche.signedAG}
            role="Administrateur Général · IPD"
          />
          <div className="text-[10px] text-muted-foreground text-center">
            Conformité eIDAS niveau 1 · Loi sénégalaise n°2008-08 · Hash SHA-256 dans audit log
            immuable
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileSignature className="h-4 w-4 text-brand-pasteur" /> Validation & signature
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border-2 border-dashed border-brand-pasteur/40 bg-brand-pasteur/5 p-6 text-center">
          <FileSignature className="h-10 w-10 mx-auto text-brand-pasteur mb-3" />
          <div className="font-semibold mb-1">Fiche prête à être signée</div>
          <div className="text-xs text-muted-foreground mb-4 max-w-md mx-auto">
            §21.3 — Chaîne de signature : Directrice d'abord, puis AG en fin de réunion.
            Signature électronique simple eIDAS niveau 1.
          </div>
          <Button variant="primary" onClick={onSign}>
            <Lock className="h-4 w-4" /> Valider et signer (MFA requis)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SignatureBlock({
  label,
  signer,
  role,
}: {
  label: string;
  signer: { name: string; initials: string; signedAt: string; hash: string };
  role: string;
}) {
  return (
    <div className="rounded-lg border-2 border-feedback-success/30 bg-feedback-success/5 p-4">
      <div className="flex items-center gap-3 mb-3">
        <CheckCircle2 className="h-4 w-4 text-feedback-success" />
        <div className="text-[10px] uppercase tracking-widest text-feedback-success font-semibold">
          {label}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-muted-foreground">Signataire</div>
          <div className="font-semibold">{signer.name}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Fonction</div>
          <div className="font-semibold">{role}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Horodatage UTC</div>
          <div className="font-mono text-[10px]">{signer.signedAt}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Hash SHA-256</div>
          <div className="font-mono text-[10px]">{signer.hash}</div>
        </div>
      </div>
    </div>
  );
}
