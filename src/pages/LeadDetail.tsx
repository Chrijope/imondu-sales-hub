import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Building2,
  Clock,
  FileText,
  MessageSquare,
  CalendarDays,
  Edit3,
  Home,
  Ruler,
  Zap,
  Wrench,
  Globe,
  StickyNote,
  CheckSquare,
  PhoneCall,
  Video,
  CalendarCheck,
  CreditCard,
  Pencil,
  Check,
  X,
  Sparkles,
  BarChart3,
  Eye,
  Image,
} from "lucide-react";
import CRMLayout from "@/components/CRMLayout";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { SAMPLE_LEADS, B2C_PIPELINE_STAGES, B2B_PIPELINE_STAGES, Lead } from "@/data/crm-data";
import { useToast } from "@/hooks/use-toast";

const sampleActivities = [
  { type: "call" as const, desc: "Erstgespräch geführt – Interesse an Sanierungspaket", time: "Heute 11:30", by: "Max Müller" },
  {
    type: "script" as const,
    desc: 'Gesprächsskript "Standard B2C \u2013 Eigentümer" abgeschlossen (6 Schritte)',
    time: "Heute 11:30",
    by: "Max Müller",
    scriptDetails: [
      { step: "Begrüßung & Vorstellung", result: "Positiv – Kunde offen", note: "Freundlich empfangen" },
      { step: "Bedarfsanalyse", result: "Interesse an Sanierung", note: "Dach undicht, Fenster alt" },
      { step: "Nutzenargumentation", result: "Überzeugend", note: "Energieersparnis angesprochen" },
      { step: "Einwandbehandlung", result: "Zu teuer → ROI-Rechnung", note: "Konnte überzeugt werden" },
      { step: "Terminvereinbarung", result: "Termin am 25.02.", note: "Vor-Ort-Besichtigung" },
      { step: "Verabschiedung", result: "Positiv", note: "Unterlagen per Mail nachgeschickt" },
    ],
  },
  { type: "email" as const, desc: "Objektunterlagen angefordert", time: "Gestern 16:00", by: "Max Müller" },
  { type: "note" as const, desc: "Kunde möchte Vor-Ort-Termin, Follow-Up am Freitag", time: "18.02.2026", by: "Max Müller" },
  { type: "status_change" as const, desc: "Status geändert: Neuer Lead → Kontaktversuch", time: "17.02.2026", by: "System" },
  { type: "call" as const, desc: "Nicht erreicht – AB besprochen", time: "16.02.2026", by: "Max Müller" },
];

const activityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  call: Phone,
  email: Mail,
  note: MessageSquare,
  status_change: Clock,
  meeting: CalendarDays,
  script: FileText,
};

/* ── Editable Field Component ── */
function EditableField({
  label,
  value,
  icon: Icon,
  editing,
  editValues,
  fieldKey,
  onEdit,
  suffix,
}: {
  label: string;
  value: string | number | undefined | null;
  icon?: React.ComponentType<{ className?: string }>;
  editing: boolean;
  editValues: Record<string, string>;
  fieldKey: string;
  onEdit: (key: string, val: string) => void;
  suffix?: string;
}) {
  const displayVal = value != null && value !== "" ? `${value}${suffix || ""}` : "–";
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-muted-foreground flex items-center gap-2 shrink-0">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </dt>
      {editing ? (
        <input
          className="text-right text-sm bg-secondary/50 border border-border rounded px-2 py-0.5 w-[180px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
          value={editValues[fieldKey] ?? (value?.toString() || "")}
          onChange={(e) => onEdit(fieldKey, e.target.value)}
          placeholder="–"
        />
      ) : (
        <dd className={`text-right max-w-[180px] truncate ${value ? "text-foreground" : "text-muted-foreground"}`}>
          {displayVal}
        </dd>
      )}
    </div>
  );
}

