import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Trophy, Medal, Star, Zap, Target, TrendingUp, Crown,
  Flame, Award, Gift, ChevronDown, Sparkles, Users, Building2, Briefcase, PackageCheck, MapPin
} from "lucide-react";

// ── Time filters ──
const TIME_FILTERS = [
  "Heute", "Letzte 7 Tage", "Letzte 30 Tage", "Aktueller Monat",
  "Vorheriger Monat", "Letzte 3 Monate", "Letzte 12 Monate",
  "Aktuelles Jahr", "Seit Anfang",
];

// ── Fake partner data ──
const PARTNERS = [
  "Rouven Maisch", "Andreas Kenkenberg", "Lukas Schwaderer", "Lucas Henn",
  "Michael Hollenbach", "Max Müller", "Murat Demir", "Benedikt Lukas",
  "Julius Liebscher", "Johannes Placzek", "Tim Bosler", "Markus Wiedergrün",
  "Pascal Maison", "Benjamin Thiele", "Henrik Keles", "Sinan Lök",
  "Florian Walz", "Artem Matrohin", "Hakan Erden", "Manuel Hartmann",
];

const MY_NAME = "Max Müller";

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateRanking(count: number, min: number, max: number, isEuro = false) {
  const entries = PARTNERS.slice(0, count).map(name => ({
    name, value: rand(min, max),
  }));
  entries.sort((a, b) => b.value - a.value);
  return entries.map((e, i) => ({ ...e, pos: i + 1 }));
}

// ── B2C Rankings ──
const b2cRankings = {
  "Meiste angelegte Kontakte": generateRanking(10, 40, 380),
  "Meiste konvertierte Neukunden": generateRanking(10, 30, 380),
  "Meiste reservierte Kunden": generateRanking(10, 8, 30),
  "Meiste Inserate (kostenlos)": generateRanking(10, 5, 25),
};

// ── B2B Rankings ──
const b2bRankings = {
  "Meiste B2B-Kontakte": generateRanking(10, 20, 200),
  "Meiste Verkäufe": generateRanking(10, 5, 18),
  "Meistes Verkaufsvolumen": generateRanking(10, 288000, 2400000),
  "Ø Verkaufsvolumen": generateRanking(10, 280000, 490000),
};

// ── Gamification: Levels ──
const LEVELS = [
  { level: 1, title: "Rookie", minXP: 0, icon: "🌱", reward: null, rewardLabel: null },
  { level: 2, title: "Aufsteiger", minXP: 500, icon: "⚡", reward: null, rewardLabel: null },
  { level: 3, title: "Profi", minXP: 1500, icon: "🔥", reward: "🖊️", rewardLabel: "Montblanc Kugelschreiber" },
  { level: 4, title: "Experte", minXP: 3500, icon: "💎", reward: "📱", rewardLabel: "Apple iPhone 16 Pro" },
  { level: 5, title: "Elite", minXP: 7000, icon: "👑", reward: "💻", rewardLabel: "Apple MacBook Pro" },
  { level: 6, title: "Legende", minXP: 12000, icon: "🏆", reward: "🏖️", rewardLabel: "Luxus-Incentive-Reise" },
];

