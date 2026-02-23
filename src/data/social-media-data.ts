import { Instagram, Linkedin } from "lucide-react";

// ── Types ──
export type Platform = "linkedin" | "instagram_feed" | "instagram_story" | "tiktok";
export type ContentType = "informativ" | "testimonial" | "vorher_nachher" | "tipp" | "behind_scenes" | "cta" | "viral_hook" | "storytelling";
export type Tonality = "professionell" | "locker" | "inspirierend" | "edukativ" | "emotional_triggernd";
export type ViralGoal = "none" | "reichweite" | "engagement" | "leads";

export const CI_COLORS = {
  primary: "hsl(250, 60%, 52%)",
  accent: "hsl(340, 75%, 55%)",
  gradient: "linear-gradient(135deg, hsl(340, 75%, 55%), hsl(280, 60%, 55%), hsl(250, 60%, 52%))",
};

export const PLATFORM_OPTIONS: { value: Platform; label: string; iconName: "linkedin" | "instagram" | "tiktok"; desc: string }[] = [
  { value: "linkedin", label: "LinkedIn Beitrag", iconName: "linkedin", desc: "1200×627px, max 3000 Zeichen" },
  { value: "instagram_feed", label: "Instagram Feed", iconName: "instagram", desc: "1080×1080px, max 2200 Zeichen" },
  { value: "instagram_story", label: "Instagram Story", iconName: "instagram", desc: "1080×1920px, kurze Caption" },
  { value: "tiktok", label: "TikTok / Reels", iconName: "tiktok", desc: "1080×1920px, max 60s, Hook in 3s" },
];

export const CONTENT_TYPES: { value: ContentType; label: string; desc: string; videoOnly?: boolean }[] = [
  { value: "informativ", label: "Informativ", desc: "Fakten & Wissen teilen" },
  { value: "testimonial", label: "Kundenstimme", desc: "Erfolgsgeschichte zeigen" },
  { value: "vorher_nachher", label: "Vorher/Nachher", desc: "Sanierung visualisieren" },
  { value: "tipp", label: "Expertentipp", desc: "Mehrwert für Eigentümer" },
  { value: "behind_scenes", label: "Behind the Scenes", desc: "Einblick in den Alltag" },
  { value: "cta", label: "Call-to-Action", desc: "Zur Kontaktaufnahme bewegen" },
  { value: "viral_hook", label: "Viral Hook", desc: "Aufmerksamkeit in 3 Sekunden", videoOnly: true },
  { value: "storytelling", label: "Storytelling", desc: "Emotionale Geschichte erzählen", videoOnly: true },
];

export const TONALITIES: { value: Tonality; label: string; desc: string }[] = [
  { value: "professionell", label: "Professionell", desc: "Seriös & kompetent" },
  { value: "locker", label: "Locker & Nahbar", desc: "Wie ein Gespräch" },
  { value: "inspirierend", label: "Inspirierend", desc: "Motivierend & visionär" },
  { value: "edukativ", label: "Edukativ", desc: "Lehrreich & strukturiert" },
  { value: "emotional_triggernd", label: "Emotional Triggernd", desc: "FOMO, Dringlichkeit, Empathie" },
];

export const VIRAL_GOALS: { value: ViralGoal; label: string; desc: string }[] = [
  { value: "none", label: "Kein Viral-Ziel", desc: "Standard-Posting" },
  { value: "reichweite", label: "🚀 Max. Reichweite", desc: "Shares & Saves optimieren" },
  { value: "engagement", label: "💬 Max. Engagement", desc: "Kommentare & Interaktion" },
  { value: "leads", label: "🎯 Lead-Generierung", desc: "DMs & Kontaktanfragen" },
];

// ── Storyboard Scene ──
export interface StoryboardScene {
  sceneNumber: number;
  duration: string;
  visual: string;
  text: string;
  action: string;
}

export interface HookVariant {
  style: string;
  hook: string;
  whyItWorks: string;
}

export interface VideoConceptResult {
  storyboard: StoryboardScene[];
  hooks: HookVariant[];
  caption: string;
  hashtags: string;
  musicSuggestion: string;
  thumbnailPrompt: string;
  postingTip: string;
}

export interface TextContentResult {
  text: string;
  hashtags: string;
  imagePrompt: string;
}

