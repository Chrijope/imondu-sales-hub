import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  Play,
  CheckCircle2,
  Lock,
  Clock,
  ChevronDown,
  ChevronRight,
  Trophy,
  Star,
  BookOpen,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  modules: Module[];
  totalDuration: string;
}

const COURSES: Course[] = [
  {
    id: "onboarding",
    title: "Onboarding – Dein Start bei imondu",
    description: "Lerne die Basics: Plattform, Tools und erste Schritte als Vertriebspartner.",
    thumbnail: "🚀",
    category: "Pflicht",
    totalDuration: "2h 15min",
    modules: [
      {
        id: "m1",
        title: "Willkommen bei imondu",
        description: "Überblick über die Plattform",
        lessons: [
          { id: "l1", title: "Was ist imondu?", duration: "8:30", completed: true, locked: false },
          { id: "l2", title: "Dein Dashboard erklärt", duration: "12:00", completed: true, locked: false },
          { id: "l3", title: "Dein erster Lead", duration: "15:00", completed: false, locked: false },
        ],
      },
      {
        id: "m2",
        title: "Das CRM nutzen",
        description: "Kontakte, Pipeline & Leads verwalten",
        lessons: [
          { id: "l4", title: "Kontakte anlegen & verwalten", duration: "10:00", completed: false, locked: false },
          { id: "l5", title: "Pipeline-Management", duration: "14:00", completed: false, locked: false },
          { id: "l6", title: "Follow-Up Strategie", duration: "11:00", completed: false, locked: true },
        ],
      },
      {
        id: "m3",
        title: "Abschluss & Zertifikat",
        description: "Quiz und Zertifikat erhalten",
        lessons: [
          { id: "l7", title: "Quiz: CRM Grundlagen", duration: "5:00", completed: false, locked: true },
          { id: "l8", title: "Dein Zertifikat 🎓", duration: "2:00", completed: false, locked: true },
        ],
      },
    ],
  },
  {
    id: "b2c-mastery",
    title: "B2C Mastery – Eigentümer gewinnen",
    description: "Fortgeschrittene Techniken zur Eigentümer-Akquise und Inserat-Optimierung.",
    thumbnail: "🏠",
    category: "Vertrieb",
    totalDuration: "3h 40min",
    modules: [
      {
        id: "m4",
        title: "Eigentümer ansprechen",
        description: "Gesprächsleitfäden und Best Practices",
        lessons: [
          { id: "l9", title: "Der perfekte Erstkontakt", duration: "18:00", completed: true, locked: false },
          { id: "l10", title: "Einwandbehandlung", duration: "22:00", completed: false, locked: false },
          { id: "l11", title: "Vom Lead zum Inserat", duration: "20:00", completed: false, locked: false },
        ],
      },
      {
        id: "m5",
        title: "Inserate optimieren",
        description: "Mehr Sichtbarkeit und bessere Ergebnisse",
        lessons: [
          { id: "l12", title: "Professionelle Objektfotos", duration: "15:00", completed: false, locked: true },
          { id: "l13", title: "Inserat-Texte die verkaufen", duration: "12:00", completed: false, locked: true },
        ],
      },
    ],
  },
  {
    id: "b2b-pro",
    title: "B2B Pro – Partner akquirieren",
    description: "Handwerksbetriebe und Dienstleister als Partner gewinnen.",
    thumbnail: "🤝",
    category: "Vertrieb",
    totalDuration: "2h 50min",
    modules: [
      {
        id: "m6",
        title: "B2B Akquise Grundlagen",
        description: "Zielgruppe und Ansprache",
        lessons: [
          { id: "l14", title: "Zielgruppen-Analyse", duration: "14:00", completed: false, locked: false },
          { id: "l15", title: "Kaltakquise Masterclass", duration: "25:00", completed: false, locked: false },
          { id: "l16", title: "Pitch-Deck & Präsentation", duration: "18:00", completed: false, locked: true },
        ],
      },
    ],
  },
  {
    id: "leadership",
    title: "Leadership – Team aufbauen",
    description: "Lerne wie du ein erfolgreiches Vertriebsteam aufbaust und führst.",
    thumbnail: "👑",
    category: "Führung",
    totalDuration: "4h 10min",
    modules: [
      {
        id: "m7",
        title: "Recruiting & Onboarding",
        description: "Die richtigen Partner finden",
        lessons: [
          { id: "l17", title: "Wo finde ich Partner?", duration: "16:00", completed: false, locked: false },
          { id: "l18", title: "Das Erstgespräch führen", duration: "20:00", completed: false, locked: false },
          { id: "l19", title: "Onboarding-Prozess", duration: "22:00", completed: false, locked: true },
        ],
      },
    ],
  },
];

