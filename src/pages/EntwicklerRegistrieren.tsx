import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GEWERK_OPTIONS } from "@/data/crm-data";
import type { Gewerk } from "@/data/crm-data";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Upload,
  Camera,
  CreditCard,
  User,
  Briefcase,
  Building,
  MapPin,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

const FUNNEL_STEPS = [
  { id: 1, label: "Profil" },
  { id: 2, label: "Leistung" },
  { id: 3, label: "Mitgliedschaft" },
  { id: 4, label: "Bezahlung" },
];

// Collapsible section
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
        <span className={`text-sm font-semibold ${open ? "text-foreground" : "text-foreground"}`}>{title}</span>
        {done && <CheckCircle2 className="h-5 w-5 text-primary" />}
      </button>
      {open && <div className="p-5 bg-card">{children}</div>}
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

const RABATT_CODES: Record<string, number> = {
  "178D": 50, "H991": 25, "5Y31": 10, "27J5": 20, "6L7Y": 30, "B8N8": 100, "J9B3": 25, "J12Q": 40, "K4P4": 0,
};

const PREISE = { basis: 899.90, premium: 1249.90 };

function validatePLZ(plz: string, land: string): boolean {
  if (!plz.trim()) return false;
  switch (land) {
    case "Deutschland": return /^\d{5}$/.test(plz.trim());
    case "Österreich": return /^\d{4}$/.test(plz.trim());
    case "Schweiz": return /^\d{4}$/.test(plz.trim());
    default: return plz.trim().length >= 4;
  }
}

function getRabatt(code: string): number {
  return RABATT_CODES[code.toUpperCase()] ?? 0;
}

function calcPrice(mitgliedschaft: "basis" | "premium", code: string, applied: boolean): { original: number; rabatt: number; final: number } {
  const original = PREISE[mitgliedschaft];
  const rabattProzent = (mitgliedschaft === "premium" && applied) ? getRabatt(code) : 0;
  const rabatt = original * rabattProzent / 100;
  return { original, rabatt, final: original - rabatt };
}

function formatPreis(n: number) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function RabattCodeEingabe({ mitgliedschaft, gutscheinCode, onCodeChange, onApplied, isApplied }: {
  mitgliedschaft: "basis" | "premium"; gutscheinCode: string; onCodeChange: (c: string) => void; onApplied: (v: boolean) => void; isApplied: boolean;
}) {
  const { toast } = useToast();
  const rabatt = getRabatt(gutscheinCode);
  const isValid = rabatt > 0;
  const isPremium = mitgliedschaft === "premium";

  const handleApply = () => {
    if (!gutscheinCode.trim()) return;
    if (!isPremium) {
      toast({ title: "Rabattcode nur für Premium⁺", description: "Rabattcodes gelten nur für die Premium⁺ Mitgliedschaft.", variant: "destructive" });
      return;
    }
    if (!isValid) {
      toast({ title: "Ungültiger Code", description: "Dieser Rabattcode existiert nicht.", variant: "destructive" });
      return;
    }
    onApplied(true);
    const prices = calcPrice(mitgliedschaft, gutscheinCode, true);
    toast({ title: `Rabattcode eingelöst: ${rabatt}%`, description: `Neuer Preis: ${formatPreis(prices.final)} (statt ${formatPreis(prices.original)})` });
  };

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1.5">Sie haben einen Rabatt Code? Bitte hier eintragen (gilt nur für Premium⁺)</p>
      <div className="flex gap-2 items-center">
        <Input placeholder="z.B. 178D" value={gutscheinCode} onChange={(e) => { onCodeChange(e.target.value.toUpperCase()); onApplied(false); }} className="max-w-xs" />
        <Button size="sm" className="gradient-brand border-0 text-primary-foreground" onClick={handleApply}>Einlösen</Button>
      </div>
      {isApplied && isValid && isPremium && (
        <div className="mt-2 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span className="text-sm text-primary font-medium">{rabatt}% Rabatt angewendet – Neuer Preis: {formatPreis(calcPrice(mitgliedschaft, gutscheinCode, true).final)}</span>
        </div>
      )}
      {isApplied && !isValid && gutscheinCode.trim() && (
        <p className="mt-1 text-xs text-destructive">Ungültiger Rabattcode.</p>
      )}
      {isApplied && isValid && isPremium && (
        <p className="text-[10px] text-muted-foreground mt-2">
          Hinweis: Der Rabattcode gilt nur für das erste Vertragsjahr. Bei automatischer Verlängerung nach 12 Monaten wird der reguläre Preis berechnet.
        </p>
      )}
    </div>
  );
}

