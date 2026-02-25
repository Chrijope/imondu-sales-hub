import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { FileText, Plus, Trash2, Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface DocItem {
  id: string;
  label: string;
  type: "pdf" | "doc" | "video" | "link";
  url?: string;
}

interface Section {
  id: string;
  title: string;
  items: DocItem[];
}

const INITIAL_SECTIONS: Section[] = [
  { id: "s1", title: "Präsentation", items: [
    { id: "i1", label: "Imondu Präsentation kurz (Keynote)", type: "doc" },
    { id: "i2", label: "Imondu Präsentation kurz (PDF)", type: "pdf" },
    { id: "i3", label: "Imondu Präsentation mittel (Keynote)", type: "doc" },
    { id: "i4", label: "Imondu Präsentation mittel (PDF)", type: "pdf" },
    { id: "i5", label: "Imondu Präsentation lang (Keynote)", type: "doc" },
    { id: "i6", label: "Imondu Präsentation lang (PDF)", type: "pdf" },
    { id: "i7", label: "Imondu Konzeptpräsentation Sprechskript (kurz bis lang)", type: "doc" },
    { id: "i8", label: "Hintergründe Imondu", type: "doc" },
    { id: "i9", label: "Hintergründe Immobilien-Markt", type: "doc" },
  ]},
  { id: "s2", title: "Bonitätsunterlagen", items: [
    { id: "i10", label: 'Checkliste „Imondu"', type: "doc" },
    { id: "i11", label: 'Checkliste „Bankprüfung"', type: "doc" },
    { id: "i12", label: "Selbstauskunft", type: "pdf" },
    { id: "i13", label: "Schufa-Bestellung", type: "pdf" },
    { id: "i14", label: "Mietfreibestätigung", type: "pdf" },
    { id: "i15", label: "Negativ-Erklärung Steuer", type: "pdf" },
    { id: "i16", label: "Vollmacht für Objekteigentümer", type: "pdf" },
    { id: "i17", label: "Aufstellung Immobilienvermögen", type: "doc" },
    { id: "i18", label: "Haushaltsrechner (BoniTool)", type: "doc" },
  ]},
  { id: "s3", title: "Beratung / Abschluss", items: [
    { id: "i19", label: "Beispielberechnung (NUMBERS)", type: "doc" },
    { id: "i20", label: "Immobilienkalkulator (NUMBERS)", type: "doc" },
    { id: "i21", label: "Imondu Immorechner", type: "link" },
    { id: "i22", label: "Reservierung", type: "pdf" },
    { id: "i23", label: "Beratungsprotokoll", type: "pdf" },
    { id: "i24", label: "Mietausfallversicherung", type: "pdf" },
  ]},
  { id: "s4", title: "Steuerliche Themen", items: [
    { id: "i25", label: "Steuerwissen kompakt", type: "doc" },
    { id: "i26", label: "Steuersätze nach Einkommenshöhe", type: "doc" },
    { id: "i27", label: "Lohnsteueroptimierung (Video)", type: "video" },
    { id: "i28", label: "Senkung der Lohnsteuer in Elster (Video)", type: "video" },
  ]},
  { id: "s5", title: "Karriere", items: [
    { id: "i29", label: "Imondu Vertriebs- & Karriereplan", type: "pdf" },
    { id: "i30", label: "Imondu Assistenten Vertrag (Blanko)", type: "pdf" },
    { id: "i31", label: "Karriereantrag (Neueinstufung/Beförderung)", type: "pdf" },
    { id: "i32", label: "Zielplanung (Vorlage, Pages)", type: "doc" },
  ]},
  { id: "s6", title: "Organisation", items: [
    { id: "i33", label: "Kunden- & Umsatzliste (NUMBERS)", type: "doc" },
    { id: "i34", label: "E-Mail-Signatur (Vorlage, Word)", type: "doc" },
    { id: "i35", label: "Imondu Logo (PSD)", type: "doc" },
    { id: "i36", label: "Rechnungsvorlage (Word)", type: "doc" },
  ]},
  { id: "s7", title: "Vorlagen & Leitfäden", items: [
    { id: "i37", label: "Leitfaden für Neukunden Anwerbung/Akquise", type: "pdf" },
    { id: "i38", label: "Leitfaden für Imondu-Partner Anwerbung/Akquise", type: "pdf" },
  ]},
];

const TYPE_ICONS: Record<string, string> = { pdf: "📄", doc: "📝", video: "🎬", link: "🔗" };

function CollapsibleCard({ section, canEdit, onAddItem, onDeleteItem, onEditItem, onDeleteSection, onRenameSection }: {
  section: Section; canEdit: boolean;
  onAddItem: () => void; onDeleteItem: (id: string) => void; onEditItem: (item: DocItem) => void;
  onDeleteSection: () => void; onRenameSection: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="flex items-center">
        <button onClick={() => setOpen(!open)} className="flex-1 flex items-center gap-2 px-5 py-4 hover:bg-muted/30 transition-colors text-left">
          <span className="text-accent text-sm">{open ? "⊖" : "⊕"}</span>
          <span className="text-sm font-semibold text-accent">{section.title}</span>
          <span className="text-[10px] text-muted-foreground ml-1">({section.items.length})</span>
        </button>
        {canEdit && (
          <div className="flex items-center gap-1 pr-3">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onRenameSection} title="Umbenennen"><Pencil className="h-3 w-3" /></Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onAddItem} title="Eintrag hinzufügen"><Plus className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={onDeleteSection} title="Löschen"><Trash2 className="h-3 w-3" /></Button>
          </div>
        )}
      </div>
      <div className="mx-5 border-t border-accent/30" />
      {open && (
        <ul className="px-5 py-3 space-y-2">
          {section.items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 group">
              <span className="text-sm">{TYPE_ICONS[item.type] || "📄"}</span>
              <button className="text-sm text-foreground hover:text-accent transition-colors text-left flex-1">
                {item.label}
              </button>
              {canEdit && (
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                  <button onClick={() => onEditItem(item)} className="h-6 w-6 rounded flex items-center justify-center hover:bg-muted"><Pencil className="h-3 w-3 text-muted-foreground" /></button>
                  <button onClick={() => onDeleteItem(item.id)} className="h-6 w-6 rounded flex items-center justify-center hover:bg-destructive/10"><Trash2 className="h-3 w-3 text-destructive" /></button>
                </div>
              )}
            </li>
          ))}
          {section.items.length === 0 && <li className="text-xs text-muted-foreground">Keine Einträge</li>}
        </ul>
      )}
    </div>
  );
}

