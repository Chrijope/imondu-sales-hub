import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CRMLayout from "@/components/CRMLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GEWERK_OPTIONS } from "@/data/crm-data";
import type { Gewerk } from "@/data/crm-data";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Star,
  ChevronLeft,
  Building2,
  Calendar,
  Award,
  ExternalLink,
  LayoutGrid,
  List,
  MessageSquare,
  Shield,
  Wrench,
  CheckCircle2,
  Briefcase,
  Target,
  ThumbsUp,
  Sparkles,
  HeadphonesIcon,
} from "lucide-react";

// Profile images
import profil1 from "@/assets/entwickler/profil-1.jpg";
import profil2 from "@/assets/entwickler/profil-2.jpg";
import profil3 from "@/assets/entwickler/profil-3.jpg";
import profil4 from "@/assets/entwickler/profil-4.jpg";
import profil5 from "@/assets/entwickler/profil-5.jpg";
import profil6 from "@/assets/entwickler/profil-6.jpg";
import profil7 from "@/assets/entwickler/profil-7.jpg";
import profil8 from "@/assets/entwickler/profil-8.jpg";

// Company images
import firma1 from "@/assets/entwickler/firma-1.jpg";
import firma2 from "@/assets/entwickler/firma-2.jpg";
import firma3 from "@/assets/entwickler/firma-3.jpg";
import firma4 from "@/assets/entwickler/firma-4.jpg";

const profilBilder = [profil1, profil2, profil3, profil4, profil5, profil6, profil7, profil8];
const firmaBilder = [firma1, firma2, firma3, firma4];

interface Entwickler {
  id: string;
  firmenname: string;
  gewerk: Gewerk;
  kontaktperson: string;
  email: string;
  telefon: string;
  website: string;
  adresse: string;
  plz: string;
  ort: string;
  bundesland: string;
  mitarbeiter: string;
  gruendungsjahr: number;
  beschreibung: string;
  referenzen: string[];
  bewertung: number;
  projekte: number;
  status: "aktiv" | "inaktiv" | "neu";
  registriertAm: string;
  logoEmoji: string;
  imonduId: string;
  premiumPartner: boolean;
  // Extended fields for public profile
  leistungsTitel: string;
  leistungsBeschreibung: string;
  sanierungsarten: string[];
  objekttypen: string[];
  regionen: string[];
  zertifikate: string[];
  antwortzeit: string;
  erfolgsquote: number;
}

