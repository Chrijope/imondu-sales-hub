import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Camera, Save, Key, Eye, EyeOff, Edit3 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

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
  vorname: "Max",
  nachname: "Müller",
  email: "max.mueller@example.com",
  telefon: "+49 89 1234567",
  mobilnummer: "+49 170 1234567",
  geburtsdatum: "1985-06-15",
  firmenname: "Müller Immobilien UG",
  rechtsform: "UG (haftungsbeschränkt)",
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
  bio: "Erfahrener Vertriebspartner mit Schwerpunkt auf Immobilien im Großraum München.",
};

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
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [profilbild, setProfilbild] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailPasswort, setEmailPasswort] = useState("");
  const [emailPasswortNeu, setEmailPasswortNeu] = useState("");
  const [emailPasswortNeuConfirm, setEmailPasswortNeuConfirm] = useState("");

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

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Allgemein</h1>
        </div>

        <Tabs defaultValue="profil" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0 h-auto gap-0">
            {[
              { value: "profil", label: "Profil" },
              { value: "email", label: "E-Mail" },
              { value: "kalender", label: "Kalender" },
              { value: "gewerbe", label: "Gewerbedaten" },
              { value: "finanzen", label: "Steuer & Bank" },
              { value: "sicherheit", label: "Sicherheit" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground"
              >
                {tab.label}
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
              <Button onClick={handleSave} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90 px-8">
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
              <Button onClick={handleSave} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90 px-8">
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
                        setCalendarConnected((prev) => ({ ...prev, [cal.id]: !prev[cal.id] }));
                        toast({ title: calendarConnected[cal.id] ? `${cal.name} getrennt` : `${cal.name} verbunden ✓` });
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
              <Button onClick={handleSave} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90 px-8">
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
    </CRMLayout>
  );
}
