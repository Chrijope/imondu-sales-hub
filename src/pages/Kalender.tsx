import { useState, useEffect } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CheckCircle2, Link2, ExternalLink, Chrome, Apple, Mail } from "lucide-react";

interface CalendarProvider {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

const PROVIDERS: CalendarProvider[] = [
  { id: "google", name: "Google Calendar", icon: Chrome, color: "text-[hsl(4,90%,58%)]", description: "Gmail & Google Workspace Kalender verbinden" },
  { id: "outlook", name: "Microsoft Outlook", icon: Mail, color: "text-[hsl(210,80%,52%)]", description: "Outlook / Office 365 Kalender verbinden" },
  { id: "apple", name: "Apple Kalender", icon: Apple, color: "text-foreground", description: "iCloud Kalender verbinden" },
];

export default function Kalender() {
  const { toast } = useToast();
  const [connected, setConnected] = useState<Record<string, boolean>>(() => {
    try { const s = localStorage.getItem("kalender-connected"); if (s) return JSON.parse(s); } catch {} return {};
  });
  const [syncOptions, setSyncOptions] = useState<Record<string, boolean>>(() => {
    try { const s = localStorage.getItem("kalender-sync-options"); if (s) return JSON.parse(s); } catch {}
    return { "Gebuchte Termine automatisch eintragen": true, "Follow-up Erinnerungen": true, "Powerdialer-Termine": true, "Bidirektionale Sync": true };
  });

  useEffect(() => { localStorage.setItem("kalender-connected", JSON.stringify(connected)); }, [connected]);
  useEffect(() => { localStorage.setItem("kalender-sync-options", JSON.stringify(syncOptions)); }, [syncOptions]);

  const handleConnect = (provider: CalendarProvider) => {
    setConnected((prev) => ({ ...prev, [provider.id]: !prev[provider.id] }));
    toast({
      title: connected[provider.id] ? `${provider.name} getrennt` : `${provider.name} verbunden ✓`,
      description: connected[provider.id]
        ? "Die Kalender-Synchronisation wurde deaktiviert."
        : "Meetings und Termine werden ab jetzt synchronisiert.",
    });
  };

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
       <div className="max-w-4xl space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-10 h-1 rounded-full gradient-brand" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">Kalender</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verbinde deinen Kalender, um Meetings und Termine automatisch zu synchronisieren
        </p>

        {/* Info */}
        <div className="gradient-brand-subtle border border-primary/15 rounded-xl p-4 flex items-start gap-3 mt-6">
          <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Nach der Verbindung werden <strong className="text-foreground">Termine</strong>, <strong className="text-foreground">Meetings</strong> und <strong className="text-foreground">Follow-ups</strong> automatisch in deinen Kalender eingetragen und synchronisiert.
          </p>
        </div>

        {/* Providers */}
        <div className="grid gap-4 mt-6">
          {PROVIDERS.map((provider) => {
            const isConnected = connected[provider.id];
            return (
              <div
                key={provider.id}
                className={`bg-card rounded-xl p-5 shadow-crm-sm border transition-colors ${
                  isConnected ? "border-primary/30 bg-primary/[0.02]" : "border-border"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl bg-secondary flex items-center justify-center`}>
                    <provider.icon className={`h-6 w-6 ${provider.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-display font-semibold text-foreground">{provider.name}</h3>
                      {isConnected && <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{provider.description}</p>
                  </div>
                  <Button
                    variant={isConnected ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleConnect(provider)}
                    className={isConnected ? "" : "gradient-brand border-0 text-white"}
                  >
                    {isConnected ? (
                      <>
                        <Link2 className="h-3.5 w-3.5 mr-1.5" />
                        Trennen
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        Verbinden
                      </>
                    )}
                  </Button>
                </div>
                {isConnected && (
                  <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-3 gap-4">
                    {[
                      { label: "Sync-Status", value: "Aktiv" },
                      { label: "Letzte Sync", value: "Gerade eben" },
                      { label: "Synchronisierte Events", value: "0" },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                        <p className="text-sm font-semibold text-foreground mt-0.5">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sync-Optionen */}
        <div className="bg-card rounded-xl p-6 shadow-crm-sm border border-border mt-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-1 rounded-full gradient-brand" />
            <h2 className="text-sm font-display font-semibold text-foreground">Synchronisations-Optionen</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Gebuchte Termine automatisch eintragen", desc: "Neue Kundentermine werden direkt in den Kalender geschrieben" },
              { label: "Follow-up Erinnerungen", desc: "Automatische Kalender-Erinnerungen für Follow-ups" },
              { label: "Powerdialer-Termine", desc: "Im Powerdialer vereinbarte Termine synchronisieren" },
              { label: "Bidirektionale Sync", desc: "Änderungen im Kalender werden ins CRM übernommen" },
            ].map((opt) => (
              <label key={opt.label} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncOptions[opt.label] ?? true}
                  onChange={() => setSyncOptions(prev => ({ ...prev, [opt.label]: !(prev[opt.label] ?? true) }))}
                  className="mt-0.5 rounded border-border text-primary focus:ring-primary"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        </div>
      </div>
    </CRMLayout>
  );
}
