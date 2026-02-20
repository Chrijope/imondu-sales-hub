import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Inbox, Mail, Newspaper, Presentation, BarChart3, FileText,
  Kanban, MessageSquare, Contact, Building2, Briefcase, UserPlus, Receipt,
  TrendingUp, Phone, PhoneCall, Megaphone, ShoppingBag, ShoppingCart, Globe,
  ChevronDown, ChevronRight, Flame, RotateCcw, CalendarCheck, Calendar,
  CalendarDays, Trophy, Archive, Sparkles, Settings, GraduationCap, Home,
  MapPin, HardHat, ClipboardList, UsersRound, BotMessageSquare, Calculator,
  Zap, HeadphonesIcon, Shield, BookOpen, Target, User, Medal } from
"lucide-react";
import imonduLogo from "@/assets/imondu-logo.png";
import { useUserRole } from "@/contexts/UserRoleContext";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from
"@/components/ui/select";

// ── Menu-ID mapping: each sidebar path → menu permission ID ──
const PATH_TO_MENU_ID: Record<string, string> = {
  "/": "dashboard",
  "/inbox": "inbox",
  "/anrufe": "anrufe",
  "/email": "email",
  "/kalender": "kalender",
  "/news": "news",
  "/kontakte": "kontakte",
  "/kundenmaske": "kundenmaske",
  "/pipeline": "pipeline",
  "/automations": "automations",
  "/dialer": "dialer",
  "/inserate": "inserate",
  "/entwickler": "entwickler",
  "/entwickler-registrieren": "entwickler-registrieren",
  "/auswertungen": "auswertungen",
  "/statistik": "statistik",
  "/analysetool": "analysetool",
  "/abrechnungen": "abrechnungen",
  "/wettbewerb": "wettbewerb",
  "/academy": "academy",
  "/lexikon": "lexikon",
  "/zielplanung": "zielplanung",
  "/presentation": "presentation",
  "/unterlagen": "unterlagen",
  "/chat": "chat",
  "/support-ki": "support-ki",
  "/teampartner": "teampartner",
  "/nutzerverwaltung": "nutzerverwaltung",
  "/ansprechpartner": "ansprechpartner",
  "/berater-microseite": "berater-microseite",
  "/helpdesk": "helpdesk",
  "/einstellungen": "einstellungen",
  "/marketing-leads": "marketing",
  "/social-media-creator": "marketing"
};

// Collapsible group permission IDs
const GROUP_MENU_ID: Record<string, string> = {
  "B2C – Eigentümer": "b2c",
  "B2B – Partner": "b2b",
  "Immorechner": "immorechner",
  "Entwicklungsrechner": "rechner",
  "Marketing": "marketing",
  "Shop": "shop"
};

// ── Sub-items for collapsible groups ──

const b2cSubItems = [
{ path: "/b2c/neue-leads", icon: Sparkles, label: "Neue Leads" },
{ path: "/b2c/hot-leads", icon: Flame, label: "Hot Leads" },
{ path: "/b2c/follow-up", icon: RotateCcw, label: "Follow Up" },
{ path: "/b2c/heutige-termine", icon: Calendar, label: "Heutige Termine" },
{ path: "/b2c/termine-gebucht", icon: CalendarCheck, label: "Termine gebucht" },
{ path: "/b2c/gewonnen", icon: Trophy, label: "Gewonnen" },
{ path: "/b2c/bestand", icon: Archive, label: "Bestand" }];


const b2bSubItems = [
{ path: "/b2b/neue-leads", icon: Sparkles, label: "Neue Leads" },
{ path: "/b2b/hot-leads", icon: Flame, label: "Hot Leads" },
{ path: "/b2b/follow-up", icon: RotateCcw, label: "Follow Up" },
{ path: "/b2b/heutige-termine", icon: Calendar, label: "Heutige Termine" },
{ path: "/b2b/termine-gebucht", icon: CalendarCheck, label: "Termine gebucht" },
{ path: "/b2b/gewonnen", icon: Trophy, label: "Gewonnen" },
{ path: "/b2b/bestand", icon: Archive, label: "Bestand" }];


