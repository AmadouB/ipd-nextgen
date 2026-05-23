"use client";

import { AlertTriangle, ArrowRight, Bell, X } from "lucide-react";
import Link from "next/link";
import { criticalUnread } from "@/lib/mock-data/alerts";
import { relativeTimeFR } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AlertBanner() {
  const alerts = criticalUnread();
  if (alerts.length === 0) return null;

  return (
    <div className="rounded-xl bg-gradient-alert text-white shadow-glow-danger overflow-hidden relative">
      <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_60%)]" />
      <div className="relative p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center animate-pulse-danger">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-display font-bold text-base">
              {alerts.length} alerte{alerts.length > 1 ? "s" : ""} critique{alerts.length > 1 ? "s" : ""} non traitée{alerts.length > 1 ? "s" : ""}
            </div>
            <div className="text-xs text-white/80">
              Décisions requises — voir détail dans le centre d'alertes
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10">
            <Link href="/alertes">
              Centre d'alertes <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {alerts.map((a) => (
            <Link
              key={a.id}
              href="/escalades"
              className="rounded-md bg-white/10 backdrop-blur hover:bg-white/20 transition-colors p-3 text-left"
            >
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest opacity-80 mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                {a.code} · {relativeTimeFR(a.triggeredAt)}
              </div>
              <div className="text-xs font-semibold leading-tight mb-1 line-clamp-2">
                {a.title}
              </div>
              <div className="text-[10px] opacity-80 line-clamp-2">{a.message}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
