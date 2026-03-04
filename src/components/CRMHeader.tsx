import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings, PanelLeftClose, PanelLeft, Bell, Megaphone, CalendarClock, RefreshCw, MessageSquare, CheckCircle2, FlaskConical, X, ArrowRight, SlidersHorizontal, Trophy, ClipboardList, Building2, GraduationCap } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  type AppNotification,
  type NotificationCategory,
  NOTIFICATION_CATEGORIES,
  ALL_NOTIFICATIONS,
  filterNotificationsByRole,
  isCategoryRelevant,
  getDefaultPreferences,
} from "@/utils/notifications";

const CATEGORY_ICONS: Record<NotificationCategory, typeof Bell> = {
  chat: MessageSquare,
  aufgaben: ClipboardList,
  termine: CalendarClock,
  wettbewerb: Trophy,
  leads: Megaphone,
  inserate: Building2,
  system: RefreshCw,
  academy: GraduationCap,
};
const CATEGORY_COLORS: Record<NotificationCategory, string> = {
  chat: "text-blue-500",
  aufgaben: "text-amber-500",
  termine: "text-emerald-500",
  wettbewerb: "text-rose-500",
  leads: "text-violet-500",
  inserate: "text-cyan-500",
  system: "text-muted-foreground",
  academy: "text-orange-500",
};

function NotificationRow({ n, onClick }: { n: AppNotification; onClick: () => void }) {
  const Icon = CATEGORY_ICONS[n.category];
  const colorClass = CATEGORY_COLORS[n.category];
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
  const { currentRoleId, roles, allowedMenuItems } = useUserRole();
  const navigate = useNavigate();
  const currentRole = roles.find((r) => r.id === currentRoleId);
  const isTestAccount = currentRoleId === "testaccount";

  const [notifications, setNotifications] = useState<AppNotification[]>(ALL_NOTIFICATIONS);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<"alle" | NotificationCategory>("alle");

  // Notification preferences per category
  const [preferences, setPreferences] = useState<Record<NotificationCategory, boolean>>(() =>
    getDefaultPreferences(allowedMenuItems)
  );

  const togglePref = (cat: NotificationCategory) =>
    setPreferences((p) => ({ ...p, [cat]: !p[cat] }));

  // Filter by role + preferences
  const roleFiltered = useMemo(
    () => filterNotificationsByRole(notifications, allowedMenuItems),
    [notifications, allowedMenuItems]
  );
  const visibleNotifications = useMemo(
    () => roleFiltered.filter((n) => preferences[n.category] !== false),
    [roleFiltered, preferences]
  );

  const filteredByTab = useMemo(
    () => activeTab === "alle" ? visibleNotifications : visibleNotifications.filter((n) => n.category === activeTab),
    [visibleNotifications, activeTab]
  );

  const unreadCount = visibleNotifications.filter((n) => !n.read).length;
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const handleNotificationClick = (n: AppNotification) => {
    markRead(n.id);
    setShowAllNotifications(false);
    if (n.link) navigate(n.link);
  };

  const previewNotifications = visibleNotifications.slice(0, 4);

  // Relevant categories for this role
  const relevantCategories = NOTIFICATION_CATEGORIES.filter((c) =>
    isCategoryRelevant(c.id, allowedMenuItems)
  );

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
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[11px] text-primary hover:underline">Alle gelesen</button>
                  )}
                  <button
                    onClick={() => { setShowSettings(true); }}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Benachrichtigungs-Einstellungen"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <DropdownMenuSeparator />
              <ScrollArea className="max-h-72">
                {previewNotifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">Keine Benachrichtigungen</div>
                ) : (
                  previewNotifications.map((n) => {
                    const Icon = CATEGORY_ICONS[n.category];
                    const colorClass = CATEGORY_COLORS[n.category];
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
                  })
                )}
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

      {/* Full notification dialog with tabs */}
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
              <div className="flex items-center gap-2 mr-8">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline">Alle gelesen</button>
                )}
                <button
                  onClick={() => { setShowAllNotifications(false); setShowSettings(true); }}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Einstellungen"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </DialogHeader>

          {/* Category filter tabs */}
          <div className="px-4 pt-3 pb-1">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveTab("alle")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeTab === "alle" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Alle
              </button>
              {relevantCategories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.id];
                const count = visibleNotifications.filter((n) => n.category === cat.id && !n.read).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      activeTab === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {cat.label.split(" ")[0]}
                    {count > 0 && (
                      <span className={`h-4 min-w-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        activeTab === cat.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-destructive text-destructive-foreground"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <ScrollArea className="max-h-[55vh]">
            {filteredByTab.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">Keine Benachrichtigungen in dieser Kategorie</div>
            ) : (
              filteredByTab.map((n) => (
                <NotificationRow key={n.id} n={n} onClick={() => handleNotificationClick(n)} />
              ))
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Notification Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md gap-0">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-2 text-base">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              Benachrichtigungs-Einstellungen
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Wähle aus, für welche Kategorien du Benachrichtigungen erhalten möchtest. Es werden nur Kategorien angezeigt, die für deine Rolle ({currentRole?.name}) relevant sind.
            </p>
          </DialogHeader>

          <div className="space-y-1">
            {relevantCategories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id];
              const colorClass = CATEGORY_COLORS[cat.id];
              const isOn = preferences[cat.id] !== false;
              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${colorClass}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{cat.label}</p>
                      <p className="text-xs text-muted-foreground">{cat.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={isOn}
                    onCheckedChange={() => togglePref(cat.id)}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-lg border border-border bg-muted/30">
            <p className="text-xs text-muted-foreground">
              <strong>Hinweis:</strong> Push-Benachrichtigungen werden nach Aktivierung direkt in der App angezeigt. E-Mail-Benachrichtigungen können in den <button onClick={() => { setShowSettings(false); navigate("/einstellungen"); }} className="text-primary hover:underline">allgemeinen Einstellungen</button> konfiguriert werden.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
