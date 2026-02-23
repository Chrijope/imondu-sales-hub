import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CRMLayout from "@/components/CRMLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Inbox as InboxIcon,
  CheckCircle2,
  Clock,
  Phone,
  Video,
  CalendarDays,
  AlertTriangle,
  Filter,
  ChevronRight,
  Calendar,
  ListTodo,
  Sun,
  LayoutList,
} from "lucide-react";

type TaskPriority = "high" | "medium" | "low";
type TaskType = "call" | "meeting" | "todo" | "follow-up" | "deadline";

interface InboxTask {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  time?: string;
  contact?: string;
  done: boolean;
  day?: "mo" | "di" | "mi" | "do" | "fr"; // for weekly view
  leadId?: string; // link to lead detail
}

const INITIAL_TASKS: InboxTask[] = [
  { id: "1", title: "Rückruf: Hr. Bauer (Architektur Bauer GmbH)", description: "B2B Partner – Interesse an Premium-Paket", type: "call", priority: "high", time: "09:30", contact: "Hr. Bauer", done: false, day: "mo", leadId: "2" },
  { id: "2", title: "Online-Meeting: Fam. Schneider", description: "Inserat besprechen – MFH München", type: "meeting", priority: "high", time: "10:00", contact: "Fam. Schneider", done: false, day: "mo" },
  { id: "3", title: "Follow-Up E-Mail an Peter Klein", description: "Sanierungsanfrage nachfassen", type: "follow-up", priority: "medium", time: "11:00", contact: "Peter Klein", done: false, day: "mo", leadId: "3" },
  { id: "4", title: "Neue B2C Leads qualifizieren", description: "5 neue Eigentümer-Anfragen prüfen", type: "todo", priority: "medium", time: "14:00", done: false, day: "di" },
  { id: "5", title: "Vertrag an Malermeister Schulz senden", description: "B2B Partnervertrag vorbereiten", type: "deadline", priority: "high", time: "15:00", contact: "Schulz GmbH", done: false, day: "di", leadId: "8" },
  { id: "6", title: "Teammeeting Wochenplanung", description: "Weekly mit Vertriebsteam", type: "meeting", priority: "medium", time: "16:00", done: false, day: "mi" },
  { id: "7", title: "Provision Februar prüfen", description: "Gutschrift kontrollieren", type: "todo", priority: "low", done: false, day: "do" },
  { id: "8", title: "Eigentümer Müller – Inserat online prüfen", description: "Inserat-Check vor Freischaltung", type: "todo", priority: "low", time: "09:00", contact: "Fr. Müller", done: false, day: "fr", leadId: "1" },
  { id: "9", title: "Kaltakquise-Block: 10 Anrufe", description: "Neue Eigentümer aus Lead-Liste kontaktieren", type: "call", priority: "medium", time: "10:00", done: false, day: "mi" },
  { id: "10", title: "Exposé für MFH Stuttgart erstellen", description: "Fotos + Daten aufbereiten", type: "todo", priority: "medium", time: "13:00", done: false, day: "do", leadId: "11" },
  // HR / Bewerbermanagement Aufgaben
  { id: "11", title: "Screening: Tim Hoffmann", description: "Lebenslauf und Bewerbungsunterlagen prüfen", type: "todo", priority: "high", time: "09:00", contact: "Tim Hoffmann", done: false, day: "mo" },
  { id: "12", title: "Interview mit Lukas Weber vorbereiten", description: "Gesprächsleitfaden und Unterlagen zusammenstellen", type: "todo", priority: "medium", time: "11:00", contact: "Lukas Weber", done: false, day: "di" },
  { id: "13", title: "Onboarding-Termin: Markus Braun", description: "Onboarding am 03.03. – Unterlagen und Raum vorbereiten", type: "deadline", priority: "high", time: "09:00", contact: "Markus Braun", done: false, day: "mi" },
  { id: "14", title: "Absage an Anna Meier versenden", description: "Ablehnungs-E-Mail formulieren und senden", type: "follow-up", priority: "low", time: "14:00", contact: "Anna Meier", done: false, day: "do" },
  { id: "15", title: "Neue Bewerbung sichten: Julia Richter", description: "Eingegangene Bewerbung im Portal prüfen", type: "todo", priority: "medium", time: "10:00", contact: "Julia Richter", done: false, day: "fr" },
];

const typeIcons: Record<TaskType, React.ComponentType<{ className?: string }>> = {
  call: Phone, meeting: Video, todo: CheckCircle2, "follow-up": Clock, deadline: AlertTriangle,
};
const typeLabels: Record<TaskType, string> = {
  call: "Anruf", meeting: "Meeting", todo: "Aufgabe", "follow-up": "Follow-Up", deadline: "Deadline",
};
const priorityStyles: Record<TaskPriority, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-muted text-muted-foreground border-border",
};

const DAYS = [
  { key: "mo", label: "Montag" },
  { key: "di", label: "Dienstag" },
  { key: "mi", label: "Mittwoch" },
  { key: "do", label: "Donnerstag" },
  { key: "fr", label: "Freitag" },
] as const;

type FilterType = "alle" | TaskType;

