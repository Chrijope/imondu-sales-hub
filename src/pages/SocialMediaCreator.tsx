import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Instagram,
  Linkedin,
  Copy,
  Download,
  RefreshCw,
  Image as ImageIcon,
  Type,
  Hash,
  Target,
  Palette,
} from "lucide-react";

// ── Imondu CI Colors ──
const CI_COLORS = {
  primary: "hsl(250, 60%, 52%)",
  accent: "hsl(340, 75%, 55%)",
  gradient: "linear-gradient(135deg, hsl(340, 75%, 55%), hsl(280, 60%, 55%), hsl(250, 60%, 52%))",
};

type Platform = "linkedin" | "instagram_feed" | "instagram_story";
type ContentType = "informativ" | "testimonial" | "vorher_nachher" | "tipp" | "behind_scenes" | "cta";
type Tonality = "professionell" | "locker" | "inspirierend" | "edukativ";

const PLATFORM_OPTIONS = [
  { value: "linkedin", label: "LinkedIn Beitrag", icon: Linkedin, desc: "1200×627px, max 3000 Zeichen" },
  { value: "instagram_feed", label: "Instagram Feed", icon: Instagram, desc: "1080×1080px, max 2200 Zeichen" },
  { value: "instagram_story", label: "Instagram Story", icon: Instagram, desc: "1080×1920px, kurze Caption" },
];

const CONTENT_TYPES = [
  { value: "informativ", label: "Informativ", desc: "Fakten & Wissen teilen" },
  { value: "testimonial", label: "Kundenstimme", desc: "Erfolgsgeschichte zeigen" },
  { value: "vorher_nachher", label: "Vorher/Nachher", desc: "Sanierung visualisieren" },
  { value: "tipp", label: "Expertentipp", desc: "Mehrwert für Eigentümer" },
  { value: "behind_scenes", label: "Behind the Scenes", desc: "Einblick in den Alltag" },
  { value: "cta", label: "Call-to-Action", desc: "Zur Kontaktaufnahme bewegen" },
];

const TONALITIES: { value: Tonality; label: string }[] = [
  { value: "professionell", label: "Professionell" },
  { value: "locker", label: "Locker & Nahbar" },
  { value: "inspirierend", label: "Inspirierend" },
  { value: "edukativ", label: "Edukativ" },
];

