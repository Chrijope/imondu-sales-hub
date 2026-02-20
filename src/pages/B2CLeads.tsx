import { useNavigate, useParams } from "react-router-dom";
import { Search, Phone, Upload, Download, SlidersHorizontal, Filter, X, Home, Sparkles } from "lucide-react";
import { useState, useMemo } from "react";
import CRMLayout from "@/components/CRMLayout";
import { useToast } from "@/hooks/use-toast";
import Powerdialer from "@/components/Powerdialer";
import { SAMPLE_LEADS, B2C_PIPELINE_STAGES, Lead } from "@/data/crm-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Column definitions
interface ColumnDef {
  key: string;
  label: string;
  adminDefault: boolean; // true = admin preset, false = optional partner column
}

const ALL_COLUMNS: ColumnDef[] = [
  { key: "name", label: "Name", adminDefault: true },
  { key: "objekttyp", label: "Objekttyp", adminDefault: true },
  { key: "adresse", label: "Adresse", adminDefault: true },
  { key: "interesse", label: "Interesse", adminDefault: true },
  { key: "status", label: "Status", adminDefault: true },
  { key: "prioritaet", label: "Priorität", adminDefault: true },
  { key: "quelle", label: "Quelle", adminDefault: false },
  { key: "verantwortlich", label: "Verantwortlich", adminDefault: false },
  { key: "telefon", label: "Telefon", adminDefault: false },
  { key: "email", label: "E-Mail", adminDefault: false },
  { key: "baujahr", label: "Baujahr", adminDefault: false },
  { key: "wohnflaeche", label: "Wohnfläche", adminDefault: false },
  { key: "sanierungsstatus", label: "Sanierungsstatus", adminDefault: false },
];

const SUB_PAGE_CONFIG: Record<string, { title: string; description: string; filterFn: (l: Lead) => boolean }> = {
  "neue-leads": { title: "Neue Leads", description: "Neue Eigentümer-Leads, die noch nicht kontaktiert wurden", filterFn: (l) => l.status === "b2c_new" },
  "hot-leads": { title: "Hot Leads", description: "Eigentümer mit hoher Priorität", filterFn: (l) => l.priority === "high" },
  "follow-up": { title: "Follow Up", description: "Eigentümer, die nachverfolgt werden müssen", filterFn: (l) => l.status === "b2c_followup" },
  "heutige-termine": { title: "Heutige Termine", description: "Eigentümer-Termine für heute", filterFn: () => false },
  "termine-gebucht": { title: "Termine gebucht", description: "Eigentümer mit gebuchten Terminen", filterFn: (l) => l.status === "b2c_interested" || l.status === "b2c_reached" },
  "gewonnen": { title: "Gewonnen", description: "Eigentümer mit erstelltem Inserat", filterFn: (l) => l.status === "b2c_inserat" },
  "bestand": { title: "Bestand", description: "Alle aktiven Eigentümer-Leads im Bestand", filterFn: () => true },
};

// Mock inserat data for gewonnen/bestand sidebar
const MOCK_INSERATE = [
  { id: "ins-7", titel: "EFH mit Sanierungspotenzial", objekttyp: "Einfamilienhaus", status: "aktiv", matchingScore: 92, erstelltAm: "2026-02-14" },
  { id: "ins-12", titel: "Gewerbeobjekt am Rhein", objekttyp: "Gewerbeobjekt", status: "entwurf", matchingScore: 78, erstelltAm: "2026-02-18" },
];

