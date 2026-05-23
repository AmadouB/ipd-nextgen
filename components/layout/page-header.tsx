"use client";

import { usePersonaStore } from "@/lib/store/persona-store";
import { PERSONAS } from "@/lib/personas";
import { formatDateFR } from "@/lib/utils";
import { Sparkle } from "lucide-react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  decisionMoment?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  decisionMoment,
  actions,
}: PageHeaderProps) {
  const persona = usePersonaStore((s) => s.current);
  const personaObj = PERSONAS[persona];
  const today = formatDateFR(new Date());

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-hero text-white p-6 md:p-8 shadow-md mb-6">
      <div className="absolute inset-0 opacity-20 mix-blend-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.5),transparent_40%)]" />
      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-clair/20 blur-3xl" />
      <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-feedback-success/20 blur-3xl" />

      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/70 font-semibold">
              <Sparkle className="h-3 w-3" />
              {eyebrow}
            </div>
          )}
          <h1 className="font-display text-2xl md:text-3xl font-bold leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-white/80 max-w-2xl">{subtitle}</p>}
          {decisionMoment && (
            <div className="mt-3 inline-flex items-center rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium">
              <span className="italic">« {decisionMoment} »</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="text-[10px] uppercase tracking-widest text-white/70">
            Bonjour {personaObj.fullName.split(" ").slice(-1)[0]}
          </div>
          <div className="text-sm text-white/90">{today}</div>
          {actions}
        </div>
      </div>
    </div>
  );
}
