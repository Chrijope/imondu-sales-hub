import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BarChart3, Percent } from "lucide-react";

/* ── KPI Tile ──────────────────────────────────── */
function KpiTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-border rounded-lg p-4 flex flex-col items-center justify-center min-h-[90px] bg-card">
      <span className="text-xs text-muted-foreground text-center mb-1">{label}</span>
      <span className="text-2xl font-bold text-foreground">{value}</span>
    </div>
  );
}

/* ── Section Card ──────────────────────────────── */
function SectionCard({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
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
function ToggleBtn({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
        active
          ? "bg-accent text-accent-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
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

/* ── Time range options ────────────────────────── */
const TIME_RANGES = [
  "Heute",
  "Letzte 7 Tage",
  "Letzte 30 Tage",
  "Aktueller Monat",
  "Vorheriger Monat",
  "Letzte 3 Monate",
  "Letzte 12 Monate",
  "Aktuelles Jahr",
  "Seit Anfang",
  "Individuell",
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

        {/* Top Row: Übersicht + Kundenpotenzial */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Übersicht */}
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

          {/* Kundenpotenzial */}
          <SectionCard
            title="Kundenpotenzial"
            actions={
              <div className="flex gap-1">
                {(["kaufpreis", "einkommen", "geschlecht", "quelle"] as const).map((v) => (
                  <ToggleBtn
                    key={v}
                    label={v.charAt(0).toUpperCase() + v.slice(1)}
                    active={potenzialView === v}
                    onClick={() => setPotenzialView(v)}
                  />
                ))}
              </div>
            }
          >
            <div className="flex items-center gap-6">
              <div className="w-[220px] h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={potenzialData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={0}
                      label={({ name, cx: pcx, cy: pcy, midAngle, outerRadius: or }) => {
                        const RADIAN = Math.PI / 180;
                        const r = (or as number) * 0.65;
                        const x = (pcx as number) + r * Math.cos(-midAngle * RADIAN);
                        const y = (pcy as number) + r * Math.sin(-midAngle * RADIAN);
                        return (
                          <text x={x} y={y} textAnchor="middle" dominantBaseline="central" className="text-[8px] fill-white font-medium">
                            {name}
                          </text>
                        );
                      }}
                    >
                      {potenzialData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                      ))}
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
                      <span className="text-foreground font-medium">{d.name}</span>
                      <br />
                      <span className="text-muted-foreground text-xs">
                        {((d.value / totalPotenzial) * 100).toFixed(2)} % / {d.value} von {totalPotenzial}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
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

        {/* Bottom Row: Aktivität + Effektivität */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Aktivität */}
          <SectionCard
            title="Aktivität"
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

          {/* Effektivität */}
          <SectionCard
            title="Effektivität"
            actions={
              <div className="flex gap-1">
                <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded text-[10px] font-bold">
                  <Percent className="h-3 w-3 inline" />
                </span>
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
      </div>
    </CRMLayout>
  );
}
