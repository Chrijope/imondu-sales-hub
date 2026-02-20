import { useState, useMemo } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RotateCcw,
  Copy,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ── Sanierungsoptionen ──
const SANIERUNG_OPTIONS = [
  { value: "500", label: "Einfache Sanierung innen (500 €/qm)" },
  { value: "750", label: "Hochwertige Sanierung innen (750 €/qm)" },
  { value: "1000", label: "Komplettsanierung Wohnung (1.000 €/qm)" },
];

// ── Entscheidungs-Check Optionen ──
const DECISION_QUESTIONS = [
  "Lage passt?",
  "Vergleichspreise realistisch?",
  "Exit klar?",
  "Bauch sagt Ja?",
];

type DecisionAnswer = "none" | "ja" | "nein";

function fmt(n: number) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(n);
}

function TrafficLight({ color }: { color: "green" | "yellow" | "red" | "gray" }) {
  const colors = {
    green: "bg-emerald-500 shadow-emerald-500/40",
    yellow: "bg-amber-400 shadow-amber-400/40",
    red: "bg-red-500 shadow-red-500/40",
    gray: "bg-muted-foreground/30",
  };
  return (
    <div className="flex items-center gap-2">
      {(["red", "yellow", "green"] as const).map((c) => (
        <div
          key={c}
          className={`h-5 w-5 rounded-full transition-all ${c === color ? `${colors[c]} shadow-lg` : "bg-muted/60"}`}
        />
      ))}
    </div>
  );
}

