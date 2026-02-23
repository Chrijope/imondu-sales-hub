import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin, Home, Building2, Sparkles, MessageSquare,
  FileText, Lock, Eye, CheckCircle2, Info, Shield,
  ChevronLeft, Calendar, Ruler, Star, Target, Users,
  Briefcase, Award, Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import AngebotFormular from "@/components/AngebotFormular";

// Property images
import efh1 from "@/assets/inserate/einfamilienhaus-1.jpg";
import efh2 from "@/assets/inserate/einfamilienhaus-2.jpg";
import mfh1 from "@/assets/inserate/mehrfamilienhaus-1.jpg";
import mfh2 from "@/assets/inserate/mehrfamilienhaus-2.jpg";
import woh1 from "@/assets/inserate/wohnung-1.jpg";
import woh2 from "@/assets/inserate/wohnung-2.jpg";

const propertyImages: Record<string, string[]> = {
  Einfamilienhaus: [efh1, efh2],
  Mehrfamilienhaus: [mfh1, mfh2],
  Wohnung: [woh1, woh2],
  Gewerbeobjekt: [mfh1],
  Grundstück: [efh2],
  Mischobjekt: [mfh2],
};

const getImage = (typ: string, id: string) => {
  const imgs = propertyImages[typ] || [efh1];
  const idx = id.charCodeAt(id.length - 1) % imgs.length;
  return imgs[idx];
};

export interface InseratData {
  id: string;
  eigentuemerName: string;
  objekttyp: string;
  titel: string;
  adresse: string;
  baujahr: number;
  wohnflaeche: number;
  grundstuecksflaeche?: number;
  anzahlEinheiten?: number;
  zimmer?: number;
  vermietet?: boolean;
  sanierungsstatus: string;
  beschreibung: string;
  matchingScore?: number;
  aufrufe: number;
  anfragen: number;
  tags: string[];
  objektNr: string;
}

function getMockOwnerData(inserat: InseratData) {
  return {
    entwicklungsabsicht: "Ja, ich bin offen für Entwicklungsvorschläge",
    geplanteEntwicklung: ["Kernsanierung", "Aufstockung", "Energetische Sanierung"],
    zielNachEntwicklung: "Verkauf nach Entwicklung",
    zeitrahmen: "6-12 Monate",
    budgetRange: "150.000 – 300.000 €",
    finanzierungGesichert: "Teilweise",
    wuensche: "Suche einen erfahrenen Entwickler, der das Projekt von der Planung bis zur Fertigstellung begleitet. Transparente Kommunikation ist mir wichtig.",
    dokumente: [
      { typ: "Grundriss", name: "grundriss_eg.pdf" },
      { typ: "Energieausweis", name: "energieausweis_2024.pdf" },
      { typ: "Grundbuch", name: "grundbuchauszug.pdf" },
    ],
    bilder: 4,
    stockwerke: "2",
    baederWc: "2",
    nutzflaeche: "35",
    terrasse: "Ja – ca. 25 m²",
    balkon: "Nein",
    parkplatz: "Ja – 2 Stellplätze",
    erbpacht: "Nein",
    mieteinnahmen: inserat.vermietet ? "1.850 € / Monat" : "–",
  };
}

