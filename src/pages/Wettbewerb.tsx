import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Trophy, Medal, Plus, Crown, Flame, Star, Award, ChevronDown, ChevronUp, Zap, Target,
} from "lucide-react";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Challenge {
  id: string;
  title: string;
  description: string;
  monat: string;
  ziel: number;
  einheit: string;
  preis: string;
  preisIcon: string;
  aktiv: boolean;
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

const CHALLENGES: Challenge[] = [
  {
    id: "1", title: "B2C Inserate Sprint", description: "Wer schafft die meisten B2C-Inserate im Februar?", monat: "Februar 2026", ziel: 50, einheit: "Inserate", preis: "Apple AirPods Pro", preisIcon: "🎧", aktiv: true,
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
    id: "2", title: "B2B Power-Monat", description: "5 neue B2B-Registrierungen im März", monat: "März 2026", ziel: 5, einheit: "Registrierungen", preis: "Weekend-Trip", preisIcon: "✈️", aktiv: true,
    leaderboard: [
      { rank: 1, name: "Anna Schmidt", initials: "AS", color: "hsl(340,75%,55%)", wert: 4, einheit: "Reg.", fortschritt: 80 },
      { rank: 2, name: "Max Müller", initials: "MM", color: "hsl(250,60%,52%)", wert: 3, einheit: "Reg.", fortschritt: 60 },
      { rank: 3, name: "Tom Fischer", initials: "TF", color: "hsl(152,60%,42%)", wert: 2, einheit: "Reg.", fortschritt: 40 },
      { rank: 4, name: "Lisa Weber", initials: "LW", color: "hsl(38,92%,50%)", wert: 1, einheit: "Reg.", fortschritt: 20 },
    ],
  },
  {
    id: "3", title: "Conversion-König", description: "Höchste Abschlussquote im Team", monat: "Februar 2026", ziel: 30, einheit: "% Abschlussquote", preis: "500 € Bonus", preisIcon: "💰", aktiv: true,
    leaderboard: [
      { rank: 1, name: "Tom Fischer", initials: "TF", color: "hsl(152,60%,42%)", wert: 28, einheit: "%", fortschritt: 93 },
      { rank: 2, name: "Max Müller", initials: "MM", color: "hsl(250,60%,52%)", wert: 24, einheit: "%", fortschritt: 80 },
      { rank: 3, name: "Sarah Koch", initials: "SK", color: "hsl(280,60%,52%)", wert: 21, einheit: "%", fortschritt: 70 },
      { rank: 4, name: "Anna Schmidt", initials: "AS", color: "hsl(340,75%,55%)", wert: 19, einheit: "%", fortschritt: 63 },
      { rank: 5, name: "Lisa Weber", initials: "LW", color: "hsl(38,92%,50%)", wert: 15, einheit: "%", fortschritt: 50 },
    ],
  },
  {
    id: "4", title: "Telefon-Marathon", description: "100 Anrufe im Januar schaffen", monat: "Januar 2026", ziel: 100, einheit: "Anrufe", preis: "Montblanc Kugelschreiber", preisIcon: "🖊️", aktiv: false,
    leaderboard: [
      { rank: 1, name: "Max Müller", initials: "MM", color: "hsl(250,60%,52%)", wert: 112, einheit: "Anrufe", fortschritt: 100 },
      { rank: 2, name: "Anna Schmidt", initials: "AS", color: "hsl(340,75%,55%)", wert: 98, einheit: "Anrufe", fortschritt: 98 },
      { rank: 3, name: "Tom Fischer", initials: "TF", color: "hsl(152,60%,42%)", wert: 87, einheit: "Anrufe", fortschritt: 87 },
    ],
  },
];

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

function ChallengeCard({ challenge, isExpanded, onToggle }: { challenge: Challenge; isExpanded: boolean; onToggle: () => void }) {
  const myProgress = challenge.aktiv ? Math.floor(Math.random() * 80 + 10) : 100;
  const myRank = challenge.leaderboard.find((e) => e.name === "Max Müller");
  const daysLeft = challenge.aktiv ? Math.floor(Math.random() * 20 + 3) : 0;

  return (
    <div className={`bg-card rounded-xl border border-border shadow-crm-sm overflow-hidden transition-all ${!challenge.aktiv ? "opacity-60" : ""}`}>
      {/* Card Header - clickable */}
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
            <Badge variant={challenge.aktiv ? "default" : "secondary"} className={challenge.aktiv ? "gradient-brand border-0 text-primary-foreground" : ""}>
              {challenge.aktiv ? "Aktiv" : "Beendet"}
            </Badge>
            {challenge.aktiv ? (
              isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : null}
          </div>
        </div>

        {/* Stats Row */}
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
            <p className="text-[10px] text-muted-foreground uppercase">{challenge.aktiv ? "Verbleibend" : "Dein Platz"}</p>
            <p className="text-sm font-semibold text-foreground">
              {challenge.aktiv ? `${daysLeft} Tage` : myRank ? `#${myRank.rank}` : "–"}
            </p>
          </div>
        </div>

        {/* Progress */}
        {challenge.aktiv && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1"><Zap className="h-3 w-3" /> Dein Fortschritt</span>
              <span className="font-semibold text-foreground">{myProgress}%</span>
            </div>
            <Progress value={myProgress} className="h-2" />
          </div>
        )}
      </button>

      {/* Expanded Ranking */}
      {isExpanded && challenge.aktiv && (
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

export default function Wettbewerb() {
  const { currentRoleId } = useUserRole();
  const isAdmin = currentRoleId === "admin" || currentRoleId === "vertriebsleiter";
  const [expandedId, setExpandedId] = useState<string | null>(CHALLENGES.find(c => c.aktiv)?.id ?? null);

  const activeChallenges = CHALLENGES.filter((c) => c.aktiv);
  const pastChallenges = CHALLENGES.filter((c) => !c.aktiv);

  const toggleExpand = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  // Hero stats
  const totalChallenges = activeChallenges.length;
  const myBestRank = Math.min(...CHALLENGES.flatMap(c => c.leaderboard.filter(e => e.name === "Max Müller").map(e => e.rank)));

  return (
    <CRMLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl gradient-brand flex items-center justify-center shadow-crm-sm">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Wettbewerb</h1>
              <p className="text-sm text-muted-foreground">Challenges, Ranglisten & Prämien</p>
            </div>
          </div>
          {isAdmin && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-1 gradient-brand border-0 text-primary-foreground">
                  <Plus className="h-4 w-4" /> Challenge erstellen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neue Challenge erstellen</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                  <Input placeholder="Titel der Challenge" />
                  <Input placeholder="Beschreibung" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Monat (z.B. März 2026)" />
                    <Input placeholder="Zielwert" type="number" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Einheit (z.B. Inserate)" />
                    <Input placeholder="Preis (z.B. iPhone 16)" />
                  </div>
                  <Button className="w-full gradient-brand border-0 text-primary-foreground">Challenge speichern</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3 shadow-crm-sm">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Flame className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalChallenges}</p>
              <p className="text-xs text-muted-foreground">Aktive Challenges</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3 shadow-crm-sm">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Crown className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">#{myBestRank}</p>
              <p className="text-xs text-muted-foreground">Beste Platzierung</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3 shadow-crm-sm">
            <div className="h-10 w-10 rounded-lg bg-accent/40 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">4</p>
              <p className="text-xs text-muted-foreground">Prämien verfügbar</p>
            </div>
          </div>
        </div>

        {/* Active Challenges */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Flame className="h-4 w-4 text-destructive" /> Aktive Challenges ({activeChallenges.length})
          </h2>
          <div className="space-y-4">
            {activeChallenges.map((c) => (
              <ChallengeCard key={c.id} challenge={c} isExpanded={expandedId === c.id} onToggle={() => toggleExpand(c.id)} />
            ))}
          </div>
        </div>

        {/* Past Challenges */}
        {pastChallenges.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Vergangene Challenges
            </h2>
            <div className="space-y-4">
              {pastChallenges.map((c) => (
                <ChallengeCard key={c.id} challenge={c} isExpanded={expandedId === c.id} onToggle={() => toggleExpand(c.id)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </CRMLayout>
  );
}
