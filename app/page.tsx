"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePersonaStore } from "@/lib/store/persona-store";
import { PERSONAS } from "@/lib/personas";

export default function HomePage() {
  const persona = usePersonaStore((s) => s.current);
  const router = useRouter();

  useEffect(() => {
    router.replace(PERSONAS[persona].homeRoute);
  }, [persona, router]);

  return (
    <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
      Chargement…
    </div>
  );
}
