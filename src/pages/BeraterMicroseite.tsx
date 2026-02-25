import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy, ExternalLink, User, Building2, Home, Plus, ChevronDown, ChevronUp,
  Trash2, CheckCircle, TrendingUp, Users, Shield, Briefcase, Phone, Mail,
  Star, ArrowRight, Smartphone, Pencil, CheckCircle2, CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import imonduLogo from "@/assets/imondu-logo-full.png";
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

/* ─── Eigentümer Landing Page ─── */
function CustomerLandingPreview({ beraterName, beraterTitel, beraterTelefon, beraterEmail, beraterAdresse }: {
  beraterName: string; beraterTitel: string; beraterTelefon: string; beraterEmail: string; beraterAdresse: string;
}) {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="bg-gradient-to-br from-background to-muted px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground leading-tight">
          Machen Sie aus Ihrer<br />Immobilie ein <span className="text-primary font-extrabold">Vermögen.</span>
        </h1>
        <p className="text-lg text-muted-foreground mt-4">
          Auf <strong>IMONDU</strong> – Deutschlands führende Plattform für Immobilienentwicklung.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: Users, title: "Voller Zugriff auf", sub: "zertifizierte Entwickler" },
            { icon: Home, title: "Immobilie aufwerten", sub: "ohne finanzielle Vorleistung" },
            { icon: TrendingUp, title: "Wertsteigerung Ihrer", sub: "Immobilie" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Immobilienwert CTA */}
      <section className="bg-primary/5 border-y border-border px-8 py-10 text-center">
        <h2 className="text-xl font-semibold text-foreground">Ihr Immobilienwert – direkt herausfinden:</h2>
        <Button className="mt-4" size="lg">
          Jetzt Immobilienwert ermitteln <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>

      {/* Mehr Wert Section */}
      <section className="px-8 py-14">
        <h2 className="text-3xl font-bold text-foreground">
          Mehr Wert. Mehr Möglichkeiten. Mehr <span className="text-primary font-extrabold">Lebensqualität.</span>
        </h2>
        <p className="text-base text-muted-foreground mt-4 max-w-3xl">
          Immobilienentwicklung <strong>ohne</strong> Risiko und finanzielle Vorleistung.
        </p>
        <p className="text-sm text-muted-foreground mt-3 max-w-3xl leading-relaxed">
          Immobilienentwicklung bedeutet, eine Immobilie so zu sanieren, umzubauen oder zu modernisieren, dass sie am Ende deutlich an Wert gewinnt.
          Auf <strong>IMONDU</strong> können Eigentümer herausfinden, welches Potenzial wirklich in ihrem Objekt steckt.
        </p>
        <p className="text-sm text-muted-foreground mt-3 max-w-3xl leading-relaxed">
          Egal ob Haus, Wohnung, Grundstück oder Gewerbeimmobilie: Hier verbinden sich Immobilieneigentümer mit erfahrenen Entwicklungspartnern, die Projekte professionell umsetzen und Wertsteigerungen von <strong>bis zu 300 %</strong> ermöglichen.
        </p>
        <Button variant="outline" className="mt-6">
          Jetzt Immobilie inserieren <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>

      {/* Nr. 1 Plattform */}
      <section className="bg-muted/50 px-8 py-14 text-center">
        <h2 className="text-3xl font-bold text-foreground">
          Die <span className="text-primary font-extrabold">Nr. 1 Plattform</span> für Immobilienentwicklung
        </h2>
        <p className="text-sm text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
          Als digitale Vermittlungsplattform verbindet <strong>IMONDU</strong> Immobilieneigentümer mit professionellen Entwicklungspartnern. Einfach anmelden, Immobilie inserieren und Entwicklungspartner auswählen.
        </p>
        <p className="text-base font-semibold text-foreground mt-4">Ihr Projekt. Ihre Entscheidung. Ihr Gewinn.</p>
      </section>

      {/* Steps */}
      <section className="px-8 py-14">
        <h2 className="text-2xl font-bold text-foreground text-center">So einfach steigern Sie den Wert Ihrer Immobilie</h2>
        <p className="text-sm text-muted-foreground text-center mt-2">Kurze Schritte, schnelle Prozesse.</p>
        <div className="grid grid-cols-3 gap-6 mt-8">
          {[
            { step: "1", title: "Registrieren", desc: "Melden Sie sich mit Ihrer E-Mail-Adresse an." },
            { step: "2", title: "Profil erstellen", desc: "Vervollständigen Sie Ihre Daten und veröffentlichen Sie Ihr Profil." },
            { step: "3", title: "Immobilie aufwerten", desc: "Treten Sie in Kontakt mit Immobilienentwicklern und starten Sie die Aufwertung Ihrer Immobilie." },
          ].map((s) => (
            <div key={s.step} className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold">{s.step}</div>
              <h3 className="font-semibold text-foreground mt-4">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Button size="lg">Immobilie inserieren <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/50 px-8 py-14">
        <h2 className="text-2xl font-bold text-foreground text-center mb-6">FAQ – Häufig gestellte Fragen</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="faq1" className="bg-card border border-border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">Wen oder was brauche ich für eine Immobilienentwicklung?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Sie brauchen einen erfahrenen Immobilienentwickler, der Sie und Ihr Projekt von Anfang an begleitet. Er identifiziert die Potenziale Ihrer Immobilie sowie ungenutzte oder suboptimal genutzte Flächen und erstellt ein wertorientiertes Entwicklungskonzept. Diese erfahrenen Entwickler finden Sie auf <strong>IMONDU</strong>.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq2" className="bg-card border border-border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">Welche Kosten kommen bei einer Immobilienentwicklung auf mich zu?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Die Kosten setzen sich aus Planung, Bau und Material zusammen. Wenn Sie planen, Ihre Immobilie nach der Entwicklung zu verkaufen, müssen Sie bei Entwicklern von IMONDU nicht in finanzielle Vorleistung gehen. Sie bezahlen den Immobilienentwickler anteilig aus dem Verkauf der Immobilie.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq3" className="bg-card border border-border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">Was macht IMONDU in der Immobilienentwicklung genau?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                IMONDU ist die führende Plattform für Immobilienentwicklung in Deutschland, bei der Immobilieneigentümer direkten Zugriff auf Immobilienentwickler haben. Auf IMONDU finden Sie den passenden Entwickler für Ihre Immobilie.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Berater CTA */}
      <BeraterCTA name={beraterName} titel={beraterTitel} telefon={beraterTelefon} email={beraterEmail} adresse={beraterAdresse} />

      {/* Noch Fragen */}
      <section className="px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-foreground">Noch Fragen?</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
          Sie möchten mehr Informationen über <strong>IMONDU</strong> und die vielen Möglichkeiten der Immobilienentwicklung erfahren? Dann kontaktieren Sie uns gerne.
        </p>
        <p className="font-semibold text-foreground mt-3">Wir beraten Sie gerne.</p>
        <div className="flex justify-center gap-3 mt-4">
          <Button variant="outline" asChild><a href={`tel:${beraterTelefon}`}><Phone className="mr-2 h-4 w-4" /> Beratungsgespräch</a></Button>
          <Button variant="outline" asChild><a href={`mailto:${beraterEmail}`}><Mail className="mr-2 h-4 w-4" /> E-Mail Kontakt</a></Button>
        </div>
      </section>

      {/* App */}
      <section className="bg-muted/50 px-8 py-10 text-center">
        <h2 className="text-xl font-bold text-foreground">Demnächst auch als App</h2>
        <p className="text-sm text-muted-foreground mt-1">Für noch schnelleren Zugriff unterwegs.</p>
        <div className="flex justify-center gap-3 mt-4">
          <div className="bg-foreground text-background rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium">
            <Smartphone className="h-4 w-4" /> App Store
          </div>
          <div className="bg-foreground text-background rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium">
            <Smartphone className="h-4 w-4" /> Google Play
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Entwickler Landing Page ─── */
function DeveloperLandingPreview({ beraterName, beraterTitel, beraterTelefon, beraterEmail, beraterAdresse, rabattCode }: {
  beraterName: string; beraterTitel: string; beraterTelefon: string; beraterEmail: string; beraterAdresse: string; rabattCode?: string;
}) {
  const rabattProzent = rabattCode ? (INITIAL_CODES.find(c => c.code === rabattCode)?.rabattProzent ?? 0) : 0;
  const premiumOriginal = PREISE.premium;
  const premiumFinal = premiumOriginal - (premiumOriginal * rabattProzent / 100);
  const hasPremiumDiscount = rabattProzent > 0;

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="bg-gradient-to-br from-background to-muted px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground leading-tight">
          Gewinnen Sie <span className="text-primary font-extrabold">neue Kunden</span><br />für Ihre Immobilienentwicklung!
        </h1>
        <p className="text-lg text-muted-foreground mt-4">
          Auf <strong>IMONDU</strong> – Deutschlands größte Plattform für Immobilienentwicklung.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: Home, title: "Projektentwicklung", sub: "ohne Ankaufskosten" },
            { icon: Users, title: "Zugriff auf bundesweite", sub: "Immobilienleads" },
            { icon: Briefcase, title: "Digitales", sub: "Projektmanagement" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leads CTA */}
      <section className="bg-primary/5 border-y border-border px-8 py-10 text-center">
        <h2 className="text-xl font-semibold text-foreground">Entwicklungsprojekte in Ihrer Nähe:</h2>
        <Button className="mt-4" size="lg" asChild>
          <a href="/entwickler-registrieren">Jetzt Immobilien-Leads finden <ArrowRight className="ml-2 h-4 w-4" /></a>
        </Button>
      </section>

      {/* Mehr Projekte */}
      <section className="px-8 py-14">
        <h2 className="text-3xl font-bold text-foreground">
          Mehr Projekte. Mehr Kunden. Mehr <span className="text-primary font-extrabold">Gewinn.</span>
        </h2>
        <p className="text-base text-muted-foreground mt-4 max-w-3xl">
          Ihre <strong>Immobilien-Leads</strong> sind nur einen Klick entfernt!
        </p>
        <p className="text-sm text-muted-foreground mt-3 max-w-3xl leading-relaxed">
          Sie sind Bauträger, Architekt, Projektentwickler oder Handwerker mit Erfahrung in Immobilienentwicklung? Dann bekommen Sie auf <strong>IMONDU</strong> Zugang zu zahlreichen <strong>Immobilien-Leads in Ihrer Nähe!</strong>
        </p>
        <p className="text-sm text-muted-foreground mt-3 max-w-3xl leading-relaxed">
          Ohne Akquise, ohne Ankaufskosten und im direkten Kontakt zu Immobilieneigentümern – für mehr Neukundengeschäft und mehr Gewinn. Effizient, digital und mit minimalem Aufwand.
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <a href="/entwickler-registrieren">Jetzt registrieren <ArrowRight className="ml-2 h-4 w-4" /></a>
        </Button>
      </section>

      {/* Mitgliedschaft / Preise */}
      <section className="bg-muted/50 px-8 py-14">
        <h2 className="text-2xl font-bold text-foreground text-center mb-2">Unsere Mitgliedschaften</h2>
        <p className="text-sm text-muted-foreground text-center mb-8">Wählen Sie den passenden Plan für Ihr Unternehmen.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Basis */}
          <div className="rounded-xl border-2 border-border bg-card p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-lg font-bold text-foreground">Basis</p>
                <p className="text-xs text-muted-foreground">Laufzeit 12 Monate</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-foreground">{formatPreis(PREISE.basis)}</p>
                <p className="text-[10px] text-muted-foreground">pro Jahr, exkl. 19% MwSt.</p>
              </div>
            </div>
            <hr className="border-border my-3" />
            <ul className="space-y-2">
              {[
                "Unbegrenzte Kontaktanfragen",
                "Identitätsprüfung",
                "Support durch IMONDU",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-xs text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </ul>
            <Button className="w-full mt-4" variant="outline" asChild>
              <a href="/entwickler-registrieren">Jetzt registrieren</a>
            </Button>
          </div>

          {/* Premium */}
          <div className="rounded-xl border-2 border-primary bg-primary/5 p-6 relative">
            <div className="absolute -top-3 right-4">
              <Badge className="gradient-brand text-primary-foreground text-[10px] border-0">Empfohlen</Badge>
            </div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-lg font-bold text-foreground">Premium<sup className="text-primary">+</sup></p>
                <p className="text-xs text-muted-foreground">Laufzeit 12 Monate</p>
              </div>
              <div className="text-right">
                {hasPremiumDiscount ? (
                  <>
                    <p className="text-sm text-muted-foreground line-through">{formatPreis(premiumOriginal)}</p>
                    <p className="text-xl font-bold text-primary">{formatPreis(premiumFinal)}</p>
                    <p className="text-[10px] text-primary font-medium">-{rabattProzent}% Rabatt</p>
                  </>
                ) : (
                  <p className="text-xl font-bold text-foreground">{formatPreis(premiumOriginal)}</p>
                )}
                <p className="text-[10px] text-muted-foreground">pro Jahr, exkl. 19% MwSt.</p>
              </div>
            </div>
            <hr className="border-border my-3" />
            <ul className="space-y-2">
              {[
                "Alle Basis-Vorteile",
                "Frühzeitiger Zugang zu Leads",
                "Premium-Badge",
                "Priorisierte Platzierung",
                "Performance-Statistiken",
                "Priorisierter Support",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-xs text-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </ul>
            <Button className="w-full mt-4 gradient-brand border-0 text-primary-foreground" asChild>
              <a href="/entwickler-registrieren">Jetzt registrieren</a>
            </Button>
          </div>
        </div>
        {hasPremiumDiscount && (
          <p className="text-[10px] text-muted-foreground text-center mt-4">
            * Rabatt gilt nur für das erste Vertragsjahr. Bei automatischer Verlängerung wird der reguläre Preis berechnet.
          </p>
        )}
      </section>

      {/* Marktpotenzial */}
      <section className="bg-primary/5 border-y border-border px-8 py-12">
        <h2 className="text-2xl font-bold text-foreground text-center">
          Marktpotenzial auf <span className="text-primary font-extrabold">IMONDU</span>
        </h2>
        <div className="grid grid-cols-3 gap-6 mt-8">
          {[
            { value: "6,61 Mio.", label: "Immobilien-Besitzer in Deutschland" },
            { value: "75 %", label: "aller Immobilien sind entwickelbar" },
            { value: "250.000", label: "neue Besucher pro Monat" },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 text-center">
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nr. 1 Plattform */}
      <section className="px-8 py-14 text-center">
        <h2 className="text-3xl font-bold text-foreground">
          Die <span className="text-primary font-extrabold">Nr. 1 Plattform</span> für Immobilienentwicklung
        </h2>
        <p className="text-sm text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
          Als digitale Vermittlungsplattform verbindet <strong>IMONDU</strong> Projektentwickler mit potenziellen Immobilieneigentümern. Hier entsteht direkter Kontakt zu Eigentümern und ihren Immobilien.
        </p>
        <p className="text-base font-semibold text-foreground mt-4">Digital. Unkompliziert. Gewinnbringend.</p>
      </section>

      {/* Steps */}
      <section className="bg-muted/50 px-8 py-14">
        <h2 className="text-2xl font-bold text-foreground text-center">So einfach kommen Sie zu Ihren Immobilien-Leads</h2>
        <p className="text-sm text-muted-foreground text-center mt-2">Kurze Schritte, schnelle Prozesse.</p>
        <div className="grid grid-cols-3 gap-6 mt-8">
          {[
            { step: "1", title: "Registrieren", desc: "Melden Sie sich mit Ihrer E-Mail-Adresse an." },
            { step: "2", title: "Profil erstellen", desc: "Vervollständigen Sie Ihre Daten und veröffentlichen Sie Ihr Profil." },
            { step: "3", title: "Leads erhalten", desc: "Entdecken Sie bundesweite Leads und treten Sie in Kontakt mit Immobilieneigentümern." },
          ].map((s) => (
            <div key={s.step} className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold">{s.step}</div>
              <h3 className="font-semibold text-foreground mt-4">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Button size="lg" asChild>
            <a href="/entwickler-registrieren">Jetzt registrieren <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-8 py-14">
        <h2 className="text-2xl font-bold text-foreground text-center mb-6">FAQ – Häufig gestellte Fragen</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="faq1" className="bg-card border border-border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">Welche Vorteile bietet mir eine Partnerschaft mit IMONDU?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Auf <strong>IMONDU</strong> werden Sie zuverlässig mit qualifizierten, hochwertigen Immobilien-Leads versorgt und sparen sich hohe Kosten für eigenes Marketing. Ohne Akquise, ohne Ankaufskosten und im direkten Kontakt zu Immobilieneigentümern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq2" className="bg-card border border-border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">Wie funktioniert Immobilienentwicklung ohne Ankaufskosten?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Durch die Zusammenarbeit mit <strong>IMONDU</strong> bringen Sie Ihre Expertise direkt in die Projektentwicklung ein. Ein Kauf oder eine Finanzierung der Immobilie ist nicht nötig. Beim Verkauf wird der Gewinn gemäß vertraglicher Regelung aufgeteilt.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq3" className="bg-card border border-border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">Welche Kosten entstehen für Immobilienentwickler?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Als Mitglied im <strong>IMONDU</strong>-Netzwerk erhalten Sie eine unbegrenzte Anzahl an Immobilien-Leads. Dafür erhebt IMONDU einen jährlichen Beitrag, den Sie zwischen drei Varianten (Basis, Premium, Premium Plus) wählen können.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Berater CTA */}
      <BeraterCTA name={beraterName} titel={beraterTitel} telefon={beraterTelefon} email={beraterEmail} adresse={beraterAdresse} />

      {/* Noch Fragen */}
      <section className="bg-muted/50 px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-foreground">Noch Fragen?</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
          Sie möchten mehr Informationen über <strong>IMONDU</strong> und die vielen Möglichkeiten erfahren? Kontaktieren Sie uns gerne.
        </p>
        <p className="font-semibold text-foreground mt-3">Wir beraten Sie gerne.</p>
        <div className="flex justify-center gap-3 mt-4">
          <Button variant="outline" asChild><a href={`tel:${beraterTelefon}`}><Phone className="mr-2 h-4 w-4" /> Beratungsgespräch</a></Button>
          <Button variant="outline" asChild><a href={`mailto:${beraterEmail}`}><Mail className="mr-2 h-4 w-4" /> E-Mail Kontakt</a></Button>
        </div>
      </section>

      {/* App */}
      <section className="px-8 py-10 text-center">
        <h2 className="text-xl font-bold text-foreground">Demnächst auch als App</h2>
        <p className="text-sm text-muted-foreground mt-1">Für noch schnelleren Zugriff unterwegs.</p>
        <div className="flex justify-center gap-3 mt-4">
          <div className="bg-foreground text-background rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium">
            <Smartphone className="h-4 w-4" /> App Store
          </div>
          <div className="bg-foreground text-background rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium">
            <Smartphone className="h-4 w-4" /> Google Play
          </div>
        </div>
      </section>
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
        {/* Speech bubble */}
        <div className="bg-foreground text-background px-6 py-4 rounded-t-xl relative">
          <p className="text-sm font-bold leading-snug">
            HI, ICH BIN <span className="text-primary">{name.split(" ")[0]?.toUpperCase()}</span>, DEIN
            <br />PERSÖNLICHER BERATER.
          </p>
          <div className="absolute -bottom-3 left-12 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-foreground" />
        </div>
        {/* Brand card */}
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

/* ─── Main Page ─── */
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

  // Find codes assigned to this user (for non-admin, show their assigned codes as landing page links)
  // For simplicity, assume current user = u2 (Manuel Schilling) for non-admin demo
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
      setRabattCodes(prev => prev.map(rc => rc.id === editCodeId ? {
        ...rc, code, type: newCodeType, rabattProzent: newCodeRabatt, mitarbeiterId: newCodeMitarbeiter || undefined,
      } : rc));
      toast({ title: "Rabattcode aktualisiert", description: `Code: ${code} (${newCodeRabatt}% Rabatt)` });
    } else {
      setRabattCodes(prev => [...prev, {
        id: Date.now().toString(), code, type: newCodeType, rabattProzent: newCodeRabatt,
        nutzungen: 0, zahlend: 0, promo: 0, mitarbeiterId: newCodeMitarbeiter || undefined,
      }]);
      toast({ title: "Rabattcode erstellt", description: `Code: ${code} (${newCodeRabatt}% Rabatt)` });
    }
    setNewCode("");
    setNewCodeRabatt(25);
    setNewCodeMitarbeiter("");
    setEditCodeId(null);
    setShowAddDialog(false);
  };

  const deleteRabattCode = (id: string) => {
    setRabattCodes(prev => prev.filter(c => c.id !== id));
    toast({ title: "Rabattcode gelöscht" });
  };

  const getAffiliateUrl = (rc: RabattCode) =>
    rc.type === "customer"
      ? `https://imondu.com/customer?code=${rc.code}`
      : `https://imondu.com/developer?code=${rc.code}`;

  // For landing page preview, use the first assigned dev/cus code
  const previewDevCode = myDevCodes[0]?.code;
  const previewCusCode = myCusCodes[0]?.code;

  const getLandingUrl = (type: "developer" | "customer", code?: string) =>
    type === "developer"
      ? `https://imondu.com/developer${code ? `?code=${code}` : ""}`
      : `https://imondu.com/customer${code ? `?code=${code}` : ""}`;

  return (
    <CRMLayout>
      <div className="p-6 space-y-6 min-h-screen dashboard-mesh-bg">
        {/* Header */}
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
            <p className="text-sm text-muted-foreground mt-1">
              Passe deine persönlichen Berater-Daten an. Diese erscheinen auf deinen Landingpages.
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
                    <Input value={beraterName} onChange={(e) => setBeraterName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Titel / Position</label>
                    <Input value={beraterTitel} onChange={(e) => setBeraterTitel(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Telefon</label>
                    <Input value={beraterTelefon} onChange={(e) => setBeraterTelefon(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">E-Mail</label>
                    <Input value={beraterEmail} onChange={(e) => setBeraterEmail(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Adresse</label>
                  <Input value={beraterAdresse} onChange={(e) => setBeraterAdresse(e.target.value)} />
                </div>
              </div>

              {/* Preview Card */}
              <div className="relative overflow-hidden rounded-xl border border-border self-start">
                <div className="bg-foreground text-background px-5 py-3 relative">
                  <p className="text-xs font-bold leading-snug">
                    HI, ICH BIN <span className="text-primary">{beraterName.split(" ")[0]?.toUpperCase()}</span>, DEIN
                    <br />PERSÖNLICHER BERATER.
                  </p>
                  <div className="absolute -bottom-3 left-10 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-foreground" />
                </div>
                <div className="gradient-brand p-5 flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg bg-white/20 flex items-center justify-center shrink-0 border-3 border-white/30">
                    <User className="h-8 w-8 text-white/70" />
                  </div>
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
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-accent rounded-full" />
                <h2 className="font-semibold text-foreground">Rabattcodes & Affiliate-Links</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {isAdmin ? "Rabattcodes mit Tracking-Übersicht. Admin kann je Mitarbeiter filtern." : "Deine zugewiesenen Rabattcodes und Affiliate-Links."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <>
                  <Select value={mitarbeiterFilter} onValueChange={setMitarbeiterFilter}>
                    <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue placeholder="Alle Mitarbeiter" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alle">Alle Mitarbeiter</SelectItem>
                      {MITARBEITER_LISTE.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={() => { setEditCodeId(null); setNewCode(""); setNewCodeRabatt(25); setNewCodeMitarbeiter(""); setShowAddDialog(true); }}>
                    <Plus className="h-4 w-4 mr-1.5" /> Neuen Code anlegen
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* KPI */}
          <div className="p-6 grid grid-cols-3 gap-4">
            <div className="border border-border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Gesamt Code-Nutzungen</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalNutzungen}</p>
            </div>
            <div className="border border-border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Zahlende Nutzungen</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalZahlend}</p>
            </div>
            <div className="border border-border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Kostenlose Promo-Nutzungen</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalPromo}</p>
            </div>
          </div>

          {/* Code List */}
          <div className="px-6 pb-6 space-y-2">
            {rabattCodes.filter(rc => mitarbeiterFilter === "alle" || rc.mitarbeiterId === mitarbeiterFilter).map((rc) => {
              const url = getAffiliateUrl(rc);
              const isExpanded = expandedCode === rc.id;
              const mitarbeiter = MITARBEITER_LISTE.find(m => m.id === rc.mitarbeiterId);
              return (
                <div key={rc.id} className="border border-border rounded-lg bg-muted/30">
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedCode(isExpanded ? null : rc.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={`text-[10px] font-bold shrink-0 ${rc.rabattProzent === 100 ? "bg-destructive text-destructive-foreground" : rc.rabattProzent >= 50 ? "bg-warning text-warning-foreground" : rc.rabattProzent > 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {rc.rabattProzent > 0 ? `${rc.rabattProzent}%` : "0%"}
                      </Badge>
                      <span className="font-bold text-foreground">{rc.code}</span>
                      <Badge variant="outline" className="text-xs">
                        {rc.type === "customer" ? "Eigentümer" : "Entwickler"}
                      </Badge>
                      {mitarbeiter && <span className="text-[11px] text-muted-foreground hidden lg:inline">({mitarbeiter.name})</span>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground hidden lg:inline">Affiliate-Link:</span>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline hidden md:inline" onClick={e => e.stopPropagation()}>
                        {url}
                      </a>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); copyToClipboard(url); }}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-3 pt-1 border-t border-border flex items-center justify-between">
                      <div className="flex gap-6 text-sm">
                        <span className="text-muted-foreground">Nutzungen: <span className="font-medium text-foreground">{rc.nutzungen}</span></span>
                        <span className="text-muted-foreground">Zahlend: <span className="font-medium text-foreground">{rc.zahlend}</span></span>
                        <span className="text-muted-foreground">Promo: <span className="font-medium text-foreground">{rc.promo}</span></span>
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditCode(rc)}>
                            <Pencil className="h-3.5 w-3.5 mr-1" /> Bearbeiten
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteRabattCode(rc.id)}>
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Löschen
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Landing Page Preview Tabs */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-primary rounded-full" />
              <h2 className="font-semibold text-foreground">Landingpage-Vorschau</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">So sehen deine personalisierten Landingpages aus. Die zugewiesenen Rabattcodes sind automatisch in den URLs hinterlegt.</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 pt-4 flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="customer" className="gap-2">
                  <Home className="h-4 w-4" />
                  Eigentümer-Landingpage
                </TabsTrigger>
                <TabsTrigger value="developer" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  Entwickler-Landingpage
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(getLandingUrl(activeTab === "customer" ? "customer" : "developer", activeTab === "customer" ? previewCusCode : previewDevCode))}>
                  <Copy className="h-3.5 w-3.5 mr-1.5" /> Link kopieren
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={getLandingUrl(activeTab === "customer" ? "customer" : "developer", activeTab === "customer" ? previewCusCode : previewDevCode)} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Original öffnen
                  </a>
                </Button>
              </div>
            </div>

            {/* URL display */}
            <div className="px-6 py-3">
              <code className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded block">
                {getLandingUrl(activeTab === "customer" ? "customer" : "developer", activeTab === "customer" ? previewCusCode : previewDevCode)}
              </code>
            </div>

            <TabsContent value="customer" className="mt-0">
              <CustomerLandingPreview
                beraterName={beraterName} beraterTitel={beraterTitel}
                beraterTelefon={beraterTelefon} beraterEmail={beraterEmail} beraterAdresse={beraterAdresse}
              />
            </TabsContent>

            <TabsContent value="developer" className="mt-0">
              <DeveloperLandingPreview
                beraterName={beraterName} beraterTitel={beraterTitel}
                beraterTelefon={beraterTelefon} beraterEmail={beraterEmail} beraterAdresse={beraterAdresse}
                rabattCode={previewDevCode}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Add/Edit Code Dialog – Admin only */}
        {isAdmin && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editCodeId ? "Rabattcode bearbeiten" : "Neuen Rabattcode anlegen"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Code (leer = automatisch generiert)</label>
                  <Input value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} placeholder="z.B. X7K2" maxLength={6} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Typ</label>
                  <Select value={newCodeType} onValueChange={(v) => setNewCodeType(v as "developer" | "customer")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Entwickler</SelectItem>
                      <SelectItem value="customer">Eigentümer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Rabatt-Prozentsatz</label>
                  <div className="flex flex-wrap gap-2">
                    {RABATT_OPTIONEN.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewCodeRabatt(p)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          newCodeRabatt === p
                            ? "bg-primary text-primary-foreground ring-2 ring-ring ring-offset-1"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Mitarbeiter zuordnen</label>
                  <Select value={newCodeMitarbeiter} onValueChange={setNewCodeMitarbeiter}>
                    <SelectTrigger><SelectValue placeholder="Mitarbeiter wählen…" /></SelectTrigger>
                    <SelectContent>
                      {MITARBEITER_LISTE.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Abbrechen</Button>
                <Button onClick={addRabattCode}>{editCodeId ? "Speichern" : "Code erstellen"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </CRMLayout>
  );
}
