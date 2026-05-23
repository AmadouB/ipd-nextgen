"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Lucide from "lucide-react";
import { usePersonaStore } from "@/lib/store/persona-store";
import { navForPersona } from "@/lib/personas";
import { cn } from "@/lib/utils";

export function BottomNavMobile() {
  const pathname = usePathname();
  const persona = usePersonaStore((s) => s.current);
  const items = navForPersona(persona).slice(0, 5);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t bg-background/95 backdrop-blur">
      <ul className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = ((Lucide as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[item.icon];
          return (
            <li key={item.href} className="contents">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors relative",
                  isActive ? "text-brand-pasteur" : "text-muted-foreground"
                )}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span className="truncate max-w-full px-1">{item.label.split(" ")[0]}</span>
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span className="absolute top-2 right-[28%] h-4 min-w-4 px-1 rounded-full bg-feedback-danger text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute top-0 inset-x-3 h-0.5 rounded-b-full bg-brand-pasteur" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
