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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Trophy, Medal, Star, Zap, Target, TrendingUp, Crown,
  Flame, Award, Gift, ChevronDown, Sparkles, Users, Building2, Briefcase, PackageCheck, MapPin,
  GraduationCap, ArrowUpRight, CheckCircle2, Euro, Info, Pencil, Trash2, Plus, Send, Clock
} from "lucide-react";
import {
  B2C_STAFFEL, B2B_STAFFEL, B2B_MITGLIEDSCHAFT_PREIS, B2C_QUARTALSBONUS, B2C_QUARTALSBONUS_SCHWELLE,
  KARRIERESTUFEN, getB2CStufe, getB2BStufe,
} from "@/data/karriereplan";
import { useUserRole } from "@/contexts/UserRoleContext";
import { addChatNotification } from "@/utils/chat-notifications";
import { getVPAttribution } from "@/utils/rabattcode-attribution";

import { TIME_RANGE_OPTIONS, TimeRangeKey } from "@/utils/date-filters";

const TIME_FILTERS = TIME_RANGE_OPTIONS.filter(t => t !== "Individuell");

// ── Fake partner data ──
const PARTNERS = [
  "Max Müller", "Laura Schneider", "Tom Weber", "Nina Fischer",
  "Jan Hoffmann", "Sophie Becker", "Felix Wagner", "Emma Richter",
  "Lukas Braun", "Lena Hartmann", "Paul Zimmermann", "Marie Krüger",
  "David Lehmann", "Anna Schmitt", "Tim Neumann", "Lisa Schwarz",
  "Marco Werner", "Julia Lange", "Nico Baumann", "Sarah Koch",
];

const MY_NAME = "Max Müller";

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateRanking(count: number, min: number, max: number) {
  const entries = PARTNERS.slice(0, count).map(name => ({
    name, value: rand(min, max),
  }));
  entries.sort((a, b) => b.value - a.value);
  return entries.map((e, i) => ({ ...e, pos: i + 1 }));
}

// ── Rankings ──
const b2cRankings = {
  "Meiste angelegte Kontakte": generateRanking(10, 40, 380),
  "Meiste konvertierte Neukunden": generateRanking(10, 30, 380),
  "Meiste reservierte Kunden": generateRanking(10, 8, 30),
  "Meiste Inserate (kostenlos)": generateRanking(10, 5, 25),
};
const b2bRankings = {
  "Meiste B2B-Kontakte": generateRanking(10, 20, 200),
  "Meiste Verkäufe": generateRanking(10, 5, 18),
  "Meistes Verkaufsvolumen": generateRanking(10, 288000, 2400000),
  "Ø Verkaufsvolumen": generateRanking(10, 280000, 490000),
};

// ── XP Rules ──
// B2C Lead manuell anlegen: +10 XP
// Eigentümer-Inserat über Rabattcode: +50 XP
// Entwickler-Registrierung über Rabattcode: +200 XP
// B2B Mitgliedschaft verkauft: +300 XP
// Tages-Streak: +10 XP/Tag
// Meilenstein freigeschaltet: variabel
// Top-3 Ranking: +100 XP

const XP_RULES = [
  { action: "B2C Lead manuell angelegt", xp: 10, icon: "👤" },
  { action: "Eigentümer-Inserat (über Code)", xp: 50, icon: "🏠" },
  { action: "Entwickler-Registrierung (über Code)", xp: 200, icon: "🏗️" },
  { action: "B2B Mitgliedschaft verkauft", xp: 300, icon: "💼" },
  { action: "Tages-Streak (pro Tag)", xp: 10, icon: "🔥" },
  { action: "Meilenstein freigeschaltet", xp: "50–1.000", icon: "🏆" },
  { action: "Top-3 Ranking-Platzierung", xp: 100, icon: "🥇" },
];

// ── Gamification: Levels ──
export interface LevelDef {
  level: number; title: string; minXP: number; icon: string;
  reward: string | null; rewardLabel: string | null;
}

const DEFAULT_LEVELS: LevelDef[] = [
  { level: 1, title: "Rookie", minXP: 0, icon: "🌱", reward: null, rewardLabel: null },
  { level: 2, title: "Aufsteiger", minXP: 500, icon: "⚡", reward: null, rewardLabel: null },
  { level: 3, title: "Profi", minXP: 2000, icon: "🔥", reward: "🖊️", rewardLabel: "Montblanc Kugelschreiber" },
  { level: 4, title: "Experte", minXP: 5000, icon: "💎", reward: "📱", rewardLabel: "Apple iPhone 16 Pro" },
  { level: 5, title: "Elite", minXP: 12000, icon: "👑", reward: "💻", rewardLabel: "Apple MacBook Pro" },
  { level: 6, title: "Legende", minXP: 25000, icon: "🏆", reward: "🏖️", rewardLabel: "Luxus-Incentive-Reise" },
];

