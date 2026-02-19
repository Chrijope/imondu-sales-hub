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
} from "lucide-react";
import CRMLayout from "@/components/CRMLayout";
import { SAMPLE_LEADS, PIPELINE_STAGES } from "@/data/crm-data";

const sampleActivities = [
  { type: "call" as const, desc: "Erstgespräch geführt – Interesse an Premium-Paket", time: "Heute 11:30", by: "Max Müller" },
  { type: "email" as const, desc: "Angebotspräsentation versendet", time: "Gestern 16:00", by: "Max Müller" },
  { type: "note" as const, desc: "Kunde möchte Referenzen sehen, Follow-Up am Freitag", time: "18.02.2026", by: "Max Müller" },
  { type: "status_change" as const, desc: "Status geändert: Neuer Lead → Kontaktversuch", time: "17.02.2026", by: "System" },
  { type: "call" as const, desc: "Nicht erreicht – AB besprochen", time: "16.02.2026", by: "Max Müller" },
];

const activityIcons = {
  call: Phone,
  email: Mail,
  note: MessageSquare,
  status_change: Clock,
  meeting: CalendarDays,
};

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = SAMPLE_LEADS.find((l) => l.id === id);

  if (!lead) {
    return (
      <CRMLayout>
        <div className="p-8 text-center text-muted-foreground">Lead nicht gefunden.</div>
      </CRMLayout>
    );
  }

  const stage = PIPELINE_STAGES.find((s) => s.id === lead.status);
  const name = lead.type === "b2b" ? lead.companyName : `${lead.firstName} ${lead.lastName}`;

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-display font-bold text-foreground">
                {name}
              </h1>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  lead.type === "b2c" ? "bg-b2c/10 text-b2c" : "bg-b2b/10 text-b2b"
                }`}
              >
                {lead.type}
              </span>
            </div>
            {lead.type === "b2b" && (
              <p className="text-sm text-muted-foreground">
                {lead.contactPerson} · {lead.position}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-primary-foreground"
              style={{ backgroundColor: stage?.color }}
            >
              {stage?.name}
            </div>
            <button className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors">
              <Edit3 className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Details */}
          <div className="space-y-4">
            {/* Contact Info */}
            <div className="bg-card rounded-lg p-5 shadow-crm-sm border border-border">
              <h2 className="text-sm font-semibold text-foreground mb-4">Kontaktdaten</h2>
              <div className="space-y-3">
                {lead.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{lead.phone}</span>
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{lead.email}</span>
                  </div>
                )}
                {lead.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{lead.address}</span>
                  </div>
                )}
                {lead.type === "b2b" && lead.industry && (
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{lead.industry} · {lead.companySize}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="bg-card rounded-lg p-5 shadow-crm-sm border border-border">
              <h2 className="text-sm font-semibold text-foreground mb-4">Details</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Wert</dt>
                  <dd className="font-semibold text-foreground">€{lead.value.toLocaleString("de-DE")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Quelle</dt>
                  <dd className="text-foreground">{lead.source}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Priorität</dt>
                  <dd className="text-foreground capitalize">{lead.priority}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Verantwortlich</dt>
                  <dd className="text-foreground">{lead.assignee}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Erstellt</dt>
                  <dd className="text-foreground">{lead.createdAt}</dd>
                </div>
                {lead.type === "b2b" && lead.decisionStatus && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Entscheidung</dt>
                    <dd className="text-foreground">{lead.decisionStatus}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg p-5 shadow-crm-sm border border-border">
              <h2 className="text-sm font-semibold text-foreground mb-3">Aktionen</h2>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                  <Phone className="h-3.5 w-3.5" />
                  Anrufen
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                  E-Mail
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors">
                  <FileText className="h-3.5 w-3.5" />
                  Angebot
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Termin
                </button>
              </div>
            </div>
          </div>

          {/* Right: Timeline */}
          <div className="lg:col-span-2 bg-card rounded-lg p-5 shadow-crm-sm border border-border">
            <h2 className="text-sm font-semibold text-foreground mb-4">Aktivitäten-Timeline</h2>
            <div className="space-y-0">
              {sampleActivities.map((act, i) => {
                const Icon = activityIcons[act.type] || Clock;
                return (
                  <div key={i} className="flex gap-4 relative">
                    {/* Line */}
                    {i < sampleActivities.length - 1 && (
                      <div className="absolute left-[15px] top-9 bottom-0 w-px bg-border" />
                    )}
                    {/* Icon */}
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0 z-10">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    {/* Content */}
                    <div className="pb-6">
                      <p className="text-sm text-foreground">{act.desc}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {act.time} · {act.by}
                      </p>
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
