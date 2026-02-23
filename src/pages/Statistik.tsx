import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CRMLayout from "@/components/CRMLayout";
import { SAMPLE_LEADS, B2C_PIPELINE_STAGES, B2B_PIPELINE_STAGES } from "@/data/crm-data";
import { TIME_RANGE_OPTIONS, TimeRangeKey, getDateRange, isInRange, DateRange } from "@/utils/date-filters";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from "recharts";
import { BarChart3, Percent, Phone, TrendingUp, ArrowUpRight, ArrowDownRight, CalendarIcon, ChevronDown, ChevronRight, Users, GraduationCap, XCircle, Clock, Star, ArrowLeft, Plus, MapPin, UserCheck } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { DateRange as DayPickerRange } from "react-day-picker";
import { useUserRole } from "@/contexts/UserRoleContext";

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

/* ── Section Card (Collapsible) ─────────────────── */
function SectionCard({ title, actions, children, defaultOpen = true }: { title: string; actions?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-0 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-1 bg-accent rounded-full" />
          <h2 className="font-semibold text-foreground">{title}</h2>
          {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </div>
        {actions && <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>{actions}</div>}
      </div>
      {open && <div className="mt-4">{children}</div>}
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

/* ── Pie Data: Immobilien-Portfolio ─────────────── */
const immobilienwertData = [
  { name: "< 200.000 €", value: 18, color: "hsl(210 80% 52%)" },
  { name: "200.000 – 399.999 €", value: 32, color: "hsl(340 75% 55%)" },
  { name: "400.000 – 699.999 €", value: 24, color: "hsl(152 60% 42%)" },
  { name: "700.000 – 999.999 €", value: 14, color: "hsl(38 92% 50%)" },
  { name: "≥ 1.000.000 €", value: 8, color: "hsl(280 60% 55%)" },
];
const totalImmobilienwert = immobilienwertData.reduce((s, d) => s + d.value, 0);

const objekttypData = [
  { name: "Einfamilienhaus", value: 34, color: "hsl(38 92% 50%)" },
  { name: "Mehrfamilienhaus", value: 28, color: "hsl(210 80% 52%)" },
  { name: "Wohnung", value: 19, color: "hsl(152 60% 42%)" },
  { name: "Gewerbeobjekt", value: 11, color: "hsl(280 60% 55%)" },
  { name: "Grundstück", value: 4, color: "hsl(340 75% 55%)" },
];
const totalObjekttyp = objekttypData.reduce((s, d) => s + d.value, 0);

const sanierungsstatusData = [
  { name: "Unsaniert", value: 38, color: "hsl(0 72% 51%)" },
  { name: "Teilsaniert", value: 31, color: "hsl(38 92% 50%)" },
  { name: "Vollsaniert", value: 18, color: "hsl(152 60% 42%)" },
  { name: "Neubau", value: 9, color: "hsl(210 80% 52%)" },
];
const totalSanierung = sanierungsstatusData.reduce((s, d) => s + d.value, 0);

const regionData = [
  { name: "Bayern", value: 22, color: "hsl(210 80% 52%)" },
  { name: "NRW", value: 18, color: "hsl(152 60% 42%)" },
  { name: "Berlin", value: 15, color: "hsl(340 75% 55%)" },
  { name: "Baden-Württemberg", value: 14, color: "hsl(38 92% 50%)" },
  { name: "Hamburg", value: 10, color: "hsl(280 60% 55%)" },
  { name: "Sonstige", value: 17, color: "hsl(220 14% 60%)" },
];
const totalRegion = regionData.reduce((s, d) => s + d.value, 0);

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
  { name: "Termin vereinbart", value: 51, color: "hsl(152 60% 42%)" },
  { name: "Inserat erstellt", value: 28, color: "hsl(210 80% 52%)" },
  { name: "Nicht erreicht", value: 68, color: "hsl(0 72% 51%)" },
  { name: "Mailbox", value: 45, color: "hsl(38 92% 50%)" },
  { name: "Follow-Up geplant", value: 22, color: "hsl(280 60% 55%)" },
  { name: "Kein Interesse", value: 32, color: "hsl(220 14% 60%)" },
];
const totalCallResults = callResultsData.reduce((s, d) => s + d.value, 0);

const weeklyTrend = [
  { woche: "KW 4", calls: 180, termine: 28, inserate: 5, quote: 47 },
  { woche: "KW 5", calls: 210, termine: 35, inserate: 8, quote: 49 },
  { woche: "KW 6", calls: 195, termine: 31, inserate: 6, quote: 47 },
  { woche: "KW 7", calls: 240, termine: 42, inserate: 11, quote: 49 },
  { woche: "KW 8", calls: 260, termine: 51, inserate: 14, quote: 55 },
];

const leadSourceData = [
  { name: "Landingpage / Website", value: 28, color: "hsl(210 80% 52%)" },
  { name: "Rabattcode / Empfehlung", value: 24, color: "hsl(152 60% 42%)" },
  { name: "Powerdialer / Kaltakquise", value: 19, color: "hsl(38 92% 50%)" },
  { name: "Social Media Kampagne", value: 15, color: "hsl(280 60% 55%)" },
  { name: "Lead-Kauf", value: 10, color: "hsl(340 75% 55%)" },
];
const totalLeadSources = leadSourceData.reduce((s, d) => s + d.value, 0);

/* ── Bewerber Data ─────────────────────────────── */
const BEWERBER_STATS = {
  gesamt: 7, imProzess: 4, onboarding: 1, abgelehnt: 1,
  quellen: [
    { name: "LinkedIn", value: 1, color: "hsl(210 80% 52%)" },
    { name: "Empfehlung", value: 2, color: "hsl(152 60% 42%)" },
    { name: "Jobportal", value: 1, color: "hsl(38 92% 50%)" },
    { name: "Website", value: 1, color: "hsl(280 60% 55%)" },
    { name: "Social Media", value: 1, color: "hsl(340 75% 55%)" },
    { name: "Messe", value: 1, color: "hsl(180 50% 45%)" },
  ],
  pipeline: [
    { name: "Eingang", value: 1, color: "hsl(220 14% 60%)" },
    { name: "Screening", value: 1, color: "hsl(210 80% 52%)" },
    { name: "16P-Test", value: 1, color: "hsl(280 60% 55%)" },
    { name: "Interview", value: 1, color: "hsl(38 92% 50%)" },
    { name: "Entscheidung", value: 1, color: "hsl(210 60% 45%)" },
    { name: "Onboarding", value: 1, color: "hsl(152 60% 42%)" },
  ],
  avgBewertung: 3.4,
  hoheFit: 3, mittlereFit: 2, geringeFit: 2,
};

/* ── Bewerber-Daten (gleich wie Bewerbungsmanagement) ── */
const BEWERBER_LIST = [
  { id: "b1", vorname: "Max", nachname: "Bauer", ort: "München", stage: "interview", quelle: "LinkedIn", bewertung: 4, personalityType: "ENTJ" },
  { id: "b2", vorname: "Sarah", nachname: "Klein", ort: "Berlin", stage: "persoenlichkeitstest", quelle: "Jobportal", bewertung: 3 },
  { id: "b3", vorname: "Tim", nachname: "Hoffmann", ort: "Hamburg", stage: "screening", quelle: "Empfehlung", bewertung: 5 },
  { id: "b4", vorname: "Julia", nachname: "Richter", ort: "Köln", stage: "eingang", quelle: "Website" },
  { id: "b5", vorname: "Markus", nachname: "Braun", ort: "Frankfurt", stage: "onboarding", quelle: "Empfehlung", bewertung: 5, personalityType: "ENFJ" },
  { id: "b6", vorname: "Anna", nachname: "Meier", ort: "Stuttgart", stage: "abgelehnt", quelle: "Social Media", bewertung: 1, personalityType: "ISFP" },
  { id: "b7", vorname: "Lukas", nachname: "Weber", ort: "Düsseldorf", stage: "entscheidung", quelle: "Messe", bewertung: 4, personalityType: "ESTP" },
];

const STAGE_LABELS: Record<string, string> = {
  eingang: "Eingang", screening: "Screening", persoenlichkeitstest: "16P-Test",
  interview: "Interview", entscheidung: "Entscheidung", onboarding: "Onboarding", abgelehnt: "Abgelehnt",
};
const STAGE_COLORS: Record<string, string> = {
  eingang: "bg-muted-foreground", screening: "bg-[hsl(var(--info))]", persoenlichkeitstest: "bg-primary",
  interview: "bg-[hsl(var(--warning))]", entscheidung: "bg-primary", onboarding: "bg-[hsl(var(--success))]", abgelehnt: "bg-destructive",
};

/* ── Onboarding Termine ─────────────────────────── */
interface OnboardingTermin {
  id: string;
  datum: string;
  uhrzeit: string;
  standort: string;
  bewerberIds: string[];
}

const INITIAL_ONBOARDING_TERMINE: OnboardingTermin[] = [
  { id: "ot1", datum: "2026-03-03", uhrzeit: "10:00", standort: "München – Leopoldstraße 42", bewerberIds: ["b5"] },
  { id: "ot2", datum: "2026-03-10", uhrzeit: "14:00", standort: "Berlin – Friedrichstraße 108", bewerberIds: [] },
];

/* ── Collapsible Section Header ────────────────── */
function CollapsibleSectionHeader({ icon: Icon, title, defaultOpen = true, children }: { icon: React.ComponentType<{ className?: string }>; title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 pt-2 w-full text-left">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground flex-1">{title}</h2>
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && children}
    </>
  );
}

/* ── Main Component ────────────────────────────── */
export default function Statistik() {
  const { currentRoleId } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scope, setScope] = useState<"gesamt" | "individuell">("gesamt");
  const [timeRange, setTimeRange] = useState<TimeRangeKey>("Seit Anfang");
  const [customRange, setCustomRange] = useState<DayPickerRange | undefined>(undefined);
  const [potenzialView, setPotenzialView] = useState<"immobilienwert" | "objekttyp" | "sanierung" | "region">("immobilienwert");
  const [uebersichtTab, setUebersichtTab] = useState<"b2c" | "b2b">("b2c");
  const [aktivitaetTab, setAktivitaetTab] = useState<"b2c" | "b2b">("b2c");
  const [bewerberFilter, setBewerberFilter] = useState<string | null>(null);
  const [onboardingTermine, setOnboardingTermine] = useState<OnboardingTermin[]>(INITIAL_ONBOARDING_TERMINE);
  const [newTerminOpen, setNewTerminOpen] = useState(false);
  const [newTermin, setNewTermin] = useState({ datum: "", uhrzeit: "", standort: "" });
  const [expandedTerminId, setExpandedTerminId] = useState<string | null>(null);

  const isHR = currentRoleId === "hr";
  const canSeeBewerber = currentRoleId === "admin" || currentRoleId === "hr" || currentRoleId === "vertriebsleiter";

  const handleAddTermin = () => {
    if (!newTermin.datum || !newTermin.uhrzeit || !newTermin.standort) return;
    const t: OnboardingTermin = { id: `ot${Date.now()}`, datum: newTermin.datum, uhrzeit: newTermin.uhrzeit, standort: newTermin.standort, bewerberIds: [] };
    setOnboardingTermine((prev) => [...prev, t]);
    setNewTerminOpen(false);
    setNewTermin({ datum: "", uhrzeit: "", standort: "" });
    toast({ title: "Onboarding-Termin erstellt ✓" });
  };

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
      { phase: "Eigentümer (B2C)", value: b2cLeads.length },
      { phase: "Registriert auf IMONDU", value: b2cLeads.filter((l) => l.status === "b2c_registered").length },
      { phase: "Inserat erstellt", value: b2cLeads.filter((l) => l.status === "b2c_inserat").length },
      { phase: "Entwickler-Match", value: Math.round(b2cLeads.filter((l) => l.status === "b2c_inserat").length * 0.7) },
      { phase: "Entwickler (B2B)", value: b2bLeads.length },
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

        {/* Non-HR content */}
        {!isHR && (<>
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

        {/* ── VERTRIEBSSTATISTIKEN ──────────── */}
        <CollapsibleSectionHeader icon={TrendingUp} title="Vertriebsstatistiken">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <SectionCard
            title="Übersicht"
            actions={
              <div className="flex gap-1">
                <ToggleBtn label="Eigentümer (B2C)" active={uebersichtTab === "b2c"} onClick={() => setUebersichtTab("b2c")} />
                <ToggleBtn label="Entwickler (B2B)" active={uebersichtTab === "b2b"} onClick={() => setUebersichtTab("b2b")} />
              </div>
            }
          >
            <div className="grid grid-cols-3 gap-3 mb-4">
              {activeStages.map((s) => (
                <KpiTile key={s.id} label={s.name} value={s.count} />
              ))}
              <KpiTile label={`${uebersichtTab === "b2c" ? "B2C" : "B2B"} Gesamt`} value={activeLeadCount} />
            </div>
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
            title="Immobilien-Portfolio"
            actions={
              <div className="flex gap-1">
                {([
                  { key: "immobilienwert" as const, label: "Immobilienwert" },
                  { key: "objekttyp" as const, label: "Objekttyp" },
                  { key: "sanierung" as const, label: "Sanierung" },
                  { key: "region" as const, label: "Region" },
                ]).map((v) => (
                  <ToggleBtn key={v.key} label={v.label} active={potenzialView === v.key} onClick={() => setPotenzialView(v.key)} />
                ))}
              </div>
            }
          >
            {(() => {
              const dataMap = {
                immobilienwert: { data: immobilienwertData, total: totalImmobilienwert },
                objekttyp: { data: objekttypData, total: totalObjekttyp },
                sanierung: { data: sanierungsstatusData, total: totalSanierung },
                region: { data: regionData, total: totalRegion },
              };
              const { data: activeData, total: activeTotal } = dataMap[potenzialView];
              return (
                <div className="flex items-center gap-6">
                  <div className="w-[220px] h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={activeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={0}
                          label={({ name, cx: pcx, cy: pcy, midAngle, outerRadius: or }) => {
                            const RADIAN = Math.PI / 180;
                            const r = (or as number) * 0.65;
                            const x = (pcx as number) + r * Math.cos(-midAngle * RADIAN);
                            const y = (pcy as number) + r * Math.sin(-midAngle * RADIAN);
                            return <text x={x} y={y} textAnchor="middle" dominantBaseline="central" className="text-[8px] fill-white font-medium">{name}</text>;
                          }}
                        >
                          {activeData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    {activeData.map((d) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="w-2 h-6 rounded-sm" style={{ backgroundColor: d.color }} />
                        <div>
                          <span className="text-foreground font-medium">{d.name}</span><br />
                          <span className="text-muted-foreground text-xs">{((d.value / activeTotal) * 100).toFixed(1)} % / {d.value} von {activeTotal}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="IMONDU Conversion-Funnel">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard
            title="Aktivität"
            actions={
              <div className="flex gap-1">
                <ToggleBtn label="Eigentümer (B2C)" active={aktivitaetTab === "b2c"} onClick={() => setAktivitaetTab("b2c")} />
                <ToggleBtn label="Entwickler (B2B)" active={aktivitaetTab === "b2b"} onClick={() => setAktivitaetTab("b2b")} />
              </div>
            }
          >
            {aktivitaetTab === "b2c" ? (
              <div className="grid grid-cols-3 gap-3">
                <KpiTile label="Kontakte angelegt" value={b2cLeads.length} />
                {B2C_PIPELINE_STAGES.filter(s => s.id !== "b2c_lost").map((stage) => (
                  <KpiTile key={stage.id} label={stage.name} value={b2cLeads.filter((l) => l.status === stage.id).length} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <KpiTile label="Kontakte angelegt" value={b2bLeads.length} />
                {B2B_PIPELINE_STAGES.map((stage) => (
                  <KpiTile key={stage.id} label={stage.name} value={b2bLeads.filter((l) => l.status === stage.id).length} />
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Effektivität"
            actions={
              <div className="flex gap-1">
                <ToggleBtn label="Eigentümer (B2C)" active={aktivitaetTab === "b2c"} onClick={() => setAktivitaetTab("b2c")} />
                <ToggleBtn label="Entwickler (B2B)" active={aktivitaetTab === "b2b"} onClick={() => setAktivitaetTab("b2b")} />
              </div>
            }
          >
            {(() => {
              if (aktivitaetTab === "b2c") {
                const total = b2cLeads.length || 1;
                const pct = (stageId: string) => {
                  const prev = B2C_PIPELINE_STAGES.find(s => s.order === (B2C_PIPELINE_STAGES.find(s2 => s2.id === stageId)?.order ?? 0) - 1);
                  const prevCount = prev ? b2cLeads.filter(l => l.status === prev.id).length || 1 : total;
                  const cur = b2cLeads.filter(l => l.status === stageId).length;
                  return `${Math.round((cur / prevCount) * 100)} %`;
                };
                // Show conversion between consecutive stages
                const conversions = B2C_PIPELINE_STAGES.filter(s => s.id !== "b2c_new" && s.id !== "b2c_lost").map((stage, i) => {
                  const prevStage = B2C_PIPELINE_STAGES[stage.order - 1];
                  const prevCount = b2cLeads.filter(l => l.status === prevStage.id).length || 1;
                  const curCount = b2cLeads.filter(l => l.status === stage.id).length;
                  return {
                    label: `${prevStage.name} → ${stage.name}`,
                    value: `${Math.round((curCount / prevCount) * 100)} %`,
                  };
                });
                return (
                  <div className="grid grid-cols-3 gap-3">
                    <KpiTile label="Neuer Lead → Kontaktversuch" value={`${Math.round((b2cLeads.filter(l => l.status === "b2c_contact").length / total) * 100)} %`} />
                    {conversions.map((c) => (
                      <KpiTile key={c.label} label={c.label} value={c.value} />
                    ))}
                  </div>
                );
              } else {
                const total = b2bLeads.length || 1;
                const conversions = B2B_PIPELINE_STAGES.filter(s => s.id !== "b2b_new").map((stage) => {
                  const prevStage = B2B_PIPELINE_STAGES[stage.order - 1];
                  const prevCount = b2bLeads.filter(l => l.status === prevStage.id).length || 1;
                  const curCount = b2bLeads.filter(l => l.status === stage.id).length;
                  return {
                    label: `${prevStage.name} → ${stage.name}`,
                    value: `${Math.round((curCount / prevCount) * 100)} %`,
                  };
                });
                return (
                  <div className="grid grid-cols-3 gap-3">
                    <KpiTile label="Neuer Lead → Kontaktversuch" value={`${Math.round((b2bLeads.filter(l => l.status === "b2b_contact").length / total) * 100)} %`} />
                    {conversions.map((c) => (
                      <KpiTile key={c.label} label={c.label} value={c.value} />
                    ))}
                  </div>
                );
              }
            })()}
          </SectionCard>
        </div>

        <SectionCard title="IMONDU Kennzahlen">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <KpiTile label="Eigentümer registriert" value={b2cLeads.filter((l) => l.status === "b2c_registered").length} trend="up" sub="aktive Nutzer" />
            <KpiTile label="Inserate erstellt" value={b2cLeads.filter((l) => l.status === "b2c_inserat").length} trend="up" sub="auf Plattform" />
            <KpiTile label="Entwickler aktiv" value="8" sub="registrierte Partner" />
            <KpiTile label="⌀ Matching Score" value="82%" trend="up" sub="Eigentümer ↔ Entwickler" />
            <KpiTile label="⌀ Antwortzeit Entwickler" value="14h" trend="down" sub="schneller als Vormonat" />
            <KpiTile label="⌀ Provision" value="4.820 €" trend="up" sub="pro Vermittlung" />
          </div>
        </SectionCard>
        </CollapsibleSectionHeader>

        {/* ── ANRUF-STATISTIKEN ────────────────────── */}
        <CollapsibleSectionHeader icon={Phone} title="Anruf-Statistiken">

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-4">
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
                <Line type="monotone" dataKey="inserate" name="Inserate erstellt" stroke="hsl(152 60% 42%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="termine" name="Termine" stroke="hsl(38 92% 50%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        </CollapsibleSectionHeader>
        </>)}

        {/* ── BEWERBER-STATISTIKEN ──────────── */}
        {canSeeBewerber && (
          <CollapsibleSectionHeader icon={Users} title="Bewerber-Statistiken">
            {/* Clickable KPI Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {([
                { key: "gesamt", label: "Bewerber gesamt", value: BEWERBER_STATS.gesamt },
                { key: "imProzess", label: "Im Prozess", value: BEWERBER_STATS.imProzess },
                { key: "onboarding", label: "Onboarding", value: BEWERBER_STATS.onboarding },
                { key: "abgelehnt", label: "Abgelehnt", value: BEWERBER_STATS.abgelehnt },
              ] as const).map((kpi) => (
                <button
                  key={kpi.key}
                  onClick={() => setBewerberFilter(bewerberFilter === kpi.key ? null : kpi.key)}
                  className={`glass-card rounded-xl p-4 flex flex-col items-center justify-center min-h-[90px] cursor-pointer transition-all ${bewerberFilter === kpi.key ? "ring-2 ring-primary shadow-crm-md" : "hover:shadow-crm-sm"}`}
                >
                  <span className="text-xs text-muted-foreground text-center mb-1">{kpi.label}</span>
                  <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
                  <span className="text-[10px] text-primary mt-1">{bewerberFilter === kpi.key ? "▲ Schließen" : "▼ Details"}</span>
                </button>
              ))}
            </div>

            {/* Onboarding Termine View */}
            {bewerberFilter === "onboarding" && (
              <div className="mt-4 space-y-4">
                <div className="glass-card rounded-xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-border bg-secondary/20 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">
                      Nächste Onboarding-Termine
                      <span className="text-muted-foreground font-normal ml-2">({onboardingTermine.length})</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="text-xs gap-1.5 gradient-brand border-0 text-white" onClick={() => setNewTerminOpen(true)}>
                        <Plus className="h-3.5 w-3.5" /> Neuer Termin
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs" onClick={() => setBewerberFilter(null)}>
                        <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Schließen
                      </Button>
                    </div>
                  </div>
                  <div className="divide-y divide-border/50">
                    {onboardingTermine.map((termin) => {
                      const eingeladene = BEWERBER_LIST.filter((b) => termin.bewerberIds.includes(b.id));
                      const isExpanded = expandedTerminId === termin.id;
                      return (
                        <div key={termin.id}>
                          <button
                            className={`w-full text-left px-5 py-4 hover:bg-secondary/20 transition-colors ${isExpanded ? "bg-secondary/20" : ""}`}
                            onClick={() => setExpandedTerminId(isExpanded ? null : termin.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--success))]/10 flex items-center justify-center">
                                  <CalendarIcon className="h-5 w-5 text-[hsl(var(--success))]" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">
                                    {new Date(termin.datum).toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                                    <span className="text-muted-foreground font-normal ml-2">{termin.uhrzeit} Uhr</span>
                                  </p>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3 w-3" /> {termin.standort}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <UserCheck className="h-3.5 w-3.5" /> {eingeladene.length} eingeladen
                                </span>
                                {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                              </div>
                            </div>
                          </button>
                          {isExpanded && (
                            <div className="px-5 pb-4">
                              {eingeladene.length > 0 ? (
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-border">
                                      <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                                      <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Ort</th>
                                      <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Quelle</th>
                                      <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">16P-Typ</th>
                                      <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Bewertung</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {eingeladene.map((b) => (
                                      <tr
                                        key={b.id}
                                        className="border-b border-border/50 hover:bg-primary/5 cursor-pointer transition-colors"
                                        onClick={() => navigate("/bewerbungsmanagement")}
                                      >
                                        <td className="py-2 px-3 font-medium text-foreground">{b.vorname} {b.nachname}</td>
                                        <td className="py-2 px-3 text-muted-foreground">{b.ort}</td>
                                        <td className="py-2 px-3 text-muted-foreground">{b.quelle}</td>
                                        <td className="py-2 px-3 text-muted-foreground">{b.personalityType || "–"}</td>
                                        <td className="py-2 px-3">
                                          {b.bewertung ? (
                                            <div className="flex items-center gap-0.5">
                                              {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`h-3 w-3 ${i < b.bewertung! ? "text-[hsl(var(--warning))] fill-[hsl(var(--warning))]" : "text-muted"}`} />
                                              ))}
                                            </div>
                                          ) : <span className="text-muted-foreground">–</span>}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p className="text-xs text-muted-foreground py-3 text-center bg-muted/30 rounded-lg">Noch keine Bewerber zu diesem Termin eingeladen.</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {onboardingTermine.length === 0 && (
                      <div className="py-8 text-center text-sm text-muted-foreground">Keine Onboarding-Termine vorhanden.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bewerber Detail Table (non-onboarding filters) */}
            {bewerberFilter && bewerberFilter !== "onboarding" && (() => {
              const filtered = bewerberFilter === "gesamt"
                ? BEWERBER_LIST
                : bewerberFilter === "imProzess"
                ? BEWERBER_LIST.filter((b) => !["abgelehnt", "onboarding"].includes(b.stage))
                : BEWERBER_LIST.filter((b) => b.stage === "abgelehnt");

              return (
                <div className="mt-4 glass-card rounded-xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-border bg-secondary/20 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">
                      {bewerberFilter === "gesamt" ? "Alle Bewerber" : bewerberFilter === "imProzess" ? "Bewerber im Prozess" : "Abgelehnte Bewerber"}
                      <span className="text-muted-foreground font-normal ml-2">({filtered.length})</span>
                    </h3>
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => setBewerberFilter(null)}>
                      <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Schließen
                    </Button>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                        <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Ort</th>
                        <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Quelle</th>
                        <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">16P-Typ</th>
                        <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Bewertung</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((b) => (
                        <tr
                          key={b.id}
                          className="border-b border-border/50 hover:bg-primary/5 cursor-pointer transition-colors"
                          onClick={() => navigate("/bewerbungsmanagement")}
                        >
                          <td className="py-2.5 px-4 font-medium text-foreground">{b.vorname} {b.nachname}</td>
                          <td className="py-2.5 px-4 text-muted-foreground">{b.ort}</td>
                          <td className="py-2.5 px-4">
                            <span className="inline-flex items-center gap-1.5 text-xs">
                              <span className={`h-2 w-2 rounded-full ${STAGE_COLORS[b.stage] || "bg-muted-foreground"}`} />
                              {STAGE_LABELS[b.stage] || b.stage}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-muted-foreground">{b.quelle}</td>
                          <td className="py-2.5 px-4 text-muted-foreground">{b.personalityType || "–"}</td>
                          <td className="py-2.5 px-4">
                            {b.bewertung ? (
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${i < b.bewertung! ? "text-[hsl(var(--warning))] fill-[hsl(var(--warning))]" : "text-muted"}`} />
                                ))}
                              </div>
                            ) : <span className="text-muted-foreground">–</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              <SectionCard title="Pipeline-Verteilung">
                <div className="space-y-2">
                  {BEWERBER_STATS.pipeline.map((s) => (
                    <div key={s.name} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-24 text-right">{s.name}</span>
                      <div className="flex-1 h-7 bg-muted rounded-md overflow-hidden relative">
                        <div className="h-full rounded-md" style={{ width: `${(s.value / BEWERBER_STATS.gesamt) * 100}%`, backgroundColor: s.color }} />
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">{s.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Bewerber-Quellen">
                <div className="flex items-center gap-6">
                  <div className="w-[180px] h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={BEWERBER_STATS.quellen} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                          {BEWERBER_STATS.quellen.map((entry, i) => <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm flex-1">
                    {BEWERBER_STATS.quellen.map((d) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="w-2 h-5 rounded-sm" style={{ backgroundColor: d.color }} />
                        <span className="text-foreground text-xs font-medium flex-1">{d.name}</span>
                        <span className="text-muted-foreground text-xs">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <KpiTile label="⌀ Bewertung" value={BEWERBER_STATS.avgBewertung.toFixed(1)} sub="von 5 Sternen" />
              <KpiTile label="Hohe Eignung" value={BEWERBER_STATS.hoheFit} sub="16P-Test" trend="up" />
              <KpiTile label="Mittlere Eignung" value={BEWERBER_STATS.mittlereFit} />
              <KpiTile label="Geringe Eignung" value={BEWERBER_STATS.geringeFit} />
            </div>
          </CollapsibleSectionHeader>
        )}
      </div>

      {/* Neuer Onboarding-Termin Dialog */}
      <Dialog open={newTerminOpen} onOpenChange={setNewTerminOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Neuen Onboarding-Termin anlegen</DialogTitle>
            <DialogDescription>Erstelle einen Termin, zu dem Bewerber eingeladen werden können.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Datum *</Label>
              <Input type="date" value={newTermin.datum} onChange={(e) => setNewTermin((p) => ({ ...p, datum: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Uhrzeit *</Label>
              <Input type="time" value={newTermin.uhrzeit} onChange={(e) => setNewTermin((p) => ({ ...p, uhrzeit: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Standort *</Label>
              <Input value={newTermin.standort} onChange={(e) => setNewTermin((p) => ({ ...p, standort: e.target.value }))} placeholder="z.B. München – Leopoldstraße 42" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setNewTerminOpen(false)}>Abbrechen</Button>
              <Button onClick={handleAddTermin} disabled={!newTermin.datum || !newTermin.uhrzeit || !newTermin.standort} className="gap-2 gradient-brand border-0 text-white">
                <Plus className="h-4 w-4" /> Termin erstellen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </CRMLayout>
  );
}
