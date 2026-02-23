import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ChevronLeft, Save, Trash2, Archive, MapPin, Home, Calendar, Ruler,
  Briefcase, Edit3, CheckCircle2, FileText, Eye, AlertTriangle,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import efh1 from "@/assets/inserate/einfamilienhaus-1.jpg";
import efh2 from "@/assets/inserate/einfamilienhaus-2.jpg";
import mfh1 from "@/assets/inserate/mehrfamilienhaus-1.jpg";
import mfh2 from "@/assets/inserate/mehrfamilienhaus-2.jpg";
import woh1 from "@/assets/inserate/wohnung-1.jpg";
import woh2 from "@/assets/inserate/wohnung-2.jpg";

const propertyImages: Record<string, string[]> = {
  Einfamilienhaus: [efh1, efh2],
  Mehrfamilienhaus: [mfh1, mfh2],
  Wohnung: [woh1, woh2],
  Gewerbeobjekt: [mfh1],
  Grundstück: [efh2],
  Mischobjekt: [mfh2],
};

const getImage = (typ: string, id: string) => {
  const imgs = propertyImages[typ] || [efh1];
  return imgs[id.charCodeAt(id.length - 1) % imgs.length];
};

const STATUS_OPTIONS = [
  { value: "aktiv", label: "Aktiv", color: "bg-green-100 text-green-700" },
  { value: "entwpartner", label: "Entwicklungspartner gefunden", color: "bg-blue-100 text-blue-700" },
  { value: "entwickelt", label: "Projekt entwickelt", color: "bg-primary/10 text-primary" },
  { value: "archiviert", label: "Archiviert", color: "bg-muted text-muted-foreground" },
];

const OBJEKTTYPEN = ["Einfamilienhaus", "Mehrfamilienhaus", "Wohnung", "Gewerbeobjekt", "Grundstück", "Mischobjekt"];

const SANIERUNGSSTATUS_OPTIONS = [
  "Keine – Neubau", "Teilsaniert", "Unsaniert", "Vollsaniert", "Kernsanierung nötig",
];

export interface EigentuemerInserat {
  id: string;
  titel: string;
  adresse: string;
  objekttyp: string;
  status: string;
  baujahr: string;
  flaeche: string;
  sanierungsbedarf: string;
  beschreibung?: string;
  zimmer?: string;
  grundstueck?: string;
  vermietet?: boolean;
  stockwerke?: string;
  terrasse?: string;
  balkon?: string;
  parkplatz?: string;
  budgetRange?: string;
  zeitrahmen?: string;
  entwicklungsabsicht?: string;
  zielNachEntwicklung?: string;
  wuensche?: string;
}

