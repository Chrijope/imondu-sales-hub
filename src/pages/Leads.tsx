import CRMLayout from "@/components/CRMLayout";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SAMPLE_LEADS, PIPELINE_STAGES } from "@/data/crm-data";

export default function Leads() {
  const [filterType, setFilterType] = useState<"all" | "b2c" | "b2b">("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = SAMPLE_LEADS.filter((l) => {
    if (filterType !== "all" && l.type !== filterType) return false;
    if (search) {
      const s = search.toLowerCase();
      const name = l.type === "b2b" ? l.companyName?.toLowerCase() : `${l.firstName} ${l.lastName}`.toLowerCase();
      return name?.includes(s) || l.email?.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Leads</h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} Leads</p>
          </div>
        </div>

        {/* Filters */}
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
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(["all", "b2c", "b2b"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-2 text-xs font-medium uppercase transition-colors ${
                  filterType === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-secondary"
                }`}
              >
                {type === "all" ? "Alle" : type === "b2c" ? "Eigentümer" : "Partner"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Typ</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Details</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Quelle</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Wert</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Verantwortlich</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const name = lead.type === "b2b" ? lead.companyName : `${lead.firstName} ${lead.lastName}`;
                const detail = lead.type === "b2b" ? lead.gewerk : lead.objekttyp;
                const stage = PIPELINE_STAGES.find((s) => s.id === lead.status);
                return (
                  <tr
                    key={lead.id}
                    onClick={() => navigate(`/lead/${lead.id}`)}
                    className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-foreground">{name}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        lead.type === "b2c" ? "bg-b2c/10 text-b2c" : "bg-b2b/10 text-b2b"
                      }`}>
                        {lead.type === "b2c" ? "Eigentümer" : "Partner"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{detail}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <span className="h-2 w-2 rounded-full bg-warning" />
                        <span className="font-medium text-warning">{stage?.name}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{lead.source}</td>
                    <td className="py-3 px-4 text-right font-semibold text-foreground">€{lead.value.toLocaleString("de-DE")}</td>
                    <td className="py-3 px-4 text-muted-foreground">{lead.assignee}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </CRMLayout>
  );
}
