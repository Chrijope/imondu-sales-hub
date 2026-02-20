import { useState, useRef, useEffect } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  HeadphonesIcon, MessageSquare, Clock, CheckCircle2, AlertCircle, Search,
  Send, Bot, User, Building2, HardHat, TrendingUp, Timer, XCircle,
  RotateCcw, ChevronLeft, Inbox, BarChart3, Zap, Filter, UserPlus,
} from "lucide-react";

/* ── Types ───────────────────────────────────── */
type TicketStatus = "neu" | "offen" | "in_bearbeitung" | "geloest" | "geschlossen";
type TicketKategorie = "eigentümer" | "entwickler";
type TicketPrio = "hoch" | "mittel" | "niedrig";

interface TicketMessage {
  id: string;
  sender: string;
  role: "kunde" | "support" | "ki" | "system";
  text: string;
  time: string;
}

interface TicketTeilnehmer {
  name: string;
  initials: string;
  role: string;
}

interface Ticket {
  id: string;
  betreff: string;
  kategorie: TicketKategorie;
  name: string;
  firma?: string;
  email: string;
  status: TicketStatus;
  prioritaet: TicketPrio;
  erstelltAm: string;
  zuletztAktualisiert: string;
  zugewiesen?: string;
  messages: TicketMessage[];
  tags: string[];
  teilnehmer: TicketTeilnehmer[];
}

const AVAILABLE_ADMINS: TicketTeilnehmer[] = [
  { name: "Max Müller", initials: "MM", role: "Support-Admin" },
  { name: "Lisa Schmidt", initials: "LS", role: "Support-Admin" },
  { name: "Sarah Klein", initials: "SK", role: "Teamleiterin" },
  { name: "Jan Weber", initials: "JW", role: "Technik-Admin" },
  { name: "Christian Peetz", initials: "CP", role: "Support-Admin" },
  { name: "Tobias Fritz", initials: "TF", role: "Backoffice" },
];

