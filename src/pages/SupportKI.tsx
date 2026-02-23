import { useState, useRef, useEffect, useCallback } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, HeadphonesIcon, Ticket, CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "bot" | "system" | "support" | "ticket-card";
  text: string;
  time: string;
  ticketId?: string;
  ticketStatus?: string;
}

const FAQ: { keywords: string[]; answer: string }[] = [
  { keywords: ["provision", "abrechnung", "verdienst", "geld"], answer: "Deine Provisionen findest du unter Auswertung → Abrechnungen. Die Auszahlung erfolgt jeweils zum 15. des Folgemonats. Bei Rückfragen zur Höhe kannst du deinen Teamleiter kontaktieren." },
  { keywords: ["lead", "leads", "kontakt", "kunde"], answer: "Neue Leads findest du in deinem B2C- oder B2B-Bereich unter 'Neue Leads'. Du kannst Leads auch über den Shop zukaufen unter Shop → Lead-Kauf. Vergiss nicht, deine Leads zeitnah zu kontaktieren!" },
  { keywords: ["dialer", "powerdialer", "anruf", "telefonier"], answer: "Den Powerdialer findest du unter Vertrieb → Powerdialer. Wähle zuerst B2C oder B2B, dann startet das passende Gesprächsskript automatisch. Deine Notizen werden im Kundenprofil gespeichert." },
  { keywords: ["termin", "kalender", "meeting"], answer: "Termine verwaltest du im Kalender (Übersicht → Kalender). Gebuchte Termine erscheinen auch in deinem Lead-Bereich unter 'Termine gebucht'. Du kannst Termine direkt aus dem Lead-Profil erstellen." },
  { keywords: ["pipeline", "status", "phase"], answer: "Die Pipeline zeigt dir alle deine Leads nach Status sortiert. Du kannst Leads per Drag & Drop zwischen den Phasen verschieben. Nutze Filter, um nach B2C/B2B oder Zeitraum zu sortieren." },
  { keywords: ["academy", "schulung", "lernen", "training"], answer: "In der Academy (Tools & Wissen → Academy) findest du Schulungsvideos, Leitfäden und Best Practices. Neue Inhalte werden regelmäßig hinzugefügt – schau öfter mal rein!" },
  { keywords: ["passwort", "login", "zugang", "einstellungen"], answer: "Deine Zugangsdaten und Profileinstellungen kannst du unten links über dein Profil → Einstellungen ändern. Bei Problemen mit dem Login wende dich an deinen Admin." },
  { keywords: ["microseite", "seite", "berater"], answer: "Deine persönliche Berater-Microseite findest du unter Team & Admin → Berater-Microseite. Dort kannst du dein Profil, Foto und deine Kontaktdaten für Kunden pflegen." },
];

const WELCOME: Message = {
  id: "welcome",
  role: "bot",
  text: "Hallo! 👋 Ich bin der Imondu Support-Assistent. Ich helfe dir bei Fragen rund um das CRM, Leads, Provisionen, den Powerdialer und mehr.\n\nWie kann ich dir helfen?",
  time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
};

function getAnswer(input: string): { answer: string; handoff: boolean } {
  const lower = input.toLowerCase();

  if (["mitarbeiter", "mensch", "support", "hilfe echte", "weiterleiten", "agent"].some(k => lower.includes(k))) {
    return { answer: "", handoff: true };
  }

  for (const faq of FAQ) {
    if (faq.keywords.some(k => lower.includes(k))) {
      return { answer: faq.answer, handoff: false };
    }
  }

  return {
    answer: "Danke für deine Frage! Leider konnte ich dazu keine passende Antwort finden. Ich erstelle ein Support-Ticket für dich – unser Backoffice-Team meldet sich schnellstmöglich bei dir zurück.",
    handoff: true,
  };
}

const STATUS_LABELS: Record<string, { label: string; icon: typeof CheckCircle2; color: string }> = {
  neu: { label: "Neu", icon: AlertCircle, color: "text-primary" },
  offen: { label: "Offen", icon: Clock, color: "text-warning" },
  in_bearbeitung: { label: "In Bearbeitung", icon: Clock, color: "text-accent" },
  geloest: { label: "Gelöst ✅", icon: CheckCircle2, color: "text-green-600" },
  geschlossen: { label: "Geschlossen", icon: XCircle, color: "text-muted-foreground" },
};

function TicketCard({ ticketId, betreff, status }: { ticketId: string; betreff: string; status: string }) {
  const st = STATUS_LABELS[status] || STATUS_LABELS.neu;
  const StIcon = st.icon;
  const isResolved = status === "geloest" || status === "geschlossen";

  return (
    <div className={`w-full max-w-md mx-auto rounded-xl border p-4 ${isResolved ? "border-green-200 bg-green-50/50" : "border-primary/20 bg-primary/5"}`}>
      <div className="flex items-center gap-2 mb-2">
        <Ticket className={`h-4 w-4 ${isResolved ? "text-green-600" : "text-primary"}`} />
        <span className="text-xs font-mono font-bold text-foreground">{ticketId}</span>
        <Badge variant="outline" className={`ml-auto text-[10px] gap-1 ${st.color}`}>
          <StIcon className="h-3 w-3" />
          {st.label}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{betreff}</p>
      {isResolved && (
        <p className="text-xs text-green-600 font-medium mt-2">✅ Dieses Ticket wurde vom Backoffice als erledigt markiert.</p>
      )}
    </div>
  );
}

