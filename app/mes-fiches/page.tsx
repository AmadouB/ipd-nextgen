"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, FileText, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { ENTITIES } from "@/lib/mock-data/entities";
import { FICHES } from "@/lib/mock-data/fiches";
import { cn, formatDateFR } from "@/lib/utils";

const STATUS_META = {
  DRAFT: { label: "Brouillon", color: "soft-warning", icon: FileText },
  SUBMITTED: { label: "Soumise", color: "soft", icon: Clock },
  LOCKED: { label: "Verrouillée", color: "soft-warning", icon: Lock },
  SIGNED: { label: "Signée", color: "soft-success", icon: CheckCircle2 },
} as const;

export default function MesFichesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Portail des priorités · Lot 2"
        title="Fiches entités — Semaine en cours"
        subtitle="Vue synthétique de toutes les fiches hebdomadaires des entités IPD. Cliquez pour ouvrir, co-éditer ou consulter l'historique."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {ENTITIES.map((e) => {
          const fiche = FICHES.find((f) => f.entityId === e.id);
          const meta = fiche ? STATUS_META[fiche.status] : null;
          const Icon = meta?.icon ?? FileText;

          return (
            <Card key={e.id} className="hover:shadow-md transition-all overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm">{e.shortName}</CardTitle>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {e.director} · {e.site}
                    </div>
                  </div>
                  {meta && (
                    <Badge variant={meta.color as any} className="text-[10px]">
                      <Icon className="h-3 w-3 mr-1" />
                      {meta.label}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {fiche ? (
                  <>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Complétude
                      </span>
                      <span className="font-mono tabular text-xs font-bold">
                        {fiche.completeness}%
                      </span>
                    </div>
                    <Progress
                      value={fiche.completeness}
                      className="h-1.5 mb-3"
                      indicatorClassName={cn(
                        fiche.completeness >= 90
                          ? "bg-feedback-success"
                          : fiche.completeness >= 70
                          ? "bg-brand-pasteur"
                          : "bg-feedback-warning"
                      )}
                    />
                    <div className="text-[10px] text-muted-foreground mb-3">
                      Période : {formatDateFR(fiche.periodStart)}
                      <br />
                      Réunion AG : {formatDateFR(fiche.meetingDate)}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/fiche/${e.id}`}>
                          Ouvrir <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-xs text-muted-foreground">
                    Pas de fiche cette semaine
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
