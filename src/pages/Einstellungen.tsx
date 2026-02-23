import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { useUserRole } from "@/contexts/UserRoleContext";
import EinstellungenEigentuemer from "@/components/EinstellungenEigentuemer";
import EinstellungenEntwickler from "@/components/EinstellungenEntwickler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Camera, Save, Key, Eye, EyeOff, Edit3, Upload, CheckCircle2, Clock, AlertCircle, FileText, X, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

interface ProfileData {
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  mobilnummer: string;
  geburtsdatum: string;
  firmenname: string;
  rechtsform: string;
  gewerbeanmeldung: string;
  steuernummer: string;
  ustId: string;
  finanzamt: string;
  iban: string;
  bic: string;
  bankname: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  land: string;
  bio: string;
}

const initialProfile: ProfileData = {
  vorname: "Christian",
  nachname: "Peetz",
  email: "c.peetz@imondu.de",
  telefon: "+49 89 1234567",
  mobilnummer: "+49 170 1234567",
  geburtsdatum: "1985-06-15",
  firmenname: "IMONDU GmbH",
  rechtsform: "GmbH",
  gewerbeanmeldung: "Ja – liegt vor",
  steuernummer: "123/456/78901",
  ustId: "DE123456789",
  finanzamt: "Finanzamt München III",
  iban: "DE89 3704 0044 0532 0130 00",
  bic: "COBADEFFXXX",
  bankname: "Commerzbank",
  strasse: "Leopoldstraße",
  hausnummer: "42",
  plz: "80802",
  ort: "München",
  land: "Deutschland",
  bio: "Vertrieb & Partnermanagement bei IMONDU.",
};

// --- Required documents ---
interface RequiredDoc {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

const REQUIRED_DOCUMENTS: RequiredDoc[] = [
  { id: "personalausweis", label: "Personalausweiskopie", description: "Vorder- und Rückseite deines gültigen Personalausweises oder Reisepasses", required: true },
  { id: "gewerbeanmeldung", label: "Gewerbeanmeldung", description: "Aktuelle Gewerbeanmeldung deines Unternehmens", required: true },
  { id: "fuehrungszeugnis", label: "Polizeiliches Führungszeugnis", description: "Aktuelles polizeiliches Führungszeugnis (nicht älter als 3 Monate)", required: true },
  { id: "vp-vertrag", label: "Vertriebspartnervertrag", description: "Unterschriebener Vertriebspartnervertrag mit Imondu", required: true },
  { id: "agb", label: "AGB", description: "Bestätigung der Allgemeinen Geschäftsbedingungen", required: true },
  { id: "verschwiegenheit", label: "Verschwiegenheitsvereinbarung", description: "Unterschriebene Verschwiegenheitsvereinbarung (NDA)", required: true },
  { id: "dsgvo", label: "DSGVO-Vereinbarung", description: "Datenschutz-Grundverordnung Einwilligung und Auftragsverarbeitung", required: true },
];

// --- Onboarding steps ---
interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  tab: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: "passwort", label: "Passwort ändern", description: "Ändere dein initiales Passwort", tab: "email" },
  { id: "profil", label: "Profil ausfüllen", description: "Vervollständige deine persönlichen Daten", tab: "profil" },
  { id: "email_setup", label: "E-Mail einrichten", description: "Richte deine geschäftliche E-Mail ein", tab: "email" },
  { id: "kalender", label: "Kalender verbinden", description: "Verbinde deinen Kalender", tab: "kalender" },
  { id: "gewerbe", label: "Gewerbedaten hinterlegen", description: "Trage deine Unternehmensdaten ein", tab: "gewerbe" },
  { id: "unterlagen", label: "Unterlagen hochladen", description: "Lade alle Pflichtdokumente hoch", tab: "unterlagen" },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

function SectionBlock({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-display font-bold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
      <Separator className="mt-6" />
    </div>
  );
}

