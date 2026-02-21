import { useState, useMemo, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CRMLayout from "@/components/CRMLayout";
import InseratFunnel from "@/components/InseratFunnel";
import { SAMPLE_LEADS, B2C_PIPELINE_STAGES } from "@/data/crm-data";
import type { Lead, Objekttyp, Sanierungsstatus } from "@/data/crm-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Home,
  MapPin,
  Calendar,
  Ruler,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  LayoutGrid,
  List,
  Pencil,
  Map,
  Sparkles,
} from "lucide-react";

// Images
import efh1 from "@/assets/inserate/einfamilienhaus-1.jpg";
import efh2 from "@/assets/inserate/einfamilienhaus-2.jpg";
import mfh1 from "@/assets/inserate/mehrfamilienhaus-1.jpg";
import mfh2 from "@/assets/inserate/mehrfamilienhaus-2.jpg";
import woh1 from "@/assets/inserate/wohnung-1.jpg";
import woh2 from "@/assets/inserate/wohnung-2.jpg";

const propertyImages: Record<string, string[]> = {
  Einfamilienhaus: [efh1, efh2],
  Mehrfamilienhaus: [mfh1, mfh2],
  Wohnung: [woh1, woh2],
  Gewerbeobjekt: [mfh1],
  Grundstück: [efh2],
  Mischobjekt: [mfh2],
};

const getImage = (typ: string, id: string) => {
  const imgs = propertyImages[typ] || [efh1];
  const idx = id.charCodeAt(id.length - 1) % imgs.length;
  return imgs[idx];
};

// Types
type InseratStatus = "aktiv" | "entwurf" | "pausiert" | "abgelaufen";

interface Inserat {
  id: string;
  leadId: string;
  eigentuemerName: string;
  objekttyp: Objekttyp;
  titel: string;
  adresse: string;
  baujahr: number;
  wohnflaeche: number;
  grundstuecksflaeche?: number;
  anzahlEinheiten?: number;
  zimmer?: number;
  vermietet?: boolean;
  sanierungsstatus: Sanierungsstatus;
  status: InseratStatus;
  objektNr: string;
  erstelltAm: string;
  aktualisiertAm: string;
  aufrufe: number;
  anfragen: number;
  beschreibung: string;
  tags: string[];
  lat: number;
  lng: number;
  matchingScore?: number;
}
// City coordinates for DACH region
const CITY_COORDS: Record<string, [number, number]> = {
  Berlin: [52.52, 13.405], München: [48.137, 11.576], Hamburg: [53.551, 9.994],
  Stuttgart: [48.776, 9.183], Köln: [50.938, 6.96], Frankfurt: [50.11, 8.682],
  Dresden: [51.051, 13.738], Hannover: [52.376, 9.738], Wien: [48.208, 16.373],
  Zürich: [47.377, 8.542], Salzburg: [47.811, 13.055], Bern: [46.948, 7.448],
};

const getCoordsFromAddress = (adresse: string): [number, number] => {
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (adresse.includes(city)) return coords;
  }
  // Random DACH position
  return [48.5 + Math.random() * 4, 8 + Math.random() * 6];
};

