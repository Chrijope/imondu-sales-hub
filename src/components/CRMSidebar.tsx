import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
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
  Globe,
} from "lucide-react";
import imonduLogo from "@/assets/imondu-logo.png";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/news", icon: Newspaper, label: "News" },
  { path: "/presentation", icon: Presentation, label: "Präsentation" },
  { path: "/analysetool", icon: BarChart3, label: "Analysetool" },
  { path: "/unterlagen", icon: FileText, label: "Unterlagen" },
  { path: "/pipeline", icon: Kanban, label: "Pipeline" },
  { path: "/chat", icon: MessageSquare, label: "Chat" },
  { path: "/kontakte", icon: Contact, label: "Kontakte" },
  { path: "/leads", icon: Users, label: "Leads (B2C/B2B)" },
  { path: "/b2c-bestand", icon: Building2, label: "B2C Bestand" },
  { path: "/b2b-bestand", icon: Briefcase, label: "B2B Bestand" },
  { path: "/teampartner", icon: UserPlus, label: "Teampartner" },
  { path: "/abrechnungen", icon: Receipt, label: "Abrechnungen" },
  { path: "/statistik", icon: TrendingUp, label: "Statistik" },
  { path: "/ansprechpartner", icon: Phone, label: "Ansprechpartner" },
  { path: "/marketing-leads", icon: Megaphone, label: "Marketing Leads" },
  { path: "/berater-microseite", icon: Globe, label: "Berater-Microseite" },
  { path: "/shop", icon: ShoppingBag, label: "Shop" },
];

export default function CRMSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[hsl(220,14%,92%)] flex flex-col z-50 border-r border-border">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-center">
        <img src={imonduLogo} alt="Imondu" className="h-10 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? "gradient-brand text-primary-foreground shadow-crm-sm"
                  : "text-foreground/70 hover:bg-background hover:text-foreground"
              }`}
            >
              <item.icon className="h-[16px] w-[16px] shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
            MM
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Max Müller</p>
            <p className="text-xs text-muted-foreground">Vertriebler</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
