import { useState } from "react";
import { FileText, ChevronDown, ChevronRight, CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Script step types ──
export interface ScriptStep {
  id: string;
  type: "intro" | "question" | "info" | "objection" | "closing";
  title: string;
  text: string;           // The script text / prompt
  noteLabel?: string;     // Label for the note field (if present)
  options?: string[];     // Multiple-choice answers (optional)
}

export interface ScriptStepResult {
  stepId: string;
  selectedOption?: string;
  note: string;
}

// ── B2C Script ──
export const B2C_SCRIPT: ScriptStep[] = [
  {
    id: "b2c_intro",
    type: "intro",
    title: "Begrüßung",
    text: "Guten Tag, mein Name ist [Name] von Imondu. Ich rufe an, weil Sie sich über unser Portal für eine kostenlose Immobilienbewertung interessiert haben. Haben Sie kurz Zeit?",
    noteLabel: "Reaktion des Eigentümers",
  },
  {
    id: "b2c_qualify",
    type: "question",
    title: "Qualifizierung – Verkaufsabsicht",
    text: "Darf ich fragen, aus welchem Grund Sie sich für eine Bewertung interessieren? Planen Sie einen Verkauf oder geht es erstmal um eine Einschätzung?",
    options: ["Verkauf geplant", "Nur Einschätzung", "Erbschaft/Scheidung", "Refinanzierung", "Sonstiges"],
    noteLabel: "Details zur Verkaufsabsicht",
  },
  {
    id: "b2c_timeline",
    type: "question",
    title: "Zeitrahmen",
    text: "In welchem Zeitrahmen denken Sie über einen Verkauf nach?",
    options: ["Sofort / < 3 Monate", "3–6 Monate", "6–12 Monate", "Kein konkreter Zeitplan"],
    noteLabel: "Kommentar zum Zeitrahmen",
  },
  {
    id: "b2c_object",
    type: "question",
    title: "Objektdetails",
    text: "Um Ihnen eine möglichst genaue Einschätzung zu geben: Können Sie mir kurz etwas über die Immobilie erzählen? Typ, ungefähre Größe, Baujahr?",
    noteLabel: "Objektbeschreibung (Typ, Größe, Baujahr, Zustand)",
  },
  {
    id: "b2c_renovation",
    type: "question",
    title: "Sanierungsstatus",
    text: "Wurde in den letzten Jahren etwas an der Immobilie saniert oder modernisiert?",
    options: ["Vollsaniert", "Teilsaniert", "Unsaniert", "Neubau"],
    noteLabel: "Sanierungsdetails",
  },
  {
    id: "b2c_competition",
    type: "question",
    title: "Makler / Konkurrenz",
    text: "Haben Sie bereits mit einem Makler gesprochen oder gibt es schon eine Bewertung?",
    options: ["Kein Makler", "Makler angefragt", "Maklervertrag vorhanden", "Eigene Bewertung"],
    noteLabel: "Details zum Wettbewerb",
  },
  {
    id: "b2c_objection",
    type: "objection",
    title: "Einwandbehandlung",
    text: 'Falls der Eigentümer zögert:\n\u2022 "Ich möchte erst mal nur schauen" \u2192 "Absolut verständlich. Unsere kostenlose Bewertung ist unverbindlich und gibt Ihnen eine solide Grundlage."\n\u2022 "Ich habe schon einen Makler" \u2192 "Kein Problem. Eine zweite Einschätzung schadet nie und ist bei uns kostenlos."\n\u2022 "Ich habe keine Zeit" \u2192 "Ich verstehe. Wann würde es Ihnen besser passen? Ich rufe gerne nochmal an."',
    noteLabel: "Einwand & Antwort",
  },
  {
    id: "b2c_appointment",
    type: "closing",
    title: "Terminvereinbarung",
    text: "Wunderbar! Dann würde ich Ihnen gerne einen kostenlosen Vor-Ort-Termin mit einem unserer Berater anbieten. Wann würde es Ihnen passen – eher unter der Woche oder am Wochenende?",
    noteLabel: "Vereinbarter Termin (Datum, Uhrzeit)",
  },
  {
    id: "b2c_closing",
    type: "closing",
    title: "Verabschiedung",
    text: "Vielen Dank für das Gespräch, [Name]! Sie erhalten in Kürze eine Bestätigung per E-Mail. Ich wünsche Ihnen einen schönen Tag!",
    noteLabel: "Abschluss-Kommentar",
  },
];

// ── B2B Script ──
export const B2B_SCRIPT: ScriptStep[] = [
  {
    id: "b2b_intro",
    type: "intro",
    title: "Begrüßung",
    text: "Guten Tag, mein Name ist [Name] von Imondu. Wir sind eine Plattform, die Handwerksbetriebe mit qualifizierten Aufträgen aus dem Immobilienbereich verbindet. Ich würde Ihnen gerne kurz erklären, wie Sie davon profitieren können. Haben Sie zwei Minuten?",
    noteLabel: "Reaktion des Ansprechpartners",
  },
  {
    id: "b2b_qualify_company",
    type: "question",
    title: "Unternehmensprofil",
    text: "Bevor ich Ihnen unser Modell erkläre – können Sie mir kurz sagen, welche Gewerke Sie hauptsächlich abdecken und wie viele Mitarbeiter Sie haben?",
    options: ["1–5 MA", "6–20 MA", "21–50 MA", "50+ MA"],
    noteLabel: "Gewerke & Unternehmensdetails",
  },
  {
    id: "b2b_current_situation",
    type: "question",
    title: "Aktuelle Auftragslage",
    text: "Wie sieht Ihre aktuelle Auftragslage aus? Suchen Sie aktiv nach neuen Aufträgen oder sind Sie gut ausgelastet?",
    options: ["Sucht aktiv Aufträge", "Teilweise ausgelastet", "Gut ausgelastet", "Überausgelastet"],
    noteLabel: "Details zur Auftragslage",
  },
  {
    id: "b2b_pain_points",
    type: "question",
    title: "Herausforderungen",
    text: "Was sind aktuell Ihre größten Herausforderungen bei der Kundengewinnung?",
    options: ["Zu wenig Leads", "Qualität der Leads", "Zeitaufwand Akquise", "Preisdruck", "Fachkräftemangel"],
    noteLabel: "Genannte Probleme",
  },
  {
    id: "b2b_pitch",
    type: "info",
    title: "Imondu-Vorstellung",
    text: "Genau da setzen wir an! Mit Imondu erhalten Sie:\n\n✓ **Qualifizierte Leads** direkt aus Ihrer Region\n✓ **Exklusive Aufträge** – kein Wettbewerb mit 10 anderen Betrieben\n✓ **Digitales Profil** – Ihre Referenzen professionell präsentiert\n✓ **Planbare Auftragslage** – monatlich neue Anfragen\n\nDas Ganze für eine Mitgliedschaft von 1.250 € / Jahr.",
    noteLabel: "Reaktion auf Pitch",
  },
  {
    id: "b2b_objection",
    type: "objection",
    title: "Einwandbehandlung",
    text: 'Häufige Einwände:\n\u2022 "Zu teuer" \u2192 "Rechnen wir mal: Ein einziger gewonnener Auftrag über uns deckt den Jahresbeitrag bereits ab."\n\u2022 "Haben schon genug Aufträge" \u2192 "Verstehe ich. Viele unserer Partner nutzen uns gezielt für die Wintermonate oder für neue Gewerke."\n\u2022 "Muss ich mir überlegen" \u2192 "Selbstverständlich! Darf ich Ihnen eine Info-Mappe schicken und nächste Woche nochmal anrufen?"',
    noteLabel: "Einwand & Reaktion",
  },
  {
    id: "b2b_demo",
    type: "closing",
    title: "Demo / Präsentation vereinbaren",
    text: "Ich würde Ihnen gerne in einer kurzen 15-Minuten-Demo zeigen, wie unser Portal funktioniert und welche Aufträge in Ihrer Region verfügbar sind. Wann passt es Ihnen – eher Anfang oder Ende der Woche?",
    noteLabel: "Vereinbarter Demo-Termin",
  },
  {
    id: "b2b_closing",
    type: "closing",
    title: "Verabschiedung",
    text: "Vielen Dank für das Gespräch! Ich schicke Ihnen gleich eine E-Mail mit allen Informationen und der Terminbestätigung. Bei Fragen erreichen Sie mich jederzeit. Einen schönen Tag noch!",
    noteLabel: "Abschluss-Kommentar",
  },
];

// ── Step type styles ──
const stepTypeStyles: Record<string, { label: string; color: string; bg: string }> = {
  intro: { label: "Einleitung", color: "text-primary", bg: "bg-primary/10" },
  question: { label: "Frage", color: "text-[hsl(var(--info))]", bg: "bg-[hsl(var(--info))]/10" },
  info: { label: "Info", color: "text-[hsl(var(--success))]", bg: "bg-[hsl(var(--success))]/10" },
  objection: { label: "Einwand", color: "text-[hsl(var(--warning))]", bg: "bg-[hsl(var(--warning))]/10" },
  closing: { label: "Abschluss", color: "text-destructive", bg: "bg-destructive/10" },
};

// ── Component ──
interface CallScriptProps {
  type: "b2c" | "b2b";
  contactName: string;
  onSave: (results: ScriptStepResult[]) => void;
}

export default function CallScript({ type, contactName, onSave }: CallScriptProps) {
  const script = type === "b2c" ? B2C_SCRIPT : B2B_SCRIPT;
  const [results, setResults] = useState<Record<string, ScriptStepResult>>({});
  const [expandedStep, setExpandedStep] = useState<string>(script[0]?.id || "");
  const [saved, setSaved] = useState(false);

  const updateResult = (stepId: string, partial: Partial<ScriptStepResult>) => {
    setResults((prev) => ({
      ...prev,
      [stepId]: { stepId, note: "", ...prev[stepId], ...partial },
    }));
  };

  const isStepDone = (stepId: string) => {
    const r = results[stepId];
    return r && (r.note.trim() !== "" || r.selectedOption);
  };

  const completedCount = script.filter((s) => isStepDone(s.id)).length;
  const progress = Math.round((completedCount / script.length) * 100);

  const handleSave = () => {
    const resultList = script.map((s) => results[s.id] || { stepId: s.id, note: "" });
    onSave(resultList);
    setSaved(true);
  };

  const goToNext = (currentId: string) => {
    const idx = script.findIndex((s) => s.id === currentId);
    if (idx < script.length - 1) {
      setExpandedStep(script[idx + 1].id);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-crm-sm border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-secondary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-display font-semibold text-foreground">
              Gesprächsskript – {type === "b2c" ? "Eigentümer (B2C)" : "Partner (B2B)"}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground">{completedCount}/{script.length} Schritte</span>
            <div className="w-20 h-1.5 rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full gradient-brand transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Kontakt: <strong className="text-foreground">{contactName}</strong></p>
      </div>

      {/* Steps */}
      <div className="divide-y divide-border/50">
        {script.map((step, idx) => {
          const isOpen = expandedStep === step.id;
          const done = isStepDone(step.id);
          const style = stepTypeStyles[step.type];
          const result = results[step.id];

          return (
            <div key={step.id} className={isOpen ? "bg-background" : ""}>
              {/* Step Header */}
              <button
                onClick={() => setExpandedStep(isOpen ? "" : step.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors"
              >
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  done ? "bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]" : "bg-secondary text-muted-foreground"
                }`}>
                  {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                </div>
                <div className="flex-1 text-left">
                  <span className="text-xs font-medium text-foreground">{step.title}</span>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${style.bg} ${style.color}`}>
                  {style.label}
                </span>
                {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
              </button>

              {/* Step Content */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Script text */}
                  <div className="p-3 rounded-lg bg-primary/[0.03] border border-primary/10 text-sm text-foreground whitespace-pre-line leading-relaxed">
                    {step.text}
                  </div>

                  {/* Options */}
                  {step.options && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Antwort auswählen</p>
                      <div className="flex flex-wrap gap-1.5">
                        {step.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => updateResult(step.id, { selectedOption: opt })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              result?.selectedOption === opt
                                ? "gradient-brand text-primary-foreground border-transparent shadow-crm-sm"
                                : "border-border text-foreground hover:bg-secondary/50"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Note field */}
                  {step.noteLabel && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{step.noteLabel}</p>
                      <textarea
                        value={result?.note || ""}
                        onChange={(e) => updateResult(step.id, { note: e.target.value })}
                        placeholder="Notiz eingeben..."
                        className="w-full h-16 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>
                  )}

                  {/* Next button */}
                  {idx < script.length - 1 && (
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => goToNext(step.id)}>
                        Weiter →
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save */}
      <div className="p-4 border-t border-border bg-secondary/20 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {saved ? (
            <span className="text-[hsl(var(--success))] font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Skript gespeichert & dem Kunden zugeordnet
            </span>
          ) : (
            "Skript wird nach Speichern dem Kundenprofil unter Aktivitäten zugeordnet"
          )}
        </p>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saved}
          className="gradient-brand border-0 text-white"
        >
          <Save className="h-3.5 w-3.5 mr-1.5" />
          {saved ? "Gespeichert" : "Skript speichern"}
        </Button>
      </div>
    </div>
  );
}
