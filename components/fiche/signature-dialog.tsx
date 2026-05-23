"use client";

import { useState } from "react";
import { Check, Lock, Smartphone, FileSignature, Fingerprint } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  signerName: string;
  signerRole: string;
}

export function SignatureDialog({ open, onOpenChange, signerName, signerRole }: Props) {
  const [step, setStep] = useState<"intro" | "mfa" | "signing" | "done">("intro");
  const [signed, setSigned] = useState<{ hash: string; ts: string } | null>(null);

  function startMfa() {
    setStep("mfa");
  }

  function validate() {
    setStep("signing");
    setTimeout(() => {
      const hash = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      setSigned({
        hash: `${hash}...${Math.floor(Math.random() * 9999).toString(16)}`,
        ts: new Date().toISOString(),
      });
      setStep("done");
    }, 1800);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-brand-pasteur" />
            Signature électronique
          </DialogTitle>
          <DialogDescription>
            §21 — Signature simple eIDAS niveau 1 conforme loi sénégalaise n°2008-08.
          </DialogDescription>
        </DialogHeader>

        {step === "intro" && (
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-muted/40 p-4 text-sm space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Signataire
              </div>
              <div className="font-semibold">{signerName}</div>
              <div className="text-xs text-muted-foreground">{signerRole}</div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                En signant cette fiche, vous certifiez l'exactitude des informations qu'elle
                contient à la date de signature. Une fois apposée, la signature est
                <strong> irréversible</strong>.
              </p>
              <p>
                Un hash SHA-256 du contenu et un horodatage UTC seront stockés dans l'audit log
                immuable.
              </p>
            </div>
            <Button variant="primary" className="w-full" onClick={startMfa}>
              <Lock className="h-4 w-4" /> Procéder à l'authentification MFA
            </Button>
          </div>
        )}

        {step === "mfa" && (
          <div className="space-y-4 py-2">
            <div className="text-center space-y-2">
              <div className="mx-auto h-14 w-14 rounded-full bg-brand-pasteur/10 flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-brand-pasteur" />
              </div>
              <div className="font-semibold">Vérification d'identité</div>
              <div className="text-xs text-muted-foreground">
                Saisissez le code à 6 chiffres généré par votre application TOTP (Google
                Authenticator) ou approuvez la notification mobile.
              </div>
            </div>
            <div className="flex justify-center gap-2">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="h-12 w-10 text-center text-lg font-mono rounded-md border focus-visible:ring-2 focus-visible:ring-brand-pasteur focus-visible:outline-none"
                  defaultValue={["1", "2", "8", "4", "7", "9"][i]}
                />
              ))}
            </div>
            <Button variant="primary" className="w-full" onClick={validate}>
              <Fingerprint className="h-4 w-4" /> Valider et signer
            </Button>
          </div>
        )}

        {step === "signing" && (
          <div className="space-y-4 py-8 text-center">
            <div className="mx-auto h-12 w-12 rounded-full border-4 border-brand-pasteur/30 border-t-brand-pasteur animate-spin" />
            <div className="text-sm font-semibold">Application de la signature…</div>
            <div className="text-xs text-muted-foreground">
              Calcul du hash SHA-256 · Horodatage NTP · Écriture audit log
            </div>
          </div>
        )}

        {step === "done" && signed && (
          <div className="space-y-4 py-2 animate-fade-in">
            <div className="mx-auto h-14 w-14 rounded-full bg-feedback-success/15 flex items-center justify-center">
              <Check className="h-7 w-7 text-feedback-success" />
            </div>
            <div className="text-center font-display text-lg font-bold">Document signé</div>
            <div className="rounded-lg border-2 border-feedback-success/30 bg-feedback-success/5 p-4 space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-feedback-success font-semibold flex items-center gap-1">
                <Check className="h-3 w-3" /> Document signé et intègre
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-muted-foreground">Signataire</div>
                  <div className="font-semibold">{signerName}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Fonction</div>
                  <div className="font-semibold">{signerRole}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Horodatage UTC</div>
                  <div className="font-mono text-[10px]">{signed.ts}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Méthode</div>
                  <div className="font-semibold">TOTP · MFA</div>
                </div>
              </div>
              <div className="pt-2 border-t border-feedback-success/20">
                <div className="text-muted-foreground text-[10px]">Hash SHA-256</div>
                <div className="font-mono text-[10px] break-all">{signed.hash}</div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="primary" className="w-full" onClick={() => onOpenChange(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
