import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Building, FileText, MapPin, Camera, Save, Info, Calendar, Mail, Key, Eye, EyeOff, RefreshCw, CheckCircle2, Edit3 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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

function SectionCard({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-crm-sm border border-border">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-1 rounded-full gradient-brand" />
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-display font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
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

  // Signature state
  const [signature, setSignature] = useState(`<p>Mit freundlichen Grüßen</p>
<p><strong>${initialProfile.vorname} ${initialProfile.nachname}</strong><br/>
Vertriebsberater | Imondu GmbH<br/>
📞 ${initialProfile.mobilnummer}<br/>
✉️ m.mueller@imondu.de<br/>
🌐 www.imondu.de</p>
<p style="color: #999; font-size: 11px;">Imondu GmbH | Musterstraße 1 | 10115 Berlin<br/>
Geschäftsführer: Max Mustermann | AG Berlin HRB 123456</p>`);
  const [signatureEnabled, setSignatureEnabled] = useState(true);

  const ionosEmail = `${profile.vorname.trim()[0]?.toLowerCase() || "x"}.${profile.nachname.trim().toLowerCase().replace(/\s+/g, "-").replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss")}@imondu.de`;

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

  const handleSave = () => {
    toast({ title: "Einstellungen gespeichert ✓", description: "Deine Stammdaten wurden aktualisiert." });
  };

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in max-w-4xl">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-1 rounded-full gradient-brand" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Einstellungen</h1>
          <p className="text-sm text-muted-foreground mt-1">Stammdaten, Gewerbedaten und Steuerinformationen verwalten</p>
        </div>

        {/* Hinweis */}
        <div className="gradient-brand-subtle border border-primary/15 rounded-xl p-4 flex items-start gap-3">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Diese Angaben werden für die Erstellung deiner <strong className="text-foreground">Gutschriften</strong> benötigt. 
            Bitte halte sie stets aktuell, damit deine Provisionsabrechnungen korrekt erstellt werden können.
          </p>
        </div>

        {/* Profilbild + Name */}
        <SectionCard icon={User} title="Persönliche Daten">
          <div className="flex items-start gap-6 mb-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-xl overflow-hidden border-2 border-border shadow-crm-sm bg-muted flex items-center justify-center">
                {profilbild ? (
                  <img src={profilbild} alt="Profilbild" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full gradient-brand flex items-center justify-center text-white text-2xl font-display font-bold">
                    {profile.vorname[0]}{profile.nachname[0]}
                  </div>
                )}
              </div>
              <label className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <Field label="Vorname">
                <Input value={profile.vorname} onChange={(e) => update("vorname", e.target.value)} />
              </Field>
              <Field label="Nachname">
                <Input value={profile.nachname} onChange={(e) => update("nachname", e.target.value)} />
              </Field>
              <Field label="E-Mail">
                <Input type="email" value={profile.email} onChange={(e) => update("email", e.target.value)} />
              </Field>
              <Field label="Geburtsdatum">
                <Input type="date" value={profile.geburtsdatum} onChange={(e) => update("geburtsdatum", e.target.value)} />
              </Field>
              <Field label="Telefon">
                <Input value={profile.telefon} onChange={(e) => update("telefon", e.target.value)} />
              </Field>
              <Field label="Mobilnummer">
                <Input value={profile.mobilnummer} onChange={(e) => update("mobilnummer", e.target.value)} />
              </Field>
            </div>
          </div>
          <Field label="Über mich">
            <Textarea value={profile.bio} onChange={(e) => update("bio", e.target.value)} rows={3} className="resize-none" />
          </Field>
        </SectionCard>

        {/* Adresse */}
        <SectionCard icon={MapPin} title="Adresse">
          <div className="grid grid-cols-2 gap-4">
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
        </SectionCard>

        {/* Gewerbedaten */}
        <SectionCard icon={Building} title="Gewerbedaten">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Firmenname">
              <Input value={profile.firmenname} onChange={(e) => update("firmenname", e.target.value)} />
            </Field>
            <Field label="Rechtsform">
              <Input value={profile.rechtsform} onChange={(e) => update("rechtsform", e.target.value)} />
            </Field>
            <Field label="Gewerbeanmeldung">
              <Input value={profile.gewerbeanmeldung} onChange={(e) => update("gewerbeanmeldung", e.target.value)} />
            </Field>
          </div>
        </SectionCard>

        {/* Steuer & Bankdaten */}
        <SectionCard icon={FileText} title="Steuer- & Bankdaten">
          <div className="grid grid-cols-2 gap-4">
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
          <Separator className="my-5" />
          <div className="grid grid-cols-2 gap-4">
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
        </SectionCard>

        {/* Kalender-Verbindung */}
        <SectionCard icon={Calendar} title="Kalender-Verbindung">
          <p className="text-xs text-muted-foreground mb-4">
            Verbinde deinen Kalender, damit Meetings, Termine und Follow-ups automatisch synchronisiert werden.
          </p>
          <div className="space-y-3">
            {[
              { name: "Google Calendar", connected: false },
              { name: "Microsoft Outlook", connected: false },
              { name: "Apple Kalender", connected: false },
            ].map((cal) => (
              <div key={cal.name} className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20">
                <div>
                  <p className="text-sm font-medium text-foreground">{cal.name}</p>
                  <p className="text-xs text-muted-foreground">{cal.connected ? "Verbunden" : "Nicht verbunden"}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast({ title: `${cal.name} Verbindung`, description: "Bitte gehe zur Kalender-Seite für die vollständige Einrichtung." })
                  }
                >
                  Verbinden
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Für erweiterte Kalender-Einstellungen besuche die <a href="/kalender" className="text-primary hover:underline font-medium">Kalender-Seite</a>.
          </p>
        </SectionCard>

        {/* E-Mail-Konto (IONOS) */}
        <SectionCard icon={Mail} title="E-Mail-Konto (IONOS)">
          <div className="space-y-5">
            {/* Email address & server info */}
            <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dein E-Mail-Konto</p>
                <Badge variant="outline" className="text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] mr-1.5" />IONOS
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
                <p className="text-xs font-medium text-muted-foreground mb-1">Deine geschäftliche E-Mail-Adresse</p>
                <p className="text-sm font-mono font-semibold text-primary">{ionosEmail}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Schema: erster Buchstabe Vorname + Punkt + Nachname @imondu.de
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
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

            <Separator />

            {/* Password change */}
            <div>
              <p className="text-xs font-medium text-foreground mb-3 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-primary" /> E-Mail-Passwort ändern
              </p>
              <div className="grid grid-cols-1 gap-3 max-w-sm">
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
                  <Input
                    type="password"
                    value={emailPasswortNeu}
                    onChange={(e) => setEmailPasswortNeu(e.target.value)}
                    placeholder="Neues Passwort eingeben"
                  />
                </Field>
                <Field label="Neues Passwort bestätigen">
                  <Input
                    type="password"
                    value={emailPasswortNeuConfirm}
                    onChange={(e) => setEmailPasswortNeuConfirm(e.target.value)}
                    placeholder="Neues Passwort wiederholen"
                  />
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
            </div>

            <Separator />

            {/* Signature */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5 text-primary" /> E-Mail-Signatur
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-muted-foreground">Aktiv</span>
                  <button
                    onClick={() => setSignatureEnabled(!signatureEnabled)}
                    className={`h-5 w-9 rounded-full transition-colors ${signatureEnabled ? "bg-primary" : "bg-muted"}`}
                  >
                    <span className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${signatureEnabled ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </label>
              </div>

              <div className="p-3 rounded-lg bg-secondary/20 border border-border mb-3">
                <p className="text-[10px] text-muted-foreground mb-2">Vorschau:</p>
                <div className="text-xs text-foreground" dangerouslySetInnerHTML={{ __html: signature }} />
              </div>

              <Field label="HTML bearbeiten">
                <Textarea
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="min-h-[120px] font-mono text-xs"
                />
              </Field>
            </div>
          </div>
        </SectionCard>

        {/* Speichern */}
        <div className="flex justify-end pb-8">
          <Button onClick={handleSave} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90 px-8">
            <Save className="h-4 w-4" /> Änderungen speichern
          </Button>
        </div>
      </div>
    </CRMLayout>
  );
}
