// Notification categories and role-based filtering

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  type: "message" | "reminder" | "system" | "update" | "info";
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
  /** Which menu IDs this notification is relevant to */
  menuRelevance: string[];
}

export type NotificationCategory = "chat" | "aufgaben" | "termine" | "wettbewerb" | "leads" | "inserate" | "system" | "academy";

export const NOTIFICATION_CATEGORIES: { id: NotificationCategory; label: string; description: string }[] = [
  { id: "chat", label: "Chat-Nachrichten", description: "Neue Nachrichten und Antworten im Chat" },
  { id: "aufgaben", label: "Aufgaben & Inbox", description: "Neue und fällige Aufgaben, Follow-ups" },
  { id: "termine", label: "Termine & Kalender", description: "Terminerinnerungen, Kalender-Updates" },
  { id: "wettbewerb", label: "Wettbewerb", description: "Challenge-Erinnerungen, Ranglisten-Updates" },
  { id: "leads", label: "Leads & Pipeline", description: "Neue Leads, Status-Änderungen, Zuweisungen" },
  { id: "inserate", label: "Inserate & Entwickler", description: "Neue Inserate, Anfragen, Matching-Updates" },
  { id: "system", label: "System & Updates", description: "Plattform-Updates, Dokumenten-Freigaben" },
  { id: "academy", label: "Academy & Schulungen", description: "Neue Kurse, Zertifizierungen, Webinar-Erinnerungen" },
];

// Map categories → required menu items
const CATEGORY_MENU_MAPPING: Record<NotificationCategory, string[]> = {
  chat: ["chat"],
  aufgaben: ["inbox", "dashboard"],
  termine: ["kalender", "inbox"],
  wettbewerb: ["wettbewerb"],
  leads: ["b2c", "b2b", "pipeline", "kontakte"],
  inserate: ["inserate", "entwickler"],
  system: ["dashboard"],
  academy: ["academy", "webinar"],
};

/** Check if a notification category is relevant for a role's menu items */
export function isCategoryRelevant(category: NotificationCategory, allowedMenuItems: string[]): boolean {
  // system + aufgaben are always relevant (dashboard is always present)
  if (category === "system" || category === "aufgaben") return true;
  const required = CATEGORY_MENU_MAPPING[category];
  return required.some((m) => allowedMenuItems.includes(m));
}

/** Filter notifications by role's allowed menu items */
export function filterNotificationsByRole(notifications: AppNotification[], allowedMenuItems: string[]): AppNotification[] {
  return notifications.filter((n) => isCategoryRelevant(n.category, allowedMenuItems));
}

/** Get default notification preferences based on role */
export function getDefaultPreferences(allowedMenuItems: string[]): Record<NotificationCategory, boolean> {
  const prefs: Record<NotificationCategory, boolean> = {} as any;
  for (const cat of NOTIFICATION_CATEGORIES) {
    prefs[cat.id] = isCategoryRelevant(cat.id, allowedMenuItems);
  }
  return prefs;
}