const rechnerSubItems = [
{ path: "/rechner/wohnung", icon: Calculator, label: "Rechner Wohnung" },
{ path: "/rechner/grundstueck", icon: Calculator, label: "Rechner Grundstück" },
{ path: "/rechner/mfh", icon: Calculator, label: "Rechner MFH" }];


const shopSubItems = [
{ path: "/shop/lead-kauf", icon: ShoppingCart, label: "Lead-Kauf" },
{ path: "/shop/merchandise", icon: ShoppingBag, label: "Merchandise" }];


const immorechnerSubItems = [
{ path: "/immorechner/grunddaten", icon: Calculator, label: "Grunddaten" },
{ path: "/immorechner/aufwendungen", icon: Calculator, label: "Aufwendungen" },
{ path: "/immorechner/hebel", icon: Calculator, label: "Hebel" },
{ path: "/immorechner/steuer", icon: Calculator, label: "Steuer" },
{ path: "/immorechner/ergebnis", icon: Calculator, label: "Ergebnis" }];


const marketingSubItems = [
{ path: "/marketing-leads", icon: MapPin, label: "DACH-Karte" },
{ path: "/social-media-creator", icon: Sparkles, label: "Social Media Creator" }];


// ── Sections ──

const sectionOverview = [
{ path: "/", icon: LayoutDashboard, label: "Dashboard" },
{ path: "/inbox", icon: Inbox, label: "Inbox" },
{ path: "/anrufe", icon: PhoneCall, label: "Anrufe" },
{ path: "/email", icon: Mail, label: "E-Mail" },
{ path: "/kalender", icon: CalendarDays, label: "Kalender" },
{ path: "/news", icon: Newspaper, label: "News" }];


const sectionVertrieb = [
{ path: "/kundenmaske", icon: User, label: "Kundenmaske 360°" },
{ path: "/pipeline", icon: Kanban, label: "Pipeline" },
{ path: "/automations", icon: Zap, label: "Automations & Workflows" },
{ path: "/dialer", icon: Phone, label: "Powerdialer" }];


const sectionImmobilien = [
{ path: "/inserate", icon: Home, label: "Inserate" },
{ path: "/entwickler", icon: HardHat, label: "Entwicklerübersicht" },
{ path: "/entwickler-registrieren", icon: ClipboardList, label: "Entwickler registrieren" }];


const sectionAuswertung = [
{ path: "/auswertungen", icon: Trophy, label: "Auswertungen" },
{ path: "/statistik", icon: TrendingUp, label: "Statistik" },
{ path: "/analysetool", icon: BarChart3, label: "Analysetool" },
{ path: "/abrechnungen", icon: Receipt, label: "Abrechnungen" },
{ path: "/wettbewerb", icon: Medal, label: "Wettbewerb" }];


const sectionTools = [
{ path: "/zielplanung", icon: Target, label: "Zielplanung" },
{ path: "/academy", icon: GraduationCap, label: "Academy" },
{ path: "/lexikon", icon: BookOpen, label: "Immobilien-Lexikon" },
{ path: "/presentation", icon: Presentation, label: "Präsentation" },
{ path: "/unterlagen", icon: FileText, label: "Unterlagen" },
{ path: "/chat", icon: MessageSquare, label: "Chat" },
{ path: "/support-ki", icon: BotMessageSquare, label: "Support KI" }];


const sectionTeam = [
{ path: "/teampartner", icon: UserPlus, label: "Teampartner" },
{ path: "/nutzerverwaltung", icon: UsersRound, label: "Nutzerverwaltung" },
{ path: "/ansprechpartner", icon: Phone, label: "Ansprechpartner" },
{ path: "/berater-microseite", icon: Globe, label: "Berater-Microseite" },
{ path: "/helpdesk", icon: HeadphonesIcon, label: "Helpdesk" }];


