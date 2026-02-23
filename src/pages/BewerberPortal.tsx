import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2, ChevronRight, Brain, Upload, FileText, ExternalLink,
  User, Briefcase, Target, ArrowRight, Sparkles, MapPin, Clock, Building2,
} from "lucide-react";
import imonduLogo from "@/assets/imondu-logo-full.png";
import { getStoredStellen, type Stellenprofil } from "@/data/stellenprofile-data";

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

const BESCHAEFTIGUNGS_LABELS: Record<string, string> = {
  nebenberuflich: "Nebenberuflich",
  hauptberuflich: "Hauptberuflich",
  freier_handelsvertreter: "Freier Handelsvertreter",
  angestellt_fixum: "Angestellt mit Fixum + Provision",
};

interface BewerbungData {
  vorname: string; nachname: string; email: string; telefon: string; ort: string;
  erfahrung: string; motivation: string; vertriebsziel: string; beschaeftigung: string;
  personalityType: string; pdfName: string; lebenslaufName: string;
  stelleId?: string;
  submittedAt: string;
}

function getStoredBewerbung(): BewerbungData | null {
  try {
    const saved = localStorage.getItem("imondu-bewerbung");
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function saveBewerbung(data: BewerbungData) {
  localStorage.setItem("imondu-bewerbung", JSON.stringify(data));
}

// ── Stellenanzeigen-Karte ──
function StellenKarte({ stelle, onBewerben }: { stelle: Stellenprofil; onBewerben?: (id: string) => void }) {
  return (
    <div className="glass-card rounded-xl p-5 space-y-3 hover:shadow-crm-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">{stelle.titel}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{stelle.abteilung}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{stelle.standort}</span>
            <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{stelle.beschaeftigungsart}</span>
          </div>
        </div>
        {stelle.veroeffentlichtAm && (
          <Badge variant="secondary" className="text-[10px] shrink-0">
            <Clock className="h-3 w-3 mr-1" />
            seit {new Date(stelle.veroeffentlichtAm).toLocaleDateString("de-DE")}
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{stelle.beschreibung}</p>
      {stelle.anforderungen && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Anforderungen</p>
          <p className="text-xs text-foreground">{stelle.anforderungen}</p>
        </div>
      )}
      {stelle.benefits && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Benefits</p>
          <p className="text-xs text-foreground">{stelle.benefits}</p>
        </div>
      )}
      {onBewerben && (
        <Button size="sm" className="gap-1.5 gradient-brand border-0 text-white" onClick={() => onBewerben(stelle.id)}>
          <ArrowRight className="h-3.5 w-3.5" /> Jetzt bewerben
        </Button>
      )}
    </div>
  );
}

// ── Gesamtansicht nach Absenden ──
function BewerbungGesamtansicht({ data, embedded }: { data: BewerbungData; embedded?: boolean }) {
  const stellen = getStoredStellen().filter((s) => s.status === "veroeffentlicht");
  const beworbeneStelle = data.stelleId ? getStoredStellen().find((s) => s.id === data.stelleId) : null;

  const content = (
    <div className={embedded ? "" : "flex items-start justify-center p-6"} style={{ minHeight: embedded ? "auto" : "100vh" }}>
      <div className="max-w-2xl w-full space-y-6">
        {!embedded && <img src={imonduLogo} alt="IMONDU" className="h-10 mx-auto" />}

        {embedded && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1"><div className="w-10 h-1 rounded-full gradient-brand" /></div>
            <h1 className="text-2xl font-display font-bold text-foreground">Meine Bewerbung</h1>
            <p className="text-sm text-muted-foreground mt-1">Übersicht Deiner eingereichten Bewerbung.</p>
          </div>
        )}

        <Tabs defaultValue="bewerbung">
          <TabsList>
            <TabsTrigger value="bewerbung" className="text-sm gap-1.5"><FileText className="h-3.5 w-3.5" /> Meine Bewerbung</TabsTrigger>
            <TabsTrigger value="stellen" className="text-sm gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Offene Stellen ({stellen.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="bewerbung" className="mt-4 space-y-4">
            {/* Status Banner */}
            <div className="bg-card border border-primary/20 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="text-sm font-bold text-foreground">Bewerbung eingereicht</p>
                <p className="text-xs text-muted-foreground">
                  Eingereicht am {new Date(data.submittedAt).toLocaleDateString("de-DE")} – Wir prüfen Deine Angaben und melden uns zeitnah.
                </p>
              </div>
            </div>

            {beworbeneStelle && (
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Beworben auf</p>
                <p className="text-sm font-bold text-foreground">{beworbeneStelle.titel}</p>
                <p className="text-xs text-muted-foreground">{beworbeneStelle.standort} · {beworbeneStelle.beschaeftigungsart}</p>
              </div>
            )}

            {/* Alle Angaben */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/20">
                <h2 className="text-sm font-semibold text-foreground">Deine Angaben</h2>
              </div>
              <div className="divide-y divide-border/50">
                <SummaryRow label="Name" value={`${data.vorname} ${data.nachname}`} />
                <SummaryRow label="E-Mail" value={data.email} />
                {data.telefon && <SummaryRow label="Telefon" value={data.telefon} />}
                {data.ort && <SummaryRow label="Wohnort" value={data.ort} />}
                {data.erfahrung && <SummaryRow label="Berufserfahrung" value={data.erfahrung} />}
                {data.lebenslaufName && <SummaryRow label="Lebenslauf" value={data.lebenslaufName} />}
                <SummaryRow label="Motivation" value={data.motivation} />
                <SummaryRow label="Ziele" value={data.vertriebsziel} />
                <SummaryRow label="Beschäftigungsart" value={BESCHAEFTIGUNGS_LABELS[data.beschaeftigung] || data.beschaeftigung} />
                <SummaryRow label="Persönlichkeitstyp" value={data.personalityType} />
                {data.pdfName && <SummaryRow label="16P PDF" value={data.pdfName} />}
              </div>
            </div>

            {/* Nächste Schritte */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs font-semibold text-foreground mb-2">Nächste Schritte:</p>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />Screening Deiner Unterlagen</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />Persönliches Gespräch / Interview</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />Entscheidung & Onboarding-Einladung</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="stellen" className="mt-4 space-y-4">
            {stellen.length > 0 ? (
              stellen.map((s) => <StellenKarte key={s.id} stelle={s} />)
            ) : (
              <div className="py-12 text-center text-muted-foreground text-sm">
                Aktuell keine offenen Stellen verfügbar.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  if (embedded) return content;
  return <div className="min-h-screen bg-background">{content}</div>;
}

// ── Haupt-Export ──
export default function BewerberPortal({ embedded }: { embedded?: boolean }) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"bewerben" | "stellen">("bewerben");
  const [selectedStelleId, setSelectedStelleId] = useState<string | undefined>();

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
  const [lebenslaufName, setLebenslaufName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Check for saved bewerbung
  const [savedBewerbung, setSavedBewerbung] = useState<BewerbungData | null>(null);
  useEffect(() => {
    const saved = getStoredBewerbung();
    if (saved) {
      setSavedBewerbung(saved);
      setSubmitted(true);
    }
  }, []);

  const stellen = getStoredStellen().filter((s) => s.status === "veroeffentlicht");

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
    setShowSubmitDialog(true);
    setTimeout(() => {
      const data: BewerbungData = {
        vorname, nachname, email, telefon, ort, erfahrung,
        motivation, vertriebsziel, beschaeftigung,
        personalityType, pdfName, lebenslaufName,
        stelleId: selectedStelleId,
        submittedAt: new Date().toISOString(),
      };
      saveBewerbung(data);
      setSavedBewerbung(data);
      setSubmitted(true);
      setShowSubmitDialog(false);
      toast({ title: "Bewerbung eingereicht ✓", description: "Vielen Dank! Wir melden uns zeitnah bei Dir." });
    }, 3000);
  };

  const handleBewerbenAufStelle = (stelleId: string) => {
    setSelectedStelleId(stelleId);
    setActiveTab("bewerben");
    toast({ title: "Stelle ausgewählt", description: "Fülle jetzt das Bewerbungsformular aus." });
  };

  // Show Gesamtansicht after submission
  if (submitted && savedBewerbung) {
    return <BewerbungGesamtansicht data={savedBewerbung} embedded={embedded} />;
  }

  const mainContent = (
    <div className={embedded ? "p-6 lg:p-8" : "max-w-2xl mx-auto p-6"}>
      {!embedded && (
        <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between mb-6 -mx-6 -mt-6">
          <img src={imonduLogo} alt="IMONDU" className="h-8" />
          <Badge variant="outline" className="text-xs">Bewerbungsportal</Badge>
        </header>
      )}

      {embedded && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1"><div className="w-10 h-1 rounded-full gradient-brand" /></div>
          <h1 className="text-2xl font-display font-bold text-foreground">Meine Bewerbung</h1>
          <p className="text-sm text-muted-foreground mt-1">Bewirb Dich Schritt für Schritt oder entdecke offene Stellen.</p>
        </div>
      )}

      <div className="space-y-6 max-w-2xl">
        {/* Tab: Bewerben / Stellen */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "bewerben" | "stellen")}>
          <TabsList>
            <TabsTrigger value="bewerben" className="text-sm gap-1.5"><User className="h-3.5 w-3.5" /> Bewerbung</TabsTrigger>
            <TabsTrigger value="stellen" className="text-sm gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Offene Stellen ({stellen.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="stellen" className="mt-4 space-y-4">
            {stellen.length > 0 ? (
              stellen.map((s) => <StellenKarte key={s.id} stelle={s} onBewerben={handleBewerbenAufStelle} />)
            ) : (
              <div className="py-12 text-center text-muted-foreground text-sm">Aktuell keine offenen Stellen verfügbar.</div>
            )}
          </TabsContent>

          <TabsContent value="bewerben" className="mt-4 space-y-6">
            {/* Gewählte Stelle */}
            {selectedStelleId && (() => {
              const stelle = stellen.find((s) => s.id === selectedStelleId);
              return stelle ? (
                <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Bewerbung auf</p>
                    <p className="text-sm font-bold text-foreground">{stelle.titel}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelectedStelleId(undefined)}>Ändern</Button>
                </div>
              ) : null;
            })()}

            {/* Step Indicator */}
            <div className="flex items-center gap-1">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const done = i < step;
                const active = i === step;
                return (
                  <div key={s.id} className="flex items-center flex-1">
                    <div className="flex-1 text-center">
                      <div className={`h-2 rounded-full transition-colors ${done ? "gradient-brand" : active ? "bg-primary" : "bg-secondary"}`} />
                      <div className="flex items-center justify-center gap-1 mt-1.5">
                        <Icon className={`h-3 w-3 ${done || active ? "text-primary" : "text-muted-foreground/40"}`} />
                        <span className={`text-[10px] ${done || active ? "text-foreground font-medium" : "text-muted-foreground/50"}`}>{s.label}</span>
                      </div>
                    </div>
                    {i < STEPS.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/30 mx-0.5 shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* Step Content */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              {step === 0 && (
                <>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Persönliche Daten</h2>
                    <p className="text-sm text-muted-foreground mt-1">Erzähle uns etwas über Dich.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-sm font-semibold">Vorname *</Label><Input value={vorname} onChange={(e) => setVorname(e.target.value)} placeholder="Dein Vorname" /></div>
                    <div className="space-y-1.5"><Label className="text-sm font-semibold">Nachname *</Label><Input value={nachname} onChange={(e) => setNachname(e.target.value)} placeholder="Dein Nachname" /></div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-sm font-semibold">E-Mail *</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.de" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-sm font-semibold">Telefon</Label><Input value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="+49 …" /></div>
                    <div className="space-y-1.5"><Label className="text-sm font-semibold">Wohnort</Label><Input value={ort} onChange={(e) => setOrt(e.target.value)} placeholder="z.B. München" /></div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-sm font-semibold">Berufserfahrung</Label><Input value={erfahrung} onChange={(e) => setErfahrung(e.target.value)} placeholder="z.B. 3 Jahre Vertrieb, Quereinsteiger, etc." /></div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Lebenslauf hochladen (optional)</Label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{lebenslaufName || "PDF, DOCX – Hier klicken oder ablegen…"}</span>
                      <input type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setLebenslaufName(f.name); toast({ title: "Lebenslauf hochgeladen", description: f.name }); } }} />
                    </label>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div><h2 className="text-lg font-bold text-foreground">Motivation & Ziele</h2><p className="text-sm text-muted-foreground mt-1">Was treibt Dich an?</p></div>
                  <div className="space-y-1.5"><Label className="text-sm font-semibold">Warum möchtest Du bei IMONDU arbeiten? *</Label><Textarea value={motivation} onChange={(e) => setMotivation(e.target.value)} rows={4} className="resize-none" placeholder="Was motiviert Dich?" /></div>
                  <div className="space-y-1.5"><Label className="text-sm font-semibold">Was möchtest Du erreichen? *</Label><Textarea value={vertriebsziel} onChange={(e) => setVertriebsziel(e.target.value)} rows={3} className="resize-none" placeholder="Karriereziele, Einkommensziel, …" /></div>
                </>
              )}

              {step === 2 && (
                <>
                  <div><h2 className="text-lg font-bold text-foreground">Beschäftigungsart</h2><p className="text-sm text-muted-foreground mt-1">Wie möchtest Du mit IMONDU zusammenarbeiten?</p></div>
                  <RadioGroup value={beschaeftigung} onValueChange={setBeschaeftigung} className="space-y-3">
                    {[
                      { value: "nebenberuflich", label: "Nebenberuflich", desc: "Neben Deinem aktuellen Job eine zweite Einkommensquelle aufbauen." },
                      { value: "hauptberuflich", label: "Hauptberuflich", desc: "Voll auf die Arbeit mit IMONDU konzentrieren." },
                      { value: "freier_handelsvertreter", label: "Freier Handelsvertreter (§ 84 HGB)", desc: "Selbstständig auf Provisionsbasis – maximale Freiheit." },
                      { value: "angestellt_fixum", label: "Angestellt mit Fixum + Provision", desc: "Festes Grundgehalt mit leistungsabhängiger Provision." },
                    ].map((opt) => (
                      <label key={opt.value} className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${beschaeftigung === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                        <RadioGroupItem value={opt.value} className="mt-0.5" />
                        <div><p className="text-sm font-semibold text-foreground">{opt.label}</p><p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p></div>
                      </label>
                    ))}
                  </RadioGroup>
                </>
              )}

              {step === 3 && (
                <>
                  <div><h2 className="text-lg font-bold text-foreground">16 Personalities Test</h2><p className="text-sm text-muted-foreground mt-1">Absolviere den Test und teile Dein Ergebnis.</p></div>
                  <a href="https://www.16personalities.com/de/kostenloser-personlichkeitstest" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                    <Brain className="h-8 w-8 text-primary shrink-0" />
                    <div><p className="text-sm font-semibold text-foreground">Jetzt Test absolvieren →</p><p className="text-xs text-muted-foreground">Kostenlos auf 16personalities.com (ca. 12 Min.)</p></div>
                    <ExternalLink className="h-4 w-4 text-primary ml-auto" />
                  </a>
                  <div className="space-y-1.5"><Label className="text-sm font-semibold">Dein Persönlichkeitstyp *</Label>
                    <Select value={personalityType} onValueChange={setPersonalityType}><SelectTrigger><SelectValue placeholder="Typ auswählen (z.B. ENTJ)" /></SelectTrigger><SelectContent>{PERSONALITY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div className="space-y-1.5"><Label className="text-sm font-semibold">PDF-Ergebnis hochladen (optional)</Label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors"><Upload className="h-5 w-5 text-muted-foreground" /><span className="text-sm text-muted-foreground">{pdfName || "PDF hier ablegen oder klicken…"}</span><input type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setPdfName(f.name); }} /></label>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div><h2 className="text-lg font-bold text-foreground flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Fast geschafft!</h2><p className="text-sm text-muted-foreground mt-1">Prüfe Deine Angaben und sende ab.</p></div>
                  <div className="space-y-3">
                    <SummaryRow label="Name" value={`${vorname} ${nachname}`} />
                    <SummaryRow label="E-Mail" value={email} />
                    {telefon && <SummaryRow label="Telefon" value={telefon} />}
                    {ort && <SummaryRow label="Ort" value={ort} />}
                    {erfahrung && <SummaryRow label="Erfahrung" value={erfahrung} />}
                    {lebenslaufName && <SummaryRow label="Lebenslauf" value={lebenslaufName} />}
                    <SummaryRow label="Motivation" value={motivation} />
                    <SummaryRow label="Ziele" value={vertriebsziel} />
                    <SummaryRow label="Beschäftigungsart" value={BESCHAEFTIGUNGS_LABELS[beschaeftigung] || beschaeftigung} />
                    <SummaryRow label="Persönlichkeitstyp" value={personalityType} />
                    {pdfName && <SummaryRow label="16P PDF" value={pdfName} />}
                    {selectedStelleId && (() => { const s = stellen.find((x) => x.id === selectedStelleId); return s ? <SummaryRow label="Stelle" value={s.titel} /> : null; })()}
                  </div>
                  <Button onClick={handleSubmit} className="w-full gap-2 gradient-brand border-0 text-white"><CheckCircle2 className="h-4 w-4" /> Bewerbung absenden</Button>
                </>
              )}
            </div>

            {/* Navigation */}
            {step < 4 && (
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Zurück</Button>
                <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="gap-1 gradient-brand border-0 text-white">Weiter <ChevronRight className="h-4 w-4" /></Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Submit Overlay */}
      <Dialog open={showSubmitDialog} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm text-center [&>button]:hidden">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="h-16 w-16 rounded-full gradient-brand flex items-center justify-center animate-pulse"><CheckCircle2 className="h-8 w-8 text-white" /></div>
            <DialogHeader>
              <DialogTitle className="text-center">Bewerbung wird übermittelt…</DialogTitle>
              <DialogDescription className="text-center">Deine Bewerbung wird verarbeitet. Wir melden uns zeitnah bei Dir.</DialogDescription>
            </DialogHeader>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  if (embedded) return mainContent;
  return <div className="min-h-screen bg-background">{mainContent}</div>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
      <span className="text-xs font-semibold text-muted-foreground w-32 shrink-0">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}
