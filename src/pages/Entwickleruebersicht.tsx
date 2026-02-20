import { useState } from "react";
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
}

const SAMPLE_ENTWICKLER: Entwickler[] = [
  {
    id: "e1", firmenname: "Architektur Bauer GmbH", gewerk: "Architekt",
    kontaktperson: "Dr. Thomas Bauer", email: "bauer@architektur-bauer.de", telefon: "+49 30 9876543",
    website: "www.architektur-bauer.de", adresse: "Friedrichstr. 100", plz: "10117", ort: "Berlin",
    bundesland: "Berlin", mitarbeiter: "20-50", gruendungsjahr: 2008,
    beschreibung: "Preisgekröntes Architekturbüro mit Schwerpunkt auf nachhaltige Sanierung und energieeffizientes Bauen.",
    referenzen: ["MFH-Sanierung Prenzlauer Berg", "Bürokomplex Mitte", "Denkmalschutz-Sanierung Charlottenburg"],
    bewertung: 4.8, projekte: 47, status: "aktiv", registriertAm: "2025-06-15", logoEmoji: "🏛️",
    imonduId: "135566873", premiumPartner: true,
  },
  {
    id: "e2", firmenname: "FensterPro AG", gewerk: "Fensterbauer",
    kontaktperson: "Sandra Meier", email: "meier@fensterpro.de", telefon: "+49 89 1112233",
    website: "www.fensterpro.de", adresse: "Industriestr. 42", plz: "81369", ort: "München",
    bundesland: "Bayern", mitarbeiter: "200-500", gruendungsjahr: 1995,
    beschreibung: "Marktführer für energieeffiziente Fenster- und Türsysteme. Zertifiziert nach DIN EN 14351.",
    referenzen: ["Fenstertausch Wohnanlage Bogenhausen", "Gewerbeobjekt Garching", "EFH-Sanierung Starnberg"],
    bewertung: 4.6, projekte: 234, status: "aktiv", registriertAm: "2025-03-10", logoEmoji: "🪟",
    imonduId: "940787430", premiumPartner: true,
  },
  {
    id: "e3", firmenname: "EnergyCheck Solutions", gewerk: "Energieberater",
    kontaktperson: "Michael Braun", email: "braun@energycheck.de", telefon: "+49 221 5556677",
    website: "www.energycheck.de", adresse: "Hohenzollernring 88", plz: "50672", ort: "Köln",
    bundesland: "Nordrhein-Westfalen", mitarbeiter: "10-50", gruendungsjahr: 2015,
    beschreibung: "Zertifizierte Energieberatung für Wohn- und Gewerbeimmobilien. iSFP, BEG-Anträge, Energieausweise.",
    referenzen: ["iSFP MFH Ehrenfeld", "BEG-Beratung Düsseldorf", "Energieausweis Gewerbe Leverkusen"],
    bewertung: 4.9, projekte: 128, status: "aktiv", registriertAm: "2025-08-22", logoEmoji: "⚡",
    imonduId: "456044483", premiumPartner: true,
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
  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground gap-1 -ml-2">
        <ChevronLeft className="h-4 w-4" /> Zurück zur Übersicht
      </Button>

      {/* Profile Header */}
      <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
        <div className="h-32 relative">
          <img src={getFirmaBild(idx)} alt={entwickler.firmenname} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end gap-4">
            <img
              src={getProfilBild(idx)}
              alt={entwickler.kontaktperson}
              className="h-20 w-20 rounded-full border-4 border-card shadow-crm-md object-cover"
            />
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-display font-bold text-foreground">{entwickler.firmenname}</h1>
                {entwickler.premiumPartner && (
                  <Badge variant="outline" className="text-[10px] border-foreground/30 font-bold">
                    <span className="text-primary">Premium</span>Partner
                  </Badge>
                )}
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
        </div>

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
                      </div>

                      {/* Content */}
                      <div className="pt-10 pb-5 px-4 text-center">
                        <h3 className="text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                          {e.kontaktperson}
                        </h3>
                        {e.premiumPartner && (
                          <Badge variant="outline" className="text-[10px] mt-1.5 border-foreground/30 font-bold">
                            <span className="text-primary">Premium</span>Partner
                          </Badge>
                        )}
                        <p className="text-xs text-muted-foreground mt-1.5">{e.gewerk}</p>
                        <p className="text-[11px] text-muted-foreground">{e.firmenname}</p>

                        <div className="mt-4">
                          <Button
                            size="sm"
                            className="gradient-brand border-0 text-primary-foreground text-xs"
                            onClick={(ev) => { ev.stopPropagation(); setSelectedId(e.id); }}
                          >
                            Kontaktanfrage
                          </Button>
                        </div>

                        <p className="text-[10px] text-muted-foreground mt-3">
                          IMONDU-ID: {e.imonduId}
                        </p>
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
