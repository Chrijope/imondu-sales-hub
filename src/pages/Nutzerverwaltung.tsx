import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Users, Search, Shield, Clock, ChevronRight, ChevronDown, CheckCircle2,
  XCircle, UserPlus, Mail, Phone, MoreHorizontal, Eye, EyeOff, Plus, Pencil, Trash2,
  Key, AtSign,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ── All menu items that can be assigned ──
const ALL_MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "inbox", label: "Inbox" },
  { id: "kalender", label: "Kalender" },
  { id: "news", label: "News" },
  { id: "presentation", label: "Präsentation" },
  { id: "analysetool", label: "Analysetool" },
  { id: "unterlagen", label: "Unterlagen" },
  { id: "pipeline", label: "Pipeline" },
  { id: "chat", label: "Chat" },
  { id: "kontakte", label: "Kontakte" },
  { id: "inserate", label: "Inserate" },
  { id: "b2c", label: "B2C – Eigentümer" },
  { id: "b2b", label: "B2B – Partner" },
  { id: "teampartner", label: "Teampartner" },
  { id: "auswertungen", label: "Auswertungen" },
  { id: "abrechnungen", label: "Abrechnungen" },
  { id: "statistik", label: "Statistik" },
  { id: "ansprechpartner", label: "Ansprechpartner" },
  { id: "marketing", label: "Marketing" },
  { id: "berater-microseite", label: "Berater-Microseite" },
  { id: "academy", label: "Academy" },
  { id: "entwickler", label: "Entwickler" },
  { id: "shop", label: "Shop" },
  { id: "nutzerverwaltung", label: "Nutzerverwaltung" },
  { id: "einstellungen", label: "Einstellungen" },
  { id: "dialer", label: "Powerdialer" },
];

// ── Roles with pre-assigned menu items ──
export interface Role {
  id: string;
  name: string;
  color: string;
  fixed: boolean; // false = individuell
  menuItems: string[];
}

