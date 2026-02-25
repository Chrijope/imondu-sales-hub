import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Trophy, Medal, Plus, Crown, Flame, Star, Award, ChevronDown, ChevronUp, Zap, Target, Pencil, Trash2, Calendar,
} from "lucide-react";
import { useUserRole } from "@/contexts/UserRoleContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  monat: string;
  startDatum: string; // ISO date
  endDatum: string;   // ISO date
  ziel: number;
  einheit: string;
  preis: string;
  preisIcon: string;
  leaderboard: LeaderboardEntry[];
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  initials: string;
  color: string;
  wert: number;
  einheit: string;
  fortschritt: number;
}

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "1", title: "B2C Inserate Sprint", description: "Wer schafft die meisten B2C-Inserate im Februar?",
    monat: "Februar 2026", startDatum: "2026-02-01", endDatum: "2026-02-28",
    ziel: 50, einheit: "Inserate", preis: "Apple AirPods Pro", preisIcon: "🎧",
    leaderboard: [
      { rank: 1, name: "Max Müller", initials: "MM", color: "hsl(250,60%,52%)", wert: 42, einheit: "Inserate", fortschritt: 84 },
      { rank: 2, name: "Anna Schmidt", initials: "AS", color: "hsl(340,75%,55%)", wert: 38, einheit: "Inserate", fortschritt: 76 },
      { rank: 3, name: "Tom Fischer", initials: "TF", color: "hsl(152,60%,42%)", wert: 31, einheit: "Inserate", fortschritt: 62 },
      { rank: 4, name: "Lisa Weber", initials: "LW", color: "hsl(38,92%,50%)", wert: 27, einheit: "Inserate", fortschritt: 54 },
      { rank: 5, name: "Jan Becker", initials: "JB", color: "hsl(210,80%,52%)", wert: 22, einheit: "Inserate", fortschritt: 44 },
      { rank: 6, name: "Sarah Koch", initials: "SK", color: "hsl(280,60%,52%)", wert: 18, einheit: "Inserate", fortschritt: 36 },
    ],
  },
  {
    id: "2", title: "B2B Power-Monat", description: "5 neue B2B-Registrierungen im März",
    monat: "März 2026", startDatum: "2026-03-01", endDatum: "2026-03-31",
    ziel: 5, einheit: "Registrierungen", preis: "Weekend-Trip", preisIcon: "✈️",
    leaderboard: [
      { rank: 1, name: "Anna Schmidt", initials: "AS", color: "hsl(340,75%,55%)", wert: 4, einheit: "Reg.", fortschritt: 80 },
      { rank: 2, name: "Max Müller", initials: "MM", color: "hsl(250,60%,52%)", wert: 3, einheit: "Reg.", fortschritt: 60 },
      { rank: 3, name: "Tom Fischer", initials: "TF", color: "hsl(152,60%,42%)", wert: 2, einheit: "Reg.", fortschritt: 40 },
      { rank: 4, name: "Lisa Weber", initials: "LW", color: "hsl(38,92%,50%)", wert: 1, einheit: "Reg.", fortschritt: 20 },
    ],
  },
  {
    id: "3", title: "Conversion-König", description: "Höchste Abschlussquote im Team",
    monat: "Februar 2026", startDatum: "2026-02-01", endDatum: "2026-02-28",
    ziel: 30, einheit: "% Abschlussquote", preis: "500 € Bonus", preisIcon: "💰",
    leaderboard: [
      { rank: 1, name: "Tom Fischer", initials: "TF", color: "hsl(152,60%,42%)", wert: 28, einheit: "%", fortschritt: 93 },
      { rank: 2, name: "Max Müller", initials: "MM", color: "hsl(250,60%,52%)", wert: 24, einheit: "%", fortschritt: 80 },
      { rank: 3, name: "Sarah Koch", initials: "SK", color: "hsl(280,60%,52%)", wert: 21, einheit: "%", fortschritt: 70 },
      { rank: 4, name: "Anna Schmidt", initials: "AS", color: "hsl(340,75%,55%)", wert: 19, einheit: "%", fortschritt: 63 },
      { rank: 5, name: "Lisa Weber", initials: "LW", color: "hsl(38,92%,50%)", wert: 15, einheit: "%", fortschritt: 50 },
    ],
  },
  {
    id: "4", title: "Telefon-Marathon", description: "100 Anrufe im Januar schaffen",
    monat: "Januar 2026", startDatum: "2026-01-01", endDatum: "2026-01-31",
    ziel: 100, einheit: "Anrufe", preis: "Montblanc Kugelschreiber", preisIcon: "🖊️",
    leaderboard: [
      { rank: 1, name: "Max Müller", initials: "MM", color: "hsl(250,60%,52%)", wert: 112, einheit: "Anrufe", fortschritt: 100 },
      { rank: 2, name: "Anna Schmidt", initials: "AS", color: "hsl(340,75%,55%)", wert: 98, einheit: "Anrufe", fortschritt: 98 },
      { rank: 3, name: "Tom Fischer", initials: "TF", color: "hsl(152,60%,42%)", wert: 87, einheit: "Anrufe", fortschritt: 87 },
    ],
  },
];

