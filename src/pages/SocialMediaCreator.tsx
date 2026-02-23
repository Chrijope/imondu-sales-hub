import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  Copy,
  RefreshCw,
  Image as ImageIcon,
  Type,
  Hash,
  Palette,
  Flame,
  Film,
} from "lucide-react";
import {
  Platform,
  ContentType,
  Tonality,
  ViralGoal,
  CONTENT_TYPES,
  TONALITIES,
  VIRAL_GOALS,
  CI_COLORS,
  TextContentResult,
  VideoConceptResult,
  generateMockTextContent,
  generateMockVideoConcept,
} from "@/data/social-media-data";
import PlatformSelector from "@/components/social-media/PlatformSelector";
import VideoConceptPreview from "@/components/social-media/VideoConceptPreview";

const isVideoPlatform = (p: Platform) => p === "tiktok" || p === "instagram_story";

function MockGeneratedImage({ platform, contentType }: { platform: Platform; contentType: ContentType }) {
  const dims = platform === "instagram_story" || platform === "tiktok" ? "aspect-[9/16]" : platform === "instagram_feed" ? "aspect-square" : "aspect-video";
  return (
    <div className={`${dims} w-full max-h-[300px] rounded-xl overflow-hidden relative`} style={{ background: CI_COLORS.gradient }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="text-4xl mb-3">🏠</div>
        <p className="text-lg font-bold font-display">IMONDU</p>
        <p className="text-xs opacity-80 mt-1">KI-generierte Vorschau</p>
      </div>
    </div>
  );
}

export default function SocialMediaCreator() {
  const { toast } = useToast();
  const [platform, setPlatform] = useState<Platform>("linkedin");
  const [contentType, setContentType] = useState<ContentType>("informativ");
  const [tonality, setTonality] = useState<Tonality>("professionell");
  const [viralGoal, setViralGoal] = useState<ViralGoal>("none");
  const [topic, setTopic] = useState("");
  const [customDetails, setCustomDetails] = useState("");
  const [withImage, setWithImage] = useState(true);
  const [textResult, setTextResult] = useState<TextContentResult | null>(null);
  const [videoResult, setVideoResult] = useState<VideoConceptResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const isVideo = isVideoPlatform(platform);
  const filteredContentTypes = CONTENT_TYPES.filter(ct => isVideo ? true : !ct.videoOnly);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (isVideo) {
        setVideoResult(generateMockVideoConcept(contentType, tonality, topic, viralGoal));
        setTextResult(null);
      } else {
        setTextResult(generateMockTextContent(platform, contentType, tonality, topic, viralGoal));
        setVideoResult(null);
      }
      setIsGenerating(false);
      toast({ title: "Content generiert ✓", description: isVideo ? "Dein Video-Konzept ist fertig!" : "Dein Social-Media-Beitrag ist fertig!" });
    }, 1500);
  };

  const handleRegenerate = () => {
    setTextResult(null);
    setVideoResult(null);
    handleGenerate();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} kopiert ✓` });
  };

  const hasResult = textResult || videoResult;

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
        <div className="max-w-7xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl gradient-brand flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Social Media Creator</h1>
              <p className="text-sm text-muted-foreground">KI-gestützter Content für LinkedIn, Instagram & TikTok</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ══════════ LEFT: Input Form ══════════ */}
            <div className="space-y-6">
              <PlatformSelector platform={platform} setPlatform={(p) => { setPlatform(p); setTextResult(null); setVideoResult(null); }} />

              {/* Video hint */}
              {isVideo && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-3">
                  <Film className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Video-Modus aktiv</p>
                    <p className="text-[10px] text-muted-foreground">Du erhältst ein vollständiges Storyboard, Hook-Varianten, Audio-Empfehlung und Posting-Strategie.</p>
                  </div>
                </div>
              )}

              {/* Content Type */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Type className="h-4 w-4 text-primary" /> Beitragsart
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filteredContentTypes.map((ct) => (
                    <button
                      key={ct.value}
                      onClick={() => setContentType(ct.value)}
                      className={`text-left px-3 py-2.5 rounded-lg border transition-all ${
                        contentType === ct.value ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/20"
                      }`}
                    >
                      <span className="text-xs font-medium text-foreground block">{ct.label}</span>
                      <span className="text-[10px] text-muted-foreground">{ct.desc}</span>
                      {ct.videoOnly && <Badge variant="secondary" className="text-[8px] mt-1">Video</Badge>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tonality */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" /> Tonalität
                </Label>
                <div className="flex flex-wrap gap-2">
                  {TONALITIES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTonality(t.value)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                        tonality === t.value
                          ? t.value === "emotional_triggernd"
                            ? "bg-destructive text-destructive-foreground border-destructive"
                            : "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {t.value === "emotional_triggernd" && "🔥 "}{t.label}
                    </button>
                  ))}
                </div>
                {tonality === "emotional_triggernd" && (
                  <p className="text-[10px] text-destructive">⚡ Nutzt FOMO, Verlust-Aversion und Dringlichkeit – starke Wirkung, sparsam einsetzen.</p>
                )}
              </div>

              {/* Viral Goal */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Flame className="h-4 w-4 text-primary" /> Viral-Ziel
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {VIRAL_GOALS.map((v) => (
                    <button
                      key={v.value}
                      onClick={() => setViralGoal(v.value)}
                      className={`text-left px-3 py-2.5 rounded-lg border transition-all ${
                        viralGoal === v.value ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/20"
                      }`}
                    >
                      <span className="text-xs font-medium text-foreground block">{v.label}</span>
                      <span className="text-[10px] text-muted-foreground">{v.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Thema / Anlass</Label>
                <Input placeholder="z.B. Dachsanierung, Energieberatung, Fördermittel 2026…" value={topic} onChange={(e) => setTopic(e.target.value)} />
              </div>

              {/* Custom Details */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  {isVideo ? "Video-Idee beschreiben (optional)" : "Zusätzliche Details (optional)"}
                </Label>
                <Textarea
                  placeholder={isVideo
                    ? "z.B. Ich möchte ein Vorher/Nachher-Video von unserem MFH-Projekt in München zeigen. Wir haben die Fassade gedämmt und neue Fenster eingebaut…"
                    : "z.B. Ich habe letzte Woche ein MFH in München saniert, 42% Energieeinsparung erreicht…"
                  }
                  value={customDetails}
                  onChange={(e) => setCustomDetails(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Image toggle (text mode only) */}
              {!isVideo && (
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Bild generieren</p>
                      <p className="text-[10px] text-muted-foreground">KI erstellt ein passendes Bild im Imondu CI</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setWithImage(!withImage)}
                    className={`w-11 h-6 rounded-full transition-all relative ${withImage ? "bg-primary" : "bg-muted"}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${withImage ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full gradient-brand border-0 text-primary-foreground h-12 text-sm font-semibold gap-2"
              >
                {isGenerating ? (
                  <><RefreshCw className="h-4 w-4 animate-spin" /> KI generiert…</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> {isVideo ? "Video-Konzept generieren" : "Content generieren"}</>
                )}
              </Button>
            </div>

            {/* ══════════ RIGHT: Preview ══════════ */}
            <div className="space-y-6">
              {!hasResult ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-xl border-2 border-dashed border-border bg-muted/20 text-center p-8">
                  <Sparkles className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-sm font-medium text-muted-foreground">
                    {isVideo ? "Dein Video-Konzept" : "Dein generierter Content"}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1 max-w-xs">
                    Fülle die Optionen links aus und klicke auf „{isVideo ? "Video-Konzept" : "Content"} generieren".
                  </p>
                </div>
              ) : videoResult ? (
                <>
                  <div className="flex items-center gap-2">
                    <Film className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Video-Konzept</span>
                    <Badge variant="secondary" className="text-[10px]">Storyboard</Badge>
                  </div>
                  <VideoConceptPreview concept={videoResult} onCopy={copyToClipboard} />
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleRegenerate} className="flex-1 gap-2">
                      <RefreshCw className="h-4 w-4" /> Neu generieren
                    </Button>
                    <Button
                      onClick={() => {
                        const full = videoResult.storyboard.map(s => `[Szene ${s.sceneNumber} | ${s.duration}]\n🎬 ${s.visual}\n💬 "${s.text}"\n→ ${s.action}`).join("\n\n")
                          + "\n\n---\n\nHook-Varianten:\n" + videoResult.hooks.map((h, i) => `${i + 1}. [${h.style}] "${h.hook}"`).join("\n")
                          + "\n\n---\n\nCaption:\n" + videoResult.caption + "\n\n" + videoResult.hashtags
                          + "\n\n" + videoResult.musicSuggestion;
                        copyToClipboard(full, "Gesamtes Konzept");
                      }}
                      className="flex-1 gap-2 gradient-brand border-0 text-primary-foreground"
                    >
                      <Copy className="h-4 w-4" /> Alles kopieren
                    </Button>
                  </div>
                </>
              ) : textResult ? (
                <>
                  <div className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Beitrags-Vorschau</span>
                    <Badge variant="secondary" className="text-[10px]">Vorschau</Badge>
                  </div>

                  {withImage && <MockGeneratedImage platform={platform} contentType={contentType} />}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Type className="h-4 w-4" /> Beitragstext
                      </Label>
                      <button onClick={() => copyToClipboard(textResult.text, "Text")} className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Copy className="h-3 w-3" /> Kopieren
                      </button>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-4 text-sm text-foreground whitespace-pre-line leading-relaxed max-h-[400px] overflow-y-auto">
                      {textResult.text}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Hash className="h-4 w-4" /> Hashtags
                      </Label>
                      <button onClick={() => copyToClipboard(textResult.hashtags, "Hashtags")} className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Copy className="h-3 w-3" /> Kopieren
                      </button>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-3 text-xs text-primary leading-relaxed">
                      {textResult.hashtags}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleRegenerate} className="flex-1 gap-2">
                      <RefreshCw className="h-4 w-4" /> Neu generieren
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(`${textResult.text}\n\n${textResult.hashtags}`, "Beitrag")}
                      className="flex-1 gap-2 gradient-brand border-0 text-primary-foreground"
                    >
                      <Copy className="h-4 w-4" /> Alles kopieren
                    </Button>
                  </div>

                  {/* Tips */}
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                    <p className="text-xs font-semibold text-foreground">💡 Posting-Tipps:</p>
                    <ul className="text-[11px] text-muted-foreground space-y-1">
                      {platform === "linkedin" && (
                        <>
                          <li>• Beste Posting-Zeit: Di–Do, 8–10 Uhr oder 17–18 Uhr</li>
                          <li>• Ersten 3 Zeilen entscheiden – Hook muss sitzen!</li>
                          <li>• Vermeide mehr als 5 Hashtags auf LinkedIn</li>
                        </>
                      )}
                      {platform.startsWith("instagram") && (
                        <>
                          <li>• Beste Posting-Zeit: Mo–Fr, 11–13 Uhr oder 19–21 Uhr</li>
                          <li>• Nutze Karussell-Posts für 2-3x mehr Reichweite</li>
                          <li>• Erste 125 Zeichen werden in der Vorschau angezeigt</li>
                        </>
                      )}
                      <li>• Antworte auf Kommentare innerhalb der ersten Stunde</li>
                    </ul>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