function PlanSummaryCard({ mitgliedschaft, gutscheinCode, applied }: { mitgliedschaft: "basis" | "premium"; gutscheinCode: string; applied: boolean }) {
  const prices = calcPrice(mitgliedschaft, gutscheinCode, applied);
  const hasDiscount = prices.rabatt > 0;
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-base font-bold text-foreground">
          {mitgliedschaft === "premium" ? <>Premium<sup className="text-primary">+</sup></> : "Basis"}
        </p>
        <p className="text-xs text-muted-foreground">Laufzeit 12 Monate – Preis pro Jahr</p>
        {hasDiscount && (
          <p className="text-[10px] text-muted-foreground mt-1">Bei Verlängerung: {formatPreis(prices.original)}/Jahr (ohne Rabatt)</p>
        )}
      </div>
      <div className="text-right">
        {hasDiscount ? (
          <>
            <p className="text-sm text-muted-foreground line-through">{formatPreis(prices.original)}</p>
            <p className="text-lg font-bold text-primary">{formatPreis(prices.final)}</p>
          </>
        ) : (
          <p className="text-lg font-bold text-foreground">{formatPreis(prices.original)}</p>
        )}
        <p className="text-[10px] text-muted-foreground">exkl. 19% MwSt.</p>
      </div>
    </div>
  );
}

function PlanSummaryPrice({ mitgliedschaft, gutscheinCode, applied }: { mitgliedschaft: "basis" | "premium"; gutscheinCode: string; applied: boolean }) {
  const prices = calcPrice(mitgliedschaft, gutscheinCode, applied);
  const hasDiscount = prices.rabatt > 0;
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-foreground">Summe</p>
        {hasDiscount && <p className="text-[10px] text-muted-foreground">Rabattcode: -{getRabatt(gutscheinCode)}%</p>}
      </div>
      <div className="text-right">
        {hasDiscount ? (
          <>
            <p className="text-sm text-muted-foreground line-through">{formatPreis(prices.original)}</p>
            <p className="text-lg font-bold text-primary">{formatPreis(prices.final)}</p>
          </>
        ) : (
          <p className="text-lg font-bold text-foreground">{formatPreis(prices.original)}</p>
        )}
        <p className="text-[10px] text-muted-foreground">zzgl. 19% MwSt.</p>
      </div>
    </div>
  );
}

