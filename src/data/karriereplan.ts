// ── B2C Provisionsstaffel (quartalsbasiert) ──
export interface B2CStufe {
  min: number;
  max: number | null;
  provision: number;
}

export const B2C_STAFFEL: B2CStufe[] = [
  { min: 0, max: 149, provision: 10 },
  { min: 150, max: 299, provision: 12 },
  { min: 300, max: 599, provision: 13.5 },
  { min: 600, max: null, provision: 15 },
];

export const B2C_QUARTALSBONUS_SCHWELLE = 500;
export const B2C_QUARTALSBONUS = 500;

// ── B2B Provisionsstaffel (monatlich) ──
export interface B2BStufe {
  min: number;
  max: number | null;
  provision: number; // in %
}

export const B2B_STAFFEL: B2BStufe[] = [
  { min: 0, max: 5000, provision: 25 },
  { min: 5001, max: 15000, provision: 30 },
  { min: 15001, max: 30000, provision: 33 },
  { min: 30001, max: null, provision: 35 },
];

export const B2B_MITGLIEDSCHAFT_PREIS = 1250;

// ── Karrierestufen ──
export interface Karrierestufe {
  id: string;
  title: string;
  icon: string;
  b2cMin: string;
  b2bRange: string;
  vorteile: string[];
  voraussetzungen?: string[];
  overrideTeam?: string;
}

export const KARRIERESTUFEN: Karrierestufe[] = [
  {
    id: "projektassistent",
    title: "Projektassistent",
    icon: "🌱",
    b2cMin: "10 € (Einstieg)",
    b2bRange: "25 % (50/50 oder 30/70 Split)",
    vorteile: [
      "Einstieg in den Vertrieb",
      "B2C gemäß Quartalsstaffel",
      "Beteiligung an B2B gemäß 50/50 oder 30/70",
    ],
  },
  {
    id: "projektleiter",
    title: "Projektleiter",
    icon: "🔥",
    b2cMin: "ab 12 € (Mindeststufe)",
    b2bRange: "30–35 %",
    vorteile: [
      "Eigenständiges Closing",
      "Mindeststufe 12 € im B2C",
      "30–35 % im B2B",
      "Zugang zu exklusiven Leads",
      "Aufbau eigener Projektassistenten",
      "Overhead-Provision auf Teamumsatz",
    ],
    voraussetzungen: [
      "Erfolgreiche interne Qualifikationsprüfung",
      "Sicherer Umgang mit Leitfäden und Pitch",
      "Mehrere begleitete Closings",
      "Praktische Abschlussprüfung",
    ],
  },
  {
    id: "senior_projektleiter",
    title: "Senior Projektleiter",
    icon: "👑",
    b2cMin: "bis 15 € (Top-Stufe)",
    b2bRange: "35 % + 5 % Override",
    vorteile: [
      "35 % Provision im B2B",
      "5 % Override auf Teamumsatz",
      "Strategische Mitgestaltung",
      "Exklusive Leads",
      "Offizielle Ernennung mit Zertifikat",
    ],
    voraussetzungen: [
      "Nachhaltig hoher Monatsumsatz",
      "Führungsverantwortung",
    ],
    overrideTeam: "5 %",
  },
];

// ── Helpers ──
export function getB2CStufe(inserateImQuartal: number): B2CStufe {
  return [...B2C_STAFFEL].reverse().find(s => inserateImQuartal >= s.min) || B2C_STAFFEL[0];
}

export function getB2BStufe(monatsumsatz: number): B2BStufe {
  return [...B2B_STAFFEL].reverse().find(s => monatsumsatz >= s.min) || B2B_STAFFEL[0];
}

// Calculate example earnings for each B2C tier
export function b2cMehrverdienst(inserateProQuartal: number, stufe: B2CStufe): number {
  return inserateProQuartal * stufe.provision;
}

// Calculate example earnings for each B2B tier
export function b2bMehrverdienst(monatsumsatz: number, stufe: B2BStufe): number {
  return monatsumsatz * (stufe.provision / 100);
}