function CourseCard({ course, onSelect }: { course: Course; onSelect: () => void }) {
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedCount = allLessons.filter((l) => l.completed).length;
  const progress = Math.round((completedCount / allLessons.length) * 100);

  return (
    <button
      onClick={onSelect}
      className="bg-card rounded-xl p-5 shadow-crm-sm border border-border hover:shadow-crm-md hover:border-primary/20 transition-all text-left w-full group"
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl shrink-0">{course.thumbnail}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-[10px]">{course.category}</Badge>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> {course.totalDuration}
            </span>
          </div>
          <h3 className="text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors">{course.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={progress} className="h-1.5 flex-1" />
            <span className="text-xs font-medium text-muted-foreground">{progress}%</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {completedCount}/{allLessons.length} Lektionen abgeschlossen
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors mt-2" />
      </div>
    </button>
  );
}

function CourseDetail({ course, onBack }: { course: Course; onBack: () => void }) {
  const [openModules, setOpenModules] = useState<string[]>([course.modules[0]?.id]);
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedCount = allLessons.filter((l) => l.completed).length;
  const progress = Math.round((completedCount / allLessons.length) * 100);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  const toggleModule = (id: string) =>
    setOpenModules((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground gap-1 -ml-2">
        ← Zurück zur Übersicht
      </Button>

      {/* Video player placeholder */}
      <div className="bg-foreground/5 rounded-xl aspect-video flex items-center justify-center border border-border relative overflow-hidden">
        {activeLesson ? (
          <div className="text-center">
            <div className="h-16 w-16 rounded-full gradient-brand flex items-center justify-center mx-auto mb-3">
              <Play className="h-7 w-7 text-primary-foreground ml-1" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {allLessons.find((l) => l.id === activeLesson)?.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Video wird geladen…</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-3">{course.thumbnail}</div>
            <p className="text-sm font-medium text-foreground">{course.title}</p>
            <p className="text-xs text-muted-foreground mt-1">Wähle eine Lektion um zu starten</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-foreground">Kursfortschritt</h2>
          <div className="flex items-center gap-1.5">
            {progress === 100 && <Trophy className="h-4 w-4 text-warning" />}
            <span className="text-sm font-bold text-foreground">{progress}%</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1.5">{completedCount} von {allLessons.length} Lektionen abgeschlossen</p>
      </div>

      {/* Modules accordion */}
      <div className="space-y-2">
        {course.modules.map((mod, mi) => {
          const isOpen = openModules.includes(mod.id);
          const modCompleted = mod.lessons.filter((l) => l.completed).length;
          return (
            <div key={mod.id} className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-secondary/30 transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {mi + 1}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-foreground">{mod.title}</p>
                  <p className="text-xs text-muted-foreground">{mod.description} · {modCompleted}/{mod.lessons.length} fertig</p>
                </div>
                {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </button>
              {isOpen && (
                <div className="border-t border-border/60">
                  {mod.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      disabled={lesson.locked}
                      onClick={() => !lesson.locked && setActiveLesson(lesson.id)}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                        lesson.locked
                          ? "opacity-50 cursor-not-allowed"
                          : activeLesson === lesson.id
                          ? "bg-primary/5"
                          : "hover:bg-secondary/20"
                      }`}
                    >
                      {lesson.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      ) : lesson.locked ? (
                        <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <Play className="h-4 w-4 text-primary shrink-0" />
                      )}
                      <span className={`text-sm flex-1 ${lesson.completed ? "text-muted-foreground" : "text-foreground"}`}>
                        {lesson.title}
                      </span>
                      <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Academy() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const course = COURSES.find((c) => c.id === selectedCourse);

  const totalLessons = COURSES.reduce((s, c) => s + c.modules.reduce((s2, m) => s2 + m.lessons.length, 0), 0);
  const completedLessons = COURSES.reduce((s, c) => s + c.modules.reduce((s2, m) => s2 + m.lessons.filter((l) => l.completed).length, 0), 0);
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in max-w-5xl">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-1 rounded-full gradient-brand" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Academy</h1>
          <p className="text-sm text-muted-foreground mt-1">Deine Lernplattform – Kurse, Lektionen & Zertifikate</p>
        </div>

        {course ? (
          <CourseDetail course={course} onBack={() => setSelectedCourse(null)} />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
                <GraduationCap className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-2xl font-display font-bold text-foreground">{COURSES.length}</p>
                <p className="text-xs text-muted-foreground">Kurse</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
                <BookOpen className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-2xl font-display font-bold text-foreground">{completedLessons}/{totalLessons}</p>
                <p className="text-xs text-muted-foreground">Lektionen</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
                <Star className="h-5 w-5 text-warning mx-auto mb-1" />
                <p className="text-2xl font-display font-bold text-foreground">{overallProgress}%</p>
                <p className="text-xs text-muted-foreground">Gesamtfortschritt</p>
              </div>
            </div>

            {/* Course list */}
            <div className="space-y-3">
              {COURSES.map((c) => (
                <CourseCard key={c.id} course={c} onSelect={() => setSelectedCourse(c.id)} />
              ))}
            </div>
          </>
        )}
      </div>
    </CRMLayout>
  );
}
