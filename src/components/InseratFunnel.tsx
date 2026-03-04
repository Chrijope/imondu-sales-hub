import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Objekttyp, Sanierungsstatus } from "@/data/crm-data";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Upload,
  FileText,
  Image as ImageIcon,
  Info,
  Camera,
  File,
  MapIcon,
  Zap,
  ClipboardList,
  BookOpen,
  Lightbulb,
  Mail,
  LogIn,
  Copy,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Eigentümer" },
  { id: 2, label: "Objekt" },
  { id: 3, label: "Entwicklung" },
  { id: 4, label: "Bilder" },
  { id: 5, label: "Dokumente" },
  { id: 6, label: "Übersicht" },
];

type InserierendeRolle = "eigentuemer" | "teil-eigentuemer" | "angehoeriger" | "makler" | "imondu-auftrag";

const INSERIERENDE_ROLLEN: { id: InserierendeRolle; label: string; desc: string }[] = [
  { id: "eigentuemer", label: "Ich bin Eigentümer", desc: "Ich inseriere meine eigene Immobilie" },
  { id: "teil-eigentuemer", label: "Ich bin Teil-Eigentümer", desc: "Ich bin Miteigentümer der Immobilie" },
  { id: "angehoeriger", label: "Ich bin Angehöriger", desc: "Ich inseriere im Auftrag eines Familienmitglieds" },
  { id: "makler", label: "Makler / Vermittler", desc: "Ich inseriere als beauftragter Makler" },
  { id: "imondu-auftrag", label: "IMONDU im Auftrag", desc: "IMONDU inseriert im Auftrag des Eigentümers" },
];

interface FunnelForm {
  // Step 0 – Eigentümer-Rolle
  inserierendeRolle: InserierendeRolle | "";
  eigentuemerEmail: string;
  eigentuemerTelefon: string;
  registerEigentuemer: boolean;
  // Step 1
  objekttyp: Objekttyp;
  titel: string;
  beschreibung: string;
  adresse: string;
  plz: string;
  ort: string;
  eigentuemerName: string;
  // Step 2
  stockwerke: string;
  zimmer: string;
  baederWc: string;
  wohnflaeche: string;
  nutzflaeche: string;
  grundstueck: string;
  terrasse: string;
  balkon: string;
  parkplatz: string;
  parkplatzAnzahl: string;
  baujahr: string;
  letzteRenovierung: string;
  erbpacht: string;
  erbpachtBis: string;
  vermietet: string;
  mieteinnahmen: string;
  sanierungsstatus: Sanierungsstatus;
  anzahlEinheiten: string;
  // Step 3 – Entwicklungsplanung
  entwicklungsabsicht: string;
  geplanteEntwicklung: string[];
  zielNachEntwicklung: string;
  zeitrahmen: string;
  budgetRange: string;
  finanzierungGesichert: string;
  eigenkapitalVorhanden: string;
  entwicklungsNotizen: string;
  immobilienwert: string;
  // Step 4 – images
  bilder: string[];
  // Step 5 – documents
  dokumente: { typ: string; name: string }[];
}

const DOKUMENT_TYPEN = [
  { typ: "Grundriss", icon: MapIcon },
  { typ: "Energieausweis", icon: Zap },
  { typ: "Mietvertrag", icon: ClipboardList },
  { typ: "Grundbuch", icon: BookOpen },
  { typ: "Wohnflächenberechnung", icon: File },
  { typ: "Lageplan", icon: MapIcon },
  { typ: "Sonstiges", icon: FileText },
];

const ENTWICKLUNGS_OPTIONEN = [
  "Kernsanierung",
  "Teilsanierung",
  "Aufstockung",
  "Anbau / Erweiterung",
  "Abriss & Neubau",
  "Umnutzung",
  "Energetische Sanierung",
  "Fassadensanierung",
  "Dachsanierung",
  "Heizungstausch",
  "Fenstertausch",
  "Badsanierung",
];

