import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home, MessageCircle, ArrowRight, Search, MapPin, Star,
  ClipboardList, HardHat, Phone, HeadphonesIcon, Award,
  CheckCircle2, TrendingUp, Users, BotMessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getSupportUnreadCount } from "@/utils/support-notifications";
import EntwicklerProfilBearbeiten from "@/components/EntwicklerProfilBearbeiten";

// Mock developer profile
const ENTWICKLER_PROFIL = {
  firma: "Elektro Huber & Partner",
  gewerk: "Elektriker",
  inhaber: "Thomas Huber",
  ort: "München",
  plz: "80331",
  telefon: "+49 89 123 456 78",
  email: "info@elektro-huber.de",
  website: "www.elektro-huber.de",
  mitgliedschaft: "Premium",
  mitgliedSeit: "März 2025",
  bewertung: 4.8,
  projekte: 62,
  antwortzeit: "< 4h",
  erfolgsquote: "91%",
  zertifikate: ["Meisterbetrieb", "KfW-zertifiziert", "E-Check Partner"],
  leistungen: ["Elektroinstallation", "Smart Home", "Photovoltaik", "E-Ladestation"],
};

// Mock matching inserate for this developer
const MATCHING_INSERATE = [
  { id: "ins-m1", titel: "Dachgeschoss-Sanierung", adresse: "Leopoldstraße 45, 80802 München", objekttyp: "Wohnung", eigentuemer: "Hans Müller", score: 96, bedarf: "Elektroinstallation komplett erneuern", flaeche: "95 m²", matchGrund: "Elektro-Sanierung gesucht, Ihr Standort München passt perfekt" },
  { id: "ins-m2", titel: "Einfamilienhaus Neubau", adresse: "Musterstraße 12, 80331 München", objekttyp: "Einfamilienhaus", eigentuemer: "Maria Schneider", score: 93, bedarf: "Komplette Elektroplanung + Smart Home", flaeche: "180 m²", matchGrund: "Smart-Home-Spezialist gesucht, Neubau in Ihrem Einzugsgebiet" },
  { id: "ins-m3", titel: "Bürogebäude Modernisierung", adresse: "Schwanthalerstr. 90, 80336 München", objekttyp: "Gewerbe", eigentuemer: "Peter König", score: 88, bedarf: "Elektro-Modernisierung, Beleuchtungskonzept", flaeche: "420 m²", matchGrund: "Gewerbe-Elektrik Erfahrung, zertifizierter E-Check Partner" },
  { id: "ins-m4", titel: "Mehrfamilienhaus Sanierung", adresse: "Balanstraße 22, 81669 München", objekttyp: "Mehrfamilienhaus", eigentuemer: "Immobilien Verwaltung GmbH", score: 85, bedarf: "Zählerschrank erneuern, E-Check für 8 Einheiten", flaeche: "650 m²", matchGrund: "E-Check Spezialist, Erfahrung mit MFH" },
];

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
  if (score >= 80) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-red-600 bg-red-50 border-red-200";
}

