import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Play, CheckCircle2, Shield, TrendingUp, ArrowRight,
  Building2, MapPin, Landmark, Home, XCircle, Lightbulb,
  ChevronDown, Sun, Moon, Share2, Link2, Copy
} from "lucide-react";
import { useState } from "react";
import imonduLogo from "@/assets/imondu-logo-full.png";
import { useUserRole } from "@/contexts/UserRoleContext";
import WebinarEntwickler from "@/components/WebinarEntwickler";
import { useToast } from "@/hooks/use-toast";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.77 1.52V6.84a4.84 4.84 0 01-1-.15z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// ── Share Bar Component ──
function WebinarShareBar({ viewType, isDark }: { viewType: "eigentuemer" | "entwickler"; isDark: boolean }) {
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/webinar?view=${viewType}`;
  const shareTitle = viewType === "eigentuemer"
    ? "IMONDU Webinar – Entdecke das Potenzial deiner Immobilie"
    : "IMONDU Webinar – Planbare Projektpipeline für Entwickler";
  const shareText = viewType === "eigentuemer"
    ? "Kostenfreies Webinar: Was ist deine Immobilie wirklich wert? Jetzt ansehen auf IMONDU."
    : "Exklusives Webinar: Vom Zufall zur planbaren Projektpipeline. Jetzt ansehen auf IMONDU.";

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link kopiert", description: "Der Webinar-Link wurde in die Zwischenablage kopiert." });
  };

  const shareOn = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(shareTitle);

    switch (platform) {
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`, "_blank");
        break;
      case "instagram":
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast({ title: "Text kopiert", description: "Text & Link kopiert – füge ihn in deinen Instagram-Post ein." });
        break;
      case "tiktok":
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast({ title: "Text kopiert", description: "Text & Link kopiert – füge ihn in deinen TikTok-Post ein." });
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 ${isDark ? 'border-white/20 text-white/80 hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
        >
          <Share2 className="h-4 w-4" />
          Teilen
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => shareOn("linkedin")} className="gap-2 cursor-pointer">
          <LinkedInIcon className="h-4 w-4" /> LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareOn("facebook")} className="gap-2 cursor-pointer">
          <FacebookIcon className="h-4 w-4" /> Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareOn("instagram")} className="gap-2 cursor-pointer">
          <InstagramIcon className="h-4 w-4" /> Instagram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareOn("tiktok")} className="gap-2 cursor-pointer">
          <TikTokIcon className="h-4 w-4" /> TikTok
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyLink} className="gap-2 cursor-pointer">
          <Copy className="h-4 w-4" /> Link kopieren
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Data for Eigentümer page ──
const BEISPIELE = [
  {
    icon: Home,
    typ: "Wohnung / Bestand",
    titel: "Kleine Optimierung. Großer Hebel.",
    vorher: "600.000 €",
    investition: "150.000 €",
    nachher: "1.000.000 €",
    mehrwert: "+250.000 €",
    beschreibung: "Durch gezielte Grundrissoptimierung – keine Kernsanierung, kein Neubau – wurde der Marktwert um über 65 % gesteigert.",
  },
  {
    icon: MapPin,
    typ: "Grundstück",
    titel: "Wenn Grundstücke mehr können, als sie zeigen.",
    vorher: "250.000 €",
    investition: "Teilung + Nachverdichtung",
    nachher: "950.000 €",
    mehrwert: "+700.000 €",
    beschreibung: "Der Eigentümer musste nicht selbst bauen. Er hatte Optionen. Und Optionen verändern Verhandlungsmacht.",
  },
  {
    icon: Landmark,
    typ: "Gewerbe / MFH",
    titel: "Vom Problemobjekt zur strategischen Chance.",
    vorher: "1.000.000 €",
    investition: "Umnutzung",
    nachher: "1.600.000 €",
    mehrwert: "+600.000 €",
    beschreibung: "Leerstand. Schwierige Vermietung. Nach strategischer Umnutzung: 60 % Wertsteigerung.",
  },
];

