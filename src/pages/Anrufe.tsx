import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CRMLayout from "@/components/CRMLayout";
import { SAMPLE_LEADS } from "@/data/crm-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  PhoneMissed,
  Clock,
  Search,
  Calendar,
  TrendingUp,
  User,
  Building2,
  Briefcase,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowUpRight,
  Timer,
} from "lucide-react";

// Call result types
type CallResult = "erreicht" | "nicht_erreicht" | "mailbox" | "termin_vereinbart" | "kein_interesse" | "follow_up";

interface CallRecord {
  id: string;
  leadId: string;
  leadName: string;
  leadType: "b2c" | "b2b";
  companyName?: string;
  phone: string;
  timestamp: string;
  duration: number; // seconds
  result: CallResult;
  notes: string;
  assignee: string;
}

const CALL_RESULTS: Record<CallResult, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  erreicht: { label: "Erreicht", color: "bg-success/10 text-success border-success/20", icon: PhoneCall },
  nicht_erreicht: { label: "Nicht erreicht", color: "bg-destructive/10 text-destructive border-destructive/20", icon: PhoneOff },
  mailbox: { label: "Mailbox", color: "bg-warning/10 text-warning border-warning/20", icon: PhoneMissed },
  termin_vereinbart: { label: "Termin vereinbart", color: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle2 },
  kein_interesse: { label: "Kein Interesse", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
  follow_up: { label: "Follow-Up", color: "bg-accent/50 text-foreground border-accent", icon: RotateCcw },
};

// Generate mock call data from existing leads
const generateCalls = (): CallRecord[] => {
  const calls: CallRecord[] = [];
  const results: CallResult[] = ["erreicht", "nicht_erreicht", "mailbox", "termin_vereinbart", "kein_interesse", "follow_up"];
  const today = new Date();
  const notes = [
    "Gutes Gespräch, Interesse an Sanierung geweckt.",
    "Kein Anschluss unter dieser Nummer.",
    "Auf Mailbox gesprochen, Rückruf erbeten.",
    "Termin für Freitag 14:00 Uhr vereinbart.",
    "Eigentümer möchte aktuell nichts unternehmen.",
    "In 2 Wochen nochmal anrufen – derzeit im Urlaub.",
    "Sehr interessiert an Energieberatung, Unterlagen per Mail geschickt.",
    "Kurzes Gespräch, will sich erstmal informieren.",
    "Angebot wurde besprochen, Entscheidung nächste Woche.",
    "Falsche Nummer, Lead-Daten aktualisiert.",
    "Präsentation für Dienstag geplant.",
    "Bereits mit anderem Anbieter in Kontakt.",
  ];

  SAMPLE_LEADS.forEach((lead, idx) => {
    const numCalls = 1 + (idx % 3);
    for (let c = 0; c < numCalls; c++) {
      const hoursAgo = Math.floor(Math.random() * 10);
      const minutesAgo = Math.floor(Math.random() * 60);
      const callTime = new Date(today);
      callTime.setHours(8 + hoursAgo, minutesAgo, 0);

      if (callTime > today) callTime.setHours(today.getHours() - 1);

      const duration = lead.type === "b2b"
        ? Math.floor(Math.random() * 600) + 60
        : Math.floor(Math.random() * 420) + 30;

      calls.push({
        id: `call-${lead.id}-${c}`,
        leadId: lead.id,
        leadName: lead.type === "b2c" ? `${lead.firstName} ${lead.lastName}` : (lead.contactPerson || ""),
        leadType: lead.type,
        companyName: lead.companyName,
        phone: lead.phone || "+49 170 0000000",
        timestamp: callTime.toISOString(),
        duration,
        result: results[(idx + c) % results.length],
        notes: notes[(idx * 3 + c) % notes.length],
        assignee: lead.assignee,
      });
    }
  });

  return calls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
};

type ResultFilter = "alle" | CallResult;
type TypeFilter = "alle" | "b2c" | "b2b";

