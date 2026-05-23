"use client";

import { useEffect } from "react";
import { Sparkles, X, Send, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAskiaStore } from "@/lib/store/askia-store";
import { usePersonaStore } from "@/lib/store/persona-store";
import { ASKIA_SUGGESTIONS, ASKIA_RESPONSES } from "@/lib/mock-data/askia";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/store/toast-store";

export function AskiaFloating() {
  const isOpen = useAskiaStore((s) => s.isOpen);
  const open = useAskiaStore((s) => s.open);
  const close = useAskiaStore((s) => s.close);
  const persona = usePersonaStore((s) => s.current);
  const suggestions = ASKIA_SUGGESTIONS[persona];
  const [activeResp, setActiveResp] = useState<string | null>(null);
  const [input, setInput] = useState("");

  // ⌘K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        useAskiaStore.getState().toggle();
      }
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  if (!isOpen) {
    return (
      <button
        onClick={open}
        aria-label="Ouvrir ASKIA"
        className="fixed bottom-20 md:bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-hero shadow-glow-brand text-white flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Sparkles className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-feedback-success ring-2 ring-background animate-pulse" />
      </button>
    );
  }

  const response = activeResp ? ASKIA_RESPONSES[activeResp] : null;

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-50 md:max-w-md md:max-h-[80vh] md:w-[420px] md:h-[600px] bg-background md:rounded-2xl shadow-2xl border md:border md:flex flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-hero text-white flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="font-display font-semibold text-sm">ASKIA</div>
          <div className="text-[10px] text-white/70">
            Assistant intelligent · Souverain · Sources citées
          </div>
        </div>
        <Link
          href="/askia"
          onClick={close}
          className="text-white/70 hover:text-white text-xs"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
        <button onClick={close} aria-label="Fermer" className="text-white/70 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!response && (
          <>
            <div className="rounded-lg bg-brand-pasteur/5 border border-brand-pasteur/20 p-3">
              <div className="text-xs text-brand-pasteur font-semibold mb-1">
                Bonjour 👋
              </div>
              <div className="text-sm">
                Comment puis-je vous aider à piloter votre semaine ? Choisissez une suggestion
                ou tapez votre question.
              </div>
            </div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mt-4">
              Suggestions
            </div>
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveResp(`${persona}_${s.id}`)}
                className="w-full text-left rounded-lg border bg-card p-3 text-sm hover:border-brand-pasteur hover:shadow-sm transition-all"
              >
                {s.question}
              </button>
            ))}
          </>
        )}

        {response && (
          <div className="space-y-3">
            <div className="rounded-lg bg-muted/40 p-3 text-sm">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Votre question
              </div>
              {response.question}
            </div>
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-3 w-3 text-brand-pasteur" />
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  ASKIA
                </div>
                <div
                  className={cn(
                    "ml-auto text-[10px] rounded-full px-2 py-0.5 font-mono",
                    response.confidence >= 0.85
                      ? "bg-feedback-success/10 text-feedback-success"
                      : "bg-feedback-warning/10 text-feedback-warning"
                  )}
                >
                  Confiance {Math.round(response.confidence * 100)} %
                </div>
              </div>
              <div className="text-sm whitespace-pre-wrap leading-relaxed prose-sm">
                {response.answer.split("\n").map((line, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/^- /, '• ') }} />
                ))}
              </div>
              <div className="mt-3 pt-3 border-t flex flex-wrap gap-1.5">
                {response.sources.map((src, i) => (
                  <Link
                    key={i}
                    href={src.href}
                    onClick={close}
                    className="inline-flex items-center gap-1 text-[11px] rounded-md bg-brand-pasteur/10 text-brand-pasteur px-2 py-1 hover:bg-brand-pasteur/20"
                  >
                    <FileText className="h-3 w-3" />
                    {src.label}
                  </Link>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveResp(null)}
              className="text-xs"
            >
              ← Autres suggestions
            </Button>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = input.trim();
            if (!q) return;
            // Heuristique : match avec une suggestion ou fallback "1"
            const match = suggestions.find((s) =>
              s.question.toLowerCase().includes(q.toLowerCase().slice(0, 8))
            );
            setActiveResp(`${persona}_${match?.id ?? "1"}`);
            setInput("");
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question…"
            className="flex-1 h-10 rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pasteur"
          />
          <Button type="submit" size="icon" variant="primary" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <div className="text-[10px] text-muted-foreground mt-1.5 text-center">
          Toutes les réponses citent leurs sources. Aucune décision automatisée.
        </div>
      </div>
    </div>
  );
}
