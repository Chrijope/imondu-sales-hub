import { Link } from "react-router-dom";
import CRMLayout from "@/components/CRMLayout";
import { SAMPLE_LEADS } from "@/data/crm-data";
import { Badge } from "@/components/ui/badge";
import { Euro, TrendingUp, Building2, Briefcase, FileCheck, Info, Download, Settings, ExternalLink, GraduationCap, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  B2C_STAFFEL, B2B_STAFFEL, B2B_MITGLIEDSCHAFT_PREIS, B2C_QUARTALSBONUS, B2C_QUARTALSBONUS_SCHWELLE,
  KARRIERESTUFEN, getB2CStufe, getB2BStufe,
} from "@/data/karriereplan";

const abrechnungsHistorie = [
  { monat: "Februar 2026", b2cAnzahl: 8, b2bAnzahl: 3, b2cProvRate: 10, b2bProvRate: 25, b2cProv: 80, b2bProv: 937.5, status: "ausstehend", gutschriftNr: "GS-2026-02-0041", auszahlungsDatum: null },
  { monat: "Januar 2026", b2cAnzahl: 6, b2bAnzahl: 4, b2cProvRate: 10, b2bProvRate: 25, b2cProv: 60, b2bProv: 1250, status: "ausgezahlt", gutschriftNr: "GS-2026-01-0041", auszahlungsDatum: "15.01.2026" },
  { monat: "Dezember 2025", b2cAnzahl: 7, b2bAnzahl: 2, b2cProvRate: 10, b2bProvRate: 25, b2cProv: 70, b2bProv: 625, status: "ausgezahlt", gutschriftNr: "GS-2025-12-0041", auszahlungsDatum: "15.12.2025" },
  { monat: "November 2025", b2cAnzahl: 4, b2bAnzahl: 3, b2cProvRate: 10, b2bProvRate: 25, b2cProv: 40, b2bProv: 937.5, status: "ausgezahlt", gutschriftNr: "GS-2025-11-0041", auszahlungsDatum: "15.11.2025" },
  { monat: "Oktober 2025", b2cAnzahl: 5, b2bAnzahl: 2, b2cProvRate: 10, b2bProvRate: 25, b2cProv: 50, b2bProv: 625, status: "ausgezahlt", gutschriftNr: "GS-2025-10-0041", auszahlungsDatum: "15.10.2025" },
];

const monthlyChartData = [
  { monat: "Mär 25", b2c: 30, b2b: 312.5 },
  { monat: "Apr 25", b2c: 40, b2b: 625 },
  { monat: "Mai 25", b2c: 20, b2b: 312.5 },
  { monat: "Jun 25", b2c: 50, b2b: 625 },
  { monat: "Jul 25", b2c: 60, b2b: 937.5 },
  { monat: "Aug 25", b2c: 40, b2b: 625 },
  { monat: "Sep 25", b2c: 30, b2b: 312.5 },
  { monat: "Okt 25", b2c: 50, b2b: 625 },
  { monat: "Nov 25", b2c: 40, b2b: 937.5 },
  { monat: "Dez 25", b2c: 70, b2b: 625 },
  { monat: "Jan 26", b2c: 60, b2b: 1250 },
  { monat: "Feb 26", b2c: 80, b2b: 937.5 },
];

// Demo values
const MY_B2C_INSERATE_QUARTAL = 82;
const MY_B2B_MONATSUMSATZ = 3750;

