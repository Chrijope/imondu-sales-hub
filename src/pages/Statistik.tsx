import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from "recharts";
import { BarChart3, Percent, Phone, PhoneCall, PhoneOff, PhoneMissed, Timer, TrendingUp, Calendar, CheckCircle2, XCircle, RotateCcw, Users, Target, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";

/* ── KPI Tile ──────────────────────────────────── */
function KpiTile({ label, value, sub, trend }: { label: string; value: string | number; sub?: string; trend?: "up" | "down" }) {
  return (
    <div className="border border-border rounded-lg p-4 flex flex-col items-center justify-center min-h-[90px] bg-card">
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
    <div className="bg-card border border-border rounded-xl shadow-sm p-5">
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

const conversionFunnel = [
  { phase: "Kontakte", value: 2287, pct: 100 },
  { phase: "Neukunden", value: 1993, pct: 87 },
  { phase: "Vollständig", value: 801, pct: 35 },
  { phase: "Reserviert", value: 353, pct: 15 },
  { phase: "Finanziert", value: 146, pct: 6 },
  { phase: "Notar", value: 202, pct: 9 },
  { phase: "Abgeschlossen", value: 140, pct: 6 },
];

/* ── Time range options ────────────────────────── */
const TIME_RANGES = [
  "Heute", "Letzte 7 Tage", "Letzte 30 Tage", "Aktueller Monat",
  "Vorheriger Monat", "Letzte 3 Monate", "Letzte 12 Monate",
  "Aktuelles Jahr", "Seit Anfang", "Individuell",
] as const;

/* ── Main Component ────────────────────────────── */
export default function Statistik() {
  const [scope, setScope] = useState<"gesamt" | "individuell">("gesamt");
  const [timeRange, setTimeRange] = useState("Seit Anfang");
  const [potenzialView, setPotenzialView] = useState<"kaufpreis" | "einkommen" | "geschlecht" | "quelle">("kaufpreis");

  return (
    <CRMLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-10 bg-accent rounded-full" />
          <h1 className="text-3xl font-bold text-foreground">Statistiken</h1>
        </div>

        {/* Scope Toggle */}
        <div className="bg-card border border-border rounded-xl shadow-sm px-5 py-3 flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Statistiken anzeigen für:</span>
          <ToggleBtn label="Gesamt" active={scope === "gesamt"} onClick={() => setScope("gesamt")} />
          <ToggleBtn label="Individuell" active={scope === "individuell"} onClick={() => setScope("individuell")} />
        </div>

        {/* Time Range */}
        <div className="bg-card border border-border rounded-xl shadow-sm px-5 py-3 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground mr-1">Zeitraum:</span>
          {TIME_RANGES.map((t) => (
            <ToggleBtn key={t} label={t} active={timeRange === t} onClick={() => setTimeRange(t)} />
          ))}
        </div>

        {/* Top Row: Übersicht + Kundenpotenzial */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard
            title="Übersicht"
            actions={
              <div className="flex gap-1">
                <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded text-[10px] font-bold">123</span>
                <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-[10px] font-bold">
                  <BarChart3 className="h-3 w-3 inline" />
                </span>
              </div>
            }
          >
            <div className="grid grid-cols-3 gap-3">
              <KpiTile label="Kontakte" value="0" />
              <KpiTile label="Neukunden" value="6" />
              <KpiTile label="Antrag" value="7" />
              <KpiTile label="Rücklauf" value="5" />
              <KpiTile label="Vollständig Bonitätscheck" value="40" />
              <KpiTile label="Fixe Reservierung" value="1" />
              <KpiTile label="Finanzierung" value="19" />
              <KpiTile label="Notar" value="0" />
              <KpiTile label="After Sales" value="5" />
              <KpiTile label="Abrechnung" value="0" />
              <KpiTile label="Inaktiv" value="2.030" />
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

        {/* Call KPIs */}
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

        {/* Call Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calls pro Wochentag */}
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

          {/* Ergebnisverteilung */}
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

        {/* Wochen-Trend */}
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

        {/* ── WEITERE VERTRIEBSSTATISTIKEN ──────────── */}
        <div className="flex items-center gap-2 pt-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Vertriebsstatistiken</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion Funnel */}
          <SectionCard title="Conversion-Funnel">
            <div className="space-y-2">
              {conversionFunnel.map((step, i) => (
                <div key={step.phase} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24 text-right">{step.phase}</span>
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

          {/* Lead-Quellen */}
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
              <KpiTile label="Kontakte angelegt" value="2.287" />
              <KpiTile label="Neukunden eingereicht" value="1.993" />
              <KpiTile label="Vervollständigt" value="801" />
              <KpiTile label="Objekt platziert" value="806" />
              <KpiTile label="Reserviert" value="353" />
              <KpiTile label="Finanziert" value="146" />
              <KpiTile label="Notar abgeschlossen" value="202" />
              <KpiTile label="After Sales abgeschlossen" value="88" />
              <KpiTile label="Abgerechnet / Abgeschlossen" value="140" />
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
            <div className="grid grid-cols-3 gap-3">
              <KpiTile label="Kontakte zu Neukunde" value="87 %" />
              <KpiTile label="Neukunde zu Vollständig" value="40 %" />
              <KpiTile label="Vollständig zu Gesetzt" value="170 %" />
              <KpiTile label="Gesetzt zu Reserviert" value="44 %" />
              <KpiTile label="Reserviert zu Finanziert" value="87 %" />
              <KpiTile label="Finanziert zu Notar" value="73 %" />
              <KpiTile label="Neukunde zu Notar" value="8 %" />
              <KpiTile label="Vollständig zu Reserviert" value="41 %" />
              <KpiTile label="Vollständig zu Notar" value="19 %" />
              <KpiTile label="Reserviert zu Notar" value="44 %" />
            </div>
          </SectionCard>
        </div>

        {/* Weitere KPIs */}
        <SectionCard title="Weitere Kennzahlen">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <KpiTile label="⌀ Reaktionszeit" value="2,4h" trend="down" sub="schneller als Vormonat" />
            <KpiTile label="⌀ Abschlusszeit" value="34 Tage" sub="Kontakt → Notar" />
            <KpiTile label="B2C Leads" value="1.650" trend="up" />
            <KpiTile label="B2B Partner" value="637" trend="up" />
            <KpiTile label="Stornoquote" value="3,2%" trend="down" sub="gut" />
            <KpiTile label="⌀ Provision" value="4.820 €" trend="up" />
          </div>
        </SectionCard>
      </div>
    </CRMLayout>
  );
}
