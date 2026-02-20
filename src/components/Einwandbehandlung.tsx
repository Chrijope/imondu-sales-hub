import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield, ChevronRight, ChevronDown, Search, Lightbulb, Copy, CheckCircle2,
  Sparkles, MessageSquare, Video, Target, Zap, ThumbsUp, ArrowRight,
  AlertTriangle, DollarSign, Clock, Users, HelpCircle, Ban,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ── Einwand-Kategorie ─────────────────────────── */
interface Gegenargument {
  id: string;
  strategie: string;
  text: string;
  beispiel?: string;
  stärke: "stark" | "mittel" | "sanft";
}

interface EinwandKategorie {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  beschreibung: string;
  häufigkeit: "sehr häufig" | "häufig" | "gelegentlich";
  gegenargumente: Gegenargument[];
}

/* ── B2B Einwand-Datenbank ─────────────────────── */
const B2B_EINWAENDE: EinwandKategorie[] = [
  {
    id: "zu_teuer",
    name: "Zu teuer / Budget",
    icon: DollarSign,
    beschreibung: "Kunde empfindet den Preis als zu hoch oder hat kein Budget.",
    häufigkeit: "sehr häufig",
    gegenargumente: [
      {
        id: "roi", strategie: "ROI-Rechnung", stärke: "stark",
        text: "Rechnen wir gemeinsam: Ein einziger gewonnener Auftrag über unsere Plattform deckt den kompletten Jahresbeitrag ab. Bei durchschnittlich 3-5 vermittelten Aufträgen pro Quartal ergibt sich ein Return von 500-800%.",
        beispiel: "\"Herr Weber, wenn Sie nur einen Auftrag im Wert von 5.000€ über uns erhalten, hat sich die Mitgliedschaft bereits refinanziert. Die meisten unserer Partner gewinnen 3-5 Aufträge pro Quartal.\"",
      },
      {
        id: "vergleich", strategie: "Vergleich mit Alternativen", stärke: "stark",
        text: "Was kostet Sie aktuell die Kundenakquise? Google Ads, Flyer, Messen – rechnen Sie mal zusammen. Mit uns haben Sie planbare Kosten und qualifizierte Leads direkt in Ihrer Region.",
        beispiel: "\"Was geben Sie derzeit monatlich für Werbung aus? Bei vielen Betrieben sind das 500-1.000€ ohne Garantie. Bei uns wissen Sie genau, was Sie bekommen.\"",
      },
      {
        id: "ratenzahlung", strategie: "Zahlungsflexibilität", stärke: "sanft",
        text: "Wir bieten auch monatliche Zahlung an – das sind weniger als 5€ pro Tag für einen stetigen Strom qualifizierter Anfragen.",
        beispiel: "\"Auf den Tag gerechnet investieren Sie weniger als einen Kaffee für kontinuierliche Neukundengewinnung.\"",
      },
    ],
  },
  {
    id: "kein_bedarf",
    name: "Kein Bedarf / genug Aufträge",
    icon: Ban,
    beschreibung: "Kunde sagt, er habe genug zu tun und brauche keine neuen Aufträge.",
    häufigkeit: "häufig",
    gegenargumente: [
      {
        id: "saisonalitaet", strategie: "Saisonalität ansprechen", stärke: "stark",
        text: "Das freut mich! Aber wie sieht es in den Wintermonaten aus? Viele unserer erfolgreichsten Partner nutzen Imondu gezielt als Absicherung für schwächere Phasen.",
        beispiel: "\"Herr Krause, das höre ich oft im Sommer. Aber wie war die Auftragslage im Januar? Genau dafür nutzen unsere Top-Partner die Plattform – als Sicherheitsnetz.\"",
      },
      {
        id: "selektiv", strategie: "Selektive Aufträge", stärke: "mittel",
        text: "Genau das ist der Vorteil: Sie wählen nur die Aufträge aus, die zu Ihnen passen. Größere Projekte, bessere Margen, weniger Kleinaufträge.",
        beispiel: "\"Sie müssen nicht jeden Auftrag annehmen – wählen Sie gezielt die Premium-Projekte aus, die sich wirklich lohnen.\"",
      },
      {
        id: "wachstum", strategie: "Wachstumsperspektive", stärke: "mittel",
        text: "Planen Sie, Ihr Team zu vergrößern? Mit einem planbaren Auftragszufluss können Sie Mitarbeiter sicher einstellen und wachsen.",
      },
    ],
  },
  {
    id: "ueberlegen",
    name: "Muss ich mir überlegen",
    icon: Clock,
    beschreibung: "Kunde will sich Zeit nehmen, klassisches Verzögerungssignal.",
    häufigkeit: "sehr häufig",
    gegenargumente: [
      {
        id: "fomo", strategie: "Dringlichkeit (sanft)", stärke: "stark",
        text: "Absolut verständlich! Darf ich fragen: Was genau möchten Sie sich überlegen? Dann kann ich Ihnen die passenden Informationen mitgeben. Aktuell haben wir noch Kapazitäten in Ihrer Region – das kann sich aber schnell ändern.",
        beispiel: "\"Selbstverständlich, Herr Lang. Welche Punkte sind noch offen? In Ihrer Region Stuttgart haben wir aktuell nur 2 von 5 Partnerplätzen besetzt.\"",
      },
      {
        id: "info_mappe", strategie: "Konkrete nächste Schritte", stärke: "mittel",
        text: "Natürlich! Ich schicke Ihnen eine Info-Mappe mit allen Details und Referenzen aus Ihrer Region. Darf ich Sie Ende der Woche nochmal kurz anrufen?",
      },
      {
        id: "testphase", strategie: "Testangebot", stärke: "stark",
        text: "Wie wäre es mit einem Test? Sie probieren unsere Plattform 30 Tage aus und sehen selbst, welche Aufträge in Ihrer Region verfügbar sind – völlig unverbindlich.",
        beispiel: "\"Warum nicht einfach mal reinschauen? 30 Tage kostenlos, kein Risiko. Wenn es nicht passt, kein Problem.\"",
      },
    ],
  },
  {
    id: "schon_anbieter",
    name: "Haben schon einen Anbieter",
    icon: Users,
    beschreibung: "Kunde nutzt bereits einen Wettbewerber oder hat eigene Akquise-Kanäle.",
    häufigkeit: "häufig",
    gegenargumente: [
      {
        id: "ergaenzung", strategie: "Ergänzung, nicht Ersatz", stärke: "stark",
        text: "Das schließt sich nicht aus! Viele unserer Partner nutzen uns als zusätzlichen Kanal. Diversifizierung Ihrer Lead-Quellen reduziert das Risiko und erhöht die Auswahl.",
        beispiel: "\"Super, dass Sie schon aktiv sind! Unsere Partner nutzen uns ergänzend – stellen Sie sich vor, Sie hätten zwei Zuflüsse statt einem.\"",
      },
      {
        id: "differenzierung", strategie: "USP hervorheben", stärke: "mittel",
        text: "Was uns unterscheidet: Bei Imondu konkurrieren Sie nicht mit 10 anderen Betrieben um denselben Auftrag. Unsere Leads sind exklusiv für Ihre Region.",
      },
    ],
  },
  {
    id: "vertrauen",
    name: "Kenne euch nicht / Skepsis",
    icon: HelpCircle,
    beschreibung: "Kunde kennt Imondu nicht und ist skeptisch gegenüber neuen Anbietern.",
    häufigkeit: "gelegentlich",
    gegenargumente: [
      {
        id: "referenzen", strategie: "Social Proof", stärke: "stark",
        text: "Absolut nachvollziehbar. Wir arbeiten aktuell mit über 200 Partnerbetrieben bundesweit zusammen. Darf ich Ihnen Referenzen aus Ihrer Branche und Region nennen?",
        beispiel: "\"In München arbeiten wir z.B. mit der FensterPro AG zusammen – 234 erfolgreiche Projekte. Ich kann Ihnen den Kontakt herstellen.\"",
      },
      {
        id: "demo", strategie: "Zeigen statt erzählen", stärke: "stark",
        text: "Am besten zeige ich Ihnen einfach kurz, wie die Plattform funktioniert. In 10 Minuten sehen Sie die verfügbaren Aufträge in Ihrer Region – live.",
      },
      {
        id: "garanite", strategie: "Risikofreiheit betonen", stärke: "mittel",
        text: "Wir bieten eine 30-Tage-Geld-zurück-Garantie. Wenn Sie in den ersten 30 Tagen nicht zufrieden sind, erhalten Sie Ihren Beitrag vollständig zurück.",
      },
    ],
  },
  {
    id: "keine_zeit",
    name: "Keine Zeit gerade",
    icon: Clock,
    beschreibung: "Kunde hat keine Zeit für das Gespräch oder die Einrichtung.",
    häufigkeit: "häufig",
    gegenargumente: [
      {
        id: "kurz_halten", strategie: "Wertschätzung + Termin", stärke: "mittel",
        text: "Das verstehe ich vollkommen, Sie sind ein vielbeschäftigter Betrieb! Genau deswegen übernehmen wir die Kundenakquise für Sie. Darf ich Sie zu einem besseren Zeitpunkt nochmal anrufen – 5 Minuten reichen?",
      },
      {
        id: "email", strategie: "Alternative Kontaktwege", stärke: "sanft",
        text: "Kein Problem! Ich schicke Ihnen eine kurze Zusammenfassung per Mail. Dann können Sie sich in Ruhe anschauen, was für Aufträge in Ihrer Region verfügbar sind.",
      },
    ],
  },
];

