import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2, ChevronRight, Brain, Upload, FileText, ExternalLink,
  User, Briefcase, Target, ArrowRight, Sparkles,
} from "lucide-react";
import imonduLogo from "@/assets/imondu-logo-full.png";

const STEPS = [
  { id: "persoenlich", label: "Persönliche Daten", icon: User },
  { id: "motivation", label: "Motivation & Ziele", icon: Target },
  { id: "beschaeftigung", label: "Beschäftigungsart", icon: Briefcase },
  { id: "persoenlichkeit", label: "16 Personalities", icon: Brain },
  { id: "abschluss", label: "Abschluss", icon: CheckCircle2 },
];

const PERSONALITY_TYPES = [
  "ENTJ", "ENFJ", "ESTP", "ENTP", "ESTJ", "ESFJ", "ENFP", "ESFP",
  "INTJ", "INTP", "INFJ", "INFP", "ISTJ", "ISFJ", "ISTP", "ISFP",
];

export default function BewerberPortal() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  // Form data
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [ort, setOrt] = useState("");

  const [motivation, setMotivation] = useState("");
  const [vertriebsziel, setVertriebsziel] = useState("");
  const [erfahrung, setErfahrung] = useState("");

  const [beschaeftigung, setBeschaeftigung] = useState("");

  const [personalityType, setPersonalityType] = useState("");
  const [pdfName, setPdfName] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const currentStep = STEPS[step];

  const canNext = () => {
    switch (step) {
      case 0: return vorname && nachname && email;
      case 1: return motivation && vertriebsziel;
      case 2: return !!beschaeftigung;
      case 3: return !!(personalityType || pdfName);
      default: return true;
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    toast({
      title: "Bewerbung eingereicht ✓",
      description: "Vielen Dank! Wir melden uns zeitnah bei Dir.",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <img src={imonduLogo} alt="IMONDU" className="h-10 mx-auto" />
          <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Bewerbung eingereicht!</h1>
            <p className="text-sm text-muted-foreground">
              Vielen Dank für Deine Bewerbung bei IMONDU, {vorname}. Wir prüfen Deine Angaben
              und melden uns zeitnah bei Dir. Du erhältst eine Bestätigung per E-Mail an {email}.
            </p>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 text-left">
              <p className="text-xs font-semibold text-foreground mb-2">Nächste Schritte:</p>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />Screening Deiner Unterlagen</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />Persönliches Gespräch / Interview</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />Entscheidung & Onboarding-Einladung</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <img src={imonduLogo} alt="IMONDU" className="h-8" />
        <Badge variant="outline" className="text-xs">Bewerbungsportal</Badge>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex-1 text-center">
                  <div className={`h-2 rounded-full transition-colors ${
                    done ? "gradient-brand" : active ? "bg-primary" : "bg-secondary"
                  }`} />
                  <div className="flex items-center justify-center gap-1 mt-1.5">
                    <Icon className={`h-3 w-3 ${done || active ? "text-primary" : "text-muted-foreground/40"}`} />
                    <span className={`text-[10px] ${done || active ? "text-foreground font-medium" : "text-muted-foreground/50"}`}>
                      {s.label}
                    </span>
                  </div>
                </div>
                {i < STEPS.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/30 mx-0.5 shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          {/* Step 0: Persönliche Daten */}
          {step === 0 && (
            <>
              <div>
                <h2 className="text-lg font-bold text-foreground">Persönliche Daten</h2>
                <p className="text-sm text-muted-foreground mt-1">Erzähle uns etwas über Dich.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Vorname *</Label>
                  <Input value={vorname} onChange={(e) => setVorname(e.target.value)} placeholder="Dein Vorname" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Nachname *</Label>
                  <Input value={nachname} onChange={(e) => setNachname(e.target.value)} placeholder="Dein Nachname" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">E-Mail *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.de" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Telefon</Label>
                  <Input value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="+49 …" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Wohnort</Label>
                  <Input value={ort} onChange={(e) => setOrt(e.target.value)} placeholder="z.B. München" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Berufserfahrung</Label>
                <Input value={erfahrung} onChange={(e) => setErfahrung(e.target.value)} placeholder="z.B. 3 Jahre Vertrieb, Quereinsteiger, etc." />
              </div>
            </>
          )}

          {/* Step 1: Motivation & Ziele */}
          {step === 1 && (
            <>
              <div>
                <h2 className="text-lg font-bold text-foreground">Motivation & Vertriebsziele</h2>
                <p className="text-sm text-muted-foreground mt-1">Was treibt Dich an? Was willst Du im Vertrieb erreichen?</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Warum möchtest Du bei IMONDU arbeiten? *</Label>
                <Textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  rows={4}
                  className="resize-none"
                  placeholder="Was motiviert Dich, im Immobilienvertrieb zu arbeiten?"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Was willst Du vertrieblich erreichen? *</Label>
                <Textarea
                  value={vertriebsziel}
                  onChange={(e) => setVertriebsziel(e.target.value)}
                  rows={3}
                  className="resize-none"
                  placeholder="z.B. Eigenständige Kundenakquise, Teamleitung, Einkommensziel, …"
                />
              </div>
            </>
          )}

          {/* Step 2: Beschäftigungsart */}
          {step === 2 && (
            <>
              <div>
                <h2 className="text-lg font-bold text-foreground">Beschäftigungsart</h2>
                <p className="text-sm text-muted-foreground mt-1">Wie möchtest Du mit IMONDU zusammenarbeiten?</p>
              </div>
              <RadioGroup value={beschaeftigung} onValueChange={setBeschaeftigung} className="space-y-3">
                {[
                  { value: "nebenberuflich", label: "Nebenberuflich", desc: "Ich starte neben meinem aktuellen Job und baue mir sukzessive eine zweite Einkommensquelle auf." },
                  { value: "hauptberuflich", label: "Hauptberuflich", desc: "Ich möchte mich voll auf den Vertrieb mit IMONDU konzentrieren." },
                  { value: "freier_handelsvertreter", label: "Freier Handelsvertreter (§ 84 HGB)", desc: "Ich arbeite selbstständig auf Provisionsbasis – maximale Freiheit und Verdienstmöglichkeiten." },
                  { value: "angestellt_fixum", label: "Angestellt mit Fixum + Provision", desc: "Ich bevorzuge ein festes Grundgehalt mit leistungsabhängiger Provision on top." },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                      beschaeftigung === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <RadioGroupItem value={opt.value} className="mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </>
          )}

          {/* Step 3: 16 Personalities */}
          {step === 3 && (
            <>
              <div>
                <h2 className="text-lg font-bold text-foreground">16 Personalities Test</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Absolviere den offiziellen Persönlichkeitstest und teile uns Dein Ergebnis mit.
                </p>
              </div>

              <a
                href="https://www.16personalities.com/de/kostenloser-personlichkeitstest"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <Brain className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Jetzt Test absolvieren →</p>
                  <p className="text-xs text-muted-foreground">Kostenlos auf 16personalities.com (ca. 12 Min.)</p>
                </div>
                <ExternalLink className="h-4 w-4 text-primary ml-auto" />
              </a>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Dein Persönlichkeitstyp *</Label>
                <Select value={personalityType} onValueChange={setPersonalityType}>
                  <SelectTrigger><SelectValue placeholder="Typ auswählen (z.B. ENTJ)" /></SelectTrigger>
                  <SelectContent>
                    {PERSONALITY_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">PDF-Ergebnis hochladen (optional)</Label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {pdfName ? pdfName : "PDF hier ablegen oder klicken…"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setPdfName(file.name);
                    }}
                  />
                </label>
              </div>
            </>
          )}

          {/* Step 4: Abschluss */}
          {step === 4 && (
            <>
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Fast geschafft!
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Prüfe Deine Angaben und sende Deine Bewerbung ab.</p>
              </div>

              <div className="space-y-3">
                <SummaryRow label="Name" value={`${vorname} ${nachname}`} />
                <SummaryRow label="E-Mail" value={email} />
                {telefon && <SummaryRow label="Telefon" value={telefon} />}
                {ort && <SummaryRow label="Ort" value={ort} />}
                {erfahrung && <SummaryRow label="Erfahrung" value={erfahrung} />}
                <SummaryRow label="Motivation" value={motivation} />
                <SummaryRow label="Vertriebsziel" value={vertriebsziel} />
                <SummaryRow label="Beschäftigungsart" value={
                  beschaeftigung === "nebenberuflich" ? "Nebenberuflich" :
                  beschaeftigung === "hauptberuflich" ? "Hauptberuflich" :
                  beschaeftigung === "freier_handelsvertreter" ? "Freier Handelsvertreter" :
                  "Angestellt mit Fixum + Provision"
                } />
                <SummaryRow label="Persönlichkeitstyp" value={personalityType} />
                {pdfName && <SummaryRow label="PDF-Upload" value={pdfName} />}
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full gap-2 gradient-brand border-0 text-white"
              >
                <CheckCircle2 className="h-4 w-4" /> Bewerbung absenden
              </Button>
            </>
          )}
        </div>

        {/* Navigation */}
        {step < 4 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              Zurück
            </Button>
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="gap-1 gradient-brand border-0 text-white"
            >
              Weiter <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
      <span className="text-xs font-semibold text-muted-foreground w-32 shrink-0">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}
