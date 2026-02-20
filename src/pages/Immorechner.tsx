import { useState, useMemo } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Download, Calculator } from "lucide-react";

// ── Helpers ──
const fmt = (n: number) =>
  n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
const fmtShort = (n: number) =>
  n.toLocaleString("de-DE", { maximumFractionDigits: 0 });
const fmtInt = (n: number) => n.toLocaleString("de-DE", { maximumFractionDigits: 0 });
const pct = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " %";

function Field({ label, suffix, children }: { label: string; suffix?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        {children}
        {suffix && <span className="text-sm text-muted-foreground font-medium">{suffix}</span>}
      </div>
    </div>
  );
}

function StepDot({ active, completed }: { active: boolean; completed: boolean }) {
  return (
    <div
      className={`h-3 w-3 rounded-full transition-colors ${
        active ? "bg-[hsl(35,95%,55%)]" : completed ? "bg-[hsl(35,95%,55%)]/60" : "bg-muted-foreground/30"
      }`}
    />
  );
}

// ── SVG Diagram Component (V-shape like reference images) ──
function HebelDiagram({
  kaufpreis, wertentwicklung, laufzeit, tilgung, immoWert, vermoegenswert, tilgungGesamt, eigenkapital,
  showInputs, onKaufpreisChange, onEigenkapitalChange, onWertentwicklungChange, onLaufzeitChange, onTilgungChange,
}: {
  kaufpreis: number; wertentwicklung: number; laufzeit: number; tilgung: number;
  immoWert: number; vermoegenswert: number; tilgungGesamt: number; eigenkapital: number;
  showInputs?: boolean;
  onKaufpreisChange?: (v: number) => void; onEigenkapitalChange?: (v: number) => void;
  onWertentwicklungChange?: (v: number) => void; onLaufzeitChange?: (v: number) => void;
  onTilgungChange?: (v: number) => void;
}) {
  return (
    <div className="relative w-full" style={{ minHeight: 420 }}>
      <svg viewBox="0 0 700 400" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="arrowGray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#9ca3af" />
          </marker>
          <marker id="arrowOrange" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="hsl(35,95%,55%)" />
          </marker>
        </defs>

        {/* Wertentwicklung line (going up-right) */}
        <line x1="120" y1="230" x2="480" y2="60" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowGray)" />
        {/* Wertentwicklung value */}
        <text x="500" y="56" className="text-[15px] font-bold" fill="currentColor" fontFamily="inherit">{fmtShort(immoWert)} €</text>

        {/* Wertentwicklung label */}
        <foreignObject x="30" y="120" width="90" height="80">
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">{wertentwicklung}</span>
              <span className="text-sm text-muted-foreground font-medium">%</span>
            </div>
            <span className="text-[10px] text-muted-foreground text-center leading-tight">Wertentwicklung<br/>p.A.</span>
          </div>
        </foreignObject>

        {/* Vertical bar right */}
        <line x1="490" y1="60" x2="490" y2="340" stroke="#d1d5db" strokeWidth="1.5" />

        {/* Laufzeit line (horizontal, orange) */}
        <line x1="120" y1="230" x2="500" y2="230" stroke="hsl(35,95%,55%)" strokeWidth="3" markerEnd="url(#arrowOrange)" />
        {/* Vermögenswert */}
        <text x="510" y="234" className="text-[15px] font-bold" fill="hsl(35,95%,55%)" fontFamily="inherit">{fmtShort(vermoegenswert)} €</text>

        {/* Laufzeit label */}
        <foreignObject x="240" y="192" width="120" height="36">
          <div className="flex items-baseline gap-1 justify-center">
            <span className="text-lg font-bold text-foreground">{laufzeit}</span>
            <span className="text-sm text-muted-foreground font-medium">Jahre</span>
          </div>
        </foreignObject>

        {/* Laufzeit sublabel */}
        <text x="200" y="262" className="text-[10px]" fill="#9ca3af" fontFamily="inherit">→ Laufzeit</text>
        <foreignObject x="270" y="248" width="130" height="22">
          <div>
            <span className="text-[10px] bg-[hsl(35,95%,55%)] text-white px-2 py-0.5 rounded font-medium">Laufzeit bis Abbezahlt</span>
          </div>
        </foreignObject>

        {/* Tilgung line (going down-right) */}
        <line x1="120" y1="230" x2="480" y2="340" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowGray)" />
        {/* Tilgung value */}
        <text x="500" y="344" className="text-[15px] font-bold" fill="currentColor" fontFamily="inherit">{fmtShort(tilgungGesamt)} €</text>

        {/* Tilgung label */}
        <foreignObject x="30" y="290" width="90" height="80">
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">{tilgung}</span>
              <span className="text-sm text-muted-foreground font-medium">%</span>
            </div>
            <span className="text-[10px] text-muted-foreground text-center leading-tight">Tilgung<br/>p.A.</span>
          </div>
        </foreignObject>

        {/* Kaufpreis + Eigenkapital (only on step 0) */}
        {showInputs && (
          <>
            <text x="120" y="186" className="text-[10px]" fill="#9ca3af" fontFamily="inherit">→ Kaufpreis</text>
            <foreignObject x="120" y="192" width="120" height="34">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-foreground">{fmtShort(kaufpreis)}</span>
                <span className="text-sm text-muted-foreground font-medium">€</span>
              </div>
            </foreignObject>
            <text x="120" y="246" className="text-[10px]" fill="#9ca3af" fontFamily="inherit">→ Eigenkapital</text>
            <foreignObject x="120" y="252" width="120" height="34">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-foreground">{fmtShort(eigenkapital)}</span>
                <span className="text-sm text-muted-foreground font-medium">€</span>
              </div>
            </foreignObject>
          </>
        )}
      </svg>
    </div>
  );
}

