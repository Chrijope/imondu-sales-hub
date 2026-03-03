import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUserRole } from "@/contexts/UserRoleContext";
import { setChatUnreadCount } from "@/utils/support-notifications";
import { getChatNotifications, type ChatNotification } from "@/utils/chat-notifications";
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
  MicOff,
  Trash2,
  MoreVertical,
  Filter,
  ExternalLink,
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
  // Lead-Kontext: Wenn Chat über ein Kundenprofil gestartet wurde
  linkedLeadId?: string;
  linkedLeadName?: string;
  linkedLeadType?: "b2c" | "b2b";
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
      { name: "Christian Peetz", initials: "CP", role: "Admin" },
      { name: "Manuel Schilling", initials: "MS", role: "Vertriebsleiter" },
      { name: "Lisa Weber", initials: "LW", role: "Vertriebspartner" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "15.01.2026", isOwn: false, isSystem: true },
      { id: "m1", sender: "Manuel Schilling", initials: "MS", text: "Guten Morgen Team! Wir haben 12 neue Leads aus der Kampagne.", time: "09:30", isOwn: false },
      { id: "m2", sender: "Lisa Weber", initials: "LW", text: "Super, ich schaue mir die B2B Leads an.", time: "09:38", isOwn: false },
      { id: "m3", sender: "Manuel Schilling", initials: "MS", text: "Neue Leads sind da, bitte prüfen", time: "09:45", isOwn: false },
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
      { name: "Oliver Gjorgijev", initials: "OG", role: "Marketing" },
      { name: "Christian Peetz", initials: "CP", role: "Admin" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "28.01.2026", isOwn: false, isSystem: true },
      { id: "m1", sender: "Oliver Gjorgijev", initials: "OG", text: "Gibt es Neuigkeiten zu dem Projekt in München?", time: "14:10", isOwn: false },
      { id: "m2", sender: "Christian Peetz", initials: "CP", text: "Ja, der Kunde hat sich zurückgemeldet. Termin steht für nächste Woche.", time: "14:15", isOwn: true },
      { id: "m3", sender: "Oliver Gjorgijev", initials: "OG", text: "Perfekt, danke euch allen", time: "14:22", isOwn: false },
    ],
  },
  // ── Beispiel: VP-Backoffice Chat mit Lead-Kontext ──
  {
    id: "bo-lead-1",
    name: "Backoffice – Anna Schmidt",
    initials: "BO",
    lastMessage: "Bitte die Unterlagen für Frau Schmidt prüfen.",
    time: "10:15",
    unread: 1,
    pinned: false,
    archived: false,
    muted: false,
    category: "intern",
    linkedLeadId: "1",
    linkedLeadName: "Anna Schmidt",
    linkedLeadType: "b2c",
    members: [
      { name: "Lisa Weber", initials: "LW", role: "Vertriebspartner" },
      { name: "Julia Fischer", initials: "JF", role: "Backoffice" },
      { name: "Manuel Schilling", initials: "MS", role: "Vertriebsleiter" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "03.03.2026", isOwn: false, isSystem: true },
      { id: "s2", sender: "", initials: "", text: "Manuel Schilling (Vertriebsleiter) wurde automatisch eingeladen", time: "", isOwn: false, isSystem: true },
      { id: "m1", sender: "Lisa Weber", initials: "LW", text: "Hallo, ich habe eine Frage zu Frau Schmidt (Einfamilienhaus, Berlin). Wann ist der nächste Besichtigungstermin möglich?", time: "10:10", isOwn: false },
      { id: "m2", sender: "Julia Fischer", initials: "JF", text: "Bitte die Unterlagen für Frau Schmidt prüfen.", time: "10:15", isOwn: false },
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
      { name: "Christian Peetz", initials: "CP", role: "Admin" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "10.02.2026", isOwn: false, isSystem: true },
      { id: "m1", sender: "Christian Peetz", initials: "CP", text: "Hallo Herr Weber, ich habe ein passendes Projekt in Ihrer Region gefunden.", time: "14:30", isOwn: true },
      { id: "m2", sender: "Thomas Weber", initials: "TW", text: "Das klingt interessant! Können Sie mir mehr Details schicken?", time: "14:45", isOwn: false },
      { id: "m3", sender: "Christian Peetz", initials: "CP", text: "Natürlich, ich schicke Ihnen die Unterlagen per E-Mail.", time: "14:50", isOwn: true },
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
      { name: "Christian Peetz", initials: "CP", role: "Admin" },
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
      { name: "Christian Peetz", initials: "CP", role: "Admin" },
      { name: "Manuel Schilling", initials: "MS", role: "Vertriebsleiter" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "01.02.2026", isOwn: false, isSystem: true },
      { id: "m1", sender: "Hans Krüger", initials: "HK", text: "Wir sind an einer Partnerschaft interessiert, aber der Jahresbeitrag ist für uns aktuell etwas hoch.", time: "16:00", isOwn: false },
      { id: "m2", sender: "Christian Peetz", initials: "CP", text: "Verstehe ich. Lassen Sie uns gerne die verschiedenen Optionen besprechen.", time: "16:15", isOwn: true },
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
      { name: "Christian Peetz", initials: "CP", role: "Admin" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "17.02.2026", isOwn: false, isSystem: true },
      { id: "m1", sender: "Christian Peetz", initials: "CP", text: "Hallo Frau Schmidt, vielen Dank für Ihr Interesse an einer Immobilienbewertung. Ich würde Ihnen gerne einen Vor-Ort-Termin anbieten.", time: "16:20", isOwn: true },
      { id: "m2", sender: "Anna Schmidt", initials: "AS", text: "Das wäre super! Wann hätten Sie Zeit?", time: "16:30", isOwn: false },
      { id: "m3", sender: "Christian Peetz", initials: "CP", text: "Wie wäre es am Donnerstag um 14 Uhr?", time: "16:35", isOwn: true },
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
      { name: "Christian Peetz", initials: "CP", role: "Admin" },
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
      { name: "Christian Peetz", initials: "CP", role: "Admin" },
    ],
    messages: [
      { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: "18.02.2026", isOwn: false, isSystem: true },
      { id: "m1", sender: "Christian Peetz", initials: "CP", text: "Hallo Frau Schulz, Sie wurden mir als neuer Lead zugewiesen. Ich helfe Ihnen gerne bei der Bewertung Ihrer Immobilie.", time: "09:45", isOwn: true },
      { id: "m2", sender: "Petra Schulz", initials: "PS", text: "Super, das freut mich! Ich möchte mein Einfamilienhaus verkaufen.", time: "09:55", isOwn: false },
      { id: "m3", sender: "Petra Schulz", initials: "PS", text: "Welche Unterlagen brauchen Sie von mir?", time: "10:00", isOwn: false },
    ],
  },
];

