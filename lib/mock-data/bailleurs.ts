export interface Bailleur {
  id: string;
  name: string;
  shortName: string;
  region: "Afrique" | "Europe" | "Amérique" | "International" | "Sénégal";
  totalEngaged: number; // millions FCFA
  totalConsumed: number;
  available: number;
  ytdAbsorption: number; // %
  nextReportDueDays: number;
  health: "green" | "amber" | "red";
}

export const BAILLEURS: Bailleur[] = [
  {
    id: "cepi",
    name: "Coalition for Epidemic Preparedness Innovations",
    shortName: "CEPI",
    region: "International",
    totalEngaged: 14500,
    totalConsumed: 9800,
    available: 4700,
    ytdAbsorption: 92,
    nextReportDueDays: 12,
    health: "green",
  },
  {
    id: "gates",
    name: "Bill & Melinda Gates Foundation",
    shortName: "B&M Gates",
    region: "Amérique",
    totalEngaged: 11200,
    totalConsumed: 6300,
    available: 4900,
    ytdAbsorption: 78,
    nextReportDueDays: 21,
    health: "amber",
  },
  {
    id: "edctp",
    name: "European & Developing Countries Clinical Trials Partnership",
    shortName: "EU/EDCTP",
    region: "Europe",
    totalEngaged: 7800,
    totalConsumed: 5200,
    available: 2600,
    ytdAbsorption: 88,
    nextReportDueDays: 8,
    health: "green",
  },
  {
    id: "bmz",
    name: "BMZ / KfW Entwicklungsbank",
    shortName: "BMZ/KfW",
    region: "Europe",
    totalEngaged: 9400,
    totalConsumed: 3100,
    available: 6300,
    ytdAbsorption: 54,
    nextReportDueDays: 4,
    health: "red",
  },
  {
    id: "wb",
    name: "Banque mondiale",
    shortName: "Banque mondiale",
    region: "International",
    totalEngaged: 6200,
    totalConsumed: 4800,
    available: 1400,
    ytdAbsorption: 95,
    nextReportDueDays: 28,
    health: "green",
  },
  {
    id: "usaid",
    name: "USAID",
    shortName: "USAID",
    region: "Amérique",
    totalEngaged: 4100,
    totalConsumed: 2900,
    available: 1200,
    ytdAbsorption: 81,
    nextReportDueDays: 16,
    health: "green",
  },
  {
    id: "wellcome",
    name: "Wellcome Trust",
    shortName: "Wellcome",
    region: "Europe",
    totalEngaged: 2700,
    totalConsumed: 1800,
    available: 900,
    ytdAbsorption: 86,
    nextReportDueDays: 35,
    health: "green",
  },
  {
    id: "senegal",
    name: "République du Sénégal",
    shortName: "État du Sénégal",
    region: "Sénégal",
    totalEngaged: 5600,
    totalConsumed: 4900,
    available: 700,
    ytdAbsorption: 102,
    nextReportDueDays: 45,
    health: "green",
  },
];