export default function Unterlagen() {
  const { currentRoleId } = useUserRole();
  const canEdit = currentRoleId === "admin" || currentRoleId === "vertriebsleiter";
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"item" | "section" | "rename">("item");
  const [targetSectionId, setTargetSectionId] = useState<string>("");
  const [editItem, setEditItem] = useState<DocItem | null>(null);
  const [form, setForm] = useState({ label: "", type: "pdf" as DocItem["type"], url: "", sectionTitle: "" });

  const openAddSection = () => { setDialogMode("section"); setForm({ ...form, sectionTitle: "" }); setShowDialog(true); };
  const openRenameSection = (s: Section) => { setDialogMode("rename"); setTargetSectionId(s.id); setForm({ ...form, sectionTitle: s.title }); setShowDialog(true); };
  const openAddItem = (sectionId: string) => { setDialogMode("item"); setTargetSectionId(sectionId); setEditItem(null); setForm({ label: "", type: "pdf", url: "", sectionTitle: "" }); setShowDialog(true); };
  const openEditItem = (sectionId: string, item: DocItem) => { setDialogMode("item"); setTargetSectionId(sectionId); setEditItem(item); setForm({ label: item.label, type: item.type, url: item.url || "", sectionTitle: "" }); setShowDialog(true); };

  const handleSave = () => {
    if (dialogMode === "section") {
      if (!form.sectionTitle.trim()) return;
      setSections(prev => [...prev, { id: `s-${Date.now()}`, title: form.sectionTitle.trim(), items: [] }]);
      toast.success("Abschnitt erstellt");
    } else if (dialogMode === "rename") {
      setSections(prev => prev.map(s => s.id === targetSectionId ? { ...s, title: form.sectionTitle.trim() } : s));
      toast.success("Abschnitt umbenannt");
    } else {
      if (!form.label.trim()) return;
      const newItem: DocItem = { id: editItem?.id || `i-${Date.now()}`, label: form.label.trim(), type: form.type, url: form.url || undefined };
      setSections(prev => prev.map(s => {
        if (s.id !== targetSectionId) return s;
        if (editItem) return { ...s, items: s.items.map(i => i.id === editItem.id ? newItem : i) };
        return { ...s, items: [...s.items, newItem] };
      }));
      toast.success(editItem ? "Eintrag aktualisiert" : "Eintrag hinzugefügt");
    }
    setShowDialog(false);
  };

  const deleteSection = (id: string) => { setSections(prev => prev.filter(s => s.id !== id)); toast.success("Abschnitt gelöscht"); };
  const deleteItem = (sectionId: string, itemId: string) => { setSections(prev => prev.map(s => s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s)); };

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-4 animate-fade-in min-h-screen dashboard-mesh-bg">
        <div className="max-w-4xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1"><div className="w-10 h-1 rounded-full gradient-brand" /></div>
              <h1 className="text-2xl font-display font-bold text-foreground">Unterlagen</h1>
              <p className="text-sm text-muted-foreground mt-1">Alle Dokumente und Vorlagen für deinen Vertriebsalltag</p>
            </div>
            {canEdit && (
              <Button onClick={openAddSection} className="gap-1.5 gradient-brand text-primary-foreground">
                <Plus className="h-4 w-4" /> Abschnitt
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {sections.map((section) => (
              <CollapsibleCard key={section.id} section={section} canEdit={canEdit}
                onAddItem={() => openAddItem(section.id)}
                onDeleteItem={(id) => deleteItem(section.id, id)}
                onEditItem={(item) => openEditItem(section.id, item)}
                onDeleteSection={() => deleteSection(section.id)}
                onRenameSection={() => openRenameSection(section)}
              />
            ))}
          </div>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogMode === "section" ? "Neuer Abschnitt" : dialogMode === "rename" ? "Abschnitt umbenennen" : (editItem ? "Eintrag bearbeiten" : "Neuer Eintrag")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              {(dialogMode === "section" || dialogMode === "rename") ? (
                <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Bezeichnung</label>
                  <Input value={form.sectionTitle} onChange={e => setForm({ ...form, sectionTitle: e.target.value })} /></div>
              ) : (
                <>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Titel *</label>
                    <Input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Typ</label>
                    <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as DocItem["type"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">📄 PDF</SelectItem>
                        <SelectItem value="doc">📝 Dokument</SelectItem>
                        <SelectItem value="video">🎬 Video / YouTube</SelectItem>
                        <SelectItem value="link">🔗 Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1 block">URL (optional)</label>
                    <Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>Abbrechen</Button>
              <Button onClick={handleSave}><Save className="h-4 w-4 mr-1" /> Speichern</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CRMLayout>
  );
}