// ── Components ──

function SectionLabel({ children }: {children: React.ReactNode;}) {
  return (
    <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-primary">
      {children}
    </p>);

}

function NavItem({ path, icon: Icon, label, isActive }: {path: string;icon: React.ComponentType<{className?: string;}>;label: string;isActive: boolean;}) {
  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
      isActive ?
      "gradient-brand text-primary-foreground shadow-crm-sm" :
      "text-foreground/70 hover:bg-background hover:text-foreground"}`
      }>

      <Icon className="h-[16px] w-[16px] shrink-0" />
      {label}
    </Link>);

}

function CollapsibleGroup({ label, icon: Icon, items, color




}: {label: string;icon: React.ComponentType<{className?: string;}>;items: typeof b2cSubItems;color: string;}) {
  const location = useLocation();
  const hasActiveChild = items.some((i) => location.pathname.startsWith(i.path));
  const [open, setOpen] = useState(hasActiveChild);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150 w-full ${
        hasActiveChild ?
        "bg-background text-foreground shadow-crm-sm" :
        "text-foreground/70 hover:bg-background hover:text-foreground"}`
        }>

        <Icon className={`h-[16px] w-[16px] shrink-0 ${color}`} />
        {label}
        {open ?
        <ChevronDown className="h-3.5 w-3.5 ml-auto text-muted-foreground" /> :

        <ChevronRight className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
        }
      </button>
      {open &&
      <div className="ml-3 pl-3 border-l-2 border-border/60 mt-0.5 space-y-0.5">
          {items.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-all duration-150 ${
              isActive ?
              "gradient-brand text-primary-foreground shadow-crm-sm" :
              "text-foreground/60 hover:bg-background hover:text-foreground"}`
              }>

                <item.icon className="h-[14px] w-[14px] shrink-0" />
                {item.label}
              </Link>);

        })}
        </div>
      }
    </div>);

}

// ── Main Sidebar ──

export default function CRMSidebar() {
  const location = useLocation();
  const { currentRoleId, setCurrentRoleId, allowedMenuItems, roles } = useUserRole();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const canSee = (path: string) => {
    const menuId = PATH_TO_MENU_ID[path];
    if (!menuId) return true; // unmapped = always visible
    return allowedMenuItems.includes(menuId);
  };

  const canSeeGroup = (groupLabel: string) => {
    const menuId = GROUP_MENU_ID[groupLabel];
    if (!menuId) return true;
    return allowedMenuItems.includes(menuId);
  };

  const filterItems = (items: {path: string;icon: React.ComponentType<{className?: string;}>;label: string;}[]) =>
  items.filter((item) => canSee(item.path));

  const currentRole = roles.find((r) => r.id === currentRoleId);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[hsl(220,14%,92%)] flex flex-col z-50 border-r border-border">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-center bg-primary-foreground">
        <img src={imonduLogo} alt="Imondu" className="h-10 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-1 px-3 overflow-y-auto space-y-0.5 text-primary-foreground bg-muted">
        {/* ÜBERSICHT */}
        <div className="space-y-0.5">
          {filterItems(sectionOverview).map((item) =>
          <NavItem key={item.path} {...item} isActive={isActive(item.path)} />
          )}
        </div>

        {/* VERTRIEB */}
        {(() => {
          const vertriebItems = filterItems(sectionVertrieb);
          const showKontakte = canSee("/kontakte");
          const showB2C = canSeeGroup("B2C – Eigentümer");
          const showB2B = canSeeGroup("B2B – Partner");
          if (!showKontakte && !showB2C && !showB2B && vertriebItems.length === 0) return null;
          return (
            <div>
              <SectionLabel>Vertrieb</SectionLabel>
              <div className="space-y-0.5">
                {showKontakte && <NavItem path="/kontakte" icon={Contact} label="Kontakte" isActive={isActive("/kontakte")} />}
                {showB2C && <CollapsibleGroup label="B2C – Eigentümer" icon={Building2} items={b2cSubItems} color="text-b2c" />}
                {showB2B && <CollapsibleGroup label="B2B – Partner" icon={Briefcase} items={b2bSubItems} color="text-b2b" />}
                {vertriebItems.map((item) =>
                <NavItem key={item.path} {...item} isActive={isActive(item.path)} />
                )}
              </div>
            </div>);

        })()}

        {/* IMMOBILIEN */}
        {(() => {
          const items = filterItems(sectionImmobilien);
          if (items.length === 0) return null;
          return (
            <div>
              <SectionLabel>Immobilien</SectionLabel>
              <div className="space-y-0.5">
                {items.map((item) =>
                <NavItem key={item.path} {...item} isActive={isActive(item.path)} />
                )}
              </div>
            </div>);

        })()}

        {/* AUSWERTUNG */}
        {(() => {
          const items = filterItems(sectionAuswertung);
          if (items.length === 0) return null;
          return (
            <div>
              <SectionLabel>Auswertung</SectionLabel>
              <div className="space-y-0.5">
                {items.map((item) =>
                <NavItem key={item.path} {...item} isActive={isActive(item.path)} />
                )}
              </div>
            </div>);

        })()}

        {/* TOOLS & WISSEN */}
        {(() => {
          const toolItems = filterItems(sectionTools);
          const showImmo = canSeeGroup("Immorechner");
          const showRechner = canSeeGroup("Entwicklungsrechner");
          const showMarketing = canSeeGroup("Marketing");
          if (toolItems.length === 0 && !showImmo && !showRechner && !showMarketing) return null;
          return (
            <div>
              <SectionLabel>Tools & Wissen</SectionLabel>
              <div className="space-y-0.5">
                {showImmo && <CollapsibleGroup label="Immorechner" icon={Calculator} items={immorechnerSubItems} color="text-[hsl(35,95%,55%)]" />}
                {showRechner && <CollapsibleGroup label="Entwicklungsrechner" icon={Calculator} items={rechnerSubItems} color="text-foreground" />}
                {showMarketing && <CollapsibleGroup label="Marketing" icon={Megaphone} items={marketingSubItems} color="text-foreground" />}
                {toolItems.map((item) =>
                <NavItem key={item.path} {...item} isActive={isActive(item.path)} />
                )}
              </div>
            </div>);

        })()}

        {/* TEAM & ADMIN */}
        {(() => {
          const items = filterItems(sectionTeam);
          if (items.length === 0) return null;
          return (
            <div>
              <SectionLabel>Team & Admin</SectionLabel>
              <div className="space-y-0.5">
                {items.map((item) =>
                <NavItem key={item.path} {...item} isActive={isActive(item.path)} />
                )}
              </div>
            </div>);

        })()}

        {/* SHOP */}
        {canSeeGroup("Shop") &&
        <div>
            <SectionLabel>Shop</SectionLabel>
            <div className="space-y-0.5">
              <CollapsibleGroup label="Shop" icon={ShoppingBag} items={shopSubItems} color="text-foreground" />
            </div>
          </div>
        }
      </nav>

      {/* User + Role Switcher */}
      <div className="px-4 py-3 border-t border-border space-y-2 bg-primary-foreground">
        {/* Role switcher (demo) */}
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <Select value={currentRoleId} onValueChange={setCurrentRoleId}>
            <SelectTrigger className="h-7 text-[11px] border-border/60 bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) =>
              <SelectItem key={r.id} value={r.id} className="text-xs">
                  <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: r.color }} />
                  {r.name}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <Link to="/einstellungen" className="flex items-center gap-3 group">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
            style={{ background: currentRole?.color || "hsl(var(--primary))" }}>

            MM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Max Müller</p>
            <p className="text-xs text-muted-foreground">{currentRole?.name || "Admin"}</p>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      </div>
    </aside>);

}