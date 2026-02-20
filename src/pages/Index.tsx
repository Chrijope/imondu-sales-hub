import { Link } from "react-router-dom";
import {
  Users,
  Building2,
  Briefcase,
  UserPlus,
  Newspaper,
  ArrowRight,
  TrendingUp,
  ClipboardList,
  Phone,
} from "lucide-react";
import CRMLayout from "@/components/CRMLayout";
import { SAMPLE_LEADS } from "@/data/crm-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const monthlyData = [
  { month: "Sep", b2c: 3, b2b: 1 },
  { month: "Okt", b2c: 5, b2b: 2 },
  { month: "Nov", b2c: 4, b2b: 3 },
  { month: "Dez", b2c: 7, b2b: 2 },
  { month: "Jan", b2c: 6, b2b: 4 },
  { month: "Feb", b2c: 8, b2b: 3 },
];

const provisionsData = [
  { month: "Sep", provision: 120 },
  { month: "Okt", provision: 280 },
  { month: "Nov", provision: 350 },
  { month: "Dez", provision: 190 },
  { month: "Jan", provision: 470 },
  { month: "Feb", provision: 625 },
];

const news = [
  { text: "🚀 Neue Inserats-Funktion für Eigentümer live", isNew: true },
  { text: "→ Imondu Partner Weekend – 15./16.03. in München", isNew: false },
  { text: "→ Neue B2B Mitgliedschafts-Pakete verfügbar", isNew: false },
  { text: "→ Provisionsauszahlung Februar abgeschlossen", isNew: false },
];

const tasks = [
  { text: "Follow-Up: Architektur Bauer GmbH anrufen", due: "Heute 14:00", priority: "high" },
  { text: "Eigentümer Müller – Inserat prüfen", due: "Heute 16:00", priority: "high" },
  { text: "Peter Klein – Rückruf (MFH Sanierung)", due: "Morgen 10:00", priority: "medium" },
  { text: "Neue B2B Leads qualifizieren", due: "Morgen", priority: "low" },
];

