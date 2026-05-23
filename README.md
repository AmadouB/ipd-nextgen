# NextGen IPD — Portail Exécutif & Coordination Inter-Entités

> Prototype front-end haute-fidélité de la plateforme **NextGen IPD** spécifiée dans le Cahier des Charges V2.0 (23 mai 2026) de l'Institut Pasteur de Dakar.

## Vue d'ensemble

Plateforme institutionnelle multi-personae (Administrateur Général, Cabinet AG, PMO Stratégique, Directrice d'entité, Chef de projet, DSI) qui matérialise :

- **Lot 1 — 4 Dashboards** : Exécutif AG, Cabinet/PMO Coordination, Chef de Projet, Maturité PMO.
- **Lot 2 — Portail des Priorités hebdomadaires** : fiche entité 9 sections, wizard escalade, signature électronique mockée.
- **Lot 3 — Transverses** : Assistant ASKIA (chat IA avec sources citées), centre d'alertes multicanal.

## Stack

- **Next.js 15** + React 18 + TypeScript 5
- **Tailwind CSS 3** + tokens du design system IPD (palette §6.1)
- **shadcn/ui** + **Radix UI** primitives
- **Recharts**, **D3-force**, **Visx** pour les dataviz
- **Zustand** pour les stores globaux (persona, thème, filtres, toast, drill-down)
- **Framer Motion** pour les animations

## Lancer en local

```bash
npm install
npm run dev
# → http://localhost:3001
```

## Personae & navigation

Toggle persona en haut à droite. La sidebar et l'écran d'accueil se reconfigurent dynamiquement (§9.3 CdC).

| Persona | Écran d'accueil |
|---|---|
| Administrateur Général | Dashboard Exécutif AG |
| Cabinet AG | Cockpit Coordination + file escalades |
| PMO Stratégique | Coordination + Pattern Detection + Maturité |
| Directrice d'entité | Sa fiche entité de la semaine |
| Chef de projet | Dashboard projet (MADIBA-2) |
| DSI / Admin | Dashboard global + monitoring |

## Drill-down sur tous les visuels

Cliquez n'importe quel KPI, segment de donut, cellule de heatmap, projet treemap, barre bailleur, pilier Hoshin, jalon, escalade, alerte ou dimension maturité → un drawer latéral détaille la formule, les seuils, les composantes et l'historique.

## Conformité au Cahier des Charges

- ✅ Palette officielle IPD §6.1 (Bleu Pasteur, Bleu Nuit, Vert/Ambre/Rouge feedback)
- ✅ Logo officiel extrait de la charte graphique
- ✅ Typographie Poppins / Lato / JetBrains Mono §8
- ✅ WCAG 2.2 AA — contraste, focus, navigation clavier, prefers-reduced-motion §9.2
- ✅ Dark mode futuriste §7.5
- ✅ Mobile-first responsive + bottom nav §9.1
- ✅ 4 dashboards complets §12-15
- ✅ Fiche entité 9 sections §17
- ✅ Workflow hebdomadaire J-2 §18
- ✅ Catalogue 15 alertes §43
- ✅ ASKIA chat avec sources §22
- ✅ Signature simple eIDAS niveau 1 mockée §21
- ✅ Dataviz §23 — treemap, sankey, force graph, radar maturité, heatmap

Zones mockées (hors périmètre prototype, relèvent du back-end NestJS / Keycloak / vLLM / Yjs server selon le CdC) :

- Persistance, intégrations MS Project / Zoho / ERP / Grant Office
- Vrai LLM (réponses ASKIA scriptées)
- Vraie crypto signature
- MFA serveur réel
- Co-édition CRDT (présence simulée)

## Structure

```
app/                            # Next.js App Router
  dashboard-ag/                 # §12
  dashboard-cabinet/            # §13
  dashboard-pm/                 # §14
  dashboard-maturite/           # §15
  fiche/[entiteId]/             # §17 — 9 sections
  escalades/                    # pipeline Kanban
  alertes/                      # centre alertes
  askia/                        # cockpit chat
  mes-fiches/
  login/
components/
  drilldown/                    # panneau de détail commun
  charts/                       # toutes les viz
  fiche/                        # wizard escalade, signature
  kpi/                          # KPI cards
  layout/                       # sidebar, topbar, mobile, ASKIA flottant
  alerts/                       # bandeau critique
  persona/                      # switcher
  ui/                           # shadcn primitives
lib/
  mock-data/                    # entités, projets, bailleurs, KPI, alertes, fiches, escalades, risks, milestones, Hoshin, dependencies, maturity, patterns, ASKIA
  store/                        # Zustand: persona, thème, filtres, toast, drill-down, ASKIA
  utils.ts, personas.ts
```

## Capture rapide

- 10 routes statiques + 1 dynamique
- ~8 000 lignes TS/TSX
- 0 erreur, 0 warning runtime
- Lighthouse target ≥ 90 (§39.2)

## Crédits

- Cahier des Charges : Institut Pasteur de Dakar — Cabinet AG, mai 2026
- Charte graphique : IPD 2025
- Stack : Vercel, Anthropic Claude Code
