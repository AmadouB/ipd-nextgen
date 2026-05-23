import type { PersonaKey } from "@/lib/personas";

export interface AskiaSuggestion {
  id: string;
  question: string;
}

export interface AskiaResponse {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  sources: { label: string; href: string }[];
}

export const ASKIA_SUGGESTIONS: Record<PersonaKey, AskiaSuggestion[]> = {
  ag: [
    { id: "1", question: "Quels sont les 3 sujets prioritaires de cette semaine ?" },
    { id: "2", question: "Quel est l'état du projet MADIBA-2 et quels arbitrages attendent ma décision ?" },
    { id: "3", question: "Génère le brief de réunion AG de lundi en 1 page." },
  ],
  cabinet: [
    { id: "1", question: "Quelles escalades n'ont pas reçu de réponse depuis plus de 48h ?" },
    { id: "2", question: "Génère le brief de réunion de lundi en 1 page." },
    { id: "3", question: "Quels patterns récurrents l'IA a-t-elle détecté ce mois-ci ?" },
  ],
  "pmo-strategique": [
    { id: "1", question: "Quels sont les bloqueurs récurrents liés aux Achats sur les 60 derniers jours ?" },
    { id: "2", question: "Compare la performance des projets CEPI vs Gates." },
    { id: "3", question: "Où en est la maturité PMO sur la dimension Performance ?" },
  ],
  directeur: [
    { id: "1", question: "Aide-moi à reformuler ma demande de soutien." },
    { id: "2", question: "Quelles priorités ai-je le plus souvent reconduites sans avancement ?" },
    { id: "3", question: "Résume ma fiche entité de cette semaine en 5 lignes." },
  ],
  pm: [
    { id: "1", question: "Quels sont mes risques à mitiger en priorité ?" },
    { id: "2", question: "Génère un récap pour mon point d'équipe demain." },
    { id: "3", question: "Quel est mon avancement vs le plan ?" },
  ],
  dsi: [
    { id: "1", question: "État des intégrations externes ce matin ?" },
    { id: "2", question: "Tentatives d'accès non autorisé sur 24h ?" },
    { id: "3", question: "Volume audit log du jour ?" },
  ],
};

