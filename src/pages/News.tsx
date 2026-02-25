import { useState, useEffect } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Youtube, ExternalLink } from "lucide-react";
import { useUserRole } from "@/contexts/UserRoleContext";
import NewsCreateDialog, { type NewsItem } from "@/components/NewsCreateDialog";
import { toast } from "sonner";

const STORAGE_KEY = "imondu-news";

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: "1", emoji: "📌", title: "Neues Provisionssystem ab März 2026",
    date: "Veröffentlicht am Montag, 17. Februar 2026", pinned: true, category: "provision",
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
    id: "2", emoji: "🎓", title: "Imondu Partner Weekend – 15./16.03. in München",
    date: "Veröffentlicht am Freitag, 14. Februar 2026", pinned: false, category: "event",
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
    id: "3", emoji: "🚀", title: "Neue Inserats-Funktion für Eigentümer live",
    date: "Veröffentlicht am Mittwoch, 12. Februar 2026", pinned: false, category: "update",
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
    id: "4", emoji: "💰", title: "Provisionsauszahlung Januar abgeschlossen",
    date: "Veröffentlicht am Montag, 03. Februar 2026", pinned: false, category: "provision",
    content: `Die Provisionsauszahlung für den Monat **Januar 2026** wurde erfolgreich durchgeführt.

Bitte prüft eure Abrechnungen im Bereich **„Abrechnungen"** in eurem CRM. Bei Unstimmigkeiten wendet euch bitte an die Buchhaltung.

**Nächster Auszahlungstermin:** 03. März 2026`,
  },
  {
    id: "5", emoji: "📋", title: "Neue B2B-Mitgliedschaftspakete verfügbar",
    date: "Veröffentlicht am Freitag, 24. Januar 2026", pinned: false, category: "update",
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
    id: "6", emoji: "📊", title: "Anonyme Vertriebspartner-Umfrage – Teilnahme erbeten",
    date: "Veröffentlicht am Dienstag, 14. Januar 2026", pinned: false, category: "info",
    content: `Liebe Partner,

um unsere Zusammenarbeit kontinuierlich zu verbessern, bitten wir euch um die Teilnahme an unserer **anonymen Umfrage**.

Die Umfrage dauert nur **5 Minuten** und hilft uns, eure Bedürfnisse besser zu verstehen.

Vielen Dank für eure Unterstützung!`,
  },
];

function loadNews(): NewsItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_NEWS;
}

function saveNews(items: NewsItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

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

/** Extract YouTube video ID from common URL formats */
function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

/** Render content with bold and preserve whitespace */
function RenderContent({ content, links }: { content: string; links?: { label: string; url: string }[] }) {
  const youtubeLinks = (links || []).filter((l) => getYouTubeId(l.url));
  const otherLinks = (links || []).filter((l) => !getYouTubeId(l.url));

  return (
    <div className="space-y-4">
      <div className="prose prose-sm max-w-none text-sm text-foreground/85 leading-relaxed whitespace-pre-line">
        {content.split("**").map((part, i) =>
          i % 2 === 1 ? (
            <strong key={i} className="font-semibold text-foreground">{part}</strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>

      {/* YouTube Embeds */}
      {youtubeLinks.length > 0 && (
        <div className="space-y-3">
          {youtubeLinks.map((l, i) => {
            const vid = getYouTubeId(l.url);
            return (
              <div key={i} className="rounded-xl overflow-hidden border border-border aspect-video max-w-lg">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${vid}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={l.label}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Other Links */}
      {otherLinks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {otherLinks.map((l, i) => (
            <a
              key={i}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
            >
              <ExternalLink className="h-3.5 w-3.5" /> {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function News() {
  const { currentRoleId } = useUserRole();
  const canEdit = currentRoleId === "admin" || currentRoleId === "vertriebsleiter";
  const [newsItems, setNewsItems] = useState<NewsItem[]>(loadNews);
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<NewsItem | null>(null);

  useEffect(() => { saveNews(newsItems); }, [newsItems]);

  const handleSave = (item: NewsItem) => {
    setNewsItems((prev) => {
      const exists = prev.find((n) => n.id === item.id);
      if (exists) return prev.map((n) => (n.id === item.id ? item : n));
      return [item, ...prev];
    });
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    setNewsItems((prev) => prev.filter((n) => n.id !== id));
    toast.success("News gelöscht");
  };

  // Sort: pinned first, then by order
  const sorted = [...newsItems].sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in min-h-screen dashboard-mesh-bg">
        <div className="max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-10 h-1 rounded-full gradient-brand" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground">Top News</h1>
              <p className="text-sm text-muted-foreground mt-1">Interne Mitteilungen für Vertriebspartner</p>
            </div>
            {canEdit && (
              <Button onClick={() => { setEditItem(null); setShowCreate(true); }} className="gradient-brand text-primary-foreground gap-1.5">
                <Plus className="h-4 w-4" /> News erstellen
              </Button>
            )}
          </div>

          {/* News Items */}
          <div className="space-y-5">
            {sorted.map((item) => (
              <article key={item.id} className="glass-card rounded-xl overflow-hidden animate-scale-in">
                {/* Image */}
                {item.imageUrl && (
                  <div className="aspect-[21/9] w-full overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h2 className="text-xl font-display font-bold text-foreground">
                      {item.emoji} {item.title}
                    </h2>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={`text-[11px] ${categoryColors[item.category]}`}>
                        {categoryLabels[item.category]}
                      </Badge>
                      {canEdit && (
                        <>
                          <button
                            onClick={() => { setEditItem(item); setShowCreate(true); }}
                            className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            title="Bearbeiten"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            title="Löschen"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{item.date}</p>
                  <RenderContent content={item.content} links={item.links} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <NewsCreateDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSave={handleSave}
        editItem={editItem}
      />
    </CRMLayout>
  );
}