const MY_XP = 4200;

// ── Meilensteine ──
export interface Achievement {
  id: string; title: string; description: string; iconName: string; unlocked: boolean; xpReward: number; bonusText?: string; draft?: boolean;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "first10", title: "Erste 10 B2C Leads", description: "Lege 10 B2C-Kontakte manuell an", iconName: "target", unlocked: true, xpReward: 100 },
  { id: "first50", title: "50er Club", description: "50 B2C-Kontakte angelegt", iconName: "users", unlocked: true, xpReward: 300 },
  { id: "inserat5", title: "Inserats-Starter", description: "5 Eigentümer-Inserate über deinen Code", iconName: "building", unlocked: true, xpReward: 250, bonusText: "🎁 +25 € Bonus!" },
  { id: "inserat15", title: "Inserats-Profi", description: "15 Eigentümer-Inserate über deinen Code", iconName: "star", unlocked: false, xpReward: 500, bonusText: "🎁 +75 € Bonus!" },
  { id: "b2b5", title: "B2B Networker", description: "5 Entwickler-Registrierungen über deinen Code", iconName: "briefcase", unlocked: true, xpReward: 400 },
  { id: "streak7", title: "7-Tage-Streak", description: "7 Tage in Folge aktiv gewesen", iconName: "flame", unlocked: true, xpReward: 200 },
  { id: "streak30", title: "30-Tage-Streak", description: "30 Tage in Folge aktiv", iconName: "zap", unlocked: false, xpReward: 600 },
  { id: "top3", title: "Top 3 Platzierung", description: "Erreiche Top 3 in einer Kategorie", iconName: "trophy", unlocked: false, xpReward: 500, bonusText: "🎁 +100 € Bonus!" },
  { id: "volume1m", title: "Millionär", description: "1 Mio. € Verkaufsvolumen erreicht", iconName: "crown", unlocked: false, xpReward: 1000, bonusText: "🎁 +250 € Bonus!" },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  target: <Target className="h-5 w-5" />, users: <Users className="h-5 w-5" />, building: <Building2 className="h-5 w-5" />,
  star: <Star className="h-5 w-5" />, briefcase: <Briefcase className="h-5 w-5" />, flame: <Flame className="h-5 w-5" />,
  zap: <Zap className="h-5 w-5" />, trophy: <Trophy className="h-5 w-5" />, crown: <Crown className="h-5 w-5" />,
  award: <Award className="h-5 w-5" />, gift: <Gift className="h-5 w-5" />, sparkles: <Sparkles className="h-5 w-5" />,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

// ── Bonus Milestones ──
export const BONUSES = [
  { target: 5, label: "5 Inserate", reward: 25, reached: true },
  { target: 10, label: "10 Inserate", reward: 50, reached: true },
  { target: 15, label: "15 Inserate", reward: 75, reached: false },
  { target: 25, label: "25 Inserate", reward: 150, reached: false },
  { target: 50, label: "50 Inserate", reward: 400, reached: false },
];

const MY_INSERATE = 12;