// ── Mock text content ──
export function generateMockTextContent(platform: Platform, contentType: ContentType, tonality: Tonality, topic: string, viralGoal: ViralGoal): TextContentResult {
  const topicText = topic || "Immobilien-Sanierung";

  const viralPrefix = viralGoal === "reichweite" ? "⚡ STOP SCROLLING!\n\n" :
                      viralGoal === "engagement" ? "❓ Stimmst du zu oder nicht?\n\n" :
                      viralGoal === "leads" ? "🔥 Nur für Eigentümer:\n\n" : "";

  const emotionalLayer = tonality === "emotional_triggernd"
    ? "\n\n😤 Die meisten warten zu lange. Dann ist es zu spät. Die Fördermittel sind weg. Der Wert sinkt. Die Heizkosten explodieren.\n\n⏰ Jetzt handeln – oder in 2 Jahren bereuen."
    : "";

  const texts: Record<string, string> = {
    informativ: `${viralPrefix}💡 Wusstest du das?\n\n${topicText} – ein Thema, das viele Eigentümer unterschätzen.\n\nDie Realität:\n✅ Bis zu 30% Wertsteigerung möglich\n✅ Energiekosten um 40-60% senken\n✅ Fördermittel bis zu 45% der Kosten${emotionalLayer}\n\nAls zertifizierter IMONDU-Partner begleite ich dich von der ersten Idee bis zur Schlüsselübergabe.\n\n🔗 Link in Bio für eine kostenlose Erstberatung`,
    testimonial: `${viralPrefix}⭐️ „Die beste Entscheidung, die wir getroffen haben."\n\nFamilie Müller aus München hatte ein Haus aus den 70ern – ${topicText} war lange aufgeschoben.\n\nNach 6 Monaten:\n📈 Energieklasse von G auf B\n💰 42% weniger Heizkosten\n🏠 Wohnwert um 180.000€ gestiegen${emotionalLayer}\n\n#IMONDU #Sanierung #Wertsteigerung`,
    vorher_nachher: `${viralPrefix}🏠 VORHER → NACHHER\n\n${topicText} – was in nur 4 Monaten möglich ist:\n\n❌ Vorher: Veraltete Fassade, einfach verglast, Energieklasse F\n✅ Nachher: Moderne Dämmung, 3-fach Verglasung, Energieklasse A\n\nInvestition: 85.000€\nWertsteigerung: 140.000€${emotionalLayer}\n\n📩 DM für kostenlose Potenzialanalyse`,
    tipp: `${viralPrefix}🎯 3 Expertentipps für ${topicText}:\n\n1️⃣ Starte mit einer Energieberatung\nKostet ca. 300-500€, spart dir aber tausende.\n\n2️⃣ Nutze die KfW-Förderung\nBis zu 150.000€ Kredit zu 0,01%!\n\n3️⃣ Priorisiere richtig\nDach → Fassade → Fenster → Heizung.${emotionalLayer}\n\nSpeichere diesen Beitrag! 📌`,
    behind_scenes: `${viralPrefix}🔧 Ein Blick hinter die Kulissen\n\nHeute auf der Baustelle – ${topicText} in vollem Gange!\n\n⏰ 07:00 – Baustellenbegehung\n📋 09:00 – Koordination mit Gewerken\n🏗️ 11:00 – Qualitätskontrolle\n☕ 14:00 – Beratung Eigentümer${emotionalLayer}\n\n#BehindTheScenes #IMONDU`,
    cta: `${viralPrefix}🚀 Deine Immobilie hat mehr Potenzial als du denkst!\n\n${topicText} ist der Schlüssel zu:\n\n💰 Höherer Immobilienwert\n🌱 Niedrigere Energiekosten\n🏠 Bessere Wohnqualität${emotionalLayer}\n\n👉 Schreib mir JETZT eine Nachricht!\n\n#Immobilien #Sanierung #IMONDU`,
    viral_hook: `${viralPrefix}🤯 Diese Zahl wird dich schockieren:\n\n94% aller Eigentümer verschenken bei ${topicText} bares Geld.\n\nWarum? Weil sie DIESE 3 Fehler machen:\n\n❌ Keine Energieberatung vor der Sanierung\n❌ Fördermittel nicht beantragt\n❌ Falsche Reihenfolge der Maßnahmen${emotionalLayer}\n\n💡 Speichern & Teilen, damit es anderen nicht passiert!\n\n#immobilien #sanierung #imondu`,
    storytelling: `${viralPrefix}📖 Er stand vor seinem Haus und konnte es nicht glauben.\n\nVor 6 Monaten war Thomas verzweifelt. ${topicText} – eine Baustelle ohne Ende, dachte er.\n\nSein Nachbar hatte ihm von IMONDU erzählt. „Probier's einfach mal."\n\nHeute?\n✅ Energiekosten halbiert\n✅ Haus sieht aus wie neu\n✅ 140.000€ mehr Wert${emotionalLayer}\n\nThomas sagt: „Ich hätte es 5 Jahre früher machen sollen."\n\n📩 Deine Geschichte könnte die nächste sein.\n\n#IMONDU #Transformation`,
  };

  const platformHashtags: Record<Platform, string> = {
    linkedin: "#Immobilien #Sanierung #IMONDU #Wertsteigerung #Energieeffizienz #Nachhaltigkeit",
    instagram_feed: "#immobilien #sanierung #imondu #wertsteigerung #energieeffizienz #renovation #eigenheim #vorherNachher",
    instagram_story: "#imondu #sanierung #immobilien",
    tiktok: "#immobilien #sanierung #imondu #hausbau #renovierung #fyp #viral #eigentümer #energiewende",
  };

  const imagePrompts: Record<string, string> = {
    informativ: `Professionelle Infografik "${topicText}", Imondu-Branding (lila/pink Gradient), clean`,
    testimonial: `Zufriedene Familie vor saniertem Haus, Imondu-Branding, professionell`,
    vorher_nachher: `Split-Screen Vorher-Nachher Haus-Sanierung, Imondu CI`,
    tipp: `Tipp-Karten-Design mit 3 Tipps, Imondu-Branding, Immobilien-Icons`,
    behind_scenes: `Baustellenfoto Sanierung, authentisch, professionell`,
    cta: `CTA-Bild "Kostenlose Potenzialanalyse", Imondu lila-pink Gradient`,
    viral_hook: `Schockierende Statistik-Grafik, bold Zahlen, Imondu CI, Aufmerksamkeit erregend`,
    storytelling: `Emotionales Storytelling-Bild, Person vor Haus, warmes Licht, cinematic`,
  };

  return {
    text: texts[contentType] || texts.informativ,
    hashtags: platformHashtags[platform],
    imagePrompt: imagePrompts[contentType] || imagePrompts.informativ,
  };
}

