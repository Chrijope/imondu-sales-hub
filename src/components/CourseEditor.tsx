import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Upload,
  Image,
  Video,
  BookOpen,
  FileQuestion,
  Save,
  X,
  Copy,
  Eye,
  Settings2,
} from "lucide-react";
import type { Course, Module, Lesson, Section } from "@/data/academy-courses";
import { toast } from "sonner";

/* ─── helpers ─── */
const genId = () => Math.random().toString(36).slice(2, 10);

const newLesson = (order: number, sectionId?: string): Lesson => ({
  id: `lesson-${genId()}`,
  title: `Neue Lektion ${order}`,
  duration: "10:00",
  completed: false,
  locked: false,
  description: "",
  sectionId,
});

const newSection = (order: number): Section => ({
  id: `sec-${genId()}`,
  title: `Neue Sektion ${order}`,
  description: "",
});

const newModule = (order: number): Module => ({
  id: `mod-${genId()}`,
  title: `Neues Modul ${order}`,
  description: "",
  lessons: [newLesson(1)],
  sections: [],
});

/* ─── Lesson Editor Row ─── */
function LessonRow({
  lesson,
  onUpdate,
  onDelete,
}: {
  lesson: Lesson;
  onUpdate: (l: Lesson) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(lesson);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const save = () => {
    onUpdate(draft);
    setEditing(false);
    toast.success("Lektion gespeichert");
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setDraft({ ...draft, videoUrl: url });
    toast.success(`Video "${file.name}" hochgeladen`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setDraft({ ...draft, imageUrl: url });
    toast.success(`Bild "${file.name}" hochgeladen`);
  };

  if (editing) {
    return (
      <div className="p-4 bg-secondary/30 rounded-lg border border-border space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lektion bearbeiten</p>
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Titel</Label>
            <Input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Dauer (mm:ss)</Label>
            <Input
              value={draft.duration}
              onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
              className="text-sm"
              placeholder="10:00"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Beschreibung</Label>
          <Textarea
            value={draft.description || ""}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            rows={3}
            className="text-sm"
          />
        </div>

        {/* Video upload */}
        <div className="space-y-1.5">
          <Label className="text-xs">Video</Label>
          <input ref={videoInputRef} type="file" accept="video/mp4,video/mov,video/webm,video/*" className="hidden" onChange={handleVideoUpload} />
          {draft.videoUrl ? (
            <div className="rounded-lg border border-border overflow-hidden">
              <video src={draft.videoUrl} controls className="w-full max-h-48 bg-black" />
              <div className="flex items-center justify-between px-3 py-2 bg-secondary/30">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Video className="h-3 w-3" /> Video hochgeladen</p>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="text-xs h-6 px-2" onClick={() => videoInputRef.current?.click()}>Ersetzen</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-destructive" onClick={() => setDraft({ ...draft, videoUrl: undefined })}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => videoInputRef.current?.click()}
            >
              <Video className="h-6 w-6 text-muted-foreground mx-auto mb-1.5" />
              <p className="text-xs text-muted-foreground">Video hochladen oder per Drag & Drop ablegen</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">MP4, MOV, WebM · Max. 500 MB</p>
              <Button variant="outline" size="sm" className="mt-2 text-xs gap-1" onClick={(e) => { e.stopPropagation(); videoInputRef.current?.click(); }}>
                <Upload className="h-3 w-3" /> Datei auswählen
              </Button>
            </div>
          )}
        </div>

        {/* Lesson image (optional) */}
        <div className="space-y-1.5">
          <Label className="text-xs">Lektionsbild (optional)</Label>
          <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/*" className="hidden" onChange={handleImageUpload} />
          {draft.imageUrl ? (
            <div className="rounded-lg border border-border overflow-hidden">
              <img src={draft.imageUrl} alt="Lektionsbild" className="w-full max-h-32 object-cover" />
              <div className="flex items-center justify-between px-3 py-2 bg-secondary/30">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Image className="h-3 w-3" /> Bild hochgeladen</p>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="text-xs h-6 px-2" onClick={() => imageInputRef.current?.click()}>Ersetzen</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-destructive" onClick={() => setDraft({ ...draft, imageUrl: undefined })}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-border rounded-lg p-3 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => imageInputRef.current?.click()}
            >
              <Image className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Thumbnail hochladen</p>
              <p className="text-[10px] text-muted-foreground">JPG, PNG, WebP · Max. 5 MB</p>
            </div>
          )}
        </div>

        {/* Settings row */}
        <div className="flex items-center gap-6 pt-1">
          <div className="flex items-center gap-2">
            <Switch
              checked={draft.locked}
              onCheckedChange={(v) => setDraft({ ...draft, locked: v })}
              id={`locked-${draft.id}`}
            />
            <Label htmlFor={`locked-${draft.id}`} className="text-xs">Gesperrt</Label>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs">Status</Label>
            <Select
              value={draft.status || "published"}
              onValueChange={(v) => setDraft({ ...draft, status: v as "draft" | "published" })}
            >
              <SelectTrigger className="h-7 w-[140px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Entwurf</SelectItem>
                <SelectItem value="published">Veröffentlicht</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" className="text-xs" onClick={() => setEditing(false)}>
            Abbrechen
          </Button>
          <Button size="sm" className="text-xs gap-1 gradient-brand border-0 text-white" onClick={save}>
            <Save className="h-3 w-3" /> Speichern
          </Button>
        </div>
      </div>
    );
  }

  const statusBadge = (() => {
    const s = lesson.status || "published";
    if (s === "draft") return <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-warning/30 text-warning whitespace-nowrap shrink-0">Entwurf</Badge>;
    return <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-[hsl(var(--success))]/30 text-[hsl(var(--success))] whitespace-nowrap shrink-0">Veröffentlicht</Badge>;
  })();

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 hover:bg-secondary/20 transition-colors group rounded-lg">
      <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 cursor-grab shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{lesson.title}</p>
        <p className="text-[11px] text-muted-foreground">{lesson.duration} {lesson.locked && "· 🔒 Gesperrt"}</p>
      </div>
      {statusBadge}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setDraft(lesson); setEditing(true); }}>
          <Pencil className="h-3 w-3" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive">
              <Trash2 className="h-3 w-3" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Lektion löschen?</AlertDialogTitle>
              <AlertDialogDescription>
                „{lesson.title}" wird unwiderruflich gelöscht.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

