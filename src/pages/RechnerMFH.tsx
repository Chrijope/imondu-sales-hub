import { useState, useMemo, useCallback } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RotateCcw, Copy, Info, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SANIERUNG_OPTIONS = [
  { value: "500", label: "Einfache Sanierung innen (500 €/qm)" },
  { value: "1000", label: "Kernsanierung innen & außen (1.000 €/qm)" },
];

const DECISION_QUESTIONS = [
  "Lage passt?",
  "Vergleichspreise realistisch?",
  "Exit klar?",
  "Bauch sagt Ja?",
];

type DecisionAnswer = "none" | "ja" | "nein";

interface Wohnung {
  id: string;
  kaufpreis: string;
  wohnflaeche: string;
  zielQmPreis: string;
  sanierung: string;
  kaufnebenkosten: string;
  sicherheitspuffer: string;
  open: boolean;
}

function createWohnung(): Wohnung {
  return { id: crypto.randomUUID(), kaufpreis: "", wohnflaeche: "", zielQmPreis: "", sanierung: "", kaufnebenkosten: "10", sicherheitspuffer: "5", open: true };
}

function fmt(n: number) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(n);
}
function fmtDec(n: number) {
  return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);
}

function calcWohnung(w: Wohnung) {
  const kp = parseFloat(w.kaufpreis) || 0;
  const wf = parseFloat(w.wohnflaeche) || 0;
  const zqm = parseFloat(w.zielQmPreis) || 0;
  const sanQm = parseFloat(w.sanierung) || 0;
  const knkPct = parseFloat(w.kaufnebenkosten) || 0;
  const spPct = parseFloat(w.sicherheitspuffer) || 0;

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

  return { kp, wf, kaufQmPreis, qmHebel, zielwert, sanierungGesamt, kaufnebenkostenEur, zwischensumme, sicherheitspufferEur, gesamtkosten, nettoPotenzial, potenzialQm };
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
        <div key={c} className={`h-5 w-5 rounded-full transition-all ${c === color ? `${colors[c]} shadow-lg` : "bg-muted/60"}`} />
      ))}
    </div>
  );
}

