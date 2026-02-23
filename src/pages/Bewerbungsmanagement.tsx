import { useState, useEffect } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarWidget } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  UserPlus, Search, ChevronRight, Mail, Phone, MapPin,
  CheckCircle2, Clock, XCircle, Eye, UserCheck, GraduationCap,
  Brain, ArrowRight, Calendar, FileText, Star, Users, CalendarIcon,
  ExternalLink, Upload, Briefcase, Plus, Edit3, Building2,
} from "lucide-react";
import {
  getStoredStellen, saveStellen, STELLEN_STATUS_LABELS, STELLEN_STATUS_COLORS,
  type Stellenprofil, type StellenStatus,
} from "@/data/stellenprofile-data";

// ── Pipeline-Stufen ──
const PIPELINE_STAGES = [
  { id: "eingang", label: "Eingang", color: "bg-muted-foreground" },
  { id: "screening", label: "Screening", color: "bg-blue-500" },
  { id: "persoenlichkeitstest", label: "16P-Test", color: "bg-purple-500" },
  { id: "interview", label: "Interview", color: "bg-amber-500" },
  { id: "entscheidung", label: "Entscheidung", color: "bg-primary" },
  { id: "onboarding", label: "Onboarding", color: "bg-[hsl(var(--success))]" },
  { id: "abgelehnt", label: "Abgelehnt", color: "bg-destructive" },
];

// ── 16 Personalities Fragen ──
const PERSONALITY_QUESTIONS = [
  { id: 1, text: "Ich genieße es, im Mittelpunkt der Aufmerksamkeit zu stehen.", dim: "EI" },
  { id: 2, text: "Ich verlasse mich eher auf Fakten als auf Intuition.", dim: "SN" },
  { id: 3, text: "Entscheidungen treffe ich eher mit dem Kopf als mit dem Herzen.", dim: "TF" },
  { id: 4, text: "Ich bevorzuge strukturierte Pläne gegenüber Spontanität.", dim: "JP" },
  { id: 5, text: "Ich lade meine Energie auf, indem ich unter Menschen bin.", dim: "EI" },
  { id: 6, text: "Ich achte mehr auf Details als auf das große Ganze.", dim: "SN" },
  { id: 7, text: "Gerechtigkeit ist mir wichtiger als Harmonie.", dim: "TF" },
  { id: 8, text: "Ich erledige Aufgaben lieber frühzeitig als auf den letzten Drücker.", dim: "JP" },
  { id: 9, text: "Ich spreche gern mit Fremden und knüpfe leicht Kontakte.", dim: "EI" },
  { id: 10, text: "Ich denke oft über abstrakte Konzepte und Möglichkeiten nach.", dim: "SN" },
  { id: 11, text: "Ich sage anderen lieber die Wahrheit, auch wenn es unangenehm ist.", dim: "TF" },
  { id: 12, text: "Ich führe To-Do-Listen und halte mich an Zeitpläne.", dim: "JP" },
];

const PERSONALITY_TYPES: Record<string, { label: string; desc: string; fit: "hoch" | "mittel" | "niedrig" }> = {
  ENTJ: { label: "Der Kommandeur", desc: "Strategischer Anführer mit klarer Vision", fit: "hoch" },
  ENFJ: { label: "Der Protagonist", desc: "Charismatisch, inspirierend und empathisch", fit: "hoch" },
  ESTP: { label: "Der Unternehmer", desc: "Energisch, pragmatisch und risikobereit", fit: "hoch" },
  ENTP: { label: "Der Debattierer", desc: "Innovativ, schnell denkend und überzeugend", fit: "hoch" },
  ESTJ: { label: "Der Exekutive", desc: "Organisiert, direkt und verantwortungsbewusst", fit: "mittel" },
  ESFJ: { label: "Der Konsul", desc: "Fürsorglich, gesellig und kooperativ", fit: "mittel" },
  ENFP: { label: "Der Aktivist", desc: "Kreativ, enthusiastisch und sozial", fit: "mittel" },
  ESFP: { label: "Der Entertainer", desc: "Spontan, energisch und unterhaltsam", fit: "mittel" },
  INTJ: { label: "Der Architekt", desc: "Strategisch, unabhängig und analytisch", fit: "mittel" },
  INTP: { label: "Der Logiker", desc: "Analytisch, objektiv und reserviert", fit: "niedrig" },
  INFJ: { label: "Der Advokat", desc: "Idealistisch, entschlossen und einfühlsam", fit: "mittel" },
  INFP: { label: "Der Mediator", desc: "Idealistisch, kreativ und introvertiert", fit: "niedrig" },
  ISTJ: { label: "Der Logistiker", desc: "Praktisch, faktenorientiert und zuverlässig", fit: "niedrig" },
  ISFJ: { label: "Der Verteidiger", desc: "Engagiert, warmherzig und schützend", fit: "niedrig" },
  ISTP: { label: "Der Virtuose", desc: "Kühn, praktisch und experimentierfreudig", fit: "niedrig" },
  ISFP: { label: "Der Abenteurer", desc: "Flexibel, charmant und künstlerisch", fit: "niedrig" },
};

// ── Bewerber-Daten ──
interface OnboardingTermin {
  id: string;
  datum: string;
  uhrzeit: string;
  standort: string;
  maxTeilnehmer: number;
}

interface Bewerber {
  id: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  ort: string;
  beworbenAm: string;
  stage: string;
  personalityType?: string;
  personalityPdfName?: string;
  notizen: string;
  erfahrung: string;
  motivation: string;
  quelle: string;
  bewertung?: number;
  beschaeftigungsart?: string;
  vertriebsziel?: string;
  lebenslaufName?: string;
  lebenslaufUrl?: string;
  stelleId?: string;
  onboardingTerminId?: string;
  onboardingDatum?: string;
  onboardingUhrzeit?: string;
  onboardingStandort?: string;
}