const SAMPLE_ENTWICKLER: Entwickler[] = [
  {
    id: "e1", firmenname: "Architektur Bauer GmbH", gewerk: "Architekt",
    kontaktperson: "Dr. Thomas Bauer", email: "bauer@architektur-bauer.de", telefon: "+49 30 9876543",
    website: "www.architektur-bauer.de", adresse: "Friedrichstr. 100", plz: "10117", ort: "Berlin",
    bundesland: "Berlin", mitarbeiter: "20-50", gruendungsjahr: 2008,
    beschreibung: "Preisgekröntes Architekturbüro mit Schwerpunkt auf nachhaltige Sanierung und energieeffizientes Bauen. Wir begleiten Eigentümer von der ersten Bestandsaufnahme bis zur schlüsselfertigen Sanierung.",
    referenzen: ["MFH-Sanierung Prenzlauer Berg", "Bürokomplex Mitte", "Denkmalschutz-Sanierung Charlottenburg"],
    bewertung: 4.8, projekte: 47, status: "aktiv", registriertAm: "2025-06-15", logoEmoji: "🏛️",
    imonduId: "135566873", premiumPartner: true,
    leistungsTitel: "Ganzheitliche Architektur & Sanierungsplanung",
    leistungsBeschreibung: "Von der Bestandsanalyse über die Entwurfsplanung bis zur Bauleitung – alles aus einer Hand. Spezialisiert auf energetische Sanierung und denkmalgeschützte Gebäude.",
    sanierungsarten: ["Komplettsanierung", "Dachsanierung", "Fassadensanierung", "Energieberatung"],
    objekttypen: ["Einfamilienhaus", "Mehrfamilienhaus", "Gewerbeobjekt"],
    regionen: ["Berlin", "Brandenburg"], zertifikate: ["DGNB Auditor", "Energieberater (dena)"],
    antwortzeit: "< 24h", erfolgsquote: 94,
  },
  {
    id: "e2", firmenname: "FensterPro AG", gewerk: "Fensterbauer",
    kontaktperson: "Sandra Meier", email: "meier@fensterpro.de", telefon: "+49 89 1112233",
    website: "www.fensterpro.de", adresse: "Industriestr. 42", plz: "81369", ort: "München",
    bundesland: "Bayern", mitarbeiter: "200-500", gruendungsjahr: 1995,
    beschreibung: "Marktführer für energieeffiziente Fenster- und Türsysteme. Zertifiziert nach DIN EN 14351. Über 25 Jahre Erfahrung in der Fenstermontage.",
    referenzen: ["Fenstertausch Wohnanlage Bogenhausen", "Gewerbeobjekt Garching", "EFH-Sanierung Starnberg"],
    bewertung: 4.6, projekte: 234, status: "aktiv", registriertAm: "2025-03-10", logoEmoji: "🪟",
    imonduId: "940787430", premiumPartner: true,
    leistungsTitel: "Energieeffiziente Fenster & Türen",
    leistungsBeschreibung: "Beratung, Lieferung und Montage von Fenstern und Türen aller Art. Dreifachverglasung, Schallschutz, Einbruchschutz. KfW-förderfähige Lösungen.",
    sanierungsarten: ["Fenstertausch", "WDVS / Dämmung"],
    objekttypen: ["Einfamilienhaus", "Mehrfamilienhaus", "Wohnung", "Gewerbeobjekt"],
    regionen: ["Bayern", "Baden-Württemberg"], zertifikate: ["RAL-Gütezeichen", "DIN EN 14351"],
    antwortzeit: "< 12h", erfolgsquote: 97,
  },
  {
    id: "e3", firmenname: "EnergyCheck Solutions", gewerk: "Energieberater",
    kontaktperson: "Michael Braun", email: "braun@energycheck.de", telefon: "+49 221 5556677",
    website: "www.energycheck.de", adresse: "Hohenzollernring 88", plz: "50672", ort: "Köln",
    bundesland: "Nordrhein-Westfalen", mitarbeiter: "10-50", gruendungsjahr: 2015,
    beschreibung: "Zertifizierte Energieberatung für Wohn- und Gewerbeimmobilien. iSFP, BEG-Anträge, Energieausweise. Wir helfen Ihnen, die maximale Förderung zu erhalten.",
    referenzen: ["iSFP MFH Ehrenfeld", "BEG-Beratung Düsseldorf", "Energieausweis Gewerbe Leverkusen"],
    bewertung: 4.9, projekte: 128, status: "aktiv", registriertAm: "2025-08-22", logoEmoji: "⚡",
    imonduId: "456044483", premiumPartner: true,
    leistungsTitel: "Energieberatung & Fördermitteloptimierung",
    leistungsBeschreibung: "Individuelle Sanierungsfahrpläne (iSFP), Energieausweise, BEG-Förderanträge. Wir maximieren Ihre Fördermittel und begleiten den gesamten Antragsprozess.",
    sanierungsarten: ["Energieberatung", "Komplettsanierung"],
    objekttypen: ["Einfamilienhaus", "Mehrfamilienhaus", "Wohnung"],
    regionen: ["NRW", "Hessen"], zertifikate: ["dena-Energieberater", "BAFA-gelistet", "KfW-Sachverständiger"],
    antwortzeit: "< 6h", erfolgsquote: 99,
  },
  {
    id: "e4", firmenname: "DachTech GmbH", gewerk: "Dachdecker",
    kontaktperson: "Eva Schulz", email: "schulz@dachtech.de", telefon: "+49 40 2223344",
    website: "www.dachtech.de", adresse: "Hafenweg 12", plz: "20457", ort: "Hamburg",
    bundesland: "Hamburg", mitarbeiter: "50-100", gruendungsjahr: 2001,
    beschreibung: "Dachsanierung, Dachbegrünung und Photovoltaik-Installation aus einer Hand.",
    referenzen: ["Dachsanierung Altona", "PV-Anlage Wandsbek", "Gründach Hafencity"],
    bewertung: 4.5, projekte: 89, status: "aktiv", registriertAm: "2025-04-18", logoEmoji: "🏗️",
    imonduId: "334008173", premiumPartner: true,
    leistungsTitel: "Dachsanierung & Photovoltaik",
    leistungsBeschreibung: "Komplette Dachsanierung inkl. Dämmung, Eindeckung und PV-Anlagen. Gründach-Lösungen für nachhaltige Gebäude.",
    sanierungsarten: ["Dachsanierung", "Photovoltaik", "WDVS / Dämmung"],
    objekttypen: ["Einfamilienhaus", "Mehrfamilienhaus", "Gewerbeobjekt"],
    regionen: ["Hamburg", "Niedersachsen"], zertifikate: ["Meisterbetrieb", "PV-Installateur (TÜV)"],
    antwortzeit: "< 24h", erfolgsquote: 92,
  },
  {
    id: "e5", firmenname: "SHK Meisterbetrieb Weber", gewerk: "SHK",
    kontaktperson: "Frank Weber", email: "weber@shk-weber.de", telefon: "+49 69 7778899",
    website: "www.shk-weber.de", adresse: "Gutleutstr. 55", plz: "60329", ort: "Frankfurt",
    bundesland: "Hessen", mitarbeiter: "10-20", gruendungsjahr: 2012,
    beschreibung: "Meisterbetrieb für Sanitär, Heizung, Klimatechnik. Spezialist für Wärmepumpen-Installation.",
    referenzen: ["Heizungstausch EFH Sachsenhausen", "Wärmepumpe MFH Bockenheim", "Bad-Sanierung Westend"],
    bewertung: 4.7, projekte: 62, status: "aktiv", registriertAm: "2025-01-08", logoEmoji: "🔧",
    imonduId: "474929011", premiumPartner: false,
    leistungsTitel: "Heizungstausch & Wärmepumpen",
    leistungsBeschreibung: "Wärmepumpen, Gas-Brennwert, Hybridheizungen. Fachgerechte Installation mit KfW-Förderung. Notdienst 24/7.",
    sanierungsarten: ["Heizungstausch", "Badsanierung"],
    objekttypen: ["Einfamilienhaus", "Mehrfamilienhaus", "Wohnung"],
    regionen: ["Hessen"], zertifikate: ["Meisterbetrieb HWK", "Wärmepumpen-Spezialist"],
    antwortzeit: "< 4h", erfolgsquote: 96,
  },
  {
    id: "e6", firmenname: "Elektro Schmidt GmbH", gewerk: "Elektriker",
    kontaktperson: "Jürgen Schmidt", email: "j.schmidt@elektro-schmidt.de", telefon: "+49 351 1234567",
    website: "www.elektro-schmidt.de", adresse: "Prager Str. 20", plz: "01069", ort: "Dresden",
    bundesland: "Sachsen", mitarbeiter: "20-50", gruendungsjahr: 1998,
    beschreibung: "Elektroinstallation, Smart-Home-Systeme und E-Mobility Ladeinfrastruktur.",
    referenzen: ["Smart Home Villa Blasewitz", "E-Ladepark Neustadt", "Elektro-Sanierung MFH Striesen"],
    bewertung: 4.4, projekte: 156, status: "aktiv", registriertAm: "2025-05-30", logoEmoji: "💡",
    imonduId: "829273853", premiumPartner: false,
    leistungsTitel: "Elektroinstallation & Smart Home",
    leistungsBeschreibung: "Komplette Elektrosanierung, Smart-Home-Integration, Wallbox-Installation. KNX-zertifiziert.",
    sanierungsarten: ["Elektrosanierung"],
    objekttypen: ["Einfamilienhaus", "Mehrfamilienhaus", "Gewerbeobjekt"],
    regionen: ["Sachsen"], zertifikate: ["KNX-Partner", "E-Mobility Fachbetrieb"],
    antwortzeit: "< 12h", erfolgsquote: 91,
  },
  {
    id: "e7", firmenname: "Maler Krause & Söhne", gewerk: "Maler",
    kontaktperson: "Andreas Krause", email: "krause@maler-krause.de", telefon: "+49 511 8889900",
    website: "www.maler-krause.de", adresse: "Lister Meile 33", plz: "30161", ort: "Hannover",
    bundesland: "Niedersachsen", mitarbeiter: "10-20", gruendungsjahr: 1985,
    beschreibung: "Traditioneller Malerbetrieb in 3. Generation. Innen- und Außenanstriche, Fassadensanierung, WDVS.",
    referenzen: ["Fassade MFH Linden", "Innenanstrich Büro List", "WDVS EFH Kirchrode"],
    bewertung: 4.3, projekte: 312, status: "aktiv", registriertAm: "2024-11-12", logoEmoji: "🎨",
    imonduId: "987590711", premiumPartner: false,
    leistungsTitel: "Fassadensanierung & WDVS",
    leistungsBeschreibung: "Innen- und Außenanstriche, Wärmedämmverbundsysteme, Fassadenrenovierung. Farbberatung inklusive.",
    sanierungsarten: ["Fassadensanierung", "WDVS / Dämmung"],
    objekttypen: ["Einfamilienhaus", "Mehrfamilienhaus"],
    regionen: ["Niedersachsen"], zertifikate: ["Meisterbetrieb", "Fachbetrieb WDVS"],
    antwortzeit: "< 48h", erfolgsquote: 88,
  },
  {
    id: "e8", firmenname: "Projektbau Süd GmbH", gewerk: "Projektentwickler",
    kontaktperson: "Robert Lang", email: "lang@projektbau-sued.de", telefon: "+49 711 6667788",
    website: "www.projektbau-sued.de", adresse: "Königstr. 10", plz: "70173", ort: "Stuttgart",
    bundesland: "Baden-Württemberg", mitarbeiter: "100-200", gruendungsjahr: 2003,
    beschreibung: "Projektentwicklung für Wohn- und Gewerbeimmobilien in Süddeutschland.",
    referenzen: ["Wohnquartier Stuttgart-Ost", "Gewerbecampus Böblingen", "MFH-Projekt Esslingen"],
    bewertung: 4.6, projekte: 28, status: "neu", registriertAm: "2026-02-05", logoEmoji: "🏢",
    imonduId: "973908996", premiumPartner: false,
    leistungsTitel: "Projektentwicklung & Bauträgertätigkeit",
    leistungsBeschreibung: "Komplette Projektentwicklung von der Grundstückssuche bis zur Vermarktung. Wohnquartiere, Gewerbeimmobilien und Mischprojekte.",
    sanierungsarten: ["Komplettsanierung"],
    objekttypen: ["Mehrfamilienhaus", "Gewerbeobjekt", "Mischobjekt"],
    regionen: ["Baden-Württemberg", "Bayern"], zertifikate: ["ISO 9001", "DGNB Gold"],
    antwortzeit: "< 24h", erfolgsquote: 95,
  },
];