// Collapsible section (same as EntwicklerRegistrieren)
function AccordionSection({
  title,
  done,
  open,
  onToggle,
  children,
}: {
  title: string;
  done: boolean;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 py-3.5 text-left transition-all ${
          open ? "bg-primary/5 border-b border-border" : "bg-muted/30"
        }`}
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {done && <CheckCircle2 className="h-5 w-5 text-primary" />}
      </button>
      {open && <div className="p-5 bg-card">{children}</div>}
    </div>
  );
}

export default function InseratFunnel({ onClose, rabattCode }: { onClose: () => void; rabattCode?: string }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    objekt: true, angaben: false, entwicklung: false,
    bilder: true, dokumente: false,
  });

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const [form, setForm] = useState<FunnelForm>({
    inserierendeRolle: "",
    eigentuemerEmail: "",
    eigentuemerTelefon: "",
    registerEigentuemer: false,
    objekttyp: "Einfamilienhaus",
    titel: "",
    beschreibung: "",
    adresse: "",
    plz: "",
    ort: "",
    eigentuemerName: "",
    stockwerke: "",
    zimmer: "",
    baederWc: "",
    wohnflaeche: "",
    nutzflaeche: "",
    grundstueck: "",
    terrasse: "",
    balkon: "",
    parkplatz: "",
    parkplatzAnzahl: "",
    baujahr: "",
    letzteRenovierung: "",
    erbpacht: "",
    erbpachtBis: "",
    vermietet: "",
    mieteinnahmen: "",
    sanierungsstatus: "Unsaniert",
    anzahlEinheiten: "",
    entwicklungsabsicht: "",
    geplanteEntwicklung: [],
    zielNachEntwicklung: "",
    zeitrahmen: "",
    budgetRange: "",
    finanzierungGesichert: "",
    eigenkapitalVorhanden: "",
    entwicklungsNotizen: "",
    immobilienwert: "",
    bilder: [],
    dokumente: [],
  });

  const update = (patch: Partial<FunnelForm>) => setForm((f) => ({ ...f, ...patch }));

  const toggleEntwicklung = (val: string) => {
    update({
      geplanteEntwicklung: form.geplanteEntwicklung.includes(val)
        ? form.geplanteEntwicklung.filter((v) => v !== val)
        : [...form.geplanteEntwicklung, val],
    });
  };

  const sectionsDone: Record<string, boolean> = {
    objekt: !!(form.titel && form.adresse && form.eigentuemerName),
    angaben: !!(form.wohnflaeche || form.zimmer),
    entwicklung: !!(form.entwicklungsabsicht),
    bilder: form.bilder.length > 0,
    dokumente: form.dokumente.length > 0,
  };

  const goNext = () => {
    if (step === 1 && !form.inserierendeRolle) {
      toast({ title: "Bitte auswählen", description: "Bitte gib an, in welcher Rolle du inserierst.", variant: "destructive" });
      return;
    }
    if (step === 1 && !form.eigentuemerEmail) {
      toast({ title: "E-Mail erforderlich", description: "Bitte gib die E-Mail des Eigentümers an – der Eigentümer erhält automatisch Zugang zum Dashboard.", variant: "destructive" });
      return;
    }
    if (step === 2 && (!form.titel || !form.adresse || !form.eigentuemerName)) {
      toast({ title: "Pflichtfelder fehlen", description: "Bitte Titel, Adresse und Eigentümer ausfüllen.", variant: "destructive" });
      return;
    }
    if (step < 6) setStep(step + 1);
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isEigentuemer = form.inserierendeRolle === "eigentuemer" || form.inserierendeRolle === "teil-eigentuemer";
  const isFremdInseriert = form.inserierendeRolle === "makler" || form.inserierendeRolle === "angehoeriger" || form.inserierendeRolle === "imondu-auftrag";

  const generatedEmail = form.eigentuemerEmail || "eigentuemer@beispiel.de";
  const generatedPassword = "Immo-" + Math.random().toString(36).slice(2, 8) + "!";

  const handleSubmit = () => {
    // Save inserat to localStorage
    const newInserat = {
      id: Date.now().toString(),
      titel: form.titel,
      objekttyp: form.objekttyp,
      adresse: `${form.adresse}, ${form.plz} ${form.ort}`,
      eigentuemerName: form.eigentuemerName,
      eigentuemerEmail: form.eigentuemerEmail,
      rabattCode: rabattCode || undefined,
      erstelltAm: new Date().toISOString(),
      status: "aktiv" as const,
      bilder: form.bilder.length,
      wohnflaeche: form.wohnflaeche,
    };
    const existing = JSON.parse(localStorage.getItem("imondu-inserate") || "[]");
    existing.push(newInserat);
    localStorage.setItem("imondu-inserate", JSON.stringify(existing));
    setSubmitted(true);
  };

  const simulateImageUpload = () => {
    const newName = `bild_${form.bilder.length + 1}.jpg`;
    update({ bilder: [...form.bilder, newName] });
  };

  const simulateDocUpload = (typ: string) => {
    update({ dokumente: [...form.dokumente, { typ, name: `${typ.toLowerCase()}.pdf` }] });
  };

  if (submitted) {
    return (
      <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
        <div className="max-w-lg mx-auto mt-12">
          <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
            <div className="p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">Inserat erfolgreich erstellt!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  „{form.titel}" wurde als {form.objekttyp} angelegt.
                </p>
              </div>

              {isEigentuemer ? (
                /* Eigentümer inseriert selbst → Zugangsdaten direkt anzeigen */
                <div className="space-y-4 text-left">
                  <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
                    <div className="flex items-center gap-2">
                      <LogIn className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">Ihre Zugangsdaten zum Eigentümer-Dashboard</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Bitte notieren Sie sich Ihre Zugangsdaten. Diese wurden zusätzlich an <strong>{generatedEmail}</strong> gesendet.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                        <div>
                          <p className="text-[11px] text-muted-foreground">E-Mail</p>
                          <p className="text-sm font-mono font-medium text-foreground">{generatedEmail}</p>
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText(generatedEmail); toast({ title: "Kopiert!" }); }} className="text-muted-foreground hover:text-foreground">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                        <div>
                          <p className="text-[11px] text-muted-foreground">Passwort</p>
                          <p className="text-sm font-mono font-medium text-foreground">{generatedPassword}</p>
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText(generatedPassword); toast({ title: "Kopiert!" }); }} className="text-muted-foreground hover:text-foreground">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate("/login?role=eigentuemer")}
                    className="w-full gap-2 gradient-brand border-0 text-primary-foreground font-semibold"
                  >
                    <LogIn className="h-4 w-4" /> Jetzt einloggen
                  </Button>
                </div>
              ) : (
                /* Fremd-inseriert → E-Mail-Hinweis */
                <div className="space-y-4 text-left">
                  <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">Zugangsdaten per E-Mail versendet</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Die Zugangsdaten zum Eigentümer-Dashboard wurden automatisch an <strong>{generatedEmail}</strong> gesendet. 
                      Der Eigentümer kann sich damit jederzeit einloggen und sein Inserat verwalten.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 rounded-lg px-3 py-2">
                      <Info className="h-3.5 w-3.5 shrink-0" />
                      <span>Inseriert durch: {INSERIERENDE_ROLLEN.find(r => r.id === form.inserierendeRolle)?.label}</span>
                    </div>
                  </div>

                  <Button onClick={onClose} className="w-full gap-2 gradient-brand border-0 text-primary-foreground font-semibold">
                    <CheckCircle2 className="h-4 w-4" /> Zurück zur Übersicht
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
      <div className="max-w-5xl">
        {/* Header */}
        <h1 className="text-2xl font-display font-bold text-foreground text-center mb-6">Neues Inserat erstellen</h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8 max-w-2xl mx-auto">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setStep(s.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                    step === s.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : step > s.id
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.id}
                </button>
                <span className={`mt-2 text-xs whitespace-nowrap ${step === s.id ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 mt-[-1.25rem] ${step > s.id ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-4">
            {step === 1 && (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="w-full px-5 py-3.5 bg-primary/5 border-b border-border">
                  <span className="text-sm font-semibold text-foreground">Bist du Eigentümer der Immobilie?</span>
                </div>
                <div className="p-5 bg-card space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {INSERIERENDE_ROLLEN.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => update({ inserierendeRolle: r.id })}
                        className={`px-5 py-3 rounded-lg border text-sm transition-all text-left ${
                          form.inserierendeRolle === r.id
                            ? "border-primary bg-primary/5 text-foreground font-medium shadow-sm"
                            : "border-border bg-card text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <span className="block font-medium">{r.label}</span>
                        <span className="block text-[11px] text-muted-foreground mt-0.5">{r.desc}</span>
                      </button>
                    ))}
                  </div>

                  {/* Eigentümer-Registrierung – immer bei Eigentümer/Teil-Eigentümer */}
                  {(form.inserierendeRolle === "eigentuemer" || form.inserierendeRolle === "teil-eigentuemer") && (
                    <div className="mt-4 p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <p className="text-sm font-semibold text-foreground">Eigentümer-Dashboard-Zugang</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Der Eigentümer erhält automatisch Zugang zum Dashboard, um Inserate zu verwalten, Entwickler zu finden und den Status zu verfolgen. Die Zugangsdaten werden per E-Mail versendet.</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">E-Mail des Eigentümers *</Label>
                          <Input placeholder="email@beispiel.de" value={form.eigentuemerEmail} onChange={(e) => update({ eigentuemerEmail: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">Telefon</Label>
                          <Input placeholder="+49 170 ..." value={form.eigentuemerTelefon} onChange={(e) => update({ eigentuemerTelefon: e.target.value })} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 rounded-lg px-3 py-2">
                        <Info className="h-3.5 w-3.5 shrink-0" />
                        <span>Login-Daten werden automatisch per E-Mail an den Eigentümer versendet.</span>
                      </div>
                    </div>
                  )}

                  {/* Makler / Angehöriger / IMONDU – Eigentümer bekommt trotzdem Zugang */}
                  {(form.inserierendeRolle === "makler" || form.inserierendeRolle === "angehoeriger" || form.inserierendeRolle === "imondu-auftrag") && (
                    <div className="mt-4 p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <p className="text-sm font-semibold text-foreground">Eigentümer-Dashboard-Zugang</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {form.inserierendeRolle === "makler" && "Du inserierst als Makler/Vermittler. Der Eigentümer erhält automatisch Zugang zu seinem Dashboard und wird per E-Mail informiert."}
                        {form.inserierendeRolle === "angehoeriger" && "Du inserierst im Auftrag eines Angehörigen. Der Eigentümer erhält automatisch Zugang zu seinem Dashboard und wird per E-Mail informiert."}
                        {form.inserierendeRolle === "imondu-auftrag" && "IMONDU inseriert im Auftrag des Eigentümers. Der Eigentümer erhält automatisch Zugang zu seinem Dashboard und wird per E-Mail informiert."}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">E-Mail des Eigentümers *</Label>
                          <Input placeholder="email@beispiel.de" value={form.eigentuemerEmail} onChange={(e) => update({ eigentuemerEmail: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-muted-foreground">Telefon des Eigentümers</Label>
                          <Input placeholder="+49 170 ..." value={form.eigentuemerTelefon} onChange={(e) => update({ eigentuemerTelefon: e.target.value })} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 rounded-lg px-3 py-2">
                        <Info className="h-3.5 w-3.5 shrink-0" />
                        <span>Login-Daten werden automatisch per E-Mail an den Eigentümer versendet – unabhängig davon, wer das Inserat erstellt.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <>
                <AccordionSection title="Objektbeschreibung" done={sectionsDone.objekt} open={openSections.objekt} onToggle={() => toggleSection("objekt")}>
                  <Step1 form={form} update={update} />
                </AccordionSection>
                <AccordionSection title="Angaben zum Objekt" done={sectionsDone.angaben} open={openSections.angaben} onToggle={() => toggleSection("angaben")}>
                  <Step2 form={form} update={update} />
                </AccordionSection>
              </>
            )}

            {step === 3 && (
              <AccordionSection title="Entwicklungsplanung" done={sectionsDone.entwicklung} open={openSections.entwicklung || true} onToggle={() => toggleSection("entwicklung")}>
                <Step3Entwicklung form={form} update={update} toggleEntwicklung={toggleEntwicklung} />
              </AccordionSection>
            )}

            {step === 4 && (
              <AccordionSection title="Bilder hochladen" done={sectionsDone.bilder} open={openSections.bilder || true} onToggle={() => toggleSection("bilder")}>
                <StepBilder form={form} onUpload={simulateImageUpload} />
              </AccordionSection>
            )}

            {step === 5 && (
              <AccordionSection title="Dokumente hochladen" done={sectionsDone.dokumente} open={openSections.dokumente || true} onToggle={() => toggleSection("dokumente")}>
                <StepDokumente form={form} onUpload={simulateDocUpload} />
              </AccordionSection>
            )}

            {step === 6 && (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="w-full px-5 py-3.5 bg-primary/5 border-b border-border">
                  <span className="text-sm font-semibold text-foreground">Zusammenfassung</span>
                </div>
                <div className="p-5 bg-card space-y-3">
                  <p className="text-sm text-muted-foreground">Bitte überprüfen Sie Ihre Angaben und klicken Sie auf <strong>"Inserat erstellen"</strong>.</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Inseriert als:</span><span className="font-medium">{INSERIERENDE_ROLLEN.find(r => r.id === form.inserierendeRolle)?.label || "–"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Titel:</span><span className="font-medium">{form.titel || "–"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Objekttyp:</span><span className="font-medium">{form.objekttyp}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Adresse:</span><span className="font-medium">{form.adresse || "–"}, {form.plz} {form.ort}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Eigentümer:</span><span className="font-medium">{form.eigentuemerName || "–"}</span></div>
                    {form.eigentuemerEmail && <div className="flex justify-between"><span className="text-muted-foreground">Eigentümer E-Mail:</span><span className="font-medium">{form.eigentuemerEmail}</span></div>}
                    {form.immobilienwert && <div className="flex justify-between"><span className="text-muted-foreground">Immobilienwert:</span><span className="font-medium">{form.immobilienwert} €</span></div>}
                    <div className="flex justify-between"><span className="text-muted-foreground">Bilder:</span><span className="font-medium">{form.bilder.length}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Dokumente:</span><span className="font-medium">{form.dokumente.length}</span></div>
                    <div className="mt-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
                      <p className="text-xs font-semibold text-primary">✓ Eigentümer-Dashboard-Zugang wird erstellt</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Login-Daten werden automatisch an {form.eigentuemerEmail} gesendet.</p>
                      {(form.inserierendeRolle === "makler" || form.inserierendeRolle === "angehoeriger" || form.inserierendeRolle === "imondu-auftrag") && (
                        <p className="text-[11px] text-muted-foreground mt-0.5">Inseriert durch: {INSERIERENDE_ROLLEN.find(r => r.id === form.inserierendeRolle)?.label}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <HintSidebar step={step} />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6">
          <Button variant="outline" onClick={step === 1 ? onClose : goBack} className="gap-2">
            <ChevronLeft className="h-4 w-4" /> {step === 1 ? "Abbrechen" : "Zurück"}
          </Button>
          {step < 6 ? (
            <Button onClick={goNext} className="gap-2 gradient-brand border-0 text-primary-foreground">
              Speichern und weiter <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="gap-2 gradient-brand border-0 text-primary-foreground">
              Inserat erstellen <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Step 1: Objektbeschreibung ── */
function Step1({ form, update }: { form: FunnelForm; update: (p: Partial<FunnelForm>) => void }) {
  return (
    <>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Eigentümer *</Label>
          <Input placeholder="Vor- und Nachname" value={form.eigentuemerName} onChange={(e) => update({ eigentuemerName: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Titel / Überschrift *</Label>
          <Input placeholder="z.B. Bestandshaus mit großem Potenzial" value={form.titel} onChange={(e) => update({ titel: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Um was für eine Immobilie handelt es sich?</Label>
          <div className="flex flex-wrap gap-2">
            {(["Einfamilienhaus", "Mehrfamilienhaus", "Wohnung", "Gewerbeobjekt", "Grundstück", "Mischobjekt"] as Objekttyp[]).map((t) => (
              <button
                key={t}
                onClick={() => update({ objekttyp: t })}
                className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                  form.objekttyp === t
                    ? "border-primary bg-primary/5 text-foreground font-medium"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                {t === "Einfamilienhaus" ? "Haus" : t === "Gewerbeobjekt" ? "Gewerbe" : t}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Sanierungsstatus</Label>
          <Select value={form.sanierungsstatus} onValueChange={(v) => update({ sanierungsstatus: v as Sanierungsstatus })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Unsaniert", "Teilsaniert", "Vollsaniert"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Adresse *</Label>
          <Input placeholder="Straße und Hausnummer" value={form.adresse} onChange={(e) => update({ adresse: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">PLZ</Label>
            <Input placeholder="z.B. 10115" value={form.plz} onChange={(e) => update({ plz: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Ort</Label>
            <Input placeholder="z.B. Berlin" value={form.ort} onChange={(e) => update({ ort: e.target.value })} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Beschreibung</Label>
          <Textarea placeholder="Kurzbeschreibung der Immobilie…" value={form.beschreibung} onChange={(e) => update({ beschreibung: e.target.value })} rows={3} className="resize-none" />
        </div>
      </div>
    </>
  );
}

/* ── Step 2: Angaben zum Objekt ── */
function Step2({ form, update }: { form: FunnelForm; update: (p: Partial<FunnelForm>) => void }) {
  return (
    <>
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Stockwerke</Label>
            <Input type="number" placeholder="-" value={form.stockwerke} onChange={(e) => update({ stockwerke: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Zimmer</Label>
            <Input type="number" placeholder="-" value={form.zimmer} onChange={(e) => update({ zimmer: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Bäder/WC</Label>
            <Input type="number" placeholder="-" value={form.baederWc} onChange={(e) => update({ baederWc: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Wohnfläche</Label>
            <div className="flex items-center gap-1">
              <Input type="number" placeholder="-" value={form.wohnflaeche} onChange={(e) => update({ wohnflaeche: e.target.value })} />
              <span className="text-xs text-muted-foreground font-medium">m²</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Nutzfläche</Label>
            <div className="flex items-center gap-1">
              <Input type="number" placeholder="-" value={form.nutzflaeche} onChange={(e) => update({ nutzflaeche: e.target.value })} />
              <span className="text-xs text-muted-foreground font-medium">m²</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Grundstück</Label>
            <div className="flex items-center gap-1">
              <Input type="number" placeholder="-" value={form.grundstueck} onChange={(e) => update({ grundstueck: e.target.value })} />
              <span className="text-xs text-muted-foreground font-medium">m²</span>
            </div>
          </div>
        </div>

        <hr className="border-border" />

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Aktueller Immobilienwert (geschätzt)</Label>
          <div className="flex items-center gap-1">
            <Input type="text" placeholder="z.B. 350.000" value={form.immobilienwert} onChange={(e) => update({ immobilienwert: e.target.value })} />
            <span className="text-xs text-muted-foreground font-medium">€</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Ihre Einschätzung des aktuellen Marktwerts der Immobilie.</p>
        </div>

        <hr className="border-border" />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Terrasse</Label>
            <Select value={form.terrasse} onValueChange={(v) => update({ terrasse: v })}>
              <SelectTrigger><SelectValue placeholder="Bitte auswählen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ja">Ja</SelectItem>
                <SelectItem value="nein">Nein</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Balkon</Label>
            <Select value={form.balkon} onValueChange={(v) => update({ balkon: v })}>
              <SelectTrigger><SelectValue placeholder="Bitte auswählen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ja">Ja</SelectItem>
                <SelectItem value="nein">Nein</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Parkplatz</Label>
            <Select value={form.parkplatz} onValueChange={(v) => update({ parkplatz: v })}>
              <SelectTrigger><SelectValue placeholder="Bitte auswählen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ja">Ja</SelectItem>
                <SelectItem value="nein">Nein</SelectItem>
                <SelectItem value="garage">Garage</SelectItem>
                <SelectItem value="tiefgarage">Tiefgarage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Anzahl</Label>
            <Input type="number" placeholder="-" value={form.parkplatzAnzahl} onChange={(e) => update({ parkplatzAnzahl: e.target.value })} />
          </div>
        </div>

        <hr className="border-border" />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Baujahr</Label>
            <Input type="number" placeholder="JJJJ" value={form.baujahr} onChange={(e) => update({ baujahr: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Letzte Renovierung</Label>
            <Input type="number" placeholder="JJJJ (optional)" value={form.letzteRenovierung} onChange={(e) => update({ letzteRenovierung: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Erbpacht</Label>
            <Select value={form.erbpacht} onValueChange={(v) => update({ erbpacht: v })}>
              <SelectTrigger><SelectValue placeholder="Bitte auswählen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ja">Ja</SelectItem>
                <SelectItem value="nein">Nein</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Erbpacht bis</Label>
            <Input type="number" placeholder="JJJJ" value={form.erbpachtBis} onChange={(e) => update({ erbpachtBis: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Vermietet</Label>
            <Select value={form.vermietet} onValueChange={(v) => update({ vermietet: v })}>
              <SelectTrigger><SelectValue placeholder="Bitte auswählen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ja">Ja</SelectItem>
                <SelectItem value="nein">Nein</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Mieteinnahmen</Label>
            <div className="flex items-center gap-1">
              <Input type="number" placeholder="Jährliche Kaltm." value={form.mieteinnahmen} onChange={(e) => update({ mieteinnahmen: e.target.value })} />
              <span className="text-xs text-muted-foreground font-medium">€</span>
            </div>
          </div>
        </div>

        {(form.objekttyp === "Mehrfamilienhaus" || form.objekttyp === "Mischobjekt") && (
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Anzahl Einheiten</Label>
            <Input type="number" placeholder="z.B. 6" value={form.anzahlEinheiten} onChange={(e) => update({ anzahlEinheiten: e.target.value })} />
          </div>
        )}
      </div>
    </>
  );
}

/* ── Step 3: Entwicklungsplanung (NEW) ── */
function Step3Entwicklung({
  form,
  update,
  toggleEntwicklung,
}: {
  form: FunnelForm;
  update: (p: Partial<FunnelForm>) => void;
  toggleEntwicklung: (val: string) => void;
}) {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Diese Angaben helfen Entwicklungspartnern einzuschätzen, ob Ihr Objekt zu ihrem Profil passt.
      </p>
      <div className="space-y-5">
        {/* Entwicklungsabsicht */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Haben Sie schon Pläne für die Entwicklung Ihrer Immobilie? *</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "konkrete_plaene", label: "Ja, konkrete Pläne", desc: "Ich weiß was ich möchte" },
              { value: "offen", label: "Offen für Vorschläge", desc: "Ich möchte beraten werden" },
              { value: "keine", label: "Noch keine Pläne", desc: "Erst mal informieren" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => update({ entwicklungsabsicht: opt.value })}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  form.entwicklungsabsicht === opt.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/20"
                }`}
              >
                <p className="text-sm font-medium text-foreground">{opt.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Geplante Maßnahmen */}
        {form.entwicklungsabsicht !== "keine" && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Geplante Maßnahmen (Mehrfachauswahl möglich)</Label>
            <div className="flex flex-wrap gap-2">
              {ENTWICKLUNGS_OPTIONEN.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleEntwicklung(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    form.geplanteEntwicklung.includes(opt)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ziel nach Entwicklung */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Was ist Ihr Ziel nach der Immobilienentwicklung? (optional)</Label>
          <div className="flex flex-wrap gap-4">
            {[
              { value: "verkaufen", label: "Immobilie verkaufen" },
              { value: "behalten", label: "Immobilie behalten" },
              { value: "unklar", label: "Weiß ich nicht" },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="zielNachEntwicklung"
                  checked={form.zielNachEntwicklung === opt.value}
                  onChange={() => update({ zielNachEntwicklung: opt.value })}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm text-foreground">{opt.label}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            Wählen Sie, ob Sie die Immobilie nach der Entwicklung behalten möchten (z.&nbsp;B. zur Vermietung oder Eigennutzung) oder ob Sie einen Verkauf planen. Wenn Sie sich noch nicht sicher sind, können Sie diese Frage offen lassen und später entscheiden.
          </p>
        </div>

        <hr className="border-border" />

        {/* Zeitrahmen & Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Gewünschter Start der Umsetzung</Label>
            <Select value={form.zeitrahmen} onValueChange={(v) => update({ zeitrahmen: v })}>
              <SelectTrigger><SelectValue placeholder="Bitte auswählen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sofort">Sofort / schnellstmöglich</SelectItem>
                <SelectItem value="3-6">In 3–6 Monaten</SelectItem>
                <SelectItem value="6-12">In 6–12 Monaten</SelectItem>
                <SelectItem value="12+">In mehr als 12 Monaten</SelectItem>
                <SelectItem value="unklar">Noch unklar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Budget-Rahmen</Label>
            <Select value={form.budgetRange} onValueChange={(v) => update({ budgetRange: v })}>
              <SelectTrigger><SelectValue placeholder="Bitte auswählen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="<50k">Bis 50.000 €</SelectItem>
                <SelectItem value="50-100k">50.000 – 100.000 €</SelectItem>
                <SelectItem value="100-250k">100.000 – 250.000 €</SelectItem>
                <SelectItem value="250-500k">250.000 – 500.000 €</SelectItem>
                <SelectItem value=">500k">Über 500.000 €</SelectItem>
                <SelectItem value="unklar">Noch unklar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Finanzierung */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Finanzierung gesichert?</Label>
            <Select value={form.finanzierungGesichert} onValueChange={(v) => update({ finanzierungGesichert: v })}>
              <SelectTrigger><SelectValue placeholder="Bitte auswählen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ja">Ja, Finanzierung steht</SelectItem>
                <SelectItem value="in_klaerung">In Klärung</SelectItem>
                <SelectItem value="nein">Nein, noch offen</SelectItem>
                <SelectItem value="foerderung">Über Fördermittel geplant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Eigenkapital vorhanden?</Label>
            <Select value={form.eigenkapitalVorhanden} onValueChange={(v) => update({ eigenkapitalVorhanden: v })}>
              <SelectTrigger><SelectValue placeholder="Bitte auswählen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ja">Ja</SelectItem>
                <SelectItem value="teilweise">Teilweise</SelectItem>
                <SelectItem value="nein">Nein</SelectItem>
                <SelectItem value="keine_angabe">Keine Angabe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notizen */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Weitere Anmerkungen zur Entwicklung (optional)</Label>
          <Textarea
            placeholder="z.B. Wir möchten das Gebäude energetisch sanieren und zwei Einheiten im Dachgeschoss ausbauen…"
            value={form.entwicklungsNotizen}
            onChange={(e) => update({ entwicklungsNotizen: e.target.value })}
            rows={3}
            className="resize-none"
          />
        </div>
      </div>
    </>
  );
}

/* ── Step 4: Bilder ── */
function StepBilder({ form, onUpload }: { form: FunnelForm; onUpload: () => void }) {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Bitte laden Sie <strong>mindestens ein Bild</strong> hoch!
      </p>
      <div className="grid grid-cols-5 gap-3 mt-4">
        {Array.from({ length: 10 }).map((_, i) => {
          const hasImage = i < form.bilder.length;
          return (
            <button
              key={i}
              onClick={!hasImage ? onUpload : undefined}
              className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                hasImage
                  ? "border-primary/30 bg-primary/5"
                  : "border-border hover:border-primary/20 hover:bg-muted/30"
              }`}
            >
              {hasImage ? (
                <ImageIcon className="h-6 w-6 text-primary" />
              ) : (
                <Camera className="h-6 w-6 text-muted-foreground/50" />
              )}
              <span className="text-xs text-muted-foreground">{i + 1}</span>
            </button>
          );
        })}
      </div>
      <div className="flex justify-center mt-4">
        <Button variant="outline" onClick={onUpload} className="gap-2">
          <Upload className="h-4 w-4" /> Bilder hochladen
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Nur JPG, PNG mit maximal 10 MB
      </p>
    </>
  );
}

/* ── Step 5: Dokumente ── */
function StepDokumente({ form, onUpload }: { form: FunnelForm; onUpload: (typ: string) => void }) {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Zur Vervollständigung Ihres Inserats können Sie <strong>optional</strong> Ihre Dokumente hochladen
      </p>
      <div className="space-y-3 mt-4">
        {DOKUMENT_TYPEN.map((d) => {
          const uploaded = form.dokumente.find((doc) => doc.typ === d.typ);
          return (
            <button
              key={d.typ}
              onClick={() => !uploaded && onUpload(d.typ)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left ${
                uploaded
                  ? "border-primary/30 bg-primary/5"
                  : "border-border hover:border-primary/20 hover:bg-muted/20"
              }`}
            >
              <d.icon className={`h-4 w-4 shrink-0 ${uploaded ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-sm ${uploaded ? "font-medium text-foreground" : "text-muted-foreground italic"}`}>
                {d.typ} {uploaded ? `– ${uploaded.name}` : "(Optional)"}
              </span>
              {uploaded && <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />}
            </button>
          );
        })}
      </div>
      <div className="flex justify-center mt-4">
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" /> Dokumente hochladen
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Nur PDF, JPG, PNG mit maximal 10 MB
      </p>
    </>
  );
}

/* ── Hint Sidebar ── */
function HintSidebar({ step }: { step: number }) {
  const hints: Record<number, { title: string; text: string }> = {
    1: {
      title: "Objektangaben",
      text: "Die Angaben können später angepasst bzw. geändert werden, falls Sie die genauen Angaben jetzt nicht zur Hand haben. Bitte füllen Sie alle Felder aus!",
    },
    2: {
      title: "Matching mit Entwicklern",
      text: "Diese Angaben werden für das KI-gestützte Matching mit registrierten Entwicklungspartnern verwendet. Je detaillierter Ihre Angaben, desto passendere Partner können wir Ihnen vorschlagen.",
    },
    3: {
      title: "Bilderupload",
      text: "Sie können bis zu 10 Bilder hochladen. Das Bild Nr. 1 wird dann zum Titelbild. Verwenden Sie hochwertige Fotos für bessere Ergebnisse.",
    },
    4: {
      title: "Optionale Dokumente",
      text: "Um ein Inserat optimal zu beschreiben, benötigt es Dokumente wie z.B. einen Grundriss, Energieausweis oder Lageplan.",
    },
    5: {
      title: "Fast geschafft!",
      text: "Überprüfen Sie Ihre Angaben und erstellen Sie Ihr Inserat. Sie können es jederzeit nachträglich bearbeiten.",
    },
    6: {
      title: "Übersicht & Absenden",
      text: "Prüfen Sie alle Angaben nochmals. Nach dem Erstellen wird automatisch ein Eigentümer-Zugang angelegt.",
    },
  };

  const hint = hints[step];

  if (!hint) return null;

  return (
    <div className="hidden lg:block">
      <div className="bg-muted/30 rounded-xl border border-border p-5 space-y-3 sticky top-24">
        <div className="flex items-center gap-2 text-primary">
          <Info className="h-4 w-4" />
          <span className="text-sm font-semibold">Hinweis</span>
        </div>
        <p className="text-sm font-semibold text-foreground">{hint.title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{hint.text}</p>
      </div>
    </div>
  );
}
