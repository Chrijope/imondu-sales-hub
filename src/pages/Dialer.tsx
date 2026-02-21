import CRMLayout from "@/components/CRMLayout";
import { Phone, Play, Pause, SkipForward, CheckCircle2, XCircle, Clock, Calendar } from "lucide-react";
import { SAMPLE_LEADS } from "@/data/crm-data";

const callStatuses = [
  { label: "Erreicht", icon: CheckCircle2, color: "text-success" },
  { label: "Nicht erreicht", icon: XCircle, color: "text-destructive" },
  { label: "Termin vereinbart", icon: Calendar, color: "text-info" },
  { label: "Kein Interesse", icon: XCircle, color: "text-muted-foreground" },
  { label: "Wiedervorlage", icon: Clock, color: "text-warning" },
];

const dialerLeads = SAMPLE_LEADS.filter((l) => l.phone).slice(0, 6);

export default function Dialer() {
  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Powerdialer</h1>
          <p className="text-sm text-muted-foreground mt-1">Automatische Anwahl deiner Lead-Liste</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Current Call */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card rounded-xl p-6 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Aktueller Kontakt</p>
              <h2 className="text-xl font-display font-bold text-foreground">Anna Schmidt</h2>
              <p className="text-sm text-muted-foreground mt-1">+49 170 1234567</p>
              <p className="text-xs text-muted-foreground mt-0.5">B2C · Website · Priorität: Hoch</p>

              {/* Timer */}
              <div className="mt-6 text-3xl font-display font-bold text-foreground tabular-nums">
                00:00
              </div>
              <p className="text-xs text-muted-foreground mt-1">Bereit zum Anrufen</p>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                  <SkipForward className="h-5 w-5 text-muted-foreground" />
                </button>
                <button className="h-16 w-16 rounded-full gradient-brand flex items-center justify-center shadow-crm-md hover:opacity-90 transition-opacity">
                  <Play className="h-6 w-6 text-primary-foreground ml-0.5" />
                </button>
                <button className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                  <Pause className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Call Status Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                {callStatuses.map((s) => (
                  <button
                    key={s.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Call-Notiz</h3>
              <textarea
                placeholder="Notizen zum Gespräch eingeben..."
                className="w-full h-24 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>

          {/* Lead Queue */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Warteschlange ({dialerLeads.length})
            </h3>
            <div className="space-y-2">
              {dialerLeads.map((lead, i) => {
                const name = lead.type === "b2b" ? lead.companyName : `${lead.firstName} ${lead.lastName}`;
                return (
                  <div
                    key={lead.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                      i === 0
                        ? "bg-primary/5 border border-primary/20"
                        : "hover:bg-secondary/50"
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{name}</p>
                      <p className="text-xs text-muted-foreground">{lead.phone}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        lead.type === "b2c" ? "text-b2c" : "text-b2b"
                      }`}
                    >
                      {lead.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
