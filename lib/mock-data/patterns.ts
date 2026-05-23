export interface PatternInsight {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  confidence: number; // 0-1
  urgency: "faible" | "moyen" | "eleve";
  sources: { id: string; label: string; href: string }[];
  validated: "validated" | "rejected" | "pending";
}

export const PATTERNS: PatternInsight[] = [
  {
    id: "ptn-001",
    title: "Service Achats — facteur récurrent de bloqueurs (41 %)",
    description:
      "Sur les 30 derniers jours, 41 % des bloqueurs projet sont liés au service Achats, principalement sur les délais d'engagement (> 8 semaines en moyenne vs cible 4 semaines).",
    recommendation:
      "Évaluer la procédure d'AO simplifiée, renforcer l'équipe Achats GMP de 2 ETP temporaires, mettre en place un binôme Achats-PM par projet stratégique.",
    confidence: 0.91,
    urgency: "eleve",
    sources: [
      { id: "s1", label: "Registre bloqueurs (47 entrées)", href: "/escalades" },
      { id: "s2", label: "Fiche Vaccinopôle S20-21", href: "/fiche/vaccinopole" },
      { id: "s3", label: "Fiche MADIBA S20-21", href: "/fiche/madiba" },
    ],
    validated: "validated",
  },
  {
    id: "ptn-002",
    title: "Cluster d'escalades 'Ressources humaines' — Vaccinopôle/MADIBA",
    description:
      "Depuis 60 jours, 8 escalades 'Ressources' ont été déposées par Vaccinopôle et MADIBA, contre 1 sur l'ensemble des autres entités. Tendance haussière.",
    recommendation:
      "Lancer une analyse de causes profondes sur la rétention dans les fonctions GMP, avec DRH et Direction Industrielle.",
    confidence: 0.86,
    urgency: "eleve",
    sources: [
      { id: "s1", label: "9 escalades RH catégorisées", href: "/escalades" },
      { id: "s2", label: "Données SIRH (export Q1-Q2)", href: "#" },
    ],
    validated: "pending",
  },
  {
    id: "ptn-003",
    title: "Corrélation jalons WHO PQ ↔ retards Qualité",
    description:
      "Les 3 derniers retards de jalons WHO PQ (Fièvre jaune, Rougeole, MADIBA-2) ont été précédés systématiquement (J-15) par un retard documentaire Qualité.",
    recommendation:
      "Anticiper la mobilisation Qualité dès J-30 sur tout jalon WHO PQ, intégrer un check Qualité dans le RACI plan-projet standard.",
    confidence: 0.78,
    urgency: "moyen",
    sources: [
      { id: "s1", label: "Historique jalons WHO PQ", href: "#" },
      { id: "s2", label: "Audit qualité documentaire 2026-Q1", href: "#" },
    ],
    validated: "pending",
  },
  {
    id: "ptn-004",
    title: "Reporting BMZ — risque récurrent de non-conformité",
    description:
      "Le canevas reporting BMZ est rendu en moyenne 6,3 jours en retard sur les 3 derniers cycles. Cause racine identifiée : workflow d'approbation interne.",
    recommendation:
      "Simplifier le workflow Grant Office → Cabinet : 2 niveaux au lieu de 4, validation parallèle.",
    confidence: 0.82,
    urgency: "moyen",
    sources: [
      { id: "s1", label: "Historique livrables BMZ", href: "#" },
      { id: "s2", label: "Process Map Grant Office", href: "#" },
    ],
    validated: "pending",
  },
  {
    id: "ptn-005",
    title: "Co-édition fiche entité — 4 utilisateurs en moyenne par fiche",
    description:
      "Les fiches Vaccinopôle, MADIBA et Recherche mobilisent en moyenne 4-6 co-éditeurs sur la phase de saisie. Indicateur positif de collaboration.",
    recommendation:
      "Capitaliser comme bonne pratique à diffuser via la formation 'NextGen IPD Power User'.",
    confidence: 0.94,
    urgency: "faible",
    sources: [{ id: "s1", label: "Logs de co-édition mai 2026", href: "#" }],
    validated: "validated",
  },
];
