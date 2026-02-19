import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart, Building2, Briefcase, Check, Star, Zap, Crown,
  Package, CheckCircle, Info
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";

interface LeadPackage {
  id: string; name: string; leads: number; pricePerLead: number;
  totalPrice: number; savings: number; popular?: boolean;
  icon: React.ComponentType<{ className?: string }>; features: string[];
}

const B2C_PACKAGES: LeadPackage[] = [
  { id: "b2c-10", name: "Starter", leads: 10, pricePerLead: 29, totalPrice: 290, savings: 0, icon: Package,
    features: ["10 verifizierte Eigentümer-Leads", "Inkl. Kontaktdaten", "Objekttyp & Standort", "72h Lieferung"] },
  { id: "b2c-25", name: "Professional", leads: 25, pricePerLead: 24, totalPrice: 600, savings: 125, popular: true, icon: Star,
    features: ["25 verifizierte Eigentümer-Leads", "Inkl. Kontaktdaten", "Objekttyp, Fläche & Standort", "48h Lieferung", "Regionale Filterung"] },
  { id: "b2c-50", name: "Business", leads: 50, pricePerLead: 19, totalPrice: 950, savings: 500, icon: Zap,
    features: ["50 verifizierte Eigentümer-Leads", "Inkl. Kontaktdaten", "Vollständige Objektdetails", "24h Express-Lieferung", "Regionale Filterung", "Exklusivitätsgarantie"] },
  { id: "b2c-100", name: "Enterprise", leads: 100, pricePerLead: 15, totalPrice: 1500, savings: 1400, icon: Crown,
    features: ["100 verifizierte Eigentümer-Leads", "Inkl. Kontaktdaten", "Vollständige Objektdetails", "Sofort-Lieferung", "Regionale Filterung", "Exklusivitätsgarantie", "Persönlicher Ansprechpartner"] },
];

const B2B_PACKAGES: LeadPackage[] = [
  { id: "b2b-10", name: "Starter", leads: 10, pricePerLead: 49, totalPrice: 490, savings: 0, icon: Package,
    features: ["10 verifizierte Partner-Leads", "Firmenprofil & Kontakt", "Gewerk & Region", "72h Lieferung"] },
  { id: "b2b-25", name: "Professional", leads: 25, pricePerLead: 39, totalPrice: 975, savings: 250, popular: true, icon: Star,
    features: ["25 verifizierte Partner-Leads", "Firmenprofil & Kontakt", "Gewerk, Region & Kapazität", "48h Lieferung", "Gewerk-Filterung"] },
  { id: "b2b-50", name: "Business", leads: 50, pricePerLead: 29, totalPrice: 1450, savings: 1000, icon: Zap,
    features: ["50 verifizierte Partner-Leads", "Vollständiges Firmenprofil", "Alle Filteroptionen", "24h Express-Lieferung", "Gewerk-Filterung", "Exklusivitätsgarantie"] },
  { id: "b2b-100", name: "Enterprise", leads: 100, pricePerLead: 22, totalPrice: 2200, savings: 2700, icon: Crown,
    features: ["100 verifizierte Partner-Leads", "Vollständiges Firmenprofil", "Alle Filteroptionen", "Sofort-Lieferung", "Gewerk-Filterung", "Exklusivitätsgarantie", "Persönlicher Ansprechpartner"] },
];

