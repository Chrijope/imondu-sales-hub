import { useParams, useNavigate } from "react-router-dom";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Shield, Clock, CheckCircle2, XCircle, Eye, EyeOff,
  CalendarDays, AlertCircle, Mail, Phone, MapPin, Building2, CreditCard,
  FileText, Bell, Lock, Settings, GraduationCap,
} from "lucide-react";
import { useUserRole, ALL_MENU_ITEMS } from "@/contexts/UserRoleContext";
import {
  SAMPLE_USERS, REQUIRED_DOCUMENTS, generateUserProfile,
  INVITE_STATUS_MAP, timeAgo, formatDate,
  type CRMUser,
} from "@/data/nutzerverwaltung-data";
import { KARRIERESTUFEN } from "@/data/karriereplan";
import { useState } from "react";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{value || "–"}</span>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: typeof Mail; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-crm-sm">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="px-5 py-4">
        {children}
      </div>
    </div>
  );
}

export default function NutzerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { roles } = useUserRole();

  const [user, setUser] = useState<CRMUser | undefined>(
    SAMPLE_USERS.find((u) => u.id === id)
  );
  const [docApprovals, setDocApprovals] = useState<Record<string, "uploaded" | "pending" | "rejected">>({});

  if (!user) {
    return (
      <CRMLayout>
        <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
          <div className="text-center py-20">
            <p className="text-muted-foreground">Nutzer nicht gefunden.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/nutzerverwaltung")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Zurück zur Nutzerverwaltung
            </Button>
          </div>
        </div>
      </CRMLayout>
    );
  }

  const getRole = (roleId: string) => roles.find((r) => r.id === roleId) || roles[roles.length - 1];
  const role = getRole(user.roleId);
  const profile = generateUserProfile(user.name, user.email, user.phone);
  const inviteInfo = INVITE_STATUS_MAP[user.inviteStatus];
  const InviteIcon = inviteInfo.icon;
  const uploadedCount = REQUIRED_DOCUMENTS.filter(d => profile.dokumente[d.id]).length;
  const ionosEmail = `${profile.vorname.trim()[0]?.toLowerCase() || "x"}.${profile.nachname.trim().toLowerCase().replace(/\s+/g, "-").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")}@imondu.de`;

  const menuItems = user.roleId === "individuell" && user.customMenuItems
    ? user.customMenuItems
    : role.menuItems;
  const isIndividuell = user.roleId === "individuell" || !role.fixed;

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 animate-fade-in min-h-screen dashboard-mesh-bg">
        <div className="max-w-5xl">

          {/* Back + Header */}
          <button
            onClick={() => navigate("/nutzerverwaltung")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5"
          >
            <ArrowLeft className="h-4 w-4" /> Nutzerverwaltung
          </button>

          {/* User Header Card */}
          <div className="rounded-xl border border-border bg-card shadow-crm-md p-6 mb-6">
            <div className="flex items-start gap-5">
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center text-lg font-bold text-primary-foreground shrink-0"
                style={{ background: role.color }}
              >
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-display font-bold text-foreground">{user.name}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{user.email} · {user.phone} · <span className="font-mono text-xs">{user.imonduId}</span></p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border border-border bg-secondary/50 text-foreground">
                    <Shield className="h-3 w-3" /> {role.name}
                  </span>
                  {user.active ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]">
                      <CheckCircle2 className="h-3 w-3" /> Aktiv
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                      <XCircle className="h-3 w-3" /> Inaktiv
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-border ${inviteInfo.className}`}>
                    <InviteIcon className="h-3 w-3" /> {inviteInfo.label}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" /> Erstellt: {formatDate(user.createdAt)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> Login: {timeAgo(user.lastLogin)}
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            <Separator className="my-4" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Rolle ändern</p>
                <Select
                  value={user.roleId}
                  onValueChange={(v) => {
                    setUser({ ...user, roleId: v, customMenuItems: roles.find((r) => r.id === v)?.fixed ? undefined : user.customMenuItems });
                    toast({ title: "Rolle geändert", description: `Neue Rolle: ${getRole(v).name}` });
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Status</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setUser({ ...user, active: !user.active });
                    toast({ title: user.active ? "Nutzer deaktiviert" : "Nutzer aktiviert" });
                  }}
                >
                  {user.active ? (
                    <><Eye className="h-3.5 w-3.5 mr-1.5 text-[hsl(var(--success))]" /> Aktiv</>
                  ) : (
                    <><EyeOff className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" /> Inaktiv</>
                  )}
                </Button>
              </div>
              {user.roleId === "vertriebspartner" && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" /> Karrierestufe
                  </p>
                  <Select
                    value={user.karriereStufeId || "projektleiter"}
                    onValueChange={(v) => {
                      setUser({ ...user, karriereStufeId: v });
                      const stufe = KARRIERESTUFEN.find(k => k.id === v);
                      toast({ title: "Karrierestufe geändert", description: `Neue Stufe: ${stufe?.icon} ${stufe?.title}` });
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {KARRIERESTUFEN.map((k) => (
                        <SelectItem key={k.id} value={k.id}>{k.icon} {k.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profil" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0 h-auto gap-0 flex-wrap mb-6">
              {[
                { value: "profil", label: "Profil" },
                { value: "email", label: "E-Mail" },
                { value: "gewerbe", label: "Gewerbedaten" },
                { value: "finanzen", label: "Steuer & Bank" },
                { value: "unterlagen", label: "Unterlagen" },
                { value: "kalender", label: "Kalender" },
                { value: "benachrichtigungen", label: "Benachrichtigungen" },
                { value: "berechtigungen", label: "Berechtigungen" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground"
                >
                  {tab.label}
                  {tab.value === "unterlagen" && uploadedCount < REQUIRED_DOCUMENTS.length && (
                    <span className="ml-1.5 h-2 w-2 rounded-full bg-amber-500 inline-block" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* PROFIL */}
            <TabsContent value="profil" className="space-y-5 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SectionCard title="Persönliche Daten" icon={Settings}>
                  <InfoRow label="Vorname" value={profile.vorname} />
                  <InfoRow label="Nachname" value={profile.nachname} />
                  <InfoRow label="E-Mail" value={profile.email} />
                  <InfoRow label="Telefon" value={profile.telefon} />
                  <InfoRow label="Mobilnummer" value={profile.mobilnummer} />
                  <InfoRow label="Geburtsdatum" value={new Date(profile.geburtsdatum).toLocaleDateString("de-DE")} />
                  <InfoRow label="Über mich" value={profile.bio} />
                </SectionCard>
                <SectionCard title="Adresse" icon={MapPin}>
                  <InfoRow label="Straße" value={`${profile.strasse} ${profile.hausnummer}`} />
                  <InfoRow label="PLZ / Ort" value={`${profile.plz} ${profile.ort}`} />
                  <InfoRow label="Land" value={profile.land} />
                </SectionCard>
              </div>
            </TabsContent>

            {/* E-MAIL */}
            <TabsContent value="email" className="space-y-5 mt-0">
              <SectionCard title="E-Mail-Konto" icon={Mail}>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/15 mb-4">
                  <p className="text-xs text-muted-foreground mb-0.5">Geschäftliche E-Mail</p>
                  <p className="text-sm font-mono font-semibold text-primary">{ionosEmail}</p>
                </div>
                <InfoRow label="IMAP Server" value="imap.ionos.de" />
                <InfoRow label="SMTP Server" value="smtp.ionos.de" />
                <InfoRow label="E-Mail-Signatur" value={profile.emailSignatur ? "Aktiviert" : "Deaktiviert"} />
              </SectionCard>
            </TabsContent>

            {/* GEWERBEDATEN */}
            <TabsContent value="gewerbe" className="space-y-5 mt-0">
              <SectionCard title="Gewerbedaten" icon={Building2}>
                <InfoRow label="Firmenname" value={profile.firmenname} />
                <InfoRow label="Rechtsform" value={profile.rechtsform} />
                <InfoRow label="Gewerbeanmeldung" value={profile.gewerbeanmeldung} />
              </SectionCard>
            </TabsContent>

            {/* STEUER & BANK */}
            <TabsContent value="finanzen" className="space-y-5 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SectionCard title="Steuerdaten" icon={FileText}>
                  <InfoRow label="Steuernummer" value={profile.steuernummer} />
                  <InfoRow label="USt-IdNr." value={profile.ustId} />
                  <InfoRow label="Finanzamt" value={profile.finanzamt} />
                </SectionCard>
                <SectionCard title="Bankverbindung" icon={CreditCard}>
                  <InfoRow label="IBAN" value={profile.iban} />
                  <InfoRow label="BIC" value={profile.bic} />
                  <InfoRow label="Bank" value={profile.bankname} />
                </SectionCard>
              </div>
            </TabsContent>

            {/* UNTERLAGEN */}
            <TabsContent value="unterlagen" className="space-y-5 mt-0">
              <SectionCard title="Pflichtdokumente – Prüfung & Freigabe" icon={FileText}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">Hochgeladene Dokumente</p>
                  <Badge variant={uploadedCount === REQUIRED_DOCUMENTS.length ? "default" : "outline"} className={uploadedCount === REQUIRED_DOCUMENTS.length ? "bg-[hsl(var(--success))] text-white border-0" : ""}>
                    {uploadedCount} / {REQUIRED_DOCUMENTS.length}
                  </Badge>
                </div>
                <Progress value={(uploadedCount / REQUIRED_DOCUMENTS.length) * 100} className="h-2 mb-5" />
                <div className="space-y-2">
                  {REQUIRED_DOCUMENTS.map((doc) => {
                    const uploaded = profile.dokumente[doc.id];
                    const docStatus = docApprovals[doc.id] || uploaded?.status;
                    const isApproved = docStatus === "uploaded";
                    const isPending = docStatus === "pending";
                    const isRejected = docStatus === "rejected";
                    const notUploaded = !uploaded;

                    const borderColor = notUploaded
                      ? "border-destructive/30 bg-destructive/5"
                      : isApproved
                      ? "border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5"
                      : isRejected
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/5";

                    return (
                      <div key={doc.id} className={`flex items-center justify-between p-3 rounded-lg border ${borderColor}`}>
                        <div className="flex items-center gap-2.5">
                          {notUploaded ? (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          ) : isApproved ? (
                            <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                          ) : isPending ? (
                            <Clock className="h-4 w-4 text-[hsl(var(--warning))]" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                          <div>
                            <span className="text-sm text-foreground">{doc.label}</span>
                            {uploaded && (
                              <p className="text-[10px] text-muted-foreground">{uploaded.name} · {uploaded.date}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {notUploaded ? (
                            <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-destructive/30 text-destructive">
                              Nicht hochgeladen
                            </Badge>
                          ) : (
                            <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${
                              isApproved ? "border-[hsl(var(--success))]/30 text-[hsl(var(--success))]"
                              : isPending ? "border-[hsl(var(--warning))]/30 text-[hsl(var(--warning))]"
                              : "border-destructive/30 text-destructive"
                            }`}>
                              {isApproved ? "✓ Freigegeben" : isPending ? "Prüfung ausstehend" : "Abgelehnt"}
                            </Badge>
                          )}
                          {uploaded && isPending && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-[11px] px-2.5 border-[hsl(var(--success))]/40 text-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/10"
                                onClick={() => {
                                  setDocApprovals(prev => ({ ...prev, [doc.id]: "uploaded" }));
                                  import("@/utils/chat-notifications").then(({ addChatNotification }) => {
                                    addChatNotification({
                                      targetChatId: `user-${user.id}`,
                                      targetRole: user.roleId,
                                      text: `✅ Dein Dokument „${doc.label}" wurde geprüft und freigegeben.`,
                                      sender: "IMONDU Backoffice",
                                      senderInitials: "IB",
                                      type: "dokument-freigabe",
                                    });
                                  });
                                  toast({ title: "Freigegeben ✓", description: `„${doc.label}" wurde freigegeben.` });
                                }}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Freigeben
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-[11px] px-2.5 border-destructive/40 text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  setDocApprovals(prev => ({ ...prev, [doc.id]: "rejected" }));
                                  import("@/utils/chat-notifications").then(({ addChatNotification }) => {
                                    addChatNotification({
                                      targetChatId: `user-${user.id}`,
                                      targetRole: user.roleId,
                                      text: `❌ Dein Dokument „${doc.label}" wurde abgelehnt. Bitte lade es erneut hoch.`,
                                      sender: "IMONDU Backoffice",
                                      senderInitials: "IB",
                                      type: "dokument-abgelehnt",
                                    });
                                  });
                                  toast({ title: "Abgelehnt", description: `„${doc.label}" wurde abgelehnt. Der Partner wird benachrichtigt.` });
                                }}
                              >
                                <XCircle className="h-3 w-3 mr-1" /> Ablehnen
                              </Button>
                            </div>
                          )}
                          {uploaded && isRejected && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-[11px] px-2.5"
                              onClick={() => {
                                setDocApprovals(prev => ({ ...prev, [doc.id]: "pending" }));
                                toast({ title: "Zurückgesetzt", description: `„${doc.label}" wurde auf Prüfung zurückgesetzt.` });
                              }}
                            >
                              Zurücksetzen
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            </TabsContent>

            {/* KALENDER */}
            <TabsContent value="kalender" className="space-y-5 mt-0">
              <SectionCard title="Kalender-Verbindungen" icon={CalendarDays}>
                {["Google Calendar", "Microsoft Outlook", "Apple Kalender"].map((cal) => {
                  const calId = cal.split(" ")[0].toLowerCase();
                  const connected = profile.kalenderVerbunden.includes(calId);
                  return (
                    <div key={calId} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                      <span className="text-sm text-foreground">{cal}</span>
                      {connected ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--success))]"><CheckCircle2 className="h-3.5 w-3.5" /> Verbunden</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Nicht verbunden</span>
                      )}
                    </div>
                  );
                })}
              </SectionCard>
            </TabsContent>

            {/* BENACHRICHTIGUNGEN */}
            <TabsContent value="benachrichtigungen" className="space-y-5 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SectionCard title="Benachrichtigungs-Kanäle" icon={Bell}>
                  <InfoRow label="E-Mail" value={profile.benachrichtigungen.email ? "Aktiviert" : "Deaktiviert"} />
                  <InfoRow label="Feed (Glocke)" value={profile.benachrichtigungen.feed ? "Aktiviert" : "Deaktiviert"} />
                  <InfoRow label="Browser" value={profile.benachrichtigungen.browser ? "Aktiviert" : "Deaktiviert"} />
                  <InfoRow label="Pop-up" value={profile.benachrichtigungen.popup ? "Aktiviert" : "Deaktiviert"} />
                </SectionCard>
                <SectionCard title="Sicherheit" icon={Lock}>
                  <InfoRow label="Zwei-Faktor-Auth." value={profile.zweiFA ? "Eingerichtet" : "Nicht eingerichtet"} />
                  <InfoRow label="Letzter Login" value={user.lastLogin === "–" ? "–" : new Date(user.lastLogin).toLocaleString("de-DE")} />
                </SectionCard>
              </div>
            </TabsContent>

            {/* BERECHTIGUNGEN */}
            <TabsContent value="berechtigungen" className="space-y-5 mt-0">
              <SectionCard title="Menüpunkte & Berechtigungen" icon={Shield}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">
                    {menuItems.length} von {ALL_MENU_ITEMS.length} Menüpunkten
                  </p>
                  {!isIndividuell && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                      fest durch Rolle „{role.name}"
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
                  {ALL_MENU_ITEMS.map((item) => {
                    const isChecked = menuItems.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          isIndividuell ? "cursor-pointer hover:bg-secondary/50" : "cursor-default opacity-70"
                        } ${isChecked ? "bg-primary/5 border border-primary/15" : "border border-transparent"}`}
                      >
                        <Checkbox checked={isChecked} disabled={!isIndividuell} onCheckedChange={() => {
                          if (!isIndividuell) return;
                          const current = user.customMenuItems || role.menuItems;
                          const updated = current.includes(item.id)
                            ? current.filter((m) => m !== item.id)
                            : [...current, item.id];
                          setUser({ ...user, customMenuItems: updated, roleId: "individuell" });
                        }} />
                        <span className="text-foreground">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
                {!isIndividuell && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Wähle die Rolle „Individuell", um einzelne Menüpunkte manuell zuzuweisen.
                  </p>
                )}
              </SectionCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </CRMLayout>
  );
}
