export type AlertCriticality = "critique" | "importante" | "information";

export interface Alert {
  id: string;
  code: string; // ALT-001 etc.
  title: string;
  message: string;
  source: string;
  criticality: AlertCriticality;
  channels: ("push" | "email" | "sms" | "teams")[];
  triggeredAt: string; // ISO
  acknowledged: boolean;
  recipients: string[];
  slaReactionH: number;
  relatedEntityId?: string;
  relatedProjectId?: string;
}

const now = Date.now();
const HOURS = 3600_000;

export const ALERTS: Alert[] = [
  {
    id: "a-001",
    code: "ALT-001",
    title: "Escalade urgence Haute — MADIBA-2",
    message:
      "Décision requise sur réallocation budgétaire urgente CEPI/BMZ — risque blocage chaîne d'approvisionnement lyophilisateur sous 5 jours.",
    source: "Pr. Fatou Diop (Vaccinopôle)",
    criticality: "critique",
    channels: ["push", "email", "sms"],
    triggeredAt: new Date(now - 2 * HOURS).toISOString(),
    acknowledged: false,
    recipients: ["AG", "Cabinet"],
    slaReactionH: 1,
    relatedEntityId: "madiba",
    relatedProjectId: "madiba-2",
  },
  {
    id: "a-002",
    code: "ALT-002",
    title: "Activité en retard > 15j — Plateforme rougeole",
    message:
      "Validation des spécifications techniques bouchon-stopper retardée de 18 jours. Impact bailleur Banque mondiale.",
    source: "PMS — MS Project",
    criticality: "critique",
    channels: ["push", "email"],
    triggeredAt: new Date(now - 6 * HOURS).toISOString(),
    acknowledged: false,
    recipients: ["AG", "Cabinet", "PM"],
    slaReactionH: 4,
    relatedProjectId: "rougeole",
  },
  {
    id: "a-003",
    code: "ALT-006",
    title: "Dépassement budgétaire > 10 % — Formation GMP",
    message:
      "Le programme de formation 500 techniciens dépasse de 14 % le budget engagé sur trimestre.",
    source: "ERP Finance",
    criticality: "critique",
    channels: ["push", "email"],
    triggeredAt: new Date(now - 18 * HOURS).toISOString(),
    acknowledged: false,
    recipients: ["PM", "Directeur", "Cabinet"],
    slaReactionH: 24,
    relatedProjectId: "formation-gmp",
  },
  {
    id: "a-004",
    code: "ALT-003",
    title: "Fiche entité non soumise — Direction Industrielle",
    message:
      "La fiche hebdomadaire n'a pas été soumise à J-2 17h00. Verrouillage automatique différé.",
    source: "Portail des priorités",
    criticality: "importante",
    channels: ["push", "email"],
    triggeredAt: new Date(now - 30 * HOURS).toISOString(),
    acknowledged: true,
    recipients: ["Directeur", "Cabinet"],
    slaReactionH: 24,
    relatedEntityId: "industrielle",
  },
  {
    id: "a-005",
    code: "ALT-008",
    title: "Livrable bailleur à risque — Rapport semestriel CEPI",
    message:
      "Le rapport semestriel CEPI doit être déposé dans 9 jours, complétude actuelle : 42 %.",
    source: "Grant Office",
    criticality: "critique",
    channels: ["push", "email"],
    triggeredAt: new Date(now - 4 * HOURS).toISOString(),
    acknowledged: false,
    recipients: ["PM", "Directeur", "Grant Office"],
    slaReactionH: 24,
    relatedProjectId: "madiba-2",
  },
  {
    id: "a-006",
    code: "ALT-004",
    title: "Risque Élevé sans mitigation > 7j — Diatropix Dengue",
    message:
      "Risque réglementaire ANSM Sénégal sans plan d'action depuis 9 jours.",
    source: "Registre risques",
    criticality: "importante",
    channels: ["push", "email"],
    triggeredAt: new Date(now - 50 * HOURS).toISOString(),
    acknowledged: false,
    recipients: ["Responsable", "PMO"],
    slaReactionH: 48,
    relatedProjectId: "dengue",
  },
  {
    id: "a-007",
    code: "ALT-005",
    title: "Jalon critique < 14j — MADIBA-2 validation BSL-3",
    message:
      "Le jalon 'Validation BSL-3 phase 2' arrive dans 11 jours, statut Ambre.",
    source: "PMS",
    criticality: "importante",
    channels: ["push", "email"],
    triggeredAt: new Date(now - 8 * HOURS).toISOString(),
    acknowledged: false,
    recipients: ["PM", "Directeur"],
    slaReactionH: 72,
    relatedProjectId: "madiba-2",
  },
  {
    id: "a-008",
    code: "ALT-007",
    title: "Pattern récurrent IA confirmé — Achats",
    message:
      "Le service Achats est cité dans 41 % des bloqueurs des 30 derniers jours, principalement sur les délais d'engagement.",
    source: "ASKIA — Pattern Detection",
    criticality: "information",
    channels: ["push"],
    triggeredAt: new Date(now - 24 * HOURS).toISOString(),
    acknowledged: false,
    recipients: ["PMO", "Cabinet"],
    slaReactionH: 168,
  },
  {
    id: "a-009",
    code: "ALT-011",
    title: "KPI projet vire au Rouge — MADIBA-2 SPI",
    message: "L'indice SPI du projet MADIBA-2 est passé sous 0,80 (0,78).",
    source: "PMS",
    criticality: "importante",
    channels: ["push", "email"],
    triggeredAt: new Date(now - 36 * HOURS).toISOString(),
    acknowledged: true,
    recipients: ["PM", "Directeur"],
    slaReactionH: 24,
    relatedProjectId: "madiba-2",
  },
  {
    id: "a-010",
    code: "ALT-009",
    title: "Modification post-verrouillage — Vaccinopôle",
    message:
      "Une dérogation Cabinet a été appliquée pour modifier la section 'Demandes de soutien' après verrouillage.",
    source: "Portail",
    criticality: "information",
    channels: ["push"],
    triggeredAt: new Date(now - 16 * HOURS).toISOString(),
    acknowledged: true,
    recipients: ["Cabinet"],
    slaReactionH: 0,
    relatedEntityId: "vaccinopole",
  },
  {
    id: "a-011",
    code: "ALT-017",
    title: "Signature AG appliquée — Fiche Diatropix",
    message: "L'AG a signé la fiche de la semaine du 18 mai 2026.",
    source: "Signature électronique",
    criticality: "information",
    channels: ["push", "email"],
    triggeredAt: new Date(now - 72 * HOURS).toISOString(),
    acknowledged: true,
    recipients: ["Directeur concerné"],
    slaReactionH: 0,
    relatedEntityId: "diatropix",
  },
  {
    id: "a-012",
    code: "ALT-013",
    title: "Tentative d'accès non autorisé",
    message:
      "3 tentatives de connexion échouées sur compte externe@example.com depuis IP 41.82.x.x.",
    source: "Keycloak",
    criticality: "critique",
    channels: ["email"],
    triggeredAt: new Date(now - 5 * HOURS).toISOString(),
    acknowledged: false,
    recipients: ["DSI", "DPO"],
    slaReactionH: 1,
  },
  {
    id: "a-013",
    code: "ALT-012",
    title: "Intégration Zoho en panne — 25 min",
    message:
      "L'intégration Zoho Projects ne répond plus depuis 25 minutes. Données 'dernière maj : il y a 25 min'.",
    source: "Monitoring",
    criticality: "importante",
    channels: ["push", "email"],
    triggeredAt: new Date(now - 0.5 * HOURS).toISOString(),
    acknowledged: false,
    recipients: ["DSI"],
    slaReactionH: 0.5,
  },
  {
    id: "a-014",
    code: "ALT-018",
    title: "Compte inactif > 90j",
    message: "3 comptes utilisateurs n'ont plus été utilisés depuis > 90 jours.",
    source: "IAM",
    criticality: "information",
    channels: ["email"],
    triggeredAt: new Date(now - 96 * HOURS).toISOString(),
    acknowledged: true,
    recipients: ["DSI", "Manager"],
    slaReactionH: 0,
  },
  {
    id: "a-015",
    code: "ALT-016",
    title: "Nouvelle entité créée — Bureau Innovation",
    message: "Une nouvelle entité 'Bureau Innovation IPD' a été créée.",
    source: "Admin",
    criticality: "information",
    channels: ["email"],
    triggeredAt: new Date(now - 7 * 24 * HOURS).toISOString(),
    acknowledged: true,
    recipients: ["Cabinet"],
    slaReactionH: 0,
  },
];

export function alertCounts() {
  return {
    critique: ALERTS.filter((a) => a.criticality === "critique" && !a.acknowledged).length,
    importante: ALERTS.filter((a) => a.criticality === "importante" && !a.acknowledged).length,
    information: ALERTS.filter((a) => a.criticality === "information" && !a.acknowledged).length,
    total: ALERTS.length,
    unread: ALERTS.filter((a) => !a.acknowledged).length,
  };
}

export function criticalUnread(): Alert[] {
  return ALERTS.filter((a) => a.criticality === "critique" && !a.acknowledged).slice(0, 3);
}
