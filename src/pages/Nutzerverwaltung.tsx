import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Users, Search, Shield, Clock, ChevronRight, ChevronDown, CheckCircle2,
  XCircle, UserPlus, Mail, Phone, MoreHorizontal, Eye, EyeOff, Plus, Pencil, Trash2,
  Key, AtSign, FileText, Send, CheckCheck, Download, CalendarDays, MailCheck, MailX, AlertCircle,
} from "lucide-react";
import { KARRIERESTUFEN, B2C_STAFFEL, B2B_STAFFEL, B2B_MITGLIEDSCHAFT_PREIS } from "@/data/karriereplan";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUserRole, ALL_MENU_ITEMS, type RoleDef } from "@/contexts/UserRoleContext";

// Re-export Role type alias for compatibility
export type Role = RoleDef;

const CUSTOM_ROLE_COLORS = [
  "hsl(340, 65%, 47%)",
  "hsl(190, 70%, 42%)",
  "hsl(25, 85%, 50%)",
  "hsl(160, 55%, 40%)",
  "hsl(270, 50%, 55%)",
  "hsl(200, 70%, 50%)",
  "hsl(350, 60%, 55%)",
  "hsl(80, 55%, 42%)",
];

// ── Sample users ──
interface UserProfile {
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  mobilnummer: string;
  geburtsdatum: string;
  bio: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  land: string;
  firmenname: string;
  rechtsform: string;
  gewerbeanmeldung: string;
  steuernummer: string;
  ustId: string;
  finanzamt: string;
  iban: string;
  bic: string;
  bankname: string;
  emailSignatur: boolean;
  kalenderVerbunden: string[];
  dokumente: Record<string, { name: string; date: string; status: "uploaded" | "pending" | "rejected" }>;
  benachrichtigungen: { email: boolean; feed: boolean; browser: boolean; popup: boolean };
  zweiFA: boolean;
}

const REQUIRED_DOCUMENTS = [
  { id: "personalausweis", label: "Personalausweiskopie" },
  { id: "gewerbeanmeldung", label: "Gewerbeanmeldung" },
  { id: "fuehrungszeugnis", label: "Polizeiliches Führungszeugnis" },
  { id: "vp-vertrag", label: "Vertriebspartnervertrag" },
  { id: "agb", label: "AGB" },
  { id: "verschwiegenheit", label: "Verschwiegenheitsvereinbarung" },
  { id: "dsgvo", label: "DSGVO-Vereinbarung" },
];

function generateUserProfile(name: string, email: string, phone: string): UserProfile {
  const [vorname, ...rest] = name.split(" ");
  const nachname = rest.join(" ");
  return {
    vorname, nachname, email,
    telefon: phone, mobilnummer: phone,
    geburtsdatum: "1985-06-15",
    bio: `Vertriebspartner bei Imondu.`,
    strasse: "Musterstraße", hausnummer: "1", plz: "10115", ort: "Berlin", land: "Deutschland",
    firmenname: `${nachname} Immobilien UG`, rechtsform: "UG (haftungsbeschränkt)",
    gewerbeanmeldung: "Ja – liegt vor",
    steuernummer: "123/456/78901", ustId: "DE123456789", finanzamt: "Finanzamt Berlin",
    iban: "DE89 3704 0044 0532 0130 00", bic: "COBADEFFXXX", bankname: "Commerzbank",
    emailSignatur: true,
    kalenderVerbunden: ["google"],
    dokumente: {
      "personalausweis": { name: "ausweis.pdf", date: "15.01.2026", status: "uploaded" },
      "gewerbeanmeldung": { name: "gewerbe.pdf", date: "15.01.2026", status: "uploaded" },
      "vp-vertrag": { name: "vertrag.pdf", date: "16.01.2026", status: "uploaded" },
      "agb": { name: "agb-bestaetigung.pdf", date: "16.01.2026", status: "uploaded" },
      "verschwiegenheit": { name: "nda.pdf", date: "16.01.2026", status: "pending" },
      "dsgvo": { name: "dsgvo.pdf", date: "16.01.2026", status: "uploaded" },
    },
    benachrichtigungen: { email: true, feed: true, browser: false, popup: true },
    zweiFA: false,
  };
}

interface CRMUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  active: boolean;
  lastLogin: string;
  avatar: string;
  customMenuItems?: string[];
  createdAt: string;
  inviteStatus: "accepted" | "pending" | "expired";
}

const SAMPLE_USERS: CRMUser[] = [
  { id: "u1", name: "Max Müller", email: "max.mueller@example.com", phone: "+49 170 1234567", roleId: "admin", active: true, lastLogin: "2026-02-19T14:32:00", avatar: "MM", createdAt: "2025-06-15", inviteStatus: "accepted" },
  { id: "u2", name: "Lisa Weber", email: "lisa.weber@example.com", phone: "+49 171 2345678", roleId: "vertriebsleiter", active: true, lastLogin: "2026-02-19T11:15:00", avatar: "LW", createdAt: "2025-08-01", inviteStatus: "accepted" },
  { id: "u3", name: "Thomas Schmidt", email: "thomas.schmidt@example.com", phone: "+49 172 3456789", roleId: "vertriebspartner", active: true, lastLogin: "2026-02-18T16:45:00", avatar: "TS", createdAt: "2025-09-10", inviteStatus: "accepted" },
  { id: "u4", name: "Anna Klein", email: "anna.klein@example.com", phone: "+49 173 4567890", roleId: "vertriebspartner", active: true, lastLogin: "2026-02-19T09:22:00", avatar: "AK", createdAt: "2025-10-22", inviteStatus: "accepted" },
  { id: "u5", name: "Stefan Braun", email: "stefan.braun@example.com", phone: "+49 174 5678901", roleId: "marketing", active: true, lastLogin: "2026-02-17T13:10:00", avatar: "SB", createdAt: "2025-11-05", inviteStatus: "accepted" },
  { id: "u6", name: "Julia Fischer", email: "julia.fischer@example.com", phone: "+49 175 6789012", roleId: "backoffice", active: true, lastLogin: "2026-02-19T08:50:00", avatar: "JF", createdAt: "2025-12-01", inviteStatus: "accepted" },
  { id: "u7", name: "Michael Bauer", email: "michael.bauer@example.com", phone: "+49 176 7890123", roleId: "buchhaltung", active: false, lastLogin: "2026-01-28T10:30:00", avatar: "MB", createdAt: "2025-07-20", inviteStatus: "accepted" },
  { id: "u8", name: "Sandra Hoffmann", email: "sandra.hoffmann@example.com", phone: "+49 177 8901234", roleId: "individuell", active: true, lastLogin: "2026-02-19T12:05:00", avatar: "SH", createdAt: "2026-01-15", inviteStatus: "accepted", customMenuItems: ["dashboard", "inbox", "kalender", "b2c", "pipeline", "shop"] },
  { id: "u9", name: "Peter Neumann", email: "peter.neumann@example.com", phone: "+49 178 0123456", roleId: "vertriebspartner", active: false, lastLogin: "–", avatar: "PN", createdAt: "2026-02-18", inviteStatus: "pending" },
  { id: "u10", name: "Karin Wolf", email: "karin.wolf@example.com", phone: "+49 179 1234567", roleId: "vertriebspartner", active: false, lastLogin: "–", avatar: "KW", createdAt: "2026-01-05", inviteStatus: "expired" },
];

