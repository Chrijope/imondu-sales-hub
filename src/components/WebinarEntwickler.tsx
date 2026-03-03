import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play, CheckCircle2, Shield, ArrowRight, Users, Target,
  TrendingUp, Zap, Building2, ChevronDown,
  XCircle, BarChart3, Crown, Clock, Briefcase
} from "lucide-react";
import { useState } from "react";
import imonduLogo from "@/assets/imondu-logo-full.png";

const MARKT_PROBLEME = [
  { icon: Clock, text: "Hoher Akquiseaufwand" },
  { icon: TrendingUp, text: "Steigende Marketingkosten" },
  { icon: Users, text: "Unqualifizierte Anfragen" },
  { icon: BarChart3, text: "Vergleichsportale erzeugen Preisdruck" },
  { icon: Zap, text: "Lange Entscheidungsprozesse" },
];

const PIPELINE_SCHRITTE = [
  { nr: "1", titel: "Keine Streuverluste", desc: "Nur Eigentümer mit echtem Entwicklungsinteresse." },
  { nr: "2", titel: "Keine Kaltakquise", desc: "Eigentümer kommen aktiv auf die Plattform." },
  { nr: "3", titel: "Keine Maklerabhängigkeit", desc: "Direkter Zugang – ohne Vermittler." },
  { nr: "4", titel: "Eigentümer kommen aktiv", desc: "Qualifizierte Anfragen statt Zufallstreffer." },
  { nr: "5", titel: "Du wählst gezielt aus", desc: "Passende Projekte für dein Portfolio." },
];

const ZIELGRUPPEN = [
  "Projektentwickler", "Architekten", "Energieberater",
  "Dachdecker", "Fensterbauer", "Heizungsbauer", "Generalunternehmer",
];

const PROJEKTWERTE = [
  { branche: "Sanierung", wert: "40.000 €" },
  { branche: "Heizungsbau", wert: "25.000 €" },
  { branche: "Dachbau", wert: "60.000 €" },
  { branche: "Entwicklung", wert: "500.000 €" },
];

const ERFOLGE = [
  {
    rolle: "Architekt aus NRW",
    ergebnis: "3 Anfragen in 4 Wochen",
    detail: "1 Projekt beauftragt",
    wert: "26.780 € Honorarvolumen",
  },
  {
    rolle: "Projektentwickler aus München",
    ergebnis: "Zugang zu Eigentümer mit MFH",
    detail: "Gemeinschaftsprojekt",
    wert: "Reduzierte Kapitalbindung",
  },
];

const VORTEILE = [
  "Mehr qualifizierte Anfragen",
  "Weniger Streuverlust",
  "Volle Transparenz",
  "Planbare Projektpipeline",
  "Kein Preiskampf über Vergleichsportale",
];

const NICHT_IST = [
  "Kein Vergleichsportal",
  "Keine Kaltakquise nötig",
  "Kein Preiskampf",
];