const INITIAL_ONBOARDING_TERMINE: OnboardingTermin[] = [
  { id: "ot1", datum: "2026-03-03", uhrzeit: "10:00", standort: "München – Leopoldstraße 42", maxTeilnehmer: 8 },
  { id: "ot2", datum: "2026-03-10", uhrzeit: "14:00", standort: "Berlin – Friedrichstraße 108", maxTeilnehmer: 6 },
  { id: "ot3", datum: "2026-03-17", uhrzeit: "09:00", standort: "Hamburg – Jungfernstieg 22", maxTeilnehmer: 10 },
];

const QUELLEN = ["Empfehlung", "LinkedIn", "Jobportal", "Website", "Social Media", "Messe", "Sonstiges"];

const INITIAL_BEWERBER: Bewerber[] = [
  { id: "b1", vorname: "Max", nachname: "Bauer", email: "max.bauer@gmail.com", telefon: "+49 171 1234567", ort: "München", beworbenAm: "2026-02-20", stage: "interview", personalityType: "ENTJ", notizen: "Sehr motiviert, Vertriebserfahrung bei ImmoScout.", erfahrung: "3 Jahre Immobilienvertrieb", motivation: "Möchte selbstständig im Vertrieb arbeiten.", quelle: "LinkedIn", bewertung: 4, beschaeftigungsart: "freier_handelsvertreter", vertriebsziel: "Eigenständige Kundenakquise, 100k+ Jahreseinkommen", stelleId: "s1" },
  { id: "b2", vorname: "Sarah", nachname: "Klein", email: "s.klein@web.de", telefon: "+49 176 9876543", ort: "Berlin", beworbenAm: "2026-02-19", stage: "persoenlichkeitstest", notizen: "", erfahrung: "Quereinsteigerin aus dem Marketing", motivation: "Suche eine neue Herausforderung.", quelle: "Jobportal", bewertung: 3, beschaeftigungsart: "nebenberuflich", vertriebsziel: "Zweites Standbein aufbauen", stelleId: "s1" },
  { id: "b3", vorname: "Tim", nachname: "Hoffmann", email: "tim.h@outlook.de", telefon: "+49 152 5551234", ort: "Hamburg", beworbenAm: "2026-02-18", stage: "screening", notizen: "Lebenslauf sieht gut aus.", erfahrung: "5 Jahre B2B-Sales", motivation: "Will im Immobiliensektor Fuß fassen.", quelle: "Empfehlung", bewertung: 5, beschaeftigungsart: "hauptberuflich", vertriebsziel: "Teamleitung innerhalb von 2 Jahren", lebenslaufName: "Tim_Hoffmann_CV.pdf", stelleId: "s2" },
  { id: "b4", vorname: "Julia", nachname: "Richter", email: "julia.r@gmx.de", telefon: "+49 160 7778899", ort: "Köln", beworbenAm: "2026-02-17", stage: "eingang", notizen: "", erfahrung: "Keine Vertriebserfahrung", motivation: "Interesse an Immobilien.", quelle: "Website", stelleId: "s1" },
  { id: "b5", vorname: "Markus", nachname: "Braun", email: "m.braun@gmail.com", telefon: "+49 173 3334455", ort: "Frankfurt", beworbenAm: "2026-02-15", stage: "onboarding", personalityType: "ENFJ", notizen: "Top-Kandidat, sofort eingestellt.", erfahrung: "7 Jahre Finanzvertrieb", motivation: "Partnerschaft mit starkem Netzwerk aufbauen.", quelle: "Empfehlung", bewertung: 5, onboardingTerminId: "ot1", onboardingDatum: "2026-03-03", onboardingUhrzeit: "10:00", onboardingStandort: "München – Leopoldstraße 42", beschaeftigungsart: "hauptberuflich", vertriebsziel: "Senior Partner innerhalb von 12 Monaten", stelleId: "s2" },
  { id: "b6", vorname: "Anna", nachname: "Meier", email: "a.meier@t-online.de", telefon: "+49 157 6667788", ort: "Stuttgart", beworbenAm: "2026-02-14", stage: "abgelehnt", personalityType: "ISFP", notizen: "Persönlichkeitsprofil passt nicht.", erfahrung: "Grafikdesignerin", motivation: "Nebenjob.", quelle: "Social Media", bewertung: 1, beschaeftigungsart: "nebenberuflich", stelleId: "s3" },
  { id: "b7", vorname: "Lukas", nachname: "Weber", email: "l.weber@yahoo.de", telefon: "+49 179 1112233", ort: "Düsseldorf", beworbenAm: "2026-02-21", stage: "entscheidung", personalityType: "ESTP", notizen: "Zweites Gespräch war sehr gut.", erfahrung: "4 Jahre Vertrieb Telekommunikation", motivation: "Suche mehr Eigenverantwortung.", quelle: "Messe", bewertung: 4, beschaeftigungsart: "angestellt_fixum", vertriebsziel: "Vertriebsleitung mit Team aufbauen", stelleId: "s1" },
];

function StageBadge({ stageId }: { stageId: string }) {
  const stage = PIPELINE_STAGES.find((s) => s.id === stageId);
  if (!stage) return null;
  return (
    <Badge variant="outline" className="text-[10px] gap-1">
      <span className={`h-2 w-2 rounded-full ${stage.color}`} />
      {stage.label}
    </Badge>
  );
}

function FitBadge({ fit }: { fit: "hoch" | "mittel" | "niedrig" }) {
  const styles = {
    hoch: "border-[hsl(var(--success))]/30 text-[hsl(var(--success))] bg-[hsl(var(--success))]/5",
    mittel: "border-[hsl(var(--warning))]/30 text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/5",
    niedrig: "border-destructive/30 text-destructive bg-destructive/5",
  };
  return <Badge variant="outline" className={`text-[10px] ${styles[fit]}`}>{fit === "hoch" ? "⭐ Hohe Eignung" : fit === "mittel" ? "Mittlere Eignung" : "Geringe Eignung"}</Badge>;
}

