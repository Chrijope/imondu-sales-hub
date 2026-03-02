import { generateImonduId } from "@/data/nutzerverwaltung-data";

export interface Projektassistent {
  id: string;
  imonduId: string;
  // Kontaktdaten
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  // Adresse
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  land: string;
  // Rahmenkonditionen
  honorarB2C: string; // €-Betrag pro Lead / Inserat
  honorarB2B: string; // €-Betrag oder %-Anteil
  honorarModell: "pro_lead" | "prozentual" | "pauschal";
  vertragsBeginn: string;
  vertragsEnde: string;
  notizen: string;
  // System
  erstelltVon: string; // userId des VP/VL
  erstelltVonName: string;
  erstelltAm: string;
  status: "aktiv" | "inaktiv" | "ausstehend";
}

// Seed data
export const SAMPLE_PROJEKTASSISTENTEN: Projektassistent[] = [
  {
    id: "pa-1",
    imonduId: generateImonduId("pa-markus-bauer"),
    vorname: "Markus", nachname: "Bauer",
    email: "m.bauer@email.de", telefon: "+49 160 1234567",
    strasse: "Lindenstraße", hausnummer: "12", plz: "80331", ort: "München", land: "Deutschland",
    honorarB2C: "8", honorarB2B: "15", honorarModell: "pro_lead",
    vertragsBeginn: "2026-01-01", vertragsEnde: "2026-12-31",
    notizen: "Fokus auf Eigentümer-Leads im Raum München.",
    erstelltVon: "u3", erstelltVonName: "Lisa Weber",
    erstelltAm: "2026-01-05", status: "aktiv",
  },
  {
    id: "pa-2",
    imonduId: generateImonduId("pa-sarah-winter"),
    vorname: "Sarah", nachname: "Winter",
    email: "s.winter@email.de", telefon: "+49 161 2345678",
    strasse: "Hauptstraße", hausnummer: "44", plz: "10115", ort: "Berlin", land: "Deutschland",
    honorarB2C: "10", honorarB2B: "20", honorarModell: "pro_lead",
    vertragsBeginn: "2026-02-01", vertragsEnde: "2027-01-31",
    notizen: "",
    erstelltVon: "u2", erstelltVonName: "Manuel Schilling",
    erstelltAm: "2026-02-01", status: "aktiv",
  },
  {
    id: "pa-3",
    imonduId: generateImonduId("pa-tobias-stein"),
    vorname: "Tobias", nachname: "Stein",
    email: "t.stein@email.de", telefon: "+49 162 3456789",
    strasse: "Gartenweg", hausnummer: "7", plz: "50667", ort: "Köln", land: "Deutschland",
    honorarB2C: "6", honorarB2B: "10", honorarModell: "pauschal",
    vertragsBeginn: "2026-01-15", vertragsEnde: "",
    notizen: "Unbefristete Zusammenarbeit, Quartalsweise Abrechnung.",
    erstelltVon: "u3", erstelltVonName: "Lisa Weber",
    erstelltAm: "2026-01-15", status: "inaktiv",
  },
];

// Runtime store
let projektassistenten = [...SAMPLE_PROJEKTASSISTENTEN];

export function getProjektassistenten(): Projektassistent[] {
  return [...projektassistenten];
}

export function getProjektassistentenByCreator(userId: string): Projektassistent[] {
  return projektassistenten.filter(pa => pa.erstelltVon === userId);
}

export function addProjektassistent(pa: Omit<Projektassistent, "id" | "imonduId" | "erstelltAm">): Projektassistent {
  const newPa: Projektassistent = {
    ...pa,
    id: `pa-${Date.now()}`,
    imonduId: generateImonduId(`pa-${pa.vorname}-${pa.nachname}-${Date.now()}`),
    erstelltAm: new Date().toISOString().split("T")[0],
  };
  projektassistenten = [...projektassistenten, newPa];
  return newPa;
}

export function removeProjektassistent(id: string) {
  projektassistenten = projektassistenten.filter(pa => pa.id !== id);
}