// ── Demo values for current provision tier ──
const MY_B2C_INSERATE_QUARTAL = 82;
const MY_B2B_MONATSUMSATZ = 3750;

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
    <div className="glass-card rounded-xl overflow-hidden">
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
  const { currentRoleId } = useUserRole();
  const isAdmin = currentRoleId === "admin" || currentRoleId === "inhaber" || currentRoleId === "vertriebsleiter";
  
  // VP attribution from Rabattcodes
  const currentUserId = currentRoleId === "inhaber" ? "u1" : currentRoleId === "admin" ? "u1" : currentRoleId === "vertriebsleiter" ? "u2"
    : currentRoleId === "vertriebspartner" ? "u3" : "u1";
  const vpAttribution = getVPAttribution(currentUserId);
  const [timeFilter, setTimeFilter] = useState<TimeRangeKey>("Seit Anfang");
  const [tab, setTab] = useState<"b2c" | "b2b">("b2c");

  // ── Claim Dialog ──
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [claimReward, setClaimReward] = useState<{ level: number; title: string; reward: string; rewardLabel: string } | null>(null);
  const [claimForm, setClaimForm] = useState({
    vorname: "", nachname: "", email: "", telefon: "",
    strasse: "", hausnummer: "", plz: "", ort: "", land: "Deutschland", anmerkung: "",
  });

  // ── State-based levels and achievements for admin editing ──
  const [levels, setLevels] = useState<LevelDef[]>(DEFAULT_LEVELS);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  // Track claim status per level: none = not claimed, requested = pending admin approval, confirmed = received
  const [claimedStatus, setClaimedStatus] = useState<Record<number, "none" | "requested" | "confirmed">>({
    3: "confirmed", // Demo: already received level 3 reward
    4: "none",      // Demo: reached level 4 but not yet claimed
  });

  // ── Admin Edit Dialogs ──
  const [editLevelDialog, setEditLevelDialog] = useState<LevelDef | null>(null);
  const [editAchievementDialog, setEditAchievementDialog] = useState<Achievement | null>(null);
  const [addAchievementDialog, setAddAchievementDialog] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    id: "", title: "", description: "", iconName: "target", unlocked: false, xpReward: 100, bonusText: "",
  });

  const currentLevel = [...levels].reverse().find(l => MY_XP >= l.minXP)!;
  const nextLevel = levels.find(l => l.minXP > MY_XP);
  const xpProgress = nextLevel ? ((MY_XP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100 : 100;

  const openClaimDialog = (lvl: LevelDef) => {
    setClaimReward({ level: lvl.level, title: lvl.title, reward: lvl.reward!, rewardLabel: lvl.rewardLabel! });
    setClaimDialogOpen(true);
  };

  const submitClaim = () => {
    if (!claimForm.vorname || !claimForm.nachname || !claimForm.strasse || !claimForm.plz || !claimForm.ort) {
      toast({ title: "Bitte alle Pflichtfelder ausfüllen", variant: "destructive" });
      return;
    }
    // Set status to "requested"
    setClaimedStatus(prev => ({ ...prev, [claimReward!.level]: "requested" }));
    // Send chat notification to Admin/VL
    addChatNotification({
      targetChatId: "intern-admin",
      targetRole: "admin",
      text: `📦 Prämien-Anforderung: ${MY_NAME} fordert "${claimReward?.rewardLabel}" (Level ${claimReward?.level} – ${claimReward?.title}) an. Lieferadresse: ${claimForm.strasse} ${claimForm.hausnummer}, ${claimForm.plz} ${claimForm.ort}, ${claimForm.land}.${claimForm.anmerkung ? ` Anmerkung: ${claimForm.anmerkung}` : ""}`,
      sender: MY_NAME,
      senderInitials: "MM",
      type: "system",
    });
    toast({ title: "Prämie angefordert! 🎉", description: `${claimReward?.rewardLabel} – Admin und Vertriebsleitung wurden benachrichtigt.` });
    setClaimDialogOpen(false);
    setClaimForm({ vorname: "", nachname: "", email: "", telefon: "", strasse: "", hausnummer: "", plz: "", ort: "", land: "Deutschland", anmerkung: "" });
  };

  // Admin confirms a partner's claim
  const confirmClaim = (level: number) => {
    setClaimedStatus(prev => ({ ...prev, [level]: "confirmed" }));
    toast({ title: "Prämie bestätigt ✓", description: `Level ${level} Sachprämie als erhalten markiert.` });
  };

  // Admin: save level reward edit
  const saveLevelEdit = () => {
    if (!editLevelDialog) return;
    setLevels(prev => prev.map(l => l.level === editLevelDialog.level ? editLevelDialog : l));
    toast({ title: "Level aktualisiert", description: `Level ${editLevelDialog.level} – ${editLevelDialog.title} gespeichert.` });
    setEditLevelDialog(null);
  };

  // Admin: save achievement edit
  const saveAchievementEdit = () => {
    if (!editAchievementDialog) return;
    setAchievements(prev => prev.map(a => a.id === editAchievementDialog.id ? editAchievementDialog : a));
    toast({ title: "Meilenstein aktualisiert" });
    setEditAchievementDialog(null);
  };

  // Admin: delete achievement
  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
    toast({ title: "Meilenstein gelöscht" });
    setEditAchievementDialog(null);
  };

  // Admin: add new achievement
  const addNewAchievement = () => {
    if (!newAchievement.title || !newAchievement.description) {
      toast({ title: "Titel und Beschreibung erforderlich", variant: "destructive" });
      return;
    }
    const a: Achievement = {
      ...newAchievement,
      id: `ach-${Date.now()}`,
    };
    setAchievements(prev => [...prev, a]);
    toast({ title: "Meilenstein hinzugefügt ✓" });
    setAddAchievementDialog(false);
    setNewAchievement({ id: "", title: "", description: "", iconName: "target", unlocked: false, xpReward: 100, bonusText: "" });
  };

  const rankings = tab === "b2c" ? b2cRankings : b2bRankings;
  const euroFmt = (v: number) => v.toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €";

  const currentB2CStufe = getB2CStufe(MY_B2C_INSERATE_QUARTAL);
  const currentB2BStufe = getB2BStufe(MY_B2B_MONATSUMSATZ);

  const isVP = currentRoleId === "vertriebspartner";
  const canViewAuswertungen = isAdmin || currentRoleId === "vertriebspartner";

  return (
    <CRMLayout>
      <div className={`p-6 lg:p-8 space-y-6 animate-fade-in min-h-screen dashboard-mesh-bg ${isVP ? "opacity-40 pointer-events-none select-none" : ""}`}>
        {/* Entwurf-Banner für VP */}
        {isVP && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
            <Badge variant="outline" className="text-sm px-4 py-2 border-dashed border-muted-foreground/40 text-muted-foreground bg-background shadow-lg">
              🔒 Entwurf – Diese Seite wird bald freigeschaltet
            </Badge>
          </div>
        )}
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="w-10 h-1 rounded-full gradient-brand mb-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Auswertungen & Ranking</h1>
              {isAdmin && (
                <Badge variant="outline" className="text-[9px] border-dashed border-muted-foreground/30 text-muted-foreground">Entwurf</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Vergleiche dich mit anderen Vertriebspartnern – sammle XP und Boni!</p>
          </div>
        </div>

        {/* ── Provisionsmodell Erklärung ── */}
        <div className="gradient-brand-subtle border border-primary/15 rounded-xl p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg gradient-brand flex items-center justify-center shrink-0">
            <Euro className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-display font-semibold text-foreground mb-1">So verdienst du bei Imondu</h3>
            <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">B2C:</strong> Du erhältst <strong className="text-foreground">ab 10 € netto</strong> pro qualifiziertem Inserat, wenn du Eigentümer zum <strong className="text-foreground">kostenlosen Inserieren</strong> ihrer Immobilie animierst. Je mehr Inserate du pro Quartal generierst, desto höher steigt deine Provisionsstufe (bis 15 €).
              </p>
              <p>
                <strong className="text-foreground">B2B:</strong> Du erhältst <strong className="text-foreground">25 % netto Provision</strong> auf die 12-monatige Mitgliedschaft (1.250 € netto) eines Immobilienentwicklers. Bei höherem Monatsumsatz steigt deine Stufe auf bis zu 35 %.
              </p>
            </div>
          </div>
        </div>

        {/* ── XP-Regeln Übersicht ── */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-display font-semibold text-foreground">So sammelst du XP – Level-Aufstieg</h2>
            <Badge variant="secondary" className="text-[10px]">Unabhängig vom Karriereplan</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Das interne Level-System belohnt deine Leistung – je mehr du verkaufst, vermittelst und aktiv bist, desto schneller steigst du auf.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {XP_RULES.map((rule) => (
              <div key={rule.action} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                <span className="text-xl">{rule.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-foreground">{rule.action}</p>
                  <p className="text-[11px] font-bold text-primary">+{rule.xp} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Deine Rabattcode-Vermittlungen → XP ── */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-display font-semibold text-foreground">Deine Rabattcode-Vermittlungen</h2>
            <Badge variant="secondary" className="text-[10px]">Automatisch erfasst</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-muted/30 rounded-lg p-3 border border-border text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Kunden-Inserate</p>
              <p className="text-xl font-display font-bold text-foreground mt-1">{vpAttribution.totalCustomerZahlend}</p>
              <p className="text-[10px] text-primary font-semibold">+{vpAttribution.totalCustomerZahlend * 50} XP</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-border text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Entwickler-Reg.</p>
              <p className="text-xl font-display font-bold text-foreground mt-1">{vpAttribution.totalDevZahlend}</p>
              <p className="text-[10px] text-primary font-semibold">+{vpAttribution.totalDevZahlend * 200} XP</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-border text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Codes aktiv</p>
              <p className="text-xl font-display font-bold text-foreground mt-1">{vpAttribution.customerCodes.length + vpAttribution.developerCodes.length}</p>
              <p className="text-[10px] text-muted-foreground">Kunden + Entwickler</p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-3 border border-primary/20 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Code-XP gesamt</p>
              <p className="text-xl font-display font-bold text-primary mt-1">+{vpAttribution.codeXP}</p>
              <p className="text-[10px] text-muted-foreground">fließt in Level ein</p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1.5">
            <Info className="h-3 w-3 text-primary shrink-0" />
            Vermittlungen über deine Rabattcode-Links werden automatisch erfasst und in XP, Provisionen und Rankings berücksichtigt.
          </p>
        </div>

        {/* ── Karriereplan ── */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-display font-semibold text-foreground">Karriereplan & Provisionsstaffeln</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-5">Dein Aufstieg bei Imondu – jede Stufe bringt dir mehr Provision und exklusive Vorteile.</p>

          {/* Karrierestufen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {KARRIERESTUFEN.map((stufe, i) => {
              const isActive = i === 0;
              return (
                <div
                  key={stufe.id}
                  className={`rounded-xl p-5 border transition-all relative ${
                    isActive
                      ? "border-primary/40 bg-primary/5 shadow-crm-sm ring-2 ring-primary/20"
                      : "border-border bg-muted/20"
                  }`}
                >
                  {isActive && (
                    <Badge className="absolute -top-2 left-4 gradient-brand border-0 text-white text-[8px] px-2 py-0">
                      Deine Stufe
                    </Badge>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{stufe.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-foreground">{stufe.title}</p>
                      {i > 0 && (
                        <p className="text-[10px] text-muted-foreground">Aufstieg möglich</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">B2C Provision</span>
                      <span className="font-semibold text-foreground">{stufe.b2cMin}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">B2B Provision</span>
                      <span className="font-semibold text-foreground">{stufe.b2bRange}</span>
                    </div>
                    {stufe.overrideTeam && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Team-Override</span>
                        <span className="font-semibold text-primary">{stufe.overrideTeam}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-border pt-3 space-y-1">
                    {stufe.vorteile.slice(0, 3).map((v, vi) => (
                      <p key={vi} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                        <CheckCircle2 className={`h-3 w-3 mt-0.5 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                        {v}
                      </p>
                    ))}
                    {stufe.vorteile.length > 3 && (
                      <p className="text-[10px] text-primary font-medium">+{stufe.vorteile.length - 3} weitere Vorteile</p>
                    )}
                  </div>
                  {stufe.voraussetzungen && (
                    <div className="mt-3 pt-2 border-t border-border">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Voraussetzungen</p>
                      {stufe.voraussetzungen.slice(0, 2).map((v, vi) => (
                        <p key={vi} className="text-[10px] text-muted-foreground">• {v}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* B2C Provisionsstaffel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">B2C Provisionsstaffel (Quartal)</h3>
              </div>
              <p className="text-[11px] text-muted-foreground mb-3">
                Eigentümer zum <strong className="text-foreground">kostenlosen Inserieren</strong> animieren → du erhältst pro qualifiziertem Inserat:
              </p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-1.5 text-muted-foreground font-medium">Inserate / Quartal</th>
                    <th className="text-right py-1.5 text-muted-foreground font-medium">Provision / Inserat</th>
                    <th className="text-right py-1.5 text-muted-foreground font-medium">Mehrverdienst*</th>
                  </tr>
                </thead>
                <tbody>
                  {B2C_STAFFEL.map((s, i) => {
                    const isCurrentTier = s.provision === currentB2CStufe.provision;
                    const exampleInserate = s.min || 50;
                    const mehrverdienst = exampleInserate * s.provision;
                    return (
                      <tr key={i} className={`border-b border-border/40 ${isCurrentTier ? "bg-primary/5" : ""}`}>
                        <td className="py-2 font-medium text-foreground">
                          {s.max ? `${s.min}–${s.max}` : `ab ${s.min}`}
                          {isCurrentTier && <Badge className="ml-2 gradient-brand border-0 text-white text-[8px] px-1.5 py-0">Du</Badge>}
                        </td>
                        <td className="py-2 text-right font-bold text-foreground">{s.provision.toLocaleString("de-DE")} € netto</td>
                        <td className="py-2 text-right font-semibold text-primary">{mehrverdienst.toLocaleString("de-DE")} €</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-[10px] text-muted-foreground mt-2">* Beispiel-Mehrverdienst pro Quartal bei Mindestanzahl</p>
              <div className="mt-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-[11px] text-foreground flex items-center gap-1.5">
                  <Gift className="h-3 w-3 text-primary shrink-0" />
                  <span><strong>Quartalsbonus:</strong> {B2C_QUARTALSBONUS} € netto bei {B2C_QUARTALSBONUS_SCHWELLE}+ Inseraten</span>
                </p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">B2B Provisionsstaffel (Monat)</h3>
              </div>
              <p className="text-[11px] text-muted-foreground mb-3">
                25 % netto Provision auf die <strong className="text-foreground">12-monatige Mitgliedschaft</strong> (1.250 € netto) – steigerbar bis 35 %:
              </p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-1.5 text-muted-foreground font-medium">Monatsumsatz</th>
                    <th className="text-right py-1.5 text-muted-foreground font-medium">Provision</th>
                    <th className="text-right py-1.5 text-muted-foreground font-medium">Mehrverdienst*</th>
                  </tr>
                </thead>
                <tbody>
                  {B2B_STAFFEL.map((s, i) => {
                    const isCurrentTier = s.provision === currentB2BStufe.provision;
                    const exampleUmsatz = s.min || 2500;
                    const mehrverdienst = exampleUmsatz * (s.provision / 100);
                    return (
                      <tr key={i} className={`border-b border-border/40 ${isCurrentTier ? "bg-primary/5" : ""}`}>
                        <td className="py-2 font-medium text-foreground">
                          {s.max ? `${s.min.toLocaleString("de-DE")}–${s.max.toLocaleString("de-DE")} €` : `ab ${s.min.toLocaleString("de-DE")} €`}
                          {isCurrentTier && <Badge className="ml-2 gradient-brand border-0 text-white text-[8px] px-1.5 py-0">Du</Badge>}
                        </td>
                        <td className="py-2 text-right font-bold text-foreground">{s.provision} %</td>
                        <td className="py-2 text-right font-semibold text-primary">{mehrverdienst.toLocaleString("de-DE")} €</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-[10px] text-muted-foreground mt-2">* Beispiel-Mehrverdienst bei Einstiegsumsatz der Stufe</p>
              <div className="mt-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-[11px] text-foreground flex items-center gap-1.5">
                  <Info className="h-3 w-3 text-primary shrink-0" />
                  <span><strong>Wiederkehrend:</strong> Bestandsprovision bei automatischer Vertragsverlängerung</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Gamification Hero ── */}
        <div className="gradient-brand rounded-2xl p-6 text-white shadow-crm-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <Trophy className="w-full h-full" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
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
            <div className="md:ml-auto flex gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 text-center border border-white/10">
                <p className="text-2xl font-display font-bold">{achievements.filter(a => a.unlocked).length}/{achievements.length}</p>
                <p className="text-[11px] text-white/70">Meilensteine</p>
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
            {isAdmin && <Badge variant="outline" className="text-[10px] ml-auto border-primary/30 text-primary">Admin: Klicke auf ✏️ um Prämien zu bearbeiten</Badge>}
          </div>
          <p className="text-xs text-muted-foreground mb-5">Sammle XP durch B2C-Inserate, B2B-Verkäufe, Streaks und Meilensteine – je höher dein Level, desto größer die Prämie!</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {levels.map((lvl) => {
              const isCurrentLevel2 = lvl.level === currentLevel.level;
              const isReached = MY_XP >= lvl.minXP;
              const status = claimedStatus[lvl.level] || "none";
              const hasReward = !!(lvl.reward && lvl.rewardLabel);
              return (
                <div
                  key={lvl.level}
                  className={`rounded-xl p-4 border text-center transition-all relative ${
                    isCurrentLevel2
                      ? "border-primary/40 bg-primary/5 shadow-crm-sm ring-2 ring-primary/20"
                      : isReached
                      ? "border-success/30 bg-success/5"
                      : "border-border bg-muted/20 opacity-60"
                  }`}
                >
                  {isCurrentLevel2 && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 gradient-brand border-0 text-white text-[8px] px-2 py-0">
                      Aktuell
                    </Badge>
                  )}
                  {/* Admin edit button for all levels */}
                  {isAdmin && (
                    <button
                      onClick={() => setEditLevelDialog({ ...lvl })}
                      className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-primary transition-colors"
                      title="Prämie bearbeiten"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  )}
                  <div className="text-3xl mb-1">{lvl.icon}</div>
                  <p className="text-xs font-bold text-foreground">Level {lvl.level}</p>
                  <p className="text-[11px] font-semibold text-foreground">{lvl.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{lvl.minXP.toLocaleString("de-DE")} XP</p>
                  {hasReward ? (
                    <div className={`mt-2 pt-2 border-t ${isReached ? "border-success/20" : "border-border"}`}>
                      <div className="text-xl mb-0.5">{lvl.reward}</div>
                      <p className={`text-[10px] font-bold leading-tight ${isReached ? "text-success" : "text-muted-foreground"}`}>
                        {lvl.rewardLabel}
                      </p>
                      {isReached && status === "none" && (
                        <>
                          <Badge variant="outline" className="text-[8px] mt-1 border-success/30 text-success bg-success/10">
                            ✓ Freigeschaltet
                          </Badge>
                          <Button
                            size="sm"
                            className="mt-2 h-6 text-[9px] px-2 gradient-brand border-0 text-white w-full"
                            onClick={() => openClaimDialog(lvl)}
                          >
                            <PackageCheck className="h-3 w-3 mr-1" /> Anfordern
                          </Button>
                        </>
                      )}
                      {isReached && status === "requested" && (
                        <>
                          <Badge variant="outline" className="text-[8px] mt-1 border-warning/30 text-warning bg-warning/10">
                            <Clock className="h-2.5 w-2.5 mr-0.5" /> Angefordert
                          </Badge>
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2 h-6 text-[9px] px-2 w-full border-success/30 text-success hover:bg-success/10"
                              onClick={() => confirmClaim(lvl.level)}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Bestätigen
                            </Button>
                          )}
                        </>
                      )}
                      {isReached && status === "confirmed" && (
                        <Badge className="mt-1 text-[8px] bg-success text-success-foreground border-0">
                          <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" /> Erhalten
                        </Badge>
                      )}
                      {!isReached && (
                        <p className="text-[9px] text-muted-foreground mt-1 italic">Noch {(lvl.minXP - MY_XP).toLocaleString("de-DE")} XP</p>
                      )}
                    </div>
                  ) : (
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
              <span><strong>So sammelst du XP:</strong> B2C Lead (+10) · Eigentümer-Inserat via Code (+50) · Entwickler-Registrierung via Code (+200) · B2B Verkauf (+300) · Streak (+10/Tag) · Meilenstein (variabel) · Top-3 Ranking (+100)</span>
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

        {/* ── Meilensteine Grid ── */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-display font-semibold text-foreground">Meilensteine</h2>
            {isAdmin && (
              <Button
                size="sm"
                variant="outline"
                className="ml-auto h-7 text-[10px] gap-1 border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => setAddAchievementDialog(true)}
              >
                <Plus className="h-3 w-3" /> Meilenstein hinzufügen
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {achievements.filter(a => !a.draft || isAdmin).map((a) => (
              <div
                key={a.id}
                className={`rounded-xl p-4 border transition-all relative ${
                  a.draft
                    ? "border-dashed border-border opacity-40"
                    : a.unlocked
                    ? "bg-primary/5 border-primary/20 shadow-crm-sm"
                    : "bg-primary/[0.02] border-primary/10"
                }`}
              >
                {a.draft && isAdmin && (
                  <Badge variant="outline" className="absolute -top-2 left-3 text-[8px] border-muted-foreground/30 text-muted-foreground bg-background">
                    Entwurf
                  </Badge>
                )}
                {/* Admin edit/delete */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                      onClick={() => setEditAchievementDialog({ ...a })}
                      className="p-1 rounded hover:bg-muted/60 text-muted-foreground hover:text-primary transition-colors"
                      title="Bearbeiten"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => deleteAchievement(a.id)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Löschen"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${a.draft ? "bg-muted text-muted-foreground" : a.unlocked ? "gradient-brand text-white" : "gradient-brand text-white opacity-50"}`}>
                    {ICON_MAP[a.iconName] || <Award className="h-5 w-5" />}
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
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground">
                <Info className="h-3 w-3 inline mr-1 text-primary" />
                Nach dem Absenden wird dein Admin / Vertriebsleiter benachrichtigt. Sobald die Prämie bestätigt wurde, wird sie als „Erhalten" angezeigt.
              </p>
            </div>
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
                  <Select value={claimForm.land} onValueChange={(v) => setClaimForm(p => ({ ...p, land: v }))}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Deutschland">🇩🇪 Deutschland</SelectItem>
                      <SelectItem value="Österreich">🇦🇹 Österreich</SelectItem>
                      <SelectItem value="Schweiz">🇨🇭 Schweiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Anmerkung (optional)</Label>
              <Textarea placeholder="z.B. bevorzugte Farbe, Größe, ..." value={claimForm.anmerkung} onChange={(e) => setClaimForm(p => ({ ...p, anmerkung: e.target.value }))} className="text-sm min-h-[60px]" rows={2} />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setClaimDialogOpen(false)}>Abbrechen</Button>
            <Button className="gradient-brand border-0 text-white" onClick={submitClaim}>
              <Send className="h-4 w-4 mr-1.5" /> Prämie anfordern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Admin: Level-Prämie bearbeiten Dialog ── */}
      <Dialog open={!!editLevelDialog} onOpenChange={(open) => !open && setEditLevelDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" />
              Level {editLevelDialog?.level} – Sachprämie bearbeiten
            </DialogTitle>
          </DialogHeader>
          {editLevelDialog && (
            <div className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Level-Titel</Label>
                <Input value={editLevelDialog.title} onChange={(e) => setEditLevelDialog({ ...editLevelDialog, title: e.target.value })} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Mindest-XP</Label>
                <Input type="number" value={editLevelDialog.minXP} onChange={(e) => setEditLevelDialog({ ...editLevelDialog, minXP: parseInt(e.target.value) || 0 })} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Icon (Emoji)</Label>
                <Input value={editLevelDialog.icon} onChange={(e) => setEditLevelDialog({ ...editLevelDialog, icon: e.target.value })} className="h-9 text-sm" placeholder="z.B. 🔥" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Sachprämie Emoji (leer = keine Prämie)</Label>
                <Input value={editLevelDialog.reward || ""} onChange={(e) => setEditLevelDialog({ ...editLevelDialog, reward: e.target.value || null })} className="h-9 text-sm" placeholder="z.B. 📱" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Sachprämie Beschreibung</Label>
                <Input value={editLevelDialog.rewardLabel || ""} onChange={(e) => setEditLevelDialog({ ...editLevelDialog, rewardLabel: e.target.value || null })} className="h-9 text-sm" placeholder="z.B. Apple iPhone 16 Pro" />
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditLevelDialog(null)}>Abbrechen</Button>
            <Button className="gradient-brand border-0 text-white" onClick={saveLevelEdit}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Admin: Achievement bearbeiten Dialog ── */}
      <Dialog open={!!editAchievementDialog} onOpenChange={(open) => !open && setEditAchievementDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" />
              Meilenstein bearbeiten
            </DialogTitle>
          </DialogHeader>
          {editAchievementDialog && (
            <div className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Titel *</Label>
                <Input value={editAchievementDialog.title} onChange={(e) => setEditAchievementDialog({ ...editAchievementDialog, title: e.target.value })} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Beschreibung *</Label>
                <Input value={editAchievementDialog.description} onChange={(e) => setEditAchievementDialog({ ...editAchievementDialog, description: e.target.value })} className="h-9 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Icon</Label>
                  <Select value={editAchievementDialog.iconName} onValueChange={(v) => setEditAchievementDialog({ ...editAchievementDialog, iconName: v })}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((ico) => (
                        <SelectItem key={ico} value={ico}>
                          <span className="flex items-center gap-2">{ICON_MAP[ico]} {ico}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">XP-Belohnung</Label>
                  <Input type="number" value={editAchievementDialog.xpReward} onChange={(e) => setEditAchievementDialog({ ...editAchievementDialog, xpReward: parseInt(e.target.value) || 0 })} className="h-9 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Bonus-Text (optional, z.B. "🎁 +25 € Bonus!")</Label>
                <Input value={editAchievementDialog.bonusText || ""} onChange={(e) => setEditAchievementDialog({ ...editAchievementDialog, bonusText: e.target.value })} className="h-9 text-sm" />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border">
                <input
                  type="checkbox"
                  id="edit-draft-toggle"
                  checked={editAchievementDialog.draft || false}
                  onChange={(e) => setEditAchievementDialog({ ...editAchievementDialog, draft: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="edit-draft-toggle" className="text-xs cursor-pointer">
                  Als Entwurf speichern <span className="text-muted-foreground">(nur für Admins sichtbar)</span>
                </Label>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="destructive" size="sm" onClick={() => editAchievementDialog && deleteAchievement(editAchievementDialog.id)} className="mr-auto">
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Löschen
            </Button>
            <Button variant="outline" onClick={() => setEditAchievementDialog(null)}>Abbrechen</Button>
            <Button className="gradient-brand border-0 text-white" onClick={saveAchievementEdit}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Admin: Neues Achievement Dialog ── */}
      <Dialog open={addAchievementDialog} onOpenChange={setAddAchievementDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              Neuen Meilenstein erstellen
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Titel *</Label>
              <Input value={newAchievement.title} onChange={(e) => setNewAchievement(p => ({ ...p, title: e.target.value }))} className="h-9 text-sm" placeholder="z.B. 100er Club" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Beschreibung *</Label>
              <Input value={newAchievement.description} onChange={(e) => setNewAchievement(p => ({ ...p, description: e.target.value }))} className="h-9 text-sm" placeholder="z.B. 100 B2C-Kontakte angelegt" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Icon</Label>
                <Select value={newAchievement.iconName} onValueChange={(v) => setNewAchievement(p => ({ ...p, iconName: v }))}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((ico) => (
                      <SelectItem key={ico} value={ico}>
                        <span className="flex items-center gap-2">{ICON_MAP[ico]} {ico}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">XP-Belohnung</Label>
                <Input type="number" value={newAchievement.xpReward} onChange={(e) => setNewAchievement(p => ({ ...p, xpReward: parseInt(e.target.value) || 0 }))} className="h-9 text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Bonus-Text (optional)</Label>
              <Input value={newAchievement.bonusText || ""} onChange={(e) => setNewAchievement(p => ({ ...p, bonusText: e.target.value }))} className="h-9 text-sm" placeholder="z.B. 🎁 +50 € Bonus!" />
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border">
              <input
                type="checkbox"
                id="new-draft-toggle"
                checked={newAchievement.draft || false}
                onChange={(e) => setNewAchievement(p => ({ ...p, draft: e.target.checked }))}
                className="h-4 w-4 rounded border-border"
              />
              <Label htmlFor="new-draft-toggle" className="text-xs cursor-pointer">
                Als Entwurf erstellen <span className="text-muted-foreground">(nur für Admins sichtbar)</span>
              </Label>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setAddAchievementDialog(false)}>Abbrechen</Button>
            <Button className="gradient-brand border-0 text-white" onClick={addNewAchievement}>
              <Plus className="h-4 w-4 mr-1" /> Erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CRMLayout>
  );
}