export default function EntwicklerRegistrieren() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [codeApplied, setCodeApplied] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    firma: true, profil: false, info: false, referenz: false,
    leistung: true, leistungDetail: false,
    mitgliedschaft: true, zahlung: true,
  });

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // Form state
  const [form, setForm] = useState({
    // Firma
    firmenname: "", strasse: "", hausnummer: "", plz: "", ort: "", land: "Deutschland", website: "",
    rechtsform: "", gruendungsjahr: "", mitarbeiter: "", steuernummer: "", ustId: "",
    // Profil
    anrede: "", position: "", vorname: "", nachname: "",
    // Info
    berufsbezeichnungen: [] as string[],
    beschreibung: "",
    // Referenz
    refImmobilientyp: "Haus",
    refTitel: "", refDetails: "", refStandort: "",
    refStartjahr: "", refFlaeche: "", refZeitraumAnzahl: "", refZeitraumEinheit: "Jahr/e",
    refWertsteigerung: "",
    refBilder: [] as string[],
    // Leistung
    leistungsTitel: "", leistungsBeschreibung: "",
    leistungsRegionen: [] as string[],
    leistungsObjekttypen: [] as string[],
    leistungsSanierungsarten: [] as string[],
    zertifikate: "",
    // Zahlung
    iban: "", bic: "", kontoinhaber: "",
    mitgliedschaft: "premium" as "basis" | "premium",
    zahlungsweise: "karte" as "paypal" | "karte" | "apple_pay",
    gutscheinCode: "",
    agb: false, datenschutz: false, widerruf: false,
    email: "",
  });

  const update = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const sectionsDone: Record<string, boolean> = {
    firma: !!(form.firmenname && form.plz && form.ort && validatePLZ(form.plz, form.land)),
    profil: !!(form.vorname && form.nachname),
    info: form.berufsbezeichnungen.length > 0,
    referenz: !!(form.refTitel),
    leistung: !!(form.leistungsTitel),
    leistungDetail: form.leistungsObjekttypen.length > 0,
    mitgliedschaft: !!(form.mitgliedschaft),
    zahlung: !!(form.agb && form.datenschutz && form.widerruf),
  };

  const goNext = () => { if (step < 4) setStep(step + 1); };
  const goBack = () => { if (step > 1) setStep(step - 1); };

  const handleSubmit = () => {
    if (!form.agb || !form.datenschutz || !form.widerruf) {
      toast({ title: "Zustimmung erforderlich", description: "Bitte alle Zustimmungen erteilen.", variant: "destructive" });
      return;
    }
    toast({ title: "Zahlungspflichtig bestellt ✓", description: `${form.firmenname || "Entwickler"} – ${form.mitgliedschaft === "premium" ? "Premium⁺" : "Basis"} Mitgliedschaft wurde gebucht.` });
  };

  const toggleTag = (field: string, value: string) => {
    const arr = (form as any)[field] as string[];
    if (arr.includes(value)) {
      update(field, arr.filter((v: string) => v !== value));
    } else {
      update(field, [...arr, value]);
    }
  };

  const simulateImageUpload = () => {
    update("refBilder", [...form.refBilder, `referenz_${form.refBilder.length + 1}.jpg`]);
  };

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
       <div className="max-w-5xl">
        {/* Header */}
        <h1 className="text-2xl font-display font-bold text-foreground text-center mb-6">Profil vervollständigen</h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8 max-w-lg mx-auto">
          {FUNNEL_STEPS.map((s, i) => (
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
              {i < FUNNEL_STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 mt-[-1.25rem] ${step > s.id ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-4">
            {step === 1 && (
              <>
                {/* Ihre Firma */}
                <AccordionSection title="Ihre Firma" done={sectionsDone.firma} open={openSections.firma} onToggle={() => toggleSection("firma")}>
                  <div className="space-y-4">
                    <Field label="Firmenname" required>
                      <Input placeholder="Max Fensterbau GmbH" value={form.firmenname} onChange={(e) => update("firmenname", e.target.value)} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Straße"><Input placeholder="Muster Street" value={form.strasse} onChange={(e) => update("strasse", e.target.value)} /></Field>
                      <Field label="Hausnummer"><Input placeholder="1" value={form.hausnummer} onChange={(e) => update("hausnummer", e.target.value)} /></Field>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Field label="PLZ" required hint={form.land === "Deutschland" ? "5-stellig" : form.land === "Österreich" ? "4-stellig" : "4-stellig"}>
                        <Input placeholder={form.land === "Deutschland" ? "78233" : form.land === "Österreich" ? "1010" : "8001"} value={form.plz} onChange={(e) => update("plz", e.target.value)} />
                      </Field>
                      <Field label="Ort" required><Input placeholder={form.land === "Deutschland" ? "z.B. Berlin" : form.land === "Österreich" ? "z.B. Wien" : "z.B. Zürich"} value={form.ort} onChange={(e) => update("ort", e.target.value)} /></Field>
                      <Field label="Land" required>
                        <Select value={form.land} onValueChange={(v) => { update("land", v); update("plz", ""); }}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Deutschland">🇩🇪 Deutschland</SelectItem>
                            <SelectItem value="Österreich">🇦🇹 Österreich</SelectItem>
                            <SelectItem value="Schweiz">🇨🇭 Schweiz</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <Field label="Webseite" hint="optional">
                      <Input placeholder="www.fensterbau.de" value={form.website} onChange={(e) => update("website", e.target.value)} />
                    </Field>
                    <hr className="border-border" />
                    <p className="text-xs text-muted-foreground font-medium">Eckdaten</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Rechtsform">
                        <Select value={form.rechtsform} onValueChange={(v) => update("rechtsform", v)}>
                          <SelectTrigger><SelectValue placeholder="Bitte wählen…" /></SelectTrigger>
                          <SelectContent>
                            {["Einzelunternehmen", "GbR", "GmbH", "UG", "AG", "OHG", "KG", "Sonstige"].map((r) => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Gründungsjahr"><Input type="number" placeholder="2010" value={form.gruendungsjahr} onChange={(e) => update("gruendungsjahr", e.target.value)} /></Field>
                    </div>
                    <Field label="Anzahl Mitarbeiter"><Input type="number" placeholder="5" value={form.mitarbeiter} onChange={(e) => update("mitarbeiter", e.target.value)} /></Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Steuernummer" hint="optional"><Input placeholder="123/123/12345" value={form.steuernummer} onChange={(e) => update("steuernummer", e.target.value)} /></Field>
                      <Field label="Umsatzsteuer-Nr." hint="optional"><Input placeholder="DE 1234567" value={form.ustId} onChange={(e) => update("ustId", e.target.value)} /></Field>
                    </div>
                  </div>
                </AccordionSection>

                {/* Ihr Profil */}
                <AccordionSection title="Ihr Profil" done={sectionsDone.profil} open={openSections.profil} onToggle={() => toggleSection("profil")}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Anrede">
                        <Select value={form.anrede} onValueChange={(v) => update("anrede", v)}>
                          <SelectTrigger><SelectValue placeholder="Bitte wählen…" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Herr">Herr</SelectItem>
                            <SelectItem value="Frau">Frau</SelectItem>
                            <SelectItem value="Divers">Divers</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Position">
                        <Select value={form.position} onValueChange={(v) => update("position", v)}>
                          <SelectTrigger><SelectValue placeholder="Bitte wählen…" /></SelectTrigger>
                          <SelectContent>
                            {["Geschäftsführer", "Inhaber", "Projektleiter", "Abteilungsleiter", "Mitarbeiter", "Sonstige"].map((p) => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Vorname" required><Input value={form.vorname} onChange={(e) => update("vorname", e.target.value)} /></Field>
                      <Field label="Nachname" required><Input value={form.nachname} onChange={(e) => update("nachname", e.target.value)} /></Field>
                    </div>
                  </div>
                </AccordionSection>

                {/* Info */}
                <AccordionSection title="Info" done={sectionsDone.info} open={openSections.info} onToggle={() => toggleSection("info")}>
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Titelbild hochladen</p>
                      <div className="h-32 rounded-lg bg-muted/50 border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/30 transition-colors">
                        <div className="text-center">
                          <Camera className="h-6 w-6 text-muted-foreground/50 mx-auto mb-1" />
                          <span className="text-xs text-muted-foreground">Titelbild ändern</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Profilbild hochladen</p>
                      <div className="flex justify-center">
                        <div className="h-24 w-24 rounded-full bg-muted/50 border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/30">
                          <User className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                      </div>
                    </div>
                    <hr className="border-border" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Berufsbezeichnung</p>
                      <div className="flex flex-wrap gap-2">
                        {GEWERK_OPTIONS.map((g) => (
                          <button
                            key={g}
                            onClick={() => {
                              if (form.berufsbezeichnungen.length < 3 || form.berufsbezeichnungen.includes(g)) toggleTag("berufsbezeichnungen", g);
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                              form.berufsbezeichnungen.includes(g)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">Maximal 3 Berufsbezeichnungen erlaubt.</p>
                    </div>
                    <Field label="Info zu Ihrem Unternehmen">
                      <Textarea placeholder="Beschreiben Sie Ihr Unternehmen, Ihre Leistungen und Spezialisierungen…" value={form.beschreibung} onChange={(e) => update("beschreibung", e.target.value)} rows={4} className="resize-none" />
                    </Field>
                  </div>
                </AccordionSection>

                {/* Referenz */}
                <AccordionSection title="Referenz" done={sectionsDone.referenz} open={openSections.referenz} onToggle={() => toggleSection("referenz")}>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">Vervollständigen Sie Ihr Profil mit einer aussagekräftigen Referenz.</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Immobilientyp</p>
                      <div className="flex flex-wrap gap-2">
                        {["Haus", "Mehrfamilienhaus", "Wohnung", "Gewerbe", "Grundstück"].map((t) => (
                          <button
                            key={t}
                            onClick={() => update("refImmobilientyp", t)}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                              form.refImmobilientyp === t
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Field label={`Titel (${form.refTitel.length} / max. 100)`}>
                      <Textarea placeholder="z.B. Sanierung von einem MFH in Memmingen" value={form.refTitel} onChange={(e) => update("refTitel", e.target.value.slice(0, 100))} rows={2} className="resize-none" />
                    </Field>
                    <Field label="Details zum Projekt">
                      <Textarea placeholder="z.B. Sanierung von 3 Wohnungen" value={form.refDetails} onChange={(e) => update("refDetails", e.target.value)} rows={3} className="resize-none" />
                    </Field>
                    <Field label="Standort"><Input placeholder="87700 Memmingen" value={form.refStandort} onChange={(e) => update("refStandort", e.target.value)} /></Field>
                    <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Startjahr"><Input type="number" placeholder="2024" value={form.refStartjahr} onChange={(e) => update("refStartjahr", e.target.value)} /></Field>
                        <Field label="Anzahl der entwickelten Fläche"><Input type="number" placeholder="1000" value={form.refFlaeche} onChange={(e) => update("refFlaeche", e.target.value)} /></Field>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Entwicklungszeitraum">
                          <Select value={form.refZeitraumAnzahl || "1"} onValueChange={(v) => update("refZeitraumAnzahl", v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{["1","2","3","4","5","6","7","8","9","10"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                          </Select>
                        </Field>
                        <Field label=" ">
                          <Select value={form.refZeitraumEinheit} onValueChange={(v) => update("refZeitraumEinheit", v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Monat/e">Monat/e</SelectItem>
                              <SelectItem value="Jahr/e">Jahr/e</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      </div>
                      <Field label="Wertsteigerung">
                        <div className="flex items-center gap-2">
                          <Input type="number" placeholder="80" value={form.refWertsteigerung} onChange={(e) => update("refWertsteigerung", e.target.value)} />
                          <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-2 rounded-md">%</span>
                        </div>
                      </Field>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-foreground">Bilder zur Referenz</p>
                      <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                        <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11px] text-muted-foreground">Laden Sie aussagekräftige Bilder zu Ihrer Referenz hoch. (Max 6 Bilder)</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {Array.from({ length: 6 }).map((_, i) => {
                          const hasImg = i < form.refBilder.length;
                          return (
                            <button
                              key={i}
                              onClick={!hasImg ? simulateImageUpload : undefined}
                              className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all ${
                                hasImg ? "border-primary/30 bg-primary/5" : "border-border hover:border-primary/20"
                              }`}
                            >
                              {hasImg ? <ImageIcon className="h-5 w-5 text-primary" /> : <Camera className="h-5 w-5 text-muted-foreground/50" />}
                              <span className="text-xs text-muted-foreground">{i + 1}</span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-muted-foreground text-center">* Max 10 MB pro Bild</p>
                      <div className="flex justify-center">
                        <Button variant="default" size="sm" onClick={simulateImageUpload} className="gap-2 gradient-brand border-0 text-primary-foreground">
                          <Upload className="h-3.5 w-3.5" /> Bilder hochladen
                        </Button>
                      </div>
                    </div>
                  </div>
                </AccordionSection>
              </>
            )}

            {step === 2 && (
              <>
                {/* Leistungsbeschreibung */}
                <AccordionSection title="Leistungsbeschreibung" done={sectionsDone.leistung} open={openSections.leistung} onToggle={() => toggleSection("leistung")}>
                  <div className="space-y-4">
                    <Field label="Leistungstitel" required>
                      <Input placeholder="z.B. Komplettsanierung aus einer Hand" value={form.leistungsTitel} onChange={(e) => update("leistungsTitel", e.target.value)} />
                    </Field>
                    <Field label="Detaillierte Leistungsbeschreibung">
                      <Textarea
                        placeholder="Beschreiben Sie Ihre Leistungen detailliert: Was bieten Sie an? Was unterscheidet Sie von der Konkurrenz? Welche besonderen Vorteile haben Eigentümer bei der Zusammenarbeit mit Ihnen?"
                        value={form.leistungsBeschreibung}
                        onChange={(e) => update("leistungsBeschreibung", e.target.value)}
                        rows={5}
                        className="resize-none"
                      />
                    </Field>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Regionen / Einzugsgebiet</p>
                      <div className="flex flex-wrap gap-2">
                        {["Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Hamburg", "Hessen", "Niedersachsen", "NRW", "Sachsen", "Deutschlandweit"].map((r) => (
                          <button
                            key={r}
                            onClick={() => toggleTag("leistungsRegionen", r)}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                              form.leistungsRegionen.includes(r)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                <AccordionSection title="Leistungsdetails" done={sectionsDone.leistungDetail} open={openSections.leistungDetail} onToggle={() => toggleSection("leistungDetail")}>
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Für welche Objekttypen bieten Sie Leistungen an?</p>
                      <div className="flex flex-wrap gap-2">
                        {["Einfamilienhaus", "Mehrfamilienhaus", "Wohnung", "Gewerbeobjekt", "Grundstück", "Mischobjekt"].map((t) => (
                          <button
                            key={t}
                            onClick={() => toggleTag("leistungsObjekttypen", t)}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                              form.leistungsObjekttypen.includes(t)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Sanierungsarten</p>
                      <div className="flex flex-wrap gap-2">
                        {["Komplettsanierung", "Dachsanierung", "Fassadensanierung", "Fenstertausch", "Heizungstausch", "Elektrosanierung", "Badsanierung", "Energieberatung", "WDVS / Dämmung", "Photovoltaik"].map((s) => (
                          <button
                            key={s}
                            onClick={() => toggleTag("leistungsSanierungsarten", s)}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                              form.leistungsSanierungsarten.includes(s)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Field label="Zertifikate & Qualifikationen">
                      <Textarea placeholder="z.B. dena-zertifizierter Energieberater, Meisterbetrieb HWK, ISO 9001…" value={form.zertifikate} onChange={(e) => update("zertifikate", e.target.value)} rows={3} className="resize-none" />
                    </Field>
                  </div>
                </AccordionSection>
              </>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Wählen Sie Ihre Option:</h2>

                {/* Plan cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basis */}
                  <button
                    onClick={() => update("mitgliedschaft", "basis")}
                    className={`text-left rounded-xl border-2 p-5 transition-all ${
                      form.mitgliedschaft === "basis"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="text-base font-bold text-foreground">Basis</p>
                        <p className="text-xs text-muted-foreground">Laufzeit 12 Monate – Preis pro Jahr</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">899,90 €</p>
                        <p className="text-[10px] text-muted-foreground">exkl. 19% MwSt.</p>
                      </div>
                    </div>
                    <hr className="border-border my-3" />
                    <ul className="space-y-2.5">
                      {[
                        "Unbegrenzte Anzahl der Kontaktanfragen von Immobilieneigentümern",
                        "Identitätsprüfung für Transparenz und Sicherheit",
                        "Support durch IMONDU für Hilfestellungen",
                      ].map((t) => (
                        <li key={t} className="flex items-start gap-2 text-xs text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </button>

                  {/* Premium⁺ */}
                  <button
                    onClick={() => update("mitgliedschaft", "premium")}
                    className={`text-left rounded-xl border-2 p-5 transition-all relative ${
                      form.mitgliedschaft === "premium"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className="absolute -top-3 right-4">
                      <Badge className="gradient-brand text-primary-foreground text-[10px] border-0">Empfohlen</Badge>
                    </div>
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="text-base font-bold text-foreground">Premium<sup className="text-primary">+</sup></p>
                        <p className="text-xs text-muted-foreground">Laufzeit 12 Monate – Preis pro Jahr</p>
                      </div>
                      <div className="text-right">
                        {(() => {
                          const prices = calcPrice("premium", form.gutscheinCode, codeApplied);
                          const hasDiscount = prices.rabatt > 0;
                          return hasDiscount ? (
                            <>
                              <p className="text-sm text-muted-foreground line-through">{formatPreis(prices.original)}</p>
                              <p className="text-lg font-bold text-primary">{formatPreis(prices.final)}</p>
                            </>
                          ) : (
                            <p className="text-lg font-bold text-foreground">{formatPreis(prices.original)}</p>
                          );
                        })()}
                        <p className="text-[10px] text-muted-foreground">exkl. 19% MwSt.</p>
                      </div>
                    </div>
                    <hr className="border-border my-3" />
                    <ul className="space-y-2.5">
                      {[
                        "Alle Basis-Vorteile",
                        "Frühzeitiger Zugang zu neuen Eigentümer-Anfragen",
                        "Frühzeitige Platzierung bei limitierten Kontakten",
                        "Premium-Badge für mehr Vertrauen bei Eigentümern",
                        "Ihre Kontaktanfrage landet immer oben in den Benachrichtigungen des Immobilienbesitzers",
                        "IMONDU Premium⁺ Verifizierung wird in Ihrem Profil angezeigt",
                        "Erweiterte Kontaktanfrage für höhere Abschlussquote",
                        "Performance-Statistiken und Conversion-Insights",
                        "Priorisierter Support",
                        "Hervorgehobene & priorisierte Platzierung in deiner Region",
                      ].map((t) => (
                        <li key={t} className="flex items-start gap-2 text-xs text-foreground font-medium">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </button>
                </div>

                {/* Rabatt Code */}
                <RabattCodeEingabe
                  mitgliedschaft={form.mitgliedschaft}
                  gutscheinCode={form.gutscheinCode}
                  onCodeChange={(code) => update("gutscheinCode", code)}
                  onApplied={setCodeApplied}
                  isApplied={codeApplied}
                />
              </div>
            )}

            {step === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Payment method */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Wählen Sie Ihre Bezahlmethode:</h2>
                  {[
                    { id: "paypal" as const, label: "PayPal", icon: "💳" },
                    { id: "karte" as const, label: "Karte", icon: "💳" },
                    { id: "apple_pay" as const, label: "Apple Pay", icon: "🍏" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => update("zahlungsweise", m.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.zahlungsweise === m.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/20"
                      }`}
                    >
                      <span className="text-lg">{m.icon}</span>
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Right: Plan summary */}
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-foreground">Dein Plan im Überblick</h2>
                  <div className="rounded-xl border-2 border-primary bg-primary/5 p-5">
                    <PlanSummaryCard mitgliedschaft={form.mitgliedschaft} gutscheinCode={form.gutscheinCode} applied={codeApplied} />
                  </div>

                  <Field label="E-Mail-Adresse">
                    <Input placeholder="ihre@email.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                  </Field>

                  <hr className="border-border" />

                  <PlanSummaryPrice mitgliedschaft={form.mitgliedschaft} gutscheinCode={form.gutscheinCode} applied={codeApplied} />

                  {/* Legal */}
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <Checkbox checked={form.widerruf} onCheckedChange={(v) => update("widerruf", !!v)} className="mt-0.5" />
                      <p>Hiermit stimme ich ausdrücklich zu, dass die Imondu GmbH mit der Erbringung der Dienstleistung bereits vor Ablauf der Widerrufsfrist beginnt. Mir ist bekannt, dass mein Widerrufsrecht mit vollständiger Vertragserfüllung durch die Imondu GmbH erlischt.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox checked={form.agb} onCheckedChange={(v) => update("agb", !!v)} className="mt-0.5" />
                      <p>Durch ein Drücken der Schaltfläche "Zahlungspflichtig bestellen" erkläre ich mich mit der Geltung der <strong className="text-foreground underline cursor-pointer">B2B-AGB</strong> der Imondu GmbH einverstanden. Die <strong className="text-foreground underline cursor-pointer">Datenschutzerklärung</strong> und die <strong className="text-foreground underline cursor-pointer">Widerrufsbelehrung</strong> habe ich zur Kenntnis genommen.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox checked={form.datenschutz} onCheckedChange={(v) => update("datenschutz", !!v)} className="mt-0.5" />
                      <p>Ich stimme der <strong className="text-foreground underline cursor-pointer">Datenschutzerklärung</strong> zu. *</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hint Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-muted/30 rounded-xl border border-border p-5 space-y-3 sticky top-24">
              <div className="flex items-center gap-2 text-primary">
                <Info className="h-4 w-4" />
                <span className="text-sm font-semibold">Hinweis</span>
              </div>
              {step === 1 && (
                <>
                  <p className="text-sm font-semibold text-foreground">Ihre Profilansicht</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Diese Ansicht sehen Immobilienbesitzer über Ihr Profil. Füllen Sie alle Felder sorgfältig aus, um sich bestmöglich zu präsentieren.
                  </p>
                </>
              )}
              {step === 2 && (
                <>
                  <p className="text-sm font-semibold text-foreground">Leistungsbeschreibung</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Eine detaillierte Leistungsbeschreibung hilft Eigentümern, den richtigen Partner für ihr Projekt zu finden. Beschreiben Sie Ihre Stärken und Spezialisierungen.
                  </p>
                </>
              )}
              {step === 3 && (
                <>
                  <p className="text-sm font-semibold text-foreground">Mitgliedschaft wählen</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Wählen Sie zwischen Basis und Premium⁺. Mit Premium⁺ erhalten Sie maximale Sichtbarkeit und priorisierten Zugang zu Eigentümer-Anfragen.
                  </p>
                </>
              )}
              {step === 4 && (
                <>
                  <p className="text-sm font-semibold text-foreground">Bezahlung</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ihre Zahlungsdaten werden verschlüsselt verarbeitet. Nach Abschluss der Bestellung ist Ihr Profil sofort aktiv.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 pb-8">
          <Button variant="outline" onClick={goBack} disabled={step === 1} className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Zurück
          </Button>
          <div className="flex gap-3">
            {step < 3 ? (
              <Button onClick={goNext} className="gap-2 gradient-brand border-0 text-primary-foreground">
                Speichern und weiter <ChevronRight className="h-4 w-4" />
              </Button>
            ) : step === 3 ? (
              <Button onClick={goNext} className="gap-2 gradient-brand border-0 text-primary-foreground">
                Weiter zur Bezahlung <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gap-2 gradient-brand border-0 text-primary-foreground">
                Zahlungspflichtig bestellen <CreditCard className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        </div>
      </div>
    </CRMLayout>
  );
}
