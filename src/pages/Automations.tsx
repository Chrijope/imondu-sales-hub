import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Zap, Plus, Trash2, Mail, Phone, Clock, ArrowDown, Target, CheckCircle2,
  XCircle, RotateCcw, AlertCircle, Settings2, Play, Pause, Copy,
  ChevronDown, ChevronRight, Flag, Building2, Briefcase, MoveRight,
  Timer, MessageSquare, CalendarPlus, UserPlus, Bell, Eye, Pencil,
} from "lucide-react";
import { B2C_PIPELINE_STAGES, B2B_PIPELINE_STAGES } from "@/data/crm-data";

/* ── Types ─────────────────────────────────────── */
type StepType = "trigger" | "aktion" | "bedingung" | "verzoegerung";
type Pipeline = "b2c" | "b2b";

interface AutomationStep {
  id: string;
  type: StepType;
  config: Record<string, string>;
}

interface Automation {
  id: string;
  name: string;
  beschreibung: string;
  pipeline: Pipeline;
  aktiv: boolean;
  steps: AutomationStep[];
  erstelltAm: string;
  ausfuehrungen: number;
  letzteAusfuehrung?: string;
}

/* ── Trigger/Action Options ────────────────────── */
const TRIGGER_OPTIONS = [
  { value: "lead_erstellt", label: "Ein neuer Lead wurde hinzugefügt", icon: UserPlus },
  { value: "status_geaendert", label: "Lead-Status hat sich geändert", icon: MoveRight },
  { value: "status_erreicht", label: "Lead erreicht bestimmten Status", icon: Target },
  { value: "inaktiv", label: "Lead ist inaktiv seit X Tagen", icon: Clock },
  { value: "termin_erstellt", label: "Termin wurde erstellt", icon: CalendarPlus },
  { value: "anruf_ergebnis", label: "Anrufergebnis wurde gesetzt", icon: Phone },
  { value: "email_geoeffnet", label: "E-Mail wurde geöffnet", icon: Eye },
  { value: "kein_kontakt", label: "Kein Kontakt seit X Tagen", icon: AlertCircle },
];

const AKTION_OPTIONS = [
  { value: "email_senden", label: "E-Mail mit Vorlage senden", icon: Mail },
  { value: "status_aendern", label: "Lead-Status ändern", icon: MoveRight },
  { value: "aufgabe_erstellen", label: "Aufgabe erstellen", icon: CheckCircle2 },
  { value: "benachrichtigung", label: "Benachrichtigung senden", icon: Bell },
  { value: "zuweisen", label: "Lead zuweisen", icon: UserPlus },
  { value: "notiz_hinzufuegen", label: "Notiz hinzufügen", icon: MessageSquare },
  { value: "als_verloren", label: "Als verloren markieren", icon: XCircle },
  { value: "follow_up", label: "Follow-Up erstellen", icon: RotateCcw },
  { value: "termin_vorschlagen", label: "Terminvorschlag senden", icon: CalendarPlus },
];

const BEDINGUNG_OPTIONS = [
  { value: "status_ist", label: "Status ist", icon: Flag },
  { value: "pipeline_ist", label: "Pipeline ist", icon: Target },
  { value: "quelle_ist", label: "Lead-Quelle ist", icon: Target },
  { value: "prioritaet_ist", label: "Priorität ist", icon: AlertCircle },
  { value: "hat_email", label: "Hat E-Mail-Adresse", icon: Mail },
  { value: "hat_telefon", label: "Hat Telefonnummer", icon: Phone },
];

const VERZOEGERUNG_OPTIONS = [
  { value: "minuten", label: "Minuten warten", icon: Timer },
  { value: "stunden", label: "Stunden warten", icon: Clock },
  { value: "tage", label: "Tage warten", icon: Clock },
];

const EMAIL_VORLAGEN = [
  "Willkommens-Mail", "Nachfassen #1", "Nachfassen #2", "Nachfassen #3",
  "Terminbestätigung", "Angebots-Follow-Up", "Inaktivitäts-Reminder",
  "Dankeschön", "Stornierung vermeiden",
];

