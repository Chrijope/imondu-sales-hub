import { MailCheck, Mail, MailX } from "lucide-react";

export interface UserProfile {
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  mobilnummer: string;
  geburtsdatum: string;
  bio: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  land: string;
  firmenname: string;
  rechtsform: string;
  gewerbeanmeldung: string;
  steuernummer: string;
  ustId: string;
  finanzamt: string;
  iban: string;
  bic: string;
  bankname: string;
  emailSignatur: boolean;
  kalenderVerbunden: string[];
  dokumente: Record<string, { name: string; date: string; status: "uploaded" | "pending" | "rejected" }>;
  benachrichtigungen: { email: boolean; feed: boolean; browser: boolean; popup: boolean };
  zweiFA: boolean;
}

export const REQUIRED_DOCUMENTS = [
  { id: "personalausweis", label: "Personalausweiskopie" },
  { id: "gewerbeanmeldung", label: "Gewerbeanmeldung" },
  { id: "fuehrungszeugnis", label: "Polizeiliches Führungszeugnis" },
  { id: "vp-vertrag", label: "Vertriebspartnervertrag" },
  { id: "agb", label: "AGB" },
  { id: "verschwiegenheit", label: "Verschwiegenheitsvereinbarung" },
  { id: "dsgvo", label: "DSGVO-Vereinbarung" },
];

export function generateUserProfile(name: string, email: string, phone: string): UserProfile {
  const [vorname, ...rest] = name.split(" ");
  const nachname = rest.join(" ");
  return {
    vorname, nachname, email,
    telefon: phone, mobilnummer: phone,
    geburtsdatum: "1985-06-15",
    bio: `Vertriebspartner bei Imondu.`,
    strasse: "Musterstraße", hausnummer: "1", plz: "10115", ort: "Berlin", land: "Deutschland",
    firmenname: `${nachname} Immobilien UG`, rechtsform: "UG (haftungsbeschränkt)",
    gewerbeanmeldung: "Ja – liegt vor",
    steuernummer: "123/456/78901", ustId: "DE123456789", finanzamt: "Finanzamt Berlin",
    iban: "DE89 3704 0044 0532 0130 00", bic: "COBADEFFXXX", bankname: "Commerzbank",
    emailSignatur: true,
    kalenderVerbunden: ["google"],
    dokumente: {
      "personalausweis": { name: "ausweis.pdf", date: "15.01.2026", status: "uploaded" },
      "gewerbeanmeldung": { name: "gewerbe.pdf", date: "15.01.2026", status: "uploaded" },
      "vp-vertrag": { name: "vertrag.pdf", date: "16.01.2026", status: "uploaded" },
      "agb": { name: "agb-bestaetigung.pdf", date: "16.01.2026", status: "uploaded" },
      "verschwiegenheit": { name: "nda.pdf", date: "16.01.2026", status: "pending" },
      "dsgvo": { name: "dsgvo.pdf", date: "16.01.2026", status: "uploaded" },
    },
    benachrichtigungen: { email: true, feed: true, browser: false, popup: true },
    zweiFA: false,
  };
}

export interface CRMUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  active: boolean;
  lastLogin: string;
  avatar: string;
  customMenuItems?: string[];
  createdAt: string;
  inviteStatus: "accepted" | "pending" | "expired";
  karriereStufeId?: string;
}

export const SAMPLE_USERS: CRMUser[] = [
  { id: "u1", name: "Christian Peetz", email: "c.peetz@imondu.de", phone: "+49 170 1234567", roleId: "admin", active: true, lastLogin: "2026-02-19T14:32:00", avatar: "CP", createdAt: "2025-06-15", inviteStatus: "accepted" },
  { id: "u2", name: "Manuel Schilling", email: "m.schilling@imondu.de", phone: "+49 171 2345678", roleId: "vertriebsleiter", active: true, lastLogin: "2026-02-19T11:15:00", avatar: "MS", createdAt: "2025-08-01", inviteStatus: "accepted" },
  { id: "u3", name: "Lisa Weber", email: "l.weber@imondu.de", phone: "+49 172 3456789", roleId: "vertriebspartner", active: true, lastLogin: "2026-02-18T16:45:00", avatar: "LW", createdAt: "2025-09-10", inviteStatus: "accepted", karriereStufeId: "projektleiter" },
  { id: "u4", name: "Anna Klein", email: "anna.klein@example.com", phone: "+49 173 4567890", roleId: "vertriebspartner", active: true, lastLogin: "2026-02-19T09:22:00", avatar: "AK", createdAt: "2025-10-22", inviteStatus: "accepted", karriereStufeId: "projektleiter" },
  { id: "u5", name: "Oliver Gjorgijev", email: "o.gjorgijev@imondu.de", phone: "+49 174 5678901", roleId: "marketing", active: true, lastLogin: "2026-02-17T13:10:00", avatar: "OG", createdAt: "2025-11-05", inviteStatus: "accepted" },
  { id: "u6", name: "Julia Fischer", email: "j.fischer@imondu.de", phone: "+49 175 6789012", roleId: "backoffice", active: true, lastLogin: "2026-02-19T08:50:00", avatar: "JF", createdAt: "2025-12-01", inviteStatus: "accepted" },
  { id: "u7", name: "Karin Martini", email: "k.martini@imondu.de", phone: "+49 176 7890123", roleId: "buchhaltung", active: false, lastLogin: "2026-01-28T10:30:00", avatar: "KM", createdAt: "2025-07-20", inviteStatus: "accepted" },
  { id: "u8", name: "Sandra Hoffmann", email: "sandra.hoffmann@example.com", phone: "+49 177 8901234", roleId: "individuell", active: true, lastLogin: "2026-02-19T12:05:00", avatar: "SH", createdAt: "2026-01-15", inviteStatus: "accepted", customMenuItems: ["dashboard", "inbox", "kalender", "b2c", "pipeline", "shop"] },
  { id: "u9", name: "Peter Neumann", email: "peter.neumann@example.com", phone: "+49 178 0123456", roleId: "vertriebspartner", active: false, lastLogin: "–", avatar: "PN", createdAt: "2026-02-18", inviteStatus: "pending" },
  { id: "u10", name: "Karin Wolf", email: "karin.wolf@example.com", phone: "+49 179 1234567", roleId: "vertriebspartner", active: false, lastLogin: "–", avatar: "KW", createdAt: "2026-01-05", inviteStatus: "expired" },
];

export const INVITE_STATUS_MAP: Record<CRMUser["inviteStatus"], { label: string; icon: typeof MailCheck; className: string }> = {
  accepted: { label: "Angenommen", icon: MailCheck, className: "text-[hsl(var(--success))]" },
  pending: { label: "Ausstehend", icon: Mail, className: "text-amber-500" },
  expired: { label: "Abgelaufen", icon: MailX, className: "text-destructive" },
};

export function timeAgo(dateStr: string): string {
  if (dateStr === "–") return "–";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `vor ${mins} Min.`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  return `vor ${days} Tag${days > 1 ? "en" : ""}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}
