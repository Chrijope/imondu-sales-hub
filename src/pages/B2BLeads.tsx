import { useNavigate, useParams } from "react-router-dom";
import { Search, Phone, Upload, Download, SlidersHorizontal, X, HardHat, Sparkles, CalendarCheck, Tag, Clock, Plus, Trash2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import CRMLayout from "@/components/CRMLayout";
import { useToast } from "@/hooks/use-toast";
import Powerdialer from "@/components/Powerdialer";
import { SAMPLE_LEADS, B2B_PIPELINE_STAGES, Lead } from "@/data/crm-data";
import { getScoutedLeads, removeScoutedLead, isScoutedLead } from "@/utils/scouted-leads";
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

interface ColumnDef {
  key: string;
  label: string;
  adminDefault: boolean;
}

const ALL_COLUMNS: ColumnDef[] = [
  { key: "firma", label: "Firma", adminDefault: true },
  { key: "gewerk", label: "Gewerk", adminDefault: true },
  { key: "ansprechpartner", label: "Ansprechpartner", adminDefault: true },
  { key: "region", label: "Region", adminDefault: true },
  { key: "status", label: "Status", adminDefault: true },
  { key: "prioritaet", label: "Priorität", adminDefault: true },
  { key: "quelle", label: "Quelle", adminDefault: false },
  { key: "wert", label: "Wert", adminDefault: true },
  { key: "verantwortlich", label: "Verantwortlich", adminDefault: false },
  { key: "telefon", label: "Telefon", adminDefault: false },
  { key: "email", label: "E-Mail", adminDefault: false },
  { key: "unternehmengroesse", label: "Unternehmensgröße", adminDefault: false },
  { key: "position", label: "Position", adminDefault: false },
];

const SUB_PAGE_CONFIG: Record<string, { title: string; description: string; filterFn: (l: Lead) => boolean }> = {
  "neue-leads": { title: "Neue Leads", description: "Neue Partner-Leads, die noch nicht kontaktiert wurden", filterFn: (l) => l.status === "b2b_new" },
  "hot-leads": { title: "Hot Leads", description: "Partner mit hoher Priorität", filterFn: (l) => l.priority === "high" },
  "follow-up": { title: "Follow Up", description: "Partner, die nachverfolgt werden müssen", filterFn: (l) => l.status === "b2b_followup" },
  "heutige-termine": { title: "Heutige Termine", description: "Partner-Termine für heute", filterFn: () => false },
  "termine-gebucht": { title: "Termine gebucht", description: "Partner mit gebuchten Beratungsgesprächen", filterFn: (l) => l.status === "b2b_consultation" || l.status === "b2b_offer" },
  "gewonnen": { title: "Gewonnen", description: "Partner mit aktiver Mitgliedschaft", filterFn: (l) => l.status === "b2b_won" },
  "bestand": { title: "Bestand", description: "Alle aktiven Partner-Leads im Bestand", filterFn: () => true },
};

// Mock membership/profile data
const MOCK_MEMBERSHIP: Record<string, { plan: string; startDate: string; endDate: string; rabattcode?: string; kuendigungsfrist: string; autoVerlaengerung: string }> = {
  "13": { plan: "Premium", startDate: "01.02.2026", endDate: "31.01.2027", rabattcode: "IMONDU25", kuendigungsfrist: "31.12.2026", autoVerlaengerung: "01.02.2027" },
};

const MOCK_ENTWICKLER_PROFILE: Record<string, { firmenname: string; gewerk: string; matchingScore: number; projekte: number; bewertung: number; status: string }> = {
  "13": { firmenname: "SHK Meisterbetrieb Weber", gewerk: "SHK", matchingScore: 89, projekte: 62, bewertung: 4.7, status: "aktiv" },
};

function PartnerSidebar({ lead }: { lead: Lead }) {
  const membership = MOCK_MEMBERSHIP[lead.id];
  const profile = MOCK_ENTWICKLER_PROFILE[lead.id];

  return (
    <div className="space-y-4">
      {/* Entwicklerprofil */}
      {profile && (
        <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <HardHat className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-semibold text-foreground">Entwicklerprofil</h3>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-foreground">{profile.firmenname}</p>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                profile.matchingScore >= 85 ? "bg-success/10 text-success" :
                profile.matchingScore >= 70 ? "bg-warning/10 text-warning" :
                "bg-muted text-muted-foreground"
              }`}>
                <Sparkles className="h-2.5 w-2.5" />
                {profile.matchingScore}%
              </div>
            </div>
            <dl className="space-y-1.5 text-[11px]">
              <div className="flex justify-between"><dt className="text-muted-foreground">Gewerk</dt><dd className="font-medium">{profile.gewerk}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Projekte</dt><dd className="font-medium">{profile.projekte}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Bewertung</dt><dd className="font-medium">{profile.bewertung}/5</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Profilstatus</dt><dd><Badge variant="outline" className="text-[9px] border-success/30 text-success py-0">{profile.status}</Badge></dd></div>
            </dl>
          </div>
        </div>
      )}

      {/* Mitgliedschaft */}
      {membership ? (
        <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <CalendarCheck className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-semibold text-foreground">Mitgliedschaft</h3>
          </div>
          <dl className="space-y-2 text-xs">
            <div className="flex justify-between"><dt className="text-muted-foreground">Plan</dt><dd><Badge className="text-[10px] gradient-brand border-0 text-primary-foreground">{membership.plan}</Badge></dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Laufzeit</dt><dd className="font-medium">{membership.startDate} – {membership.endDate}</dd></div>
            {membership.rabattcode && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground flex items-center gap-1"><Tag className="h-3 w-3" />Rabattcode</dt>
                <dd className="font-mono text-primary text-[11px]">{membership.rabattcode}</dd>
              </div>
            )}
            <div className="pt-2 border-t border-border/60">
              <div className="flex justify-between"><dt className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Kündigungsfrist</dt><dd className="font-medium text-warning">{membership.kuendigungsfrist}</dd></div>
            </div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Auto-Verlängerung ab</dt><dd className="font-medium">{membership.autoVerlaengerung}</dd></div>
          </dl>
        </div>
      ) : (
        <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-2">
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-xs font-semibold text-foreground">Mitgliedschaft</h3>
          </div>
          <p className="text-xs text-muted-foreground">Keine aktive Mitgliedschaft vorhanden.</p>
        </div>
      )}

      {!profile && (
        <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-2">
            <HardHat className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-xs font-semibold text-foreground">Entwicklerprofil</h3>
          </div>
          <p className="text-xs text-muted-foreground">Noch kein Entwicklerprofil erstellt.</p>
        </div>
      )}
    </div>
  );
}

export default function B2BLeads() {
  const { subPage } = useParams<{ subPage: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const [showDialer, setShowDialer] = useState(false);
  const [visibleCols, setVisibleCols] = useState<Set<string>>(
    new Set(ALL_COLUMNS.filter((c) => c.adminDefault).map((c) => c.key))
  );
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const config = SUB_PAGE_CONFIG[subPage || ""] || SUB_PAGE_CONFIG["bestand"];
  const showSidebar = subPage === "gewonnen" || subPage === "bestand";
  const [scoutedLeads, setScoutedLeads] = useState<Lead[]>(() => getScoutedLeads().filter((l) => l.type === "b2b"));

  useEffect(() => {
    const handler = () => setScoutedLeads(getScoutedLeads().filter((l) => l.type === "b2b"));
    window.addEventListener("scouted-leads-updated", handler);
    window.addEventListener("focus", handler);
    return () => {
      window.removeEventListener("scouted-leads-updated", handler);
      window.removeEventListener("focus", handler);
    };
  }, []);

  const b2bLeads = [...SAMPLE_LEADS.filter((l) => l.type === "b2b"), ...scoutedLeads];
  const filtered = useMemo(() => {
    let list = b2bLeads.filter((l) => config.filterFn(l));
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((l) =>
        l.companyName?.toLowerCase().includes(s) ||
        l.contactPerson?.toLowerCase().includes(s) ||
        l.gewerk?.toLowerCase().includes(s) ||
        l.email?.toLowerCase().includes(s)
      );
    }
    Object.entries(columnFilters).forEach(([key, val]) => {
      if (!val) return;
      const v = val.toLowerCase();
      list = list.filter((l) => {
        switch (key) {
          case "firma": return l.companyName?.toLowerCase().includes(v);
          case "gewerk": return l.gewerk?.toLowerCase().includes(v);
          case "ansprechpartner": return l.contactPerson?.toLowerCase().includes(v);
          case "region": return l.region?.toLowerCase().includes(v);
          case "status": return getStage(l.status)?.name.toLowerCase().includes(v);
          case "prioritaet": return l.priority.toLowerCase().includes(v);
          case "quelle": return l.source.toLowerCase().includes(v);
          case "wert": return l.value.toString().includes(v);
          case "verantwortlich": return l.assignee.toLowerCase().includes(v);
          case "telefon": return l.phone?.toLowerCase().includes(v);
          case "email": return l.email?.toLowerCase().includes(v);
          case "unternehmengroesse": return l.companySize?.toLowerCase().includes(v);
          case "position": return l.position?.toLowerCase().includes(v);
          default: return true;
        }
      });
    });
    return list;
  }, [b2bLeads, config, search, columnFilters]);

  const getStage = (statusId: string) => B2B_PIPELINE_STAGES.find((s) => s.id === statusId);

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
      case "firma": return <span className="font-medium text-foreground">{lead.companyName}</span>;
      case "gewerk": return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-b2b/10 text-b2b">
          {lead.gewerk}
        </span>
      );
      case "ansprechpartner": return <span className="text-muted-foreground">{lead.contactPerson}</span>;
      case "region": return <span className="text-muted-foreground text-xs">{lead.region}</span>;
      case "status": return (
        <span className="inline-flex items-center gap-1.5 text-xs">
          <span className="h-2 w-2 rounded-full bg-warning" />
          <span className="font-medium text-warning">{stage?.name}</span>
        </span>
      );
      case "prioritaet": return (
        <span className={`h-2 w-2 rounded-full inline-block ${
          lead.priority === "high" ? "bg-destructive" : lead.priority === "medium" ? "bg-warning" : "bg-muted-foreground"
        }`} />
      );
      case "quelle": return <span className="text-muted-foreground">{lead.source}</span>;
      case "wert": return <span className="font-semibold text-foreground text-right">€{lead.value.toLocaleString("de-DE")}</span>;
      case "verantwortlich": return <span className="text-muted-foreground">{lead.assignee}</span>;
      case "telefon": return <span className="text-muted-foreground text-xs">{lead.phone}</span>;
      case "email": return <span className="text-muted-foreground text-xs">{lead.email}</span>;
      case "unternehmengroesse": return <span className="text-muted-foreground">{lead.companySize}</span>;
      case "position": return <span className="text-muted-foreground">{lead.position}</span>;
      default: return null;
    }
  };

  const visibleColumns = ALL_COLUMNS.filter((c) => visibleCols.has(c.key));

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-1 rounded-full bg-b2b" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-b2b">B2B – Partner</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">{config.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} Partner · {config.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {subPage === "neue-leads" && (
              <button
                onClick={() => navigate("/lead/new?type=b2b")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-brand text-primary-foreground text-sm font-medium shadow-crm-sm hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                Neuer Lead
              </button>
            )}
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
        </div>

        {showDialer ? (
          <Powerdialer leads={filtered} type="b2b" />
        ) : (
          <div className={`flex gap-5`}>
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
                      const csv = ["Firma,Gewerk,Ansprechpartner,Region,Status,Priorität,Quelle,Wert,Verantwortlich", ...filtered.map(l => `${l.companyName},${l.gewerk},${l.contactPerson},${l.region},${getStage(l.status)?.name},${l.priority},${l.source},${l.value},${l.assignee}`)].join("\n");
                      const blob = new Blob([csv], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a"); a.href = url; a.download = "b2b-leads.csv"; a.click();
                      URL.revokeObjectURL(url);
                      toast({ title: "Export ✓", description: `${filtered.length} Partner als CSV exportiert.` });
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
                          <th key={col.key} className={`text-left py-2 px-4 ${col.key === "wert" ? "text-right" : ""}`}>
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
                            <td key={col.key} className={`py-3 px-4 ${col.key === "wert" ? "text-right" : ""}`}>{getCellValue(lead, col.key)}</td>
                          ))}
                          <td className="py-3 px-2 w-10">
                            {isScoutedLead(lead.id) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeScoutedLead(lead.id);
                                  setScoutedLeads(getScoutedLeads().filter((l) => l.type === "b2b"));
                                  toast({ title: "Lead entfernt", description: `${lead.companyName} wurde gelöscht.` });
                                }}
                                className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                title="Gescouteten Lead löschen"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={visibleColumns.length} className="py-12 text-center text-muted-foreground">
                            Keine Partner in dieser Kategorie
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
                        <h3 className="text-sm font-semibold text-foreground">{selectedLead.companyName}</h3>
                        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => navigate(`/lead/${selectedLead.id}`)}>
                          Details →
                        </Button>
                      </div>
                      <dl className="space-y-2 text-xs">
                        <div className="flex justify-between"><dt className="text-muted-foreground">Gewerk</dt><dd className="font-medium">{selectedLead.gewerk}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Ansprechpartner</dt><dd className="font-medium">{selectedLead.contactPerson}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Region</dt><dd className="font-medium">{selectedLead.region}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd><Badge variant="outline" className="text-[10px]">{getStage(selectedLead.status)?.name}</Badge></dd></div>
                      </dl>
                    </div>
                    <PartnerSidebar lead={selectedLead} />
                  </>
                ) : (
                  <div className="bg-card rounded-xl p-6 shadow-crm-sm border border-border text-center">
                    <HardHat className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground">Wähle einen Partner aus, um Profil & Mitgliedschaft zu sehen.</p>
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
