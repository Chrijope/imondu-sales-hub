import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, Minus, Check, Info, Package } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";

import rollupImg from "@/assets/shop/rollup.jpg";
import bloeckeImg from "@/assets/shop/bloecke.jpg";
import kugelschreiberImg from "@/assets/shop/kugelschreiber.jpg";
import messestandImg from "@/assets/shop/messestand.jpg";
import capImg from "@/assets/shop/cap.jpg";
import poloshirtImg from "@/assets/shop/poloshirt.jpg";

interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "werbemittel" | "kleidung" | "messe";
  sizes?: string[];
  minOrder?: number;
}

const PRODUCTS: ShopProduct[] = [
  {
    id: "rollup", name: "Roll-Up Banner", description: "Hochwertiges Roll-Up Display (85×200 cm) mit Imondu-Branding. Inkl. Tragetasche und Aufbauanleitung.",
    price: 189, image: rollupImg, category: "messe", minOrder: 1,
  },
  {
    id: "messestand", name: "Messestand Komplett", description: "Professioneller Messestand mit Theke, Rückwand und Beleuchtung im Imondu-Design. Individuell konfigurierbar.",
    price: 2490, image: messestandImg, category: "messe", minOrder: 1,
  },
  {
    id: "bloecke", name: "Notizblöcke (50er Pack)", description: "DIN A5 Notizblöcke mit Imondu-Cover, 50 Blatt liniert. Perfekt für Kundentermine und Messen.",
    price: 89, image: bloeckeImg, category: "werbemittel", minOrder: 1,
  },
  {
    id: "kugelschreiber", name: "Kugelschreiber (100er Pack)", description: "Premium-Kugelschreiber in Imondu-Lila mit Logo-Gravur. Metallgehäuse, blaue Mine.",
    price: 149, image: kugelschreiberImg, category: "werbemittel", minOrder: 1,
  },
  {
    id: "cap", name: "Imondu Cap", description: "Hochwertige Snapback-Cap mit gesticktem Imondu-Logo. One Size, verstellbar.",
    price: 24.90, image: capImg, category: "kleidung", minOrder: 1,
  },
  {
    id: "poloshirt", name: "Imondu Poloshirt", description: "Bequemes Poloshirt in Imondu-Lila mit gesticktem Logo auf der Brust. 100% Baumwolle.",
    price: 39.90, image: poloshirtImg, category: "kleidung", sizes: ["S", "M", "L", "XL", "XXL"], minOrder: 1,
  },
];

const CATEGORIES = [
  { id: "alle", label: "Alle Produkte" },
  { id: "werbemittel", label: "Werbemittel" },
  { id: "kleidung", label: "Kleidung" },
  { id: "messe", label: "Messe & Events" },
];

interface CartItem {
  product: ShopProduct;
  quantity: number;
  size?: string;
}