/* ── Status Config ───────────────────────────── */
const STATUS_CFG: Record<TicketStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  neu: { label: "Neu", color: "bg-primary/10 text-primary border-primary/20", icon: Zap },
  offen: { label: "Offen", color: "bg-warning/10 text-warning border-warning/20", icon: AlertCircle },
  in_bearbeitung: { label: "In Bearbeitung", color: "bg-accent/50 text-foreground border-accent", icon: RotateCcw },
  geloest: { label: "Gelöst", color: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  geschlossen: { label: "Geschlossen", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

const PRIO_CFG: Record<TicketPrio, { label: string; color: string }> = {
  hoch: { label: "Hoch", color: "bg-destructive/10 text-destructive border-destructive/20" },
  mittel: { label: "Mittel", color: "bg-warning/10 text-warning border-warning/20" },
  niedrig: { label: "Niedrig", color: "bg-muted text-muted-foreground border-border" },
};

/* ── Mock Tickets ────────────────────────────── */
const now = () => new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

const SAMPLE_TICKETS: Ticket[] = [
  {
    id: "T-1001", betreff: "Frage zur Fördermittelbeantragung", kategorie: "eigentümer",
    name: "Hans Müller", email: "h.mueller@mail.de", status: "neu", prioritaet: "hoch",
    erstelltAm: "2026-02-20T08:14:00", zuletztAktualisiert: "2026-02-20T08:14:00",
    tags: ["Förderung", "KfW"],
    teilnehmer: [{ name: "Max Müller", initials: "MM", role: "Support-Admin" }],
    messages: [
      { id: "m1", sender: "Hans Müller", role: "kunde", text: "Hallo, ich habe eine Frage zur KfW-Förderung für die Dachsanierung. Welche Unterlagen benötige ich und wie läuft der Antragsprozess ab?", time: "08:14" },
      { id: "m2", sender: "Support-KI", role: "ki", text: "Hallo Hans! Für die KfW-Förderung einer Dachsanierung benötigst du: 1) Einen individuellen Sanierungsfahrplan (iSFP), 2) Angebote von Fachbetrieben, 3) Einen Energieeffizienz-Experten. Der Antrag muss VOR Beginn der Maßnahme gestellt werden. Soll ich dich mit einem unserer Energieberater verbinden?", time: "08:14" },
    ],
  },
  {
    id: "T-1002", betreff: "Profil-Aktualisierung funktioniert nicht", kategorie: "entwickler",
    name: "Sandra Meier", firma: "FensterPro AG", email: "meier@fensterpro.de", status: "offen", prioritaet: "mittel",
    erstelltAm: "2026-02-19T14:30:00", zuletztAktualisiert: "2026-02-19T16:45:00", zugewiesen: "Lisa Schmidt",
    tags: ["Profil", "Technik"],
    teilnehmer: [{ name: "Lisa Schmidt", initials: "LS", role: "Support-Admin" }, { name: "Jan Weber", initials: "JW", role: "Technik-Admin" }],
    messages: [
      { id: "m1", sender: "Sandra Meier", role: "kunde", text: "Seit gestern kann ich mein Firmenprofil nicht mehr aktualisieren. Beim Speichern erscheint eine Fehlermeldung.", time: "14:30" },
      { id: "m2", sender: "Support-KI", role: "ki", text: "Entschuldige die Unannehmlichkeiten! Ich leite das an unser technisches Team weiter. Kannst du mir einen Screenshot der Fehlermeldung schicken?", time: "14:31" },
      { id: "m3", sender: "Sandra Meier", role: "kunde", text: "Ja, hier: 'Error 500 – Internal Server Error'. Es passiert nur beim Hochladen des Logos.", time: "14:45" },
      { id: "m4", sender: "Lisa Schmidt", role: "support", text: "Hallo Sandra, ich kümmere mich darum. Es scheint ein Problem mit der Dateigröße zu sein. Bitte versuche ein Bild unter 2MB. Wir arbeiten an einer besseren Fehlermeldung.", time: "16:45" },
    ],
  },
  {
    id: "T-1003", betreff: "Rückfrage Mitgliedschaft Premium", kategorie: "entwickler",
    name: "Frank Weber", firma: "SHK Meisterbetrieb Weber", email: "weber@shk-weber.de", status: "in_bearbeitung", prioritaet: "niedrig",
    erstelltAm: "2026-02-18T10:00:00", zuletztAktualisiert: "2026-02-19T09:15:00", zugewiesen: "Max Müller",
    tags: ["Mitgliedschaft", "Premium"],
    teilnehmer: [{ name: "Max Müller", initials: "MM", role: "Support-Admin" }],
    messages: [
      { id: "m1", sender: "Frank Weber", role: "kunde", text: "Ich interessiere mich für ein Upgrade auf Premium. Was sind die genauen Vorteile und Kosten?", time: "10:00" },
      { id: "m2", sender: "Support-KI", role: "ki", text: "Premium-Partner genießen: ✅ Bevorzugte Platzierung bei Matching, ✅ Erweiterte Statistiken, ✅ Premium-Badge auf dem Profil, ✅ Vorrang-Support. Kosten: 149€/Monat bei 12 Monaten Laufzeit. Soll ich einen Berater für ein persönliches Gespräch vermitteln?", time: "10:01" },
      { id: "m3", sender: "Frank Weber", role: "kunde", text: "Ja, bitte! Ich hätte gerne ein Telefonat dazu.", time: "10:15" },
      { id: "m4", sender: "Max Müller", role: "support", text: "Hallo Frank, ich rufe Sie morgen um 11:00 an, passt das?", time: "09:15" },
    ],
  },
  {
    id: "T-1004", betreff: "Inserat wird nicht angezeigt", kategorie: "eigentümer",
    name: "Maria Schneider", email: "m.schneider@web.de", status: "geloest", prioritaet: "hoch",
    erstelltAm: "2026-02-17T11:20:00", zuletztAktualisiert: "2026-02-18T13:00:00", zugewiesen: "Lisa Schmidt",
    tags: ["Inserat", "Anzeige"],
    teilnehmer: [{ name: "Lisa Schmidt", initials: "LS", role: "Support-Admin" }],
    messages: [
      { id: "m1", sender: "Maria Schneider", role: "kunde", text: "Mein Inserat für die Wohnung in der Hauptstr. 12 wird nicht mehr in der Suche angezeigt. Können Sie das prüfen?", time: "11:20" },
      { id: "m2", sender: "Lisa Schmidt", role: "support", text: "Hallo Maria, das Inserat war vorübergehend deaktiviert weil die Laufzeit abgelaufen war. Ich habe es wieder aktiviert. Es sollte jetzt sichtbar sein.", time: "13:00" },
      { id: "m3", sender: "Maria Schneider", role: "kunde", text: "Super, ich sehe es wieder! Vielen Dank für die schnelle Hilfe!", time: "13:05" },
    ],
  },
  {
    id: "T-1005", betreff: "Rabattcode funktioniert nicht bei Registrierung", kategorie: "entwickler",
    name: "Andreas Krause", firma: "Maler Krause & Söhne", email: "krause@maler-krause.de", status: "geschlossen", prioritaet: "niedrig",
    erstelltAm: "2026-02-15T09:00:00", zuletztAktualisiert: "2026-02-16T10:30:00", zugewiesen: "Max Müller",
    tags: ["Rabattcode", "Registrierung"],
    teilnehmer: [{ name: "Max Müller", initials: "MM", role: "Support-Admin" }],
    messages: [
      { id: "m1", sender: "Andreas Krause", role: "kunde", text: "Der Rabattcode PARTNER2026 wird bei mir nicht akzeptiert.", time: "09:00" },
      { id: "m2", sender: "Max Müller", role: "support", text: "Hallo Andreas, der Code war leider am 31.01. abgelaufen. Ich habe dir einen neuen Code PARTNER-FEB26 erstellt. Gültig bis 28.02.", time: "10:30" },
      { id: "m3", sender: "Andreas Krause", role: "kunde", text: "Hat funktioniert, danke!", time: "11:00" },
    ],
  },
  {
    id: "T-1006", betreff: "Energieausweis anfragen", kategorie: "eigentümer",
    name: "Peter König", email: "p.koenig@gmx.de", status: "offen", prioritaet: "mittel",
    erstelltAm: "2026-02-20T07:50:00", zuletztAktualisiert: "2026-02-20T07:51:00",
    tags: ["Energieausweis", "Beratung"],
    teilnehmer: [],
    messages: [
      { id: "m1", sender: "Peter König", role: "kunde", text: "Ich brauche dringend einen Energieausweis für den Verkauf meiner Immobilie. Können Sie mir dabei helfen?", time: "07:50" },
      { id: "m2", sender: "Support-KI", role: "ki", text: "Selbstverständlich! Wir können Sie mit einem zertifizierten Energieberater in Ihrer Region verbinden. Darf ich Ihre PLZ und den Gebäudetyp wissen?", time: "07:51" },
    ],
  },
];
/* ── Dashboard Stats ─────────────────────────── */
function HelpdeskDashboard({ tickets }: { tickets: Ticket[] }) {
  const neu = tickets.filter(t => t.status === "neu").length;
  const offen = tickets.filter(t => t.status === "offen").length;
  const inBearbeitung = tickets.filter(t => t.status === "in_bearbeitung").length;
  const geloest = tickets.filter(t => t.status === "geloest").length;
  const geschlossen = tickets.filter(t => t.status === "geschlossen").length;
  const total = tickets.length;

  const eigentuemerTickets = tickets.filter(t => t.kategorie === "eigentümer").length;
  const entwicklerTickets = tickets.filter(t => t.kategorie === "entwickler").length;

  // Simulated metrics
  const avgAntwortzeit = "18 Min";
  const avgLoesungszeit = "4,2 Std";
  const zufriedenheit = "94%";
  const loesungsrate = `${total > 0 ? Math.round(((geloest + geschlossen) / total) * 100) : 0}%`;
  const erstantwortKI = `${total > 0 ? Math.round((tickets.filter(t => t.messages.some(m => m.role === "ki")).length / total) * 100) : 0}%`;

  return (
    <div className="space-y-4">
      {/* Status KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <Zap className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-primary">{neu}</p>
          <p className="text-[10px] text-muted-foreground">Neue Tickets</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <AlertCircle className="h-5 w-5 text-warning mx-auto mb-1" />
          <p className="text-2xl font-bold text-warning">{offen}</p>
          <p className="text-[10px] text-muted-foreground">Offen</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <RotateCcw className="h-5 w-5 text-foreground mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{inBearbeitung}</p>
          <p className="text-[10px] text-muted-foreground">In Bearbeitung</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <CheckCircle2 className="h-5 w-5 text-success mx-auto mb-1" />
          <p className="text-2xl font-bold text-success">{geloest}</p>
          <p className="text-[10px] text-muted-foreground">Gelöst</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <XCircle className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
          <p className="text-2xl font-bold text-muted-foreground">{geschlossen}</p>
          <p className="text-[10px] text-muted-foreground">Geschlossen</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <Inbox className="h-5 w-5 text-foreground mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{total}</p>
          <p className="text-[10px] text-muted-foreground">Gesamt</p>
        </div>
      </div>

      {/* Performance KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <Timer className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{avgAntwortzeit}</p>
          <p className="text-[10px] text-muted-foreground">⌀ Antwortzeit</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{avgLoesungszeit}</p>
          <p className="text-[10px] text-muted-foreground">⌀ Lösungszeit</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <CheckCircle2 className="h-4 w-4 text-success mx-auto mb-1" />
          <p className="text-lg font-bold text-success">{loesungsrate}</p>
          <p className="text-[10px] text-muted-foreground">Lösungsrate</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <TrendingUp className="h-4 w-4 text-success mx-auto mb-1" />
          <p className="text-lg font-bold text-success">{zufriedenheit}</p>
          <p className="text-[10px] text-muted-foreground">Zufriedenheit</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <Bot className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-primary">{erstantwortKI}</p>
          <p className="text-[10px] text-muted-foreground">KI-Erstantwort</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
          <div className="flex justify-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <HardHat className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-lg font-bold text-foreground">{eigentuemerTickets} / {entwicklerTickets}</p>
          <p className="text-[10px] text-muted-foreground">Eigentümer / Entwickler</p>
        </div>
      </div>
    </div>
  );
}

/* ── Ticket Detail ───────────────────────────── */
function TicketDetail({ ticket, onBack, onStatusChange, onAddTeilnehmer }: {
  ticket: Ticket;
  onBack: () => void;
  onStatusChange: (id: string, status: TicketStatus) => void;
  onAddTeilnehmer: (ticketId: string, member: TicketTeilnehmer) => void;
}) {
  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState(ticket.messages);
  const [inviteOpen, setInviteOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = () => {
    if (!reply.trim()) return;
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(), sender: "Max Müller", role: "support" as const,
      text: reply, time: now(),
    }]);
    setReply("");
    if (ticket.status === "neu") onStatusChange(ticket.id, "in_bearbeitung");
  };

  const handleInvite = (member: TicketTeilnehmer) => {
    onAddTeilnehmer(ticket.id, member);
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(), sender: "", role: "system" as const,
      text: `${member.name} (${member.role}) wurde zum Ticket hinzugefügt`, time: now(),
    }]);
    setInviteOpen(false);
  };

  const availableAdmins = AVAILABLE_ADMINS.filter(
    a => !ticket.teilnehmer.some(t => t.name === a.name)
  );

  const stCfg = STATUS_CFG[ticket.status];
  const StIcon = stCfg.icon;
  const pCfg = PRIO_CFG[ticket.prioritaet];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground gap-1 -ml-2 mb-2">
          <ChevronLeft className="h-4 w-4" /> Zurück
        </Button>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
              <Badge variant="outline" className={`text-[10px] gap-1 ${stCfg.color}`}><StIcon className="h-3 w-3" />{stCfg.label}</Badge>
              <Badge variant="outline" className={`text-[10px] ${pCfg.color}`}>{pCfg.label}</Badge>
              <Badge variant="outline" className={`text-[10px] ${ticket.kategorie === "entwickler" ? "border-b2b/30 text-b2b" : "border-b2c/30 text-b2c"}`}>
                {ticket.kategorie === "entwickler" ? <><HardHat className="h-2.5 w-2.5 mr-1" />Entwickler</> : <><Building2 className="h-2.5 w-2.5 mr-1" />Eigentümer</>}
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-foreground mt-1">{ticket.betreff}</h2>
            <p className="text-xs text-muted-foreground">{ticket.name}{ticket.firma ? ` · ${ticket.firma}` : ""} · {ticket.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Teilnehmer Avatare */}
            <div className="flex items-center -space-x-2">
              {ticket.teilnehmer.map((t) => (
                <Tooltip key={t.name}>
                  <TooltipTrigger asChild>
                    <div className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-[10px] font-bold text-primary-foreground border-2 border-card cursor-pointer hover:z-10 hover:scale-110 transition-transform">
                      {t.initials}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-muted-foreground">{t.role}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Teilnehmer hinzufügen */}
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                  <UserPlus className="h-3.5 w-3.5" /> Admin hinzufügen
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-base">
                    <UserPlus className="h-4 w-4 text-primary" />
                    Teilnehmer hinzufügen
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-1.5 mt-2">
                  {availableAdmins.length > 0 ? availableAdmins.map(admin => (
                    <button
                      key={admin.name}
                      onClick={() => handleInvite(admin)}
                      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="h-9 w-9 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {admin.initials}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">{admin.name}</p>
                        <p className="text-xs text-muted-foreground">{admin.role}</p>
                      </div>
                    </button>
                  )) : (
                    <p className="text-sm text-muted-foreground py-4 text-center">Alle Admins sind bereits hinzugefügt</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Select value={ticket.status} onValueChange={(v) => onStatusChange(ticket.id, v as TicketStatus)}>
              <SelectTrigger className="w-[170px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_CFG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-1.5 mt-2">
          {ticket.tags.map(tag => <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>)}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === "kunde" ? "justify-start" : msg.role === "system" ? "justify-center" : "justify-end"}`}>
              {msg.role === "system" ? (
                <Badge variant="outline" className="text-xs font-normal text-muted-foreground">{msg.text}</Badge>
              ) : (
                <div className={`flex gap-2 max-w-[80%] ${msg.role === "kunde" ? "" : "flex-row-reverse"}`}>
                  <div className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                    msg.role === "kunde" ? "bg-secondary text-foreground"
                    : msg.role === "ki" ? "bg-primary/10 text-primary"
                    : "bg-primary text-primary-foreground"
                  }`}>
                    {msg.role === "kunde" ? <User className="h-3.5 w-3.5" /> : msg.role === "ki" ? <Bot className="h-3.5 w-3.5" /> : <HeadphonesIcon className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">{msg.sender} · {msg.time}</p>
                    <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "kunde" ? "bg-muted text-foreground rounded-bl-md"
                      : msg.role === "ki" ? "bg-primary/5 text-foreground rounded-br-md border border-primary/10"
                      : "bg-primary text-primary-foreground rounded-br-md"
                    }`}>
                      {msg.text.split("\n").map((line, i) => <p key={i} className={i > 0 ? "mt-1.5" : ""}>{line}</p>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Reply */}
      <div className="border-t border-border bg-card px-6 py-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Textarea value={reply} onChange={e => setReply(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
            placeholder="Antwort schreiben…" className="flex-1 min-h-[40px] max-h-[120px]" rows={1} />
          <Button onClick={sendReply} size="icon" disabled={!reply.trim()}><Send className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────── */
export default function Helpdesk() {
  const [tickets, setTickets] = useState<Ticket[]>(SAMPLE_TICKETS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"alle" | TicketStatus>("alle");
  const [katFilter, setKatFilter] = useState<"alle" | TicketKategorie>("alle");
  const [view, setView] = useState<"liste" | "dashboard">("liste");

  const selected = tickets.find(t => t.id === selectedId);

  const handleStatusChange = (id: string, status: TicketStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status, zuletztAktualisiert: new Date().toISOString() } : t));
  };

  const filtered = tickets.filter(t => {
    if (statusFilter !== "alle" && t.status !== statusFilter) return false;
    if (katFilter !== "alle" && t.kategorie !== katFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.betreff.toLowerCase().includes(q) || t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.firma?.toLowerCase().includes(q);
    }
    return true;
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }) + " " + d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  };

  const handleAddTeilnehmer = (ticketId: string, member: TicketTeilnehmer) => {
    setTickets(prev => prev.map(t =>
      t.id === ticketId ? { ...t, teilnehmer: [...t.teilnehmer, member] } : t
    ));
  };

  return (
    <CRMLayout>
      {selected ? (
        <TicketDetail ticket={selected} onBack={() => setSelectedId(null)} onStatusChange={handleStatusChange} onAddTeilnehmer={handleAddTeilnehmer} />
      ) : (
        <div className="p-6 lg:p-8 space-y-5 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1"><div className="w-10 h-1 rounded-full gradient-brand" /></div>
              <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Helpdesk</h1>
              <p className="text-sm text-muted-foreground mt-1">Support-Anfragen von Eigentümern & Entwicklern</p>
            </div>
            <div className="flex gap-2">
              <Button variant={view === "liste" ? "default" : "outline"} size="sm" onClick={() => setView("liste")}
                className={view === "liste" ? "gradient-brand border-0 text-primary-foreground" : ""}>
                <MessageSquare className="h-4 w-4 mr-1" /> Tickets
              </Button>
              <Button variant={view === "dashboard" ? "default" : "outline"} size="sm" onClick={() => setView("dashboard")}
                className={view === "dashboard" ? "gradient-brand border-0 text-primary-foreground" : ""}>
                <BarChart3 className="h-4 w-4 mr-1" /> Dashboard
              </Button>
            </div>
          </div>

          {/* Dashboard */}
          <HelpdeskDashboard tickets={tickets} />

          {view === "liste" && (
            <>
              {/* Filters */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Ticket-ID, Name oder Betreff suchen…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
                  <SelectTrigger className="w-[170px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle Status</SelectItem>
                    {Object.entries(STATUS_CFG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex gap-1">
                  {(["alle", "eigentümer", "entwickler"] as const).map(k => (
                    <Button key={k} variant={katFilter === k ? "default" : "outline"} size="sm"
                      className={katFilter === k ? "gradient-brand border-0 text-primary-foreground" : ""}
                      onClick={() => setKatFilter(k)}>
                      {k === "alle" ? "Alle" : k === "eigentümer" ? "Eigentümer" : "Entwickler"}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground ml-auto">{filtered.length} Tickets</p>
              </div>

              {/* Ticket List */}
              <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">ID</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Betreff</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Kategorie</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Absender</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Prio</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Erstellt</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Nachrichten</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(ticket => {
                        const stc = STATUS_CFG[ticket.status];
                        const StI = stc.icon;
                        const pc = PRIO_CFG[ticket.prioritaet];
                        const unread = ticket.status === "neu";
                        return (
                          <tr key={ticket.id}
                            onClick={() => setSelectedId(ticket.id)}
                            className={`border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors ${unread ? "bg-primary/5" : ""}`}>
                            <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{ticket.id}</td>
                            <td className="py-3 px-4">
                              <p className={`text-xs ${unread ? "font-bold text-foreground" : "font-medium text-foreground"}`}>{ticket.betreff}</p>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className={`text-[10px] ${ticket.kategorie === "entwickler" ? "border-b2b/30 text-b2b" : "border-b2c/30 text-b2c"}`}>
                                {ticket.kategorie === "entwickler" ? <><HardHat className="h-2.5 w-2.5 mr-1" />Entwickler</> : <><Building2 className="h-2.5 w-2.5 mr-1" />Eigentümer</>}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-xs text-foreground">{ticket.name}</p>
                              {ticket.firma && <p className="text-[10px] text-muted-foreground">{ticket.firma}</p>}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className={`text-[10px] gap-1 ${stc.color}`}><StI className="h-3 w-3" />{stc.label}</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className={`text-[10px] ${pc.color}`}>{pc.label}</Badge>
                            </td>
                            <td className="py-3 px-4 text-xs text-muted-foreground">{formatDate(ticket.erstelltAm)}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-foreground font-medium">{ticket.messages.length}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filtered.length === 0 && (
                        <tr><td colSpan={8} className="py-12 text-center text-muted-foreground">
                          <HeadphonesIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
                          <p className="text-sm">Keine Tickets gefunden.</p>
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </CRMLayout>
  );
}
