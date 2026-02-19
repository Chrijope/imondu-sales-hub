import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GEWERK_OPTIONS } from "@/data/crm-data";
import type { Gewerk } from "@/data/crm-data";
import {
  Search,
  Filter,
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
} from "lucide-react";

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
}

const SAMPLE_ENTWICKLER: Entwickler[] = [
  {
    id: "e1", firmenname: "Architektur Bauer GmbH", gewerk: "Architekt",
    kontaktperson: "Dr. Thomas Bauer", email: "bauer@architektur-bauer.de", telefon: "+49 30 9876543",
    website: "www.architektur-bauer.de", adresse: "Friedrichstr. 100", plz: "10117", ort: "Berlin",
    bundesland: "Berlin", mitarbeiter: "20-50", gruendungsjahr: 2008,
    beschreibung: "Preisgekröntes Architekturbüro mit Schwerpunkt auf nachhaltige Sanierung und energieeffizientes Bauen.",
    referenzen: ["MFH-Sanierung Prenzlauer Berg", "Bürokomplex Mitte", "Denkmalschutz-Sanierung Charlottenburg"],
    bewertung: 4.8, projekte: 47, status: "aktiv", registriertAm: "2025-06-15", logoEmoji: "🏛️"
  },
  {
    id: "e2", firmenname: "FensterPro AG", gewerk: "Fensterbauer",
    kontaktperson: "Sandra Meier", email: "meier@fensterpro.de", telefon: "+49 89 1112233",
    website: "www.fensterpro.de", adresse: "Industriestr. 42", plz: "81369", ort: "München",
    bundesland: "Bayern", mitarbeiter: "200-500", gruendungsjahr: 1995,
    beschreibung: "Marktführer für energieeffiziente Fenster- und Türsysteme. Zertifiziert nach DIN EN 14351.",
    referenzen: ["Fenstertausch Wohnanlage Bogenhausen", "Gewerbeobjekt Garching", "EFH-Sanierung Starnberg"],
    bewertung: 4.6, projekte: 234, status: "aktiv", registriertAm: "2025-03-10", logoEmoji: "🪟"
  },
  {
    id: "e3", firmenname: "EnergyCheck Solutions", gewerk: "Energieberater",
    kontaktperson: "Michael Braun", email: "braun@energycheck.de", telefon: "+49 221 5556677",
    website: "www.energycheck.de", adresse: "Hohenzollernring 88", plz: "50672", ort: "Köln",
    bundesland: "Nordrhein-Westfalen", mitarbeiter: "10-50", gruendungsjahr: 2015,
    beschreibung: "Zertifizierte Energieberatung für Wohn- und Gewerbeimmobilien. iSFP, BEG-Anträge, Energieausweise.",
    referenzen: ["iSFP MFH Ehrenfeld", "BEG-Beratung Düsseldorf", "Energieausweis Gewerbe Leverkusen"],
    bewertung: 4.9, projekte: 128, status: "aktiv", registriertAm: "2025-08-22", logoEmoji: "⚡"
  },
  {
    id: "e4", firmenname: "DachTech GmbH", gewerk: "Dachdecker",
    kontaktperson: "Eva Schulz", email: "schulz@dachtech.de", telefon: "+49 40 2223344",
    website: "www.dachtech.de", adresse: "Hafenweg 12", plz: "20457", ort: "Hamburg",
    bundesland: "Hamburg", mitarbeiter: "50-100", gruendungsjahr: 2001,
    beschreibung: "Dachsanierung, Dachbegrünung und Photovoltaik-Installation aus einer Hand.",
    referenzen: ["Dachsanierung Altona", "PV-Anlage Wandsbek", "Gründach Hafencity"],
    bewertung: 4.5, projekte: 89, status: "aktiv", registriertAm: "2025-04-18", logoEmoji: "🏗️"
  },
  {
    id: "e5", firmenname: "SHK Meisterbetrieb Weber", gewerk: "SHK",
    kontaktperson: "Frank Weber", email: "weber@shk-weber.de", telefon: "+49 69 7778899",
    website: "www.shk-weber.de", adresse: "Gutleutstr. 55", plz: "60329", ort: "Frankfurt",
    bundesland: "Hessen", mitarbeiter: "10-20", gruendungsjahr: 2012,
    beschreibung: "Meisterbetrieb für Sanitär, Heizung, Klimatechnik. Spezialist für Wärmepumpen-Installation.",
    referenzen: ["Heizungstausch EFH Sachsenhausen", "Wärmepumpe MFH Bockenheim", "Bad-Sanierung Westend"],
    bewertung: 4.7, projekte: 62, status: "aktiv", registriertAm: "2025-01-08", logoEmoji: "🔧"
  },
  {
    id: "e6", firmenname: "Elektro Schmidt GmbH", gewerk: "Elektriker",
    kontaktperson: "Jürgen Schmidt", email: "j.schmidt@elektro-schmidt.de", telefon: "+49 351 1234567",
    website: "www.elektro-schmidt.de", adresse: "Prager Str. 20", plz: "01069", ort: "Dresden",
    bundesland: "Sachsen", mitarbeiter: "20-50", gruendungsjahr: 1998,
    beschreibung: "Elektroinstallation, Smart-Home-Systeme und E-Mobility Ladeinfrastruktur.",
    referenzen: ["Smart Home Villa Blasewitz", "E-Ladepark Neustadt", "Elektro-Sanierung MFH Striesen"],
    bewertung: 4.4, projekte: 156, status: "aktiv", registriertAm: "2025-05-30", logoEmoji: "💡"
  },
  {
    id: "e7", firmenname: "Maler Krause & Söhne", gewerk: "Maler",
    kontaktperson: "Andreas Krause", email: "krause@maler-krause.de", telefon: "+49 511 8889900",
    website: "www.maler-krause.de", adresse: "Lister Meile 33", plz: "30161", ort: "Hannover",
    bundesland: "Niedersachsen", mitarbeiter: "10-20", gruendungsjahr: 1985,
    beschreibung: "Traditioneller Malerbetrieb in 3. Generation. Innen- und Außenanstriche, Fassadensanierung, WDVS.",
    referenzen: ["Fassade MFH Linden", "Innenanstrich Büro List", "WDVS EFH Kirchrode"],
    bewertung: 4.3, projekte: 312, status: "aktiv", registriertAm: "2024-11-12", logoEmoji: "🎨"
  },
  {
    id: "e8", firmenname: "Projektbau Süd GmbH", gewerk: "Projektentwickler",
    kontaktperson: "Robert Lang", email: "lang@projektbau-sued.de", telefon: "+49 711 6667788",
    website: "www.projektbau-sued.de", adresse: "Königstr. 10", plz: "70173", ort: "Stuttgart",
    bundesland: "Baden-Württemberg", mitarbeiter: "100-200", gruendungsjahr: 2003,
    beschreibung: "Projektentwicklung für Wohn- und Gewerbeimmobilien in Süddeutschland.",
    referenzen: ["Wohnquartier Stuttgart-Ost", "Gewerbecampus Böblingen", "MFH-Projekt Esslingen"],
    bewertung: 4.6, projekte: 28, status: "neu", registriertAm: "2026-02-05", logoEmoji: "🏢"
  },
];

