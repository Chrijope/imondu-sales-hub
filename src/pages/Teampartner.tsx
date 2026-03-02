import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ChevronDown, ChevronRight, Info, UserPlus, GitBranch, List, Shield, Mail, Phone } from "lucide-react";
import { useUserRole } from "@/contexts/UserRoleContext";
import { SAMPLE_USERS, type CRMUser } from "@/data/nutzerverwaltung-data";

type TeampartnerStatus = "Aktiv" | "Inaktiv" | "Ausstehend";

function getUserStatus(user: CRMUser): TeampartnerStatus {
  if (user.inviteStatus === "pending") return "Ausstehend";
  return user.active ? "Aktiv" : "Inaktiv";
}

const statusColor: Record<TeampartnerStatus, string> = {
  Aktiv: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  Inaktiv: "bg-destructive/10 text-destructive",
  Ausstehend: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

// Build tree: admin/VL are roots, other users are children based on hierarchy
function buildTree(users: CRMUser[], roles: { id: string; name: string }[]) {
  // Roots: admin, vertriebsleiter
  const roots = users.filter(u => ["admin", "vertriebsleiter"].includes(u.roleId));
  const children = users.filter(u => !["admin", "vertriebsleiter"].includes(u.roleId));
  return { roots, children };
}

function TreeNode({
  user,
  children,
  roles,
  expandedIds,
  toggleExpand,
}: {
  user: CRMUser;
  children: CRMUser[];
  roles: { id: string; name: string; color: string }[];
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
}) {
  const hasChildren = children.length > 0;
  const isExpanded = expandedIds.has(user.id);
  const role = roles.find(r => r.id === user.roleId);
  const status = getUserStatus(user);

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex items-center gap-2 border border-border bg-card rounded-lg px-4 py-2.5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => hasChildren && toggleExpand(user.id)}
      >
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
          style={{ background: role?.color || "hsl(var(--muted))" }}
        >
          {user.avatar}
        </div>
        <div className="text-left">
          <span className="text-sm font-medium text-foreground block leading-tight">{user.name}</span>
          <span className="text-[10px] text-muted-foreground">{role?.name} · {user.imonduId}</span>
        </div>
        <Badge variant="outline" className={`text-[9px] ml-1 ${statusColor[status]}`}>{status}</Badge>
        {hasChildren && (
          isExpanded
            ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="flex flex-col items-center mt-1">
          <div className="w-px h-6 bg-border" />
          <div className="flex gap-8 flex-wrap justify-center">
            {children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-4 bg-border" />
                <TreeNode
                  user={child}
                  children={[]}
                  roles={roles}
                  expandedIds={expandedIds}
                  toggleExpand={toggleExpand}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeampartnerPage() {
  const { roles } = useUserRole();
  const [view, setView] = useState<"tree" | "list">("list");
  const [filter, setFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(SAMPLE_USERS.map(u => u.id)));

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(SAMPLE_USERS.map((u) => u.id)));
  const collapseAll = () => setExpandedIds(new Set());

  const filteredList = SAMPLE_USERS.filter((u) => {
    if (roleFilter !== "all" && u.roleId !== roleFilter) return false;
    const status = getUserStatus(u);
    if (statusFilter !== "all" && status !== statusFilter) return false;
    if (filter) {
      const q = filter.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.imonduId.toLowerCase().includes(q);
    }
    return true;
  });

  const { roots, children } = buildTree(SAMPLE_USERS, roles);

  return (
    <CRMLayout>
      <div className="p-6 space-y-6 min-h-screen dashboard-mesh-bg">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-10 bg-accent rounded-full" />
            <h1 className="text-3xl font-bold text-foreground">Teampartner</h1>
          </div>
          <Badge variant="secondary" className="text-xs">{SAMPLE_USERS.length} Nutzer</Badge>
        </div>

        {/* View Toggle */}
        <Tabs value={view} onValueChange={(v) => setView(v as "tree" | "list")}>
          <TabsList>
            <TabsTrigger value="tree" className="gap-2">
              <GitBranch className="h-4 w-4" />
              Strukturbaum
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              Listenansicht
            </TabsTrigger>
          </TabsList>

          {/* Tree View */}
          <TabsContent value="tree">
            <div className="bg-card border border-border rounded-xl shadow-sm">
              <div className="flex items-center gap-4 px-6 py-3 border-b border-border text-sm">
                <button onClick={expandAll} className="text-muted-foreground hover:text-foreground transition-colors">Alle öffnen</button>
                <button onClick={collapseAll} className="text-muted-foreground hover:text-foreground transition-colors">Alle schließen</button>
              </div>
              <div className="p-10 min-h-[400px] bg-muted/30 flex justify-center pt-16 overflow-auto">
                <div className="flex gap-12">
                  {roots.map((root) => (
                    <TreeNode
                      key={root.id}
                      user={root}
                      children={children}
                      roles={roles}
                      expandedIds={expandedIds}
                      toggleExpand={toggleExpand}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list">
            <div className="bg-card border border-border rounded-xl shadow-sm">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="relative flex-1 max-w-xs">
                    <Input
                      placeholder="Suche nach Name, E-Mail oder ID…"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue placeholder="Alle Rollen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Rollen</SelectItem>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] h-8">
                      <SelectValue placeholder="Alle Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Status</SelectItem>
                      <SelectItem value="Aktiv">Aktiv</SelectItem>
                      <SelectItem value="Inaktiv">Inaktiv</SelectItem>
                      <SelectItem value="Ausstehend">Ausstehend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Nutzer</TableHead>
                    <TableHead className="font-semibold">IMONDU-ID</TableHead>
                    <TableHead className="font-semibold">Rolle</TableHead>
                    <TableHead className="font-semibold">E-Mail</TableHead>
                    <TableHead className="font-semibold">Telefon</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredList.map((u) => {
                    const role = roles.find(r => r.id === u.roleId);
                    const status = getUserStatus(u);
                    return (
                      <TableRow key={u.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0"
                              style={{ background: role?.color || "hsl(var(--muted))" }}
                            >
                              {u.avatar}
                            </div>
                            <span className="font-medium text-foreground">{u.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{u.imonduId}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]" style={{ borderColor: role?.color, color: role?.color }}>
                            {role?.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{u.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${statusColor[status]}`}>{status}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Keine Teampartner gefunden
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CRMLayout>
  );
}
