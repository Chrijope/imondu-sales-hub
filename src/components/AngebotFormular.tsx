import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Pencil, Trash2, Upload, Lightbulb, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Dienstleistung {
  id: string;
  name: string;
  beschreibung: string;
  zeitaufwandWert: string;
  zeitaufwandEinheit: string;
  kosten: string;
}

const ZEITEINHEITEN = [
  { value: "stunden", label: "Stunden" },
  { value: "tage", label: "Tage" },
  { value: "wochen", label: "Wochen" },
  { value: "monate", label: "Monate" },
  { value: "pauschal", label: "Pauschal" },
];

function fmt(n: number) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseNum(s: string) {
  return parseFloat(s.replace(/\./g, "").replace(",", ".")) || 0;
}

export default function AngebotFormular({
  inseratTitel,
  eigentuemerName,
  onSubmit,
  onCancel,
}: {
  inseratTitel: string;
  eigentuemerName: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}) {
  const { toast } = useToast();

  // Projektbewertung
  const [aktuellerWert, setAktuellerWert] = useState("");
  const [zielWert, setZielWert] = useState("");
  const [entwicklungskosten, setEntwicklungskosten] = useState("");

  const projektgewinn = useMemo(() => {
    const ziel = parseNum(zielWert);
    const kosten = parseNum(entwicklungskosten);
    if (ziel === 0) return 0;
    return ziel - kosten;
  }, [zielWert, entwicklungskosten]);

  // Dienstleistungen
  const [dienstleistungen, setDienstleistungen] = useState<Dienstleistung[]>([
    { id: "1", name: "", beschreibung: "", zeitaufwandWert: "", zeitaufwandEinheit: "", kosten: "" },
  ]);
  const [editMode, setEditMode] = useState(false);

  // Kommentar & PDF
  const [kommentar, setKommentar] = useState("");
  const [pdfName, setPdfName] = useState<string | null>(null);

  // Geplanter Zeitrahmen & Verfügbarkeit
  const [zeitrahmen, setZeitrahmen] = useState("");
  const [verfuegbarkeit, setVerfuegbarkeit] = useState("");

  const addDienstleistung = () => {
    setDienstleistungen((prev) => [
      ...prev,
      { id: String(Date.now()), name: "", beschreibung: "", zeitaufwandWert: "", zeitaufwandEinheit: "", kosten: "" },
    ]);
  };

  const updateDL = (id: string, field: keyof Dienstleistung, value: string) => {
    setDienstleistungen((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const removeDL = (id: string) => {
    if (dienstleistungen.length <= 1) return;
    setDienstleistungen((prev) => prev.filter((d) => d.id !== id));
  };

  const gesamt = useMemo(() => {
    return dienstleistungen.reduce((sum, d) => sum + parseNum(d.kosten), 0);
  }, [dienstleistungen]);

  const mwst = gesamt * 0.19;
  const summe = gesamt + mwst;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfName(file.name);
      toast({ title: "PDF hochgeladen", description: file.name });
    } else if (file) {
      toast({ title: "Nur PDF-Dateien erlaubt", variant: "destructive" });
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Angebot abgegeben",
      description: `Ihr Angebot für "${inseratTitel}" wurde an ${eigentuemerName} gesendet.`,
    });
    onSubmit?.();
  };

  return (
    <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
      {/* Projektbewertung */}
      <div className="bg-muted/30 rounded-xl p-5 border border-border">
        <h3 className="text-base font-bold text-foreground mb-4">Projektbewertung</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CurrencyField
            label="Aktueller Immobilienwert"
            hint="Ihr geschätzter Immobilienwert zum jetzigen Zeitpunkt."
            value={aktuellerWert}
            onChange={setAktuellerWert}
          />
          <CurrencyField
            label="Immobilienwert nach der Entwicklung"
            hint="Ihr voraussichtlicher Immobilienwert."
            value={zielWert}
            onChange={setZielWert}
          />
          <CurrencyField
            label="Entwicklungskosten"
            hint="Ihre voraussichtlichen Kosten."
            value={entwicklungskosten}
            onChange={setEntwicklungskosten}
          />
          <CurrencyField
            label="Projektgewinn"
            hint="Voraussichtlicher Gewinn abzüglich Entwicklungskosten (automatisch berechnet)."
            value={projektgewinn !== 0 ? fmt(projektgewinn) : ""}
            onChange={() => {}}
            readOnly
          />
        </div>
      </div>

      {/* Zeitrahmen & Verfügbarkeit */}
      <div className="bg-muted/30 rounded-xl p-5 border border-border">
        <h3 className="text-base font-bold text-foreground mb-4">Projektzeitplan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Geplanter Zeitrahmen</label>
            <Select value={zeitrahmen} onValueChange={setZeitrahmen}>
              <SelectTrigger><SelectValue placeholder="Bitte auswählen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3">1–3 Monate</SelectItem>
                <SelectItem value="3-6">3–6 Monate</SelectItem>
                <SelectItem value="6-12">6–12 Monate</SelectItem>
                <SelectItem value="12-24">12–24 Monate</SelectItem>
                <SelectItem value="24+">Über 24 Monate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Frühester Projektstart</label>
            <Input
              placeholder="z.B. Ab sofort, in 4 Wochen..."
              value={verfuegbarkeit}
              onChange={(e) => setVerfuegbarkeit(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Detailangebot */}
      <div className="bg-muted/30 rounded-xl p-5 border border-border">
        <h3 className="text-base font-bold text-foreground mb-4">Detailangebot <span className="text-muted-foreground font-normal text-sm">(optional)</span></h3>

        {/* Table header */}
        <div className="grid grid-cols-[40px_1fr_80px_130px_140px_36px] gap-2 items-center mb-2 text-xs font-semibold text-primary">
          <span>Nr.</span>
          <span>Dienstleistung</span>
          <span className="text-center">Zeitaufwand</span>
          <span />
          <span className="text-right">Kosten inkl. MwSt.</span>
          <span />
        </div>
        <Separator className="mb-3 bg-primary/30" />

        {dienstleistungen.map((dl, idx) => (
          <div key={dl.id} className="mb-4">
            <div className="grid grid-cols-[40px_1fr_80px_130px_140px_36px] gap-2 items-center">
              <span className="text-sm text-muted-foreground text-center">{idx + 1}</span>
              <Input
                placeholder="Dienstleistung"
                value={dl.name}
                onChange={(e) => updateDL(dl.id, "name", e.target.value)}
              />
              <Input
                placeholder=""
                value={dl.zeitaufwandWert}
                onChange={(e) => updateDL(dl.id, "zeitaufwandWert", e.target.value)}
                className="text-center"
              />
              <Select value={dl.zeitaufwandEinheit} onValueChange={(v) => updateDL(dl.id, "zeitaufwandEinheit", v)}>
                <SelectTrigger className="text-xs"><SelectValue placeholder="Bitte auswählen" /></SelectTrigger>
                <SelectContent>
                  {ZEITEINHEITEN.map((z) => (
                    <SelectItem key={z.value} value={z.value}>{z.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Input
                  placeholder=""
                  value={dl.kosten}
                  onChange={(e) => updateDL(dl.id, "kosten", e.target.value)}
                  className="pr-7 text-right"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
              </div>
              {editMode && dienstleistungen.length > 1 && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeDL(dl.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            <div className="ml-10 mt-1.5">
              <Input
                placeholder="Beschreibung"
                value={dl.beschreibung}
                onChange={(e) => updateDL(dl.id, "beschreibung", e.target.value)}
                className="text-xs text-muted-foreground"
              />
              <p className="text-[10px] text-muted-foreground mt-0.5">Optional</p>
            </div>
          </div>
        ))}

        <Separator className="my-3 bg-primary/30" />

        <div className="flex items-center justify-center gap-6 text-sm">
          <button onClick={addDienstleistung} className="flex items-center gap-1.5 text-primary hover:underline font-medium">
            <Plus className="h-4 w-4" /> Dienstleistung hinzufügen
          </button>
          <button onClick={() => setEditMode(!editMode)} className="flex items-center gap-1.5 text-primary hover:underline font-medium">
            <Pencil className="h-4 w-4" /> Dienstleistung bearbeiten
          </button>
        </div>

        <Separator className="my-3 bg-primary/30" />

        {/* Summen */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="font-bold">Gesamt</span><span>{fmt(gesamt)} €</span></div>
          <Separator className="bg-primary/10" />
          <div className="flex justify-between"><span className="font-bold">MwSt.</span><span>{fmt(mwst)} €</span></div>
          <Separator className="bg-primary/10" />
          <div className="flex justify-between text-base"><span className="font-bold">Summe</span><span className="font-bold">{fmt(summe)} €</span></div>
        </div>
      </div>

      {/* Kommentar */}
      <div>
        <Textarea
          placeholder="Kommentar/Notiz für den Eigentümer"
          value={kommentar}
          onChange={(e) => setKommentar(e.target.value)}
          className="min-h-[100px]"
        />
        <p className="text-[10px] text-muted-foreground mt-1">Optional</p>
      </div>

      {/* Hinweis + PDF Upload */}
      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-primary">Hinweis</span>
          <p className="mt-0.5">
            Wenn Sie bereits eine eigene Angebotsvorlage erstellt haben,
            können Sie diese hier direkt{" "}
            <label className="text-primary underline cursor-pointer hover:text-primary/80">
              als PDF-Datei hochladen
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
            </label>{" "}
            (max. eine Datei).
          </p>
          {pdfName && (
            <Badge variant="secondary" className="mt-1.5 text-xs">{pdfName}</Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>Abbrechen</Button>
        )}
        <Button onClick={handleSubmit} className="gradient-brand border-0 text-primary-foreground gap-2">
          <Send className="h-4 w-4" /> Angebot abgeben
        </Button>
      </div>
    </div>
  );
}

function CurrencyField({
  label,
  hint,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          className={`pr-7 ${readOnly ? "bg-muted/50 cursor-default" : ""}`}
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
      </div>
      {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