const statusColors: Record<string, string> = {
  aktiv: "bg-success/10 text-success border-success/20",
  inaktiv: "bg-muted text-muted-foreground border-border",
  neu: "bg-primary/10 text-primary border-primary/20",
};

type GewerkFilter = "alle" | Gewerk;

function EntwicklerDetail({ entwickler, onBack }: { entwickler: Entwickler; onBack: () => void }) {
  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground gap-1 -ml-2">
        <ChevronLeft className="h-4 w-4" /> Zurück zur Übersicht
      </Button>

      {/* Profile Header */}
      <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
        <div className="h-24 gradient-brand relative" />
        <div className="px-6 pb-6 -mt-10">
          <div className="flex items-end gap-4">
            <div className="h-20 w-20 rounded-xl bg-card border-4 border-card shadow-crm-md flex items-center justify-center text-4xl">
              {entwickler.logoEmoji}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-display font-bold text-foreground">{entwickler.firmenname}</h1>
                <Badge variant="outline" className={`text-[10px] ${statusColors[entwickler.status]}`}>{entwickler.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{entwickler.gewerk} · {entwickler.ort}, {entwickler.bundesland}</p>
            </div>
            <div className="flex items-center gap-1 text-warning">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-bold text-foreground">{entwickler.bewertung}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Contact */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-1 rounded-full gradient-brand" />
            <h2 className="text-sm font-semibold text-foreground">Kontakt</h2>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{entwickler.kontaktperson}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${entwickler.email}`} className="text-primary hover:underline">{entwickler.email}</a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{entwickler.telefon}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a href={`https://${entwickler.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">{entwickler.website} <ExternalLink className="h-3 w-3" /></a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{entwickler.adresse}, {entwickler.plz} {entwickler.ort}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-1 rounded-full gradient-brand" />
            <h2 className="text-sm font-semibold text-foreground">Kennzahlen</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center bg-muted/30 rounded-lg p-3">
              <p className="text-2xl font-display font-bold text-foreground">{entwickler.projekte}</p>
              <p className="text-[11px] text-muted-foreground">Projekte</p>
            </div>
            <div className="text-center bg-muted/30 rounded-lg p-3">
              <p className="text-2xl font-display font-bold text-foreground flex items-center justify-center gap-1">
                <Star className="h-4 w-4 text-warning fill-warning" /> {entwickler.bewertung}
              </p>
              <p className="text-[11px] text-muted-foreground">Bewertung</p>
            </div>
            <div className="text-center bg-muted/30 rounded-lg p-3">
              <p className="text-2xl font-display font-bold text-foreground">{entwickler.mitarbeiter}</p>
              <p className="text-[11px] text-muted-foreground">Mitarbeiter</p>
            </div>
            <div className="text-center bg-muted/30 rounded-lg p-3">
              <p className="text-2xl font-display font-bold text-foreground">{entwickler.gruendungsjahr}</p>
              <p className="text-[11px] text-muted-foreground">Gegründet</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <Calendar className="h-3 w-3" />
            Registriert am {new Date(entwickler.registriertAm).toLocaleDateString("de-DE")}
          </div>
        </div>

        {/* Referenzen */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-1 rounded-full gradient-brand" />
            <h2 className="text-sm font-semibold text-foreground">Referenzen</h2>
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
      </div>

      {/* Description */}
      <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-1 rounded-full gradient-brand" />
          <h2 className="text-sm font-semibold text-foreground">Über das Unternehmen</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{entwickler.beschreibung}</p>
      </div>
    </div>
  );
}

export default function Entwickleruebersicht() {
  const [search, setSearch] = useState("");
  const [gewerkFilter, setGewerkFilter] = useState<GewerkFilter>("alle");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = SAMPLE_ENTWICKLER.find((e) => e.id === selectedId);

  const filtered = gewerkFilter === "alle"
    ? SAMPLE_ENTWICKLER
    : SAMPLE_ENTWICKLER.filter((e) => e.gewerk === gewerkFilter);

  const searched = search.trim()
    ? filtered.filter((e) =>
        e.firmenname.toLowerCase().includes(search.toLowerCase()) ||
        e.kontaktperson.toLowerCase().includes(search.toLowerCase()) ||
        e.ort.toLowerCase().includes(search.toLowerCase())
      )
    : filtered;

  // Unique gewerke in the data
  const usedGewerke = [...new Set(SAMPLE_ENTWICKLER.map((e) => e.gewerk))];

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in">
        {selected ? (
          <EntwicklerDetail entwickler={selected} onBack={() => setSelectedId(null)} />
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

            {/* Search + Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Firma, Kontakt oder Ort suchen…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Button variant={gewerkFilter === "alle" ? "default" : "outline"} size="sm" className={gewerkFilter === "alle" ? "gradient-brand border-0 text-primary-foreground" : ""} onClick={() => setGewerkFilter("alle")}>
                  Alle
                </Button>
                {usedGewerke.map((g) => (
                  <Button key={g} variant={gewerkFilter === g ? "default" : "outline"} size="sm" className={gewerkFilter === g ? "gradient-brand border-0 text-primary-foreground" : ""} onClick={() => setGewerkFilter(g)}>
                    {g}
                  </Button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {searched.map((e) => (
                <div
                  key={e.id}
                  onClick={() => setSelectedId(e.id)}
                  className="bg-card rounded-xl shadow-crm-sm border border-border hover:shadow-crm-md hover:border-primary/20 transition-all cursor-pointer group p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center text-2xl shrink-0">{e.logoEmoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors truncate">{e.firmenname}</h3>
                        <Badge variant="outline" className={`text-[10px] shrink-0 ${statusColors[e.status]}`}>{e.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{e.gewerk}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{e.beschreibung}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.ort}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {e.mitarbeiter}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning fill-warning" /> {e.bewertung}</span>
                    <span className="font-medium text-primary">{e.projekte} Projekte</span>
                  </div>
                </div>
              ))}
            </div>

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
