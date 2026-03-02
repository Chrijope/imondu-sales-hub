import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2, Star, Search, ArrowRight, BarChart3, Home,
  MessageCircle, CheckCircle2, ClipboardList, MapPin, Phone,
  Mail, Award, HeadphonesIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getSupportUnreadCount } from "@/utils/support-notifications";
import InseratDetailEigentuemer, { EigentuemerInserat } from "@/components/InseratDetailEigentuemer";

// Mock inserate for the Eigentümer
const INITIAL_INSERATE: EigentuemerInserat[] = [
  {
    id: "ins-1",
    titel: "Einfamilienhaus Neubau",
    adresse: "Musterstraße 12, 80331 München",
    objekttyp: "Einfamilienhaus",
    status: "aktiv",
    baujahr: "2024",
    flaeche: "180 m²",
    sanierungsbedarf: "Keine – Neubau",
    zimmer: "6",
    beschreibung: "Moderner Neubau mit offener Raumgestaltung, bodentiefen Fenstern und großzügigem Garten. Energieeffizienzklasse A+.",
    entwicklungsabsicht: "Ja, offen für Vorschläge",
    zielNachEntwicklung: "Eigennutzung",
    zeitrahmen: "3-6 Monate",
    budgetRange: "50.000 – 100.000 €",
    wuensche: "Smart-Home-Integration und Photovoltaik-Anlage auf dem Dach.",
    stockwerke: "2",
    terrasse: "Ja – ca. 30 m²",
    balkon: "Ja – 2 Balkone",
    parkplatz: "Ja – Doppelgarage",
  },
  {
    id: "ins-2",
    titel: "Dachgeschoss-Sanierung",
    adresse: "Leopoldstraße 45, 80802 München",
    objekttyp: "Wohnung",
    status: "aktiv",
    baujahr: "1985",
    flaeche: "95 m²",
    sanierungsbedarf: "Dach, Dämmung, Elektro",
    zimmer: "4",
    beschreibung: "Dachgeschosswohnung in Bestlage mit Sanierungsbedarf. Großes Potenzial durch Ausbau und energetische Sanierung.",
    entwicklungsabsicht: "Ja, Kernsanierung geplant",
    zielNachEntwicklung: "Verkauf nach Entwicklung",
    zeitrahmen: "6-12 Monate",
    budgetRange: "150.000 – 300.000 €",
    wuensche: "Suche einen erfahrenen Entwickler, der das Projekt von der Planung bis zur Fertigstellung begleitet.",
    stockwerke: "1",
    terrasse: "Nein",
    balkon: "Ja – ca. 8 m²",
    parkplatz: "Ja – 1 Stellplatz",
  },
];

// Mock developers with matching scores
const MATCHING_DEVELOPERS = [
  { id: "e1", firma: "BauPlan München GmbH", gewerk: "Architekt", score: 97, bewertung: 4.9, projekte: 48, ort: "München", antwortzeit: "< 2h", matchGrund: "Spezialisiert auf Einfamilienhäuser, Top-Bewertung in München" },
  { id: "e2", firma: "Elektro Huber & Partner", gewerk: "Elektriker", score: 94, bewertung: 4.8, projekte: 62, ort: "München", antwortzeit: "< 4h", matchGrund: "Erfahrung mit Altbau-Sanierung, schnelle Antwortzeit" },
  { id: "e3", firma: "DachTech Bayern AG", gewerk: "Dachdecker", score: 91, bewertung: 4.7, projekte: 35, ort: "München", antwortzeit: "< 6h", matchGrund: "Dachsanierung-Spezialist, zertifiziert für Denkmalschutz" },
  { id: "e4", firma: "IsoTherm Süd GmbH", gewerk: "Dämmung", score: 89, bewertung: 4.6, projekte: 27, ort: "Augsburg", antwortzeit: "< 8h", matchGrund: "KfW-zertifiziert, Energieberater im Team" },
  { id: "e5", firma: "SaniPro München", gewerk: "Sanitär", score: 86, bewertung: 4.5, projekte: 41, ort: "München", antwortzeit: "< 4h", matchGrund: "Komplettbad-Spezialist, faire Preise" },
];

