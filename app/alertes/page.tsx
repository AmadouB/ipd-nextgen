"use client";

import { useEffect, useState } from "react";
import {
  AlertOctagon,
  Bell,
  CheckCheck,
  Info,
  Mail,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { toast } from "@/lib/store/toast-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { ALERTS, alertCounts, type Alert } from "@/lib/mock-data/alerts";
import { cn, relativeTimeFR } from "@/lib/utils";
import { useDrillDownStore } from "@/lib/store/drilldown-store";

const CRITICALITY_META = {
  critique: {
    label: "Critique",
    color: "border-feedback-danger/40 bg-feedback-danger/5",
    iconColor: "text-feedback-danger",
    icon: AlertOctagon,
    badge: "destructive" as const,
  },
  importante: {
    label: "Importante",
    color: "border-feedback-warning/40 bg-feedback-warning/5",
    iconColor: "text-feedback-warning",
    icon: Bell,
    badge: "warning" as const,
  },
  information: {
    label: "Information",
    color: "border-border bg-muted/20",
    iconColor: "text-muted-foreground",
    icon: Info,
    badge: "soft" as const,
  },
};

const CHANNEL_ICON: Record<string, any> = {
  push: Bell,
  email: Mail,
  sms: Smartphone,
  teams: Sparkles,
};

export default function AlertesPage() {
  const [filter, setFilter] = useState<"all" | "critique" | "importante" | "information">("all");
  // État local des accusés de lecture (in-memory) — la source ALERTS est immuable
  const [acked, setAcked] = useState<Set<string>>(
    () => new Set(ALERTS.filter((a) => a.acknowledged).map((a) => a.id))
  );

  const filtered = ALERTS.filter((a) => filter === "all" || a.criticality === filter);
  const total = ALERTS.length;
  const unread = ALERTS.filter((a) => !acked.has(a.id)).length;
  const critiqueUnread = ALERTS.filter((a) => a.criticality === "critique" && !acked.has(a.id)).length;
  const importanteUnread = ALERTS.filter((a) => a.criticality === "importante" && !acked.has(a.id)).length;
  const informationUnread = ALERTS.filter((a) => a.criticality === "information" && !acked.has(a.id)).length;
  const counts = {
    total,
    unread,
    critique: critiqueUnread,
    importante: importanteUnread,
    information: informationUnread,
  };

  function markAllRead() {
    const newAcked = new Set(ALERTS.map((a) => a.id));
    setAcked(newAcked);
    toast.success("Toutes les alertes marquées comme lues", `${unread} alerte(s) accusée(s) de réception.`);
  }
  function ackOne(id: string) {
    setAcked((s) => new Set(s).add(id));
    toast.success("Alerte acquittée");
  }

  return (
    <>
      <PageHeader
        eyebrow="Centre d'alertes · §19 · ALT catalogue"
        title="Mes alertes & notifications"
        subtitle="Toutes les notifications multicanal (push, email, SMS, Teams). Configurez vos préférences par type d'alerte."
        actions={
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/15 text-white hover:bg-white/25"
            onClick={markAllRead}
            disabled={unread === 0}
          >
            <CheckCheck className="h-4 w-4" /> Tout marquer comme lu {unread > 0 && `(${unread})`}
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Stat label="Total" value={counts.total} color="text-brand-pasteur" />
        <Stat label="Non lues" value={counts.unread} color="text-brand-nuit" />
        <Stat label="Critiques" value={counts.critique} color="text-feedback-danger" />
        <Stat label="Importantes" value={counts.importante} color="text-feedback-warning" />
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">Toutes ({counts.total})</TabsTrigger>
          <TabsTrigger value="critique">Critique ({counts.critique})</TabsTrigger>
          <TabsTrigger value="importante">Importante ({counts.importante})</TabsTrigger>
          <TabsTrigger value="information">Information ({counts.information})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        {filtered.map((a) => (
          <AlertRow key={a.id} alert={a} isAcked={acked.has(a.id)} onAck={() => ackOne(a.id)} />
        ))}
      </div>
    </>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className={cn("text-3xl font-display font-bold tabular", color)}>{value}</div>
      </CardContent>
    </Card>
  );
}

function AlertRow({
  alert,
  isAcked,
  onAck,
}: {
  alert: Alert;
  isAcked: boolean;
  onAck: () => void;
}) {
  const meta = CRITICALITY_META[alert.criticality];
  const Icon = meta.icon;
  const openDrill = useDrillDownStore((s) => s.open);
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => openDrill({ type: "alert", alertId: alert.id })}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDrill({ type: "alert", alertId: alert.id });
        }
      }}
      className={cn(
        "border-l-4 transition-all hover:shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pasteur",
        meta.color,
        !isAcked && "shadow-sm",
        isAcked && "opacity-70"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", meta.color)}>
            <Icon className={cn("h-4 w-4", meta.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-mono text-muted-foreground">{alert.code}</span>
              <Badge variant={meta.badge} className="text-[10px]">
                {meta.label}
              </Badge>
              {!isAcked && (
                <span className="h-2 w-2 rounded-full bg-feedback-danger animate-pulse" />
              )}
              {isAcked && (
                <span className="text-[9px] uppercase tracking-widest text-feedback-success font-semibold">
                  ✓ Lu
                </span>
              )}
              <span className="text-[10px] text-muted-foreground ml-auto">
                {relativeTimeFR(alert.triggeredAt)}
              </span>
            </div>
            <div className="text-sm font-semibold leading-tight mb-1">{alert.title}</div>
            <div className="text-xs text-muted-foreground">{alert.message}</div>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
              <span>Source : {alert.source}</span>
              <span>·</span>
              <span>Destinataires : {alert.recipients.join(", ")}</span>
              <span>·</span>
              <div className="flex items-center gap-1">
                Canaux :
                {alert.channels.map((c) => {
                  const ChIcon = CHANNEL_ICON[c] ?? Bell;
                  return (
                    <span
                      key={c}
                      className="inline-flex items-center justify-center h-4 w-4 rounded bg-brand-pasteur/15 text-brand-pasteur"
                      title={c}
                    >
                      <ChIcon className="h-2.5 w-2.5" />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          {!isAcked && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={(e) => {
                e.stopPropagation();
                onAck();
              }}
            >
              Acquitter
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