function timeAgo(dateStr: string): string {
  if (dateStr === "–") return "–";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `vor ${mins} Min.`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  return `vor ${days} Tag${days > 1 ? "en" : ""}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const INVITE_STATUS_MAP: Record<CRMUser["inviteStatus"], { label: string; icon: typeof MailCheck; className: string }> = {
  accepted: { label: "Angenommen", icon: MailCheck, className: "text-[hsl(var(--success))]" },
  pending: { label: "Ausstehend", icon: Mail, className: "text-amber-500" },
  expired: { label: "Abgelaufen", icon: MailX, className: "text-destructive" },
};

export default function Nutzerverwaltung() {
  const { toast } = useToast();
  const { roles, setRoles } = useUserRole();
  const [users, setUsers] = useState<CRMUser[]>(SAMPLE_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("alle");
  const [selectedUser, setSelectedUser] = useState<CRMUser | null>(null);
  const [showRolesOverview, setShowRolesOverview] = useState(false);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleMenuItems, setNewRoleMenuItems] = useState<string[]>(["dashboard", "inbox", "kalender"]);
  const [showNewRoleForm, setShowNewRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editRoleName, setEditRoleName] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteVorname, setInviteVorname] = useState("");
  const [inviteNachname, setInviteNachname] = useState("");
  const [inviteRoleId, setInviteRoleId] = useState("vertriebspartner");
  const [inviteTelefon, setInviteTelefon] = useState("");
  const [inviteKarrierestufe, setInviteKarrierestufe] = useState("projektassistent");
  const [showContractDialog, setShowContractDialog] = useState(false);
  const [contractUser, setContractUser] = useState<{ name: string; email: string; karrierestufe: string } | null>(null);
  const [contractSent, setContractSent] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [kpiListDialog, setKpiListDialog] = useState<{ title: string; users: CRMUser[] } | null>(null);

  const generateEmail = (vorname: string, nachname: string) => {
    if (!vorname.trim() || !nachname.trim()) return "";
    return `${vorname.trim()[0].toLowerCase()}.${nachname.trim().toLowerCase().replace(/\s+/g, "-").replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss")}@imondu.de`;
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const handleInviteUser = () => {
    const email = generateEmail(inviteVorname, inviteNachname);
    if (!inviteVorname.trim() || !inviteNachname.trim()) return;
    const avatar = `${inviteVorname[0].toUpperCase()}${inviteNachname[0].toUpperCase()}`;
    const fullName = `${inviteVorname.trim()} ${inviteNachname.trim()}`;
    const newUser: CRMUser = {
      id: `u-${Date.now()}`,
      name: fullName,
      email,
      phone: inviteTelefon || "–",
      roleId: inviteRoleId,
      active: false,
      lastLogin: "–",
      avatar,
      createdAt: new Date().toISOString().split("T")[0],
      inviteStatus: "pending",
    };
    setUsers(prev => [...prev, newUser]);
    setShowInviteDialog(false);
    setContractUser({ name: fullName, email, karrierestufe: inviteKarrierestufe });
    setContractSent(false);
    setShowContractDialog(true);
    toast({
      title: "Nutzer eingeladen ✓",
      description: `${fullName} wurde angelegt. Vertragsdokumente werden vorbereitet…`,
    });
    setInviteVorname("");
    setInviteNachname("");
    setInviteTelefon("");
    setInviteRoleId("vertriebspartner");
    setInviteKarrierestufe("projektassistent");
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (selectedUser?.id === userId) setSelectedUser(null);
    setDeleteUserId(null);
    toast({ title: "Nutzer gelöscht", description: `${user?.name} wurde entfernt.` });
  };

  const filtered = users.filter((u) => {
    if (roleFilter !== "alle" && u.roleId !== roleFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    }
    return true;
  });

  const getRole = (roleId: string) => roles.find((r) => r.id === roleId) || roles[roles.length - 1];

  const getUserMenuItems = (user: CRMUser) => {
    if (user.roleId === "individuell" && user.customMenuItems) return user.customMenuItems;
    return getRole(user.roleId).menuItems;
  };

  const toggleUserMenuItem = (userId: string, menuId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const current = u.customMenuItems || getRole(u.roleId).menuItems;
        const updated = current.includes(menuId)
          ? current.filter((m) => m !== menuId)
          : [...current, menuId];
        return { ...u, customMenuItems: updated, roleId: "individuell" };
      })
    );
  };

  const changeUserRole = (userId: string, newRoleId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const role = roles.find((r) => r.id === newRoleId);
        return {
          ...u,
          roleId: newRoleId,
          customMenuItems: role?.fixed ? undefined : u.customMenuItems,
        };
      })
    );
    toast({ title: "Rolle geändert", description: `Neue Rolle: ${getRole(newRoleId).name}` });
  };

  const toggleActive = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, active: !u.active } : u))
    );
  };

  const activeCount = users.filter((u) => u.active).length;
  const inactiveUsers = users.filter((u) => !u.active);
  const pendingUsers = users.filter((u) => u.inviteStatus === "pending");
  const recentUsers = users.filter((u) => { const d = Date.now() - new Date(u.lastLogin).getTime(); return d < 7 * 86400000; });
  const todayOnline = users.filter((u) => u.lastLogin !== "–" && new Date(u.lastLogin).toDateString() === new Date().toDateString());

  const kpiCards = [
    { label: "LETZTE 7 TAGE AKTIV", value: recentUsers.length, action: "Details anzeigen", list: recentUsers, listTitle: "In den letzten 7 Tagen aktiv" },
    { label: "INAKTIVE BENUTZER", value: inactiveUsers.length, action: "Benutzer überprüfen", list: inactiveUsers, listTitle: "Inaktive Benutzer" },
    { label: "DEAKTIVIERTE BENUTZER", value: inactiveUsers.length, action: "Benutzer überprüfen", list: inactiveUsers, listTitle: "Deaktivierte Benutzer" },
    { label: "EINLADUNG AUSSTEHEND", value: pendingUsers.length, action: "Einladungen prüfen", list: pendingUsers, listTitle: "Ausstehende Einladungen" },
    { label: "HEUTE ONLINE", value: todayOnline.length, action: todayOnline.length > 0 ? "Details anzeigen" : null, list: todayOnline, listTitle: "Heute online" },
  ];

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-1 rounded-full gradient-brand" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">Nutzerverwaltung</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {users.length} Nutzer · {activeCount} aktiv
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowRolesOverview(true)}>
              <Shield className="h-4 w-4 mr-1.5" /> Rollen & Berechtigungen
            </Button>
            <Button size="sm" className="gradient-brand border-0 text-white" onClick={() => setShowInviteDialog(true)}>
              <UserPlus className="h-4 w-4 mr-1.5" /> Nutzer einladen
            </Button>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {kpiCards.map((kpi) => (
            <div key={kpi.label} className="glass-card rounded-lg p-4 text-center">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{kpi.label}</p>
              <p className="text-2xl font-display font-bold text-foreground">{kpi.value}</p>
              {kpi.action && kpi.list.length > 0 && (
                <button
                  className="text-xs text-primary hover:underline mt-1 font-medium"
                  onClick={() => setKpiListDialog({ title: kpi.listTitle, users: kpi.list })}
                >
                  {kpi.action}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Name oder E-Mail suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Alle Rollen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle Rollen</SelectItem>
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* User Table */}
        <div className="glass-card-static rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Nutzer</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Rolle</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Einladung</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Erstellt am</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Letzter Login</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const role = getRole(user.roleId);
                const inviteInfo = INVITE_STATUS_MAP[user.inviteStatus];
                const InviteIcon = inviteInfo.icon;
                return (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
                          style={{ background: role.color }}
                        >
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground font-medium">{role.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      {user.active ? (
                        <span className="inline-flex items-center gap-1 text-xs text-[hsl(var(--success))]">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Aktiv
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <XCircle className="h-3.5 w-3.5" /> Inaktiv
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs ${inviteInfo.className}`}>
                        <InviteIcon className="h-3.5 w-3.5" /> {inviteInfo.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {timeAgo(user.lastLogin)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4 mr-2" /> Details anzeigen
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            toggleActive(user.id);
                            toast({ title: user.active ? "Nutzer deaktiviert" : "Nutzer aktiviert" });
                          }}>
                            {user.active ? (
                              <><EyeOff className="h-4 w-4 mr-2" /> Deaktivieren</>
                            ) : (
                              <><Eye className="h-4 w-4 mr-2" /> Aktivieren</>
                            )}
                          </DropdownMenuItem>
                          {user.inviteStatus === "pending" && (
                            <DropdownMenuItem onClick={() => toast({ title: "Einladung erneut gesendet", description: `An ${user.email}` })}>
                              <Send className="h-4 w-4 mr-2" /> Einladung erneut senden
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteUserId(user.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Löschen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── KPI List Dialog ── */}
      <Dialog open={!!kpiListDialog} onOpenChange={() => setKpiListDialog(null)}>
        <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto">
          {kpiListDialog && (
            <>
              <DialogHeader>
                <DialogTitle>{kpiListDialog.title}</DialogTitle>
                <DialogDescription>{kpiListDialog.users.length} Nutzer</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 mt-2">
                {kpiListDialog.users.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">Keine Nutzer in dieser Kategorie.</p>
                ) : (
                  kpiListDialog.users.map((user) => {
                    const role = getRole(user.roleId);
                    const inviteInfo = INVITE_STATUS_MAP[user.inviteStatus];
                    const InviteIcon = inviteInfo.icon;
                    return (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                        onClick={() => { setKpiListDialog(null); setSelectedUser(user); }}
                      >
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0"
                          style={{ background: role.color }}
                        >
                          {user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-foreground">{role.name}</p>
                          <span className={`inline-flex items-center gap-1 text-[10px] ${inviteInfo.className}`}>
                            <InviteIcon className="h-3 w-3" /> {inviteInfo.label}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" /> Nutzer löschen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteUserId && `„${users.find(u => u.id === deleteUserId)?.name}" wird unwiderruflich gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}
            >
              Endgültig löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── User Detail Dialog ── */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedUser && (() => {
            const role = getRole(selectedUser.roleId);
            const menuItems = getUserMenuItems(selectedUser);
            const isIndividuell = selectedUser.roleId === "individuell" || !role.fixed;
            const profile = generateUserProfile(selectedUser.name, selectedUser.email, selectedUser.phone);
            const inviteInfo = INVITE_STATUS_MAP[selectedUser.inviteStatus];
            const InviteIcon = inviteInfo.icon;
            const uploadedCount = REQUIRED_DOCUMENTS.filter(d => profile.dokumente[d.id]).length;
            const ionosEmail = `${profile.vorname.trim()[0]?.toLowerCase() || "x"}.${profile.nachname.trim().toLowerCase().replace(/\s+/g, "-").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")}@imondu.de`;

            const InfoRow = ({ label, value }: { label: string; value: string }) => (
              <div className="flex items-start justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <span className="text-xs text-foreground text-right max-w-[60%]">{value || "–"}</span>
              </div>
            );

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground"
                      style={{ background: role.color }}
                    >
                      {selectedUser.avatar}
                    </div>
                    <div>
                      <span>{selectedUser.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-normal text-muted-foreground">{role.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{selectedUser.active ? "Aktiv" : "Inaktiv"}</span>
                        <span className={`inline-flex items-center gap-1 text-[10px] ${inviteInfo.className}`}>
                          <InviteIcon className="h-3 w-3" /> {inviteInfo.label}
                        </span>
                      </div>
                    </div>
                  </DialogTitle>
                  <DialogDescription>{selectedUser.email} · {selectedUser.phone} · Erstellt: {formatDate(selectedUser.createdAt)}</DialogDescription>
                </DialogHeader>

                {/* Admin Controls */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Rolle</p>
                    <Select
                      value={selectedUser.roleId}
                      onValueChange={(v) => {
                        changeUserRole(selectedUser.id, v);
                        setSelectedUser({ ...selectedUser, roleId: v, customMenuItems: roles.find((r) => r.id === v)?.fixed ? undefined : selectedUser.customMenuItems });
                      }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Status</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        toggleActive(selectedUser.id);
                        setSelectedUser({ ...selectedUser, active: !selectedUser.active });
                      }}
                    >
                      {selectedUser.active ? (
                        <><Eye className="h-3.5 w-3.5 mr-1.5 text-[hsl(var(--success))]" /> Aktiv</>
                      ) : (
                        <><EyeOff className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" /> Inaktiv</>
                      )}
                    </Button>
                  </div>
                </div>

                <Separator className="my-3" />

                {/* Tabs mirroring Einstellungen */}
                <Tabs defaultValue="profil" className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0 h-auto gap-0 flex-wrap">
                    {[
                      { value: "profil", label: "Profil" },
                      { value: "email", label: "E-Mail" },
                      { value: "gewerbe", label: "Gewerbedaten" },
                      { value: "finanzen", label: "Steuer & Bank" },
                      { value: "unterlagen", label: "Unterlagen" },
                      { value: "kalender", label: "Kalender" },
                      { value: "benachrichtigungen", label: "Benachrichtigungen" },
                      { value: "berechtigungen", label: "Berechtigungen" },
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 text-xs font-medium text-muted-foreground data-[state=active]:text-foreground"
                      >
                        {tab.label}
                        {tab.value === "unterlagen" && uploadedCount < REQUIRED_DOCUMENTS.length && (
                          <span className="ml-1.5 h-2 w-2 rounded-full bg-amber-500 inline-block" />
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* PROFIL */}
                  <TabsContent value="profil" className="mt-4 space-y-4">
                    <div className="rounded-lg border border-border p-4 bg-card">
                      <p className="text-sm font-semibold text-foreground mb-3">Persönliche Daten</p>
                      <InfoRow label="Vorname" value={profile.vorname} />
                      <InfoRow label="Nachname" value={profile.nachname} />
                      <InfoRow label="E-Mail" value={profile.email} />
                      <InfoRow label="Telefon" value={profile.telefon} />
                      <InfoRow label="Mobilnummer" value={profile.mobilnummer} />
                      <InfoRow label="Geburtsdatum" value={new Date(profile.geburtsdatum).toLocaleDateString("de-DE")} />
                      <InfoRow label="Über mich" value={profile.bio} />
                    </div>
                    <div className="rounded-lg border border-border p-4 bg-card">
                      <p className="text-sm font-semibold text-foreground mb-3">Adresse</p>
                      <InfoRow label="Straße / Nr." value={`${profile.strasse} ${profile.hausnummer}`} />
                      <InfoRow label="PLZ / Ort" value={`${profile.plz} ${profile.ort}`} />
                      <InfoRow label="Land" value={profile.land} />
                    </div>
                  </TabsContent>

                  {/* E-MAIL */}
                  <TabsContent value="email" className="mt-4 space-y-4">
                    <div className="rounded-lg border border-border p-4 bg-card">
                      <p className="text-sm font-semibold text-foreground mb-3">E-Mail-Konto</p>
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/15 mb-3">
                        <p className="text-xs text-muted-foreground mb-0.5">Geschäftliche E-Mail</p>
                        <p className="text-sm font-mono font-semibold text-primary">{ionosEmail}</p>
                      </div>
                      <InfoRow label="IMAP Server" value="imap.ionos.de" />
                      <InfoRow label="SMTP Server" value="smtp.ionos.de" />
                      <InfoRow label="E-Mail-Signatur" value={profile.emailSignatur ? "Aktiviert" : "Deaktiviert"} />
                    </div>
                  </TabsContent>

                  {/* GEWERBEDATEN */}
                  <TabsContent value="gewerbe" className="mt-4 space-y-4">
                    <div className="rounded-lg border border-border p-4 bg-card">
                      <p className="text-sm font-semibold text-foreground mb-3">Gewerbedaten</p>
                      <InfoRow label="Firmenname" value={profile.firmenname} />
                      <InfoRow label="Rechtsform" value={profile.rechtsform} />
                      <InfoRow label="Gewerbeanmeldung" value={profile.gewerbeanmeldung} />
                    </div>
                  </TabsContent>

                  {/* STEUER & BANK */}
                  <TabsContent value="finanzen" className="mt-4 space-y-4">
                    <div className="rounded-lg border border-border p-4 bg-card">
                      <p className="text-sm font-semibold text-foreground mb-3">Steuerdaten</p>
                      <InfoRow label="Steuernummer" value={profile.steuernummer} />
                      <InfoRow label="USt-IdNr." value={profile.ustId} />
                      <InfoRow label="Finanzamt" value={profile.finanzamt} />
                    </div>
                    <div className="rounded-lg border border-border p-4 bg-card">
                      <p className="text-sm font-semibold text-foreground mb-3">Bankverbindung</p>
                      <InfoRow label="IBAN" value={profile.iban} />
                      <InfoRow label="BIC" value={profile.bic} />
                      <InfoRow label="Bank" value={profile.bankname} />
                    </div>
                  </TabsContent>

                  {/* UNTERLAGEN */}
                  <TabsContent value="unterlagen" className="mt-4 space-y-4">
                    <div className="rounded-lg border border-border p-4 bg-card">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-foreground">Pflichtdokumente</p>
                        <Badge variant={uploadedCount === REQUIRED_DOCUMENTS.length ? "default" : "outline"} className={uploadedCount === REQUIRED_DOCUMENTS.length ? "bg-[hsl(var(--success))] text-white border-0" : ""}>
                          {uploadedCount} / {REQUIRED_DOCUMENTS.length}
                        </Badge>
                      </div>
                      <Progress value={(uploadedCount / REQUIRED_DOCUMENTS.length) * 100} className="h-2 mb-4" />
                      <div className="space-y-2">
                        {REQUIRED_DOCUMENTS.map((doc) => {
                          const uploaded = profile.dokumente[doc.id];
                          return (
                            <div key={doc.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                              <div className="flex items-center gap-2">
                                {uploaded ? (
                                  uploaded.status === "uploaded" ? <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
                                  : uploaded.status === "pending" ? <Clock className="h-3.5 w-3.5 text-amber-500" />
                                  : <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                                <span className="text-xs text-foreground">{doc.label}</span>
                              </div>
                              {uploaded ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-muted-foreground">{uploaded.name} · {uploaded.date}</span>
                                  <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${
                                    uploaded.status === "uploaded" ? "border-[hsl(var(--success))]/30 text-[hsl(var(--success))]"
                                    : uploaded.status === "pending" ? "border-amber-500/30 text-amber-500"
                                    : "border-destructive/30 text-destructive"
                                  }`}>
                                    {uploaded.status === "uploaded" ? "Bestätigt" : uploaded.status === "pending" ? "In Prüfung" : "Abgelehnt"}
                                  </Badge>
                                </div>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">Nicht hochgeladen</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>

                  {/* KALENDER */}
                  <TabsContent value="kalender" className="mt-4 space-y-4">
                    <div className="rounded-lg border border-border p-4 bg-card">
                      <p className="text-sm font-semibold text-foreground mb-3">Kalender-Verbindungen</p>
                      {["Google Calendar", "Microsoft Outlook", "Apple Kalender"].map((cal) => {
                        const id = cal.split(" ")[0].toLowerCase();
                        const connected = profile.kalenderVerbunden.includes(id);
                        return (
                          <div key={id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                            <span className="text-xs text-foreground">{cal}</span>
                            {connected ? (
                              <span className="inline-flex items-center gap-1 text-xs text-[hsl(var(--success))]"><CheckCircle2 className="h-3.5 w-3.5" /> Verbunden</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Nicht verbunden</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  {/* BENACHRICHTIGUNGEN */}
                  <TabsContent value="benachrichtigungen" className="mt-4 space-y-4">
                    <div className="rounded-lg border border-border p-4 bg-card">
                      <p className="text-sm font-semibold text-foreground mb-3">Benachrichtigungs-Kanäle</p>
                      <InfoRow label="E-Mail-Benachrichtigungen" value={profile.benachrichtigungen.email ? "Aktiviert" : "Deaktiviert"} />
                      <InfoRow label="Feed (Glockensymbol)" value={profile.benachrichtigungen.feed ? "Aktiviert" : "Deaktiviert"} />
                      <InfoRow label="Browser-Benachrichtigungen" value={profile.benachrichtigungen.browser ? "Aktiviert" : "Deaktiviert"} />
                      <InfoRow label="Pop-up-Benachrichtigungen" value={profile.benachrichtigungen.popup ? "Aktiviert" : "Deaktiviert"} />
                    </div>
                    <div className="rounded-lg border border-border p-4 bg-card">
                      <p className="text-sm font-semibold text-foreground mb-3">Sicherheit</p>
                      <InfoRow label="Zwei-Faktor-Authentifizierung" value={profile.zweiFA ? "Eingerichtet" : "Nicht eingerichtet"} />
                      <InfoRow label="Letzter Login" value={selectedUser.lastLogin === "–" ? "–" : new Date(selectedUser.lastLogin).toLocaleString("de-DE")} />
                    </div>
                  </TabsContent>

                  {/* BERECHTIGUNGEN */}
                  <TabsContent value="berechtigungen" className="mt-4 space-y-4">
                    <div className="rounded-lg border border-border p-4 bg-card">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Menüpunkte ({menuItems.length}/{ALL_MENU_ITEMS.length})
                        {!isIndividuell && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                            fest durch Rolle „{role.name}"
                          </span>
                        )}
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 max-h-[300px] overflow-y-auto">
                        {ALL_MENU_ITEMS.map((item) => {
                          const isChecked = menuItems.includes(item.id);
                          return (
                            <label
                              key={item.id}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                                isIndividuell ? "cursor-pointer hover:bg-secondary/50" : "cursor-default opacity-70"
                              } ${isChecked ? "bg-primary/5 border border-primary/15" : "border border-transparent"}`}
                            >
                              <Checkbox
                                checked={isChecked}
                                disabled={!isIndividuell}
                                onCheckedChange={() => {
                                  toggleUserMenuItem(selectedUser.id, item.id);
                                  const current = selectedUser.customMenuItems || getRole(selectedUser.roleId).menuItems;
                                  const updated = current.includes(item.id)
                                    ? current.filter((m) => m !== item.id)
                                    : [...current, item.id];
                                  setSelectedUser({ ...selectedUser, customMenuItems: updated, roleId: "individuell" });
                                }}
                              />
                              <span className="text-foreground">{item.label}</span>
                            </label>
                          );
                        })}
                      </div>
                      {!isIndividuell && (
                        <p className="text-[10px] text-muted-foreground mt-2">
                          Wähle die Rolle „Individuell", um einzelne Menüpunkte manuell zuzuweisen.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ── Roles Overview Dialog ── */}
      <Dialog open={showRolesOverview} onOpenChange={(open) => { setShowRolesOverview(open); if (!open) { setShowNewRoleForm(false); setEditingRole(null); } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Rollen & Berechtigungen
            </DialogTitle>
            <DialogDescription>Übersicht aller Rollen – eigene Rollen können erstellt, umbenannt und angepasst werden</DialogDescription>
          </DialogHeader>

          {/* New Role Form */}
          {showNewRoleForm ? (
            <div className="border border-border rounded-lg p-4 space-y-3 bg-secondary/20">
              <p className="text-sm font-semibold text-foreground">Neue Rolle erstellen</p>
              <Input
                placeholder="Rollenname eingeben…"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="h-9"
              />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Menüpunkte auswählen ({newRoleMenuItems.length}/{ALL_MENU_ITEMS.length})</p>
                <div className="grid grid-cols-2 gap-1.5 max-h-[200px] overflow-y-auto">
                  {ALL_MENU_ITEMS.map((item) => {
                    const isChecked = newRoleMenuItems.includes(item.id);
                    return (
                      <label key={item.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer hover:bg-secondary/50 transition-colors ${isChecked ? "bg-primary/5 border border-primary/15" : "border border-transparent"}`}>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => setNewRoleMenuItems(prev => prev.includes(item.id) ? prev.filter(m => m !== item.id) : [...prev, item.id])}
                        />
                        <span className="text-foreground">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => { setShowNewRoleForm(false); setNewRoleName(""); setNewRoleMenuItems(["dashboard", "inbox", "kalender"]); }}>Abbrechen</Button>
                <Button size="sm" className="gradient-brand border-0 text-white" disabled={!newRoleName.trim()} onClick={() => {
                  const id = `custom-${Date.now()}`;
                  const color = CUSTOM_ROLE_COLORS[roles.filter(r => !r.fixed && r.id !== "individuell").length % CUSTOM_ROLE_COLORS.length];
                  setRoles(prev => [...prev.filter(r => r.id !== "individuell"), { id, name: newRoleName.trim(), color, fixed: false, menuItems: newRoleMenuItems }, prev.find(r => r.id === "individuell")!]);
                  setNewRoleName("");
                  setNewRoleMenuItems(["dashboard", "inbox", "kalender"]);
                  setShowNewRoleForm(false);
                  toast({ title: "Rolle erstellt", description: `"${newRoleName.trim()}" wurde hinzugefügt` });
                }}>Rolle erstellen</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="w-full" onClick={() => setShowNewRoleForm(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Eigene Rolle erstellen
            </Button>
          )}

          <div className="space-y-2 mt-2">
            {roles.map((role) => {
              const isExpanded = expandedRole === role.id;
              const userCount = users.filter((u) => u.roleId === role.id).length;
              const isCustom = !role.fixed && role.id !== "individuell";
              const isEditing = editingRole === role.id;
              return (
                <div key={role.id} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedRole(isExpanded ? null : role.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-secondary/30 transition-colors"
                  >
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: role.color }} />
                    {isEditing ? (
                      <Input
                        value={editRoleName}
                        onChange={(e) => setEditRoleName(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setRoles(prev => prev.map(r => r.id === role.id ? { ...r, name: editRoleName.trim() || r.name } : r));
                            setEditingRole(null);
                            toast({ title: "Rolle umbenannt" });
                          }
                          if (e.key === "Escape") setEditingRole(null);
                        }}
                        className="h-7 text-sm font-semibold flex-1"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm font-semibold text-foreground flex-1 text-left">{role.name}</span>
                    )}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                      {userCount} Nutzer
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                      {role.menuItems.length} Menüpunkte
                    </span>
                    {role.fixed ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">fest</span>
                    ) : role.id === "individuell" ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">individuell</span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent-foreground">eigene</span>
                    )}
                    {isCustom && !isEditing && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); setEditingRole(role.id); setEditRoleName(role.name); }} className="p-1 hover:bg-muted rounded">
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setRoles(prev => prev.filter(r => r.id !== role.id)); setUsers(prev => prev.map(u => u.roleId === role.id ? { ...u, roleId: "individuell", customMenuItems: role.menuItems } : u)); toast({ title: "Rolle gelöscht" }); }} className="p-1 hover:bg-destructive/10 rounded">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      </>
                    )}
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-border/50">
                      {isCustom ? (
                        <div className="grid grid-cols-2 gap-1.5 mt-3 max-h-[250px] overflow-y-auto">
                          {ALL_MENU_ITEMS.map((item) => {
                            const isChecked = role.menuItems.includes(item.id);
                            return (
                              <label key={item.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer hover:bg-secondary/50 transition-colors ${isChecked ? "bg-primary/5 border border-primary/15" : "border border-transparent"}`}>
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() => {
                                    setRoles(prev => prev.map(r => r.id === role.id ? { ...r, menuItems: isChecked ? r.menuItems.filter(m => m !== item.id) : [...r.menuItems, item.id] } : r));
                                  }}
                                />
                                <span className="text-foreground">{item.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {role.menuItems.map((menuId) => {
                            const item = ALL_MENU_ITEMS.find((m) => m.id === menuId);
                            return item ? (
                              <span
                                key={menuId}
                                className="text-[10px] px-2 py-1 rounded-full border border-border bg-secondary/50 text-foreground"
                              >
                                {item.label}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                      {role.id === "individuell" && (
                        <p className="text-[10px] text-muted-foreground mt-2">
                          Bei dieser Rolle können Menüpunkte individuell pro Nutzer zugewiesen werden.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Invite User Dialog ── */}
      <Dialog open={showInviteDialog} onOpenChange={(open) => { setShowInviteDialog(open); if (!open) { setInviteVorname(""); setInviteNachname(""); setInviteTelefon(""); setInviteRoleId("vertriebspartner"); } }}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" /> Neuen Nutzer einladen
            </DialogTitle>
            <DialogDescription>
              Der Nutzer erhält automatisch eine IONOS-E-Mail-Adresse und ein Erstpasswort.
              Beim ersten Login muss das Passwort geändert werden.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Vorname *</label>
                <Input value={inviteVorname} onChange={(e) => setInviteVorname(e.target.value)} placeholder="Max" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Nachname *</label>
                <Input value={inviteNachname} onChange={(e) => setInviteNachname(e.target.value)} placeholder="Müller" />
              </div>
            </div>

            {/* Auto-generated email */}
            {inviteVorname.trim() && inviteNachname.trim() && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
                <div className="flex items-center gap-2 mb-1">
                  <AtSign className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground">Automatisch generierte E-Mail</span>
                </div>
                <p className="text-sm font-mono font-semibold text-primary">{generateEmail(inviteVorname, inviteNachname)}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Diese IONOS-Adresse wird bei der Anlage erstellt. Der Nutzer meldet sich damit im Backoffice an.
                </p>
              </div>
            )}

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Telefonnummer (optional)</label>
              <Input value={inviteTelefon} onChange={(e) => setInviteTelefon(e.target.value)} placeholder="+49 170 …" />
            </div>

            {/* Karrierestufe / Provisionsstufe */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Provisionsstufe (Karriereplan) *</label>
              <Select value={inviteKarrierestufe} onValueChange={setInviteKarrierestufe}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {KARRIERESTUFEN.map((k) => (
                    <SelectItem key={k.id} value={k.id}>
                      <span className="flex items-center gap-2">
                        <span>{k.icon}</span> {k.title}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(() => {
                const stufe = KARRIERESTUFEN.find(k => k.id === inviteKarrierestufe);
                if (!stufe) return null;
                return (
                  <div className="p-3 rounded-lg bg-secondary/30 border border-border mt-2">
                    <p className="text-xs font-semibold text-foreground mb-1">{stufe.icon} {stufe.title}</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                      <div><span className="font-medium text-foreground">B2C:</span> {stufe.b2cMin}</div>
                      <div><span className="font-medium text-foreground">B2B:</span> {stufe.b2bRange}</div>
                    </div>
                    <ul className="mt-2 space-y-0.5">
                      {stufe.vorteile.slice(0, 3).map((v, i) => (
                        <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1">
                          <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" /> {v}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
            </div>

            {/* Role selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Rolle zuweisen *</label>
              <Select value={inviteRoleId} onValueChange={setInviteRoleId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                        {r.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Show permissions of selected role */}
            {(() => {
              const selectedRole = getRole(inviteRoleId);
              return (
                <div className="border border-border rounded-lg p-4 bg-secondary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4" style={{ color: selectedRole.color }} />
                    <span className="text-sm font-semibold text-foreground">
                      Berechtigungen der Rolle „{selectedRole.name}"
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground ml-auto">
                      {selectedRole.menuItems.length} Menüpunkte
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRole.menuItems.map((menuId) => {
                      const item = ALL_MENU_ITEMS.find((m) => m.id === menuId);
                      return item ? (
                        <span
                          key={menuId}
                          className="text-[10px] px-2 py-1 rounded-full border border-border bg-card text-foreground"
                        >
                          {item.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                  {inviteRoleId === "individuell" && (
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Bei „Individuell" können Menüpunkte nach der Einladung pro Nutzer angepasst werden.
                    </p>
                  )}
                </div>
              );
            })()}

            {/* Info box */}
            <div className="p-3 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-start gap-2">
                <Key className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <p className="font-medium text-foreground mb-1">Ablauf nach der Einladung:</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>IONOS-E-Mail-Adresse wird automatisch erstellt</li>
                    <li>Nutzer erhält ein automatisch generiertes Erstpasswort</li>
                    <li>Beim ersten Login muss das Passwort zwingend geändert werden</li>
                    <li>Die E-Mail-Adresse wird in den Einstellungen hinterlegt</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>Abbrechen</Button>
              <Button
                className="gradient-brand border-0 text-white"
                disabled={!inviteVorname.trim() || !inviteNachname.trim()}
                onClick={handleInviteUser}
              >
                <UserPlus className="h-4 w-4 mr-1.5" /> Nutzer einladen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Contract Preview Dialog ── */}
      <Dialog open={showContractDialog} onOpenChange={(open) => { setShowContractDialog(open); if (!open) setContractSent(false); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Vertragsdokumente
            </DialogTitle>
            <DialogDescription>
              Automatisch generiert für {contractUser?.name} – bitte prüfen und zur Unterschrift senden.
            </DialogDescription>
          </DialogHeader>

          {contractUser && (() => {
            const stufe = KARRIERESTUFEN.find(k => k.id === contractUser.karrierestufe) || KARRIERESTUFEN[0];
            const today = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
            return (
              <div className="space-y-6 mt-2">
                {/* Document 1: Vertriebspartnervertrag */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 border-b border-border">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Vertriebspartnervertrag</span>
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {stufe.icon} {stufe.title}
                    </span>
                  </div>
                  <div className="p-4 text-xs text-muted-foreground space-y-3 font-mono bg-card">
                    <p className="text-center font-semibold text-foreground text-sm">VERTRIEBSPARTNERVERTRAG</p>
                    <p className="text-center text-[10px]">zwischen imondu GmbH und {contractUser.name}</p>
                    <hr className="border-border" />
                    <p><strong className="text-foreground">§ 1 Vertragsgegenstand</strong><br />
                      Der Vertriebspartner wird als <strong className="text-foreground">{stufe.title}</strong> für die imondu GmbH tätig und vermittelt Immobilieninserate (B2C) sowie Partnermitgliedschaften (B2B).
                    </p>
                    <p><strong className="text-foreground">§ 2 Provisionssätze B2C (Inserate)</strong></p>
                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-1 text-foreground">Inserate / Quartal</th>
                          <th className="text-right py-1 text-foreground">Netto-Provision</th>
                        </tr>
                      </thead>
                      <tbody>
                        {B2C_STAFFEL.map((s, i) => (
                          <tr key={i} className="border-b border-border/50">
                            <td className="py-1">{s.min} – {s.max ?? "∞"}</td>
                            <td className="text-right py-1 font-semibold text-foreground">{s.provision} € / Inserat</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p><strong className="text-foreground">§ 3 Provisionssätze B2B (Mitgliedschaften)</strong><br />
                      Mitgliedschaftspreis: {B2B_MITGLIEDSCHAFT_PREIS} € / Monat
                    </p>
                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-1 text-foreground">Monatsumsatz</th>
                          <th className="text-right py-1 text-foreground">Provision</th>
                        </tr>
                      </thead>
                      <tbody>
                        {B2B_STAFFEL.map((s, i) => (
                          <tr key={i} className="border-b border-border/50">
                            <td className="py-1">{s.min.toLocaleString("de-DE")} – {s.max ? s.max.toLocaleString("de-DE") : "∞"} €</td>
                            <td className="text-right py-1 font-semibold text-foreground">{s.provision} %</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {stufe.overrideTeam && (
                      <p><strong className="text-foreground">§ 4 Override-Provision</strong><br />
                        {stufe.overrideTeam} auf den Nettoumsatz des betreuten Teams.
                      </p>
                    )}
                    <p><strong className="text-foreground">§ {stufe.overrideTeam ? "5" : "4"} Einstiegsstufe</strong><br />
                      Der Vertriebspartner startet als <strong className="text-foreground">{stufe.title}</strong> mit folgenden Konditionen:<br />
                      • B2C: {stufe.b2cMin}<br />
                      • B2B: {stufe.b2bRange}
                    </p>
                    <div className="grid grid-cols-2 gap-8 mt-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-6">Ort, Datum: _________________, {today}</p>
                        <div className="border-t border-foreground/30 pt-1">
                          <p className="text-[10px]">imondu GmbH (Auftraggeber)</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-6">&nbsp;</p>
                        <div className="border-t border-foreground/30 pt-1">
                          <p className="text-[10px]">{contractUser.name} (Vertriebspartner)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document 2: NDA + DSGVO */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">Verschwiegenheitserklärung & Datenschutz (DSGVO)</span>
                  </div>
                  <div className="p-4 text-xs text-muted-foreground space-y-3 font-mono bg-card">
                    <p className="text-center font-semibold text-foreground text-sm">VERSCHWIEGENHEITS- UND DATENSCHUTZERKLÄRUNG</p>
                    <p className="text-center text-[10px]">Anlage zum Vertriebspartnervertrag – {contractUser.name}</p>
                    <hr className="border-border" />
                    <p><strong className="text-foreground">§ 1 Geheimhaltungsverpflichtung</strong><br />
                      Der Vertriebspartner verpflichtet sich, alle vertraulichen Informationen, Geschäftsgeheimnisse, Kundendaten, Provisionssätze und interne Prozesse der imondu GmbH streng vertraulich zu behandeln. Diese Verpflichtung gilt auch über die Beendigung des Vertragsverhältnisses hinaus.
                    </p>
                    <p><strong className="text-foreground">§ 2 Personenbezogene Daten (DSGVO)</strong><br />
                      Der Vertriebspartner wird im Rahmen seiner Tätigkeit Zugang zu personenbezogenen Daten (Name, Adresse, E-Mail, Telefon, Immobiliendaten) von Eigentümern und Geschäftspartnern erhalten. Er verpflichtet sich zur Einhaltung der EU-DSGVO und des BDSG.
                    </p>
                    <p><strong className="text-foreground">§ 3 Pflichten</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Personenbezogene Daten nur im Rahmen der Vertriebstätigkeit verwenden</li>
                      <li>Keine Weitergabe an unbefugte Dritte</li>
                      <li>Datensicherung durch Passwortschutz und sichere Endgeräte</li>
                      <li>Unverzügliche Meldung von Datenschutzverstößen an die imondu GmbH</li>
                      <li>Löschung aller Daten bei Vertragsbeendigung</li>
                    </ul>
                    <p><strong className="text-foreground">§ 4 Konsequenzen bei Verstoß</strong><br />
                      Bei Verstoß gegen diese Vereinbarung behält sich die imondu GmbH rechtliche Schritte sowie Schadensersatzforderungen vor. Schwere Verstöße können zur fristlosen Beendigung des Vertriebspartnervertrages führen.
                    </p>
                    <p><strong className="text-foreground">§ 5 Einwilligungserklärung</strong><br />
                      Der Vertriebspartner willigt ein, dass seine personenbezogenen Daten (Name, E-Mail, Telefon, VP-Nummer, Provision) im CRM-System der imondu GmbH verarbeitet und gespeichert werden. Diese Einwilligung kann jederzeit schriftlich widerrufen werden.
                    </p>
                    <div className="grid grid-cols-2 gap-8 mt-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-6">Ort, Datum: _________________, {today}</p>
                        <div className="border-t border-foreground/30 pt-1">
                          <p className="text-[10px]">imondu GmbH</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-6">&nbsp;</p>
                        <div className="border-t border-foreground/30 pt-1">
                          <p className="text-[10px]">{contractUser.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "PDF-Download", description: "Vertragsdokumente werden als PDF heruntergeladen… (Simulation)" })}>
                    <Download className="h-4 w-4 mr-1.5" /> PDFs herunterladen
                  </Button>
                  <div className="flex-1" />
                  {contractSent ? (
                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--success))] font-medium">
                      <CheckCheck className="h-4 w-4" /> Zur Unterschrift versendet an {contractUser.email}
                    </div>
                  ) : (
                    <Button
                      className="gradient-brand border-0 text-white"
                      onClick={() => {
                        setContractSent(true);
                        toast({
                          title: "Dokumente versendet ✓",
                          description: `Vertriebspartnervertrag und NDA/DSGVO wurden zur digitalen Unterschrift an ${contractUser.email} gesendet.`,
                        });
                      }}
                    >
                      <Send className="h-4 w-4 mr-1.5" /> Zur Unterschrift senden
                    </Button>
                  )}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </CRMLayout>
  );
}
