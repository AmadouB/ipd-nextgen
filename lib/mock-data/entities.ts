export interface Entity {
  id: string;
  name: string;
  shortName: string;
  director: string;
  directorInitials: string;
  site: "Dakar" | "Diamniadio";
  type: "production" | "recherche" | "diagnostic" | "support" | "transverse";
  health: "green" | "amber" | "red";
  budget: number; // en millions FCFA
  budgetConsumed: number;
  staffCount: number;
}

export const ENTITIES: Entity[] = [
  {
    id: "vaccinopole",
    name: "Vaccinopôle Diamniadio",
    shortName: "Vaccinopôle",
    director: "Pr. Fatou Diop",
    directorInitials: "FD",
    site: "Diamniadio",
    type: "production",
    health: "amber",
    budget: 18500,
    budgetConsumed: 11200,
    staffCount: 320,
  },
  {
    id: "madiba",
    name: "MADIBA — Manufacturing in Africa for Disease Immunization",
    shortName: "MADIBA",
    director: "Dr. Mamadou Ba",
    directorInitials: "MB",
    site: "Diamniadio",
    type: "production",
    health: "red",
    budget: 24700,
    budgetConsumed: 9400,
    staffCount: 180,
  },
  {
    id: "diatropix",
    name: "Diatropix — Diagnostics tropicaux",
    shortName: "Diatropix",
    director: "Dr. Aminata Sy",
    directorInitials: "AS",
    site: "Dakar",
    type: "diagnostic",
    health: "green",
    budget: 6800,
    budgetConsumed: 4900,
    staffCount: 95,
  },
  {
    id: "grant-office",
    name: "Grant Office",
    shortName: "Grant Office",
    director: "Cheikh Anta Mbaye",
    directorInitials: "CM",
    site: "Dakar",
    type: "support",
    health: "green",
    budget: 1200,
    budgetConsumed: 820,
    staffCount: 18,
  },
  {
    id: "recherche",
    name: "Direction de la Recherche",
    shortName: "Recherche",
    director: "Pr. Awa Ndiaye",
    directorInitials: "AN",
    site: "Dakar",
    type: "recherche",
    health: "green",
    budget: 8400,
    budgetConsumed: 5100,
    staffCount: 145,
  },
  {
    id: "qualite",
    name: "Direction Qualité",
    shortName: "Qualité",
    director: "Dr. Khadija Sarr",
    directorInitials: "KS",
    site: "Diamniadio",
    type: "support",
    health: "amber",
    budget: 2100,
    budgetConsumed: 1380,
    staffCount: 42,
  },
  {
    id: "medicale",
    name: "Direction Médicale",
    shortName: "Médicale",
    director: "Pr. Boubacar Camara",
    directorInitials: "BC",
    site: "Dakar",
    type: "support",
    health: "green",
    budget: 3600,
    budgetConsumed: 2400,
    staffCount: 78,
  },
  {
    id: "industrielle",
    name: "Direction Industrielle",
    shortName: "Industrielle",
    director: "M. Pape Diouf",
    directorInitials: "PD",
    site: "Diamniadio",
    type: "transverse",
    health: "amber",
    budget: 5200,
    budgetConsumed: 3700,
    staffCount: 110,
  },
];
