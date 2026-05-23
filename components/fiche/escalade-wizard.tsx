"use client";

import { useState } from "react";
import { AlertOctagon, Check, Bell, Mail, Smartphone, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const TYPES = [
  { key: "ressources", label: "Ressources", desc: "RH, équipements, budget temporaire" },
  { key: "approbation", label: "Approbation", desc: "Contrats, MoU, dépenses exceptionnelles" },
  { key: "decision", label: "Décision", desc: "Orientation stratégique, arbitrage" },
] as const;

const URGENCIES = [
  { key: "basse", label: "Basse", desc: "À traiter ce mois", color: "soft" },
  { key: "moyenne", label: "Moyenne", desc: "À traiter cette semaine", color: "soft-warning" },
  { key: "haute", label: "Haute", desc: "Décision sous 5 j max", color: "soft-danger" },
] as const;

export function EscaladeWizard({ open, onOpenChange }: Props) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<string>("");
  const [urgency, setUrgency] = useState<string>("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [sent, setSent] = useState(false);

  function reset() {
    setStep(1);
    setType("");
    setUrgency("");
    setTitle("");
    setDesc("");
    setSent(false);
  }

  function handleClose(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-feedback-danger" />
            Nouvelle demande de soutien (escalade)
          </DialogTitle>
          <DialogDescription>
            §17.1.7 — Workflow d'escalade vers le Cabinet AG.
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center gap-1 my-3">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "flex-1 h-1 rounded-full transition-colors",
                s <= step ? "bg-brand-pasteur" : "bg-muted"
              )}
            />
          ))}
        </div>

        {sent ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto h-14 w-14 rounded-full bg-feedback-success/15 flex items-center justify-center animate-fade-in">
              <Check className="h-7 w-7 text-feedback-success" />
            </div>
            <div className="font-display text-lg font-bold">Escalade envoyée au Cabinet</div>
            <div className="text-sm text-muted-foreground max-w-md mx-auto">
              {urgency === "haute" ? (
                <>
                  Notification <strong>push + email + SMS</strong> envoyée immédiatement à l'AG et au
                  Cabinet (ALT-001). Réponse attendue sous 1 h.
                </>
              ) : (
                <>
                  Le Cabinet a été notifié. Suivi disponible dans la page Escalades.
                </>
              )}
            </div>
            <Button onClick={() => handleClose(false)} className="mt-3">
              Fermer
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {step === 1 && (
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Étape 1 / 4 — Type de demande
                </div>
                {TYPES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setType(t.key)}
                    className={cn(
                      "w-full text-left rounded-lg border p-3 transition-all",
                      type === t.key
                        ? "border-brand-pasteur bg-brand-pasteur/5 shadow-sm"
                        : "hover:border-brand-pasteur/40"
                    )}
                  >
                    <div className="font-semibold text-sm">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Étape 2 / 4 — Description
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold">Titre court</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ex. Réallocation budgétaire CEPI → BMZ pour lyophilisateur"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold">Contexte détaillé</label>
                  <Textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Décrivez le contexte, les enjeux, les chiffres clés…"
                    rows={5}
                  />
                </div>
                <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground flex items-center justify-between">
                  <span>📎 Joindre pièces (PDF, image, .xlsx)</span>
                  <Button variant="outline" size="sm">
                    Parcourir
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Étape 3 / 4 — Niveau d'urgence
                </div>
                {URGENCIES.map((u) => (
                  <button
                    key={u.key}
                    onClick={() => setUrgency(u.key)}
                    className={cn(
                      "w-full text-left rounded-lg border p-3 transition-all",
                      urgency === u.key
                        ? "border-brand-pasteur bg-brand-pasteur/5 shadow-sm"
                        : "hover:border-brand-pasteur/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">{u.label}</div>
                        <div className="text-xs text-muted-foreground">{u.desc}</div>
                      </div>
                      <Badge variant={u.color as any}>{u.label.toUpperCase()}</Badge>
                    </div>
                  </button>
                ))}

                {urgency === "haute" && (
                  <div className="rounded-md bg-feedback-danger/5 border border-feedback-danger/30 p-3 text-xs animate-fade-in">
                    <div className="font-semibold text-feedback-danger mb-2 flex items-center gap-1.5">
                      <AlertOctagon className="h-3 w-3" /> Aperçu des notifications déclenchées
                    </div>
                    <div className="space-y-1 text-foreground">
                      <div className="flex items-center gap-2">
                        <Bell className="h-3 w-3 text-feedback-danger" /> AG · Cabinet — push
                        immédiat
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-feedback-danger" /> Email institutionnel IPD
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-3 w-3 text-feedback-danger" /> SMS Orange Sénégal
                        (ALT-001)
                      </div>
                    </div>
                    <div className="mt-2 text-muted-foreground">
                      SLA de réaction garanti : <strong>1 heure</strong>.
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Étape 4 / 4 — Date de décision attendue + impact
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold">Date de décision attendue</label>
                  <Input type="date" defaultValue="2026-05-28" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold">Impact si non-traité</label>
                  <Textarea
                    placeholder="Ex. Retard de 6 semaines minimum sur la production, pénalités estimées…"
                    rows={3}
                  />
                </div>
                <div className="rounded-md bg-brand-pasteur/5 border border-brand-pasteur/30 p-3 text-xs">
                  <div className="font-semibold mb-1">Récap avant envoi</div>
                  <div className="space-y-0.5 text-foreground">
                    <div>Type : <strong>{TYPES.find((t) => t.key === type)?.label}</strong></div>
                    <div>Urgence : <strong>{URGENCIES.find((u) => u.key === urgency)?.label}</strong></div>
                    <div>Titre : <strong>{title || "(non renseigné)"}</strong></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!sent && (
          <DialogFooter>
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Précédent
              </Button>
            )}
            {step < 4 && (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && !type) || (step === 3 && !urgency)}
                variant="primary"
              >
                Suivant
              </Button>
            )}
            {step === 4 && (
              <Button variant="primary" onClick={() => setSent(true)}>
                <FileText className="h-4 w-4" /> Envoyer au Cabinet
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
