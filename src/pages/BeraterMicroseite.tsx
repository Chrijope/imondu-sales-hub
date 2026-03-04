import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy, ExternalLink, User, Building2, Home, Plus, ChevronDown, ChevronUp,
  Trash2, TrendingUp, Users, Shield, Briefcase, Phone, Mail,
  Star, ArrowRight, Smartphone, Pencil, CheckCircle2, Eye, Lock, Zap,
  Target, BarChart3, Search, MessageCircle, Award, Clock, MapPin,
  Wrench, Hammer, HardHat, Building, Lightbulb, ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import imonduLogo from "@/assets/imondu-logo-full.png";
import imonduLogoDark from "@/assets/imondu-logo-dark.png";
import marinkoImg from "@/assets/marinko-marjanovic.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUserRole } from "@/contexts/UserRoleContext";

interface RabattCode {
  id: string;
  code: string;
  type: "developer" | "customer";
  rabattProzent: number;
  nutzungen: number;
  zahlend: number;
  promo: number;
  mitarbeiterId?: string;
}

const RABATT_OPTIONEN = [0, 10, 20, 25, 30, 40, 50, 100];

const MITARBEITER_LISTE = [
  { id: "u1", name: "Christian Peetz" },
  { id: "u2", name: "Manuel Schilling" },
  { id: "u3", name: "Lisa Weber" },
  { id: "u4", name: "Oliver Gjorgijev" },
  { id: "u5", name: "Julia Fischer" },
];

const INITIAL_CODES: RabattCode[] = [
  { id: "1", code: "K4P4", type: "customer", rabattProzent: 0, nutzungen: 1, zahlend: 0, promo: 1, mitarbeiterId: "u3" },
  { id: "2", code: "H991", type: "developer", rabattProzent: 25, nutzungen: 0, zahlend: 0, promo: 0, mitarbeiterId: "u3" },
  { id: "3", code: "5Y31", type: "developer", rabattProzent: 10, nutzungen: 0, zahlend: 0, promo: 0, mitarbeiterId: "u1" },
  { id: "4", code: "27J5", type: "developer", rabattProzent: 20, nutzungen: 0, zahlend: 0, promo: 0, mitarbeiterId: "u1" },
  { id: "5", code: "178D", type: "developer", rabattProzent: 50, nutzungen: 0, zahlend: 0, promo: 0, mitarbeiterId: "u2" },
  { id: "6", code: "6L7Y", type: "developer", rabattProzent: 30, nutzungen: 0, zahlend: 0, promo: 0, mitarbeiterId: "u3" },
  { id: "7", code: "B8N8", type: "developer", rabattProzent: 100, nutzungen: 0, zahlend: 0, promo: 0, mitarbeiterId: "u2" },
  { id: "8", code: "J9B3", type: "developer", rabattProzent: 25, nutzungen: 0, zahlend: 0, promo: 0, mitarbeiterId: "u3" },
  { id: "9", code: "J12Q", type: "developer", rabattProzent: 40, nutzungen: 0, zahlend: 0, promo: 0, mitarbeiterId: "u1" },
];

const PREISE = { basis: 899.90, premium: 1249.90 };

function formatPreis(n: number) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

/* ═══════════════════════════════════════════════════════════
   EIGENTÜMER LANDING PAGE
   Verkaufspsychologie: Problem → Emotion → Lösung → Proof → CTA
   ═══════════════════════════════════════════════════════════ */
