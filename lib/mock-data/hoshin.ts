export interface HoshinPillar {
  id: string;
  code: string;
  title: string;
  description: string;
  progress: number; // % 0-100
  target: number;
  icon: string;
}

export const HOSHIN_PILLARS: HoshinPillar[] = [
  {
    id: "souverainete",
    code: "P1",
    title: "Souveraineté vaccinale",
    description: "Capacité africaine de production indépendante d'ici 2030",
    progress: 62,
    target: 70,
    icon: "Shield",
  },
  {
    id: "excellence",
    code: "P2",
    title: "Excellence scientifique",
    description: "Publications de rang A, partenariats internationaux",
    progress: 78,
    target: 75,
    icon: "Microscope",
  },
  {
    id: "industrialisation",
    code: "P3",
    title: "Industrialisation GMP",
    description: "Certifications, échelle de production, qualité conforme",
    progress: 54,
    target: 70,
    icon: "Factory",
  },
  {
    id: "capital-humain",
    code: "P4",
    title: "Capital humain",
    description: "Recrutement, formation, fidélisation des talents",
    progress: 71,
    target: 75,
    icon: "Users",
  },
  {
    id: "impact-societal",
    code: "P5",
    title: "Impact sociétal",
    description: "Accès équitable aux soins, formation citoyenne, santé publique",
    progress: 68,
    target: 70,
    icon: "Heart",
  },
];
