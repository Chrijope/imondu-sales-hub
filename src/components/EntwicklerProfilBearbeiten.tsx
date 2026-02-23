import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft, Save, Edit3, HardHat, MapPin, Phone, Mail, Globe,
  Award, Star, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface EntwicklerProfil {
  firma: string;
  gewerk: string;
  inhaber: string;
  ort: string;
  plz: string;
  telefon: string;
  email: string;
  website: string;
  mitgliedschaft: string;
  mitgliedSeit: string;
  bewertung: number;
  projekte: number;
  antwortzeit: string;
  erfolgsquote: string;
  zertifikate: string[];
  leistungen: string[];
  beschreibung?: string;
  ueber?: string;
}

const DEFAULT_PROFIL: EntwicklerProfil = {
  firma: "Elektro Huber & Partner",
  gewerk: "Elektriker",
  inhaber: "Thomas Huber",
  ort: "München",
  plz: "80331",
  telefon: "+49 89 123 456 78",
  email: "info@elektro-huber.de",
  website: "www.elektro-huber.de",
  mitgliedschaft: "Premium",
  mitgliedSeit: "März 2025",
  bewertung: 4.8,
  projekte: 62,
  antwortzeit: "< 4h",
  erfolgsquote: "91%",
  zertifikate: ["Meisterbetrieb", "KfW-zertifiziert", "E-Check Partner"],
  leistungen: ["Elektroinstallation", "Smart Home", "Photovoltaik", "E-Ladestation"],
  beschreibung: "Seit über 20 Jahren sind wir Ihr verlässlicher Partner für alle Elektroarbeiten im Großraum München. Von der klassischen Installation bis hin zu modernen Smart-Home-Lösungen bieten wir alles aus einer Hand.",
  ueber: "Unser Team aus 12 qualifizierten Elektrikern und Meistern steht für Qualität, Zuverlässigkeit und Innovation. Wir sind stolz auf unsere hohe Kundenzufriedenheit und schnelle Reaktionszeiten.",
};

const GEWERKE = [
  "Elektriker", "Architekt", "Dachdecker", "Sanitär", "Heizung", "Dämmung",
  "Maler", "Trockenbau", "Zimmerer", "Fliesenleger", "Schlosser", "Tiefbau",
];

