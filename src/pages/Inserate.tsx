import { useState, useMemo } from "react";
import CRMLayout from "@/components/CRMLayout";
import { SAMPLE_LEADS, B2C_PIPELINE_STAGES } from "@/data/crm-data";
import type { Lead, Objekttyp, Sanierungsstatus } from "@/data/crm-data";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Home,
  MapPin,
  Calendar,
  Ruler,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Building,
  LayoutGrid,
  List,
} from "lucide-react";

// Inserat-specific types
type InseratStatus = "aktiv" | "entwurf" | "pausiert" | "abgelaufen";

interface Inserat {
  id: string;
  leadId: string;
  eigentuemerName: string;
  objekttyp: Objekttyp;
  adresse: string;
  baujahr: number;
  wohnflaeche: number;
  grundstuecksflaeche?: number;
  anzahlEinheiten?: number;
  sanierungsstatus: Sanierungsstatus;
  status: InseratStatus;
  erstelltAm: string;
  aktualisiertAm: string;
  aufrufe: number;
  anfragen: number;
  beschreibung: string;
}

// Generate inserate from B2C leads that have inserat status or are registered
const generateInserate = (): Inserat[] => {
  const b2cLeads = SAMPLE_LEADS.filter((l) => l.type === "b2c");
  const inserate: Inserat[] = [];

  b2cLeads.forEach((lead) => {
    if (lead.status === "b2c_inserat" || lead.status === "b2c_registered") {
      inserate.push({
        id: `ins-${lead.id}`,
        leadId: lead.id,
        eigentuemerName: `${lead.firstName} ${lead.lastName}`,
        objekttyp: lead.objekttyp || "Einfamilienhaus",
        adresse: lead.objektAdresse || lead.address || "",
        baujahr: lead.baujahr || 2000,
        wohnflaeche: lead.wohnflaeche || 100,
        grundstuecksflaeche: lead.grundstuecksflaeche,
        anzahlEinheiten: lead.anzahlEinheiten,
        sanierungsstatus: lead.sanierungsstatus || "Unsaniert",
        status: lead.status === "b2c_inserat" ? "aktiv" : "entwurf",
        erstelltAm: lead.createdAt,
        aktualisiertAm: lead.updatedAt,
        aufrufe: Math.floor(Math.random() * 500) + 50,
        anfragen: Math.floor(Math.random() * 20) + 1,
        beschreibung: lead.notes || "Immobilie des Eigentümers – Details im Inserat.",
      });
    }
  });

  // Add some extra demo inserate
  inserate.push(
    {
      id: "ins-demo-1",
      leadId: "1",
      eigentuemerName: "Anna Schmidt",
      objekttyp: "Einfamilienhaus",
      adresse: "Berliner Str. 12, 10115 Berlin",
      baujahr: 1978,
      wohnflaeche: 145,
      grundstuecksflaeche: 420,
      sanierungsstatus: "Unsaniert",
      status: "aktiv",
      erstelltAm: "2026-01-15",
      aktualisiertAm: "2026-02-18",
      aufrufe: 342,
      anfragen: 12,
      beschreibung: "Freistehendes EFH in ruhiger Lage. Sanierungsbedarf vorhanden, großes Grundstück.",
    },
    {
      id: "ins-demo-2",
      leadId: "3",
      eigentuemerName: "Peter Klein",
      objekttyp: "Mehrfamilienhaus",
      adresse: "Münchner Weg 5, 80331 München",
      baujahr: 1965,
      wohnflaeche: 480,
      anzahlEinheiten: 6,
      sanierungsstatus: "Teilsaniert",
      status: "aktiv",
      erstelltAm: "2026-01-22",
      aktualisiertAm: "2026-02-17",
      aufrufe: 518,
      anfragen: 18,
      beschreibung: "MFH mit 6 Einheiten, teilsaniert. Fenstertausch gewünscht.",
    },
    {
      id: "ins-demo-3",
      leadId: "5",
      eigentuemerName: "Maria Hoffmann",
      objekttyp: "Wohnung",
      adresse: "Elbchaussee 88, 22763 Hamburg",
      baujahr: 1992,
      wohnflaeche: 95,
      sanierungsstatus: "Teilsaniert",
      status: "pausiert",
      erstelltAm: "2026-02-01",
      aktualisiertAm: "2026-02-10",
      aufrufe: 89,
      anfragen: 3,
      beschreibung: "ETW in bester Lage. Heizungstausch steht an.",
    },
    {
      id: "ins-demo-4",
      leadId: "11",
      eigentuemerName: "Thomas Meier",
      objekttyp: "Mehrfamilienhaus",
      adresse: "Schillerstr. 15, 70173 Stuttgart",
      baujahr: 1955,
      wohnflaeche: 320,
      anzahlEinheiten: 4,
      sanierungsstatus: "Unsaniert",
      status: "entwurf",
      erstelltAm: "2026-02-17",
      aktualisiertAm: "2026-02-19",
      aufrufe: 0,
      anfragen: 0,
      beschreibung: "MFH im Zentrum, komplett unsaniert. Großes Sanierungspotenzial.",
    },
    {
      id: "ins-demo-5",
      leadId: "9",
      eigentuemerName: "Sophie Becker",
      objekttyp: "Wohnung",
      adresse: "Venloer Str. 200, 50823 Köln",
      baujahr: 2005,
      wohnflaeche: 72,
      sanierungsstatus: "Vollsaniert",
      status: "abgelaufen",
      erstelltAm: "2025-12-10",
      aktualisiertAm: "2026-01-10",
      aufrufe: 210,
      anfragen: 7,
      beschreibung: "Moderne ETW, vollsaniert. Energieberatung gewünscht.",
    }
  );

  return inserate;
};

