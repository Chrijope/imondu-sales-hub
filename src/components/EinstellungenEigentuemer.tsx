import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Camera, Save, Key, Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

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

export default function EinstellungenEigentuemer() {
  const { toast } = useToast();
  const [profilbild, setProfilbild] = useState<string | null>(null);
  const [vorname, setVorname] = useState("Anna");
  const [nachname, setNachname] = useState("Schmidt");
  const [email, setEmail] = useState("anna.schmidt@email.de");
  const [telefon, setTelefon] = useState("+49 170 9876543");

  const [showPassword, setShowPassword] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilbild(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    if (!newPw || newPw !== confirmPw) {
      toast({ title: "Fehler", description: "Die Passwörter stimmen nicht überein." });
      return;
    }
    toast({ title: "Passwort geändert ✓", description: "Dein Passwort wurde erfolgreich aktualisiert." });
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
  };

  const handleSave = () => {
    toast({ title: "Gespeichert ✓", description: "Deine Einstellungen wurden aktualisiert." });
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Mein Account</h1>
        <p className="text-sm text-muted-foreground mt-1">Verwalte dein Profil und deine Zugangsdaten.</p>
      </div>

      <Tabs defaultValue="profil" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0 h-auto gap-0">
          {[
            { value: "profil", label: "Profil" },
            { value: "sicherheit", label: "Passwort & Sicherheit" },
            { value: "benachrichtigungen", label: "Benachrichtigungen" },
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

        <p className="text-xs text-muted-foreground mt-3 mb-6">Diese Einstellungen gelten nur für dein Eigentümer-Konto.</p>

        {/* Profil */}
        <TabsContent value="profil" className="space-y-6 mt-0">
          <Separator />
          <SectionBlock title="Profil" description="Deine persönlichen Daten.">
            <div className="space-y-5">
              <Field label="Profilbild">
                <div className="relative group w-20 h-20">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                    {profilbild ? (
                      <img src={profilbild} alt="Profilbild" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full gradient-brand flex items-center justify-center text-white text-xl font-display font-bold">
                        {vorname[0]}{nachname[0]}
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
                  <Input value={vorname} onChange={(e) => setVorname(e.target.value)} />
                </Field>
                <Field label="Nachname">
                  <Input value={nachname} onChange={(e) => setNachname(e.target.value)} />
                </Field>
              </div>

              <div className="max-w-lg">
                <Field label="E-Mail">
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>
              </div>

              <div className="max-w-lg">
                <Field label="Telefon">
                  <Input value={telefon} onChange={(e) => setTelefon(e.target.value)} />
                </Field>
              </div>
            </div>
          </SectionBlock>

          <div className="flex justify-end pt-2 pb-8">
            <Button onClick={handleSave} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90 px-8">
              <Save className="h-4 w-4" /> Speichern
            </Button>
          </div>
        </TabsContent>

        {/* Passwort & Sicherheit */}
        <TabsContent value="sicherheit" className="space-y-6 mt-0">
          <Separator />
          <SectionBlock title="Passwort ändern" description="Ändere das Passwort für deinen Account.">
            <div className="grid grid-cols-1 gap-4 max-w-sm">
              <Field label="Aktuelles Passwort">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
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
                <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Neues Passwort eingeben" />
              </Field>
              <Field label="Neues Passwort bestätigen">
                <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Neues Passwort wiederholen" />
              </Field>
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                disabled={!currentPw || !newPw || !confirmPw}
                onClick={handlePasswordChange}
              >
                <Key className="h-3.5 w-3.5 mr-1.5" /> Passwort ändern
              </Button>
            </div>
          </SectionBlock>
        </TabsContent>

        {/* Benachrichtigungen */}
        <TabsContent value="benachrichtigungen" className="space-y-6 mt-0">
          <Separator />
          <SectionBlock title="Benachrichtigungen" description="Wähle aus, worüber du informiert werden möchtest.">
            <div className="max-w-lg space-y-3">
              {[
                { id: "chat_notif", label: "Chat-Nachrichten", desc: "Wenn ein Entwickler dir eine Nachricht schreibt.", default: true },
                { id: "angebot_notif", label: "Neue Angebote", desc: "Wenn ein Entwickler dir ein Angebot sendet.", default: true },
                { id: "matching_notif", label: "Neue Matches", desc: "Wenn ein passender Entwickler gefunden wird.", default: true },
                { id: "system_notif", label: "System-Updates", desc: "Wichtige Plattform-Neuigkeiten.", default: false },
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

          <div className="flex justify-end pt-2 pb-8">
            <Button onClick={handleSave} className="gap-2 gradient-brand border-0 text-white shadow-crm-sm hover:opacity-90 px-8">
              <Save className="h-4 w-4" /> Speichern
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
