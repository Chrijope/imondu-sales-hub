import { useState, useMemo } from "react";
import CRMLayout from "@/components/CRMLayout";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Map, ShoppingCart, Building2, Briefcase, Check, Star, Zap, Crown,
  ArrowRight, Users, Package, CheckCircle, Info
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import "leaflet/dist/leaflet.css";

/* ── Types ─────────────────────────────────────── */
type ObjektFilter = "Wohnung" | "Haus" | "Gewerbe" | "Grundstück";
type GewerkFilter =
  | "Architekt" | "Energieberater" | "Projektentwickler" | "Fensterbauer"
  | "Investor" | "Dachdecker" | "Schreiner" | "Maler" | "Family Office";

interface MapPin {
  id: string; type: "b2c" | "b2b"; label: string; subLabel: string;
  category: ObjektFilter | GewerkFilter; lat: number; lng: number;
}

/* ── Sample Map Data ───────────────────────────── */
const MAP_PINS: MapPin[] = [
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

const B2C_COLOR = "hsl(38, 92%, 50%)";
const B2B_COLOR = "hsl(210, 80%, 52%)";

/* ── Lead Packages ─────────────────────────────── */
interface LeadPackage {
  id: string;
  name: string;
  leads: number;
  pricePerLead: number;
  totalPrice: number;
  savings: number;
  popular?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

const B2C_PACKAGES: LeadPackage[] = [
  {
    id: "b2c-10", name: "Starter", leads: 10, pricePerLead: 29, totalPrice: 290, savings: 0,
    icon: Package,
    features: ["10 verifizierte Eigentümer-Leads", "Inkl. Kontaktdaten", "Objekttyp & Standort", "72h Lieferung"],
  },
  {
    id: "b2c-25", name: "Professional", leads: 25, pricePerLead: 24, totalPrice: 600, savings: 125, popular: true,
    icon: Star,
    features: ["25 verifizierte Eigentümer-Leads", "Inkl. Kontaktdaten", "Objekttyp, Fläche & Standort", "48h Lieferung", "Regionale Filterung"],
  },
  {
    id: "b2c-50", name: "Business", leads: 50, pricePerLead: 19, totalPrice: 950, savings: 500,
    icon: Zap,
    features: ["50 verifizierte Eigentümer-Leads", "Inkl. Kontaktdaten", "Vollständige Objektdetails", "24h Express-Lieferung", "Regionale Filterung", "Exklusivitätsgarantie"],
  },
  {
    id: "b2c-100", name: "Enterprise", leads: 100, pricePerLead: 15, totalPrice: 1500, savings: 1400,
    icon: Crown,
    features: ["100 verifizierte Eigentümer-Leads", "Inkl. Kontaktdaten", "Vollständige Objektdetails", "Sofort-Lieferung", "Regionale Filterung", "Exklusivitätsgarantie", "Persönlicher Ansprechpartner"],
  },
];

const B2B_PACKAGES: LeadPackage[] = [
  {
    id: "b2b-10", name: "Starter", leads: 10, pricePerLead: 49, totalPrice: 490, savings: 0,
    icon: Package,
    features: ["10 verifizierte Partner-Leads", "Firmenprofil & Kontakt", "Gewerk & Region", "72h Lieferung"],
  },
  {
    id: "b2b-25", name: "Professional", leads: 25, pricePerLead: 39, totalPrice: 975, savings: 250, popular: true,
    icon: Star,
    features: ["25 verifizierte Partner-Leads", "Firmenprofil & Kontakt", "Gewerk, Region & Kapazität", "48h Lieferung", "Gewerk-Filterung"],
  },
  {
    id: "b2b-50", name: "Business", leads: 50, pricePerLead: 29, totalPrice: 1450, savings: 1000,
    icon: Zap,
    features: ["50 verifizierte Partner-Leads", "Vollständiges Firmenprofil", "Alle Filteroptionen", "24h Express-Lieferung", "Gewerk-Filterung", "Exklusivitätsgarantie"],
  },
  {
    id: "b2b-100", name: "Enterprise", leads: 100, pricePerLead: 22, totalPrice: 2200, savings: 2700,
    icon: Crown,
    features: ["100 verifizierte Partner-Leads", "Vollständiges Firmenprofil", "Alle Filteroptionen", "Sofort-Lieferung", "Gewerk-Filterung", "Exklusivitätsgarantie", "Persönlicher Ansprechpartner"],
  },
];

/* ── Lead Shop Tab ─────────────────────────────── */
function LeadShopTab() {
  const { toast } = useToast();
  const [shopTab, setShopTab] = useState<"b2c" | "b2b">("b2c");
  const [confirmPkg, setConfirmPkg] = useState<LeadPackage | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<{ pkg: LeadPackage; date: string; type: "b2c" | "b2b" }[]>([]);

  const packages = shopTab === "b2c" ? B2C_PACKAGES : B2B_PACKAGES;

  const handlePurchase = () => {
    if (!confirmPkg) return;
    setPurchaseHistory(prev => [...prev, { pkg: confirmPkg, date: new Date().toLocaleDateString("de-DE"), type: shopTab }]);
    toast({
      title: "Leads erfolgreich gekauft! 🎉",
      description: `${confirmPkg.leads} ${shopTab === "b2c" ? "Eigentümer" : "Partner"}-Leads wurden zu deinen neuen Leads hinzugefügt.`,
    });
    setConfirmPkg(null);
  };

  const totalB2cPurchased = purchaseHistory.filter(p => p.type === "b2c").reduce((s, p) => s + p.pkg.leads, 0);
  const totalB2bPurchased = purchaseHistory.filter(p => p.type === "b2b").reduce((s, p) => s + p.pkg.leads, 0);
  const totalSpent = purchaseHistory.reduce((s, p) => s + p.pkg.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">B2C Leads gekauft</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalB2cPurchased}</p>
          <p className="text-xs text-muted-foreground">→ unter B2C / Neue Leads</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">B2B Leads gekauft</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalB2bPurchased}</p>
          <p className="text-xs text-muted-foreground">→ unter B2B / Neue Leads</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Gesamtausgaben</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalSpent.toLocaleString("de-DE")} €</p>
          <p className="text-xs text-muted-foreground">netto</p>
        </div>
      </div>

      {/* B2C / B2B Toggle */}
      <div className="flex items-center gap-3">
        <Button
          variant={shopTab === "b2c" ? "default" : "outline"}
          onClick={() => setShopTab("b2c")}
          className="gap-2"
        >
          <Building2 className="h-4 w-4" />
          B2C – Eigentümer-Leads
        </Button>
        <Button
          variant={shopTab === "b2b" ? "default" : "outline"}
          onClick={() => setShopTab("b2b")}
          className="gap-2"
        >
          <Briefcase className="h-4 w-4" />
          B2B – Partner-Leads
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">
            {shopTab === "b2c"
              ? "Eigentümer-Leads: Verifizierte Immobilienbesitzer mit Entwicklungspotenzial"
              : "Partner-Leads: Geprüfte Unternehmen aus dem Immobilienentwicklungsbereich"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Gekaufte Leads werden automatisch unter {shopTab === "b2c" ? "B2C" : "B2B"} → Neue Leads in deinem CRM hinzugefügt.
          </p>
        </div>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-card border rounded-xl p-6 flex flex-col transition-all hover:shadow-md ${
              pkg.popular ? "border-primary shadow-sm ring-1 ring-primary/20" : "border-border"
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground text-xs px-3">Beliebteste Wahl</Badge>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                pkg.popular ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}>
                <pkg.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                <p className="text-xs text-muted-foreground">{pkg.leads} Leads</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{pkg.totalPrice.toLocaleString("de-DE")}</span>
                <span className="text-sm text-muted-foreground">€</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{pkg.pricePerLead} € pro Lead</p>
              {pkg.savings > 0 && (
                <Badge variant="secondary" className="mt-2 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Du sparst {pkg.savings.toLocaleString("de-DE")} €
                </Badge>
              )}
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {pkg.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              className="w-full gap-2"
              variant={pkg.popular ? "default" : "outline"}
              onClick={() => setConfirmPkg(pkg)}
            >
              <ShoppingCart className="h-4 w-4" /> Jetzt kaufen
            </Button>
          </div>
        ))}
      </div>

      {/* Purchase History */}
      {purchaseHistory.length > 0 && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-accent rounded-full" />
              <h2 className="font-semibold text-foreground">Letzte Käufe</h2>
            </div>
          </div>
          <div className="divide-y divide-border">
            {purchaseHistory.map((p, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {p.type === "b2c" ? "B2C" : "B2B"}
                  </Badge>
                  <span className="text-sm font-medium text-foreground">{p.pkg.name} – {p.pkg.leads} Leads</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-foreground">{p.pkg.totalPrice.toLocaleString("de-DE")} €</span>
                  <span className="text-xs text-muted-foreground">{p.date}</span>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                    Zugestellt
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <Dialog open={!!confirmPkg} onOpenChange={(open) => !open && setConfirmPkg(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lead-Paket kaufen</DialogTitle>
            <DialogDescription>Bestätige deinen Kauf</DialogDescription>
          </DialogHeader>
          {confirmPkg && (
            <div className="space-y-4 py-2">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Paket</span>
                  <span className="font-medium text-foreground">{confirmPkg.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Typ</span>
                  <Badge variant="outline" className="text-xs">
                    {shopTab === "b2c" ? "B2C – Eigentümer" : "B2B – Partner"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Anzahl Leads</span>
                  <span className="font-medium text-foreground">{confirmPkg.leads}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Preis pro Lead</span>
                  <span className="font-medium text-foreground">{confirmPkg.pricePerLead} €</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-sm">
                  <span className="font-semibold text-foreground">Gesamtpreis</span>
                  <span className="font-bold text-foreground text-lg">{confirmPkg.totalPrice.toLocaleString("de-DE")} €</span>
                </div>
                {confirmPkg.savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Ersparnis</span>
                    <span className="text-green-600 font-medium">{confirmPkg.savings.toLocaleString("de-DE")} €</span>
                  </div>
                )}
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-start gap-2">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Die Leads werden nach Kauf automatisch unter {shopTab === "b2c" ? "B2C" : "B2B"} → Neue Leads in deinem CRM eingefügt.
                  Zahlung wird über den hinterlegten Zahlungsanbieter abgewickelt.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmPkg(null)}>Abbrechen</Button>
            <Button onClick={handlePurchase} className="gap-2">
              <Check className="h-4 w-4" /> Kostenpflichtig kaufen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ── Map Tab ───────────────────────────────────── */
function MapTab() {
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
            <h2 className="font-semibold text-foreground">Standorte Deutschland</h2>
          </div>
        </div>
        <MapContainer
          center={[51.1657, 10.4515]} zoom={6}
          style={{ height: "calc(100% - 48px)", width: "100%", minHeight: 550 }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredPins.map((pin) => (
            <CircleMarker key={pin.id} center={[pin.lat, pin.lng]} radius={8}
              pathOptions={{
                fillColor: pin.type === "b2c" ? B2C_COLOR : B2B_COLOR,
                color: pin.type === "b2c" ? B2C_COLOR : B2B_COLOR,
                weight: 2, opacity: 0.9, fillOpacity: 0.7,
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
  );
}

/* ── Main Page ─────────────────────────────────── */
export default function MarketingLeads() {
  return (
    <CRMLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-10 bg-accent rounded-full" />
          <h1 className="text-3xl font-bold text-foreground">Marketing</h1>
        </div>

        <Tabs defaultValue="karte">
          <TabsList>
            <TabsTrigger value="karte" className="gap-2">
              <Map className="h-4 w-4" /> Karte & Leads
            </TabsTrigger>
            <TabsTrigger value="shop" className="gap-2">
              <ShoppingCart className="h-4 w-4" /> Lead-Shop
            </TabsTrigger>
          </TabsList>

          <TabsContent value="karte" className="mt-6">
            <MapTab />
          </TabsContent>
          <TabsContent value="shop" className="mt-6">
            <LeadShopTab />
          </TabsContent>
        </Tabs>
      </div>
    </CRMLayout>
  );
}
