import { Navigate } from "react-router-dom";
import { useUserRole } from "@/contexts/UserRoleContext";

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
};

interface ProtectedRouteProps {
  path: string;
  children: React.ReactNode;
}

export default function ProtectedRoute({ path, children }: ProtectedRouteProps) {
  const { allowedMenuItems } = useUserRole();

  // Dashboard is always accessible
  if (path === "/") return <>{children}</>;

  // Find matching menu ID by checking path prefixes
  const menuId = ROUTE_TO_MENU_ID[path] ||
    Object.entries(ROUTE_TO_MENU_ID).find(([route]) => path.startsWith(route + "/"))?.[1];

  // If no mapping exists, allow access (unmapped routes)
  if (!menuId) return <>{children}</>;

  // Check permission
  if (!allowedMenuItems.includes(menuId)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
