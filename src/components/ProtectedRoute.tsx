import { Navigate } from "react-router-dom";
import { useUserRole } from "@/contexts/UserRoleContext";

// Draft pages: only admin can access
const DRAFT_MENU_IDS = new Set([
  "automations", "auswertungen", "statistik", "abrechnungen", "wettbewerb",
  "lead-scouring", "webinar", "support-ki", "teampartner",
  "berater-microseite", "helpdesk", "shop",
]);

// Maps route paths to menu permission IDs
const ROUTE_TO_MENU_ID: Record<string, string> = {
  "/inbox": "inbox",
  "/anrufe": "anrufe",
  "/email": "email",
  "/kalender": "kalender",
  "/news": "news",
  "/kontakte": "kontakte",
  "/pipeline": "pipeline",
  "/automations": "automations",
  "/dialer": "dialer",
  "/inserate": "inserate",
  "/entwickler": "entwickler",
  "/entwickler-registrieren": "entwickler-registrieren",
  "/auswertungen": "auswertungen",
  "/statistik": "statistik",
  "/analysetool": "analysetool",
  "/abrechnungen": "abrechnungen",
  "/academy": "academy",
  "/presentation": "presentation",
  "/unterlagen": "unterlagen",
  "/chat": "chat",
  "/support-ki": "support-ki",
  "/teampartner": "teampartner",
  "/nutzerverwaltung": "nutzerverwaltung",
  "/ansprechpartner": "ansprechpartner",
  "/berater-microseite": "berater-microseite",
  "/helpdesk": "helpdesk",
  "/einstellungen": "einstellungen",
  "/marketing-leads": "marketing",
  "/social-media-creator": "marketing",
  "/b2c": "b2c",
  "/b2b": "b2b",
  "/shop": "shop",
  "/immorechner": "immorechner",
  "/rechner": "rechner",
  "/webinar": "webinar",
  "/bewerber-portal": "bewerber-portal",
  "/bewerbungsmanagement": "bewerbungsmanagement",
  "/wettbewerb": "wettbewerb",
  "/lead-scouring": "lead-scouring",
  "/zielplanung": "zielplanung",
};

interface ProtectedRouteProps {
  path: string;
  children: React.ReactNode;
}

export default function ProtectedRoute({ path, children }: ProtectedRouteProps) {
  const { allowedMenuItems, currentRoleId } = useUserRole();

  // Dashboard is always accessible
  if (path === "/") return <>{children}</>;

  // Find matching menu ID by checking path prefixes
  const menuId = ROUTE_TO_MENU_ID[path] ||
    Object.entries(ROUTE_TO_MENU_ID).find(([route]) => path.startsWith(route + "/"))?.[1];

  // If no mapping exists, allow access (unmapped routes)
  if (!menuId) return <>{children}</>;

  // Draft pages: only admin can access
  if (DRAFT_MENU_IDS.has(menuId) && currentRoleId !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Check permission
  if (!allowedMenuItems.includes(menuId) && !DRAFT_MENU_IDS.has(menuId)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