/* ── Sample Automations ────────────────────────── */
const SAMPLE_AUTOMATIONS: Automation[] = [
  {
    id: "auto-1", name: "Willkommens-Workflow B2C", beschreibung: "Sendet automatisch eine Willkommens-Mail wenn ein neuer B2C-Lead erstellt wird und erstellt eine Nachfass-Aufgabe nach 3 Tagen.",
    pipeline: "b2c", aktiv: true, erstelltAm: "2026-01-15", ausfuehrungen: 342, letzteAusfuehrung: "2026-02-20T08:30:00",
    steps: [
      { id: "s1", type: "trigger", config: { trigger: "lead_erstellt" } },
      { id: "s2", type: "aktion", config: { aktion: "email_senden", vorlage: "Willkommens-Mail", empfaenger: "Neuer Lead" } },
      { id: "s3", type: "verzoegerung", config: { typ: "tage", wert: "3" } },
      { id: "s4", type: "bedingung", config: { bedingung: "status_ist", wert: "Neuer Lead" } },
      { id: "s5", type: "aktion", config: { aktion: "aufgabe_erstellen", titel: "Lead nachfassen", beschreibung: "Ersten Kontaktversuch starten" } },
    ],
  },
  {
    id: "auto-2", name: "Inaktivitäts-Checker B2C", beschreibung: "Markiert B2C-Leads als verloren, wenn 30 Tage kein Kontakt stattfand. Vorher wird ein Reminder gesendet.",
    pipeline: "b2c", aktiv: true, erstelltAm: "2026-01-20", ausfuehrungen: 87, letzteAusfuehrung: "2026-02-19T14:00:00",
    steps: [
      { id: "s1", type: "trigger", config: { trigger: "inaktiv", tage: "21" } },
      { id: "s2", type: "aktion", config: { aktion: "email_senden", vorlage: "Inaktivitäts-Reminder", empfaenger: "Lead" } },
      { id: "s3", type: "verzoegerung", config: { typ: "tage", wert: "9" } },
      { id: "s4", type: "bedingung", config: { bedingung: "status_ist", wert: "Neuer Lead" } },
      { id: "s5", type: "aktion", config: { aktion: "als_verloren" } },
    ],
  },
  {
    id: "auto-3", name: "B2B Partner Nachfass-Sequenz", beschreibung: "Automatisches Nachfassen für B2B-Partner nach der Präsentation mit gestaffelten E-Mails.",
    pipeline: "b2b", aktiv: false, erstelltAm: "2026-02-01", ausfuehrungen: 24,
    steps: [
      { id: "s1", type: "trigger", config: { trigger: "status_erreicht", status: "Präsentation/Demo" } },
      { id: "s2", type: "verzoegerung", config: { typ: "tage", wert: "1" } },
      { id: "s3", type: "aktion", config: { aktion: "email_senden", vorlage: "Nachfassen #1", empfaenger: "Lead" } },
      { id: "s4", type: "verzoegerung", config: { typ: "tage", wert: "3" } },
      { id: "s5", type: "bedingung", config: { bedingung: "status_ist", wert: "Präsentation/Demo" } },
      { id: "s6", type: "aktion", config: { aktion: "email_senden", vorlage: "Nachfassen #2", empfaenger: "Lead" } },
      { id: "s7", type: "verzoegerung", config: { typ: "tage", wert: "5" } },
      { id: "s8", type: "aktion", config: { aktion: "follow_up", notiz: "Erneut kontaktieren – letzte Chance" } },
    ],
  },
  {
    id: "auto-4", name: "Status-Eskalation B2C", beschreibung: "Wenn ein Lead 7 Tage auf Follow-Up steht ohne Aktivität, wird der Teamleiter benachrichtigt.",
    pipeline: "b2c", aktiv: true, erstelltAm: "2026-02-10", ausfuehrungen: 12, letzteAusfuehrung: "2026-02-18T10:00:00",
    steps: [
      { id: "s1", type: "trigger", config: { trigger: "inaktiv", tage: "7" } },
      { id: "s2", type: "bedingung", config: { bedingung: "status_ist", wert: "Follow-Up" } },
      { id: "s3", type: "aktion", config: { aktion: "benachrichtigung", empfaenger: "Teamleiter", nachricht: "Lead seit 7 Tagen ohne Aktivität im Follow-Up" } },
    ],
  },
];

