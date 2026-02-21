import { useState, useMemo, useEffect, useRef } from "react";
import CRMLayout from "@/components/CRMLayout";
import L from "leaflet";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Map } from "lucide-react";
import "leaflet/dist/leaflet.css";

/* ── Types ─────────────────────────────────────── */
type ObjektFilter = "Wohnung" | "Haus" | "Mehrfamilienhaus" | "Gewerbe" | "Grundstück";
type GewerkFilter =
  | "Architekt" | "Energieberater" | "Projektentwickler" | "Fensterbauer"
  | "Investor" | "Dachdecker" | "Schreiner" | "Maler" | "Family Office";

interface MapPin {
  id: string; type: "b2c" | "b2b"; label: string; subLabel: string;
  category: ObjektFilter | GewerkFilter; lat: number; lng: number;
}

/* ── Sample Map Data (DACH) ────────────────────── */
const MAP_PINS: MapPin[] = [
  // === DEUTSCHLAND B2C ===
  { id: "m1", type: "b2c", label: "EFH Berlin-Mitte", subLabel: "Einfamilienhaus, 145m²", category: "Haus", lat: 52.52, lng: 13.405 },
  { id: "m2", type: "b2c", label: "MFH München", subLabel: "Mehrfamilienhaus, 480m²", category: "Mehrfamilienhaus", lat: 48.137, lng: 11.576 },
  { id: "m3", type: "b2c", label: "ETW Hamburg", subLabel: "Wohnung, 95m²", category: "Wohnung", lat: 53.551, lng: 9.993 },
  { id: "m4", type: "b2c", label: "EFH Frankfurt", subLabel: "Einfamilienhaus, 160m²", category: "Haus", lat: 50.11, lng: 8.682 },
  { id: "m5", type: "b2c", label: "ETW Köln", subLabel: "Wohnung, 72m²", category: "Wohnung", lat: 50.937, lng: 6.96 },
  { id: "m6", type: "b2c", label: "Gewerbe Düsseldorf", subLabel: "Gewerbeobjekt, 250m²", category: "Gewerbe", lat: 51.227, lng: 6.773 },
  { id: "m7", type: "b2c", label: "ETW Stuttgart", subLabel: "Wohnung, 88m²", category: "Wohnung", lat: 48.775, lng: 9.182 },
  { id: "m8", type: "b2c", label: "Grundstück Leipzig", subLabel: "Grundstück, 600m²", category: "Grundstück", lat: 51.34, lng: 12.375 },
  { id: "m9", type: "b2c", label: "MFH Hannover", subLabel: "Mehrfamilienhaus, 350m²", category: "Mehrfamilienhaus", lat: 52.375, lng: 9.732 },
  { id: "m10", type: "b2c", label: "Gewerbe Nürnberg", subLabel: "Gewerbeobjekt, 180m²", category: "Gewerbe", lat: 49.452, lng: 11.077 },
  { id: "m11", type: "b2c", label: "ETW Dresden", subLabel: "Wohnung, 65m²", category: "Wohnung", lat: 51.05, lng: 13.738 },
  { id: "m12", type: "b2c", label: "EFH Freiburg", subLabel: "Einfamilienhaus, 130m²", category: "Haus", lat: 47.999, lng: 7.842 },
  { id: "m13", type: "b2c", label: "Grundstück Dortmund", subLabel: "Grundstück, 450m²", category: "Grundstück", lat: 51.514, lng: 7.468 },
  { id: "m14", type: "b2c", label: "ETW Mannheim", subLabel: "Wohnung, 78m²", category: "Wohnung", lat: 49.488, lng: 8.467 },
  { id: "m15", type: "b2c", label: "Gewerbe Augsburg", subLabel: "Gewerbeobjekt, 320m²", category: "Gewerbe", lat: 48.366, lng: 10.898 },
  { id: "m16", type: "b2c", label: "MFH Bremen", subLabel: "Mehrfamilienhaus, 520m²", category: "Mehrfamilienhaus", lat: 53.079, lng: 8.801 },
  { id: "m17", type: "b2c", label: "Grundstück Rostock", subLabel: "Grundstück, 800m²", category: "Grundstück", lat: 54.092, lng: 12.099 },
  // === ÖSTERREICH B2C ===
  { id: "a1", type: "b2c", label: "ETW Wien Innere Stadt", subLabel: "Wohnung, 110m²", category: "Wohnung", lat: 48.208, lng: 16.373 },
  { id: "a2", type: "b2c", label: "MFH Wien Donaustadt", subLabel: "Mehrfamilienhaus, 620m²", category: "Mehrfamilienhaus", lat: 48.23, lng: 16.44 },
  { id: "a3", type: "b2c", label: "EFH Graz", subLabel: "Einfamilienhaus, 175m²", category: "Haus", lat: 47.076, lng: 15.421 },
  { id: "a4", type: "b2c", label: "Gewerbe Linz", subLabel: "Gewerbeobjekt, 400m²", category: "Gewerbe", lat: 48.306, lng: 14.286 },
  { id: "a5", type: "b2c", label: "EFH Salzburg", subLabel: "Einfamilienhaus, 200m²", category: "Haus", lat: 47.811, lng: 13.055 },
  { id: "a6", type: "b2c", label: "Grundstück Innsbruck", subLabel: "Grundstück, 550m²", category: "Grundstück", lat: 47.263, lng: 11.394 },
  { id: "a7", type: "b2c", label: "ETW Klagenfurt", subLabel: "Wohnung, 85m²", category: "Wohnung", lat: 46.624, lng: 14.305 },
  { id: "a8", type: "b2c", label: "MFH St. Pölten", subLabel: "Mehrfamilienhaus, 380m²", category: "Mehrfamilienhaus", lat: 48.204, lng: 15.627 },
  // === SCHWEIZ B2C ===
  { id: "s1", type: "b2c", label: "ETW Zürich", subLabel: "Wohnung, 120m²", category: "Wohnung", lat: 47.376, lng: 8.541 },
  { id: "s2", type: "b2c", label: "EFH Bern", subLabel: "Einfamilienhaus, 190m²", category: "Haus", lat: 46.948, lng: 7.447 },
  { id: "s3", type: "b2c", label: "MFH Basel", subLabel: "Mehrfamilienhaus, 450m²", category: "Mehrfamilienhaus", lat: 47.559, lng: 7.588 },
  { id: "s4", type: "b2c", label: "Gewerbe Genf", subLabel: "Gewerbeobjekt, 350m²", category: "Gewerbe", lat: 46.204, lng: 6.143 },
  { id: "s5", type: "b2c", label: "Grundstück Lausanne", subLabel: "Grundstück, 700m²", category: "Grundstück", lat: 46.523, lng: 6.634 },
  { id: "s6", type: "b2c", label: "ETW Luzern", subLabel: "Wohnung, 95m²", category: "Wohnung", lat: 47.050, lng: 8.310 },
  { id: "s7", type: "b2c", label: "EFH Winterthur", subLabel: "Einfamilienhaus, 165m²", category: "Haus", lat: 47.500, lng: 8.724 },
  // === DEUTSCHLAND B2B ===
  { id: "m20", type: "b2b", label: "Architektur Bauer GmbH", subLabel: "Architekt", category: "Architekt", lat: 52.49, lng: 13.39 },
  { id: "m21", type: "b2b", label: "EnergyCheck Solutions", subLabel: "Energieberater", category: "Energieberater", lat: 50.94, lng: 6.94 },
  { id: "m22", type: "b2b", label: "Projektbau Süd GmbH", subLabel: "Projektentwickler", category: "Projektentwickler", lat: 48.78, lng: 9.17 },
  { id: "m23", type: "b2b", label: "FensterPro AG", subLabel: "Fensterbauer", category: "Fensterbauer", lat: 48.15, lng: 11.58 },
  { id: "m24", type: "b2b", label: "DachTech GmbH", subLabel: "Dachdecker", category: "Dachdecker", lat: 53.56, lng: 10.0 },
  { id: "m25", type: "b2b", label: "Schreinerei Holzmann", subLabel: "Schreiner", category: "Schreiner", lat: 49.45, lng: 11.08 },
  { id: "m26", type: "b2b", label: "Maler Krause & Söhne", subLabel: "Maler", category: "Maler", lat: 52.37, lng: 9.74 },
  { id: "m27", type: "b2b", label: "Haupt Invest AG", subLabel: "Family Office / Investor", category: "Investor", lat: 50.12, lng: 8.68 },
  { id: "m28", type: "b2b", label: "Green Energy Consult", subLabel: "Energieberater", category: "Energieberater", lat: 51.05, lng: 13.74 },
  { id: "m29", type: "b2b", label: "FO Rhein-Main", subLabel: "Family Office", category: "Family Office", lat: 50.0, lng: 8.27 },
  { id: "m30", type: "b2b", label: "Planwerk Architekten", subLabel: "Architekt", category: "Architekt", lat: 48.37, lng: 10.9 },
  { id: "m31", type: "b2b", label: "Fenster Schmidt GmbH", subLabel: "Fensterbauer", category: "Fensterbauer", lat: 51.34, lng: 12.38 },
  { id: "m32", type: "b2b", label: "Dach & Mehr AG", subLabel: "Dachdecker", category: "Dachdecker", lat: 50.78, lng: 6.08 },
  { id: "m33", type: "b2b", label: "ProjektHaus Nord", subLabel: "Projektentwickler", category: "Projektentwickler", lat: 53.08, lng: 8.8 },
  // === ÖSTERREICH B2B ===
  { id: "a20", type: "b2b", label: "Architekten Wien", subLabel: "Architekt", category: "Architekt", lat: 48.20, lng: 16.37 },
  { id: "a21", type: "b2b", label: "Energie Plus Graz", subLabel: "Energieberater", category: "Energieberater", lat: 47.07, lng: 15.44 },
  { id: "a22", type: "b2b", label: "AlpenProjekt Innsbruck", subLabel: "Projektentwickler", category: "Projektentwickler", lat: 47.26, lng: 11.39 },
  { id: "a23", type: "b2b", label: "Fenster Austria GmbH", subLabel: "Fensterbauer", category: "Fensterbauer", lat: 48.31, lng: 14.29 },
  { id: "a24", type: "b2b", label: "Dach Alpin Salzburg", subLabel: "Dachdecker", category: "Dachdecker", lat: 47.81, lng: 13.04 },
  { id: "a25", type: "b2b", label: "ImmoInvest Wien", subLabel: "Investor", category: "Investor", lat: 48.22, lng: 16.40 },
  // === SCHWEIZ B2B ===
  { id: "s20", type: "b2b", label: "Swiss Architekten Zürich", subLabel: "Architekt", category: "Architekt", lat: 47.38, lng: 8.54 },
  { id: "s21", type: "b2b", label: "EnergieBern GmbH", subLabel: "Energieberater", category: "Energieberater", lat: 46.95, lng: 7.45 },
  { id: "s22", type: "b2b", label: "Projekt Basel AG", subLabel: "Projektentwickler", category: "Projektentwickler", lat: 47.56, lng: 7.59 },
  { id: "s23", type: "b2b", label: "Fenster Swiss Luzern", subLabel: "Fensterbauer", category: "Fensterbauer", lat: 47.05, lng: 8.31 },
  { id: "s24", type: "b2b", label: "Helvetia Invest", subLabel: "Family Office", category: "Family Office", lat: 46.20, lng: 6.14 },
  { id: "s25", type: "b2b", label: "DachProfi Winterthur", subLabel: "Dachdecker", category: "Dachdecker", lat: 47.50, lng: 8.72 },
];

