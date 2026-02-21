import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ChevronDown, ChevronRight, Info, UserPlus, GitBranch, List } from "lucide-react";

export type TeampartnerRole = "Manager" | "Berater" | "Tippgeber";
export type TeampartnerStatus = "Neu" | "Aktiv" | "Inaktiv";

export interface Teampartner {
  id: string;
  vpNummer: string;
  firstName: string;
  lastName: string;
  email: string;
  role: TeampartnerRole;
  status: TeampartnerStatus;
  betreuer?: string;
  betreuerId?: string;
  parentId?: string;
  isTippgeber?: boolean;
}

const SAMPLE_TEAMPARTNER: Teampartner[] = [
  {
    id: "tp1", vpNummer: "WW1215", firstName: "Dirk", lastName: "Direkt",
    email: "dirk.direkt@imondu.de", role: "Manager", status: "Aktiv",
    parentId: undefined,
  },
  {
    id: "tp2", vpNummer: "WW1216", firstName: "Stephan", lastName: "Struktur",
    email: "stephan.struktur@imondu.de", role: "Berater", status: "Aktiv",
    betreuer: "Dirk Direkt (WW1215)", betreuerId: "tp1", parentId: "tp1",
  },
  {
    id: "tp3", vpNummer: "WW1217", firstName: "Lisa", lastName: "Weber",
    email: "lisa.weber@imondu.de", role: "Berater", status: "Aktiv",
    betreuer: "Dirk Direkt (WW1215)", betreuerId: "tp1", parentId: "tp1",
  },
  {
    id: "tp4", vpNummer: "WW1218", firstName: "Max", lastName: "Müller",
    email: "max.mueller@imondu.de", role: "Berater", status: "Neu",
    betreuer: "Stephan Struktur (WW1216)", betreuerId: "tp2", parentId: "tp2",
  },
  {
    id: "tp5", vpNummer: "WW1219", firstName: "Jan", lastName: "Fischer",
    email: "jan.fischer@imondu.de", role: "Berater", status: "Aktiv",
    betreuer: "Stephan Struktur (WW1216)", betreuerId: "tp2", parentId: "tp2",
  },
  {
    id: "tp6", vpNummer: "WW1220", firstName: "Claudia", lastName: "Tipp",
    email: "claudia.tipp@imondu.de", role: "Tippgeber", status: "Aktiv",
    betreuer: "Lisa Weber (WW1217)", betreuerId: "tp3", parentId: "tp3",
    isTippgeber: true,
  },
];

function getChildren(parentId: string | undefined, data: Teampartner[]) {
  return data.filter((tp) => tp.parentId === parentId);
}

