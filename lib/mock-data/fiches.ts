export type FicheStatus = "DRAFT" | "SUBMITTED" | "LOCKED" | "SIGNED";

export interface Priority {
  id: string;
  num: number;
  description: string;
  horizon: "court" | "moyen" | "long";
  pillarId: string;
  progress: number; // %
}

export interface Activity {
  id: string;
  title: string;
  priorityId: string;
  state: "en_cours" | "completee" | "en_retard";
  progress: number;
  owner: string;
  ownerInitials: string;
  dueDate: string;
}

export interface FicheKpi {
  label: string;
  target: number;
  actual: number;
  unit: string;
  delta: number;
  health: "green" | "amber" | "red";
}

export interface Note {
  id: string;
  content: string;
  author: string;
  authorInitials: string;
  date: string;
}

export interface RoadmapItem {
  id: string;
  action: string;
  description: string;
  targetDate: string;
  owner: string;
  ownerInitials: string;
  status: "planifie" | "en_cours" | "fait";
}

export interface Fiche {
  id: string;
  entityId: string;
  periodStart: string;
  periodEnd: string;
  status: FicheStatus;
  completeness: number; // 0-100
  lockedAt?: string;
  signedDirector?: { name: string; initials: string; signedAt: string; hash: string };
  signedAG?: { name: string; initials: string; signedAt: string; hash: string };
  priorities: Priority[];
  activities: Activity[];
  kpis: FicheKpi[];
  roadmap: RoadmapItem[];
  notes: Note[];
  meetingDate: string;
}

const MONDAY_NEXT = "2026-05-25";
const FRI_LOCK = "2026-05-22T17:00:00Z";

