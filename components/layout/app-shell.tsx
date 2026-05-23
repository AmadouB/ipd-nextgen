"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { BottomNavMobile } from "./bottom-nav-mobile";
import { AskiaFloating } from "./askia-floating";
import { DrillDownDrawer } from "@/components/drilldown/drilldown-drawer";
import { Toaster } from "@/components/ui/toaster";
import { useThemeStore } from "@/lib/store/theme-store";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useThemeStore((s) => s.theme);
  const isAuthScreen = pathname === "/login";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  if (isAuthScreen) {
    return (
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:pl-64">
          <Topbar />
          <main id="main" className="px-4 pb-24 pt-6 md:px-8 md:pb-10">
            {children}
          </main>
        </div>
        <BottomNavMobile />
        <AskiaFloating />
        <DrillDownDrawer />
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
