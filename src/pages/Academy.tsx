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
  ChevronLeft,
  Trophy,
  Star,
  BookOpen,
  FileQuestion,
  Award,
  SkipForward,
  Gauge,
  Pencil,
  Plus,
  Settings2,
} from "lucide-react";
import { COURSES as INITIAL_COURSES, type Course, type Lesson } from "@/data/academy-courses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserRole } from "@/contexts/UserRoleContext";
import CourseEditor from "@/components/CourseEditor";
import { toast } from "sonner";

// ── Course Card (list view) ──
function CourseCard({
  course,
  onSelect,
  canEdit,
  onEdit,
}: {
  course: Course;
  onSelect: () => void;
  canEdit?: boolean;
  onEdit?: () => void;
}) {
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedCount = allLessons.filter((l) => l.completed).length;
  const progress = Math.round((completedCount / allLessons.length) * 100);

  return (
    <div className="glass-card rounded-xl p-5 hover:shadow-crm-md transition-all w-full group relative">
      <button onClick={onSelect} className="flex items-start gap-4 text-left w-full">
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
          <p className="text-[11px] text-muted-foreground mt-1">{completedCount}/{allLessons.length} Lektionen abgeschlossen</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors mt-2" />
      </button>
      {canEdit && onEdit && (
        <Button
          variant="outline"
          size="sm"
          className="absolute top-3 right-3 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
        >
          <Pencil className="h-3 w-3" /> Bearbeiten
        </Button>
      )}
    </div>
  );
}