// ── Mock video concept ──
export function generateMockVideoConcept(contentType: ContentType, tonality: Tonality, topic: string, viralGoal: ViralGoal): VideoConceptResult {
  const topicText = topic || "Immobilien-Sanierung";

  const storyboards: Record<string, StoryboardScene[]> = {
    default: [
      { sceneNumber: 1, duration: "0-3s", visual: "Close-up Gesicht, direkt in Kamera", text: "STOP! Das musst du wissen.", action: "Hook – Aufmerksamkeit sofort greifen" },
      { sceneNumber: 2, duration: "3-8s", visual: "B-Roll: Verfallenes Haus / alte Fassade", text: `${topicText} – 94% machen diesen Fehler.`, action: "Problem aufzeigen, Neugier wecken" },
      { sceneNumber: 3, duration: "8-18s", visual: "Split-Screen: Vorher links / Nachher rechts", text: "So sah das Haus VORHER aus. Und so NACHHER. In nur 4 Monaten.", action: "Transformation zeigen, Beweis liefern" },
      { sceneNumber: 4, duration: "18-25s", visual: "Zahlen einblenden mit Animation", text: "Investition: 85.000€. Wertsteigerung: 140.000€. Förderung: 28.000€.", action: "Konkrete Zahlen – Vertrauen aufbauen" },
      { sceneNumber: 5, duration: "25-30s", visual: "Du vor dem sanierten Haus, lächelnd", text: "Schreib mir 'ANALYSE' und ich zeig dir, was bei deinem Haus möglich ist.", action: "CTA – Handlungsaufforderung" },
    ],
    storytelling: [
      { sceneNumber: 1, duration: "0-3s", visual: "Schwarzer Screen, weiße Schrift", text: "Er wollte sein Haus verkaufen. Dann passierte DAS.", action: "Mysteriöser Hook" },
      { sceneNumber: 2, duration: "3-10s", visual: "Handyvideo: Mann vor altem Haus, besorgt", text: `Thomas dachte, sein Haus sei nichts mehr wert. ${topicText} schien unmöglich.`, action: "Protagonist vorstellen, Empathie erzeugen" },
      { sceneNumber: 3, duration: "10-20s", visual: "Timelapse: Sanierungsarbeiten", text: "Dann hat er einen Anruf gemacht. 4 Monate später war alles anders.", action: "Wendepunkt – Spannung aufbauen" },
      { sceneNumber: 4, duration: "20-27s", visual: "Reveal: Fertiges, modernes Haus", text: "180.000€ mehr Wert. Heizkosten halbiert. Thomas kann es immer noch nicht glauben.", action: "Auflösung – Emotionaler Höhepunkt" },
      { sceneNumber: 5, duration: "27-30s", visual: "Text-Overlay + Profil-Tag", text: "Dein Haus hat auch Potenzial. Link in Bio.", action: "CTA mit persönlicher Ansprache" },
    ],
    viral_hook: [
      { sceneNumber: 1, duration: "0-2s", visual: "POV: Du zeigst auf Kamera", text: "WARTE! Bevor du scrollst –", action: "Pattern Interrupt, Scroll-Stopper" },
      { sceneNumber: 2, duration: "2-5s", visual: "Schockierte Reaktion + Zahl eingeblendet", text: `${topicText}: 140.000€ verschenkt. Einfach so.`, action: "Schock-Wert, Neugier halten" },
      { sceneNumber: 3, duration: "5-15s", visual: "Schnelle Cuts: 3 Fehler mit ❌ Icons", text: "3 Fehler die fast JEDER Eigentümer macht: 1. Keine Beratung. 2. Keine Förderung. 3. Falsche Reihenfolge.", action: "Listicle-Format, leicht konsumierbar" },
      { sceneNumber: 4, duration: "15-22s", visual: "Bildschirmaufnahme: Förderrechner", text: "So viel Förderung steht DIR zu. Kostenlos berechnen.", action: "Beweis + Mehrwert" },
      { sceneNumber: 5, duration: "22-25s", visual: "Gesicht in Kamera, ernst", text: "Folgen für mehr. Oder DM 'CHECK' für deine persönliche Analyse.", action: "Doppelter CTA" },
    ],
  };

  const hooks: HookVariant[] = [
    { style: "Schock-Statistik", hook: `94% der Eigentümer verlieren bei ${topicText} bares Geld. Gehörst du dazu?`, whyItWorks: "Zahlen + persönliche Ansprache erzeugen FOMO" },
    { style: "Kontroverse These", hook: `${topicText} lohnt sich NICHT. Es sei denn, du machst es SO.`, whyItWorks: "Widerspruch erzeugt Neugier und Kommentare" },
    { style: "Persönliche Story", hook: "Ich habe einem Eigentümer gerade 140.000€ gespart. So geht's.", whyItWorks: "Konkrete Summe + 'So geht's' verspricht Lösung" },
    { style: "POV / Direktansprache", hook: "POV: Du erfährst, dass dein Haus 200.000€ mehr wert sein könnte.", whyItWorks: "POV-Format ist TikTok-nativ, persönlich" },
    { style: "Fehler-Listicle", hook: `Der TEUERSTE Fehler bei ${topicText}. Und wie du ihn vermeidest.`, whyItWorks: "Verlust-Aversion ist stärkster Trigger" },
  ];

  const scenarioKey = contentType === "storytelling" ? "storytelling" : contentType === "viral_hook" ? "viral_hook" : "default";

  return {
    storyboard: storyboards[scenarioKey],
    hooks,
    caption: `${topicText} – dein Haus hat mehr Potenzial als du denkst! 🏠✨ Schreib mir für eine kostenlose Analyse.`,
    hashtags: "#immobilien #sanierung #imondu #fyp #viral #eigentümer #renovation #hausbau",
    musicSuggestion: tonality === "emotional_triggernd"
      ? "🎵 Trending: Dramatic Piano / Hans Zimmer Style – passt zu emotionalen Transformationen"
      : viralGoal === "reichweite"
      ? "🎵 Trending: Upbeat / 'Money' von Lisa – passt zu Erfolgs-Content"
      : "🎵 Trending: Motivational / 'Unstoppable' – passt zu Expertise-Content",
    thumbnailPrompt: `Bold Text "${topicText}" auf dunklem Hintergrund, Haus-Silhouette, Imondu lila-pink Gradient, schockiertes Gesicht, YouTube-Thumbnail Stil`,
    postingTip: viralGoal === "reichweite"
      ? "Poste Di-Do zwischen 18-20 Uhr. Antworte auf JEDEN Kommentar in den ersten 30 Min. Teile in 3+ Stories."
      : viralGoal === "engagement"
      ? "Stelle eine Frage am Ende. Antworte mit einem Follow-Up Video auf den besten Kommentar."
      : viralGoal === "leads"
      ? "Nutze ein Keyword-CTA ('Schreib ANALYSE'). Richte einen Auto-Responder in den DMs ein."
      : "Konsistent posten: 3-5x pro Woche zur gleichen Uhrzeit.",
  };
}