/* ── B2C Einwand-Datenbank ─────────────────────── */
const B2C_EINWAENDE: EinwandKategorie[] = [
  {
    id: "nur_schauen",
    name: "Will nur mal schauen",
    icon: HelpCircle,
    beschreibung: "Eigentümer hat kein konkretes Verkaufsinteresse, will sich nur informieren.",
    häufigkeit: "sehr häufig",
    gegenargumente: [
      {
        id: "unverbindlich", strategie: "Unverbindlichkeit betonen", stärke: "stark",
        text: "Absolut verständlich! Unsere kostenlose Bewertung ist völlig unverbindlich und gibt Ihnen eine solide Grundlage. Viele unserer Kunden wollten sich anfangs auch nur informieren und waren dann überrascht vom Marktwert.",
        beispiel: "\"Frau Schneider, genau dafür ist unser Service gedacht – Sie erhalten eine professionelle Einschätzung, ganz ohne Verpflichtung.\"",
      },
      {
        id: "marktwert", strategie: "Neugier wecken", stärke: "mittel",
        text: "Wussten Sie, dass viele Eigentümer den Wert ihrer Immobilie um 15-20% unterschätzen? Eine aktuelle Bewertung ist immer gut zu haben – ob für Verkauf, Vermietung oder die Steuererklärung.",
      },
    ],
  },
  {
    id: "schon_makler",
    name: "Habe schon einen Makler",
    icon: Users,
    beschreibung: "Eigentümer arbeitet bereits mit einem Makler zusammen.",
    häufigkeit: "häufig",
    gegenargumente: [
      {
        id: "zweitmeinung", strategie: "Zweite Meinung", stärke: "stark",
        text: "Kein Problem. Eine Zweitmeinung schadet nie und ist bei uns kostenlos. So haben Sie eine unabhängige Vergleichsbasis.",
        beispiel: "\"Eine zweite Einschätzung gibt Ihnen Sicherheit, dass der vereinbarte Preis stimmt – das ist absolut üblich.\"",
      },
    ],
  },
  {
    id: "keine_zeit_b2c",
    name: "Habe keine Zeit",
    icon: Clock,
    beschreibung: "Eigentümer hat gerade keine Zeit für das Gespräch.",
    häufigkeit: "häufig",
    gegenargumente: [
      {
        id: "termin", strategie: "Rückruf vereinbaren", stärke: "mittel",
        text: "Ich verstehe. Wann würde es Ihnen besser passen? Ich rufe gerne nochmal an – das dauert nur 5 Minuten.",
      },
    ],
  },
  {
    id: "zu_teuer_b2c",
    name: "Will nichts zahlen / kostenlos",
    icon: DollarSign,
    beschreibung: "Eigentümer befürchtet versteckte Kosten.",
    häufigkeit: "gelegentlich",
    gegenargumente: [
      {
        id: "kostenlos", strategie: "Kostenfreiheit betonen", stärke: "stark",
        text: "Unsere Bewertung und das Inserat sind für Sie komplett kostenlos – ohne versteckte Gebühren, ohne Provision. Wir finanzieren uns über unsere Partnerbetriebe.",
      },
    ],
  },
  {
    id: "datenschutz",
    name: "Datenschutz-Bedenken",
    icon: Shield,
    beschreibung: "Eigentümer will keine persönlichen Daten preisgeben.",
    häufigkeit: "gelegentlich",
    gegenargumente: [
      {
        id: "dsgvo", strategie: "DSGVO-Konformität", stärke: "stark",
        text: "Ihre Daten sind bei uns sicher. Wir sind DSGVO-konform und Ihre Informationen werden ausschließlich für die Immobilienbewertung verwendet. Sie können Ihre Daten jederzeit löschen lassen.",
      },
    ],
  },
];