const DEFAULT_ROLES: Role[] = [
  {
    id: "admin",
    name: "Admin",
    color: "hsl(0, 72%, 51%)",
    fixed: true,
    menuItems: ALL_MENU_ITEMS.map((m) => m.id),
  },
  {
    id: "vertriebsleiter",
    name: "Vertriebsleiter",
    color: "hsl(250, 60%, 52%)",
    fixed: true,
    menuItems: [
      "dashboard", "inbox", "kalender", "news", "pipeline", "chat", "kontakte",
      "b2c", "b2b", "teampartner", "auswertungen", "abrechnungen", "statistik",
      "ansprechpartner", "marketing", "academy", "dialer", "inserate", "nutzerverwaltung",
    ],
  },
  {
    id: "vertriebspartner",
    name: "Vertriebspartner",
    color: "hsl(152, 60%, 42%)",
    fixed: true,
    menuItems: [
      "dashboard", "inbox", "kalender", "news", "presentation", "unterlagen",
      "pipeline", "chat", "kontakte", "b2c", "b2b", "teampartner", "abrechnungen",
      "statistik", "academy", "shop", "berater-microseite", "dialer", "inserate",
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    color: "hsl(280, 60%, 52%)",
    fixed: true,
    menuItems: [
      "dashboard", "inbox", "kalender", "news", "kontakte", "marketing",
      "auswertungen", "statistik", "academy",
    ],
  },
  {
    id: "backoffice",
    name: "Backoffice",
    color: "hsl(210, 80%, 52%)",
    fixed: true,
    menuItems: [
      "dashboard", "inbox", "kalender", "kontakte", "inserate", "abrechnungen",
      "entwickler", "ansprechpartner", "unterlagen", "nutzerverwaltung",
    ],
  },
  {
    id: "buchhaltung",
    name: "Buchhaltung",
    color: "hsl(38, 92%, 50%)",
    fixed: true,
    menuItems: [
      "dashboard", "inbox", "kalender", "abrechnungen", "auswertungen", "statistik",
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
}

const SAMPLE_USERS: CRMUser[] = [
  { id: "u1", name: "Max Müller", email: "max.mueller@example.com", phone: "+49 170 1234567", roleId: "admin", active: true, lastLogin: "2026-02-19T14:32:00", avatar: "MM" },
  { id: "u2", name: "Lisa Weber", email: "lisa.weber@example.com", phone: "+49 171 2345678", roleId: "vertriebsleiter", active: true, lastLogin: "2026-02-19T11:15:00", avatar: "LW" },
  { id: "u3", name: "Thomas Schmidt", email: "thomas.schmidt@example.com", phone: "+49 172 3456789", roleId: "vertriebspartner", active: true, lastLogin: "2026-02-18T16:45:00", avatar: "TS" },
  { id: "u4", name: "Anna Klein", email: "anna.klein@example.com", phone: "+49 173 4567890", roleId: "vertriebspartner", active: true, lastLogin: "2026-02-19T09:22:00", avatar: "AK" },
  { id: "u5", name: "Stefan Braun", email: "stefan.braun@example.com", phone: "+49 174 5678901", roleId: "marketing", active: true, lastLogin: "2026-02-17T13:10:00", avatar: "SB" },
  { id: "u6", name: "Julia Fischer", email: "julia.fischer@example.com", phone: "+49 175 6789012", roleId: "backoffice", active: true, lastLogin: "2026-02-19T08:50:00", avatar: "JF" },
  { id: "u7", name: "Michael Bauer", email: "michael.bauer@example.com", phone: "+49 176 7890123", roleId: "buchhaltung", active: false, lastLogin: "2026-01-28T10:30:00", avatar: "MB" },
  { id: "u8", name: "Sandra Hoffmann", email: "sandra.hoffmann@example.com", phone: "+49 177 8901234", roleId: "individuell", active: true, lastLogin: "2026-02-19T12:05:00", avatar: "SH", customMenuItems: ["dashboard", "inbox", "kalender", "b2c", "pipeline", "shop"] },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `vor ${mins} Min.`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  return `vor ${days} Tag${days > 1 ? "en" : ""}`;
}

export default function Nutzerverwaltung() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
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
    const newUser: CRMUser = {
      id: `u-${Date.now()}`,
      name: `${inviteVorname.trim()} ${inviteNachname.trim()}`,
      email,
      phone: inviteTelefon || "–",
      roleId: inviteRoleId,
      active: true,
      lastLogin: "–",
      avatar,
    };
    setUsers(prev => [...prev, newUser]);
    toast({
      title: "Nutzer eingeladen ✓",
      description: `${newUser.name} wurde mit der Rolle "${getRole(inviteRoleId).name}" eingeladen. E-Mail: ${email}`,
    });
    setShowInviteDialog(false);
    setInviteVorname("");
    setInviteNachname("");
    setInviteTelefon("");
    setInviteRoleId("vertriebspartner");
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

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in">
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
          {[
            { label: "LETZTE BENUTZER", value: users.filter((u) => { const d = Date.now() - new Date(u.lastLogin).getTime(); return d < 7 * 86400000; }).length, action: null },
            { label: "INAKTIVE BENUTZER", value: users.filter((u) => !u.active).length, action: "Benutzer überprüfen" },
            { label: "DEAKTIVIERTE BENUTZER", value: users.filter((u) => !u.active).length, action: "Benutzer überprüfen" },
            { label: "EINLADUNG AUSSTEHEND", value: users.filter((u) => u.lastLogin === "–").length, action: "Einladungen erneut senden" },
            { label: "HEUTE ONLINE", value: users.filter((u) => new Date(u.lastLogin).toDateString() === new Date().toDateString()).length, action: null },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-card rounded-lg p-4 shadow-crm-sm border border-border text-center">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{kpi.label}</p>
              <p className="text-2xl font-display font-bold text-foreground">{kpi.value}</p>
              {kpi.action && (
                <button className="text-xs text-primary hover:underline mt-1 font-medium">{kpi.action}</button>
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
        <div className="bg-card rounded-lg shadow-crm-sm border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Nutzer</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Rolle</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Letzter Login</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Menüpunkte</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const role = getRole(user.roleId);
                const menuItems = getUserMenuItems(user);
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
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: `${role.color}20`, color: role.color }}
                      >
                        <Shield className="h-3 w-3" />
                        {role.name}
                      </span>
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
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {timeAgo(user.lastLogin)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-muted-foreground">{menuItems.length} Punkte</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── User Detail Dialog ── */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedUser && (() => {
            const role = getRole(selectedUser.roleId);
            const menuItems = getUserMenuItems(selectedUser);
            const isIndividuell = selectedUser.roleId === "individuell" || !role.fixed;
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
                    {selectedUser.name}
                  </DialogTitle>
                  <DialogDescription>{selectedUser.email} · {selectedUser.phone}</DialogDescription>
                </DialogHeader>

                <div className="space-y-5 mt-2">
                  {/* Role + Status */}
                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-secondary/30 rounded-lg">
                    <Clock className="h-3.5 w-3.5" />
                    Letzter Login: {new Date(selectedUser.lastLogin).toLocaleString("de-DE")} ({timeAgo(selectedUser.lastLogin)})
                  </div>

                  {/* Menu Items */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Menüpunkte ({menuItems.length}/{ALL_MENU_ITEMS.length})
                      {!isIndividuell && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                          fest durch Rolle
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
                </div>
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
    </CRMLayout>
  );
}
