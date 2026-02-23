import { Instagram, Linkedin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";
import { Platform, PLATFORM_OPTIONS } from "@/data/social-media-data";

// TikTok icon (not in lucide)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.49a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.2 8.2 0 0 0 4.76 1.52V6.79a4.83 4.83 0 0 1-1-.1z" />
    </svg>
  );
}

const ICONS = {
  linkedin: Linkedin,
  instagram: Instagram,
  tiktok: TikTokIcon,
};

export default function PlatformSelector({ platform, setPlatform }: { platform: Platform; setPlatform: (p: Platform) => void }) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Target className="h-4 w-4 text-primary" /> Plattform wählen
      </Label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PLATFORM_OPTIONS.map((p) => {
          const Icon = ICONS[p.iconName];
          return (
            <button
              key={p.value}
              onClick={() => setPlatform(p.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                platform === p.value
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <Icon className={`h-5 w-5 ${platform === p.value ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-xs font-medium text-foreground">{p.label}</span>
              <span className="text-[10px] text-muted-foreground text-center">{p.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
