import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Kanban,
  Phone,
  Users,
  Settings,
} from "lucide-react";
import imonduLogo from "@/assets/imondu-logo.png";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/pipeline", icon: Kanban, label: "Pipeline" },
  { path: "/leads", icon: Users, label: "Leads" },
  { path: "/dialer", icon: Phone, label: "Powerdialer" },
  { path: "/settings", icon: Settings, label: "Einstellungen" },
];

export default function CRMSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-crm-sidebar flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-crm-sidebar-border">
        <img src={imonduLogo} alt="Imondu" className="h-8 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-crm-sidebar-active/15 text-primary-foreground"
                  : "text-crm-sidebar-foreground hover:bg-crm-sidebar-hover hover:text-primary-foreground"
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-crm-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
            MM
          </div>
          <div>
            <p className="text-sm font-medium text-primary-foreground">Max Müller</p>
            <p className="text-xs text-crm-sidebar-foreground">Vertriebler</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