export default function InseratDetailEigentuemer({
  inserat,
  onBack,
  onUpdate,
  onDelete,
}: {
  inserat: EigentuemerInserat;
  onBack: () => void;
  onUpdate: (updated: EigentuemerInserat) => void;
  onDelete: (id: string) => void;
}) {
  const [data, setData] = useState<EigentuemerInserat>({ ...inserat });
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const set = (field: keyof EigentuemerInserat, value: any) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    onUpdate(data);
    setEditing(false);
    toast.success("Inserat gespeichert");
  };

  const handleStatusChange = (val: string) => {
    set("status", val);
    const updated = { ...data, status: val };
    onUpdate(updated);
    setData(updated);
    toast.success(`Status geändert: ${STATUS_OPTIONS.find(s => s.value === val)?.label}`);
  };

  const handleDelete = () => {
    onDelete(data.id);
    setDeleteOpen(false);
    toast.success("Inserat gelöscht");
  };

  const handleArchive = () => {
    handleStatusChange("archiviert");
  };

  const statusInfo = STATUS_OPTIONS.find(s => s.value === data.status) || STATUS_OPTIONS[0];

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground gap-1 -ml-2">
        <ChevronLeft className="h-4 w-4" /> Zurück zum Dashboard
      </Button>

      {/* Header with image */}
      <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
        <div className="h-48 relative overflow-hidden">
          <img src={getImage(data.objekttyp, data.id)} alt={data.titel} className="w-full h-full object-cover" />
          <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-sm font-semibold ${statusInfo.color}`}>
            {statusInfo.label}
          </div>
        </div>
        <div className="px-6 pb-6 relative">
          <div className="absolute -top-6 left-6">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-crm-md text-primary-foreground">
              <Home className="h-6 w-6" />
            </div>
          </div>
          <div className="pt-8 flex items-start justify-between flex-wrap gap-4">
            <div>
              {editing ? (
                <Input value={data.titel} onChange={(e) => set("titel", e.target.value)} className="text-xl font-bold mb-1" />
              ) : (
                <h1 className="text-xl font-display font-bold text-foreground">{data.titel}</h1>
              )}
              <p className="text-sm text-muted-foreground">{data.objekttyp} · {data.sanierungsbedarf}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" /> {data.adresse}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Status selector */}
              <Select value={data.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[240px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!editing ? (
                <Button variant="outline" onClick={() => setEditing(true)} className="gap-2 border-primary text-primary hover:bg-primary/10">
                  <Edit3 className="h-4 w-4" /> Bearbeiten
                </Button>
              ) : (
                <Button onClick={handleSave} className="gap-2 gradient-brand border-0 text-primary-foreground">
                  <Save className="h-4 w-4" /> Speichern
                </Button>
              )}
              <Button variant="outline" onClick={handleArchive} className="gap-2 text-muted-foreground">
                <Archive className="h-4 w-4" /> Archivieren
              </Button>
              <Button variant="destructive" onClick={() => setDeleteOpen(true)} className="gap-2" size="sm">
                <Trash2 className="h-4 w-4" /> Löschen
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Fläche", value: data.flaeche, icon: Ruler },
          { label: "Baujahr", value: data.baujahr, icon: Calendar },
          { label: "Zimmer", value: data.zimmer || "–", icon: Home },
          { label: "Objekttyp", value: data.objekttyp, icon: Home },
          { label: "Vermietet", value: data.vermietet ? "Ja" : "Nein", icon: Briefcase },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <s.icon className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-display font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column - Editable fields */}
        <div className="lg:col-span-2 space-y-5">
          {/* Objektdaten */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Objektdaten</h2>
            </div>
            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Adresse</label>
                    <Input value={data.adresse} onChange={(e) => set("adresse", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Objekttyp</label>
                    <Select value={data.objekttyp} onValueChange={(v) => set("objekttyp", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {OBJEKTTYPEN.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Baujahr</label>
                    <Input value={data.baujahr} onChange={(e) => set("baujahr", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Fläche</label>
                    <Input value={data.flaeche} onChange={(e) => set("flaeche", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Zimmer</label>
                    <Input value={data.zimmer || ""} onChange={(e) => set("zimmer", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Grundstücksfläche</label>
                    <Input value={data.grundstueck || ""} onChange={(e) => set("grundstueck", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Sanierungsstatus</label>
                    <Select value={data.sanierungsbedarf} onValueChange={(v) => set("sanierungsbedarf", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SANIERUNGSSTATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Stockwerke</label>
                    <Input value={data.stockwerke || ""} onChange={(e) => set("stockwerke", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Terrasse</label>
                    <Input value={data.terrasse || ""} onChange={(e) => set("terrasse", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Balkon</label>
                    <Input value={data.balkon || ""} onChange={(e) => set("balkon", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Parkplatz</label>
                    <Input value={data.parkplatz || ""} onChange={(e) => set("parkplatz", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Beschreibung</label>
                  <Textarea value={data.beschreibung || ""} onChange={(e) => set("beschreibung", e.target.value)} rows={4} />
                </div>
              </div>
            ) : (
              <>
                {data.beschreibung && <p className="text-sm text-muted-foreground leading-relaxed mb-4">{data.beschreibung}</p>}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <DataField label="Objekttyp" value={data.objekttyp} />
                  <DataField label="Baujahr" value={data.baujahr} />
                  <DataField label="Fläche" value={data.flaeche} />
                  {data.grundstueck && <DataField label="Grundstück" value={data.grundstueck} />}
                  {data.zimmer && <DataField label="Zimmer" value={data.zimmer} />}
                  <DataField label="Sanierungsstatus" value={data.sanierungsbedarf} />
                  {data.stockwerke && <DataField label="Stockwerke" value={data.stockwerke} />}
                  {data.terrasse && <DataField label="Terrasse" value={data.terrasse} />}
                  {data.balkon && <DataField label="Balkon" value={data.balkon} />}
                  {data.parkplatz && <DataField label="Parkplatz" value={data.parkplatz} />}
                  <DataField label="Vermietet" value={data.vermietet ? "Ja" : "Nein"} />
                </div>
              </>
            )}
          </div>

          {/* Entwicklungsplanung */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Entwicklungsplanung</h2>
            </div>
            {editing ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Entwicklungsabsicht</label>
                  <Input value={data.entwicklungsabsicht || ""} onChange={(e) => set("entwicklungsabsicht", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Ziel nach Entwicklung</label>
                  <Input value={data.zielNachEntwicklung || ""} onChange={(e) => set("zielNachEntwicklung", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Zeitrahmen</label>
                  <Input value={data.zeitrahmen || ""} onChange={(e) => set("zeitrahmen", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Budget-Range</label>
                  <Input value={data.budgetRange || ""} onChange={(e) => set("budgetRange", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Wünsche & Anforderungen</label>
                  <Textarea value={data.wuensche || ""} onChange={(e) => set("wuensche", e.target.value)} rows={3} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <DataField label="Entwicklungsabsicht" value={data.entwicklungsabsicht || "Nicht angegeben"} />
                <DataField label="Ziel nach Entwicklung" value={data.zielNachEntwicklung || "Nicht angegeben"} />
                <DataField label="Zeitrahmen" value={data.zeitrahmen || "Nicht angegeben"} />
                <DataField label="Budget-Range" value={data.budgetRange || "Nicht angegeben"} />
                {data.wuensche && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-0.5">Wünsche & Anforderungen</p>
                    <p className="font-medium text-foreground">{data.wuensche}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Unterlagen */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Unterlagen</h2>
            </div>
            <div className="space-y-2">
              {[
                { typ: "Grundriss", name: "grundriss_eg.pdf" },
                { typ: "Energieausweis", name: "energieausweis_2024.pdf" },
                { typ: "Grundbuch", name: "grundbuchauszug.pdf" },
              ].map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{doc.typ}</p>
                    <p className="text-xs text-muted-foreground">{doc.name}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    <Eye className="h-3 w-3 mr-1" /> Hochgeladen
                  </Badge>
                </div>
              ))}
            </div>
            {editing && (
              <Button variant="outline" size="sm" className="mt-3 text-xs">
                + Dokument hochladen
              </Button>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Status-Aktionen */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Status & Aktionen</h2>
            </div>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleStatusChange(s.value)}
                  className={`w-full text-left p-3 rounded-lg border text-sm font-medium transition-all ${
                    data.status === s.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card hover:border-primary/30 text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {data.status === s.value && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    {s.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Auf einen Blick */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Auf einen Blick</h2>
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd className={`font-medium px-2 py-0.5 rounded text-xs ${statusInfo.color}`}>{statusInfo.label}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Objekttyp</dt><dd className="font-medium text-foreground">{data.objekttyp}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Fläche</dt><dd className="font-medium text-foreground">{data.flaeche}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Baujahr</dt><dd className="font-medium text-foreground">{data.baujahr}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Sanierung</dt><dd className="font-medium text-foreground">{data.sanierungsbedarf}</dd></div>
              {data.zeitrahmen && <div className="flex justify-between"><dt className="text-muted-foreground">Zeitrahmen</dt><dd className="font-medium text-foreground">{data.zeitrahmen}</dd></div>}
              {data.budgetRange && <div className="flex justify-between"><dt className="text-muted-foreground">Budget</dt><dd className="font-medium text-foreground">{data.budgetRange}</dd></div>}
            </dl>
          </div>

          {/* Danger Zone */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-destructive/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <h2 className="text-sm font-semibold text-destructive">Gefahrenzone</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Diese Aktionen können nicht rückgängig gemacht werden.</p>
            <div className="space-y-2">
              <Button variant="outline" onClick={handleArchive} className="w-full gap-2 text-muted-foreground" size="sm">
                <Archive className="h-4 w-4" /> Inserat archivieren
              </Button>
              <Button variant="destructive" onClick={() => setDeleteOpen(true)} className="w-full gap-2" size="sm">
                <Trash2 className="h-4 w-4" /> Inserat endgültig löschen
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inserat löschen?</DialogTitle>
            <DialogDescription>
              Möchten Sie das Inserat „{data.titel}" wirklich endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Abbrechen</Button>
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash2 className="h-4 w-4" /> Endgültig löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