// ── Mock KI-generated content ──
function generateMockContent(platform: Platform, contentType: ContentType, tonality: Tonality, topic: string): { text: string; hashtags: string; imagePrompt: string } {
  const topicText = topic || "Immobilien-Sanierung";

  const texts: Record<ContentType, string> = {
    informativ: `💡 Wusstest du das?\n\n${topicText} – ein Thema, das viele Eigentümer unterschätzen.\n\nDie Realität:\n✅ Bis zu 30% Wertsteigerung möglich\n✅ Energiekosten um 40-60% senken\n✅ Fördermittel bis zu 45% der Kosten\n\nDer richtige Zeitpunkt ist JETZT. Die Fördertöpfe sind gut gefüllt, aber nicht ewig.\n\nAls zertifizierter IMONDU-Partner begleite ich dich von der ersten Idee bis zur Schlüsselübergabe.\n\n🔗 Link in Bio für eine kostenlose Erstberatung`,
    testimonial: `⭐️ „Die beste Entscheidung, die wir getroffen haben."\n\nFamilie Müller aus München hatte ein Haus aus den 70ern – ${topicText} war lange aufgeschoben.\n\nNach 6 Monaten:\n📈 Energieklasse von G auf B\n💰 42% weniger Heizkosten\n🏠 Wohnwert um 180.000€ gestiegen\n\nDas Geheimnis? Ein durchdachter Sanierungsplan mit klaren Prioritäten.\n\nDu hast auch eine Immobilie mit Potenzial? Schreib mir eine Nachricht – ich zeige dir, was möglich ist.\n\n#IMONDU #Sanierung #Wertsteigerung`,
    vorher_nachher: `🏠 VORHER → NACHHER\n\n${topicText} – was in nur 4 Monaten möglich ist:\n\n❌ Vorher: Veraltete Fassade, einfach verglast, Energieklasse F\n✅ Nachher: Moderne Dämmung, 3-fach Verglasung, Energieklasse A\n\nInvestition: 85.000€\nWertsteigerung: 140.000€\nFörderung: 28.000€\n\n➡️ Netto-Rendite: 83.000€ Wertzuwachs\n\nJedes Haus hat Potenzial. Lass uns deins entdecken.\n\n📩 DM für kostenlose Potenzialanalyse`,
    tipp: `🎯 3 Expertentipps für ${topicText}:\n\n1️⃣ Starte mit einer Energieberatung\nKostet ca. 300-500€, spart dir aber tausende an Fehlentscheidungen.\n\n2️⃣ Nutze die KfW-Förderung\nBis zu 150.000€ Kredit zu 0,01% – aber nur mit iSFP!\n\n3️⃣ Priorisiere richtig\nDach → Fassade → Fenster → Heizung. Diese Reihenfolge spart 15-20% Kosten.\n\n💡 Bonus: Als IMONDU Premium-Partner erstelle ich dir einen individuellen Sanierungsfahrplan – kostenlos.\n\nSpeichere diesen Beitrag für später! 📌`,
    behind_scenes: `🔧 Ein Blick hinter die Kulissen\n\nHeute auf der Baustelle in München – ${topicText} in vollem Gange!\n\nWas viele nicht wissen: Eine gute Sanierung braucht Planung. Wochenlange Vorbereitung steckt hinter jedem Projekt.\n\nMein Tag heute:\n⏰ 07:00 – Baustellenbegehung\n📋 09:00 – Koordination mit Gewerken\n🏗️ 11:00 – Qualitätskontrolle Dämmung\n☕ 14:00 – Beratungsgespräch Eigentümer\n📊 16:00 – Dokumentation & Förderanträge\n\nDas ist mein Alltag als Sanierungsexperte – und ich liebe es. 💪\n\n#BehindTheScenes #Sanierung #IMONDU`,
    cta: `🚀 Deine Immobilie hat mehr Potenzial als du denkst!\n\n${topicText} ist der Schlüssel zu:\n\n💰 Höherer Immobilienwert\n🌱 Niedrigere Energiekosten\n🏠 Bessere Wohnqualität\n📈 Sichere Altersvorsorge\n\nUnd das Beste: Mit den aktuellen Förderprogrammen übernimmt der Staat bis zu 45% der Kosten!\n\n⏰ Aber Achtung: Die Fördertöpfe leeren sich.\n\n👉 Schreib mir JETZT eine Nachricht und sichere dir deine kostenlose Potenzialanalyse.\n\nKein Risiko. Keine Kosten. Nur Klarheit. ✅\n\n#Immobilien #Sanierung #IMONDU #Förderung`,
  };

  const platformHashtags: Record<Platform, string> = {
    linkedin: "#Immobilien #Sanierung #IMONDU #Wertsteigerung #Energieeffizienz #Nachhaltigkeit #Investment",
    instagram_feed: "#immobilien #sanierung #imondu #wertsteigerung #energieeffizienz #renovation #hausbau #eigenheim #immobilienentwicklung #vorherNachher",
    instagram_story: "#imondu #sanierung #immobilien",
  };

  const imagePrompts: Record<ContentType, string> = {
    informativ: `Professionelle Infografik zum Thema "${topicText}", modernes Design mit Imondu-Branding (lila/pink Gradient), saubere Typografie, Immobilien-Icons, weißer Hintergrund`,
    testimonial: `Zufriedene Familie vor ihrem sanierten Haus, warmes Licht, professionelles Foto, Imondu-Branding dezent im Bild, lila Akzente`,
    vorher_nachher: `Split-Screen Vorher-Nachher eines sanierten Hauses, links alt und grau, rechts modern und energieeffizient, Imondu-Branding, professionell`,
    tipp: `Modernes Tipp-Karten-Design mit 3 nummerierten Tipps, Imondu-Branding (lila-pink Gradient), clean und professionell, Immobilien-Icons`,
    behind_scenes: `Baustellenfoto mit Sanierungsarbeiten, Arbeiter bei Fassadendämmung, professionelle Qualität, warmes Licht, authentisch`,
    cta: `Auffälliges Call-to-Action Bild, "Kostenlose Potenzialanalyse" Text, Imondu-Branding mit lila-pink Gradient, Haus-Silhouette, modern und einladend`,
  };

  return {
    text: texts[contentType],
    hashtags: platformHashtags[platform],
    imagePrompt: imagePrompts[contentType],
  };
}