// ── PersonalityTest Component ──
function PersonalityTest({ onComplete }: { onComplete: (type: string) => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const allAnswered = PERSONALITY_QUESTIONS.every((q) => answers[q.id] !== undefined);

  const calculate = () => {
    const dims: Record<string, number[]> = { EI: [], SN: [], TF: [], JP: [] };
    PERSONALITY_QUESTIONS.forEach((q) => {
      dims[q.dim].push(answers[q.id] || 3);
    });
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const type = [
      avg(dims.EI) >= 3 ? "E" : "I",
      avg(dims.SN) >= 3 ? "S" : "N",
      avg(dims.TF) >= 3 ? "T" : "F",
      avg(dims.JP) >= 3 ? "J" : "P",
    ].join("");
    onComplete(type);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="h-5 w-5 text-purple-500" />
          <h3 className="text-sm font-semibold text-foreground">16 Personalities Test</h3>
        </div>
        <p className="text-xs text-muted-foreground">Bewerte jede Aussage auf einer Skala von 1 (stimme nicht zu) bis 5 (stimme voll zu).</p>
      </div>

      <div className="space-y-4">
        {PERSONALITY_QUESTIONS.map((q) => (
          <div key={q.id} className="p-3 rounded-lg border border-border bg-card">
            <p className="text-sm text-foreground mb-2">{q.id}. {q.text}</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">Stimme nicht zu</span>
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
                  className={`h-8 w-8 rounded-full text-xs font-semibold transition-all ${
                    answers[q.id] === val
                      ? "gradient-brand text-white shadow-crm-sm"
                      : "border border-border bg-background text-foreground hover:border-primary/50"
                  }`}
                >
                  {val}
                </button>
              ))}
              <span className="text-[10px] text-muted-foreground">Stimme voll zu</span>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={calculate} disabled={!allAnswered} className="gap-2 gradient-brand border-0 text-white">
        <Brain className="h-4 w-4" /> Ergebnis berechnen
      </Button>
    </div>
  );
}

// ── Bewerber Detail ──
function BewerberDetail({
  bewerber,
  stellen,
  onboardingTermine,
  onClose,
  onStageChange,
  onPersonalityComplete,
  onActivate,
  onAssignTermin,
  onUpdateField,
}: {
  bewerber: Bewerber;
  stellen: Stellenprofil[];
  onboardingTermine: OnboardingTermin[];
  onClose: () => void;
  onStageChange: (id: string, stage: string) => void;
  onPersonalityComplete: (id: string, type: string) => void;
  onActivate: (id: string) => void;
  onAssignTermin: (bewerberId: string, terminId: string | undefined) => void;
  onUpdateField: (id: string, field: keyof Bewerber, value: string | number) => void;
}) {
  const { toast } = useToast();
  const [tab, setTab] = useState("uebersicht");
  const pType = bewerber.personalityType ? PERSONALITY_TYPES[bewerber.personalityType] : null;
  const assignedTermin = onboardingTermine.find((t) => t.id === bewerber.onboardingTerminId);

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground -ml-2">← Zurück</Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full gradient-brand flex items-center justify-center text-white text-lg font-display font-bold">
            {bewerber.vorname[0]}{bewerber.nachname[0]}
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-foreground">{bewerber.vorname} {bewerber.nachname}</h2>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{bewerber.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{bewerber.telefon}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{bewerber.ort}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StageBadge stageId={bewerber.stage} />
          <Select value={bewerber.stage} onValueChange={(v) => onStageChange(bewerber.id, v)}>
            <SelectTrigger className="h-8 w-[160px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PIPELINE_STAGES.map((s) => (
                <SelectItem key={s.id} value={s.id} className="text-xs">{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pipeline Progress with Labels */}
      <div className="flex items-center gap-1">
        {PIPELINE_STAGES.filter((s) => s.id !== "abgelehnt").map((s, i) => {
          const stageIndex = PIPELINE_STAGES.findIndex((st) => st.id === bewerber.stage);
          const thisIndex = PIPELINE_STAGES.findIndex((st) => st.id === s.id);
          const reached = bewerber.stage !== "abgelehnt" && thisIndex <= stageIndex;
          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex-1 text-center">
                <div className={`h-2 rounded-full ${reached ? s.color : "bg-secondary"}`} />
                <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
              </div>
              {i < 5 && <ArrowRight className="h-3 w-3 text-muted-foreground/40 mx-0.5 shrink-0" />}
            </div>
          );
        })}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-secondary/30">
          <TabsTrigger value="uebersicht" className="text-xs">Übersicht</TabsTrigger>
          <TabsTrigger value="persoenlichkeit" className="text-xs">16P-Test</TabsTrigger>
          <TabsTrigger value="aktivierung" className="text-xs">BO-Aktivierung</TabsTrigger>
        </TabsList>

        <TabsContent value="uebersicht" className="mt-4 space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Beworben am</p>
              <p className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{new Date(bewerber.beworbenAm).toLocaleDateString("de-DE")}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Stellenanzeige</p>
              <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" />
                {bewerber.stelleId ? (stellen.find((s) => s.id === bewerber.stelleId)?.titel || "–") : "–"}
              </p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Quelle</p>
              <p className="text-sm font-semibold text-foreground">{bewerber.quelle || "–"}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Erfahrung</p>
              <p className="text-sm font-semibold text-foreground">{bewerber.erfahrung || "–"}</p>
            </div>
          </div>

          {/* Beschäftigungsart & Vertriebsziel */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Beschäftigungsart</p>
              <p className="text-sm font-semibold text-foreground">
                {bewerber.beschaeftigungsart === "nebenberuflich" ? "Nebenberuflich" :
                 bewerber.beschaeftigungsart === "hauptberuflich" ? "Hauptberuflich" :
                 bewerber.beschaeftigungsart === "freier_handelsvertreter" ? "Freier Handelsvertreter" :
                 bewerber.beschaeftigungsart === "angestellt_fixum" ? "Angestellt mit Fixum + Provision" :
                 "–"}
              </p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Ziele</p>
              <p className="text-sm text-foreground">{bewerber.vertriebsziel || "–"}</p>
            </div>
          </div>

          {/* Lebenslauf */}
          {bewerber.lebenslaufName && (
            <div className="glass-card rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Lebenslauf</p>
              <div className="flex items-center gap-2 mt-1">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{bewerber.lebenslaufName}</span>
                <Badge variant="outline" className="text-[10px] ml-auto">Hochgeladen</Badge>
              </div>
            </div>
          )}

          {/* Bewertung */}
          <div className="glass-card rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Admin-Bewertung</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((v) => (
                <button key={v} onClick={() => onUpdateField(bewerber.id, "bewertung", v)} className="transition-transform hover:scale-110">
                  <Star className={`h-5 w-5 ${(bewerber.bewertung || 0) >= v ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`} />
                </button>
              ))}
              <span className="text-xs text-muted-foreground ml-2">{bewerber.bewertung ? `${bewerber.bewertung}/5` : "Nicht bewertet"}</span>
            </div>
          </div>

          {/* Motivation – editable */}
          <div className="glass-card rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Motivation</p>
            <Textarea
              value={bewerber.motivation}
              onChange={(e) => onUpdateField(bewerber.id, "motivation", e.target.value)}
              rows={2}
              className="resize-none text-sm mt-1"
            />
          </div>

          {/* Notizen – editable */}
          <div className="glass-card rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Notizen</p>
            <Textarea
              value={bewerber.notizen}
              onChange={(e) => onUpdateField(bewerber.id, "notizen", e.target.value)}
              rows={3}
              className="resize-none text-sm mt-1"
              placeholder="Notizen zum Bewerber hinzufügen…"
            />
          </div>

          {pType && (
            <div className="glass-card rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Persönlichkeitstyp</p>
              <div className="flex items-center gap-3 mt-1">
                <Badge className="gradient-brand text-white border-0 text-sm">{bewerber.personalityType}</Badge>
                <div>
                  <p className="text-sm font-semibold text-foreground">{pType.label}</p>
                  <p className="text-xs text-muted-foreground">{pType.desc}</p>
                </div>
                <FitBadge fit={pType.fit} />
              </div>
            </div>
          )}

          {/* Onboarding-Einladung */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Onboarding-Einladung</p>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Onboarding-Termin auswählen</Label>
              <Select
                value={bewerber.onboardingTerminId || "none"}
                onValueChange={(v) => onAssignTermin(bewerber.id, v === "none" ? undefined : v)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Termin wählen…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-xs">– Kein Termin –</SelectItem>
                  {onboardingTermine.map((t) => {
                    const teilnehmer = 0; // Will be computed in parent
                    return (
                      <SelectItem key={t.id} value={t.id} className="text-xs">
                        {new Date(t.datum).toLocaleDateString("de-DE")} · {t.uhrzeit} Uhr · {t.standort} (max. {t.maxTeilnehmer})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            {assignedTermin && (
              <div className="p-3 rounded-lg bg-[hsl(var(--success))]/5 border border-[hsl(var(--success))]/20">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
                  {new Date(assignedTermin.datum).toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                  <span className="text-muted-foreground font-normal ml-1">{assignedTermin.uhrzeit} Uhr</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3" /> {assignedTermin.standort}</p>
              </div>
            )}
            {assignedTermin && (
              <Button
                size="sm"
                className="text-xs gap-1.5 gradient-brand border-0 text-white"
                onClick={() => {
                  toast({
                    title: "Einladung versendet ✓",
                    description: `${bewerber.vorname} ${bewerber.nachname} wurde per Chat und E-Mail zum Onboarding am ${new Date(assignedTermin.datum).toLocaleDateString("de-DE")} um ${assignedTermin.uhrzeit} Uhr eingeladen.`,
                  });
                }}
              >
                <Mail className="h-3.5 w-3.5" /> Einladung senden (Chat & E-Mail)
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="persoenlichkeit" className="mt-4 space-y-4">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/15">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">16 Personalities Test</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Der Bewerber soll den offiziellen Test absolvieren und das Ergebnis hier hochladen oder eingeben.
            </p>
            <a
              href="https://www.16personalities.com/de/kostenloser-personlichkeitstest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-primary hover:underline font-medium"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Test auf 16personalities.com öffnen
            </a>
          </div>

          {bewerber.personalityType ? (
            <div className="glass-card rounded-xl p-6 text-center">
              <Brain className="h-10 w-10 text-primary mx-auto mb-3" />
              <Badge className="gradient-brand text-white border-0 text-lg px-4 py-1 mb-2">{bewerber.personalityType}</Badge>
              <h3 className="text-lg font-bold text-foreground">{pType?.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{pType?.desc}</p>
              <div className="mt-3"><FitBadge fit={pType?.fit || "niedrig"} /></div>
              {bewerber.personalityPdfName && (
                <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
                  <FileText className="h-3.5 w-3.5" /> {bewerber.personalityPdfName}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Manual entry */}
              <div className="glass-card rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-foreground">Ergebnis manuell eintragen</p>
                <div className="flex items-center gap-2">
                  <Select onValueChange={(v) => onPersonalityComplete(bewerber.id, v)}>
                    <SelectTrigger className="w-[200px] text-xs"><SelectValue placeholder="Typ wählen…" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(PERSONALITY_TYPES).map(([key, val]) => (
                        <SelectItem key={key} value={key} className="text-xs">{key} – {val.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PDF Upload */}
              <div className="glass-card rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-foreground">Oder PDF-Ergebnis hochladen</p>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-primary hover:underline">
                  <Upload className="h-4 w-4" />
                  <span>PDF auswählen…</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onUpdateField(bewerber.id, "personalityPdfName", file.name);
                        toast({ title: "PDF hochgeladen", description: file.name });
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="aktivierung" className="mt-4 space-y-4">
          {bewerber.stage === "onboarding" ? (
            <div className="glass-card rounded-xl p-6 text-center space-y-4">
              <UserCheck className="h-10 w-10 text-[hsl(var(--success))] mx-auto" />
              <h3 className="text-lg font-display font-bold text-foreground">Bewerber aktivieren</h3>
              <p className="text-sm text-muted-foreground">
                Der Bewerber hat den Bewerbungsprozess abgeschlossen. Du kannst ihn jetzt als Nutzer im Backoffice freischalten.
                Dabei wird automatisch ein Account angelegt und der Standard-Onboarding-Prozess (Einstellungen → Academy) gestartet.
              </p>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/15 text-left">
                <p className="text-xs font-semibold text-foreground mb-2">Was passiert bei Aktivierung:</p>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))] shrink-0 mt-0.5" />Nutzer-Account wird als „Vertriebspartner" angelegt</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))] shrink-0 mt-0.5" />IONOS E-Mail wird generiert</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))] shrink-0 mt-0.5" />Einladung mit Zugangsdaten wird versendet</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))] shrink-0 mt-0.5" />Vertriebspartner muss Einstellungen ausfüllen</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))] shrink-0 mt-0.5" />Danach Pflicht-Onboarding-Kurs in der Academy</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))] shrink-0 mt-0.5" />BO-Zugang erst nach Kursabschluss + Zertifikat</li>
                </ul>
              </div>
              <Button onClick={() => onActivate(bewerber.id)} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm">
                <UserCheck className="h-4 w-4" /> Als Vertriebspartner freischalten
              </Button>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-6 text-center">
              <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-foreground">Noch nicht bereit</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Der Bewerber muss erst den Status „Onboarding" erreichen, bevor er als Nutzer aktiviert werden kann.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Hauptseite ──
export default function Bewerbungsmanagement() {
  const { toast } = useToast();
  const [bewerber, setBewerber] = useState<Bewerber[]>(INITIAL_BEWERBER);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("alle");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [newForm, setNewForm] = useState({ vorname: "", nachname: "", email: "", telefon: "", ort: "", erfahrung: "", motivation: "", quelle: "" });
  const [mainTab, setMainTab] = useState<"bewerber" | "stellen">("bewerber");

  // Onboarding Termine state
  const [onboardingTermine, setOnboardingTermine] = useState<OnboardingTermin[]>(INITIAL_ONBOARDING_TERMINE);
  const [newTerminDialogOpen, setNewTerminDialogOpen] = useState(false);
  const [newTerminForm, setNewTerminForm] = useState({ datum: "", uhrzeit: "", standort: "", maxTeilnehmer: "8" });
  const [expandedTerminId, setExpandedTerminId] = useState<string | null>(null);

  // Stellen state
  const [stellen, setStellen] = useState<Stellenprofil[]>(getStoredStellen);
  const [stellenDialogOpen, setStellenDialogOpen] = useState(false);
  const [editingStelleId, setEditingStelleId] = useState<string | null>(null);
  const [stelleForm, setStelleForm] = useState({ titel: "", abteilung: "", standort: "", beschaeftigungsart: "", beschreibung: "", anforderungen: "", benefits: "", status: "entwurf" as StellenStatus });

  useEffect(() => { saveStellen(stellen); }, [stellen]);

  const assignTermin = (bewerberId: string, terminId: string | undefined) => {
    const termin = terminId ? onboardingTermine.find((t) => t.id === terminId) : undefined;
    setBewerber((prev) => prev.map((b) => b.id === bewerberId ? {
      ...b,
      onboardingTerminId: terminId,
      onboardingDatum: termin?.datum,
      onboardingUhrzeit: termin?.uhrzeit,
      onboardingStandort: termin?.standort,
    } : b));
    toast({ title: terminId ? "Onboarding-Termin zugewiesen ✓" : "Onboarding-Termin entfernt" });
  };

  const handleNewTermin = () => {
    if (!newTerminForm.datum || !newTerminForm.uhrzeit || !newTerminForm.standort) return;
    const t: OnboardingTermin = {
      id: `ot${Date.now()}`,
      datum: newTerminForm.datum,
      uhrzeit: newTerminForm.uhrzeit,
      standort: newTerminForm.standort,
      maxTeilnehmer: parseInt(newTerminForm.maxTeilnehmer) || 8,
    };
    setOnboardingTermine((prev) => [...prev, t]);
    setNewTerminDialogOpen(false);
    setNewTerminForm({ datum: "", uhrzeit: "", standort: "", maxTeilnehmer: "8" });
    toast({ title: "Onboarding-Termin erstellt ✓" });
  };

  const selected = bewerber.find((b) => b.id === selectedId);

  const filtered = bewerber.filter((b) => {
    const matchSearch = `${b.vorname} ${b.nachname} ${b.email} ${b.ort}`.toLowerCase().includes(search.toLowerCase());
    const matchStage = filterStage === "alle" || b.stage === filterStage;
    return matchSearch && matchStage;
  });

  const stageChange = (id: string, stage: string) => {
    setBewerber((prev) => prev.map((b) => b.id === id ? { ...b, stage } : b));
    toast({ title: "Status geändert", description: `Bewerber wurde in „${PIPELINE_STAGES.find((s) => s.id === stage)?.label}" verschoben.` });
  };

  const personalityComplete = (id: string, type: string) => {
    setBewerber((prev) => prev.map((b) => b.id === id ? { ...b, personalityType: type, stage: b.stage === "persoenlichkeitstest" ? "interview" : b.stage } : b));
    const pType = PERSONALITY_TYPES[type];
    toast({ title: `Ergebnis: ${type} – ${pType?.label}`, description: `Eignung für den Vertrieb: ${pType?.fit === "hoch" ? "Hoch ⭐" : pType?.fit === "mittel" ? "Mittel" : "Gering"}` });
  };

  const activate = (id: string) => {
    const b = bewerber.find((x) => x.id === id);
    if (!b) return;
    toast({ title: "Nutzer aktiviert ✓", description: `${b.vorname} ${b.nachname} wurde als Vertriebspartner angelegt. Einladung wird versendet.` });
    setSelectedId(null);
  };

  const handleNewBewerber = () => {
    if (!newForm.vorname || !newForm.nachname || !newForm.email) return;
    const nb: Bewerber = {
      id: `b${Date.now()}`,
      ...newForm,
      beworbenAm: new Date().toISOString().slice(0, 10),
      stage: "eingang",
      notizen: "",
      quelle: newForm.quelle || "Sonstiges",
    };
    setBewerber((prev) => [nb, ...prev]);
    setNewDialogOpen(false);
    setNewForm({ vorname: "", nachname: "", email: "", telefon: "", ort: "", erfahrung: "", motivation: "", quelle: "" });
    toast({ title: "Bewerber hinzugefügt", description: `${nb.vorname} ${nb.nachname} wurde erfasst.` });
  };

  // Stellen handlers
  const openNewStelle = () => {
    setEditingStelleId(null);
    setStelleForm({ titel: "", abteilung: "", standort: "", beschaeftigungsart: "", beschreibung: "", anforderungen: "", benefits: "", status: "entwurf" });
    setStellenDialogOpen(true);
  };
  const openEditStelle = (s: Stellenprofil) => {
    setEditingStelleId(s.id);
    setStelleForm({ titel: s.titel, abteilung: s.abteilung, standort: s.standort, beschaeftigungsart: s.beschaeftigungsart, beschreibung: s.beschreibung, anforderungen: s.anforderungen, benefits: s.benefits, status: s.status });
    setStellenDialogOpen(true);
  };
  const handleSaveStelle = () => {
    if (!stelleForm.titel) return;
    if (editingStelleId) {
      setStellen((prev) => prev.map((s) => s.id === editingStelleId ? {
        ...s, ...stelleForm,
        veroeffentlichtAm: stelleForm.status === "veroeffentlicht" && s.status !== "veroeffentlicht" ? new Date().toISOString().slice(0, 10) : s.veroeffentlichtAm,
      } : s));
      toast({ title: "Stelle aktualisiert ✓" });
    } else {
      const ns: Stellenprofil = {
        id: `s${Date.now()}`, ...stelleForm, erstelltAm: new Date().toISOString().slice(0, 10),
        veroeffentlichtAm: stelleForm.status === "veroeffentlicht" ? new Date().toISOString().slice(0, 10) : undefined,
      };
      setStellen((prev) => [ns, ...prev]);
      toast({ title: "Stelle erstellt ✓" });
    }
    setStellenDialogOpen(false);
  };

  // KPIs
  const countByStage = (s: string) => bewerber.filter((b) => b.stage === s).length;
  const kpis = [
    { label: "Gesamt", value: bewerber.length, icon: Users },
    { label: "Im Prozess", value: bewerber.filter((b) => !["abgelehnt", "onboarding"].includes(b.stage)).length, icon: Clock },
    { label: "Onboarding", value: countByStage("onboarding"), icon: GraduationCap },
    { label: "Abgelehnt", value: countByStage("abgelehnt"), icon: XCircle },
  ];

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in min-h-screen dashboard-mesh-bg">
        <div className="max-w-6xl space-y-5">
          {selected ? (
            <BewerberDetail
              stellen={stellen}
              onboardingTermine={onboardingTermine}
              bewerber={selected}
              onClose={() => setSelectedId(null)}
              onStageChange={stageChange}
              onPersonalityComplete={personalityComplete}
              onActivate={activate}
              onAssignTermin={assignTermin}
              onUpdateField={(id, field, value) => {
                setBewerber((prev) => prev.map((b) => b.id === id ? { ...b, [field]: value } : b));
              }}
            />
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1"><div className="w-10 h-1 rounded-full gradient-brand" /></div>
                  <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Bewerbungsmanagement</h1>
                  <p className="text-sm text-muted-foreground mt-1">Bewerber verwalten, Stellenprofile erstellen & als Nutzer freischalten</p>
                </div>
                <div className="flex items-center gap-2">
                  {mainTab === "stellen" && (
                    <Button onClick={openNewStelle} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm">
                      <Plus className="h-4 w-4" /> Neue Stelle
                    </Button>
                  )}
                  {mainTab === "bewerber" && (
                    <Button onClick={() => setNewDialogOpen(true)} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm">
                      <UserPlus className="h-4 w-4" /> Bewerber erfassen
                    </Button>
                  )}
                </div>
              </div>

              {/* Main Tabs */}
              <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as "bewerber" | "stellen")}>
                <TabsList>
                  <TabsTrigger value="bewerber" className="text-sm gap-1.5"><Users className="h-3.5 w-3.5" /> Bewerber ({bewerber.length})</TabsTrigger>
                  <TabsTrigger value="stellen" className="text-sm gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Stellenprofile ({stellen.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="bewerber" className="mt-4 space-y-5">

              {/* KPIs */}
              <div className="grid grid-cols-4 gap-4">
                {kpis.map((k) => (
                  <div key={k.label} className="glass-card rounded-xl p-4 text-center">
                    <k.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-display font-bold text-foreground">{k.value}</p>
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                  </div>
                ))}
              </div>

              {/* Pipeline Overview */}
              <div className="glass-card rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pipeline</p>
                <div className="flex items-center gap-2">
                  {PIPELINE_STAGES.filter((s) => s.id !== "abgelehnt").map((s) => {
                    const count = countByStage(s.id);
                    return (
                      <div key={s.id} className="flex-1 text-center">
                        <div className={`h-8 rounded-lg ${s.color} flex items-center justify-center`}>
                          <span className="text-white text-xs font-bold">{count}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nächste Onboarding-Termine */}
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Nächste Onboarding-Termine</p>
                  </div>
                  <Button size="sm" className="text-xs gap-1.5 gradient-brand border-0 text-white" onClick={() => setNewTerminDialogOpen(true)}>
                    <Plus className="h-3.5 w-3.5" /> Neuer Termin
                  </Button>
                </div>
                <div className="divide-y divide-border/50">
                  {onboardingTermine
                    .sort((a, b) => a.datum.localeCompare(b.datum))
                    .map((termin) => {
                      const teilnehmer = bewerber.filter((b) => b.onboardingTerminId === termin.id);
                      const isExpanded = expandedTerminId === termin.id;
                      return (
                        <div key={termin.id}>
                          <button
                            className={`w-full text-left px-4 py-3 hover:bg-secondary/20 transition-colors ${isExpanded ? "bg-secondary/20" : ""}`}
                            onClick={() => setExpandedTerminId(isExpanded ? null : termin.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--success))]/10 flex items-center justify-center">
                                  <CalendarIcon className="h-5 w-5 text-[hsl(var(--success))]" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">
                                    {new Date(termin.datum).toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                                    <span className="text-muted-foreground font-normal ml-2">{termin.uhrzeit} Uhr</span>
                                  </p>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3 w-3" /> {termin.standort}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">
                                  {teilnehmer.length} / {termin.maxTeilnehmer} Teilnehmer
                                </span>
                                {isExpanded ? <ChevronRight className="h-4 w-4 text-muted-foreground rotate-90 transition-transform" /> : <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform" />}
                              </div>
                            </div>
                          </button>
                          {isExpanded && (
                            <div className="px-4 pb-3">
                              {teilnehmer.length > 0 ? (
                                <div className="space-y-1.5">
                                  {teilnehmer.map((b) => (
                                    <div
                                      key={b.id}
                                      onClick={() => setSelectedId(b.id)}
                                      className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 cursor-pointer transition-colors"
                                    >
                                      <div className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {b.vorname[0]}{b.nachname[0]}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground">{b.vorname} {b.nachname}</p>
                                        <p className="text-xs text-muted-foreground">{b.ort} · {b.quelle}</p>
                                      </div>
                                      <StageBadge stageId={b.stage} />
                                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground text-center py-3 bg-muted/20 rounded-lg">Noch keine Bewerber für diesen Termin angemeldet.</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  {onboardingTermine.length === 0 && (
                    <div className="py-6 text-center text-sm text-muted-foreground">Keine Onboarding-Termine vorhanden.</div>
                  )}
                </div>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Bewerber suchen…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Select value={filterStage} onValueChange={setFilterStage}>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="Alle Stufen" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle Stufen</SelectItem>
                    {PIPELINE_STAGES.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tabelle */}
              <div className="glass-card rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Kontakt</th>
                      <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Ort</th>
                      <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Quelle</th>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Beworben</th>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Stelle</th>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Bewertung</th>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Typ</th>
                        <th className="py-3 px-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b) => (
                      <tr
                        key={b.id}
                        onClick={() => setSelectedId(b.id)}
                        className="border-b border-border/50 hover:bg-secondary/20 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {b.vorname[0]}{b.nachname[0]}
                            </div>
                            <span className="font-medium text-foreground">{b.vorname} {b.nachname}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">{b.email}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">{b.ort}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">{b.quelle || "–"}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">{new Date(b.beworbenAm).toLocaleDateString("de-DE")}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">{b.stelleId ? (stellen.find((s) => s.id === b.stelleId)?.titel?.substring(0, 30) || "–") : "–"}</td>
                        <td className="py-3 px-4"><StageBadge stageId={b.stage} /></td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((v) => (
                              <Star key={v} className={`h-3 w-3 ${(b.bewertung || 0) >= v ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`} />
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {b.personalityType ? (
                            <Badge variant="outline" className="text-[10px]">{b.personalityType}</Badge>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">–</span>
                          )}
                        </td>
                        <td className="py-3 px-4"><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={10} className="py-8 text-center text-sm text-muted-foreground">Keine Bewerber gefunden.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              </TabsContent>

              {/* Stellenprofile Tab */}
              <TabsContent value="stellen" className="mt-4 space-y-4">
                {/* Stellen KPIs */}
                <div className="grid grid-cols-4 gap-4">
                  {([["veroeffentlicht", "Veröffentlicht"], ["entwurf", "Entwurf"], ["besetzt", "Besetzt"], ["geschlossen", "Geschlossen"]] as const).map(([status, label]) => (
                    <div key={status} className="glass-card rounded-xl p-4 text-center">
                      <p className="text-2xl font-display font-bold text-foreground">{stellen.filter((s) => s.status === status).length}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Stellen Liste */}
                <div className="glass-card rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Titel</th>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Abteilung</th>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Standort</th>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Art</th>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Erstellt</th>
                        <th className="py-3 px-4" />
                      </tr>
                    </thead>
                    <tbody>
                      {stellen.map((s) => (
                        <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/20 cursor-pointer transition-colors" onClick={() => openEditStelle(s)}>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-primary shrink-0" />
                              <span className="font-medium text-foreground">{s.titel}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">{s.abteilung}</td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">{s.standort}</td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">{s.beschaeftigungsart}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-[10px] gap-1">
                              <span className={`h-2 w-2 rounded-full ${STELLEN_STATUS_COLORS[s.status]}`} />
                              {STELLEN_STATUS_LABELS[s.status]}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">{new Date(s.erstelltAm).toLocaleDateString("de-DE")}</td>
                          <td className="py-3 px-4"><Edit3 className="h-4 w-4 text-muted-foreground" /></td>
                        </tr>
                      ))}
                      {stellen.length === 0 && (
                        <tr><td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">Keine Stellenprofile vorhanden.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>

      {/* New Bewerber Dialog */}
      <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Neuen Bewerber erfassen</DialogTitle>
            <DialogDescription>Erfasse die Grunddaten des Bewerbers.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-sm font-semibold">Vorname *</Label><Input value={newForm.vorname} onChange={(e) => setNewForm((p) => ({ ...p, vorname: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label className="text-sm font-semibold">Nachname *</Label><Input value={newForm.nachname} onChange={(e) => setNewForm((p) => ({ ...p, nachname: e.target.value }))} /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-sm font-semibold">E-Mail *</Label><Input type="email" value={newForm.email} onChange={(e) => setNewForm((p) => ({ ...p, email: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-sm font-semibold">Telefon</Label><Input value={newForm.telefon} onChange={(e) => setNewForm((p) => ({ ...p, telefon: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label className="text-sm font-semibold">Ort</Label><Input value={newForm.ort} onChange={(e) => setNewForm((p) => ({ ...p, ort: e.target.value }))} /></div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Quelle</Label>
              <Select value={newForm.quelle} onValueChange={(v) => setNewForm((p) => ({ ...p, quelle: v }))}><SelectTrigger><SelectValue placeholder="Quelle wählen" /></SelectTrigger><SelectContent>{QUELLEN.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1.5"><Label className="text-sm font-semibold">Erfahrung</Label><Input value={newForm.erfahrung} onChange={(e) => setNewForm((p) => ({ ...p, erfahrung: e.target.value }))} placeholder="z.B. 3 Jahre Vertrieb" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-semibold">Motivation</Label><Textarea value={newForm.motivation} onChange={(e) => setNewForm((p) => ({ ...p, motivation: e.target.value }))} rows={3} className="resize-none" placeholder="Warum bewirbt sich die Person?" /></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setNewDialogOpen(false)}>Abbrechen</Button>
              <Button onClick={handleNewBewerber} disabled={!newForm.vorname || !newForm.nachname || !newForm.email} className="gap-2 gradient-brand border-0 text-white"><UserPlus className="h-4 w-4" /> Erfassen</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stelle erstellen/bearbeiten Dialog */}
      <Dialog open={stellenDialogOpen} onOpenChange={setStellenDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStelleId ? "Stelle bearbeiten" : "Neue Stelle erstellen"}</DialogTitle>
            <DialogDescription>Erstelle ein Stellenprofil – nur veröffentlichte Stellen sind für Bewerber sichtbar.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5"><Label className="text-sm font-semibold">Titel *</Label><Input value={stelleForm.titel} onChange={(e) => setStelleForm((p) => ({ ...p, titel: e.target.value }))} placeholder="z.B. Vertriebspartner (m/w/d)" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-sm font-semibold">Abteilung</Label><Input value={stelleForm.abteilung} onChange={(e) => setStelleForm((p) => ({ ...p, abteilung: e.target.value }))} placeholder="z.B. Vertrieb" /></div>
              <div className="space-y-1.5"><Label className="text-sm font-semibold">Standort</Label><Input value={stelleForm.standort} onChange={(e) => setStelleForm((p) => ({ ...p, standort: e.target.value }))} placeholder="z.B. München / Remote" /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-sm font-semibold">Beschäftigungsart</Label><Input value={stelleForm.beschaeftigungsart} onChange={(e) => setStelleForm((p) => ({ ...p, beschaeftigungsart: e.target.value }))} placeholder="z.B. Vollzeit, Teilzeit, Freelancer" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-semibold">Beschreibung</Label><Textarea value={stelleForm.beschreibung} onChange={(e) => setStelleForm((p) => ({ ...p, beschreibung: e.target.value }))} rows={3} className="resize-none" placeholder="Aufgabenbeschreibung…" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-semibold">Anforderungen</Label><Textarea value={stelleForm.anforderungen} onChange={(e) => setStelleForm((p) => ({ ...p, anforderungen: e.target.value }))} rows={2} className="resize-none" placeholder="Was bringt der Kandidat mit?" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-semibold">Benefits</Label><Textarea value={stelleForm.benefits} onChange={(e) => setStelleForm((p) => ({ ...p, benefits: e.target.value }))} rows={2} className="resize-none" placeholder="Was bieten wir?" /></div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Status</Label>
              <Select value={stelleForm.status} onValueChange={(v) => setStelleForm((p) => ({ ...p, status: v as StellenStatus }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.entries(STELLEN_STATUS_LABELS) as [StellenStatus, string][]).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setStellenDialogOpen(false)}>Abbrechen</Button>
              <Button onClick={handleSaveStelle} disabled={!stelleForm.titel} className="gap-2 gradient-brand border-0 text-white">
                <CheckCircle2 className="h-4 w-4" /> {editingStelleId ? "Speichern" : "Erstellen"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Neuer Onboarding-Termin Dialog */}
      <Dialog open={newTerminDialogOpen} onOpenChange={setNewTerminDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Neuen Onboarding-Termin anlegen</DialogTitle>
            <DialogDescription>Erstelle einen Termin, zu dem Bewerber eingeladen werden können.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Datum *</Label>
              <Input type="date" value={newTerminForm.datum} onChange={(e) => setNewTerminForm((p) => ({ ...p, datum: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Uhrzeit *</Label>
              <Input type="time" value={newTerminForm.uhrzeit} onChange={(e) => setNewTerminForm((p) => ({ ...p, uhrzeit: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Standort / Adresse *</Label>
              <Input value={newTerminForm.standort} onChange={(e) => setNewTerminForm((p) => ({ ...p, standort: e.target.value }))} placeholder="z.B. München – Leopoldstraße 42" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Max. Teilnehmer *</Label>
              <Input type="number" min="1" max="50" value={newTerminForm.maxTeilnehmer} onChange={(e) => setNewTerminForm((p) => ({ ...p, maxTeilnehmer: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setNewTerminDialogOpen(false)}>Abbrechen</Button>
              <Button
                onClick={handleNewTermin}
                disabled={!newTerminForm.datum || !newTerminForm.uhrzeit || !newTerminForm.standort}
                className="gap-2 gradient-brand border-0 text-white"
              >
                <Plus className="h-4 w-4" /> Termin erstellen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </CRMLayout>
  );
}