/* ── Section Header with Edit Toggle ── */
function SectionHeader({
  title,
  colorClass,
  editing,
  onToggleEdit,
  onSave,
  onCancel,
}: {
  title: string;
  colorClass: string;
  editing: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`w-6 h-1 rounded-full ${colorClass}`} />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {editing ? (
        <div className="flex items-center gap-1">
          <button onClick={onSave} className="p-1 rounded hover:bg-success/10 text-success transition-colors">
            <Check className="h-3.5 w-3.5" />
          </button>
          <button onClick={onCancel} className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button onClick={onToggleEdit} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

/* ── Mock Inserat Data ── */
const MOCK_INSERAT_DATA: Record<string, {
  inseratDatum: string;
  matchingScore: number;
  aufrufe: number;
  anfragen: number;
  bilder: number;
  status: string;
  letzteAktualisierung: string;
  objekttitel: string;
}> = {
  "7": {
    inseratDatum: "14.02.2026",
    matchingScore: 87,
    aufrufe: 342,
    anfragen: 12,
    bilder: 8,
    status: "Aktiv",
    letzteAktualisierung: "20.02.2026",
    objekttitel: "EFH in Frankfurt – Sanierungsbedarf",
  },
};

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const lead = SAMPLE_LEADS.find((l) => l.id === id);

  // Edit state per section
  const [editingKontakt, setEditingKontakt] = useState(false);
  const [editingImmo, setEditingImmo] = useState(false);
  const [editingPartner, setEditingPartner] = useState(false);
  const [kontaktEdits, setKontaktEdits] = useState<Record<string, string>>({});
  const [immoEdits, setImmoEdits] = useState<Record<string, string>>({});
  const [partnerEdits, setPartnerEdits] = useState<Record<string, string>>({});

  // Read inbox tasks for this lead
  const [inboxTasks, setInboxTasks] = useState<{ id: string; title: string; type: string; priority: string; done: boolean; time?: string; day?: string }[]>([]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("inbox-tasks-v2");
      if (saved) {
        const all = JSON.parse(saved);
        setInboxTasks(all.filter((t: any) => t.leadId === id));
      }
    } catch {}
    const onStorage = () => {
      try {
        const saved = localStorage.getItem("inbox-tasks-v2");
        if (saved) {
          const all = JSON.parse(saved);
          setInboxTasks(all.filter((t: any) => t.leadId === id));
        }
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onStorage);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener("focus", onStorage); };
  }, [id]);

  if (!lead) {
    return (
      <CRMLayout>
        <div className="p-8 text-center text-muted-foreground">Lead nicht gefunden.</div>
      </CRMLayout>
    );
  }

  const pipelineStages = lead.type === "b2c" ? B2C_PIPELINE_STAGES : B2B_PIPELINE_STAGES;
  const currentStageIndex = pipelineStages.findIndex((s) => s.id === lead.status);
  const name = lead.type === "b2b" ? lead.companyName : `${lead.firstName} ${lead.lastName}`;
  const typeLabel = lead.type === "b2b" ? "Partner" : "Eigentümer";
  const chatCategory = lead.type === "b2c" ? "eigentuemer" : "entwickler";

  const handleSave = (section: string) => {
    toast({ title: "Gespeichert", description: `${section} wurde aktualisiert.` });
  };

  const updateKontakt = (key: string, val: string) => setKontaktEdits((p) => ({ ...p, [key]: val }));
  const updateImmo = (key: string, val: string) => setImmoEdits((p) => ({ ...p, [key]: val }));
  const updatePartner = (key: string, val: string) => setPartnerEdits((p) => ({ ...p, [key]: val }));

  const hasInserat = lead.status === "b2c_inserat";
  const inseratData = MOCK_INSERAT_DATA[lead.id];

  const actions = [
    { icon: StickyNote, label: "Notiz erstellen", color: "bg-primary text-primary-foreground" },
    { icon: Mail, label: "E-Mail schreiben", color: "bg-secondary text-secondary-foreground" },
    { icon: Phone, label: "Anruf", color: "bg-secondary text-secondary-foreground" },
    { icon: CheckSquare, label: "Aufgabe erstellen", color: "bg-secondary text-secondary-foreground" },
    { icon: CalendarDays, label: "Meeting erstellen", color: "bg-secondary text-secondary-foreground" },
    { icon: MessageSquare, label: "WhatsApp schreiben", color: "bg-success text-success-foreground" },
    {
      icon: MessageSquare,
      label: "Chat starten",
      color: "bg-primary/10 text-primary border border-primary/20",
      onClick: () => navigate(`/chat?newChat=${encodeURIComponent(name)}&category=${chatCategory}`),
    },
    { icon: PhoneCall, label: "Anruf protokollieren", color: "bg-secondary text-secondary-foreground" },
    { icon: Video, label: "Meeting protokollieren", color: "bg-secondary text-secondary-foreground" },
  ];

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-1 rounded-full gradient-brand" />
            </div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-display font-bold text-foreground">{name}</h1>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  lead.type === "b2c" ? "bg-b2c/10 text-b2c" : "bg-b2b/10 text-b2b"
                }`}
              >
                {typeLabel}
              </span>
            </div>
            {lead.type === "b2b" && (
              <p className="text-sm text-muted-foreground">
                {lead.contactPerson} · {lead.position} · {lead.gewerk}
              </p>
            )}
            {lead.type === "b2c" && lead.objekttyp && (
              <p className="text-sm text-muted-foreground">
                {lead.objekttyp} · {lead.interesse}
              </p>
            )}
            {/* Action Icons */}
            <div className="flex items-center gap-1 mt-2">
              {actions.map((action, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={action.onClick}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <action.icon className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {action.label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
          <button className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors">
            <Edit3 className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Pipeline Status Bar */}
        <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border mb-6">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Status</h2>
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {pipelineStages.map((stage, i) => {
              const isActive = stage.id === lead.status;
              const isPast = i < currentStageIndex;
              return (
                <div key={stage.id} className="flex items-center shrink-0">
                  {i > 0 && <span className="text-muted-foreground mx-0.5 text-xs">→</span>}
                  <div
                    className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${
                      isActive
                        ? "bg-warning text-warning-foreground border-warning shadow-sm"
                        : isPast
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-card text-muted-foreground border-border"
                    }`}
                  >
                    {isPast && "✓ "}{stage.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-4">

            {/* Kontaktdaten */}
            <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
              <SectionHeader
                title="Kontaktdaten"
                colorClass="gradient-brand"
                editing={editingKontakt}
                onToggleEdit={() => { setEditingKontakt(true); setKontaktEdits({}); }}
                onSave={() => { handleSave("Kontaktdaten"); setEditingKontakt(false); }}
                onCancel={() => { setEditingKontakt(false); setKontaktEdits({}); }}
              />
              <dl className="space-y-2.5 text-sm">
                {lead.type === "b2c" && (
                  <>
                    <EditableField label="Vorname" value={lead.firstName} editing={editingKontakt} editValues={kontaktEdits} fieldKey="firstName" onEdit={updateKontakt} />
                    <EditableField label="Nachname" value={lead.lastName} editing={editingKontakt} editValues={kontaktEdits} fieldKey="lastName" onEdit={updateKontakt} />
                  </>
                )}
                {lead.type === "b2b" && (
                  <>
                    <EditableField label="Firma" value={lead.companyName} editing={editingKontakt} editValues={kontaktEdits} fieldKey="companyName" onEdit={updateKontakt} />
                    <EditableField label="Ansprechpartner" value={lead.contactPerson} editing={editingKontakt} editValues={kontaktEdits} fieldKey="contactPerson" onEdit={updateKontakt} />
                    <EditableField label="Position" value={lead.position} editing={editingKontakt} editValues={kontaktEdits} fieldKey="position" onEdit={updateKontakt} />
                  </>
                )}
                <EditableField label="Telefon" value={lead.phone} icon={Phone} editing={editingKontakt} editValues={kontaktEdits} fieldKey="phone" onEdit={updateKontakt} />
                <EditableField label="E-Mail" value={lead.email} icon={Mail} editing={editingKontakt} editValues={kontaktEdits} fieldKey="email" onEdit={updateKontakt} />
                <EditableField label="Adresse" value={lead.address} icon={MapPin} editing={editingKontakt} editValues={kontaktEdits} fieldKey="address" onEdit={updateKontakt} />
                {lead.type === "b2b" && (
                  <>
                    <EditableField label="Website" value={lead.website} icon={Globe} editing={editingKontakt} editValues={kontaktEdits} fieldKey="website" onEdit={updateKontakt} />
                    <EditableField label="Region" value={lead.region} icon={MapPin} editing={editingKontakt} editValues={kontaktEdits} fieldKey="region" onEdit={updateKontakt} />
                  </>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Quelle</dt>
                  <dd className="text-foreground">{lead.source}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Berater</dt>
                  <dd className="text-foreground">{lead.assignee}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Angelegt am</dt>
                  <dd className="text-foreground">{lead.createdAt}</dd>
                </div>
              </dl>
            </div>

            {/* Immobiliendaten (B2C) */}
            {lead.type === "b2c" && (
              <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
                <SectionHeader
                  title="Immobiliendaten"
                  colorClass="bg-b2c"
                  editing={editingImmo}
                  onToggleEdit={() => { setEditingImmo(true); setImmoEdits({}); }}
                  onSave={() => { handleSave("Immobiliendaten"); setEditingImmo(false); }}
                  onCancel={() => { setEditingImmo(false); setImmoEdits({}); }}
                />
                <dl className="space-y-2.5 text-sm">
                  <EditableField label="Objekttyp" value={lead.objekttyp} icon={Home} editing={editingImmo} editValues={immoEdits} fieldKey="objekttyp" onEdit={updateImmo} />
                  <EditableField label="Objektadresse" value={lead.objektAdresse} editing={editingImmo} editValues={immoEdits} fieldKey="objektAdresse" onEdit={updateImmo} />
                  <EditableField label="Baujahr" value={lead.baujahr} editing={editingImmo} editValues={immoEdits} fieldKey="baujahr" onEdit={updateImmo} />
                  <EditableField label="Wohnfläche" value={lead.wohnflaeche} icon={Ruler} editing={editingImmo} editValues={immoEdits} fieldKey="wohnflaeche" onEdit={updateImmo} suffix=" m²" />
                  <EditableField label="Grundstücksfläche" value={lead.grundstuecksflaeche} editing={editingImmo} editValues={immoEdits} fieldKey="grundstuecksflaeche" onEdit={updateImmo} suffix=" m²" />
                  <EditableField label="Einheiten" value={lead.anzahlEinheiten} editing={editingImmo} editValues={immoEdits} fieldKey="anzahlEinheiten" onEdit={updateImmo} />
                  <EditableField label="Energieausweis" value={lead.energieausweis !== undefined ? (lead.energieausweis ? "Vorhanden" : "Nicht vorhanden") : undefined} icon={Zap} editing={editingImmo} editValues={immoEdits} fieldKey="energieausweis" onEdit={updateImmo} />
                  <EditableField label="Sanierungsstatus" value={lead.sanierungsstatus} icon={Wrench} editing={editingImmo} editValues={immoEdits} fieldKey="sanierungsstatus" onEdit={updateImmo} />
                  <EditableField label="Eigentümertyp" value={lead.eigentuemertyp} editing={editingImmo} editValues={immoEdits} fieldKey="eigentuemertyp" onEdit={updateImmo} />
                  <EditableField label="Interesse" value={lead.interesse} editing={editingImmo} editValues={immoEdits} fieldKey="interesse" onEdit={updateImmo} />
                </dl>
                {!lead.objekttyp && !editingImmo && (
                  <p className="text-xs text-muted-foreground italic mt-3">
                    Noch keine Immobiliendaten vorhanden – klicke auf ✏️ um Daten zu ergänzen.
                  </p>
                )}
              </div>
            )}

            {/* Inseratdaten (B2C) */}
            {lead.type === "b2c" && (
              <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-1 rounded-full bg-b2c" />
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-b2c" />
                    Inseratdaten
                  </h2>
                </div>
                {hasInserat && inseratData ? (
                  <dl className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Titel</dt>
                      <dd className="text-foreground font-medium text-right max-w-[180px]">{inseratData.objekttitel}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Status</dt>
                      <dd><span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-success/10 text-success">{inseratData.status}</span></dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Inseriert am</dt>
                      <dd className="text-foreground">{inseratData.inseratDatum}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Matching-Score</dt>
                      <dd className={`font-semibold ${inseratData.matchingScore >= 80 ? "text-success" : inseratData.matchingScore >= 60 ? "text-warning" : "text-muted-foreground"}`}>
                        {inseratData.matchingScore}%
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> Aufrufe</dt>
                      <dd className="text-foreground font-medium">{inseratData.aufrufe}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Anfragen</dt>
                      <dd className="text-foreground font-medium">{inseratData.anfragen}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-1.5"><Image className="h-3.5 w-3.5" /> Bilder</dt>
                      <dd className="text-foreground">{inseratData.bilder}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Letzte Aktualisierung</dt>
                      <dd className="text-foreground">{inseratData.letzteAktualisierung}</dd>
                    </div>
                  </dl>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p className="text-xs text-muted-foreground italic">
                      Noch kein Inserat erstellt – wird nach Inseratserstellung hier angezeigt.
                    </p>
                    <dl className="space-y-2 opacity-50">
                      <div className="flex justify-between"><dt className="text-muted-foreground">Inseriert am</dt><dd className="text-muted-foreground">–</dd></div>
                      <div className="flex justify-between"><dt className="text-muted-foreground">Matching-Score</dt><dd className="text-muted-foreground">–</dd></div>
                      <div className="flex justify-between"><dt className="text-muted-foreground">Aufrufe</dt><dd className="text-muted-foreground">–</dd></div>
                      <div className="flex justify-between"><dt className="text-muted-foreground">Anfragen</dt><dd className="text-muted-foreground">–</dd></div>
                    </dl>
                  </div>
                )}
              </div>
            )}

            {/* Partnerdaten (B2B) */}
            {lead.type === "b2b" && (
              <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
                <SectionHeader
                  title="Partnerdaten"
                  colorClass="bg-b2b"
                  editing={editingPartner}
                  onToggleEdit={() => { setEditingPartner(true); setPartnerEdits({}); }}
                  onSave={() => { handleSave("Partnerdaten"); setEditingPartner(false); }}
                  onCancel={() => { setEditingPartner(false); setPartnerEdits({}); }}
                />
                <dl className="space-y-2.5 text-sm">
                  <EditableField label="Gewerk" value={lead.gewerk} icon={Wrench} editing={editingPartner} editValues={partnerEdits} fieldKey="gewerk" onEdit={updatePartner} />
                  <EditableField label="Größe" value={lead.companySize ? `${lead.companySize} Mitarbeiter` : undefined} icon={Building2} editing={editingPartner} editValues={partnerEdits} fieldKey="companySize" onEdit={updatePartner} />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Partnerstatus</dt>
                    <dd className={`font-semibold ${lead.partnerStatus === "Aktiver Partner" ? "text-success" : lead.partnerStatus === "Inaktiv" ? "text-destructive" : "text-foreground"}`}>
                      {lead.partnerStatus || "–"}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Mitgliedschaft (B2B) */}
            {lead.type === "b2b" && (
              <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-1 rounded-full bg-b2b" />
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-b2b" />
                    Mitgliedschaft
                  </h2>
                </div>
                {lead.status === "b2b_won" ? (
                  <dl className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Plan</dt>
                      <dd><span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded gradient-brand text-primary-foreground">Premium</span></dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Laufzeit</dt>
                      <dd className="font-medium text-foreground">12 Monate</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Betrag</dt>
                      <dd className="font-semibold text-foreground">1.250 €</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Start</dt>
                      <dd className="text-foreground">{lead.updatedAt}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Kündigungsfrist</dt>
                      <dd className="font-medium text-warning">3 Monate vor Ablauf</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Auto-Verlängerung</dt>
                      <dd className="text-foreground">Ja</dd>
                    </div>
                    {lead.notes && (
                      <div className="pt-2 border-t border-border/60">
                        <dt className="text-muted-foreground text-xs mb-1">Notiz</dt>
                        <dd className="text-foreground text-xs">{lead.notes}</dd>
                      </div>
                    )}
                  </dl>
                ) : (
                  <div className="space-y-2.5 text-sm">
                    <p className="text-xs text-muted-foreground italic">Keine aktive Mitgliedschaft – wird nach erfolgreichem Abschluss hier angezeigt.</p>
                    <dl className="space-y-2 text-sm opacity-50">
                      <div className="flex justify-between"><dt className="text-muted-foreground">Plan</dt><dd className="text-muted-foreground">–</dd></div>
                      <div className="flex justify-between"><dt className="text-muted-foreground">Laufzeit</dt><dd className="text-muted-foreground">–</dd></div>
                      <div className="flex justify-between"><dt className="text-muted-foreground flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Betrag</dt><dd className="text-muted-foreground">–</dd></div>
                      <div className="flex justify-between"><dt className="text-muted-foreground">Start</dt><dd className="text-muted-foreground">–</dd></div>
                    </dl>
                  </div>
                )}
              </div>
            )}

            {/* Details */}
            <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-1 rounded-full gradient-brand" />
                <h2 className="text-sm font-semibold text-foreground">Details</h2>
              </div>
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Priorität</dt>
                  <dd className={`font-medium capitalize ${lead.priority === "high" ? "text-destructive" : lead.priority === "medium" ? "text-warning" : "text-muted-foreground"}`}>
                    {lead.priority === "high" ? "Hoch" : lead.priority === "medium" ? "Mittel" : "Niedrig"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Zuletzt aktualisiert</dt>
                  <dd className="text-foreground">{lead.updatedAt}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right: Timeline */}
          <div className="lg:col-span-2 bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Aktivitäten-Timeline</h2>
            </div>
            {/* Inbox tasks for this lead */}
            {inboxTasks.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Offene Aufgaben (Inbox)</h3>
                <div className="space-y-2">
                  {inboxTasks.map((t) => (
                    <div key={t.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${t.done ? "bg-muted/30 border-border/40 line-through text-muted-foreground" : "bg-warning/5 border-warning/20 text-foreground"}`}>
                      <CheckSquare className={`h-3.5 w-3.5 shrink-0 ${t.done ? "text-muted-foreground" : "text-warning"}`} />
                      <span className="flex-1">{t.title}</span>
                      {t.time && <span className="text-xs text-muted-foreground">{t.time}</span>}
                      {t.done && <span className="text-[10px] text-muted-foreground">✓ erledigt</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-0">
              {sampleActivities.map((act, i) => {
                const Icon = activityIcons[act.type] || Clock;
                const isScript = act.type === "script";
                return (
                  <div key={i} className="flex gap-4 relative">
                    {i < sampleActivities.length - 1 && (
                      <div className="absolute left-[15px] top-9 bottom-0 w-px bg-border" />
                    )}
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      isScript ? "bg-primary/10" : "bg-secondary"
                    }`}>
                      <Icon className={`h-3.5 w-3.5 ${isScript ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="pb-6 flex-1 min-w-0">
                      <p className="text-sm text-foreground">{act.desc}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {act.time} · {act.by}
                      </p>
                      {isScript && act.scriptDetails && (
                        <div className="mt-2 rounded-lg border border-primary/10 bg-primary/[0.02] overflow-hidden">
                          <table className="w-full text-[11px]">
                            <thead>
                              <tr className="border-b border-primary/10 bg-primary/5">
                                <th className="text-left px-2.5 py-1.5 font-semibold text-foreground">Schritt</th>
                                <th className="text-left px-2.5 py-1.5 font-semibold text-foreground">Ergebnis</th>
                                <th className="text-left px-2.5 py-1.5 font-semibold text-foreground">Notiz</th>
                              </tr>
                            </thead>
                            <tbody>
                              {act.scriptDetails.map((detail, j) => (
                                <tr key={j} className="border-b border-border/50 last:border-0">
                                  <td className="px-2.5 py-1.5 text-muted-foreground font-medium">{detail.step}</td>
                                  <td className="px-2.5 py-1.5 text-foreground">{detail.result}</td>
                                  <td className="px-2.5 py-1.5 text-muted-foreground">{detail.note}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
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
