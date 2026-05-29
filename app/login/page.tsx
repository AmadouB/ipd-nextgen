"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Fingerprint, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/store/toast-store";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard-ag"), 800);
  }

  return (
    <div className="min-h-screen flex">
      {/* Pane gauche — branding gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-brand-clair/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-feedback-success/10 blur-3xl" />

        <div className="relative z-10">
          <Image
            src="/logo-ipd.png"
            alt="Institut Pasteur de Dakar"
            width={720}
            height={213}
            priority
            className="h-14 w-auto brightness-0 invert"
          />
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-feedback-success animate-pulse" />
            NextGen — Portail Exécutif
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="font-display text-3xl font-bold leading-tight">
            Pilotage en temps réel. Décisions justes, rapides, partagées.
          </div>
          <div className="text-sm text-white/80 italic">
            « Une institution qui pilote en temps réel est une institution qui décide juste,
            vite, et ensemble. »
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { v: "8", l: "Entités" },
              { v: "12", l: "Projets actifs" },
              { v: "8", l: "Bailleurs" },
            ].map((s) => (
              <div key={s.l} className="rounded-lg bg-white/10 backdrop-blur p-3">
                <div className="font-display text-2xl font-bold">{s.v}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[10px] text-white/60 space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3 w-3" /> Hébergement souverain Dakar · TLS 1.3 · MFA
            obligatoire
          </div>
          <div>Conforme loi sénégalaise n°2008-12 · RGPD · ISO 27001</div>
        </div>
      </div>

      {/* Pane droite — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden text-center mb-8">
            <Image
              src="/logo-ipd.png"
              alt="Institut Pasteur de Dakar"
              width={720}
              height={213}
              priority
              className="h-10 w-auto mx-auto"
            />
            <div className="font-display font-bold mt-2 text-xs uppercase tracking-widest text-muted-foreground">
              NextGen — Portail Exécutif
            </div>
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold">Bienvenue</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Connectez-vous avec votre compte IPD pour accéder à votre dashboard contextualisé.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold">Email professionnel</label>
              <Input
                type="email"
                defaultValue="isf@pasteur.sn"
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Mot de passe</label>
              <Input type="password" defaultValue="••••••••••" required className="mt-1" />
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked /> Rester connecté 8h
              </label>
              <button
                type="button"
                onClick={() =>
                  toast.info(
                    "Réinitialisation de mot de passe",
                    "Contactez la DSI IPD via dsi@pasteur.sn (démo)."
                  )
                }
                className="text-brand-pasteur hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? "Authentification…" : "Se connecter"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => {
              setLoading(true);
              toast.info("Redirection SSO IPD", "Authentification via Active Directory…");
              setTimeout(() => router.push("/dashboard-ag"), 1200);
            }}
          >
            <Lock className="h-4 w-4" /> Connexion SSO Active Directory IPD
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            size="sm"
            onClick={() =>
              toast.info(
                "WebAuthn requis",
                "Activez d'abord une clé Passkey dans vos paramètres IPD (démo)."
              )
            }
          >
            <Fingerprint className="h-4 w-4" /> Connexion biométrique (WebAuthn / Passkey)
          </Button>

          <div className="text-[10px] text-muted-foreground text-center">
            En vous connectant, vous acceptez la PSSI IPD et la politique de protection des
            données.
          </div>
        </div>
      </div>
    </div>
  );
}
