import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Share2, Linkedin, Instagram, Copy, Link2, PlusCircle } from "lucide-react";
import InseratFunnel from "@/components/InseratFunnel";

const SHARE_ROLES = ["admin", "inhaber", "vertriebsleiter", "vertriebspartner"];

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.06a8.22 8.22 0 0 0 3.84.96V6.69Z" />
    </svg>
  );
}

export default function Analysetool() {
  const { currentRoleId } = useUserRole();
  const { toast } = useToast();
  const [showShare, setShowShare] = useState(false);
  const [showFunnel, setShowFunnel] = useState(false);
  const canShare = SHARE_ROLES.includes(currentRoleId);

  const analyseUrl = "https://imondu-potenzial-radar.lovable.app";

  const shareText = "🏠 Kennst du das Potenzial deiner Immobilie? Jetzt kostenlos analysieren mit dem IMONDU Potenzial-Radar!";

  const shareOn = (platform: string) => {
    const encoded = encodeURIComponent(shareText + "\n" + analyseUrl);
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

  if (showFunnel) {
    return (
      <CRMLayout>
        <InseratFunnel onClose={() => setShowFunnel(false)} />
      </CRMLayout>
    );
  }

  return (
    <CRMLayout>
      <div className="h-[calc(100vh-2rem)] relative">
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
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
