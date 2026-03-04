import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings, PanelLeftClose, PanelLeft, Bell, Megaphone, CalendarClock, RefreshCw, MessageSquare, CheckCircle2, FlaskConical, X, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useUserRole } from "@/contexts/UserRoleContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Notification {
  id: string;
  type: "message" | "reminder" | "system" | "update" | "info";
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "update", title: "System-Update v2.8", description: "Neuer Testmodus, Chat-Pinning & System-Updates Widget verfügbar.", time: "Vor 5 Min.", read: false, link: "/" },
  { id: "n2", type: "message", title: "Neue Nachricht", description: "Lisa Weber hat dir im Chat geschrieben.", time: "Vor 12 Min.", read: false, link: "/chat" },
  { id: "n3", type: "reminder", title: "Termin in 30 Min.", description: "Besichtigung Musterstraße 12, Berlin um 14:00 Uhr.", time: "Vor 20 Min.", read: false, link: "/kalender" },
  { id: "n4", type: "system", title: "Lead zugewiesen", description: "Dir wurde ein neuer B2C-Lead (Familie Bauer) zugewiesen.", time: "Vor 1 Std.", read: true, link: "/b2c" },
  { id: "n5", type: "info", title: "Dokument freigegeben", description: "Dein Gewerbeanmeldung-Dokument wurde genehmigt.", time: "Vor 2 Std.", read: true, link: "/einstellungen" },
  { id: "n6", type: "update", title: "Neues Feature: Auswertungen", description: "Die Auswertungsseite ist jetzt als Entwurf verfügbar.", time: "Vor 3 Std.", read: true, link: "/auswertungen" },
  { id: "n7", type: "message", title: "Chat: Manuel Schilling", description: "Hat auf deine Nachricht geantwortet.", time: "Vor 4 Std.", read: true, link: "/chat" },
  { id: "n8", type: "reminder", title: "Follow-Up fällig", description: "Erinnerung: Familie Meier kontaktieren (B2C-Lead).", time: "Vor 5 Std.", read: true, link: "/b2c" },
  { id: "n9", type: "system", title: "Neuer Entwickler", description: "Elektro Huber & Partner wurde als Entwickler registriert.", time: "Gestern", read: true, link: "/entwickler" },
  { id: "n10", type: "info", title: "Abrechnung verfügbar", description: "Deine Provisionsabrechnung für Februar ist bereit.", time: "Gestern", read: true, link: "/abrechnungen" },
];

const NOTIFICATION_ICONS: Record<Notification["type"], typeof Bell> = {
  message: MessageSquare, reminder: CalendarClock, system: Megaphone, update: RefreshCw, info: CheckCircle2,
};
const NOTIFICATION_COLORS: Record<Notification["type"], string> = {
  message: "text-blue-500", reminder: "text-amber-500", system: "text-rose-500", update: "text-emerald-500", info: "text-muted-foreground",
};

function NotificationRow({ n, onClick }: { n: Notification; onClick: () => void }) {
  const Icon = NOTIFICATION_ICONS[n.type];
  const colorClass = NOTIFICATION_COLORS[n.type];
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/60 transition-colors border-b border-border/50 last:border-0 ${!n.read ? "bg-muted/40" : ""}`}
    >
      <div className={`mt-0.5 shrink-0 ${colorClass}`}><Icon className="h-4 w-4" /></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm leading-tight ${!n.read ? "font-semibold" : ""} text-foreground`}>{n.title}</span>
          {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.description}</p>
        <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
      </div>
      {n.link && <ArrowRight className="h-4 w-4 text-muted-foreground/50 mt-1 shrink-0" />}
    </button>
  );
}

interface CRMHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function CRMHeader({ sidebarCollapsed, onToggleSidebar }: CRMHeaderProps) {
  const { currentRoleId, roles } = useUserRole();
  const navigate = useNavigate();
  const currentRole = roles.find((r) => r.id === currentRoleId);
  const isTestAccount = currentRoleId === "testaccount";
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const handleNotificationClick = (n: Notification) => {
    markRead(n.id);
    setShowAllNotifications(false);
    if (n.link) navigate(n.link);
  };

