import { useState, useMemo, useEffect } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, TrendingUp, Euro, ArrowUpRight, Info, Lock, Users, Save, CheckCircle2 } from "lucide-react";
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
import { useUserRole } from "@/contexts/UserRoleContext";
import { SAMPLE_USERS } from "@/data/nutzerverwaltung-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MONTHS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

interface MonthGoal {
  b2cInserate: number;
  b2bRegistrierungen: number;
}

const STORAGE_KEY_PREFIX = "imondu-zielplanung";
const DRAFT_KEY_PREFIX = "imondu-zielplanung-draft";

// Published key = what the VP sees
function getStorageKey(userId?: string): string {
  return userId ? `${STORAGE_KEY_PREFIX}-${userId}` : `${STORAGE_KEY_PREFIX}-v1`;
}

// Draft key = admin's local working copy before saving
function getDraftKey(userId: string): string {
  return `${DRAFT_KEY_PREFIX}-${userId}`;
}

const emptyGoals = (): Record<number, MonthGoal> => {
  const g: Record<number, MonthGoal> = {};
  for (let i = 0; i < 12; i++) g[i] = { b2cInserate: 0, b2bRegistrierungen: 0 };
  return g;
};

function loadData(key: string): { goals: Record<number, MonthGoal>; karriereStufeId: string } {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { goals: parsed.goals || emptyGoals(), karriereStufeId: parsed.karriereStufeId || "projektassistent" };
    }
  } catch {}
  return { goals: emptyGoals(), karriereStufeId: "projektassistent" };
}

function loadFromStorage(userId?: string): { goals: Record<number, MonthGoal>; karriereStufeId: string } {
  return loadData(getStorageKey(userId));
}

// Career-level-specific minimum B2C provision & B2B provision adjustments
function getEffectiveB2CProvision(baseProvision: number, karriereId: string): number {
  if (karriereId === "projektleiter") return Math.max(baseProvision, 12);
  if (karriereId === "senior_projektleiter") return Math.max(baseProvision, 13.5);
  return baseProvision;
}

function getEffectiveB2BProvision(baseProvision: number, karriereId: string): number {
  if (karriereId === "senior_projektleiter") return Math.max(baseProvision, 35);
  if (karriereId === "projektleiter") return Math.max(baseProvision, 30);
  if (karriereId === "projektassistent") return Math.min(baseProvision, 25);
  return baseProvision;
}

