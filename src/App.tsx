import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pipeline from "./pages/Pipeline";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import Dialer from "./pages/Dialer";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/lead/:id" element={<LeadDetail />} />
          <Route path="/dialer" element={<Dialer />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/abrechnungen" element={<Abrechnungen />} />
          <Route path="/news" element={<News />} />
          <Route path="/presentation" element={<Praesentation />} />
          <Route path="/unterlagen" element={<Unterlagen />} />
          <Route path="/analysetool" element={<Analysetool />} />
          <Route path="/teampartner" element={<Teampartner />} />
          <Route path="/statistik" element={<Statistik />} />
          <Route path="/ansprechpartner" element={<Ansprechpartner />} />
          <Route path="/marketing-leads" element={<MarketingLeads />} />
          <Route path="/berater-microseite" element={<BeraterMicroseite />} />
          <Route path="/b2c/:subPage" element={<B2CLeads />} />
          <Route path="/b2b/:subPage" element={<B2BLeads />} />
          <Route path="/shop/lead-kauf" element={<LeadKauf />} />
          <Route path="/shop/merchandise" element={<MerchShop />} />
          <Route path="/einstellungen" element={<Einstellungen />} />
          <Route path="/auswertungen" element={<Auswertungen />} />
          <Route path="/kontakte" element={<Kontakte />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