export default function MerchShop() {
  const { toast } = useToast();
  const [category, setCategory] = useState("alle");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showCart, setShowCart] = useState(false);

  const filtered = category === "alle" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  const addToCart = () => {
    if (!selectedProduct) return;
    if (selectedProduct.sizes && !selectedSize) {
      toast({ title: "Bitte Größe wählen", description: "Wähle eine Größe aus.", variant: "destructive" });
      return;
    }
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === selectedProduct.id && c.size === selectedSize);
      if (existing) {
        return prev.map((c) => c.product.id === selectedProduct.id && c.size === selectedSize ? { ...c, quantity: c.quantity + quantity } : c);
      }
      return [...prev, { product: selectedProduct, quantity, size: selectedSize || undefined }];
    });
    toast({ title: "In den Warenkorb gelegt! 🛒", description: `${quantity}x ${selectedProduct.name} hinzugefügt.` });
    setSelectedProduct(null);
    setQuantity(1);
    setSelectedSize("");
  };

  const removeFromCart = (index: number) => setCart((prev) => prev.filter((_, i) => i !== index));
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOrder = () => {
    toast({ title: "Bestellung aufgegeben! 🎉", description: `${cartCount} Artikel für ${cartTotal.toLocaleString("de-DE", { minimumFractionDigits: 2 })} € bestellt.` });
    setCart([]);
    setShowCart(false);
  };

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-1 rounded-full gradient-brand" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Merchandise Shop</h1>
            <p className="text-sm text-muted-foreground mt-1">Werbemittel und Kleidung mit Imondu-Branding bestellen</p>
          </div>
          <Button variant="outline" className="gap-2 relative border-primary/20 hover:border-primary/40 transition-colors" onClick={() => setShowCart(true)}>
            <ShoppingCart className="h-4 w-4 text-primary" />
            Warenkorb
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 gradient-brand text-primary-foreground text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? "default" : "outline"}
              size="sm"
              className={category === cat.id ? "gradient-brand border-0 text-white shadow-crm-md" : "border-border hover:border-primary/30 hover:text-primary transition-colors"}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-crm-sm hover:shadow-crm-lg transition-all duration-300 group cursor-pointer"
              onClick={() => { setSelectedProduct(product); setQuantity(1); setSelectedSize(""); }}
            >
              <div className="aspect-square overflow-hidden bg-muted relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="gradient-brand border-0 text-white text-[10px] font-semibold shadow-crm-sm">
                    {product.category === "werbemittel" ? "Werbemittel" : product.category === "kleidung" ? "Kleidung" : "Messe"}
                  </Badge>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-foreground mb-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{product.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</span>
                  <Button size="sm" className="gap-1.5 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90 transition-opacity">
                    <ShoppingCart className="h-3.5 w-3.5" /> Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Detail Dialog */}
        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="w-8 h-1 rounded-full gradient-brand mb-2" />
              <DialogTitle className="font-display">{selectedProduct?.name}</DialogTitle>
              <DialogDescription>Produkt konfigurieren und bestellen</DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted shadow-crm-sm">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>

                {selectedProduct.sizes && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Größe wählen:</p>
                    <div className="flex gap-2">
                      {selectedProduct.sizes.map((size) => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? "default" : "outline"}
                          size="sm"
                          className={selectedSize === size ? "gradient-brand border-0 text-white" : "border-border hover:border-primary/40"}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Menge:</p>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="h-8 w-8 border-border hover:border-primary/40" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-lg font-display font-semibold text-foreground w-8 text-center">{quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8 border-border hover:border-primary/40" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="gradient-brand-subtle rounded-lg p-4 flex justify-between items-center border border-primary/10">
                  <span className="text-sm text-muted-foreground">Gesamtpreis</span>
                  <span className="text-xl font-display font-bold text-primary">
                    {(selectedProduct.price * quantity).toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
                  </span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>Abbrechen</Button>
              <Button onClick={addToCart} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90">
                <ShoppingCart className="h-4 w-4" /> In den Warenkorb
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cart Dialog */}
        <Dialog open={showCart} onOpenChange={setShowCart}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="w-8 h-1 rounded-full gradient-brand mb-2" />
              <DialogTitle className="font-display">Warenkorb</DialogTitle>
              <DialogDescription>{cartCount} Artikel im Warenkorb</DialogDescription>
            </DialogHeader>
            {cart.length === 0 ? (
              <div className="py-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Dein Warenkorb ist leer</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {cart.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-card border border-border rounded-lg p-3 shadow-crm-sm">
                    <img src={item.product.image} alt={item.product.name} className="h-14 w-14 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity}x {item.product.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
                        {item.size && ` · Größe ${item.size}`}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary shrink-0">
                      {(item.product.price * item.quantity).toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
                    </span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(i)}>
                      ✕
                    </Button>
                  </div>
                ))}
                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="font-display font-semibold text-foreground">Gesamt</span>
                  <span className="text-xl font-display font-bold text-primary">{cartTotal.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</span>
                </div>
                <div className="gradient-brand-subtle border border-primary/10 rounded-lg p-3 flex items-start gap-2">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">Die Bestellung wird intern verarbeitet. Du erhältst eine Bestätigung per E-Mail.</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCart(false)}>Weiter einkaufen</Button>
              {cart.length > 0 && (
                <Button onClick={handleOrder} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90">
                  <Check className="h-4 w-4" /> Jetzt bestellen
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CRMLayout>
  );
}
