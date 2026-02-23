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
  FileQuestion,
  Award,
} from "lucide-react";
import { COURSES, type Course } from "@/data/academy-courses";

function CourseCard({ course, onSelect }: { course: Course; onSelect: () => void }) {
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedCount = allLessons.filter((l) => l.completed).length;
  const progress = Math.round((completedCount / allLessons.length) * 100);

  return (
    <button
      onClick={onSelect}
      className="glass-card rounded-xl p-5 hover:shadow-crm-md transition-all text-left w-full group"
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl shrink-0">{course.thumbnail}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="secondary" className="text-[10px]">{course.category}</Badge>
            {course.mandatory && <Badge variant="destructive" className="text-[10px]">Pflicht</Badge>}
            {course.hasCertificate && <Badge variant="outline" className="text-[10px] gap-1"><Award className="h-2.5 w-2.5" />Zertifikat</Badge>}
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

  const activeLessonData = allLessons.find((l) => l.id === activeLesson);

  const toggleModule = (id: string) =>
    setOpenModules((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));

  const isQuizLesson = (lessonId: string) => lessonId.includes("l32") || lessonId.includes("l33");
  const isCertLesson = (lessonId: string) => lessonId.includes("l34") || lessonId.includes("l8");

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground gap-1 -ml-2">
        ← Zurück zur Übersicht
      </Button>

      {/* Video player placeholder */}
      <div className="bg-foreground/5 rounded-xl aspect-video flex items-center justify-center border border-border relative overflow-hidden">
        {activeLesson ? (
          <div className="text-center px-6">
            <div className={`h-16 w-16 rounded-full ${isCertLesson(activeLesson) ? "bg-warning/20" : isQuizLesson(activeLesson) ? "bg-accent" : "gradient-brand"} flex items-center justify-center mx-auto mb-3`}>
              {isCertLesson(activeLesson) ? (
                <Award className="h-7 w-7 text-warning" />
              ) : isQuizLesson(activeLesson) ? (
                <FileQuestion className="h-7 w-7 text-primary" />
              ) : (
                <Play className="h-7 w-7 text-primary-foreground ml-1" />
              )}
            </div>
            <p className="text-sm font-medium text-foreground">{activeLessonData?.title}</p>
            {activeLessonData?.description && (
              <p className="text-xs text-muted-foreground mt-2 max-w-md mx-auto">{activeLessonData.description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-3 italic">
              {isCertLesson(activeLesson) ? "Zertifikat wird nach bestandener Prüfung freigeschaltet…" :
               isQuizLesson(activeLesson) ? "Quiz wird geladen…" : "Video wird geladen…"}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-3">{course.thumbnail}</div>
            <p className="text-sm font-medium text-foreground">{course.title}</p>
            <p className="text-xs text-muted-foreground mt-1">Wähle eine Lektion um zu starten</p>
          </div>
        )}
      </div>

      {/* Certificate banner for mandatory courses */}
      {course.hasCertificate && (
        <div className={`rounded-xl p-4 border flex items-center gap-3 ${progress === 100 ? "border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5" : "border-warning/30 bg-warning/5"}`}>
          <Award className={`h-5 w-5 shrink-0 ${progress === 100 ? "text-[hsl(var(--success))]" : "text-warning"}`} />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {progress === 100 ? "Zertifikat erhalten! 🎉" : "Zertifikat: Geprüfter imondu Vertriebspartner"}
            </p>
            <p className="text-xs text-muted-foreground">
              {progress === 100
                ? "Du hast den Kurs abgeschlossen und dein Zertifikat erhalten. Das Backoffice ist vollständig freigeschaltet."
                : "Schließe alle Lektionen ab und bestehe die Abschlussprüfung, um dein Zertifikat zu erhalten und das Backoffice freizuschalten."}
            </p>
          </div>
        </div>
      )}

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
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm block ${lesson.completed ? "text-muted-foreground" : "text-foreground"}`}>
                          {lesson.title}
                        </span>
                        {lesson.description && activeLesson === lesson.id && (
                          <span className="text-[11px] text-muted-foreground block mt-0.5">{lesson.description}</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{lesson.duration}</span>
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
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in min-h-screen dashboard-mesh-bg">
       <div className="max-w-5xl space-y-5">
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
              <div className="glass-card rounded-xl p-4 text-center">
                <GraduationCap className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-2xl font-display font-bold text-foreground">{COURSES.length}</p>
                <p className="text-xs text-muted-foreground">Kurse</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <BookOpen className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-2xl font-display font-bold text-foreground">{completedLessons}/{totalLessons}</p>
                <p className="text-xs text-muted-foreground">Lektionen</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
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
      </div>
    </CRMLayout>
  );
}
