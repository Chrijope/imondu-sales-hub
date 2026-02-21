import { useState, useMemo } from "react";
import CRMLayout from "@/components/CRMLayout";
import { SAMPLE_LEADS, B2C_PIPELINE_STAGES, B2B_PIPELINE_STAGES } from "@/data/crm-data";
import { TIME_RANGE_OPTIONS, TimeRangeKey, getDateRange, isInRange, DateRange } from "@/utils/date-filters";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from "recharts";
import { BarChart3, Percent, Phone, TrendingUp, ArrowUpRight, ArrowDownRight, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { DateRange as DayPickerRange } from "react-day-picker";

/* ── KPI Tile ──────────────────────────────────── */
function KpiTile({ label, value, sub, trend }: { label: string; value: string | number; sub?: string; trend?: "up" | "down" }) {
  return (
    <div className="glass-card rounded-xl p-4 flex flex-col items-center justify-center min-h-[90px]">
      <span className="text-xs text-muted-foreground text-center mb-1">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {trend === "up" && <ArrowUpRight className="h-3.5 w-3.5 text-success" />}
        {trend === "down" && <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />}
      </div>
      {sub && <span className="text-[10px] text-muted-foreground mt-0.5">{sub}</span>}
    </div>
  );
}

/* ── Section Card ──────────────────────────────── */
function SectionCard({ title, actions, children }: { title: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-1 bg-accent rounded-full" />
          <h2 className="font-semibold text-foreground">{title}</h2>
        </div>
        {actions && <div className="flex gap-1">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

/* ── Toggle Button ─────────────────────────────── */
function ToggleBtn({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
        active ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {label}
    </button>
  );
}

/* ── Pie Data ──────────────────────────────────── */
const potenzialData = [
  { name: "< 100.000 €", value: 662, color: "hsl(210 80% 52%)" },
  { name: "100.000 – 199.999 €", value: 287, color: "hsl(340 75% 55%)" },
  { name: "200.000 – 299.999 €", value: 312, color: "hsl(152 60% 42%)" },
  { name: "300.000 – 499.999 €", value: 440, color: "hsl(38 92% 50%)" },
  { name: "≥ 500.000 €", value: 484, color: "hsl(280 60% 55%)" },
];
const totalPotenzial = potenzialData.reduce((s, d) => s + d.value, 0);

/* ── Call Stats Data ───────────────────────────── */
const callsPerDay = [
  { tag: "Mo", calls: 42, dauer: 186, termine: 8 },
  { tag: "Di", calls: 55, dauer: 234, termine: 11 },
  { tag: "Mi", calls: 38, dauer: 152, termine: 6 },
  { tag: "Do", calls: 61, dauer: 267, termine: 14 },
  { tag: "Fr", calls: 47, dauer: 201, termine: 9 },
  { tag: "Sa", calls: 12, dauer: 48, termine: 2 },
  { tag: "So", calls: 5, dauer: 18, termine: 1 },
];

const callResultsData = [
  { name: "Erreicht", value: 142, color: "hsl(152 60% 42%)" },
  { name: "Nicht erreicht", value: 68, color: "hsl(0 72% 51%)" },
  { name: "Mailbox", value: 45, color: "hsl(38 92% 50%)" },
  { name: "Termin vereinbart", value: 51, color: "hsl(210 80% 52%)" },
  { name: "Kein Interesse", value: 32, color: "hsl(220 14% 60%)" },
  { name: "Follow-Up", value: 22, color: "hsl(280 60% 55%)" },
];
const totalCallResults = callResultsData.reduce((s, d) => s + d.value, 0);

const weeklyTrend = [
  { woche: "KW 4", calls: 180, termine: 28, erreicht: 85, quote: 47 },
  { woche: "KW 5", calls: 210, termine: 35, erreicht: 102, quote: 49 },
  { woche: "KW 6", calls: 195, termine: 31, erreicht: 91, quote: 47 },
  { woche: "KW 7", calls: 240, termine: 42, erreicht: 118, quote: 49 },
  { woche: "KW 8", calls: 260, termine: 51, erreicht: 142, quote: 55 },
];

const leadSourceData = [
  { name: "Website", value: 340, color: "hsl(210 80% 52%)" },
  { name: "Empfehlung", value: 280, color: "hsl(152 60% 42%)" },
  { name: "Lead-Kauf", value: 195, color: "hsl(38 92% 50%)" },
  { name: "Social Media", value: 160, color: "hsl(280 60% 55%)" },
  { name: "Kaltakquise", value: 120, color: "hsl(340 75% 55%)" },
];
const totalLeadSources = leadSourceData.reduce((s, d) => s + d.value, 0);

/* ── Main Component ────────────────────────────── */
export default function Statistik() {
  const [scope, setScope] = useState<"gesamt" | "individuell">("gesamt");
  const [timeRange, setTimeRange] = useState<TimeRangeKey>("Seit Anfang");
  const [customRange, setCustomRange] = useState<DayPickerRange | undefined>(undefined);
  const [potenzialView, setPotenzialView] = useState<"kaufpreis" | "einkommen" | "geschlecht" | "quelle">("kaufpreis");
  const [uebersichtTab, setUebersichtTab] = useState<"b2c" | "b2b">("b2c");

  // Compute active date range
  const activeDateRange: DateRange | null = useMemo(() => {
    if (timeRange === "Individuell" && customRange?.from) {
      return { from: customRange.from, to: customRange.to || customRange.from };
    }
    return getDateRange(timeRange);
  }, [timeRange, customRange]);

  // Filter leads by date range
  const filteredLeads = useMemo(
    () => SAMPLE_LEADS.filter((l) => isInRange(l.createdAt, activeDateRange)),
    [activeDateRange]
  );

  const b2cLeads = useMemo(() => filteredLeads.filter((l) => l.type === "b2c"), [filteredLeads]);
  const b2bLeads = useMemo(() => filteredLeads.filter((l) => l.type === "b2b"), [filteredLeads]);

  // Pipeline stage counts
  const b2cStageCounts = useMemo(
    () => B2C_PIPELINE_STAGES.map((s) => ({ ...s, count: b2cLeads.filter((l) => l.status === s.id).length })),
    [b2cLeads]
  );
  const b2bStageCounts = useMemo(
    () => B2B_PIPELINE_STAGES.map((s) => ({ ...s, count: b2bLeads.filter((l) => l.status === s.id).length })),
    [b2bLeads]
  );

  const activeStages = uebersichtTab === "b2c" ? b2cStageCounts : b2bStageCounts;
  const activeLeadCount = uebersichtTab === "b2c" ? b2cLeads.length : b2bLeads.length;

  // Bar chart data for overview
  const overviewBarData = activeStages.map((s) => ({ name: s.name, Anzahl: s.count, fill: s.color }));

  // Conversion funnel from filtered data
  const conversionFunnel = useMemo(() => {
    const total = filteredLeads.length;
    if (total === 0) return [];
    const stages = [
      { phase: "Kontakte gesamt", value: total },
      { phase: "B2C Leads", value: b2cLeads.length },
      { phase: "B2B Leads", value: b2bLeads.length },
      { phase: "B2C Inserat erstellt", value: b2cLeads.filter((l) => l.status === "b2c_inserat").length },
      { phase: "B2B Gewonnen", value: b2bLeads.filter((l) => l.status === "b2b_won").length },
    ];
    return stages.map((s) => ({ ...s, pct: total > 0 ? Math.round((s.value / total) * 100) : 0 }));
  }, [filteredLeads, b2cLeads, b2bLeads]);

  return (
    <CRMLayout>
      <div className="p-6 space-y-6 min-h-screen dashboard-mesh-bg">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-10 bg-accent rounded-full" />
          <h1 className="text-3xl font-bold text-foreground">Statistiken</h1>
        </div>

        {/* Scope Toggle */}
        <div className="bg-card border border-border rounded-xl shadow-sm px-5 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">Statistiken anzeigen für:</span>
          <ToggleBtn label="Gesamt" active={scope === "gesamt"} onClick={() => setScope("gesamt")} />
          <ToggleBtn label="Individuell" active={scope === "individuell"} onClick={() => setScope("individuell")} />

          {scope === "individuell" && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="ml-2 px-3 py-1 rounded text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 flex items-center gap-1.5 border border-border">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {customRange?.from
                    ? `${format(customRange.from, "dd.MM.yyyy", { locale: de })}${customRange.to ? ` – ${format(customRange.to, "dd.MM.yyyy", { locale: de })}` : ""}`
                    : "Zeitraum wählen"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={customRange}
                  onSelect={(range) => {
                    setCustomRange(range);
                    if (range?.from) setTimeRange("Individuell");
                  }}
                  numberOfMonths={2}
                  locale={de}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Time Range */}
        <div className="bg-card border border-border rounded-xl shadow-sm px-5 py-3 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground mr-1">Zeitraum:</span>
          {TIME_RANGE_OPTIONS.map((t) => (
            <ToggleBtn key={t} label={t} active={timeRange === t} onClick={() => setTimeRange(t)} />
          ))}
          {activeDateRange && (
            <span className="text-[10px] text-muted-foreground ml-2">
              ({format(activeDateRange.from, "dd.MM.yyyy", { locale: de })} – {format(activeDateRange.to, "dd.MM.yyyy", { locale: de })})
            </span>
          )}
        </div>

        {/* Top Row: Übersicht (B2C/B2B) + Kundenpotenzial */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard
            title="Übersicht"
            actions={
              <div className="flex gap-1">
                <ToggleBtn label="B2C" active={uebersichtTab === "b2c"} onClick={() => setUebersichtTab("b2c")} />
                <ToggleBtn label="B2B" active={uebersichtTab === "b2b"} onClick={() => setUebersichtTab("b2b")} />
              </div>
            }
          >
            {/* KPI Tiles per pipeline stage */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {activeStages.map((s) => (
                <KpiTile key={s.id} label={s.name} value={s.count} />
              ))}
              <KpiTile label={`${uebersichtTab === "b2c" ? "B2C" : "B2B"} Gesamt`} value={activeLeadCount} />
            </div>

            {/* Bar Chart */}
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overviewBarData} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 85%)" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={110} />
                  <Tooltip />
                  <Bar dataKey="Anzahl" radius={[0, 4, 4, 0]}>
                    {overviewBarData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard
            title="Kundenpotenzial"
            actions={
              <div className="flex gap-1">
                {(["kaufpreis", "einkommen", "geschlecht", "quelle"] as const).map((v) => (
                  <ToggleBtn key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} active={potenzialView === v} onClick={() => setPotenzialView(v)} />
                ))}
              </div>
            }
          >
            <div className="flex items-center gap-6">
              <div className="w-[220px] h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={potenzialData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={0}
                      label={({ name, cx: pcx, cy: pcy, midAngle, outerRadius: or }) => {
                        const RADIAN = Math.PI / 180;
                        const r = (or as number) * 0.65;
                        const x = (pcx as number) + r * Math.cos(-midAngle * RADIAN);
                        const y = (pcy as number) + r * Math.sin(-midAngle * RADIAN);
                        return <text x={x} y={y} textAnchor="middle" dominantBaseline="central" className="text-[8px] fill-white font-medium">{name}</text>;
                      }}
                    >
                      {potenzialData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                {potenzialData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2 h-6 rounded-sm" style={{ backgroundColor: d.color }} />
                    <div>
                      <span className="text-foreground font-medium">{d.name}</span><br />
                      <span className="text-muted-foreground text-xs">{((d.value / totalPotenzial) * 100).toFixed(2)} % / {d.value} von {totalPotenzial}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── ANRUF-STATISTIKEN ────────────────────── */}
        <div className="flex items-center gap-2 pt-2">
          <Phone className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Anruf-Statistiken</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <KpiTile label="Calls gesamt" value="360" trend="up" sub="+12% vs. Vorwoche" />
          <KpiTile label="Heute" value="47" />
          <KpiTile label="Gesamtdauer" value="14:32h" sub="⌀ 2:25 / Call" />
          <KpiTile label="Erreichbarkeit" value="55%" trend="up" sub="198 von 360" />
          <KpiTile label="Termine" value="51" trend="up" sub="14% Terminquote" />
          <KpiTile label="Follow-Ups" value="22" />
          <KpiTile label="Kein Interesse" value="32" trend="down" sub="-5% vs. Vorw." />
          <KpiTile label="⌀ Calls/Tag" value="51" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="Anrufe pro Wochentag">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={callsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 85%)" />
                  <XAxis dataKey="tag" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="calls" name="Anrufe" fill="hsl(210 80% 52%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="termine" name="Termine" fill="hsl(152 60% 42%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Ergebnisverteilung Calls">
            <div className="flex items-center gap-6">
              <div className="w-[200px] h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={callResultsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={45}>
                      {callResultsData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-1.5 text-sm flex-1">
                {callResultsData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2 h-5 rounded-sm" style={{ backgroundColor: d.color }} />
                    <span className="text-foreground text-xs font-medium flex-1">{d.name}</span>
                    <span className="text-muted-foreground text-xs">{d.value}</span>
                    <span className="text-muted-foreground text-[10px] w-10 text-right">{((d.value / totalCallResults) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Wochen-Trend: Anrufe & Termine">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 85%)" />
                <XAxis dataKey="woche" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="calls" name="Anrufe" stroke="hsl(210 80% 52%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="erreicht" name="Erreicht" stroke="hsl(152 60% 42%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="termine" name="Termine" stroke="hsl(38 92% 50%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* ── VERTRIEBSSTATISTIKEN ──────────── */}
        <div className="flex items-center gap-2 pt-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Vertriebsstatistiken</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="Conversion-Funnel">
            <div className="space-y-2">
              {conversionFunnel.map((step, i) => (
                <div key={step.phase} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-32 text-right">{step.phase}</span>
                  <div className="flex-1 h-7 bg-muted rounded-md overflow-hidden relative">
                    <div
                      className="h-full rounded-md transition-all"
                      style={{
                        width: `${step.pct}%`,
                        background: `hsl(${210 + i * 20} 70% ${52 + i * 3}%)`,
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
                      {step.value.toLocaleString("de-DE")} ({step.pct}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Lead-Quellen">
            <div className="flex items-center gap-6">
              <div className="w-[200px] h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={leadSourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={45}>
                      {leadSourceData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-1.5 text-sm flex-1">
                {leadSourceData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2 h-5 rounded-sm" style={{ backgroundColor: d.color }} />
                    <span className="text-foreground text-xs font-medium flex-1">{d.name}</span>
                    <span className="text-muted-foreground text-xs">{d.value}</span>
                    <span className="text-muted-foreground text-[10px] w-10 text-right">{((d.value / totalLeadSources) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Bottom Row: Aktivität + Effektivität */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard
            title="Aktivität"
            actions={
              <div className="flex gap-1">
                <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded text-[10px] font-bold">123</span>
                <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-[10px] font-bold"><BarChart3 className="h-3 w-3 inline" /></span>
              </div>
            }
          >
            <div className="grid grid-cols-3 gap-3">
              <KpiTile label="Kontakte angelegt" value={filteredLeads.length.toLocaleString("de-DE")} />
              <KpiTile label="B2C Leads" value={b2cLeads.length.toLocaleString("de-DE")} />
              <KpiTile label="B2B Leads" value={b2bLeads.length.toLocaleString("de-DE")} />
              <KpiTile label="B2C Inserat erstellt" value={b2cLeads.filter((l) => l.status === "b2c_inserat").length} />
              <KpiTile label="B2B Gewonnen" value={b2bLeads.filter((l) => l.status === "b2b_won").length} />
              <KpiTile label="B2C Registriert" value={b2cLeads.filter((l) => l.status === "b2c_registered").length} />
            </div>
          </SectionCard>

          <SectionCard
            title="Effektivität"
            actions={
              <div className="flex gap-1">
                <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded text-[10px] font-bold"><Percent className="h-3 w-3 inline" /></span>
                <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-[10px] font-bold">123</span>
              </div>
            }
          >
            {(() => {
              const totalL = filteredLeads.length || 1;
              const b2cIns = b2cLeads.filter((l) => l.status === "b2c_inserat").length;
              const b2bWon = b2bLeads.filter((l) => l.status === "b2b_won").length;
              const b2cReg = b2cLeads.filter((l) => l.status === "b2c_registered").length;
              return (
                <div className="grid grid-cols-3 gap-3">
                  <KpiTile label="Kontakt zu B2C Lead" value={`${totalL > 0 ? Math.round((b2cLeads.length / totalL) * 100) : 0} %`} />
                  <KpiTile label="Kontakt zu B2B Lead" value={`${totalL > 0 ? Math.round((b2bLeads.length / totalL) * 100) : 0} %`} />
                  <KpiTile label="B2C Lead zu Registriert" value={`${b2cLeads.length > 0 ? Math.round((b2cReg / b2cLeads.length) * 100) : 0} %`} />
                  <KpiTile label="B2C Lead zu Inserat" value={`${b2cLeads.length > 0 ? Math.round((b2cIns / b2cLeads.length) * 100) : 0} %`} />
                  <KpiTile label="B2B Lead zu Gewonnen" value={`${b2bLeads.length > 0 ? Math.round((b2bWon / b2bLeads.length) * 100) : 0} %`} />
                  <KpiTile label="Gesamt-Abschlussquote" value={`${totalL > 0 ? Math.round(((b2cIns + b2bWon) / totalL) * 100) : 0} %`} />
                </div>
              );
            })()}
          </SectionCard>
        </div>

        {/* Weitere KPIs */}
        <SectionCard title="Weitere Kennzahlen">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <KpiTile label="⌀ Reaktionszeit" value="2,4h" trend="down" sub="schneller als Vormonat" />
            <KpiTile label="⌀ Abschlusszeit" value="34 Tage" sub="Kontakt → Notar" />
            <KpiTile label="B2C Leads" value={b2cLeads.length.toLocaleString("de-DE")} trend="up" />
            <KpiTile label="B2B Partner" value={b2bLeads.length.toLocaleString("de-DE")} trend="up" />
            <KpiTile label="Stornoquote" value="3,2%" trend="down" sub="gut" />
            <KpiTile label="⌀ Provision" value="4.820 €" trend="up" />
          </div>
        </SectionCard>
      </div>
    </CRMLayout>
  );
}
