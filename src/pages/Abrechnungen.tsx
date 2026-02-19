import CRMLayout from "@/components/CRMLayout";
import { SAMPLE_LEADS } from "@/data/crm-data";
import { Badge } from "@/components/ui/badge";
import { Euro, TrendingUp, Building2, Briefcase } from "lucide-react";

const B2C_PROVISION_PER_INSERAT = 10; // €
const B2B_MITGLIEDSCHAFT = 1250; // €
const B2B_PROVISION_RATE = 0.25; // 25%
const B2B_PROVISION = B2B_MITGLIEDSCHAFT * B2B_PROVISION_RATE; // 312,50€

const abrechnungsHistorie = [
  { monat: "Februar 2026", b2cAnzahl: 8, b2bAnzahl: 3, b2cProv: 80, b2bProv: 937.5, status: "ausstehend" },
  { monat: "Januar 2026", b2cAnzahl: 6, b2bAnzahl: 4, b2cProv: 60, b2bProv: 1250, status: "ausgezahlt" },
  { monat: "Dezember 2025", b2cAnzahl: 7, b2bAnzahl: 2, b2cProv: 70, b2bProv: 625, status: "ausgezahlt" },
  { monat: "November 2025", b2cAnzahl: 4, b2bAnzahl: 3, b2cProv: 40, b2bProv: 937.5, status: "ausgezahlt" },
  { monat: "Oktober 2025", b2cAnzahl: 5, b2bAnzahl: 2, b2cProv: 50, b2bProv: 625, status: "ausgezahlt" },
];

export default function Abrechnungen() {
  const b2cLeads = SAMPLE_LEADS.filter((l) => l.type === "b2c");
  const b2bLeads = SAMPLE_LEADS.filter((l) => l.type === "b2b");
  const b2cBestand = b2cLeads.filter((l) => l.status === "won").length;
  const b2bBestand = b2bLeads.filter((l) => l.status === "won").length;

  const b2cProvisionAktuell = b2cBestand * B2C_PROVISION_PER_INSERAT;
  const b2bProvisionAktuell = b2bBestand * B2B_PROVISION;
  const gesamtProvision = b2cProvisionAktuell + b2bProvisionAktuell;

  const b2cPotenzial = b2cLeads.length * B2C_PROVISION_PER_INSERAT;
  const b2bPotenzial = b2bLeads.length * B2B_PROVISION;
  const gesamtPotenzial = b2cPotenzial + b2bPotenzial;

  // Bestandsprovisionen (jährlich wiederkehrend B2B)
  const b2bBestandsprovisionJahr = b2bBestand * B2B_PROVISION;

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-1 rounded-full gradient-brand" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Abrechnungen</h1>
          <p className="text-sm text-muted-foreground mt-1">Provisionsübersicht und Abrechnungspotenzial</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Aktuelle Provision</span>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{gesamtProvision.toLocaleString("de-DE")} €</p>
            <p className="text-xs text-muted-foreground mt-1">Aus {b2cBestand + b2bBestand} Bestandskunden</p>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Potenzial gesamt</span>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{gesamtPotenzial.toLocaleString("de-DE")} €</p>
            <p className="text-xs text-muted-foreground mt-1">Wenn alle {b2cLeads.length + b2bLeads.length} Leads konvertieren</p>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">B2B Bestandsprov. / Jahr</span>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-display font-bold text-b2b">{b2bBestandsprovisionJahr.toLocaleString("de-DE")} €</p>
            <p className="text-xs text-muted-foreground mt-1">Wiederkehrend aus {b2bBestand} Partnern</p>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">B2C Inserat-Provision</span>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-display font-bold text-b2c">{b2cProvisionAktuell.toLocaleString("de-DE")} €</p>
            <p className="text-xs text-muted-foreground mt-1">Aus {b2cBestand} Inseraten à 10 € netto</p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* B2C */}
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
                <span className="text-sm text-muted-foreground">Provision pro Inserat</span>
                <span className="text-sm font-semibold text-foreground">10,00 € netto</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Aktuelle Provision</span>
                <span className="text-sm font-bold text-b2c">{b2cProvisionAktuell.toLocaleString("de-DE")} €</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-muted/50 rounded-lg px-3">
                <span className="text-sm font-medium text-foreground">Abrechnungspotenzial</span>
                <span className="text-sm font-bold text-foreground">{b2cPotenzial.toLocaleString("de-DE")} €</span>
              </div>
              <p className="text-xs text-muted-foreground">Berechnung: {b2cLeads.length} Leads × 1 Inserat × 10 € netto</p>
            </div>
          </div>

          {/* B2B */}
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
                <span className="text-sm font-semibold text-foreground">1.250,00 € netto</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Deine Provision (25%)</span>
                <span className="text-sm font-semibold text-foreground">312,50 € netto</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Aktuelle Bestandsprovision / Jahr</span>
                <span className="text-sm font-bold text-b2b">{b2bProvisionAktuell.toLocaleString("de-DE")} €</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-muted/50 rounded-lg px-3">
                <span className="text-sm font-medium text-foreground">Abrechnungspotenzial</span>
                <span className="text-sm font-bold text-foreground">{b2bPotenzial.toLocaleString("de-DE")} €</span>
              </div>
              <p className="text-xs text-muted-foreground">Berechnung: {b2bLeads.length} Leads × 1.250 € × 25% = {b2bPotenzial.toLocaleString("de-DE")} € jährlich wiederkehrend</p>
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
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">B2C Inserate</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">B2C Prov.</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">B2B Mitgl.</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">B2B Prov.</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Gesamt</th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
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
                        {row.status === "ausgezahlt" ? "Ausgezahlt" : "Ausstehend"}
                      </Badge>
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
