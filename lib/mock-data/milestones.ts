export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  dateExpected: string;
  status: "atteint" | "à_risque" | "en_retard" | "à_venir";
  importance: "critique" | "majeur" | "standard";
  daysFromNow: number;
}

const today = new Date();
function dayOffset(days: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const MILESTONES: Milestone[] = [
  { id: "m1", projectId: "madiba-2", title: "Validation BSL-3 phase 2", dateExpected: dayOffset(11), status: "à_risque", importance: "critique", daysFromNow: 11 },
  { id: "m2", projectId: "lassa-kit", title: "Soumission ANSM Sénégal", dateExpected: dayOffset(18), status: "à_venir", importance: "critique", daysFromNow: 18 },
  { id: "m3", projectId: "rougeole", title: "Réception ligne stoppers", dateExpected: dayOffset(-3), status: "en_retard", importance: "majeur", daysFromNow: -3 },
  { id: "m4", projectId: "fievre-jaune", title: "Audit qualité WHO PQ", dateExpected: dayOffset(24), status: "à_venir", importance: "critique", daysFromNow: 24 },
  { id: "m5", projectId: "covid-19-pasteur", title: "Phase II — premiers volontaires", dateExpected: dayOffset(7), status: "à_venir", importance: "majeur", daysFromNow: 7 },
  { id: "m6", projectId: "audit-qms", title: "Audit blanc ISO 13485", dateExpected: dayOffset(34), status: "à_venir", importance: "majeur", daysFromNow: 34 },
  { id: "m7", projectId: "biosecurite", title: "Certification BSL-3 finale", dateExpected: dayOffset(48), status: "à_venir", importance: "critique", daysFromNow: 48 },
  { id: "m8", projectId: "dengue", title: "Validation kits dengue 4 serotypes", dateExpected: dayOffset(62), status: "à_venir", importance: "majeur", daysFromNow: 62 },
  { id: "m9", projectId: "vih", title: "Publication Lancet cohorte 1", dateExpected: dayOffset(-12), status: "atteint", importance: "majeur", daysFromNow: -12 },
  { id: "m10", projectId: "formation-gmp", title: "Cohorte 1 — 100 techniciens certifiés", dateExpected: dayOffset(40), status: "à_venir", importance: "standard", daysFromNow: 40 },
  { id: "m11", projectId: "rougeole-vacc", title: "Lecture protocole CRBP", dateExpected: dayOffset(15), status: "à_venir", importance: "standard", daysFromNow: 15 },
  { id: "m12", projectId: "go-bailleurs", title: "Mise en service du portail bailleurs v1", dateExpected: dayOffset(74), status: "à_venir", importance: "majeur", daysFromNow: 74 },
];