// ── Lesson Player (full page view) ──
function LessonPlayer({
  lesson,
  course,
  allLessons,
  currentIndex,
  onBack,
  onNavigate,
  onComplete,
}: {
  lesson: Lesson;
  course: Course;
  allLessons: Lesson[];
  currentIndex: number;
  onBack: () => void;
  onNavigate: (lessonId: string) => void;
  onComplete: (lessonId: string) => void;
}) {
  const [speed, setSpeed] = useState("1");
  const [videoWatched, setVideoWatched] = useState(lesson.completed);
  const [videoProgress, setVideoProgress] = useState(lesson.completed ? 100 : 0);

  const isQuiz = lesson.id.includes("l32") || lesson.id.includes("l33") || lesson.id.includes("l7");
  const isCert = lesson.id.includes("l34") || lesson.id.includes("l8");

  const parentModule = course.modules.find((m) => m.lessons.some((l) => l.id === lesson.id));

  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const nextLocked = nextLesson?.locked && !videoWatched;

  const handleSimulateWatch = () => {
    setVideoProgress(100);
    setVideoWatched(true);
    if (!lesson.completed) {
      onComplete(lesson.id);
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground gap-1 -ml-2">
        <ChevronLeft className="h-4 w-4" /> Zurück zum Kurs
      </Button>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{course.title}</span>
        <ChevronRight className="h-3 w-3" />
        {parentModule && <span>{parentModule.title}</span>}
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">{lesson.title}</span>
      </div>

      <div className="bg-foreground/5 rounded-xl aspect-video flex items-center justify-center border border-border relative overflow-hidden">
        <div className="text-center px-6">
          <div
            className={`h-20 w-20 rounded-full ${isCert ? "bg-warning/20" : isQuiz ? "bg-accent" : "gradient-brand"} flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform`}
            onClick={handleSimulateWatch}
          >
            {isCert ? (
              <Award className="h-8 w-8 text-warning" />
            ) : isQuiz ? (
              <FileQuestion className="h-8 w-8 text-primary" />
            ) : videoWatched ? (
              <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
            ) : (
              <Play className="h-8 w-8 text-primary-foreground ml-1" />
            )}
          </div>
          <p className="text-base font-semibold text-foreground">{lesson.title}</p>
          <p className="text-xs text-muted-foreground mt-2 italic">
            {videoWatched
              ? "✓ Video angesehen"
              : isCert
              ? "Zertifikat wird nach bestandener Prüfung freigeschaltet…"
              : isQuiz
              ? "Klicke um das Quiz zu starten"
              : "Klicke auf Play um das Video zu starten"}
          </p>
        </div>

        {!isCert && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-foreground/10">
            <div
              className="h-full gradient-brand transition-all duration-500"
              style={{ width: `${videoProgress}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between bg-card rounded-xl p-4 border border-border shadow-crm-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <Select value={speed} onValueChange={setSpeed}>
              <SelectTrigger className="h-8 w-[100px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="0.75">0.75x</SelectItem>
                <SelectItem value="1">1x Normal</SelectItem>
                <SelectItem value="1.25">1.25x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> {lesson.duration}
          </span>
          <span className="text-xs text-muted-foreground">
            Lektion {currentIndex + 1} von {allLessons.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentIndex > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1"
              onClick={() => onNavigate(allLessons[currentIndex - 1].id)}
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Vorherige
            </Button>
          )}
          {nextLesson && (
            <Button
              size="sm"
              className={`text-xs gap-1 ${videoWatched ? "gradient-brand border-0 text-white" : ""}`}
              disabled={!videoWatched || nextLocked}
              onClick={() => nextLesson && onNavigate(nextLesson.id)}
            >
              Weiter <SkipForward className="h-3.5 w-3.5" />
            </Button>
          )}
          {!nextLesson && videoWatched && (
            <Button size="sm" className="text-xs gap-1 gradient-brand border-0 text-white" onClick={onBack}>
              <Trophy className="h-3.5 w-3.5" /> Kurs abschließen
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border shadow-crm-sm">
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" /> Beschreibung
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {lesson.description || "Keine Beschreibung verfügbar."}
          </p>
          {parentModule && (
            <div className="mt-4 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Modul:</span> {parentModule.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="font-medium text-foreground">Modulbeschreibung:</span> {parentModule.description}
              </p>
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl p-5 border border-border shadow-crm-sm">
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <FileQuestion className="h-4 w-4 text-primary" /> Übung / Aufgabe
          </h3>
          {isQuiz ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                In dieser Lektion wirst du dein Wissen in einem Quiz testen. Beantworte die Fragen und überprüfe dein Verständnis.
              </p>
              <Button variant="outline" size="sm" className="text-xs gap-1" disabled={!videoWatched}>
                <Play className="h-3 w-3" /> Quiz starten
              </Button>
            </div>
          ) : isCert ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Nach Abschluss aller Module und Bestehen der Prüfung kannst du hier dein Zertifikat herunterladen.
              </p>
              <Button variant="outline" size="sm" className="text-xs gap-1" disabled>
                <Award className="h-3 w-3" /> Zertifikat herunterladen
              </Button>
            </div>
          ) : lesson.exercise ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {lesson.exercise}
              </p>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-xs font-medium text-foreground mb-1">💡 Tipp</p>
                <p className="text-xs text-muted-foreground">
                  Öffne das entsprechende Tool im Backoffice in einem zweiten Tab, um die Aufgabe parallel zum Video durchzuführen.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground italic">
                Für diese Lektion gibt es keine gesonderte Übung. Schaue dir das Video aufmerksam an und mache dich mit den gezeigten Funktionen vertraut.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Course Detail (module list, clicking a lesson opens player) ──
function CourseDetail({
  course,
  onBack,
  onOpenLesson,
  canEdit,
  onEdit,
}: {
  course: Course;
  onBack: () => void;
  onOpenLesson: (lessonId: string) => void;
  canEdit?: boolean;
  onEdit?: () => void;
}) {
  const [openModules, setOpenModules] = useState<string[]>([course.modules[0]?.id]);
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedCount = allLessons.filter((l) => l.completed).length;
  const progress = Math.round((completedCount / allLessons.length) * 100);

  const toggleModule = (id: string) =>
    setOpenModules((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground gap-1 -ml-2">
          ← Zurück zur Übersicht
        </Button>
        {canEdit && onEdit && (
          <Button variant="outline" size="sm" className="text-xs gap-1" onClick={onEdit}>
            <Pencil className="h-3 w-3" /> Kurs bearbeiten
          </Button>
        )}
      </div>

      {/* Course header */}
      <div className="flex items-center gap-4">
        <div className="text-5xl">{course.thumbnail}</div>
        <div>
          <h2 className="text-lg font-display font-bold text-foreground">{course.title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{course.description}</p>
        </div>
      </div>

      {course.hasCertificate && (
        <div className={`rounded-xl p-4 border flex items-center gap-3 ${progress === 100 ? "border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5" : "border-warning/30 bg-warning/5"}`}>
          <Award className={`h-5 w-5 shrink-0 ${progress === 100 ? "text-[hsl(var(--success))]" : "text-warning"}`} />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {progress === 100 ? "Zertifikat erhalten! 🎉" : "Zertifikat: Geprüfter imondu Vertriebspartner"}
            </p>
            <p className="text-xs text-muted-foreground">
              {progress === 100
                ? "Du hast den Kurs abgeschlossen und dein Zertifikat erhalten."
                : "Schließe alle Lektionen ab und bestehe die Abschlussprüfung."}
            </p>
          </div>
        </div>
      )}

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
                  {/* Unsectioned lessons */}
                  {mod.lessons.filter(l => !l.sectionId).map((lesson) => {
                    const isDraft = lesson.status === "draft";
                    const isDisabled = lesson.locked || isDraft;
                    return (
                    <button
                      key={lesson.id}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && onOpenLesson(lesson.id)}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                        isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary/20"
                      }`}
                    >
                      {isDraft ? (
                        <Clock className="h-4 w-4 text-warning shrink-0" />
                      ) : lesson.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      ) : lesson.locked ? (
                        <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <Play className="h-4 w-4 text-primary shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm block ${isDraft ? "text-muted-foreground italic" : lesson.completed ? "text-muted-foreground" : "text-foreground"}`}>
                          {lesson.title}
                        </span>
                        {isDraft ? (
                          <span className="text-[11px] text-warning font-medium block mt-0.5">Bald verfügbar</span>
                        ) : lesson.description ? (
                          <span className="text-[11px] text-muted-foreground block mt-0.5 line-clamp-1">{lesson.description}</span>
                        ) : null}
                      </div>
                      {isDraft ? (
                        <Badge variant="outline" className="text-[10px] text-warning border-warning/30 shrink-0">Bald verfügbar</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground shrink-0">{lesson.duration}</span>
                      )}
                    </button>
                    );
                  })}
                  {/* Sections with their lessons */}
                  {(mod.sections || []).map((section) => {
                    const sectionLessons = mod.lessons.filter(l => l.sectionId === section.id);
                    return (
                      <div key={section.id}>
                        <div className="px-5 py-2 bg-accent/20 border-t border-border/40">
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{section.title}</p>
                          {section.description && <p className="text-[10px] text-muted-foreground">{section.description}</p>}
                        </div>
                        {sectionLessons.map((lesson) => {
                          const isDraft = lesson.status === "draft";
                          const isDisabled = lesson.locked || isDraft;
                          return (
                          <button
                            key={lesson.id}
                            disabled={isDisabled}
                            onClick={() => !isDisabled && onOpenLesson(lesson.id)}
                            className={`w-full flex items-center gap-3 px-5 pl-8 py-3 text-left transition-colors ${
                              isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary/20"
                            }`}
                          >
                            {isDraft ? (
                              <Clock className="h-4 w-4 text-warning shrink-0" />
                            ) : lesson.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                            ) : lesson.locked ? (
                              <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                            ) : (
                              <Play className="h-4 w-4 text-primary shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <span className={`text-sm block ${isDraft ? "text-muted-foreground italic" : lesson.completed ? "text-muted-foreground" : "text-foreground"}`}>
                                {lesson.title}
                              </span>
                              {isDraft ? (
                                <span className="text-[11px] text-warning font-medium block mt-0.5">Bald verfügbar</span>
                              ) : lesson.description ? (
                                <span className="text-[11px] text-muted-foreground block mt-0.5 line-clamp-1">{lesson.description}</span>
                              ) : null}
                            </div>
                            {isDraft ? (
                              <Badge variant="outline" className="text-[10px] text-warning border-warning/30 shrink-0">Bald verfügbar</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground shrink-0">{lesson.duration}</span>
                            )}
                          </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Academy Page ──
export default function Academy() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const { currentRoleId } = useUserRole();

  // Role-based edit permissions
  const isAdmin = currentRoleId === "admin";
  const isVertriebsleiter = currentRoleId === "vertriebsleiter";
  const isHR = currentRoleId === "hr";
  const canManage = isAdmin || isVertriebsleiter || isHR;

  const canEditCourse = (courseId: string) => {
    if (isAdmin || isVertriebsleiter) return true;
    if (isHR) return courseId === "backoffice-onboarding";
    return false;
  };

  const course = courses.find((c) => c.id === selectedCourse);
  const editingCourse = editingCourseId ? courses.find((c) => c.id === editingCourseId) : null;
  const allLessons = course ? course.modules.flatMap((m) => m.lessons) : [];
  const activeLesson = activeLessonId ? allLessons.find((l) => l.id === activeLessonId) : null;
  const currentIndex = activeLesson ? allLessons.indexOf(activeLesson) : -1;

  const totalLessons = courses.reduce((s, c) => s + c.modules.reduce((s2, m) => s2 + m.lessons.length, 0), 0);
  const completedLessons = courses.reduce((s, c) => s + c.modules.reduce((s2, m) => s2 + m.lessons.filter((l) => l.completed).length, 0), 0);
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  const handleSaveCourse = (updated: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditingCourseId(null);
  };

  const markLessonCompleted = (lessonId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        const allFlat = c.modules.flatMap((m) => m.lessons);
        const idx = allFlat.findIndex((l) => l.id === lessonId);
        if (idx === -1) return c;
        const nextLessonId = idx < allFlat.length - 1 ? allFlat[idx + 1].id : null;
        return {
          ...c,
          modules: c.modules.map((m) => ({
            ...m,
            lessons: m.lessons.map((l) => {
              if (l.id === lessonId) return { ...l, completed: true };
              if (nextLessonId && l.id === nextLessonId) return { ...l, locked: false };
              return l;
            }),
          })),
        };
      })
    );
  };

  const handleCreateCourse = () => {
    const newCourse: Course = {
      id: `course-${Math.random().toString(36).slice(2, 10)}`,
      title: "Neuer Kurs",
      description: "Beschreibung hinzufügen…",
      thumbnail: "📚",
      category: "Vertrieb",
      totalDuration: "0h 0min",
      modules: [],
    };
    setCourses((prev) => [...prev, newCourse]);
    setEditingCourseId(newCourse.id);
    toast.success("Neuer Kurs erstellt");
  };

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in min-h-screen dashboard-mesh-bg">
        <div className="max-w-5xl space-y-5">
          {/* Header – hidden when in lesson player or editor */}
          {!activeLessonId && !editingCourseId && (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-10 h-1 rounded-full gradient-brand" />
                </div>
                <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Academy</h1>
                <p className="text-sm text-muted-foreground mt-1">Deine Lernplattform – Kurse, Lektionen & Zertifikate</p>
              </div>
              {canManage && (isAdmin || isVertriebsleiter) && (
                <Button size="sm" className="text-xs gap-1 gradient-brand border-0 text-white" onClick={handleCreateCourse}>
                  <Plus className="h-3.5 w-3.5" /> Neuen Kurs erstellen
                </Button>
              )}
            </div>
          )}

          {/* 4 views: editor > lesson player > course detail > course list */}
          {editingCourse ? (
            <CourseEditor
              course={editingCourse}
              onBack={() => setEditingCourseId(null)}
              onSaveCourse={handleSaveCourse}
            />
          ) : activeLesson && course ? (
            <LessonPlayer
              lesson={activeLesson}
              course={course}
              allLessons={allLessons}
              currentIndex={currentIndex}
              onBack={() => setActiveLessonId(null)}
              onNavigate={(id) => setActiveLessonId(id)}
              onComplete={markLessonCompleted}
            />
          ) : course ? (
            <CourseDetail
              course={course}
              onBack={() => setSelectedCourse(null)}
              onOpenLesson={(id) => setActiveLessonId(id)}
              canEdit={canEditCourse(course.id)}
              onEdit={() => setEditingCourseId(course.id)}
            />
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-card rounded-xl p-4 text-center">
                  <GraduationCap className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-display font-bold text-foreground">{courses.length}</p>
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
                {courses.map((c) => (
                  <CourseCard
                    key={c.id}
                    course={c}
                    onSelect={() => setSelectedCourse(c.id)}
                    canEdit={canEditCourse(c.id)}
                    onEdit={() => setEditingCourseId(c.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </CRMLayout>
  );
}