/* ── Stärke Styles ─────────────────────────────── */
const STÄRKE_STYLES = {
  stark: { label: "Stark", color: "bg-success/10 text-success border-success/20" },
  mittel: { label: "Mittel", color: "bg-warning/10 text-warning border-warning/20" },
  sanft: { label: "Sanft", color: "bg-primary/10 text-primary border-primary/20" },
};

const HÄUFIGKEIT_STYLES = {
  "sehr häufig": "bg-destructive/10 text-destructive",
  "häufig": "bg-warning/10 text-warning",
  "gelegentlich": "bg-muted text-muted-foreground",
};

/* ── Component ─────────────────────────────────── */
interface EinwandbehandlungProps {
  type: "b2c" | "b2b";
  contactName: string;
  isLive?: boolean; // is currently in a call
}

export default function Einwandbehandlung({ type, contactName, isLive }: EinwandbehandlungProps) {
  const { toast } = useToast();
  const einwaende = type === "b2b" ? B2B_EINWAENDE : B2C_EINWAENDE;
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [freitext, setFreitext] = useState("");
  const [kiAntwort, setKiAntwort] = useState<string | null>(null);
  const [kiLoading, setKiLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [usedArgs, setUsedArgs] = useState<Set<string>>(new Set());

  const filtered = search.trim()
    ? einwaende.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.beschreibung.toLowerCase().includes(search.toLowerCase()) ||
        e.gegenargumente.some(g => g.text.toLowerCase().includes(search.toLowerCase()))
      )
    : einwaende;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "In Zwischenablage kopiert", description: "Gegenargument wurde kopiert." });
  };

  const markUsed = (id: string) => {
    setUsedArgs(prev => new Set(prev).add(id));
  };

  // Mock KI-Analyse für Freitext
  const analyzeFreitext = () => {
    if (!freitext.trim()) return;
    setKiLoading(true);
    // Simulate KI response (would be Lovable AI in production)
    setTimeout(() => {
      const responses: Record<string, string> = {
        default: `**Erkannter Einwand:** "${freitext}"\n\n**Empfohlene Strategie:** Empathie zeigen und Verständnis signalisieren, dann mit einem konkreten Mehrwert antworten.\n\n**Vorgeschlagene Antwort:**\n"Das verstehe ich vollkommen, ${contactName}. Genau deshalb möchte ich Ihnen zeigen, wie andere Betriebe in Ihrer Situation profitiert haben. Darf ich Ihnen ein konkretes Beispiel geben?"\n\n**Alternative:**\n"Das ist ein berechtigter Punkt. Lassen Sie mich kurz erklären, warum sich das für Sie trotzdem lohnen könnte..."`,
      };
      setKiAntwort(responses.default);
      setKiLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-card rounded-lg shadow-crm-sm border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-secondary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-display font-semibold text-foreground">
              Einwandbehandlung
            </h3>
            {isLive && (
              <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/20 gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Live
              </Badge>
            )}
          </div>
          <Badge variant="outline" className={`text-[10px] ${type === "b2c" ? "border-b2c/30 text-b2c" : "border-b2b/30 text-b2b"}`}>
            {type.toUpperCase()}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Gespräch mit <strong className="text-foreground">{contactName}</strong> – {einwaende.length} Einwand-Kategorien verfügbar
        </p>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Einwand suchen..."
            className="pl-9 h-8 text-xs"
          />
        </div>
      </div>

      {/* KI-Freitext Analyse */}
      <div className="p-3 border-b border-border/50 bg-primary/[0.02]">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">KI-Analyse</span>
        </div>
        <div className="flex gap-2">
          <Input
            value={freitext}
            onChange={e => setFreitext(e.target.value)}
            onKeyDown={e => e.key === "Enter" && analyzeFreitext()}
            placeholder="Kundeneinwand eintippen oder einfügen..."
            className="h-8 text-xs flex-1"
          />
          <Button size="sm" onClick={analyzeFreitext} disabled={!freitext.trim() || kiLoading}
            className="h-8 text-xs gradient-brand border-0 text-primary-foreground">
            {kiLoading ? <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" /> : <Zap className="h-3 w-3" />}
          </Button>
        </div>
        {kiAntwort && (
          <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-start justify-between gap-2">
              <div className="text-xs text-foreground whitespace-pre-line leading-relaxed flex-1">
                {kiAntwort.split("**").map((part, i) =>
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                )}
              </div>
              <button onClick={() => copyToClipboard(kiAntwort, "ki")} className="shrink-0 p-1 hover:bg-muted rounded transition-colors">
                {copiedId === "ki" ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Mock-Antwort – mit Lovable Cloud wird hier echte KI-Analyse aktiv
            </p>
          </div>
        )}
      </div>

      {/* Einwand-Kategorien */}
      <ScrollArea className="max-h-[500px]">
        <div className="divide-y divide-border/50">
          {filtered.map(einwand => {
            const isOpen = expandedId === einwand.id;
            const EIcon = einwand.icon;

            return (
              <div key={einwand.id}>
                <button
                  onClick={() => setExpandedId(isOpen ? null : einwand.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors ${isOpen ? "bg-background" : ""}`}
                >
                  <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <EIcon className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs font-semibold text-foreground">{einwand.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{einwand.beschreibung}</p>
                  </div>
                  <Badge variant="outline" className={`text-[9px] shrink-0 ${HÄUFIGKEIT_STYLES[einwand.häufigkeit]}`}>
                    {einwand.häufigkeit}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground shrink-0">{einwand.gegenargumente.length}</span>
                  {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3">
                    {einwand.gegenargumente.map(arg => {
                      const used = usedArgs.has(arg.id);
                      const stärke = STÄRKE_STYLES[arg.stärke];

                      return (
                        <div key={arg.id} className={`rounded-lg border p-3 transition-all ${used ? "border-success/30 bg-success/5" : "border-border"}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`text-[9px] ${stärke.color}`}>{stärke.label}</Badge>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{arg.strategie}</span>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => copyToClipboard(arg.text, arg.id)} className="p-1 hover:bg-muted rounded transition-colors" title="Kopieren">
                                {copiedId === arg.id ? <CheckCircle2 className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                              </button>
                              <button onClick={() => markUsed(arg.id)} className="p-1 hover:bg-muted rounded transition-colors" title="Als verwendet markieren">
                                {used ? <CheckCircle2 className="h-3 w-3 text-success" /> : <ThumbsUp className="h-3 w-3 text-muted-foreground" />}
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-foreground leading-relaxed">{arg.text}</p>
                          {arg.beispiel && (
                            <div className="mt-2 p-2 rounded bg-primary/[0.03] border border-primary/10">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1 flex items-center gap-1">
                                <Lightbulb className="h-3 w-3" /> Beispiel-Formulierung
                              </p>
                              <p className="text-xs text-foreground italic leading-relaxed">{arg.beispiel}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <Search className="h-6 w-6 mx-auto mb-2 opacity-40" />
              <p className="text-xs">Kein Einwand gefunden. Nutze die KI-Analyse oben.</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer hint */}
      <div className="p-3 border-t border-border bg-secondary/10">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <Video className="h-3.5 w-3.5" />
          <span>Zoom-Integration für Live-Meeting-Analyse verfügbar – <strong className="text-foreground">Lovable Cloud aktivieren</strong> für Echtzeit-Transkription.</span>
        </div>
      </div>
    </div>
  );
}
