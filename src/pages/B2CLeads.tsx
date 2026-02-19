import { useNavigate, useParams } from "react-router-dom";
import { Search, Phone } from "lucide-react";
import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import Powerdialer from "@/components/Powerdialer";
import { SAMPLE_LEADS, B2C_PIPELINE_STAGES, Lead } from "@/data/crm-data";

const SUB_PAGE_CONFIG: Record<string, { title: string; description: string; filterFn: (l: Lead) => boolean }> = {
  "neue-leads": {
    title: "Neue Leads",
    description: "Neue Eigentümer-Leads, die noch nicht kontaktiert wurden",
    filterFn: (l) => l.status === "b2c_new",
  },
  "hot-leads": {
    title: "Hot Leads",
    description: "Eigentümer mit hoher Priorität",
    filterFn: (l) => l.priority === "high",
  },
  "follow-up": {
    title: "Follow Up",
    description: "Eigentümer, die nachverfolgt werden müssen",
    filterFn: (l) => l.status === "b2c_followup",
  },
  "heutige-termine": {
    title: "Heutige Termine",
    description: "Eigentümer-Termine für heute",
    filterFn: () => false, // Placeholder – no appointment data yet
  },
  "termine-gebucht": {
    title: "Termine gebucht",
    description: "Eigentümer mit gebuchten Terminen",
    filterFn: (l) => l.status === "b2c_interested" || l.status === "b2c_reached",
  },
  "gewonnen": {
    title: "Gewonnen",
    description: "Eigentümer mit erstelltem Inserat",
    filterFn: (l) => l.status === "b2c_inserat",
  },
  "bestand": {
    title: "Bestand",
    description: "Alle aktiven Eigentümer-Leads im Bestand",
    filterFn: () => true,
  },
};

export default function B2CLeads() {
  const { subPage } = useParams<{ subPage: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showDialer, setShowDialer] = useState(subPage === "neue-leads");

  const config = SUB_PAGE_CONFIG[subPage || ""] || SUB_PAGE_CONFIG["bestand"];

  const b2cLeads = SAMPLE_LEADS.filter((l) => l.type === "b2c");
  const filtered = b2cLeads.filter((l) => {
    if (!config.filterFn(l)) return false;
    if (search) {
      const s = search.toLowerCase();
      const name = `${l.firstName} ${l.lastName}`.toLowerCase();
      return name.includes(s) || l.email?.toLowerCase().includes(s) || l.objekttyp?.toLowerCase().includes(s);
    }
    return true;
  });

  const getStage = (statusId: string) => B2C_PIPELINE_STAGES.find((s) => s.id === statusId);

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
          <>

        {/* Search */}
        <div className="flex items-center gap-3 mb-4">
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
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg shadow-crm-sm border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Objekttyp</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Adresse</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Interesse</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Priorität</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Quelle</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Verantwortlich</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const stage = getStage(lead.status);
                return (
                  <tr
                    key={lead.id}
                    onClick={() => navigate(`/lead/${lead.id}`)}
                    className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-foreground">{lead.firstName} {lead.lastName}</td>
                    <td className="py-3 px-4 text-muted-foreground">{lead.objekttyp}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{lead.objektAdresse || lead.address}</td>
                    <td className="py-3 px-4 text-muted-foreground">{lead.interesse}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: stage?.color }} />
                        {stage?.name}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`h-2 w-2 rounded-full inline-block ${
                        lead.priority === "high" ? "bg-destructive" : lead.priority === "medium" ? "bg-warning" : "bg-muted-foreground"
                      }`} />
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{lead.source}</td>
                    <td className="py-3 px-4 text-muted-foreground">{lead.assignee}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    Keine Leads in dieser Kategorie
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </>
        )}
      </div>
    </CRMLayout>
  );
}