export default function Zielplanung() {
  const { currentRoleId } = useUserRole();
  const canEdit = ["admin", "vertriebsleiter"].includes(currentRoleId);

  const vertriebspartner = SAMPLE_USERS.filter((u) => u.roleId === "vertriebspartner");

  // Map current role to their user record (for VP viewing their own targets)
  const ROLE_USER_MAP: Record<string, string> = {
    admin: "u1", vertriebsleiter: "u2", vertriebspartner: "u3",
    marketing: "u5", backoffice: "u6", buchhaltung: "u7", individuell: "u8",
  };
  const currentUserId = ROLE_USER_MAP[currentRoleId] || "";

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    canEdit && vertriebspartner.length > 0 ? vertriebspartner[0].id : ""
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const selectedPartner = vertriebspartner.find((u) => u.id === selectedPartnerId);

  // For admins: load draft if exists, otherwise load published version
  // For VP: always load published version
  const initialData = useMemo(() => {
    if (canEdit && selectedPartnerId) {
      const draft = loadData(getDraftKey(selectedPartnerId));
      const published = loadFromStorage(selectedPartnerId);
      // If draft has any data, use it
      const hasDraft = localStorage.getItem(getDraftKey(selectedPartnerId));
      return hasDraft ? draft : published;
    }
    // VP: load published data using their own user ID
    return loadFromStorage(currentUserId || undefined);
  }, [canEdit, selectedPartnerId, currentUserId]);

  const [karriereStufeId, setKarriereStufeId] = useState(initialData.karriereStufeId);
  const [goals, setGoals] = useState<Record<number, MonthGoal>>(initialData.goals);

  const karriere = KARRIERESTUFEN.find((k) => k.id === karriereStufeId) || KARRIERESTUFEN[0];

  // Reload when partner changes (admin view)
  useEffect(() => {
    if (canEdit && selectedPartnerId) {
      const hasDraft = localStorage.getItem(getDraftKey(selectedPartnerId));
      const data = hasDraft ? loadData(getDraftKey(selectedPartnerId)) : loadFromStorage(selectedPartnerId);
      setGoals(data.goals);
      setKarriereStufeId(data.karriereStufeId);
      setHasUnsavedChanges(!!hasDraft);
    } else {
      const data = loadFromStorage(currentUserId || undefined);
      setGoals(data.goals);
      setKarriereStufeId(data.karriereStufeId);
      setHasUnsavedChanges(false);
    }
  }, [selectedPartnerId, canEdit, currentUserId]);

  // For admins: auto-save to draft only (not published)
  // For VP: save to own key (read-only anyway, but keeps state)
  useEffect(() => {
    if (canEdit && selectedPartnerId) {
      localStorage.setItem(getDraftKey(selectedPartnerId), JSON.stringify({ goals, karriereStufeId }));
    } else if (!canEdit) {
      // VP doesn't save — their data comes from admin publishing
    }
  }, [goals, karriereStufeId, canEdit, selectedPartnerId]);

  const handleSaveAndPublish = () => {
    if (!selectedPartnerId) return;
    // Write to the published key that the VP reads
    const publishedKey = getStorageKey(selectedPartnerId);
    localStorage.setItem(publishedKey, JSON.stringify({ goals, karriereStufeId }));
    // Remove draft
    localStorage.removeItem(getDraftKey(selectedPartnerId));
    setHasUnsavedChanges(false);
    toast.success(`Zielvereinbarung für ${selectedPartner?.name || "Partner"} gespeichert`, {
      description: "Die Ziele werden dem Vertriebspartner ab sofort angezeigt.",
    });
  };

  const handleDiscardDraft = () => {
    if (!selectedPartnerId) return;
    localStorage.removeItem(getDraftKey(selectedPartnerId));
    const published = loadFromStorage(selectedPartnerId);
    setGoals(published.goals);
    setKarriereStufeId(published.karriereStufeId);
    setHasUnsavedChanges(false);
    toast.info("Entwurf verworfen – veröffentlichte Ziele wiederhergestellt.");
  };

  const updateGoal = (month: number, field: keyof MonthGoal, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setGoals((prev) => ({ ...prev, [month]: { ...prev[month], [field]: num } }));
    setHasUnsavedChanges(true);
  };

  const calculations = useMemo(() => {
    return Object.entries(goals).map(([mIdx, goal]) => {
      const monthIndex = parseInt(mIdx);
      const quarter = Math.floor(monthIndex / 3);
      const quarterMonths = [quarter * 3, quarter * 3 + 1, quarter * 3 + 2];
      const quarterB2C = quarterMonths.reduce((sum, m) => sum + (goals[m]?.b2cInserate || 0), 0);
      const b2cStufe = getB2CStufe(quarterB2C);
      const effectiveB2C = getEffectiveB2CProvision(b2cStufe.provision, karriereStufeId);
      const b2cEarning = goal.b2cInserate * effectiveB2C;
      const quarterBonus = quarterB2C >= B2C_QUARTALSBONUS_SCHWELLE ? B2C_QUARTALSBONUS / 3 : 0;

      const b2bUmsatz = goal.b2bRegistrierungen * B2B_MITGLIEDSCHAFT_PREIS;
      const b2bStufe = getB2BStufe(b2bUmsatz);
      const effectiveB2B = getEffectiveB2BProvision(b2bStufe.provision, karriereStufeId);
      const b2bEarning = b2bUmsatz * (effectiveB2B / 100);

      // Senior override on team (5% extra)
      const overrideEarning = karriereStufeId === "senior_projektleiter" ? b2bUmsatz * 0.05 : 0;

      const total = b2cEarning + quarterBonus + b2bEarning + overrideEarning;

      return {
        month: MONTHS[monthIndex],
        monthIndex,
        b2cInserate: goal.b2cInserate,
        b2bReg: goal.b2bRegistrierungen,
        b2cProvision: effectiveB2C,
        b2cEarning,
        quarterBonus,
        b2bUmsatz,
        b2bProvision: effectiveB2B,
        b2bEarning,
        overrideEarning,
        total,
      };
    });
  }, [goals, karriereStufeId]);

  const jahresTotal = calculations.reduce((s, c) => s + c.total, 0);
  const jahresB2C = calculations.reduce((s, c) => s + c.b2cEarning + c.quarterBonus, 0);
  const jahresB2B = calculations.reduce((s, c) => s + c.b2bEarning, 0);

  return (
    <CRMLayout>
      <div className="space-y-6 min-h-screen dashboard-mesh-bg p-6 lg:p-8">
       <div className="max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-1 rounded-full gradient-brand" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Zielplanung</h1>
            {canEdit ? (
              <p className="text-sm text-muted-foreground mt-1">
                Zielvereinbarung für {selectedPartner?.name || "Vertriebspartner"} festlegen
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mt-1">Deine festgelegten Ziele & Provisionsvorschau</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Ziele werden von der Vertriebsleitung festgelegt</span>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {/* Partner selector for admin/VL */}
            {canEdit && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Partner wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {vertriebspartner.map((vp) => (
                      <SelectItem key={vp.id} value={vp.id}>
                        {vp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Karrierestufe:</span>
              <Select value={karriereStufeId} onValueChange={(v) => { setKarriereStufeId(v); setHasUnsavedChanges(true); }} disabled={!canEdit}>
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
        </div>

        {/* Save Bar for Admin/VL */}
        {canEdit && (
          <div className={`rounded-xl p-4 border flex items-center justify-between transition-all ${
            hasUnsavedChanges 
              ? "bg-primary/5 border-primary/30 shadow-crm-sm" 
              : "bg-muted/30 border-border"
          }`}>
            <div className="flex items-center gap-2">
              {hasUnsavedChanges ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                  <span className="text-sm text-foreground font-medium">Ungespeicherte Änderungen</span>
                  <span className="text-xs text-muted-foreground">– Entwurf wird lokal zwischengespeichert</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm text-muted-foreground">Alle Änderungen gespeichert & veröffentlicht</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <Button variant="ghost" size="sm" onClick={handleDiscardDraft} className="text-xs">
                  Verwerfen
                </Button>
              )}
              <Button 
                size="sm" 
                onClick={handleSaveAndPublish} 
                disabled={!hasUnsavedChanges}
                className="gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                Speichern & Übernehmen
              </Button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-1">Karrierestufe</p>
            <p className="text-xs text-muted-foreground mt-1">B2C: {karriere.b2cMin}</p>
            <p className="text-xs text-muted-foreground">B2B: {karriere.b2bRange}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-1">Jahresprognose Gesamt</p>
            <p className="text-2xl font-bold text-foreground">{jahresTotal.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-1">B2C Provision (Jahr)</p>
            <p className="text-xl font-bold text-foreground">{jahresB2C.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
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
                        {canEdit ? (
                          <Input
                            type="number"
                            min={0}
                            value={c.b2cInserate || ""}
                            onChange={(e) => updateGoal(c.monthIndex, "b2cInserate", e.target.value)}
                            className="w-20 h-8 text-center mx-auto text-sm"
                            placeholder="0"
                          />
                        ) : (
                          <span className="text-sm font-medium text-foreground">{c.b2cInserate}</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center text-muted-foreground">{c.b2cProvision} €</td>
                      <td className="px-4 py-2 text-center font-medium text-foreground">
                        {(c.b2cEarning + c.quarterBonus).toFixed(0)} €
                        {c.quarterBonus > 0 && (
                          <Badge className="ml-1 text-[9px] bg-success/10 text-success border-success/20" variant="outline">+Bonus</Badge>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {canEdit ? (
                          <Input
                            type="number"
                            min={0}
                            value={c.b2bReg || ""}
                            onChange={(e) => updateGoal(c.monthIndex, "b2bRegistrierungen", e.target.value)}
                            className="w-20 h-8 text-center mx-auto text-sm"
                            placeholder="0"
                          />
                        ) : (
                          <span className="text-sm font-medium text-foreground">{c.b2bReg}</span>
                        )}
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
      </div>
    </CRMLayout>
  );
}
