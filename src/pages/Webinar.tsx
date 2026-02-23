import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play, CheckCircle2, Shield, TrendingUp, ArrowRight,
  Building2, MapPin, Landmark, Home, XCircle, Lightbulb,
  ChevronDown, Sun, Moon
} from "lucide-react";
import { useState } from "react";
import imonduLogo from "@/assets/imondu-logo.png";

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
  const [activeBeispiel, setActiveBeispiel] = useState(0);
  const [isDark, setIsDark] = useState(true);

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
      };

  return (
    <CRMLayout>
      <div className={`min-h-screen ${t.bg} transition-colors duration-300 relative`}>
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className={`fixed top-20 right-6 z-50 p-2.5 rounded-full ${t.toggleBg} transition-all shadow-lg backdrop-blur-sm`}
          title={isDark ? "Light Mode" : "Dark Mode"}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${t.heroBg}`} />
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${t.glow1} rounded-full blur-[120px]`} />
          <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] ${t.glow2} rounded-full blur-[100px]`} />

          <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
            <div className="flex justify-center mb-8">
              <img src={imonduLogo} alt="IMONDU" className={`h-12 ${isDark ? '' : 'brightness-0'}`} />
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
          <img src={imonduLogo} alt="IMONDU" className={`h-8 mx-auto mb-3 ${t.logoOpacity} ${isDark ? '' : 'brightness-0'}`} />
          <p className={`text-xs ${t.textGhost}`}>
            © {new Date().getFullYear()} IMONDU – Die Nr. 1 Plattform für Immobilienentwicklung
          </p>
        </footer>
      </div>
    </CRMLayout>
  );
}