function TaskRow({ task, onToggle, onNavigate }: { task: InboxTask; onToggle: () => void; onNavigate?: () => void }) {
  const Icon = typeIcons[task.type];
  return (
    <div
      className={`flex items-start gap-3 px-5 py-3.5 hover:bg-secondary/30 transition-colors group ${task.leadId ? "cursor-pointer" : ""}`}
      onClick={() => task.leadId && onNavigate?.()}
    >
      <Checkbox
        checked={task.done}
        onCheckedChange={(e) => { e && e; onToggle(); }}
        className="mt-0.5"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityStyles[task.priority]}`}>
            {task.priority === "high" ? "Dringend" : task.priority === "medium" ? "Mittel" : "Niedrig"}
          </Badge>
          {task.leadId && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
        </div>
        {task.description && <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="secondary" className="gap-1 text-[11px]">
          <Icon className="h-3 w-3" /> {typeLabels[task.type]}
        </Badge>
        {task.time && (
          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
            <CalendarDays className="h-3 w-3 inline mr-0.5 -mt-0.5" />{task.time}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Inbox() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<InboxTask[]>(() => {
    try {
      const saved = localStorage.getItem("inbox-tasks-v2");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TASKS;
  });
  const [filter, setFilter] = useState<FilterType>("alle");

  useEffect(() => {
    localStorage.setItem("inbox-tasks-v2", JSON.stringify(tasks));
  }, [tasks]);

  const toggleDone = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const filtered = filter === "alle" ? tasks : tasks.filter((t) => t.type === filter);
  const todayTasks = filtered.filter((t) => t.day === "mo"); // simulate "today" = Monday
  const pendingToday = todayTasks.filter((t) => !t.done);
  const completedToday = todayTasks.filter((t) => t.done);

  const todayCount = tasks.filter((t) => !t.done && t.day === "mo").length;
  const weekCount = tasks.filter((t) => !t.done).length;
  const meetingCount = tasks.filter((t) => !t.done && t.type === "meeting").length;
  const highCount = tasks.filter((t) => !t.done && t.priority === "high").length;

  const filters: { key: FilterType; label: string }[] = [
    { key: "alle", label: "Alle" },
    { key: "call", label: "Anrufe" },
    { key: "meeting", label: "Meetings" },
    { key: "todo", label: "Aufgaben" },
    { key: "follow-up", label: "Follow-Ups" },
    { key: "deadline", label: "Deadlines" },
  ];

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in min-h-screen dashboard-mesh-bg">
       <div className="max-w-5xl space-y-5">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-1 rounded-full gradient-brand" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Inbox & Tagesplanung</h1>
          <p className="text-sm text-muted-foreground mt-1">Deine tagesrelevanten Aufgaben, Meetings & Wochenübersicht</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-3xl font-display font-bold text-foreground">{todayCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Heute offen</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-3xl font-display font-bold text-foreground">{weekCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Diese Woche</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-3xl font-display font-bold text-foreground">{meetingCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Meetings</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-3xl font-display font-bold text-destructive">{highCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Hohe Priorität</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {filters.map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? "default" : "outline"}
              size="sm"
              className={filter === f.key ? "gradient-brand border-0 text-primary-foreground" : ""}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Tabs: Heute / Woche */}
        <Tabs defaultValue="heute">
          <TabsList>
            <TabsTrigger value="heute" className="gap-1.5 text-sm"><Sun className="h-3.5 w-3.5" /> Heute</TabsTrigger>
            <TabsTrigger value="woche" className="gap-1.5 text-sm"><LayoutList className="h-3.5 w-3.5" /> Wochenübersicht</TabsTrigger>
          </TabsList>

          {/* TODAY VIEW */}
          <TabsContent value="heute" className="mt-4 space-y-4">
            <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-warning" />
                  <h2 className="text-sm font-semibold text-foreground">Heute – Montag ({pendingToday.length} offen)</h2>
                </div>
              </div>
              <div className="divide-y divide-border/60">
                {pendingToday.length > 0 ? (
                  pendingToday.map((task) => (
                    <TaskRow key={task.id} task={task} onToggle={() => toggleDone(task.id)} onNavigate={() => task.leadId && navigate(`/lead/${task.leadId}`)} />
                  ))
                ) : (
                  <div className="py-12 text-center text-muted-foreground text-sm">
                    🎉 Alles erledigt – keine offenen Aufgaben heute!
                  </div>
                )}
              </div>
            </div>

            {completedToday.length > 0 && (
              <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden opacity-70">
                <div className="px-5 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-muted-foreground">Erledigt ({completedToday.length})</h2>
                  </div>
                </div>
                <div className="divide-y divide-border/40">
                  {completedToday.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/20 transition-colors">
                      <Checkbox checked onCheckedChange={() => toggleDone(task.id)} className="mt-0.5" />
                      <span className="text-sm text-muted-foreground line-through">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* WEEK VIEW */}
          <TabsContent value="woche" className="mt-4 space-y-4">
            {DAYS.map(({ key, label }) => {
              const dayTasks = filtered.filter((t) => t.day === key);
              const pending = dayTasks.filter((t) => !t.done);
              const done = dayTasks.filter((t) => t.done);
              const isToday = key === "mo";

              return (
                <div key={key} className={`bg-card rounded-xl shadow-crm-sm border overflow-hidden ${isToday ? "border-primary/40 ring-1 ring-primary/20" : "border-border"}`}>
                  <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">{label}</h3>
                    {isToday && <Badge className="gradient-brand border-0 text-primary-foreground text-[10px]">Heute</Badge>}
                    <Badge variant="secondary" className="ml-auto text-[10px]">
                      {done.length}/{dayTasks.length} erledigt
                    </Badge>
                  </div>
                  {dayTasks.length > 0 ? (
                    <div className="divide-y divide-border/40">
                      {[...pending, ...done].map((task) => (
                        <TaskRow key={task.id} task={task} onToggle={() => toggleDone(task.id)} onNavigate={() => task.leadId && navigate(`/lead/${task.leadId}`)} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-muted-foreground text-xs">Keine Aufgaben</div>
                  )}
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </CRMLayout>
  );
}