export default function Dashboard() {
  const b2cLeads = SAMPLE_LEADS.filter((l) => l.type === "b2c");
  const b2bLeads = SAMPLE_LEADS.filter((l) => l.type === "b2b");
  const b2cBestand = b2cLeads.filter((l) => l.status === "b2c_inserat").length;
  const b2bBestand = b2bLeads.filter((l) => l.status === "b2b_won").length;
  const b2cNew = b2cLeads.filter((l) => l.status === "b2c_new").length;
  const b2bNew = b2bLeads.filter((l) => l.status === "b2b_new").length;

  // Provision calculations
  const b2cProvision = b2cBestand * 10; // 10€ per Inserat
  const b2bProvision = b2bBestand * 312.5; // 25% von 1.250€
  const b2cPotenzial = b2cLeads.length * 10;
  const b2bPotenzial = b2bLeads.length * 312.5;

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in min-h-screen dashboard-mesh-bg">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-1 rounded-full gradient-brand" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Willkommen zurück, Max. Hier ist dein Überblick.</p>
        </div>

        {/* Row 1: Leadübersicht + Kundenübersicht + Mitteilungen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Leadübersicht Chart */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Leadübersicht</h2>
            </div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={2}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="b2c" name="Eigentümer" fill="hsl(250, 60%, 52%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="b2b" name="Partner" fill="hsl(340, 75%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-primary" />
                <span className="text-xs text-muted-foreground">Eigentümer (B2C)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-accent" />
                <span className="text-xs text-muted-foreground">Partner (B2B)</span>
              </div>
            </div>
          </div>

          {/* Kundenübersicht */}
          <div className="lg:col-span-4 glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Kundenübersicht</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-foreground">{b2cNew + b2bNew}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Neue Leads</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-foreground">
                  {SAMPLE_LEADS.filter((l) => l.status === "b2c_inserat" || l.status === "b2b_won").length}
                </p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Abschlüsse</p>
              </div>
            </div>
            <div className="border-t border-border my-4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-b2c">{b2cBestand}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">B2C Bestand</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-b2b">{b2bBestand}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">B2B Bestand</p>
              </div>
            </div>
          </div>

          {/* Mitteilungen */}
          <div className="lg:col-span-3 glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Mitteilungen</h2>
            </div>
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div
                    className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                      task.priority === "high" ? "bg-destructive" : task.priority === "medium" ? "bg-warning" : "bg-muted-foreground"
                    }`}
                  />
                  <div>
                    <p className="text-xs text-foreground leading-tight">{task.text}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{task.due}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/leads" className="flex items-center gap-1 text-xs text-accent font-medium mt-4 hover:underline">
              Alle Mitteilungen ansehen <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Row 2: Eigenumsatz + Potenzial + News */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Eigenumsatz */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Eigenumsatz (Provision)</h2>
            </div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={provisionsData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} unit="€" />
                  <Tooltip formatter={(v: number) => `${v.toFixed(2)} €`} />
                  <Bar dataKey="provision" name="Provision" fill="hsl(250, 60%, 52%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Potenzial */}
          <div className="lg:col-span-4 glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Potenzial</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-foreground">{b2cLeads.length}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">B2C Leads</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-foreground">{b2bLeads.length}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">B2B Leads</p>
              </div>
            </div>
            <div className="border-t border-border my-4" />
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-foreground">
                {(b2cPotenzial + b2bPotenzial).toLocaleString("de-DE")} <span className="text-base font-normal text-muted-foreground">EUR</span>
              </p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Mögliches Provisionsvolumen</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="text-sm font-semibold text-b2c">{b2cPotenzial.toLocaleString("de-DE")} €</p>
                <p className="text-[11px] text-muted-foreground">B2C ({b2cLeads.length} × 10€)</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="text-sm font-semibold text-b2b">{b2bPotenzial.toLocaleString("de-DE")} €</p>
                <p className="text-[11px] text-muted-foreground">B2B ({b2bLeads.length} × 312,50€)</p>
              </div>
            </div>
          </div>

          {/* News */}
          <div className="lg:col-span-3 glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">News</h2>
            </div>
            <div className="space-y-3">
              {news.map((item, i) => (
                <p key={i} className={`text-xs leading-relaxed ${item.isNew ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                  {item.text}
                </p>
              ))}
            </div>
            <Link to="/news" className="flex items-center gap-1 text-xs text-accent font-medium mt-4 hover:underline">
              Alle News ansehen <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Row 3: Social Media + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Social Media Widget */}
          <div className="lg:col-span-4 glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">imondu Social</h2>
            </div>
            <div className="space-y-3">
              {/* Instagram */}
              <a href="https://www.instagram.com/imondu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-400/10 border border-pink-500/15 hover:border-pink-500/30 transition-all group">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pink-500 via-purple-600 to-orange-400 flex items-center justify-center shrink-0">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-pink-600 transition-colors">@imondu</p>
                  <p className="text-[11px] text-muted-foreground">Neueste Posts & Stories</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-pink-500 transition-colors" />
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/imondu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-blue-600/5 border border-blue-600/15 hover:border-blue-600/30 transition-all group">
                <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-blue-600 transition-colors">imondu GmbH</p>
                  <p className="text-[11px] text-muted-foreground">Updates & Beiträge</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
              </a>
              {/* Embedded placeholder */}
              <div className="rounded-lg bg-muted/50 border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground">📸 Neuester Instagram-Beitrag</p>
                <div className="mt-2 h-28 rounded-md bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-orange-400/10 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Feed wird geladen…</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-4 content-start">
            <Link
              to="/leads"
              className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 group"
            >
              <div className="h-12 w-12 rounded-full gradient-brand flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">Kontakt anlegen</span>
            </Link>

            <Link
              to="/b2c-bestand"
              className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 group"
            >
              <div className="h-12 w-12 rounded-full gradient-brand flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">B2C Bestandskunden</span>
            </Link>

            <Link
              to="/b2b-bestand"
              className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 group"
            >
              <div className="h-12 w-12 rounded-full gradient-brand flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">B2B Bestandskunden</span>
            </Link>

            <Link
              to="/teampartner"
              className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 group"
            >
              <div className="h-12 w-12 rounded-full gradient-brand flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">Teampartner anlegen</span>
            </Link>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
