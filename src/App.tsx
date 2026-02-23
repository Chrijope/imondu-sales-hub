import { UserRoleProvider } from "@/contexts/UserRoleContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <UserRoleProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Index />} />
          <Route path="/pipeline" element={<P path="/pipeline"><Pipeline /></P>} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/lead/:id" element={<LeadDetail />} />
          
          <Route path="/chat" element={<P path="/chat"><Chat /></P>} />
          <Route path="/abrechnungen" element={<P path="/abrechnungen"><Abrechnungen /></P>} />
          <Route path="/news" element={<P path="/news"><News /></P>} />
          <Route path="/presentation" element={<P path="/presentation"><Praesentation /></P>} />
          <Route path="/unterlagen" element={<P path="/unterlagen"><Unterlagen /></P>} />
          <Route path="/analysetool" element={<P path="/analysetool"><Analysetool /></P>} />
          <Route path="/teampartner" element={<P path="/teampartner"><Teampartner /></P>} />
          <Route path="/statistik" element={<P path="/statistik"><Statistik /></P>} />
          <Route path="/ansprechpartner" element={<P path="/ansprechpartner"><Ansprechpartner /></P>} />
          <Route path="/marketing-leads" element={<P path="/marketing-leads"><MarketingLeads /></P>} />
          <Route path="/social-media-creator" element={<P path="/social-media-creator"><SocialMediaCreator /></P>} />
          <Route path="/berater-microseite" element={<P path="/berater-microseite"><BeraterMicroseite /></P>} />
          <Route path="/b2c/:subPage" element={<P path="/b2c"><B2CLeads /></P>} />
          <Route path="/b2b/:subPage" element={<P path="/b2b"><B2BLeads /></P>} />
          <Route path="/shop/lead-kauf" element={<P path="/shop"><LeadKauf /></P>} />
          <Route path="/shop/merchandise" element={<P path="/shop"><MerchShop /></P>} />
          <Route path="/einstellungen" element={<P path="/einstellungen"><Einstellungen /></P>} />
          <Route path="/auswertungen" element={<P path="/auswertungen"><Auswertungen /></P>} />
          <Route path="/kontakte" element={<P path="/kontakte"><Kontakte /></P>} />
          <Route path="/inbox" element={<P path="/inbox"><InboxPage /></P>} />
          <Route path="/academy" element={<P path="/academy"><Academy /></P>} />
          <Route path="/inserate" element={<P path="/inserate"><Inserate /></P>} />
          <Route path="/entwickler-registrieren" element={<P path="/entwickler-registrieren"><EntwicklerRegistrieren /></P>} />
          <Route path="/entwickler" element={<P path="/entwickler"><Entwickleruebersicht /></P>} />
          <Route path="/kalender" element={<P path="/kalender"><Kalender /></P>} />
          <Route path="/nutzerverwaltung" element={<P path="/nutzerverwaltung"><Nutzerverwaltung /></P>} />
          <Route path="/nutzerverwaltung/:id" element={<P path="/nutzerverwaltung"><NutzerDetail /></P>} />
          <Route path="/support-ki" element={<P path="/support-ki"><SupportKI /></P>} />
          <Route path="/email" element={<P path="/email"><EmailPage /></P>} />
          <Route path="/rechner/wohnung" element={<P path="/rechner"><RechnerWohnung /></P>} />
          <Route path="/rechner/grundstueck" element={<P path="/rechner"><RechnerGrundstueck /></P>} />
          <Route path="/rechner/mfh" element={<P path="/rechner"><RechnerMFH /></P>} />
          <Route path="/anrufe" element={<P path="/anrufe"><Anrufe /></P>} />
          <Route path="/helpdesk" element={<P path="/helpdesk"><Helpdesk /></P>} />
          <Route path="/automations" element={<P path="/automations"><Automations /></P>} />
          <Route path="/immorechner" element={<P path="/immorechner"><Immorechner /></P>} />
          <Route path="/immorechner/:subPage" element={<P path="/immorechner"><Immorechner /></P>} />
          <Route path="/lexikon" element={<P path="/lexikon"><Lexikon /></P>} />
          <Route path="/zielplanung" element={<P path="/zielplanung"><Zielplanung /></P>} />
          {/* Kundenmaske removed */}
          <Route path="/wettbewerb" element={<P path="/wettbewerb"><Wettbewerb /></P>} />
          <Route path="/lead-scouring" element={<P path="/lead-scouring"><LeadScouring /></P>} />
          <Route path="/webinar" element={<P path="/webinar"><Webinar /></P>} />
          <Route path="/bewerbungsmanagement" element={<P path="/bewerbungsmanagement"><Bewerbungsmanagement /></P>} />
          <Route path="/bewerber-portal" element={<P path="/bewerber-portal"><CRMLayout><BewerberPortal embedded /></CRMLayout></P>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </UserRoleProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
