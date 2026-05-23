"use client";

import { create } from "zustand";

type Period = "week" | "month" | "quarter" | "year";

interface FilterState {
  period: Period;
  scope: string; // 'all' ou id entité
  setPeriod: (p: Period) => void;
  setScope: (s: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  period: "week",
  scope: "all",
  setPeriod: (period) => set({ period }),
  setScope: (scope) => set({ scope }),
}));