const STEP_TITLES = [
  "Berechne Deinen Vermögensaufbau mit Immobilien",
  "Monatlicher Eigenanteil für Vermögensaufbau",
  "Der Fremdkapital-Hebel",
  "Steuerliche Auswertung",
  "Dein Immo-Wert",
];

export default function Immorechner() {
  const [step, setStep] = useState(0);

  // Step 1 – Grunddaten
  const [kaufpreis, setKaufpreis] = useState(200000);
  const [eigenkapital, setEigenkapital] = useState(0);
  const [wertentwicklung, setWertentwicklung] = useState(2);
  const [laufzeit, setLaufzeit] = useState(10);
  const [tilgung, setTilgung] = useState(2);
  const [zinssatz, setZinssatz] = useState(5);

  // Step 2 – Aufwendungen & Einnahmen
  const [kaufnebenkosten, setKaufnebenkosten] = useState(0);
  const [maklergebuehr, setMaklergebuehr] = useState(0);
  const [sonstigesEinmalig, setSonstigesEinmalig] = useState(0);
  const [verwaltung, setVerwaltung] = useState(0);
  const [sonstigesMonatlich, setSonstigesMonatlich] = useState(0);
  const [miete, setMiete] = useState(0);
  const [mietsteigerung, setMietsteigerung] = useState(0);
  const [steuervorteilMonat, setSteuervorteilMonat] = useState(0);

  // Step 4 – Steuer
  const [persSteuersatz, setPersSteuersatz] = useState(42);
  const [abschreibungssatz, setAbschreibungssatz] = useState(2);
  const [grundsteuerJahr, setGrundsteuerJahr] = useState(300);
  const [gebaeudeanteil, setGebaeudeanteil] = useState(80);
  const [sonderabschreibung, setSonderabschreibung] = useState(0);
  const [werbungskosten, setWerbungskosten] = useState(0);

  // ── Berechnungen ──
  const calc = useMemo(() => {
    const darlehen = kaufpreis - eigenkapital;
    const zinsMonat = (darlehen * (zinssatz / 100)) / 12;
    const tilgungMonat = (darlehen * (tilgung / 100)) / 12;
    const aufwendungenMonatlich = zinsMonat + tilgungMonat + verwaltung + sonstigesMonatlich;
    const einnahmenMonatlich = miete + steuervorteilMonat;
    const eigenanteilMonat = aufwendungenMonatlich - einnahmenMonatlich;
    const eigenanteilGesamt = eigenanteilMonat * laufzeit * 12;

    const immoWert = kaufpreis * Math.pow(1 + wertentwicklung / 100, laufzeit);
    const restschuldSimple = Math.max(0, darlehen - tilgungMonat * 12 * laufzeit);
    const vermoegenswert = immoWert - restschuldSimple;
    const tilgungGesamt = tilgungMonat * 12 * laufzeit;

    const wertTabelle = [0, 1, 2, 3, 4, 5].map((p) => ({
      prozent: p,
      wert: kaufpreis * Math.pow(1 + p / 100, laufzeit),
    }));

    const investition = eigenkapital + kaufnebenkosten + maklergebuehr + sonstigesEinmalig + eigenanteilGesamt;
    const gewinn = vermoegenswert - investition;
    const eigenkapitalRendite = investition > 0 ? (gewinn / investition) * 100 : 0;

    // Steuer
    const gebaeudeWert = kaufpreis * (gebaeudeanteil / 100);
    const afaJahr = gebaeudeWert * (abschreibungssatz / 100);
    const sonderAfaJahr = gebaeudeWert * (sonderabschreibung / 100);
    const afaGesamt = (afaJahr + sonderAfaJahr) * Math.min(laufzeit, 50);
    const zinsaufwandJahr = darlehen * (zinssatz / 100);
    const grundsteuerGesamt = grundsteuerJahr * laufzeit;

    const mieteinnahmenJahr = miete * 12;
    let mieteinnahmenGesamt = 0;
    for (let y = 0; y < laufzeit; y++) {
      const faktor = mietsteigerung > 0 ? Math.pow(1 + mietsteigerung / 100, Math.floor(y / 3)) : 1;
      mieteinnahmenGesamt += mieteinnahmenJahr * faktor;
    }

    const absetzbarJahr = afaJahr + sonderAfaJahr + zinsaufwandJahr + grundsteuerJahr + (werbungskosten || 0) + (verwaltung * 12);
    const steuerlichesErgebnisJahr = mieteinnahmenJahr - absetzbarJahr;
    const steuerersparnis = steuerlichesErgebnisJahr < 0 ? Math.abs(steuerlichesErgebnisJahr) * (persSteuersatz / 100) : 0;
    const steuerersparnisGesamt = steuerersparnis * laufzeit;

    const spekulationssteuerRelevant = laufzeit < 10;
    const spekulationsgewinn = immoWert - kaufpreis;
    const spekulationssteuer = spekulationssteuerRelevant && spekulationsgewinn > 0 ? spekulationsgewinn * (persSteuersatz / 100) : 0;

    return {
      darlehen, zinsMonat, tilgungMonat, aufwendungenMonatlich, einnahmenMonatlich,
      eigenanteilMonat, eigenanteilGesamt, immoWert, restschuldSimple, vermoegenswert,
      tilgungGesamt, wertTabelle, investition, gewinn, eigenkapitalRendite,
      gebaeudeWert, afaJahr, sonderAfaJahr, afaGesamt, zinsaufwandJahr, mieteinnahmenJahr,
      mieteinnahmenGesamt, absetzbarJahr, steuerlichesErgebnisJahr, steuerersparnis,
      steuerersparnisGesamt, grundsteuerGesamt,
      spekulationssteuerRelevant, spekulationssteuer, spekulationsgewinn,
    };
  }, [kaufpreis, eigenkapital, wertentwicklung, laufzeit, tilgung, zinssatz, kaufnebenkosten, maklergebuehr,
      sonstigesEinmalig, verwaltung, sonstigesMonatlich, miete, mietsteigerung, steuervorteilMonat,
      persSteuersatz, abschreibungssatz, grundsteuerJahr, gebaeudeanteil, sonderabschreibung, werbungskosten]);

  const canNext = step < STEP_TITLES.length - 1;
  const canPrev = step > 0;

  const diagramProps = {
    kaufpreis, wertentwicklung, laufzeit, tilgung, eigenkapital,
    immoWert: calc.immoWert, vermoegenswert: calc.vermoegenswert, tilgungGesamt: calc.tilgungGesamt,
  };

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
              <span className="text-[hsl(35,95%,55%)]">IMMO</span>RECHNER
            </h1>
            <div className="w-12 h-1 rounded-full bg-[hsl(35,95%,55%)] mt-1" />
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Step Title */}
        <h2 className="text-lg font-display font-bold text-foreground mb-2">
          {STEP_TITLES[step]}{" "}
          {(step >= 2) && <span className="text-[hsl(35,95%,55%)]">in {laufzeit} Jahren</span>}
        </h2>

        {/* ── STEP 0: Grunddaten ── */}
        {step === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <HebelDiagram {...diagramProps} showInputs />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card rounded-xl border border-border p-5 shadow-crm-sm space-y-4">
                <Field label="Kaufpreis" suffix="€">
                  <Input type="number" value={kaufpreis} onChange={(e) => setKaufpreis(+e.target.value)} className="max-w-[160px]" />
                </Field>
                <Field label="Eigenkapital" suffix="€">
                  <Input type="number" value={eigenkapital} onChange={(e) => setEigenkapital(+e.target.value)} className="max-w-[160px]" />
                </Field>
                <Field label="Wertentwicklung p.A." suffix="%">
                  <Input type="number" value={wertentwicklung} onChange={(e) => setWertentwicklung(+e.target.value)} className="max-w-[80px]" step={0.5} />
                </Field>
                <Field label="Laufzeit" suffix="Jahre">
                  <Input type="number" value={laufzeit} onChange={(e) => setLaufzeit(+e.target.value)} className="max-w-[80px]" />
                </Field>
                <Field label="Tilgung p.A." suffix="%">
                  <Input type="number" value={tilgung} onChange={(e) => setTilgung(+e.target.value)} className="max-w-[80px]" step={0.5} />
                </Field>
                <Field label="Zinssatz p.A." suffix="%">
                  <Input type="number" value={zinssatz} onChange={(e) => setZinssatz(+e.target.value)} className="max-w-[80px]" step={0.1} />
                </Field>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 1: Aufwendungen & Einnahmen ── */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <HebelDiagram {...diagramProps} />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card rounded-xl border border-border p-5 shadow-crm-sm space-y-4">
                <h3 className="text-sm font-bold text-foreground">Aufwendungen (einmalig):</h3>
                <div className="space-y-2">
                  {[
                    { l: "Eigenkapital:", v: eigenkapital, s: setEigenkapital },
                    { l: "Kaufnebenkosten:", v: kaufnebenkosten, s: setKaufnebenkosten },
                    { l: "Maklergebühr:", v: maklergebuehr, s: setMaklergebuehr },
                    { l: "Sonstiges:", v: sonstigesEinmalig, s: setSonstigesEinmalig },
                  ].map((f) => (
                    <div key={f.l} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">{f.l}</span>
                      <div className="flex items-center gap-1">
                        <Input type="number" value={f.v} onChange={(e) => f.s(+e.target.value)} className="w-[90px] h-8 text-right text-sm" />
                        <span className="text-xs text-muted-foreground">€</span>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-sm font-bold text-foreground pt-2">Aufwendungen (monatlich):</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Zins:</span>
                    <div className="flex items-center gap-1">
                      <Input type="number" value={Math.round(calc.zinsMonat)} readOnly className="w-[90px] h-8 text-right text-sm bg-muted" />
                      <span className="text-xs text-muted-foreground">€</span>
                      <span className="text-xs text-muted-foreground ml-1">{zinssatz} %</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Tilgung:</span>
                    <div className="flex items-center gap-1">
                      <Input type="number" value={Math.round(calc.tilgungMonat)} readOnly className="w-[90px] h-8 text-right text-sm bg-muted" />
                      <span className="text-xs text-muted-foreground">€</span>
                      <span className="text-xs text-muted-foreground ml-1">{tilgung} %</span>
                    </div>
                  </div>
                  {[
                    { l: "Verwaltung:", v: verwaltung, s: setVerwaltung },
                    { l: "Sonstiges:", v: sonstigesMonatlich, s: setSonstigesMonatlich },
                  ].map((f) => (
                    <div key={f.l} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">{f.l}</span>
                      <div className="flex items-center gap-1">
                        <Input type="number" value={f.v} onChange={(e) => f.s(+e.target.value)} className="w-[90px] h-8 text-right text-sm" />
                        <span className="text-xs text-muted-foreground">€</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm font-bold text-foreground">Gesamt: {fmt(calc.aufwendungenMonatlich)}</p>

                <Separator />

                <h3 className="text-sm font-bold text-foreground">Einnahmen (monatlich):</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Miete:</span>
                    <div className="flex items-center gap-1">
                      <Input type="number" value={miete} onChange={(e) => setMiete(+e.target.value)} className="w-[90px] h-8 text-right text-sm" />
                      <span className="text-xs text-muted-foreground">€</span>
                      <Input type="number" value={mietsteigerung} onChange={(e) => setMietsteigerung(+e.target.value)} className="w-[50px] h-8 text-right text-sm ml-1" />
                      <span className="text-[10px] text-muted-foreground">% Steigerung alle 3 Jahre</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Steuervorteil:</span>
                    <div className="flex items-center gap-1">
                      <Input type="number" value={steuervorteilMonat} onChange={(e) => setSteuervorteilMonat(+e.target.value)} className="w-[90px] h-8 text-right text-sm" />
                      <span className="text-xs text-muted-foreground">€</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-bold text-foreground">Gesamt: {fmt(calc.einnahmenMonatlich)}</p>

                <div className="p-3 rounded-lg bg-[hsl(35,95%,55%)]/10 border border-[hsl(35,95%,55%)]/20 text-center mt-2">
                  <p className="text-2xl font-display font-bold text-[hsl(35,95%,55%)]">{fmt(calc.eigenanteilMonat)} Eigenanteil</p>
                  <p className="text-xs text-muted-foreground">für deinen Vermögensaufbau</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Fremdkapital-Hebel ── */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <HebelDiagram {...diagramProps} />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card rounded-xl border border-border p-5 shadow-crm-sm text-center space-y-3">
                <p className="text-sm text-muted-foreground">Eigenanteil</p>
                <p className="text-xl font-bold">{fmt(calc.eigenanteilMonat)}</p>
                <p className="text-xs text-muted-foreground">in <strong>{laufzeit}</strong> Jahren</p>
                <Separator />
                <p className="text-2xl font-display font-bold">= {fmt(calc.eigenanteilGesamt)}</p>
              </div>

              <div className="bg-card rounded-xl border border-border p-5 shadow-crm-sm space-y-3">
                <div className="flex justify-between text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">Ergebnis Eigenanteil</p>
                    <p className="text-lg font-bold">{fmt(calc.eigenanteilGesamt)}</p>
                  </div>
                  <span className="text-muted-foreground self-center">→</span>
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">Ergebnis Vermögensaufbau</p>
                    <p className="text-lg font-bold">{fmt(calc.vermoegenswert)}</p>
                  </div>
                </div>
                <Separator />
                <p className="text-center text-sm text-muted-foreground">Ergebnis Eigenkapitalrendite</p>
                <p className="text-center text-3xl font-display font-bold text-[hsl(35,95%,55%)]">
                  {pct(calc.eigenkapitalRendite)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Steuerliche Auswertung ── */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5 max-w-md">
              <h3 className="text-sm font-bold text-foreground">Steuerliche Parameter</h3>
              <Field label="Persönlicher Steuersatz" suffix="%">
                <Input type="number" value={persSteuersatz} onChange={(e) => setPersSteuersatz(+e.target.value)} className="max-w-[100px]" />
              </Field>
              <Field label="Gebäudeanteil am Kaufpreis" suffix="%">
                <Input type="number" value={gebaeudeanteil} onChange={(e) => setGebaeudeanteil(+e.target.value)} className="max-w-[100px]" />
              </Field>
              <Field label="AfA-Satz (linear)" suffix="% p.A.">
                <Input type="number" value={abschreibungssatz} onChange={(e) => setAbschreibungssatz(+e.target.value)} className="max-w-[100px]" step={0.5} />
              </Field>
              <Field label="Sonderabschreibung (§ 7b EStG)" suffix="% p.A.">
                <Input type="number" value={sonderabschreibung} onChange={(e) => setSonderabschreibung(+e.target.value)} className="max-w-[100px]" step={0.5} />
              </Field>
              <Field label="Grundsteuer" suffix="€ / Jahr">
                <Input type="number" value={grundsteuerJahr} onChange={(e) => setGrundsteuerJahr(+e.target.value)} className="max-w-[150px]" />
              </Field>
              <Field label="Weitere Werbungskosten" suffix="€ / Jahr">
                <Input type="number" value={werbungskosten} onChange={(e) => setWerbungskosten(+e.target.value)} className="max-w-[150px]" />
              </Field>
            </div>

            <div className="space-y-4">
              <div className="bg-card rounded-xl border border-border p-6 shadow-crm-sm">
                <h3 className="text-sm font-display font-bold text-foreground mb-4">Steuerliche Jahresberechnung</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gebäudewert ({gebaeudeanteil}% von {fmtInt(kaufpreis)} €)</span>
                    <span className="font-medium">{fmt(calc.gebaeudeWert)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">AfA linear ({abschreibungssatz}%)</span>
                    <span className="font-medium text-[hsl(var(--success))]">- {fmt(calc.afaJahr)}</span>
                  </div>
                  {sonderabschreibung > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sonder-AfA ({sonderabschreibung}%)</span>
                      <span className="font-medium text-[hsl(var(--success))]">- {fmt(calc.sonderAfaJahr)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zinsaufwand / Jahr</span>
                    <span className="font-medium text-[hsl(var(--success))]">- {fmt(calc.zinsaufwandJahr)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grundsteuer / Jahr</span>
                    <span className="font-medium text-[hsl(var(--success))]">- {fmt(grundsteuerJahr)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verwaltung / Jahr</span>
                    <span className="font-medium text-[hsl(var(--success))]">- {fmt(verwaltung * 12)}</span>
                  </div>
                  {werbungskosten > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weitere Werbungskosten</span>
                      <span className="font-medium text-[hsl(var(--success))]">- {fmt(werbungskosten)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Absetzbar / Jahr gesamt</span>
                    <span className="text-[hsl(var(--success))]">- {fmt(calc.absetzbarJahr)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mieteinnahmen / Jahr</span>
                    <span className="font-medium">+ {fmt(calc.mieteinnahmenJahr)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Steuerliches Ergebnis / Jahr</span>
                    <span className={calc.steuerlichesErgebnisJahr < 0 ? "text-[hsl(var(--success))]" : "text-destructive"}>
                      {fmt(calc.steuerlichesErgebnisJahr)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-xl border border-border p-4 shadow-crm-sm text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Steuerersparnis / Jahr</p>
                  <p className="text-xl font-bold text-[hsl(var(--success))]">{fmt(calc.steuerersparnis)}</p>
                  <p className="text-[10px] text-muted-foreground">bei {persSteuersatz}% Steuersatz</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-4 shadow-crm-sm text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Ersparnis über {laufzeit}J</p>
                  <p className="text-xl font-bold text-[hsl(var(--success))]">{fmt(calc.steuerersparnisGesamt)}</p>
                </div>
              </div>

              {calc.spekulationssteuerRelevant && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-destructive mb-1">⚠ Spekulationssteuer beachten</p>
                  <p className="text-xs text-muted-foreground">
                    Bei Verkauf innerhalb von 10 Jahren fällt Spekulationssteuer an.
                    Geschätzter Gewinn: {fmt(calc.spekulationsgewinn)} → Steuer: <strong>{fmt(calc.spekulationssteuer)}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 4: Ergebnis ── */}
        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <HebelDiagram {...diagramProps} />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card rounded-xl border border-border p-5 shadow-crm-sm">
                <h3 className="text-sm font-display font-bold text-foreground mb-3">Dein Immo-Wert</h3>
                <p className="text-xs text-muted-foreground mb-3">Dein Immobilienwert nach {laufzeit} Jahren mit gegebener Wertsteigerung:</p>
                <div className="space-y-1.5 text-sm">
                  {calc.wertTabelle.map((w) => (
                    <div key={w.prozent} className={`flex justify-between px-2 py-1.5 rounded ${w.prozent === wertentwicklung ? "bg-[hsl(35,95%,55%)]/10 font-bold" : ""}`}>
                      <span className={w.prozent === wertentwicklung ? "text-foreground" : "text-muted-foreground"}>
                        {w.prozent === wertentwicklung ? `Deine Angabe (${w.prozent} %):` : `${w.prozent} % Wertsteigerung:`}
                      </span>
                      <span>{fmt(w.wert)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-5 shadow-crm-sm text-center">
                <h3 className="text-sm font-display font-bold text-foreground mb-2">Deine Immo-Investition</h3>
                <p className="text-xs text-muted-foreground">Dein Eigenanteil nach {laufzeit} Jahren:</p>
                <p className="text-3xl font-display font-bold text-[hsl(35,95%,55%)] mt-2">{fmt(calc.eigenanteilGesamt)}</p>
              </div>

              <Button className="w-full gap-2 bg-[hsl(35,95%,55%)] hover:bg-[hsl(35,95%,45%)] text-white border-0">
                <Download className="h-4 w-4" /> Als PDF herunterladen
              </Button>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex items-center justify-center gap-6 mt-10 pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => s - 1)}
            disabled={!canPrev}
            className="text-[hsl(35,95%,55%)] hover:text-[hsl(35,95%,45%)]"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> ZURÜCK
          </Button>

          <div className="flex gap-2">
            {STEP_TITLES.map((_, i) => (
              <button key={i} onClick={() => setStep(i)}>
                <StepDot active={i === step} completed={i < step} />
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext}
            className="text-muted-foreground hover:text-foreground"
          >
            → WEITER
          </Button>
        </div>
      </div>
    </CRMLayout>
  );
}
