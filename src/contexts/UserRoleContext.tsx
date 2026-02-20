import { createContext, useContext, useState, ReactNode } from "react";

// Menu item IDs matching ALL_MENU_ITEMS in Nutzerverwaltung
export interface RoleDef {
  id: string;
  name: string;
  color: string;
  fixed: boolean;
  menuItems: string[];
}

const ALL_MENU_IDS = [
  "dashboard", "inbox", "anrufe", "email", "kalender", "news",
  "kontakte", "b2c", "b2b", "pipeline", "automations", "dialer",
  "inserate", "entwickler", "entwickler-registrieren",
  "auswertungen", "statistik", "analysetool", "abrechnungen",
  "immorechner", "rechner", "marketing", "academy", "presentation",
  "unterlagen", "chat", "support-ki",
  "teampartner", "nutzerverwaltung", "ansprechpartner",
  "berater-microseite", "helpdesk",
  "shop", "einstellungen",
];

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
      "kontakte", "b2c", "b2b", "pipeline", "automations", "dialer",
      "inserate", "entwickler",
      "auswertungen", "statistik", "analysetool", "abrechnungen",
      "immorechner", "rechner", "marketing",
      "teampartner", "nutzerverwaltung", "ansprechpartner",
      "academy", "chat", "support-ki",
    ],
  },
  {
    id: "vertriebspartner",
    name: "Vertriebspartner",
    color: "hsl(152, 60%, 42%)",
    fixed: true,
    menuItems: [
      "dashboard", "inbox", "anrufe", "email", "kalender", "news",
      "kontakte", "b2c", "b2b", "pipeline", "dialer",
      "inserate",
      "statistik", "abrechnungen",
      "immorechner", "rechner",
      "academy", "presentation", "unterlagen", "chat", "support-ki",
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
}

const UserRoleContext = createContext<UserRoleContextType | null>(null);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [currentRoleId, setCurrentRoleId] = useState("admin");

  const currentRole = DEFAULT_ROLES.find((r) => r.id === currentRoleId) || DEFAULT_ROLES[0];

  return (
    <UserRoleContext.Provider
      value={{
        currentRoleId,
        setCurrentRoleId,
        allowedMenuItems: currentRole.menuItems,
        roles: DEFAULT_ROLES,
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