export default function WebinarEntwickler() {
  const [isDark, setIsDark] = useState(true);

  const scrollToWebinar = () => {
    document.getElementById("webinar-video")?.scrollIntoView({ behavior: "smooth" });
  };

  const t = isDark
    ? {
        bg: "bg-black text-white",
        heroBg: "from-[#863BFF]/30 via-black to-[#00B4D8]/10",
        glow1: "bg-[#863BFF]/15",
        glow2: "bg-[#00B4D8]/10",
        textMuted: "text-white/70",
        textSubtle: "text-white/60",
        textFaint: "text-white/40",
        textGhost: "text-white/30",
        textEmphasis: "text-white/80",
        cardBg: "bg-white/5 border-white/10 text-white",
        cardBgAlt: "bg-white/5 border border-white/10",
        sectionBorder: "border-white/5",
        trustBg: "bg-[#863BFF]/5 border-[#863BFF]/10",
        videoBg: "from-[#863BFF]/20 to-[#00B4D8]/10 border-white/10",
        videoOverlay: "bg-black/40 group-hover:bg-black/30",
        ctaBg: "from-[#863BFF]/10 to-transparent",
        footerBorder: "border-white/5",
        logoOpacity: "opacity-60",
        sectionGradient: "from-transparent via-[#863BFF]/5 to-transparent",
        toggleBg: "bg-white/10 hover:bg-white/20 text-white",
        dangerCard: "bg-red-500/5 border-red-500/20",
        dangerText: "text-red-400",
        successCard: "bg-green-500/10 border-green-500/20",
        successText: "text-green-400",
      }
    : {
        bg: "bg-white text-gray-900",
        heroBg: "from-[#863BFF]/10 via-white to-[#00B4D8]/5",
        glow1: "bg-[#863BFF]/8",
        glow2: "bg-[#00B4D8]/5",
        textMuted: "text-gray-600",
        textSubtle: "text-gray-500",
        textFaint: "text-gray-400",
        textGhost: "text-gray-300",
        textEmphasis: "text-gray-700",
        cardBg: "bg-gray-50 border-gray-200 text-gray-900",
        cardBgAlt: "bg-gray-50 border border-gray-200",
        sectionBorder: "border-gray-100",
        trustBg: "bg-[#863BFF]/5 border-[#863BFF]/10",
        videoBg: "from-[#863BFF]/10 to-[#00B4D8]/5 border-gray-200",
        videoOverlay: "bg-white/40 group-hover:bg-white/30",
        ctaBg: "from-[#863BFF]/5 to-transparent",
        footerBorder: "border-gray-100",
        logoOpacity: "opacity-70",
        sectionGradient: "from-transparent via-[#863BFF]/3 to-transparent",
        toggleBg: "bg-gray-100 hover:bg-gray-200 text-gray-700",
        dangerCard: "bg-red-50 border-red-200",
        dangerText: "text-red-600",
        successCard: "bg-green-50 border-green-200",
        successText: "text-green-600",
      };

  return (
      <div className={`min-h-screen ${t.bg} transition-colors duration-300 relative`}>

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
              Exklusives Webinar für Entwickler & Fachbetriebe
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6" style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.03em" }}>
              Vom Zufall zur{" "}
              <span className="bg-gradient-to-r from-[#863BFF] to-[#00B4D8] bg-clip-text text-transparent">
                planbaren Projektpipeline.
              </span>
            </h1>

            <p className={`text-lg ${t.textMuted} max-w-2xl mx-auto mb-8 leading-relaxed`} style={{ fontFamily: "Inter, sans-serif" }}>
              Gute Projekte entstehen nicht durch mehr Kaltakquise. Sie entstehen durch den richtigen Zugang zu Eigentümern – zur richtigen Zeit. Erfahre, wie IMONDU deine Akquise revolutioniert.
            </p>

            <div className={`flex flex-wrap justify-center gap-4 mb-10 text-sm ${t.textSubtle}`}>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#863BFF]" /> Qualifizierte Eigentümer
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#863BFF]" /> Kein Preiskampf
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#863BFF]" /> Planbare Pipeline
              </span>
            </div>

            <Button
              onClick={scrollToWebinar}
              size="lg"
              className="bg-[#863BFF] hover:bg-[#7530e6] text-white text-base px-8 py-6 rounded-xl shadow-[0_0_40px_rgba(134,59,255,0.3)] hover:shadow-[0_0_60px_rgba(134,59,255,0.4)] transition-all"
            >
              <Play className="h-5 w-5 mr-2" /> Jetzt Webinar ansehen
            </Button>

            <p className={`text-xs ${t.textFaint} mt-4`}>
              Ein Projekt finanziert Deine Mitgliedschaft für Jahre.
            </p>

            <ChevronDown className={`h-6 w-6 ${t.textGhost} mx-auto mt-12 animate-bounce`} />
          </div>
        </section>

        {/* ── MARKT-PROBLEME ── */}
        <section className={`py-20 px-6 border-t ${t.sectionBorder}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
              Warum Entwickler heute{" "}
              <span className="text-[#863BFF]">Projekte verlieren.</span>
            </h2>
            <p className={`${t.textSubtle} text-lg mb-8`}>Die Realität des Marktes:</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {MARKT_PROBLEME.map((p, i) => (
                <div key={i} className={`flex items-center gap-3 p-4 rounded-xl ${t.dangerCard} border`}>
                  <p.icon className={`h-5 w-5 ${t.dangerText} shrink-0`} />
                  <span className={`text-sm font-medium ${t.textEmphasis}`}>{p.text}</span>
                </div>
              ))}
            </div>

            <div className={`mt-8 bg-gradient-to-r ${isDark ? 'from-[#863BFF]/10 to-transparent' : 'from-[#863BFF]/5 to-transparent'} border-l-2 border-[#863BFF] pl-6 py-4 rounded-r-lg`}>
              <p className={`${t.textMuted} italic`}>
                Die Konsequenz: Weniger Zeit für Projekte, mehr Zeitaufwand für Akquise, sinkende Margen.
              </p>
            </div>
          </div>
        </section>

        {/* ── LÖSUNG ── */}
        <section className={`py-20 px-6 bg-gradient-to-b ${t.sectionGradient}`}>
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-10 w-10 text-[#863BFF] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
              Kein Vergleichsportal.{" "}
              <span className="text-[#863BFF]">Dein strategischer Zugang zu Eigentümern.</span>
            </h2>
            <p className={`${t.textSubtle} text-lg max-w-2xl mx-auto mb-10`}>
              IMONDU bringt dir geprüfte Eigentümer – mit echtem Entwicklungspotenzial. Günstiger als eine Printanzeige, mit deutlich höherer Abschlusswahrscheinlichkeit.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              {VORTEILE.map((v, i) => (
                <div key={i} className={`flex items-center gap-3 p-4 rounded-xl ${t.successCard} border`}>
                  <CheckCircle2 className={`h-5 w-5 ${t.successText} shrink-0`} />
                  <span className={`text-sm font-medium ${t.textEmphasis}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PIPELINE SCHRITTE ── */}
        <section className={`py-20 px-6 border-t ${t.sectionBorder}`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-1 rounded-full bg-gradient-to-r from-[#863BFF] to-[#00B4D8]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#863BFF]">Pipeline statt Projekt-Hoffnung</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-10 tracking-tight">
              Vom Zufall zur <span className="text-[#863BFF]">planbaren Projektpipeline.</span>
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {PIPELINE_SCHRITTE.map((s) => (
                <div key={s.nr} className={`p-5 rounded-2xl ${t.cardBgAlt} text-center`}>
                  <span className="text-2xl font-bold text-[#863BFF]/30">{s.nr}</span>
                  <h3 className="text-sm font-bold mt-1 mb-1">{s.titel}</h3>
                  <p className={`text-xs ${t.textSubtle}`}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MARKTDATEN ── */}
        <section className={`py-20 px-6 bg-gradient-to-b ${t.sectionGradient}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
              Der Markt ist riesig –{" "}
              <span className="text-[#863BFF]">nur nicht strukturiert zugänglich.</span>
            </h2>
            <p className={`${t.textSubtle} text-lg mb-10`}>Es fehlt nicht an Nachfrage.</p>

            <div className="grid grid-cols-3 gap-4">
              <div className={`p-6 rounded-2xl ${t.cardBgAlt}`}>
                <p className="text-3xl font-bold text-[#863BFF]">6,61 Mio.</p>
                <p className={`text-xs ${t.textSubtle} mt-1`}>Eigentümer in Deutschland</p>
              </div>
              <div className={`p-6 rounded-2xl ${t.cardBgAlt}`}>
                <p className="text-3xl font-bold text-[#863BFF]">70 %</p>
                <p className={`text-xs ${t.textSubtle} mt-1`}>digital erreichbar</p>
              </div>
              <div className={`p-6 rounded-2xl ${t.cardBgAlt}`}>
                <p className="text-3xl font-bold text-[#863BFF]">125 Mrd. €</p>
                <p className={`text-xs ${t.textSubtle} mt-1`}>adressierbares Volumen p.a.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── ZIELGRUPPE ── */}
        <section className={`py-16 px-6 border-t ${t.sectionBorder}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 tracking-tight text-center">
              Für wen ist <span className="text-[#863BFF]">IMONDU?</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {ZIELGRUPPEN.map((z) => (
                <Badge key={z} variant="outline" className={`text-sm px-4 py-2 ${isDark ? 'border-white/20 text-white/80' : 'border-gray-300 text-gray-700'}`}>
                  <Briefcase className="h-3.5 w-3.5 mr-2 text-[#863BFF]" />
                  {z}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* ── ERFOLGE ── */}
        <section className={`py-20 px-6 bg-gradient-to-b ${t.sectionGradient}`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-1 rounded-full bg-gradient-to-r from-[#863BFF] to-[#00B4D8]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#863BFF]">Ergebnisse, die für sich sprechen</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 tracking-tight">
              Konkrete Erfolge durch <span className="text-[#863BFF]">IMONDU</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {ERFOLGE.map((e, i) => (
                <Card key={i} className={t.cardBg}>
                  <CardContent className="p-6">
                    <Badge className="mb-3 bg-[#863BFF]/20 text-[#863BFF] border-[#863BFF]/30 text-xs">{e.rolle}</Badge>
                    <p className={`text-lg font-bold mb-1`}>{e.ergebnis}</p>
                    <p className={`text-sm ${t.textSubtle} mb-3`}>{e.detail}</p>
                    <div className={`p-3 rounded-lg ${t.successCard} border`}>
                      <p className={`text-sm font-bold ${t.successText}`}>{e.wert}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJEKTWERT ── */}
        <section className={`py-20 px-6 border-t ${t.sectionBorder}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
              Was ein einziges Projekt <span className="text-[#863BFF]">wert sein kann</span>
            </h2>
            <p className={`${t.textSubtle} text-lg mb-10`}>
              Und du fragst dich, was eine 12-monatige Mitgliedschaft kosten soll?
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PROJEKTWERTE.map((p) => (
                <div key={p.branche} className={`p-5 rounded-2xl ${t.cardBgAlt}`}>
                  <p className={`text-xs ${t.textSubtle} mb-2`}>{p.branche}</p>
                  <p className="text-2xl font-bold text-[#863BFF]">{p.wert}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WAS ES NICHT IST ── */}
        <section className={`py-16 px-6 border-t ${t.sectionBorder}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-center">
              Was IMONDU <span className="text-[#00B4D8]">nicht</span> ist
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {NICHT_IST.map((item, i) => (
                <div key={i} className={`flex items-center gap-2 px-5 py-3 rounded-full ${t.cardBgAlt}`}>
                  <XCircle className="h-4 w-4 text-[#00B4D8]" />
                  <span className={`text-sm ${t.textMuted}`}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ZITAT ── */}
        <section className={`py-20 px-6 ${t.trustBg} border-y`}>
          <div className="max-w-3xl mx-auto text-center">
            <p className={`text-xl md:text-2xl font-bold italic leading-relaxed mb-4`}>
              „Gute Projekte entstehen nicht durch mehr Kaltakquise. Sie entstehen durch den richtigen Zugang zu Eigentümern – zur richtigen Zeit."
            </p>
            <p className={`${t.textSubtle} text-sm`}>— Marinko Marjanovic, Geschäftsführer IMONDU</p>
          </div>
        </section>

        {/* ── WEBINAR VIDEO ── */}
        <section id="webinar-video" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-[#863BFF]/20 text-[#863BFF] border-[#863BFF]/30 text-sm px-4 py-1.5">
                Exklusives Entwickler-Webinar
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Erfahre, wie du Projekte gewinnst – ohne Kaltakquise
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

        {/* ── FINAL CTA ── */}
        <section className={`py-24 px-6 bg-gradient-to-t ${t.ctaBg}`}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
              Du kannst weiter akquirieren.{" "}
              <span className="text-[#863BFF]">Oder du wirst gefunden.</span>
            </h2>
            <p className={`${t.textSubtle} mb-3 text-lg`}>
              Ein Projekt finanziert Deine Mitgliedschaft für Jahre.
            </p>
            <p className={`${t.textEmphasis} font-semibold text-lg mb-8`}>
              Pipeline statt Projekt-Hoffnung.
            </p>

            <Button
              onClick={scrollToWebinar}
              size="lg"
              className="bg-[#863BFF] hover:bg-[#7530e6] text-white text-base px-10 py-6 rounded-xl shadow-[0_0_40px_rgba(134,59,255,0.3)] hover:shadow-[0_0_60px_rgba(134,59,255,0.4)] transition-all"
            >
              Jetzt Webinar ansehen <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            <p className={`text-xs ${t.textGhost} mt-4`}>
              Günstiger als eine Printanzeige – mit deutlich höherer Abschlusswahrscheinlichkeit.
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
  );
}
