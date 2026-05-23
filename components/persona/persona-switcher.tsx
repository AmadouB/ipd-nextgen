"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, UserCircle } from "lucide-react";
import { usePersonaStore } from "@/lib/store/persona-store";
import { PERSONAS, PERSONA_KEYS, type PersonaKey } from "@/lib/personas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PersonaSwitcher() {
  const current = usePersonaStore((s) => s.current);
  const setPersona = usePersonaStore((s) => s.setPersona);
  const router = useRouter();
  const personaObj = PERSONAS[current];

  function switchTo(k: PersonaKey) {
    setPersona(k);
    router.push(PERSONAS[k].homeRoute);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2 h-9">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-white font-semibold text-[11px]",
              personaObj.avatarColor
            )}
          >
            {personaObj.initials}
          </div>
          <span className="hidden md:inline text-sm">{personaObj.shortLabel}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2">
          <UserCircle className="h-4 w-4" />
          Démo — choisir un persona
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PERSONA_KEYS.map((k) => {
          const p = PERSONAS[k];
          const active = k === current;
          return (
            <DropdownMenuItem
              key={k}
              onClick={() => switchTo(k)}
              className={cn("gap-3 py-2 cursor-pointer", active && "bg-brand-pasteur/10")}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-white font-semibold text-xs",
                  p.avatarColor
                )}
              >
                {p.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold leading-tight">{p.label}</div>
                <div className="text-[11px] text-muted-foreground truncate">{p.function}</div>
              </div>
              {active && <span className="text-[10px] text-brand-pasteur font-bold">ACTIF</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
