import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Phone,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import CRMLayout from "@/components/CRMLayout";
import { SAMPLE_LEADS, PIPELINE_STAGES } from "@/data/crm-data";

const kpis = [
  {
    label: "Neue Leads",
    value: "24",
    change: "+12%",
    trend: "up" as const,
    icon: Users,
    period: "diese Woche",
  },
  {
    label: "Conversion-Rate",
    value: "18.5%",
    change: "+2.3%",
    trend: "up" as const,
    icon: Target,
    period: "vs. letzte Woche",
  },
  {
    label: "Pipeline-Wert",
    value: "€362.800",
    change: "+8.7%",
    trend: "up" as const,
    icon: DollarSign,
    period: "gesamt",
  },
  {
    label: "Abschlüsse",
    value: "7",
    change: "-1",
    trend: "down" as const,
    icon: TrendingUp,
    period: "diesen Monat",
  },
  {
    label: "Calls heute",
    value: "43",
    change: "+15%",
    trend: "up" as const,
    icon: Phone,
    period: "Team gesamt",
  },
];

const teamStats = [
  { name: "Max Müller", calls: 18, leads: 8, deals: 3, rate: "22%" },
  { name: "Lisa Weber", calls: 14, leads: 6, deals: 2, rate: "19%" },
  { name: "Jan Fischer", calls: 11, leads: 5, deals: 2, rate: "15%" },
];

const tasks = [
  { text: "Follow-Up: Architektur Bauer GmbH anrufen", due: "Heute 14:00", priority: "high" },
  { text: "Angebot FensterPro AG nachfassen", due: "Heute 16:00", priority: "high" },
  { text: "Peter Klein – Rückruf (MFH Sanierung)", due: "Morgen 10:00", priority: "medium" },
  { text: "Webinar-Leads qualifizieren", due: "Morgen", priority: "low" },
];

export default function Dashboard() {
  const stageValues = PIPELINE_STAGES.slice(0, -1).map((stage) => {
    const leads = SAMPLE_LEADS.filter((l) => l.status === stage.id);
    const total = leads.reduce((s, l) => s + l.value, 0);
    return { ...stage, count: leads.length, total };
  });

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Willkommen zurück, Max. Hier ist dein Überblick.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="bg-card rounded-lg p-4 shadow-crm-sm border border-border animate-scale-in"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {kpi.label}
                </span>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-display font-bold text-foreground">
                {kpi.value}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {kpi.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-success" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive" />
                )}
                <span
                  className={`text-xs font-medium ${
                    kpi.trend === "up" ? "text-success" : "text-destructive"
                  }`}
                >
                  {kpi.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  {kpi.period}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline Overview */}
          <div className="lg:col-span-2 bg-card rounded-lg p-5 shadow-crm-sm border border-border">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              Pipeline-Übersicht
            </h2>
            <div className="space-y-3">
              {stageValues.map((stage) => (
                <div key={stage.id} className="flex items-center gap-3">
                  <div className="w-28 text-xs font-medium text-muted-foreground truncate">
                    {stage.name}
                  </div>
                  <div className="flex-1 h-7 bg-secondary rounded-md overflow-hidden relative">
                    <div
                      className="h-full rounded-md transition-all duration-500"
                      style={{
                        width: `${Math.max(
                          5,
                          (stage.total / 200000) * 100
                        )}%`,
                        backgroundColor: stage.color,
                      }}
                    />
                  </div>
                  <div className="w-12 text-right text-xs font-medium text-muted-foreground">
                    {stage.count}
                  </div>
                  <div className="w-20 text-right text-xs font-semibold text-foreground">
                    €{(stage.total / 1000).toFixed(0)}k
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-card rounded-lg p-5 shadow-crm-sm border border-border">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              Aufgaben & Wiedervorlagen
            </h2>
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-2 rounded-md hover:bg-secondary/50 transition-colors"
                >
                  <div
                    className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                      task.priority === "high"
                        ? "bg-destructive"
                        : task.priority === "medium"
                        ? "bg-warning"
                        : "bg-muted-foreground"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground leading-tight">
                      {task.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {task.due}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-card rounded-lg p-5 shadow-crm-sm border border-border">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Team-Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Mitarbeiter
                  </th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Calls
                  </th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Leads
                  </th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Deals
                  </th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Conv. Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamStats.map((member) => (
                  <tr
                    key={member.name}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3 font-medium text-foreground">
                      {member.name}
                    </td>
                    <td className="text-right py-3 text-muted-foreground">
                      {member.calls}
                    </td>
                    <td className="text-right py-3 text-muted-foreground">
                      {member.leads}
                    </td>
                    <td className="text-right py-3 text-muted-foreground">
                      {member.deals}
                    </td>
                    <td className="text-right py-3 font-medium text-foreground">
                      {member.rate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
