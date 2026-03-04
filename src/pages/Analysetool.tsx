import { useState, useEffect } from "react";
import CRMLayout from "@/components/CRMLayout";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Share2, Linkedin, Instagram, Copy, Link2, PlusCircle, FileText, Eye, Home, Building2, Calendar, MapPin, X } from "lucide-react";
import InseratFunnel from "@/components/InseratFunnel";
import { RABATT_CODES } from "@/utils/rabattcode-attribution";

const SHARE_ROLES = ["admin", "inhaber", "vertriebsleiter", "vertriebspartner"];

// Map role IDs to mitarbeiter IDs for rabattcode lookup
const ROLE_TO_MITARBEITER: Record<string, string> = {
  inhaber: "u1",
  vertriebsleiter: "u2",
  vertriebspartner: "u3",
};

interface SavedInserat {
  id: string;
  titel: string;
  objekttyp: string;
  adresse: string;
  eigentuemerName: string;
  eigentuemerEmail: string;
  rabattCode?: string;
  erstelltAm: string;
  status: string;
  bilder: number;
  wohnflaeche: string;
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.06a8.22 8.22 0 0 0 3.84.96V6.69Z" />
    </svg>
  );
}

function InseratDetailView({ inserat, onClose }: { inserat: SavedInserat; onClose: () => void }) {
  return (
    <div className="p-6 lg:p-8 min-h-screen dashboard-mesh-bg animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" size="sm" onClick={onClose} className="mb-4 gap-1.5">
          <X className="h-4 w-4" /> Zurück
        </Button>
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="gradient-brand px-6 py-4">
            <h2 className="text-xl font-bold text-white">{inserat.titel}</h2>
            <p className="text-white/70 text-sm">{inserat.objekttyp}</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{inserat.adresse || "Keine Adresse"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{new Date(inserat.erstelltAm).toLocaleDateString("de-DE")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Home className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{inserat.wohnflaeche ? `${inserat.wohnflaeche} m²` : "–"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{inserat.bilder} Bilder</span>
              </div>
            </div>
            <hr className="border-border" />
            <div className="space-y-2">
              <p className="text-sm"><span className="text-muted-foreground">Eigentümer:</span> <span className="font-medium text-foreground">{inserat.eigentuemerName}</span></p>
              <p className="text-sm"><span className="text-muted-foreground">E-Mail:</span> <span className="font-medium text-foreground">{inserat.eigentuemerEmail}</span></p>
              {inserat.rabattCode && (
                <p className="text-sm"><span className="text-muted-foreground">Rabattcode:</span> <Badge variant="outline" className="ml-1 text-xs">{inserat.rabattCode}</Badge></p>
              )}
              <p className="text-sm"><span className="text-muted-foreground">Status:</span> <Badge className="ml-1 bg-primary/10 text-primary border-0 text-xs">{inserat.status}</Badge></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Analysetool() {
  const { currentRoleId } = useUserRole();
  const { toast } = useToast();
  const [showShare, setShowShare] = useState(false);
  const [showFunnel, setShowFunnel] = useState(false);
  const [showInserate, setShowInserate] = useState(false);
  const [selectedInserat, setSelectedInserat] = useState<SavedInserat | null>(null);
  const [savedInserate, setSavedInserate] = useState<SavedInserat[]>([]);
  const canShare = SHARE_ROLES.includes(currentRoleId);

  // Get VP's customer rabattcode
  const mitarbeiterId = ROLE_TO_MITARBEITER[currentRoleId];
  const vpCustomerCode = mitarbeiterId
    ? RABATT_CODES.find(c => c.mitarbeiterId === mitarbeiterId && c.type === "customer")?.code
    : undefined;

  const analyseUrl = "https://imondu-potenzial-radar.lovable.app";

  const shareText = "🏠 Kennst du das Potenzial deiner Immobilie? Jetzt kostenlos analysieren mit dem IMONDU Potenzial-Radar!";

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("imondu-inserate") || "[]");
    setSavedInserate(stored);
  }, [showFunnel]);

  const shareOn = (platform: string) => {
    const urls: Record<string, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(analyseUrl)}`,
      instagram: "#",
      tiktok: "#",
    };
    if (platform === "instagram" || platform === "tiktok") {
      navigator.clipboard.writeText(shareText + "\n" + analyseUrl);
      toast({ title: "Text kopiert!", description: `Füge ihn in deinem ${platform === "instagram" ? "Instagram" : "TikTok"}-Post ein.` });
      return;
    }
    window.open(urls[platform], "_blank", "noopener,noreferrer");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(analyseUrl);
    toast({ title: "Link kopiert!" });
  };

  if (selectedInserat) {
    return (
      <CRMLayout>
        <InseratDetailView inserat={selectedInserat} onClose={() => setSelectedInserat(null)} />
      </CRMLayout>
    );
  }

  if (showFunnel) {
    return (
      <CRMLayout>
        <InseratFunnel onClose={() => setShowFunnel(false)} rabattCode={vpCustomerCode} />
      </CRMLayout>
    );
  }

  return (
    <CRMLayout>
      <div className="h-[calc(100vh-2rem)] relative">
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          {savedInserate.length > 0 && (
            <Button
              onClick={() => setShowInserate(!showInserate)}
              variant="outline"
              size="sm"
              className="gap-1.5 bg-card shadow-md"
            >
              <FileText className="h-3.5 w-3.5" />
              Meine Inserate ({savedInserate.length})
            </Button>
          )}

          <Button
            onClick={() => setShowFunnel(true)}
            className="gap-1.5 gradient-brand border-0 text-primary-foreground shadow-md"
            size="sm"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Inserat inserieren
          </Button>

          {canShare && (
            <>
              {showShare && (
                <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-1.5 shadow-lg animate-fade-in">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => shareOn("linkedin")} title="LinkedIn">
                    <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => shareOn("instagram")} title="Instagram">
                    <Instagram className="h-4 w-4 text-[#E4405F]" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => shareOn("tiktok")} title="TikTok">
                    <TikTokIcon className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-5 bg-border mx-1" />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={copyLink} title="Link kopieren">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 bg-card shadow-md"
                onClick={() => setShowShare(!showShare)}
              >
                <Share2 className="h-3.5 w-3.5" />
                Teilen
              </Button>
            </>
          )}
        </div>

        {/* Saved Inserate Dropdown */}
        {showInserate && savedInserate.length > 0 && (
          <div className="absolute top-14 right-3 z-20 w-96 bg-card border border-border rounded-xl shadow-xl animate-fade-in overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Meine Inserate</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowInserate(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {savedInserate.map((ins) => (
                <div
                  key={ins.id}
                  className="px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between gap-3"
                  onClick={() => { setSelectedInserat(ins); setShowInserate(false); }}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{ins.titel || "Ohne Titel"}</p>
                    <p className="text-xs text-muted-foreground">{ins.objekttyp} · {new Date(ins.erstelltAm).toLocaleDateString("de-DE")}</p>
                    {ins.rabattCode && <Badge variant="outline" className="text-[10px] mt-1">Code: {ins.rabattCode}</Badge>}
                  </div>
                  <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {vpCustomerCode && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-card border border-border text-foreground shadow-md text-xs gap-1.5">
              <Building2 className="h-3 w-3 text-primary" />
              Rabattcode: {vpCustomerCode}
            </Badge>
          </div>
        )}

        <iframe
          src={analyseUrl}
          className="w-full h-full border-0 rounded-xl"
          title="Imondu Analysetool"
          allow="fullscreen"
        />
      </div>
    </CRMLayout>
  );
}
