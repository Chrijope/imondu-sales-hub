export const ROLE_USER_NAMES: Record<string, string> = {
  admin: "Christian Peetz",
  inhaber: "Christian Peetz",
  vertriebsleiter: "Manuel Schilling",
  vertriebspartner: "Lisa Weber",
  marketing: "Oliver Gjorgijev",
  backoffice: "Julia Fischer",
  buchhaltung: "Karin Martini",
  individuell: "Sandra Hoffmann",
  eigentuemer: "Anna Schmidt",
  entwickler: "Thomas Huber",
  testaccount: "Max Mustermann",
  bewerber: "Max Mustermann",
  hr: "Julia Fischer",
};

export function getUserFirstName(roleId: string): string {
  const full = ROLE_USER_NAMES[roleId] || "Nutzer";
  return full.split(" ")[0];
}

export function getUserFullName(roleId: string): string {
  return ROLE_USER_NAMES[roleId] || "Nutzer";
}

export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Guten Morgen";
  if (hour < 17) return "Guten Mittag";
  return "Guten Abend";
}