const generateInserate = (): Inserat[] => {
  const b2cLeads = SAMPLE_LEADS.filter((l) => l.type === "b2c");
  const inserate: Inserat[] = [];

  b2cLeads.forEach((lead) => {
    if (lead.status === "b2c_inserat" || lead.status === "b2c_registered") {
      const addr = lead.objektAdresse || lead.address || "";
      const [lat, lng] = getCoordsFromAddress(addr);
      inserate.push({
        id: `ins-${lead.id}`,
        leadId: lead.id,
        eigentuemerName: `${lead.firstName} ${lead.lastName}`,
        objekttyp: lead.objekttyp || "Einfamilienhaus",
        titel: lead.notes || "Immobilie mit Potenzial",
        adresse: addr,
        baujahr: lead.baujahr || 2000,
        wohnflaeche: lead.wohnflaeche || 100,
        grundstuecksflaeche: lead.grundstuecksflaeche,
        anzahlEinheiten: lead.anzahlEinheiten,
        zimmer: Math.floor(Math.random() * 6) + 2,
        vermietet: Math.random() > 0.5,
        sanierungsstatus: lead.sanierungsstatus || "Unsaniert",
        status: lead.status === "b2c_inserat" ? "aktiv" : "entwurf",
        objektNr: `${4000000 + Math.floor(Math.random() * 100000)}`,
        erstelltAm: lead.createdAt,
        aktualisiertAm: lead.updatedAt,
        aufrufe: Math.floor(Math.random() * 500) + 50,
        anfragen: Math.floor(Math.random() * 20) + 1,
        beschreibung: lead.notes || "Immobilie des Eigentümers.",
        tags: [lead.objekttyp || "Haus", "Immobilienverkauf", "Immobilienbestand"],
        matchingScore: Math.floor(Math.random() * 35) + 60,
        lat, lng,
      });
    }
  });

  // Demo inserate
  inserate.push(
    {
      id: "ins-demo-1", leadId: "1", eigentuemerName: "Anna Schmidt",
      objekttyp: "Einfamilienhaus",
      titel: "Bestandshaus mit großem Potenzial in zentraler Lage von Berlin",
      adresse: "Berliner Str. 12, 10115 Berlin", baujahr: 1978, wohnflaeche: 145,
      grundstuecksflaeche: 420, zimmer: 6, vermietet: false,
      sanierungsstatus: "Unsaniert", status: "aktiv", objektNr: "4055299",
      erstelltAm: "2026-01-15", aktualisiertAm: "2026-02-18",
      aufrufe: 342, anfragen: 12,
      beschreibung: "Freistehendes EFH in ruhiger Lage. Sanierungsbedarf vorhanden.",
      tags: ["Haus", "Immobilienverkauf", "Immobilienbestand"],
      matchingScore: 92,
      lat: 52.52, lng: 13.405,
    },
    {
      id: "ins-demo-2", leadId: "3", eigentuemerName: "Peter Klein",
      objekttyp: "Mehrfamilienhaus",
      titel: "MFH mit 6 Einheiten, teilsaniert in München",
      adresse: "Münchner Weg 5, 80331 München", baujahr: 1965, wohnflaeche: 480,
      anzahlEinheiten: 6, zimmer: 11, vermietet: true,
      sanierungsstatus: "Teilsaniert", status: "aktiv", objektNr: "4055300",
      erstelltAm: "2026-01-22", aktualisiertAm: "2026-02-17",
      aufrufe: 518, anfragen: 18,
      beschreibung: "MFH mit 6 Einheiten, teilsaniert.",
      tags: ["Mehrfamilienhaus", "Immobilienverkauf"],
      matchingScore: 87,
      lat: 48.137, lng: 11.576,
    },
    {
      id: "ins-demo-3", leadId: "5", eigentuemerName: "Maria Hoffmann",
      objekttyp: "Wohnung",
      titel: "ETW in bester Lage an der Elbchaussee",
      adresse: "Elbchaussee 88, 22763 Hamburg", baujahr: 1992, wohnflaeche: 95,
      zimmer: 3, vermietet: false,
      sanierungsstatus: "Teilsaniert", status: "pausiert", objektNr: "4055301",
      erstelltAm: "2026-02-01", aktualisiertAm: "2026-02-10",
      aufrufe: 89, anfragen: 3,
      beschreibung: "ETW in bester Lage.",
      tags: ["Wohnung", "Immobilienbestand"],
      matchingScore: 74,
      lat: 53.551, lng: 9.994,
    },
    {
      id: "ins-demo-4", leadId: "11", eigentuemerName: "Thomas Meier",
      objekttyp: "Mehrfamilienhaus",
      titel: "MFH im Zentrum mit großem Sanierungspotenzial",
      adresse: "Schillerstr. 15, 70173 Stuttgart", baujahr: 1955, wohnflaeche: 320,
      anzahlEinheiten: 4, zimmer: 8, vermietet: true,
      sanierungsstatus: "Unsaniert", status: "entwurf", objektNr: "4055302",
      erstelltAm: "2026-02-17", aktualisiertAm: "2026-02-19",
      aufrufe: 0, anfragen: 0,
      beschreibung: "MFH im Zentrum, komplett unsaniert.",
      tags: ["Mehrfamilienhaus", "Immobilienbestand"],
      matchingScore: 95,
      lat: 48.776, lng: 9.183,
    },
    {
      id: "ins-demo-5", leadId: "9", eigentuemerName: "Sophie Becker",
      objekttyp: "Wohnung",
      titel: "Moderne ETW, vollsaniert in Köln",
      adresse: "Venloer Str. 200, 50823 Köln", baujahr: 2005, wohnflaeche: 72,
      zimmer: 2, vermietet: false,
      sanierungsstatus: "Vollsaniert", status: "abgelaufen", objektNr: "4055303",
      erstelltAm: "2025-12-10", aktualisiertAm: "2026-01-10",
      aufrufe: 210, anfragen: 7,
      beschreibung: "Moderne ETW, vollsaniert.",
      tags: ["Wohnung", "Energieberatung"],
      matchingScore: 63,
      lat: 50.938, lng: 6.96,
    },
    {
      id: "ins-demo-6", leadId: "1", eigentuemerName: "Karl Huber",
      objekttyp: "Gewerbeobjekt",
      titel: "Bürogebäude in Wien-Innere Stadt",
      adresse: "Kärntner Ring 5, 1010 Wien", baujahr: 1990, wohnflaeche: 850,
      zimmer: 12, vermietet: true,
      sanierungsstatus: "Teilsaniert", status: "aktiv", objektNr: "4055304",
      erstelltAm: "2026-01-05", aktualisiertAm: "2026-02-15",
      aufrufe: 420, anfragen: 15,
      beschreibung: "Bürogebäude in bester Lage.",
      tags: ["Gewerbeobjekt", "Immobilienverkauf"],
      matchingScore: 81,
      lat: 48.208, lng: 16.373,
    },
    {
      id: "ins-demo-7", leadId: "3", eigentuemerName: "Lisa Müller",
      objekttyp: "Grundstück",
      titel: "Baugrundstück am Zürichsee",
      adresse: "Seestr. 40, 8002 Zürich", baujahr: 0, wohnflaeche: 0,
      grundstuecksflaeche: 1200, vermietet: false,
      sanierungsstatus: "Unsaniert", status: "aktiv", objektNr: "4055305",
      erstelltAm: "2026-02-10", aktualisiertAm: "2026-02-18",
      aufrufe: 680, anfragen: 22,
      beschreibung: "Exklusives Baugrundstück am See.",
      tags: ["Grundstück", "Immobilienverkauf"],
      matchingScore: 70,
      lat: 47.377, lng: 8.542,
    }
  );

  return inserate;
};

