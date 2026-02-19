import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone, Play, Pause, SkipForward, CheckCircle2, XCircle, Clock, Calendar,
  PhoneOff, User, Mail, MapPin, Home, FileText, MessageSquare, ArrowRight, Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lead, B2C_PIPELINE_STAGES, B2B_PIPELINE_STAGES } from "@/data/crm-data";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import CallScript, { ScriptStepResult } from "@/components/CallScript";

interface PowerdialerProps {
  leads: Lead[];
  type: "b2c" | "b2b";
}

const CALL_OUTCOMES = [
  { id: "reached", label: "Erreicht", icon: CheckCircle2, color: "text-[hsl(var(--success))]", bgColor: "bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/20" },
  { id: "not_reached", label: "Nicht erreicht", icon: XCircle, color: "text-destructive", bgColor: "bg-destructive/10 border-destructive/20" },
  { id: "followup", label: "Follow-Up vereinbart", icon: Clock, color: "text-[hsl(var(--warning))]", bgColor: "bg-[hsl(var(--warning))]/10 border-[hsl(var(--warning))]/20" },
  { id: "appointment", label: "Termin buchen", icon: Calendar, color: "text-[hsl(var(--info))]", bgColor: "bg-[hsl(var(--info))]/10 border-[hsl(var(--info))]/20" },
  { id: "no_interest", label: "Kein Interesse", icon: PhoneOff, color: "text-muted-foreground", bgColor: "bg-secondary border-border" },
  { id: "callback", label: "Wiedervorlage", icon: Phone, color: "text-primary", bgColor: "bg-primary/10 border-primary/20" },
];

