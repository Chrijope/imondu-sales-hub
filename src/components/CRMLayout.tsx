import { ReactNode } from "react";
import CRMSidebar from "./CRMSidebar";

export default function CRMLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <CRMSidebar />
      <main className="ml-[240px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
