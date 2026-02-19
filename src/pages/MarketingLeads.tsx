import { useState, useMemo } from "react";
import CRMLayout from "@/components/CRMLayout";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import "leaflet/dist/leaflet.css";

/* ── Types ─────────────────────────────────────── */
type ObjektFilter = "Wohnung" | "Haus" | "Gewerbe" | "Grundstück";
type GewerkFilter =
  | "Architekt"
  | "Energieberater"
  | "Projektentwickler"
  | "Fensterbauer"
  | "Investor"
  | "Dachdecker"
  | "Schreiner"
  | "Maler"
  | "Family Office";

interface MapPin {
  id: string;
  type: "b2c" | "b2b";
  label: string;
  subLabel: string;
  category: ObjektFilter | GewerkFilter;
  lat: number;
  lng: number;
}

/* ── Sample Map Data ───────────────────────────── */
const MAP_PINS: MapPin[] = [
  // B2C Objekte
  { id: "m1", type: "b2c", label: "EFH Berlin-Mitte", subLabel: "Einfamilienhaus, 145m²", category: "Haus", lat: 52.52, lng: 13.405 },
  { id: "m2", type: "b2c", label: "MFH München", subLabel: "Mehrfamilienhaus, 480m²", category: "Haus", lat: 48.137, lng: 11.576 },
  { id: "m3", type: "b2c", label: "ETW Hamburg", subLabel: "Wohnung, 95m²", category: "Wohnung", lat: 53.551, lng: 9.993 },
  { id: "m4", type: "b2c", label: "EFH Frankfurt", subLabel: "Einfamilienhaus, 160m²", category: "Haus", lat: 50.11, lng: 8.682 },
  { id: "m5", type: "b2c", label: "ETW Köln", subLabel: "Wohnung, 72m²", category: "Wohnung", lat: 50.937, lng: 6.96 },
  { id: "m6", type: "b2c", label: "Gewerbe Düsseldorf", subLabel: "Gewerbeobjekt, 250m²", category: "Gewerbe", lat: 51.227, lng: 6.773 },
  { id: "m7", type: "b2c", label: "ETW Stuttgart", subLabel: "Wohnung, 88m²", category: "Wohnung", lat: 48.775, lng: 9.182 },
  { id: "m8", type: "b2c", label: "Grundstück Leipzig", subLabel: "Grundstück, 600m²", category: "Grundstück", lat: 51.34, lng: 12.375 },
  { id: "m9", type: "b2c", label: "MFH Hannover", subLabel: "Mehrfamilienhaus, 350m²", category: "Haus", lat: 52.375, lng: 9.732 },
  { id: "m10", type: "b2c", label: "Gewerbe Nürnberg", subLabel: "Gewerbeobjekt, 180m²", category: "Gewerbe", lat: 49.452, lng: 11.077 },
  { id: "m11", type: "b2c", label: "ETW Dresden", subLabel: "Wohnung, 65m²", category: "Wohnung", lat: 51.05, lng: 13.738 },
  { id: "m12", type: "b2c", label: "EFH Freiburg", subLabel: "Einfamilienhaus, 130m²", category: "Haus", lat: 47.999, lng: 7.842 },
  { id: "m13", type: "b2c", label: "Grundstück Dortmund", subLabel: "Grundstück, 450m²", category: "Grundstück", lat: 51.514, lng: 7.468 },
  { id: "m14", type: "b2c", label: "ETW Mannheim", subLabel: "Wohnung, 78m²", category: "Wohnung", lat: 49.488, lng: 8.467 },
  { id: "m15", type: "b2c", label: "Gewerbe Augsburg", subLabel: "Gewerbeobjekt, 320m²", category: "Gewerbe", lat: 48.366, lng: 10.898 },

  // B2B Unternehmen
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
];

const B2C_FILTERS: ObjektFilter[] = ["Wohnung", "Haus", "Gewerbe", "Grundstück"];
const B2B_FILTERS: GewerkFilter[] = [
  "Architekt", "Energieberater", "Projektentwickler", "Fensterbauer",
  "Investor", "Dachdecker", "Schreiner", "Maler", "Family Office",
];

const B2C_COLOR = "hsl(38, 92%, 50%)";   // orange/amber
const B2B_COLOR = "hsl(210, 80%, 52%)";   // blue

/* ── Component ─────────────────────────────────── */
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-10 bg-accent rounded-full" />
          <h1 className="text-3xl font-bold text-foreground">Marketing</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">
          {/* Filter Sidebar */}
          <div className="space-y-4">
            {/* B2C Filter */}
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
                    <Checkbox
                      checked={b2cFilters.has(f)}
                      onCheckedChange={() => toggleB2C(f)}
                      disabled={!showB2C}
                    />
                    <span className={showB2C ? "text-foreground" : "text-muted-foreground"}>{f}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* B2B Filter */}
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
                    <Checkbox
                      checked={b2bFilters.has(f)}
                      onCheckedChange={() => toggleB2B(f)}
                      disabled={!showB2B}
                    />
                    <span className={showB2B ? "text-foreground" : "text-muted-foreground"}>{f}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Legend */}
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
                <h2 className="font-semibold text-foreground">Standorte Deutschland</h2>
              </div>
            </div>
            <MapContainer
              center={[51.1657, 10.4515]}
              zoom={6}
              style={{ height: "calc(100% - 48px)", width: "100%", minHeight: 550 }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredPins.map((pin) => (
                <CircleMarker
                  key={pin.id}
                  center={[pin.lat, pin.lng]}
                  radius={8}
                  pathOptions={{
                    fillColor: pin.type === "b2c" ? B2C_COLOR : B2B_COLOR,
                    color: pin.type === "b2c" ? B2C_COLOR : B2B_COLOR,
                    weight: 2,
                    opacity: 0.9,
                    fillOpacity: 0.7,
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">{pin.label}</p>
                      <p className="text-muted-foreground">{pin.subLabel}</p>
                      <Badge className="mt-1 text-[10px]" variant="secondary">{pin.category}</Badge>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
