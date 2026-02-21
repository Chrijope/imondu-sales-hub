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
  Tag,
  CreditCard,
} from "lucide-react";
import CRMLayout from "@/components/CRMLayout";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { SAMPLE_LEADS, B2C_PIPELINE_STAGES, B2B_PIPELINE_STAGES } from "@/data/crm-data";

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

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = SAMPLE_LEADS.find((l) => l.id === id);

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
  const currentStage = pipelineStages.find((s) => s.id === lead.status);
  const currentStageIndex = pipelineStages.findIndex((s) => s.id === lead.status);
  const name = lead.type === "b2b" ? lead.companyName : `${lead.firstName} ${lead.lastName}`;
  const typeLabel = lead.type === "b2b" ? "Partner" : "Eigentümer";

  const chatCategory = lead.type === "b2c" ? "eigentuemer" : "entwickler";

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
                      className={`p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors`}
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
              const isLost = stage.id.endsWith("_lost");
              const isWon = stage.id.endsWith("_won") || stage.id.endsWith("_inserat");

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
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-1 rounded-full gradient-brand" />
                <h2 className="text-sm font-semibold text-foreground">Kontaktdaten</h2>
              </div>
              <dl className="space-y-2.5 text-sm">
                {lead.type === "b2c" && lead.firstName && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Vorname</dt>
                    <dd className="text-foreground font-medium">{lead.firstName}</dd>
                  </div>
                )}
                {lead.type === "b2c" && lead.lastName && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Nachname</dt>
                    <dd className="text-foreground font-medium">{lead.lastName}</dd>
                  </div>
                )}
                {lead.type === "b2b" && lead.companyName && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Firma</dt>
                    <dd className="text-foreground font-medium">{lead.companyName}</dd>
                  </div>
                )}
                {lead.type === "b2b" && lead.contactPerson && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Ansprechpartner</dt>
                    <dd className="text-foreground font-medium">{lead.contactPerson}</dd>
                  </div>
                )}
                {lead.phone && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Telefon</dt>
                    <dd className="text-foreground">{lead.phone}</dd>
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> E-Mail</dt>
                    <dd className="text-foreground text-right max-w-[180px] truncate">{lead.email}</dd>
                  </div>
                )}
                {lead.address && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Adresse</dt>
                    <dd className="text-foreground text-right max-w-[180px]">{lead.address}</dd>
                  </div>
                )}
                {lead.type === "b2b" && lead.website && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> Website</dt>
                    <dd className="text-foreground">{lead.website}</dd>
                  </div>
                )}
                {lead.type === "b2b" && lead.region && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Region</dt>
                    <dd className="text-foreground">{lead.region}</dd>
                  </div>
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
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-1 rounded-full bg-b2c" />
                  <h2 className="text-sm font-semibold text-foreground">Immobiliendaten</h2>
                </div>
                <dl className="space-y-2.5 text-sm">
                  {lead.objekttyp && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-2"><Home className="h-3.5 w-3.5" /> Objekttyp</dt>
                      <dd className="font-semibold text-foreground">{lead.objekttyp}</dd>
                    </div>
                  )}
                  {lead.objektAdresse && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Objektadresse</dt>
                      <dd className="text-foreground text-right max-w-[180px]">{lead.objektAdresse}</dd>
                    </div>
                  )}
                  {lead.baujahr && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Baujahr</dt>
                      <dd className="text-foreground">{lead.baujahr}</dd>
                    </div>
                  )}
                  {lead.wohnflaeche && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-2"><Ruler className="h-3.5 w-3.5" /> Wohnfläche</dt>
                      <dd className="text-foreground">{lead.wohnflaeche} m²</dd>
                    </div>
                  )}
                  {lead.grundstuecksflaeche && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Grundstücksfläche</dt>
                      <dd className="text-foreground">{lead.grundstuecksflaeche} m²</dd>
                    </div>
                  )}
                  {lead.anzahlEinheiten && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Einheiten</dt>
                      <dd className="text-foreground">{lead.anzahlEinheiten}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2"><Zap className="h-3.5 w-3.5" /> Energieausweis</dt>
                    <dd className="text-foreground">{lead.energieausweis ? "Vorhanden" : "Nicht vorhanden"}</dd>
                  </div>
                  {lead.sanierungsstatus && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-2"><Wrench className="h-3.5 w-3.5" /> Sanierungsstatus</dt>
                      <dd className="text-foreground">{lead.sanierungsstatus}</dd>
                    </div>
                  )}
                  {lead.eigentuemertyp && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Eigentümertyp</dt>
                      <dd className="text-foreground">{lead.eigentuemertyp}</dd>
                    </div>
                  )}
                  {lead.interesse && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Interesse</dt>
                      <dd className="font-semibold text-accent">{lead.interesse}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Partnerdaten (B2B) */}
            {lead.type === "b2b" && (
              <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-1 rounded-full bg-b2b" />
                  <h2 className="text-sm font-semibold text-foreground">Partnerdaten</h2>
                </div>
                <dl className="space-y-2.5 text-sm">
                  {lead.gewerk && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-2"><Wrench className="h-3.5 w-3.5" /> Gewerk</dt>
                      <dd className="font-semibold text-foreground">{lead.gewerk}</dd>
                    </div>
                  )}
                  {lead.companySize && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-2"><Building2 className="h-3.5 w-3.5" /> Größe</dt>
                      <dd className="text-foreground">{lead.companySize} Mitarbeiter</dd>
                    </div>
                  )}
                  {lead.partnerStatus && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Partnerstatus</dt>
                      <dd className={`font-semibold ${lead.partnerStatus === "Aktiver Partner" ? "text-success" : lead.partnerStatus === "Inaktiv" ? "text-destructive" : "text-foreground"}`}>
                        {lead.partnerStatus}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Mitgliedschaft</dt>
                    <dd className="text-foreground">1.250 € / Jahr</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Deine Provision</dt>
                    <dd className="font-semibold text-accent">312,50 € (25%)</dd>
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
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Plan</dt>
                        <dd className="text-muted-foreground">–</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Laufzeit</dt>
                        <dd className="text-muted-foreground">–</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Betrag</dt>
                        <dd className="text-muted-foreground">–</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Start</dt>
                        <dd className="text-muted-foreground">–</dd>
                      </div>
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
                  <dt className="text-muted-foreground">Provision</dt>
                  <dd className="font-semibold text-foreground">{lead.value.toLocaleString("de-DE")} €</dd>
                </div>
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
