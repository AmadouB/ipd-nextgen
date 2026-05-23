export interface DepNode {
  id: string;
  label: string;
  group: "production" | "recherche" | "diagnostic" | "support";
  health: "green" | "amber" | "red";
  size: number; // budget-proportional
}

export interface DepLink {
  source: string;
  target: string;
  type: "deps_on" | "shares" | "blocks";
  status: "ok" | "retard" | "bloqueur";
}

export const DEP_NODES: DepNode[] = [
  { id: "madiba-2", label: "MADIBA-2", group: "production", health: "red", size: 142 },
  { id: "fievre-jaune", label: "Fièvre jaune", group: "production", health: "amber", size: 89 },
  { id: "rougeole", label: "Rougeole", group: "production", health: "amber", size: 54 },
  { id: "covid-19-pasteur", label: "COVID-19", group: "production", health: "amber", size: 67 },
  { id: "lassa-kit", label: "Lassa Kit", group: "diagnostic", health: "green", size: 18 },
  { id: "dengue", label: "Dengue multiplex", group: "diagnostic", health: "green", size: 12 },
  { id: "audit-qms", label: "Refonte QMS", group: "support", health: "amber", size: 9.5 },
  { id: "biosecurite", label: "Biosécurité BSL-3", group: "support", health: "green", size: 16 },
  { id: "formation-gmp", label: "Formation GMP", group: "support", health: "amber", size: 18 },
  { id: "vih", label: "Recherche VIH", group: "recherche", health: "green", size: 42 },
  { id: "rougeole-vacc", label: "Étude vaccin combiné", group: "recherche", health: "green", size: 21 },
  { id: "go-bailleurs", label: "Portail bailleurs", group: "support", health: "green", size: 3.2 },
];

export const DEP_LINKS: DepLink[] = [
  { source: "audit-qms", target: "madiba-2", type: "blocks", status: "retard" },
  { source: "biosecurite", target: "madiba-2", type: "deps_on", status: "ok" },
  { source: "audit-qms", target: "fievre-jaune", type: "blocks", status: "retard" },
  { source: "biosecurite", target: "fievre-jaune", type: "deps_on", status: "ok" },
  { source: "audit-qms", target: "rougeole", type: "blocks", status: "ok" },
  { source: "formation-gmp", target: "madiba-2", type: "deps_on", status: "ok" },
  { source: "formation-gmp", target: "fievre-jaune", type: "deps_on", status: "ok" },
  { source: "formation-gmp", target: "rougeole", type: "deps_on", status: "ok" },
  { source: "lassa-kit", target: "vih", type: "shares", status: "ok" },
  { source: "dengue", target: "vih", type: "shares", status: "ok" },
  { source: "biosecurite", target: "lassa-kit", type: "deps_on", status: "ok" },
  { source: "biosecurite", target: "dengue", type: "deps_on", status: "ok" },
  { source: "madiba-2", target: "covid-19-pasteur", type: "shares", status: "retard" },
  { source: "rougeole-vacc", target: "rougeole", type: "shares", status: "ok" },
  { source: "go-bailleurs", target: "madiba-2", type: "deps_on", status: "ok" },
  { source: "go-bailleurs", target: "fievre-jaune", type: "deps_on", status: "ok" },
];
