"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Filter,
  Moon,
  Sparkles,
  Sun,
  Download,
  Search,
  Command,
  FileText,
  FileSpreadsheet,
  Link2,
} from "lucide-react";
import { toast } from "@/lib/store/toast-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThemeStore } from "@/lib/store/theme-store";
import { useFilterStore } from "@/lib/store/filter-store";
import { useAskiaStore } from "@/lib/store/askia-store";
import { PersonaSwitcher } from "@/components/persona/persona-switcher";

const PERIODS = [
  { value: "week", label: "Cette semaine" },
  { value: "month", label: "Ce mois" },
  { value: "quarter", label: "Ce trimestre" },
  { value: "year", label: "Année en cours" },
] as const;

export function Topbar() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const period = useFilterStore((s) => s.period);
  const setPeriod = useFilterStore((s) => s.setPeriod);
  const openAskia = useAskiaStore((s) => s.open);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 md:px-8">
      <div className="flex-1 flex items-center gap-3">
        {/* Recherche */}
        <button
          onClick={openAskia}
          className="hidden md:flex items-center gap-2 px-3 h-9 w-72 rounded-md border bg-muted/30 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Rechercher ou demander à ASKIA…</span>
          <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
            <Command className="h-3 w-3" />K
          </kbd>
        </button>
      </div>

      {/* Période */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">
              {PERIODS.find((p) => p.value === period)?.label}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Période d'analyse</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {PERIODS.map((p) => (
            <DropdownMenuItem key={p.value} onClick={() => setPeriod(p.value)}>
              {p.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Export */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 hidden md:inline-flex">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Exporter cette vue</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => toast.success("Export PDF généré", "Téléchargement préparé (démo).")}
          >
            <FileText className="h-4 w-4 mr-2" /> Format PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => toast.success("Export Excel généré", "Données sous-jacentes incluses (démo).")}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Format Excel
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => toast.info("Lien partage créé", "Lien lecture seule copié dans le presse-papier (démo).")}
          >
            <Link2 className="h-4 w-4 mr-2" /> Lien partage
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ASKIA */}
      <Button variant="gradient" size="sm" onClick={openAskia} className="gap-2">
        <Sparkles className="h-4 w-4" />
        <span className="hidden sm:inline">ASKIA</span>
      </Button>

      {/* Theme */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label="Basculer le thème"
        className="h-9 w-9"
      >
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>

      <PersonaSwitcher />
    </header>
  );
}
