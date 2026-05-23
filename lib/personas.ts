export type PersonaKey =
  | "ag"
  | "cabinet"
  | "pmo-strategique"
  | "directeur"
  | "pm"
  | "dsi";

export interface Persona {
  key: PersonaKey;
  label: string;
  shortLabel: string;
  fullName: string;
  function: string;
  initials: string;
  homeRoute: string;
  decisionMoment: string; // §9.4
  avatarColor: string;
}

export const PERSONAS: Record<PersonaKey, Persona> = {
  ag: {
    key: "ag",
    label: "Administrateur Général",
    shortLabel: "AG",
    fullName: "Dr. Amadou Sall",
    function: "Administrateur Général de l'IPD",
    initials: "AS",
    homeRoute: "/dashboard-ag",
    decisionMoment: "Sur quoi dois-je arbitrer aujourd'hui ?",
    avatarColor: "from-brand-nuit to-brand-pasteur",
  },
  cabinet: {
    key: "cabinet",
    label: "Cabinet AG",
    shortLabel: "Cabinet",
    fullName: "Aïssatou Diallo",
    function: "Chef de Cabinet de l'AG",
    initials: "AD",
    homeRoute: "/dashboard-cabinet",
    decisionMoment: "Quelles escalades préparer pour la réunion ?",
    avatarColor: "from-brand-pasteur to-brand-clair",
  },
  "pmo-strategique": {
    key: "pmo-strategique",
    label: "PMO Stratégique",
    shortLabel: "PMO",
    fullName: "Moustapha Ndiaye",
    function: "PMO Lead — Coordination portefeuille",
    initials: "MN",
    homeRoute: "/dashboard-cabinet",
    decisionMoment: "Quel pattern récurrent traiter en priorité ?",
    avatarColor: "from-feedback-success to-brand-pasteur",
  },
  directeur: {
    key: "directeur",
    label: "Directrice d'entité",
    shortLabel: "Directrice",
    fullName: "Pr. Fatou Diop",
    function: "Directrice — Vaccinopôle Diamniadio",
    initials: "FD",
    homeRoute: "/fiche/vaccinopole",
    decisionMoment: "Que dois-je dire à l'AG cette semaine ?",
    avatarColor: "from-feedback-warning to-feedback-danger",
  },
  pm: {
    key: "pm",
    label: "Chef de projet",
    shortLabel: "PM",
    fullName: "Ibrahima Faye",
    function: "Chef de projet — MADIBA-2",
    initials: "IF",
    homeRoute: "/dashboard-pm",
    decisionMoment: "Quel risque traiter en priorité ?",
    avatarColor: "from-brand-clair to-brand-pasteur",
  },
  dsi: {
    key: "dsi",
    label: "DSI / Admin",
    shortLabel: "DSI",
    fullName: "Ousmane Sow",
    function: "DSI IPD",
    initials: "OS",
    homeRoute: "/dashboard-ag",
    decisionMoment: "Console d'administration et de monitoring",
    avatarColor: "from-brand-nuit to-brand-noir",
  },
};

export const PERSONA_KEYS: PersonaKey[] = [
  "ag",
  "cabinet",
  "pmo-strategique",
  "directeur",
  "pm",
  "dsi",
];

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: number;
};

export function navForPersona(persona: PersonaKey): NavItem[] {
  const base: Record<PersonaKey, NavItem[]> = {
    ag: [
      { label: "Dashboard Exécutif", href: "/dashboard-ag", icon: "Crown" },
      { label: "Coordination", href: "/dashboard-cabinet", icon: "Network" },
      { label: "Escalades", href: "/escalades", icon: "AlertOctagon", badge: 3 },
      { label: "Fiches entités", href: "/mes-fiches", icon: "FileText" },
      { label: "Alertes", href: "/alertes", icon: "Bell", badge: 5 },
      { label: "ASKIA", href: "/askia", icon: "Sparkles" },
    ],
    cabinet: [
      { label: "Coordination", href: "/dashboard-cabinet", icon: "Network" },
      { label: "Dashboard AG", href: "/dashboard-ag", icon: "Crown" },
      { label: "Escalades", href: "/escalades", icon: "AlertOctagon", badge: 7 },
      { label: "Fiches entités", href: "/mes-fiches", icon: "FileText" },
      { label: "Alertes", href: "/alertes", icon: "Bell", badge: 12 },
      { label: "ASKIA", href: "/askia", icon: "Sparkles" },
    ],
    "pmo-strategique": [
      { label: "Coordination", href: "/dashboard-cabinet", icon: "Network" },
      { label: "Maturité PMO", href: "/dashboard-maturite", icon: "Gauge" },
      { label: "Escalades", href: "/escalades", icon: "AlertOctagon" },
      { label: "Fiches entités", href: "/mes-fiches", icon: "FileText" },
      { label: "Alertes", href: "/alertes", icon: "Bell", badge: 4 },
      { label: "ASKIA", href: "/askia", icon: "Sparkles" },
    ],
    directeur: [
      { label: "Ma fiche", href: "/fiche/vaccinopole", icon: "FileText" },
      { label: "Mes priorités", href: "/mes-fiches", icon: "Target" },
      { label: "Dashboard AG", href: "/dashboard-ag", icon: "Crown" },
      { label: "Alertes", href: "/alertes", icon: "Bell", badge: 2 },
      { label: "ASKIA", href: "/askia", icon: "Sparkles" },
    ],
    pm: [
      { label: "Mon projet", href: "/dashboard-pm", icon: "Briefcase" },
      { label: "Mes fiches", href: "/mes-fiches", icon: "FileText" },
      { label: "Coordination", href: "/dashboard-cabinet", icon: "Network" },
      { label: "Alertes", href: "/alertes", icon: "Bell", badge: 3 },
      { label: "ASKIA", href: "/askia", icon: "Sparkles" },
    ],
    dsi: [
      { label: "Dashboard AG", href: "/dashboard-ag", icon: "Crown" },
      { label: "Coordination", href: "/dashboard-cabinet", icon: "Network" },
      { label: "Maturité PMO", href: "/dashboard-maturite", icon: "Gauge" },
      { label: "Alertes", href: "/alertes", icon: "Bell" },
      { label: "ASKIA", href: "/askia", icon: "Sparkles" },
    ],
  };
  return base[persona];
}
