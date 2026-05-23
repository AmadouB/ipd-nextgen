import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** §8.3 — Chiffres > 1000 avec séparateur espace fine */
export function formatNumber(n: number, opts?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("fr-FR", opts).format(n);
}

/** Format FCFA */
export function formatFCFA(n: number): string {
  return `${formatNumber(n)} FCFA`;
}

/** Format pourcentage */
export function formatPct(n: number, digits = 0): string {
  return `${formatNumber(n, { minimumFractionDigits: digits, maximumFractionDigits: digits })} %`;
}

/** Format date français §8.3 */
export function formatDateFR(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateShort(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function relativeTimeFR(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  if (hours < 24) return `il y a ${hours} h`;
  if (days < 7) return `il y a ${days} j`;
  return formatDateShort(date);
}

/** Statut tricolore V/A/R selon seuils */
export type HealthColor = "green" | "amber" | "red" | "neutral";

export function healthFromThresholds(
  value: number,
  thresholds: { green: number; amber: number },
  direction: "higher-better" | "lower-better" = "higher-better"
): HealthColor {
  if (direction === "higher-better") {
    if (value >= thresholds.green) return "green";
    if (value >= thresholds.amber) return "amber";
    return "red";
  }
  if (value <= thresholds.green) return "green";
  if (value <= thresholds.amber) return "amber";
  return "red";
}

export const healthBg: Record<HealthColor, string> = {
  green: "bg-feedback-success",
  amber: "bg-feedback-warning",
  red: "bg-feedback-danger",
  neutral: "bg-neutral-border",
};

export const healthText: Record<HealthColor, string> = {
  green: "text-feedback-success",
  amber: "text-feedback-warning",
  red: "text-feedback-danger",
  neutral: "text-muted-foreground",
};

export const healthBgSoft: Record<HealthColor, string> = {
  green: "bg-feedback-success/10",
  amber: "bg-feedback-warning/10",
  red: "bg-feedback-danger/10",
  neutral: "bg-muted/40",
};

export const healthBorder: Record<HealthColor, string> = {
  green: "border-feedback-success/40",
  amber: "border-feedback-warning/40",
  red: "border-feedback-danger/40",
  neutral: "border-border",
};

export const healthLabel: Record<HealthColor, string> = {
  green: "Vert",
  amber: "Ambre",
  red: "Rouge",
  neutral: "Neutre",
};
