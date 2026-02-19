import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail, Search, Send, Star, Trash2, Archive, Reply, ReplyAll, Forward,
  Paperclip, Plus, Inbox, SendHorizonal, FileText, AlertCircle, Settings2,
  ChevronDown, Bold, Italic, Underline, Link, List, Image, Edit2, Save,
  CheckCircle2, Clock, StarOff, MailOpen, RefreshCw,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ── Types ──
interface EmailMessage {
  id: string;
  from: string;
  fromEmail: string;
  to: string;
  toEmail: string;
  subject: string;
  body: string;
  date: string;
  time: string;
  read: boolean;
  starred: boolean;
  folder: "inbox" | "sent" | "drafts" | "trash";
  attachments?: string[];
  leadId?: string;
}

// ── Sample Data ──
const CURRENT_USER = {
  name: "Max Müller",
  email: "m.mueller@imondu.de",
  initials: "MM",
  role: "Vertriebler",
};

const DEFAULT_SIGNATURE = `<p>Mit freundlichen Grüßen</p>
<p><strong>Max Müller</strong><br/>
Vertriebsberater | Imondu GmbH<br/>
📞 +49 170 1234567<br/>
✉️ m.mueller@imondu.de<br/>
🌐 www.imondu.de</p>
<p style="color: #999; font-size: 11px;">Imondu GmbH | Musterstraße 1 | 10115 Berlin<br/>
Geschäftsführer: Max Mustermann | AG Berlin HRB 123456</p>`;

const sampleEmails: EmailMessage[] = [
  {
    id: "e1", from: "Anna Schmidt", fromEmail: "a.schmidt@gmail.com",
    to: CURRENT_USER.name, toEmail: CURRENT_USER.email,
    subject: "Rückfrage zur Immobilienbewertung",
    body: "Sehr geehrter Herr Müller,\n\nvielen Dank für Ihr Angebot zur kostenlosen Immobilienbewertung. Ich hätte noch einige Fragen zum Ablauf:\n\n1. Wie lange dauert der Vor-Ort-Termin?\n2. Welche Unterlagen soll ich bereithalten?\n3. Ist die Bewertung wirklich unverbindlich?\n\nIch freue mich auf Ihre Antwort.\n\nMit freundlichen Grüßen\nAnna Schmidt",
    date: "2026-02-19", time: "14:32", read: false, starred: true, folder: "inbox", leadId: "lead-1",
  },
  {
    id: "e2", from: "Thomas Weber", fromEmail: "t.weber@weber-bau.de",
    to: CURRENT_USER.name, toEmail: CURRENT_USER.email,
    subject: "Partnerschaft B2B – Interesse an Zusammenarbeit",
    body: "Hallo Herr Müller,\n\nwir sind ein Handwerksbetrieb aus München und haben von Ihrem Partnerprogramm gehört. Wir würden gerne mehr über die Konditionen und den Ablauf erfahren.\n\nKönnten Sie uns die Unterlagen zukommen lassen?\n\nBeste Grüße\nThomas Weber\nWeber Bau GmbH",
    date: "2026-02-19", time: "11:15", read: false, starred: false, folder: "inbox",
  },
  {
    id: "e3", from: "Sabine Hoffmann", fromEmail: "s.hoffmann@web.de",
    to: CURRENT_USER.name, toEmail: CURRENT_USER.email,
    subject: "Termin verschieben – 25.02.",
    body: "Lieber Herr Müller,\n\nleider muss ich unseren Termin am 25.02. verschieben. Wäre der 27.02. um 15:00 Uhr möglich?\n\nViele Grüße\nSabine Hoffmann",
    date: "2026-02-18", time: "16:45", read: true, starred: false, folder: "inbox",
  },
  {
    id: "e4", from: CURRENT_USER.name, fromEmail: CURRENT_USER.email,
    to: "Klaus Meier", toEmail: "k.meier@gmx.de",
    subject: "Re: Ihre Immobilie in Berlin-Mitte",
    body: "Sehr geehrter Herr Meier,\n\nvielen Dank für Ihre Anfrage. Gerne komme ich bei Ihnen vorbei, um die Immobilie zu besichtigen.\n\nWie wäre es am Donnerstag, 20.02. um 14:00 Uhr?\n\nMit freundlichen Grüßen\nMax Müller",
    date: "2026-02-18", time: "10:20", read: true, starred: false, folder: "sent",
  },
  {
    id: "e5", from: "Imondu System", fromEmail: "noreply@imondu.de",
    to: CURRENT_USER.name, toEmail: CURRENT_USER.email,
    subject: "Neuer Lead zugewiesen: Petra Schulz",
    body: "Hallo Max,\n\nein neuer B2C-Lead wurde dir zugewiesen:\n\n• Name: Petra Schulz\n• Objekttyp: Einfamilienhaus\n• PLZ: 12345 Berlin\n• Interesse: Verkauf\n\nBitte kontaktiere den Lead innerhalb von 24 Stunden.\n\nDein Imondu-System",
    date: "2026-02-17", time: "09:00", read: true, starred: false, folder: "inbox",
  },
];

