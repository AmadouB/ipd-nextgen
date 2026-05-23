"use client";

import { create } from "zustand";

export type ToastVariant = "default" | "success" | "warning" | "danger" | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  createdAt: number;
}

interface ToastState {
  toasts: Toast[];
  push: (t: Omit<Toast, "id" | "createdAt"> & { id?: string }) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (t) => {
    const id = t.id ?? Math.random().toString(36).slice(2);
    const toast: Toast = {
      id,
      title: t.title,
      description: t.description,
      variant: t.variant ?? "default",
      createdAt: Date.now(),
    };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }));
    }, 4500);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

/** Helper functional API to keep call sites concise. */
export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, variant: "success" }),
  info: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, variant: "info" }),
  warning: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, variant: "warning" }),
  danger: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, variant: "danger" }),
  default: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, variant: "default" }),
};
