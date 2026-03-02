import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CRMLayout from "@/components/CRMLayout";
import { SAMPLE_LEADS, Lead, B2C_PIPELINE_STAGES, B2B_PIPELINE_STAGES } from "@/data/crm-data";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Euro, TrendingUp, Building2, Briefcase, FileCheck, Info, Download, Settings, ExternalLink, GraduationCap, ArrowUpRight, CheckCircle2, X, Users, Eye, Search, Gift, Award, Upload, FileText } from "lucide-react";
import { BONUSES } from "@/pages/Auswertungen";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  B2C_STAFFEL, B2B_STAFFEL, B2B_MITGLIEDSCHAFT_PREIS, B2C_QUARTALSBONUS, B2C_QUARTALSBONUS_SCHWELLE,
  KARRIERESTUFEN, getB2CStufe, getB2BStufe,
} from "@/data/karriereplan";
import { useUserRole } from "@/contexts/UserRoleContext";
import { SAMPLE_USERS } from "@/data/nutzerverwaltung-data";

// ── Produktionsmonat-Logik: 20. des Monats bis 20. des Folgemonats ──
// Auszahlung: Ende des Folgemonats
function getProduktionsmonat(date: Date = new Date()): { label: string; start: string; end: string; auszahlung: string } {
  const day = date.getDate();
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();
  
  let pmMonth: number, pmYear: number;
  if (day >= 20) {
    pmMonth = month;
    pmYear = year;
  } else {
    pmMonth = month - 1;
    pmYear = year;
    if (pmMonth < 0) { pmMonth = 11; pmYear--; }
  }
  
  const mNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const nextMonth = (pmMonth + 1) % 12;
  const nextYear = pmMonth === 11 ? pmYear + 1 : pmYear;
  const auszahlungsMonat = (nextMonth + 1) % 12;
  const auszahlungsJahr = nextMonth === 11 ? nextYear + 1 : nextYear;
  
  // Last day of the auszahlungs-month
  const lastDay = new Date(nextYear, nextMonth + 1, 0).getDate();
  
  return {
    label: `${mNames[pmMonth]} ${pmYear} – ${mNames[nextMonth]} ${nextYear}`,
    start: `20.${String(pmMonth + 1).padStart(2, "0")}.${pmYear}`,
    end: `20.${String(nextMonth + 1).padStart(2, "0")}.${nextYear}`,
    auszahlung: `${lastDay}.${String(nextMonth + 1).padStart(2, "0")}.${nextYear}`,
  };
}

const AKTUELLER_PM = getProduktionsmonat();

