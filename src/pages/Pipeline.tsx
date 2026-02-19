import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Plus, Search } from "lucide-react";
import CRMLayout from "@/components/CRMLayout";
import { SAMPLE_LEADS, PIPELINE_STAGES, Lead } from "@/data/crm-data";

function LeadCard({ lead }: { lead: Lead }) {
  const navigate = useNavigate();
  const name =
    lead.type === "b2b"
      ? lead.companyName
      : `${lead.firstName} ${lead.lastName}`;
  const subtitle =
    lead.type === "b2b" ? lead.contactPerson : lead.email;

  return (
    <div
      onClick={() => navigate(`/lead/${lead.id}`)}
      className="bg-card rounded-lg p-3 shadow-crm-sm border border-border hover:shadow-crm-md transition-all duration-150 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
            lead.type === "b2c"
              ? "bg-b2c/10 text-b2c"
              : "bg-b2b/10 text-b2b"
          }`}
        >
          {lead.type}
        </span>
        <span
          className={`h-2 w-2 rounded-full ${
            lead.priority === "high"
              ? "bg-destructive"
              : lead.priority === "medium"
              ? "bg-warning"
              : "bg-muted-foreground"
          }`}
        />
      </div>
      <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
        {name}
      </p>
      <p className="text-xs text-muted-foreground truncate mt-0.5">
        {subtitle}
      </p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-muted-foreground">{lead.assignee}</span>
        <span className="text-xs font-semibold text-foreground">
          €{lead.value.toLocaleString("de-DE")}
        </span>
      </div>
    </div>
  );
}

export default function Pipeline() {
  const [filterType, setFilterType] = useState<"all" | "b2c" | "b2b">("all");
  const [search, setSearch] = useState("");

  const filteredLeads = SAMPLE_LEADS.filter((l) => {
    if (filterType !== "all" && l.type !== filterType) return false;
    if (search) {
      const s = search.toLowerCase();
      const name =
        l.type === "b2b"
          ? l.companyName?.toLowerCase()
          : `${l.firstName} ${l.lastName}`.toLowerCase();
      return name?.includes(s) || l.email?.toLowerCase().includes(s);
    }
    return true;
  });

  // Exclude "won" and "lost" from active pipeline display, show only first 5
  const activeStages = PIPELINE_STAGES.filter(
    (s) => s.id !== "won" && s.id !== "lost"
  );

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Pipeline
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredLeads.length} Leads in der Pipeline
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-brand text-primary-foreground text-sm font-medium shadow-crm-sm hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" />
            Neuer Lead
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Lead suchen..."
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
                {type === "all" ? "Alle" : type}
              </button>
            ))}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {activeStages.map((stage) => {
              const stageLeads = filteredLeads.filter(
                (l) => l.status === stage.id
              );
              const stageValue = stageLeads.reduce((s, l) => s + l.value, 0);

              return (
                <div
                  key={stage.id}
                  className="w-[280px] shrink-0"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="text-sm font-semibold text-foreground">
                        {stage.name}
                      </span>
                      <span className="text-xs text-muted-foreground bg-secondary rounded-full px-1.5">
                        {stageLeads.length}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      €{(stageValue / 1000).toFixed(0)}k
                    </span>
                  </div>

                  {/* Column Content */}
                  <div className="space-y-2 min-h-[200px] bg-secondary/30 rounded-lg p-2">
                    {stageLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
                        Keine Leads
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
