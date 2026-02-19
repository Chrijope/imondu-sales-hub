import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  Newspaper,
  Presentation,
  BarChart3,
  FileText,
  Kanban,
  MessageSquare,
  Contact,
  Users,
  Building2,
  Briefcase,
  UserPlus,
  Receipt,
  TrendingUp,
  Phone,
  Megaphone,
  ShoppingBag,
  ShoppingCart,
  Globe,
  ChevronDown,
  ChevronRight,
  Flame,
  RotateCcw,
  CalendarCheck,
  Calendar,
  Trophy,
  Archive,
  Sparkles,
  Settings,
  GraduationCap,
  Home,
  HardHat,
  ClipboardList,
} from "lucide-react";
import imonduLogo from "@/assets/imondu-logo.png";

const b2cSubItems = [
  { path: "/b2c/neue-leads", icon: Sparkles, label: "Neue Leads" },
  { path: "/b2c/hot-leads", icon: Flame, label: "Hot Leads" },
  { path: "/b2c/follow-up", icon: RotateCcw, label: "Follow Up" },
  { path: "/b2c/heutige-termine", icon: Calendar, label: "Heutige Termine" },
  { path: "/b2c/termine-gebucht", icon: CalendarCheck, label: "Termine gebucht" },
  { path: "/b2c/gewonnen", icon: Trophy, label: "Gewonnen" },
  { path: "/b2c/bestand", icon: Archive, label: "Bestand" },
];

const b2bSubItems = [
  { path: "/b2b/neue-leads", icon: Sparkles, label: "Neue Leads" },
  { path: "/b2b/hot-leads", icon: Flame, label: "Hot Leads" },
  { path: "/b2b/follow-up", icon: RotateCcw, label: "Follow Up" },
  { path: "/b2b/heutige-termine", icon: Calendar, label: "Heutige Termine" },
  { path: "/b2b/termine-gebucht", icon: CalendarCheck, label: "Termine gebucht" },
  { path: "/b2b/gewonnen", icon: Trophy, label: "Gewonnen" },
  { path: "/b2b/bestand", icon: Archive, label: "Bestand" },
];

const topNavItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/inbox", icon: Inbox, label: "Inbox" },
  { path: "/news", icon: Newspaper, label: "News" },
  { path: "/presentation", icon: Presentation, label: "Präsentation" },
  { path: "/analysetool", icon: BarChart3, label: "Analysetool" },
  { path: "/unterlagen", icon: FileText, label: "Unterlagen" },
  { path: "/pipeline", icon: Kanban, label: "Pipeline" },
  { path: "/chat", icon: MessageSquare, label: "Chat" },
  { path: "/kontakte", icon: Contact, label: "Kontakte" },
  { path: "/inserate", icon: Home, label: "Inserate" },
];

const shopSubItems = [
  { path: "/shop/lead-kauf", icon: ShoppingCart, label: "Lead-Kauf" },
  { path: "/shop/merchandise", icon: ShoppingBag, label: "Merchandise" },
];

const bottomNavItems = [
  { path: "/teampartner", icon: UserPlus, label: "Teampartner" },
  { path: "/auswertungen", icon: Trophy, label: "Auswertungen" },
  { path: "/abrechnungen", icon: Receipt, label: "Abrechnungen" },
  { path: "/statistik", icon: TrendingUp, label: "Statistik" },
  { path: "/ansprechpartner", icon: Phone, label: "Ansprechpartner" },
  { path: "/marketing-leads", icon: Megaphone, label: "Marketing" },
  { path: "/berater-microseite", icon: Globe, label: "Berater-Microseite" },
  { path: "/academy", icon: GraduationCap, label: "Academy" },
  { path: "/entwickler-registrieren", icon: ClipboardList, label: "Entwickler registrieren" },
  { path: "/entwickler", icon: HardHat, label: "Entwicklerübersicht" },
];

function NavItem({ path, icon: Icon, label, isActive }: { path: string; icon: React.ComponentType<{ className?: string }>; label: string; isActive: boolean }) {
  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
        isActive
          ? "gradient-brand text-primary-foreground shadow-crm-sm"
          : "text-foreground/70 hover:bg-background hover:text-foreground"
      }`}
    >
      <Icon className="h-[16px] w-[16px] shrink-0" />
      {label}
    </Link>
  );
}

function CollapsibleGroup({ label, icon: Icon, items, color }: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: typeof b2cSubItems;
  color: string;
}) {
  const location = useLocation();
  const hasActiveChild = items.some(i => location.pathname.startsWith(i.path));
  const [open, setOpen] = useState(hasActiveChild);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150 w-full ${
          hasActiveChild
            ? "bg-background text-foreground shadow-crm-sm"
            : "text-foreground/70 hover:bg-background hover:text-foreground"
        }`}
      >
        <Icon className={`h-[16px] w-[16px] shrink-0 ${color}`} />
        {label}
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="ml-3 pl-3 border-l-2 border-border/60 mt-0.5 space-y-0.5">
          {items.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-all duration-150 ${
                  isActive
                    ? "gradient-brand text-primary-foreground shadow-crm-sm"
                    : "text-foreground/60 hover:bg-background hover:text-foreground"
                }`}
              >
                <item.icon className="h-[14px] w-[14px] shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CRMSidebar() {
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[hsl(220,14%,92%)] flex flex-col z-50 border-r border-border">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-center">
        <img src={imonduLogo} alt="Imondu" className="h-10 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-3 space-y-0.5 overflow-y-auto">
        {topNavItems.map((item) => (
          <NavItem key={item.path} {...item} isActive={isActive(item.path)} />
        ))}

        {/* Leads Überschrift + B2C/B2B Groups */}
        <div className="pt-3">
          <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Leads</p>
          <div className="space-y-0.5">
            <CollapsibleGroup label="B2C – Eigentümer" icon={Building2} items={b2cSubItems} color="text-b2c" />
            <CollapsibleGroup label="B2B – Partner" icon={Briefcase} items={b2bSubItems} color="text-b2b" />
          </div>
        </div>

        <div className="pt-2 space-y-0.5">
          {bottomNavItems.map((item) => (
            <NavItem key={item.path} {...item} isActive={isActive(item.path)} />
          ))}
        </div>

        {/* Shop Group */}
        <div className="pt-1">
          <CollapsibleGroup label="Shop" icon={ShoppingBag} items={shopSubItems} color="text-foreground" />
        </div>
      </nav>

      {/* User */}
      <div className="px-4 py-3 border-t border-border">
        <Link to="/einstellungen" className="flex items-center gap-3 group">
          <div className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
            MM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Max Müller</p>
            <p className="text-xs text-muted-foreground">Vertriebler</p>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      </div>
    </aside>
  );
}