const statusConfig: Record<InseratStatus, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  aktiv: { label: "Aktiv", icon: CheckCircle2, color: "bg-success/10 text-success border-success/20" },
  entwurf: { label: "Entwurf", icon: Clock, color: "bg-warning/10 text-warning border-warning/20" },
  pausiert: { label: "Pausiert", icon: Clock, color: "bg-muted text-muted-foreground border-border" },
  abgelaufen: { label: "Abgelaufen", icon: XCircle, color: "bg-destructive/10 text-destructive border-destructive/20" },
};

const objektIcons: Record<string, string> = {
  Wohnung: "🏢",
  Einfamilienhaus: "🏠",
  Mehrfamilienhaus: "🏘️",
  Gewerbeobjekt: "🏗️",
  Grundstück: "🌍",
  Mischobjekt: "🏛️",
};

type StatusFilter = "alle" | InseratStatus;
type ViewMode = "grid" | "list";

export default function Inserate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inserate] = useState<Inserat[]>(generateInserate);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("alle");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    let list = inserate;
    if (statusFilter !== "alle") list = list.filter((i) => i.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.eigentuemerName.toLowerCase().includes(q) ||
          i.adresse.toLowerCase().includes(q) ||
          i.objekttyp.toLowerCase().includes(q)
      );
    }
    return list;
  }, [inserate, search, statusFilter]);

  const counts = {
    alle: inserate.length,
    aktiv: inserate.filter((i) => i.status === "aktiv").length,
    entwurf: inserate.filter((i) => i.status === "entwurf").length,
    pausiert: inserate.filter((i) => i.status === "pausiert").length,
    abgelaufen: inserate.filter((i) => i.status === "abgelaufen").length,
  };

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-1 rounded-full gradient-brand" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Inserate</h1>
            <p className="text-sm text-muted-foreground mt-1">Alle Immobilien-Inserate deiner Eigentümer</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2 gradient-brand border-0 text-primary-foreground shadow-crm-sm hover:opacity-90">
            <Plus className="h-4 w-4" /> Neues Inserat
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <p className="text-3xl font-display font-bold text-foreground">{counts.alle}</p>
            <p className="text-xs text-muted-foreground mt-1">Gesamt</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <p className="text-3xl font-display font-bold text-success">{counts.aktiv}</p>
            <p className="text-xs text-muted-foreground mt-1">Aktiv</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <p className="text-3xl font-display font-bold text-foreground">
              {inserate.reduce((s, i) => s + i.aufrufe, 0).toLocaleString("de-DE")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Aufrufe gesamt</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <p className="text-3xl font-display font-bold text-primary">
              {inserate.reduce((s, i) => s + i.anfragen, 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Anfragen gesamt</p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suche nach Name, Adresse, Objekttyp…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {(["alle", "aktiv", "entwurf", "pausiert", "abgelaufen"] as StatusFilter[]).map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                size="sm"
                className={statusFilter === s ? "gradient-brand border-0 text-primary-foreground" : ""}
                onClick={() => setStatusFilter(s)}
              >
                {s === "alle" ? "Alle" : statusConfig[s].label} ({counts[s]})
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Inserate Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((ins) => {
              const sc = statusConfig[ins.status];
              const StatusIcon = sc.icon;
              return (
                <div
                  key={ins.id}
                  onClick={() => navigate(`/lead/${ins.leadId}`)}
                  className="bg-card rounded-xl shadow-crm-sm border border-border hover:shadow-crm-md hover:border-primary/20 transition-all cursor-pointer group overflow-hidden"
                >
                  {/* Header with objekttyp visual */}
                  <div className="h-28 gradient-brand-subtle flex items-center justify-center relative">
                    <span className="text-5xl">{objektIcons[ins.objekttyp] || "🏠"}</span>
                    <Badge variant="outline" className={`absolute top-3 right-3 text-[10px] gap-1 ${sc.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {sc.label}
                    </Badge>
                  </div>
                  <div className="p-4 space-y-2">
                    <div>
                      <p className="text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors">{ins.objekttyp}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" /> {ins.adresse}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Bj. {ins.baujahr}</span>
                      <span className="flex items-center gap-1"><Ruler className="h-3 w-3" /> {ins.wohnflaeche} m²</span>
                      {ins.anzahlEinheiten && <span>{ins.anzahlEinheiten} WE</span>}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                      <span className="text-xs text-muted-foreground">
                        <Home className="h-3 w-3 inline mr-1 -mt-0.5" />{ins.eigentuemerName}
                      </span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {ins.aufrufe}</span>
                        <span className="font-medium text-primary">{ins.anfragen} Anfragen</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Objekttyp</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Adresse</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Eigentümer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Fläche</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Aufrufe</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Anfragen</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Erstellt</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ins) => {
                  const sc = statusConfig[ins.status];
                  const StatusIcon = sc.icon;
                  return (
                    <tr
                      key={ins.id}
                      onClick={() => navigate(`/lead/${ins.leadId}`)}
                      className="border-b border-border/40 hover:bg-secondary/20 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={`text-[10px] gap-1 ${sc.color}`}>
                          <StatusIcon className="h-3 w-3" /> {sc.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        <span className="mr-1.5">{objektIcons[ins.objekttyp] || "🏠"}</span>
                        {ins.objekttyp}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{ins.adresse}</td>
                      <td className="py-3 px-4">{ins.eigentuemerName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{ins.wohnflaeche} m²</td>
                      <td className="py-3 px-4 text-muted-foreground">{ins.aufrufe}</td>
                      <td className="py-3 px-4 font-medium text-primary">{ins.anfragen}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {new Date(ins.erstelltAm).toLocaleDateString("de-DE")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Home className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Keine Inserate gefunden.</p>
          </div>
        )}

        {/* Create Dialog */}
        <CreateInseratDialog open={showCreate} onClose={() => setShowCreate(false)} />
      </div>
    </CRMLayout>
  );
}

function CreateInseratDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    eigentuemerName: "",
    objekttyp: "Einfamilienhaus" as Objekttyp,
    adresse: "",
    baujahr: "",
    wohnflaeche: "",
    grundstuecksflaeche: "",
    anzahlEinheiten: "",
    sanierungsstatus: "Unsaniert" as Sanierungsstatus,
    beschreibung: "",
  });

  const handleSubmit = () => {
    if (!form.eigentuemerName || !form.adresse) {
      toast({ title: "Pflichtfelder fehlen", description: "Bitte Eigentümer und Adresse angeben.", variant: "destructive" });
      return;
    }
    toast({ title: "Inserat erstellt ✓", description: `Inserat für ${form.eigentuemerName} wurde als Entwurf gespeichert.` });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Neues Inserat erstellen</DialogTitle>
          <DialogDescription>Erstelle ein neues Immobilien-Inserat für einen Eigentümer.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Eigentümer *</Label>
            <Input placeholder="Vor- und Nachname" value={form.eigentuemerName} onChange={(e) => setForm({ ...form, eigentuemerName: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Objekttyp</Label>
              <Select value={form.objekttyp} onValueChange={(v) => setForm({ ...form, objekttyp: v as Objekttyp })}>
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
              <Select value={form.sanierungsstatus} onValueChange={(v) => setForm({ ...form, sanierungsstatus: v as Sanierungsstatus })}>
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
            <Input placeholder="Straße, PLZ Ort" value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Baujahr</Label>
              <Input type="number" placeholder="z.B. 1985" value={form.baujahr} onChange={(e) => setForm({ ...form, baujahr: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Wohnfläche (m²)</Label>
              <Input type="number" placeholder="z.B. 120" value={form.wohnflaeche} onChange={(e) => setForm({ ...form, wohnflaeche: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Grundstück (m²)</Label>
              <Input type="number" placeholder="optional" value={form.grundstuecksflaeche} onChange={(e) => setForm({ ...form, grundstuecksflaeche: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Anzahl Einheiten</Label>
            <Input type="number" placeholder="nur bei MFH" value={form.anzahlEinheiten} onChange={(e) => setForm({ ...form, anzahlEinheiten: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Beschreibung</Label>
            <Textarea placeholder="Kurzbeschreibung der Immobilie…" value={form.beschreibung} onChange={(e) => setForm({ ...form, beschreibung: e.target.value })} rows={3} className="resize-none" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Abbrechen</Button>
            <Button onClick={handleSubmit} className="gradient-brand border-0 text-primary-foreground">Inserat erstellen</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