const MY_XP = 4200;
const currentLevel = [...LEVELS].reverse().find(l => MY_XP >= l.minXP)!;
const nextLevel = LEVELS.find(l => l.minXP > MY_XP);
const xpProgress = nextLevel ? ((MY_XP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100 : 100;

// ── Achievements / Badges ──
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  xpReward: number;
  bonusText?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "first10", title: "Erste 10 B2C Leads", description: "Lege 10 B2C-Kontakte an", icon: <Target className="h-5 w-5" />, unlocked: true, xpReward: 100 },
  { id: "first50", title: "50er Club", description: "50 B2C-Kontakte angelegt", icon: <Users className="h-5 w-5" />, unlocked: true, xpReward: 300 },
  { id: "inserat5", title: "Inserats-Starter", description: "5 kostenlose Inserate aktiviert", icon: <Building2 className="h-5 w-5" />, unlocked: true, xpReward: 250, bonusText: "🎁 +25 € Bonus!" },
  { id: "inserat15", title: "Inserats-Profi", description: "15 kostenlose Inserate aktiviert", icon: <Star className="h-5 w-5" />, unlocked: false, xpReward: 500, bonusText: "🎁 +75 € Bonus!" },
  { id: "b2b5", title: "B2B Networker", description: "5 B2B-Mitgliedschaften verkauft", icon: <Briefcase className="h-5 w-5" />, unlocked: true, xpReward: 400 },
  { id: "streak7", title: "7-Tage-Streak", description: "7 Tage in Folge aktiv gewesen", icon: <Flame className="h-5 w-5" />, unlocked: true, xpReward: 200 },
  { id: "streak30", title: "30-Tage-Streak", description: "30 Tage in Folge aktiv", icon: <Zap className="h-5 w-5" />, unlocked: false, xpReward: 600 },
  { id: "top3", title: "Top 3 Platzierung", description: "Erreiche Top 3 in einer Kategorie", icon: <Trophy className="h-5 w-5" />, unlocked: false, xpReward: 500, bonusText: "🎁 +100 € Bonus!" },
  { id: "volume1m", title: "Millionär", description: "1 Mio. € Verkaufsvolumen erreicht", icon: <Crown className="h-5 w-5" />, unlocked: false, xpReward: 1000, bonusText: "🎁 +250 € Bonus!" },
];

// ── Bonus Milestones ──
const BONUSES = [
  { target: 5, label: "5 Inserate", reward: 25, reached: true },
  { target: 10, label: "10 Inserate", reward: 50, reached: true },
  { target: 15, label: "15 Inserate", reward: 75, reached: false },
  { target: 25, label: "25 Inserate", reward: 150, reached: false },
  { target: 50, label: "50 Inserate", reward: 400, reached: false },
];

const MY_INSERATE = 12;

// ── Components ──

