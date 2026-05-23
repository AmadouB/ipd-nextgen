"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as Lucide from "lucide-react";
import { usePersonaStore } from "@/lib/store/persona-store";
import { navForPersona, PERSONAS } from "@/lib/personas";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const persona = usePersonaStore((s) => s.current);
  const items = navForPersona(persona);
  const personaObj = PERSONAS[persona];

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col border-r bg-gradient-ink dark:bg-ink-bg">
      {/* Logo / brand — logo officiel IPD, inversé pour fond Bleu Nuit */}
      <div className="flex h-20 items-center gap-3 px-5 border-b border-white/10">
        <Image
          src="/logo-ipd.png"
          alt="Institut Pasteur de Dakar"
          width={720}
          height={213}
          priority
          className="h-9 w-auto brightness-0 invert"
        />
        <div className="flex-1 min-w-0 pl-1 border-l border-white/15 ml-1">
          <div className="font-display text-[11px] font-semibold tracking-widest text-white/90 uppercase leading-tight">
            NextGen
          </div>
          <div className="text-[9px] text-brand-clair/90 leading-tight">v0.1 — Prototype</div>
        </div>
      </div>

      {/* Persona block */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="text-[10px] uppercase tracking-widest text-white/50 mb-2">
          Persona actif
        </div>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-white font-semibold text-sm shadow-glow-brand",
              personaObj.avatarColor
            )}
          >
            {personaObj.initials}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {personaObj.fullName}
            </div>
            <div className="text-[11px] text-white/60 truncate">{personaObj.function}</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href + "/"));
            const Icon = ((Lucide as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[
              item.icon
            ];
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-brand-pasteur text-white shadow-glow-brand"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" />}
                  <span className="flex-1 truncate">{item.label}</span>
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <Badge
                      variant={isActive ? "secondary" : "destructive"}
                      className={cn(
                        "h-5 min-w-5 justify-center px-1 text-[10px]",
                        isActive ? "bg-white/20 text-white" : ""
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-4 py-3 border-t border-white/10">
        <div className="text-[10px] text-white/40 leading-relaxed">
          v0.1 · 23 mai 2026
          <br />
          Hébergé Dakar — souverain
        </div>
      </div>
    </aside>
  );
}