// Map colors per Objekttyp
const OBJEKTTYP_COLORS: Record<string, string> = {
  Einfamilienhaus: "#f97316",
  Mehrfamilienhaus: "#8b5cf6",
  Wohnung: "#3b82f6",
  Gewerbeobjekt: "#10b981",
  Grundstück: "#eab308",
  Mischobjekt: "#ec4899",
};

type ObjektFilterType = "Alle" | "Einfamilienhaus" | "Mehrfamilienhaus" | "Wohnung" | "Gewerbeobjekt" | "Grundstück";

function InserateMap({ inserate, objektFilter }: { inserate: Inserat[]; objektFilter: ObjektFilterType }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  const pins = useMemo(() => {
    let list = inserate;
    if (objektFilter !== "Alle") list = list.filter((i) => i.objekttyp === objektFilter);
    return list;
  }, [inserate, objektFilter]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }
    const map = L.map(mapRef.current, { zoomControl: true }).setView([48.5, 10.5], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    pins.forEach((ins) => {
      const color = OBJEKTTYP_COLORS[ins.objekttyp] || "#6b7280";
      L.circleMarker([ins.lat, ins.lng], {
        radius: 8, fillColor: color, color: "#fff", weight: 2, fillOpacity: 0.9,
      })
        .bindPopup(
          `<div style="min-width:180px">
            <strong>${ins.titel}</strong><br/>
            <span style="color:#888;font-size:11px">${ins.objekttyp} · ${ins.adresse}</span><br/>
            <span style="font-size:11px">${ins.wohnflaeche > 0 ? ins.wohnflaeche + " m²" : ""} ${ins.grundstuecksflaeche ? "· " + ins.grundstuecksflaeche + " m² Grundstück" : ""}</span><br/>
            <span style="font-size:11px;color:#666">Eigentümer: ${ins.eigentuemerName}</span>
          </div>`
        )
        .addTo(map);
    });

    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; };
  }, [pins]);

  return <div ref={mapRef} className="w-full h-[500px] rounded-xl border border-border" />;
}

const statusConfig: Record<InseratStatus, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; dotColor: string }> = {
  aktiv: { label: "Aktiv", icon: CheckCircle2, color: "bg-success/10 text-success border-success/20", dotColor: "bg-success" },
  entwurf: { label: "Entwurf", icon: Clock, color: "bg-warning/10 text-warning border-warning/20", dotColor: "bg-warning" },
  pausiert: { label: "Pausiert", icon: Clock, color: "bg-muted text-muted-foreground border-border", dotColor: "bg-muted-foreground" },
  abgelaufen: { label: "Abgelaufen", icon: XCircle, color: "bg-destructive/10 text-destructive border-destructive/20", dotColor: "bg-destructive" },
};