export default function RechnerWohnung() {
  const { toast } = useToast();

  // ── Inputs ──
  const [kaufpreis, setKaufpreis] = useState("");
  const [wohnflaeche, setWohnflaeche] = useState("");
  const [zielQmPreis, setZielQmPreis] = useState("");
  const [sanierung, setSanierung] = useState("");
  const [kaufnebenkosten, setKaufnebenkosten] = useState("10");
  const [sicherheitspuffer, setSicherheitspuffer] = useState("5");

  // ── Decision Check ──
  const [decisions, setDecisions] = useState<DecisionAnswer[]>(["none", "none", "none", "none"]);

  const setDecision = (idx: number, val: DecisionAnswer) => {
    setDecisions((prev) => { const n = [...prev]; n[idx] = val; return n; });
  };

  // ── Calculations ──
  const calc = useMemo(() => {
    const kp = parseFloat(kaufpreis) || 0;
    const wf = parseFloat(wohnflaeche) || 0;
    const zqm = parseFloat(zielQmPreis) || 0;
    const sanQm = parseFloat(sanierung) || 0;
    const knkPct = parseFloat(kaufnebenkosten) || 0;
    const spPct = parseFloat(sicherheitspuffer) || 0;

    const kaufQmPreis = wf > 0 ? kp / wf : 0;
    const qmHebel = zqm - kaufQmPreis;
    const zielwert = zqm * wf;
    const sanierungGesamt = sanQm * wf;
    const kaufnebenkostenEur = kp * (knkPct / 100);
    const zwischensumme = kp + sanierungGesamt + kaufnebenkostenEur;
    const sicherheitspufferEur = zwischensumme * (spPct / 100);
    const gesamtkosten = zwischensumme + sicherheitspufferEur;
    const nettoPotenzial = zielwert - gesamtkosten;
    const potenzialQm = wf > 0 ? nettoPotenzial / wf : 0;

    let ampel: "green" | "yellow" | "red" | "gray" = "gray";
    if (kp > 0 && wf > 0 && zqm > 0) {
      if (nettoPotenzial >= 25000) ampel = "green";
      else if (nettoPotenzial >= 10000) ampel = "yellow";
      else ampel = "red";
    }

    return { kaufQmPreis, qmHebel, zielwert, sanierungGesamt, kaufnebenkostenEur, zwischensumme, sicherheitspufferEur, gesamtkosten, nettoPotenzial, potenzialQm, ampel };
  }, [kaufpreis, wohnflaeche, zielQmPreis, sanierung, kaufnebenkosten, sicherheitspuffer]);

  // ── Decision Ampel ──
  const decisionAmpel = useMemo(() => {
    const answered = decisions.filter((d) => d !== "none");
    if (answered.length < 4) return "gray" as const;
    const jaCount = decisions.filter((d) => d === "ja").length;
    if (jaCount === 4) return "green" as const;
    if (jaCount >= 2) return "yellow" as const;
    return "red" as const;
  }, [decisions]);

  const decisionLabel = {
    gray: "Bitte alle Fragen beantworten",
    green: "MACHEN",
    yellow: "PRÜFEN",
    red: "LASSEN",
  };

  const reset = () => {
    setKaufpreis(""); setWohnflaeche(""); setZielQmPreis("");
    setSanierung(""); setKaufnebenkosten("10"); setSicherheitspuffer("5");
    setDecisions(["none", "none", "none", "none"]);
  };

  const copyValues = () => {
    const text = `ENTWICKLUNGS-CHECK Wohnung\n` +
      `Kaufpreis: ${fmt(parseFloat(kaufpreis) || 0)} €\n` +
      `Wohnfläche: ${wohnflaeche} qm\n` +
      `Ziel-QM-Preis: ${fmt(parseFloat(zielQmPreis) || 0)} €\n` +
      `Sanierung: ${sanierung} €/qm\n` +
      `Gesamtkosten: ${fmt(calc.gesamtkosten)} €\n` +
      `Netto-Potenzial: ${fmt(calc.nettoPotenzial)} €\n` +
      `Potenzial/qm: ${fmt(calc.potenzialQm)} €`;
    navigator.clipboard.writeText(text);
    toast({ title: "Kopiert ✓", description: "Zusammenfassung in die Zwischenablage kopiert." });
  };

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-2">Entwicklungsrechner</Badge>
          <h1 className="text-2xl font-display font-bold text-foreground">Entwicklungs-Check Wohnung</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-lg mx-auto">
            Dieser Rechner hilft dir in 2 Minuten zu entscheiden, ob sich die Weiterentwicklung dieser Wohnung wirtschaftlich lohnt.
          </p>
        </div>

        <p className="text-[11px] text-muted-foreground text-center mb-6 flex items-center justify-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          Eingaben ausfüllen → Berechnung &amp; Ampeln aktualisieren automatisch
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ══════════ LEFT: Eingaben & Berechnung ══════════ */}
          <div className="lg:col-span-1 space-y-5">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="gradient-brand px-4 py-2.5">
                <h2 className="text-sm font-bold text-primary-foreground tracking-wide">EINGABEN & BERECHNUNG</h2>
              </div>
              <div className="p-5 space-y-4">
                <NumField label="Kaufpreis (€)" value={kaufpreis} onChange={setKaufpreis} hint="Manuell ausfüllen" />
                <NumField label="Wohnfläche (qm)" value={wohnflaeche} onChange={setWohnflaeche} hint="Manuell ausfüllen" />
                <NumField label="Ziel-QM-Preis (€)" value={zielQmPreis} onChange={setZielQmPreis} hint="Manuell ausfüllen" />

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Sanierung (Auswahl)</Label>
                  <Select value={sanierung} onValueChange={setSanierung}>
                    <SelectTrigger><SelectValue placeholder="Bitte wählen" /></SelectTrigger>
                    <SelectContent>
                      {SANIERUNG_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ReadOnlyField label="Sanierung €/qm (automatisch)" value={sanierung ? `${sanierung} €` : "–"} />

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Kaufnebenkosten (%)</Label>
                  <Input type="number" value={kaufnebenkosten} onChange={(e) => setKaufnebenkosten(e.target.value)} />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Typisch 8–12 %: Grunderwerbsteuer (3,5–6,5 %), Notar & Grundbuch (~1,5–2,0 %), ggf. Makler (~3,57 %), ggf. Finanzierung (~0,3–0,8 %)
                  </p>
                </div>

                <NumField label="Sicherheitspuffer (%)" value={sicherheitspuffer} onChange={setSicherheitspuffer} hint="Manuell ausfüllen" />
              </div>
            </div>

            {/* Berechnungen */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="bg-muted/50 px-4 py-2.5">
                <h2 className="text-sm font-bold text-foreground tracking-wide">BERECHNUNGEN</h2>
              </div>
              <div className="p-5 space-y-2">
                <CalcRow label="Kauf-QM-Preis" value={`${fmt(calc.kaufQmPreis)} €`} />
                <CalcRow label="QM-Hebel" value={`${fmt(calc.qmHebel)} €`} highlight={calc.qmHebel > 0} />
                <CalcRow label="Zielwert Wohnung" value={`${fmt(calc.zielwert)} €`} />
                <CalcRow label="Sanierung gesamt" value={`${fmt(calc.sanierungGesamt)} €`} />
                <CalcRow label="Kaufnebenkosten €" value={`${fmt(calc.kaufnebenkostenEur)} €`} />
                <CalcRow label="Zwischensumme Kosten" value={`${fmt(calc.zwischensumme)} €`} />
                <CalcRow label="Sicherheitspuffer €" value={`${fmt(calc.sicherheitspufferEur)} €`} />
                <hr className="border-border" />
                <CalcRow label="Gesamtkosten Invest" value={`${fmt(calc.gesamtkosten)} €`} bold />
              </div>
            </div>
          </div>

          {/* ══════════ CENTER: Ergebnis ══════════ */}
          <div className="lg:col-span-1 space-y-5">
            {/* Netto-Potenzial */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="bg-muted/50 px-4 py-2.5">
                <h2 className="text-sm font-bold text-foreground">ERGEBNIS IM FOKUS</h2>
              </div>
              <div className="p-6 text-center space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Netto-Potenzial</p>
                  <p className={`text-3xl font-display font-bold ${
                    calc.nettoPotenzial > 0 ? "text-emerald-600" : calc.nettoPotenzial < 0 ? "text-red-500" : "text-foreground"
                  }`}>
                    {fmt(calc.nettoPotenzial)} €
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">vor Finanzierung & Steuern</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Potenzial €/qm</p>
                  <p className="text-xl font-bold text-foreground">{fmt(calc.potenzialQm)} €</p>
                </div>
              </div>
            </div>

            {/* Zusammensetzung */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <p className="text-xs font-bold text-foreground">So setzt sich dein Netto-Potenzial zusammen:</p>
              <div className="space-y-1.5 text-xs">
                <BreakdownRow label="Zielwert Wohnung" value={`${fmt(calc.zielwert)} €`} />
                <BreakdownRow label="− Kaufpreis" value={`${fmt(parseFloat(kaufpreis) || 0)} €`} />
                <BreakdownRow label="− Sanierung gesamt" value={`${fmt(calc.sanierungGesamt)} €`} />
                <BreakdownRow label="− Kaufnebenkosten" value={`${fmt(calc.kaufnebenkostenEur)} €`} />
                <BreakdownRow label="− Sicherheitspuffer" value={`${fmt(calc.sicherheitspufferEur)} €`} />
                <hr className="border-border" />
                <div className="flex justify-between font-bold text-foreground text-sm pt-1">
                  <span>= Netto-Potenzial</span>
                  <span>{fmt(calc.nettoPotenzial)} €</span>
                </div>
              </div>
            </div>

            {/* Potenzial-Ampel */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <p className="text-xs font-bold text-foreground">Entscheidungsampel (Potenzial)</p>
              <div className="flex items-center justify-center">
                <TrafficLight color={calc.ampel} />
              </div>
              <p className={`text-center text-sm font-bold ${
                calc.ampel === "green" ? "text-emerald-600" : calc.ampel === "yellow" ? "text-amber-500" : calc.ampel === "red" ? "text-red-500" : "text-muted-foreground"
              }`}>
                {calc.ampel === "green" ? "MACHEN" : calc.ampel === "yellow" ? "PRÜFEN" : calc.ampel === "red" ? "LASSEN" : "Noch offen"}
              </p>
              <div className="text-[10px] text-muted-foreground space-y-1">
                <p>🟢 <strong>Machen</strong>, ab 25.000 € Netto-Potenzial</p>
                <p>🟡 <strong>Prüfen</strong>, bei 10.000 – 24.999 €</p>
                <p>🔴 <strong>Lassen</strong>, unter 10.000 €</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={reset} className="flex-1 gap-2">
                <RotateCcw className="h-4 w-4" /> Zurücksetzen
              </Button>
              <Button onClick={copyValues} className="flex-1 gap-2 gradient-brand border-0 text-primary-foreground">
                <Copy className="h-4 w-4" /> Werte kopieren
              </Button>
            </div>
          </div>

          {/* ══════════ RIGHT: Entscheidungs-Check ══════════ */}
          <div className="lg:col-span-1 space-y-5">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="gradient-brand px-4 py-2.5">
                <h2 className="text-sm font-bold text-primary-foreground tracking-wide">ENTSCHEIDUNGS-CHECK</h2>
              </div>
              <div className="p-5 space-y-4">
                {DECISION_QUESTIONS.map((q, i) => (
                  <div key={q} className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">{q}</Label>
                    <Select value={decisions[i]} onValueChange={(v) => setDecision(i, v as DecisionAnswer)}>
                      <SelectTrigger><SelectValue placeholder="Bitte wählen" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Bitte wählen</SelectItem>
                        <SelectItem value="ja">Ja</SelectItem>
                        <SelectItem value="nein">Nein</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision Ampel */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <p className="text-xs font-bold text-foreground">Entscheidungsampel (Check)</p>
              <div className="flex items-center justify-center">
                <TrafficLight color={decisionAmpel} />
              </div>
              <p className={`text-center text-sm font-bold ${
                decisionAmpel === "green" ? "text-emerald-600" : decisionAmpel === "yellow" ? "text-amber-500" : decisionAmpel === "red" ? "text-red-500" : "text-muted-foreground"
              }`}>
                {decisionLabel[decisionAmpel]}
              </p>
              <div className="text-[10px] text-muted-foreground space-y-1">
                <p>🟢 <strong>Machen</strong>, wenn alle Fragen mit „Ja" beantwortet</p>
                <p>🟡 <strong>Prüfen</strong>, wenn mindestens 2 Fragen „Ja" (aber nicht alle)</p>
                <p>🔴 <strong>Lassen</strong>, wenn 3 oder 4 Fragen „Nein"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}

// ── Helper Components ──

function NumField({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder="0" />
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="px-3 py-2 rounded-md bg-muted/50 text-sm text-foreground">{value}</div>
    </div>
  );
}

function CalcRow({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex justify-between text-xs ${bold ? "font-bold text-foreground text-sm" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={highlight ? "text-emerald-600 font-semibold" : bold ? "" : "text-foreground font-medium"}>{value}</span>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}
