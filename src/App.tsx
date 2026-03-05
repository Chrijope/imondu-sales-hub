import { UserRoleProvider } from "@/contexts/UserRoleContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Pipeline from "./pages/Pipeline";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";

import Chat from "./pages/Chat";
import Abrechnungen from "./pages/Abrechnungen";
import News from "./pages/News";
import Praesentation from "./pages/Praesentation";
import Unterlagen from "./pages/Unterlagen";
import Analysetool from "./pages/Analysetool";
import Teampartner from "./pages/Teampartner";
import Statistik from "./pages/Statistik";
import Ansprechpartner from "./pages/Ansprechpartner";
import MarketingLeads from "./pages/MarketingLeads";
import BeraterMicroseite from "./pages/BeraterMicroseite";
import B2CLeads from "./pages/B2CLeads";
import B2BLeads from "./pages/B2BLeads";
import LeadKauf from "./pages/LeadKauf";
import MerchShop from "./pages/MerchShop";
import Einstellungen from "./pages/Einstellungen";
import Auswertungen from "./pages/Auswertungen";
import Kontakte from "./pages/Kontakte";
import InboxPage from "./pages/Inbox";
import Academy from "./pages/Academy";
import Inserate from "./pages/Inserate";
import EntwicklerRegistrieren from "./pages/EntwicklerRegistrieren";
import Entwickleruebersicht from "./pages/Entwickleruebersicht";
import Kalender from "./pages/Kalender";
import Nutzerverwaltung from "./pages/Nutzerverwaltung";
import NutzerDetail from "./pages/NutzerDetail";
import SupportKI from "./pages/SupportKI";
import EmailPage from "./pages/Email";
import RechnerWohnung from "./pages/RechnerWohnung";
import RechnerGrundstueck from "./pages/RechnerGrundstueck";
import RechnerMFH from "./pages/RechnerMFH";
import SocialMediaCreator from "./pages/SocialMediaCreator";
import Anrufe from "./pages/Anrufe";
import Helpdesk from "./pages/Helpdesk";
import Automations from "./pages/Automations";
import Immorechner from "./pages/Immorechner";
import Lexikon from "./pages/Lexikon";
import Zielplanung from "./pages/Zielplanung";
import Kundenmaske from "./pages/Kundenmaske";
import Wettbewerb from "./pages/Wettbewerb";
import LeadScouring from "./pages/LeadScouring";
import Webinar from "./pages/Webinar";
import Bewerbungsmanagement from "./pages/Bewerbungsmanagement";
import BewerberPortal from "./pages/BewerberPortal";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import CRMLayout from "./components/CRMLayout";

const queryClient = new QueryClient();