export default function EntwicklerDashboard() {
  const profil = ENTWICKLER_PROFIL;
  const [supportUnread, setSupportUnread] = useState(0);
  const [showProfilEdit, setShowProfilEdit] = useState(false);

  useEffect(() => {
    const update = () => setSupportUnread(getSupportUnreadCount());
    update();
    const interval = setInterval(update, 2000);
    window.addEventListener("storage", update);
    return () => { clearInterval(interval); window.removeEventListener("storage", update); };
  }, []);

  // Show profile edit view
  if (showProfilEdit) {
    return (
      <div className="p-6 lg:p-8 min-h-screen dashboard-mesh-bg">
        <EntwicklerProfilBearbeiten onBack={() => setShowProfilEdit(false)} />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-5 animate-fade-in min-h-screen dashboard-mesh-bg">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-10 h-1 rounded-full gradient-brand" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">Entwickler-Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Willkommen zurück, {profil.inhaber}! Hier ist Ihr Überblick.</p>
      </div>

      {/* Profil-Übersicht - now clickable */}
      <button
        onClick={() => setShowProfilEdit(true)}
        className="w-full text-left glass-card rounded-2xl p-5 hover:border-primary/30 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-1 rounded-full gradient-brand" />
          <h2 className="text-sm font-semibold text-foreground">Ihr Profil</h2>
          <Badge variant="default" className="ml-auto text-[10px]">{profil.mitgliedschaft}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Firmendaten */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <HardHat className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{profil.firma}</p>
                <p className="text-xs text-muted-foreground">{profil.gewerk} · {profil.inhaber} · <span className="font-mono">IM-829273853</span></p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-3 w-3" /> {profil.plz} {profil.ort}
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="h-3 w-3" /> {profil.telefon}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profil.zertifikate.map((z) => (
                <Badge key={z} variant="outline" className="text-[10px] gap-1">
                  <Award className="h-2.5 w-2.5" /> {z}
                </Badge>
              ))}
            </div>
          </div>
          {/* Right: KPIs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{profil.bewertung}</p>
              <p className="text-[10px] text-muted-foreground">⭐ Bewertung</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{profil.projekte}</p>
              <p className="text-[10px] text-muted-foreground">Projekte</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{profil.antwortzeit}</p>
              <p className="text-[10px] text-muted-foreground">⌀ Antwortzeit</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{profil.erfolgsquote}</p>
              <p className="text-[10px] text-muted-foreground">Erfolgsquote</p>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Leistungen:</p>
            <div className="flex flex-wrap gap-1.5">
              {profil.leistungen.map((l) => (
                <Badge key={l} variant="secondary" className="text-[10px]">{l}</Badge>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-accent flex items-center gap-1 shrink-0 ml-4">
            Profil bearbeiten <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </button>

      {/* Nachrichten & Anfragen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-1 rounded-full gradient-brand" />
            <h2 className="text-sm font-semibold text-foreground">Nachrichten von Eigentümern</h2>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-foreground">3</p>
              <p className="text-xs text-muted-foreground">Ungelesene Nachrichten</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { von: "Hans Müller", text: "Können Sie sich die Elektrik in meiner Wohnung anschauen?", zeit: "vor 1 Std.", inserat: "Dachgeschoss-Sanierung" },
              { von: "Maria Schneider", text: "Ich hätte gerne ein Angebot für die Smart-Home-Installation.", zeit: "vor 3 Std.", inserat: "Einfamilienhaus Neubau" },
              { von: "Peter König", text: "Wann könnten Sie zur Besichtigung kommen?", zeit: "gestern", inserat: "Bürogebäude Modernisierung" },
            ].map((msg, i) => (
              <Link key={i} to="/chat" className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                  {msg.von.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground truncate">{msg.von}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{msg.zeit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{msg.text}</p>
                  <p className="text-[10px] text-primary/70 mt-0.5">↳ {msg.inserat}</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
              </Link>
            ))}
          </div>
          <Link to="/chat" className="flex items-center gap-1 text-xs text-accent font-medium mt-3 hover:underline">
            Alle Nachrichten <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-1 rounded-full gradient-brand" />
            <h2 className="text-sm font-semibold text-foreground">Kontaktanfragen</h2>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-foreground">5</p>
              <p className="text-xs text-muted-foreground">Anfragen diesen Monat</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-foreground">2</p>
              <p className="text-[10px] text-muted-foreground">Angebote angefragt</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-foreground">3</p>
              <p className="text-[10px] text-muted-foreground">Chat-Kontakte</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-green-600">1</p>
              <p className="text-[10px] text-muted-foreground">Auftrag erhalten</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-foreground">4.8</p>
              <p className="text-[10px] text-muted-foreground">⌀ Bewertung</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empfohlene Inserate */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 rounded-full gradient-brand" />
            <h2 className="text-sm font-semibold text-foreground">Empfohlene Inserate</h2>
          </div>
          <Link to="/inserate" className="text-xs text-accent hover:underline flex items-center gap-1">
            Alle Inserate <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Inserate passend zu Ihrem Gewerk <span className="font-medium text-foreground">{profil.gewerk}</span> und Standort <span className="font-medium text-foreground">{profil.ort}</span>
        </p>
        <div className="space-y-3">
          {MATCHING_INSERATE.map((ins, i) => (
            <div key={ins.id} className="flex items-center gap-4 p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-all">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{ins.titel}</p>
                  <Badge variant="secondary" className="text-[10px] shrink-0">{ins.objekttyp}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {ins.adresse}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{ins.matchGrund}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>Bedarf: <span className="text-foreground font-medium">{ins.bedarf}</span></span>
                  <span>· {ins.flaeche}</span>
                </div>
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-sm font-bold border ${getScoreColor(ins.score)}`}>{ins.score}%</div>
              <div className="flex flex-col gap-1 shrink-0">
                <Link to={`/chat?newChat=${encodeURIComponent(ins.eigentuemer)}&category=eigentuemer`} className="text-[11px] text-accent hover:underline flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" /> Kontaktieren
                </Link>
                <Link to="/inserate" className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <ClipboardList className="h-3 w-3" /> Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/inserate" className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 group">
          <div className="h-11 w-11 rounded-full gradient-brand flex items-center justify-center">
            <Search className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground group-hover:text-accent transition-colors">Inserate finden</span>
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
        <button onClick={() => setShowProfilEdit(true)} className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 group">
          <div className="h-11 w-11 rounded-full gradient-brand flex items-center justify-center">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground group-hover:text-accent transition-colors">Mein Profil</span>
        </button>
      </div>
    </div>
  );
}