export default function Anrufe() {
  const navigate = useNavigate();
  const [calls] = useState<CallRecord[]>(generateCalls);
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState<ResultFilter>("alle");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("alle");

  const filtered = useMemo(() => {
    let list = calls;
    if (resultFilter !== "alle") list = list.filter((c) => c.result === resultFilter);
    if (typeFilter !== "alle") list = list.filter((c) => c.leadType === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.leadName.toLowerCase().includes(q) ||
        c.companyName?.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.notes.toLowerCase().includes(q)
      );
    }
    return list;
  }, [calls, search, resultFilter, typeFilter]);

  // KPIs
  const totalCalls = calls.length;
  const totalDuration = calls.reduce((s, c) => s + c.duration, 0);
  const avgDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0;
  const reached = calls.filter((c) => c.result === "erreicht" || c.result === "termin_vereinbart").length;
  const reachRate = totalCalls > 0 ? Math.round((reached / totalCalls) * 100) : 0;
  const appointments = calls.filter((c) => c.result === "termin_vereinbart").length;

  // Result distribution
  const resultCounts: Record<CallResult, number> = {
    erreicht: 0, nicht_erreicht: 0, mailbox: 0, termin_vereinbart: 0, kein_interesse: 0, follow_up: 0,
  };
  calls.forEach((c) => { resultCounts[c.result]++; });

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-1 rounded-full gradient-brand" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Anrufe</h1>
          <p className="text-sm text-muted-foreground mt-1">Heutige Anruf-Übersicht – alle Calls auf einen Blick</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <Phone className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-3xl font-display font-bold text-foreground">{totalCalls}</p>
            <p className="text-xs text-muted-foreground mt-1">Anrufe heute</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <Timer className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-3xl font-display font-bold text-foreground">{formatDuration(totalDuration)}</p>
            <p className="text-xs text-muted-foreground mt-1">Gesamtdauer</p>
            <p className="text-[10px] text-muted-foreground">⌀ {formatDuration(avgDuration)} / Call</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <TrendingUp className="h-5 w-5 text-success mx-auto mb-1" />
            <p className="text-3xl font-display font-bold text-success">{reachRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Erreichbarkeit</p>
            <p className="text-[10px] text-muted-foreground">{reached} von {totalCalls} erreicht</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-3xl font-display font-bold text-primary">{appointments}</p>
            <p className="text-xs text-muted-foreground mt-1">Termine vereinbart</p>
          </div>
        </div>

        {/* Result distribution bar */}
        <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border">
          <p className="text-xs font-semibold text-foreground mb-3">Ergebnisverteilung</p>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {(Object.entries(resultCounts) as [CallResult, number][]).map(([key, count]) => {
              if (count === 0) return null;
              const pct = (count / totalCalls) * 100;
              const cfg = CALL_RESULTS[key];
              const colorMap: Record<CallResult, string> = {
                erreicht: "bg-success", nicht_erreicht: "bg-destructive", mailbox: "bg-warning",
                termin_vereinbart: "bg-primary", kein_interesse: "bg-muted-foreground", follow_up: "bg-accent-foreground",
              };
              return (
                <div key={key} className={`${colorMap[key]} rounded-sm`} style={{ width: `${pct}%` }} title={`${cfg.label}: ${count}`} />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {(Object.entries(CALL_RESULTS) as [CallResult, typeof CALL_RESULTS[CallResult]][]).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <cfg.icon className="h-3 w-3" />
                {cfg.label}: <span className="font-medium text-foreground">{resultCounts[key as CallResult]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Name, Firma, Nummer oder Notiz suchen…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={resultFilter} onValueChange={(v) => setResultFilter(v as ResultFilter)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Ergebnis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle Ergebnisse</SelectItem>
              {(Object.entries(CALL_RESULTS) as [CallResult, typeof CALL_RESULTS[CallResult]][]).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            {(["alle", "b2c", "b2b"] as TypeFilter[]).map((t) => (
              <Button key={t} variant={typeFilter === t ? "default" : "outline"} size="sm"
                className={typeFilter === t ? "gradient-brand border-0 text-primary-foreground" : ""}
                onClick={() => setTypeFilter(t)}
              >
                {t === "alle" ? "Alle" : t === "b2c" ? "B2C" : "B2B"}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground ml-auto">{filtered.length} Anrufe</p>
        </div>

        {/* Call List */}
        <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Uhrzeit</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Typ</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Kontakt</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Telefon</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Dauer</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Ergebnis</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Notizen</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Vertriebler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((call) => {
                  const cfg = CALL_RESULTS[call.result];
                  const ResultIcon = cfg.icon;
                  return (
                    <tr
                      key={call.id}
                      onClick={() => navigate(`/lead/${call.leadId}`)}
                      className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs text-foreground">{formatTime(call.timestamp)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={`text-[10px] ${call.leadType === "b2c" ? "border-b2c/30 text-b2c" : "border-b2b/30 text-b2b"}`}>
                          {call.leadType === "b2c" ? (
                            <><Building2 className="h-2.5 w-2.5 mr-1" />B2C</>
                          ) : (
                            <><Briefcase className="h-2.5 w-2.5 mr-1" />B2B</>
                          )}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-foreground">
                            {call.leadName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground">{call.leadName}</p>
                            {call.companyName && (
                              <p className="text-[10px] text-muted-foreground">{call.companyName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground font-mono">{call.phone}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium text-foreground">{formatDuration(call.duration)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={`text-[10px] gap-1 ${cfg.color}`}>
                          <ResultIcon className="h-3 w-3" />
                          {cfg.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-xs text-muted-foreground max-w-[250px] truncate">{call.notes}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{call.assignee}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      <Phone className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">Keine Anrufe gefunden.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aircall hint */}
        <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg gradient-brand flex items-center justify-center shrink-0">
              <PhoneCall className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Telefonie-Integration</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Verbinde einen Telefonie-Anbieter wie <span className="font-medium text-foreground">Aircall</span>, <span className="font-medium text-foreground">Sipgate</span> oder <span className="font-medium text-foreground">Placetel</span>, um Anrufe direkt aus dem CRM zu starten, aufzuzeichnen und automatisch transkribieren zu lassen. 
                Die Transkriptionen werden in der Lead-Historie gespeichert.
              </p>
              <Button variant="outline" size="sm" className="mt-3 text-xs gap-1.5">
                <ArrowUpRight className="h-3 w-3" /> Integration einrichten
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
