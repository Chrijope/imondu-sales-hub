import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Link as LinkIcon, Youtube, X, Plus } from "lucide-react";
import { toast } from "sonner";

export interface NewsItem {
  id: string;
  title: string;
  emoji: string;
  date: string;
  content: string;
  pinned: boolean;
  category: "update" | "event" | "info" | "provision";
  imageUrl?: string;
  links?: { label: string; url: string }[];
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (item: NewsItem) => void;
  editItem?: NewsItem | null;
}

const CATEGORY_OPTIONS: { value: NewsItem["category"]; label: string; color: string }[] = [
  { value: "update", label: "Update", color: "bg-primary text-primary-foreground" },
  { value: "event", label: "Event", color: "bg-warning text-warning-foreground" },
  { value: "info", label: "Info", color: "bg-info text-info-foreground" },
  { value: "provision", label: "Provision", color: "bg-success text-success-foreground" },
];

const EMOJI_OPTIONS = ["📌", "🚀", "🎓", "💰", "📋", "📊", "🔥", "📢", "🎉", "⚡"];

export default function NewsCreateDialog({ open, onOpenChange, onSave, editItem }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(editItem?.title || "");
  const [emoji, setEmoji] = useState(editItem?.emoji || "📢");
  const [category, setCategory] = useState<NewsItem["category"]>(editItem?.category || "update");
  const [content, setContent] = useState(editItem?.content || "");
  const [pinned, setPinned] = useState(editItem?.pinned || false);
  const [imageUrl, setImageUrl] = useState(editItem?.imageUrl || "");
  const [imagePreview, setImagePreview] = useState(editItem?.imageUrl || "");
  const [links, setLinks] = useState<{ label: string; url: string }[]>(editItem?.links || []);
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Bild darf maximal 5 MB groß sein");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageUrl(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const addLink = () => {
    if (!newLinkUrl.trim()) return;
    const label = newLinkLabel.trim() || newLinkUrl.trim();
    setLinks([...links, { label, url: newLinkUrl.trim() }]);
    setNewLinkLabel("");
    setNewLinkUrl("");
  };

  const removeLink = (idx: number) => setLinks(links.filter((_, i) => i !== idx));

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Titel und Inhalt sind Pflichtfelder");
      return;
    }
    const now = new Date();
    const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    const dateStr = `Veröffentlicht am ${days[now.getDay()]}, ${now.getDate()}. ${months[now.getMonth()]} ${now.getFullYear()}`;

    onSave({
      id: editItem?.id || crypto.randomUUID(),
      title: title.trim(),
      emoji,
      date: editItem?.date || dateStr,
      content: content.trim(),
      pinned,
      category,
      imageUrl: imageUrl || undefined,
      links: links.length > 0 ? links : undefined,
    });

    // reset
    setTitle(""); setContent(""); setEmoji("📢"); setCategory("update");
    setPinned(false); setImageUrl(""); setImagePreview(""); setLinks([]);
    onOpenChange(false);
    toast.success(editItem ? "News aktualisiert" : "News veröffentlicht");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{editItem ? "News bearbeiten" : "Neue News erstellen"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Emoji + Title */}
          <div className="flex gap-3">
            <div className="shrink-0">
              <Label className="text-xs text-muted-foreground mb-1 block">Emoji</Label>
              <Select value={emoji} onValueChange={setEmoji}>
                <SelectTrigger className="w-16 h-10 text-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EMOJI_OPTIONS.map((e) => (
                    <SelectItem key={e} value={e} className="text-lg">{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1 block">Titel *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="News-Titel…" />
            </div>
          </div>

          {/* Category + Pinned */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1 block">Kategorie</Label>
              <div className="flex gap-2 flex-wrap">
                {CATEGORY_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      category === c.value
                        ? `${c.color} ring-2 ring-ring ring-offset-1`
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer shrink-0 pb-0.5">
              <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="rounded" />
              <span className="text-xs font-medium text-muted-foreground">📌 Anpinnen</span>
            </label>
          </div>

          {/* Content */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Inhalt * <span className="text-muted-foreground/60">(Markdown **fett**, Links im Text möglich)</span>
            </Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="News-Inhalt hier eingeben…&#10;&#10;Nutze **fett** für Hervorhebungen.&#10;YouTube-Links werden automatisch eingebettet."
              className="min-h-[180px] text-sm"
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Bild (optional, 16:9 empfohlen)</Label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-border aspect-video max-w-md">
                <img src={imagePreview} alt="Vorschau" className="w-full h-full object-cover" />
                <button
                  onClick={() => { setImageUrl(""); setImagePreview(""); }}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-2">
                <ImagePlus className="h-4 w-4" /> Bild hochladen
              </Button>
            )}
          </div>

          {/* Links */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Links & YouTube-Videos</Label>
            {links.map((l, i) => (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                {l.url.includes("youtu") ? (
                  <Youtube className="h-4 w-4 text-destructive shrink-0" />
                ) : (
                  <LinkIcon className="h-4 w-4 text-primary shrink-0" />
                )}
                <span className="text-sm text-foreground truncate flex-1">{l.label}</span>
                <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">{l.url}</span>
                <button onClick={() => removeLink(i)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <div className="flex gap-2 mt-1">
              <Input
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                placeholder="Bezeichnung (optional)"
                className="h-8 text-sm flex-1"
              />
              <Input
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://… oder YouTube-Link"
                className="h-8 text-sm flex-1"
                onKeyDown={(e) => e.key === "Enter" && addLink()}
              />
              <Button variant="outline" size="sm" onClick={addLink} className="h-8 px-2">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
            <Button onClick={handleSave} className="gradient-brand text-primary-foreground gap-1">
              {editItem ? "Aktualisieren" : "Veröffentlichen"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