export default function LeadKauf() {
  const { toast } = useToast();
  const [shopTab, setShopTab] = useState<"b2c" | "b2b">("b2c");
  const [confirmPkg, setConfirmPkg] = useState<LeadPackage | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<{ pkg: LeadPackage; date: string; type: "b2c" | "b2b" }[]>([]);

  const packages = shopTab === "b2c" ? B2C_PACKAGES : B2B_PACKAGES;

  const handlePurchase = () => {
    if (!confirmPkg) return;
    setPurchaseHistory(prev => [...prev, { pkg: confirmPkg, date: new Date().toLocaleDateString("de-DE"), type: shopTab }]);
    toast({ title: "Leads erfolgreich gekauft! 🎉", description: `${confirmPkg.leads} ${shopTab === "b2c" ? "Eigentümer" : "Partner"}-Leads wurden hinzugefügt.` });
    setConfirmPkg(null);
  };

  const totalB2cPurchased = purchaseHistory.filter(p => p.type === "b2c").reduce((s, p) => s + p.pkg.leads, 0);
  const totalB2bPurchased = purchaseHistory.filter(p => p.type === "b2b").reduce((s, p) => s + p.pkg.leads, 0);
  const totalSpent = purchaseHistory.reduce((s, p) => s + p.pkg.totalPrice, 0);

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-1 rounded-full gradient-brand" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Lead-Kauf</h1>
          <p className="text-sm text-muted-foreground mt-1">Kaufe verifizierte B2C- und B2B-Leads für dein CRM</p>
        </div>

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
          <Button variant={shopTab === "b2c" ? "default" : "outline"} onClick={() => setShopTab("b2c")} className="gap-2">
            <Building2 className="h-4 w-4" /> B2C – Eigentümer-Leads
          </Button>
          <Button variant={shopTab === "b2b" ? "default" : "outline"} onClick={() => setShopTab("b2b")} className="gap-2">
            <Briefcase className="h-4 w-4" /> B2B – Partner-Leads
          </Button>
        </div>

        {/* Info Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {shopTab === "b2c" ? "Eigentümer-Leads: Verifizierte Immobilienbesitzer mit Entwicklungspotenzial" : "Partner-Leads: Geprüfte Unternehmen aus dem Immobilienentwicklungsbereich"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Gekaufte Leads werden automatisch unter {shopTab === "b2c" ? "B2C" : "B2B"} → Neue Leads in deinem CRM hinzugefügt.
            </p>
          </div>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`relative bg-card border rounded-xl p-6 flex flex-col transition-all hover:shadow-md ${pkg.popular ? "border-primary shadow-sm ring-1 ring-primary/20" : "border-border"}`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground text-xs px-3">Beliebteste Wahl</Badge>
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${pkg.popular ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
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
                    <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full gap-2" variant={pkg.popular ? "default" : "outline"} onClick={() => setConfirmPkg(pkg)}>
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
                    <Badge variant="outline" className="text-xs">{p.type === "b2c" ? "B2C" : "B2B"}</Badge>
                    <span className="text-sm font-medium text-foreground">{p.pkg.name} – {p.pkg.leads} Leads</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-foreground">{p.pkg.totalPrice.toLocaleString("de-DE")} €</span>
                    <span className="text-xs text-muted-foreground">{p.date}</span>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">Zugestellt</Badge>
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
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Paket</span><span className="font-medium text-foreground">{confirmPkg.name}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Typ</span><Badge variant="outline" className="text-xs">{shopTab === "b2c" ? "B2C – Eigentümer" : "B2B – Partner"}</Badge></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Anzahl Leads</span><span className="font-medium text-foreground">{confirmPkg.leads}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Preis pro Lead</span><span className="font-medium text-foreground">{confirmPkg.pricePerLead} €</span></div>
                  <div className="border-t border-border pt-2 flex justify-between text-sm"><span className="font-semibold text-foreground">Gesamtpreis</span><span className="font-bold text-foreground text-lg">{confirmPkg.totalPrice.toLocaleString("de-DE")} €</span></div>
                  {confirmPkg.savings > 0 && (
                    <div className="flex justify-between text-sm"><span className="text-green-600">Ersparnis</span><span className="text-green-600 font-medium">{confirmPkg.savings.toLocaleString("de-DE")} €</span></div>
                  )}
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-start gap-2">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">Die Leads werden nach Kauf automatisch unter {shopTab === "b2c" ? "B2C" : "B2B"} → Neue Leads in deinem CRM eingefügt.</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmPkg(null)}>Abbrechen</Button>
              <Button onClick={handlePurchase} className="gap-2"><Check className="h-4 w-4" /> Kostenpflichtig kaufen</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CRMLayout>
  );
}
