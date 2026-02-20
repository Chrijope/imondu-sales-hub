import { useState, useMemo } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, TrendingUp, Euro, ArrowUpRight, Info } from "lucide-react";
import {
  KARRIERESTUFEN,
  B2C_STAFFEL,
  B2B_STAFFEL,
  B2B_MITGLIEDSCHAFT_PREIS,
  B2C_QUARTALSBONUS,
  B2C_QUARTALSBONUS_SCHWELLE,
  getB2CStufe,
  getB2BStufe,
} from "@/data/karriereplan";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const MONTHS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

interface MonthGoal {
  b2cInserate: number;
  b2bRegistrierungen: number;
}

const emptyGoals = (): Record<number, MonthGoal> => {
  const g: Record<number, MonthGoal> = {};
  for (let i = 0; i < 12; i++) g[i] = { b2cInserate: 0, b2bRegistrierungen: 0 };
  return g;
};

export default function Zielplanung() {
  const [karriereStufeId, setKarriereStufeId] = useState("projektassistent");
  const [goals, setGoals] = useState<Record<number, MonthGoal>>(emptyGoals);

  const karriere = KARRIERESTUFEN.find((k) => k.id === karriereStufeId) || KARRIERESTUFEN[0];

  const updateGoal = (month: number, field: keyof MonthGoal, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setGoals((prev) => ({ ...prev, [month]: { ...prev[month], [field]: num } }));
  };

  const calculations = useMemo(() => {
    return Object.entries(goals).map(([mIdx, goal]) => {
      const monthIndex = parseInt(mIdx);
      // B2C: quarterly calculation – sum up quarter
      const quarter = Math.floor(monthIndex / 3);
      const quarterMonths = [quarter * 3, quarter * 3 + 1, quarter * 3 + 2];
      const quarterB2C = quarterMonths.reduce((sum, m) => sum + (goals[m]?.b2cInserate || 0), 0);
      const b2cStufe = getB2CStufe(quarterB2C);
      const b2cEarning = goal.b2cInserate * b2cStufe.provision;
      const quarterBonus = quarterB2C >= B2C_QUARTALSBONUS_SCHWELLE ? B2C_QUARTALSBONUS / 3 : 0;

      // B2B
      const b2bUmsatz = goal.b2bRegistrierungen * B2B_MITGLIEDSCHAFT_PREIS;
      const b2bStufe = getB2BStufe(b2bUmsatz);
      const b2bEarning = b2bUmsatz * (b2bStufe.provision / 100);

      const total = b2cEarning + quarterBonus + b2bEarning;

      return {
        month: MONTHS[monthIndex],
        monthIndex,
        b2cInserate: goal.b2cInserate,
        b2bReg: goal.b2bRegistrierungen,
        b2cProvision: b2cStufe.provision,
        b2cEarning,
        quarterBonus,
        b2bUmsatz,
        b2bProvision: b2bStufe.provision,
        b2bEarning,
        total,
      };
    });
  }, [goals]);

  const jahresTotal = calculations.reduce((s, c) => s + c.total, 0);
  const jahresB2C = calculations.reduce((s, c) => s + c.b2cEarning + c.quarterBonus, 0);
  const jahresB2B = calculations.reduce((s, c) => s + c.b2bEarning, 0);

  return (
    <CRMLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-10 w-10 rounded-xl gradient-brand flex items-center justify-center">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Zielplanung</h1>
                <p className="text-sm text-muted-foreground">Plane deine monatlichen Ziele & sieh deine Provisionsvorschau</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Karrierestufe:</span>
            <Select value={karriereStufeId} onValueChange={setKarriereStufeId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KARRIERESTUFEN.map((k) => (
                  <SelectItem key={k.id} value={k.id}>
                    {k.icon} {k.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-5 border border-border shadow-crm-sm">
            <p className="text-xs text-muted-foreground mb-1">Karrierestufe</p>
            <p className="text-lg font-bold text-foreground">{karriere.icon} {karriere.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{karriere.b2cMin}</p>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border shadow-crm-sm">
            <p className="text-xs text-muted-foreground mb-1">Jahresprognose Gesamt</p>
            <p className="text-2xl font-bold text-foreground">{jahresTotal.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</p>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border shadow-crm-sm">
            <p className="text-xs text-muted-foreground mb-1">B2C Provision (Jahr)</p>
            <p className="text-xl font-bold text-foreground">{jahresB2C.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</p>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border shadow-crm-sm">
            <p className="text-xs text-muted-foreground mb-1">B2B Provision (Jahr)</p>
            <p className="text-xl font-bold text-foreground">{jahresB2B.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</p>
          </div>
        </div>

        {/* Monthly Planning Table */}
        <div className="bg-card rounded-xl border border-border shadow-crm-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Monatsplanung</h2>
            <Tooltip>
              <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                Trage deine geplanten B2C-Inserate und B2B-Registrierungen ein. Die Provision wird auf Basis deiner Karrierestufe und der Quartalsstaffel berechnet.
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Monat</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-muted-foreground">B2C Inserate</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-muted-foreground">€/Inserat</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-muted-foreground">B2C Provision</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-muted-foreground">B2B Reg.</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-muted-foreground">B2B Umsatz</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-muted-foreground">B2B %</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-muted-foreground">B2B Provision</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-foreground">Gesamt</th>
                </tr>
              </thead>
              <tbody>
                {calculations.map((c) => {
                  const quarterStart = c.monthIndex % 3 === 0;
                  return (
                    <tr key={c.monthIndex} className={`border-b border-border/40 hover:bg-muted/20 ${quarterStart ? "border-t-2 border-t-border" : ""}`}>
                      <td className="px-4 py-2 font-medium text-foreground">
                        {c.month}
                        {quarterStart && (
                          <Badge variant="outline" className="ml-2 text-[9px]">Q{Math.floor(c.monthIndex / 3) + 1}</Badge>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Input
                          type="number"
                          min={0}
                          value={c.b2cInserate || ""}
                          onChange={(e) => updateGoal(c.monthIndex, "b2cInserate", e.target.value)}
                          className="w-20 h-8 text-center mx-auto text-sm"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-4 py-2 text-center text-muted-foreground">{c.b2cProvision} €</td>
                      <td className="px-4 py-2 text-center font-medium text-foreground">
                        {(c.b2cEarning + c.quarterBonus).toFixed(0)} €
                        {c.quarterBonus > 0 && (
                          <Badge className="ml-1 text-[9px] bg-success/10 text-success border-success/20" variant="outline">+Bonus</Badge>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Input
                          type="number"
                          min={0}
                          value={c.b2bReg || ""}
                          onChange={(e) => updateGoal(c.monthIndex, "b2bRegistrierungen", e.target.value)}
                          className="w-20 h-8 text-center mx-auto text-sm"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-4 py-2 text-center text-muted-foreground">{c.b2bUmsatz.toLocaleString("de-DE")} €</td>
                      <td className="px-4 py-2 text-center text-muted-foreground">{c.b2bProvision} %</td>
                      <td className="px-4 py-2 text-center font-medium text-foreground">{c.b2bEarning.toFixed(0)} €</td>
                      <td className="px-4 py-2 text-right">
                        <span className="font-bold text-foreground flex items-center justify-end gap-1">
                          {c.total.toFixed(0)} €
                          {c.total > 0 && <ArrowUpRight className="h-3.5 w-3.5 text-success" />}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted/40 border-t-2 border-border">
                  <td className="px-4 py-3 font-bold text-foreground">Jahresgesamt</td>
                  <td className="px-4 py-3 text-center font-semibold">{calculations.reduce((s, c) => s + c.b2cInserate, 0)}</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-center font-bold text-foreground">{jahresB2C.toFixed(0)} €</td>
                  <td className="px-4 py-3 text-center font-semibold">{calculations.reduce((s, c) => s + c.b2bReg, 0)}</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-center font-bold text-foreground">{jahresB2B.toFixed(0)} €</td>
                  <td className="px-4 py-3 text-right font-bold text-lg text-foreground">{jahresTotal.toFixed(0)} €</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Staffel Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl p-5 border border-border shadow-crm-sm">
            <h3 className="text-sm font-semibold text-foreground mb-3">B2C Provisionsstaffel (pro Quartal)</h3>
            <div className="space-y-2">
              {B2C_STAFFEL.map((s, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{s.min}{s.max ? `–${s.max}` : "+"} Inserate</span>
                  <span className="font-semibold text-foreground">{s.provision} € / Inserat</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 border-t border-border">
                <span className="text-muted-foreground">Quartalsbonus ab {B2C_QUARTALSBONUS_SCHWELLE}</span>
                <Badge className="bg-success/10 text-success border-success/20" variant="outline">+{B2C_QUARTALSBONUS} €</Badge>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border shadow-crm-sm">
            <h3 className="text-sm font-semibold text-foreground mb-3">B2B Provisionsstaffel (Monatsumsatz)</h3>
            <div className="space-y-2">
              {B2B_STAFFEL.map((s, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{s.min.toLocaleString("de-DE")}{s.max ? `–${s.max.toLocaleString("de-DE")}` : "+"} €</span>
                  <span className="font-semibold text-foreground">{s.provision} %</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 border-t border-border">
                <span className="text-muted-foreground">Mitgliedschaft / Reg.</span>
                <span className="font-semibold">{B2B_MITGLIEDSCHAFT_PREIS.toLocaleString("de-DE")} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
