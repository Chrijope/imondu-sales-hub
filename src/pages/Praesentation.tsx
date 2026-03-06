import { useState } from "react";
import { Link } from "react-router-dom";
import CRMLayout from "@/components/CRMLayout";
import {
  ChevronDown, ChevronUp, Play, Download, ExternalLink, FileText, ArrowRight,
  Plus, Trash2, Pencil, Save, Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface PresentationItem {
  id: string;
  label: string;
  type: "link" | "video" | "doc";
  url?: string;
}

interface CollapsibleSection {
  id: string;
  title: string;
  items: PresentationItem[];
}

const INITIAL_SECTIONS: CollapsibleSection[] = [
  { id: "praesentation", title: "Präsentation", items: [
    { id: "p1", label: "Imondu Präsentation kurz (Keynote)", type: "doc" },
    { id: "p2", label: "Imondu Präsentation kurz (PDF)", type: "doc" },
    { id: "p3", label: "Imondu Präsentation mittel (Keynote)", type: "doc" },
    { id: "p4", label: "Imondu Präsentation mittel (PDF)", type: "doc" },
    { id: "p5", label: "Imondu Präsentation lang (Keynote)", type: "doc" },
    { id: "p6", label: "Imondu Präsentation lang (PDF)", type: "doc" },
    { id: "p7", label: "Hintergründe Imondu", type: "doc" },
    { id: "p8", label: "Hintergründe Immobilien-Markt", type: "doc" },
  ]},
  { id: "bonitaetscheck", title: "Bonitätscheck", items: [
    { id: "b1", label: 'Checkliste „Imondu"', type: "doc" },
    { id: "b2", label: 'Checkliste „Bankprüfung"', type: "doc" },
    { id: "b3", label: "Selbstauskunft", type: "doc" },
    { id: "b4", label: "Schufa-Bestellung", type: "doc" },
    { id: "b5", label: "Mietfreibestätigung", type: "doc" },
    { id: "b6", label: "Haushaltsrechner (BoniTool)", type: "doc" },
  ]},
  { id: "objektbeispiele", title: "Objektbeispiele", items: [
    { id: "o1", label: "Beispielobjekt München-Schwabing", type: "doc" },
    { id: "o2", label: "Beispielobjekt Berlin-Mitte", type: "doc" },
    { id: "o3", label: "Beispielobjekt Hamburg-Eimsbüttel", type: "doc" },
  ]},
  { id: "kundenstimmen", title: "Kundenstimmen", items: [
    { id: "k1", label: "Kundenstimme Marco – Erste Immobilie über Imondu", type: "video" },
    { id: "k2", label: "Kundenstimme Sarah – Sanierung mit Imondu-Partner", type: "video" },
    { id: "k3", label: "Kundenstimme Familie Weber – Mehrfamilienhaus inseriert", type: "video" },
  ]},
  { id: "wissenswert", title: "Wissenswert", items: [
    { id: "w1", label: "Abschreibung Allgemein", type: "doc" },
    { id: "w2", label: "Immobilie als Altersvorsorge", type: "doc" },
    { id: "w3", label: "Immobilienpreise – Langfristtrend", type: "doc" },
    { id: "w4", label: "Renditeerwartung", type: "doc" },
  ]},
];

function CollapsibleCard({ section, canEdit, onAddItem, onDeleteItem, onEditItem, onDeleteSection, onRenameSection }: {
  section: CollapsibleSection; canEdit: boolean;
  onAddItem: () => void; onDeleteItem: (id: string) => void; onEditItem: (item: PresentationItem) => void;
  onDeleteSection: () => void; onRenameSection: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="flex items-center">
        <button onClick={() => setOpen(!open)} className="flex-1 flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
          <span className="text-sm font-semibold text-primary">{open ? "⊖" : "⊕"} {section.title}</span>
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {canEdit && (
          <div className="flex items-center gap-1 pr-3">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onRenameSection}><Pencil className="h-3 w-3" /></Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onAddItem}><Plus className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={onDeleteSection}><Trash2 className="h-3 w-3" /></Button>
          </div>
        )}
      </div>
      {open && (
        <>
          <div className="mx-5 border-t border-primary/30" />
          <ul className="px-5 py-3 space-y-2">
            {section.items.map((item) => (
              <li key={item.id} className="flex items-center gap-2 group">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <button className="text-sm text-foreground hover:text-primary transition-colors text-left flex items-center gap-2 flex-1">
                  {item.label}
                  {item.type === "video" && <Play className="h-3.5 w-3.5 text-muted-foreground" />}
                  {item.type === "doc" && <FileText className="h-3.5 w-3.5 text-muted-foreground" />}
                </button>
                {canEdit && (
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <button onClick={() => onEditItem(item)} className="h-6 w-6 rounded flex items-center justify-center hover:bg-muted"><Pencil className="h-3 w-3 text-muted-foreground" /></button>
                    <button onClick={() => onDeleteItem(item.id)} className="h-6 w-6 rounded flex items-center justify-center hover:bg-destructive/10"><Trash2 className="h-3 w-3 text-destructive" /></button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function getYouTubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function ErklaervideoBlock({ canEdit }: { canEdit: boolean }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("Imondu Erklärvideo");
  const [videoSubtitle, setVideoSubtitle] = useState("So funktioniert Imondu – für Vertriebspartner");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editDownloadUrl, setEditDownloadUrl] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");

  const ytId = getYouTubeId(videoUrl);
  const hasDownload = !!downloadUrl.trim();

  const handleSave = () => {
    setVideoUrl(editVideoUrl.trim());
    setDownloadUrl(editDownloadUrl.trim());
    setVideoTitle(editTitle.trim() || "Imondu Erklärvideo");
    setVideoSubtitle(editSubtitle.trim() || "So funktioniert Imondu – für Vertriebspartner");
    setShowEditDialog(false);
    toast.success("Erklärvideo aktualisiert");
  };

  return (
    <>
      <div className="glass-card-static rounded-xl overflow-hidden">
        <div className="bg-muted/30 flex items-center justify-center py-8 px-6 relative">
          {canEdit && (
            <Button variant="ghost" size="sm" className="absolute top-3 right-3 gap-1 text-xs" onClick={() => {
              setEditVideoUrl(videoUrl);
              setEditDownloadUrl(downloadUrl);
              setEditTitle(videoTitle);
              setEditSubtitle(videoSubtitle);
              setShowEditDialog(true);
            }}>
              <Pencil className="h-3.5 w-3.5" /> Bearbeiten
            </Button>
          )}
          <div className="w-full max-w-3xl aspect-video bg-foreground/5 rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
            {ytId ? (
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <div className="absolute inset-0 gradient-brand opacity-10" />
                <div className="text-center z-10">
                  <div className="h-16 w-16 rounded-full bg-card/90 shadow-crm-md flex items-center justify-center mx-auto mb-3 cursor-pointer hover:scale-105 transition-transform">
                    <Play className="h-7 w-7 text-primary ml-1" />
                  </div>
                  <p className="text-lg font-display font-bold text-foreground">{videoTitle}</p>
                  <p className="text-sm text-muted-foreground mt-1">{videoSubtitle}</p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 py-4 border-t border-border">
          {hasDownload ? (
            <Button variant="outline" size="sm" className="text-xs border-primary text-primary hover:bg-primary/10" asChild>
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-3.5 w-3.5 mr-1.5" /> Video herunterladen
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="text-xs" disabled>
              <Download className="h-3.5 w-3.5 mr-1.5" /> Video herunterladen
            </Button>
          )}
          {videoUrl ? (
            <Button variant="outline" size="sm" className="text-xs border-primary text-primary hover:bg-primary/10" asChild>
              <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Auf YouTube ansehen
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="text-xs" disabled>
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Auf YouTube ansehen
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Erklärvideo bearbeiten</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Video-Titel</label>
              <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Imondu Erklärvideo" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Untertitel</label>
              <Input value={editSubtitle} onChange={e => setEditSubtitle(e.target.value)} placeholder="So funktioniert Imondu – für Vertriebspartner" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">YouTube-URL</label>
              <Input value={editVideoUrl} onChange={e => setEditVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
              <p className="text-[10px] text-muted-foreground mt-1">Wird als eingebettetes Video und als "Auf YouTube ansehen"-Link verwendet.</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Download-Link (optional)</label>
              <Input value={editDownloadUrl} onChange={e => setEditDownloadUrl(e.target.value)} placeholder="https://..." />
              <p className="text-[10px] text-muted-foreground mt-1">Nur wenn ein Link hinterlegt ist, wird der Download-Button aktiv.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Abbrechen</Button>
            <Button onClick={handleSave}><Save className="h-4 w-4 mr-1" /> Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Praesentation() {
  const { currentRoleId } = useUserRole();
  const canEdit = currentRoleId === "admin" || currentRoleId === "vertriebsleiter";
  const [sections, setSections] = useState<CollapsibleSection[]>(INITIAL_SECTIONS);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"item" | "section" | "rename">("item");
  const [targetSectionId, setTargetSectionId] = useState("");
  const [editItem, setEditItem] = useState<PresentationItem | null>(null);
  const [form, setForm] = useState({ label: "", type: "doc" as PresentationItem["type"], url: "", sectionTitle: "" });

  const openAddSection = () => { setDialogMode("section"); setForm({ ...form, sectionTitle: "" }); setShowDialog(true); };
  const openRenameSection = (s: CollapsibleSection) => { setDialogMode("rename"); setTargetSectionId(s.id); setForm({ ...form, sectionTitle: s.title }); setShowDialog(true); };
  const openAddItem = (sectionId: string) => { setDialogMode("item"); setTargetSectionId(sectionId); setEditItem(null); setForm({ label: "", type: "doc", url: "", sectionTitle: "" }); setShowDialog(true); };
  const openEditItem = (sectionId: string, item: PresentationItem) => { setDialogMode("item"); setTargetSectionId(sectionId); setEditItem(item); setForm({ label: item.label, type: item.type, url: item.url || "", sectionTitle: "" }); setShowDialog(true); };

  const handleSave = () => {
    if (dialogMode === "section") {
      if (!form.sectionTitle.trim()) return;
      setSections(prev => [...prev, { id: `s-${Date.now()}`, title: form.sectionTitle.trim(), items: [] }]);
      toast.success("Abschnitt erstellt");
    } else if (dialogMode === "rename") {
      setSections(prev => prev.map(s => s.id === targetSectionId ? { ...s, title: form.sectionTitle.trim() } : s));
      toast.success("Umbenannt");
    } else {
      if (!form.label.trim()) return;
      const newItem: PresentationItem = { id: editItem?.id || `p-${Date.now()}`, label: form.label.trim(), type: form.type, url: form.url || undefined };
      setSections(prev => prev.map(s => {
        if (s.id !== targetSectionId) return s;
        if (editItem) return { ...s, items: s.items.map(i => i.id === editItem.id ? newItem : i) };
        return { ...s, items: [...s.items, newItem] };
      }));
      toast.success(editItem ? "Aktualisiert" : "Hinzugefügt");
    }
    setShowDialog(false);
  };

  const deleteSection = (id: string) => { setSections(prev => prev.filter(s => s.id !== id)); toast.success("Gelöscht"); };
  const deleteItem = (sectionId: string, itemId: string) => { setSections(prev => prev.map(s => s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s)); };

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in min-h-screen dashboard-mesh-bg">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1"><div className="w-10 h-1 rounded-full gradient-brand" /></div>
            <h1 className="text-2xl font-display font-bold text-foreground">Präsentation</h1>
            <p className="text-sm text-muted-foreground mt-1">Vertriebsmaterialien, Videos und Unterlagen für deine Kundengespräche</p>
          </div>
          {canEdit && (
            <Button onClick={openAddSection} className="gap-1.5 gradient-brand text-primary-foreground">
              <Plus className="h-4 w-4" /> Abschnitt
            </Button>
          )}
        </div>

        {/* Erklärvideo */}
        <ErklaervideoBlock canEdit={canEdit} />

        {/* Collapsible Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {sections.map((section) => (
            <CollapsibleCard key={section.id} section={section} canEdit={canEdit}
              onAddItem={() => openAddItem(section.id)}
              onDeleteItem={(id) => deleteItem(section.id, id)}
              onEditItem={(item) => openEditItem(section.id, item)}
              onDeleteSection={() => deleteSection(section.id)}
              onRenameSection={() => openRenameSection(section)}
            />
          ))}
          <Link to="/leads" className="glass-card rounded-xl flex items-center justify-between px-5 py-4 hover:shadow-crm-md transition-all group">
            <span className="text-sm font-semibold text-primary flex items-center gap-2">
              <ArrowRight className="h-4 w-4" /> Kontakt anlegen
            </span>
          </Link>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogMode === "section" ? "Neuer Abschnitt" : dialogMode === "rename" ? "Umbenennen" : (editItem ? "Bearbeiten" : "Neuer Eintrag")}</DialogTitle>
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
                    <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as PresentationItem["type"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doc">📝 Dokument / PDF</SelectItem>
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
