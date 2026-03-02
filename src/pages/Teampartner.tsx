import { useState, useCallback } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ChevronDown, ChevronRight, UserPlus, GitBranch, List, Mail, Phone, Trash2, CreditCard, Users } from "lucide-react";
import { useUserRole } from "@/contexts/UserRoleContext";
import { SAMPLE_USERS, type CRMUser } from "@/data/nutzerverwaltung-data";
import { getProjektassistenten, getProjektassistentenByCreator, removeProjektassistent, type Projektassistent } from "@/data/projektassistenten-data";
import ProjektassistentFormular from "@/components/ProjektassistentFormular";
import { useToast } from "@/hooks/use-toast";

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

function TreeNode({
  user,
  children,
  projektassistenten,
  allUsers,
  roles,
  expandedIds,
  toggleExpand,
  depth = 0,
}: {
  user: CRMUser;
  children: CRMUser[];
  projektassistenten: Projektassistent[];
  allUsers: CRMUser[];
  roles: { id: string; name: string; color: string }[];
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  depth?: number;
}) {
  const myPAs = projektassistenten.filter(pa => pa.erstelltVon === user.id);
  // For this user, find direct subordinates (children passed in) 
  const subordinateCount = children.length + myPAs.length;
  const hasChildren = subordinateCount > 0;
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
        {subordinateCount > 0 && (
          <Badge variant="secondary" className="text-[9px] ml-0.5 gap-0.5">
            <Users className="h-2.5 w-2.5" />{subordinateCount}
          </Badge>
        )}
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
            {children.map((child) => {
              const childChildren: CRMUser[] = [];
              const childPAs = projektassistenten.filter(pa => pa.erstelltVon === child.id);
              return (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="w-px h-4 bg-border" />
                  <TreeNode
                    user={child}
                    children={childChildren}
                    projektassistenten={projektassistenten}
                    allUsers={allUsers}
                    roles={roles}
                    expandedIds={expandedIds}
                    toggleExpand={toggleExpand}
                    depth={depth + 1}
                  />
                </div>
              );
            })}
            {myPAs.map((pa) => (
              <div key={pa.id} className="flex flex-col items-center">
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2 border border-dashed border-border bg-muted/30 rounded-lg px-3 py-2 shadow-sm">
                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                    {pa.vorname[0]}{pa.nachname[0]}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-medium text-foreground block leading-tight">{pa.vorname} {pa.nachname}</span>
                    <span className="text-[9px] text-muted-foreground">Projektassistent · {pa.imonduId}</span>
                  </div>
                  <Badge variant="outline" className={`text-[9px] ml-1 ${statusColor[pa.status === "aktiv" ? "Aktiv" : pa.status === "ausstehend" ? "Ausstehend" : "Inaktiv"]}`}>
                    {pa.status === "aktiv" ? "Aktiv" : pa.status === "ausstehend" ? "Ausstehend" : "Inaktiv"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeampartnerPage() {
  const { roles, currentRoleId } = useUserRole();
  const { toast } = useToast();
  const [view, setView] = useState<"tree" | "list">("list");
  const [filter, setFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(SAMPLE_USERS.map(u => u.id)));
  const [showPAForm, setShowPAForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const canCreatePA = ["admin", "inhaber", "vertriebsleiter", "vertriebspartner"].includes(currentRoleId);

  // Determine current user id based on role
  const currentUserId = currentRoleId === "inhaber" ? "u1" : currentRoleId === "admin" ? "u1" : currentRoleId === "vertriebsleiter" ? "u2"
    : currentRoleId === "vertriebspartner" ? "u3" : "u1";
  const currentUserName = SAMPLE_USERS.find(u => u.id === currentUserId)?.name || "Unbekannt";

  // Tree root selection: which person's structure to view
  const treeRootOptions = SAMPLE_USERS.filter(u => ["admin", "vertriebsleiter", "vertriebspartner"].includes(u.roleId));
  const [selectedTreeRoot, setSelectedTreeRoot] = useState<string>(currentUserId);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(SAMPLE_USERS.map((u) => u.id)));
  const collapseAll = () => setExpandedIds(new Set());

  // Get PAs: VP sees only own, VL/admin sees all
  const allPAs = currentRoleId === "vertriebspartner"
    ? getProjektassistentenByCreator(currentUserId)
    : getProjektassistenten(); // inhaber, admin, VL see all

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

  const filteredPAs = allPAs.filter((pa) => {
    if (statusFilter !== "all") {
      const paStatus = pa.status === "aktiv" ? "Aktiv" : pa.status === "ausstehend" ? "Ausstehend" : "Inaktiv";
      if (paStatus !== statusFilter) return false;
    }
    if (filter) {
      const q = filter.toLowerCase();
      return `${pa.vorname} ${pa.nachname}`.toLowerCase().includes(q) || pa.email.toLowerCase().includes(q) || pa.imonduId.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDeletePA = (pa: Projektassistent) => {
    removeProjektassistent(pa.id);
    setRefreshKey(k => k + 1);
    toast({ title: "Projektassistent entfernt", description: `${pa.vorname} ${pa.nachname} wurde entfernt.` });
  };

  // Build tree: selected root + subordinates
  const selectedRootUser = SAMPLE_USERS.find(u => u.id === selectedTreeRoot);
  const treeChildren = selectedRootUser
    ? SAMPLE_USERS.filter(u => u.id !== selectedTreeRoot && !["admin", "vertriebsleiter"].includes(u.roleId))
    : [];

  return (
    <CRMLayout>
      <div className="p-6 space-y-6 min-h-screen dashboard-mesh-bg" key={refreshKey}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-10 bg-accent rounded-full" />
              <h1 className="text-3xl font-bold text-foreground">Teampartner</h1>
            </div>
            <Badge variant="secondary" className="text-xs">{SAMPLE_USERS.length} Nutzer · {allPAs.length} Projektassistenten</Badge>
          </div>
          {canCreatePA && (
            <Button onClick={() => setShowPAForm(true)} className="gap-2 gradient-brand border-0 text-primary-foreground">
              <UserPlus className="h-4 w-4" /> Projektassistent anlegen
            </Button>
          )}
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
              <div className="flex items-center gap-4 px-6 py-3 border-b border-border text-sm flex-wrap">
                <span className="text-xs text-muted-foreground font-medium">Struktur von:</span>
                <Select value={selectedTreeRoot} onValueChange={setSelectedTreeRoot}>
                  <SelectTrigger className="w-[240px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {treeRootOptions.map((u) => {
                      const r = roles.find(r => r.id === u.roleId);
                      const subCount = SAMPLE_USERS.filter(s => s.id !== u.id && !["admin", "vertriebsleiter"].includes(s.roleId)).length
                        + allPAs.filter(pa => pa.erstelltVon === u.id).length;
                      return (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name} ({r?.name}) · {subCount} Untergeordnete
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <div className="flex-1" />
                <button onClick={expandAll} className="text-muted-foreground hover:text-foreground transition-colors text-xs">Alle öffnen</button>
                <button onClick={collapseAll} className="text-muted-foreground hover:text-foreground transition-colors text-xs">Alle schließen</button>
              </div>
              <div className="p-10 min-h-[400px] bg-muted/30 flex justify-center pt-16 overflow-auto">
                {selectedRootUser && (
                  <TreeNode
                    user={selectedRootUser}
                    children={treeChildren}
                    projektassistenten={allPAs}
                    allUsers={SAMPLE_USERS}
                    roles={roles}
                    expandedIds={expandedIds}
                    toggleExpand={toggleExpand}
                  />
                )}
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
                    <TableHead />
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
                        <TableCell />
                      </TableRow>
                    );
                  })}

                  {/* Projektassistenten Separator */}
                  {filteredPAs.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/30 py-2 px-4">
                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                          <UserPlus className="h-3.5 w-3.5" />
                          Projektassistenten ({filteredPAs.length})
                        </span>
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredPAs.map((pa) => {
                    const paStatus = pa.status === "aktiv" ? "Aktiv" : pa.status === "ausstehend" ? "Ausstehend" : "Inaktiv";
                    return (
                      <TableRow key={pa.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground border border-dashed border-border shrink-0">
                              {pa.vorname[0]}{pa.nachname[0]}
                            </div>
                            <div>
                              <span className="font-medium text-foreground">{pa.vorname} {pa.nachname}</span>
                              <span className="text-[10px] text-muted-foreground block">zugeordnet: {pa.erstelltVonName}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{pa.imonduId}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] border-muted-foreground/30 text-muted-foreground">
                            Projektassistent
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{pa.email}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{pa.telefon}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${statusColor[paStatus as TeampartnerStatus]}`}>{paStatus}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="text-[9px] gap-1">
                              <CreditCard className="h-3 w-3" />
                              B2C: {pa.honorarB2C}€ · B2B: {pa.honorarB2B}{pa.honorarModell === "prozentual" ? "%" : "€"}
                            </Badge>
                            {(currentRoleId === "admin" || pa.erstelltVon === currentUserId) && (
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeletePA(pa)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {filteredList.length === 0 && filteredPAs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Keine Teampartner gefunden
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Projektassistent Form Dialog */}
        <ProjektassistentFormular
          open={showPAForm}
          onOpenChange={setShowPAForm}
          erstelltVon={currentUserId}
          erstelltVonName={currentUserName}
          onCreated={() => setRefreshKey(k => k + 1)}
        />
      </div>
    </CRMLayout>
  );
}
