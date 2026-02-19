import { useState, useRef, useEffect } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, HeadphonesIcon } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "bot" | "system";
  text: string;
  time: string;
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
    answer: "Danke für deine Frage! Leider konnte ich dazu keine passende Antwort finden. Möchtest du mit einem Mitarbeiter verbunden werden? Schreib einfach **'Mitarbeiter'** und ich leite dich weiter.",
    handoff: false,
  };
}

export default function SupportKI() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [handedOff, setHandedOff] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const now = () => new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  const send = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    if (handedOff) return; // already handed off, messages go to agent

    setTimeout(() => {
      const { answer, handoff } = getAnswer(text);

      if (handoff) {
        setHandedOff(true);
        setMessages(prev => [
          ...prev,
          { id: crypto.randomUUID(), role: "system", text: "Du wirst jetzt mit einem Imondu-Mitarbeiter verbunden. Bitte warte einen Moment…", time: now() },
          { id: crypto.randomUUID(), role: "bot", text: "Ein Mitarbeiter wurde benachrichtigt und wird sich in Kürze bei dir melden. Du kannst hier schon dein Anliegen schildern – die Nachricht wird weitergeleitet. 🙌", time: now() },
        ]);
      } else {
        setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "bot", text: answer, time: now() }]);
      }
    }, 600);
  };

  return (
    <CRMLayout>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Imondu Support-KI</h1>
            <p className="text-xs text-muted-foreground">
              {handedOff ? (
                <span className="flex items-center gap-1">
                  <HeadphonesIcon className="h-3 w-3" /> Mit Mitarbeiter verbunden
                </span>
              ) : (
                "KI-Assistent • Sofortige Hilfe rund um die Uhr"
              )}
            </p>
          </div>
          {handedOff && (
            <Badge variant="secondary" className="ml-auto">Live-Support</Badge>
          )}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "system" ? (
                  <div className="w-full text-center">
                    <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                      <HeadphonesIcon className="h-3 w-3 mr-1" />
                      {msg.text}
                    </Badge>
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
              placeholder={handedOff ? "Nachricht an Mitarbeiter…" : "Frage an den Support-Assistenten…"}
              className="flex-1"
            />
            <Button onClick={send} size="icon" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {!handedOff && (
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Schreibe <span className="font-semibold">"Mitarbeiter"</span> um mit einem echten Ansprechpartner verbunden zu werden.
            </p>
          )}
        </div>
      </div>
    </CRMLayout>
  );
}