export default function Einstellungen() {
  const { currentRoleId } = useUserRole();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [profilbild, setProfilbild] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailPasswort, setEmailPasswort] = useState("");
  const [emailPasswortNeu, setEmailPasswortNeu] = useState("");
  const [emailPasswortNeuConfirm, setEmailPasswortNeuConfirm] = useState("");
  const [activeTab, setActiveTab] = useState("profil");

  const [signature, setSignature] = useState(`<p>Mit freundlichen Grüßen</p>
<p><strong>${initialProfile.vorname} ${initialProfile.nachname}</strong><br/>
Vertriebsberater | Imondu GmbH<br/>
📞 ${initialProfile.mobilnummer}<br/>
✉️ m.mueller@imondu.de<br/>
🌐 www.imondu.de</p>
<p style="color: #999; font-size: 11px;">Imondu GmbH | Musterstraße 1 | 10115 Berlin<br/>
Geschäftsführer: Max Mustermann | AG Berlin HRB 123456</p>`);
  const [signatureEnabled, setSignatureEnabled] = useState(true);

  const [calendarConnected, setCalendarConnected] = useState<Record<string, boolean>>({});
  const [syncOptions, setSyncOptions] = useState<Record<string, boolean>>({
    "Gebuchte Termine automatisch eintragen": true,
    "Follow-up Erinnerungen": true,
    "Powerdialer-Termine": true,
    "Bidirektionale Sync": true,
  });

  // Document upload state
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { name: string; date: string; status: "uploaded" | "pending" | "rejected" }>>({});

  // Onboarding state
  const [completedSteps, setCompletedSteps] = useState<string[]>(["passwort"]);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  // Role-specific settings for Eigentümer and Entwickler
  if (currentRoleId === "eigentuemer") {
    return (
      <CRMLayout>
        <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
          <EinstellungenEigentuemer />
        </div>
      </CRMLayout>
    );
  }

  if (currentRoleId === "entwickler") {
    return (
      <CRMLayout>
        <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
          <EinstellungenEntwickler />
        </div>
      </CRMLayout>
    );
  }

  const onboardingProgress = Math.round((completedSteps.length / ONBOARDING_STEPS.length) * 100);
  const allOnboardingDone = completedSteps.length === ONBOARDING_STEPS.length;

  const ionosEmail = `${profile.vorname.trim()[0]?.toLowerCase() || "x"}.${profile.nachname.trim().toLowerCase().replace(/\s+/g, "-").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")}@imondu.de`;

  const update = (field: keyof ProfileData, value: string) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilbild(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    if (!emailPasswortNeu || emailPasswortNeu !== emailPasswortNeuConfirm) {
      toast({ title: "Fehler", description: "Die Passwörter stimmen nicht überein." });
      return;
    }
    toast({ title: "Passwort geändert ✓", description: "Dein E-Mail-Passwort wurde erfolgreich aktualisiert." });
    setEmailPasswort("");
    setEmailPasswortNeu("");
    setEmailPasswortNeuConfirm("");
  };

  const handleSave = () => {
    toast({ title: "Einstellungen gespeichert ✓", description: "Deine Daten wurden aktualisiert." });
  };

  const handleDocUpload = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocs((prev) => ({
        ...prev,
        [docId]: { name: file.name, date: new Date().toLocaleDateString("de-DE"), status: "pending" },
      }));
      toast({ title: "Dokument hochgeladen", description: `„${file.name}" wurde erfolgreich hochgeladen und wird geprüft.` });
    }
  };

  const handleRemoveDoc = (docId: string) => {
    setUploadedDocs((prev) => {
      const next = { ...prev };
      delete next[docId];
      return next;
    });
    toast({ title: "Dokument entfernt", description: "Das Dokument wurde entfernt." });
  };

  const uploadedCount = REQUIRED_DOCUMENTS.filter((d) => uploadedDocs[d.id]).length;
  const allDocsUploaded = uploadedCount === REQUIRED_DOCUMENTS.length;

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
       <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Allgemein</h1>
        </div>

        {/* ── ONBOARDING BANNER ── */}
        {!onboardingDismissed && !allOnboardingDone && (
          <div className="mb-6 rounded-xl border border-primary/20 bg-card shadow-crm-md overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg gradient-brand flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-display font-bold text-foreground">Willkommen bei Imondu!</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Bitte vervollständige dein Profil, um das Backoffice nutzen zu können.</p>
                  </div>
                </div>
                <button onClick={() => setOnboardingDismissed(true)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Progress value={onboardingProgress} className="h-2 flex-1" />
                <span className="text-xs font-semibold text-primary whitespace-nowrap">{completedSteps.length} / {ONBOARDING_STEPS.length}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {ONBOARDING_STEPS.map((step) => {
                  const done = completedSteps.includes(step.id);
                  return (
                    <button
                      key={step.id}
                      onClick={() => { setActiveTab(step.tab); }}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                        done
                          ? "border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5"
                          : "border-border hover:border-primary/30 hover:bg-primary/5"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-[hsl(var(--success))] shrink-0" />
                      ) : (
                        <div className="h-4.5 w-4.5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold truncate ${done ? "text-[hsl(var(--success))]" : "text-foreground"}`}>{step.label}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{step.description}</p>
                      </div>
                      {!done && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Onboarding complete banner */}
        {allOnboardingDone && !onboardingDismissed && (
          <div className="mb-6 rounded-xl border border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
              <div>
                <p className="text-sm font-semibold text-foreground">Einrichtung abgeschlossen!</p>
                <p className="text-xs text-muted-foreground">Du kannst jetzt alle Funktionen des Backoffice nutzen.</p>
              </div>
            </div>
            <button onClick={() => setOnboardingDismissed(true)} className="text-muted-foreground hover:text-foreground p-1">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0 h-auto gap-0 flex-wrap">
            {[
              { value: "profil", label: "Profil" },
              { value: "email", label: "E-Mail" },
              { value: "kalender", label: "Kalender" },
              { value: "gewerbe", label: "Gewerbedaten" },
              { value: "finanzen", label: "Steuer & Bank" },
              { value: "unterlagen", label: "Unterlagen" },
              { value: "benachrichtigungen", label: "Benachrichtigungen" },
              { value: "protokoll", label: "Protokoll" },
              { value: "sicherheit", label: "Sicherheit" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground"
              >
                {tab.label}
                {tab.value === "unterlagen" && !allDocsUploaded && (
                  <span className="ml-1.5 h-2 w-2 rounded-full bg-[hsl(var(--warning))] inline-block" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <p className="text-xs text-muted-foreground mt-3 mb-6">Diese Einstellungen gelten nur für dich.</p>

          {/* ── PROFIL ── */}
          <TabsContent value="profil" className="space-y-6 mt-0">
            <Separator />
            <SectionBlock title="Profil" description="Deine persönlichen Stammdaten.">
              <div className="space-y-5">
                <Field label="Profilbild">
                  <div className="relative group w-20 h-20">
                    <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                      {profilbild ? (
                        <img src={profilbild} alt="Profilbild" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full gradient-brand flex items-center justify-center text-white text-xl font-display font-bold">
                          {profile.vorname[0]}{profile.nachname[0]}
                        </div>
                      )}
                    </div>
                    <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                      <Camera className="h-4 w-4 text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg">
                  <Field label="Vorname">
                    <Input value={profile.vorname} onChange={(e) => update("vorname", e.target.value)} />
                  </Field>
                  <Field label="Nachname">
                    <Input value={profile.nachname} onChange={(e) => update("nachname", e.target.value)} />
                  </Field>
                </div>

                <div className="max-w-lg">
                  <Field label="E-Mail">
                    <Input type="email" value={profile.email} onChange={(e) => update("email", e.target.value)} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg">
                  <Field label="Telefon">
                    <Input value={profile.telefon} onChange={(e) => update("telefon", e.target.value)} />
                  </Field>
                  <Field label="Mobilnummer">
                    <Input value={profile.mobilnummer} onChange={(e) => update("mobilnummer", e.target.value)} />
                  </Field>
                </div>

                <div className="max-w-lg">
                  <Field label="Geburtsdatum">
                    <Input type="date" value={profile.geburtsdatum} onChange={(e) => update("geburtsdatum", e.target.value)} />
                  </Field>
                </div>

                <div className="max-w-lg">
                  <Field label="Über mich">
                    <Textarea value={profile.bio} onChange={(e) => update("bio", e.target.value)} rows={3} className="resize-none" />
                  </Field>
                </div>
              </div>
            </SectionBlock>

            <SectionBlock title="Adresse" description="Deine Geschäftsadresse.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg">
                <Field label="Straße">
                  <Input value={profile.strasse} onChange={(e) => update("strasse", e.target.value)} />
                </Field>
                <Field label="Hausnummer">
                  <Input value={profile.hausnummer} onChange={(e) => update("hausnummer", e.target.value)} />
                </Field>
                <Field label="PLZ">
                  <Input value={profile.plz} onChange={(e) => update("plz", e.target.value)} />
                </Field>
                <Field label="Ort">
                  <Input value={profile.ort} onChange={(e) => update("ort", e.target.value)} />
                </Field>
                <Field label="Land">
                  <Input value={profile.land} onChange={(e) => update("land", e.target.value)} />
                </Field>
              </div>
            </SectionBlock>

            <div className="flex justify-end pt-2 pb-8">
              <Button onClick={() => { handleSave(); if (!completedSteps.includes("profil")) setCompletedSteps((p) => [...p, "profil"]); }} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90 px-8">
                <Save className="h-4 w-4" /> Speichern
              </Button>
            </div>
          </TabsContent>

          {/* ── E-MAIL ── */}
          <TabsContent value="email" className="space-y-6 mt-0">
            <Separator />
            <SectionBlock title="E-Mail-Konto" description="Dein geschäftliches E-Mail-Konto bei IONOS.">
              <div className="max-w-lg space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/15">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Deine geschäftliche E-Mail-Adresse</p>
                  <p className="text-sm font-mono font-semibold text-primary">{ionosEmail}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Schema: erster Buchstabe Vorname + Punkt + Nachname @imondu.de
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">IMAP Server</p>
                    <p className="text-sm text-foreground">imap.ionos.de</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">SMTP Server</p>
                    <p className="text-sm text-foreground">smtp.ionos.de</p>
                  </div>
                </div>
              </div>
            </SectionBlock>

            <SectionBlock title="Passwort ändern" description="Ändere das Passwort deines E-Mail-Kontos.">
              <div className="grid grid-cols-1 gap-4 max-w-sm">
                <Field label="Aktuelles Passwort">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={emailPasswort}
                      onChange={(e) => setEmailPasswort(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
                <Field label="Neues Passwort">
                  <Input type="password" value={emailPasswortNeu} onChange={(e) => setEmailPasswortNeu(e.target.value)} placeholder="Neues Passwort eingeben" />
                </Field>
                <Field label="Neues Passwort bestätigen">
                  <Input type="password" value={emailPasswortNeuConfirm} onChange={(e) => setEmailPasswortNeuConfirm(e.target.value)} placeholder="Neues Passwort wiederholen" />
                </Field>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  disabled={!emailPasswort || !emailPasswortNeu || !emailPasswortNeuConfirm}
                  onClick={handlePasswordChange}
                >
                  <Key className="h-3.5 w-3.5 mr-1.5" /> Passwort ändern
                </Button>
              </div>
            </SectionBlock>

            <SectionBlock title="E-Mail-Signatur" description="Wird automatisch an jede ausgehende E-Mail angehängt.">
              <div className="max-w-lg space-y-4">
                <div className="flex items-center gap-3">
                  <Switch checked={signatureEnabled} onCheckedChange={setSignatureEnabled} />
                  <span className="text-sm text-foreground">{signatureEnabled ? "Signatur aktiv" : "Signatur deaktiviert"}</span>
                </div>

                <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Vorschau</p>
                  <div className="text-xs text-foreground" dangerouslySetInnerHTML={{ __html: signature }} />
                </div>

                <Field label="HTML bearbeiten">
                  <Textarea value={signature} onChange={(e) => setSignature(e.target.value)} className="min-h-[120px] font-mono text-xs" />
                </Field>
              </div>
            </SectionBlock>

            <div className="flex justify-end pt-2 pb-8">
              <Button onClick={() => { handleSave(); if (!completedSteps.includes("email_setup")) setCompletedSteps((p) => [...p, "email_setup"]); }} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90 px-8">
                <Save className="h-4 w-4" /> Speichern
              </Button>
            </div>
          </TabsContent>

          {/* ── KALENDER ── */}
          <TabsContent value="kalender" className="space-y-6 mt-0">
            <Separator />
            <SectionBlock title="Kalender-Verbindung" description="Verbinde deinen Kalender für automatische Synchronisation.">
              <div className="space-y-3 max-w-lg">
                {[
                  { name: "Google Calendar", id: "google" },
                  { name: "Microsoft Outlook", id: "outlook" },
                  { name: "Apple Kalender", id: "apple" },
                ].map((cal) => (
                  <div key={cal.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20">
                    <div>
                      <p className="text-sm font-medium text-foreground">{cal.name}</p>
                      <p className="text-xs text-muted-foreground">{calendarConnected[cal.id] ? "Verbunden" : "Nicht verbunden"}</p>
                    </div>
                    <Button
                      variant={calendarConnected[cal.id] ? "outline" : "default"}
                      size="sm"
                      onClick={() => {
                        const wasConnected = calendarConnected[cal.id];
                        setCalendarConnected((prev) => ({ ...prev, [cal.id]: !prev[cal.id] }));
                        toast({ title: wasConnected ? `${cal.name} getrennt` : `${cal.name} verbunden ✓` });
                        if (!wasConnected && !completedSteps.includes("kalender")) {
                          setCompletedSteps((p) => [...p, "kalender"]);
                        }
                      }}
                    >
                      {calendarConnected[cal.id] ? "Trennen" : "Verbinden"}
                    </Button>
                  </div>
                ))}
              </div>
            </SectionBlock>

            <SectionBlock title="Synchronisation" description="Lege fest, welche Termine synchronisiert werden.">
              <div className="space-y-3 max-w-lg">
                {[
                  { label: "Gebuchte Termine automatisch eintragen", desc: "Neue Termine werden automatisch in deinen Kalender eingetragen" },
                  { label: "Follow-up Erinnerungen", desc: "Erinnerungen für geplante Follow-ups" },
                  { label: "Powerdialer-Termine", desc: "Anrufblöcke aus dem Powerdialer werden als Termine eingetragen" },
                  { label: "Bidirektionale Sync", desc: "Änderungen im Kalender werden ins CRM übernommen" },
                ].map((opt) => (
                  <label key={opt.label} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                    <Checkbox
                      checked={syncOptions[opt.label] ?? true}
                      onCheckedChange={() => setSyncOptions((prev) => ({ ...prev, [opt.label]: !(prev[opt.label] ?? true) }))}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </SectionBlock>

            <div className="flex justify-end pt-2 pb-8">
              <Button onClick={handleSave} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90 px-8">
                <Save className="h-4 w-4" /> Speichern
              </Button>
            </div>
          </TabsContent>

          {/* ── GEWERBEDATEN ── */}
          <TabsContent value="gewerbe" className="space-y-6 mt-0">
            <Separator />
            <SectionBlock title="Gewerbedaten" description="Deine Unternehmensdaten für Gutschriften und Provisionsabrechnungen.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg">
                <Field label="Firmenname">
                  <Input value={profile.firmenname} onChange={(e) => update("firmenname", e.target.value)} />
                </Field>
                <Field label="Rechtsform">
                  <Input value={profile.rechtsform} onChange={(e) => update("rechtsform", e.target.value)} />
                </Field>
                <Field label="Gewerbeanmeldung" hint="Status deiner Gewerbeanmeldung">
                  <Input value={profile.gewerbeanmeldung} onChange={(e) => update("gewerbeanmeldung", e.target.value)} />
                </Field>
              </div>
            </SectionBlock>

            <div className="flex justify-end pt-2 pb-8">
              <Button onClick={() => { handleSave(); if (!completedSteps.includes("gewerbe")) setCompletedSteps((p) => [...p, "gewerbe"]); }} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90 px-8">
                <Save className="h-4 w-4" /> Speichern
              </Button>
            </div>
          </TabsContent>

          {/* ── STEUER & BANK ── */}
          <TabsContent value="finanzen" className="space-y-6 mt-0">
            <Separator />
            <SectionBlock title="Steuerdaten" description="Diese Angaben werden für deine Provisionsabrechnungen benötigt.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg">
                <Field label="Steuernummer">
                  <Input value={profile.steuernummer} onChange={(e) => update("steuernummer", e.target.value)} />
                </Field>
                <Field label="USt-IdNr.">
                  <Input value={profile.ustId} onChange={(e) => update("ustId", e.target.value)} />
                </Field>
                <Field label="Zuständiges Finanzamt">
                  <Input value={profile.finanzamt} onChange={(e) => update("finanzamt", e.target.value)} />
                </Field>
              </div>
            </SectionBlock>

            <SectionBlock title="Bankverbindung" description="Deine Bankdaten für Provisionsauszahlungen.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg">
                <Field label="IBAN">
                  <Input value={profile.iban} onChange={(e) => update("iban", e.target.value)} />
                </Field>
                <Field label="BIC">
                  <Input value={profile.bic} onChange={(e) => update("bic", e.target.value)} />
                </Field>
                <Field label="Bankname">
                  <Input value={profile.bankname} onChange={(e) => update("bankname", e.target.value)} />
                </Field>
              </div>
            </SectionBlock>

            <div className="flex justify-end pt-2 pb-8">
              <Button onClick={handleSave} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90 px-8">
                <Save className="h-4 w-4" /> Speichern
              </Button>
            </div>
          </TabsContent>

          {/* ── UNTERLAGEN ── */}
          <TabsContent value="unterlagen" className="space-y-6 mt-0">
            <Separator />

            {/* Upload progress summary */}
            <div className="rounded-lg border border-border bg-secondary/20 p-4 max-w-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">Pflichtdokumente</p>
                <Badge variant={allDocsUploaded ? "default" : "outline"} className={allDocsUploaded ? "bg-[hsl(var(--success))] text-white border-0" : ""}>
                  {uploadedCount} / {REQUIRED_DOCUMENTS.length} hochgeladen
                </Badge>
              </div>
              <Progress value={(uploadedCount / REQUIRED_DOCUMENTS.length) * 100} className="h-2" />
              {!allDocsUploaded && (
                <p className="text-[10px] text-muted-foreground mt-2">
                  <AlertCircle className="h-3 w-3 inline mr-1 text-[hsl(var(--warning))]" />
                  Bitte lade alle Pflichtdokumente hoch, um das Backoffice vollständig nutzen zu können.
                </p>
              )}
            </div>

            <SectionBlock title="Dokumente hochladen" description="Lade die folgenden Unterlagen hoch. Akzeptierte Formate: PDF, JPG, PNG (max. 10 MB).">
              <div className="space-y-3 max-w-lg">
                {REQUIRED_DOCUMENTS.map((doc) => {
                  const uploaded = uploadedDocs[doc.id];
                  return (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        uploaded
                          ? uploaded.status === "uploaded"
                            ? "border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5"
                            : uploaded.status === "rejected"
                            ? "border-destructive/30 bg-destructive/5"
                            : "border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/5"
                          : "border-border bg-card hover:border-primary/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                            uploaded
                              ? uploaded.status === "uploaded"
                                ? "bg-[hsl(var(--success))]/10"
                                : uploaded.status === "rejected"
                                ? "bg-destructive/10"
                                : "bg-[hsl(var(--warning))]/10"
                              : "bg-secondary"
                          }`}>
                            {uploaded ? (
                              uploaded.status === "uploaded" ? <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                              : uploaded.status === "rejected" ? <AlertCircle className="h-4 w-4 text-destructive" />
                              : <Clock className="h-4 w-4 text-[hsl(var(--warning))]" />
                            ) : (
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-foreground">{doc.label}</p>
                              {doc.required && !uploaded && (
                                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-destructive/30 text-destructive">Pflicht</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
                            {uploaded && (
                              <div className="flex items-center gap-2 mt-1.5">
                                <p className="text-[10px] text-muted-foreground">
                                  📄 {uploaded.name} · {uploaded.date}
                                </p>
                                <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${
                                  uploaded.status === "uploaded"
                                    ? "border-[hsl(var(--success))]/30 text-[hsl(var(--success))]"
                                    : uploaded.status === "rejected"
                                    ? "border-destructive/30 text-destructive"
                                    : "border-[hsl(var(--warning))]/30 text-[hsl(var(--warning))]"
                                }`}>
                                  {uploaded.status === "uploaded" ? "Bestätigt" : uploaded.status === "rejected" ? "Abgelehnt" : "In Prüfung"}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {uploaded && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveDoc(doc.id)}>
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <label>
                            <Button variant="outline" size="sm" className="pointer-events-none h-8 text-xs gap-1.5">
                              <Upload className="h-3 w-3" />
                              {uploaded ? "Ersetzen" : "Hochladen"}
                            </Button>
                            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleDocUpload(doc.id, e)} />
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionBlock>

            {allDocsUploaded && (
              <div className="flex justify-end pt-2 pb-8">
                <Button
                  onClick={() => {
                    if (!completedSteps.includes("unterlagen")) setCompletedSteps((p) => [...p, "unterlagen"]);
                    toast({ title: "Unterlagen vollständig ✓", description: "Alle Pflichtdokumente wurden hochgeladen." });
                  }}
                  className="gap-2 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90 px-8"
                >
                  <CheckCircle2 className="h-4 w-4" /> Unterlagen bestätigen
                </Button>
              </div>
            )}
          </TabsContent>

          {/* ── BENACHRICHTIGUNGEN ── */}
          <TabsContent value="benachrichtigungen" className="space-y-6 mt-0">
            <Separator />
            <SectionBlock title="Wie du benachrichtigt wirst" description="Wähle aus, wo du deine Benachrichtigungen sehen möchtest.">
              <div className="max-w-lg space-y-3">
                {[
                  { id: "email_notif", label: "E-Mails", desc: "Wird an deine E-Mail-Adresse gesendet.", default: true },
                  { id: "feed", label: "Feed (Glockensymbol)", desc: "Werden in der Navigationsleiste als Glockensymbol angezeigt.", default: true },
                  { id: "browser", label: "Browser", desc: "Erscheinen auf deinem Bildschirm, wenn du nicht im CRM aktiv bist, die Website aber in einem Browser-Tab geöffnet ist.", default: false },
                  { id: "popup", label: "Pop-up", desc: "Erscheinen für wenige Sekunden auf deinem Bildschirm, wenn du im CRM aktiv bist.", default: true },
                ].map((n) => (
                  <label key={n.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                    <Switch defaultChecked={n.default} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{n.label}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </SectionBlock>

            <SectionBlock title="Worüber du benachrichtigt wirst" description="Wähle aus, welche Themen dir wichtig sind.">
              <div className="max-w-lg space-y-3">
                {[
                  { id: "leads", label: "Neue Leads", desc: "Wenn dir ein neuer Lead zugewiesen wird." },
                  { id: "termine", label: "Termine & Follow-ups", desc: "Erinnerungen an bevorstehende Termine." },
                  { id: "pipeline", label: "Pipeline-Änderungen", desc: "Wenn ein Lead die Pipeline-Stufe wechselt." },
                  { id: "provisionen", label: "Provisionen & Abrechnungen", desc: "Neue Gutschriften oder Provisionsabrechnungen." },
                  { id: "team", label: "Team-Aktivitäten", desc: "Wenn Teampartner Aktionen durchführen." },
                  { id: "system", label: "System-Updates", desc: "Wartungsarbeiten, neue Features und Ankündigungen." },
                ].map((n) => (
                  <label key={n.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                    <Checkbox defaultChecked className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{n.label}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </SectionBlock>

            <div className="flex justify-end pt-2 pb-8">
              <Button onClick={handleSave} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90 px-8">
                <Save className="h-4 w-4" /> Speichern
              </Button>
            </div>
          </TabsContent>

          {/* ── PROTOKOLL ── */}
          <TabsContent value="protokoll" className="space-y-6 mt-0">
            <Separator />
            <SectionBlock title="Protokoll" description="Zeige Benutzeraktionen an, die in deinem Account durchgeführt wurden.">
              <div className="space-y-4">
                <Tabs defaultValue="anmeldeverlauf" className="w-full">
                  <TabsList className="w-full justify-start bg-secondary/30 rounded-lg">
                    <TabsTrigger value="alle" className="text-xs">Alle Protokolle</TabsTrigger>
                    <TabsTrigger value="anmeldeverlauf" className="text-xs">Anmeldeverlauf</TabsTrigger>
                    <TabsTrigger value="sicherheit_log" className="text-xs">Sicherheitsaktivitäten</TabsTrigger>
                  </TabsList>

                  <TabsContent value="alle" className="mt-4">
                    <div className="bg-card rounded-lg border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-secondary/30">
                            <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Kategorie</th>
                            <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Aktion</th>
                            <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Datum</th>
                            <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Quelle</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { kat: "Anmeldung", aktion: "Anmeldung erfolgreich", datum: "20. Feb. 2026 09:12 CET", quelle: "192.168.1.42" },
                            { kat: "Einstellungen", aktion: "Profil aktualisiert", datum: "19. Feb. 2026 16:30 CET", quelle: "192.168.1.42" },
                            { kat: "Anmeldung", aktion: "Anmeldung erfolgreich", datum: "19. Feb. 2026 08:45 CET", quelle: "10.0.0.15" },
                            { kat: "Sicherheit", aktion: "Passwort geändert", datum: "18. Feb. 2026 14:22 CET", quelle: "192.168.1.42" },
                            { kat: "Anmeldung", aktion: "Anmeldung erfolgreich", datum: "18. Feb. 2026 08:30 CET", quelle: "192.168.1.42" },
                          ].map((row, i) => (
                            <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                              <td className="py-2.5 px-4 text-sm text-foreground">{row.kat}</td>
                              <td className="py-2.5 px-4 text-sm text-foreground">{row.aktion}</td>
                              <td className="py-2.5 px-4 text-sm text-muted-foreground">{row.datum}</td>
                              <td className="py-2.5 px-4 text-xs font-mono text-muted-foreground">{row.quelle}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="anmeldeverlauf" className="mt-4">
                    <div className="bg-card rounded-lg border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-secondary/30">
                            <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Aktion</th>
                            <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Datum der Änderung</th>
                            <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Quelle</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { aktion: "Anmeldung erfolgreich", datum: "20. Feb. 2026 09:12 CET", quelle: "192.168.1.42" },
                            { aktion: "Anmeldung erfolgreich", datum: "19. Feb. 2026 08:45 CET", quelle: "10.0.0.15" },
                            { aktion: "Anmeldung erfolgreich", datum: "18. Feb. 2026 08:30 CET", quelle: "192.168.1.42" },
                            { aktion: "Anmeldung erfolgreich", datum: "17. Feb. 2026 09:01 CET", quelle: "192.168.1.42" },
                            { aktion: "Anmeldung fehlgeschlagen", datum: "16. Feb. 2026 23:15 CET", quelle: "85.214.132.7" },
                          ].map((row, i) => (
                            <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                              <td className="py-2.5 px-4 text-sm text-foreground">{row.aktion}</td>
                              <td className="py-2.5 px-4 text-sm text-muted-foreground">{row.datum}</td>
                              <td className="py-2.5 px-4 text-xs font-mono text-muted-foreground">{row.quelle}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="sicherheit_log" className="mt-4">
                    <div className="bg-card rounded-lg border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-secondary/30">
                            <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Aktion</th>
                            <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Datum</th>
                            <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Quelle</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { aktion: "Passwort geändert", datum: "18. Feb. 2026 14:22 CET", quelle: "192.168.1.42" },
                            { aktion: "E-Mail-Adresse aktualisiert", datum: "10. Feb. 2026 11:05 CET", quelle: "192.168.1.42" },
                          ].map((row, i) => (
                            <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                              <td className="py-2.5 px-4 text-sm text-foreground">{row.aktion}</td>
                              <td className="py-2.5 px-4 text-sm text-muted-foreground">{row.datum}</td>
                              <td className="py-2.5 px-4 text-xs font-mono text-muted-foreground">{row.quelle}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </SectionBlock>
          </TabsContent>

          {/* ── SICHERHEIT ── */}
          <TabsContent value="sicherheit" className="space-y-6 mt-0">
            <Separator />
            <SectionBlock title="Zwei-Faktor-Authentifizierung" description="Schütze deinen Account mit einem zusätzlichen Sicherheitsfaktor.">
              <div className="max-w-lg space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20">
                  <div>
                    <p className="text-sm font-medium text-foreground">Authenticator App</p>
                    <p className="text-xs text-muted-foreground">Nicht eingerichtet</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "2FA", description: "Diese Funktion wird bald verfügbar sein." })}>
                    Einrichten
                  </Button>
                </div>
              </div>
            </SectionBlock>

            <SectionBlock title="Sitzungen" description="Verwalte deine aktiven Anmeldungen.">
              <div className="max-w-lg">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20">
                  <div>
                    <p className="text-sm font-medium text-foreground">Aktuelle Sitzung</p>
                    <p className="text-xs text-muted-foreground">Dieses Gerät · Aktiv</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] mr-1.5" />Aktiv
                  </Badge>
                </div>
              </div>
            </SectionBlock>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </CRMLayout>
  );
}