const LERNZIELE = [
  "Welche Potenzial-Hebel typisch übersehen werden",
  "Wie Wirtschaftlichkeit realistisch bewertet wird",
  "Wann Entwicklung sinnvoll ist – und wann nicht",
  "Wie du Optionen vergleichen kannst",
  "Warum strategische Prüfung Verhandlungsmacht schafft",
];

const NICHT_IST = [
  "Kein Verkaufsseminar",
  "Keine Maklerveranstaltung",
  "Kein Druck",
];

export default function Webinar() {
  const { currentRoleId } = useUserRole();
  const [activeBeispiel, setActiveBeispiel] = useState(0);
  const [isDark, setIsDark] = useState(true);

  // Read initial view from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const initialView = urlParams.get("view") === "entwickler" ? "entwickler" : "eigentuemer";
  const [viewType, setViewType] = useState<"eigentuemer" | "entwickler">(
    currentRoleId === "entwickler" ? "entwickler" : initialView
  );

  const scrollToWebinar = () => {
    document.getElementById("webinar-video")?.scrollIntoView({ behavior: "smooth" });
  };

  // Theme-aware classes
  const t = isDark
    ? {
        bg: "bg-black text-white",
        heroBg: "from-[#863BFF]/30 via-black to-[#FF40C6]/10",
        glow1: "bg-[#863BFF]/15",
        glow2: "bg-[#FF40C6]/10",
        textMuted: "text-white/70",
        textSubtle: "text-white/60",
        textFaint: "text-white/40",
        textGhost: "text-white/30",
        textEmphasis: "text-white/80",
        cardBg: "bg-white/5 border-white/10 text-white",
        cardBgAlt: "bg-white/5 border border-white/10",
        sectionBorder: "border-white/5",
        quoteBar: "from-[#863BFF]/10 to-transparent",
        quoteBorder: "border-[#863BFF]",
        trustBg: "bg-[#863BFF]/5 border-[#863BFF]/10",
        videoBg: "from-[#863BFF]/20 to-[#FF40C6]/10 border-white/10",
        videoOverlay: "bg-black/40 group-hover:bg-black/30",
        ctaBg: "from-[#863BFF]/10 to-transparent",
        footerBorder: "border-white/5",
        logoOpacity: "opacity-60",
        tabActive: "bg-[#863BFF] text-white shadow-lg shadow-[#863BFF]/20",
        tabInactive: "bg-white/5 text-white/50 hover:bg-white/10",
        investCard: "bg-[#863BFF]/10 border border-[#863BFF]/20",
        resultCard: "bg-green-500/10 border border-green-500/20",
        resultText: "text-green-400",
        resultSubtext: "text-green-400/70",
        resultMeta: "text-green-400/60",
        sectionGradient: "from-transparent via-[#863BFF]/5 to-transparent",
        toggleBg: "bg-white/10 hover:bg-white/20 text-white",
        selectBg: "bg-white/10 border-white/20 text-white",
      }
    : {
        bg: "bg-white text-gray-900",
        heroBg: "from-[#863BFF]/10 via-white to-[#FF40C6]/5",
        glow1: "bg-[#863BFF]/8",
        glow2: "bg-[#FF40C6]/5",
        textMuted: "text-gray-600",
        textSubtle: "text-gray-500",
        textFaint: "text-gray-400",
        textGhost: "text-gray-300",
        textEmphasis: "text-gray-700",
        cardBg: "bg-gray-50 border-gray-200 text-gray-900",
        cardBgAlt: "bg-gray-50 border border-gray-200",
        sectionBorder: "border-gray-100",
        quoteBar: "from-[#863BFF]/5 to-transparent",
        quoteBorder: "border-[#863BFF]",
        trustBg: "bg-[#863BFF]/5 border-[#863BFF]/10",
        videoBg: "from-[#863BFF]/10 to-[#FF40C6]/5 border-gray-200",
        videoOverlay: "bg-white/40 group-hover:bg-white/30",
        ctaBg: "from-[#863BFF]/5 to-transparent",
        footerBorder: "border-gray-100",
        logoOpacity: "opacity-70",
        tabActive: "bg-[#863BFF] text-white shadow-lg shadow-[#863BFF]/20",
        tabInactive: "bg-gray-100 text-gray-500 hover:bg-gray-200",
        investCard: "bg-[#863BFF]/5 border border-[#863BFF]/15",
        resultCard: "bg-green-50 border border-green-200",
        resultText: "text-green-600",
        resultSubtext: "text-green-500",
        resultMeta: "text-green-500/70",
        sectionGradient: "from-transparent via-[#863BFF]/3 to-transparent",
        toggleBg: "bg-gray-100 hover:bg-gray-200 text-gray-700",
        selectBg: "bg-white border-gray-300 text-gray-900",
      };

  // ── Toolbar: Dropdown + Share + Theme Toggle ──
  const toolbar = (
    <div className="fixed top-20 right-6 z-50 flex items-center gap-2">
      <Select value={viewType} onValueChange={(v) => setViewType(v as "eigentuemer" | "entwickler")}>
        <SelectTrigger className={`w-[180px] h-9 text-sm rounded-full ${t.selectBg} backdrop-blur-sm shadow-lg`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="eigentuemer">Eigentümer</SelectItem>
          <SelectItem value="entwickler">Entwicklungspartner</SelectItem>
        </SelectContent>
      </Select>

      <WebinarShareBar viewType={viewType} isDark={isDark} />

      <button
        onClick={() => setIsDark(!isDark)}
        className={`p-2.5 rounded-full ${t.toggleBg} transition-all shadow-lg backdrop-blur-sm`}
        title={isDark ? "Light Mode" : "Dark Mode"}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </div>
  );

  // ── Entwickler View ──
  if (viewType === "entwickler") {
    return (
      <CRMLayout>
        <div className="relative">
          {toolbar}
          <WebinarEntwickler />
        </div>
      </CRMLayout>
    );
  }

  // ── Eigentümer View ──
  return (
    <CRMLayout>
      <div className={`min-h-screen ${t.bg} transition-colors duration-300 relative`}>
        {toolbar}

        {/* ── HERO ── */}
        <section className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${t.heroBg}`} />
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${t.glow1} rounded-full blur-[120px]`} />
          <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] ${t.glow2} rounded-full blur-[100px]`} />

          <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
            <div className="flex justify-center mb-8">
              <img src={imonduLogo} alt="IMONDU" className={`h-14 ${isDark ? 'invert drop-shadow-[0_0_12px_rgba(134,59,255,0.3)]' : ''}`} />
            </div>

            <Badge className="mb-6 bg-[#863BFF]/20 text-[#863BFF] border-[#863BFF]/30 hover:bg-[#863BFF]/30 text-sm px-4 py-1.5">
              Kostenloses Online-Webinar
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6" style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.03em" }}>
              Was ist deine Immobilie wirklich wert –{" "}
              <span className="bg-gradient-to-r from-[#863BFF] to-[#FF40C6] bg-clip-text text-transparent">
                wenn man ihr Entwicklungspotenzial strategisch mitdenkt?
              </span>
            </h1>

            <p className={`text-lg ${t.textMuted} max-w-2xl mx-auto mb-8 leading-relaxed`} style={{ fontFamily: "Inter, sans-serif" }}>
              Viele Immobilien wirken fertig. Dabei steckt oft mehr darin, als Eigentümer vermuten. Erfahre, wie du dein Objekt systematisch prüfst – bevor du eine Entscheidung triffst.
            </p>

            <div className={`flex flex-wrap justify-center gap-4 mb-10 text-sm ${t.textSubtle}`}>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#863BFF]" /> 60 Minuten Klarheit
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#863BFF]" /> Reale Entwicklungsbeispiele
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#863BFF]" /> Für Eigentümer kostenlos
              </span>
            </div>

            <Button
              onClick={scrollToWebinar}
              size="lg"
              className="bg-[#863BFF] hover:bg-[#7530e6] text-white text-base px-8 py-6 rounded-xl shadow-[0_0_40px_rgba(134,59,255,0.3)] hover:shadow-[0_0_60px_rgba(134,59,255,0.4)] transition-all"
            >
              <Play className="h-5 w-5 mr-2" /> Jetzt kostenfrei Webinar ansehen
            </Button>

            <p className={`text-xs ${t.textFaint} mt-4`}>
              Unverbindlich. Keine Maklerveranstaltung. Keine Verpflichtung.
            </p>

            <ChevronDown className={`h-6 w-6 ${t.textGhost} mx-auto mt-12 animate-bounce`} />
          </div>
        </section>

        {/* ── IDENTIFIKATION ── */}
        <section className={`py-20 px-6 border-t ${t.sectionBorder}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">
              Du besitzt eine Immobilie.{" "}
              <span className="text-[#863BFF]">Aber kennst du ihr strategisches Potenzial?</span>
            </h2>

            <p className={`${t.textSubtle} text-lg mb-8 leading-relaxed`}>
              Vielleicht läuft alles stabil. Aber irgendwo im Hinterkopf ist dieser Gedanke:{" "}
              <em className={t.textEmphasis}>„Da könnte doch mehr möglich sein."</em>
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
              {[
                { icon: Home, label: "Eigentumswohnung" },
                { icon: Building2, label: "Mehrfamilienhaus" },
                { icon: MapPin, label: "Grundstück" },
                { icon: Landmark, label: "Wohn- & Geschäftshaus" },
                { icon: Building2, label: "Gewerbeobjekt" },
              ].map((item) => (
                <div key={item.label} className={`flex flex-col items-center gap-2 p-4 rounded-xl ${t.cardBgAlt}`}>
                  <item.icon className="h-6 w-6 text-[#863BFF]" />
                  <span className={`text-xs ${t.textMuted} text-center`}>{item.label}</span>
                </div>
              ))}
            </div>

            <div className={`bg-gradient-to-r ${t.quoteBar} border-l-2 ${t.quoteBorder} pl-6 py-4 rounded-r-lg`}>
              <p className={`${t.textMuted} italic`}>
                Das Problem ist nicht Mut. Das Problem ist Orientierung. Was ist realistisch? Was wirtschaftlich sinnvoll? Wer berät neutral?
              </p>
            </div>
          </div>
        </section>

        {/* ── UNSICHTBARES POTENZIAL ── */}
        <section className={`py-20 px-6 bg-gradient-to-b ${t.sectionGradient}`}>
          <div className="max-w-4xl mx-auto text-center">
            <Lightbulb className="h-10 w-10 text-[#863BFF] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
              Viele Immobilien verlieren kein Potenzial –{" "}
              <span className="text-[#863BFF]">sie werden nur nie geprüft.</span>
            </h2>
            <p className={`${t.textSubtle} text-lg max-w-2xl mx-auto`}>
              Eine Grundrissoptimierung. Eine Teilung. Eine Nachverdichtung. Eine Umnutzung.
              Oft sind es keine radikalen Schritte – sondern strategische.
            </p>
          </div>
        </section>

        {/* ── ENTWICKLUNGSBEISPIELE ── */}
        <section className={`py-20 px-6 border-t ${t.sectionBorder}`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-1 rounded-full bg-gradient-to-r from-[#863BFF] to-[#FF40C6]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#863BFF]">Reale Entwicklungsbeispiele</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-10 tracking-tight">
              Keine Spekulation. Nur strategische Prüfung.
            </h2>

            <div className="flex gap-2 mb-8">
              {BEISPIELE.map((b, i) => (
                <button
                  key={i}
                  onClick={() => setActiveBeispiel(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeBeispiel === i ? t.tabActive : t.tabInactive
                  }`}
                >
                  <b.icon className="h-4 w-4" />
                  {b.typ}
                </button>
              ))}
            </div>

            {(() => {
              const b = BEISPIELE[activeBeispiel];
              return (
                <Card className={t.cardBg}>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-4">{b.titel}</h3>
                    <p className={`${t.textSubtle} mb-8`}>{b.beschreibung}</p>

                    <div className="grid grid-cols-3 gap-4">
                      <div className={`text-center p-4 rounded-xl ${t.cardBgAlt}`}>
                        <p className={`text-xs ${t.textFaint} mb-1`}>Marktwert vorher</p>
                        <p className="text-xl font-bold">{b.vorher}</p>
                      </div>
                      <div className={`text-center p-4 rounded-xl ${t.investCard}`}>
                        <p className="text-xs text-[#863BFF]/70 mb-1">Investition / Maßnahme</p>
                        <p className="text-lg font-bold text-[#863BFF]">{b.investition}</p>
                      </div>
                      <div className={`text-center p-4 rounded-xl ${t.resultCard}`}>
                        <p className={`text-xs ${t.resultSubtext} mb-1`}>Neuer Marktwert</p>
                        <p className={`text-xl font-bold ${t.resultText}`}>{b.nachher}</p>
                        <p className={`text-xs ${t.resultMeta} mt-1`}>{b.mehrwert}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        </section>

        {/* ── WAS DU LERNST ── */}
        <section className={`py-20 px-6 bg-gradient-to-b ${t.sectionGradient}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 tracking-tight text-center">
              Was du im Webinar <span className="text-[#863BFF]">konkret lernst</span>
            </h2>

            <div className="grid gap-3 max-w-xl mx-auto">
              {LERNZIELE.map((ziel, i) => (
                <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${t.cardBgAlt}`}>
                  <CheckCircle2 className="h-5 w-5 text-[#863BFF] shrink-0 mt-0.5" />
                  <span className={t.textEmphasis}>{ziel}</span>
                </div>
              ))}
            </div>

            <p className={`text-center ${t.textSubtle} mt-6 italic`}>
              Du bekommst keine Theorie. Sondern Entscheidungsgrundlage.
            </p>
          </div>
        </section>

        {/* ── WAS ES NICHT IST ── */}
        <section className={`py-16 px-6 border-t ${t.sectionBorder}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-center">Was dieses Webinar <span className="text-[#FF40C6]">nicht</span> ist</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {NICHT_IST.map((item, i) => (
                <div key={i} className={`flex items-center gap-2 px-5 py-3 rounded-full ${t.cardBgAlt}`}>
                  <XCircle className="h-4 w-4 text-[#FF40C6]" />
                  <span className={`text-sm ${t.textMuted}`}>{item}</span>
                </div>
              ))}
            </div>
            <p className={`text-center ${t.textSubtle} mt-6 text-sm`}>
              Es geht nicht darum, sofort zu entwickeln. Es geht darum, nicht im Unwissen zu bleiben.
            </p>
          </div>
        </section>

        {/* ── MENTALER SHIFT ── */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">
              Viele Eigentümer verwalten.{" "}
              <span className="text-[#863BFF]">Wenige prüfen strategisch.</span>
            </h2>
            <p className={`${t.textSubtle} text-lg leading-relaxed`}>
              Der Unterschied liegt nicht im Mut. Sondern im Wissen. Und genau dieses Wissen erhältst du im Webinar.
            </p>
          </div>
        </section>

        {/* ── SICHERHEIT / TRUST ── */}
        <section className={`py-16 px-6 ${t.trustBg} border-y`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Shield className="h-16 w-16 text-[#863BFF] shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-3">IMONDU ist kein Makler. IMONDU verkauft nichts.</h3>
                <p className={`${t.textSubtle} leading-relaxed`}>
                  Wir schaffen Vergleichbarkeit. Du erhältst Zugang zu geprüften Projektentwicklern,
                  siehst Optionen, vergleichst Angebote – und behältst die volle Entscheidungsfreiheit.
                  In vielen Fällen übernimmt der Entwickler sogar die Projektkosten.
                </p>
                <div className="flex flex-wrap gap-3 mt-4 text-sm">
                  <Badge variant="outline" className="border-[#863BFF]/30 text-[#863BFF]">Vollständig kostenlos</Badge>
                  <Badge variant="outline" className="border-[#863BFF]/30 text-[#863BFF]">Keine Maklerbindung</Badge>
                  <Badge variant="outline" className="border-[#863BFF]/30 text-[#863BFF]">Keine Verpflichtung</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WEBINAR VIDEO ── */}
        <section id="webinar-video" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-[#863BFF]/20 text-[#863BFF] border-[#863BFF]/30 text-sm px-4 py-1.5">
                Kostenfreies Webinar
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                60 Minuten, die deine Sichtweise verändern
              </h2>
            </div>

            <div className={`aspect-video rounded-2xl bg-gradient-to-br ${t.videoBg} border flex items-center justify-center relative overflow-hidden group cursor-pointer`}>
              <div className={`absolute inset-0 ${t.videoOverlay} transition-colors`} />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#863BFF] flex items-center justify-center shadow-[0_0_40px_rgba(134,59,255,0.4)] group-hover:shadow-[0_0_60px_rgba(134,59,255,0.5)] group-hover:scale-110 transition-all">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
                <p className={`${t.textSubtle} text-sm`}>Webinar starten</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SCHRITTE ── */}
        <section className={`py-16 px-6 border-t ${t.sectionBorder}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-10 tracking-tight">
              3 Minuten Aufwand. <span className="text-[#863BFF]">Volle Entscheidungsfreiheit.</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Immobilie einstellen", desc: "Wohnung, Grundstück, Gewerbe oder Mehrfamilienhaus – kostenlos & in wenigen Minuten." },
                { step: "02", title: "Strukturierte Prüfung", desc: "Dein Objekt wird systematisch analysiert. Du erhältst transparente Optionen." },
                { step: "03", title: "Du entscheidest", desc: "Vergleiche Angebote, nutze Optionen – oder entscheide dich bewusst dagegen. Beides ist gut." },
              ].map((s) => (
                <div key={s.step} className={`p-6 rounded-2xl ${t.cardBgAlt} text-left`}>
                  <span className="text-3xl font-bold text-[#863BFF]/30">{s.step}</span>
                  <h3 className="text-lg font-bold mt-2 mb-2">{s.title}</h3>
                  <p className={`text-sm ${t.textSubtle}`}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className={`py-24 px-6 bg-gradient-to-t ${t.ctaBg}`}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
              Bevor du entscheidest –{" "}
              <span className="text-[#863BFF]">verstehe dein Potenzial.</span>
            </h2>
            <p className={`${t.textSubtle} mb-3 text-lg`}>
              Vielleicht bleibt alles, wie es ist. Vielleicht entsteht ein neues Projekt.
            </p>
            <p className={`${t.textEmphasis} font-semibold text-lg mb-8`}>
              Aber triff keine Entscheidung ohne Klarheit.
            </p>

            <Button
              onClick={scrollToWebinar}
              size="lg"
              className="bg-[#863BFF] hover:bg-[#7530e6] text-white text-base px-10 py-6 rounded-xl shadow-[0_0_40px_rgba(134,59,255,0.3)] hover:shadow-[0_0_60px_rgba(134,59,255,0.4)] transition-all"
            >
              Jetzt kostenfrei Webinar ansehen <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            <p className={`text-xs ${t.textGhost} mt-4`}>
              Für Eigentümer kostenlos. Keine Maklerbindung. Keine Verpflichtung.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-8 px-6 border-t ${t.footerBorder} text-center`}>
          <img src={imonduLogo} alt="IMONDU" className={`h-10 mx-auto mb-3 ${isDark ? 'invert opacity-60 drop-shadow-[0_0_8px_rgba(134,59,255,0.2)]' : 'opacity-70'}`} />
          <p className={`text-xs ${t.textGhost}`}>
            © {new Date().getFullYear()} IMONDU – Die Nr. 1 Plattform für Immobilienentwicklung
          </p>
        </footer>
      </div>
    </CRMLayout>
  );
}
