import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy, ExternalLink, User, Building2, Home, Plus, ChevronDown, ChevronUp,
  Trash2, CheckCircle, TrendingUp, Users, Shield, Briefcase, Phone, Mail,
  Star, ArrowRight, Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import imonduLogo from "@/assets/imondu-logo.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface RabattCode {
  id: string;
  code: string;
  type: "developer" | "customer";
  nutzungen: number;
  zahlend: number;
  promo: number;
}

const INITIAL_CODES: RabattCode[] = [
  { id: "1", code: "K4P4", type: "customer", nutzungen: 1, zahlend: 0, promo: 1 },
  { id: "2", code: "H991", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
  { id: "3", code: "5Y31", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
  { id: "4", code: "27J5", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
  { id: "5", code: "178D", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
  { id: "6", code: "6L7Y", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
  { id: "7", code: "B8N8", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
  { id: "8", code: "J9B3", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
  { id: "9", code: "J12Q", type: "developer", nutzungen: 0, zahlend: 0, promo: 0 },
];

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

      {/* Noch Fragen */}
      <section className="px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-foreground">Noch Fragen?</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
          Sie möchten mehr Informationen über <strong>IMONDU</strong> und die vielen Möglichkeiten der Immobilienentwicklung erfahren? Dann kontaktieren Sie uns gerne.
        </p>
        <p className="font-semibold text-foreground mt-3">Wir beraten Sie gerne.</p>
        <div className="flex justify-center gap-3 mt-4">
          <Button variant="outline"><Phone className="mr-2 h-4 w-4" /> Beratungsgespräch</Button>
          <Button variant="outline"><Mail className="mr-2 h-4 w-4" /> E-Mail Kontakt</Button>
        </div>
      </section>

      {/* Berater CTA */}
      <BeraterCTA name={beraterName} titel={beraterTitel} telefon={beraterTelefon} email={beraterEmail} adresse={beraterAdresse} />

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
function DeveloperLandingPreview({ beraterName, beraterTitel, beraterTelefon, beraterEmail, beraterAdresse }: {
  beraterName: string; beraterTitel: string; beraterTelefon: string; beraterEmail: string; beraterAdresse: string;
}) {
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
        <Button className="mt-4" size="lg">
          Jetzt Immobilien-Leads finden <ArrowRight className="ml-2 h-4 w-4" />
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
        <Button variant="outline" className="mt-6">
          Jetzt registrieren <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
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
          <Button size="lg">Jetzt registrieren <ArrowRight className="ml-2 h-4 w-4" /></Button>
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

      {/* Noch Fragen */}
      <section className="bg-muted/50 px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-foreground">Noch Fragen?</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
          Sie möchten mehr Informationen über <strong>IMONDU</strong> und die vielen Möglichkeiten erfahren? Kontaktieren Sie uns gerne.
        </p>
        <p className="font-semibold text-foreground mt-3">Wir beraten Sie gerne.</p>
        <div className="flex justify-center gap-3 mt-4">
          <Button variant="outline"><Phone className="mr-2 h-4 w-4" /> Beratungsgespräch</Button>
          <Button variant="outline"><Mail className="mr-2 h-4 w-4" /> E-Mail Kontakt</Button>
        </div>
      </section>

      {/* Berater CTA */}
      <BeraterCTA name={beraterName} titel={beraterTitel} telefon={beraterTelefon} email={beraterEmail} adresse={beraterAdresse} />

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
        <div className="bg-[hsl(220,10%,35%)] text-white px-6 py-4 rounded-t-xl relative">
          <p className="text-sm font-bold leading-snug">
            HI, ICH BIN <span className="text-[hsl(38,92%,50%)]">{name.split(" ")[0]?.toUpperCase()}</span>, DEIN
            <br />PERSÖNLICHER BERATER.
          </p>
          <div className="absolute -bottom-3 left-12 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-[hsl(220,10%,35%)]" />
        </div>
        {/* Orange card */}
        <div className="bg-[hsl(38,92%,50%)] p-6 flex items-center gap-6 rounded-b-xl">
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
  const [beraterName, setBeraterName] = useState("Max Müller");
  const [beraterTitel, setBeraterTitel] = useState("Immobilienberater");
  const [beraterTelefon, setBeraterTelefon] = useState("+49 170 1234567");
  const [beraterEmail, setBeraterEmail] = useState("max.mueller@imondu.de");
  const [beraterAdresse, setBeraterAdresse] = useState("Musterstr. 1, 12345 Musterstadt");
  const [devCode, setDevCode] = useState("J9B3");
  const [cusCode, setCusCode] = useState("K4P4");
  const [activeTab, setActiveTab] = useState("customer");
  const [rabattCodes, setRabattCodes] = useState<RabattCode[]>(INITIAL_CODES);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newCodeType, setNewCodeType] = useState<"developer" | "customer">("developer");

  const devUrl = `https://imondu.com/developer?dev_code=${devCode}`;
  const cusUrl = `https://imondu.com/customer?cus_code=${cusCode}`;

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
    setRabattCodes(prev => [...prev, {
      id: Date.now().toString(), code, type: newCodeType, nutzungen: 0, zahlend: 0, promo: 0,
    }]);
    setNewCode("");
    setShowAddDialog(false);
    toast({ title: "Rabattcode erstellt", description: `Code: ${code}` });
  };

  const deleteRabattCode = (id: string) => {
    setRabattCodes(prev => prev.filter(c => c.id !== id));
    toast({ title: "Rabattcode gelöscht" });
  };

  const getAffiliateUrl = (rc: RabattCode) =>
    rc.type === "customer"
      ? `https://imondu.com/customer?cus_code=${rc.code}`
      : `https://imondu.com/developer?dev_code=${rc.code}`;

  return (
    <CRMLayout>
      <div className="p-6 space-y-6">
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Entwickler-Code (dev_code)</label>
                    <Input value={devCode} onChange={(e) => setDevCode(e.target.value)} placeholder="z.B. J9B3" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Eigentümer-Code (cus_code)</label>
                    <Input value={cusCode} onChange={(e) => setCusCode(e.target.value)} placeholder="z.B. K4P4" />
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              <div className="relative overflow-hidden rounded-xl border border-border self-start">
                <div className="bg-[hsl(220,10%,35%)] text-white px-5 py-3 relative">
                  <p className="text-xs font-bold leading-snug">
                    HI, ICH BIN <span className="text-[hsl(38,92%,50%)]">{beraterName.split(" ")[0]?.toUpperCase()}</span>, DEIN
                    <br />PERSÖNLICHER BERATER.
                  </p>
                  <div className="absolute -bottom-3 left-10 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-[hsl(220,10%,35%)]" />
                </div>
                <div className="bg-[hsl(38,92%,50%)] p-5 flex items-center gap-4">
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
              <p className="text-sm text-muted-foreground mt-1">Deine personalisierten Codes mit Tracking-Übersicht.</p>
            </div>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Neuen Code anlegen
            </Button>
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
            {rabattCodes.map((rc) => {
              const url = getAffiliateUrl(rc);
              const isExpanded = expandedCode === rc.id;
              return (
                <div key={rc.id} className="border border-border rounded-lg bg-muted/30">
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedCode(isExpanded ? null : rc.id)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Rabatt-Code:</span>
                      <span className="font-bold text-foreground">{rc.code}</span>
                      <Badge variant="outline" className="text-xs">
                        {rc.type === "customer" ? "Eigentümer" : "Entwickler"}
                      </Badge>
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
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteRabattCode(rc.id)}>
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Löschen
                      </Button>
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
            <p className="text-sm text-muted-foreground mt-1">So sehen deine personalisierten Landingpages aus.</p>
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
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(activeTab === "customer" ? cusUrl : devUrl)}>
                  <Copy className="h-3.5 w-3.5 mr-1.5" /> Link kopieren
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={activeTab === "customer" ? cusUrl : devUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Original öffnen
                  </a>
                </Button>
              </div>
            </div>

            {/* URL display */}
            <div className="px-6 py-3">
              <code className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded block">
                {activeTab === "customer" ? cusUrl : devUrl}
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
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Add Code Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuen Rabattcode anlegen</DialogTitle>
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
                    <SelectItem value="developer">Entwickler (dev_code)</SelectItem>
                    <SelectItem value="customer">Eigentümer (cus_code)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Abbrechen</Button>
              <Button onClick={addRabattCode}>Code erstellen</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CRMLayout>
  );
}
