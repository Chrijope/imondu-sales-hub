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
import { RotateCcw, Copy, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BAUKOSTEN_OPTIONS = [
  { value: "2500", label: "Neubau ohne TG (2.500 €/qm)" },
  { value: "3000", label: "Neubau mit TG (3.000 €/qm)" },
];

const DECISION_QUESTIONS = [
  "Baurecht gesichert?",
  "Erzielbarer Verkaufspreis realistisch?",
  "Baukosten valide kalkuliert?",
  "Projektmarge ausreichend?",
  "Kapital & Zeit realistisch darstellbar?",
  "Persönliches Risikoprofil passt?",
];

type DecisionAnswer = "none" | "ja" | "unsicher" | "nein";

function fmt(n: number) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(n);
}

function fmtDec(n: number) {
  return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);
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

export default function RechnerGrundstueck() {
  const { toast } = useToast();

  const [grundstueckspreis, setGrundstueckspreis] = useState("");
  const [grundstuecksflaeche, setGrundstuecksflaeche] = useState("");
  const [grz, setGrz] = useState("");
  const [gfz, setGfz] = useState("");
  const [verkaufQmPreis, setVerkaufQmPreis] = useState("");
  const [baukosten, setBaukosten] = useState("");
  const [kaufnebenkosten, setKaufnebenkosten] = useState("10");
  const [sicherheitspuffer, setSicherheitspuffer] = useState("3");

  const [decisions, setDecisions] = useState<DecisionAnswer[]>(Array(6).fill("none"));
  const setDecision = (idx: number, val: DecisionAnswer) => {
    setDecisions((prev) => { const n = [...prev]; n[idx] = val; return n; });
  };

  const calc = useMemo(() => {
    const gp = parseFloat(grundstueckspreis) || 0;
    const gf = parseFloat(grundstuecksflaeche) || 0;
    const gfzVal = parseFloat(gfz) || 0;
    const vqm = parseFloat(verkaufQmPreis) || 0;
    const bkQm = parseFloat(baukosten) || 0;
    const knkPct = parseFloat(kaufnebenkosten) || 0;
    const spPct = parseFloat(sicherheitspuffer) || 0;

    const bgf = gf * gfzVal;
    const verkaufbareFlaeche = bgf * 0.8;
    const zielwert = verkaufbareFlaeche * vqm;
    const baukostenGesamt = bkQm * bgf;
    const kaufnebenkostenEur = gp * (knkPct / 100);
    const zwischensumme = gp + baukostenGesamt + kaufnebenkostenEur;
    const sicherheitspufferEur = zwischensumme * (spPct / 100);
    const gesamtkosten = zwischensumme + sicherheitspufferEur;

    const projektgewinn = zielwert - gesamtkosten;
    const projektmarge = zielwert > 0 ? (projektgewinn / zielwert) * 100 : 0;
    const gewinnQm = verkaufbareFlaeche > 0 ? projektgewinn / verkaufbareFlaeche : 0;

    let ampel: "green" | "yellow" | "red" | "gray" = "gray";
    if (gp > 0 && gf > 0 && gfzVal > 0 && vqm > 0) {
      if (projektmarge >= 20) ampel = "green";
      else if (projektmarge >= 15) ampel = "yellow";
      else ampel = "red";
    }

    return { bgf, verkaufbareFlaeche, zielwert, baukostenGesamt, kaufnebenkostenEur, zwischensumme, sicherheitspufferEur, gesamtkosten, projektgewinn, projektmarge, gewinnQm, ampel };
  }, [grundstueckspreis, grundstuecksflaeche, gfz, verkaufQmPreis, baukosten, kaufnebenkosten, sicherheitspuffer]);

  const decisionAmpel = useMemo(() => {
    const answered = decisions.filter((d) => d !== "none");
    if (answered.length < 6) return "gray" as const;
    if (decisions.some((d) => d === "nein")) return "red" as const;
    const jaCount = decisions.filter((d) => d === "ja").length;
    const unsicherCount = decisions.filter((d) => d === "unsicher").length;
    if (jaCount === 6 || (jaCount === 5 && unsicherCount === 1)) return "green" as const;
    return "yellow" as const;
  }, [decisions]);

  const decisionLabel = { gray: "Bitte alle Fragen beantworten", green: "MACHEN", yellow: "PRÜFEN", red: "LASSEN" };

  const reset = () => {
    setGrundstueckspreis(""); setGrundstuecksflaeche(""); setGrz(""); setGfz("");
    setVerkaufQmPreis(""); setBaukosten(""); setKaufnebenkosten("10"); setSicherheitspuffer("3");
    setDecisions(Array(6).fill("none"));
  };

  const copyValues = () => {
    const text = `ENTWICKLUNGS-CHECK Grundstück\n` +
      `Grundstückspreis: ${fmt(parseFloat(grundstueckspreis) || 0)} €\n` +
      `Grundstücksfläche: ${grundstuecksflaeche} qm\n` +
      `GFZ: ${gfz}\n` +
      `Verkaufbarer qm-Preis: ${fmt(parseFloat(verkaufQmPreis) || 0)} €\n` +
      `Gesamtkosten: ${fmt(calc.gesamtkosten)} €\n` +
      `Projektgewinn: ${fmt(calc.projektgewinn)} €\n` +
      `Projektmarge: ${fmtDec(calc.projektmarge)} %`;
    navigator.clipboard.writeText(text);
    toast({ title: "Kopiert ✓", description: "Zusammenfassung in die Zwischenablage kopiert." });
  };

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
       <div className="max-w-7xl">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-2">Entwicklungsrechner</Badge>
          <h1 className="text-2xl font-display font-bold text-foreground">Entwicklungs-Check Grundstück</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-lg mx-auto">
            Dieser Rechner hilft dir in 2 Minuten zu entscheiden, ob sich die Entwicklung dieses Grundstücks wirtschaftlich lohnt.
          </p>
        </div>

        <p className="text-[11px] text-muted-foreground text-center mb-6 flex items-center justify-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          Eingaben ausfüllen → Berechnung &amp; Ampeln aktualisieren automatisch
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Eingaben & Berechnung */}
          <div className="lg:col-span-1 space-y-5">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="gradient-brand px-4 py-2.5">
                <h2 className="text-sm font-bold text-primary-foreground tracking-wide">EINGABEN & BERECHNUNG</h2>
              </div>
              <div className="p-5 space-y-4">
                <NumField label="Grundstückspreis (€)" value={grundstueckspreis} onChange={setGrundstueckspreis} hint="Manuell ausfüllen" />
                <NumField label="Grundstücksfläche (qm)" value={grundstuecksflaeche} onChange={setGrundstuecksflaeche} hint="Manuell ausfüllen" />
                <NumField label="Grundstücksflächenzahl (GRZ)" value={grz} onChange={setGrz} hint="Optional (derzeit informativ)" />
                <NumField label="Geschossflächenzahl (GFZ)" value={gfz} onChange={setGfz} hint="Entscheidend für die BGF" />
                <NumField label="Verkaufbarer qm-Preis (€)" value={verkaufQmPreis} onChange={setVerkaufQmPreis} hint="Umsatzfläche × Preis" />

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Baukosten €/qm</Label>
                  <Select value={baukosten} onValueChange={setBaukosten}>
                    <SelectTrigger><SelectValue placeholder="Bitte wählen" /></SelectTrigger>
                    <SelectContent>
                      {BAUKOSTEN_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground">Dropdown auswählen</p>
                </div>

                <ReadOnlyField label="Baukosten €/qm (automatisch)" value={baukosten ? `${baukosten} €` : "–"} />

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Kaufnebenkosten (%)</Label>
                  <Input type="number" value={kaufnebenkosten} onChange={(e) => setKaufnebenkosten(e.target.value)} />
                  <p className="text-[10px] text-muted-foreground">Standard 10 %</p>
                </div>

                <NumField label="Sicherheitspuffer (%)" value={sicherheitspuffer} onChange={setSicherheitspuffer} hint="Standard 3 %" />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="bg-muted/50 px-4 py-2.5">
                <h2 className="text-sm font-bold text-foreground tracking-wide">BERECHNUNGEN</h2>
              </div>
              <div className="p-5 space-y-2">
                <CalcRow label="Bruttogeschossfläche (BGF)" value={`${fmtDec(calc.bgf)} qm`} />
                <CalcRow label="Verkaufbare Wohnfläche" value={`${fmtDec(calc.verkaufbareFlaeche)} qm`} />
                <CalcRow label="Zielwert Projekt (Exit)" value={`${fmt(calc.zielwert)} €`} />
                <CalcRow label="Baukosten gesamt" value={`${fmt(calc.baukostenGesamt)} €`} />
                <CalcRow label="Kaufnebenkosten €" value={`${fmt(calc.kaufnebenkostenEur)} €`} />
                <CalcRow label="Zwischensumme Kosten" value={`${fmt(calc.zwischensumme)} €`} />
                <CalcRow label="Sicherheitspuffer €" value={`${fmt(calc.sicherheitspufferEur)} €`} />
                <hr className="border-border" />
                <CalcRow label="Gesamtkosten Projekt" value={`${fmt(calc.gesamtkosten)} €`} bold />
              </div>
            </div>
          </div>

          {/* CENTER: Ergebnis */}
          <div className="lg:col-span-1 space-y-5">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="bg-muted/50 px-4 py-2.5">
                <h2 className="text-sm font-bold text-foreground">ERGEBNIS IM FOKUS</h2>
              </div>
              <div className="p-6 text-center space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Projektgewinn (Brutto)</p>
                  <p className={`text-3xl font-display font-bold ${calc.projektgewinn > 0 ? "text-emerald-600" : calc.projektgewinn < 0 ? "text-red-500" : "text-foreground"}`}>
                    {fmt(calc.projektgewinn)} €
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Projektmarge</p>
                  <p className="text-xl font-bold text-foreground">{fmtDec(calc.projektmarge)} %</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Gewinn €/qm</p>
                  <p className="text-xl font-bold text-foreground">{fmt(calc.gewinnQm)} €</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Exit (Projektumsatz)</p>
                  <p className="text-lg font-bold text-foreground">{fmt(calc.zielwert)} €</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <p className="text-xs font-bold text-foreground">Ergebnis-Ampel</p>
              <p className="text-[10px] text-muted-foreground">Basierend ausschließlich auf der <strong>Projektmarge</strong>.</p>
              <div className="flex items-center justify-center">
                <TrafficLight color={calc.ampel} />
              </div>
              <p className={`text-center text-sm font-bold ${calc.ampel === "green" ? "text-emerald-600" : calc.ampel === "yellow" ? "text-amber-500" : calc.ampel === "red" ? "text-red-500" : "text-muted-foreground"}`}>
                {calc.ampel === "green" ? "MACHEN" : calc.ampel === "yellow" ? "PRÜFEN" : calc.ampel === "red" ? "LASSEN" : "Noch offen"}
              </p>
              <div className="text-[10px] text-muted-foreground space-y-1">
                <p>🟢 <strong>Grün</strong>, ab 20 % Projektmarge</p>
                <p>🟡 <strong>Orange</strong>, zwischen 15–19 %</p>
                <p>🔴 <strong>Rot</strong>, kleiner als 14 %</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={reset} className="flex-1 gap-2">
                <RotateCcw className="h-4 w-4" /> Zurücksetzen
              </Button>
              <Button onClick={copyValues} className="flex-1 gap-2 gradient-brand border-0 text-primary-foreground">
                <Copy className="h-4 w-4" /> Werte kopieren
              </Button>
            </div>
          </div>

          {/* RIGHT: Entscheidungs-Check */}
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
                        <SelectItem value="unsicher">Unsicher</SelectItem>
                        <SelectItem value="nein">Nein</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <p className="text-xs font-bold text-foreground">Entscheidungsampel (Check)</p>
              <div className="flex items-center justify-center">
                <TrafficLight color={decisionAmpel} />
              </div>
              <p className={`text-center text-sm font-bold ${decisionAmpel === "green" ? "text-emerald-600" : decisionAmpel === "yellow" ? "text-amber-500" : decisionAmpel === "red" ? "text-red-500" : "text-muted-foreground"}`}>
                {decisionLabel[decisionAmpel]}
              </p>
              <div className="text-[10px] text-muted-foreground space-y-1">
                <p>🟢 <strong>Grün</strong>, wenn 6× Ja oder 5× Ja + 1× Unsicher</p>
                <p>🟡 <strong>Orange</strong>, wenn mindestens 1× Unsicher (aber nicht grün)</p>
                <p>🔴 <strong>Rot</strong>, sobald mindestens 1× Nein gesetzt ist</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </CRMLayout>
  );
}

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

function CalcRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between text-xs ${bold ? "font-bold text-foreground text-sm" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={bold ? "" : "text-foreground font-medium"}>{value}</span>
    </div>
  );
}
