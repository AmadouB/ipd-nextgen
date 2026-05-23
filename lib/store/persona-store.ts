"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PERSONAS, type PersonaKey, type Persona } from "@/lib/personas";

interface PersonaState {
  current: PersonaKey;
  setPersona: (p: PersonaKey) => void;
  getPersona: () => Persona;
}

export const usePersonaStore = create<PersonaState>()(
  persist(
    (set, get) => ({
      current: "ag",
      setPersona: (p) => set({ current: p }),
      getPersona: () => PERSONAS[get().current],
    }),
    { name: "ipd-persona" }
  )
);
