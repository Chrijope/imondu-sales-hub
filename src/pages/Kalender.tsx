import { useState, useEffect, useMemo } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar as CalendarIcon, CheckCircle2, Link2, ExternalLink, Chrome, Apple, Mail,
  ChevronLeft, ChevronRight, Clock, Phone, Users, Building2, Briefcase, Video, MapPin, Plus,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SAMPLE_LEADS } from "@/data/crm-data";

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

// ── Calendar event types ──
type EventCategory = "termin" | "followup" | "anruf" | "meeting" | "aufgabe" | "onboarding";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  endTime?: string;
  category: EventCategory;
  description?: string;
  location?: string;
  contact?: string;
  leadId?: string;
  assignee?: string;
}

const CATEGORY_CONFIG: Record<EventCategory, { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  termin: { label: "Termin", color: "text-primary", bgColor: "bg-primary/10 border-primary/20", icon: CalendarIcon },
  followup: { label: "Follow-up", color: "text-warning", bgColor: "bg-warning/10 border-warning/20", icon: Clock },
  anruf: { label: "Anruf", color: "text-success", bgColor: "bg-success/10 border-success/20", icon: Phone },
  meeting: { label: "Meeting", color: "text-accent", bgColor: "bg-accent/10 border-accent/20", icon: Video },
  aufgabe: { label: "Aufgabe", color: "text-destructive", bgColor: "bg-destructive/10 border-destructive/20", icon: CheckCircle2 },
  onboarding: { label: "Onboarding", color: "text-primary", bgColor: "bg-primary/10 border-primary/20", icon: Users },
};

// ── Generate demo events around current month ──
function generateDemoEvents(): CalendarEvent[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const events: CalendarEvent[] = [
    { id: "e1", title: "Erstgespräch Hr. Bauer", date: `${y}-${String(m + 1).padStart(2, "0")}-${String(Math.min(now.getDate() + 1, 28)).padStart(2, "0")}`, time: "09:00", endTime: "09:30", category: "termin", contact: "Thomas Bauer", location: "Zoom" },
    { id: "e2", title: "Follow-up Fr. Klein", date: `${y}-${String(m + 1).padStart(2, "0")}-${String(Math.min(now.getDate() + 2, 28)).padStart(2, "0")}`, time: "14:00", endTime: "14:15", category: "followup", contact: "Anna Klein" },
    { id: "e3", title: "Powerdialer-Session", date: `${y}-${String(m + 1).padStart(2, "0")}-${String(Math.min(now.getDate(), 28)).padStart(2, "0")}`, time: "10:00", endTime: "12:00", category: "anruf", description: "B2C Kaltakquise Block" },
    { id: "e4", title: "Team-Meeting Vertrieb", date: `${y}-${String(m + 1).padStart(2, "0")}-${String(Math.min(now.getDate() + 3, 28)).padStart(2, "0")}`, time: "15:00", endTime: "16:00", category: "meeting", location: "Büro / Teams", description: "Wöchentliches Sales-Standup" },
    { id: "e5", title: "Inserat-Bewertung Müller", date: `${y}-${String(m + 1).padStart(2, "0")}-${String(Math.min(now.getDate() - 1, 28)).padStart(2, "0")}`, time: "11:00", category: "aufgabe", contact: "Stefan Müller" },
    { id: "e6", title: "Onboarding Entwickler Huber", date: `${y}-${String(m + 1).padStart(2, "0")}-${String(Math.min(now.getDate() + 5, 28)).padStart(2, "0")}`, time: "13:00", endTime: "14:00", category: "onboarding", contact: "Elektro Huber & Partner" },
    { id: "e7", title: "Beratungsgespräch Immobilie", date: `${y}-${String(m + 1).padStart(2, "0")}-${String(Math.min(now.getDate() + 4, 28)).padStart(2, "0")}`, time: "16:30", endTime: "17:30", category: "termin", contact: "Fr. Schneider", location: "Vor Ort – Musterstr. 12" },
    { id: "e8", title: "Rückruf Hr. Weber", date: `${y}-${String(m + 1).padStart(2, "0")}-${String(Math.min(now.getDate(), 28)).padStart(2, "0")}`, time: "15:30", category: "anruf", contact: "Max Weber" },
    { id: "e9", title: "Angebotspräsentation MFH", date: `${y}-${String(m + 1).padStart(2, "0")}-${String(Math.min(now.getDate() + 7, 28)).padStart(2, "0")}`, time: "10:00", endTime: "11:00", category: "meeting", contact: "Investorengruppe Schmidt", location: "Zoom" },
    { id: "e10", title: "Follow-up Entwickler Braun", date: `${y}-${String(m + 1).padStart(2, "0")}-${String(Math.min(now.getDate() + 6, 28)).padStart(2, "0")}`, time: "09:30", category: "followup", contact: "Braun Bau GmbH" },
    { id: "e11", title: "Quartalsbericht erstellen", date: `${y}-${String(m + 1).padStart(2, "0")}-${String(Math.min(now.getDate() + 8, 28)).padStart(2, "0")}`, time: "08:00", category: "aufgabe", description: "B2C + B2B Quartalsbericht Q1" },
    { id: "e12", title: "Dachsanierung Besichtigung", date: `${y}-${String(m + 1).padStart(2, "0")}-${String(Math.min(now.getDate() + 2, 28)).padStart(2, "0")}`, time: "11:00", endTime: "12:00", category: "termin", contact: "Hr. Hoffmann", location: "Berliner Str. 45" },
  ];
  return events;
}

