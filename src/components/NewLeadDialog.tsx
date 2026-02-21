import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Lead, OBJEKTTYP_OPTIONS, GEWERK_OPTIONS, Objekttyp, Gewerk } from "@/data/crm-data";
import { addScoutedLeads } from "@/utils/scouted-leads";

interface NewLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "b2c" | "b2b";
}

const ASSIGNEES = ["Max Müller", "Lisa Weber", "Jan Fischer"];

export default function NewLeadDialog({ open, onOpenChange, type }: NewLeadDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<Record<string, string>>({});

  const set = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    const today = new Date().toISOString().slice(0, 10);
    const id = `manual-${type}-${Date.now()}`;

    if (type === "b2c") {
      if (!form.firstName || !form.lastName) {
        toast({ title: "Pflichtfelder fehlen", description: "Bitte Vor- und Nachname eingeben.", variant: "destructive" });
        return;
      }
      const lead: Lead = {
        id,
        type: "b2c",
        status: "b2c_new",
        priority: (form.priority as Lead["priority"]) || "medium",
        assignee: form.assignee || ASSIGNEES[0],
        source: form.source || "Manuell",
        createdAt: today,
        updatedAt: today,
        value: 10,
        notes: form.notes || "",
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        email: form.email || undefined,
        address: form.address || undefined,
        objektAdresse: form.address || undefined,
        objekttyp: (form.objekttyp as Objekttyp) || undefined,
        baujahr: form.baujahr ? Number(form.baujahr) : undefined,
        wohnflaeche: form.wohnflaeche ? Number(form.wohnflaeche) : undefined,
        grundstuecksflaeche: form.grundstuecksflaeche ? Number(form.grundstuecksflaeche) : undefined,
        interesse: form.interesse as Lead["interesse"],
      };
      addScoutedLeads([lead]);
    } else {
      if (!form.companyName) {
        toast({ title: "Pflichtfeld fehlt", description: "Bitte Firmenname eingeben.", variant: "destructive" });
        return;
      }
      const lead: Lead = {
        id,
        type: "b2b",
        status: "b2b_new",
        priority: (form.priority as Lead["priority"]) || "medium",
        assignee: form.assignee || ASSIGNEES[0],
        source: form.source || "Manuell",
        createdAt: today,
        updatedAt: today,
        value: 1250,
        notes: form.notes || "",
        companyName: form.companyName,
        gewerk: (form.gewerk as Gewerk) || undefined,
        contactPerson: form.contactPerson || undefined,
        position: form.position || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        website: form.website || undefined,
        region: form.region || undefined,
        companySize: form.companySize || undefined,
        partnerStatus: "Interessent",
      };
      addScoutedLeads([lead]);
    }

    toast({ title: "Lead erstellt", description: `Neuer ${type === "b2c" ? "B2C" : "B2B"}-Lead wurde angelegt.` });
    setForm({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{type === "b2c" ? "Neuen Eigentümer-Lead anlegen" : "Neuen Partner-Lead anlegen"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {type === "b2c" ? (
            <>
              {/* B2C Form */}
              <div className="w-full px-4 py-2 bg-primary/5 rounded-lg border border-border">
                <span className="text-xs font-semibold text-foreground">Kontaktdaten</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Vorname *</Label>
                  <Input value={form.firstName || ""} onChange={(e) => set("firstName", e.target.value)} placeholder="Max" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Nachname *</Label>
                  <Input value={form.lastName || ""} onChange={(e) => set("lastName", e.target.value)} placeholder="Mustermann" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Telefon</Label>
                  <Input value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} placeholder="+49 170 ..." />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">E-Mail</Label>
                  <Input value={form.email || ""} onChange={(e) => set("email", e.target.value)} placeholder="name@email.de" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Adresse</Label>
                <Input value={form.address || ""} onChange={(e) => set("address", e.target.value)} placeholder="Straße Nr., PLZ Ort" />
              </div>

              <div className="w-full px-4 py-2 bg-primary/5 rounded-lg border border-border">
                <span className="text-xs font-semibold text-foreground">Objektdaten</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Objekttyp</Label>
                  <Select value={form.objekttyp || ""} onValueChange={(v) => set("objekttyp", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Auswählen" /></SelectTrigger>
                    <SelectContent>
                      {OBJEKTTYP_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Baujahr</Label>
                  <Input type="number" value={form.baujahr || ""} onChange={(e) => set("baujahr", e.target.value)} placeholder="1985" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Wohnfläche (m²)</Label>
                  <Input type="number" value={form.wohnflaeche || ""} onChange={(e) => set("wohnflaeche", e.target.value)} placeholder="120" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Grundstücksfläche (m²)</Label>
                  <Input type="number" value={form.grundstuecksflaeche || ""} onChange={(e) => set("grundstuecksflaeche", e.target.value)} placeholder="450" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Interesse</Label>
                <Select value={form.interesse || ""} onValueChange={(v) => set("interesse", v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Auswählen" /></SelectTrigger>
                  <SelectContent>
                    {["Sanierung","Verkauf","Energieberatung","Fenstertausch","Dachsanierung","Heizungstausch","Sonstige"].map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              {/* B2B Form */}
              <div className="w-full px-4 py-2 bg-primary/5 rounded-lg border border-border">
                <span className="text-xs font-semibold text-foreground">Firmendaten</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs">Firmenname *</Label>
                  <Input value={form.companyName || ""} onChange={(e) => set("companyName", e.target.value)} placeholder="Firma GmbH" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Gewerk</Label>
                  <Select value={form.gewerk || ""} onValueChange={(v) => set("gewerk", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Auswählen" /></SelectTrigger>
                    <SelectContent>
                      {GEWERK_OPTIONS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Region</Label>
                  <Input value={form.region || ""} onChange={(e) => set("region", e.target.value)} placeholder="Bayern" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Unternehmensgröße</Label>
                  <Input value={form.companySize || ""} onChange={(e) => set("companySize", e.target.value)} placeholder="10-50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Website</Label>
                  <Input value={form.website || ""} onChange={(e) => set("website", e.target.value)} placeholder="www.firma.de" />
                </div>
              </div>

              <div className="w-full px-4 py-2 bg-primary/5 rounded-lg border border-border">
                <span className="text-xs font-semibold text-foreground">Ansprechpartner</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Name</Label>
                  <Input value={form.contactPerson || ""} onChange={(e) => set("contactPerson", e.target.value)} placeholder="Max Mustermann" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Position</Label>
                  <Input value={form.position || ""} onChange={(e) => set("position", e.target.value)} placeholder="Geschäftsführer" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Telefon</Label>
                  <Input value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} placeholder="+49 89 ..." />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">E-Mail</Label>
                  <Input value={form.email || ""} onChange={(e) => set("email", e.target.value)} placeholder="name@firma.de" />
                </div>
              </div>
            </>
          )}

          {/* Shared fields */}
          <div className="w-full px-4 py-2 bg-primary/5 rounded-lg border border-border">
            <span className="text-xs font-semibold text-foreground">Zuweisung</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Verantwortlich</Label>
              <Select value={form.assignee || ASSIGNEES[0]} onValueChange={(v) => set("assignee", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ASSIGNEES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Priorität</Label>
              <Select value={form.priority || "medium"} onValueChange={(v) => set("priority", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Niedrig</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="high">Hoch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-xs">Quelle</Label>
              <Input value={form.source || ""} onChange={(e) => set("source", e.target.value)} placeholder="Website, Empfehlung, Messe…" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Notizen</Label>
            <Textarea value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} placeholder="Optionale Notizen…" rows={2} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
            <Button onClick={handleSave}>Lead anlegen</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
