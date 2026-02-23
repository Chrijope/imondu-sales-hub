import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Target, ArrowRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  KARRIERESTUFEN,
  B2B_MITGLIEDSCHAFT_PREIS,
  B2C_QUARTALSBONUS,
  B2C_QUARTALSBONUS_SCHWELLE,
  getB2CStufe,
  getB2BStufe,
} from "@/data/karriereplan";

const STORAGE_KEY = "imondu-zielplanung-v1";
const MONTHS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

interface MonthGoal {
  b2cInserate: number;
  b2bRegistrierungen: number;
}

function getEffectiveB2CProvision(base: number, kid: string) {
  if (kid === "projektleiter") return Math.max(base, 12);
  if (kid === "senior_projektleiter") return Math.max(base, 13.5);
  return base;
}

function getEffectiveB2BProvision(base: number, kid: string) {
  if (kid === "senior_projektleiter") return Math.max(base, 35);
  if (kid === "projektleiter") return Math.max(base, 30);
  if (kid === "projektassistent") return Math.min(base, 25);
  return base;
}

export default function ZielplanungWidget() {
  const data = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const goals: Record<number, MonthGoal> = parsed.goals || {};
      const karriereStufeId: string = parsed.karriereStufeId || "projektassistent";
      const karriere = KARRIERESTUFEN.find((k) => k.id === karriereStufeId) || KARRIERESTUFEN[0];

      const currentMonth = new Date().getMonth();
      const currentQuarter = Math.floor(currentMonth / 3);

      // Calculate year totals and current month
      let jahresZielB2C = 0;
      let jahresZielB2B = 0;
      let jahresTotal = 0;

      const calculations = Object.entries(goals).map(([mIdx, goal]) => {
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
        const overrideEarning = karriereStufeId === "senior_projektleiter" ? b2bUmsatz * 0.05 : 0;
        const total = b2cEarning + quarterBonus + b2bEarning + overrideEarning;

        jahresZielB2C += goal.b2cInserate;
        jahresZielB2B += goal.b2bRegistrierungen;
        jahresTotal += total;

        return { monthIndex, b2cInserate: goal.b2cInserate, b2bReg: goal.b2bRegistrierungen, total };
      });

      // Current month goal
      const cm = calculations.find((c) => c.monthIndex === currentMonth);
      // YTD actuals (demo: assume 70% achieved for months before current)
      const ytdMonths = calculations.filter((c) => c.monthIndex <= currentMonth);
      const ytdZiel = ytdMonths.reduce((s, c) => s + c.total, 0);

      const hasGoals = jahresZielB2C > 0 || jahresZielB2B > 0;

      return {
        karriere,
        currentMonth: MONTHS[currentMonth],
        currentMonthGoal: cm,
        jahresZielB2C,
        jahresZielB2B,
        jahresTotal,
        ytdZiel,
        hasGoals,
      };
    } catch {
      return null;
    }
  }, []);

  if (!data || !data.hasGoals) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-1 rounded-full gradient-brand" />
          <h2 className="text-sm font-semibold text-foreground">Zielplanung</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Noch keine Ziele festgelegt. Dein Vertriebsleiter wird deine Ziele mit dir besprechen.</p>
        <Link to="/zielplanung" className="flex items-center gap-1 text-xs text-accent font-medium hover:underline">
          Zur Zielplanung <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    );
  }

  const currentGoal = data.currentMonthGoal;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 rounded-full gradient-brand" />
          <h2 className="text-sm font-semibold text-foreground">Zielplanung</h2>
        </div>
        <Badge variant="outline" className="text-[9px]">{data.karriere.icon} {data.karriere.title}</Badge>
      </div>

      {/* Current month */}
      {currentGoal && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Ziel {data.currentMonth}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-foreground">{currentGoal.b2cInserate}</p>
              <p className="text-[10px] text-muted-foreground">B2C Inserate</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-foreground">{currentGoal.b2bReg}</p>
              <p className="text-[10px] text-muted-foreground">B2B Registrierungen</p>
            </div>
          </div>
        </div>
      )}

      {/* Annual target */}
      <div className="border-t border-border pt-3 mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Jahresziel Provision</span>
          <span className="font-bold text-foreground">{data.jahresTotal.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</span>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{data.jahresZielB2C} B2C · {data.jahresZielB2B} B2B</span>
        </div>
      </div>

      <Link to="/zielplanung" className="flex items-center gap-1 text-xs text-accent font-medium hover:underline">
        Details ansehen <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}