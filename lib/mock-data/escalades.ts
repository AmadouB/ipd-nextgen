export type EscaladeStatus =
  | "nouveau"
  | "qualifie"
  | "preparation_ag"
  | "decide"
  | "clos";

export type EscaladeType = "ressources" | "approbation" | "decision";
export type EscaladeUrgency = "haute" | "moyenne" | "basse";

export interface Escalade {
  id: string;
  code: string;
  title: string;
  description: string;
  type: EscaladeType;
  urgency: EscaladeUrgency;
  status: EscaladeStatus;
  entityId: string;
  submittedBy: string;
  submittedInitials: string;
  submittedAt: string;
  decisionExpectedBy: string;
  impactIfUnresolved: string;
  attachments: number;
}

const now = Date.now();
const DAYS = 86_400_000;
function isoDaysAgo(d: number) {
  return new Date(now - d * DAYS).toISOString();
}
function isoDaysAhead(d: number) {
  return new Date(now + d * DAYS).toISOString();
}

export const ESCALADES: Escalade[] = [
  {
    id: "esc-001",
    code: "ESC-2026-038",
    title: "Réallocation budgétaire CEPI → BMZ pour lyophilisateur MADIBA-2",
    description:
      "Le fournisseur a augmenté ses tarifs de 18 %. Demande de réallocation de 320 M FCFA depuis la ligne formation CEPI vers la ligne équipement BMZ pour ne pas retarder la livraison Q3.",
    type: "decision",
    urgency: "haute",
    status: "preparation_ag",
    entityId: "madiba",
    submittedBy: "Dr. Mamadou Ba",
    submittedInitials: "MB",
    submittedAt: isoDaysAgo(0.1),
    decisionExpectedBy: isoDaysAhead(3),
    impactIfUnresolved:
      "Retard de 6 semaines minimum sur la production, pénalités CEPI estimées à 180 M FCFA.",
    attachments: 4,
  },
  {
    id: "esc-002",
    code: "ESC-2026-037",
    title: "Recrutement urgent 4 ingénieurs procédé GMP",
    description:
      "Démissions en cascade au Vaccinopôle. Demande d'autorisation exceptionnelle de recrutement direct sans procédure d'AO RH (gain estimé : 8 semaines).",
    type: "ressources",
    urgency: "haute",
    status: "qualifie",
    entityId: "vaccinopole",
    submittedBy: "Pr. Fatou Diop",
    submittedInitials: "FD",
    submittedAt: isoDaysAgo(0.5),
    decisionExpectedBy: isoDaysAhead(5),
    impactIfUnresolved:
      "Risque arrêt ligne fièvre jaune sous 10 semaines, pénalités bailleurs CEPI et État du Sénégal.",
    attachments: 2,
  },
  {
    id: "esc-003",
    code: "ESC-2026-036",
    title: "Approbation contrat de R&D avec ITM Antwerp",
    description:
      "Partenariat de recherche VIH avec Institute of Tropical Medicine d'Anvers, montant 480 K€ sur 24 mois.",
    type: "approbation",
    urgency: "moyenne",
    status: "preparation_ag",
    entityId: "recherche",
    submittedBy: "Pr. Awa Ndiaye",
    submittedInitials: "AN",
    submittedAt: isoDaysAgo(1.2),
    decisionExpectedBy: isoDaysAhead(7),
    impactIfUnresolved:
      "Perte de la fenêtre EDCTP de soumission Q3, report d'un an du démarrage.",
    attachments: 3,
  },
  {
    id: "esc-004",
    code: "ESC-2026-035",
    title: "Achat licence logicielle CDS pour études cliniques",
    description:
      "Renouvellement licence Medidata Rave pour études Diatropix Dengue et Lassa Kit, 92 K€/an.",
    type: "approbation",
    urgency: "moyenne",
    status: "nouveau",
    entityId: "diatropix",
    submittedBy: "Dr. Aminata Sy",
    submittedInitials: "AS",
    submittedAt: isoDaysAgo(0.2),
    decisionExpectedBy: isoDaysAhead(10),
    impactIfUnresolved:
      "Interruption collecte données cliniques sous 30 jours.",
    attachments: 1,
  },
  {
    id: "esc-005",
    code: "ESC-2026-034",
    title: "Validation orientation stratégique — souveraineté lyophilisation",
    description:
      "Choix entre investissement interne Diamniadio (2 ans, 3,8 Mds FCFA) vs partenariat avec Biological E (12 mois, 1,4 Mds FCFA + clause).",
    type: "decision",
    urgency: "haute",
    status: "decide",
    entityId: "madiba",
    submittedBy: "Dr. Mamadou Ba",
    submittedInitials: "MB",
    submittedAt: isoDaysAgo(4),
    decisionExpectedBy: isoDaysAgo(1),
    impactIfUnresolved:
      "Décidé : option partenariat retenue par AG le 19 mai 2026.",
    attachments: 6,
  },
  {
    id: "esc-006",
    code: "ESC-2026-033",
    title: "Mise à disposition labo BSL-3 pour étude Lassa",
    description:
      "Demande de partage de créneaux du laboratoire BSL-3 entre Diatropix et la Direction Recherche.",
    type: "ressources",
    urgency: "moyenne",
    status: "clos",
    entityId: "diatropix",
    submittedBy: "Dr. Aminata Sy",
    submittedInitials: "AS",
    submittedAt: isoDaysAgo(8),
    decisionExpectedBy: isoDaysAgo(3),
    impactIfUnresolved: "Clos — Accord trouvé avec planning partagé.",
    attachments: 2,
  },
  {
    id: "esc-007",
    code: "ESC-2026-032",
    title: "Approbation MoU avec Africa CDC",
    description:
      "Memorandum of Understanding sur la coordination régionale Surveillance épidémiologique.",
    type: "approbation",
    urgency: "basse",
    status: "qualifie",
    entityId: "medicale",
    submittedBy: "Pr. Boubacar Camara",
    submittedInitials: "BC",
    submittedAt: isoDaysAgo(2),
    decisionExpectedBy: isoDaysAhead(14),
    impactIfUnresolved: "Décalage de la signature MoU au prochain trimestre.",
    attachments: 1,
  },
];

export const ESCALADE_STATUS_LABELS: Record<EscaladeStatus, string> = {
  nouveau: "Nouveau",
  qualifie: "Qualifié",
  preparation_ag: "Préparation AG",
  decide: "Décidé",
  clos: "Clos",
};

export const ESCALADE_STATUS_COLORS: Record<EscaladeStatus, string> = {
  nouveau: "bg-feedback-info/10 text-feedback-info border-feedback-info/30",
  qualifie: "bg-brand-clair/20 text-brand-nuit border-brand-clair/40",
  preparation_ag: "bg-feedback-warning/15 text-feedback-warning border-feedback-warning/40",
  decide: "bg-feedback-success/15 text-feedback-success border-feedback-success/40",
  clos: "bg-muted text-muted-foreground border-border",
};

export const URGENCY_LABEL: Record<EscaladeUrgency, string> = {
  haute: "Urgence Haute",
  moyenne: "Urgence Moyenne",
  basse: "Urgence Basse",
};

export const URGENCY_COLORS: Record<EscaladeUrgency, string> = {
  haute: "bg-feedback-danger text-white",
  moyenne: "bg-feedback-warning text-white",
  basse: "bg-brand-clair text-brand-nuit",
};