export default function Powerdialer({ leads, type }: PowerdialerProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialing, setIsDialing] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [callNote, setCallNote] = useState("");
  const [showOutcomeDialog, setShowOutcomeDialog] = useState(false);
  const [callLog, setCallLog] = useState<{ leadId: string; outcome: string; note: string; duration: number; scriptResults?: ScriptStepResult[] }[]>([]);
  const [scriptResults, setScriptResults] = useState<ScriptStepResult[]>([]);
  const [scriptSaved, setScriptSaved] = useState(false);

  const dialerLeads = leads.filter((l) => l.phone);
  const current = dialerLeads[currentIndex];
  const stages = type === "b2c" ? B2C_PIPELINE_STAGES : B2B_PIPELINE_STAGES;

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isDialing) {
      interval = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isDialing]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const startCall = useCallback(() => {
    setIsDialing(true);
    setCallSeconds(0);
    setCallNote("");
    setScriptResults([]);
    setScriptSaved(false);
  }, []);

  const endCall = useCallback(() => {
    setIsDialing(false);
    setShowOutcomeDialog(true);
  }, []);

  const handleOutcome = (outcomeId: string) => {
    if (!current) return;
    const outcome = CALL_OUTCOMES.find((o) => o.id === outcomeId);
    setCallLog((prev) => [...prev, {
      leadId: current.id, outcome: outcomeId, note: callNote, duration: callSeconds,
      scriptResults: scriptResults.length > 0 ? scriptResults : undefined,
    }]);
    toast({
      title: `${outcome?.label} – ${type === "b2c" ? `${current.firstName} ${current.lastName}` : current.companyName}`,
      description: scriptSaved
        ? "Anruf + Gesprächsskript protokolliert & dem Kundenprofil zugeordnet"
        : callNote || "Anruf protokolliert",
    });
    setShowOutcomeDialog(false);
    setCallSeconds(0);
    setCallNote("");
    setScriptResults([]);
    setScriptSaved(false);
    if (currentIndex < dialerLeads.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const skipLead = () => {
    if (currentIndex < dialerLeads.length - 1) {
      setCurrentIndex((i) => i + 1);
      setCallSeconds(0);
      setCallNote("");
      setIsDialing(false);
      setScriptResults([]);
      setScriptSaved(false);
    }
  };

  if (dialerLeads.length === 0) {
    return (
      <div className="bg-card rounded-lg p-8 shadow-crm-sm border border-border text-center">
        <Phone className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Keine Leads mit Telefonnummer vorhanden</p>
      </div>
    );
  }

  const currentName = type === "b2c"
    ? `${current?.firstName} ${current?.lastName}`
    : current?.companyName || "";
  const currentStage = stages.find((s) => s.id === current?.status);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Dialer */}
        <div className="lg:col-span-2 space-y-4">
          {/* Current Contact Card */}
          <div className="bg-card rounded-lg p-6 shadow-crm-sm border border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Aktueller Kontakt ({currentIndex + 1}/{dialerLeads.length})
                </p>
                <h2 className="text-xl font-display font-bold text-foreground">{currentName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{current?.phone}</span>
                </div>
                {currentStage && (
                  <span className="inline-flex items-center gap-1.5 mt-2 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: currentStage.color }} />
                    {currentStage.name}
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate(`/lead/${current?.id}`)}>
                <ArrowRight className="h-3.5 w-3.5 mr-1" /> Kundenmaske
              </Button>
            </div>

            {/* Lead Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5 p-4 rounded-lg bg-secondary/30 border border-border/50">
              {type === "b2c" ? (
                <>
                  <InfoField icon={Mail} label="E-Mail" value={current?.email} />
                  <InfoField icon={Home} label="Objekttyp" value={current?.objekttyp} />
                  <InfoField icon={MapPin} label="Adresse" value={current?.objektAdresse || current?.address} />
                  <InfoField icon={User} label="Eigentümertyp" value={current?.eigentuemertyp} />
                  <InfoField icon={FileText} label="Interesse" value={current?.interesse} />
                  <InfoField icon={Flame} label="Priorität" value={current?.priority === "high" ? "Hoch" : current?.priority === "medium" ? "Mittel" : "Niedrig"} />
                </>
              ) : (
                <>
                  <InfoField icon={Mail} label="E-Mail" value={current?.email} />
                  <InfoField icon={User} label="Ansprechpartner" value={current?.contactPerson} />
                  <InfoField icon={MapPin} label="Region" value={current?.region} />
                  <InfoField icon={Home} label="Gewerk" value={current?.gewerk} />
                  <InfoField icon={FileText} label="Wert" value={current?.value ? `€${current.value.toLocaleString("de-DE")}` : "–"} />
                  <InfoField icon={Flame} label="Priorität" value={current?.priority === "high" ? "Hoch" : current?.priority === "medium" ? "Mittel" : "Niedrig"} />
                </>
              )}
            </div>

            {/* Timer + Controls */}
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-foreground tabular-nums">
                {formatTime(callSeconds)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isDialing ? "Gespräch läuft..." : "Bereit zum Anrufen"}
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <button onClick={skipLead} className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                  <SkipForward className="h-4 w-4 text-muted-foreground" />
                </button>
                {isDialing ? (
                  <button onClick={endCall} className="h-14 w-14 rounded-full bg-destructive flex items-center justify-center shadow-crm-md hover:opacity-90 transition-opacity">
                    <PhoneOff className="h-5 w-5 text-destructive-foreground" />
                  </button>
                ) : (
                  <button onClick={startCall} className="h-14 w-14 rounded-full gradient-brand flex items-center justify-center shadow-crm-md hover:opacity-90 transition-opacity">
                    <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                  </button>
                )}
                <button onClick={() => setIsDialing((d) => !d)} className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                  <Pause className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Call Script – auto-opens when dialing */}
          {isDialing && current && (
            <CallScript
              type={type}
              contactName={currentName}
              onSave={(results) => {
                setScriptResults(results);
                setScriptSaved(true);
                toast({
                  title: "Gesprächsskript gespeichert ✓",
                  description: `Skript wird dem Profil von ${currentName} unter Aktivitäten zugeordnet.`,
                });
              }}
            />
          )}

          {/* Notes */}
          <div className="bg-card rounded-lg p-5 shadow-crm-sm border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" /> Zusätzliche Call-Notiz
            </h3>
            <textarea
              value={callNote}
              onChange={(e) => setCallNote(e.target.value)}
              placeholder="Ergänzende Notizen zum Gespräch..."
              className="w-full h-20 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Quick Workflow Buttons (always visible) */}
          <div className="bg-card rounded-lg p-5 shadow-crm-sm border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">Schnell-Aktionen</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {CALL_OUTCOMES.map((outcome) => (
                <button
                  key={outcome.id}
                  onClick={() => handleOutcome(outcome.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors hover:opacity-80 ${outcome.bgColor}`}
                >
                  <outcome.icon className={`h-4 w-4 ${outcome.color}`} />
                  <span className="text-foreground">{outcome.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Queue */}
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-5 shadow-crm-sm border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Warteschlange ({dialerLeads.length})
            </h3>
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
              {dialerLeads.map((lead, i) => {
                const name = type === "b2c" ? `${lead.firstName} ${lead.lastName}` : lead.companyName;
                const isDone = callLog.some((l) => l.leadId === lead.id);
                return (
                  <button
                    key={lead.id}
                    onClick={() => { setCurrentIndex(i); setIsDialing(false); setCallSeconds(0); setCallNote(""); }}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors w-full text-left ${
                      i === currentIndex
                        ? "bg-primary/5 border border-primary/20"
                        : isDone
                          ? "bg-secondary/30 opacity-60"
                          : "hover:bg-secondary/50"
                    }`}
                  >
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${isDone ? "bg-[hsl(var(--success))]/20" : "bg-secondary"}`}>
                      {isDone ? <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))]" /> : <Phone className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground truncate">{name}</p>
                      <p className="text-[10px] text-muted-foreground">{lead.phone}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Call Stats */}
          <div className="bg-card rounded-lg p-5 shadow-crm-sm border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">Session-Statistik</h3>
            <div className="space-y-2">
              {[
                { label: "Anrufe gesamt", value: callLog.length },
                { label: "Erreicht", value: callLog.filter((l) => l.outcome === "reached").length },
                { label: "Termine gebucht", value: callLog.filter((l) => l.outcome === "appointment").length },
                { label: "Follow-Ups", value: callLog.filter((l) => l.outcome === "followup").length },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Outcome Dialog */}
      <Dialog open={showOutcomeDialog} onOpenChange={setShowOutcomeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Anruf beenden – {currentName}</DialogTitle>
            <DialogDescription>Wähle das Ergebnis des Gesprächs ({formatTime(callSeconds)})</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {CALL_OUTCOMES.map((outcome) => (
              <button
                key={outcome.id}
                onClick={() => handleOutcome(outcome.id)}
                className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors hover:opacity-80 ${outcome.bgColor}`}
              >
                <outcome.icon className={`h-4 w-4 ${outcome.color}`} />
                <span className="text-foreground">{outcome.label}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoField({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-xs font-medium text-foreground truncate">{value || "–"}</p>
      </div>
    </div>
  );
}
