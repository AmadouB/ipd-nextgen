"use client";

import { useToastStore } from "@/lib/store/toast-store";
import { CheckCircle2, Info, AlertTriangle, AlertOctagon, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON = {
  success: CheckCircle2,
  info: Sparkles,
  warning: AlertTriangle,
  danger: AlertOctagon,
  default: Info,
};

const VARIANT_STYLE = {
  success: "border-feedback-success/40 bg-feedback-success/5 text-foreground",
  info: "border-brand-pasteur/40 bg-brand-pasteur/5 text-foreground",
  warning: "border-feedback-warning/40 bg-feedback-warning/5 text-foreground",
  danger: "border-feedback-danger/40 bg-feedback-danger/5 text-foreground",
  default: "border-border bg-background text-foreground",
} as const;

const ICON_COLOR = {
  success: "text-feedback-success",
  info: "text-brand-pasteur",
  warning: "text-feedback-warning",
  danger: "text-feedback-danger",
  default: "text-muted-foreground",
} as const;

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="fixed bottom-20 md:bottom-6 left-6 z-[60] flex flex-col gap-2 pointer-events-none max-w-sm">
      {toasts.map((t) => {
        const Icon = ICON[t.variant];
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto rounded-lg border-l-4 bg-background shadow-lg p-3 pr-8 relative flex gap-3 animate-fade-in",
              VARIANT_STYLE[t.variant]
            )}
          >
            <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", ICON_COLOR[t.variant])} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold leading-tight">{t.title}</div>
              {t.description && (
                <div className="text-xs text-muted-foreground mt-1">{t.description}</div>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Fermer"
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
