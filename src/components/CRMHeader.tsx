import { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, PanelLeftClose, PanelLeft, FlaskConical, Bell, Megaphone, CalendarClock, RefreshCw, MessageSquare, CheckCircle2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useTestMode, TEST_PROFILE } from "@/contexts/TestModeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: "message" | "reminder" | "system" | "update" | "info";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "update", title: "System-Update v2.8", description: "Neuer Testmodus, Chat-Pinning & System-Updates Widget verfügbar.", time: "Vor 5 Min.", read: false },
  { id: "n2", type: "message", title: "Neue Nachricht", description: "Lisa Weber hat dir im Chat geschrieben.", time: "Vor 12 Min.", read: false },
  { id: "n3", type: "reminder", title: "Termin in 30 Min.", description: "Besichtigung Musterstraße 12, Berlin um 14:00 Uhr.", time: "Vor 20 Min.", read: false },
  { id: "n4", type: "system", title: "Lead zugewiesen", description: "Dir wurde ein neuer B2C-Lead (Familie Bauer) zugewiesen.", time: "Vor 1 Std.", read: true },
  { id: "n5", type: "info", title: "Dokument freigegeben", description: "Dein Gewerbeanmeldung-Dokument wurde genehmigt.", time: "Vor 2 Std.", read: true },
  { id: "n6", type: "update", title: "Neues Feature: Auswertungen", description: "Die Auswertungsseite ist jetzt als Entwurf verfügbar.", time: "Vor 3 Std.", read: true },
];

const NOTIFICATION_ICONS: Record<Notification["type"], typeof Bell> = {
  message: MessageSquare,
  reminder: CalendarClock,
  system: Megaphone,
  update: RefreshCw,
  info: CheckCircle2,
};

const NOTIFICATION_COLORS: Record<Notification["type"], string> = {
  message: "text-blue-500",
  reminder: "text-amber-500",
  system: "text-rose-500",
  update: "text-emerald-500",
  info: "text-muted-foreground",
};

interface CRMHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function CRMHeader({ sidebarCollapsed, onToggleSidebar }: CRMHeaderProps) {
  const { currentRoleId, roles } = useUserRole();
  const { isTestMode, toggleTestMode } = useTestMode();
  const currentRole = roles.find((r) => r.id === currentRoleId);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

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
      {/* Left: Sidebar toggle + test badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {sidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
        {isTestMode && (
          <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold animate-pulse select-none">
            <FlaskConical className="h-3.5 w-3.5" />
            TESTMODUS
          </div>
        )}
      </div>

      {/* Right: Test toggle + Notifications + Theme + User */}
      <div className="flex items-center gap-1">
        {(currentRoleId === "admin" || currentRoleId === "inhaber") && (
          <button
            onClick={toggleTestMode}
            className={`p-1.5 rounded-md transition-colors ${isTestMode ? "text-amber-600 bg-amber-500/15 hover:bg-amber-500/25" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            title={isTestMode ? "Testmodus deaktivieren" : "Testmodus aktivieren"}
          >
            <FlaskConical className="h-5 w-5" />
          </button>
        )}

        {/* Notification bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2">
              <DropdownMenuLabel className="p-0 text-sm font-semibold">Benachrichtigungen</DropdownMenuLabel>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[11px] text-primary hover:underline">
                  Alle gelesen
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            <ScrollArea className="max-h-80">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Keine Benachrichtigungen</p>
              ) : (
                notifications.map((n) => {
                  const Icon = NOTIFICATION_ICONS[n.type];
                  const colorClass = NOTIFICATION_COLORS[n.type];
                  return (
                    <DropdownMenuItem
                      key={n.id}
                      className={`flex items-start gap-3 px-3 py-2.5 cursor-pointer ${!n.read ? "bg-muted/50" : ""}`}
                      onClick={() => markRead(n.id)}
                    >
                      <div className={`mt-0.5 shrink-0 ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm leading-tight ${!n.read ? "font-semibold text-foreground" : "text-foreground"}`}>
                            {n.title}
                          </span>
                          {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.description}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
                      </div>
                    </DropdownMenuItem>
                  );
                })
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

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
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${isTestMode ? "text-amber-950 dark:text-amber-100" : "text-primary-foreground"}`}
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