const statusColors: Record<string, string> = {
  aktiv: "bg-success/10 text-success border-success/20",
  inaktiv: "bg-muted text-muted-foreground border-border",
  neu: "bg-primary/10 text-primary border-primary/20",
};

type GewerkFilter = "alle" | Gewerk;
type ViewMode = "grid" | "list";

const getProfilBild = (idx: number) => profilBilder[idx % profilBilder.length];
const getFirmaBild = (idx: number) => firmaBilder[idx % firmaBilder.length];

function EntwicklerDetail({ entwickler, idx, onBack }: { entwickler: Entwickler; idx: number; onBack: () => void }) {
  const navigate = useNavigate();
  const chatLink = `/chat?newChat=${encodeURIComponent(entwickler.firmenname)}&category=entwickler`;

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground gap-1 -ml-2">
        <ChevronLeft className="h-4 w-4" /> Zurück zur Übersicht
      </Button>

      {/* Profile Header */}
      <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
        <div className="h-48 relative overflow-hidden">
          <img src={getFirmaBild(idx)} alt={entwickler.firmenname} className="w-full h-full object-cover object-center" />
        </div>
        <div className="px-6 pb-6 relative">
          {/* Profile photo overlapping cover */}
          <div className="absolute -top-12 left-6">
            <img src={getProfilBild(idx)} alt={entwickler.kontaktperson} className="h-24 w-24 rounded-full border-4 border-card shadow-crm-md object-cover" />
          </div>
          <div className="pt-14 flex items-start justify-between flex-wrap gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-display font-bold text-foreground">{entwickler.kontaktperson}</h1>
                {entwickler.premiumPartner && (
                  <Badge variant="outline" className="text-[10px] border-foreground/30 font-bold"><span className="text-primary">Premium</span>Partner</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{entwickler.firmenname} · {entwickler.gewerk}</p>
              <p className="text-xs text-muted-foreground">{entwickler.ort}, {entwickler.bundesland}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-warning">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-lg font-bold text-foreground">{entwickler.bewertung}</span>
              </div>
              <Button onClick={() => navigate(chatLink)} className="gap-2 gradient-brand border-0 text-primary-foreground">
                <MessageSquare className="h-4 w-4" /> Chat starten
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Projekte", value: entwickler.projekte.toString(), icon: Briefcase },
          { label: "Bewertung", value: `${entwickler.bewertung}/5`, icon: Star },
          { label: "Antwortzeit", value: entwickler.antwortzeit, icon: Calendar },
          { label: "Erfolgsquote", value: `${entwickler.erfolgsquote}%`, icon: Target },
          { label: "Mitarbeiter", value: entwickler.mitarbeiter, icon: Users },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <s.icon className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-display font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Leistungsbeschreibung */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Leistungsbeschreibung</h2>
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">{entwickler.leistungsTitel}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{entwickler.leistungsBeschreibung}</p>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Sanierungsarten</p>
                <div className="flex flex-wrap gap-1.5">
                  {entwickler.sanierungsarten.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Objekttypen</p>
                <div className="flex flex-wrap gap-1.5">
                  {entwickler.objekttypen.map((o) => (
                    <Badge key={o} variant="outline" className="text-[10px]">{o}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Einzugsgebiet</p>
                <div className="flex flex-wrap gap-1.5">
                  {entwickler.regionen.map((r) => (
                    <Badge key={r} variant="outline" className="text-[10px] gap-1"><MapPin className="h-2.5 w-2.5" />{r}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Über das Unternehmen */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Über das Unternehmen</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{entwickler.beschreibung}</p>
          </div>

          {/* Referenzen */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Referenzprojekte</h2>
            </div>
            <div className="space-y-2">
              {entwickler.referenzen.map((ref, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Award className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{ref}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Zertifikate */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Zertifikate & Qualifikationen</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {entwickler.zertifikate.map((z) => (
                <div key={z} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20 text-xs">
                  <Shield className="h-3 w-3 text-success" />
                  <span className="text-foreground font-medium">{z}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Kontakt Card */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Kontakt</h2>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /><span>{entwickler.kontaktperson}</span></div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><a href={`mailto:${entwickler.email}`} className="text-primary hover:underline">{entwickler.email}</a></div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>{entwickler.telefon}</span></div>
              <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /><a href={`https://${entwickler.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">{entwickler.website} <ExternalLink className="h-3 w-3" /></a></div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">{entwickler.adresse}, {entwickler.plz} {entwickler.ort}</span></div>
            </div>
            <hr className="border-border" />
            <Button onClick={() => navigate(chatLink)} className="w-full gap-2 gradient-brand border-0 text-primary-foreground">
              <MessageSquare className="h-4 w-4" /> Jetzt kontaktieren
            </Button>
            <Button onClick={() => navigate("/helpdesk")} variant="outline" className="w-full gap-2 mt-2 text-xs">
              <HeadphonesIcon className="h-4 w-4" /> Expertensupport kontaktieren
            </Button>
          </div>

          {/* Auf einen Blick */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Auf einen Blick</h2>
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Gegründet</dt><dd className="font-medium text-foreground">{entwickler.gruendungsjahr}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Mitarbeiter</dt><dd className="font-medium text-foreground">{entwickler.mitarbeiter}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Gewerk</dt><dd className="font-medium text-foreground">{entwickler.gewerk}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Antwortzeit</dt><dd className="font-medium text-success">{entwickler.antwortzeit}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Erfolgsquote</dt><dd className="font-medium text-success">{entwickler.erfolgsquote}%</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Registriert</dt><dd className="text-foreground">{new Date(entwickler.registriertAm).toLocaleDateString("de-DE")}</dd></div>
            </dl>
          </div>

          <p className="text-[10px] text-muted-foreground text-center">IMONDU-ID: {entwickler.imonduId}</p>
        </div>
      </div>
    </div>
  );
}

export default function Entwickleruebersicht() {
  const [search, setSearch] = useState("");
  const [gewerkFilter, setGewerkFilter] = useState<GewerkFilter>("alle");
  const [standortFilter, setStandortFilter] = useState("alle");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const selectedIdx = SAMPLE_ENTWICKLER.findIndex((e) => e.id === selectedId);
  const selected = selectedIdx >= 0 ? SAMPLE_ENTWICKLER[selectedIdx] : null;

  const filtered = gewerkFilter === "alle"
    ? SAMPLE_ENTWICKLER
    : SAMPLE_ENTWICKLER.filter((e) => e.gewerk === gewerkFilter);

  const withStandort = standortFilter === "alle"
    ? filtered
    : filtered.filter((e) => e.ort === standortFilter);

  const searched = search.trim()
    ? withStandort.filter((e) =>
        e.firmenname.toLowerCase().includes(search.toLowerCase()) ||
        e.kontaktperson.toLowerCase().includes(search.toLowerCase()) ||
        e.ort.toLowerCase().includes(search.toLowerCase())
      )
    : withStandort;

  const usedGewerke = [...new Set(SAMPLE_ENTWICKLER.map((e) => e.gewerk))];
  const usedOrte = [...new Set(SAMPLE_ENTWICKLER.map((e) => e.ort))];

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in">
        {selected ? (
          <EntwicklerDetail entwickler={selected} idx={selectedIdx} onBack={() => setSelectedId(null)} />
        ) : (
          <>
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-10 h-1 rounded-full gradient-brand" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Entwicklerübersicht</h1>
              <p className="text-sm text-muted-foreground mt-1">Alle registrierten Entwicklungspartner & Gewerbebetriebe</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
                <p className="text-3xl font-display font-bold text-foreground">{SAMPLE_ENTWICKLER.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Entwickler gesamt</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
                <p className="text-3xl font-display font-bold text-success">{SAMPLE_ENTWICKLER.filter((e) => e.status === "aktiv").length}</p>
                <p className="text-xs text-muted-foreground mt-1">Aktiv</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
                <p className="text-3xl font-display font-bold text-foreground">{usedGewerke.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Gewerke</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
                <p className="text-3xl font-display font-bold text-foreground">
                  {SAMPLE_ENTWICKLER.reduce((s, e) => s + e.projekte, 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Projekte gesamt</p>
              </div>
            </div>

            {/* Search + Dropdown Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Firma, Kontakt oder Ort suchen…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={gewerkFilter} onValueChange={(v) => setGewerkFilter(v as GewerkFilter)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Berufsbezeichnung" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle Gewerke</SelectItem>
                  {usedGewerke.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={standortFilter} onValueChange={setStandortFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <SelectValue placeholder="Standort" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle Standorte</SelectItem>
                  {usedOrte.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1 ml-auto">
                <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}>
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}>
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {searched.map((e, i) => {
                  const globalIdx = SAMPLE_ENTWICKLER.indexOf(e);
                  return (
                    <div
                      key={e.id}
                      onClick={() => setSelectedId(e.id)}
                      className="bg-card rounded-xl shadow-crm-sm border border-border hover:shadow-crm-md hover:border-primary/20 transition-all cursor-pointer group overflow-hidden"
                    >
                      {/* Cover / Firmenbild */}
                      <div className="h-36 relative">
                        <img src={getFirmaBild(globalIdx)} alt={e.firmenname} className="w-full h-full object-cover" />
                        {/* Profilbild */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                          <img
                            src={getProfilBild(globalIdx)}
                            alt={e.kontaktperson}
                            className="h-16 w-16 rounded-full border-4 border-card shadow-md object-cover"
                          />
                        </div>
                        {/* Matching Score */}
                        {(() => {
                          const score = 65 + ((globalIdx * 17 + 3) % 30);
                          return (
                            <div className="absolute top-3 right-3 group/score">
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg backdrop-blur-sm text-[11px] font-bold cursor-help ${
                                score >= 85 ? "bg-success/90 text-white" :
                                score >= 70 ? "bg-warning/90 text-white" :
                                "bg-muted/90 text-foreground"
                              }`}>
                                <Sparkles className="h-3 w-3" />
                                {score}%
                              </div>
                              <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-lg p-3 shadow-lg text-xs text-foreground opacity-0 pointer-events-none group-hover/score:opacity-100 group-hover/score:pointer-events-auto transition-opacity z-50">
                                <p className="font-semibold mb-1">KI-Matching Score</p>
                                <p className="text-muted-foreground leading-relaxed">
                                  {score >= 85
                                    ? "Sehr hohe Übereinstimmung mit aktuellen Inseraten basierend auf Gewerk, Region, Objekttyp und Sanierungsart."
                                    : score >= 70
                                    ? "Gute Übereinstimmung – mehrere Inserate passen zum Leistungsprofil dieses Entwicklers."
                                    : "Moderate Übereinstimmung – wenige passende Inserate für dieses Profil verfügbar."}
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Content */}
                      <div className="pt-10 pb-4 px-4 text-center">
                        <h3 className="text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                          {e.kontaktperson}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{e.firmenname}</p>
                        <div className="flex items-center justify-center gap-1.5 mt-1.5">
                          <Badge variant="secondary" className="text-[10px]">{e.gewerk}</Badge>
                          {e.premiumPartner && (
                            <Badge variant="outline" className="text-[10px] border-foreground/30 font-bold">
                              <span className="text-primary">Premium</span>
                            </Badge>
                          )}
                        </div>

                        {/* Key stats for property owners */}
                        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border/60">
                          <div>
                            <p className="text-sm font-bold text-foreground">{e.projekte}</p>
                            <p className="text-[10px] text-muted-foreground">Projekte</p>
                          </div>
                          <div>
                            <div className="flex items-center justify-center gap-0.5">
                              <Star className="h-3 w-3 text-warning fill-warning" />
                              <p className="text-sm font-bold text-foreground">{e.bewertung}</p>
                            </div>
                            <p className="text-[10px] text-muted-foreground">Bewertung</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-success">{e.erfolgsquote}%</p>
                            <p className="text-[10px] text-muted-foreground">Erfolg</p>
                          </div>
                        </div>

                        {/* Location & response time */}
                        <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.ort}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{e.antwortzeit}</span>
                        </div>

                        {/* Top sanierungsarten tags */}
                        <div className="flex flex-wrap justify-center gap-1 mt-2.5">
                          {e.sanierungsarten.slice(0, 2).map((s) => (
                            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{s}</span>
                          ))}
                          {e.sanierungsarten.length > 2 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{e.sanierungsarten.length - 2}</span>
                          )}
                        </div>

                        <Button
                          size="sm"
                          className="w-full mt-3 gradient-brand border-0 text-primary-foreground text-xs"
                          onClick={(ev) => { ev.stopPropagation(); setSelectedId(e.id); }}
                        >
                          Profil ansehen
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground w-14">Bild</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Firma</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Gewerk</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Standort</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Bewertung</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Projekte</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searched.map((e) => {
                      const globalIdx = SAMPLE_ENTWICKLER.indexOf(e);
                      return (
                        <tr
                          key={e.id}
                          onClick={() => setSelectedId(e.id)}
                          className="border-b border-border/40 hover:bg-secondary/20 transition-colors cursor-pointer"
                        >
                          <td className="py-2 px-4">
                            <img src={getProfilBild(globalIdx)} alt="" className="w-10 h-10 rounded-full object-cover" />
                          </td>
                          <td className="py-3 px-4 font-medium">{e.kontaktperson}</td>
                          <td className="py-3 px-4 text-muted-foreground">{e.firmenname}</td>
                          <td className="py-3 px-4">{e.gewerk}</td>
                          <td className="py-3 px-4 text-muted-foreground text-xs">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.ort}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning fill-warning" />{e.bewertung}</span>
                          </td>
                          <td className="py-3 px-4 font-medium text-primary">{e.projekte}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className={`text-[10px] ${statusColors[e.status]}`}>{e.status}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {searched.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Building2 className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Keine Entwickler gefunden.</p>
              </div>
            )}
          </>
        )}
      </div>
    </CRMLayout>
  );
}
