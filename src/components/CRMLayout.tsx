import { ReactNode, useState } from "react";
import CRMSidebar from "./CRMSidebar";
import CRMHeader from "./CRMHeader";

export default function CRMLayout({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <CRMSidebar collapsed={sidebarCollapsed} />
      <CRMHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className="pt-14 min-h-screen transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? 56 : 240 }}
      >
        {children}
      </main>
    </div>
  );
}