  const userProfiles: Record<string, { name: string; initials: string; subtitle?: string }> = {
    admin: { name: "Christian Peetz", initials: "CP" },
    inhaber: { name: "Christian Peetz", initials: "CP" },
    vertriebsleiter: { name: "Manuel Schilling", initials: "MS" },
    vertriebspartner: { name: "Lisa Weber", initials: "LW" },
    marketing: { name: "Oliver Gjorgijev", initials: "OG" },
    backoffice: { name: "Julia Fischer", initials: "JF" },
    buchhaltung: { name: "Karin Martini", initials: "KM" },
    individuell: { name: "Sandra Hoffmann", initials: "SH" },
    eigentuemer: { name: "Anna Schmidt", initials: "AS" },
    entwickler: { name: "Thomas Huber", initials: "TH", subtitle: "Elektro Huber & Partner" },
    testaccount: { name: "Max Mustermann", initials: "MM", subtitle: "Testaccount" },
  };
  const profile = userProfiles[currentRoleId] || userProfiles.admin;

  // Show max 4 in dropdown, rest in full dialog
  const previewNotifications = notifications.slice(0, 4);

  return (
    <>
      <header
        className="fixed top-0 right-0 h-14 flex items-center justify-between px-5 bg-background border-b border-border z-40 transition-all duration-200"
        style={{ left: sidebarCollapsed ? 56 : 240 }}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            {sidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>
          {isTestAccount && (
            <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold animate-pulse select-none">
              <FlaskConical className="h-3.5 w-3.5" />
              TESTMODUS
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          {/* Notifications dropdown */}
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
                  <button onClick={markAllRead} className="text-[11px] text-primary hover:underline">Alle gelesen</button>
                )}
              </div>
              <DropdownMenuSeparator />
              <ScrollArea className="max-h-72">
                {previewNotifications.map((n) => {
                  const Icon = NOTIFICATION_ICONS[n.type];
                  const colorClass = NOTIFICATION_COLORS[n.type];
                  return (
                    <DropdownMenuItem
                      key={n.id}
                      className={`flex items-start gap-3 px-3 py-2.5 cursor-pointer ${!n.read ? "bg-muted/50" : ""}`}
                      onClick={() => handleNotificationClick(n)}
                    >
                      <div className={`mt-0.5 shrink-0 ${colorClass}`}><Icon className="h-4 w-4" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm leading-tight ${!n.read ? "font-semibold" : ""} text-foreground`}>{n.title}</span>
                          {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.description}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </ScrollArea>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="justify-center text-sm text-primary font-medium cursor-pointer"
                onClick={() => setShowAllNotifications(true)}
              >
                Alle Benachrichtigungen anzeigen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground leading-none">{profile.name}</p>
                  <p className="text-[11px] text-muted-foreground">{profile.subtitle || (currentRole?.name || "Admin")}</p>
                </div>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${isTestAccount ? "text-amber-950 dark:text-amber-100" : "text-primary-foreground"}`}
                  style={{ background: currentRole?.color || "hsl(var(--primary))" }}
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

      {/* Full notification dialog */}
      <Dialog open={showAllNotifications} onOpenChange={setShowAllNotifications}>
        <DialogContent className="max-w-lg p-0 gap-0">
          <DialogHeader className="px-5 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-base">
                <Bell className="h-5 w-5 text-primary" />
                Alle Benachrichtigungen
                {unreadCount > 0 && (
                  <span className="ml-1 h-5 min-w-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </DialogTitle>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline mr-8">
                  Alle als gelesen markieren
                </button>
              )}
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {notifications.map((n) => (
              <NotificationRow key={n.id} n={n} onClick={() => handleNotificationClick(n)} />
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
