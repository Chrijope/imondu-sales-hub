import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { GEWERK_OPTIONS } from "@/data/crm-data";
import type { Gewerk } from "@/data/crm-data";
import {
  UserPlus,
  Building,
  MapPin,
  FileText,
  Upload,
  CheckCircle2,
  Info,
} from "lucide-react";

function Section({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-crm-sm border border-border">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-1 rounded-full gradient-brand" />
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-display font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

export default function EntwicklerRegistrieren() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    firmenname: "",
    gewerk: "" as Gewerk | "",
    anrede: "",
    vorname: "",
    nachname: "",
    email: "",
    telefon: "",
    website: "",
    strasse: "",
    hausnummer: "",
    plz: "",
    ort: "",
    bundesland: "",
    beschreibung: "",
    mitarbeiteranzahl: "",
    gruendungsjahr: "",
    referenzen: "",
    agb: false,
    datenschutz: false,
  });

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.firmenname || !form.gewerk || !form.vorname || !form.nachname || !form.email || !form.telefon || !form.plz || !form.ort) {
      toast({ title: "Pflichtfelder fehlen", description: "Bitte alle markierten Felder ausfüllen.", variant: "destructive" });
      return;
    }
    if (!form.agb || !form.datenschutz) {
      toast({ title: "Zustimmung erforderlich", description: "Bitte AGB und Datenschutz akzeptieren.", variant: "destructive" });
      return;
    }
    toast({ title: "Registrierung erfolgreich ✓", description: `${form.firmenname} wurde als Entwickler registriert.` });
  };

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in max-w-4xl">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-1 rounded-full gradient-brand" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Entwickler registrieren</h1>
          <p className="text-sm text-muted-foreground mt-1">Neuen Entwicklungspartner / Gewerbebetrieb auf der imondu Plattform registrieren</p>
        </div>

        {/* Info */}
        <div className="gradient-brand-subtle border border-primary/15 rounded-xl p-4 flex items-start gap-3">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Registrierte Entwickler erhalten Zugang zur imondu Plattform und können <strong className="text-foreground">Inserate einsehen</strong>, 
            <strong className="text-foreground"> Anfragen stellen</strong> und als <strong className="text-foreground">Partner</strong> gelistet werden.
          </p>
        </div>

        {/* Firmendaten */}
        <Section icon={Building} title="Firmendaten">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Firmenname" required>
              <Input placeholder="z.B. Müller Bau GmbH" value={form.firmenname} onChange={(e) => update("firmenname", e.target.value)} />
            </Field>
            <Field label="Gewerk / Branche" required>
              <Select value={form.gewerk} onValueChange={(v) => update("gewerk", v)}>
                <SelectTrigger><SelectValue placeholder="Gewerk wählen…" /></SelectTrigger>
                <SelectContent>
                  {GEWERK_OPTIONS.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Website">
              <Input placeholder="www.example.de" value={form.website} onChange={(e) => update("website", e.target.value)} />
            </Field>
            <Field label="Mitarbeiteranzahl">
              <Select value={form.mitarbeiteranzahl} onValueChange={(v) => update("mitarbeiteranzahl", v)}>
                <SelectTrigger><SelectValue placeholder="Bitte wählen…" /></SelectTrigger>
                <SelectContent>
                  {["1-5", "6-10", "11-20", "21-50", "51-100", "101-200", "200+"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Gründungsjahr">
              <Input type="number" placeholder="z.B. 2010" value={form.gruendungsjahr} onChange={(e) => update("gruendungsjahr", e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* Ansprechpartner */}
        <Section icon={UserPlus} title="Ansprechpartner">
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
            <div />
            <Field label="Vorname" required>
              <Input value={form.vorname} onChange={(e) => update("vorname", e.target.value)} />
            </Field>
            <Field label="Nachname" required>
              <Input value={form.nachname} onChange={(e) => update("nachname", e.target.value)} />
            </Field>
            <Field label="E-Mail" required>
              <Input type="email" placeholder="email@firma.de" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </Field>
            <Field label="Telefon" required>
              <Input placeholder="+49 …" value={form.telefon} onChange={(e) => update("telefon", e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* Adresse */}
        <Section icon={MapPin} title="Firmenadresse">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Straße">
              <Input value={form.strasse} onChange={(e) => update("strasse", e.target.value)} />
            </Field>
            <Field label="Hausnummer">
              <Input value={form.hausnummer} onChange={(e) => update("hausnummer", e.target.value)} />
            </Field>
            <Field label="PLZ" required>
              <Input value={form.plz} onChange={(e) => update("plz", e.target.value)} />
            </Field>
            <Field label="Ort" required>
              <Input value={form.ort} onChange={(e) => update("ort", e.target.value)} />
            </Field>
            <Field label="Bundesland">
              <Select value={form.bundesland} onValueChange={(v) => update("bundesland", v)}>
                <SelectTrigger><SelectValue placeholder="Bitte wählen…" /></SelectTrigger>
                <SelectContent>
                  {["Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"].map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </Section>

        {/* Beschreibung */}
        <Section icon={FileText} title="Beschreibung & Referenzen">
          <div className="space-y-4">
            <Field label="Firmenbeschreibung">
              <Textarea placeholder="Kurzbeschreibung des Unternehmens, Leistungen, Spezialisierungen…" value={form.beschreibung} onChange={(e) => update("beschreibung", e.target.value)} rows={4} className="resize-none" />
            </Field>
            <Field label="Referenzen / bisherige Projekte">
              <Textarea placeholder="Bisherige Projekte, Referenzkunden, besondere Leistungen…" value={form.referenzen} onChange={(e) => update("referenzen", e.target.value)} rows={3} className="resize-none" />
            </Field>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border bg-muted/30 cursor-pointer hover:border-primary/30 transition-colors">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Dokumente hochladen</p>
                <p className="text-xs text-muted-foreground">Gewerbeanmeldung, Zertifikate, Referenzbilder (max. 10 MB)</p>
              </div>
            </div>
          </div>
        </Section>

        {/* AGB + Submit */}
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Checkbox checked={form.agb} onCheckedChange={(v) => update("agb", !!v)} className="mt-0.5" />
            <p className="text-xs text-muted-foreground">Ich akzeptiere die <strong className="text-foreground cursor-pointer hover:underline">AGB</strong> der imondu Plattform. *</p>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox checked={form.datenschutz} onCheckedChange={(v) => update("datenschutz", !!v)} className="mt-0.5" />
            <p className="text-xs text-muted-foreground">Ich stimme der <strong className="text-foreground cursor-pointer hover:underline">Datenschutzerklärung</strong> zu. *</p>
          </div>
          <div className="flex justify-end pb-8">
            <Button onClick={handleSubmit} className="gap-2 gradient-brand border-0 text-primary-foreground shadow-crm-sm hover:opacity-90 px-8">
              <CheckCircle2 className="h-4 w-4" /> Entwickler registrieren
            </Button>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