/* ── Step Config Labels ────────────────────────── */
function getStepLabel(step: AutomationStep): string {
  if (step.type === "trigger") {
    const opt = TRIGGER_OPTIONS.find(o => o.value === step.config.trigger);
    return opt?.label || step.config.trigger || "Trigger wählen";
  }
  if (step.type === "aktion") {
    const opt = AKTION_OPTIONS.find(o => o.value === step.config.aktion);
    return opt?.label || step.config.aktion || "Aktion wählen";
  }
  if (step.type === "bedingung") {
    const opt = BEDINGUNG_OPTIONS.find(o => o.value === step.config.bedingung);
    const label = opt?.label || "Bedingung";
    return step.config.wert ? `${label}: ${step.config.wert}` : label;
  }
  if (step.type === "verzoegerung") {
    return `${step.config.wert || "?"} ${step.config.typ || "Tage"} warten`;
  }
  return "Schritt";
}

function getStepIcon(step: AutomationStep) {
  if (step.type === "trigger") {
    const opt = TRIGGER_OPTIONS.find(o => o.value === step.config.trigger);
    return opt?.icon || Target;
  }
  if (step.type === "aktion") {
    const opt = AKTION_OPTIONS.find(o => o.value === step.config.aktion);
    return opt?.icon || Zap;
  }
  if (step.type === "bedingung") return Flag;
  if (step.type === "verzoegerung") return Timer;
  return Zap;
}

const STEP_COLORS: Record<StepType, { bg: string; badge: string; border: string }> = {
  trigger: { bg: "bg-primary/5", badge: "bg-primary text-primary-foreground", border: "border-primary/20" },
  aktion: { bg: "bg-success/5", badge: "bg-success text-white", border: "border-success/20" },
  bedingung: { bg: "bg-warning/5", badge: "bg-warning text-white", border: "border-warning/20" },
  verzoegerung: { bg: "bg-accent/30", badge: "bg-muted-foreground text-white", border: "border-border" },
};

const STEP_LABELS: Record<StepType, string> = {
  trigger: "TRIGGER",
  aktion: "AKTION",
  bedingung: "BEDINGUNG",
  verzoegerung: "VERZÖGERUNG",
};

/* ── Visual Step Component ─────────────────────── */
function VisualStep({ step, index, onRemove }: { step: AutomationStep; index: number; onRemove: () => void }) {
  const colors = STEP_COLORS[step.type];
  const Icon = getStepIcon(step);
  const label = getStepLabel(step);
  const configDetails = Object.entries(step.config).filter(([k]) => !["trigger", "aktion", "bedingung", "typ"].includes(k));

  return (
    <div className="flex flex-col items-center">
      {/* Connector line */}
      {index > 0 && (
        <div className="flex flex-col items-center mb-2">
          <div className="w-px h-6 bg-border" />
          <div className="h-5 w-5 rounded-full bg-muted border border-border flex items-center justify-center">
            <ArrowDown className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="w-px h-6 bg-border" />
        </div>
      )}

      {/* Step card */}
      <div className={`relative w-[320px] rounded-xl border ${colors.border} ${colors.bg} shadow-sm`}>
        {/* Step number + type badge */}
        <div className="absolute -top-2.5 left-4 flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-card border border-border text-[10px] font-bold flex items-center justify-center text-foreground">{index + 1}</span>
          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${colors.badge}`}>
            {STEP_LABELS[step.type]}
          </span>
        </div>

        <div className="pt-5 pb-4 px-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">{label}</p>
            </div>
            <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors p-1">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Config details */}
          {configDetails.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
              {configDetails.map(([key, val]) => (
                <div key={key} className="flex items-baseline gap-2 text-xs">
                  <span className="font-bold text-foreground uppercase text-[10px]">{key.replace(/_/g, " ")}</span>
                  <span className="text-muted-foreground">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Add Step Button ───────────────────────────── */
function AddStepButton({ onAdd }: { onAdd: (type: StepType) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center my-1">
      <div className="w-px h-4 bg-border" />
      <div className="relative">
        <button onClick={() => setOpen(!open)}
          className="h-8 w-8 rounded-full bg-success text-white flex items-center justify-center shadow-sm hover:bg-success/90 transition-colors">
          <Plus className="h-4 w-4" />
        </button>
        {open && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg p-2 z-10 w-48 space-y-1">
            {(["aktion", "bedingung", "verzoegerung"] as StepType[]).map(type => (
              <button key={type} onClick={() => { onAdd(type); setOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-md text-xs font-medium hover:bg-muted transition-colors flex items-center gap-2">
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${STEP_COLORS[type].badge}`}>
                  {STEP_LABELS[type]}
                </span>
                <span className="text-foreground">{type === "aktion" ? "Aktion hinzufügen" : type === "bedingung" ? "Bedingung hinzufügen" : "Verzögerung hinzufügen"}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="w-px h-4 bg-border" />
    </div>
  );
}