const teamMembers = [
  { name: "Christian Peetz", initials: "CP", role: "Admin" },
  { name: "Manuel Schilling", initials: "MS", role: "Vertriebsleiter" },
  { name: "Lisa Weber", initials: "LW", role: "Vertriebspartner" },
  { name: "Oliver Gjorgijev", initials: "OG", role: "Marketing" },
  { name: "Julia Fischer", initials: "JF", role: "Backoffice" },
  { name: "Karin Martini", initials: "KM", role: "Buchhaltung" },
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
  const navigate = useNavigate();
  const { currentRoleId } = useUserRole();
  const isEigentuemer = currentRoleId === "eigentuemer";
  const isEntwickler = currentRoleId === "entwickler";
  const isBewerber = currentRoleId === "bewerber";
  const isVertriebspartner = currentRoleId === "vertriebspartner";
  const isAdmin = ["inhaber", "admin", "vertriebsleiter", "backoffice"].includes(currentRoleId);
  const isRoleRestricted = isEigentuemer || isEntwickler || isBewerber || isVertriebspartner;

  // Bewerber-specific chat with Admin
  const bewerberChats: ChatThread[] = [
    {
      id: "bew-admin-1",
      name: "IMONDU Recruiting",
      initials: "IR",
      lastMessage: "Willkommen! Wir freuen uns auf Deine Bewerbung.",
      time: "10:00",
      unread: 1,
      pinned: true,
      archived: false,
      muted: false,
      category: "intern",
      members: [
        { name: "IMONDU Recruiting", initials: "IR", role: "Admin" },
        { name: "Bewerber", initials: "BW", role: "Bewerber" },
      ],
      messages: [
        { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: new Date().toLocaleDateString("de-DE"), isOwn: false, isSystem: true },
        { id: "m1", sender: "IMONDU Recruiting", initials: "IR", text: "Willkommen bei IMONDU! 🎉 Hier kannst Du uns jederzeit Fragen zu Deiner Bewerbung stellen.", time: "10:00", isOwn: false },
        { id: "m2", sender: "IMONDU Recruiting", initials: "IR", text: "Fülle am besten zuerst den Bewerbungsprozess unter 'Meine Bewerbung' aus. Bei Fragen sind wir hier für Dich da!", time: "10:01", isOwn: false },
      ],
    },
  ];

  // Role-based chat filtering
  const roleFilteredInitialChats = isBewerber
    ? bewerberChats
    : isEigentuemer
    ? initialChats.filter(c => c.category === "entwickler")
    : isEntwickler
    ? initialChats.filter(c => c.category === "eigentuemer")
    : isVertriebspartner
    // VP: nur interne Chats (inkl. Backoffice-Chats mit Lead-Kontext), KEINE Entwickler/Eigentümer-Chats
    ? initialChats.filter(c => c.category === "intern")
    : initialChats;

  const [chats, setChats] = useState<ChatThread[]>(roleFilteredInitialChats);
  const [activeChatId, setActiveChatId] = useState<string>(roleFilteredInitialChats[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteType, setInviteType] = useState<"admin" | "teampartner" | "entwickler" | "eigentuemer">("teampartner");
  const [activeCategory, setActiveCategory] = useState<"alle" | "intern" | "entwickler" | "eigentuemer">("alle");
  const [showArchived, setShowArchived] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sync unread count to sidebar badge
  useEffect(() => {
    const totalUnread = chats.filter(c => !c.archived && c.unread > 0).reduce((sum, c) => sum + c.unread, 0);
    setChatUnreadCount(totalUnread);
  }, [chats]);

  // Poll for chat notifications from other pages
  useEffect(() => {
    const poll = () => {
      const notifications = getChatNotifications();
      if (notifications.length === 0) return;

      import("@/utils/chat-notifications").then(({ consumeChatNotifications }) => {
        const consumed = consumeChatNotifications(
          isBewerber ? "bew-admin-1" : undefined,
          currentRoleId
        );
        if (consumed.length === 0) return;

        setChats((prev) => {
          const updated = [...prev];
          consumed.forEach((notif) => {
            let chatIdx = updated.findIndex((c) => c.id === notif.targetChatId);
            if (chatIdx === -1) chatIdx = 0;
            if (chatIdx >= 0) {
              const newMsg: ChatMessage = {
                id: `notif-${notif.id}`,
                sender: notif.sender,
                initials: notif.senderInitials,
                text: notif.text,
                time: notif.timestamp,
                isOwn: false,
                isSystem: false,
              };
              updated[chatIdx] = {
                ...updated[chatIdx],
                messages: [...updated[chatIdx].messages, newMsg],
                lastMessage: notif.text.split("\n")[0],
                time: notif.timestamp,
                unread: updated[chatIdx].unread + 1,
              };
            }
          });
          return updated;
        });
      });
    };

    poll();
    const interval = setInterval(poll, 3000);
    window.addEventListener("storage", poll);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", poll);
    };
  }, [isBewerber, currentRoleId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatId, chats]);

  // Handle deep-link from LeadDetail / B2C / B2B pages
  useEffect(() => {
    const newChatName = searchParams.get("newChat");
    const category = searchParams.get("category") as "intern" | "entwickler" | "eigentuemer" | null;
    const leadId = searchParams.get("leadId");
    const leadName = searchParams.get("leadName");
    const leadType = searchParams.get("leadType") as "b2c" | "b2b" | null;
    if (!newChatName) return;

    // Check if a chat with same lead context already exists
    const existingByLead = leadId ? chats.find(c => c.linkedLeadId === leadId) : null;
    const existing = existingByLead || chats.find((c) => c.name === newChatName);

    if (existing) {
      setActiveChatId(existing.id);
      setActiveCategory(existing.category);
    } else {
      const initials = newChatName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
      const isBackofficeChat = leadId && leadName;

      let chatName = newChatName;
      let chatMembers: ChatThread["members"] = [];
      let chatMessages: ChatMessage[] = [
        { id: "s1", sender: "", initials: "", text: "Chat wurde erstellt", time: new Date().toLocaleDateString("de-DE"), isOwn: false, isSystem: true },
      ];

      if (isBackofficeChat) {
        // VP → Backoffice Chat mit Lead-Kontext
        chatName = `Backoffice – ${leadName}`;
        const typeLabel = leadType === "b2c" ? "Eigentümer" : "Partner";
        chatMembers = [
          { name: "Lisa Weber", initials: "LW", role: "Vertriebspartner" },
          { name: "Julia Fischer", initials: "JF", role: "Backoffice" },
          { name: "Manuel Schilling", initials: "MS", role: "Vertriebsleiter" },
        ];
        chatMessages.push(
          { id: "s2", sender: "", initials: "", text: "Manuel Schilling (Vertriebsleiter) wurde automatisch eingeladen", time: "", isOwn: false, isSystem: true },
          { id: "s3", sender: "", initials: "", text: `Betreff: ${leadName} (${typeLabel})`, time: "", isOwn: false, isSystem: true },
        );
      } else {
        const role = category === "entwickler" ? "Entwickler" : category === "eigentuemer" ? "Eigentümer" : "Teampartner";
        chatMembers = [
          { name: newChatName, initials, role },
          { name: isEigentuemer ? "Anna Schmidt" : isEntwickler ? "Thomas Huber" : "Christian Peetz", initials: isEigentuemer ? "AS" : isEntwickler ? "TH" : "CP", role: isEigentuemer ? "Eigentümer" : isEntwickler ? "Entwickler" : "Admin" },
        ];
      }

      const newChat: ChatThread = {
        id: `new-${Date.now()}`,
        name: chatName,
        initials: isBackofficeChat ? "BO" : initials,
        lastMessage: "Chat gestartet",
        time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
        unread: 0,
        pinned: false,
        archived: false,
        muted: false,
        category: category || "intern",
        members: chatMembers,
        messages: chatMessages,
        linkedLeadId: leadId || undefined,
        linkedLeadName: leadName || undefined,
        linkedLeadType: leadType || undefined,
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
    const senderName = currentRoleId === "bewerber" ? "Bewerber"
      : currentRoleId === "eigentuemer" ? "Anna Schmidt"
      : currentRoleId === "entwickler" ? "Thomas Huber"
      : currentRoleId === "vertriebspartner" ? "Lisa Weber"
      : "Christian Peetz";
    const senderInitials = currentRoleId === "bewerber" ? "BW"
      : currentRoleId === "eigentuemer" ? "AS"
      : currentRoleId === "entwickler" ? "TH"
      : currentRoleId === "vertriebspartner" ? "LW"
      : "CP";
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: senderName,
      initials: senderInitials,
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

  // VP: hide category filter for entwickler/eigentuemer
  const visibleCategories = isVertriebspartner
    ? CHAT_CATEGORIES.filter(c => c.id === "alle" || c.id === "intern")
    : CHAT_CATEGORIES;

  return (
    <CRMLayout>
      <div className="flex h-[calc(100vh-2rem)] m-4 glass-card-static rounded-xl overflow-hidden dashboard-mesh-bg">
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
            {/* Category Filter - hidden for role-restricted users (except VP who sees intern only) */}
            {!isRoleRestricted && (
            <div className="flex items-center gap-2">
              <Select value={activeCategory} onValueChange={(v) => setActiveCategory(v as typeof activeCategory)}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <div className="flex items-center gap-1.5">
                    <Filter className="h-3 w-3" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {visibleCategories.map(cat => (
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
            )}
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
                {/* Avatar with pin/unread indicator */}
                <div className="relative shrink-0">
                  <div className="h-10 w-10 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {chat.initials}
                  </div>
                  {chat.unread > 0 && !chat.muted ? (
                    <div className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[hsl(var(--primary))] border-2 border-background" />
                  ) : chat.muted ? (
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
                      <MicOff className="h-2.5 w-2.5 text-muted-foreground" />
                    </div>
                  ) : chat.pinned ? (
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
                      <Pin className="h-2.5 w-2.5 text-primary" />
                    </div>
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm truncate ${chat.unread > 0 ? "font-bold text-foreground" : "font-semibold text-foreground"}`}>
                      {chat.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{chat.time}</span>
                  </div>
                  {/* Show linked lead badge in sidebar */}
                  {chat.linkedLeadName && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Badge variant="outline" className={`text-[9px] py-0 px-1.5 ${chat.linkedLeadType === "b2c" ? "border-b2c/30 text-b2c" : "border-b2b/30 text-b2b"}`}>
                        {chat.linkedLeadType === "b2c" ? "Eigentümer" : "Partner"}: {chat.linkedLeadName}
                      </Badge>
                    </div>
                  )}
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
                    {chat.linkedLeadId && (
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/lead/${chat.linkedLeadId}`); }}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Kundenprofil öffnen
                      </DropdownMenuItem>
                    )}
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
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-display font-bold text-foreground truncate">{activeChat.name}</h2>
                  {/* Lead-Kontext Badge – klickbar zum Kundenprofil */}
                  {activeChat.linkedLeadId && activeChat.linkedLeadName && (
                    <button
                      onClick={() => navigate(`/lead/${activeChat.linkedLeadId}`)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors hover:opacity-80 ${
                        activeChat.linkedLeadType === "b2c"
                          ? "bg-b2c/10 text-b2c border border-b2c/20"
                          : "bg-b2b/10 text-b2b border border-b2b/20"
                      }`}
                    >
                      <ExternalLink className="h-3 w-3" />
                      {activeChat.linkedLeadType === "b2c" ? "Eigentümer" : "Partner"}: {activeChat.linkedLeadName}
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {activeChat.members.length} Teilnehmer · {activeChat.category === "intern" ? "Interner Chat" : activeChat.category === "entwickler" ? "Entwickler-Chat" : "Eigentümer-Chat"}
                </p>
              </div>

              {/* Member Avatars with Tooltip */}
              <div className="flex items-center -space-x-2">
                {activeChat.members.slice(0, 5).map((m) => (
                  <Tooltip key={m.name}>
                    <TooltipTrigger asChild>
                      <div
                        className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-[10px] font-bold text-primary-foreground border-2 border-card cursor-pointer hover:z-10 hover:scale-110 transition-transform"
                        onClick={() => {
                          // Wenn Lead verknüpft, öffne Profil bei Klick auf Avatar
                          if (activeChat.linkedLeadId) {
                            navigate(`/lead/${activeChat.linkedLeadId}`);
                          }
                        }}
                      >
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

              <div className="flex items-center gap-1">
                {/* Invite button: only for admin roles, not for VP or restricted */}
                {isAdmin && (
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
                )}

                {/* Three-dot menu for chat actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onClick={() => togglePin(activeChat.id)}>
                      {activeChat.pinned ? <PinOff className="h-4 w-4 mr-2" /> : <Pin className="h-4 w-4 mr-2" />}
                      {activeChat.pinned ? "Chat lösen" : "Chat anpinnen"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleUnread(activeChat.id)}>
                      {activeChat.unread > 0 ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                      {activeChat.unread > 0 ? "Als gelesen markieren" : "Als ungelesen markieren"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleMute(activeChat.id)}>
                      <BellOff className="h-4 w-4 mr-2" />
                      {activeChat.muted ? "Benachrichtigungen an" : "Stummschalten"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleArchive(activeChat.id)}>
                      <Archive className="h-4 w-4 mr-2" />
                      {activeChat.archived ? "Aus Archiv holen" : "Archivieren"}
                    </DropdownMenuItem>
                    {activeChat.linkedLeadId && (
                      <DropdownMenuItem onClick={() => navigate(`/lead/${activeChat.linkedLeadId}`)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Kundenprofil öffnen
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => leaveChat(activeChat.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Chat löschen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4 max-w-3xl">
                {activeChat.messages.map((msg) =>
                  msg.isSystem ? (
                    <div key={msg.id} className="flex justify-center">
                      <p className="text-[11px] text-muted-foreground bg-muted/40 px-3 py-1 rounded-full">
                        {msg.text}
                        {msg.time && <span className="ml-2 text-[10px]">{msg.time}</span>}
                      </p>
                    </div>
                  ) : (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.isOwn ? "bg-primary text-primary-foreground" : "gradient-brand text-primary-foreground"}`}>
                        {msg.initials}
                      </div>
                      <div className={`max-w-[70%] ${msg.isOwn ? "items-end" : "items-start"}`}>
                        <div className="flex items-center gap-2 mb-0.5">
                          {!msg.isOwn && <span className="text-xs font-semibold text-foreground">{msg.sender}</span>}
                          <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                          {msg.isOwn && (
                            <CheckCheck className="h-3 w-3 text-primary" />
                          )}
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            msg.isOwn
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-card border border-border text-foreground rounded-tl-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  )
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="px-6 py-3 border-t border-border">
              <div className="flex items-center gap-2 max-w-3xl">
                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground h-9 w-9">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Nachricht schreiben…"
                  className="flex-1 h-9 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  size="icon"
                  className="shrink-0 h-9 w-9 gradient-brand border-0 text-primary-foreground"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Wähle einen Chat aus</p>
            </div>
          </div>
        )}
      </div>
    </CRMLayout>
  );
}
