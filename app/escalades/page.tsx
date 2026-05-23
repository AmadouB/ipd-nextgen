"use client";

import { useState } from "react";
import {
  AlertOctagon,
  Filter,
  Plus,
  Search,
  Users,
  Calendar,
  Paperclip,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { EscaladeWizard } from "@/components/fiche/escalade-wizard";
import {
  ESCALADES,
  ESCALADE_STATUS_LABELS,
  type EscaladeStatus,
} from "@/lib/mock-data/escalades";
import { ENTITIES } from "@/lib/mock-data/entities";
import { cn, relativeTimeFR } from "@/lib/utils";
import { useDrillDownStore } from "@/lib/store/drilldown-store";
import { toast } from "@/lib/store/toast-store";

const KANBAN_COLUMNS: EscaladeStatus[] = [
  "nouveau",
  "qualifie",
  "preparation_ag",
  "decide",
  "clos",
];

export default function EscaladesPage() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const openDrill = useDrillDownStore((s) => s.open);

  const filtered = ESCALADES.filter(
    (e) =>
      e.title.toLowerCase().includes(q.toLowerCase()) ||
      e.code.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <PageHeader
        eyebrow="Pipeline d'escalades · §13.2.6"
        title="File d'escalades — pipeline Kanban"
        subtitle="Coordination des demandes de soutien entre directions, Cabinet et AG. SLA de résolution surveillé en continu."
      />

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre ou code…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast.info(
              "Filtres avancés",
              "Par urgence / type / entité / période / responsable (démo)."
            )
          }
        >
          <Filter className="h-4 w-4" /> Filtres
        </Button>
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Nouvelle escalade
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          <div className="grid grid-cols-5 gap-3 min-w-[1100px]">
            {KANBAN_COLUMNS.map((status) => {
              const items = filtered.filter((e) => e.status === status);
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between px-1 pb-2 border-b">
                    <div className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
                      {ESCALADE_STATUS_LABELS[status]}
                    </div>
                    <Badge variant="outline" className="text-[10px] h-5">
                      {items.length}
                    </Badge>
                  </div>
                  <div className="space-y-2 min-h-32">
                    {items.length === 0 && (
                      <div className="rounded-md border border-dashed bg-muted/20 p-4 text-[10px] text-center text-muted-foreground">
                        Vide
                      </div>
                    )}
                    {items.map((e) => {
                      const entity = ENTITIES.find((en) => en.id === e.entityId);
                      return (
                        <button
                          key={e.id}
                          onClick={() => openDrill({ type: "escalade", escaladeId: e.id })}
                          className={cn(
                            "block w-full text-left rounded-md border bg-card p-3 text-xs space-y-2 shadow-sm hover:shadow-md hover:border-brand-pasteur/40 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pasteur",
                            e.urgency === "haute" && "border-l-4 border-l-feedback-danger"
                          )}
                        >
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge
                              variant={
                                e.urgency === "haute"
                                  ? "destructive"
                                  : e.urgency === "moyenne"
                                  ? "warning"
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
                          <div className="text-[10px] text-muted-foreground line-clamp-2">
                            {e.description}
                          </div>
                          <div className="border-t pt-2 flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-1">
                              <div className="h-5 w-5 rounded-full bg-gradient-hero text-white flex items-center justify-center font-bold text-[9px]">
                                {e.submittedInitials}
                              </div>
                              <span className="text-muted-foreground truncate">
                                {entity?.shortName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {e.attachments > 0 && (
                                <span className="flex items-center gap-0.5 text-muted-foreground">
                                  <Paperclip className="h-3 w-3" /> {e.attachments}
                                </span>
                              )}
                              <span className="text-muted-foreground">
                                {relativeTimeFR(e.submittedAt)}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <EscaladeWizard open={open} onOpenChange={setOpen} />
    </>
  );
}
