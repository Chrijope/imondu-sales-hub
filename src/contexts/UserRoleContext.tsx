import { createContext, useContext, useState, ReactNode } from "react";

// All assignable menu item IDs with labels
export const ALL_MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "inbox", label: "Inbox" },
  { id: "anrufe", label: "Anrufe" },
  { id: "email", label: "E-Mail" },
  { id: "kalender", label: "Kalender" },
  { id: "news", label: "News" },
  { id: "kontakte", label: "Kontakte" },
  { id: "kundenmaske", label: "Kundenmaske (360°)" },
  { id: "b2c", label: "B2C – Eigentümer" },
  { id: "b2b", label: "B2B – Partner" },
  { id: "pipeline", label: "Pipeline" },
  { id: "automations", label: "Automations & Workflows" },
  { id: "dialer", label: "Powerdialer" },
  { id: "inserate", label: "Inserate" },
  { id: "entwickler", label: "Entwickler" },
  { id: "entwickler-registrieren", label: "Entwickler registrieren" },
  { id: "auswertungen", label: "Auswertungen" },
  { id: "statistik", label: "Statistik" },
  { id: "analysetool", label: "Analysetool" },
  { id: "abrechnungen", label: "Abrechnungen" },
  { id: "wettbewerb", label: "Wettbewerb" },
  { id: "immorechner", label: "Immorechner" },
  { id: "rechner", label: "Entwicklungsrechner" },
  { id: "marketing", label: "Marketing" },
  { id: "zielplanung", label: "Zielplanung" },
  { id: "academy", label: "Academy" },
  { id: "lexikon", label: "Immobilien-Lexikon" },
  { id: "presentation", label: "Präsentation" },
  { id: "unterlagen", label: "Unterlagen" },
  { id: "chat", label: "Chat" },
  { id: "support-ki", label: "Support KI" },
  { id: "teampartner", label: "Teampartner" },
  { id: "nutzerverwaltung", label: "Nutzerverwaltung" },
  { id: "ansprechpartner", label: "Ansprechpartner" },
  { id: "berater-microseite", label: "Berater-Microseite" },
  { id: "helpdesk", label: "Helpdesk" },
  { id: "shop", label: "Shop" },
  { id: "einstellungen", label: "Einstellungen" },
];

const ALL_MENU_IDS = ALL_MENU_ITEMS.map((m) => m.id);

export interface RoleDef {
  id: string;
  name: string;
  color: string;
  fixed: boolean;
  menuItems: string[];
}

export const DEFAULT_ROLES: RoleDef[] = [
  {
    id: "admin",
    name: "Admin",
    color: "hsl(0, 72%, 51%)",
    fixed: true,
    menuItems: ALL_MENU_IDS,
  },
  {
    id: "vertriebsleiter",
    name: "Vertriebsleiter",
    color: "hsl(250, 60%, 52%)",
    fixed: true,
    menuItems: [
      "dashboard", "inbox", "anrufe", "email", "kalender", "news",
      "kontakte", "kundenmaske", "b2c", "b2b", "pipeline", "automations", "dialer",
      "inserate", "entwickler",
      "auswertungen", "statistik", "analysetool", "abrechnungen", "wettbewerb",
      "immorechner", "rechner", "marketing",
      "zielplanung", "teampartner", "nutzerverwaltung", "ansprechpartner",
      "academy", "lexikon", "chat", "support-ki",
    ],
  },
  {
    id: "vertriebspartner",
    name: "Vertriebspartner",
    color: "hsl(152, 60%, 42%)",
    fixed: true,
    menuItems: [
      "dashboard", "inbox", "anrufe", "email", "kalender", "news",
      "kontakte", "kundenmaske", "b2c", "b2b", "pipeline", "dialer",
      "inserate",
      "statistik", "abrechnungen", "wettbewerb",
      "immorechner", "rechner",
      "zielplanung", "academy", "lexikon", "presentation", "unterlagen", "chat", "support-ki",
      "teampartner", "berater-microseite",
      "shop", "einstellungen",
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    color: "hsl(280, 60%, 52%)",
    fixed: true,
    menuItems: [
      "dashboard", "inbox", "email", "kalender", "news",
      "kontakte", "marketing",
      "auswertungen", "statistik", "analysetool",
      "academy",
    ],
  },
  {
    id: "backoffice",
    name: "Backoffice",
    color: "hsl(210, 80%, 52%)",
    fixed: true,
    menuItems: [
      "dashboard", "inbox", "email", "kalender",
      "kontakte", "inserate", "entwickler", "entwickler-registrieren",
      "abrechnungen", "ansprechpartner", "unterlagen",
      "nutzerverwaltung",
    ],
  },
  {
    id: "buchhaltung",
    name: "Buchhaltung",
    color: "hsl(38, 92%, 50%)",
    fixed: true,
    menuItems: [
      "dashboard", "inbox", "kalender",
      "abrechnungen", "auswertungen", "statistik",
    ],
  },
  {
    id: "individuell",
    name: "Individuell",
    color: "hsl(220, 10%, 46%)",
    fixed: false,
    menuItems: ["dashboard", "inbox", "kalender"],
  },
];

interface UserRoleContextType {
  currentRoleId: string;
  setCurrentRoleId: (id: string) => void;
  allowedMenuItems: string[];
  roles: RoleDef[];
  setRoles: React.Dispatch<React.SetStateAction<RoleDef[]>>;
}

const UserRoleContext = createContext<UserRoleContextType | null>(null);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [currentRoleId, setCurrentRoleId] = useState("admin");
  const [roles, setRoles] = useState<RoleDef[]>(DEFAULT_ROLES);

  const currentRole = roles.find((r) => r.id === currentRoleId) || roles[0];

  return (
    <UserRoleContext.Provider
      value={{
        currentRoleId,
        setCurrentRoleId,
        allowedMenuItems: currentRole.menuItems,
        roles,
        setRoles,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const ctx = useContext(UserRoleContext);
  if (!ctx) throw new Error("useUserRole must be used within UserRoleProvider");
  return ctx;
}
