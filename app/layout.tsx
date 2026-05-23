import type { Metadata, Viewport } from "next";
import { Poppins, Lato, JetBrains_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-lato",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NextGen IPD — Portail Exécutif & Coordination Inter-Entités",
  description:
    "Plateforme institutionnelle de l'Institut Pasteur de Dakar — Pilotage portefeuille, priorités hebdomadaires, assistant ASKIA.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0089D0" },
    { media: "(prefers-color-scheme: dark)", color: "#052A62" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${lato.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <a href="#main" className="skip-link">
          Aller au contenu
        </a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
