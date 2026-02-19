import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, User, Building2, Home, Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import imonduLogo from "@/assets/imondu-logo.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RabattCode {
  id: string;
  code: string;
  type: "developer" | "customer";
  nutzungen: number;
  zahlend: number;
  promo: number;
}

const INITIAL_CODES: RabattCode[] = [
  { id: "1", code: "K4P4", type: "customer", nutzungen: 1, zahlend: 0, promo: 1 },
  { id: "2", code: "H991", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
  { id: "3", code: "5Y31", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
  { id: "4", code: "27J5", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
  { id: "5", code: "178D", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
  { id: "6", code: "6L7Y", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
  { id: "7", code: "B8N8", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
  { id: "8", code: "J9B3", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
  { id: "9", code: "J12Q", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
];

export default function BeraterMicroseite() {
  const { toast } = useToast();
  const [beraterName, setBeraterName] = useState("Max Müller");
  const [beraterTitel, setBeraterTitel] = useState("Immobilienberater");
  const [beraterTelefon, setBeraterTelefon] = useState("+49 170 1234567");
  const [beraterEmail, setBeraterEmail] = useState("max.mueller@imondu.de");
  const [beraterAdresse, setBeraterAdresse] = useState("Musterstr. 1, 12345 Musterstadt");
  const [devCode, setDevCode] = useState("J9B3");
  const [cusCode, setCusCode] = useState("K4P4");
  const [activeTab, setActiveTab] = useState("developer");
  const [rabattCodes, setRabattCodes] = useState<RabattCode[]>(INITIAL_CODES);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newCodeType, setNewCodeType] = useState<"developer" | "customer">("developer");

  const devUrl = `https://imondu.com/developer?dev_code=${devCode}`;
  const cusUrl = `https://imondu.com/customer?cus_code=${cusCode}`;

  const totalNutzungen = rabattCodes.reduce((s, c) => s + c.nutzungen, 0);
  const totalZahlend = rabattCodes.reduce((s, c) => s + c.zahlend, 0);
  const totalPromo = rabattCodes.reduce((s, c) => s + c.promo, 0);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Link kopiert!", description: url });
  };

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  };

  const addRabattCode = () => {
    const code = newCode || generateCode();
    setRabattCodes(prev => [...prev, {
      id: Date.now().toString(),
      code,
      type: newCodeType,
      nutzungen: 0, zahlend: 0, promo: 0,
    }]);
    setNewCode("");
    setShowAddDialog(false);
    toast({ title: "Rabattcode erstellt", description: `Code: ${code}` });
  };

  const deleteRabattCode = (id: string) => {
    setRabattCodes(prev => prev.filter(c => c.id !== id));
    toast({ title: "Rabattcode gelöscht" });
  };

  const getAffiliateUrl = (rc: RabattCode) =>
    rc.type === "customer"
      ? `https://imondu.com/customer?cus_code=${rc.code}`
      : `https://imondu.com/developer?dev_code=${rc.code}`;

  return (
    <CRMLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-10 bg-accent rounded-full" />
          <h1 className="text-3xl font-bold text-foreground">Berater-Microseite</h1>
        </div>

        {/* Landing Page Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="developer" className="gap-2">
              <Building2 className="h-4 w-4" />
              Entwickler-Landingpage
            </TabsTrigger>
            <TabsTrigger value="customer" className="gap-2">
              <Home className="h-4 w-4" />
              Eigentümer-Landingpage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="developer">
            {/* URL Bar */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-4 mb-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary text-primary-foreground text-xs">Entwickler</Badge>
                <code className="flex-1 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded">{devUrl}</code>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(devUrl)}>
                  <Copy className="h-3.5 w-3.5 mr-1.5" /> Kopieren
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={devUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Öffnen
                  </a>
                </Button>
              </div>
            </div>
            {/* iframe */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden" style={{ height: 700 }}>
              <iframe
                src={devUrl}
                className="w-full h-full border-0"
                title="Entwickler Landingpage"
              />
            </div>
          </TabsContent>

          <TabsContent value="customer">
            {/* URL Bar */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-4 mb-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-accent text-accent-foreground text-xs">Eigentümer</Badge>
                <code className="flex-1 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded">{cusUrl}</code>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(cusUrl)}>
                  <Copy className="h-3.5 w-3.5 mr-1.5" /> Kopieren
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={cusUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Öffnen
                  </a>
                </Button>
              </div>
            </div>
            {/* iframe */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden" style={{ height: 700 }}>
              <iframe
                src={cusUrl}
                className="w-full h-full border-0"
                title="Eigentümer Landingpage"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Personalization Section */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-accent rounded-full" />
              <h2 className="font-semibold text-foreground">Personalisierung</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Passe deine persönliche Berater-Microseite an. Die Links werden automatisch mit deinem Code generiert.
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
              {/* Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
                    <Input value={beraterName} onChange={(e) => setBeraterName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Titel / Position</label>
                    <Input value={beraterTitel} onChange={(e) => setBeraterTitel(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Telefon</label>
                    <Input value={beraterTelefon} onChange={(e) => setBeraterTelefon(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">E-Mail</label>
                    <Input value={beraterEmail} onChange={(e) => setBeraterEmail(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Adresse</label>
                  <Input value={beraterAdresse} onChange={(e) => setBeraterAdresse(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Entwickler-Code (dev_code)</label>
                    <Input value={devCode} onChange={(e) => setDevCode(e.target.value)} placeholder="z.B. J9B3" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Eigentümer-Code (cus_code)</label>
                    <Input value={cusCode} onChange={(e) => setCusCode(e.target.value)} placeholder="z.B. K4P4" />
                  </div>
                </div>
              </div>

              {/* Preview Card (like the uploaded screenshot) */}
              <div className="relative overflow-hidden rounded-xl border border-border">
                {/* Top speech bubble area */}
                <div className="bg-[hsl(220,10%,35%)] text-white px-6 py-4 relative">
                  <p className="text-sm font-bold leading-snug">
                    HI, ICH BIN <span className="text-[hsl(38,92%,50%)]">{beraterName.split(" ")[0]?.toUpperCase()}</span>, DEIN
                    <br />PERSÖNLICHER BERATER.
                  </p>
                  {/* Triangle */}
                  <div className="absolute -bottom-3 left-12 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-[hsl(220,10%,35%)]" />
                </div>

                {/* Orange section */}
                <div className="bg-[hsl(38,92%,50%)] p-6 flex items-center gap-6">
                  {/* Avatar placeholder */}
                  <div className="h-28 w-28 rounded-lg bg-white/20 flex items-center justify-center shrink-0 border-4 border-white/30">
                    <User className="h-12 w-12 text-white/70" />
                  </div>
                  <div className="text-white space-y-1">
                    <h3 className="text-xl font-bold uppercase tracking-wide">{beraterName}</h3>
                    <p className="text-sm italic opacity-90">{beraterTitel}</p>
                    <div className="mt-3 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <img src={imonduLogo} alt="Imondu" className="h-4 brightness-0 invert" />
                        <span className="text-xs font-bold uppercase tracking-wider">IMONDU</span>
                      </div>
                      <div className="w-6 h-px bg-white/50 mt-1 mb-1" />
                      <p className="text-xs opacity-80">{beraterAdresse}</p>
                      <p className="text-xs opacity-80">Tel. {beraterTelefon}</p>
                      <p className="text-xs opacity-80">{beraterEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rabattcodes Section */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-accent rounded-full" />
                <h2 className="font-semibold text-foreground">Rabattcodes</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Verwalte deine Rabatt- und Affiliate-Codes.</p>
            </div>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Neuen Code anlegen
            </Button>
          </div>

          {/* KPI Tiles */}
          <div className="p-6 grid grid-cols-3 gap-4">
            <div className="border border-border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Gesamt Code-Nutzungen</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalNutzungen}</p>
            </div>
            <div className="border border-border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Zahlende Nutzungen</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalZahlend}</p>
            </div>
            <div className="border border-border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Kostenlose Promo-Nutzungen</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalPromo}</p>
            </div>
          </div>

          {/* Code List */}
          <div className="px-6 pb-6 space-y-2">
            {rabattCodes.map((rc) => {
              const url = getAffiliateUrl(rc);
              const isExpanded = expandedCode === rc.id;
              return (
                <div key={rc.id} className="border border-border rounded-lg bg-muted/30">
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedCode(isExpanded ? null : rc.id)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Rabatt-Code:</span>
                      <span className="font-bold text-foreground">{rc.code}</span>
                      <Badge variant="outline" className="text-xs">
                        {rc.type === "customer" ? "Eigentümer" : "Entwickler"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Affiliate-Link:</span>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline" onClick={e => e.stopPropagation()}>
                        {url}
                      </a>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); copyToClipboard(url); }}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-3 pt-1 border-t border-border flex items-center justify-between">
                      <div className="flex gap-6 text-sm">
                        <span className="text-muted-foreground">Nutzungen: <span className="font-medium text-foreground">{rc.nutzungen}</span></span>
                        <span className="text-muted-foreground">Zahlend: <span className="font-medium text-foreground">{rc.zahlend}</span></span>
                        <span className="text-muted-foreground">Promo: <span className="font-medium text-foreground">{rc.promo}</span></span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteRabattCode(rc.id)}>
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Löschen
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Code Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuen Rabattcode anlegen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Code (leer = automatisch generiert)</label>
                <Input value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} placeholder="z.B. X7K2" maxLength={6} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Typ</label>
                <Select value={newCodeType} onValueChange={(v) => setNewCodeType(v as "developer" | "customer")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">Entwickler (dev_code)</SelectItem>
                    <SelectItem value="customer">Eigentümer (cus_code)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Abbrechen</Button>
              <Button onClick={addRabattCode}>Code erstellen</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CRMLayout>
  );
}