export default function SupportKI() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [tickets, setTickets] = useState<{ id: string; betreff: string; status: string; lastMsgCount: number }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { currentRoleId } = useUserRole();
  const { toast } = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const now = () => new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  // Poll for admin replies and status changes on tickets
  const pollTicketUpdates = useCallback(() => {
    try {
      const raw = localStorage.getItem("helpdesk-new-tickets");
      if (!raw) return;
      const allTickets = JSON.parse(raw);

      setTickets(prev => {
        let changed = false;
        const updated = prev.map(t => {
          const hdTicket = allTickets.find((ht: any) => ht.id === t.id);
          if (!hdTicket) return t;

          // Check for new messages from support
          const supportMsgs = (hdTicket.messages || []).filter((m: any) => m.role === "support");
          if (supportMsgs.length > t.lastMsgCount) {
            const newMsgs = supportMsgs.slice(t.lastMsgCount);
            newMsgs.forEach((m: any) => {
              setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                role: "support" as const,
                text: m.text,
                time: m.time || now(),
                ticketId: t.id,
              }]);
            });
            changed = true;
          }

          // Check for status changes
          if (hdTicket.status !== t.status) {
            const isResolved = hdTicket.status === "geloest" || hdTicket.status === "geschlossen";
            setMessages(prev => [...prev, {
              id: crypto.randomUUID(),
              role: "ticket-card" as const,
              text: "",
              time: now(),
              ticketId: t.id,
              ticketStatus: hdTicket.status,
            }]);
            if (isResolved) {
              setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                role: "system" as const,
                text: `Ticket ${t.id} wurde vom Backoffice als "${STATUS_LABELS[hdTicket.status]?.label || hdTicket.status}" markiert.`,
                time: now(),
              }]);
            }
            changed = true;
          }

          return { ...t, status: hdTicket.status, lastMsgCount: supportMsgs.length };
        });

        return changed ? updated : prev;
      });
    } catch {}
  }, []);

  useEffect(() => {
    const interval = setInterval(pollTicketUpdates, 2000);
    window.addEventListener("storage", pollTicketUpdates);
    window.addEventListener("focus", pollTicketUpdates);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", pollTicketUpdates);
      window.removeEventListener("focus", pollTicketUpdates);
    };
  }, [pollTicketUpdates]);

  // Create a helpdesk ticket from the conversation
  const createHelpdeskTicket = (userMessages: Message[]): string => {
    const kategorie = currentRoleId === "entwickler" ? "entwickler" : "eigentümer";
    const name = currentRoleId === "entwickler" ? "Elektro Huber & Partner" : "Hans Müller";
    const email = currentRoleId === "entwickler" ? "info@elektro-huber.de" : "h.mueller@mail.de";
    const firma = currentRoleId === "entwickler" ? "Elektro Huber & Partner" : undefined;

    const userOnlyMsgs = userMessages.filter(m => m.role === "user");
    const betreff = userOnlyMsgs.length > 0
      ? userOnlyMsgs[userOnlyMsgs.length - 1].text.slice(0, 60) + (userOnlyMsgs[userOnlyMsgs.length - 1].text.length > 60 ? "…" : "")
      : "Support-Anfrage";

    const ticketId = `T-${Math.floor(1000 + Math.random() * 9000)}`;

    const ticket = {
      id: ticketId,
      betreff,
      kategorie,
      name,
      firma,
      email,
      status: "neu",
      prioritaet: "mittel",
      erstelltAm: new Date().toISOString(),
      zuletztAktualisiert: new Date().toISOString(),
      tags: ["Support-KI", "Weiterleitung"],
      teilnehmer: [],
      messages: userMessages
        .filter(m => m.role === "user" || m.role === "bot")
        .map((m, i) => ({
          id: `m-${i}`,
          sender: m.role === "user" ? name : "Support-KI",
          role: m.role === "user" ? "kunde" : "ki",
          text: m.text,
          time: m.time,
        })),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("helpdesk-new-tickets") || "[]");
      existing.push(ticket);
      localStorage.setItem("helpdesk-new-tickets", JSON.stringify(existing));
      window.dispatchEvent(new Event("storage"));
    } catch {}

    // Track this ticket locally
    setTickets(prev => [...prev, { id: ticketId, betreff, status: "neu", lastMsgCount: 0 }]);

    toast({
      title: "Ticket erstellt",
      description: `Dein Anliegen wurde als ${ticketId} an das Backoffice weitergeleitet.`,
    });

    return ticketId;
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // If we have open tickets, append user message to the ticket in localStorage
    const openTicket = tickets.find(t => t.status !== "geloest" && t.status !== "geschlossen");
    if (openTicket) {
      try {
        const all = JSON.parse(localStorage.getItem("helpdesk-new-tickets") || "[]");
        const idx = all.findIndex((t: any) => t.id === openTicket.id);
        if (idx >= 0) {
          const name = currentRoleId === "entwickler" ? "Elektro Huber & Partner" : "Hans Müller";
          all[idx].messages.push({
            id: crypto.randomUUID(),
            sender: name,
            role: "kunde",
            text,
            time: now(),
          });
          all[idx].zuletztAktualisiert = new Date().toISOString();
          localStorage.setItem("helpdesk-new-tickets", JSON.stringify(all));
          window.dispatchEvent(new Event("storage"));
        }
      } catch {}
      return; // Don't process through KI if ticket is open
    }

    setTimeout(() => {
      const { answer, handoff } = getAnswer(text);

      if (handoff) {
        const allMsgs = [...messages, userMsg];
        const ticketId = createHelpdeskTicket(allMsgs);
        setMessages(prev => [
          ...prev,
          // Show ticket card
          { id: crypto.randomUUID(), role: "ticket-card" as const, text: "", time: now(), ticketId, ticketStatus: "neu" },
          { id: crypto.randomUUID(), role: "bot", text: answer || `Ich habe Ticket **${ticketId}** für dein Anliegen erstellt. Unser Backoffice-Team wird sich schnellstmöglich bei dir melden. Du kannst hier gerne weitere Details schildern – alles wird an das Team weitergeleitet. 🙌`, time: now() },
        ]);
      } else {
        setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "bot", text: answer, time: now() }]);
      }
    }, 600);
  };

  const hasOpenTicket = tickets.some(t => t.status !== "geloest" && t.status !== "geschlossen");
  const activeTicket = tickets.find(t => t.status !== "geloest" && t.status !== "geschlossen");

  return (
    <CRMLayout>
      <div className="h-screen flex flex-col dashboard-mesh-bg">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Imondu Support-KI</h1>
            <p className="text-xs text-muted-foreground">
              {activeTicket ? (
                <span className="flex items-center gap-1">
                  <Ticket className="h-3 w-3" /> Ticket {activeTicket.id} – Backoffice bearbeitet
                </span>
              ) : (
                "KI-Assistent • Sofortige Hilfe rund um die Uhr"
              )}
            </p>
          </div>
          {activeTicket && (
            <Badge variant="secondary" className="ml-auto text-[10px] gap-1">
              <Ticket className="h-3 w-3" /> {activeTicket.id}
            </Badge>
          )}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ticket-card" ? (
                  <TicketCard
                    ticketId={msg.ticketId || ""}
                    betreff={tickets.find(t => t.id === msg.ticketId)?.betreff || "Support-Anfrage"}
                    status={msg.ticketStatus || "neu"}
                  />
                ) : msg.role === "system" ? (
                  <div className="w-full text-center">
                    <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                      <HeadphonesIcon className="h-3 w-3 mr-1" />
                      {msg.text}
                    </Badge>
                  </div>
                ) : msg.role === "support" ? (
                  <div className="flex gap-2 max-w-[80%]">
                    <div className="h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold bg-green-100 text-green-700">
                      <HeadphonesIcon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-green-600 font-medium mb-0.5">Backoffice · {msg.ticketId}</p>
                      <div className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed bg-green-50 text-foreground rounded-bl-md border border-green-200">
                        {msg.text.split("\n").map((line, i) => (
                          <p key={i} className={i > 0 ? "mt-1.5" : ""}>{line}</p>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{msg.time}</p>
                    </div>
                  </div>
                ) : (
                  <div className={`flex gap-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                    }`}>
                      {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}>
                        {msg.text.split("\n").map((line, i) => (
                          <p key={i} className={i > 0 ? "mt-1.5" : ""}>{line}</p>
                        ))}
                      </div>
                      <p className={`text-[10px] text-muted-foreground mt-1 ${msg.role === "user" ? "text-right" : ""}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border bg-card px-6 py-4">
          <div className="max-w-2xl mx-auto flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder={hasOpenTicket ? `Nachricht zu Ticket ${activeTicket?.id} hinzufügen…` : "Frage an den Support-Assistenten…"}
              className="flex-1"
            />
            <Button onClick={send} size="icon" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {hasOpenTicket ? (
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              📋 Ticket {activeTicket?.id} ist offen. Deine Nachrichten werden an das Backoffice weitergeleitet.
            </p>
          ) : (
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Bei Fragen die ich nicht beantworten kann, wird automatisch ein Ticket für unser Backoffice erstellt.
            </p>
          )}
        </div>
      </div>
    </CRMLayout>
  );
}
