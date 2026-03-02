import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { addProjektassistent } from "@/data/projektassistenten-data";
import { UserPlus, CreditCard, MapPin, User, FileText } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  erstelltVon: string;
  erstelltVonName: string;
  onCreated?: () => void;
}

export default function ProjektassistentFormular({ open, onOpenChange, erstelltVon, erstelltVonName, onCreated }: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    vorname: "", nachname: "", email: "", telefon: "",
    strasse: "", hausnummer: "", plz: "", ort: "", land: "Deutschland",
    honorarB2C: "", honorarB2B: "", honorarModell: "pro_lead" as "pro_lead" | "prozentual" | "pauschal",
    vertragsBeginn: "", vertragsEnde: "", notizen: "",
  });

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.vorname || !form.nachname || !form.email) {
      toast({ title: "Pflichtfelder fehlen", description: "Bitte Vorname, Nachname und E-Mail ausfüllen.", variant: "destructive" });
      return;
    }
    if (!form.honorarB2C && !form.honorarB2B) {
      toast({ title: "Honorar fehlt", description: "Bitte mindestens ein Honorar (B2C oder B2B) angeben.", variant: "destructive" });
      return;
    }

    addProjektassistent({
      ...form,
      erstelltVon,
      erstelltVonName,
      status: "aktiv",
    });

    toast({ title: "Projektassistent angelegt ✓", description: `${form.vorname} ${form.nachname} wurde erfolgreich hinzugefügt.` });
    setForm({
      vorname: "", nachname: "", email: "", telefon: "",
      strasse: "", hausnummer: "", plz: "", ort: "", land: "Deutschland",
      honorarB2C: "", honorarB2B: "", honorarModell: "pro_lead",
      vertragsBeginn: "", vertragsEnde: "", notizen: "",
    });
    onOpenChange(false);
    onCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Neuen Projektassistenten anlegen
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Kontaktdaten */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Kontaktdaten</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Vorname *</Label>
                <Input placeholder="Max" value={form.vorname} onChange={(e) => set("vorname", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Nachname *</Label>
                <Input placeholder="Mustermann" value={form.nachname} onChange={(e) => set("nachname", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">E-Mail *</Label>
                <Input type="email" placeholder="email@beispiel.de" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Telefon</Label>
                <Input placeholder="+49 170 ..." value={form.telefon} onChange={(e) => set("telefon", e.target.value)} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Adresse */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Adresse</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Straße</Label>
                <Input placeholder="Musterstraße" value={form.strasse} onChange={(e) => set("strasse", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Hausnummer</Label>
                <Input placeholder="1" value={form.hausnummer} onChange={(e) => set("hausnummer", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">PLZ</Label>
                <Input placeholder="10115" value={form.plz} onChange={(e) => set("plz", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Ort</Label>
                <Input placeholder="Berlin" value={form.ort} onChange={(e) => set("ort", e.target.value)} />
              </div>
            </div>
            <div className="mt-3 space-y-1.5 max-w-[200px]">
              <Label className="text-xs text-muted-foreground">Land</Label>
              <Select value={form.land} onValueChange={(v) => set("land", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Deutschland">🇩🇪 Deutschland</SelectItem>
                  <SelectItem value="Österreich">🇦🇹 Österreich</SelectItem>
                  <SelectItem value="Schweiz">🇨🇭 Schweiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Finanzielle Konditionen */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Rahmenkonditionen & Honorar</h3>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Honorarmodell</Label>
                <Select value={form.honorarModell} onValueChange={(v) => set("honorarModell", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pro_lead">Pro Lead / Inserat</SelectItem>
                    <SelectItem value="prozentual">Prozentual am Umsatz</SelectItem>
                    <SelectItem value="pauschal">Pauschal (monatlich/quartalsweise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Honorar B2C {form.honorarModell === "pro_lead" ? "(€ pro Lead)" : form.honorarModell === "prozentual" ? "(%)" : "(€ pauschal)"} *
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder={form.honorarModell === "prozentual" ? "z.B. 10" : "z.B. 8"}
                      value={form.honorarB2C}
                      onChange={(e) => set("honorarB2C", e.target.value)}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {form.honorarModell === "prozentual" ? "%" : "€"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Honorar B2B {form.honorarModell === "pro_lead" ? "(€ pro Lead)" : form.honorarModell === "prozentual" ? "(%)" : "(€ pauschal)"} *
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder={form.honorarModell === "prozentual" ? "z.B. 15" : "z.B. 20"}
                      value={form.honorarB2B}
                      onChange={(e) => set("honorarB2B", e.target.value)}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {form.honorarModell === "prozentual" ? "%" : "€"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Vertragsbeginn</Label>
                  <Input type="date" value={form.vertragsBeginn} onChange={(e) => set("vertragsBeginn", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Vertragsende</Label>
                  <Input type="date" value={form.vertragsEnde} onChange={(e) => set("vertragsEnde", e.target.value)} />
                  <p className="text-[10px] text-muted-foreground">Leer = unbefristet</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notizen */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Notizen</h3>
            </div>
            <Textarea
              placeholder="Interne Notizen zur Zusammenarbeit, besondere Vereinbarungen…"
              value={form.notizen}
              onChange={(e) => set("notizen", e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Info */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground">
            <p><strong>Hinweis:</strong> Projektassistenten sind externe Tippgeber ohne eigenen System-Login. Sie werden Ihnen in der Teamübersicht zugeordnet und erscheinen untergeordnet in der Teamstruktur.</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
            <Button onClick={handleSubmit} className="gap-2 gradient-brand border-0 text-primary-foreground">
              <UserPlus className="h-4 w-4" /> Projektassistent anlegen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