const abrechnungsHistorie = [
  { monat: "Feb 2026 – Mär 2026", produktionszeitraum: "20.02. – 20.03.2026", b2cAnzahl: 8, b2bAnzahl: 3, b2cProvRate: 10, b2bProvRate: 25, b2cProv: 80, b2bProv: 937.5, status: "ausstehend", gutschriftNr: "GS-2026-03-0041", auszahlungsDatum: null, auszahlungGeplant: "31.03.2026" },
  { monat: "Jan 2026 – Feb 2026", produktionszeitraum: "20.01. – 20.02.2026", b2cAnzahl: 6, b2bAnzahl: 4, b2cProvRate: 10, b2bProvRate: 25, b2cProv: 60, b2bProv: 1250, status: "ausgezahlt", gutschriftNr: "GS-2026-02-0041", auszahlungsDatum: "28.02.2026", auszahlungGeplant: "28.02.2026" },
  { monat: "Dez 2025 – Jan 2026", produktionszeitraum: "20.12. – 20.01.2026", b2cAnzahl: 7, b2bAnzahl: 2, b2cProvRate: 10, b2bProvRate: 25, b2cProv: 70, b2bProv: 625, status: "ausgezahlt", gutschriftNr: "GS-2026-01-0041", auszahlungsDatum: "31.01.2026", auszahlungGeplant: "31.01.2026" },
  { monat: "Nov 2025 – Dez 2025", produktionszeitraum: "20.11. – 20.12.2025", b2cAnzahl: 4, b2bAnzahl: 3, b2cProvRate: 10, b2bProvRate: 25, b2cProv: 40, b2bProv: 937.5, status: "ausgezahlt", gutschriftNr: "GS-2025-12-0041", auszahlungsDatum: "31.12.2025", auszahlungGeplant: "31.12.2025" },
  { monat: "Okt 2025 – Nov 2025", produktionszeitraum: "20.10. – 20.11.2025", b2cAnzahl: 5, b2bAnzahl: 2, b2cProvRate: 10, b2bProvRate: 25, b2cProv: 50, b2bProv: 625, status: "ausgezahlt", gutschriftNr: "GS-2025-11-0041", auszahlungsDatum: "30.11.2025", auszahlungGeplant: "30.11.2025" },
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentRoleId } = useUserRole();
  const isAdmin = ["admin", "vertriebsleiter", "buchhaltung"].includes(currentRoleId);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<{ title: string; leads: Lead[]; type: "b2c" | "b2b" } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"alle" | "aktiv" | "inaktiv">("alle");
  // PDF upload state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadMonth, setUploadMonth] = useState("");
  const [uploadedPDFs, setUploadedPDFs] = useState<Record<string, { name: string; uploadedAt: string }>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const vertriebspartner = SAMPLE_USERS.filter((u) => u.roleId === "vertriebspartner");

  const filteredPartner = vertriebspartner.filter((vp) => {
    if (statusFilter === "aktiv" && !vp.active) return false;
    if (statusFilter === "inaktiv" && vp.active) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return vp.name.toLowerCase().includes(q) || vp.email.toLowerCase().includes(q);
    }
    return true;
  });

  // If admin view and a partner is selected, show their individual view
  // Otherwise show overview for admins, or personal view for VP
  if (isAdmin && !selectedPartner) {
    return (
      <CRMLayout>
        <div className="p-6 lg:p-8 space-y-6 animate-fade-in min-h-screen dashboard-mesh-bg">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-1 rounded-full gradient-brand" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">Abrechnungen – Gesamtübersicht</h1>
            <p className="text-sm text-muted-foreground mt-1">Alle Vertriebspartner und ihre Provisionen</p>
          </div>

          {/* KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Vertriebspartner</span>
              <p className="text-2xl font-display font-bold text-foreground mt-2">{vertriebspartner.length}</p>
              <p className="text-xs text-muted-foreground mt-1">{vertriebspartner.filter(u => u.active).length} aktiv</p>
            </div>
            <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Gesamtprovision (Monat)</span>
              <p className="text-2xl font-display font-bold text-foreground mt-2">
                {(vertriebspartner.length * 1_017.5).toLocaleString("de-DE")} €
              </p>
              <p className="text-xs text-muted-foreground mt-1">B2C + B2B kombiniert</p>
            </div>
            <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ø Provision / Partner</span>
              <p className="text-2xl font-display font-bold text-foreground mt-2">1.017,50 €</p>
              <p className="text-xs text-muted-foreground mt-1">Durchschnitt aktueller Monat</p>
            </div>
            <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ausstehende Gutschriften</span>
              <p className="text-2xl font-display font-bold text-foreground mt-2">{vertriebspartner.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Produktionsmonat {AKTUELLER_PM.start} – {AKTUELLER_PM.end}</p>
              <p className="text-[10px] text-primary mt-0.5">Auszahlung: {AKTUELLER_PM.auszahlung}</p>
            </div>
          </div>

          {/* Partner Table */}
           <div className="bg-card rounded-xl border border-border shadow-crm-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Vertriebspartner Übersicht</h2>
                <Badge variant="secondary" className="text-[10px]">{filteredPartner.length} von {vertriebspartner.length}</Badge>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-[10px] text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border">
                  Produktionsmonat: <strong className="text-foreground">{AKTUELLER_PM.start} – {AKTUELLER_PM.end}</strong> · Auszahlung: <strong className="text-primary">{AKTUELLER_PM.auszahlung}</strong>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Partner suchen…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-[200px] text-sm"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "alle" | "aktiv" | "inaktiv")}>
                  <SelectTrigger className="h-8 w-[120px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle Status</SelectItem>
                    <SelectItem value="aktiv">Nur Aktive</SelectItem>
                    <SelectItem value="inaktiv">Nur Inaktive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Partner</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-muted-foreground">Karrierestufe</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">B2C Prov.</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">B2B Prov.</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Gesamt</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Potenzial</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-muted-foreground">Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPartner.map((vp, i) => {
                    // Demo: assign different career levels
                    const karriereIdx = i % KARRIERESTUFEN.length;
                    const karriere = KARRIERESTUFEN[karriereIdx];
                    const demoB2C = [80, 120, 50, 60][i % 4];
                    const demoB2B = [937.5, 625, 312.5, 1250][i % 4];
                    const total = demoB2C + demoB2B;
                    const potenzial = total * 1.8;
                    return (
                      <tr key={vp.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{vp.avatar}</div>
                            <div>
                              <p className="font-medium text-foreground text-sm">{vp.name}</p>
                              <p className="text-[10px] text-muted-foreground">{vp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="outline" className="text-[10px]">{karriere.icon} {karriere.title}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={vp.active ? "default" : "secondary"} className={vp.active ? "bg-success text-success-foreground text-[10px]" : "text-[10px]"}>
                            {vp.active ? "Aktiv" : "Inaktiv"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-foreground">{demoB2C.toLocaleString("de-DE")} €</td>
                        <td className="px-4 py-3 text-right font-medium text-foreground">{demoB2B.toLocaleString("de-DE")} €</td>
                        <td className="px-4 py-3 text-right font-bold text-foreground">{total.toLocaleString("de-DE")} €</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{potenzial.toLocaleString("de-DE")} €</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSelectedPartner(vp.id)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/40 border-t-2 border-border">
                    <td className="px-4 py-3 font-bold text-foreground" colSpan={3}>Gesamt ({filteredPartner.length} Partner)</td>
                    <td className="px-4 py-3 text-right font-bold text-foreground">
                      {filteredPartner.reduce((s, _, i) => s + [80, 120, 50, 60][i % 4], 0).toLocaleString("de-DE")} €
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-foreground">
                      {filteredPartner.reduce((s, _, i) => s + [937.5, 625, 312.5, 1250][i % 4], 0).toLocaleString("de-DE")} €
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-lg text-foreground">
                      {filteredPartner.reduce((s, _, i) => s + [80, 120, 50, 60][i % 4] + [937.5, 625, 312.5, 1250][i % 4], 0).toLocaleString("de-DE")} €
                    </td>
                    <td className="px-4 py-3" colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            {filteredPartner.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Keine Vertriebspartner gefunden. Passe deine Suche oder Filter an.
              </div>
            )}
          </div>
        </div>
      </CRMLayout>
    );
  }

  // If admin selected a partner, show back button
  const selectedVP = selectedPartner ? vertriebspartner.find(u => u.id === selectedPartner) : null;

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
          {isAdmin && selectedVP ? (
            <>
              <button onClick={() => setSelectedPartner(null)} className="text-xs text-primary hover:underline mb-2 flex items-center gap-1">
                ← Zurück zur Gesamtübersicht
              </button>
              <h1 className="text-2xl font-display font-bold text-foreground">Abrechnung – {selectedVP.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">Provisionsübersicht und Abrechnungsdetails</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-display font-bold text-foreground">Abrechnungen</h1>
              <p className="text-sm text-muted-foreground mt-1">Provisionsübersicht, Karriereplan und Abrechnungspotenzial</p>
            </>
          )}
        </div>

        {/* Gutschrift-Hinweis + Produktionsmonat */}
        <div className="gradient-brand-subtle border border-primary/15 rounded-xl p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg gradient-brand flex items-center justify-center shrink-0">
            <FileCheck className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-display font-semibold text-foreground mb-1">Auszahlung per Gutschrift</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deine Provisionen werden von Imondu als <strong className="text-foreground">Gutschriften</strong> ausgestellt und direkt an dich ausgezahlt.
              Du musst <strong className="text-foreground">keine eigene Rechnung</strong> schreiben – die Gutschrift ersetzt die Rechnung und wird dir automatisch als PDF bereitgestellt.
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-card/60 rounded-lg p-3 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Aktueller Produktionsmonat</p>
                <p className="text-sm font-semibold text-foreground">{AKTUELLER_PM.start} – {AKTUELLER_PM.end}</p>
              </div>
              <div className="bg-card/60 rounded-lg p-3 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Abrechnungszeitraum</p>
                <p className="text-sm font-semibold text-foreground">20. bis 20. des Folgemonats</p>
              </div>
              <div className="bg-card/60 rounded-lg p-3 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Nächste Auszahlung</p>
                <p className="text-sm font-semibold text-primary">{AKTUELLER_PM.auszahlung}</p>
              </div>
            </div>
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

        {/* Gutschrift aktueller Monat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-1 rounded-full bg-primary" />
              <h2 className="text-sm font-semibold text-foreground">B2C – Gutschrift aktueller Monat</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Inserierte Inserate (abrechenbar)</span>
                <button
                  onClick={() => setDetailModal({ title: "Inserierte Inserate – abrechenbar", leads: b2cLeads.filter(l => l.status === "b2c_inserat"), type: "b2c" })}
                  className="text-sm font-semibold text-primary hover:underline cursor-pointer"
                >
                  {b2cBestand}
                </button>
              </div>
              <div className="flex justify-between items-center py-2 bg-muted/50 rounded-lg px-3">
                <span className="text-sm font-medium text-foreground">Gutschriftbetrag B2C</span>
                <span className="text-sm font-bold text-foreground">{b2cProvisionAktuell.toLocaleString("de-DE")} €</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-1 rounded-full bg-accent" />
              <h2 className="text-sm font-semibold text-foreground">B2B – Gutschrift aktueller Monat</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Neue Mitgliedschaften (Gewonnen)</span>
                <button
                  onClick={() => setDetailModal({ title: "Neue Mitgliedschaften – Gewonnen", leads: b2bLeads.filter(l => l.status === "b2b_won"), type: "b2b" })}
                  className="text-sm font-semibold text-primary hover:underline cursor-pointer"
                >
                  {b2bBestand}
                </button>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Bestandsprovision (Verlängerungen)</span>
                <button
                  onClick={() => setDetailModal({ title: "Bestandskunden – Verlängerte Mitgliedschaften", leads: [], type: "b2b" })}
                  className="text-sm font-semibold text-primary hover:underline cursor-pointer"
                >
                  0
                </button>
              </div>
              <div className="flex justify-between items-center py-2 bg-muted/50 rounded-lg px-3">
                <span className="text-sm font-medium text-foreground">Gutschriftbetrag B2B</span>
                <span className="text-sm font-bold text-foreground">{b2bProvisionAktuell.toLocaleString("de-DE")} €</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Inserat-Bonus Meilensteine in Abrechnung ── */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-display font-semibold text-foreground">Verdiente Inserat-Boni</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Meilenstein</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Bonus</th>
                  <th className="text-center py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {BONUSES.map((b) => (
                  <tr key={b.target} className={`border-b border-border/40 ${b.reached ? "" : "opacity-40"}`}>
                    <td className="py-2.5 font-medium text-foreground flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 text-primary" />
                      {b.label}
                    </td>
                    <td className="py-2.5 text-right font-bold text-primary">+{b.reward} €</td>
                    <td className="py-2.5 text-center">
                      {b.reached ? (
                        <Badge className="bg-success text-success-foreground text-[9px]">
                          <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" /> Gutgeschrieben
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[9px]">Ausstehend</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/40 border-t-2 border-border">
                  <td className="py-2.5 font-bold text-foreground">Gesamt verdiente Boni</td>
                  <td className="py-2.5 text-right font-bold text-primary text-lg">
                    +{BONUSES.filter(b => b.reached).reduce((s, b) => s + b.reward, 0)} €
                  </td>
                  <td className="py-2.5 text-center">
                    <span className="text-xs text-muted-foreground">{BONUSES.filter(b => b.reached).length}/{BONUSES.length} erreicht</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Abrechnungshistorie */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-1 rounded-full gradient-brand" />
            <h2 className="text-sm font-semibold text-foreground">Abrechnungshistorie</h2>
            {isAdmin && (
              <Button
                size="sm"
                variant="outline"
                className="ml-auto h-7 text-[10px] gap-1 border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => { setUploadDialogOpen(true); setUploadMonth(""); setSelectedFile(null); }}
              >
                <Upload className="h-3 w-3" /> PDF hochladen
              </Button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Produktionsmonat</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Zeitraum</th>
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
                    <td className="py-3 font-medium text-foreground text-xs">{row.monat}</td>
                    <td className="py-3 text-xs text-muted-foreground">{row.produktionszeitraum}</td>
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
                        <span className="text-xs text-muted-foreground">Geplant: <span className="font-medium text-primary">{row.auszahlungGeplant}</span></span>
                      )}
                    </td>
                    <td className="text-center py-3">
                      <div className="flex items-center justify-center gap-2">
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
                        {uploadedPDFs[row.monat] && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-success font-medium" title={`Hochgeladen: ${uploadedPDFs[row.monat].name}`}>
                            <FileText className="h-3 w-3" /> {uploadedPDFs[row.monat].name}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {detailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDetailModal(null)}>
            <div className="bg-card rounded-xl shadow-crm-md border border-border w-full max-w-lg max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">{detailModal.title}</h3>
                <button onClick={() => setDetailModal(null)} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[60vh]">
                {detailModal.leads.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">Keine Einträge vorhanden.</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">{detailModal.type === "b2c" ? "Objekttyp" : "Gewerk"}</th>
                        <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Provision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailModal.leads.map((lead) => {
                        const stages = lead.type === "b2c" ? B2C_PIPELINE_STAGES : B2B_PIPELINE_STAGES;
                        const stage = stages.find(s => s.id === lead.status);
                        const displayName = lead.type === "b2c" ? `${lead.firstName} ${lead.lastName}` : lead.companyName;
                        const detail = lead.type === "b2c" ? lead.objekttyp : lead.gewerk;
                        const prov = lead.type === "b2c" ? `${currentB2CStufe.provision} €` : `${(B2B_MITGLIEDSCHAFT_PREIS * (currentB2BStufe.provision / 100)).toLocaleString("de-DE")} €`;
                        return (
                          <tr
                            key={lead.id}
                            className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                            onClick={() => { setDetailModal(null); navigate(`/lead/${lead.id}`); }}
                          >
                            <td className="px-4 py-2.5 font-medium text-foreground">{displayName}</td>
                            <td className="px-4 py-2.5">
                              <span className="inline-flex items-center gap-1.5 text-xs">
                                <span className="h-2 w-2 rounded-full bg-warning" />
                                <span className="text-warning font-medium">{stage?.name}</span>
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-muted-foreground">{detail || "–"}</td>
                            <td className="px-4 py-2.5 text-right font-semibold text-foreground">{prov}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="p-3 border-t border-border bg-muted/20 text-center">
                <span className="text-xs text-muted-foreground">{detailModal.leads.length} Einträge · Klicke auf einen Eintrag für Details</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PDF Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              Gutschrift-PDF hochladen
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Abrechnungsmonat *</Label>
              <Select value={uploadMonth} onValueChange={setUploadMonth}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Monat wählen…" /></SelectTrigger>
                <SelectContent>
                  {abrechnungsHistorie.map((row) => (
                    <SelectItem key={row.monat} value={row.monat}>{row.monat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">PDF-Datei *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/40 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  id="pdf-upload"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">Klicke hier oder ziehe eine PDF-Datei hierher</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Abbrechen</Button>
            <Button
              className="gradient-brand border-0 text-white"
              disabled={!uploadMonth || !selectedFile}
              onClick={() => {
                if (!uploadMonth || !selectedFile) return;
                setUploadedPDFs(prev => ({
                  ...prev,
                  [uploadMonth]: { name: selectedFile.name, uploadedAt: new Date().toLocaleDateString("de-DE") },
                }));
                toast({ title: "PDF hochgeladen ✓", description: `${selectedFile.name} wurde für ${uploadMonth} hinterlegt.` });
                setUploadDialogOpen(false);
              }}
            >
              <Upload className="h-4 w-4 mr-1.5" /> Hochladen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CRMLayout>
  );
}
