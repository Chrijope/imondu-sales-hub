import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Send,
  Paperclip,
  Pin,
  PinOff,
  Eye,
  EyeOff,
  UserPlus,
  LogOut,
  MoreVertical,
  Check,
  CheckCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ChatMessage {
  id: string;
  sender: string;
  initials: string;
  text: string;
  time: string;
  isOwn: boolean;
  isSystem?: boolean;
}

interface ChatThread {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  pinned: boolean;
  members: { name: string; initials: string; role: string }[];
  messages: ChatMessage[];
}

const initialChats: ChatThread[] = [
  {
    id: "1",
    name: "Andreas Hub",
    initials: "AH",
    lastMessage: "Hallo zusammen, @Nico Greifendorf,...",
    time: "17:39",
    unread: 2,
    pinned: true,
    members: [
      { name: "Andreas Hub", initials: "AH", role: "Admin" },
      { name: "Christian Peetz", initials: "CP", role: "Teampartner" },
      { name: "Tobias Fritz", initials: "TF", role: "Teampartner" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "01.09.2025", isOwn: false, isSystem: true },
      { id: "s2", sender: "", initials: "", text: "Tobias Fritz (Finanzierungs- & Abwicklungsmanager) wurde zum Chat eingeladen", time: "", isOwn: false, isSystem: true },
      { id: "m1", sender: "Christian Peetz", initials: "CP", text: "Hallo zusammen, @Nico Greifendorf, ich habe den Chat einmal manuell erstellt bis der Bug durch die Technik gefixt wurde.", time: "17:39", isOwn: false },
    ],
  },
  {
    id: "2",
    name: "Oliver Gjorgijev",
    initials: "OG",
    lastMessage: "Perfekt, danke euch allen",
    time: "14:22",
    unread: 0,
    pinned: false,
    members: [
      { name: "Oliver Gjorgijev", initials: "OG", role: "Teampartner" },
      { name: "Max Müller", initials: "MM", role: "Vertriebler" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "28.01.2026", isOwn: false, isSystem: true },
      { id: "m1", sender: "Oliver Gjorgijev", initials: "OG", text: "Gibt es Neuigkeiten zu dem Projekt in München?", time: "14:10", isOwn: false },
      { id: "m2", sender: "Max Müller", initials: "MM", text: "Ja, der Kunde hat sich zurückgemeldet. Termin steht für nächste Woche.", time: "14:15", isOwn: true },
      { id: "m3", sender: "Oliver Gjorgijev", initials: "OG", text: "Perfekt, danke euch allen", time: "14:22", isOwn: false },
    ],
  },
  {
    id: "3",
    name: "Team Vertrieb",
    initials: "TV",
    lastMessage: "Neue Leads sind da, bitte prüfen",
    time: "09:45",
    unread: 5,
    pinned: false,
    members: [
      { name: "Max Müller", initials: "MM", role: "Vertriebler" },
      { name: "Sarah Klein", initials: "SK", role: "Admin" },
      { name: "Lukas Bauer", initials: "LB", role: "Teampartner" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "15.01.2026", isOwn: false, isSystem: true },
      { id: "m1", sender: "Sarah Klein", initials: "SK", text: "Guten Morgen Team! Wir haben 12 neue Leads aus der Kampagne.", time: "09:30", isOwn: false },
      { id: "m2", sender: "Lukas Bauer", initials: "LB", text: "Super, ich schaue mir die B2B Leads an.", time: "09:38", isOwn: false },
      { id: "m3", sender: "Sarah Klein", initials: "SK", text: "Neue Leads sind da, bitte prüfen", time: "09:45", isOwn: false },
    ],
  },
];

const teamMembers = [
  { name: "Nico Greifendorf", initials: "NG", role: "Teampartner" },
  { name: "Laura Meier", initials: "LM", role: "Teampartner" },
  { name: "Sarah Klein", initials: "SK", role: "Admin" },
  { name: "Jan Weber", initials: "JW", role: "Admin" },
  { name: "Lukas Bauer", initials: "LB", role: "Teampartner" },
];

