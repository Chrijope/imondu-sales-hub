import { useState, useMemo } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Download, Calculator, TrendingUp, PiggyBank, BarChart3, FileText } from "lucide-react";

// ── Helpers ──
const fmt = (n: number) =>
  n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
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

const STEP_TITLES = [
  "Grunddaten der Immobilie",
  "Aufwendungen & Einnahmen",
  "Fremdkapital-Hebel",
  "Steuerliche Auswertung",
  "Vermögenswert & Ergebnis",
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
    const restschuld = darlehen * Math.pow(1 + zinssatz / 100, laufzeit) -
      (tilgungMonat * 12) * ((Math.pow(1 + zinssatz / 100, laufzeit) - 1) / (zinssatz / 100));
    const restschuldSimple = Math.max(0, darlehen - tilgungMonat * 12 * laufzeit);

    const vermoegenswert = immoWert - restschuldSimple;

    // Werttabelle
    const wertTabelle = [0, 1, 2, 3, 4, 5].map((p) => ({
      prozent: p,
      wert: kaufpreis * Math.pow(1 + p / 100, laufzeit),
    }));

    // Eigenkapitalrendite
    const investition = eigenkapital + kaufnebenkosten + maklergebuehr + sonstigesEinmalig + eigenanteilGesamt;
    const gewinn = vermoegenswert - investition;
    const eigenkapitalRendite = investition > 0 ? (gewinn / investition) * 100 : 0;

    // ── Steuerliche Berechnung ──
    const gebaeudeWert = kaufpreis * (gebaeudeanteil / 100);
    const afaJahr = gebaeudeWert * (abschreibungssatz / 100);
    const sonderAfaJahr = gebaeudeWert * (sonderabschreibung / 100);
    const afaGesamt = (afaJahr + sonderAfaJahr) * Math.min(laufzeit, 50);
    const zinsaufwandJahr = darlehen * (zinssatz / 100);
    const werbungskostenGesamt = werbungskosten * laufzeit;
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
    const steuerlastJahr = steuerlichesErgebnisJahr > 0 ? steuerlichesErgebnisJahr * (persSteuersatz / 100) : 0;
    const steuerersparnisGesamt = steuerersparnis * laufzeit;
    const nettovorteilGesamt = vermoegenswert - eigenanteilGesamt + steuerersparnisGesamt + mieteinnahmenGesamt;

    // Spekulationssteuer (Verkauf < 10 Jahre)
    const spekulationssteuerRelevant = laufzeit < 10;
    const spekulationsgewinn = immoWert - kaufpreis;
    const spekulationssteuer = spekulationssteuerRelevant && spekulationsgewinn > 0 ? spekulationsgewinn * (persSteuersatz / 100) : 0;

    return {
      darlehen, zinsMonat, tilgungMonat, aufwendungenMonatlich, einnahmenMonatlich,
      eigenanteilMonat, eigenanteilGesamt, immoWert, restschuldSimple, vermoegenswert,
      wertTabelle, investition, gewinn, eigenkapitalRendite,
      // Steuer
      gebaeudeWert, afaJahr, sonderAfaJahr, afaGesamt, zinsaufwandJahr, mieteinnahmenJahr,
      mieteinnahmenGesamt, absetzbarJahr, steuerlichesErgebnisJahr, steuerersparnis,
      steuerlastJahr, steuerersparnisGesamt, nettovorteilGesamt, grundsteuerGesamt,
      werbungskostenGesamt, spekulationssteuerRelevant, spekulationssteuer, spekulationsgewinn,
    };
  }, [kaufpreis, eigenkapital, wertentwicklung, laufzeit, tilgung, zinssatz, kaufnebenkosten, maklergebuehr,
      sonstigesEinmalig, verwaltung, sonstigesMonatlich, miete, mietsteigerung, steuervorteilMonat,
      persSteuersatz, abschreibungssatz, grundsteuerJahr, gebaeudeanteil, sonderabschreibung, werbungskosten]);

  const canNext = step < STEP_TITLES.length - 1;
  const canPrev = step > 0;

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
              <span className="text-primary">IMMO</span>RECHNER
            </h1>
            <div className="w-12 h-1 rounded-full bg-[hsl(35,95%,55%)] mt-1" />
          </div>
          <Calculator className="h-8 w-8 text-muted-foreground/40" />
        </div>

        <Separator className="mb-6" />

        {/* Step Title */}
        <h2 className="text-lg font-display font-bold text-foreground mb-6">
          {STEP_TITLES[step]}
        </h2>

        {/* ── STEP 0: Grunddaten ── */}
        {step === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5 max-w-md">
              <Field label="Kaufpreis" suffix="€">
                <Input type="number" value={kaufpreis} onChange={(e) => setKaufpreis(+e.target.value)} className="max-w-[180px]" />
              </Field>
              <Field label="Eigenkapital" suffix="€">
                <Input type="number" value={eigenkapital} onChange={(e) => setEigenkapital(+e.target.value)} className="max-w-[180px]" />
              </Field>
              <Field label="Wertentwicklung p.A." suffix="%">
                <Input type="number" value={wertentwicklung} onChange={(e) => setWertentwicklung(+e.target.value)} className="max-w-[100px]" step={0.5} />
              </Field>
              <Field label="Laufzeit" suffix="Jahre">
                <Input type="number" value={laufzeit} onChange={(e) => setLaufzeit(+e.target.value)} className="max-w-[100px]" />
              </Field>
              <Field label="Tilgung p.A." suffix="%">
                <Input type="number" value={tilgung} onChange={(e) => setTilgung(+e.target.value)} className="max-w-[100px]" step={0.5} />
              </Field>
              <Field label="Zinssatz p.A." suffix="%">
                <Input type="number" value={zinssatz} onChange={(e) => setZinssatz(+e.target.value)} className="max-w-[100px]" step={0.1} />
              </Field>
            </div>

            {/* Live-Vorschau */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-crm-sm space-y-4">
              <h3 className="text-sm font-display font-bold text-foreground">Schnellübersicht</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Darlehen</p>
                  <p className="text-lg font-bold text-foreground">{fmt(calc.darlehen)}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Immo-Wert nach {laufzeit}J</p>
                  <p className="text-lg font-bold text-foreground">{fmt(calc.immoWert)}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Zins/Monat</p>
                  <p className="text-lg font-bold text-foreground">{fmt(calc.zinsMonat)}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tilgung/Monat</p>
                  <p className="text-lg font-bold text-foreground">{fmt(calc.tilgungMonat)}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[hsl(35,95%,55%)]/10 border border-[hsl(35,95%,55%)]/20">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Vermögenswert nach {laufzeit} Jahren</p>
                <p className="text-2xl font-display font-bold text-[hsl(35,95%,55%)]">{fmt(calc.vermoegenswert)}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 1: Aufwendungen & Einnahmen ── */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 max-w-md">
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">Aufwendungen (einmalig)</h3>
                <div className="space-y-3">
                  <Field label="Eigenkapital" suffix="€">
                    <Input type="number" value={eigenkapital} onChange={(e) => setEigenkapital(+e.target.value)} className="max-w-[150px]" />
                  </Field>
                  <Field label="Kaufnebenkosten" suffix="€">
                    <Input type="number" value={kaufnebenkosten} onChange={(e) => setKaufnebenkosten(+e.target.value)} className="max-w-[150px]" />
                  </Field>
                  <Field label="Maklergebühr" suffix="€">
                    <Input type="number" value={maklergebuehr} onChange={(e) => setMaklergebuehr(+e.target.value)} className="max-w-[150px]" />
                  </Field>
                  <Field label="Sonstiges" suffix="€">
                    <Input type="number" value={sonstigesEinmalig} onChange={(e) => setSonstigesEinmalig(+e.target.value)} className="max-w-[150px]" />
                  </Field>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">Aufwendungen (monatlich)</h3>
                <div className="space-y-3">
                  <div className="flex items-end gap-3">
                    <Field label="Zins" suffix="€">
                      <Input type="number" value={Math.round(calc.zinsMonat)} readOnly className="max-w-[100px] bg-muted" />
                    </Field>
                    <span className="text-sm text-muted-foreground mb-2">{zinssatz} %</span>
                  </div>
                  <div className="flex items-end gap-3">
                    <Field label="Tilgung" suffix="€">
                      <Input type="number" value={Math.round(calc.tilgungMonat)} readOnly className="max-w-[100px] bg-muted" />
                    </Field>
                    <span className="text-sm text-muted-foreground mb-2">{tilgung} %</span>
                  </div>
                  <Field label="Verwaltung" suffix="€">
                    <Input type="number" value={verwaltung} onChange={(e) => setVerwaltung(+e.target.value)} className="max-w-[150px]" />
                  </Field>
                  <Field label="Sonstiges" suffix="€">
                    <Input type="number" value={sonstigesMonatlich} onChange={(e) => setSonstigesMonatlich(+e.target.value)} className="max-w-[150px]" />
                  </Field>
                </div>
                <p className="text-sm font-bold text-foreground mt-3">Gesamt: {fmt(calc.aufwendungenMonatlich)}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">Einnahmen (monatlich)</h3>
                <div className="space-y-3">
                  <div className="flex items-end gap-3">
                    <Field label="Miete" suffix="€">
                      <Input type="number" value={miete} onChange={(e) => setMiete(+e.target.value)} className="max-w-[150px]" />
                    </Field>
                    <Field label="Steigerung alle 3 Jahre" suffix="%">
                      <Input type="number" value={mietsteigerung} onChange={(e) => setMietsteigerung(+e.target.value)} className="max-w-[80px]" />
                    </Field>
                  </div>
                  <Field label="Steuervorteil" suffix="€">
                    <Input type="number" value={steuervorteilMonat} onChange={(e) => setSteuervorteilMonat(+e.target.value)} className="max-w-[150px]" />
                  </Field>
                </div>
                <p className="text-sm font-bold text-foreground mt-3">Gesamt: {fmt(calc.einnahmenMonatlich)}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 shadow-crm-sm">
              <div className="p-4 rounded-lg bg-[hsl(35,95%,55%)]/10 border border-[hsl(35,95%,55%)]/20 text-center">
                <p className="text-sm text-muted-foreground">Monatlicher Eigenanteil</p>
                <p className="text-3xl font-display font-bold text-[hsl(35,95%,55%)]">{fmt(calc.eigenanteilMonat)}</p>
                <p className="text-xs text-muted-foreground mt-1">für deinen Vermögensaufbau</p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Fremdkapital-Hebel ── */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl border border-border p-6 shadow-crm-sm space-y-4">
              <h3 className="text-sm font-display font-bold text-foreground">
                Der Fremdkapital-Hebel in <span className="text-[hsl(35,95%,55%)]">{laufzeit}</span> Jahren
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 rounded-lg bg-secondary/30">
                  <span className="text-muted-foreground">Wertentwicklung {wertentwicklung}% p.A.</span>
                  <span className="font-bold">{fmt(calc.immoWert)}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-[hsl(35,95%,55%)]/10">
                  <span className="text-muted-foreground">→ Laufzeit {laufzeit} Jahre</span>
                  <span className="font-bold text-[hsl(35,95%,55%)]">{fmt(calc.vermoegenswert)}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-secondary/30">
                  <span className="text-muted-foreground">Tilgung {tilgung}% p.A.</span>
                  <span className="font-bold">{fmt(calc.tilgungMonat * laufzeit * 12)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 shadow-crm-sm text-center">
                <p className="text-sm text-muted-foreground">Eigenanteil</p>
                <p className="text-xl font-bold">{fmt(calc.eigenanteilMonat)}</p>
                <p className="text-xs text-muted-foreground">× {laufzeit * 12} Monate</p>
                <Separator className="my-3" />
                <p className="text-2xl font-display font-bold text-foreground">= {fmt(calc.eigenanteilGesamt)}</p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 shadow-crm-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Ergebnis Eigenanteil</span>
                  <span className="text-sm text-muted-foreground">Ergebnis Vermögensaufbau</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{fmt(calc.eigenanteilGesamt)}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-lg font-bold">{fmt(calc.vermoegenswert)}</span>
                </div>
                <Separator className="my-3" />
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-card rounded-xl border border-border p-6 shadow-crm-sm">
                <h3 className="text-sm font-display font-bold text-foreground mb-4">Dein Immo-Wert nach {laufzeit} Jahren</h3>
                <div className="space-y-2 text-sm">
                  {calc.wertTabelle.map((w) => (
                    <div key={w.prozent} className={`flex justify-between p-2 rounded-lg ${w.prozent === wertentwicklung ? "bg-[hsl(35,95%,55%)]/10 font-bold" : ""}`}>
                      <span className={w.prozent === wertentwicklung ? "text-foreground" : "text-muted-foreground"}>
                        {w.prozent === wertentwicklung ? `Deine Angabe (${w.prozent}%):` : `${w.prozent} % Wertsteigerung:`}
                      </span>
                      <span>{fmt(w.wert)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 shadow-crm-sm">
                <h3 className="text-sm font-display font-bold text-foreground mb-4">Steuerliche Gesamtübersicht ({laufzeit} Jahre)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">AfA-Absetzung gesamt</span>
                    <span className="font-medium text-[hsl(var(--success))]">{fmt(calc.afaGesamt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grundsteuer gesamt</span>
                    <span className="font-medium">{fmt(calc.grundsteuerGesamt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mieteinnahmen gesamt</span>
                    <span className="font-medium">+ {fmt(calc.mieteinnahmenGesamt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Steuerersparnis gesamt</span>
                    <span className="font-medium text-[hsl(var(--success))]">+ {fmt(calc.steuerersparnisGesamt)}</span>
                  </div>
                  {calc.spekulationssteuerRelevant && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Spekulationssteuer</span>
                      <span className="font-medium text-destructive">- {fmt(calc.spekulationssteuer)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-card rounded-xl border border-border p-6 shadow-crm-sm text-center">
                <p className="text-sm text-muted-foreground mb-1">Dein Immo-Sparschwein</p>
                <div className="flex items-center justify-center gap-8 my-4">
                  <div>
                    <p className="text-2xl font-bold">{fmt(calc.eigenanteilGesamt)}</p>
                    <p className="text-xs text-muted-foreground">Eigenanteil</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[hsl(var(--success))]">-{fmt(Math.abs(calc.eigenanteilGesamt - calc.vermoegenswert))}</p>
                    <p className="text-xs text-muted-foreground">Mieteinnahmen, Wertzuwachs, Steuervorteile</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[hsl(35,95%,55%)]/10 border border-[hsl(35,95%,55%)]/20">
                  <p className="text-3xl font-display font-bold text-[hsl(35,95%,55%)]">{fmt(calc.vermoegenswert)}</p>
                  <p className="text-sm font-medium text-foreground mt-1">Vermögenswert</p>
                  <p className="text-xs text-muted-foreground">{laufzeit} Jahre</p>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 shadow-crm-sm text-center">
                <p className="text-sm text-muted-foreground">Deine Immo-Investition</p>
                <p className="text-xs text-muted-foreground mt-1">Dein Eigenanteil nach {laufzeit} Jahren:</p>
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