function TreeNode({
  partner,
  data,
  expandedIds,
  toggleExpand,
  showTippgeber,
}: {
  partner: Teampartner;
  data: Teampartner[];
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  showTippgeber: boolean;
}) {
  const children = getChildren(partner.id, data).filter(
    (c) => showTippgeber || !c.isTippgeber
  );
  const hasChildren = children.length > 0;
  const isExpanded = expandedIds.has(partner.id);

  return (
    <div className="flex flex-col items-center">
      {/* Node */}
      <div
        className="flex items-center gap-2 border border-border bg-card rounded-lg px-4 py-2.5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => hasChildren && toggleExpand(partner.id)}
      >
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="text-sm font-medium text-foreground">
          {partner.firstName} {partner.lastName}
        </span>
        <span className="text-xs text-muted-foreground">({partner.role})</span>
        <Info className="h-3.5 w-3.5 text-muted-foreground" />
        {hasChildren && (
          isExpanded
            ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col items-center mt-1">
          <div className="w-px h-6 bg-border" />
          <div className="flex gap-8">
            {children.map((child, i) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-4 bg-border" />
                <TreeNode
                  partner={child}
                  data={data}
                  expandedIds={expandedIds}
                  toggleExpand={toggleExpand}
                  showTippgeber={showTippgeber}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const statusColor: Record<TeampartnerStatus, string> = {
  Neu: "bg-blue-500 text-white hover:bg-blue-600",
  Aktiv: "bg-amber-500 text-white hover:bg-amber-600",
  Inaktiv: "bg-red-500 text-white hover:bg-red-600",
};

export default function TeampartnerPage() {
  const [view, setView] = useState<"tree" | "list">("tree");
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showTippgeber, setShowTippgeber] = useState(true);
  const [showGesperrt, setShowGesperrt] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["tp1", "tp2", "tp3"]));

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(SAMPLE_TEAMPARTNER.map((tp) => tp.id)));
  const collapseAll = () => setExpandedIds(new Set());
  const expandFirstliner = () => {
    const roots = SAMPLE_TEAMPARTNER.filter((tp) => !tp.parentId);
    setExpandedIds(new Set(roots.map((r) => r.id)));
  };

  const roots = SAMPLE_TEAMPARTNER.filter((tp) => !tp.parentId);

  const filteredList = SAMPLE_TEAMPARTNER.filter((tp) => {
    if (!showTippgeber && tp.isTippgeber) return false;
    if (statusFilter !== "all" && tp.status !== statusFilter) return false;
    if (filter) {
      const q = filter.toLowerCase();
      return (
        tp.firstName.toLowerCase().includes(q) ||
        tp.lastName.toLowerCase().includes(q) ||
        tp.vpNummer.toLowerCase().includes(q) ||
        tp.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <CRMLayout>
      <div className="p-6 space-y-6 min-h-screen dashboard-mesh-bg">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-10 bg-accent rounded-full" />
            <h1 className="text-3xl font-bold text-foreground">Teampartner</h1>
          </div>
          <Button className="gradient-brand text-primary-foreground">
            <UserPlus className="h-4 w-4 mr-2" />
            Teampartner hinzufügen
          </Button>
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
                <button onClick={expandFirstliner} className="text-muted-foreground hover:text-foreground transition-colors">Firstliner öffnen</button>
                <button onClick={() => setShowTippgeber(!showTippgeber)} className="text-muted-foreground hover:text-foreground transition-colors">
                  {showTippgeber ? "Tippgeber ausblenden" : "Tippgeber anzeigen"}
                </button>
              </div>
              <div className="p-10 min-h-[400px] bg-muted/30 flex justify-center pt-16 overflow-auto">
                <div className="flex gap-12">
                  {roots.map((root) => (
                    <TreeNode
                      key={root.id}
                      partner={root}
                      data={SAMPLE_TEAMPARTNER}
                      expandedIds={expandedIds}
                      toggleExpand={toggleExpand}
                      showTippgeber={showTippgeber}
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
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-1 bg-accent rounded-full" />
                  <h2 className="font-semibold text-foreground">Teampartner-Übersicht</h2>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Filter:</span>
                    <Input
                      placeholder="Suche..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-48 h-8"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-36 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">–</SelectItem>
                        <SelectItem value="Neu">Neu</SelectItem>
                        <SelectItem value="Aktiv">Aktiv</SelectItem>
                        <SelectItem value="Inaktiv">Inaktiv</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Info className="h-4 w-4 text-primary" />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={showTippgeber}
                      onCheckedChange={(v) => setShowTippgeber(!!v)}
                      id="tippgeber"
                    />
                    <label htmlFor="tippgeber" className="text-sm text-muted-foreground cursor-pointer">
                      Tippgeber anzeigen
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={showGesperrt}
                      onCheckedChange={(v) => setShowGesperrt(!!v)}
                      id="gesperrt"
                    />
                    <label htmlFor="gesperrt" className="text-sm text-muted-foreground cursor-pointer">
                      Gesperrte Vertriebspartner
                    </label>
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">VP-Nummer</TableHead>
                    <TableHead className="font-semibold">Vorname</TableHead>
                    <TableHead className="font-semibold">Nachname</TableHead>
                    <TableHead className="font-semibold">E-Mailadresse</TableHead>
                    <TableHead className="font-semibold">Struktur</TableHead>
                    <TableHead className="font-semibold">Betreuer</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredList.map((tp) => (
                    <TableRow key={tp.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{tp.vpNummer}</TableCell>
                      <TableCell>{tp.firstName}</TableCell>
                      <TableCell>{tp.lastName}</TableCell>
                      <TableCell className="text-muted-foreground">{tp.email}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {tp.betreuer || "–"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {tp.betreuer || "–"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {(["Neu", "Aktiv", "Inaktiv"] as TeampartnerStatus[]).map((s) => (
                            <Badge
                              key={s}
                              className={`text-[10px] px-2 py-0.5 ${
                                tp.status === s
                                  ? statusColor[s]
                                  : "bg-muted text-muted-foreground/40"
                              }`}
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredList.length === 0 && (
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
      </div>
    </CRMLayout>
  );
}
