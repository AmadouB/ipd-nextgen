export type RiskLevel = "eleve" | "moyen" | "faible";
export type RiskStatus = "ouvert" | "mitige" | "ferme";

export interface Risk {
  id: string;
  code: string;
  projectId: string;
  description: string;
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  level: RiskLevel;
  status: RiskStatus;
  mitigation: string;
  owner: string;
  ownerInitials: string;
  dueDate: string;
}

function level(p: number, i: number): RiskLevel {
  const score = p * i;
  if (score >= 15) return "eleve";
  if (score >= 8) return "moyen";
  return "faible";
}

export const RISKS: Risk[] = [
  {
    id: "r1",
    code: "RSK-MAD-014",
    projectId: "madiba-2",
    description: "Rupture chaîne d'approvisionnement lyophilisateur (fournisseur unique en Allemagne)",
    probability: 4,
    impact: 5,
    level: level(4, 5),
    status: "ouvert",
    mitigation: "Identification d'un fournisseur secondaire en Inde + stock tampon 3 mois.",
    owner: "Ibrahima Faye",
    ownerInitials: "IF",
    dueDate: "2026-06-15",
  },
  {
    id: "r2",
    code: "RSK-MAD-011",
    projectId: "madiba-2",
    description: "Non-renouvellement de la certification BSL-3 phase 2",
    probability: 3,
    impact: 5,
    level: level(3, 5),
    status: "ouvert",
    mitigation: "Audit blanc programmé en juin, équipe qualité dédiée.",
    owner: "Khadija Sarr",
    ownerInitials: "KS",
    dueDate: "2026-06-30",
  },
  {
    id: "r3",
    code: "RSK-VAX-022",
    projectId: "fievre-jaune",
    description: "Délais d'engagement Achats > 12 semaines sur 3 fournisseurs critiques",
    probability: 4,
    impact: 3,
    level: level(4, 3),
    status: "mitige",
    mitigation: "Procédure d'AO simplifiée validée Conseil d'Administration.",
    owner: "Ousmane Kane",
    ownerInitials: "OK",
    dueDate: "2026-07-10",
  },
  {
    id: "r4",
    code: "RSK-ROU-005",
    projectId: "rougeole",
    description: "Retard d'agrément ANSM Sénégal sur lot pilote",
    probability: 3,
    impact: 4,
    level: level(3, 4),
    status: "ouvert",
    mitigation: "Lobbying institutionnel via Direction Médicale, dossier complet.",
    owner: "Aminata Ndour",
    ownerInitials: "AN",
    dueDate: "2026-06-25",
  },
  {
    id: "r5",
    code: "RSK-COV-009",
    projectId: "covid-19-pasteur",
    description: "Recrutement volontaires phase II — 30 % en dessous des objectifs",
    probability: 4,
    impact: 3,
    level: level(4, 3),
    status: "ouvert",
    mitigation: "Campagne de sensibilisation renforcée, partenariats CRTV/RTS.",
    owner: "Cheikh Diouf",
    ownerInitials: "CD",
    dueDate: "2026-07-05",
  },
  {
    id: "r6",
    code: "RSK-DTX-003",
    projectId: "dengue",
    description: "Délais validation ANSM kits diagnostic multiplex",
    probability: 3,
    impact: 3,
    level: level(3, 3),
    status: "ouvert",
    mitigation: "Soumission anticipée du dossier réglementaire.",
    owner: "Bineta Diallo",
    ownerInitials: "BD",
    dueDate: "2026-08-15",
  },
  {
    id: "r7",
    code: "RSK-RH-001",
    projectId: "formation-gmp",
    description: "Démissions formateurs experts GMP (3 départs en cours)",
    probability: 4,
    impact: 3,
    level: level(4, 3),
    status: "ouvert",
    mitigation: "Plan de rétention salariale + bonus, recrutement Pasteur Tunisie.",
    owner: "Tidiane Sarr",
    ownerInitials: "TS",
    dueDate: "2026-06-20",
  },
  {
    id: "r8",
    code: "RSK-QM-007",
    projectId: "audit-qms",
    description: "Conformité documentaire ISO 13485 insuffisante (gap analysis -22 %)",
    probability: 3,
    impact: 4,
    level: level(3, 4),
    status: "ouvert",
    mitigation: "Renfort consultant externe, sprint documentaire mai-juillet.",
    owner: "Khadija Sarr",
    ownerInitials: "KS",
    dueDate: "2026-07-31",
  },
];