const TODAY = "2026-02-25";

function isActive(c: Challenge): boolean {
  return c.endDatum >= TODAY && c.startDatum <= TODAY;
}

function daysLeft(c: Challenge): number {
  const end = new Date(c.endDatum);
  const now = new Date(TODAY);
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

const rankIcons = [Crown, Medal, Award];
const rankColors = ["text-warning", "text-muted-foreground", "text-[hsl(25,60%,50%)]"];

function Podium({ top3 }: { top3: LeaderboardEntry[] }) {
  if (top3.length < 3) return null;
  const order = [top3[1], top3[0], top3[2]];
  const heights = ["h-16", "h-24", "h-12"];
  const sizes = ["h-10 w-10 text-xs", "h-14 w-14 text-base", "h-10 w-10 text-xs"];
  const labels = ["2.", "1.", "3."];
  const RankIcons = [Medal, Crown, Award];
  const iconColors = [rankColors[1], rankColors[0], rankColors[2]];

  return (
    <div className="flex items-end justify-center gap-3 mb-4 pt-4">
      {order.map((entry, i) => {
        const Icon = RankIcons[i];
        const isMe = entry.name === "Max Müller";
        return (
          <div key={entry.rank} className="flex flex-col items-center gap-1">
            <Icon className={`h-4 w-4 ${iconColors[i]}`} />
            <div
              className={`rounded-full flex items-center justify-center font-bold text-primary-foreground ring-2 ring-background shadow-md ${sizes[i]} ${isMe ? "ring-primary" : ""}`}
              style={{ background: entry.color }}
            >
              {entry.initials}
            </div>
            <span className={`text-[11px] font-semibold ${isMe ? "text-primary" : "text-foreground"}`}>{entry.name.split(" ")[0]}</span>
            <span className="text-xs font-bold text-foreground">{entry.wert} <span className="text-muted-foreground font-normal">{entry.einheit}</span></span>
            <div className={`${heights[i]} w-16 rounded-t-lg ${i === 1 ? "gradient-brand" : "bg-secondary"} flex items-end justify-center pb-1`}>
              <span className={`text-xs font-bold ${i === 1 ? "text-primary-foreground" : "text-muted-foreground"}`}>{labels[i]}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChallengeCard({ challenge, active, isExpanded, onToggle, isAdmin, onEdit, onDelete }: {
  challenge: Challenge; active: boolean; isExpanded: boolean; onToggle: () => void;
  isAdmin: boolean; onEdit: () => void; onDelete: () => void;
}) {
  const myRank = challenge.leaderboard.find((e) => e.name === "Max Müller");
  const days = daysLeft(challenge);
  const myProgress = active ? (myRank ? myRank.fortschritt : 0) : 100;

  return (
    <div className={`glass-card rounded-xl overflow-hidden transition-all ${!active ? "opacity-70" : ""}`}>
      <button onClick={onToggle} className="w-full text-left p-5 hover:bg-muted/30 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{challenge.preisIcon}</span>
            <div>
              <h3 className="text-base font-bold text-foreground">{challenge.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{challenge.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                  className="p-1.5 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-primary transition-colors"
                  title="Bearbeiten"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Löschen"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
            <Badge variant={active ? "default" : "secondary"} className={active ? "gradient-brand border-0 text-primary-foreground" : ""}>
              {active ? "Aktiv" : "Beendet"}
            </Badge>
            {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-muted/40 rounded-lg px-3 py-2">
            <p className="text-[10px] text-muted-foreground uppercase">Zeitraum</p>
            <p className="text-sm font-semibold text-foreground">{challenge.monat}</p>
          </div>
          <div className="bg-muted/40 rounded-lg px-3 py-2">
            <p className="text-[10px] text-muted-foreground uppercase">Ziel</p>
            <p className="text-sm font-semibold text-foreground">{challenge.ziel} {challenge.einheit}</p>
          </div>
          <div className="bg-muted/40 rounded-lg px-3 py-2">
            <p className="text-[10px] text-muted-foreground uppercase">Preis</p>
            <p className="text-sm font-semibold text-foreground">{challenge.preis}</p>
          </div>
          <div className="bg-muted/40 rounded-lg px-3 py-2">
            <p className="text-[10px] text-muted-foreground uppercase">{active ? "Verbleibend" : "Dein Platz"}</p>
            <p className="text-sm font-semibold text-foreground">
              {active ? `${days} Tage` : myRank ? `#${myRank.rank}` : "–"}
            </p>
          </div>
        </div>

        {active && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1"><Zap className="h-3 w-3" /> Dein Fortschritt</span>
              <span className="font-semibold text-foreground">{myProgress}%</span>
            </div>
            <Progress value={myProgress} className="h-2" />
          </div>
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-border bg-muted/10 px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-4 w-4 text-warning" />
            <h4 className="text-sm font-semibold text-foreground">Ranking – {challenge.title}</h4>
          </div>
          {challenge.leaderboard.length >= 3 && <Podium top3={challenge.leaderboard.slice(0, 3)} />}
          <div className="divide-y divide-border/40 rounded-lg border border-border bg-card overflow-hidden">
            {challenge.leaderboard.map((entry) => {
              const RankIcon = entry.rank <= 3 ? rankIcons[entry.rank - 1] : Star;
              const isMe = entry.name === "Max Müller";
              return (
                <div key={entry.rank} className={`flex items-center gap-3 px-4 py-2.5 ${isMe ? "bg-primary/5 border-l-2 border-l-primary" : ""} transition-colors`}>
                  <div className="w-7 text-center">
                    {entry.rank <= 3 ? (
                      <RankIcon className={`h-4 w-4 mx-auto ${rankColors[entry.rank - 1]}`} />
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">{entry.rank}</span>
                    )}
                  </div>
                  <div className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground" style={{ background: entry.color }}>
                    {entry.initials}
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${isMe ? "text-primary" : "text-foreground"}`}>{entry.name}</span>
                    {isMe && <Badge className="ml-2 text-[9px] gradient-brand border-0 text-primary-foreground py-0 px-1.5">Du</Badge>}
                  </div>
                  <div className="text-right mr-2">
                    <span className="text-sm font-bold text-foreground">{entry.wert}</span>
                    <span className="text-xs text-muted-foreground ml-1">{entry.einheit}</span>
                  </div>
                  <div className="w-20">
                    <Progress value={entry.fortschritt} className="h-1.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const EMPTY_CHALLENGE: Omit<Challenge, "id" | "leaderboard"> = {
  title: "", description: "", monat: "", startDatum: "", endDatum: "",
  ziel: 0, einheit: "", preis: "", preisIcon: "🏆",
};

export default function Wettbewerb() {
  const { currentRoleId } = useUserRole();
  const { toast } = useToast();
  const isAdmin = currentRoleId === "admin" || currentRoleId === "vertriebsleiter";
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [expandedId, setExpandedId] = useState<string | null>(challenges.find(c => isActive(c))?.id ?? null);
  const [pastOpen, setPastOpen] = useState(false);

  // Dialog
  const [editDialog, setEditDialog] = useState<Challenge | null>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [form, setForm] = useState(EMPTY_CHALLENGE);

  const activeChallenges = challenges.filter(isActive);
  const pastChallenges = challenges.filter(c => !isActive(c));
  const toggleExpand = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  const myBestRank = Math.min(...challenges.flatMap(c => c.leaderboard.filter(e => e.name === "Max Müller").map(e => e.rank)), 99);

  const openCreate = () => {
    setForm(EMPTY_CHALLENGE);
    setCreateDialog(true);
  };

  const openEdit = (c: Challenge) => {
    setForm({ title: c.title, description: c.description, monat: c.monat, startDatum: c.startDatum, endDatum: c.endDatum, ziel: c.ziel, einheit: c.einheit, preis: c.preis, preisIcon: c.preisIcon });
    setEditDialog(c);
  };

  const saveCreate = () => {
    if (!form.title || !form.startDatum || !form.endDatum) {
      toast({ title: "Titel und Zeitraum erforderlich", variant: "destructive" });
      return;
    }
    const newC: Challenge = { ...form, id: `ch-${Date.now()}`, leaderboard: [] };
    setChallenges(prev => [...prev, newC]);
    toast({ title: "Challenge erstellt ✓" });
    setCreateDialog(false);
  };

  const saveEdit = () => {
    if (!editDialog) return;
    setChallenges(prev => prev.map(c => c.id === editDialog.id ? { ...c, ...form } : c));
    toast({ title: "Challenge aktualisiert ✓" });
    setEditDialog(null);
  };

  const deleteChallenge = (id: string) => {
    setChallenges(prev => prev.filter(c => c.id !== id));
    toast({ title: "Challenge gelöscht" });
  };

  const formFields = (
    <div className="space-y-3 mt-2">
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-3 space-y-1.5">
          <Label className="text-xs">Titel *</Label>
          <Input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} className="h-9 text-sm" placeholder="z.B. B2C Sprint März" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Icon</Label>
          <Input value={form.preisIcon} onChange={(e) => setForm(p => ({ ...p, preisIcon: e.target.value }))} className="h-9 text-sm text-center" placeholder="🏆" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Beschreibung</Label>
        <Input value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} className="h-9 text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Startdatum *</Label>
          <Input type="date" value={form.startDatum} onChange={(e) => setForm(p => ({ ...p, startDatum: e.target.value }))} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Enddatum *</Label>
          <Input type="date" value={form.endDatum} onChange={(e) => setForm(p => ({ ...p, endDatum: e.target.value }))} className="h-9 text-sm" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Anzeige-Monat</Label>
        <Input value={form.monat} onChange={(e) => setForm(p => ({ ...p, monat: e.target.value }))} className="h-9 text-sm" placeholder="z.B. März 2026" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Zielwert</Label>
          <Input type="number" value={form.ziel || ""} onChange={(e) => setForm(p => ({ ...p, ziel: parseInt(e.target.value) || 0 }))} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Einheit</Label>
          <Input value={form.einheit} onChange={(e) => setForm(p => ({ ...p, einheit: e.target.value }))} className="h-9 text-sm" placeholder="Inserate" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Preis</Label>
          <Input value={form.preis} onChange={(e) => setForm(p => ({ ...p, preis: e.target.value }))} className="h-9 text-sm" placeholder="AirPods Pro" />
        </div>
      </div>
    </div>
  );

  return (
    <CRMLayout>
      <div className="space-y-6 min-h-screen dashboard-mesh-bg p-6 lg:p-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-1 rounded-full gradient-brand" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Wettbewerb</h1>
            <p className="text-sm text-muted-foreground mt-1">Challenges, Ranglisten & Prämien</p>
          </div>
          {isAdmin && (
            <Button className="gap-1 gradient-brand border-0 text-primary-foreground" onClick={openCreate}>
              <Plus className="h-4 w-4" /> Challenge erstellen
            </Button>
          )}
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Flame className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeChallenges.length}</p>
              <p className="text-xs text-muted-foreground">Aktive Challenges</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Crown className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">#{myBestRank < 99 ? myBestRank : "–"}</p>
              <p className="text-xs text-muted-foreground">Beste Platzierung</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/40 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{challenges.length}</p>
              <p className="text-xs text-muted-foreground">Challenges gesamt</p>
            </div>
          </div>
        </div>

        {/* Active Challenges */}
        {activeChallenges.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <Flame className="h-4 w-4 text-destructive" /> Aktive Challenges ({activeChallenges.length})
            </h2>
            <div className="space-y-4">
              {activeChallenges.map((c) => (
                <ChallengeCard
                  key={c.id} challenge={c} active isExpanded={expandedId === c.id}
                  onToggle={() => toggleExpand(c.id)} isAdmin={isAdmin}
                  onEdit={() => openEdit(c)} onDelete={() => deleteChallenge(c.id)}
                />
              ))}
            </div>
          </div>
        )}

        {activeChallenges.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center">
            <Trophy className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Aktuell keine aktiven Challenges.</p>
            {isAdmin && (
              <Button className="mt-3 gradient-brand border-0 text-primary-foreground" onClick={openCreate}>
                <Plus className="h-4 w-4 mr-1" /> Neue Challenge erstellen
              </Button>
            )}
          </div>
        )}

        {/* Past Challenges – Collapsible */}
        {pastChallenges.length > 0 && (
          <Collapsible open={pastOpen} onOpenChange={setPastOpen}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors w-full">
                <Calendar className="h-4 w-4" />
                Vergangene Challenges ({pastChallenges.length})
                <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${pastOpen ? "rotate-180" : ""}`} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-3">
              {pastChallenges.map((c) => (
                <ChallengeCard
                  key={c.id} challenge={c} active={false} isExpanded={expandedId === c.id}
                  onToggle={() => toggleExpand(c.id)} isAdmin={isAdmin}
                  onEdit={() => openEdit(c)} onDelete={() => deleteChallenge(c.id)}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> Neue Challenge erstellen</DialogTitle>
          </DialogHeader>
          {formFields}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setCreateDialog(false)}>Abbrechen</Button>
            <Button className="gradient-brand border-0 text-white" onClick={saveCreate}>Erstellen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDialog} onOpenChange={(open) => !open && setEditDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Pencil className="h-4 w-4 text-primary" /> Challenge bearbeiten</DialogTitle>
          </DialogHeader>
          {formFields}
          <DialogFooter className="mt-4">
            <Button variant="destructive" size="sm" className="mr-auto" onClick={() => { if (editDialog) { deleteChallenge(editDialog.id); setEditDialog(null); } }}>
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Löschen
            </Button>
            <Button variant="outline" onClick={() => setEditDialog(null)}>Abbrechen</Button>
            <Button className="gradient-brand border-0 text-white" onClick={saveEdit}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CRMLayout>
  );
}