function LeadInserate({ lead }: { lead: Lead }) {
  const inserate = lead.status === "b2c_inserat"
    ? MOCK_INSERATE.filter((_, i) => i === 0)
    : lead.status === "b2c_registered"
    ? MOCK_INSERATE.filter((_, i) => i === 1)
    : [];

  return (
    <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Home className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-semibold text-foreground">Erstellte Inserate</h3>
      </div>
      {inserate.length > 0 ? inserate.map((ins) => (
        <div key={ins.id} className="p-3 rounded-lg bg-secondary/30 border border-border/50 mb-2 last:mb-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-foreground">{ins.titel}</p>
            {ins.matchingScore && (
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                ins.matchingScore >= 85 ? "bg-success/10 text-success" :
                ins.matchingScore >= 70 ? "bg-warning/10 text-warning" :
                "bg-muted text-muted-foreground"
              }`}>
                <Sparkles className="h-2.5 w-2.5" />
                {ins.matchingScore}%
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>{ins.objekttyp}</span>
            <span>·</span>
            <Badge variant="outline" className={`text-[9px] py-0 ${ins.status === "aktiv" ? "border-success/30 text-success" : "border-warning/30 text-warning"}`}>
              {ins.status}
            </Badge>
            <span>·</span>
            <span>{ins.erstelltAm}</span>
          </div>
        </div>
      )) : (
        <p className="text-xs text-muted-foreground">Noch keine Inserate erstellt.</p>
      )}
    </div>
  );
}

export default function B2CLeads() {
  const { subPage } = useParams<{ subPage: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const [showDialer, setShowDialer] = useState(subPage === "neue-leads");
  const [visibleCols, setVisibleCols] = useState<Set<string>>(
    new Set(ALL_COLUMNS.filter((c) => c.adminDefault).map((c) => c.key))
  );
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const config = SUB_PAGE_CONFIG[subPage || ""] || SUB_PAGE_CONFIG["bestand"];
  const showSidebar = subPage === "gewonnen" || subPage === "bestand";

  const b2cLeads = SAMPLE_LEADS.filter((l) => l.type === "b2c");
  const filtered = useMemo(() => {
    let list = b2cLeads.filter((l) => config.filterFn(l));
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((l) => {
        const name = `${l.firstName} ${l.lastName}`.toLowerCase();
        return name.includes(s) || l.email?.toLowerCase().includes(s) || l.objekttyp?.toLowerCase().includes(s);
      });
    }
    // Apply column filters
    Object.entries(columnFilters).forEach(([key, val]) => {
      if (!val) return;
      const v = val.toLowerCase();
      list = list.filter((l) => {
        switch (key) {
          case "name": return `${l.firstName} ${l.lastName}`.toLowerCase().includes(v);
          case "objekttyp": return l.objekttyp?.toLowerCase().includes(v);
          case "adresse": return (l.objektAdresse || l.address || "").toLowerCase().includes(v);
          case "interesse": return l.interesse?.toLowerCase().includes(v);
          case "status": return getStage(l.status)?.name.toLowerCase().includes(v);
          case "prioritaet": return l.priority.toLowerCase().includes(v);
          case "quelle": return l.source.toLowerCase().includes(v);
          case "verantwortlich": return l.assignee.toLowerCase().includes(v);
          case "telefon": return l.phone?.toLowerCase().includes(v);
          case "email": return l.email?.toLowerCase().includes(v);
          default: return true;
        }
      });
    });
    return list;
  }, [b2cLeads, config, search, columnFilters]);

  const getStage = (statusId: string) => B2C_PIPELINE_STAGES.find((s) => s.id === statusId);

  const toggleCol = (key: string) => {
    setVisibleCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const setColFilter = (key: string, val: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: val }));
  };

  const activeFilterCount = Object.values(columnFilters).filter(Boolean).length;

  const getCellValue = (lead: Lead, key: string) => {
    const stage = getStage(lead.status);
    switch (key) {
      case "name": return <span className="font-medium text-foreground">{lead.firstName} {lead.lastName}</span>;
      case "objekttyp": return <span className="text-muted-foreground">{lead.objekttyp}</span>;
      case "adresse": return <span className="text-muted-foreground text-xs">{lead.objektAdresse || lead.address}</span>;
      case "interesse": return <span className="text-muted-foreground">{lead.interesse}</span>;
      case "status": return (
        <span className="inline-flex items-center gap-1.5 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: stage?.color }} />
          {stage?.name}
        </span>
      );
      case "prioritaet": return (
        <span className={`h-2 w-2 rounded-full inline-block ${
          lead.priority === "high" ? "bg-destructive" : lead.priority === "medium" ? "bg-warning" : "bg-muted-foreground"
        }`} />
      );
      case "quelle": return <span className="text-muted-foreground">{lead.source}</span>;
      case "verantwortlich": return <span className="text-muted-foreground">{lead.assignee}</span>;
      case "telefon": return <span className="text-muted-foreground text-xs">{lead.phone}</span>;
      case "email": return <span className="text-muted-foreground text-xs">{lead.email}</span>;
      case "baujahr": return <span className="text-muted-foreground">{lead.baujahr}</span>;
      case "wohnflaeche": return <span className="text-muted-foreground">{lead.wohnflaeche ? `${lead.wohnflaeche} m²` : "–"}</span>;
      case "sanierungsstatus": return <span className="text-muted-foreground">{lead.sanierungsstatus}</span>;
      default: return null;
    }
  };

  const visibleColumns = ALL_COLUMNS.filter((c) => visibleCols.has(c.key));

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-1 rounded-full bg-b2c" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-b2c">B2C – Eigentümer</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">{config.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} Leads · {config.description}</p>
          </div>
          <button
            onClick={() => setShowDialer(!showDialer)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showDialer ? "gradient-brand text-primary-foreground shadow-crm-sm" : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            <Phone className="h-4 w-4" />
            Powerdialer
          </button>
        </div>

        {showDialer ? (
          <Powerdialer leads={filtered} type="b2c" />
        ) : (
          <div className={`flex gap-5 ${showSidebar ? "" : ""}`}>
            <div className="flex-1 min-w-0">
              {/* Search + Filters + Column Settings */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Suchen..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>

                {/* Column Visibility */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Spalten
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel className="text-[10px] text-muted-foreground">Admin-Vorgabe (fest)</DropdownMenuLabel>
                    {ALL_COLUMNS.filter((c) => c.adminDefault).map((col) => (
                      <DropdownMenuCheckboxItem key={col.key} checked={visibleCols.has(col.key)} onCheckedChange={() => toggleCol(col.key)}>
                        {col.label}
                        <span className="ml-auto text-[9px] text-muted-foreground">Admin</span>
                      </DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[10px] text-muted-foreground">Ergänzend (Partner)</DropdownMenuLabel>
                    {ALL_COLUMNS.filter((c) => !c.adminDefault).map((col) => (
                      <DropdownMenuCheckboxItem key={col.key} checked={visibleCols.has(col.key)} onCheckedChange={() => toggleCol(col.key)}>
                        {col.label}
                        <span className="ml-auto text-[9px] text-primary">Optional</span>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs text-destructive gap-1" onClick={() => setColumnFilters({})}>
                    <X className="h-3 w-3" /> {activeFilterCount} Filter
                  </Button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => toast({ title: "Import", description: "CSV/Excel-Import wird vorbereitet…" })}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
                  >
                    <Upload className="h-4 w-4" /> Import
                  </button>
                  <button
                    onClick={() => {
                      const csv = ["Name,Objekttyp,Adresse,Status,Priorität,Quelle,Verantwortlich", ...filtered.map(l => `${l.firstName} ${l.lastName},${l.objekttyp},${l.objektAdresse || l.address},${getStage(l.status)?.name},${l.priority},${l.source},${l.assignee}`)].join("\n");
                      const blob = new Blob([csv], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a"); a.href = url; a.download = "b2c-leads.csv"; a.click();
                      URL.revokeObjectURL(url);
                      toast({ title: "Export ✓", description: `${filtered.length} Leads als CSV exportiert.` });
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
                  >
                    <Download className="h-4 w-4" /> Export
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-card rounded-lg shadow-crm-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        {visibleColumns.map((col) => (
                          <th key={col.key} className="text-left py-2 px-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                {col.label}
                                {col.adminDefault ? (
                                  <span className="text-[8px] px-1 py-0.5 rounded bg-muted text-muted-foreground">Fix</span>
                                ) : (
                                  <span className="text-[8px] px-1 py-0.5 rounded bg-primary/10 text-primary">+</span>
                                )}
                              </span>
                              <input
                                type="text"
                                placeholder="Filter..."
                                value={columnFilters[col.key] || ""}
                                onChange={(e) => setColFilter(col.key, e.target.value)}
                                className="w-full px-1.5 py-1 rounded border border-border/60 bg-background text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((lead) => (
                        <tr
                          key={lead.id}
                          onClick={() => {
                            if (showSidebar) setSelectedLead(lead);
                            else navigate(`/lead/${lead.id}`);
                          }}
                          className={`border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors ${
                            selectedLead?.id === lead.id ? "bg-primary/5 border-primary/20" : ""
                          }`}
                        >
                          {visibleColumns.map((col) => (
                            <td key={col.key} className="py-3 px-4">{getCellValue(lead, col.key)}</td>
                          ))}
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={visibleColumns.length} className="py-12 text-center text-muted-foreground">
                            Keine Leads in dieser Kategorie
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar for gewonnen/bestand */}
            {showSidebar && (
              <div className="w-[320px] shrink-0 space-y-4">
                {selectedLead ? (
                  <>
                    <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-foreground">{selectedLead.firstName} {selectedLead.lastName}</h3>
                        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => navigate(`/lead/${selectedLead.id}`)}>
                          Details →
                        </Button>
                      </div>
                      <dl className="space-y-2 text-xs">
                        <div className="flex justify-between"><dt className="text-muted-foreground">Objekttyp</dt><dd className="font-medium">{selectedLead.objekttyp}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Adresse</dt><dd className="font-medium text-right max-w-[160px] truncate">{selectedLead.objektAdresse || selectedLead.address}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Interesse</dt><dd className="font-medium">{selectedLead.interesse}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd><Badge variant="outline" className="text-[10px]">{getStage(selectedLead.status)?.name}</Badge></dd></div>
                      </dl>
                    </div>
                    <LeadInserate lead={selectedLead} />
                  </>
                ) : (
                  <div className="bg-card rounded-xl p-6 shadow-crm-sm border border-border text-center">
                    <Home className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground">Wähle einen Lead aus, um Inserate und Details zu sehen.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </CRMLayout>
  );
}
