import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CRMLayout from "@/components/CRMLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  ChevronDown,
  Check,
  CheckCheck,
  Building2,
  Home,
  Users,
  MessageSquare,
  Archive,
  BellOff,
  Trash2,
  MoreVertical,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  archived: boolean;
  muted: boolean;
  category: "intern" | "entwickler" | "eigentuemer";
  members: { name: string; initials: string; role: string; firma?: string }[];
  messages: ChatMessage[];
}

const initialChats: ChatThread[] = [
  // ── Intern ──
  {
    id: "1",
    name: "Andreas Hub",
    initials: "AH",
    lastMessage: "Hallo zusammen, @Nico Greifendorf,...",
    time: "17:39",
    unread: 2,
    pinned: true,
    archived: false,
    muted: false,
    category: "intern",
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
    id: "3",
    name: "Team Vertrieb",
    initials: "TV",
    lastMessage: "Neue Leads sind da, bitte prüfen",
    time: "09:45",
    unread: 5,
    pinned: false,
    archived: false,
    muted: false,
    category: "intern",
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
  {
    id: "int-3",
    name: "Oliver Gjorgijev",
    initials: "OG",
    lastMessage: "Perfekt, danke euch allen",
    time: "14:22",
    unread: 0,
    pinned: false,
    archived: false,
    muted: false,
    category: "intern",
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
  // ── Entwickler ──
  {
    id: "dev-1",
    name: "Weber Bau GmbH",
    initials: "WB",
    lastMessage: "Wann können wir mit dem Auftrag rechnen?",
    time: "15:10",
    unread: 1,
    pinned: false,
    archived: false,
    muted: false,
    category: "entwickler",
    members: [
      { name: "Thomas Weber", initials: "TW", role: "Entwickler", firma: "Weber Bau GmbH" },
      { name: "Max Müller", initials: "MM", role: "Vertriebler" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "10.02.2026", isOwn: false, isSystem: true },
      { id: "m1", sender: "Max Müller", initials: "MM", text: "Hallo Herr Weber, ich habe ein passendes Projekt in Ihrer Region gefunden.", time: "14:30", isOwn: true },
      { id: "m2", sender: "Thomas Weber", initials: "TW", text: "Das klingt interessant! Können Sie mir mehr Details schicken?", time: "14:45", isOwn: false },
      { id: "m3", sender: "Max Müller", initials: "MM", text: "Natürlich, ich schicke Ihnen die Unterlagen per E-Mail.", time: "14:50", isOwn: true },
      { id: "m4", sender: "Thomas Weber", initials: "TW", text: "Wann können wir mit dem Auftrag rechnen?", time: "15:10", isOwn: false },
    ],
  },
  {
    id: "dev-2",
    name: "Elektro Schmitt",
    initials: "ES",
    lastMessage: "Die Referenzbilder sind angehängt",
    time: "11:30",
    unread: 0,
    pinned: false,
    archived: false,
    muted: false,
    category: "entwickler",
    members: [
      { name: "Peter Schmitt", initials: "PS", role: "Entwickler", firma: "Elektro Schmitt" },
      { name: "Max Müller", initials: "MM", role: "Vertriebler" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "05.02.2026", isOwn: false, isSystem: true },
      { id: "m1", sender: "Peter Schmitt", initials: "PS", text: "Guten Tag, ich wollte meine Referenzen für das Profil nachreichen.", time: "11:20", isOwn: false },
      { id: "m2", sender: "Peter Schmitt", initials: "PS", text: "Die Referenzbilder sind angehängt", time: "11:30", isOwn: false },
    ],
  },
  {
    id: "dev-3",
    name: "Dach & Fassade Krüger",
    initials: "DK",
    lastMessage: "Können wir die Konditionen nochmal besprechen?",
    time: "Gestern",
    unread: 3,
    pinned: true,
    archived: false,
    muted: false,
    category: "entwickler",
    members: [
      { name: "Hans Krüger", initials: "HK", role: "Entwickler", firma: "Dach & Fassade Krüger" },
      { name: "Max Müller", initials: "MM", role: "Vertriebler" },
      { name: "Sarah Klein", initials: "SK", role: "Admin" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "01.02.2026", isOwn: false, isSystem: true },
      { id: "m1", sender: "Hans Krüger", initials: "HK", text: "Wir sind an einer Partnerschaft interessiert, aber der Jahresbeitrag ist für uns aktuell etwas hoch.", time: "16:00", isOwn: false },
      { id: "m2", sender: "Max Müller", initials: "MM", text: "Verstehe ich. Lassen Sie uns gerne die verschiedenen Optionen besprechen.", time: "16:15", isOwn: true },
      { id: "m3", sender: "Hans Krüger", initials: "HK", text: "Können wir die Konditionen nochmal besprechen?", time: "16:30", isOwn: false },
    ],
  },
  // ── Eigentümer ──
  {
    id: "eigen-1",
    name: "Anna Schmidt",
    initials: "AS",
    lastMessage: "Vielen Dank, der Termin passt mir gut!",
    time: "16:45",
    unread: 1,
    pinned: false,
    archived: false,
    muted: false,
    category: "eigentuemer",
    members: [
      { name: "Anna Schmidt", initials: "AS", role: "Eigentümer" },
      { name: "Max Müller", initials: "MM", role: "Vertriebler" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "17.02.2026", isOwn: false, isSystem: true },
      { id: "m1", sender: "Max Müller", initials: "MM", text: "Hallo Frau Schmidt, vielen Dank für Ihr Interesse an einer Immobilienbewertung. Ich würde Ihnen gerne einen Vor-Ort-Termin anbieten.", time: "16:20", isOwn: true },
      { id: "m2", sender: "Anna Schmidt", initials: "AS", text: "Das wäre super! Wann hätten Sie Zeit?", time: "16:30", isOwn: false },
      { id: "m3", sender: "Max Müller", initials: "MM", text: "Wie wäre es am Donnerstag um 14 Uhr?", time: "16:35", isOwn: true },
      { id: "m4", sender: "Anna Schmidt", initials: "AS", text: "Vielen Dank, der Termin passt mir gut!", time: "16:45", isOwn: false },
    ],
  },
  {
    id: "eigen-2",
    name: "Klaus Meier",
    initials: "KM",
    lastMessage: "Können Sie mir eine zweite Meinung geben?",
    time: "12:15",
    unread: 0,
    pinned: false,
    archived: false,
    muted: false,
    category: "eigentuemer",
    members: [
      { name: "Klaus Meier", initials: "KM", role: "Eigentümer" },
      { name: "Max Müller", initials: "MM", role: "Vertriebler" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "12.02.2026", isOwn: false, isSystem: true },
      { id: "m1", sender: "Klaus Meier", initials: "KM", text: "Hallo, ich habe bereits eine Bewertung von einem anderen Makler erhalten, aber die Zahl kommt mir niedrig vor.", time: "12:00", isOwn: false },
      { id: "m2", sender: "Klaus Meier", initials: "KM", text: "Können Sie mir eine zweite Meinung geben?", time: "12:15", isOwn: false },
    ],
  },
  {
    id: "eigen-3",
    name: "Petra Schulz",
    initials: "PS",
    lastMessage: "Welche Unterlagen brauchen Sie von mir?",
    time: "10:00",
    unread: 2,
    pinned: false,
    archived: false,
    muted: false,
    category: "eigentuemer",
    members: [
      { name: "Petra Schulz", initials: "PS", role: "Eigentümer" },
      { name: "Max Müller", initials: "MM", role: "Vertriebler" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "18.02.2026", isOwn: false, isSystem: true },
      { id: "m1", sender: "Max Müller", initials: "MM", text: "Hallo Frau Schulz, Sie wurden mir als neuer Lead zugewiesen. Ich helfe Ihnen gerne bei der Bewertung Ihrer Immobilie.", time: "09:45", isOwn: true },
      { id: "m2", sender: "Petra Schulz", initials: "PS", text: "Super, das freut mich! Ich möchte mein Einfamilienhaus verkaufen.", time: "09:55", isOwn: false },
      { id: "m3", sender: "Petra Schulz", initials: "PS", text: "Welche Unterlagen brauchen Sie von mir?", time: "10:00", isOwn: false },
    ],
  },
];

const teamMembers = [
  { name: "Nico Greifendorf", initials: "NG", role: "Teampartner" },
  { name: "Laura Meier", initials: "LM", role: "Teampartner" },
  { name: "Sarah Klein", initials: "SK", role: "Admin" },
  { name: "Jan Weber", initials: "JW", role: "Admin" },
  { name: "Lukas Bauer", initials: "LB", role: "Teampartner" },
  { name: "Weber Bau GmbH", initials: "WB", role: "Entwickler" },
  { name: "Elektro Schmitt", initials: "ES", role: "Entwickler" },
  { name: "Dach & Fassade Krüger", initials: "DK", role: "Entwickler" },
  { name: "Anna Schmidt", initials: "AS", role: "Eigentümer" },
  { name: "Klaus Meier", initials: "KM", role: "Eigentümer" },
  { name: "Petra Schulz", initials: "PS", role: "Eigentümer" },
];

const CHAT_CATEGORIES = [
  { id: "alle" as const, label: "Alle", icon: MessageSquare },
  { id: "intern" as const, label: "Intern", icon: Users },
  { id: "entwickler" as const, label: "Entwickler", icon: Building2 },
  { id: "eigentuemer" as const, label: "Eigentümer", icon: Home },
];

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [chats, setChats] = useState<ChatThread[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteType, setInviteType] = useState<"admin" | "teampartner" | "entwickler" | "eigentuemer">("teampartner");
  const [activeCategory, setActiveCategory] = useState<"alle" | "intern" | "entwickler" | "eigentuemer">("alle");
  const [showArchived, setShowArchived] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatId, chats]);

  // Handle deep-link from LeadDetail
  useEffect(() => {
    const newChatName = searchParams.get("newChat");
    const category = searchParams.get("category") as "intern" | "entwickler" | "eigentuemer" | null;
    if (!newChatName) return;

    const existing = chats.find((c) => c.name === newChatName);
    if (existing) {
      setActiveChatId(existing.id);
      setActiveCategory(existing.category);
    } else {
      const initials = newChatName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
      const role = category === "entwickler" ? "Entwickler" : category === "eigentuemer" ? "Eigentümer" : "Teampartner";
      const newChat: ChatThread = {
        id: `new-${Date.now()}`,
        name: newChatName,
        initials,
        lastMessage: "Chat gestartet",
        time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
        unread: 0,
        pinned: false,
        archived: false,
        muted: false,
        category: category || "intern",
        members: [
          { name: newChatName, initials, role },
          { name: "Max Müller", initials: "MM", role: "Vertriebler" },
        ],
        messages: [
          { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: new Date().toLocaleDateString("de-DE"), isOwn: false, isSystem: true },
        ],
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      setActiveCategory(category || "alle");
    }
    setSearchParams({}, { replace: true });
  }, []);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const filteredChats = chats
    .filter((c) => showArchived ? c.archived : !c.archived)
    .filter((c) => activeCategory === "alle" || c.category === activeCategory)
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

  const toggleArchive = (chatId: string) => {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, archived: !c.archived } : c)));
    if (activeChatId === chatId) {
      const remaining = chats.filter((c) => c.id !== chatId && !c.archived);
      setActiveChatId(remaining[0]?.id || "");
    }
  };

  const toggleMute = (chatId: string) => {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, muted: !c.muted } : c)));
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
      (inviteType === "admin" ? tm.role === "Admin"
        : inviteType === "entwickler" ? tm.role === "Entwickler"
        : inviteType === "eigentuemer" ? tm.role === "Eigentümer"
        : tm.role === "Teampartner")
  );

  const getCategoryCount = (catId: string) => {
    if (catId === "alle") return chats.filter(c => !c.archived).length;
    return chats.filter(c => c.category === catId && !c.archived).length;
  };

  const getUnreadCount = (catId: string) => {
    if (catId === "alle") return chats.filter(c => c.unread > 0 && !c.archived).length;
    return chats.filter(c => c.category === catId && c.unread > 0 && !c.archived).length;
  };

  return (
    <CRMLayout>
      <div className="flex h-[calc(100vh-2rem)] bg-card rounded-xl border border-border shadow-crm-sm overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="w-[320px] border-r border-border flex flex-col bg-muted/30">
          <div className="p-3 border-b border-border space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Chat suchen"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-background"
              />
            </div>
            {/* Category Filter as Dropdown + Archive toggle */}
            <div className="flex items-center gap-2">
              <Select value={activeCategory} onValueChange={(v) => setActiveCategory(v as typeof activeCategory)}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <div className="flex items-center gap-1.5">
                    <Filter className="h-3 w-3" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {CHAT_CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <cat.icon className="h-3.5 w-3.5" />
                        <span>{cat.label}</span>
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 ml-1">{getCategoryCount(cat.id)}</Badge>
                        {getUnreadCount(cat.id) > 0 && (
                          <Badge className="gradient-brand border-0 text-white text-[9px] px-1.5 py-0">{getUnreadCount(cat.id)} neu</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={showArchived ? "default" : "outline"}
                size="sm"
                className={`h-8 text-xs px-2 ${showArchived ? "gradient-brand border-0 text-white" : ""}`}
                onClick={() => setShowArchived(!showArchived)}
              >
                <Archive className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            {filteredChats.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                <MessageSquare className="h-6 w-6 mx-auto mb-2 opacity-40" />
                <p className="text-xs">{showArchived ? "Keine archivierten Chats" : "Keine Chats gefunden"}</p>
              </div>
            )}
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => { setActiveChatId(chat.id); markRead(chat.id); }}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-border/50 transition-colors group relative ${
                  activeChatId === chat.id ? "bg-background" : "hover:bg-background/60"
                } ${chat.unread > 0 ? "bg-primary/[0.03]" : ""}`}
              >
                {/* Avatar with pin indicator */}
                <div className="relative shrink-0">
                  <div className="h-10 w-10 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {chat.initials}
                  </div>
                  {chat.pinned && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
                      <Pin className="h-2.5 w-2.5 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm truncate ${chat.unread > 0 ? "font-bold text-foreground" : "font-semibold text-foreground"}`}>
                      {chat.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className={`text-xs truncate ${chat.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {chat.lastMessage}
                    </p>
                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                      {chat.muted && (
                        <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center">
                          <BellOff className="h-2.5 w-2.5 text-muted-foreground" />
                        </div>
                      )}
                      {chat.unread > 0 && (
                        <Badge className="h-5 min-w-[20px] px-1.5 text-[10px] gradient-brand text-primary-foreground border-0">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dropdown arrow on each chat item */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <button className="absolute top-2 right-2 p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); togglePin(chat.id); }}>
                      {chat.pinned ? <PinOff className="h-4 w-4 mr-2" /> : <Pin className="h-4 w-4 mr-2" />}
                      {chat.pinned ? "Chat lösen" : "Chat anpinnen"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleUnread(chat.id); }}>
                      {chat.unread > 0 ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                      {chat.unread > 0 ? "Als gelesen markieren" : "Als ungelesen markieren"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleMute(chat.id); }}>
                      <BellOff className="h-4 w-4 mr-2" />
                      {chat.muted ? "Benachrichtigungen an" : "Stummschalten"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleArchive(chat.id); }}>
                      <Archive className="h-4 w-4 mr-2" />
                      {chat.archived ? "Aus Archiv holen" : "Archivieren"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => { e.stopPropagation(); leaveChat(chat.id); }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Chat löschen
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
            <div className="px-6 py-3 border-b border-border flex items-center gap-4">
              <div className="h-10 w-10 rounded-full gradient-brand flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
                {activeChat.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-display font-bold text-foreground truncate">{activeChat.name}</h2>
                <p className="text-[11px] text-muted-foreground">
                  {activeChat.members.length} Teilnehmer · {activeChat.category === "intern" ? "Interner Chat" : activeChat.category === "entwickler" ? "Entwickler-Chat" : "Eigentümer-Chat"}
                </p>
              </div>

              {/* Member Avatars with Tooltip */}
              <div className="flex items-center -space-x-2">
                {activeChat.members.slice(0, 5).map((m) => (
                  <Tooltip key={m.name}>
                    <TooltipTrigger asChild>
                      <div className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-[10px] font-bold text-primary-foreground border-2 border-card cursor-pointer hover:z-10 hover:scale-110 transition-transform">
                        {m.initials}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      <p className="font-semibold">{m.name}</p>
                      {m.firma && <p className="text-muted-foreground">{m.firma}</p>}
                      <p className="text-muted-foreground">{m.role}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {activeChat.members.length > 5 && (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground border-2 border-card">
                    +{activeChat.members.length - 5}
                  </div>
                )}
              </div>

              {/* Header actions */}
              <div className="flex items-center gap-1">
                <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setInviteType("teampartner")}>
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Teilnehmer einladen</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-1 mb-3">
                      {(["admin", "teampartner", "entwickler", "eigentuemer"] as const).map(t => (
                        <Button key={t} variant={inviteType === t ? "default" : "outline"} size="sm" className={`text-xs ${inviteType === t ? "gradient-brand border-0 text-white" : ""}`} onClick={() => setInviteType(t)}>
                          {t === "admin" ? "Admin" : t === "teampartner" ? "Teampartner" : t === "entwickler" ? "Entwickler" : "Eigentümer"}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2">
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
                        <p className="text-sm text-muted-foreground py-4 text-center">Keine Teilnehmer verfügbar</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => togglePin(activeChatId)}>
                      {activeChat.pinned ? <PinOff className="h-4 w-4 mr-2" /> : <Pin className="h-4 w-4 mr-2" />}
                      {activeChat.pinned ? "Chat lösen" : "Chat anpinnen"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleMute(activeChatId)}>
                      <BellOff className="h-4 w-4 mr-2" />
                      {activeChat.muted ? "Benachrichtigungen an" : "Stummschalten"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleArchive(activeChatId)}>
                      <Archive className="h-4 w-4 mr-2" />
                      Archivieren
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => leaveChat(activeChatId)} className="text-destructive focus:text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Chat verlassen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="h-9 w-9 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0 mt-1 cursor-pointer">
                              {msg.initials}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="text-xs">
                            <p className="font-semibold">{msg.sender}</p>
                            {activeChat.members.find(m => m.name === msg.sender)?.firma && (
                              <p className="text-muted-foreground">{activeChat.members.find(m => m.name === msg.sender)?.firma}</p>
                            )}
                            <p className="text-muted-foreground">{activeChat.members.find(m => m.name === msg.sender)?.role}</p>
                          </TooltipContent>
                        </Tooltip>
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="h-9 w-9 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0 mt-1 cursor-pointer">
                              {msg.initials}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="text-xs">
                            <p className="font-semibold">Max Müller</p>
                            <p className="text-muted-foreground">Vertriebler</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  );
                })}
                <div ref={bottomRef} />
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