/* ─── Section Header Row ─── */
function SectionRow({
  section,
  lessonsCount,
  isOpen,
  onToggle,
  onUpdate,
  onDelete,
}: {
  section: Section;
  lessonsCount: number;
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (s: Section) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [desc, setDesc] = useState(section.description || "");

  const save = () => {
    onUpdate({ ...section, title, description: desc || undefined });
    setEditing(false);
    toast.success("Sektion gespeichert");
  };

  if (editing) {
    return (
      <div className="px-4 py-3 bg-accent/30 border-b border-border/40 space-y-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Sektions-Titel</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-sm h-8" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Beschreibung (optional)</Label>
          <Input value={desc} onChange={(e) => setDesc(e.target.value)} className="text-sm h-8" placeholder="Kurze Beschreibung der Sektion…" />
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="text-xs gap-1" onClick={save}><Save className="h-3 w-3" /> Speichern</Button>
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => setEditing(false)}>Abbrechen</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-accent/20 border-b border-border/40 group/sec">
      <GripVertical className="h-3 w-3 text-muted-foreground/40 cursor-grab shrink-0" />
      <button onClick={onToggle} className="p-0.5">
        {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggle}>
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">{section.title}</p>
        {section.description && <p className="text-[10px] text-muted-foreground">{section.description}</p>}
      </div>
      <span className="text-[10px] text-muted-foreground">{lessonsCount} Lektionen</span>
      <div className="flex items-center gap-0.5 opacity-0 group-hover/sec:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => { setTitle(section.title); setDesc(section.description || ""); setEditing(true); }}>
          <Pencil className="h-2.5 w-2.5" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive hover:text-destructive">
              <Trash2 className="h-2.5 w-2.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sektion löschen?</AlertDialogTitle>
              <AlertDialogDescription>
                „{section.title}" und alle {lessonsCount} zugehörigen Lektionen werden gelöscht.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

/* ─── Module Editor Card ─── */
function ModuleCard({
  mod,
  index,
  onUpdate,
  onDelete,
}: {
  mod: Module;
  index: number;
  onUpdate: (m: Module) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [editingHeader, setEditingHeader] = useState(false);
  const [title, setTitle] = useState(mod.title);
  const [desc, setDesc] = useState(mod.description);
  const [openSections, setOpenSections] = useState<string[]>(mod.sections?.map(s => s.id) || []);

  const sections = mod.sections || [];
  const unsectionedLessons = mod.lessons.filter(l => !l.sectionId);

  const toggleSection = (id: string) =>
    setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const saveHeader = () => {
    onUpdate({ ...mod, title, description: desc });
    setEditingHeader(false);
    toast.success("Modul gespeichert");
  };

  const addLesson = (sectionId?: string) => {
    const order = mod.lessons.length + 1;
    const lesson = newLesson(order, sectionId);
    onUpdate({ ...mod, lessons: [...mod.lessons, lesson] });
    setOpen(true);
    if (sectionId) setOpenSections(prev => prev.includes(sectionId) ? prev : [...prev, sectionId]);
    toast.success("Lektion hinzugefügt");
  };

  const addSectionToModule = () => {
    const sec = newSection((sections.length || 0) + 1);
    onUpdate({ ...mod, sections: [...sections, sec] });
    setOpen(true);
    setOpenSections(prev => [...prev, sec.id]);
    toast.success("Sektion hinzugefügt");
  };

  const updateSection = (secId: string, updated: Section) => {
    onUpdate({ ...mod, sections: sections.map(s => s.id === secId ? updated : s) });
  };

  const deleteSection = (secId: string) => {
    onUpdate({
      ...mod,
      sections: sections.filter(s => s.id !== secId),
      lessons: mod.lessons.filter(l => l.sectionId !== secId),
    });
    toast.success("Sektion gelöscht");
  };

  const updateLesson = (lessonId: string, lesson: Lesson) => {
    onUpdate({ ...mod, lessons: mod.lessons.map((l) => (l.id === lessonId ? lesson : l)) });
  };

  const deleteLesson = (lessonId: string) => {
    onUpdate({ ...mod, lessons: mod.lessons.filter((l) => l.id !== lessonId) });
    toast.success("Lektion gelöscht");
  };

  const totalCount = mod.lessons.length;
  const sectionCount = sections.length;

  return (
    <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60">
        <GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab shrink-0" />
        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
          {index + 1}
        </div>

        {editingHeader ? (
          <div className="flex-1 space-y-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-sm h-8" />
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} className="text-xs" />
            <div className="space-y-1.5">
              <Label className="text-xs">Modulbild (optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-2 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Image className="h-4 w-4 text-muted-foreground mx-auto mb-0.5" />
                <p className="text-[10px] text-muted-foreground">Bild hochladen · JPG, PNG, WebP</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="text-xs gap-1" onClick={saveHeader}>
                <Save className="h-3 w-3" /> Speichern
              </Button>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setEditingHeader(false)}>
                Abbrechen
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setOpen(!open)}>
            <p className="text-sm font-semibold text-foreground">{mod.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              {mod.description} · {sectionCount > 0 ? `${sectionCount} Sektionen · ` : ""}{totalCount} Lektionen
            </p>
          </div>
        )}

        {!editingHeader && (
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setEditingHeader(true)}>
              <Pencil className="h-3 w-3" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Modul löschen?</AlertDialogTitle>
                  <AlertDialogDescription>
                    „{mod.title}" und alle {totalCount} Lektionen werden gelöscht.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Löschen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <button onClick={() => setOpen(!open)} className="p-1">
              {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </button>
          </div>
        )}
      </div>

      {/* Content: Sections + Lessons */}
      {open && (
        <div>
          {/* Unsectioned lessons first */}
          {unsectionedLessons.length > 0 && (
            <div className="divide-y divide-border/40">
              {unsectionedLessons.map((lesson) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  onUpdate={(l) => updateLesson(lesson.id, l)}
                  onDelete={() => deleteLesson(lesson.id)}
                />
              ))}
            </div>
          )}

          {/* Sections with their lessons */}
          {sections.map((section) => {
            const sectionLessons = mod.lessons.filter(l => l.sectionId === section.id);
            const isSectionOpen = openSections.includes(section.id);
            return (
              <div key={section.id}>
                <SectionRow
                  section={section}
                  lessonsCount={sectionLessons.length}
                  isOpen={isSectionOpen}
                  onToggle={() => toggleSection(section.id)}
                  onUpdate={(s) => updateSection(section.id, s)}
                  onDelete={() => deleteSection(section.id)}
                />
                {isSectionOpen && (
                  <div className="divide-y divide-border/40 ml-4 border-l-2 border-primary/10">
                    {sectionLessons.map((lesson) => (
                      <LessonRow
                        key={lesson.id}
                        lesson={lesson}
                        onUpdate={(l) => updateLesson(lesson.id, l)}
                        onDelete={() => deleteLesson(lesson.id)}
                      />
                    ))}
                    <div className="p-2 pl-4">
                      <Button variant="ghost" size="sm" className="w-full text-xs gap-1 text-muted-foreground hover:text-foreground" onClick={() => addLesson(section.id)}>
                        <Plus className="h-3 w-3" /> Lektion in „{section.title}" hinzufügen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Action buttons */}
          <div className="p-3 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs gap-1" onClick={() => addLesson()}>
              <Plus className="h-3 w-3" /> Lektion hinzufügen
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs gap-1" onClick={addSectionToModule}>
              <Plus className="h-3 w-3" /> Sektion hinzufügen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Course Settings Dialog ─── */
function CourseSettingsDialog({
  course,
  open,
  onClose,
  onSave,
}: {
  course: Course;
  open: boolean;
  onClose: () => void;
  onSave: (c: Course) => void;
}) {
  const [draft, setDraft] = useState(course);

  const save = () => {
    onSave(draft);
    onClose();
    toast.success("Kurs-Einstellungen gespeichert");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Kurs-Einstellungen</DialogTitle>
          <DialogDescription>Bearbeite die allgemeinen Kurs-Informationen</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Kurstitel</Label>
            <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Beschreibung</Label>
            <Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Kategorie</Label>
              <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v })}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pflicht">Pflicht</SelectItem>
                  <SelectItem value="Vertrieb">Vertrieb</SelectItem>
                  <SelectItem value="Führung">Führung</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Technik">Technik</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Gesamtdauer</Label>
              <Input value={draft.totalDuration} onChange={(e) => setDraft({ ...draft, totalDuration: e.target.value })} placeholder="z.B. 2h 30min" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Thumbnail / Emoji</Label>
            <Input value={draft.thumbnail} onChange={(e) => setDraft({ ...draft, thumbnail: e.target.value })} />
          </div>
          {/* Course image */}
          <div className="space-y-1.5">
            <Label className="text-xs">Kursbild (optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Image className="h-6 w-6 text-muted-foreground mx-auto mb-1.5" />
              <p className="text-xs text-muted-foreground">Bild hochladen · JPG, PNG, WebP · Max. 5 MB</p>
              <Button variant="outline" size="sm" className="mt-2 text-xs gap-1">
                <Upload className="h-3 w-3" /> Datei auswählen
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={draft.mandatory || false}
                onCheckedChange={(v) => setDraft({ ...draft, mandatory: v })}
                id="mandatory"
              />
              <Label htmlFor="mandatory" className="text-xs">Pflichtkurs</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={draft.hasQuiz || false}
                onCheckedChange={(v) => setDraft({ ...draft, hasQuiz: v })}
                id="hasQuiz"
              />
              <Label htmlFor="hasQuiz" className="text-xs">Quiz</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={draft.hasCertificate || false}
                onCheckedChange={(v) => setDraft({ ...draft, hasCertificate: v })}
                id="hasCert"
              />
              <Label htmlFor="hasCert" className="text-xs">Zertifikat</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Abbrechen</Button>
          <Button size="sm" className="gap-1 gradient-brand border-0 text-white" onClick={save}>
            <Save className="h-3 w-3" /> Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main Course Editor ─── */
export default function CourseEditor({
  course,
  onBack,
  onSaveCourse,
}: {
  course: Course;
  onBack: () => void;
  onSaveCourse: (c: Course) => void;
}) {
  const [editedCourse, setEditedCourse] = useState<Course>({ ...course, modules: course.modules.map((m) => ({ ...m, lessons: [...m.lessons], sections: [...(m.sections || [])] })) });
  const [settingsOpen, setSettingsOpen] = useState(false);

  const updateModule = (modId: string, mod: Module) => {
    setEditedCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => (m.id === modId ? mod : m)),
    }));
  };

  const deleteModule = (modId: string) => {
    setEditedCourse((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== modId),
    }));
    toast.success("Modul gelöscht");
  };

  const addModule = () => {
    setEditedCourse((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule(prev.modules.length + 1)],
    }));
    toast.success("Modul hinzugefügt");
  };

  const handleSaveAll = () => {
    onSaveCourse(editedCourse);
    toast.success("Kurs erfolgreich gespeichert");
  };

  const totalLessons = editedCourse.modules.reduce((s, m) => s + m.lessons.length, 0);

  return (
    <div className="space-y-5">
      {/* Top nav */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground gap-1 -ml-2">
          <ChevronLeft className="h-4 w-4" /> Zurück
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => setSettingsOpen(true)}>
            <Settings2 className="h-3.5 w-3.5" /> Kurs-Einstellungen
          </Button>
          <Button size="sm" className="text-xs gap-1 gradient-brand border-0 text-white" onClick={handleSaveAll}>
            <Save className="h-3.5 w-3.5" /> Alles speichern
          </Button>
        </div>
      </div>

      {/* Course header */}
      <div className="bg-card rounded-xl p-5 border border-border shadow-crm-sm">
        <div className="flex items-start gap-4">
          <div className="text-5xl">{editedCourse.thumbnail}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant="secondary" className="text-[10px]">{editedCourse.category}</Badge>
              {editedCourse.mandatory && <Badge variant="destructive" className="text-[10px]">Pflicht</Badge>}
              {editedCourse.hasCertificate && <Badge variant="outline" className="text-[10px]">Zertifikat</Badge>}
              <Badge variant="outline" className="text-[10px] gap-1">
                <Pencil className="h-2.5 w-2.5" /> Bearbeitungsmodus
              </Badge>
            </div>
            <h2 className="text-lg font-display font-bold text-foreground">{editedCourse.title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{editedCourse.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>{editedCourse.modules.length} Module</span>
              <span>{totalLessons} Lektionen</span>
              <span>{editedCourse.totalDuration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Module & Lektionen</h3>
          <Button variant="outline" size="sm" className="text-xs gap-1" onClick={addModule}>
            <Plus className="h-3 w-3" /> Modul hinzufügen
          </Button>
        </div>

        {editedCourse.modules.map((mod, i) => (
          <ModuleCard
            key={mod.id}
            mod={mod}
            index={i}
            onUpdate={(m) => updateModule(mod.id, m)}
            onDelete={() => deleteModule(mod.id)}
          />
        ))}

        {editedCourse.modules.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
            <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Noch keine Module vorhanden</p>
            <Button variant="outline" size="sm" className="mt-3 text-xs gap-1" onClick={addModule}>
              <Plus className="h-3 w-3" /> Erstes Modul erstellen
            </Button>
          </div>
        )}
      </div>

      {/* Bottom save bar */}
      <div className="sticky bottom-4 bg-card/95 backdrop-blur-sm rounded-xl p-4 border border-border shadow-crm-md flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {editedCourse.modules.length} Module · {totalLessons} Lektionen
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs" onClick={onBack}>
            Abbrechen
          </Button>
          <Button size="sm" className="text-xs gap-1 gradient-brand border-0 text-white" onClick={handleSaveAll}>
            <Save className="h-3.5 w-3.5" /> Kurs speichern
          </Button>
        </div>
      </div>

      <CourseSettingsDialog
        course={editedCourse}
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={(c) => setEditedCourse(c)}
      />
    </div>
  );
}