const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTH_NAMES = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { day: number; currentMonth: boolean; dateStr: string }[] = [];
  // Previous month
  for (let i = startDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const pm = month === 0 ? 11 : month - 1;
    const py = month === 0 ? year - 1 : year;
    cells.push({ day: d, currentMonth: false, dateStr: `${py}-${String(pm + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true, dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }
  // Next month
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const nm = month === 11 ? 0 : month + 1;
    const ny = month === 11 ? year + 1 : year;
    cells.push({ day: d, currentMonth: false, dateStr: `${ny}-${String(nm + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }
  return cells;
}

export default function Kalender() {
  const { toast } = useToast();
  const [connected, setConnected] = useState<Record<string, boolean>>(() => {
    try { const s = localStorage.getItem("kalender-connected"); if (s) return JSON.parse(s); } catch {} return {};
  });
  const [syncOptions, setSyncOptions] = useState<Record<string, boolean>>(() => {
    try { const s = localStorage.getItem("kalender-sync-options"); if (s) return JSON.parse(s); } catch {}
    return { "Gebuchte Termine automatisch eintragen": true, "Follow-up Erinnerungen": true, "Powerdialer-Termine": true, "Bidirektionale Sync": true };
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try { const s = localStorage.getItem("kalender-events"); if (s) return JSON.parse(s); } catch {} return [];
  });

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({ category: "termin", time: "09:00" });
  const [showProviders, setShowProviders] = useState(false);

  const hasConnected = Object.values(connected).some(Boolean);

  useEffect(() => { localStorage.setItem("kalender-connected", JSON.stringify(connected)); }, [connected]);
  useEffect(() => { localStorage.setItem("kalender-sync-options", JSON.stringify(syncOptions)); }, [syncOptions]);
  useEffect(() => { localStorage.setItem("kalender-events", JSON.stringify(events)); }, [events]);

  // Load demo events when first calendar is connected
  const handleConnect = (provider: CalendarProvider) => {
    const wasConnected = connected[provider.id];
    setConnected((prev) => ({ ...prev, [provider.id]: !prev[provider.id] }));

    if (!wasConnected) {
      // Add demo events when connecting
      const demoEvents = generateDemoEvents();
      setEvents(prev => {
        const existingIds = new Set(prev.map(e => e.id));
        const newOnes = demoEvents.filter(e => !existingIds.has(e.id));
        return [...prev, ...newOnes];
      });
      toast({ title: `${provider.name} verbunden ✓`, description: "Termine und Aufgaben werden jetzt synchronisiert." });
    } else {
      toast({ title: `${provider.name} getrennt`, description: "Die Kalender-Synchronisation wurde deaktiviert." });
    }
  };

  const monthCells = useMemo(() => getMonthDays(viewYear, viewMonth), [viewYear, viewMonth]);
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach(e => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    // Sort each day by time
    Object.values(map).forEach(arr => arr.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [events]);

  const selectedDateEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast({ title: "Bitte Titel, Datum und Uhrzeit angeben", variant: "destructive" });
      return;
    }
    const ev: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: newEvent.title!,
      date: newEvent.date!,
      time: newEvent.time!,
      endTime: newEvent.endTime,
      category: (newEvent.category as EventCategory) || "termin",
      description: newEvent.description,
      location: newEvent.location,
      contact: newEvent.contact,
    };
    setEvents(prev => [...prev, ev]);
    toast({ title: "Termin erstellt ✓" });
    setShowAddEvent(false);
    setNewEvent({ category: "termin", time: "09:00" });
  };

  const connectedCount = Object.values(connected).filter(Boolean).length;
  const syncedEventCount = events.length;

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1"><div className="w-10 h-1 rounded-full gradient-brand" /></div>
              <h1 className="text-2xl font-display font-bold text-foreground">Kalender</h1>
              <p className="text-sm text-muted-foreground mt-1">Termine, Aufgaben und Follow-ups an einem Ort</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowProviders(!showProviders)} className="gap-1.5">
                <Link2 className="h-3.5 w-3.5" />
                {connectedCount > 0 ? `${connectedCount} verbunden` : "Kalender verbinden"}
              </Button>
              {hasConnected && (
                <Button size="sm" className="gradient-brand border-0 text-white gap-1.5" onClick={() => { setShowAddEvent(true); setNewEvent({ ...newEvent, date: selectedDate || todayStr }); }}>
                  <Plus className="h-3.5 w-3.5" /> Neuer Termin
                </Button>
              )}
            </div>
          </div>

          {/* Provider cards – collapsible */}
          {(showProviders || !hasConnected) && (
            <div className="grid gap-3">
              {!hasConnected && (
                <div className="gradient-brand-subtle border border-primary/15 rounded-xl p-4 flex items-start gap-3">
                  <CalendarIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Verbinde einen Kalender, um <strong className="text-foreground">Termine</strong>, <strong className="text-foreground">Follow-ups</strong> und <strong className="text-foreground">Aufgaben</strong> automatisch zu synchronisieren.
                  </p>
                </div>
              )}
              {PROVIDERS.map((provider) => {
                const isConnected = connected[provider.id];
                return (
                  <div key={provider.id} className={`bg-card rounded-xl p-4 shadow-crm-sm border transition-colors ${isConnected ? "border-primary/30 bg-primary/[0.02]" : "border-border"}`}>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                        <provider.icon className={`h-5 w-5 ${provider.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">{provider.name}</h3>
                          {isConnected && <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))]" />}
                        </div>
                        <p className="text-[10px] text-muted-foreground">{provider.description}</p>
                      </div>
                      <Button variant={isConnected ? "outline" : "default"} size="sm" onClick={() => handleConnect(provider)} className={isConnected ? "h-8 text-xs" : "h-8 text-xs gradient-brand border-0 text-white"}>
                        {isConnected ? "Trennen" : "Verbinden"}
                      </Button>
                    </div>
                  </div>
                );
              })}

              {/* Sync options */}
              {hasConnected && (
                <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border">
                  <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-4 h-0.5 rounded-full gradient-brand" /> Synchronisations-Optionen
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { label: "Gebuchte Termine automatisch eintragen", desc: "Kundentermine → Kalender" },
                      { label: "Follow-up Erinnerungen", desc: "Automatische Erinnerungen" },
                      { label: "Powerdialer-Termine", desc: "Dialer-Termine synchronisieren" },
                      { label: "Bidirektionale Sync", desc: "Kalender ↔ CRM" },
                    ].map((opt) => (
                      <label key={opt.label} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={syncOptions[opt.label] ?? true}
                          onChange={() => setSyncOptions(prev => ({ ...prev, [opt.label]: !(prev[opt.label] ?? true) }))}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="text-xs font-medium text-foreground">{opt.label}</p>
                          <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════ CALENDAR VIEW ═══════════ */}
          {hasConnected && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
              {/* Month Grid */}
              <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
                {/* Month nav */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                  <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><ChevronLeft className="h-4 w-4 text-muted-foreground" /></button>
                  <div className="text-center">
                    <h2 className="text-sm font-display font-bold text-foreground">{MONTH_NAMES[viewMonth]} {viewYear}</h2>
                    <p className="text-[10px] text-muted-foreground">{syncedEventCount} Termine synchronisiert</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setViewYear(now.getFullYear()); setViewMonth(now.getMonth()); }} className="text-[10px] text-primary font-medium hover:underline mr-2">Heute</button>
                    <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><ChevronRight className="h-4 w-4 text-muted-foreground" /></button>
                  </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 border-b border-border">
                  {DAYS.map(d => (
                    <div key={d} className="text-center py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{d}</div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7">
                  {monthCells.map((cell, i) => {
                    const dayEvents = eventsByDate[cell.dateStr] || [];
                    const isToday = cell.dateStr === todayStr;
                    const isSelected = cell.dateStr === selectedDate;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(cell.dateStr)}
                        className={`relative min-h-[80px] p-1.5 border-b border-r border-border/40 text-left transition-colors hover:bg-secondary/30 ${
                          !cell.currentMonth ? "bg-muted/20" : ""
                        } ${isSelected ? "bg-primary/5 ring-1 ring-primary/30" : ""}`}
                      >
                        <span className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          isToday ? "bg-primary text-primary-foreground" : cell.currentMonth ? "text-foreground" : "text-muted-foreground/40"
                        }`}>
                          {cell.day}
                        </span>
                        <div className="mt-0.5 space-y-0.5 overflow-hidden max-h-[48px]">
                          {dayEvents.slice(0, 3).map(ev => {
                            const cfg = CATEGORY_CONFIG[ev.category];
                            return (
                              <div key={ev.id} className={`text-[9px] leading-tight px-1 py-0.5 rounded border truncate ${cfg.bgColor}`}>
                                <span className={`font-medium ${cfg.color}`}>{ev.time}</span>{" "}
                                <span className="text-foreground">{ev.title}</span>
                              </div>
                            );
                          })}
                          {dayEvents.length > 3 && (
                            <p className="text-[9px] text-primary font-medium px-1">+{dayEvents.length - 3} weitere</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Day Detail Sidebar */}
              <div className="space-y-4">
                {/* Selected day */}
                <div className="bg-card rounded-xl shadow-crm-sm border border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-display font-semibold text-foreground">
                      {selectedDate ? new Date(selectedDate + "T00:00:00").toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" }) : "Tag auswählen"}
                    </h3>
                    {selectedDate && (
                      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-primary gap-1" onClick={() => { setShowAddEvent(true); setNewEvent({ ...newEvent, date: selectedDate }); }}>
                        <Plus className="h-3 w-3" /> Hinzufügen
                      </Button>
                    )}
                  </div>

                  {!selectedDate ? (
                    <p className="text-xs text-muted-foreground py-4 text-center">Klicke auf einen Tag im Kalender</p>
                  ) : selectedDateEvents.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-4 text-center">Keine Termine an diesem Tag</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDateEvents.map(ev => {
                        const cfg = CATEGORY_CONFIG[ev.category];
                        const Icon = cfg.icon;
                        return (
                          <button
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors hover:bg-secondary/30 ${cfg.bgColor}`}
                          >
                            <div className="flex items-start gap-2">
                              <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${cfg.color}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-foreground truncate">{ev.title}</p>
                                <p className="text-[10px] text-muted-foreground">
                                  {ev.time}{ev.endTime ? ` – ${ev.endTime}` : ""}
                                  {ev.contact && ` · ${ev.contact}`}
                                </p>
                                {ev.location && (
                                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-2.5 w-2.5" />{ev.location}
                                  </p>
                                )}
                              </div>
                              <Badge variant="secondary" className="text-[8px] shrink-0">{cfg.label}</Badge>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Today's upcoming */}
                <div className="bg-card rounded-xl shadow-crm-sm border border-border p-4">
                  <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-primary" /> Heute anstehend
                  </h3>
                  {(eventsByDate[todayStr] || []).length === 0 ? (
                    <p className="text-[10px] text-muted-foreground text-center py-2">Keine Termine heute</p>
                  ) : (
                    <div className="space-y-1.5">
                      {(eventsByDate[todayStr] || []).map(ev => {
                        const cfg = CATEGORY_CONFIG[ev.category];
                        return (
                          <div key={ev.id} className="flex items-center gap-2 text-xs py-1">
                            <span className={`font-mono font-bold ${cfg.color}`}>{ev.time}</span>
                            <span className="text-foreground truncate flex-1">{ev.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Category legend */}
                <div className="bg-card rounded-xl shadow-crm-sm border border-border p-4">
                  <h3 className="text-xs font-semibold text-foreground mb-2">Kategorien</h3>
                  <div className="grid grid-cols-2 gap-1.5">
                    {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
                      const Icon = cfg.icon;
                      return (
                        <div key={key} className="flex items-center gap-1.5 text-[10px]">
                          <Icon className={`h-3 w-3 ${cfg.color}`} />
                          <span className="text-muted-foreground">{cfg.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Event Detail Dialog ── */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-md">
          {selectedEvent && (() => {
            const cfg = CATEGORY_CONFIG[selectedEvent.category];
            const Icon = cfg.icon;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                    {selectedEvent.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(selectedEvent.date + "T00:00:00").toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEvent.time}{selectedEvent.endTime ? ` – ${selectedEvent.endTime}` : ""} Uhr</span>
                  </div>
                  {selectedEvent.contact && (
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEvent.contact}</span>
                    </div>
                  )}
                  {selectedEvent.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                  {selectedEvent.description && (
                    <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground">{selectedEvent.description}</div>
                  )}
                  {selectedEvent.leadId && (() => {
                    const linkedLead = SAMPLE_LEADS.find(l => l.id === selectedEvent.leadId);
                    if (!linkedLead) return null;
                    const lName = linkedLead.type === "b2b" ? linkedLead.companyName : `${linkedLead.firstName} ${linkedLead.lastName}`;
                    return (
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${linkedLead.type === "b2c" ? "bg-b2c/10 text-b2c" : "bg-b2b/10 text-b2b"}`}>{linkedLead.type === "b2c" ? "B2C" : "B2B"}</span>
                        <span className="font-medium text-foreground">{lName}</span>
                      </div>
                    );
                  })()}
                  <Badge className={`${cfg.bgColor} ${cfg.color} border text-[10px]`}>{cfg.label}</Badge>
                </div>
                <DialogFooter className="mt-4">
                  <Button variant="destructive" size="sm" onClick={() => {
                    setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
                    setSelectedEvent(null);
                    toast({ title: "Termin gelöscht" });
                  }}>Löschen</Button>
                  <Button variant="outline" onClick={() => setSelectedEvent(null)}>Schließen</Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ── Add Event Dialog ── */}
      <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> Neuen Termin erstellen</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1">
              <Label className="text-xs">Titel *</Label>
              <Input placeholder="z.B. Beratungsgespräch Hr. Müller" value={newEvent.title || ""} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Datum *</Label>
                <Input type="date" value={newEvent.date || ""} onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Kategorie</Label>
                <Select value={newEvent.category || "termin"} onValueChange={v => setNewEvent(p => ({ ...p, category: v as EventCategory }))}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Uhrzeit *</Label>
                <Input type="time" value={newEvent.time || "09:00"} onChange={e => setNewEvent(p => ({ ...p, time: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Ende</Label>
                <Input type="time" value={newEvent.endTime || ""} onChange={e => setNewEvent(p => ({ ...p, endTime: e.target.value }))} />
              </div>
            </div>
            {/* Lead-Zuordnung */}
            <div className="space-y-1">
              <Label className="text-xs">Lead zuordnen (optional)</Label>
              <Select value={newEvent.leadId || "none"} onValueChange={v => setNewEvent(p => ({ ...p, leadId: v === "none" ? undefined : v }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Kein Lead" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Kein Lead</SelectItem>
                  {SAMPLE_LEADS.map(l => {
                    const lname = l.type === "b2b" ? l.companyName : `${l.firstName} ${l.lastName}`;
                    return (
                      <SelectItem key={l.id} value={l.id}>
                        <span className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-bold uppercase px-1 py-0.5 rounded ${l.type === "b2c" ? "bg-b2c/10 text-b2c" : "bg-b2b/10 text-b2b"}`}>{l.type === "b2c" ? "B2C" : "B2B"}</span>
                          {lname}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Kontakt / Teilnehmer</Label>
              <Input placeholder="z.B. Anna Klein" value={newEvent.contact || ""} onChange={e => setNewEvent(p => ({ ...p, contact: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Ort</Label>
              <Input placeholder="z.B. Zoom, Büro, Vor Ort" value={newEvent.location || ""} onChange={e => setNewEvent(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Beschreibung</Label>
              <Textarea placeholder="Optionale Notizen…" value={newEvent.description || ""} onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))} rows={2} className="resize-none" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowAddEvent(false)}>Abbrechen</Button>
            <Button className="gradient-brand border-0 text-white" onClick={handleAddEvent}>Termin erstellen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CRMLayout>
  );
}