function RankingTable({ title, data, valueLabel = "Anzahl", formatValue }: {
  title: string;
  data: { pos: number; name: string; value: number }[];
  valueLabel?: string;
  formatValue?: (v: number) => string;
}) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? data : data.slice(0, 5);
  const fmt = formatValue || ((v: number) => v.toLocaleString("de-DE"));

  return (
    <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
      <div className="p-5 pb-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-1 rounded-full gradient-brand" />
          <h3 className="text-sm font-display font-semibold text-foreground">{title}</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wide w-10">Pos.</th>
              <th className="text-left py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Vertriebspartner</th>
              <th className="text-right py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">{valueLabel}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => {
              const isMe = row.name === MY_NAME;
              const medalColor = row.pos === 1 ? "text-yellow-500" : row.pos === 2 ? "text-gray-400" : row.pos === 3 ? "text-amber-600" : "";
              return (
                <tr key={row.pos} className={`border-b border-border/40 transition-colors ${isMe ? "bg-primary/5" : "hover:bg-secondary/30"}`}>
                  <td className="py-2.5 font-display font-bold text-foreground">
                    <div className="flex items-center gap-1">
                      {row.pos <= 3 ? (
                        <Medal className={`h-4 w-4 ${medalColor}`} />
                      ) : (
                        <span className="text-muted-foreground w-4 text-center">{row.pos}</span>
                      )}
                    </div>
                  </td>
                  <td className={`py-2.5 font-medium ${isMe ? "text-primary font-semibold" : "text-foreground"}`}>
                    {row.name}
                    {isMe && <Badge className="ml-2 gradient-brand border-0 text-white text-[9px] px-1.5 py-0">Du</Badge>}
                  </td>
                  <td className={`py-2.5 text-right font-semibold tabular-nums ${isMe ? "text-primary" : "text-foreground"}`}>
                    {fmt(row.value)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {data.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2.5 text-xs font-medium text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1 border-t border-border/50"
        >
          {expanded ? "Weniger anzeigen" : "Mehr laden …"}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}

export default function Auswertungen() {
  const { toast } = useToast();
  const [timeFilter, setTimeFilter] = useState("Seit Anfang");
  const [tab, setTab] = useState<"b2c" | "b2b">("b2c");
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [claimReward, setClaimReward] = useState<{ level: number; title: string; reward: string; rewardLabel: string } | null>(null);
  const [claimForm, setClaimForm] = useState({
    vorname: "", nachname: "", email: "", telefon: "",
    strasse: "", hausnummer: "", plz: "", ort: "", land: "Deutschland", anmerkung: "",
  });

  const openClaimDialog = (lvl: typeof LEVELS[0]) => {
    setClaimReward({ level: lvl.level, title: lvl.title, reward: lvl.reward!, rewardLabel: lvl.rewardLabel! });
    setClaimDialogOpen(true);
  };

  const submitClaim = () => {
    if (!claimForm.vorname || !claimForm.nachname || !claimForm.strasse || !claimForm.plz || !claimForm.ort) {
      toast({ title: "Bitte alle Pflichtfelder ausfüllen", variant: "destructive" });
      return;
    }
    toast({ title: "Prämie angefordert! 🎉", description: `${claimReward?.rewardLabel} wird an deine Adresse versendet.` });
    setClaimDialogOpen(false);
    setClaimForm({ vorname: "", nachname: "", email: "", telefon: "", strasse: "", hausnummer: "", plz: "", ort: "", land: "Deutschland", anmerkung: "" });
  };

  const rankings = tab === "b2c" ? b2cRankings : b2bRankings;
  const euroFmt = (v: number) => v.toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €";

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="w-10 h-1 rounded-full gradient-brand mb-1" />
            <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Auswertungen & Ranking</h1>
            <p className="text-sm text-muted-foreground mt-1">Vergleiche dich mit anderen Vertriebspartnern – sammle XP und Boni!</p>
          </div>
        </div>

        {/* ── Gamification Hero ── */}
        <div className="gradient-brand rounded-2xl p-6 text-white shadow-crm-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <Trophy className="w-full h-full" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar + Level */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl shadow-lg border border-white/20">
                {currentLevel.icon}
              </div>
              <div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Dein Level</p>
                <p className="text-2xl font-display font-bold">Level {currentLevel.level} – {currentLevel.title}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-2.5 bg-white/20 rounded-full overflow-hidden min-w-[180px]">
                    <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-white/80">{MY_XP.toLocaleString("de-DE")} XP</span>
                </div>
                {nextLevel && (
                  <p className="text-[11px] text-white/60 mt-1">Noch {(nextLevel.minXP - MY_XP).toLocaleString("de-DE")} XP bis Level {nextLevel.level} – {nextLevel.title} {nextLevel.icon}</p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="md:ml-auto flex gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 text-center border border-white/10">
                <p className="text-2xl font-display font-bold">{ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length}</p>
                <p className="text-[11px] text-white/70">Achievements</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 text-center border border-white/10">
                <p className="text-2xl font-display font-bold">75 €</p>
                <p className="text-[11px] text-white/70">Bonus verdient</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 text-center border border-white/10">
                <p className="text-2xl font-display font-bold">🔥 12</p>
                <p className="text-[11px] text-white/70">Tage-Streak</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Level-Übersicht mit Sachprämien ── */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-display font-semibold text-foreground">Level-Übersicht & Sachprämien</h2>
            <Badge variant="secondary" className="text-[10px]">B2C + B2B kombiniert</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-5">Sammle XP durch B2C-Inserate, B2B-Verkäufe, Streaks und Achievements – je höher dein Level, desto größer die Prämie!</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {LEVELS.map((lvl) => {
              const isCurrentLevel = lvl.level === currentLevel.level;
              const isReached = MY_XP >= lvl.minXP;
              return (
                <div
                  key={lvl.level}
                  className={`rounded-xl p-4 border text-center transition-all relative ${
                    isCurrentLevel
                      ? "border-primary/40 bg-primary/5 shadow-crm-sm ring-2 ring-primary/20"
                      : isReached
                      ? "border-success/30 bg-success/5"
                      : "border-border bg-muted/20 opacity-60"
                  }`}
                >
                  {isCurrentLevel && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 gradient-brand border-0 text-white text-[8px] px-2 py-0">
                      Aktuell
                    </Badge>
                  )}
                  <div className="text-3xl mb-1">{lvl.icon}</div>
                  <p className="text-xs font-bold text-foreground">Level {lvl.level}</p>
                  <p className="text-[11px] font-semibold text-foreground">{lvl.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{lvl.minXP.toLocaleString("de-DE")} XP</p>
                  {lvl.reward && (
                    <div className={`mt-2 pt-2 border-t ${isReached ? "border-success/20" : "border-border"}`}>
                      <div className="text-xl mb-0.5">{lvl.reward}</div>
                      <p className={`text-[10px] font-bold leading-tight ${isReached ? "text-success" : "text-muted-foreground"}`}>
                        {lvl.rewardLabel}
                      </p>
                      {isReached && (
                        <Badge variant="outline" className="text-[8px] mt-1 border-success/30 text-success bg-success/10">
                          ✓ Freigeschaltet
                        </Badge>
                      )}
                      {isReached && (
                        <Button
                          size="sm"
                          className="mt-2 h-6 text-[9px] px-2 gradient-brand border-0 text-white w-full"
                          onClick={() => openClaimDialog(lvl)}
                        >
                          <PackageCheck className="h-3 w-3 mr-1" /> Anfordern
                        </Button>
                      )}
                    </div>
                  )}
                  {!lvl.reward && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-[10px] text-muted-foreground italic">Keine Sachprämie</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-foreground flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
              <span><strong>So sammelst du XP:</strong> B2C-Inserat erstellt (+50 XP) · B2B-Mitgliedschaft verkauft (+200 XP) · Tages-Streak (+10 XP/Tag) · Achievement freigeschaltet (bis zu +1.000 XP) · Top-3-Ranking (+100 XP)</span>
            </p>
          </div>
        </div>

        {/* ── Bonus Inserat Milestones ── */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-display font-semibold text-foreground">Inserat-Bonus Meilensteine</h2>
            <Badge variant="secondary" className="text-[10px]">{MY_INSERATE} / {BONUSES[BONUSES.length - 1].target} Inserate</Badge>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full gradient-brand rounded-full transition-all" style={{ width: `${(MY_INSERATE / BONUSES[BONUSES.length - 1].target) * 100}%` }} />
            </div>
          </div>
          <div className="flex justify-between">
            {BONUSES.map((b) => (
              <div key={b.target} className={`text-center ${b.reached ? "opacity-100" : "opacity-40"}`}>
                <div className={`h-10 w-10 mx-auto rounded-xl flex items-center justify-center text-lg mb-1 ${b.reached ? "gradient-brand text-white shadow-crm-sm" : "bg-muted text-muted-foreground"}`}>
                  {b.reached ? "✓" : <Gift className="h-4 w-4" />}
                </div>
                <p className="text-[11px] font-semibold text-foreground">{b.label}</p>
                <p className={`text-[10px] font-bold ${b.reached ? "text-primary" : "text-muted-foreground"}`}>+{b.reward} €</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Achievements Grid ── */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-display font-semibold text-foreground">Achievements</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.id}
                className={`rounded-xl p-4 border transition-all ${
                  a.unlocked
                    ? "bg-primary/5 border-primary/20 shadow-crm-sm"
                    : "bg-muted/30 border-border opacity-50 grayscale"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${a.unlocked ? "gradient-brand text-white" : "bg-muted text-muted-foreground"}`}>
                    {a.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{a.title}</p>
                    <p className="text-[11px] text-muted-foreground">{a.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="secondary" className="text-[9px] px-1.5">+{a.xpReward} XP</Badge>
                      {a.bonusText && (
                        <span className={`text-[10px] font-bold ${a.unlocked ? "text-primary" : "text-muted-foreground"}`}>{a.bonusText}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tab Switch B2C / B2B ── */}
        <div className="flex items-center gap-3">
          <Button
            variant={tab === "b2c" ? "default" : "outline"}
            className={tab === "b2c" ? "gradient-brand border-0 text-white shadow-crm-sm" : ""}
            onClick={() => setTab("b2c")}
          >
            <Building2 className="h-4 w-4 mr-1.5" /> B2C Rankings
          </Button>
          <Button
            variant={tab === "b2b" ? "default" : "outline"}
            className={tab === "b2b" ? "gradient-brand border-0 text-white shadow-crm-sm" : ""}
            onClick={() => setTab("b2b")}
          >
            <Briefcase className="h-4 w-4 mr-1.5" /> B2B Rankings
          </Button>
        </div>

        {/* ── Time Filter ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground mr-1">Zeitraum:</span>
          {TIME_FILTERS.map((f) => (
            <Button
              key={f}
              variant={timeFilter === f ? "default" : "outline"}
              size="sm"
              className={`text-xs h-7 ${timeFilter === f ? "gradient-brand border-0 text-white" : "border-border hover:border-primary/30"}`}
              onClick={() => setTimeFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>

        {/* ── Ranking Tables ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Object.entries(rankings).map(([title, data]) => (
            <RankingTable
              key={title}
              title={title}
              data={data}
              valueLabel={title.toLowerCase().includes("volumen") ? "Volumen" : "Anzahl"}
              formatValue={title.toLowerCase().includes("volumen") ? euroFmt : undefined}
            />
          ))}
        </div>
      </div>

      {/* ── Prämie anfordern Dialog ── */}
      <Dialog open={claimDialogOpen} onOpenChange={setClaimDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-primary" />
              Sachprämie anfordern
            </DialogTitle>
            <DialogDescription>
              {claimReward && (
                <span className="flex items-center gap-2 mt-1">
                  <span className="text-xl">{claimReward.reward}</span>
                  <span className="font-semibold text-foreground">{claimReward.rewardLabel}</span>
                  <Badge variant="secondary" className="text-[9px]">Level {claimReward.level} – {claimReward.title}</Badge>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Vorname *</Label>
                <Input placeholder="Max" value={claimForm.vorname} onChange={(e) => setClaimForm(p => ({ ...p, vorname: e.target.value }))} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Nachname *</Label>
                <Input placeholder="Müller" value={claimForm.nachname} onChange={(e) => setClaimForm(p => ({ ...p, nachname: e.target.value }))} className="h-9 text-sm" />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">E-Mail</Label>
                <Input type="email" placeholder="max@email.de" value={claimForm.email} onChange={(e) => setClaimForm(p => ({ ...p, email: e.target.value }))} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Telefon</Label>
                <Input placeholder="+49 170 ..." value={claimForm.telefon} onChange={(e) => setClaimForm(p => ({ ...p, telefon: e.target.value }))} className="h-9 text-sm" />
              </div>
            </div>

            {/* Delivery address */}
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <p className="text-xs font-semibold text-foreground">Lieferadresse</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Straße *</Label>
                  <Input placeholder="Musterstraße" value={claimForm.strasse} onChange={(e) => setClaimForm(p => ({ ...p, strasse: e.target.value }))} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Hausnr.</Label>
                  <Input placeholder="12a" value={claimForm.hausnummer} onChange={(e) => setClaimForm(p => ({ ...p, hausnummer: e.target.value }))} className="h-9 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">PLZ *</Label>
                  <Input placeholder="10115" value={claimForm.plz} onChange={(e) => setClaimForm(p => ({ ...p, plz: e.target.value }))} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Ort *</Label>
                  <Input placeholder="Berlin" value={claimForm.ort} onChange={(e) => setClaimForm(p => ({ ...p, ort: e.target.value }))} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Land</Label>
                  <Input value={claimForm.land} onChange={(e) => setClaimForm(p => ({ ...p, land: e.target.value }))} className="h-9 text-sm" />
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <Label className="text-xs">Anmerkung (optional)</Label>
              <Textarea placeholder="z.B. bevorzugte Farbe, Größe, ..." value={claimForm.anmerkung} onChange={(e) => setClaimForm(p => ({ ...p, anmerkung: e.target.value }))} className="text-sm min-h-[60px]" rows={2} />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setClaimDialogOpen(false)}>Abbrechen</Button>
            <Button className="gradient-brand border-0 text-white" onClick={submitClaim}>
              <PackageCheck className="h-4 w-4 mr-1.5" /> Prämie anfordern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CRMLayout>
  );
}