type StatusFilter = "alle" | InseratStatus;
type ViewMode = "grid" | "list" | "map";

export default function Inserate() {
  const navigate = useNavigate();
  const [inserate] = useState<Inserat[]>(generateInserate);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("alle");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFunnel, setShowFunnel] = useState(false);
  const [objektFilter, setObjektFilter] = useState<ObjektFilterType>("Alle");

  const filtered = useMemo(() => {
    let list = inserate;
    if (statusFilter !== "alle") list = list.filter((i) => i.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.eigentuemerName.toLowerCase().includes(q) ||
          i.adresse.toLowerCase().includes(q) ||
          i.objekttyp.toLowerCase().includes(q) ||
          i.titel.toLowerCase().includes(q)
      );
    }
    return list;
  }, [inserate, search, statusFilter]);

  const counts = {
    alle: inserate.length,
    aktiv: inserate.filter((i) => i.status === "aktiv").length,
    entwurf: inserate.filter((i) => i.status === "entwurf").length,
    pausiert: inserate.filter((i) => i.status === "pausiert").length,
    abgelaufen: inserate.filter((i) => i.status === "abgelaufen").length,
  };

  // Show funnel instead of listing
  if (showFunnel) {
    return (
      <CRMLayout>
        <InseratFunnel onClose={() => setShowFunnel(false)} />
      </CRMLayout>
    );
  }

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in min-h-screen dashboard-mesh-bg">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-1 rounded-full gradient-brand" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Inserate</h1>
            <p className="text-sm text-muted-foreground mt-1">Alle Immobilien-Inserate deiner Eigentümer</p>
          </div>
          <Button onClick={() => setShowFunnel(true)} className="gap-2 gradient-brand border-0 text-primary-foreground shadow-crm-sm hover:opacity-90">
            <Plus className="h-4 w-4" /> Neues Inserat
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <p className="text-3xl font-display font-bold text-foreground">{counts.alle}</p>
            <p className="text-xs text-muted-foreground mt-1">Gesamt</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <p className="text-3xl font-display font-bold text-success">{counts.aktiv}</p>
            <p className="text-xs text-muted-foreground mt-1">Aktiv</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <p className="text-3xl font-display font-bold text-foreground">
              {inserate.reduce((s, i) => s + i.aufrufe, 0).toLocaleString("de-DE")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Aufrufe gesamt</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <p className="text-3xl font-display font-bold text-primary">
              {inserate.reduce((s, i) => s + i.anfragen, 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Anfragen gesamt</p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suche nach Name, Adresse, Objekttyp…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                {statusFilter === "alle" ? "Alle Status" : statusConfig[statusFilter].label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-popover">
              <DropdownMenuLabel className="text-xs">Status filtern</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(["alle", "aktiv", "entwurf", "pausiert", "abgelaufen"] as StatusFilter[]).map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={statusFilter === s ? "font-semibold text-primary" : ""}
                >
                  {s === "alle" ? "Alle" : statusConfig[s].label} ({counts[s]})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-1 ml-auto">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "map" ? "default" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("map")}>
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Map View */}
        {viewMode === "map" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-medium text-muted-foreground mr-1">Objekttyp:</span>
              {(["Alle", "Einfamilienhaus", "Mehrfamilienhaus", "Wohnung", "Gewerbeobjekt", "Grundstück"] as ObjektFilterType[]).map((t) => (
                <Button
                  key={t}
                  variant={objektFilter === t ? "default" : "outline"}
                  size="sm"
                  className={objektFilter === t ? "gradient-brand border-0 text-primary-foreground" : ""}
                  onClick={() => setObjektFilter(t)}
                >
                  {t !== "Alle" && <span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: OBJEKTTYP_COLORS[t] }} />}
                  {t}
                </Button>
              ))}
            </div>
            <InserateMap inserate={filtered} objektFilter={objektFilter} />
            <div className="flex flex-wrap gap-3 justify-center">
              {Object.entries(OBJEKTTYP_COLORS).map(([typ, color]) => (
                <div key={typ} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  {typ}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filtered.map((ins) => {
              const sc = statusConfig[ins.status];
              return (
                <div
                  key={ins.id}
                  className="bg-card rounded-xl shadow-crm-sm border border-border hover:shadow-crm-md hover:border-primary/20 transition-all group overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative sm:w-[260px] h-[180px] sm:h-auto shrink-0">
                      <img
                        src={getImage(ins.objekttyp, ins.id)}
                        alt={ins.titel}
                        className="w-full h-full object-cover"
                      />
                      <Badge
                        variant="outline"
                        className={`absolute top-3 left-3 text-[10px] gap-1.5 backdrop-blur-sm bg-background/80 ${sc.color}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${sc.dotColor}`} />
                        {ins.status === "entwurf" ? "nicht veröffentlicht" : sc.label}
                      </Badge>
                      {ins.matchingScore && (
                        <div className="absolute top-3 right-3 group/score">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg backdrop-blur-sm text-[11px] font-bold cursor-help ${
                            ins.matchingScore >= 85 ? "bg-success/90 text-white" :
                            ins.matchingScore >= 70 ? "bg-warning/90 text-white" :
                            "bg-muted/90 text-foreground"
                          }`}>
                            <Sparkles className="h-3 w-3" />
                            {ins.matchingScore}%
                          </div>
                          <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-lg p-3 shadow-lg text-xs text-foreground opacity-0 pointer-events-none group-hover/score:opacity-100 group-hover/score:pointer-events-auto transition-opacity z-50">
                            <p className="font-semibold mb-1">KI-Matching Score</p>
                            <p className="text-muted-foreground leading-relaxed">
                              {ins.matchingScore >= 85
                                ? "Sehr hohe Übereinstimmung mit registrierten Entwicklern basierend auf Objekttyp, Region, Sanierungsbedarf und Gewerk."
                                : ins.matchingScore >= 70
                                ? "Gute Übereinstimmung – mehrere Entwickler decken Teile des Anforderungsprofils ab."
                                : "Moderate Übereinstimmung – wenige passende Entwickler für dieses Profil verfügbar."}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {ins.adresse}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            Objekt-Nr.: {ins.objektNr}
                          </span>
                        </div>
                        <h3 className="text-sm font-display font-semibold text-foreground mt-2 leading-snug group-hover:text-primary transition-colors">
                          {ins.titel}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {ins.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center gap-6 text-sm">
                          {ins.zimmer && (
                            <div>
                              <p className="font-bold text-foreground">{ins.zimmer}</p>
                              <p className="text-[10px] text-muted-foreground">Zimmer</p>
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-foreground">{ins.vermietet ? "Ja" : "Nein"}</p>
                            <p className="text-[10px] text-muted-foreground">Vermietet</p>
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{ins.baujahr}</p>
                            <p className="text-[10px] text-muted-foreground">Baujahr</p>
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{ins.wohnflaeche} m²</p>
                            <p className="text-[10px] text-muted-foreground">Wohnfläche</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => { e.stopPropagation(); navigate(`/lead/${ins.leadId}`); }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant={ins.status === "entwurf" ? "default" : "outline"}
                            size="sm"
                            className={ins.status === "entwurf" ? "gradient-brand border-0 text-primary-foreground" : ""}
                            onClick={(e) => { e.stopPropagation(); navigate(`/lead/${ins.leadId}`); }}
                          >
                            {ins.status === "entwurf" ? "Veröffentlichen" : "Details"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground w-16">Bild</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Objekttyp</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Adresse</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Eigentümer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Fläche</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Aufrufe</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Anfragen</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ins) => {
                  const sc = statusConfig[ins.status];
                  const StatusIcon = sc.icon;
                  return (
                    <tr
                      key={ins.id}
                      onClick={() => navigate(`/lead/${ins.leadId}`)}
                      className="border-b border-border/40 hover:bg-secondary/20 transition-colors cursor-pointer"
                    >
                      <td className="py-2 px-4">
                        <img src={getImage(ins.objekttyp, ins.id)} alt="" className="w-12 h-9 object-cover rounded-md" />
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={`text-[10px] gap-1 ${sc.color}`}>
                          <StatusIcon className="h-3 w-3" /> {sc.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium">{ins.objekttyp}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{ins.adresse}</td>
                      <td className="py-3 px-4">{ins.eigentuemerName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{ins.wohnflaeche} m²</td>
                      <td className="py-3 px-4 text-muted-foreground">{ins.aufrufe}</td>
                      <td className="py-3 px-4 font-medium text-primary">{ins.anfragen}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Home className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Keine Inserate gefunden.</p>
          </div>
        )}
      </div>
    </CRMLayout>
  );
}