// ── Mock generated image placeholder ──
function MockGeneratedImage({ platform, contentType }: { platform: Platform; contentType: ContentType }) {
  const dims = platform === "instagram_story" ? "aspect-[9/16]" : platform === "instagram_feed" ? "aspect-square" : "aspect-video";

  return (
    <div className={`${dims} w-full rounded-xl overflow-hidden relative`} style={{ background: CI_COLORS.gradient }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="text-4xl mb-3">🏠</div>
        <p className="text-lg font-bold font-display">IMONDU</p>
        <p className="text-xs opacity-80 mt-1 max-w-[200px]">
          {contentType === "vorher_nachher" ? "Vorher → Nachher" :
           contentType === "testimonial" ? "Kundenstimme" :
           contentType === "tipp" ? "Expertentipp" :
           contentType === "cta" ? "Jetzt beraten lassen" :
           contentType === "behind_scenes" ? "Behind the Scenes" :
           "Wissen für Eigentümer"}
        </p>
        <div className="absolute bottom-4 text-[10px] opacity-60">KI-generierte Vorschau</div>
      </div>
    </div>
  );
}

export default function SocialMediaCreator() {
  const { toast } = useToast();
  const [platform, setPlatform] = useState<Platform>("linkedin");
  const [contentType, setContentType] = useState<ContentType>("informativ");
  const [tonality, setTonality] = useState<Tonality>("professionell");
  const [topic, setTopic] = useState("");
  const [customDetails, setCustomDetails] = useState("");
  const [withImage, setWithImage] = useState(true);
  const [generated, setGenerated] = useState<{ text: string; hashtags: string; imagePrompt: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      const result = generateMockContent(platform, contentType, tonality, topic);
      setGenerated(result);
      setIsGenerating(false);
      toast({ title: "Content generiert ✓", description: "Dein Social-Media-Beitrag ist fertig!" });
    }, 1500);
  };

  const handleRegenerate = () => {
    setGenerated(null);
    handleGenerate();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} kopiert ✓`, description: "In die Zwischenablage kopiert." });
  };

  const selectedPlatform = PLATFORM_OPTIONS.find(p => p.value === platform)!;

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl gradient-brand flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Social Media Creator</h1>
            <p className="text-sm text-muted-foreground">KI-gestützter Content für LinkedIn & Instagram im Imondu CI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ══════════ LEFT: Input Form ══════════ */}
          <div className="space-y-6">
            {/* Platform */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Plattform wählen
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PLATFORM_OPTIONS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPlatform(p.value as Platform)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      platform === p.value
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <p.icon className={`h-5 w-5 ${platform === p.value ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-xs font-medium text-foreground">{p.label}</span>
                    <span className="text-[10px] text-muted-foreground">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Type */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Type className="h-4 w-4 text-primary" /> Beitragsart
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CONTENT_TYPES.map((ct) => (
                  <button
                    key={ct.value}
                    onClick={() => setContentType(ct.value as ContentType)}
                    className={`text-left px-3 py-2.5 rounded-lg border transition-all ${
                      contentType === ct.value
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/20"
                    }`}
                  >
                    <span className="text-xs font-medium text-foreground block">{ct.label}</span>
                    <span className="text-[10px] text-muted-foreground">{ct.desc}</span>
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
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Thema / Anlass</Label>
              <Input
                placeholder="z.B. Dachsanierung, Energieberatung, Fördermittel 2026…"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            {/* Custom Details */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Zusätzliche Details (optional)</Label>
              <Textarea
                placeholder="z.B. Ich habe letzte Woche ein MFH in München saniert, 42% Energieeinsparung erreicht. Der Kunde war Familie Huber…"
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Image toggle */}
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
                className={`w-11 h-6 rounded-full transition-all relative ${
                  withImage ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  withImage ? "left-[22px]" : "left-0.5"
                }`} />
              </button>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full gradient-brand border-0 text-primary-foreground h-12 text-sm font-semibold gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> KI generiert…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Content generieren
                </>
              )}
            </Button>
          </div>

          {/* ══════════ RIGHT: Preview ══════════ */}
          <div className="space-y-6">
            {!generated ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-xl border-2 border-dashed border-border bg-muted/20 text-center p-8">
                <Sparkles className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-sm font-medium text-muted-foreground">Dein generierter Content</p>
                <p className="text-xs text-muted-foreground/60 mt-1 max-w-xs">
                  Fülle die Optionen links aus und klicke auf „Content generieren" um loszulegen.
                </p>
              </div>
            ) : (
              <>
                {/* Platform label */}
                <div className="flex items-center gap-2">
                  <selectedPlatform.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{selectedPlatform.label}</span>
                  <Badge variant="secondary" className="text-[10px]">Vorschau</Badge>
                </div>

                {/* Generated Image */}
                {withImage && (
                  <div className="space-y-2">
                    <MockGeneratedImage platform={platform} contentType={contentType} />
                    <p className="text-[10px] text-muted-foreground italic">
                      Bild-Prompt: „{generated.imagePrompt}"
                    </p>
                  </div>
                )}

                {/* Generated Text */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Type className="h-4 w-4" /> Beitragstext
                    </Label>
                    <button
                      onClick={() => copyToClipboard(generated.text, "Text")}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Copy className="h-3 w-3" /> Kopieren
                    </button>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 text-sm text-foreground whitespace-pre-line leading-relaxed max-h-[400px] overflow-y-auto">
                    {generated.text}
                  </div>
                </div>

                {/* Hashtags */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Hash className="h-4 w-4" /> Hashtags
                    </Label>
                    <button
                      onClick={() => copyToClipboard(generated.hashtags, "Hashtags")}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Copy className="h-3 w-3" /> Kopieren
                    </button>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-3 text-xs text-primary leading-relaxed">
                    {generated.hashtags}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleRegenerate} className="flex-1 gap-2">
                    <RefreshCw className="h-4 w-4" /> Neu generieren
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(`${generated.text}\n\n${generated.hashtags}`, "Beitrag")}
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
                    <li>• Teile den Beitrag in deiner Story für extra Reichweite</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