// ── Folders ──
const FOLDERS = [
  { id: "inbox" as const, label: "Posteingang", icon: Inbox },
  { id: "sent" as const, label: "Gesendet", icon: SendHorizonal },
  { id: "drafts" as const, label: "Entwürfe", icon: FileText },
  { id: "trash" as const, label: "Papierkorb", icon: Trash2 },
];

export default function EmailPage() {
  const [emails, setEmails] = useState<EmailMessage[]>(sampleEmails);
  const [activeFolder, setActiveFolder] = useState<"inbox" | "sent" | "drafts" | "trash">("inbox");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"signature" | "account" | null>(null);

  // Compose state
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  // Signature state
  const [signature, setSignature] = useState(DEFAULT_SIGNATURE);
  const [signatureEnabled, setSignatureEnabled] = useState(true);

  // ── Derived ──
  const filteredEmails = emails.filter(e =>
    e.folder === activeFolder &&
    (searchQuery === "" ||
      e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.body.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const selectedEmail = emails.find(e => e.id === selectedEmailId);
  const unreadCount = emails.filter(e => e.folder === "inbox" && !e.read).length;

  // ── Handlers ──
  const selectEmail = (id: string) => {
    setSelectedEmailId(id);
    setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
  };

  const toggleStar = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, starred: !e.starred } : e));
  };

  const moveToTrash = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, folder: "trash" as const } : e));
    if (selectedEmailId === id) setSelectedEmailId(null);
  };

  const archiveEmail = (id: string) => {
    setEmails(prev => prev.filter(e => e.id !== id));
    if (selectedEmailId === id) setSelectedEmailId(null);
  };

  const sendEmail = () => {
    if (!composeTo.trim() || !composeSubject.trim()) return;
    const newEmail: EmailMessage = {
      id: `e-${Date.now()}`,
      from: CURRENT_USER.name,
      fromEmail: CURRENT_USER.email,
      to: composeTo,
      toEmail: composeTo,
      subject: composeSubject,
      body: composeBody + (signatureEnabled ? "\n\n---\n" + signature.replace(/<[^>]*>/g, "") : ""),
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      read: true,
      starred: false,
      folder: "sent",
    };
    setEmails(prev => [newEmail, ...prev]);
    setComposeOpen(false);
    setComposeTo("");
    setComposeSubject("");
    setComposeBody("");
  };

  const replyTo = (email: EmailMessage) => {
    setComposeTo(email.fromEmail);
    setComposeSubject(`Re: ${email.subject}`);
    setComposeBody(`\n\n--- Ursprüngliche Nachricht ---\nVon: ${email.from} <${email.fromEmail}>\nDatum: ${email.date} ${email.time}\n\n${email.body}`);
    setComposeOpen(true);
  };

  return (
    <CRMLayout>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">E-Mail</h1>
              <p className="text-xs text-muted-foreground">{CURRENT_USER.email} • IONOS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setSettingsTab("signature")}>
              <Settings2 className="h-3.5 w-3.5 mr-1.5" /> Signatur & Konto
            </Button>
            <Button size="sm" onClick={() => setComposeOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Verfassen
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar – Folders */}
          <div className="w-52 border-r border-border bg-card flex flex-col">
            <div className="p-3">
              <Button className="w-full" size="sm" onClick={() => setComposeOpen(true)}>
                <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Neue E-Mail
              </Button>
            </div>
            <nav className="flex-1 px-2 space-y-0.5">
              {FOLDERS.map(folder => {
                const count = folder.id === "inbox" ? unreadCount : emails.filter(e => e.folder === folder.id).length;
                return (
                  <button
                    key={folder.id}
                    onClick={() => { setActiveFolder(folder.id); setSelectedEmailId(null); }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeFolder === folder.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground/70 hover:bg-secondary/50"
                    }`}
                  >
                    <folder.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">{folder.label}</span>
                    {count > 0 && (
                      <span className={`text-[10px] font-bold ${
                        folder.id === "inbox" && unreadCount > 0 ? "bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full" : "text-muted-foreground"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Account info */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2 px-2">
                <div className="h-7 w-7 rounded-full gradient-brand flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                  {CURRENT_USER.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{CURRENT_USER.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{CURRENT_USER.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Email List */}
          <div className="w-80 border-r border-border flex flex-col bg-background">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="E-Mails durchsuchen..."
                  className="pl-8 h-8 text-xs"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filteredEmails.length === 0 ? (
                <div className="p-6 text-center">
                  <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Keine E-Mails</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {filteredEmails.map(email => (
                    <button
                      key={email.id}
                      onClick={() => selectEmail(email.id)}
                      className={`w-full text-left p-3 hover:bg-secondary/30 transition-colors ${
                        selectedEmailId === email.id ? "bg-primary/5 border-l-2 border-primary" : ""
                      } ${!email.read ? "bg-primary/[0.02]" : ""}`}
                    >
                      <div className="flex items-start gap-2">
                        <button
                          onClick={e => { e.stopPropagation(); toggleStar(email.id); }}
                          className="mt-0.5 shrink-0"
                        >
                          <Star className={`h-3.5 w-3.5 ${email.starred ? "fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" : "text-muted-foreground/40"}`} />
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-xs truncate ${!email.read ? "font-bold text-foreground" : "font-medium text-foreground/80"}`}>
                              {activeFolder === "sent" ? email.to : email.from}
                            </p>
                            <span className="text-[10px] text-muted-foreground shrink-0">{email.time}</span>
                          </div>
                          <p className={`text-xs truncate mt-0.5 ${!email.read ? "font-semibold text-foreground" : "text-foreground/70"}`}>
                            {email.subject}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {email.body.slice(0, 80)}…
                          </p>
                        </div>
                        {!email.read && (
                          <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Email Detail / Empty State */}
          <div className="flex-1 flex flex-col bg-background">
            {selectedEmail ? (
              <>
                {/* Detail Header */}
                <div className="border-b border-border px-6 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-foreground">{selectedEmail.subject}</h2>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => replyTo(selectedEmail)}>
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Forward className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => archiveEmail(selectedEmail.id)}>
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveToTrash(selectedEmail.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {selectedEmail.from.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {selectedEmail.from} <span className="text-muted-foreground font-normal">&lt;{selectedEmail.fromEmail}&gt;</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        An: {selectedEmail.to} • {selectedEmail.date} um {selectedEmail.time}
                      </p>
                    </div>
                    {selectedEmail.leadId && (
                      <Badge variant="outline" className="ml-auto text-[10px]">Lead verknüpft</Badge>
                    )}
                  </div>
                </div>

                {/* Detail Body */}
                <ScrollArea className="flex-1 px-6 py-5">
                  <div className="max-w-2xl whitespace-pre-line text-sm text-foreground leading-relaxed">
                    {selectedEmail.body}
                  </div>
                </ScrollArea>

                {/* Quick Reply */}
                <div className="border-t border-border px-6 py-3">
                  <Button variant="outline" size="sm" onClick={() => replyTo(selectedEmail)}>
                    <Reply className="h-3.5 w-3.5 mr-1.5" /> Antworten
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MailOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Wähle eine E-Mail aus</p>
                  <p className="text-xs text-muted-foreground mt-1">oder verfasse eine neue Nachricht</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Compose Dialog ── */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Neue E-Mail</DialogTitle>
            <DialogDescription>Von: {CURRENT_USER.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">An</label>
              <Input value={composeTo} onChange={e => setComposeTo(e.target.value)} placeholder="empfaenger@email.de" className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Betreff</label>
              <Input value={composeSubject} onChange={e => setComposeSubject(e.target.value)} placeholder="Betreff eingeben..." className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Nachricht</label>
              <Textarea
                value={composeBody}
                onChange={e => setComposeBody(e.target.value)}
                placeholder="Ihre Nachricht..."
                className="mt-1 min-h-[200px]"
              />
            </div>
            {signatureEnabled && (
              <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Signatur</p>
                <div className="text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: signature }} />
              </div>
            )}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Paperclip className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Image className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Link className="h-4 w-4" /></Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setComposeOpen(false)}>Verwerfen</Button>
                <Button size="sm" onClick={sendEmail} disabled={!composeTo.trim() || !composeSubject.trim()}>
                  <Send className="h-3.5 w-3.5 mr-1.5" /> Senden
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Settings Dialog ── */}
      <Dialog open={settingsTab !== null} onOpenChange={(v) => !v && setSettingsTab(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>E-Mail-Einstellungen</DialogTitle>
            <DialogDescription>Konto & Signatur verwalten</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="account" className="mt-2">
            <TabsList className="w-full">
              <TabsTrigger value="account" className="flex-1">Konto</TabsTrigger>
              <TabsTrigger value="signature" className="flex-1">Signatur</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-4 mt-4">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dein E-Mail-Konto</p>
                  <Badge variant="outline" className="text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] mr-1.5" />IONOS
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">E-Mail-Adresse</p>
                    <p className="text-sm font-medium text-foreground">{CURRENT_USER.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Name</p>
                    <p className="text-sm font-medium text-foreground">{CURRENT_USER.name}</p>
                  </div>
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
              <div className="p-4 rounded-lg border border-border space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">E-Mail-Adresse Konvention</p>
                <p className="text-xs text-muted-foreground">
                  Jeder Mitarbeiter erhält automatisch eine persönliche Imondu-E-Mail nach dem Schema:
                </p>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-center">
                  <code className="text-sm font-mono font-bold text-primary">
                    v.nachname@imondu.de
                  </code>
                </div>
                <p className="text-[10px] text-muted-foreground text-center">
                  Erster Buchstabe Vorname + Punkt + Nachname
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full" disabled>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Konto verbinden (IONOS API – bald verfügbar)
              </Button>
            </TabsContent>

            <TabsContent value="signature" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">E-Mail-Signatur</p>
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

              <div className="p-3 rounded-lg bg-secondary/20 border border-border">
                <p className="text-[10px] text-muted-foreground mb-2">Vorschau:</p>
                <div className="text-xs text-foreground" dangerouslySetInnerHTML={{ __html: signature }} />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">HTML bearbeiten</label>
                <Textarea
                  value={signature}
                  onChange={e => setSignature(e.target.value)}
                  className="mt-1 min-h-[120px] font-mono text-xs"
                />
              </div>
              <Button size="sm" onClick={() => setSettingsTab(null)}>
                <Save className="h-3.5 w-3.5 mr-1.5" /> Signatur speichern
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </CRMLayout>
  );
}