interface AnalyseErgebnis {
  timestamp: string;
  inseratId: string;
  energieeffizienz: string;
  sanierungskosten: string;
  wertsteigerung: string;
  empfehlungen: string[];
  gesamtbewertung: number;
}

const DEMO_ANALYSE: AnalyseErgebnis = {
  timestamp: new Date().toISOString(),
  inseratId: "ins-2",
  energieeffizienz: "D – Verbesserungspotenzial",
  sanierungskosten: "45.000 – 65.000 €",
  wertsteigerung: "+18–25 %",
  empfehlungen: [
    "Dachdämmung erneuern (Priorität 1)",
    "Fenster auf 3-fach-Verglasung umstellen",
    "Elektroinstallation modernisieren",
    "Heizungsanlage auf Wärmepumpe umrüsten",
  ],
  gesamtbewertung: 72,
};

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
  if (score >= 80) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-red-600 bg-red-50 border-red-200";
}

function getBewertungStars(rating: number) {
  return "★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "½" : "");
}

export default function EigentuemerDashboard() {
  const [inserate, setInserate] = useState(INITIAL_INSERATE);
  const [selectedInserat, setSelectedInserat] = useState(inserate[0]);
  const [detailInserat, setDetailInserat] = useState<EigentuemerInserat | null>(null);
  const [analyse, setAnalyse] = useState<AnalyseErgebnis | null>(null);
  const [supportUnread, setSupportUnread] = useState(0);

  useEffect(() => {
    const update = () => setSupportUnread(getSupportUnreadCount());
    update();
    const interval = setInterval(update, 2000);
    window.addEventListener("storage", update);
    return () => { clearInterval(interval); window.removeEventListener("storage", update); };
  }, []);

  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem("eigentuemer-analyse");
        if (saved) {
          setAnalyse(JSON.parse(saved));
        } else {
          localStorage.setItem("eigentuemer-analyse", JSON.stringify(DEMO_ANALYSE));
          setAnalyse(DEMO_ANALYSE);
        }
      } catch {
        setAnalyse(DEMO_ANALYSE);
      }
    };
    load();
    window.addEventListener("storage", load);
    window.addEventListener("focus", load);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("focus", load);
    };
  }, []);

  const handleUpdateInserat = (updated: EigentuemerInserat) => {
    setInserate(prev => prev.map(i => i.id === updated.id ? updated : i));
    setDetailInserat(updated);
    if (selectedInserat.id === updated.id) setSelectedInserat(updated);
  };

  const handleDeleteInserat = (id: string) => {
    setInserate(prev => prev.filter(i => i.id !== id));
    setDetailInserat(null);
    if (selectedInserat.id === id && inserate.length > 1) {
      setSelectedInserat(inserate.find(i => i.id !== id) || inserate[0]);
    }
  };

  // Show detail view if an inserat is selected for editing
  if (detailInserat) {
    return (
      <div className="p-6 lg:p-8 min-h-screen dashboard-mesh-bg">
        <InseratDetailEigentuemer
          inserat={detailInserat}
          onBack={() => setDetailInserat(null)}
          onUpdate={handleUpdateInserat}
          onDelete={handleDeleteInserat}
        />
      </div>
    );
  }

  const matchingDevs = MATCHING_DEVELOPERS.filter((d) => {
    if (selectedInserat.id === "ins-2") return true;
    return ["Architekt", "Sanitär", "Elektriker"].includes(d.gewerk);
  }).sort((a, b) => b.score - a.score);

  const analyseForSelected = analyse && analyse.inseratId === selectedInserat.id ? analyse : null;

  return (
    <div className="p-6 lg:p-8 space-y-5 animate-fade-in min-h-screen dashboard-mesh-bg">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-10 h-1 rounded-full gradient-brand" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">Mein Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Willkommen zurück! Hier sehen Sie alles rund um Ihre Immobilien. <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded ml-1">IMONDU-ID: IM-300000001</span></p>
      </div>

      {/* Inserat Selector */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-1 rounded-full gradient-brand" />
          <h2 className="text-sm font-semibold text-foreground">Meine Inserate</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {inserate.map((ins) => (
            <button
              key={ins.id}
              onClick={() => setDetailInserat(ins)}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                selectedInserat.id === ins.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{ins.titel}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {ins.adresse}
                  </p>
                </div>
                <Badge variant={ins.status === "aktiv" ? "default" : "secondary"} className="text-[10px]">
                  {ins.status === "entwpartner" ? "Partner gefunden" : ins.status === "entwickelt" ? "Entwickelt" : ins.status}
                </Badge>
              </div>
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                <span>{ins.objekttyp}</span>
                <span>·</span>
                <span>{ins.flaeche}</span>
                <span>·</span>
                <span>Bj. {ins.baujahr}</span>
              </div>
              <p className="text-[10px] text-accent mt-2 flex items-center gap-1">
                Klicken zum Bearbeiten <ArrowRight className="h-3 w-3" />
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Nachrichten & Angebote Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Chat-Nachrichten */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-1 rounded-full gradient-brand" />
            <h2 className="text-sm font-semibold text-foreground">Nachrichten</h2>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-foreground">4</p>
              <p className="text-xs text-muted-foreground">Ungelesene Chats</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { von: "BauPlan München GmbH", text: "Gerne sende ich Ihnen ein Angebot für die Dachsanierung…", zeit: "vor 2 Std.", ungelesen: true },
              { von: "Elektro Huber & Partner", text: "Vielen Dank für Ihre Anfrage. Wir können am Donnerstag…", zeit: "vor 5 Std.", ungelesen: true },
              { von: "DachTech Bayern AG", text: "Anbei unser überarbeitetes Angebot mit 5% Frühbucher-Rabatt.", zeit: "gestern", ungelesen: true },
              { von: "IsoTherm Süd GmbH", text: "Die Besichtigung ist für nächste Woche eingeplant.", zeit: "gestern", ungelesen: true },
            ].map((msg, i) => (
              <Link key={i} to="/chat" className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                  {msg.von.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground truncate">{msg.von}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{msg.zeit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{msg.text}</p>
                </div>
                {msg.ungelesen && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
              </Link>
            ))}
          </div>
          <Link to="/chat" className="flex items-center gap-1 text-xs text-accent font-medium mt-3 hover:underline">
            Alle Nachrichten <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Erhaltene Angebote */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-1 rounded-full gradient-brand" />
            <h2 className="text-sm font-semibold text-foreground">Erhaltene Angebote</h2>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-foreground">3</p>
              <p className="text-xs text-muted-foreground">Angebote erhalten</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { von: "BauPlan München GmbH", gewerk: "Architekt", betrag: "12.500 €", status: "Neu", zeit: "vor 1 Tag", statusColor: "bg-green-100 text-green-700" },
              { von: "DachTech Bayern AG", gewerk: "Dachdecker", betrag: "28.900 €", status: "Neu", zeit: "vor 2 Tagen", statusColor: "bg-green-100 text-green-700" },
              { von: "Elektro Huber & Partner", gewerk: "Elektriker", betrag: "8.750 €", status: "Angesehen", zeit: "vor 3 Tagen", statusColor: "bg-muted text-muted-foreground" },
            ].map((ang, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                  {ang.von.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-foreground truncate">{ang.von}</p>
                    <Badge variant="secondary" className="text-[10px]">{ang.gewerk}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold text-foreground">{ang.betrag}</span>
                    <span className="text-[10px] text-muted-foreground">· {ang.zeit}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ang.statusColor}`}>{ang.status}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 italic">Angebotsseite kommt in Kürze…</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Analyse-Ergebnis */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Analyse-Ergebnis</h2>
            </div>
            <Link to="/analysetool" className="text-xs text-accent hover:underline flex items-center gap-1">
              <BarChart3 className="h-3 w-3" /> Neu analysieren
            </Link>
          </div>

          {analyseForSelected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center text-lg font-bold border-2 ${getScoreColor(analyseForSelected.gesamtbewertung)}`}>
                  {analyseForSelected.gesamtbewertung}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Gesamtbewertung</p>
                  <p className="text-xs text-muted-foreground">
                    Letzte Analyse: {new Date(analyseForSelected.timestamp).toLocaleDateString("de-DE")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                  <span className="text-xs text-muted-foreground">Energieeffizienz</span>
                  <span className="text-xs font-medium text-foreground">{analyseForSelected.energieeffizienz}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                  <span className="text-xs text-muted-foreground">Sanierungskosten (geschätzt)</span>
                  <span className="text-xs font-medium text-foreground">{analyseForSelected.sanierungskosten}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                  <span className="text-xs text-muted-foreground">Wertsteigerung (Potenzial)</span>
                  <span className="text-xs font-medium text-green-600 font-semibold">{analyseForSelected.wertsteigerung}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground mb-2">Empfehlungen:</p>
                <ul className="space-y-1.5">
                  {analyseForSelected.empfehlungen.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Noch keine Analyse für dieses Inserat.</p>
              <Link to="/analysetool" className="text-xs text-accent hover:underline mt-2 inline-block">
                Jetzt Analyse starten →
              </Link>
            </div>
          )}
        </div>

        {/* Empfohlene Entwickler */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Empfohlene Entwickler</h2>
            </div>
            <Link to="/entwickler" className="text-xs text-accent hover:underline flex items-center gap-1">
              Alle ansehen <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Basierend auf <span className="font-medium text-foreground">{selectedInserat.titel}</span> – Matching-Score berechnet nach Gewerk, Standort & Bewertung
          </p>
          <div className="space-y-3">
            {matchingDevs.slice(0, 5).map((dev, i) => (
              <div key={dev.id} className="flex items-center gap-4 p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-all">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">{dev.firma}</p>
                    <Badge variant="secondary" className="text-[10px] shrink-0">{dev.gewerk}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{dev.matchGrund}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="text-amber-500">{getBewertungStars(dev.bewertung)} {dev.bewertung}</span>
                    <span>{dev.projekte} Projekte</span>
                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {dev.ort}</span>
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-sm font-bold border ${getScoreColor(dev.score)}`}>{dev.score}%</div>
                <div className="flex flex-col gap-1 shrink-0">
                  <Link to={`/chat?newChat=${encodeURIComponent(dev.firma)}&category=entwickler`} className="text-[11px] text-accent hover:underline flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> Kontakt
                  </Link>
                  <Link to={`/entwickler?dev=${dev.id}`} className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <ClipboardList className="h-3 w-3" /> Profil
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/entwickler" className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 group">
          <div className="h-11 w-11 rounded-full gradient-brand flex items-center justify-center">
            <Search className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground group-hover:text-accent transition-colors">Entwickler finden</span>
        </Link>
        <Link to="/analysetool" className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 group">
          <div className="h-11 w-11 rounded-full gradient-brand flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground group-hover:text-accent transition-colors">Immobilie analysieren</span>
        </Link>
        <Link to="/chat" className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 group">
          <div className="h-11 w-11 rounded-full gradient-brand flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground group-hover:text-accent transition-colors">Chat öffnen</span>
        </Link>
        <Link to="/support-ki" className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 group relative">
          {supportUnread > 0 && (
            <span className="absolute top-2 right-2 h-5 min-w-5 px-1 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
              {supportUnread}
            </span>
          )}
          <div className="h-11 w-11 rounded-full gradient-brand flex items-center justify-center">
            <HeadphonesIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground group-hover:text-accent transition-colors">Support kontaktieren</span>
        </Link>
      </div>
    </div>
  );
}