export default function RechnerMFH() {
  const { toast } = useToast();

  const [modus, setModus] = useState<"referenz" | "einzeln">("referenz");
  const [anzahlWohnungen, setAnzahlWohnungen] = useState("1");
  const [wohnungen, setWohnungen] = useState<Wohnung[]>([createWohnung()]);
  const [eigenkapital, setEigenkapital] = useState("");
  const [zielMarge, setZielMarge] = useState("");

  const [decisions, setDecisions] = useState<DecisionAnswer[]>(["none", "none", "none", "none"]);
  const setDecision = (idx: number, val: DecisionAnswer) => {
    setDecisions((prev) => { const n = [...prev]; n[idx] = val; return n; });
  };

  const updateWohnung = useCallback((id: string, field: keyof Wohnung, value: string) => {
    setWohnungen((prev) => prev.map((w) => w.id === id ? { ...w, [field]: value } : w));
  }, []);

  const toggleOpen = useCallback((id: string) => {
    setWohnungen((prev) => prev.map((w) => w.id === id ? { ...w, open: !w.open } : w));
  }, []);

  const addWohnung = () => setWohnungen((prev) => [...prev, createWohnung()]);
  const removeWohnung = (id: string) => {
    if (wohnungen.length <= 1) return;
    setWohnungen((prev) => prev.filter((w) => w.id !== id));
  };

  const gesamt = useMemo(() => {
    const count = modus === "referenz" ? Math.max(1, parseInt(anzahlWohnungen) || 1) : wohnungen.length;
    const units = modus === "referenz" ? Array(count).fill(wohnungen[0]) : wohnungen;

    let kaufpreisGesamt = 0, zielwertGesamt = 0, sanierungGesamt = 0, knkGesamt = 0;
    let zwischensummeGesamt = 0, pufferGesamt = 0, gesamtkostenGesamt = 0;
    let potenzialGesamt = 0, wfGesamt = 0;

    units.forEach((w) => {
      const c = calcWohnung(w);
      kaufpreisGesamt += c.kp;
      zielwertGesamt += c.zielwert;
      sanierungGesamt += c.sanierungGesamt;
      knkGesamt += c.kaufnebenkostenEur;
      zwischensummeGesamt += c.zwischensumme;
      pufferGesamt += c.sicherheitspufferEur;
      gesamtkostenGesamt += c.gesamtkosten;
      potenzialGesamt += c.nettoPotenzial;
      wfGesamt += c.wf;
    });

    const potenzialQmGesamt = wfGesamt > 0 ? potenzialGesamt / wfGesamt : 0;
    const projektmarge = zielwertGesamt > 0 ? (potenzialGesamt / zielwertGesamt) * 100 : 0;

    const ek = parseFloat(eigenkapital) || 0;
    const ekRendite = ek > 0 ? (potenzialGesamt / ek) * 100 : null;

    const zm = parseFloat(zielMarge) || 0;
    const zielmargeEff = zm > 0 ? zm : 20;
    const maxInvest = zielwertGesamt > 0 ? zielwertGesamt * (1 - zielmargeEff / 100) : 0;
    const investPuffer = maxInvest - gesamtkostenGesamt;
    const maxKaufpreis = maxInvest > 0 ? maxInvest - (sanierungGesamt + knkGesamt + pufferGesamt) : 0;
    const kaufpreisPuffer = maxKaufpreis - kaufpreisGesamt;

    let ampel: "green" | "yellow" | "red" | "gray" = "gray";
    if (kaufpreisGesamt > 0) {
      if (projektmarge >= zielmargeEff) ampel = "green";
      else if (projektmarge >= zielmargeEff * 0.7) ampel = "yellow";
      else ampel = "red";
    }

    return { count, kaufpreisGesamt, zielwertGesamt, sanierungGesamt, knkGesamt, zwischensummeGesamt, pufferGesamt, gesamtkostenGesamt, potenzialGesamt, potenzialQmGesamt, projektmarge, ekRendite, maxInvest, investPuffer, maxKaufpreis, kaufpreisPuffer, ampel, zielmargeEff };
  }, [wohnungen, modus, anzahlWohnungen, eigenkapital, zielMarge]);

  const decisionAmpel = useMemo(() => {
    const answered = decisions.filter((d) => d !== "none");
    if (answered.length < 4) return "gray" as const;
    const jaCount = decisions.filter((d) => d === "ja").length;
    if (jaCount === 4) return "green" as const;
    if (jaCount >= 2) return "yellow" as const;
    return "red" as const;
  }, [decisions]);

  const decisionLabel = { gray: "Bitte alle Fragen beantworten", green: "MACHEN", yellow: "PRÜFEN", red: "LASSEN" };

  const reset = () => {
    setWohnungen([createWohnung()]); setAnzahlWohnungen("1"); setModus("referenz");
    setEigenkapital(""); setZielMarge("");
    setDecisions(["none", "none", "none", "none"]);
  };

  const copyValues = () => {
    const lines = [`ENTWICKLUNGS-CHECK Mehrfamilienhaus`, `Modus: ${modus === "referenz" ? "Referenz" : "Einzeln"}`, `Wohnungen: ${gesamt.count}`];
    if (modus === "einzeln") {
      wohnungen.forEach((w, i) => {
        const c = calcWohnung(w);
        lines.push(`\nWohnung ${i + 1}: KP ${fmt(c.kp)} €, ${w.wohnflaeche} qm, Potenzial ${fmt(c.nettoPotenzial)} €`);
      });
    }
    lines.push(`\nGesamtkosten: ${fmt(gesamt.gesamtkostenGesamt)} €`);
    lines.push(`Netto-Potenzial: ${fmt(gesamt.potenzialGesamt)} €`);
    lines.push(`Projektmarge: ${fmtDec(gesamt.projektmarge)} %`);
    navigator.clipboard.writeText(lines.join("\n"));
    toast({ title: "Kopiert ✓", description: "Zusammenfassung in die Zwischenablage kopiert." });
  };

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-2">Entwicklungsrechner</Badge>
          <h1 className="text-2xl font-display font-bold text-foreground">Entwicklungs-Check Mehrfamilienhaus</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl mx-auto">
            Dieser Rechner hilft dir in 2 Minuten zu entscheiden, ob sich die Weiterentwicklung dieses Mehrfamilienhauses mit seinen Einheiten wirtschaftlich lohnt.
          </p>
        </div>

        <p className="text-[11px] text-muted-foreground text-center mb-6 flex items-center justify-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          Eingaben ausfüllen → Berechnung &amp; Ampeln aktualisieren automatisch
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Eingaben */}
          <div className="lg:col-span-1 space-y-5">
            {/* Modus */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="gradient-brand px-4 py-2.5">
                <h2 className="text-sm font-bold text-primary-foreground tracking-wide">EINGABEN</h2>
              </div>
              <div className="p-5 space-y-4">
                <RadioGroup value={modus} onValueChange={(v) => setModus(v as "referenz" | "einzeln")} className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="referenz" id="ref" />
                    <Label htmlFor="ref" className="text-xs cursor-pointer">Referenz-Wohnung (alle identisch)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="einzeln" id="einz" />
                    <Label htmlFor="einz" className="text-xs cursor-pointer">MFH: Wohnungen einzeln</Label>
                  </div>
                </RadioGroup>

                {modus === "referenz" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Anzahl Wohnungen im Haus</Label>
                    <Input type="number" value={anzahlWohnungen} onChange={(e) => setAnzahlWohnungen(e.target.value)} min={1} />
                    <p className="text-[10px] text-muted-foreground">Im Referenz-Modus wird Wohnung 1 mit dieser Anzahl multipliziert.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Wohnungen */}
            {(modus === "referenz" ? [wohnungen[0]] : wohnungen).map((w, idx) => (
              <WohnungCard
                key={w.id}
                wohnung={w}
                index={idx}
                canDelete={modus === "einzeln" && wohnungen.length > 1}
                onUpdate={updateWohnung}
                onToggle={toggleOpen}
                onDelete={removeWohnung}
              />
            ))}

            {modus === "einzeln" && (
              <Button variant="outline" onClick={addWohnung} className="w-full gap-2">
                <Plus className="h-4 w-4" /> Wohnung hinzufügen
              </Button>
            )}

            {/* Optional fields */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <NumField label="Eigenkapital gesamt (€)" value={eigenkapital} onChange={setEigenkapital} hint="Optional: Zur Berechnung der EK-Rendite" />
              <NumField label="Ziel-Projektmarge (%)" value={zielMarge} onChange={setZielMarge} hint="Optional: Definiere deine Mindestmarge. Bleibt das Feld leer, arbeitet die Ampel mit 20 %." />
            </div>
          </div>

          {/* CENTER: Ergebnis */}
          <div className="lg:col-span-1 space-y-5">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="bg-muted/50 px-4 py-2.5">
                <h2 className="text-sm font-bold text-foreground">ERGEBNIS IM FOKUS – GESAMT</h2>
              </div>
              <div className="p-5 space-y-2">
                <CalcRow label="Wohnungsanzahl" value={`${gesamt.count}`} />
                <CalcRow label="Kaufpreis gesamt" value={`${fmt(gesamt.kaufpreisGesamt)} €`} />
                <CalcRow label="Zielwert Gesamtobjekt" value={`${fmt(gesamt.zielwertGesamt)} €`} />
                <CalcRow label="Sanierung gesamt" value={`${fmt(gesamt.sanierungGesamt)} €`} />
                <CalcRow label="Kaufnebenkosten gesamt" value={`${fmt(gesamt.knkGesamt)} €`} />
                <CalcRow label="Zwischensumme gesamt" value={`${fmt(gesamt.zwischensummeGesamt)} €`} />
                <CalcRow label="Sicherheitspuffer gesamt" value={`${fmt(gesamt.pufferGesamt)} €`} />
                <hr className="border-border" />
                <CalcRow label="Gesamtkosten Invest gesamt" value={`${fmt(gesamt.gesamtkostenGesamt)} €`} bold />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-6 text-center space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Netto-Potenzial gesamt</p>
                  <p className={`text-3xl font-display font-bold ${gesamt.potenzialGesamt > 0 ? "text-emerald-600" : gesamt.potenzialGesamt < 0 ? "text-red-500" : "text-foreground"}`}>
                    {fmt(gesamt.potenzialGesamt)} €
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">Ø Potenzial €/qm</p>
                    <p className="text-lg font-bold text-foreground">{fmt(gesamt.potenzialQmGesamt)} €</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">Projektmarge</p>
                    <p className="text-lg font-bold text-foreground">{fmtDec(gesamt.projektmarge)} %</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">EK-Rendite</p>
                    <p className="text-lg font-bold text-foreground">{gesamt.ekRendite !== null ? `${fmtDec(gesamt.ekRendite)} %` : "–"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">Max. Invest bei Zielmarge</p>
                    <p className="text-lg font-bold text-foreground">{gesamt.zielwertGesamt > 0 ? `${fmt(gesamt.maxInvest)} €` : "–"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">Invest Puffer</p>
                    <p className={`text-lg font-bold ${gesamt.investPuffer >= 0 ? "text-emerald-600" : "text-red-500"}`}>{gesamt.zielwertGesamt > 0 ? `${fmt(gesamt.investPuffer)} €` : "–"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">Max. Kaufpreis</p>
                    <p className="text-lg font-bold text-foreground">{gesamt.zielwertGesamt > 0 ? `${fmt(gesamt.maxKaufpreis)} €` : "–"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Kaufpreis Puffer</p>
                  <p className={`text-lg font-bold ${gesamt.kaufpreisPuffer >= 0 ? "text-emerald-600" : "text-red-500"}`}>{gesamt.zielwertGesamt > 0 ? `${fmt(gesamt.kaufpreisPuffer)} €` : "–"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <p className="text-xs font-bold text-foreground">Entscheidungsampel</p>
              <p className="text-[10px] text-muted-foreground">Basierend auf der <strong>Projektmarge</strong> (optional mit individueller Zielmarge).</p>
              <div className="flex items-center justify-center">
                <TrafficLight color={gesamt.ampel} />
              </div>
              <p className={`text-center text-sm font-bold ${gesamt.ampel === "green" ? "text-emerald-600" : gesamt.ampel === "yellow" ? "text-amber-500" : gesamt.ampel === "red" ? "text-red-500" : "text-muted-foreground"}`}>
                {gesamt.ampel === "green" ? "MACHEN" : gesamt.ampel === "yellow" ? "PRÜFEN" : gesamt.ampel === "red" ? "LASSEN" : "Noch offen"}
              </p>
              <div className="text-[10px] text-muted-foreground space-y-1">
                <p>🟢 <strong>Machen</strong>, ab Zielmarge (oder ≥ 20 %)</p>
                <p>🟡 <strong>Prüfen</strong>, ca. 70–99 % der Zielmarge (oder 12–19,9 %)</p>
                <p>🔴 <strong>Lassen</strong>, unter 12 % bzw. deutlich unter Zielmarge</p>
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

// ── Wohnung Card Component ──
function WohnungCard({ wohnung: w, index, canDelete, onUpdate, onToggle, onDelete }: {
  wohnung: Wohnung; index: number; canDelete: boolean;
  onUpdate: (id: string, field: keyof Wohnung, value: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const c = calcWohnung(w);
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button onClick={() => onToggle(w.id)} className="w-full flex items-center justify-between gradient-brand px-4 py-2.5 text-left">
        <h2 className="text-sm font-bold text-primary-foreground tracking-wide">
          EINGABEN & BERECHNUNG – Wohnung {index + 1}
        </h2>
        <div className="flex items-center gap-2">
          {canDelete && (
            <span onClick={(e) => { e.stopPropagation(); onDelete(w.id); }} className="text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">
              <Trash2 className="h-4 w-4" />
            </span>
          )}
          {w.open ? <ChevronUp className="h-4 w-4 text-primary-foreground" /> : <ChevronDown className="h-4 w-4 text-primary-foreground" />}
        </div>
      </button>
      {w.open && (
        <div className="p-5 space-y-4">
          <NumField label="Kaufpreis (€)" value={w.kaufpreis} onChange={(v) => onUpdate(w.id, "kaufpreis", v)} hint="Manuell ausfüllen" />
          <NumField label="Wohnfläche (qm)" value={w.wohnflaeche} onChange={(v) => onUpdate(w.id, "wohnflaeche", v)} hint="Manuell ausfüllen" />
          <NumField label="Ziel-QM-Preis (€)" value={w.zielQmPreis} onChange={(v) => onUpdate(w.id, "zielQmPreis", v)} hint="Manuell ausfüllen" />

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Sanierung (Auswahl)</Label>
            <Select value={w.sanierung} onValueChange={(v) => onUpdate(w.id, "sanierung", v)}>
              <SelectTrigger><SelectValue placeholder="Bitte wählen" /></SelectTrigger>
              <SelectContent>
                {SANIERUNG_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ReadOnlyField label="Sanierung €/qm (automatisch)" value={w.sanierung ? `${w.sanierung} €` : "–"} />

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Kaufnebenkosten (%)</Label>
            <Input type="number" value={w.kaufnebenkosten} onChange={(e) => onUpdate(w.id, "kaufnebenkosten", e.target.value)} />
            <p className="text-[10px] text-muted-foreground">Manuell ausfüllen</p>
          </div>

          <NumField label="Sicherheitspuffer (%)" value={w.sicherheitspuffer} onChange={(v) => onUpdate(w.id, "sicherheitspuffer", v)} hint="Manuell ausfüllen" />

          {/* Per-unit calculations */}
          <div className="border-t border-border pt-4 space-y-2">
            <p className="text-xs font-bold text-foreground">BERECHNUNGEN</p>
            <CalcRow label="Kauf-QM-Preis" value={`${fmt(c.kaufQmPreis)} €`} />
            <CalcRow label="QM-Hebel" value={`${fmt(c.qmHebel)} €`} />
            <CalcRow label="Zielwert Immobilie" value={`${fmt(c.zielwert)} €`} />
            <CalcRow label="Sanierung gesamt" value={`${fmt(c.sanierungGesamt)} €`} />
            <CalcRow label="Kaufnebenkosten €" value={`${fmt(c.kaufnebenkostenEur)} €`} />
            <CalcRow label="Zwischensumme Kosten" value={`${fmt(c.zwischensumme)} €`} />
            <CalcRow label="Sicherheitspuffer €" value={`${fmt(c.sicherheitspufferEur)} €`} />
            <hr className="border-border" />
            <CalcRow label="Gesamtkosten Invest" value={`${fmt(c.gesamtkosten)} €`} bold />
          </div>
        </div>
      )}
    </div>
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