/* ── Automation Detail (Builder) ───────────────── */
function AutomationDetail({ automation, onBack, onUpdate }: {
  automation: Automation;
  onBack: () => void;
  onUpdate: (updated: Automation) => void;
}) {
  const [auto, setAuto] = useState(automation);
  const stages = auto.pipeline === "b2c" ? B2C_PIPELINE_STAGES : B2B_PIPELINE_STAGES;

  const updateAuto = (partial: Partial<Automation>) => {
    const updated = { ...auto, ...partial };
    setAuto(updated);
    onUpdate(updated);
  };

  const removeStep = (id: string) => {
    updateAuto({ steps: auto.steps.filter(s => s.id !== id) });
  };

  const addStep = (afterIndex: number, type: StepType) => {
    const newStep: AutomationStep = {
      id: `s-${Date.now()}`,
      type,
      config: type === "aktion" ? { aktion: "email_senden", vorlage: "Nachfassen #1", empfaenger: "Lead" }
        : type === "bedingung" ? { bedingung: "status_ist", wert: stages[0]?.name || "" }
        : type === "verzoegerung" ? { typ: "tage", wert: "1" }
        : { trigger: "lead_erstellt" },
    };
    const steps = [...auto.steps];
    steps.splice(afterIndex + 1, 0, newStep);
    updateAuto({ steps });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground gap-1 -ml-2">
            ← Zurück
          </Button>
          <div>
            <Input value={auto.name} onChange={e => updateAuto({ name: e.target.value })}
              className="text-lg font-bold border-none shadow-none p-0 h-auto focus-visible:ring-0" />
            <p className="text-xs text-muted-foreground mt-0.5">{auto.beschreibung}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{auto.aktiv ? "Aktiv" : "Inaktiv"}</span>
            <Switch checked={auto.aktiv} onCheckedChange={v => updateAuto({ aktiv: v })} />
          </div>
          <Badge variant="outline" className={`text-[10px] ${auto.pipeline === "b2c" ? "border-b2c/30 text-b2c" : "border-b2b/30 text-b2b"}`}>
            {auto.pipeline === "b2c" ? <><Building2 className="h-2.5 w-2.5 mr-1" />B2C</> : <><Briefcase className="h-2.5 w-2.5 mr-1" />B2B</>}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <p className="text-2xl font-bold text-foreground">{auto.ausfuehrungen}</p>
          <p className="text-[10px] text-muted-foreground">Ausführungen</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <p className="text-2xl font-bold text-foreground">{auto.steps.length}</p>
          <p className="text-[10px] text-muted-foreground">Schritte</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <p className="text-sm font-medium text-foreground">
            {auto.letzteAusfuehrung ? new Date(auto.letzteAusfuehrung).toLocaleDateString("de-DE") : "–"}
          </p>
          <p className="text-[10px] text-muted-foreground">Letzte Ausführung</p>
        </div>
      </div>

      {/* Visual Workflow Builder */}
      <div className="bg-card rounded-xl border border-border p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-1 rounded-full gradient-brand" />
          <h2 className="font-semibold text-foreground">Workflow-Builder</h2>
        </div>

        <div className="flex flex-col items-center py-4">
          {auto.steps.map((step, i) => (
            <div key={step.id}>
              <VisualStep step={step} index={i} onRemove={() => removeStep(step.id)} />
              <AddStepButton onAdd={(type) => addStep(i, type)} />
            </div>
          ))}

          {/* End marker */}
          <div className="flex flex-col items-center mt-2">
            <div className="h-10 w-10 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
              <Flag className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Ende</p>
          </div>
        </div>
      </div>

      {/* Pipeline-Status Referenz */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-1 rounded-full gradient-brand" />
          <h3 className="text-sm font-semibold text-foreground">Pipeline-Status ({auto.pipeline.toUpperCase()})</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {stages.map(s => (
            <Badge key={s.id} variant="outline" className="text-[10px] gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────── */
export default function Automations() {
  const [automations, setAutomations] = useState<Automation[]>(SAMPLE_AUTOMATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [pipelineFilter, setPipelineFilter] = useState<"alle" | Pipeline>("alle");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPipeline, setNewPipeline] = useState<Pipeline>("b2c");
  const [newBeschreibung, setNewBeschreibung] = useState("");

  const selected = automations.find(a => a.id === selectedId);

  const filtered = automations.filter(a => {
    if (pipelineFilter !== "alle" && a.pipeline !== pipelineFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return a.name.toLowerCase().includes(q) || a.beschreibung.toLowerCase().includes(q);
    }
    return true;
  });

  const handleUpdate = (updated: Automation) => {
    setAutomations(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newAuto: Automation = {
      id: `auto-${Date.now()}`,
      name: newName,
      beschreibung: newBeschreibung || "Neue Automation",
      pipeline: newPipeline,
      aktiv: false,
      erstelltAm: new Date().toISOString().split("T")[0],
      ausfuehrungen: 0,
      steps: [
        { id: `s-${Date.now()}`, type: "trigger", config: { trigger: "lead_erstellt" } },
      ],
    };
    setAutomations(prev => [...prev, newAuto]);
    setSelectedId(newAuto.id);
    setShowCreate(false);
    setNewName("");
    setNewBeschreibung("");
  };

  const handleToggle = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, aktiv: !a.aktiv } : a));
  };

  const handleDuplicate = (id: string) => {
    const orig = automations.find(a => a.id === id);
    if (!orig) return;
    const dup: Automation = {
      ...orig,
      id: `auto-${Date.now()}`,
      name: `${orig.name} (Kopie)`,
      aktiv: false,
      ausfuehrungen: 0,
      letzteAusfuehrung: undefined,
      steps: orig.steps.map(s => ({ ...s, id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` })),
    };
    setAutomations(prev => [...prev, dup]);
  };

  const handleDelete = (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
  };

  const activeCount = automations.filter(a => a.aktiv).length;
  const totalExec = automations.reduce((s, a) => s + a.ausfuehrungen, 0);

  return (
    <CRMLayout>
      {selected ? (
        <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
          <AutomationDetail automation={selected} onBack={() => setSelectedId(null)} onUpdate={handleUpdate} />
        </div>
      ) : (
        <div className="p-6 lg:p-8 space-y-5 animate-fade-in min-h-screen dashboard-mesh-bg">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1"><div className="w-10 h-1 rounded-full gradient-brand" /></div>
              <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Automations & Workflows</h1>
              <p className="text-sm text-muted-foreground mt-1">Automatisiere wiederkehrende Vertriebsprozesse für B2C & B2B Leads</p>
            </div>
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild>
                <Button className="gradient-brand border-0 text-primary-foreground gap-2"><Plus className="h-4 w-4" /> Neue Automation</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Neue Automation erstellen</DialogTitle></DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <label className="text-xs font-medium text-foreground">Name</label>
                    <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="z.B. Follow-Up Sequenz B2C" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Beschreibung</label>
                    <Input value={newBeschreibung} onChange={e => setNewBeschreibung(e.target.value)} placeholder="Was macht diese Automation?" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Pipeline</label>
                    <Select value={newPipeline} onValueChange={v => setNewPipeline(v as Pipeline)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="b2c">B2C – Eigentümer</SelectItem>
                        <SelectItem value="b2b">B2B – Partner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreate} disabled={!newName.trim()} className="gradient-brand border-0 text-primary-foreground">Erstellen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
              <Zap className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-3xl font-bold text-foreground">{automations.length}</p>
              <p className="text-xs text-muted-foreground">Automations gesamt</p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
              <Play className="h-5 w-5 text-success mx-auto mb-1" />
              <p className="text-3xl font-bold text-success">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Aktiv</p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
              <Pause className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-3xl font-bold text-muted-foreground">{automations.length - activeCount}</p>
              <p className="text-xs text-muted-foreground">Inaktiv</p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
              <CheckCircle2 className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-3xl font-bold text-foreground">{totalExec.toLocaleString("de-DE")}</p>
              <p className="text-xs text-muted-foreground">Ausführungen gesamt</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Automation suchen…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1">
              {(["alle", "b2c", "b2b"] as const).map(p => (
                <Button key={p} variant={pipelineFilter === p ? "default" : "outline"} size="sm"
                  className={pipelineFilter === p ? "gradient-brand border-0 text-primary-foreground" : ""}
                  onClick={() => setPipelineFilter(p)}>
                  {p === "alle" ? "Alle" : p === "b2c" ? "B2C" : "B2B"}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground ml-auto">{filtered.length} Automations</p>
          </div>

          {/* Automation Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map(auto => (
              <div key={auto.id}
                className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedId(auto.id)}>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${auto.aktiv ? "bg-success/10" : "bg-muted"}`}>
                        <Zap className={`h-4 w-4 ${auto.aktiv ? "text-success" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{auto.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant="outline" className={`text-[10px] ${auto.pipeline === "b2c" ? "border-b2c/30 text-b2c" : "border-b2b/30 text-b2b"}`}>
                            {auto.pipeline.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={`text-[10px] ${auto.aktiv ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}`}>
                            {auto.aktiv ? "Aktiv" : "Inaktiv"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleToggle(auto.id)}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        title={auto.aktiv ? "Deaktivieren" : "Aktivieren"}>
                        {auto.aktiv ? <Pause className="h-3.5 w-3.5 text-muted-foreground" /> : <Play className="h-3.5 w-3.5 text-success" />}
                      </button>
                      <button onClick={() => handleDuplicate(auto.id)}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Duplizieren">
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => handleDelete(auto.id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors" title="Löschen">
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{auto.beschreibung}</p>

                  {/* Mini workflow preview */}
                  <div className="flex items-center gap-1 flex-wrap mb-3">
                    {auto.steps.map((step, i) => {
                      const colors = STEP_COLORS[step.type];
                      return (
                        <div key={step.id} className="flex items-center gap-1">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${colors.badge}`}>
                            {STEP_LABELS[step.type].slice(0, 3)}
                          </span>
                          {i < auto.steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-3 border-t border-border/50">
                    <span>{auto.steps.length} Schritte</span>
                    <span>{auto.ausfuehrungen.toLocaleString("de-DE")} Ausführungen</span>
                    <span>Erstellt: {new Date(auto.erstelltAm).toLocaleDateString("de-DE")}</span>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                <Zap className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Keine Automations gefunden.</p>
              </div>
            )}
          </div>

          {/* Templates hint */}
          <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h3 className="text-sm font-semibold text-foreground">Vorlagen-Ideen</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: "Willkommens-Sequenz", desc: "Automatische E-Mail-Serie für neue Leads", icon: Mail },
                { title: "Inaktivitäts-Warnung", desc: "Leads nach X Tagen ohne Kontakt eskalieren", icon: AlertCircle },
                { title: "Follow-Up Kette", desc: "Gestaffelte Nachfass-E-Mails nach Termin", icon: RotateCcw },
              ].map(tpl => (
                <button key={tpl.title}
                  onClick={() => { setNewName(tpl.title); setNewBeschreibung(tpl.desc); setShowCreate(true); }}
                  className="text-left p-4 rounded-lg border border-dashed border-border hover:border-primary/30 hover:bg-primary/5 transition-all group">
                  <tpl.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                  <p className="text-xs font-semibold text-foreground">{tpl.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{tpl.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </CRMLayout>
  );
}
