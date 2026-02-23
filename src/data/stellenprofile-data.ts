export type StellenStatus = "entwurf" | "veroeffentlicht" | "besetzt" | "geschlossen";

export interface Stellenprofil {
  id: string;
  titel: string;
  abteilung: string;
  standort: string;
  beschaeftigungsart: string;
  beschreibung: string;
  anforderungen: string;
  benefits: string;
  status: StellenStatus;
  erstelltAm: string;
  veroeffentlichtAm?: string;
}

export const STELLEN_STATUS_LABELS: Record<StellenStatus, string> = {
  entwurf: "Entwurf",
  veroeffentlicht: "Veröffentlicht",
  besetzt: "Besetzt",
  geschlossen: "Geschlossen",
};

export const STELLEN_STATUS_COLORS: Record<StellenStatus, string> = {
  entwurf: "bg-muted-foreground",
  veroeffentlicht: "bg-[hsl(var(--success))]",
  besetzt: "bg-primary",
  geschlossen: "bg-destructive",
};

export const INITIAL_STELLEN: Stellenprofil[] = [
  {
    id: "s1",
    titel: "Vertriebspartner (m/w/d) – Immobilien",
    abteilung: "Vertrieb",
    standort: "München / Remote",
    beschaeftigungsart: "Freier Handelsvertreter",
    beschreibung: "Du baust Dir Dein eigenes Vertriebsgebiet auf, akquirierst Eigentümer und vermittelst Immobilien – unterstützt durch unser CRM, Leads und Marketingmaterialien.",
    anforderungen: "Kommunikationsstärke, Eigeninitiative, idealerweise Erfahrung im Vertrieb oder Immobilienbereich. Quereinsteiger willkommen.",
    benefits: "Attraktives Provisionsmodell, eigene Microseite, Zugang zur IMONDU Academy, flexible Zeiteinteilung.",
    status: "veroeffentlicht",
    erstelltAm: "2026-01-15",
    veroeffentlichtAm: "2026-01-20",
  },
  {
    id: "s2",
    titel: "Teamleiter Vertrieb (m/w/d)",
    abteilung: "Vertrieb",
    standort: "München",
    beschaeftigungsart: "Hauptberuflich",
    beschreibung: "Du leitest ein Team von Vertriebspartnern, coachst neue Mitglieder und entwickelst Strategien zur Umsatzsteigerung.",
    anforderungen: "Mind. 3 Jahre Führungserfahrung im Vertrieb, nachweisbare Erfolge im Team-Aufbau.",
    benefits: "Fixum + Team-Provision, Firmenwagen, Weiterbildungsbudget.",
    status: "veroeffentlicht",
    erstelltAm: "2026-02-01",
    veroeffentlichtAm: "2026-02-05",
  },
  {
    id: "s3",
    titel: "Marketing Manager (m/w/d)",
    abteilung: "Marketing",
    standort: "Berlin / Remote",
    beschaeftigungsart: "Angestellt",
    beschreibung: "Du verantwortest unsere Online-Marketing-Kampagnen, Social Media Strategie und Lead-Generierung.",
    anforderungen: "Erfahrung im digitalen Marketing, SEO/SEA Kenntnisse, Kreativität und Datenaffinität.",
    benefits: "Flexible Arbeitszeiten, Remote-Option, Weiterbildungsbudget.",
    status: "entwurf",
    erstelltAm: "2026-02-18",
  },
  {
    id: "s4",
    titel: "Backoffice Assistenz (m/w/d)",
    abteilung: "Backoffice",
    standort: "München",
    beschaeftigungsart: "Teilzeit / Vollzeit",
    beschreibung: "Du unterstützt unser Team bei der Verwaltung von Inseraten, Abrechnungen und der Kommunikation mit Partnern.",
    anforderungen: "Organisationstalent, MS Office Kenntnisse, Deutsch fließend.",
    benefits: "Moderne Büroräume, flexible Arbeitszeiten, Team-Events.",
    status: "besetzt",
    erstelltAm: "2025-12-01",
    veroeffentlichtAm: "2025-12-05",
  },
];

export function getStoredStellen(): Stellenprofil[] {
  try {
    const saved = localStorage.getItem("imondu-stellenprofile");
    if (saved) return JSON.parse(saved);
  } catch {}
  return INITIAL_STELLEN;
}

export function saveStellen(stellen: Stellenprofil[]) {
  localStorage.setItem("imondu-stellenprofile", JSON.stringify(stellen));
}
