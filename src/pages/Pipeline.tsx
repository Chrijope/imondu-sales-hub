import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Euro, TrendingUp, CheckCircle2, Users } from "lucide-react";

import CRMLayout from "@/components/CRMLayout";
import { SAMPLE_LEADS, B2C_PIPELINE_STAGES, B2B_PIPELINE_STAGES, Lead, PipelineStage } from "@/data/crm-data";
import { getB2CStufe, getB2BStufe, B2B_MITGLIEDSCHAFT_PREIS } from "@/data/karriereplan";

function LeadCard({ lead }: { lead: Lead }) {
  const navigate = useNavigate();
  const name =
    lead.type === "b2b"
      ? lead.companyName
      : `${lead.firstName} ${lead.lastName}`;
  const subtitle =
    lead.type === "b2b" ? lead.gewerk : lead.objekttyp;

  return (
    <div
      onClick={() => navigate(`/lead/${lead.id}`)}
      className="glass-card rounded-xl p-3 hover:shadow-crm-md transition-all duration-150 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
            lead.type === "b2c"
              ? "bg-b2c/10 text-b2c"
              : "bg-b2b/10 text-b2b"
          }`}
        >
          {lead.type === "b2c" ? "Eigentümer" : "Partner"}
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
          {lead.value.toLocaleString("de-DE")} €
        </span>
      </div>
    </div>
  );
}

function PipelineBoard({ stages, leads, provisionPerLead }: { stages: PipelineStage[]; leads: Lead[]; provisionPerLead: number }) {
  return (
    <div className="overflow-x-auto pb-0 flex flex-col" style={{ height: "calc(100vh - 340px)", minHeight: "400px" }}>
      {/* Scrollable card area */}
      <div className="flex gap-4 min-w-max flex-1 overflow-y-hidden">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);
          return (
            <div key={stage.id} className="w-[250px] shrink-0 flex flex-col">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                  <span className="text-xs font-semibold text-foreground">{stage.name}</span>
                  <span className="text-[11px] text-muted-foreground bg-secondary rounded-full px-1.5">
                    {stageLeads.length}
                  </span>
                </div>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto bg-secondary/30 rounded-lg p-2">
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
      {/* Fixed bottom totals bar */}
      <div className="flex gap-4 min-w-max border-t border-border bg-card/80 backdrop-blur-sm pt-2 pb-1 mt-2 sticky bottom-0">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);
          const stageProvision = stageLeads.length * provisionPerLead;
          return (
            <div key={stage.id} className="w-[250px] shrink-0 px-2 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">{stageLeads.length} Leads</span>
              <span className="text-[11px] font-bold text-foreground">{stageProvision.toLocaleString("de-DE")} €</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, sub, accent }: { icon: React.ElementType; label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="glass-card rounded-xl p-3 flex items-center gap-3 min-w-[180px]">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${accent || "bg-primary/10 text-primary"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-bold text-foreground">{value}</p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

const MY_B2C_INSERATE_QUARTAL = 45;
const MY_B2B_MONATSUMSATZ = 3750;

export default function Pipeline() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"b2c" | "b2b">("b2c");
  const [search, setSearch] = useState("");

  const filteredLeads = SAMPLE_LEADS.filter((l) => {
    if (l.type !== activeTab) return false;
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

  const stages = activeTab === "b2c" ? B2C_PIPELINE_STAGES : B2B_PIPELINE_STAGES;
  const totalLeads = filteredLeads.length;

  const currentB2CStufe = getB2CStufe(MY_B2C_INSERATE_QUARTAL);
  const currentB2BStufe = getB2BStufe(MY_B2B_MONATSUMSATZ);

  const kpis = useMemo(() => {
    const fmt = (v: number) => v.toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €";

    if (activeTab === "b2c") {
      const allB2C = filteredLeads;
      const inseratLeads = allB2C.filter(l => l.status === "b2c_inserat").length;
      const provPro = currentB2CStufe.provision;
      const anspruch = inseratLeads * provPro;
      const potenzial = allB2C.length * provPro;
      return {
        leads: allB2C.length,
        provisionPerLead: provPro,
        anspruch,
        anspruchLabel: `${inseratLeads} Inserate × ${provPro} €`,
        potenzial,
        potenzialLabel: `${allB2C.length} Leads × ${provPro} €`,
        wonLabel: "Inserat erstellt",
        wonCount: inseratLeads,
      };
    } else {
      const allB2B = filteredLeads;
      const wonLeads = allB2B.filter(l => l.status === "b2b_won").length;
      const provPct = currentB2BStufe.provision;
      const provPerLead = B2B_MITGLIEDSCHAFT_PREIS * (provPct / 100);
      const anspruch = wonLeads * provPerLead;
      const potenzial = allB2B.length * provPerLead;
      return {
        leads: allB2B.length,
        provisionPerLead: provPerLead,
        anspruch,
        anspruchLabel: `${wonLeads} Partner × ${provPerLead.toFixed(0)} €`,
        potenzial,
        potenzialLabel: `${allB2B.length} Leads × ${provPerLead.toFixed(0)} €`,
        wonLabel: "Gewonnen",
        wonCount: wonLeads,
      };
    }
  }, [activeTab, filteredLeads, currentB2CStufe, currentB2BStufe]);

  const fmt = (v: number) => v.toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €";

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-1 rounded-full gradient-brand" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">Pipeline</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {totalLeads} {activeTab === "b2c" ? "Eigentümer" : "Partner"} in der Pipeline
            </p>
          </div>

          {/* KPI Overview top-right */}
          <div className="flex flex-wrap gap-2">
            <KpiCard
              icon={Users}
              label="Leads gesamt"
              value={String(kpis.leads)}
              accent="bg-secondary text-foreground"
            />
            <KpiCard
              icon={TrendingUp}
              label="Provisionspotenzial"
              value={fmt(kpis.potenzial)}
              sub={kpis.potenzialLabel}
              accent="bg-primary/10 text-primary"
            />
            <KpiCard
              icon={CheckCircle2}
              label={kpis.wonLabel}
              value={fmt(kpis.anspruch)}
              sub={kpis.anspruchLabel}
              accent="bg-emerald-500/10 text-emerald-600"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setActiveTab("b2c")}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                activeTab === "b2c"
                  ? "bg-b2c text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-secondary"
              }`}
            >
              🏠 Eigentümer (B2C)
            </button>
            <button
              onClick={() => setActiveTab("b2b")}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                activeTab === "b2b"
                  ? "bg-b2b text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-secondary"
              }`}
            >
              🤝 Partner (B2B)
            </button>
          </div>

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
        </div>

        {/* Pipeline description */}
        <div className="mb-4 px-1">
          {activeTab === "b2c" ? (
            <p className="text-xs text-muted-foreground">
              Ziel: Eigentümer anrufen → zur kostenlosen Registrierung bewegen → Immobilie inserieren lassen ({currentB2CStufe.provision} € Provision/Inserat)
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Ziel: Entwicklungspartner kontaktieren → Imondu-Plattform vorstellen → 12-Monats-Mitgliedschaft verkaufen (1.250 € / {(B2B_MITGLIEDSCHAFT_PREIS * currentB2BStufe.provision / 100).toFixed(2)} € Provision)
            </p>
          )}
        </div>

        {/* Kanban Board */}
        <PipelineBoard stages={stages} leads={filteredLeads} provisionPerLead={kpis.provisionPerLead} />
      </div>
    </CRMLayout>
  );
}