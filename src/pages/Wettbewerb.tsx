import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Trophy, Medal, Target, Gift, Calendar, Plus, Crown, Flame, Star,
  TrendingUp, Users, Award,
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
  { id: "1", title: "B2C Inserate Sprint", description: "Wer schafft die meisten B2C-Inserate im Februar?", monat: "Februar 2026", ziel: 50, einheit: "Inserate", preis: "Apple AirPods Pro", preisIcon: "🎧", aktiv: true },
  { id: "2", title: "B2B Power-Monat", description: "5 neue B2B-Registrierungen im März", monat: "März 2026", ziel: 5, einheit: "Registrierungen", preis: "Weekend-Trip", preisIcon: "✈️", aktiv: true },
  { id: "3", title: "Conversion-König", description: "Höchste Abschlussquote im Team", monat: "Februar 2026", ziel: 30, einheit: "% Abschlussquote", preis: "500 € Bonus", preisIcon: "💰", aktiv: true },
  { id: "4", title: "Telefon-Marathon", description: "100 Anrufe im Januar schaffen", monat: "Januar 2026", ziel: 100, einheit: "Anrufe", preis: "Montblanc Kugelschreiber", preisIcon: "🖊️", aktiv: false },
];

const LEADERBOARD_B2C: LeaderboardEntry[] = [
  { rank: 1, name: "Max Müller", initials: "MM", color: "hsl(250,60%,52%)", wert: 42, einheit: "Inserate", fortschritt: 84 },
  { rank: 2, name: "Anna Schmidt", initials: "AS", color: "hsl(340,75%,55%)", wert: 38, einheit: "Inserate", fortschritt: 76 },
  { rank: 3, name: "Tom Fischer", initials: "TF", color: "hsl(152,60%,42%)", wert: 31, einheit: "Inserate", fortschritt: 62 },
  { rank: 4, name: "Lisa Weber", initials: "LW", color: "hsl(38,92%,50%)", wert: 27, einheit: "Inserate", fortschritt: 54 },
  { rank: 5, name: "Jan Becker", initials: "JB", color: "hsl(210,80%,52%)", wert: 22, einheit: "Inserate", fortschritt: 44 },
  { rank: 6, name: "Sarah Koch", initials: "SK", color: "hsl(280,60%,52%)", wert: 18, einheit: "Inserate", fortschritt: 36 },
];

const LEADERBOARD_B2B: LeaderboardEntry[] = [
  { rank: 1, name: "Anna Schmidt", initials: "AS", color: "hsl(340,75%,55%)", wert: 4, einheit: "Reg.", fortschritt: 80 },
  { rank: 2, name: "Max Müller", initials: "MM", color: "hsl(250,60%,52%)", wert: 3, einheit: "Reg.", fortschritt: 60 },
  { rank: 3, name: "Tom Fischer", initials: "TF", color: "hsl(152,60%,42%)", wert: 2, einheit: "Reg.", fortschritt: 40 },
  { rank: 4, name: "Lisa Weber", initials: "LW", color: "hsl(38,92%,50%)", wert: 1, einheit: "Reg.", fortschritt: 20 },
];

const rankIcons = [Crown, Medal, Award];
const rankColors = ["text-warning", "text-muted-foreground", "text-[hsl(25,60%,50%)]"];

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const myProgress = challenge.aktiv ? Math.floor(Math.random() * 80 + 10) : 100;
  return (
    <div className={`bg-card rounded-xl border border-border shadow-crm-sm p-5 ${!challenge.aktiv ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{challenge.preisIcon}</span>
            <h3 className="text-base font-bold text-foreground">{challenge.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{challenge.description}</p>
        </div>
        <Badge variant={challenge.aktiv ? "default" : "secondary"} className={challenge.aktiv ? "gradient-brand border-0 text-primary-foreground" : ""}>
          {challenge.aktiv ? "Aktiv" : "Beendet"}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase">Zeitraum</p>
          <p className="text-sm font-medium text-foreground">{challenge.monat}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase">Ziel</p>
          <p className="text-sm font-medium text-foreground">{challenge.ziel} {challenge.einheit}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase">Preis</p>
          <p className="text-sm font-medium text-foreground">{challenge.preis}</p>
        </div>
      </div>
      {challenge.aktiv && (
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Dein Fortschritt</span>
            <span className="font-semibold text-foreground">{myProgress}%</span>
          </div>
          <Progress value={myProgress} className="h-2" />
        </div>
      )}
    </div>
  );
}

function LeaderboardTable({ entries, title }: { entries: LeaderboardEntry[]; title: string }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-crm-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <Trophy className="h-4 w-4 text-warning" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="divide-y divide-border/40">
        {entries.map((entry) => {
          const RankIcon = entry.rank <= 3 ? rankIcons[entry.rank - 1] : Star;
          const isMe = entry.name === "Max Müller";
          return (
            <div key={entry.rank} className={`flex items-center gap-3 px-5 py-3 ${isMe ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/20"} transition-colors`}>
              <div className="w-8 text-center">
                {entry.rank <= 3 ? (
                  <RankIcon className={`h-5 w-5 mx-auto ${rankColors[entry.rank - 1]}`} />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">{entry.rank}</span>
                )}
              </div>
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" style={{ background: entry.color }}>
                {entry.initials}
              </div>
              <div className="flex-1">
                <span className={`text-sm font-medium ${isMe ? "text-primary" : "text-foreground"}`}>{entry.name}</span>
                {isMe && <Badge className="ml-2 text-[9px] gradient-brand border-0 text-primary-foreground">Du</Badge>}
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-foreground">{entry.wert}</span>
                <span className="text-xs text-muted-foreground ml-1">{entry.einheit}</span>
              </div>
              <div className="w-24">
                <Progress value={entry.fortschritt} className="h-1.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Wettbewerb() {
  const { currentRoleId } = useUserRole();
  const isAdmin = currentRoleId === "admin" || currentRoleId === "vertriebsleiter";
  const activeChallenges = CHALLENGES.filter((c) => c.aktiv);
  const pastChallenges = CHALLENGES.filter((c) => !c.aktiv);

  return (
    <CRMLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-brand flex items-center justify-center">
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

        {/* Active Challenges */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Flame className="h-4 w-4 text-destructive" /> Aktive Challenges ({activeChallenges.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeChallenges.map((c) => <ChallengeCard key={c.id} challenge={c} />)}
          </div>
        </div>

        {/* Leaderboards */}
        <Tabs defaultValue="b2c">
          <TabsList>
            <TabsTrigger value="b2c" className="text-sm">B2C Ranking</TabsTrigger>
            <TabsTrigger value="b2b" className="text-sm">B2B Ranking</TabsTrigger>
          </TabsList>
          <TabsContent value="b2c" className="mt-4">
            <LeaderboardTable entries={LEADERBOARD_B2C} title="B2C – Inserate Ranking (Februar 2026)" />
          </TabsContent>
          <TabsContent value="b2b" className="mt-4">
            <LeaderboardTable entries={LEADERBOARD_B2B} title="B2B – Registrierungen Ranking (Februar 2026)" />
          </TabsContent>
        </Tabs>

        {/* Past Challenges */}
        {pastChallenges.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Vergangene Challenges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastChallenges.map((c) => <ChallengeCard key={c.id} challenge={c} />)}
            </div>
          </div>
        )}
      </div>
    </CRMLayout>
  );
}
