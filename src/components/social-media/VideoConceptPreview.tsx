import { Copy, Film, Music, Image as ImageIcon, Lightbulb, Zap } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { VideoConceptResult } from "@/data/social-media-data";

interface Props {
  concept: VideoConceptResult;
  onCopy: (text: string, label: string) => void;
}

export default function VideoConceptPreview({ concept, onCopy }: Props) {
  return (
    <div className="space-y-5">
      {/* Storyboard */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Film className="h-4 w-4 text-primary" /> Storyboard
        </Label>
        <div className="space-y-2">
          {concept.storyboard.map((scene) => (
            <div key={scene.sceneNumber} className="bg-card border border-border rounded-xl p-3 space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px]">
                  Szene {scene.sceneNumber} · {scene.duration}
                </Badge>
                <span className="text-[10px] text-muted-foreground italic">{scene.action}</span>
              </div>
              <p className="text-xs text-foreground font-medium">🎬 {scene.visual}</p>
              <p className="text-xs text-muted-foreground">💬 „{scene.text}"</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => onCopy(concept.storyboard.map(s => `[Szene ${s.sceneNumber} | ${s.duration}]\n🎬 ${s.visual}\n💬 "${s.text}"\n→ ${s.action}`).join("\n\n"), "Storyboard")}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <Copy className="h-3 w-3" /> Storyboard kopieren
        </button>
      </div>

      {/* Hook Variants */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> Hook-Varianten (A/B Testing)
        </Label>
        <div className="space-y-2">
          {concept.hooks.map((hook, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-3 space-y-1">
              <div className="flex items-center justify-between">
                <Badge className="text-[10px] bg-primary/10 text-primary border-0">
                  {hook.style}
                </Badge>
                <button
                  onClick={() => onCopy(hook.hook, "Hook")}
                  className="text-[10px] text-primary hover:underline flex items-center gap-1"
                >
                  <Copy className="h-2.5 w-2.5" />
                </button>
              </div>
              <p className="text-sm text-foreground font-medium">„{hook.hook}"</p>
              <p className="text-[10px] text-muted-foreground">💡 {hook.whyItWorks}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Music */}
      <div className="bg-card border border-border rounded-xl p-3">
        <Label className="text-xs font-semibold text-foreground flex items-center gap-2 mb-1">
          <Music className="h-3.5 w-3.5 text-primary" /> Audio-Empfehlung
        </Label>
        <p className="text-xs text-muted-foreground">{concept.musicSuggestion}</p>
      </div>

      {/* Caption */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-foreground">Caption</Label>
          <button onClick={() => onCopy(`${concept.caption}\n\n${concept.hashtags}`, "Caption")} className="flex items-center gap-1 text-xs text-primary hover:underline">
            <Copy className="h-3 w-3" /> Kopieren
          </button>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-sm text-foreground">
          {concept.caption}
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-xs text-primary">
          {concept.hashtags}
        </div>
      </div>

      {/* Thumbnail */}
      <div className="bg-card border border-border rounded-xl p-3">
        <Label className="text-xs font-semibold text-foreground flex items-center gap-2 mb-1">
          <ImageIcon className="h-3.5 w-3.5 text-primary" /> Thumbnail-Prompt
        </Label>
        <p className="text-xs text-muted-foreground italic">„{concept.thumbnailPrompt}"</p>
      </div>

      {/* Posting Tip */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold text-foreground flex items-center gap-2">
          <Lightbulb className="h-3.5 w-3.5" /> Posting-Strategie
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">{concept.postingTip}</p>
      </div>
    </div>
  );
}