const B2C_FILTERS: ObjektFilter[] = ["Wohnung", "Haus", "Mehrfamilienhaus", "Gewerbe", "Grundstück"];
const B2B_FILTERS: GewerkFilter[] = [
  "Architekt", "Energieberater", "Projektentwickler", "Fensterbauer",
  "Investor", "Dachdecker", "Schreiner", "Maler", "Family Office",
];

const B2C_COLOR = "hsl(38, 92%, 50%)";
const B2B_COLOR = "hsl(210, 80%, 52%)";

/* ── Leaflet Map Component ─────────────────────── */
function LeafletMap({ pins }: { pins: MapPin[] }) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  const bordersRef = useRef<L.GeoJSON[]>([]);

  // Load DACH country borders once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([49.5, 10.5], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org">OSM</a>',
      }).addTo(mapRef.current);

      // Fetch DACH country borders
      const countries = ["DEU", "AUT", "CHE"];
      countries.forEach((code) => {
        fetch(`https://raw.githubusercontent.com/johan/world.geo.json/master/countries/${code}.geo.json`)
          .then((r) => r.json())
          .then((geojson) => {
            if (!mapRef.current) return;
            const layer = L.geoJSON(geojson, {
              style: {
                color: "hsl(250, 60%, 52%)",
                weight: 2.5,
                opacity: 0.5,
                fillColor: "hsl(250, 60%, 52%)",
                fillOpacity: 0.04,
                dashArray: "6 4",
              },
            }).addTo(mapRef.current);
            bordersRef.current.push(layer);
          })
          .catch(() => {});
      });
    }
  }, []);

  // Update markers when pins change
  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    pins.forEach((pin) => {
      const color = pin.type === "b2c" ? B2C_COLOR : B2B_COLOR;
      const marker = L.circleMarker([pin.lat, pin.lng], {
        radius: 8, fillColor: color, color, weight: 2, opacity: 0.9, fillOpacity: 0.7,
      }).addTo(mapRef.current!);
      marker.bindPopup(`<div style="font-size:13px"><b>${pin.label}</b><br/>${pin.subLabel}<br/><span style="color:#888">${pin.category}</span></div>`);
      markersRef.current.push(marker);
    });
  }, [pins]);

  useEffect(() => {
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  return <div ref={mapContainerRef} style={{ height: "calc(100% - 48px)", width: "100%", minHeight: 550 }} />;
}

/* ── Main Page ─────────────────────────────────── */
export default function MarketingLeads() {
  const [b2cFilters, setB2cFilters] = useState<Set<ObjektFilter>>(new Set(B2C_FILTERS));
  const [b2bFilters, setB2bFilters] = useState<Set<GewerkFilter>>(new Set(B2B_FILTERS));
  const [showB2C, setShowB2C] = useState(true);
  const [showB2B, setShowB2B] = useState(true);

  const toggleB2C = (f: ObjektFilter) =>
    setB2cFilters((prev) => { const n = new Set(prev); n.has(f) ? n.delete(f) : n.add(f); return n; });
  const toggleB2B = (f: GewerkFilter) =>
    setB2bFilters((prev) => { const n = new Set(prev); n.has(f) ? n.delete(f) : n.add(f); return n; });

  const filteredPins = useMemo(() =>
    MAP_PINS.filter((pin) => {
      if (pin.type === "b2c") return showB2C && b2cFilters.has(pin.category as ObjektFilter);
      return showB2B && b2bFilters.has(pin.category as GewerkFilter);
    }), [showB2C, showB2B, b2cFilters, b2bFilters]);

  const b2cCount = filteredPins.filter((p) => p.type === "b2c").length;
  const b2bCount = filteredPins.filter((p) => p.type === "b2b").length;

  return (
    <CRMLayout>
      <div className="p-6 space-y-6 min-h-screen dashboard-mesh-bg">
        <div className="flex items-center gap-2">
          <div className="w-1 h-10 bg-accent rounded-full" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Marketing</h1>
            <p className="text-sm text-muted-foreground">DACH-Karte mit B2C- und B2B-Standorten</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">
          {/* Filter Sidebar */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: B2C_COLOR }} />
                  <h3 className="font-semibold text-foreground">B2C Inserate</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{b2cCount}</Badge>
                  <Checkbox checked={showB2C} onCheckedChange={(v) => setShowB2C(!!v)} />
                </div>
              </div>
              <div className="space-y-2">
                {B2C_FILTERS.map((f) => (
                  <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={b2cFilters.has(f)} onCheckedChange={() => toggleB2C(f)} disabled={!showB2C} />
                    <span className={showB2C ? "text-foreground" : "text-muted-foreground"}>{f}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: B2B_COLOR }} />
                  <h3 className="font-semibold text-foreground">B2B Partner</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{b2bCount}</Badge>
                  <Checkbox checked={showB2B} onCheckedChange={(v) => setShowB2B(!!v)} />
                </div>
              </div>
              <div className="space-y-2">
                {B2B_FILTERS.map((f) => (
                  <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={b2bFilters.has(f)} onCheckedChange={() => toggleB2B(f)} disabled={!showB2B} />
                    <span className={showB2B ? "text-foreground" : "text-muted-foreground"}>{f}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-foreground mb-3">Legende</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: B2C_COLOR }} />
                  <span className="text-muted-foreground">B2C Inserate (Eigentümer)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: B2B_COLOR }} />
                  <span className="text-muted-foreground">B2B Partner (Gewerke)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden" style={{ minHeight: 600 }}>
            <div className="px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-accent rounded-full" />
                <h2 className="font-semibold text-foreground">Standorte DACH-Region</h2>
              </div>
            </div>
            <LeafletMap pins={filteredPins} />
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
