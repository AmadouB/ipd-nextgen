export interface MaturityDimension {
  id: string;
  code: string;
  title: string;
  score: number; // 0-4
  target: number;
  history: number[]; // 6 derniers mois
  kpis: { label: string; actual: string; target: string; health: "green" | "amber" | "red" }[];
}

export const MATURITY: MaturityDimension[] = [
  {
    id: "A",
    code: "A",
    title: "Gouvernance",
    score: 3.2,
    target: 4.0,
    history: [2.4, 2.6, 2.8, 3.0, 3.1, 3.2],
    kpis: [
      { label: "% projets validés par la gouvernance", actual: "88 %", target: "≥ 95 %", health: "amber" },
      { label: "% projets avec charte validée", actual: "92 %", target: "≥ 95 %", health: "amber" },
      { label: "Escalades résolues sur 30 j", actual: "23", target: "tendance", health: "green" },
      { label: "Délai moyen de décision escalade", actual: "3,8 j", target: "≤ 5 j", health: "green" },
    ],
  },
  {
    id: "B",
    code: "B",
    title: "Normalisation",
    score: 2.9,
    target: 4.0,
    history: [2.1, 2.3, 2.5, 2.6, 2.8, 2.9],
    kpis: [
      { label: "% projets utilisant modèles standards", actual: "76 %", target: "≥ 90 %", health: "amber" },
      { label: "% projets avec plan à jour", actual: "82 %", target: "≥ 90 %", health: "amber" },
      { label: "Taux de conformité reporting", actual: "91 %", target: "≥ 95 %", health: "amber" },
      { label: "% projets avec registre risques actif", actual: "88 %", target: "≥ 90 %", health: "amber" },
      { label: "% projets avec lessons learned", actual: "62 %", target: "≥ 80 %", health: "red" },
    ],
  },
  {
    id: "C",
    code: "C",
    title: "Visibilité portefeuille",
    score: 3.4,
    target: 4.0,
    history: [2.6, 2.8, 3.0, 3.1, 3.3, 3.4],
    kpis: [
      { label: "Projets cartographiés", actual: "100 %", target: "100 %", health: "green" },
      { label: "Problèmes coordination résolus / 30j", actual: "14", target: "tendance", health: "green" },
      { label: "Dépendances résolues à temps", actual: "78 %", target: "≥ 85 %", health: "amber" },
      { label: "Initiatives doublons fusionnées", actual: "3", target: "tendance", health: "green" },
      { label: "Indice collaboration inter-entités", actual: "71 / 100", target: "≥ 75", health: "amber" },
    ],
  },
  {
    id: "D",
    code: "D",
    title: "Performance livraison",
    score: 2.7,
    target: 4.0,
    history: [2.0, 2.2, 2.4, 2.5, 2.6, 2.7],
    kpis: [
      { label: "Jalons atteints à temps", actual: "78 %", target: "≥ 85 %", health: "amber" },
      { label: "Variance calendrier moyenne", actual: "13 %", target: "≤ 10 %", health: "amber" },
      { label: "Écart budgétaire moyen", actual: "9,2 %", target: "≤ ±10 %", health: "green" },
      { label: "Livrables différés", actual: "11", target: "tendance", health: "amber" },
      { label: "Taux de reprise projets", actual: "65 %", target: "≥ 70 %", health: "amber" },
    ],
  },
  {
    id: "E",
    code: "E",
    title: "Risques & escalades",
    score: 3.0,
    target: 4.0,
    history: [2.4, 2.5, 2.7, 2.8, 2.9, 3.0],
    kpis: [
      { label: "Projets haut risque identifiés", actual: "100 %", target: "100 %", health: "green" },
      { label: "Taux clôture mitigation", actual: "79 %", target: "≥ 85 %", health: "amber" },
      { label: "Temps moyen résolution escalade", actual: "42 h", target: "≤ 48 h", health: "green" },
      { label: "Schémas récurrents identifiés", actual: "6", target: "tendance", health: "green" },
      { label: "Indice prévention crise", actual: "68 / 100", target: "≥ 70", health: "amber" },
    ],
  },
  {
    id: "F",
    code: "F",
    title: "Numérisation & data",
    score: 2.5,
    target: 4.0,
    history: [1.8, 2.0, 2.2, 2.3, 2.4, 2.5],
    kpis: [
      { label: "% projets intégrés plateforme", actual: "82 %", target: "100 %", health: "amber" },
      { label: "Fréquence maj dashboards", actual: "18 h", target: "≤ 24 h", health: "green" },
      { label: "Complétude données fiches", actual: "89 %", target: "≥ 95 %", health: "amber" },
      { label: "Couverture KPI automatisés", actual: "68 %", target: "≥ 80 %", health: "amber" },
      { label: "Intégration ERP F/RH/Achats", actual: "Partielle", target: "Oui", health: "amber" },
    ],
  },
];

export function maturityRadarData() {
  return MATURITY.map((d) => ({
    dimension: d.title,
    actual: d.score,
    target: d.target,
  }));
}

export function maturityAverage(): number {
  const avg = MATURITY.reduce((s, d) => s + d.score, 0) / MATURITY.length;
  return Math.round(avg * 10) / 10;
}
