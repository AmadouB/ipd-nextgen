"use client";

import { create } from "zustand";

/** Toutes les variantes de payload supportées par le drawer de détail */
export type DrillDownPayload =
  | { type: "kpi"; code: string } // EXE-01, COO-01, PM-01...
  | { type: "health-segment"; status: "green" | "amber" | "red" }
  | { type: "project"; projectId: string }
  | { type: "pillar"; pillarId: string }
  | { type: "bailleur"; bailleurId: string }
  | { type: "entity-pillar"; entityId: string; pillarId: string }
  | { type: "milestone"; milestoneId: string }
  | { type: "escalade"; escaladeId: string }
  | { type: "alert"; alertId: string }
  | { type: "maturity-dimension"; dimensionId: string };

interface DrillDownState {
  payload: DrillDownPayload | null;
  isOpen: boolean;
  open: (p: DrillDownPayload) => void;
  close: () => void;
}

export const useDrillDownStore = create<DrillDownState>((set) => ({
  payload: null,
  isOpen: false,
  open: (payload) => set({ payload, isOpen: true }),
  close: () => set({ isOpen: false }),
}));
