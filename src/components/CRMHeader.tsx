import { Link } from "react-router-dom";
import { Settings, PanelLeftClose, PanelLeft, FlaskConical } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useTestMode, TEST_PROFILE } from "@/contexts/TestModeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CRMHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function CRMHeader({ sidebarCollapsed, onToggleSidebar }: CRMHeaderProps) {
  const { currentRoleId, roles } = useUserRole();
  const { isTestMode, toggleTestMode } = useTestMode();
  const currentRole = roles.find((r) => r.id === currentRoleId);

  // Role-specific user profiles
  const userProfiles: Record<string, { name: string; initials: string; subtitle?: string }> = {
    admin: { name: "Christian Peetz", initials: "CP" },
    vertriebsleiter: { name: "Manuel Schilling", initials: "MS" },
    vertriebspartner: { name: "Lisa Weber", initials: "LW" },
    marketing: { name: "Oliver Gjorgijev", initials: "OG" },
    backoffice: { name: "Julia Fischer", initials: "JF" },
    buchhaltung: { name: "Karin Martini", initials: "KM" },
    individuell: { name: "Sandra Hoffmann", initials: "SH" },
    eigentuemer: { name: "Anna Schmidt", initials: "AS" },
    entwickler: { name: "Thomas Huber", initials: "TH", subtitle: "Elektro Huber & Partner" },
  };

  const profile = isTestMode
    ? { name: TEST_PROFILE.name, initials: TEST_PROFILE.initials, subtitle: TEST_PROFILE.subtitle }
    : userProfiles[currentRoleId] || userProfiles.admin;

  return (
    <header
      className="fixed top-0 right-0 h-14 flex items-center justify-between px-5 bg-background border-b border-border z-40 transition-all duration-200"
      style={{ left: sidebarCollapsed ? 56 : 240 }}
    >
      {/* Sidebar toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>

        {/* Persistent test mode badge */}
        {isTestMode && (
          <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold animate-pulse select-none">
            <FlaskConical className="h-3.5 w-3.5" />
            TESTMODUS
          </div>
        )}
      </div>

      {/* Right: Test toggle + Theme + User profile */}
      <div className="flex items-center gap-1">
        {/* Test mode toggle - only visible for admin/inhaber */}
        {(currentRoleId === "admin" || currentRoleId === "inhaber") && (
          <button
            onClick={toggleTestMode}
            className={`p-1.5 rounded-md transition-colors ${
              isTestMode
                ? "text-amber-600 bg-amber-500/15 hover:bg-amber-500/25"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title={isTestMode ? "Testmodus deaktivieren" : "Testmodus aktivieren"}
          >
            <FlaskConical className="h-5 w-5" />
          </button>
        )}
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground leading-none">{profile.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {profile.subtitle || (currentRole?.name || "Admin")}
                </p>
              </div>
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  isTestMode ? "text-amber-950 dark:text-amber-100" : "text-primary-foreground"
                }`}
                style={{ background: isTestMode ? "hsl(45, 93%, 47%)" : (currentRole?.color || "hsl(var(--primary))") }}
              >
                {profile.initials}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link to="/einstellungen" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                Einstellungen
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