export default function Chat() {
  const [chats, setChats] = useState<ChatThread[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteType, setInviteType] = useState<"admin" | "teampartner">("teampartner");

  const activeChat = chats.find((c) => c.id === activeChatId);

  const filteredChats = chats
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "Max Müller",
      initials: "MM",
      text: messageInput,
      time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: messageInput, time: newMsg.time }
          : c
      )
    );
    setMessageInput("");
  };

  const togglePin = (chatId: string) => {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, pinned: !c.pinned } : c)));
  };

  const toggleUnread = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unread: c.unread > 0 ? 0 : 1 } : c))
    );
  };

  const markRead = (chatId: string) => {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, unread: 0 } : c)));
  };

  const leaveChat = (chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (activeChatId === chatId) {
      const remaining = chats.filter((c) => c.id !== chatId);
      setActiveChatId(remaining[0]?.id || "");
    }
  };

  const inviteMember = (member: { name: string; initials: string; role: string }) => {
    if (!activeChat) return;
    const systemMsg: ChatMessage = {
      id: `s-${Date.now()}`,
      sender: "",
      initials: "",
      text: `${member.name} (${member.role}) wurde zum Chat eingeladen`,
      time: "",
      isOwn: false,
      isSystem: true,
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, members: [...c.members, member], messages: [...c.messages, systemMsg] }
          : c
      )
    );
    setInviteDialogOpen(false);
  };

  const availableInvites = teamMembers.filter(
    (tm) =>
      !activeChat?.members.some((m) => m.name === tm.name) &&
      (inviteType === "admin" ? tm.role === "Admin" : tm.role === "Teampartner")
  );

  return (
    <CRMLayout>
      <div className="flex h-[calc(100vh-2rem)] bg-card rounded-xl border border-border shadow-crm-sm overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="w-[300px] border-r border-border flex flex-col bg-muted/30">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Chat suchen"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-background"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => { setActiveChatId(chat.id); markRead(chat.id); }}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-border/50 transition-colors ${
                  activeChatId === chat.id ? "bg-background" : "hover:bg-background/60"
                }`}
              >
                <div className="h-10 w-10 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                  {chat.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold truncate ${chat.unread > 0 ? "text-accent" : "text-foreground"}`}>
                      {chat.name}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      {chat.pinned && <Pin className="h-3 w-3 text-muted-foreground" />}
                      {chat.unread > 0 && (
                        <Badge className="h-5 min-w-[20px] px-1.5 text-[10px] gradient-brand text-primary-foreground border-0">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Context menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <button className="opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 p-1 rounded hover:bg-muted">
                      <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); togglePin(chat.id); }}>
                      {chat.pinned ? <PinOff className="h-4 w-4 mr-2" /> : <Pin className="h-4 w-4 mr-2" />}
                      {chat.pinned ? "Lösen" : "Anpinnen"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleUnread(chat.id); }}>
                      {chat.unread > 0 ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                      {chat.unread > 0 ? "Als gelesen markieren" : "Als ungelesen markieren"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => { e.stopPropagation(); leaveChat(chat.id); }}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Chat verlassen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Main Area */}
        {activeChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-8 h-1 rounded-full gradient-brand" />
              </div>
              <h2 className="text-lg font-display font-bold text-foreground">Chat</h2>

              {/* Members */}
              <div className="flex items-center gap-1 mt-3">
                {activeChat.members.map((m) => (
                  <div
                    key={m.name}
                    className="h-9 w-9 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground border-2 border-card -ml-1 first:ml-0"
                    title={`${m.name} (${m.role})`}
                  >
                    {m.initials}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3">
                <Dialog open={inviteDialogOpen && inviteType === "admin"} onOpenChange={(o) => { setInviteDialogOpen(o); setInviteType("admin"); }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs border-accent text-accent hover:bg-accent/10">
                      <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                      Admin einladen
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Admin einladen</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 mt-2">
                      {availableInvites.length > 0 ? availableInvites.map((m) => (
                        <button
                          key={m.name}
                          onClick={() => inviteMember(m)}
                          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="h-9 w-9 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
                            {m.initials}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-foreground">{m.name}</p>
                            <p className="text-xs text-muted-foreground">{m.role}</p>
                          </div>
                        </button>
                      )) : (
                        <p className="text-sm text-muted-foreground py-4 text-center">Keine Admins verfügbar</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={inviteDialogOpen && inviteType === "teampartner"} onOpenChange={(o) => { setInviteDialogOpen(o); setInviteType("teampartner"); }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs border-accent text-accent hover:bg-accent/10">
                      <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                      Teampartner einladen
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Teampartner einladen</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 mt-2">
                      {availableInvites.length > 0 ? availableInvites.map((m) => (
                        <button
                          key={m.name}
                          onClick={() => inviteMember(m)}
                          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="h-9 w-9 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
                            {m.initials}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-foreground">{m.name}</p>
                            <p className="text-xs text-muted-foreground">{m.role}</p>
                          </div>
                        </button>
                      )) : (
                        <p className="text-sm text-muted-foreground py-4 text-center">Keine Teampartner verfügbar</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-destructive/50 text-destructive hover:bg-destructive/10"
                  onClick={() => leaveChat(activeChatId)}
                >
                  <LogOut className="h-3.5 w-3.5 mr-1.5" />
                  Chat verlassen
                </Button>

                <Button variant="ghost" size="sm" className="ml-auto">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="max-w-3xl mx-auto space-y-4">
                {activeChat.messages.map((msg) => {
                  if (msg.isSystem) {
                    return (
                      <div key={msg.id} className="flex items-center gap-3 justify-center my-4">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {msg.time ? `${msg.time} — ` : ""}{msg.text}
                        </span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                      {!msg.isOwn && (
                        <div className="h-9 w-9 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0 mt-1">
                          {msg.initials}
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          msg.isOwn
                            ? "bg-accent/10 border-2 border-accent rounded-br-sm"
                            : "bg-muted border border-border rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm text-foreground whitespace-pre-wrap">{msg.text}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[11px] text-muted-foreground font-medium">{msg.sender}</span>
                          <span className="text-[11px] text-muted-foreground">— {msg.time}</span>
                          {msg.isOwn && <CheckCheck className="h-3.5 w-3.5 text-accent ml-auto" />}
                        </div>
                      </div>
                      {msg.isOwn && (
                        <div className="h-9 w-9 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0 mt-1">
                          {msg.initials}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="px-6 py-4 border-t border-border">
              <div className="flex items-end gap-3">
                <Textarea
                  placeholder="Nachricht eingeben ..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="min-h-[44px] max-h-[120px] resize-none text-sm"
                  rows={1}
                />
                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  className="shrink-0 gradient-brand text-primary-foreground hover:opacity-90"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Wähle einen Chat aus der Liste</p>
          </div>
        )}
      </div>
    </CRMLayout>
  );
}