export default function InseratDetailEntwickler({
  inserat,
  onBack,
}: {
  inserat: InseratData;
  onBack: () => void;
}) {
  const navigate = useNavigate();
  const [angebotOpen, setAngebotOpen] = useState(false);
  const ownerData = getMockOwnerData(inserat);
  const chatLink = `/chat?newChat=${encodeURIComponent(inserat.eigentuemerName)}&category=eigentuemer`;
  const ownerEmail = inserat.eigentuemerName.split(" ").join(".").toLowerCase() + "@email.de";
  const ownerPhone = "+49 " + (170 + Math.floor(inserat.id.charCodeAt(4) % 30)) + " " + String(1000000 + inserat.id.charCodeAt(3) * 12345).slice(0, 7);

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground gap-1 -ml-2">
        <ChevronLeft className="h-4 w-4" /> Zurück zur Übersicht
      </Button>

      {/* Profile Header with Cover Image */}
      <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
        <div className="h-48 relative overflow-hidden">
          <img src={getImage(inserat.objekttyp, inserat.id)} alt={inserat.titel} className="w-full h-full object-cover object-center" />
          {/* Matching Score overlay */}
          {inserat.matchingScore && (
            <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-sm text-sm font-bold ${
              inserat.matchingScore >= 85 ? "bg-success/90 text-white" :
              inserat.matchingScore >= 70 ? "bg-warning/90 text-white" :
              "bg-muted/90 text-foreground"
            }`}>
              <Sparkles className="h-4 w-4" />
              {inserat.matchingScore}% Match
            </div>
          )}
        </div>
        <div className="px-6 pb-6 relative">
          {/* Objekttyp badge overlapping */}
          <div className="absolute -top-6 left-6">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-crm-md text-primary-foreground">
              <Home className="h-6 w-6" />
            </div>
          </div>
          <div className="pt-8 flex items-start justify-between flex-wrap gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-display font-bold text-foreground">{inserat.titel}</h1>
              </div>
              <p className="text-sm text-muted-foreground">{inserat.objekttyp} · {inserat.sanierungsstatus}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" /> {inserat.adresse}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">Objekt-Nr. {inserat.objektNr}</Badge>
              <Button variant="outline" onClick={() => setAngebotOpen(true)} className="gap-2 border-primary text-primary hover:bg-primary/10">
                <Send className="h-4 w-4" /> Angebot starten
              </Button>
              <Button onClick={() => navigate(chatLink)} className="gap-2 gradient-brand border-0 text-primary-foreground">
                <MessageSquare className="h-4 w-4" /> Chat starten
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Wohnfläche", value: `${inserat.wohnflaeche} m²`, icon: Ruler },
          { label: "Baujahr", value: String(inserat.baujahr), icon: Calendar },
          { label: "Zimmer", value: inserat.zimmer ? String(inserat.zimmer) : "–", icon: Home },
          { label: "Matching", value: `${inserat.matchingScore || 0}%`, icon: Target },
          { label: "Vermietet", value: inserat.vermietet ? "Ja" : "Nein", icon: Briefcase },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-4 shadow-crm-sm border border-border text-center">
            <s.icon className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-display font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Objektdaten */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Objektdaten</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{inserat.beschreibung}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <DataField label="Objekttyp" value={inserat.objekttyp} />
              <DataField label="Baujahr" value={String(inserat.baujahr)} />
              <DataField label="Wohnfläche" value={`${inserat.wohnflaeche} m²`} />
              {inserat.grundstuecksflaeche && <DataField label="Grundstück" value={`${inserat.grundstuecksflaeche} m²`} />}
              {inserat.zimmer && <DataField label="Zimmer" value={String(inserat.zimmer)} />}
              <DataField label="Stockwerke" value={ownerData.stockwerke} />
              <DataField label="Bäder/WC" value={ownerData.baederWc} />
              <DataField label="Nutzfläche" value={`${ownerData.nutzflaeche} m²`} />
              <DataField label="Sanierungsstatus" value={inserat.sanierungsstatus} />
              <DataField label="Vermietet" value={inserat.vermietet ? "Ja" : "Nein"} />
              {inserat.vermietet && <DataField label="Mieteinnahmen" value={ownerData.mieteinnahmen} />}
              {inserat.anzahlEinheiten && <DataField label="Einheiten" value={String(inserat.anzahlEinheiten)} />}
              <DataField label="Terrasse" value={ownerData.terrasse} />
              <DataField label="Balkon" value={ownerData.balkon} />
              <DataField label="Parkplatz" value={ownerData.parkplatz} />
              <DataField label="Erbpacht" value={ownerData.erbpacht} />
            </div>
          </div>

          {/* Entwicklungsplanung */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Entwicklungsplanung des Eigentümers</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <DataField label="Entwicklungsabsicht" value={ownerData.entwicklungsabsicht} />
              <DataField label="Ziel nach Entwicklung" value={ownerData.zielNachEntwicklung} />
              <DataField label="Zeitrahmen" value={ownerData.zeitrahmen} />
              <DataField label="Budget-Range" value={ownerData.budgetRange} />
              <DataField label="Finanzierung gesichert" value={ownerData.finanzierungGesichert} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Geplante Maßnahmen</p>
              <div className="flex flex-wrap gap-1.5">
                {ownerData.geplanteEntwicklung.map((e) => (
                  <Badge key={e} variant="secondary" className="text-[10px]">{e}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Wünsche */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Wünsche & Anforderungen des Eigentümers</h2>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{ownerData.wuensche}</p>
          </div>

          {/* Unterlagen */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Bereitgestellte Unterlagen</h2>
            </div>
            <div className="space-y-2">
              {ownerData.dokumente.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{doc.typ}</p>
                    <p className="text-xs text-muted-foreground">{doc.name}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    <Eye className="h-3 w-3 mr-1" /> Einsehbar
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> {ownerData.bilder} Bilder vom Eigentümer hochgeladen
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Kontaktdaten */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Kontakt Eigentümer</h2>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{inserat.eigentuemerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{inserat.adresse}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${ownerEmail}`} className="text-primary hover:underline">{ownerEmail}</a>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{ownerPhone}</span>
              </div>
            </div>
            <hr className="border-border" />
            <Button onClick={() => navigate(chatLink)} className="w-full gap-2 gradient-brand border-0 text-primary-foreground">
              <MessageSquare className="h-4 w-4" /> Eigentümer kontaktieren
            </Button>
          </div>

          {/* Auf einen Blick */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Auf einen Blick</h2>
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Objekttyp</dt><dd className="font-medium text-foreground">{inserat.objekttyp}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Wohnfläche</dt><dd className="font-medium text-foreground">{inserat.wohnflaeche} m²</dd></div>
              {inserat.grundstuecksflaeche && <div className="flex justify-between"><dt className="text-muted-foreground">Grundstück</dt><dd className="font-medium text-foreground">{inserat.grundstuecksflaeche} m²</dd></div>}
              <div className="flex justify-between"><dt className="text-muted-foreground">Baujahr</dt><dd className="font-medium text-foreground">{inserat.baujahr}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Sanierung</dt><dd className="font-medium text-foreground">{inserat.sanierungsstatus}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Vermietet</dt><dd className="font-medium text-foreground">{inserat.vermietet ? "Ja" : "Nein"}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Zeitrahmen</dt><dd className="font-medium text-success">{ownerData.zeitrahmen}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Budget</dt><dd className="font-medium text-foreground">{ownerData.budgetRange}</dd></div>
            </dl>
          </div>

          {/* Tags */}
          <div className="bg-card rounded-xl p-5 shadow-crm-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full gradient-brand" />
              <h2 className="text-sm font-semibold text-foreground">Kategorien</h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {inserat.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground text-center">Objekt-Nr.: {inserat.objektNr}</p>
        </div>
      </div>

      {/* Angebot Dialog */}
      <Dialog open={angebotOpen} onOpenChange={setAngebotOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Angebot für {inserat.titel}</DialogTitle>
            <DialogDescription>Erstellen Sie ein Angebot für {inserat.eigentuemerName}.</DialogDescription>
          </DialogHeader>
          <AngebotFormular
            inseratTitel={inserat.titel}
            eigentuemerName={inserat.eigentuemerName}
            onSubmit={() => setAngebotOpen(false)}
            onCancel={() => setAngebotOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}