export default function Abrechnungen() {
  const b2cLeads = SAMPLE_LEADS.filter((l) => l.type === "b2c");
  const b2bLeads = SAMPLE_LEADS.filter((l) => l.type === "b2b");
  const b2cBestand = b2cLeads.filter((l) => l.status === "b2c_inserat").length;
  const b2bBestand = b2bLeads.filter((l) => l.status === "b2b_won").length;

  const currentB2CStufe = getB2CStufe(MY_B2C_INSERATE_QUARTAL);
  const currentB2BStufe = getB2BStufe(MY_B2B_MONATSUMSATZ);

  const b2cProvisionAktuell = b2cBestand * currentB2CStufe.provision;
  const b2bProvisionAktuell = b2bBestand * (B2B_MITGLIEDSCHAFT_PREIS * (currentB2BStufe.provision / 100));
  const gesamtProvision = b2cProvisionAktuell + b2bProvisionAktuell;

  const b2cPotenzial = b2cLeads.length * currentB2CStufe.provision;
  const b2bPotenzial = b2bLeads.length * (B2B_MITGLIEDSCHAFT_PREIS * (currentB2BStufe.provision / 100));
  const gesamtPotenzial = b2cPotenzial + b2bPotenzial;

  const b2bBestandsprovisionJahr = b2bBestand * (B2B_MITGLIEDSCHAFT_PREIS * (currentB2BStufe.provision / 100));

  const gesamtJahr = monthlyChartData.reduce((s, m) => s + m.b2c + m.b2b, 0);

  // Mehrverdienst: what you'd earn at next tier
  const nextB2CStufe = B2C_STAFFEL.find(s => s.provision > currentB2CStufe.provision);
  const nextB2BStufe = B2B_STAFFEL.find(s => s.provision > currentB2BStufe.provision);
  const b2cMehrverdienst = nextB2CStufe ? (nextB2CStufe.provision - currentB2CStufe.provision) * b2cBestand : 0;
  const b2bMehrverdienst = nextB2BStufe ? ((nextB2BStufe.provision - currentB2BStufe.provision) / 100) * B2B_MITGLIEDSCHAFT_PREIS * b2bBestand : 0;

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in min-h-screen dashboard-mesh-bg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-1 rounded-full gradient-brand" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Abrechnungen</h1>
          <p className="text-sm text-muted-foreground mt-1">Provisionsübersicht, Karriereplan und Abrechnungspotenzial</p>
        </div>

        {/* Gutschrift-Hinweis */}
        <div className="gradient-brand-subtle border border-primary/15 rounded-xl p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg gradient-brand flex items-center justify-center shrink-0">
            <FileCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-display font-semibold text-foreground mb-1">Auszahlung per Gutschrift</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deine Provisionen werden von Imondu als <strong className="text-foreground">Gutschriften</strong> ausgestellt und direkt an dich ausgezahlt.
              Du musst <strong className="text-foreground">keine eigene Rechnung</strong> schreiben – die Gutschrift ersetzt die Rechnung und wird dir automatisch als PDF bereitgestellt.
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5 text-primary" />
              <span>Stelle sicher, dass deine Stammdaten und Steuernummer in den <strong className="text-foreground">Einstellungen</strong> hinterlegt sind.</span>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Aktuelle Provision</span>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{gesamtProvision.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</p>
            <p className="text-xs text-muted-foreground mt-1">Aus {b2cBestand + b2bBestand} Bestandskunden</p>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Potenzial gesamt</span>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{gesamtPotenzial.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</p>
            <p className="text-xs text-muted-foreground mt-1">Wenn alle {b2cLeads.length + b2bLeads.length} Leads konvertieren</p>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">B2B Bestandsprov. / Jahr</span>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-display font-bold text-b2b">{b2bBestandsprovisionJahr.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</p>
            <p className="text-xs text-muted-foreground mt-1">Wiederkehrend aus {b2bBestand} Partnern ({currentB2BStufe.provision} %)</p>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">B2C Inserat-Provision</span>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-display font-bold text-b2c">{b2cProvisionAktuell.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</p>
            <p className="text-xs text-muted-foreground mt-1">Aus {b2cBestand} Inseraten à {currentB2CStufe.provision} € netto</p>
          </div>
        </div>

        {/* Deine aktuelle Provisionsstufe + Mehrverdienst */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-display font-semibold text-foreground">Deine aktuelle Provisionsstufe & Mehrverdienst</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* B2C Stufe */}
            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">B2C – Eigentümer</h3>
                </div>
                <Badge className="gradient-brand border-0 text-white text-[9px]">{currentB2CStufe.provision} € / Inserat</Badge>
              </div>
              <table className="w-full text-xs mb-3">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-1.5 text-muted-foreground font-medium">Stufe</th>
                    <th className="text-right py-1.5 text-muted-foreground font-medium">Provision</th>
                    <th className="text-right py-1.5 text-muted-foreground font-medium">Mehrverdienst*</th>
                  </tr>
                </thead>
                <tbody>
                  {B2C_STAFFEL.map((s, i) => {
                    const isCurrent = s.provision === currentB2CStufe.provision;
                    const mehrVsAktuell = (s.provision - currentB2CStufe.provision) * b2cBestand;
                    return (
                      <tr key={i} className={`border-b border-border/40 ${isCurrent ? "bg-primary/5" : ""}`}>
                        <td className="py-2 font-medium text-foreground">
                          {s.max ? `${s.min}–${s.max}` : `ab ${s.min}`} Ins./Q.
                          {isCurrent && <Badge className="ml-1.5 gradient-brand border-0 text-white text-[8px] px-1.5 py-0">Aktuell</Badge>}
                        </td>
                        <td className="py-2 text-right font-bold text-foreground">{s.provision.toLocaleString("de-DE")} €</td>
                        <td className="py-2 text-right font-semibold">
                          {mehrVsAktuell > 0 ? (
                            <span className="text-primary flex items-center justify-end gap-0.5">
                              <ArrowUpRight className="h-3 w-3" />+{mehrVsAktuell.toLocaleString("de-DE")} €
                            </span>
                          ) : isCurrent ? (
                            <span className="text-muted-foreground">—</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-[10px] text-muted-foreground">* Mehrverdienst vs. aktuelle Stufe bei {b2cBestand} Inseraten</p>
              {nextB2CStufe && (
                <div className="mt-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-[11px] text-foreground">
                    <strong>Nächste Stufe:</strong> Ab {nextB2CStufe.min} Ins./Quartal → <strong>{nextB2CStufe.provision} €</strong> (+{b2cMehrverdienst.toLocaleString("de-DE")} € Mehrverdienst)
                  </p>
                </div>
              )}
            </div>

            {/* B2B Stufe */}
            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">B2B – Entwickler</h3>
                </div>
                <Badge className="gradient-brand border-0 text-white text-[9px]">{currentB2BStufe.provision} % Provision</Badge>
              </div>
              <table className="w-full text-xs mb-3">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-1.5 text-muted-foreground font-medium">Monatsumsatz</th>
                    <th className="text-right py-1.5 text-muted-foreground font-medium">Provision</th>
                    <th className="text-right py-1.5 text-muted-foreground font-medium">Mehrverdienst*</th>
                  </tr>
                </thead>
                <tbody>
                  {B2B_STAFFEL.map((s, i) => {
                    const isCurrent = s.provision === currentB2BStufe.provision;
                    const mehrVsAktuell = ((s.provision - currentB2BStufe.provision) / 100) * B2B_MITGLIEDSCHAFT_PREIS * b2bBestand;
                    return (
                      <tr key={i} className={`border-b border-border/40 ${isCurrent ? "bg-primary/5" : ""}`}>
                        <td className="py-2 font-medium text-foreground">
                          {s.max ? `${s.min.toLocaleString("de-DE")}–${s.max.toLocaleString("de-DE")} €` : `ab ${s.min.toLocaleString("de-DE")} €`}
                          {isCurrent && <Badge className="ml-1.5 gradient-brand border-0 text-white text-[8px] px-1.5 py-0">Aktuell</Badge>}
                        </td>
                        <td className="py-2 text-right font-bold text-foreground">{s.provision} %</td>
                        <td className="py-2 text-right font-semibold">
                          {mehrVsAktuell > 0 ? (
                            <span className="text-primary flex items-center justify-end gap-0.5">
                              <ArrowUpRight className="h-3 w-3" />+{mehrVsAktuell.toLocaleString("de-DE")} €
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-[10px] text-muted-foreground">* Mehrverdienst vs. aktuelle Stufe bei {b2bBestand} Mitgliedern × {B2B_MITGLIEDSCHAFT_PREIS.toLocaleString("de-DE")} €</p>
              {nextB2BStufe && (
                <div className="mt-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-[11px] text-foreground">
                    <strong>Nächste Stufe:</strong> Ab {nextB2BStufe.min.toLocaleString("de-DE")} € Umsatz/Monat → <strong>{nextB2BStufe.provision} %</strong> (+{b2bMehrverdienst.toLocaleString("de-DE")} € Mehrverdienst)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Karrierestufen-Übersicht */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-display font-semibold text-foreground">Karrierestufen – Dein Aufstieg</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {KARRIERESTUFEN.map((stufe, i) => {
              const isActive = i === 0;
              return (
                <div
                  key={stufe.id}
                  className={`rounded-xl p-4 border transition-all relative ${
                    isActive
                      ? "border-primary/40 bg-primary/5 shadow-crm-sm ring-2 ring-primary/20"
                      : "border-border bg-muted/20"
                  }`}
                >
                  {isActive && (
                    <Badge className="absolute -top-2 left-4 gradient-brand border-0 text-white text-[8px] px-2 py-0">Deine Stufe</Badge>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{stufe.icon}</span>
                    <p className="text-sm font-bold text-foreground">{stufe.title}</p>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">B2C</span><span className="font-semibold text-foreground">{stufe.b2cMin}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">B2B</span><span className="font-semibold text-foreground">{stufe.b2bRange}</span></div>
                    {stufe.overrideTeam && <div className="flex justify-between"><span className="text-muted-foreground">Team-Override</span><span className="font-semibold text-primary">{stufe.overrideTeam}</span></div>}
                  </div>
                  <div className="border-t border-border mt-3 pt-2">
                    {stufe.vorteile.slice(0, 3).map((v, vi) => (
                      <p key={vi} className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <CheckCircle2 className={`h-3 w-3 mt-0.5 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />{v}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Jahresübersicht Chart */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-display font-semibold text-foreground">Provisionsentwicklung (12 Monate)</h2>
            </div>
            <Badge variant="secondary" className="text-[10px]">Gesamt: {gesamtJahr.toLocaleString("de-DE")} €</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyChartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="monat" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v} €`} />
              <Tooltip
                formatter={(value: number, name: string) => [`${value.toLocaleString("de-DE")} €`, name === "b2c" ? "B2C Provision" : "B2B Provision"]}
                labelStyle={{ fontWeight: 600 }}
                contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }}
              />
              <Legend formatter={(v) => (v === "b2c" ? "B2C Provision" : "B2B Provision")} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="b2c" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="b2b" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Steuerdaten */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-display font-semibold text-foreground">Steuerdaten für Gutschriften</h2>
            </div>
            <Link to="/einstellungen" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
              <Settings className="h-3.5 w-3.5" />In Einstellungen bearbeiten<ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-muted/40 rounded-lg p-4 border border-border">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">USt-ID</p>
              <p className="text-sm font-semibold text-foreground">DE123456789</p>
            </div>
            <div className="bg-muted/40 rounded-lg p-4 border border-border">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Steuernummer</p>
              <p className="text-sm font-semibold text-foreground">12/345/67890</p>
            </div>
            <div className="bg-muted/40 rounded-lg p-4 border border-border">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Finanzamt</p>
              <p className="text-sm font-semibold text-foreground">FA Berlin Mitte</p>
            </div>
            <div className="bg-muted/40 rounded-lg p-4 border border-border">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">IBAN</p>
              <p className="text-sm font-semibold text-foreground">DE89 •••• •••• •••• 1234</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-primary shrink-0" />
            Diese Daten werden für die Erstellung deiner Gutschriften verwendet. Änderungen kannst du in den <Link to="/einstellungen" className="text-primary font-medium hover:underline">Einstellungen</Link> vornehmen.
          </p>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-1 rounded-full bg-primary" />
              <h2 className="text-sm font-semibold text-foreground">B2C – Eigentümer</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Leads gesamt</span>
                <span className="text-sm font-semibold text-foreground">{b2cLeads.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Davon Bestandskunden (Inserat aktiv)</span>
                <span className="text-sm font-semibold text-foreground">{b2cBestand}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Aktuelle Provisionsstufe</span>
                <span className="text-sm font-semibold text-foreground">{currentB2CStufe.provision.toLocaleString("de-DE")} € netto / Inserat</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Inserate dieses Quartal</span>
                <span className="text-sm font-semibold text-foreground">{MY_B2C_INSERATE_QUARTAL}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Aktuelle Provision</span>
                <span className="text-sm font-bold text-b2c">{b2cProvisionAktuell.toLocaleString("de-DE")} €</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-muted/50 rounded-lg px-3">
                <span className="text-sm font-medium text-foreground">Abrechnungspotenzial</span>
                <span className="text-sm font-bold text-foreground">{b2cPotenzial.toLocaleString("de-DE")} €</span>
              </div>
              <p className="text-xs text-muted-foreground">Eigentümer inserieren kostenlos – du erhältst {currentB2CStufe.provision} € netto pro qualifiziertem Inserat</p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-1 rounded-full bg-accent" />
              <h2 className="text-sm font-semibold text-foreground">B2B – Entwicklungspartner</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Leads gesamt</span>
                <span className="text-sm font-semibold text-foreground">{b2bLeads.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Davon aktive Mitglieder</span>
                <span className="text-sm font-semibold text-foreground">{b2bBestand}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Mitgliedschaft / Jahr</span>
                <span className="text-sm font-semibold text-foreground">{B2B_MITGLIEDSCHAFT_PREIS.toLocaleString("de-DE")} € netto</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Aktuelle Provisionsstufe</span>
                <span className="text-sm font-semibold text-foreground">{currentB2BStufe.provision} %</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Provision pro Mitgliedschaft</span>
                <span className="text-sm font-semibold text-foreground">{(B2B_MITGLIEDSCHAFT_PREIS * (currentB2BStufe.provision / 100)).toLocaleString("de-DE")} € netto</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Aktuelle Bestandsprovision / Jahr</span>
                <span className="text-sm font-bold text-b2b">{b2bProvisionAktuell.toLocaleString("de-DE")} €</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-muted/50 rounded-lg px-3">
                <span className="text-sm font-medium text-foreground">Abrechnungspotenzial</span>
                <span className="text-sm font-bold text-foreground">{b2bPotenzial.toLocaleString("de-DE")} €</span>
              </div>
              <p className="text-xs text-muted-foreground">{currentB2BStufe.provision} % netto auf {B2B_MITGLIEDSCHAFT_PREIS.toLocaleString("de-DE")} € Mitgliedschaft (12 Monate, wiederkehrend)</p>
            </div>
          </div>
        </div>

        {/* Abrechnungshistorie */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-1 rounded-full gradient-brand" />
            <h2 className="text-sm font-semibold text-foreground">Abrechnungshistorie</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Monat</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">B2C Ins.</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">B2C Prov.</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">B2B Mitgl.</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">B2B Prov.</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Gesamt</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Gutschrift</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Auszahlung</th>
                  <th className="text-center py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">PDF</th>
                </tr>
              </thead>
              <tbody>
                {abrechnungsHistorie.map((row) => (
                  <tr key={row.monat} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 font-medium text-foreground">{row.monat}</td>
                    <td className="text-right py-3 text-muted-foreground">{row.b2cAnzahl}</td>
                    <td className="text-right py-3 text-b2c font-medium">{row.b2cProv.toLocaleString("de-DE")} €</td>
                    <td className="text-right py-3 text-muted-foreground">{row.b2bAnzahl}</td>
                    <td className="text-right py-3 text-b2b font-medium">{row.b2bProv.toLocaleString("de-DE")} €</td>
                    <td className="text-right py-3 font-bold text-foreground">{(row.b2cProv + row.b2bProv).toLocaleString("de-DE")} €</td>
                    <td className="text-right py-3">
                      <Badge variant={row.status === "ausgezahlt" ? "default" : "secondary"} className={row.status === "ausgezahlt" ? "bg-success text-success-foreground" : ""}>
                        {row.status === "ausgezahlt" ? "Gutschrift erteilt" : "In Bearbeitung"}
                      </Badge>
                    </td>
                    <td className="text-right py-3">
                      {row.auszahlungsDatum ? (
                        <span className="text-xs text-muted-foreground">Ausgezahlt am <span className="font-medium text-foreground">{row.auszahlungsDatum}</span></span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Ausstehend</span>
                      )}
                    </td>
                    <td className="text-center py-3">
                      {row.status === "ausgezahlt" ? (
                        <button
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                          onClick={() => {}}
                          title={`${row.gutschriftNr}.pdf herunterladen`}
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">{row.gutschriftNr}.pdf</span>
                          <span className="sm:hidden">PDF</span>
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">–</span>
                      )}
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
