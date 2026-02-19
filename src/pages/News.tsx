import CRMLayout from "@/components/CRMLayout";
import { Badge } from "@/components/ui/badge";

interface NewsItem {
  id: string;
  title: string;
  emoji: string;
  date: string;
  content: string;
  pinned: boolean;
  category: "update" | "event" | "info" | "provision";
}

const newsItems: NewsItem[] = [
  {
    id: "1",
    emoji: "📌",
    title: "Neues Provisionssystem ab März 2026",
    date: "Veröffentlicht am Montag, 17. Februar 2026",
    pinned: true,
    category: "provision",
    content: `Liebe Vertriebspartner,

ab dem 01. März 2026 gelten die aktualisierten Provisionsrichtlinien:

**B2C – Eigentümer-Inserate:**
Für jedes erfolgreich registrierte Inserat eines Immobilieneigentümers erhältst du weiterhin **10 € netto** Provision.

**B2B – Entwicklungspartner-Mitgliedschaften:**
Für jede verkaufte 12-Monats-Mitgliedschaft (1.250 € netto) erhältst du **25 % = 312,50 € netto** Provision. Bei jährlicher Verlängerung erhältst du die Bestandsprovision erneut – Jahr für Jahr!

Bei Fragen meldet euch gerne direkt bei eurem Teamleiter.

Wir wünschen weiterhin maximalen Erfolg! 🚀`,
  },
  {
    id: "2",
    emoji: "🎓",
    title: "Imondu Partner Weekend – 15./16.03. in München",
    date: "Veröffentlicht am Freitag, 14. Februar 2026",
    pinned: false,
    category: "event",
    content: `Hallo zusammen,

bald ist es soweit – unser **Imondu Partner Weekend** steht vor der Tür!
Am **15.03. – 16.03.2026** treffen wir uns im **Hotel & Tagungszentrum München**:

📍 **Hotel Elysium München**
Leopoldstraße 42
80802 München

**Agenda:**
- Samstag: Vertriebstraining, Best-Practice-Sessions, Networking-Dinner
- Sonntag: Produktupdates, Q&A mit der Geschäftsführung, Auszeichnung Top-Partner

Die Teilnahme ist für alle aktiven Vertriebspartner **kostenfrei**. Reisekosten werden anteilig übernommen.

**Anmeldung bis 28.02.2026** über euer Backoffice.

Wir freuen uns auf euch!`,
  },
  {
    id: "3",
    emoji: "🚀",
    title: "Neue Inserats-Funktion für Eigentümer live",
    date: "Veröffentlicht am Mittwoch, 12. Februar 2026",
    pinned: false,
    category: "update",
    content: `Anbei für alle – auch für diejenigen, die beim letzten Live-Call nicht dabei waren – die wichtigsten Infos zur neuen Inserats-Funktion:

Eigentümer können jetzt **kostenlos ihre Immobilie inserieren** und erhalten dabei:
- Professionelle Darstellung ihres Objekts
- Reichweite über das Imondu-Netzwerk
- Direkten Kontakt zu qualifizierten Entwicklungspartnern

**Für euch als Vertriebspartner bedeutet das:**
Jedes registrierte Inserat = **10 € netto** Provision für euch. Animiert eure Kontakte zur kostenlosen Registrierung!

Falls ihr Fragen oder Feedback habt, meldet euch gerne direkt bei Christian Peetz.

Wir wünschen weiterhin maximalen Erfolg, gute Gespräche und zahlreiche Registrierungen!`,
  },
  {
    id: "4",
    emoji: "💰",
    title: "Provisionsauszahlung Januar abgeschlossen",
    date: "Veröffentlicht am Montag, 03. Februar 2026",
    pinned: false,
    category: "provision",
    content: `Die Provisionsauszahlung für den Monat **Januar 2026** wurde erfolgreich durchgeführt.

Bitte prüft eure Abrechnungen im Bereich **„Abrechnungen"** in eurem CRM. Bei Unstimmigkeiten wendet euch bitte an die Buchhaltung.

**Nächster Auszahlungstermin:** 03. März 2026`,
  },
  {
    id: "5",
    emoji: "📋",
    title: "Neue B2B-Mitgliedschaftspakete verfügbar",
    date: "Veröffentlicht am Freitag, 24. Januar 2026",
    pinned: false,
    category: "update",
    content: `Ab sofort stehen euren B2B-Leads drei Mitgliedschaftspakete zur Verfügung:

**Standard – 1.250 € / Jahr**
Basiszugang zur Imondu-Plattform, Profil-Eintrag, Lead-Zugang.

**Premium – 2.500 € / Jahr** *(Coming Soon)*
Erweiterter Zugang, bevorzugte Platzierung, exklusive Leads.

**Enterprise – auf Anfrage** *(Coming Soon)*
Individuelles Paket für große Unternehmen.

Aktuell vermittelt ihr das **Standard-Paket** zu 1.250 € netto mit **25 % Provision = 312,50 € netto** pro Abschluss – jährlich wiederkehrend!

Bei Fragen zu den neuen Paketen steht euch das Vertriebsteam zur Verfügung.`,
  },
  {
    id: "6",
    emoji: "📊",
    title: "Anonyme Vertriebspartner-Umfrage – Teilnahme erbeten",
    date: "Veröffentlicht am Dienstag, 14. Januar 2026",
    pinned: false,
    category: "info",
    content: `Liebe Partner,

um unsere Zusammenarbeit kontinuierlich zu verbessern, bitten wir euch um die Teilnahme an unserer **anonymen Umfrage**.

Die Umfrage dauert nur **5 Minuten** und hilft uns, eure Bedürfnisse besser zu verstehen.

Vielen Dank für eure Unterstützung!`,
  },
];

const categoryColors: Record<string, string> = {
  update: "bg-primary text-primary-foreground",
  event: "bg-warning text-warning-foreground",
  info: "bg-info text-info-foreground",
  provision: "bg-success text-success-foreground",
};

const categoryLabels: Record<string, string> = {
  update: "Update",
  event: "Event",
  info: "Info",
  provision: "Provision",
};

export default function News() {
  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in max-w-4xl">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-1 rounded-full gradient-brand" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Top News</h1>
          <p className="text-sm text-muted-foreground mt-1">Interne Mitteilungen für Vertriebspartner</p>
        </div>

        {/* News Items */}
        <div className="space-y-5">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="bg-card rounded-xl p-6 shadow-crm-sm border border-border animate-scale-in"
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <h2 className="text-xl font-display font-bold text-foreground">
                  {item.emoji} {item.title}
                </h2>
                <Badge className={`shrink-0 text-[11px] ${categoryColors[item.category]}`}>
                  {categoryLabels[item.category]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-4">{item.date}</p>
              <div className="prose prose-sm max-w-none text-sm text-foreground/85 leading-relaxed whitespace-pre-line">
                {item.content.split("**").map((part, i) =>
                  i % 2 === 1 ? (
                    <strong key={i} className="font-semibold text-foreground">{part}</strong>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </CRMLayout>
  );
}
