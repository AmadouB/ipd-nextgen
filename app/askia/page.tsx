"use client";

import { useState } from "react";
import { Sparkles, Send, FileText, Download, ShieldCheck } from "lucide-react";
import { toast } from "@/lib/store/toast-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/page-header";
import { usePersonaStore } from "@/lib/store/persona-store";
import { ASKIA_SUGGESTIONS, ASKIA_RESPONSES } from "@/lib/mock-data/askia";
import { PATTERNS } from "@/lib/mock-data/patterns";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AskiaPage() {
  const persona = usePersonaStore((s) => s.current);
  const suggestions = ASKIA_SUGGESTIONS[persona];
  const [messages, setMessages] = useState<
    { role: "user" | "askia"; content: string; respId?: string }[]
  >([]);
  const [input, setInput] = useState("");

  function askSuggestion(sugId: string) {
    const respKey = `${persona}_${sugId}`;
    const resp = ASKIA_RESPONSES[respKey];
    if (!resp) return;
    setMessages((m) => [
      ...m,
      { role: "user", content: resp.question },
      { role: "askia", content: resp.answer, respId: respKey },
    ]);
  }

  function submitFreeForm(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput("");
    // Heuristique simple : matcher la question utilisateur avec les suggestions du persona
    const match = suggestions.find((s) =>
      s.question.toLowerCase().includes(q.toLowerCase().slice(0, 8))
    );
    if (match) {
      askSuggestion(match.id);
      return;
    }
    // Sinon réponse générique mockée
    setMessages((m) => [
      ...m,
      { role: "user", content: q },
      {
        role: "askia",
        content:
          "Je n'ai pas trouvé de réponse directe à votre question dans les données disponibles (prototype). Essayez l'une des suggestions à droite, ou reformulez avec un mot-clé : MADIBA, Vaccinopôle, escalade, Hoshin, bailleur, jalon.",
      },
    ]);
  }

  return (
    <>
      <PageHeader
        eyebrow="Assistant IA · §22 · Souverain"
        title="ASKIA — votre copilote stratégique"
        subtitle="Répond en langage naturel à vos questions sur le portefeuille, génère des résumés, détecte des patterns. Toutes les sources sont citées."
        actions={
          <Badge variant="secondary" className="bg-white/15 text-white border-white/30">
            <ShieldCheck className="h-3 w-3 mr-1" />
            LLM Mistral — Souverain
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Chat */}
        <Card className="min-h-[60vh] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-pasteur" /> Conversation
              <Badge variant="soft-success" className="ml-auto text-[10px]">
                ● En ligne
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-hero flex items-center justify-center shadow-glow-brand">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div className="font-display text-lg font-bold">Bonjour 👋</div>
                <div className="text-sm text-muted-foreground max-w-md mx-auto">
                  Posez-moi une question sur le portefeuille, demandez un résumé, générez un
                  rapport. Toutes mes réponses citent leurs sources.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-2xl mx-auto pt-4">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => askSuggestion(s.id)}
                      className="text-left rounded-lg border bg-card p-3 text-xs hover:border-brand-pasteur hover:shadow-md transition-all"
                    >
                      {s.question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => {
              if (m.role === "user") {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-md bg-brand-pasteur text-white px-4 py-2.5 max-w-2xl">
                      <div className="text-sm">{m.content}</div>
                    </div>
                  </div>
                );
              }
              const resp = m.respId ? ASKIA_RESPONSES[m.respId] : null;
              return (
                <div key={i} className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-hero flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 max-w-2xl rounded-2xl rounded-tl-md bg-muted/40 px-4 py-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs">ASKIA</strong>
                      {resp && (
                        <span
                          className={cn(
                            "text-[10px] rounded-full px-2 py-0.5 font-mono",
                            resp.confidence >= 0.85
                              ? "bg-feedback-success/10 text-feedback-success"
                              : "bg-feedback-warning/10 text-feedback-warning"
                          )}
                        >
                          Confiance {Math.round(resp.confidence * 100)} %
                        </span>
                      )}
                    </div>
                    <div className="text-sm leading-relaxed space-y-2">
                      {m.content.split("\n").filter(Boolean).map((line, j) => (
                        <p
                          key={j}
                          dangerouslySetInnerHTML={{
                            __html: line
                              .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                              .replace(/\*(.+?)\*/g, "<em>$1</em>")
                              .replace(/^- /, "• ")
                              .replace(/^> /, "│ ")
                              .replace(/^(\d+)\. /, "<strong>$1.</strong> "),
                          }}
                        />
                      ))}
                    </div>
                    {resp && (
                      <div className="pt-2 border-t flex flex-wrap gap-1.5">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mr-1">
                          Sources :
                        </span>
                        {resp.sources.map((s, j) => (
                          <Link
                            key={j}
                            href={s.href}
                            className="inline-flex items-center gap-1 text-[11px] rounded-md bg-brand-pasteur/10 text-brand-pasteur px-2 py-1 hover:bg-brand-pasteur/20"
                          >
                            <FileText className="h-3 w-3" />
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>

          <div className="border-t p-3">
            <form onSubmit={submitFreeForm} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question…"
                className="flex-1 h-11 rounded-md border bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pasteur"
              />
              <Button type="submit" variant="primary" disabled={!input.trim()}>
                <Send className="h-4 w-4" /> Envoyer
              </Button>
            </form>
            <div className="text-[10px] text-muted-foreground mt-2 text-center">
              ASKIA propose, l'humain dispose. Aucune décision automatisée. Tous les prompts sont
              logués dans l'audit log (accès AG + DPO).
            </div>
          </div>
        </Card>

        {/* Sidebar suggestions + patterns */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Suggestions pour vous</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => askSuggestion(s.id)}
                  className="w-full text-left text-xs rounded-md p-2.5 border bg-card hover:border-brand-pasteur hover:bg-brand-pasteur/5 transition-all"
                >
                  {s.question}
                </button>
              ))}
              <Separator className="my-2" />
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() =>
                  toast.success(
                    "Rapport hebdomadaire généré",
                    "Brief AG · semaine S21 · 4 pages PDF (démo)."
                  )
                }
              >
                <Download className="h-3 w-3" /> Générer rapport hebdo (PDF)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-brand-pasteur" /> Patterns détectés
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {PATTERNS.slice(0, 4).map((p) => (
                <div key={p.id} className="rounded-md border p-2.5 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={p.urgency === "eleve" ? "destructive" : "soft-warning"}
                      className="text-[9px] py-0 h-4"
                    >
                      {p.urgency}
                    </Badge>
                    <span className="ml-auto text-[10px] font-mono text-muted-foreground">
                      {Math.round(p.confidence * 100)}%
                    </span>
                  </div>
                  <div className="font-semibold leading-tight">{p.title}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
