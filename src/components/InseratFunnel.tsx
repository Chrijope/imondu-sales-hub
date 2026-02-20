import { useState } from "react";
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
  Home,
  Info,
  Camera,
  File,
  MapIcon,
  Zap,
  ClipboardList,
  BookOpen,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Objektbeschreibung", icon: Home },
  { id: 2, label: "Angaben zum Objekt", icon: ClipboardList },
  { id: 3, label: "Bilder", icon: Camera },
  { id: 4, label: "Dokumente", icon: FileText },
];

interface FunnelForm {
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
  // Step 3 – images (just filenames for UI)
  bilder: string[];
  // Step 4 – documents
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

export default function InseratFunnel({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [form, setForm] = useState<FunnelForm>({
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
    bilder: [],
    dokumente: [],
  });

  const update = (patch: Partial<FunnelForm>) => setForm((f) => ({ ...f, ...patch }));

  const goNext = () => {
    if (step === 1 && (!form.titel || !form.adresse || !form.eigentuemerName)) {
      toast({ title: "Pflichtfelder fehlen", description: "Bitte Titel, Adresse und Eigentümer ausfüllen.", variant: "destructive" });
      return;
    }
    setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
    if (step < 4) setStep(step + 1);
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setCompletedSteps((prev) => (prev.includes(4) ? prev : [...prev, 4]));
    toast({ title: "Inserat erstellt ✓", description: `"${form.titel}" wurde als Entwurf gespeichert.` });
    onClose();
  };

  const simulateImageUpload = () => {
    const newName = `bild_${form.bilder.length + 1}.jpg`;
    update({ bilder: [...form.bilder, newName] });
  };

  const simulateDocUpload = (typ: string) => {
    update({ dokumente: [...form.dokumente, { typ, name: `${typ.toLowerCase()}.pdf` }] });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-foreground">Neues Inserat erstellen</h1>
        <Button variant="outline" onClick={onClose}>Abbrechen</Button>
      </div>

      {/* Step indicators */}
      <div className="space-y-3">
        {STEPS.map((s) => {
          const done = completedSteps.includes(s.id);
          const active = step === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl border text-left transition-all ${
                active
                  ? "bg-primary/5 border-primary/30 shadow-sm"
                  : done
                  ? "bg-muted/40 border-border"
                  : "bg-card border-border hover:bg-muted/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <s.icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`font-medium text-sm ${active ? "text-primary" : "text-foreground"}`}>
                  {s.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  – {done ? "Abgeschlossen" : "Bitte füllen Sie alle Felder aus!"}
                </span>
              </div>
              {done && <CheckCircle2 className="h-5 w-5 text-primary" />}
            </button>
          );
        })}
      </div>

      {/* Step content + hint sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div className="bg-card rounded-xl border border-border p-6 space-y-5">
          {step === 1 && <Step1 form={form} update={update} />}
          {step === 2 && <Step2 form={form} update={update} />}
          {step === 3 && <Step3 form={form} onUpload={simulateImageUpload} />}
          {step === 4 && <Step4 form={form} onUpload={simulateDocUpload} />}
        </div>
        <HintSidebar step={step} />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={goBack} disabled={step === 1} className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Zurück
        </Button>
        {step < 4 ? (
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
  );
}

/* ── Step 1: Objektbeschreibung ── */
function Step1({ form, update }: { form: FunnelForm; update: (p: Partial<FunnelForm>) => void }) {
  return (
    <>
      <h2 className="text-lg font-display font-semibold text-foreground">Objektbeschreibung</h2>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Eigentümer *</Label>
          <Input placeholder="Vor- und Nachname" value={form.eigentuemerName} onChange={(e) => update({ eigentuemerName: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Titel / Überschrift *</Label>
          <Input placeholder="z.B. Bestandshaus mit großem Potenzial" value={form.titel} onChange={(e) => update({ titel: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Objekttyp</Label>
            <Select value={form.objekttyp} onValueChange={(v) => update({ objekttyp: v as Objekttyp })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Wohnung", "Einfamilienhaus", "Mehrfamilienhaus", "Gewerbeobjekt", "Grundstück", "Mischobjekt"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      <h2 className="text-lg font-display font-semibold text-foreground">Angaben zum Objekt</h2>
      <p className="text-sm text-muted-foreground font-medium">{form.objekttyp}</p>
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

/* ── Step 3: Bilder ── */
function Step3({ form, onUpload }: { form: FunnelForm; onUpload: () => void }) {
  return (
    <>
      <h2 className="text-lg font-display font-semibold text-foreground">Bilder</h2>
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

/* ── Step 4: Dokumente ── */
function Step4({ form, onUpload }: { form: FunnelForm; onUpload: (typ: string) => void }) {
  return (
    <>
      <h2 className="text-lg font-display font-semibold text-foreground">Dokumente</h2>
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
      title: "Änderung der Angaben",
      text: "Die Angaben können später angepasst bzw. geändert werden, falls Sie die genauen Angaben jetzt nicht zur Hand haben. Bitte füllen Sie alle Felder aus!",
    },
    2: {
      title: "Objektdetails",
      text: "Detaillierte Angaben helfen potenziellen Interessenten bei der Bewertung. Je mehr Informationen, desto qualifizierter die Anfragen.",
    },
    3: {
      title: "Bilderupload",
      text: "Sie können bis zu 10 Bilder hochladen. Das Bild Nr. 1 wird dann zum Titelbild. Verwenden Sie hochwertige Fotos für bessere Ergebnisse.",
    },
    4: {
      title: "Optionale Dokumente",
      text: "Um ein Inserat optimal zu beschreiben, benötigt es Dokumente wie z.B. einen Grundriss, Energieausweis oder Lageplan.",
    },
  };

  const hint = hints[step];

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
