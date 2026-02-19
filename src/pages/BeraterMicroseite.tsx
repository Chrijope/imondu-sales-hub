import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, User, Building2, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import imonduLogo from "@/assets/imondu-logo.png";

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

  const devUrl = `https://imondu.com/developer?dev_code=${devCode}`;
  const cusUrl = `https://imondu.com/customer?cus_code=${cusCode}`;

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Link kopiert!", description: url });
  };

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
      </div>
    </CRMLayout>
  );
}