export const ASKIA_RESPONSES: Record<string, AskiaResponse> = {
  ag_1: {
    id: "ag_1",
    question: "Quels sont les 3 sujets prioritaires de cette semaine ?",
    answer:
      "Cette semaine, **3 sujets** demandent votre attention prioritaire :\n\n**1. MADIBA-2 — réallocation budgétaire CEPI/BMZ** (urgence Haute, J-3) : la hausse de 18 % du prix lyophilisateur impose un arbitrage avant le 26 mai pour éviter 6 semaines de retard production.\n\n**2. Recrutement urgent 4 ingénieurs procédé Vaccinopôle** (urgence Haute, J-5) : démissions en cascade, risque arrêt ligne fièvre jaune sous 10 semaines.\n\n**3. Audit CEPI MADIBA 12-14 juin** : complétude dossier 91 %, à finaliser cette semaine pour éviter remarques d'audit.\n\nPattern IA confirmé : le service **Achats** est cité dans 41 % des bloqueurs des 30 derniers jours.",
    confidence: 0.93,
    sources: [
      { label: "Escalades urgence Haute (3)", href: "/escalades" },
      { label: "Dashboard AG — bandeau alertes", href: "/dashboard-ag" },
      { label: "Pattern Detection ASKIA", href: "/dashboard-cabinet" },
    ],
  },
  ag_2: {
    id: "ag_2",
    question: "Quel est l'état du projet MADIBA-2 et quels arbitrages attendent ma décision ?",
    answer:
      "**MADIBA-2** est actuellement en santé **Rouge** :\n\n- Avancement : 41 % vs 50 % prévu (SPI = 0,78).\n- CPI = 0,83 (consommation 5,6 Mds FCFA sur 14,2 Mds engagés).\n- 4 risques niveau Élevé actifs, dont 2 sans mitigation < 7 j.\n\n**Décisions en attente** :\n\n1. **ESC-2026-038** — Réallocation 320 M FCFA CEPI→BMZ (échéance 26 mai).\n2. **Jalon BSL-3 phase 2** (J-11, statut À risque) — nécessite arbitrage qualité.\n\nDécision déjà rendue le 19 mai : partenariat Biological E retenu, juridique en cours.",
    confidence: 0.89,
    sources: [
      { label: "Projet MADIBA-2 (dashboard PM)", href: "/dashboard-pm" },
      { label: "Escalades MADIBA", href: "/escalades" },
      { label: "Jalons portefeuille", href: "/dashboard-ag" },
    ],
  },
  ag_3: {
    id: "ag_3",
    question: "Génère le brief de réunion AG de lundi en 1 page.",
    answer:
      "**Brief AG — Lundi 25 mai 2026** (9h00, salle Pasteur)\n\n**Ordre du jour proposé** :\n\n1. *Décisions urgentes* (15 min)\n   - Réallocation budgétaire MADIBA-2 (ESC-038)\n   - Recrutement direct 4 ingénieurs Vaccinopôle (ESC-037)\n   - Approbation contrat ITM Antwerp VIH (ESC-036)\n\n2. *Revue portefeuille* (20 min)\n   - Santé : 5 Vert, 5 Ambre, 2 Rouge (sur 12 projets actifs)\n   - 3 jalons critiques < 14j\n\n3. *Maturité PMO* (10 min)\n   - Note moyenne : 3,0/4 ; dimension la plus faible : Numérisation (2,5)\n\n4. *Pattern Detection* (5 min)\n   - Achats : 41 % des bloqueurs récents — proposition action\n\n5. *Décisions actées la semaine précédente* (5 min)\n\n**Préparation requise** : signatures Directrice Vaccinopôle (en attente), validation Cabinet sur ordre du jour final.",
    confidence: 0.88,
    sources: [
      { label: "Pipeline escalades préparation AG", href: "/escalades" },
      { label: "Synthèse hebdo portefeuille", href: "/dashboard-ag" },
      { label: "Module Maturité PMO", href: "/dashboard-maturite" },
    ],
  },
  cabinet_1: {
    id: "cabinet_1",
    question: "Quelles escalades n'ont pas reçu de réponse depuis plus de 48h ?",
    answer:
      "Au 23 mai 2026, **2 escalades** dépassent 48h sans accusé-réception explicite :\n\n- **ESC-2026-036** (Approbation contrat ITM Antwerp) — soumise le 22 mai à 8h30, statut Préparation AG.\n- **ESC-2026-037** (Recrutement ingénieurs) — qualifiée le 23 mai mais pas encore préparée.\n\nLes autres escalades en cours respectent leur SLA.",
    confidence: 0.95,
    sources: [
      { label: "Pipeline Kanban escalades", href: "/escalades" },
      { label: "SLA réaction §43 catalogue alertes", href: "/alertes" },
    ],
  },
  cabinet_2: {
    id: "cabinet_2",
    question: "Génère le brief de réunion de lundi en 1 page.",
    answer:
      "Voir question équivalente Persona AG — brief généré disponible en export PDF via le bouton ci-dessous.",
    confidence: 0.92,
    sources: [{ label: "Brief AG complet", href: "/dashboard-ag" }],
  },
  cabinet_3: {
    id: "cabinet_3",
    question: "Quels patterns récurrents l'IA a-t-elle détecté ce mois-ci ?",
    answer:
      "**5 insights** détectés par le moteur Pattern Detection (confiance ≥ 0,70) :\n\n1. **Achats** — 41 % des bloqueurs (confiance 0,91, validé)\n2. **RH Vaccinopôle/MADIBA** — 8 escalades en 60 j (0,86, en attente)\n3. **WHO PQ ↔ Qualité** — corrélation retards (0,78, en attente)\n4. **Reporting BMZ** — non-conformité récurrente (0,82, en attente)\n5. **Co-édition** — collaboration positive (0,94, validé)",
    confidence: 0.94,
    sources: [
      { label: "Module Pattern Detection", href: "/dashboard-cabinet" },
      { label: "Historique escalades 60j", href: "/escalades" },
    ],
  },
  "pmo-strategique_1": {
    id: "pmo-strategique_1",
    question: "Quels sont les bloqueurs récurrents liés aux Achats sur les 60 derniers jours ?",
    answer:
      "Sur 60 jours, **19 bloqueurs sur 47** sont attribués au service Achats (40,4 %). Décomposition :\n\n- **Délais d'engagement > 8 semaines** : 12 cas\n- **Procédure AO trop lourde** : 4 cas\n- **Manque de fournisseurs qualifiés** : 3 cas\n\nProjets les plus affectés : MADIBA-2 (5), Vaccinopôle Fièvre jaune (4), Formation GMP (3).\n\nRecommandation : adoption de la procédure AO simplifiée validée par le CA, renforcement de l'équipe Achats GMP.",
    confidence: 0.91,
    sources: [
      { label: "Registre bloqueurs", href: "/escalades" },
      { label: "Pattern PTN-001", href: "/dashboard-cabinet" },
    ],
  },
  "pmo-strategique_2": {
    id: "pmo-strategique_2",
    question: "Compare la performance des projets CEPI vs Gates.",
    answer:
      "**CEPI** (4 projets — MADIBA-2, COVID-19, Fièvre jaune, ITM-VIH) :\n- Absorption budgétaire YTD : 92 %\n- SPI moyen : 0,86\n- Conformité reporting : 100 %\n\n**Gates** (3 projets — MADIBA-2, Lassa Kit, Audit QMS) :\n- Absorption budgétaire YTD : 78 %\n- SPI moyen : 0,91\n- Conformité reporting : 96 %\n\nCEPI : meilleure absorption mais plus de retards. Gates : exécution plus régulière mais sous-utilisation budgétaire.",
    confidence: 0.85,
    sources: [
      { label: "Bailleurs — situation financière", href: "/dashboard-ag" },
      { label: "Projets par bailleur", href: "/dashboard-cabinet" },
    ],
  },
  "pmo-strategique_3": {
    id: "pmo-strategique_3",
    question: "Où en est la maturité PMO sur la dimension Performance ?",
    answer:
      "La dimension **D — Performance livraison** est à **2,7 / 4** (progression continue depuis 2,0 il y a 6 mois). Points faibles :\n\n- Jalons atteints à temps : 78 % (cible ≥ 85 %)\n- Variance calendrier moyenne : 13 % (cible ≤ 10 %)\n- Livrables différés : 11\n\nPour atteindre le Niveau 4, action prioritaire : industrialiser le suivi des jalons critiques avec alerte précoce J-30.",
    confidence: 0.9,
    sources: [
      { label: "Dashboard Maturité PMO", href: "/dashboard-maturite" },
      { label: "KPI dimension D §15.2", href: "/dashboard-maturite" },
    ],
  },
  directeur_1: {
    id: "directeur_1",
    question: "Aide-moi à reformuler ma demande de soutien.",
    answer:
      "Voici une version reformulée plus institutionnelle :\n\n> *Objet : Réallocation budgétaire CEPI → BMZ — équipement lyophilisateur MADIBA-2*\n>\n> *Contexte : Le fournisseur unique Allemand a notifié une hausse tarifaire de 18 % avec effet immédiat. La ligne 'équipement BMZ' est insuffisante pour absorber ce surcoût (gap = 320 M FCFA).*\n>\n> *Demande : Autorisation de réallocation de 320 M FCFA de la ligne 'formation continue CEPI' (sous-consommée à 41 % YTD) vers la ligne 'équipement BMZ'.*\n>\n> *Impact si non décidé : retard de 6 semaines sur la production, pénalités CEPI estimées à 180 M FCFA.*\n>\n> *Décision attendue avant le 26 mai 2026.*",
    confidence: 0.92,
    sources: [
      { label: "ESC-2026-038 (votre escalade)", href: "/escalades" },
      { label: "Modèles d'escalade IPD", href: "#" },
    ],
  },
  directeur_2: {
    id: "directeur_2",
    question: "Quelles priorités ai-je le plus souvent reconduites sans avancement ?",
    answer:
      "Sur les 12 dernières semaines, **2 priorités** ont été reconduites avec un avancement < 20 % :\n\n1. **Rétention ingénieurs procédé** (8 semaines, avancement 25-32 %)\n2. **Conformité documentaire ISO** (6 semaines, avancement 80-88 %)\n\nSuggestion : redécouper en sous-priorités plus actionnables ou escalader si dépendances bloquantes.",
    confidence: 0.87,
    sources: [
      { label: "Historique fiches Vaccinopôle", href: "/mes-fiches" },
      { label: "Time-travel UI des versions", href: "/fiche/vaccinopole" },
    ],
  },
  directeur_3: {
    id: "directeur_3",
    question: "Résume ma fiche entité de cette semaine en 5 lignes.",
    answer:
      "**Vaccinopôle Diamniadio — Semaine du 18 mai 2026** :\n\n1. Sécurisation chaîne lyophilisateurs MADIBA-2 (priorité 1, 45 %) — risque domino élevé.\n2. Audit WHO PQ fièvre jaune en préparation (priorité 2, 68 %).\n3. Recrutement 4 ingénieurs procédé en cours (priorité 3, 32 %).\n4. Validation BSL-3 phase 2 (priorité 4, 58 %) — jalon dans 11 jours.\n5. KPI rotation ingénieurs en Rouge (4,5 % vs cible 2 %) — action RH engagée.\n\nFiche complétée à 72 %, soumission requise avant vendredi 17h00.",
    confidence: 0.94,
    sources: [{ label: "Fiche Vaccinopôle S21", href: "/fiche/vaccinopole" }],
  },
  pm_1: {
    id: "pm_1",
    question: "Quels sont mes risques à mitiger en priorité ?",
    answer:
      "Sur le projet **MADIBA-2**, vous avez **4 risques niveau Élevé** :\n\n1. **RSK-MAD-014** — Rupture lyophilisateur (P=4, I=5, score=20) — plan de mitigation en cours\n2. **RSK-MAD-011** — Certification BSL-3 phase 2 (P=3, I=5, score=15) — audit blanc prévu juin\n3. **RSK-VAX-022** — Délais Achats (P=4, I=3, score=12) — mitigé via AO simplifié\n4. **RSK-COV-009** — Recrutement volontaires (P=4, I=3, score=12) — campagne renforcée\n\nPriorité 1 : action RSK-MAD-014 (échéance 15 juin), c'est le plus impactant.",
    confidence: 0.93,
    sources: [
      { label: "Registre risques MADIBA-2", href: "/dashboard-pm" },
      { label: "Matrice probabilité × impact", href: "/dashboard-pm" },
    ],
  },
  pm_2: {
    id: "pm_2",
    question: "Génère un récap pour mon point d'équipe demain.",
    answer:
      "**Point équipe MADIBA-2 — 24 mai 2026**\n\n*Avancement* : 41 % (vs 50 % planifié — SPI 0,78)\n\n*À faire cette semaine* :\n- Audit blanc qualité (Khadija S.) — 28 mai\n- Sourcing fournisseur secondaire lyo (équipe Achats) — 10 juin\n- Préparation visite CEPI (équipe) — 12 juin\n\n*Points d'attention* :\n- Décision AG attendue lundi 25 mai sur réallocation budgétaire\n- Audit BSL-3 phase 2 dans 11 jours — état des lieux à faire\n\n*Bonne nouvelle* :\n- Partenariat Biological E validé par AG le 19 mai",
    confidence: 0.89,
    sources: [
      { label: "Projet MADIBA-2", href: "/dashboard-pm" },
      { label: "Roadmap", href: "/dashboard-pm" },
    ],
  },
  pm_3: {
    id: "pm_3",
    question: "Quel est mon avancement vs le plan ?",
    answer:
      "**MADIBA-2** : 41 % réalisé vs 50 % planifié → écart **-9 points**.\n\n- SPI = 0,78 (Rouge, seuil < 0,85)\n- CPI = 0,83 (Rouge, seuil < 0,85)\n\nTrois causes principales identifiées :\n1. Retard négociation Allemagne (-3 sem.)\n2. Délais Achats — fournisseurs critiques (-2 sem.)\n3. Démissions cascade Vaccinopôle (-1 sem.)\n\nPlan de redressement : décision AG réallocation + Biological E (gain estimé +4 sem.).",
    confidence: 0.91,
    sources: [
      { label: "Gantt MADIBA-2", href: "/dashboard-pm" },
      { label: "Indicateurs SPI/CPI", href: "/dashboard-pm" },
    ],
  },
  dsi_1: {
    id: "dsi_1",
    question: "État des intégrations externes ce matin ?",
    answer:
      "**État au 23 mai 2026 à 09h15** :\n\n- ✅ MS Project — synchro 4 min\n- ⚠️ Zoho Projects — **panne depuis 25 min**, fallback last-known data\n- ✅ Grant Office — synchro 12 min\n- ✅ ERP Finance — synchro 1h2\n- ✅ ERP RH — synchro 47 min\n- ✅ AD — temps réel\n- ✅ SMS Orange — disponible\n\n**Action en cours** : redémarrage worker Zoho.",
    confidence: 0.96,
    sources: [
      { label: "Alerte ALT-012 (Zoho)", href: "/alertes" },
      { label: "Monitoring intégrations", href: "#" },
    ],
  },
  dsi_2: {
    id: "dsi_2",
    question: "Tentatives d'accès non autorisé sur 24h ?",
    answer:
      "1 tentative bloquée sur 24 h : 3 essais de connexion échoués sur `externe@example.com` depuis IP 41.82.x.x (Sénégal). Compte verrouillé après 3 essais (politique Keycloak).",
    confidence: 0.99,
    sources: [
      { label: "Alerte ALT-013", href: "/alertes" },
      { label: "Audit log Keycloak", href: "#" },
    ],
  },
  dsi_3: {
    id: "dsi_3",
    question: "Volume audit log du jour ?",
    answer:
      "**12 482 entrées** au 23/05/2026 à 10h00. Pic à 14h30 hier (3 412 entrées/h — synchro batch ERP). Aucun dépassement de seuil.",
    confidence: 0.97,
    sources: [{ label: "Métriques observabilité", href: "#" }],
  },
};
