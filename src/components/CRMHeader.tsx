import { Link } from "react-router-dom";
import { Settings, PanelLeftClose, PanelLeft } from "lucide-react";
import { useUserRole } from "@/contexts/UserRoleContext";
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
  const currentRole = roles.find((r) => r.id === currentRoleId);

  return (
    <header
      className="fixed top-0 right-0 h-14 flex items-center justify-between px-5 bg-background border-b border-border z-40 transition-all duration-200"
      style={{ left: sidebarCollapsed ? 56 : 240 }}
    >
      {/* Sidebar toggle */}
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

      {/* Right: User profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground leading-none">Max Müller</p>
              <p className="text-[11px] text-muted-foreground">{currentRole?.name || "Admin"}</p>
            </div>
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
              style={{ background: currentRole?.color || "hsl(var(--primary))" }}
            >
              MM
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
    </header>
  );
}
