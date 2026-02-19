import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Users, Search, Shield, Clock, ChevronRight, ChevronDown, CheckCircle2,
  XCircle, UserPlus, Mail, Phone, MoreHorizontal, Eye, EyeOff,
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

const ROLES: Role[] = [
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
  const [users, setUsers] = useState<CRMUser[]>(SAMPLE_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("alle");
  const [selectedUser, setSelectedUser] = useState<CRMUser | null>(null);
  const [showRolesOverview, setShowRolesOverview] = useState(false);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    if (roleFilter !== "alle" && u.roleId !== roleFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    }
    return true;
  });

  const getRole = (roleId: string) => ROLES.find((r) => r.id === roleId) || ROLES[ROLES.length - 1];

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
        const role = ROLES.find((r) => r.id === newRoleId);
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
            <Button size="sm" className="gradient-brand border-0 text-white">
              <UserPlus className="h-4 w-4 mr-1.5" /> Nutzer einladen
            </Button>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Gesamt", value: users.length },
            { label: "Aktiv", value: activeCount },
            { label: "Rollen", value: ROLES.length },
            { label: "Heute online", value: users.filter((u) => new Date(u.lastLogin).toDateString() === new Date().toDateString()).length },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-card rounded-lg p-4 shadow-crm-sm border border-border text-center">
              <p className="text-2xl font-display font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
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
              {ROLES.map((r) => (
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
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${role.color}20`, color: role.color }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: role.color }} />
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
                          setSelectedUser({ ...selectedUser, roleId: v, customMenuItems: ROLES.find((r) => r.id === v)?.fixed ? undefined : selectedUser.customMenuItems });
                        }}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
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
      <Dialog open={showRolesOverview} onOpenChange={setShowRolesOverview}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Rollen & Berechtigungen
            </DialogTitle>
            <DialogDescription>Übersicht aller Rollen mit den zugewiesenen Menüpunkten</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {ROLES.map((role) => {
              const isExpanded = expandedRole === role.id;
              const userCount = users.filter((u) => u.roleId === role.id).length;
              return (
                <div key={role.id} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedRole(isExpanded ? null : role.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-secondary/30 transition-colors"
                  >
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: role.color }} />
                    <span className="text-sm font-semibold text-foreground flex-1 text-left">{role.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                      {userCount} Nutzer
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                      {role.menuItems.length} Menüpunkte
                    </span>
                    {role.fixed ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">fest</span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">individuell</span>
                    )}
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-border/50">
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
                      {!role.fixed && (
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
    </CRMLayout>
  );
}