export default function EntwicklerProfilBearbeiten({ onBack }: { onBack: () => void }) {
  const [profil, setProfil] = useState<EntwicklerProfil>(DEFAULT_PROFIL);
  const [editing, setEditing] = useState(false);
  const [newZertifikat, setNewZertifikat] = useState("");
  const [newLeistung, setNewLeistung] = useState("");

  const set = (field: keyof EntwicklerProfil, value: any) =>
    setProfil((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setEditing(false);
    toast.success("Profil gespeichert");
  };

  const addZertifikat = () => {
    if (newZertifikat.trim()) {
      set("zertifikate", [...profil.zertifikate, newZertifikat.trim()]);
      setNewZertifikat("");
    }
  };

  const removeZertifikat = (z: string) => set("zertifikate", profil.zertifikate.filter(x => x !== z));

  const addLeistung = () => {
    if (newLeistung.trim()) {
      set("leistungen", [...profil.leistungen, newLeistung.trim()]);
      setNewLeistung("");
    }
  };

  const removeLeistung = (l: string) => set("leistungen", profil.leistungen.filter(x => x !== l));

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground gap-1 -ml-2">
        <ChevronLeft className="h-4 w-4" /> Zurück zum Dashboard
      </Button>

      {/* Header */}
      <div className="bg-card rounded-xl shadow-crm-sm border border-border p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
              <HardHat className="h-8 w-8 text-primary" />
            </div>
            <div>
              {editing ? (
                <Input value={profil.firma} onChange={(e) => set("firma", e.target.value)} className="text-xl font-bold mb-1" />
              ) : (
                <h1 className="text-xl font-display font-bold text-foreground">{profil.firma}</h1>
              )}
              <p className="text-sm text-muted-foreground">{profil.gewerk} · {profil.inhaber}</p>
              <Badge variant="default" className="text-[10px] mt-1">{profil.mitgliedschaft}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            {!editing ? (
              <Button variant="outline" onClick={() => setEditing(true)} className="gap-2 border-primary text-primary hover:bg-primary/10">
                <Edit3 className="h-4 w-4" /> Profil bearbeiten
              </Button>
            ) : (
              <Button onClick={handleSave} className="gap-2 gradient-brand border-0 text-primary-foreground">
                <Save className="h-4 w-4" /> Speichern
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Bewertung", value: `${profil.bewertung} ⭐` },
          { label: "Projekte", value: String(profil.projekte) },
          { label: "⌀ Antwortzeit", value: profil.antwortzeit },
          { label: "Erfolgsquote", value: profil.erfolgsquote },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <p className="text-lg font-display font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Firmendaten */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Firmendaten</h2>
            </div>
            {editing ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Firma</label>
                  <Input value={profil.firma} onChange={(e) => set("firma", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Inhaber</label>
                  <Input value={profil.inhaber} onChange={(e) => set("inhaber", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Gewerk</label>
                  <select
                    value={profil.gewerk}
                    onChange={(e) => set("gewerk", e.target.value)}
                    className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground"
                  >
                    {GEWERKE.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">PLZ</label>
                  <Input value={profil.plz} onChange={(e) => set("plz", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Ort</label>
                  <Input value={profil.ort} onChange={(e) => set("ort", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Telefon</label>
                  <Input value={profil.telefon} onChange={(e) => set("telefon", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">E-Mail</label>
                  <Input value={profil.email} onChange={(e) => set("email", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Website</label>
                  <Input value={profil.website} onChange={(e) => set("website", e.target.value)} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <DataField label="Firma" value={profil.firma} />
                <DataField label="Inhaber" value={profil.inhaber} />
                <DataField label="Gewerk" value={profil.gewerk} />
                <DataField label="PLZ / Ort" value={`${profil.plz} ${profil.ort}`} />
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-foreground">{profil.telefon}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-primary">{profil.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-primary">{profil.website}</span>
                </div>
                <DataField label="Mitglied seit" value={profil.mitgliedSeit} />
              </div>
            )}
          </div>

          {/* Über uns */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Über uns</h2>
            </div>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Firmenbeschreibung</label>
                  <Textarea value={profil.beschreibung || ""} onChange={(e) => set("beschreibung", e.target.value)} rows={3} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Über das Team</label>
                  <Textarea value={profil.ueber || ""} onChange={(e) => set("ueber", e.target.value)} rows={3} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {profil.beschreibung && <p className="text-sm text-muted-foreground leading-relaxed">{profil.beschreibung}</p>}
                {profil.ueber && <p className="text-sm text-muted-foreground leading-relaxed">{profil.ueber}</p>}
              </div>
            )}
          </div>

          {/* Leistungen */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Leistungen</h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profil.leistungen.map((l) => (
                <Badge key={l} variant="secondary" className="text-[10px] gap-1">
                  {l}
                  {editing && (
                    <button onClick={() => removeLeistung(l)} className="ml-1 text-destructive hover:text-destructive/80">×</button>
                  )}
                </Badge>
              ))}
            </div>
            {editing && (
              <div className="flex gap-2 mt-3">
                <Input
                  placeholder="Neue Leistung…"
                  value={newLeistung}
                  onChange={(e) => setNewLeistung(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addLeistung()}
                  className="text-sm"
                />
                <Button variant="outline" size="sm" onClick={addLeistung}>+</Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Zertifikate */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Zertifikate</h2>
            </div>
            <div className="space-y-2">
              {profil.zertifikate.map((z) => (
                <div key={z} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{z}</span>
                  </div>
                  {editing && (
                    <button onClick={() => removeZertifikat(z)} className="text-destructive text-xs hover:underline">Entfernen</button>
                  )}
                </div>
              ))}
            </div>
            {editing && (
              <div className="flex gap-2 mt-3">
                <Input
                  placeholder="Neues Zertifikat…"
                  value={newZertifikat}
                  onChange={(e) => setNewZertifikat(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addZertifikat()}
                  className="text-sm"
                />
                <Button variant="outline" size="sm" onClick={addZertifikat}>+</Button>
              </div>
            )}
          </div>

          {/* Mitgliedschaft */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Mitgliedschaft</h2>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Typ</dt><dd><Badge variant="default" className="text-[10px]">{profil.mitgliedschaft}</Badge></dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Mitglied seit</dt><dd className="font-medium text-foreground">{profil.mitgliedSeit}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Bewertung</dt><dd className="font-medium text-amber-500">{profil.bewertung} ⭐</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Projekte</dt><dd className="font-medium text-foreground">{profil.projekte}</dd></div>
            </dl>
          </div>

          {/* Kontaktdaten Zusammenfassung */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Kontakt</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-foreground">{profil.plz} {profil.ort}</span></div>
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-foreground">{profil.telefon}</span></div>
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-primary">{profil.email}</span></div>
              <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-primary">{profil.website}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}