const P = ({ path, children }: { path: string; children: React.ReactNode }) => (
  <ProtectedRoute path={path}>{children}</ProtectedRoute>
);

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <AuthProvider>
    <UserRoleProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
          <Route path="/pipeline" element={<RequireAuth><P path="/pipeline"><Pipeline /></P></RequireAuth>} />
          <Route path="/leads" element={<RequireAuth><Leads /></RequireAuth>} />
          <Route path="/lead/:id" element={<RequireAuth><LeadDetail /></RequireAuth>} />
          
          <Route path="/chat" element={<RequireAuth><P path="/chat"><Chat /></P></RequireAuth>} />
          <Route path="/abrechnungen" element={<RequireAuth><P path="/abrechnungen"><Abrechnungen /></P></RequireAuth>} />
          <Route path="/news" element={<RequireAuth><P path="/news"><News /></P></RequireAuth>} />
          <Route path="/presentation" element={<RequireAuth><P path="/presentation"><Praesentation /></P></RequireAuth>} />
          <Route path="/unterlagen" element={<RequireAuth><P path="/unterlagen"><Unterlagen /></P></RequireAuth>} />
          <Route path="/analysetool" element={<RequireAuth><P path="/analysetool"><Analysetool /></P></RequireAuth>} />
          <Route path="/teampartner" element={<RequireAuth><P path="/teampartner"><Teampartner /></P></RequireAuth>} />
          <Route path="/statistik" element={<RequireAuth><P path="/statistik"><Statistik /></P></RequireAuth>} />
          <Route path="/ansprechpartner" element={<RequireAuth><P path="/ansprechpartner"><Ansprechpartner /></P></RequireAuth>} />
          <Route path="/marketing-leads" element={<RequireAuth><P path="/marketing-leads"><MarketingLeads /></P></RequireAuth>} />
          <Route path="/social-media-creator" element={<RequireAuth><P path="/social-media-creator"><SocialMediaCreator /></P></RequireAuth>} />
          <Route path="/berater-microseite" element={<RequireAuth><P path="/berater-microseite"><BeraterMicroseite /></P></RequireAuth>} />
          <Route path="/b2c/:subPage" element={<RequireAuth><P path="/b2c"><B2CLeads /></P></RequireAuth>} />
          <Route path="/b2b/:subPage" element={<RequireAuth><P path="/b2b"><B2BLeads /></P></RequireAuth>} />
          <Route path="/shop/lead-kauf" element={<RequireAuth><P path="/shop"><LeadKauf /></P></RequireAuth>} />
          <Route path="/shop/merchandise" element={<RequireAuth><P path="/shop"><MerchShop /></P></RequireAuth>} />
          <Route path="/einstellungen" element={<RequireAuth><P path="/einstellungen"><Einstellungen /></P></RequireAuth>} />
          <Route path="/auswertungen" element={<RequireAuth><P path="/auswertungen"><Auswertungen /></P></RequireAuth>} />
          <Route path="/kontakte" element={<RequireAuth><P path="/kontakte"><Kontakte /></P></RequireAuth>} />
          <Route path="/inbox" element={<RequireAuth><P path="/inbox"><InboxPage /></P></RequireAuth>} />
          <Route path="/academy" element={<RequireAuth><P path="/academy"><Academy /></P></RequireAuth>} />
          <Route path="/inserate" element={<RequireAuth><P path="/inserate"><Inserate /></P></RequireAuth>} />
          <Route path="/entwickler-registrieren" element={<RequireAuth><P path="/entwickler-registrieren"><EntwicklerRegistrieren /></P></RequireAuth>} />
          <Route path="/entwickler" element={<RequireAuth><P path="/entwickler"><Entwickleruebersicht /></P></RequireAuth>} />
          <Route path="/kalender" element={<RequireAuth><P path="/kalender"><Kalender /></P></RequireAuth>} />
          <Route path="/nutzerverwaltung" element={<RequireAuth><P path="/nutzerverwaltung"><Nutzerverwaltung /></P></RequireAuth>} />
          <Route path="/nutzerverwaltung/:id" element={<RequireAuth><P path="/nutzerverwaltung"><NutzerDetail /></P></RequireAuth>} />
          <Route path="/support-ki" element={<RequireAuth><P path="/support-ki"><SupportKI /></P></RequireAuth>} />
          <Route path="/email" element={<RequireAuth><P path="/email"><EmailPage /></P></RequireAuth>} />
          <Route path="/rechner/wohnung" element={<RequireAuth><P path="/rechner"><RechnerWohnung /></P></RequireAuth>} />
          <Route path="/rechner/grundstueck" element={<RequireAuth><P path="/rechner"><RechnerGrundstueck /></P></RequireAuth>} />
          <Route path="/rechner/mfh" element={<RequireAuth><P path="/rechner"><RechnerMFH /></P></RequireAuth>} />
          <Route path="/anrufe" element={<RequireAuth><P path="/anrufe"><Anrufe /></P></RequireAuth>} />
          <Route path="/helpdesk" element={<RequireAuth><P path="/helpdesk"><Helpdesk /></P></RequireAuth>} />
          <Route path="/automations" element={<RequireAuth><P path="/automations"><Automations /></P></RequireAuth>} />
          <Route path="/immorechner" element={<RequireAuth><P path="/immorechner"><Immorechner /></P></RequireAuth>} />
          <Route path="/immorechner/:subPage" element={<RequireAuth><P path="/immorechner"><Immorechner /></P></RequireAuth>} />
          <Route path="/lexikon" element={<RequireAuth><P path="/lexikon"><Lexikon /></P></RequireAuth>} />
          <Route path="/zielplanung" element={<RequireAuth><P path="/zielplanung"><Zielplanung /></P></RequireAuth>} />
          {/* Kundenmaske removed */}
          <Route path="/wettbewerb" element={<RequireAuth><P path="/wettbewerb"><Wettbewerb /></P></RequireAuth>} />
          <Route path="/lead-scouring" element={<RequireAuth><P path="/lead-scouring"><LeadScouring /></P></RequireAuth>} />
          <Route path="/webinar" element={<RequireAuth><P path="/webinar"><Webinar /></P></RequireAuth>} />
          <Route path="/bewerbungsmanagement" element={<RequireAuth><P path="/bewerbungsmanagement"><Bewerbungsmanagement /></P></RequireAuth>} />
          <Route path="/bewerber-portal" element={<RequireAuth><P path="/bewerber-portal"><CRMLayout><BewerberPortal embedded /></CRMLayout></P></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </UserRoleProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