// Demo notifications covering all categories
export const ALL_NOTIFICATIONS: AppNotification[] = [
  // Chat
  { id: "n1", category: "chat", type: "message", title: "Neue Chat-Nachricht", description: "Lisa Weber hat dir im Chat geschrieben.", time: "Vor 5 Min.", read: false, link: "/chat", menuRelevance: ["chat"] },
  { id: "n2", category: "chat", type: "message", title: "Chat: Manuel Schilling", description: "Hat auf deine Nachricht geantwortet.", time: "Vor 30 Min.", read: false, link: "/chat", menuRelevance: ["chat"] },

  // Aufgaben
  { id: "n3", category: "aufgaben", type: "reminder", title: "Follow-Up fällig", description: "Erinnerung: Familie Meier kontaktieren (B2C-Lead).", time: "Vor 15 Min.", read: false, link: "/inbox", menuRelevance: ["inbox"] },
  { id: "n4", category: "aufgaben", type: "info", title: "Aufgabe erledigt", description: "Julia Fischer hat die Aufgabe 'Vertrag prüfen' abgeschlossen.", time: "Vor 1 Std.", read: true, link: "/inbox", menuRelevance: ["inbox"] },

  // Termine
  { id: "n5", category: "termine", type: "reminder", title: "Termin in 30 Min.", description: "Besichtigung Musterstraße 12, Berlin um 14:00 Uhr.", time: "Vor 10 Min.", read: false, link: "/kalender", menuRelevance: ["kalender"] },
  { id: "n6", category: "termine", type: "info", title: "Neuer Termin eingetragen", description: "Onboarding-Meeting am 10.03. um 10:00 Uhr hinzugefügt.", time: "Vor 2 Std.", read: true, link: "/kalender", menuRelevance: ["kalender"] },

  // Wettbewerb
  { id: "n7", category: "wettbewerb", type: "system", title: "Challenge endet bald!", description: "Die Challenge 'Frühlings-Sprint' endet in 2 Tagen. Du bist aktuell auf Platz 3.", time: "Vor 20 Min.", read: false, link: "/wettbewerb", menuRelevance: ["wettbewerb"] },
  { id: "n8", category: "wettbewerb", type: "update", title: "Neue Challenge erstellt", description: "Admin hat eine neue Challenge 'März-Power' erstellt. Jetzt teilnehmen!", time: "Vor 3 Std.", read: true, link: "/wettbewerb", menuRelevance: ["wettbewerb"] },
  { id: "n9", category: "wettbewerb", type: "info", title: "Ranglisten-Update", description: "Du bist im Wettbewerb 'Top-Performer Q1' auf Platz 2 aufgestiegen!", time: "Vor 5 Std.", read: true, link: "/wettbewerb", menuRelevance: ["wettbewerb"] },

  // Leads
  { id: "n10", category: "leads", type: "system", title: "Neuer Lead zugewiesen", description: "Dir wurde ein neuer B2C-Lead (Familie Bauer) zugewiesen.", time: "Vor 45 Min.", read: false, link: "/b2c/neue-leads", menuRelevance: ["b2c"] },
  { id: "n11", category: "leads", type: "update", title: "Pipeline-Status geändert", description: "Lead 'Grundstück Augsburg' wurde auf 'Angebot' verschoben.", time: "Vor 2 Std.", read: true, link: "/pipeline", menuRelevance: ["pipeline"] },

  // Inserate
  { id: "n12", category: "inserate", type: "info", title: "Neues Inserat erstellt", description: "Ein neues Inserat 'Altbau München-Schwabing' wurde veröffentlicht.", time: "Vor 1 Std.", read: true, link: "/inserate", menuRelevance: ["inserate"] },
  { id: "n13", category: "inserate", type: "system", title: "Neuer Entwickler registriert", description: "Elektro Huber & Partner wurde als Entwickler registriert.", time: "Gestern", read: true, link: "/entwickler", menuRelevance: ["entwickler"] },
  { id: "n14", category: "inserate", type: "update", title: "Neue Anfrage auf Inserat", description: "Ein Entwickler hat eine Anfrage für 'MFH Thalkirchen' gesendet.", time: "Vor 4 Std.", read: true, link: "/inserate", menuRelevance: ["inserate"] },

  // System
  { id: "n15", category: "system", type: "update", title: "System-Update v2.9", description: "Benachrichtigungs-Center, rollenbasierte Alerts & Push-Einstellungen.", time: "Vor 2 Min.", read: false, link: "/", menuRelevance: ["dashboard"] },
  { id: "n16", category: "system", type: "info", title: "Dokument freigegeben", description: "Dein Gewerbeanmeldung-Dokument wurde genehmigt.", time: "Vor 6 Std.", read: true, link: "/einstellungen", menuRelevance: ["dashboard"] },
  { id: "n17", category: "system", type: "info", title: "Abrechnung verfügbar", description: "Deine Provisionsabrechnung für Februar ist bereit.", time: "Gestern", read: true, link: "/abrechnungen", menuRelevance: ["abrechnungen"] },

  // Academy
  { id: "n18", category: "academy", type: "update", title: "Neuer Kurs verfügbar", description: "Der Kurs 'Immobilienrecht Grundlagen' wurde freigeschaltet.", time: "Vor 3 Std.", read: true, link: "/academy", menuRelevance: ["academy"] },
  { id: "n19", category: "academy", type: "reminder", title: "Webinar morgen", description: "Erinnerung: Live-Webinar 'Marktanalyse 2026' morgen um 11:00 Uhr.", time: "Vor 4 Std.", read: true, link: "/webinar", menuRelevance: ["webinar"] },
];