function CustomerLandingPreview({ beraterName, beraterTitel, beraterTelefon, beraterEmail, beraterAdresse, rabattCode }: {
  beraterName: string; beraterTitel: string; beraterTelefon: string; beraterEmail: string; beraterAdresse: string; rabattCode?: string;
}) {
  return (
    <div className="space-y-0 bg-background">
      {/* Sticky Nav */}
      <nav className="bg-background/95 backdrop-blur-md border-b border-border px-8 py-3 flex items-center justify-between sticky top-0 z-10">
        <img src={imonduLogoDark} alt="IMONDU" className="h-8 object-contain" />
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-xs">Wie funktioniert's?</Button>
          <Button size="sm" className="gradient-brand border-0 text-primary-foreground text-xs" asChild><a href="/analysetool">Jetzt Potenzial prüfen</a></Button>
        </div>
      </nav>

      {/* ─── HERO: Pattern Interrupt + Neugier ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative px-8 py-20 max-w-4xl">
          <Badge className="gradient-brand text-primary-foreground border-0 mb-4">Die Nr. 1 Plattform für Immobilienentwicklung</Badge>
          <h1 className="text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
            Was steckt wirklich<br />in Deiner <span className="text-primary">Immobilie?</span>
          </h1>
          <p className="text-xl text-muted-foreground mt-5 max-w-2xl leading-relaxed">
            Entdecke, welches Entwicklungspotenzial in Deiner Immobilie oder Deinem Grundstück steckt – <strong className="text-foreground">kostenlos, unverbindlich</strong> und transparent.
          </p>
          <p className="text-base text-primary font-semibold mt-3 italic">
            „Klarheit kostet nichts. Unwissen kann teuer sein."
          </p>
          <div className="flex items-center gap-4 mt-8">
            <Button size="lg" className="gradient-brand border-0 text-primary-foreground text-base px-8 py-6 shadow-lg" asChild>
              <a href="/analysetool">Kostenlose Potenzialanalyse starten <ArrowRight className="ml-2 h-5 w-5" /></a>
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> <span>In nur 3 Minuten</span>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Keine Kosten</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Keine Verpflichtung</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Keine Maklerbindung</span>
          </div>
        </div>
      </section>

      {/* ─── CEO QUOTE: Authority + Trust ─── */}
      <section className="bg-foreground text-background px-8 py-12">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <img src={marinkoImg} alt="Marinko Marjanovic" className="h-28 w-28 rounded-full object-cover object-top shrink-0 opacity-90 ring-2 ring-primary/30" />
          <div className="text-center md:text-left">
            <p className="text-lg italic leading-relaxed opacity-90">
              „Eigentümer brauchen keine schnellen Entscheidungen. Sie brauchen zuerst <strong className="text-primary">Klarheit über ihre Optionen</strong>."
            </p>
            <p className="text-sm font-bold mt-4 opacity-70">Marinko Marjanovic, Geschäftsführer</p>
            <p className="text-sm mt-3 opacity-60">
              Genau deshalb erhalten Eigentümer bei IMONDU zuerst Optionen – keine Verpflichtung, keine Kosten.
            </p>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM: Agitation – Die Situation vieler Eigentümer ─── */}
      <section className="px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">
            Die Situation vieler <span className="text-primary">Immobilieneigentümer</span>
          </h2>
          <p className="text-base text-muted-foreground mt-3 max-w-2xl mx-auto">
            Eine Immobilie mit Substanz oder Entwicklungspotenzial – aber ohne klaren Fahrplan.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { icon: Search, text: "Unsicherheit bei Kosten, Ablauf und Genehmigungen" },
            { icon: Users, text: "Kein neutraler Ansprechpartner" },
            { icon: Shield, text: "Angst vor Fehlentscheidungen" },
            { icon: BarChart3, text: "Unklare Marktwerte bei Verkauf oder Projektierung" },
          ].map((item, i) => (
            <div key={i} className="bg-destructive/5 border border-destructive/10 rounded-xl p-5 text-center">
              <item.icon className="h-8 w-8 text-destructive/60 mx-auto mb-3" />
              <p className="text-sm text-foreground font-medium">{item.text}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-muted-foreground text-sm mt-8 max-w-xl mx-auto italic">
          Dieses Wertsteigerungspotenzial bleibt häufig ungenutzt – nicht aus Mangel an Substanz, sondern aus <strong className="text-foreground">fehlender Orientierung</strong>.
        </p>
        <div className="text-center mt-8">
          <Button size="lg" className="gradient-brand border-0 text-primary-foreground px-8 py-5 shadow-lg" asChild>
            <a href="/analysetool">Jetzt Dein Potenzial entdecken <ArrowRight className="ml-2 h-5 w-5" /></a>
          </Button>
        </div>
      </section>

      {/* ─── LÖSUNG: Was möglich ist – Wertsteigerungsbeispiele ─── */}
      <section className="bg-primary/5 px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">
            Was möglich ist, wenn <span className="text-primary">Potenzial erkannt</span> wird
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto items-stretch">
          {[
            { title: "Sanierung", zeit: "6 Monate", investition: "400.000 €", vorher: "600.000 €", nachher: "1.050.000 €", wertsteigerung: "450.000 €" },
            { title: "Grundrissoptimierung", zeit: "2 Monate", investition: "150.000 €", vorher: "600.000 €", nachher: "850.000 €", wertsteigerung: "250.000 €" },
            { title: "Teilung & Neubau", zeit: "6 Monate", investition: "500.000 €", vorher: "250.000 €", nachher: "950.000 €", wertsteigerung: "700.000 €" },
            { title: "Umnutzung / Nachverdichtung", zeit: "6 Monate", investition: "400.000 €", vorher: "1.000.000 €", nachher: "2.600.000 €", wertsteigerung: "1.200.000 €" },
          ].map((ex, i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="gradient-brand px-4 py-3">
                <h3 className="text-white font-bold text-sm leading-tight min-h-[2.5rem] flex items-center">{ex.title}</h3>
                <p className="text-white/70 text-[10px]">Entwicklungszeit: {ex.zeit}</p>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="space-y-2.5 flex-1">
                  <div className="flex justify-between items-baseline text-sm gap-2">
                    <span className="text-muted-foreground text-xs">Vor Entwicklung</span>
                    <span className="font-bold text-foreground whitespace-nowrap">{ex.vorher}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm gap-2">
                    <span className="text-muted-foreground text-xs">Investitionskosten</span>
                    <span className="text-foreground whitespace-nowrap">{ex.investition}</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between items-baseline text-sm gap-2">
                    <span className="text-muted-foreground text-xs">Nach Entwicklung</span>
                    <span className="font-bold text-primary whitespace-nowrap">{ex.nachher}</span>
                  </div>
                </div>
                <div className="bg-primary/10 rounded-lg p-3 text-center mt-3">
                  <p className="text-[10px] text-muted-foreground">Wertsteigerung</p>
                  <p className="text-lg font-bold text-primary">+{ex.wertsteigerung}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PLATTFORM: Alle Partner an einem Ort ─── */}
      <section className="px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">
            Alle Partner für Deine Entwicklung. <span className="text-primary">An einem Ort.</span>
          </h2>
          <p className="text-base text-muted-foreground mt-3 max-w-2xl mx-auto">
            Auf IMONDU findest Du geprüfte Projektentwickler, Architekten, Energieberater und Fachbetriebe – transparent vergleichbar und mit einem Klick erreichbar.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="bg-muted/50 px-6 py-3 border-b border-border flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/40" />
                <div className="h-3 w-3 rounded-full bg-warning/40" />
                <div className="h-3 w-3 rounded-full bg-primary/40" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">imondu.com – Entwickler finden</p>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-2">
                  {["Architekt", "Projektentwickler", "Energieberater", "Handwerker"].map((b) => (
                    <Badge key={b} variant="outline" className="text-xs">{b}</Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Florian Maier", rolle: "Projektentwickler", badge: "PremiumPartner", score: "92%" },
                  { name: "Gianluca Schick", rolle: "Projektleiter", badge: "PremiumPartner", score: "88%" },
                  { name: "Rinor Hoxha", rolle: "Immobilieninvestor", badge: "Partner", score: "85%" },
                  { name: "Maximilian S.", rolle: "Projektentwickler", badge: "Partner", score: "79%" },
                ].map((dev, i) => (
                  <div key={i} className="border border-border rounded-lg p-4 text-center hover:border-primary/30 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-bold text-foreground">{dev.name}</p>
                    <p className="text-[10px] text-muted-foreground">{dev.rolle}</p>
                    <Badge className={`text-[9px] mt-1 ${dev.badge === "PremiumPartner" ? "gradient-brand text-white border-0" : "bg-muted text-muted-foreground"}`}>{dev.badge}</Badge>
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Match</p>
                      <p className="text-sm font-bold text-primary">{dev.score}</p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-2 text-[10px] h-7">Kontaktanfrage</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ANGEBOTE VERGLEICHEN ─── */}
      <section className="bg-primary/5 px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">
            Wähle die Lösung, die den <span className="text-primary">größten Wert</span> aus Deiner Immobilie holt
          </h2>
          <p className="text-sm text-muted-foreground mt-2">Du entscheidest jederzeit, ob und wie Du weitergehst.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[
            { nr: "O-839018744", entwickler: "Herr S.", score: "58%", wertsteigerung: "250.000 €", wertVorher: "600.000 €", wertNachher: "1.200.000 €", kosten: "350.000 €" },
            { nr: "O-363000142", entwickler: "Herr Schick", score: "68%", wertsteigerung: "800.000 €", wertVorher: "550.000 €", wertNachher: "1.600.000 €", kosten: "550.000 €" },
          ].map((angebot, i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Angebot Nr.</p>
                  <p className="text-sm font-bold text-foreground">{angebot.nr}</p>
                </div>
                <Badge variant="outline" className="text-xs">Offen</Badge>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ihr Entwickler</span>
                  <span className="text-sm font-medium text-foreground">{angebot.entwickler}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Match-Score</span>
                  <span className="text-sm font-bold text-primary">{angebot.score}</span>
                </div>
                <hr className="border-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Aktueller Wert</span>
                  <span className="text-sm font-medium text-foreground">{angebot.wertVorher}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Entwicklungskosten</span>
                  <span className="text-sm text-foreground">{angebot.kosten}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nach Entwicklung</span>
                  <span className="text-sm font-bold text-primary">{angebot.wertNachher}</span>
                </div>
                <div className="bg-primary/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Potenzielle Wertsteigerung</p>
                  <p className="text-xl font-bold text-primary">+{angebot.wertsteigerung}</p>
                </div>
                <Button size="sm" variant="outline" className="w-full text-xs">Nachricht schreiben</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── IMMOBILIENTYPEN ─── */}
      <section className="px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">
            Für welche Immobilientypen ist <span className="text-primary">IMONDU</span> geeignet?
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { icon: Home, label: "Einfamilienhäuser" },
            { icon: Building2, label: "Mehrfamilienhäuser" },
            { icon: MapPin, label: "Grundstücke" },
            { icon: Building, label: "Eigentumswohnungen" },
            { icon: Briefcase, label: "Gewerbeimmobilien" },
            { icon: Wrench, label: "Mischobjekte" },
          ].map((t, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 flex items-center gap-3 hover:border-primary/30 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <t.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">{t.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ENTWICKLUNGSPOTENZIAL ─── */}
      <section className="bg-muted/50 px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">
            Mehr als Sanierung oder Neubau –<br />es geht um <span className="text-primary">Dein Potenzial</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" /> Für Wohnungseigentümer
            </h3>
            <ul className="space-y-3">
              {["Zusammenlegung von Einheiten", "Dachgeschossausbau", "Teilungserklärung und Einzelverkauf", "Gezielte Aufwertung für profitablen Verkauf"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" /> Für Gewerbeeigentümer
            </h3>
            <ul className="space-y-3">
              {["Umnutzung in Wohnen", "Mixed-Use-Konzepte", "Revitalisierung leerstehender Flächen", "Mietsteigerung durch Modernisierung"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 bg-primary/5 border border-primary/10 rounded-xl p-6 max-w-2xl mx-auto">
          <p className="text-foreground font-semibold">Ziel: Mehr Wert aus bestehender Substanz schaffen.</p>
          <p className="text-sm text-muted-foreground mt-1">Ertrag steigern, Risiko reduzieren, Zukunft sichern.</p>
          <Button size="lg" className="gradient-brand border-0 text-primary-foreground px-8 py-5 shadow-lg mt-4" asChild>
            <a href="/analysetool">Potenzialanalyse starten – kostenfrei <ArrowRight className="ml-2 h-5 w-5" /></a>
          </Button>
        </div>
      </section>

      {/* ─── SO FUNKTIONIERT'S ─── */}
      <section className="px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">
            So sicherst Du Dir echte Optionen – <span className="text-primary">bevor</span> Du entscheidest
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { step: "01", title: "Potenzialanalyse starten", desc: "Prüfe kostenlos das Entwicklungspotenzial Deiner Immobilie.", icon: Home },
            { step: "02", title: "Partner vergleichen", desc: "Alle Partner für Deine Entwicklung an einem Ort – transparent und vergleichbar.", icon: Users },
            { step: "03", title: "Du entscheidest", desc: "Wähle die Lösung, die den größten Wert aus Deiner Immobilie holt.", icon: Star },
          ].map((s) => (
            <div key={s.step} className="relative bg-card border border-border rounded-xl p-6 text-center">
              <div className="h-12 w-12 rounded-full gradient-brand flex items-center justify-center mx-auto text-white font-bold text-lg shadow-lg">{s.step}</div>
              <h3 className="font-bold text-foreground mt-4 text-lg">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button size="lg" className="gradient-brand border-0 text-primary-foreground px-8 py-5 shadow-lg" asChild>
            <a href="/analysetool">Kostenlose Potenzialanalyse starten <ArrowRight className="ml-2 h-5 w-5" /></a>
          </Button>
        </div>
      </section>

      {/* ─── TRUST: IMONDU Modell ─── */}
      <section className="bg-foreground text-background px-8 py-14">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold">
            Entwicklung – mit dem <span className="text-primary">richtigen Partner</span>
          </h2>
          <p className="text-sm opacity-80 mt-4 leading-relaxed">
            IMONDU verbindet Hauseigentümer mit geprüften Projektentwicklern und Fachexperten – transparent, vergleichbar und <strong>komplett kostenfrei für Eigentümer.</strong>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              "Zugang zu Entwicklungspartnern",
              "Klare Vergleichbarkeit",
              "Volle Entscheidungsfreiheit",
              "Kostenübernahme durch Entwickler möglich",
            ].map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <CheckCircle2 className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-xs opacity-80">{t}</p>
              </div>
            ))}
          </div>
          <p className="text-xs opacity-50 mt-6">IMONDU wird ausschließlich von geprüften Entwicklungspartnern vergütet. Für Eigentümer ist die Nutzung kostenfrei.</p>
        </div>
      </section>

      {/* ─── KOSTENÜBERSICHT (erweitert) ─── */}
      <section className="px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">
            Das könnte Dein <span className="text-primary">Entwicklungspotenzial</span> sein
          </h2>
        </div>
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <div className="min-w-[700px] overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-5 bg-muted/50">
              <div className="p-3 border-r border-border"><p className="text-[10px] font-bold text-muted-foreground">KATEGORIE</p></div>
              <div className="p-3 border-r border-border text-center"><p className="text-[10px] font-bold text-muted-foreground">EINFACHE SANIERUNG</p><p className="text-[9px] text-muted-foreground">Innen & Außen</p></div>
              <div className="p-3 border-r border-border text-center"><p className="text-[10px] font-bold text-muted-foreground">KERNSANIERUNG</p></div>
              <div className="p-3 border-r border-border text-center"><p className="text-[10px] font-bold text-muted-foreground">NEUBAU</p><p className="text-[9px] text-muted-foreground">Ohne Tiefgarage</p></div>
              <div className="p-3 text-center"><p className="text-[10px] font-bold text-muted-foreground">NEUBAU</p><p className="text-[9px] text-muted-foreground">Mit Tiefgarage</p></div>
            </div>
            <div className="grid grid-cols-5">
              <div className="p-3 border-r border-t border-border"><p className="text-xs text-muted-foreground">Entstehungskosten</p></div>
              <div className="p-3 border-r border-t border-border text-center"><p className="text-xs font-medium text-foreground">500 €/m²</p></div>
              <div className="p-3 border-r border-t border-border text-center"><p className="text-xs font-medium text-foreground">1.000 €/m²</p></div>
              <div className="p-3 border-r border-t border-border text-center"><p className="text-xs font-medium text-foreground">2.800–3.000 €/m²</p></div>
              <div className="p-3 border-t border-border text-center"><p className="text-xs font-medium text-foreground">3.000–3.500 €/m²</p></div>
            </div>
            <div className="grid grid-cols-5 bg-primary/5">
              <div className="p-3 border-r border-t border-border"><p className="text-xs font-semibold text-foreground">Preis Endkunde*</p></div>
              <div className="p-3 border-r border-t border-border text-center"><p className="text-xs font-bold text-primary">750–1.000 €/m²</p></div>
              <div className="p-3 border-r border-t border-border text-center"><p className="text-xs font-bold text-primary">1.500–2.000 €/m²</p></div>
              <div className="p-3 border-r border-t border-border text-center"><p className="text-xs font-bold text-primary">3.500–4.000 €/m²</p></div>
              <div className="p-3 border-t border-border text-center"><p className="text-xs font-bold text-primary">4.000–5.000 €/m²</p></div>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-3">*Preis abhängig von detaillierter Leistungsbeschreibung.</p>

        {/* Partnernetzwerk berücksichtigt */}
        <div className="max-w-3xl mx-auto mt-10">
          <h3 className="text-lg font-bold text-foreground text-center mb-4">Unser Partnernetzwerk berücksichtigt dabei:</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { icon: MapPin, label: "Lage & Umfeld" },
              { icon: Home, label: "Art der Immobilie" },
              { icon: Building2, label: "Wohn- oder Nutzfläche" },
              { icon: Wrench, label: "Zustand & Bebauung" },
              { icon: Shield, label: "Baurechtliche Optionen" },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-3 text-center">
                <item.icon className="h-5 w-5 text-primary mx-auto mb-1.5" />
                <p className="text-[10px] font-medium text-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-muted/50 px-8 py-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">Häufig gestellte Fragen</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {[
              { q: "Was kostet die Nutzung von IMONDU für Eigentümer?", a: "Für Eigentümer ist IMONDU komplett kostenfrei – unabhängig davon, ob Du Dich für eine Entwicklung entscheidest oder nicht. IMONDU wird ausschließlich von den Entwicklungspartnern vergütet." },
              { q: "Wen oder was brauche ich für eine Immobilienentwicklung?", a: "Einen erfahrenen Immobilienentwickler, der Dein Projekt von Anfang an begleitet. Er identifiziert die Potenziale Deiner Immobilie und erstellt ein wertorientiertes Entwicklungskonzept. Diese Experten findest Du auf IMONDU." },
              { q: "Welche Kosten kommen bei einer Entwicklung auf mich zu?", a: "Die Kosten setzen sich aus Planung, Bau und Material zusammen. Wenn Du planst, Deine Immobilie nach der Entwicklung zu verkaufen, musst Du bei Entwicklern von IMONDU nicht in finanzielle Vorleistung gehen." },
              { q: "Bin ich an irgendetwas gebunden?", a: "Nein. Du entscheidest jederzeit frei, ob und wie Du weitergehst. Keine Maklerbindung, keine versteckten Klauseln." },
            ].map((f, i) => (
              <AccordionItem key={i} value={`faq${i}`} className="bg-card border border-border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── BERATER CTA ─── */}
      <BeraterCTA name={beraterName} titel={beraterTitel} telefon={beraterTelefon} email={beraterEmail} adresse={beraterAdresse} />

      {/* ─── NOCH FRAGEN ─── */}
      <section className="px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-foreground">Noch Fragen?</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
          Sie möchten mehr erfahren? Kontaktieren Sie uns gerne – wir beraten Sie persönlich.
        </p>
        <div className="flex justify-center gap-3 mt-4">
          <Button variant="outline" asChild><a href={`tel:${beraterTelefon}`}><Phone className="mr-2 h-4 w-4" /> Beratungsgespräch</a></Button>
          <Button variant="outline" asChild><a href={`mailto:${beraterEmail}`}><Mail className="mr-2 h-4 w-4" /> E-Mail Kontakt</a></Button>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="gradient-brand px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-white">
          Bevor Du entscheidest –<br />prüfe Dein Potenzial.
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-white/80 text-sm">
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> 3 Minuten Aufwand</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Keine Verpflichtung</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Keine Kosten</span>
          <span className="flex items-center gap-1.5"><Lock className="h-4 w-4" /> Keine Maklerbindung</span>
        </div>
        <Button size="lg" className="mt-8 bg-white text-foreground hover:bg-white/90 text-base px-10 py-6 shadow-xl font-bold" asChild>
          <a href="/analysetool">Jetzt Potenzialanalyse starten <ArrowRight className="ml-2 h-5 w-5" /></a>
        </Button>
        <p className="text-white/60 text-sm mt-4 italic">Jede Immobilie hat Potenzial. Die Frage ist nur, ob Du es kennst.</p>
      </section>

      {/* ─── APP ─── */}
      <section className="bg-muted/50 px-8 py-10 text-center">
        <h2 className="text-xl font-bold text-foreground">Demnächst auch als App</h2>
        <p className="text-sm text-muted-foreground mt-1">Für noch schnelleren Zugriff unterwegs.</p>
        <div className="flex justify-center gap-3 mt-4">
          <div className="bg-foreground text-background rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium"><Smartphone className="h-4 w-4" /> App Store</div>
          <div className="bg-foreground text-background rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium"><Smartphone className="h-4 w-4" /> Google Play</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background px-8 py-6 text-center">
        <img src={imonduLogoDark} alt="IMONDU" className="h-6 mx-auto opacity-50 invert" />
        <p className="text-xs opacity-40 mt-3">© {new Date().getFullYear()} IMONDU GmbH. Alle Rechte vorbehalten. | www.imondu.com</p>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ENTWICKLER LANDING PAGE
   Verkaufspsychologie: Pain → Consequence → Solution → ROI → Close
   Social-Media-Strategie: Hook → Story → Proof → Offer
   ═══════════════════════════════════════════════════════════ */
function DeveloperLandingPreview({ beraterName, beraterTitel, beraterTelefon, beraterEmail, beraterAdresse, rabattCode }: {
  beraterName: string; beraterTitel: string; beraterTelefon: string; beraterEmail: string; beraterAdresse: string; rabattCode?: string;
}) {
  const rabattProzent = rabattCode ? (INITIAL_CODES.find(c => c.code === rabattCode)?.rabattProzent ?? 0) : 0;
  const premiumOriginal = PREISE.premium;
  const premiumFinal = premiumOriginal - (premiumOriginal * rabattProzent / 100);
  const hasPremiumDiscount = rabattProzent > 0;

  return (
    <div className="space-y-0 bg-background">
      {/* Sticky Nav */}
      <nav className="bg-background/95 backdrop-blur-md border-b border-border px-8 py-3 flex items-center justify-between sticky top-0 z-10">
        <img src={imonduLogoDark} alt="IMONDU" className="h-8 object-contain" />
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-xs">So funktioniert's</Button>
          <Button size="sm" className="gradient-brand border-0 text-primary-foreground text-xs" asChild>
            <a href="/entwickler-registrieren">Jetzt Partner werden</a>
          </Button>
        </div>
      </nav>

      {/* ─── HERO: Hook + Kontrast ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative px-8 py-20 max-w-4xl">
          <Badge className="gradient-brand text-primary-foreground border-0 mb-4">Die Nr. 1 Plattform für Immobilienentwicklung</Badge>
          <h1 className="text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
            Projekte mit echtem<br /><span className="text-primary">Potenzial.</span>
          </h1>
          <p className="text-xl text-muted-foreground mt-5 max-w-2xl leading-relaxed">
            IMONDU bringt Dir geprüfte Eigentümer – mit echtem Entwicklungspotenzial.
            <strong className="text-foreground"> Günstiger als eine Printanzeige</strong> – mit deutlich höherer Abschlusswahrscheinlichkeit.
          </p>
          <div className="flex items-center gap-6 mt-6">
            {[
              { icon: Target, label: "Mehr qualifizierte Anfragen" },
              { icon: Zap, label: "Weniger Streuverlust" },
              { icon: Eye, label: "Volle Transparenz" },
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5 text-sm text-foreground font-medium">
                <item.icon className="h-4 w-4 text-primary" /> {item.label}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-8">
            <Button size="lg" className="gradient-brand border-0 text-primary-foreground text-base px-8 py-6 shadow-lg" asChild>
              <a href="/entwickler-registrieren">Jetzt Partner werden <ArrowRight className="ml-2 h-5 w-5" /></a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={`tel:${beraterTelefon}`}><Phone className="mr-2 h-4 w-4" /> Beratungsgespräch</a>
            </Button>
          </div>
          <p className="text-primary text-sm font-semibold mt-4 italic">
            „Ein Projekt finanziert Deine Mitgliedschaft für Jahre."
          </p>
        </div>
      </section>

      {/* ─── PAIN: Warum Entwickler Projekte verlieren ─── */}
      <section className="bg-foreground text-background px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            Warum Entwickler heute <span className="text-primary">Projekte verlieren.</span>
          </h2>
          <p className="text-sm opacity-60 text-center mb-10">Die Realität des Marktes.</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { icon: Clock, label: "Hoher Akquiseaufwand" },
              { icon: TrendingUp, label: "Preisdruck durch Vergleichsportale" },
              { icon: Users, label: "Unqualifizierte Anfragen" },
              { icon: BarChart3, label: "Lange Entscheidungsprozesse" },
              { icon: Target, label: "Steigende Marketingkosten" },
            ].map((p, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p.icon className="h-7 w-7 text-destructive/80 mx-auto mb-2" />
                <p className="text-xs opacity-80 font-medium">{p.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <h3 className="text-xl font-bold">Die Konsequenz:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 max-w-3xl mx-auto">
              {["Weniger Zeit für Projekte", "Mehr Aufwand für Akquise", "Sinkende Margen", "Steigende Kosten"].map((c, i) => (
                <div key={i} className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-xs text-destructive font-medium">{c}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CEO QUOTE (erweitert) ─── */}
      <section className="bg-primary/5 px-8 py-16">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <img src={marinkoImg} alt="Marinko Marjanovic" className="h-28 w-28 rounded-full object-cover object-top shrink-0 ring-2 ring-primary/20" />
          <div className="text-center md:text-left">
            <p className="text-lg italic text-foreground leading-relaxed">
              „Gute Projekte entstehen nicht durch mehr Kaltakquise. Sie entstehen durch den <strong className="text-primary">richtigen Zugang zu Eigentümern</strong> – zur richtigen Zeit."
            </p>
            <p className="text-sm font-bold text-muted-foreground mt-4">Marinko Marjanovic, Geschäftsführer</p>
            <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto md:mx-0">
              Genau deshalb verbindet IMONDU geprüfte Entwickler direkt mit Eigentümern – strukturiert, transparent und ohne Streuverlust.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
            {[
              "Planbare Projektpipeline",
              "Qualifizierte Eigentümeranfragen",
              "Kein Preiskampf über Vergleichsportale",
            ].map((t, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <p className="text-xs font-medium text-foreground">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STRATEGISCHER ZUGANG ─── */}
      <section className="bg-foreground text-background px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            Vom Zufall zur <span className="text-primary">planbaren Pipeline.</span>
          </h2>
          <p className="text-sm opacity-60 text-center mb-10">Dein strategischer Zugang zu Eigentümern.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Direkter Zugang", desc: "Kontakt zu Eigentümern ohne Makler, ohne Umwege – direkt über die Plattform." },
              { icon: MessageCircle, title: "Früher Austausch", desc: "Tritt frühzeitig in den Dialog – bevor Eigentümer andere Optionen prüfen." },
              { icon: Target, title: "Einfluss auf Projekte", desc: "Gestalte Projekte aktiv mit, statt nur auf Ausschreibungen zu reagieren." },
              { icon: BarChart3, title: "Planbare Pipeline", desc: "Baue Dir eine kontinuierliche Projektpipeline auf – unabhängig von Empfehlungen." },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <div className="h-10 w-10 rounded-full gradient-brand flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-bold mb-2">{item.title}</h3>
                <p className="text-xs opacity-70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LÖSUNG: Kein Vergleichsportal ─── */}
      <section className="px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">
            Kein Vergleichsportal.<br />Sondern Dein strategischer <span className="text-primary">Zugang zu Eigentümern.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {[
            { num: "1", label: "Keine Streuverluste" },
            { num: "2", label: "Keine Kaltakquise" },
            { num: "3", label: "Keine Maklerabhängigkeit" },
            { num: "4", label: "Eigentümer kommen aktiv" },
            { num: "5", label: "Du wählst gezielt aus" },
          ].map((s) => (
            <div key={s.num} className="bg-card border border-border rounded-xl p-5 text-center">
              <div className="h-9 w-9 rounded-full gradient-brand flex items-center justify-center mx-auto text-white font-bold text-sm">{s.num}</div>
              <p className="text-xs font-semibold text-foreground mt-3">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-primary font-bold text-lg mt-8">Pipeline statt Projekt-Hoffnung.</p>
      </section>

      {/* ─── RELEVANZ ─── */}
      <section className="bg-muted/50 px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">Nicht Masse. <span className="text-primary">Relevanz.</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {[
            "Nur Eigentümer mit realem Entwicklungsinteresse",
            "Vorqualifizierte Objekte",
            "Konkretes Entwicklungspotenzial",
            "Direkter Austausch möglich",
          ].map((t, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm font-medium text-foreground">{t}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-muted-foreground text-sm mt-6">Monatlich neue qualifizierte Eigentümeranfragen.</p>
      </section>

      {/* ─── MARKT ─── */}
      <section className="px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">
            Der Markt ist riesig – nur nicht <span className="text-primary">strukturiert zugänglich</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2">Es fehlt nicht an Nachfrage.</p>
        </div>
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { value: "6,61 Mio.", label: "Eigentümer in Deutschland", src: "¹ Deutschlandatlas" },
            { value: "70 %", label: "digital erreichbar", src: "² Bitkom" },
            { value: "125 Mrd. €", label: "adressierbares Entwicklungsvolumen p.a.", src: "³ Eigene Schätzung" },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-foreground font-medium mt-2">{stat.label}</p>
              <p className="text-[9px] text-muted-foreground mt-1">{stat.src}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FÜR WEN ─── */}
      <section className="bg-primary/5 px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Für wen ist <span className="text-primary">IMONDU?</span></h2>
          <p className="text-sm text-muted-foreground mt-2">Projektentwickler & Fachbetriebe</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { icon: Building2, label: "Projektentwickler" },
            { icon: HardHat, label: "Architekten" },
            { icon: Lightbulb, label: "Energieberater" },
            { icon: Hammer, label: "Dachdecker" },
            { icon: Wrench, label: "Fensterbauer" },
            { icon: Zap, label: "Heizungsbauer" },
            { icon: Building, label: "Generalunternehmer" },
            { icon: Briefcase, label: "Handwerker" },
          ].map((t, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <t.icon className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm font-medium text-foreground">{t.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ROI: Was ein Projekt wert sein kann ─── */}
      <section className="px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">
            Was ein einziges Projekt <span className="text-primary">wert sein kann</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: "Sanierung", wert: "40.000 €", color: "bg-primary/10" },
            { label: "Heizungsbau", wert: "25.000 €", color: "bg-primary/10" },
            { label: "Dachbau", wert: "60.000 €", color: "bg-primary/10" },
            { label: "Entwicklung", wert: "500.000 €", color: "bg-primary/20" },
          ].map((p, i) => (
            <div key={i} className={`${p.color} border border-primary/10 rounded-xl p-6 text-center`}>
              <p className="text-sm text-muted-foreground">{p.label}</p>
              <p className="text-2xl font-bold text-primary mt-2">{p.wert}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-foreground font-bold text-lg mt-8 italic">
          Und Du fragst Dich, was eine 12-monatige Mitgliedschaft kosten soll?
        </p>
      </section>

      {/* ─── ERFOLGE ─── */}
      <section className="bg-muted/50 px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">Konkrete Erfolge durch <span className="text-primary">IMONDU</span></h2>
          <p className="text-sm text-muted-foreground mt-2">Ergebnisse, die für sich sprechen.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6">
            <Badge className="bg-primary/10 text-primary border-0 mb-3">Architekt aus NRW</Badge>
            <p className="text-foreground font-bold text-lg">3 Anfragen in 4 Wochen</p>
            <p className="text-sm text-muted-foreground mt-1">1 Projekt beauftragt</p>
            <p className="text-primary font-bold text-xl mt-2">Honorarvolumen: 26.780 €</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <Badge className="bg-primary/10 text-primary border-0 mb-3">Projektentwickler aus München</Badge>
            <p className="text-foreground font-bold text-lg">Zugang zu Eigentümer mit MFH</p>
            <p className="text-sm text-muted-foreground mt-1">Gemeinschaftsprojekt</p>
            <p className="text-primary font-bold text-xl mt-2">Reduzierte Kapitalbindung</p>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="px-8 py-16">
        <div className="text-center mb-3">
          <h2 className="text-3xl font-bold text-foreground">Zwei Wege. Ein Ziel:</h2>
          <p className="text-xl font-bold text-primary mt-1">Mehr qualifizierte Projekte.</p>
          <p className="text-sm text-muted-foreground mt-2">Ein einziges Projekt kann Deine Investition mehrfach amortisieren.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-8">
          {/* Basis */}
          <div className="rounded-xl border-2 border-border bg-card p-6">
            <p className="text-lg font-bold text-foreground">Basis-Mitgliedschaft</p>
            <p className="text-xs text-muted-foreground">12 Monate</p>
            <p className="text-3xl font-bold text-foreground mt-3">899 €<span className="text-sm font-normal text-muted-foreground"> /Jahr</span></p>
            <p className="text-[10px] text-muted-foreground">exkl. 19% MwSt. | nur {(899/365).toFixed(2).replace(".", ",")} €/Tag</p>
            <hr className="border-border my-4" />
            <ul className="space-y-2.5">
              {[
                "Unbegrenzte Kontaktanfragen",
                "Verifiziertes Profil",
                "Sichtbarkeit bei Eigentümern",
                "12 Monate Mitgliedschaft",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-xs text-foreground"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />{t}</li>
              ))}
            </ul>
            <Button className="w-full mt-5" variant="outline" asChild>
              <a href="/entwickler-registrieren">Direkt starten</a>
            </Button>
          </div>

          {/* Premium */}
          <div className="rounded-xl border-2 border-primary bg-primary/5 p-6 relative">
            <div className="absolute -top-3 right-4">
              <Badge className="gradient-brand text-primary-foreground text-[10px] border-0">Empfohlen</Badge>
            </div>
            <p className="text-lg font-bold text-foreground">Premium-Mitgliedschaft</p>
            <p className="text-xs text-muted-foreground">12 Monate</p>
            <div className="mt-3">
              {hasPremiumDiscount ? (
                <>
                  <p className="text-sm text-muted-foreground line-through">{formatPreis(premiumOriginal)}</p>
                  <p className="text-3xl font-bold text-primary">{formatPreis(premiumFinal)}<span className="text-sm font-normal"> /Jahr</span></p>
                  <p className="text-[10px] text-primary font-medium">-{rabattProzent}% Rabatt</p>
                </>
              ) : (
                <p className="text-3xl font-bold text-foreground">1.249 €<span className="text-sm font-normal text-muted-foreground"> /Jahr</span></p>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">exkl. 19% MwSt. | nur {(1249/365).toFixed(2).replace(".", ",")} €/Tag</p>
            <hr className="border-border my-4" />
            <ul className="space-y-2.5">
              {[
                "Alle Basis-Vorteile",
                "Frühzeitiger Zugang zu neuen Anfragen",
                "Frühzeitige Platzierung bei limitierten Kontakten",
                "Premium-Badge für mehr Vertrauen",
                "Performance-Statistiken & Conversion-Insights",
                "Priorisierter Support",
                "Hervorgehobene Platzierung in Deiner Region",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-xs text-foreground font-medium"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />{t}</li>
              ))}
            </ul>
            <p className="text-[10px] text-destructive font-medium mt-3">* Begrenzte Branchenplätze je Region</p>
            <Button className="w-full mt-4 gradient-brand border-0 text-primary-foreground" asChild>
              <a href="/entwickler-registrieren">Jetzt Premium starten</a>
            </Button>
          </div>
        </div>
        {hasPremiumDiscount && (
          <p className="text-[10px] text-muted-foreground text-center mt-4">* Rabatt gilt nur für das erste Vertragsjahr.</p>
        )}
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-muted/50 px-8 py-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">Häufig gestellte Fragen</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {[
              { q: "Welche Vorteile bietet mir eine Partnerschaft mit IMONDU?", a: "Auf IMONDU werden Sie zuverlässig mit qualifizierten Immobilien-Leads versorgt und sparen sich hohe Kosten für eigenes Marketing. Ohne Akquise, ohne Ankaufskosten und im direkten Kontakt zu Eigentümern." },
              { q: "Wie funktioniert Immobilienentwicklung ohne Ankaufskosten?", a: "Durch die Zusammenarbeit mit IMONDU bringen Sie Ihre Expertise direkt in die Projektentwicklung ein. Ein Kauf oder eine Finanzierung der Immobilie ist nicht nötig." },
              { q: "Welche Kosten entstehen für Entwickler?", a: "Als Mitglied erhalten Sie unbegrenzte Kontaktanfragen für einen jährlichen Beitrag ab 899 € (Basis) oder 1.249 € (Premium)." },
            ].map((f, i) => (
              <AccordionItem key={i} value={`faq${i}`} className="bg-card border border-border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── BERATER CTA ─── */}
      <BeraterCTA name={beraterName} titel={beraterTitel} telefon={beraterTelefon} email={beraterEmail} adresse={beraterAdresse} />

      {/* ─── NOCH FRAGEN ─── */}
      <section className="px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-foreground">Noch Fragen?</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">Kontaktieren Sie uns gerne – wir beraten Sie persönlich.</p>
        <div className="flex justify-center gap-3 mt-4">
          <Button variant="outline" asChild><a href={`tel:${beraterTelefon}`}><Phone className="mr-2 h-4 w-4" /> Beratungsgespräch</a></Button>
          <Button variant="outline" asChild><a href={`mailto:${beraterEmail}`}><Mail className="mr-2 h-4 w-4" /> E-Mail Kontakt</a></Button>
        </div>
      </section>

      {/* ─── ZWEI WEGE. EINE ENTSCHEIDUNG. ─── */}
      <section className="px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Zwei Wege. <span className="text-primary">Eine Entscheidung.</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-card border-2 border-primary rounded-xl p-8 text-center">
            <div className="h-14 w-14 rounded-full gradient-brand flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ArrowRight className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Direkt starten</h3>
            <p className="text-sm text-muted-foreground mt-2">12 Monate Mitgliedschaft*</p>
            <Button className="w-full mt-6 gradient-brand border-0 text-primary-foreground" size="lg" asChild>
              <a href="/entwickler-registrieren">Jetzt registrieren</a>
            </Button>
            <p className="text-[10px] text-muted-foreground mt-3">* Begrenzte Branchenplätze je Region</p>
          </div>
          <div className="bg-card border-2 border-border rounded-xl p-8 text-center">
            <div className="h-14 w-14 rounded-full bg-foreground flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Phone className="h-7 w-7 text-background" />
            </div>
            <h3 className="text-xl font-bold text-foreground">30-Minuten Beratungsgespräch</h3>
            <p className="text-sm text-muted-foreground mt-2">Persönlich, unverbindlich, kostenfrei</p>
            <Button className="w-full mt-6" variant="outline" size="lg" asChild>
              <a href={`tel:${beraterTelefon}`}>Jetzt vereinbaren</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="gradient-brand px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-white">
          Du kannst weiter akquirieren.<br />Oder Du wirst <span className="underline decoration-white/50">gefunden.</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-6 mt-6 text-white/80 text-sm">
          <span>✓ 12 Monate Mitgliedschaft</span>
          <span>✓ Sofortige Profilfreischaltung</span>
          <span>✓ Sichtbarkeit bei Eigentümern</span>
          <span>✓ Unbegrenzte Kontaktanfragen</span>
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <Button size="lg" className="bg-white text-foreground hover:bg-white/90 text-base px-10 py-6 shadow-xl font-bold" asChild>
            <a href="/entwickler-registrieren">Direkt starten <ArrowRight className="ml-2 h-5 w-5" /></a>
          </Button>
          <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8 py-6" asChild>
            <a href={`tel:${beraterTelefon}`}><Phone className="mr-2 h-4 w-4" /> 30-Min Beratung</a>
          </Button>
        </div>
      </section>

      {/* ─── APP ─── */}
      <section className="bg-muted/50 px-8 py-10 text-center">
        <h2 className="text-xl font-bold text-foreground">Demnächst auch als App</h2>
        <div className="flex justify-center gap-3 mt-4">
          <div className="bg-foreground text-background rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium"><Smartphone className="h-4 w-4" /> App Store</div>
          <div className="bg-foreground text-background rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium"><Smartphone className="h-4 w-4" /> Google Play</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background px-8 py-6 text-center">
        <img src={imonduLogoDark} alt="IMONDU" className="h-6 mx-auto opacity-50 invert" />
        <p className="text-xs opacity-40 mt-3">© {new Date().getFullYear()} IMONDU GmbH. Alle Rechte vorbehalten. | www.imondu.com</p>
      </footer>
    </div>
  );
}

/* ─── Berater CTA Block (shared) ─── */
function BeraterCTA({ name, titel, telefon, email, adresse }: {
  name: string; titel: string; telefon: string; email: string; adresse: string;
}) {
  return (
    <section className="px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-foreground text-background px-6 py-4 rounded-t-xl relative">
          <p className="text-sm font-bold leading-snug">
            HI, ICH BIN <span className="text-primary">{name.split(" ")[0]?.toUpperCase()}</span>, DEIN
            <br />PERSÖNLICHER BERATER.
          </p>
          <div className="absolute -bottom-3 left-12 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-foreground" />
        </div>
        <div className="gradient-brand p-6 flex items-center gap-6 rounded-b-xl">
          <div className="h-24 w-24 rounded-lg bg-white/20 flex items-center justify-center shrink-0 border-4 border-white/30">
            <User className="h-10 w-10 text-white/70" />
          </div>
          <div className="text-white space-y-1">
            <h3 className="text-xl font-bold uppercase tracking-wide">{name}</h3>
            <p className="text-sm italic opacity-90">{titel}</p>
            <div className="mt-3 space-y-0.5">
              <p className="text-xs font-bold uppercase tracking-wider">IMONDU</p>
              <div className="w-6 h-px bg-white/50 mt-1 mb-1" />
              <p className="text-xs opacity-80">{adresse}</p>
              <p className="text-xs opacity-80">Tel. {telefon}</p>
              <p className="text-xs opacity-80">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function BeraterMicroseite() {
  const { toast } = useToast();
  const { currentRoleId } = useUserRole();
  const isAdmin = currentRoleId === "admin";

  const [beraterName, setBeraterName] = useState("Max Müller");
  const [beraterTitel, setBeraterTitel] = useState("Immobilienberater");
  const [beraterTelefon, setBeraterTelefon] = useState("+49 170 1234567");
  const [beraterEmail, setBeraterEmail] = useState("max.mueller@imondu.de");
  const [beraterAdresse, setBeraterAdresse] = useState("Musterstr. 1, 12345 Musterstadt");
  const [activeTab, setActiveTab] = useState("customer");
  const [rabattCodes, setRabattCodes] = useState<RabattCode[]>(INITIAL_CODES);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newCodeType, setNewCodeType] = useState<"developer" | "customer">("developer");
  const [newCodeRabatt, setNewCodeRabatt] = useState(25);
  const [newCodeMitarbeiter, setNewCodeMitarbeiter] = useState("");
  const [mitarbeiterFilter, setMitarbeiterFilter] = useState("alle");
  const [editCodeId, setEditCodeId] = useState<string | null>(null);

  const myDevCodes = rabattCodes.filter(rc => rc.type === "developer");
  const myCusCodes = rabattCodes.filter(rc => rc.type === "customer");

  const openEditCode = (rc: RabattCode) => {
    setEditCodeId(rc.id);
    setNewCode(rc.code);
    setNewCodeType(rc.type);
    setNewCodeRabatt(rc.rabattProzent);
    setNewCodeMitarbeiter(rc.mitarbeiterId || "");
    setShowAddDialog(true);
  };

  const totalNutzungen = rabattCodes.reduce((s, c) => s + c.nutzungen, 0);
  const totalZahlend = rabattCodes.reduce((s, c) => s + c.zahlend, 0);
  const totalPromo = rabattCodes.reduce((s, c) => s + c.promo, 0);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Link kopiert!", description: url });
  };

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  };

  const addRabattCode = () => {
    const code = newCode || generateCode();
    if (editCodeId) {
      setRabattCodes(prev => prev.map(rc => rc.id === editCodeId ? { ...rc, code, type: newCodeType, rabattProzent: newCodeRabatt, mitarbeiterId: newCodeMitarbeiter || undefined } : rc));
      toast({ title: "Rabattcode aktualisiert", description: `Code: ${code} (${newCodeRabatt}% Rabatt)` });
    } else {
      setRabattCodes(prev => [...prev, { id: Date.now().toString(), code, type: newCodeType, rabattProzent: newCodeRabatt, nutzungen: 0, zahlend: 0, promo: 0, mitarbeiterId: newCodeMitarbeiter || undefined }]);
      toast({ title: "Rabattcode erstellt", description: `Code: ${code} (${newCodeRabatt}% Rabatt)` });
    }
    setNewCode(""); setNewCodeRabatt(25); setNewCodeMitarbeiter(""); setEditCodeId(null); setShowAddDialog(false);
  };

  const deleteRabattCode = (id: string) => {
    setRabattCodes(prev => prev.filter(c => c.id !== id));
    toast({ title: "Rabattcode gelöscht" });
  };

  const getAffiliateUrl = (rc: RabattCode) =>
    rc.type === "customer" ? `https://imondu.com/customer?code=${rc.code}` : `https://imondu.com/developer?code=${rc.code}`;

  const previewDevCode = myDevCodes[0]?.code;
  const previewCusCode = myCusCodes[0]?.code;

  const getLandingUrl = (type: "developer" | "customer", code?: string) =>
    type === "developer" ? `https://imondu.com/developer${code ? `?code=${code}` : ""}` : `https://imondu.com/customer${code ? `?code=${code}` : ""}`;

  return (
    <CRMLayout>
      <div className="p-6 space-y-6 min-h-screen dashboard-mesh-bg">
        <div className="flex items-center gap-2">
          <div className="w-1 h-10 bg-accent rounded-full" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Berater-Microseite</h1>
            <p className="text-sm text-muted-foreground">Verwalte deine personalisierten Landingpages und Rabattcodes</p>
          </div>
        </div>

        {/* Personalization */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-accent rounded-full" />
              <h2 className="font-semibold text-foreground">Personalisierung</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Passe deine persönlichen Berater-Daten an.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium text-foreground mb-1 block">Name</label><Input value={beraterName} onChange={(e) => setBeraterName(e.target.value)} /></div>
                  <div><label className="text-sm font-medium text-foreground mb-1 block">Titel / Position</label><Input value={beraterTitel} onChange={(e) => setBeraterTitel(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium text-foreground mb-1 block">Telefon</label><Input value={beraterTelefon} onChange={(e) => setBeraterTelefon(e.target.value)} /></div>
                  <div><label className="text-sm font-medium text-foreground mb-1 block">E-Mail</label><Input value={beraterEmail} onChange={(e) => setBeraterEmail(e.target.value)} /></div>
                </div>
                <div><label className="text-sm font-medium text-foreground mb-1 block">Adresse</label><Input value={beraterAdresse} onChange={(e) => setBeraterAdresse(e.target.value)} /></div>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-border self-start">
                <div className="bg-foreground text-background px-5 py-3 relative">
                  <p className="text-xs font-bold leading-snug">HI, ICH BIN <span className="text-primary">{beraterName.split(" ")[0]?.toUpperCase()}</span>, DEIN<br />PERSÖNLICHER BERATER.</p>
                  <div className="absolute -bottom-3 left-10 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-foreground" />
                </div>
                <div className="gradient-brand p-5 flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg bg-white/20 flex items-center justify-center shrink-0 border-3 border-white/30"><User className="h-8 w-8 text-white/70" /></div>
                  <div className="text-white space-y-0.5">
                    <h3 className="text-base font-bold uppercase tracking-wide">{beraterName}</h3>
                    <p className="text-xs italic opacity-90">{beraterTitel}</p>
                    <div className="mt-2 space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider">IMONDU</p>
                      <div className="w-4 h-px bg-white/50" />
                      <p className="text-[10px] opacity-80">{beraterAdresse}</p>
                      <p className="text-[10px] opacity-80">Tel. {beraterTelefon}</p>
                      <p className="text-[10px] opacity-80">{beraterEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rabattcodes */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2"><div className="w-8 h-1 bg-accent rounded-full" /><h2 className="font-semibold text-foreground">Rabattcodes & Affiliate-Links</h2></div>
              <p className="text-sm text-muted-foreground mt-1">{isAdmin ? "Admin: Codes verwalten und nach Mitarbeiter filtern." : "Deine zugewiesenen Rabattcodes."}</p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <>
                  <Select value={mitarbeiterFilter} onValueChange={setMitarbeiterFilter}>
                    <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue placeholder="Alle Mitarbeiter" /></SelectTrigger>
                    <SelectContent><SelectItem value="alle">Alle Mitarbeiter</SelectItem>{MITARBEITER_LISTE.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button size="sm" onClick={() => { setEditCodeId(null); setNewCode(""); setNewCodeRabatt(25); setNewCodeMitarbeiter(""); setShowAddDialog(true); }}><Plus className="h-4 w-4 mr-1.5" /> Neuen Code</Button>
                </>
              )}
            </div>
          </div>
          <div className="p-6 grid grid-cols-3 gap-4">
            {[{ l: "Gesamt-Nutzungen", v: totalNutzungen }, { l: "Zahlend", v: totalZahlend }, { l: "Promo", v: totalPromo }].map((k) => (
              <div key={k.l} className="border border-border rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">{k.l}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{k.v}</p>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6 space-y-2">
            {rabattCodes.filter(rc => mitarbeiterFilter === "alle" || rc.mitarbeiterId === mitarbeiterFilter).map((rc) => {
              const url = getAffiliateUrl(rc);
              const isExpanded = expandedCode === rc.id;
              const mitarbeiter = MITARBEITER_LISTE.find(m => m.id === rc.mitarbeiterId);
              return (
                <div key={rc.id} className="border border-border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setExpandedCode(isExpanded ? null : rc.id)}>
                    <div className="flex items-center gap-3">
                      <Badge className={`text-[10px] font-bold shrink-0 ${rc.rabattProzent === 100 ? "bg-destructive text-destructive-foreground" : rc.rabattProzent >= 50 ? "bg-warning text-warning-foreground" : rc.rabattProzent > 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{rc.rabattProzent}%</Badge>
                      <span className="font-bold text-foreground">{rc.code}</span>
                      <Badge variant="outline" className="text-xs">{rc.type === "customer" ? "Eigentümer" : "Entwickler"}</Badge>
                      {mitarbeiter && <span className="text-[11px] text-muted-foreground hidden lg:inline">({mitarbeiter.name})</span>}
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); copyToClipboard(url); }}><Copy className="h-3.5 w-3.5" /></Button>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-3 pt-1 border-t border-border">
                      <code className="text-xs text-primary block mb-2">{url}</code>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-6 text-sm">
                          <span className="text-muted-foreground">Nutzungen: <span className="font-medium text-foreground">{rc.nutzungen}</span></span>
                          <span className="text-muted-foreground">Zahlend: <span className="font-medium text-foreground">{rc.zahlend}</span></span>
                          <span className="text-muted-foreground">Promo: <span className="font-medium text-foreground">{rc.promo}</span></span>
                        </div>
                        {isAdmin && (
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditCode(rc)}><Pencil className="h-3.5 w-3.5 mr-1" /> Bearbeiten</Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteRabattCode(rc.id)}><Trash2 className="h-3.5 w-3.5 mr-1" /> Löschen</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Landing Page Preview */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2"><div className="w-8 h-1 bg-primary rounded-full" /><h2 className="font-semibold text-foreground">Landingpage-Vorschau</h2></div>
            <p className="text-sm text-muted-foreground mt-1">Verkaufspsychologisch optimierte Landingpages mit automatischen Rabattcodes.</p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 pt-4 flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="customer" className="gap-2"><Home className="h-4 w-4" /> Eigentümer</TabsTrigger>
                <TabsTrigger value="developer" className="gap-2"><Building2 className="h-4 w-4" /> Entwickler</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(getLandingUrl(activeTab as any, activeTab === "customer" ? previewCusCode : previewDevCode))}><Copy className="h-3.5 w-3.5 mr-1.5" /> Link kopieren</Button>
                <Button variant="outline" size="sm" asChild><a href={getLandingUrl(activeTab as any, activeTab === "customer" ? previewCusCode : previewDevCode)} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Öffnen</a></Button>
              </div>
            </div>
            <div className="px-6 py-3"><code className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded block">{getLandingUrl(activeTab as any, activeTab === "customer" ? previewCusCode : previewDevCode)}</code></div>
            <TabsContent value="customer" className="mt-0"><CustomerLandingPreview beraterName={beraterName} beraterTitel={beraterTitel} beraterTelefon={beraterTelefon} beraterEmail={beraterEmail} beraterAdresse={beraterAdresse} rabattCode={previewCusCode} /></TabsContent>
            <TabsContent value="developer" className="mt-0"><DeveloperLandingPreview beraterName={beraterName} beraterTitel={beraterTitel} beraterTelefon={beraterTelefon} beraterEmail={beraterEmail} beraterAdresse={beraterAdresse} rabattCode={previewDevCode} /></TabsContent>
          </Tabs>
        </div>

        {/* Admin Dialog */}
        {isAdmin && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogContent>
              <DialogHeader><DialogTitle>{editCodeId ? "Rabattcode bearbeiten" : "Neuen Rabattcode anlegen"}</DialogTitle></DialogHeader>
              <div className="space-y-4 py-2">
                <div><label className="text-sm font-medium text-foreground mb-1 block">Code</label><Input value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} placeholder="z.B. X7K2" maxLength={6} /></div>
                <div><label className="text-sm font-medium text-foreground mb-1 block">Typ</label>
                  <Select value={newCodeType} onValueChange={(v) => setNewCodeType(v as any)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="developer">Entwickler</SelectItem><SelectItem value="customer">Eigentümer</SelectItem></SelectContent></Select>
                </div>
                <div><label className="text-sm font-medium text-foreground mb-1 block">Rabatt</label>
                  <div className="flex flex-wrap gap-2">{RABATT_OPTIONEN.map((p) => (<button key={p} type="button" onClick={() => setNewCodeRabatt(p)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${newCodeRabatt === p ? "bg-primary text-primary-foreground ring-2 ring-ring ring-offset-1" : "bg-muted text-muted-foreground"}`}>{p}%</button>))}</div>
                </div>
                <div><label className="text-sm font-medium text-foreground mb-1 block">Mitarbeiter</label>
                  <Select value={newCodeMitarbeiter} onValueChange={setNewCodeMitarbeiter}><SelectTrigger><SelectValue placeholder="Wählen…" /></SelectTrigger><SelectContent>{MITARBEITER_LISTE.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent></Select>
                </div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setShowAddDialog(false)}>Abbrechen</Button><Button onClick={addRabattCode}>{editCodeId ? "Speichern" : "Erstellen"}</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </CRMLayout>
  );
}