export const FICHES: Fiche[] = [
  {
    id: "f-vaccinopole-w21",
    entityId: "vaccinopole",
    periodStart: "2026-05-18",
    periodEnd: "2026-05-24",
    status: "DRAFT",
    completeness: 72,
    meetingDate: MONDAY_NEXT,
    priorities: [
      {
        id: "p1",
        num: 1,
        description: "Sécuriser la chaîne d'approvisionnement lyophilisateurs MADIBA-2",
        horizon: "court",
        pillarId: "souverainete",
        progress: 45,
      },
      {
        id: "p2",
        num: 2,
        description: "Préparer audit qualité WHO PQ fièvre jaune",
        horizon: "moyen",
        pillarId: "industrialisation",
        progress: 68,
      },
      {
        id: "p3",
        num: 3,
        description: "Recrutement et fidélisation des ingénieurs procédé",
        horizon: "moyen",
        pillarId: "capital-humain",
        progress: 32,
      },
      {
        id: "p4",
        num: 4,
        description: "Validation BSL-3 phase 2",
        horizon: "court",
        pillarId: "industrialisation",
        progress: 58,
      },
    ],
    activities: [
      { id: "a1", title: "Sourcing fournisseur secondaire lyo (Inde)", priorityId: "p1", state: "en_cours", progress: 60, owner: "Ibrahima Faye", ownerInitials: "IF", dueDate: "2026-06-10" },
      { id: "a2", title: "Négociation tarifaire Allemagne", priorityId: "p1", state: "en_retard", progress: 30, owner: "Pape Diouf", ownerInitials: "PD", dueDate: "2026-05-15" },
      { id: "a3", title: "Documentation procédé fièvre jaune", priorityId: "p2", state: "en_cours", progress: 75, owner: "Khadija Sarr", ownerInitials: "KS", dueDate: "2026-06-05" },
      { id: "a4", title: "Audit blanc qualité par consultant externe", priorityId: "p2", state: "en_cours", progress: 50, owner: "Khadija Sarr", ownerInitials: "KS", dueDate: "2026-05-30" },
      { id: "a5", title: "Plan rétention salariale finalisé", priorityId: "p3", state: "completee", progress: 100, owner: "Awa Ndiaye", ownerInitials: "AN", dueDate: "2026-05-18" },
      { id: "a6", title: "Sourcing Pasteur Tunisie — 4 candidats", priorityId: "p3", state: "en_cours", progress: 25, owner: "Awa Ndiaye", ownerInitials: "AN", dueDate: "2026-06-15" },
      { id: "a7", title: "Préparation dossier BSL-3 phase 2", priorityId: "p4", state: "en_cours", progress: 65, owner: "Boubacar Camara", ownerInitials: "BC", dueDate: "2026-05-28" },
    ],
    kpis: [
      { label: "Avancement portefeuille Vaccinopôle", target: 65, actual: 58, unit: "%", delta: -7, health: "amber" },
      { label: "Conformité documentaire ISO", target: 95, actual: 88, unit: "%", delta: -7, health: "amber" },
      { label: "Taux de rotation ingénieurs (mensuel)", target: 2, actual: 4.5, unit: "%", delta: 2.5, health: "red" },
      { label: "Budget consommé YTD", target: 60, actual: 60.5, unit: "%", delta: 0.5, health: "green" },
    ],
    roadmap: [
      { id: "rm1", action: "Validation BSL-3 phase 2", description: "Audit final ANSM + WHO PQ", targetDate: "2026-06-03", owner: "Khadija Sarr", ownerInitials: "KS", status: "en_cours" },
      { id: "rm2", action: "Signature contrat fournisseur secondaire", description: "Lyophilisateur Inde, garantie 5 ans", targetDate: "2026-06-12", owner: "Pape Diouf", ownerInitials: "PD", status: "planifie" },
      { id: "rm3", action: "Onboarding 2 ingénieurs procédé", description: "Pasteur Tunisie + interne", targetDate: "2026-06-20", owner: "Awa Ndiaye", ownerInitials: "AN", status: "planifie" },
    ],
    notes: [
      {
        id: "n1",
        content:
          "Point d'attention : le retard sur la négociation Allemagne génère un risque domino sur MADIBA-2. Une décision AG sur la réallocation budgétaire CEPI→BMZ est en cours d'instruction.",
        author: "Pr. Fatou Diop",
        authorInitials: "FD",
        date: "2026-05-22T09:30:00Z",
      },
    ],
  },
  {
    id: "f-madiba-w21",
    entityId: "madiba",
    periodStart: "2026-05-18",
    periodEnd: "2026-05-24",
    status: "SUBMITTED",
    completeness: 88,
    meetingDate: MONDAY_NEXT,
    priorities: [
      {
        id: "p1",
        num: 1,
        description: "Validation orientation partenariat Biological E (post-décision AG)",
        horizon: "court",
        pillarId: "souverainete",
        progress: 25,
      },
      {
        id: "p2",
        num: 2,
        description: "Préparer dossier industrialisation MADIBA-2 jalon Q3",
        horizon: "moyen",
        pillarId: "industrialisation",
        progress: 52,
      },
      {
        id: "p3",
        num: 3,
        description: "Audit bailleurs CEPI 12-14 juin",
        horizon: "court",
        pillarId: "excellence",
        progress: 67,
      },
    ],
    activities: [
      { id: "a1", title: "Signature MoU Biological E", priorityId: "p1", state: "en_cours", progress: 40, owner: "Mamadou Ba", ownerInitials: "MB", dueDate: "2026-06-10" },
      { id: "a2", title: "Validation jalon BSL-3", priorityId: "p2", state: "en_cours", progress: 60, owner: "Mamadou Ba", ownerInitials: "MB", dueDate: "2026-06-03" },
      { id: "a3", title: "Préparation salle visite CEPI", priorityId: "p3", state: "en_cours", progress: 70, owner: "Mamadou Ba", ownerInitials: "MB", dueDate: "2026-06-08" },
    ],
    kpis: [
      { label: "Avancement MADIBA-2", target: 50, actual: 41, unit: "%", delta: -9, health: "red" },
      { label: "Conformité documentation CEPI", target: 95, actual: 91, unit: "%", delta: -4, health: "amber" },
      { label: "Budget MADIBA-2 (CPI)", target: 1.0, actual: 0.83, unit: "", delta: -0.17, health: "red" },
    ],
    roadmap: [
      { id: "rm1", action: "Closing partenariat Biological E", description: "Validation juridique en cours", targetDate: "2026-06-15", owner: "Mamadou Ba", ownerInitials: "MB", status: "en_cours" },
      { id: "rm2", action: "Audit CEPI sur site", description: "12-14 juin 2026", targetDate: "2026-06-12", owner: "Mamadou Ba", ownerInitials: "MB", status: "planifie" },
    ],
    notes: [
      {
        id: "n1",
        content:
          "Décision AG du 19 mai retenue : partenariat Biological E pour accélérer la mise en service. Travaux juridiques engagés cette semaine.",
        author: "Dr. Mamadou Ba",
        authorInitials: "MB",
        date: "2026-05-21T14:00:00Z",
      },
    ],
  },
  {
    id: "f-diatropix-w21",
    entityId: "diatropix",
    periodStart: "2026-05-18",
    periodEnd: "2026-05-24",
    status: "SIGNED",
    completeness: 100,
    meetingDate: MONDAY_NEXT,
    lockedAt: FRI_LOCK,
    signedDirector: { name: "Dr. Aminata Sy", initials: "AS", signedAt: "2026-05-22T15:30:00Z", hash: "a3f7e9...b21c" },
    signedAG: { name: "Dr. Amadou Sall", initials: "AS", signedAt: "2026-05-25T11:48:00Z", hash: "e91d4c...7f8a" },
    priorities: [
      { id: "p1", num: 1, description: "Soumission ANSM Lassa Kit", horizon: "court", pillarId: "excellence", progress: 95 },
      { id: "p2", num: 2, description: "Validation kits dengue 4 serotypes", horizon: "moyen", pillarId: "excellence", progress: 70 },
      { id: "p3", num: 3, description: "Partenariat IRD diagnostic pédiatrique", horizon: "moyen", pillarId: "impact-societal", progress: 60 },
    ],
    activities: [
      { id: "a1", title: "Finalisation dossier ANSM Lassa", priorityId: "p1", state: "completee", progress: 100, owner: "Mariama Bâ", ownerInitials: "MB", dueDate: "2026-05-20" },
      { id: "a2", title: "Tests internes kits dengue lot 4", priorityId: "p2", state: "en_cours", progress: 75, owner: "Bineta Diallo", ownerInitials: "BD", dueDate: "2026-06-05" },
    ],
    kpis: [
      { label: "Conformité reporting EDCTP", target: 95, actual: 100, unit: "%", delta: 5, health: "green" },
      { label: "Cycle de validation interne", target: 21, actual: 18, unit: "jours", delta: -3, health: "green" },
    ],
    roadmap: [
      { id: "rm1", action: "Dépôt ANSM Lassa", description: "Soumission officielle 28 mai", targetDate: "2026-05-28", owner: "Mariama Bâ", ownerInitials: "MB", status: "en_cours" },
    ],
    notes: [],
  },
];

export function ficheByEntity(entityId: string): Fiche | undefined {
  return FICHES.find((f) => f.entityId === entityId);
}
