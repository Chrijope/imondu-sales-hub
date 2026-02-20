import { useState, useEffect } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Inbox as InboxIcon,
  CheckCircle2,
  Clock,
  Phone,
  Video,
  CalendarDays,
  AlertTriangle,
  Plus,
  Filter,
  ChevronRight,
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
}

const INITIAL_TASKS: InboxTask[] = [
  { id: "1", title: "Rückruf: Hr. Bauer (Architektur Bauer GmbH)", description: "B2B Partner – Interesse an Premium-Paket", type: "call", priority: "high", time: "09:30", contact: "Hr. Bauer", done: false },
  { id: "2", title: "Online-Meeting: Fam. Schneider", description: "Inserat besprechen – MFH München", type: "meeting", priority: "high", time: "10:00", contact: "Fam. Schneider", done: false },
  { id: "3", title: "Follow-Up E-Mail an Peter Klein", description: "Sanierungsanfrage nachfassen", type: "follow-up", priority: "medium", time: "11:00", contact: "Peter Klein", done: false },
  { id: "4", title: "Neue B2C Leads qualifizieren", description: "5 neue Eigentümer-Anfragen prüfen", type: "todo", priority: "medium", time: "14:00", done: false },
  { id: "5", title: "Vertrag an Malermeister Schulz senden", description: "B2B Partnervertrag vorbereiten", type: "deadline", priority: "high", time: "15:00", contact: "Schulz GmbH", done: false },
  { id: "6", title: "Teammeeting Wochenplanung", description: "Weekly mit Vertriebsteam", type: "meeting", priority: "medium", time: "16:00", done: false },
  { id: "7", title: "Provision Februar prüfen", description: "Gutschrift kontrollieren", type: "todo", priority: "low", done: false },
  { id: "8", title: "Eigentümer Müller – Inserat online prüfen", description: "Inserat-Check vor Freischaltung", type: "todo", priority: "low", time: "Morgen 09:00", contact: "Fr. Müller", done: false },
];

const typeIcons: Record<TaskType, React.ComponentType<{ className?: string }>> = {
  call: Phone,
  meeting: Video,
  todo: CheckCircle2,
  "follow-up": Clock,
  deadline: AlertTriangle,
};

const typeLabels: Record<TaskType, string> = {
  call: "Anruf",
  meeting: "Meeting",
  todo: "Aufgabe",
  "follow-up": "Follow-Up",
  deadline: "Deadline",
};

const priorityStyles: Record<TaskPriority, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-muted text-muted-foreground border-border",
};

type FilterType = "alle" | TaskType;

export default function Inbox() {
  const [tasks, setTasks] = useState<InboxTask[]>(() => {
    try {
      const saved = localStorage.getItem("inbox-tasks");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TASKS;
  });
  const [filter, setFilter] = useState<FilterType>("alle");

  useEffect(() => {
    localStorage.setItem("inbox-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const toggleDone = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const filtered = filter === "alle" ? tasks : tasks.filter((t) => t.type === filter);
  const pending = filtered.filter((t) => !t.done);
  const completed = filtered.filter((t) => t.done);

  const todayCount = tasks.filter((t) => !t.done && t.time && !t.time.startsWith("Morgen")).length;
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
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in max-w-5xl">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-1 rounded-full gradient-brand" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Inbox</h1>
          <p className="text-sm text-muted-foreground mt-1">Deine tagesrelevanten Aufgaben, Meetings & Follow-Ups</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <p className="text-3xl font-display font-bold text-foreground">{todayCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Heute fällig</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <p className="text-3xl font-display font-bold text-foreground">{meetingCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Meetings</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
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

        {/* Pending tasks */}
        <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <InboxIcon className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Offen ({pending.length})</h2>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
              <Plus className="h-3.5 w-3.5" /> Aufgabe
            </Button>
          </div>
          <div className="divide-y divide-border/60">
            {pending.map((task) => {
              const Icon = typeIcons[task.type];
              return (
                <div key={task.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-secondary/30 transition-colors group">
                  <Checkbox
                    checked={task.done}
                    onCheckedChange={() => toggleDone(task.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">{task.title}</span>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityStyles[task.priority]}`}>
                        {task.priority === "high" ? "Dringend" : task.priority === "medium" ? "Mittel" : "Niedrig"}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="gap-1 text-[11px]">
                      <Icon className="h-3 w-3" />
                      {typeLabels[task.type]}
                    </Badge>
                    {task.time && (
                      <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                        <CalendarDays className="h-3 w-3 inline mr-0.5 -mt-0.5" />
                        {task.time}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })}
            {pending.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">
                🎉 Alles erledigt – keine offenen Aufgaben!
              </div>
            )}
          </div>
        </div>

        {/* Completed */}
        {completed.length > 0 && (
          <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden opacity-70">
            <div className="px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-muted-foreground">Erledigt ({completed.length})</h2>
              </div>
            </div>
            <div className="divide-y divide-border/40">
              {completed.map((task) => (
                <div key={task.id} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/20 transition-colors">
                  <Checkbox checked onCheckedChange={() => toggleDone(task.id)} className="mt-0.5" />
                  <span className="text-sm text-muted-foreground line-through">{task.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CRMLayout>
  );
}
