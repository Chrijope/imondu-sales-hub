import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin, Ruler, Calendar, Home, Building2, Sparkles, MessageSquare,
  FileText, Lock, Eye, CheckCircle2, Info, Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InseratData {
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

// Mock extended data (simulates what the owner entered in the funnel)
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
  open,
  onClose,
}: {
  inserat: InseratData | null;
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  if (!inserat) return null;

  const ownerData = getMockOwnerData(inserat);
  const redactedName = inserat.eigentuemerName.split(" ").map((n, i) => i === 0 ? n[0] + "." : "███").join(" ");
  const redactedEmail = "████████@████.de";
  const redactedPhone = "+49 ███ ██████";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-lg font-display">{inserat.titel}</DialogTitle>
            {inserat.matchingScore && (
              <Badge className={`text-xs ${
                inserat.matchingScore >= 85 ? "bg-success/10 text-success border-success/20" :
                inserat.matchingScore >= 70 ? "bg-warning/10 text-warning border-warning/20" :
                "bg-muted text-muted-foreground border-border"
              }`}>
                <Sparkles className="h-3 w-3 mr-1" />
                Matching: {inserat.matchingScore}%
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3.5 w-3.5" /> {inserat.adresse} · Objekt-Nr. {inserat.objektNr}
          </p>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Objektdaten */}
          <Card className="border-border">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                <Home className="h-4 w-4 text-primary" /> Objektdaten
              </h3>
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
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Beschreibung</p>
                <p className="text-sm text-foreground">{inserat.beschreibung}</p>
              </div>
            </CardContent>
          </Card>

          {/* Entwicklungsplanung */}
          <Card className="border-border">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                <Building2 className="h-4 w-4 text-primary" /> Entwicklungsplanung des Eigentümers
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <DataField label="Entwicklungsabsicht" value={ownerData.entwicklungsabsicht} />
                <DataField label="Ziel nach Entwicklung" value={ownerData.zielNachEntwicklung} />
                <DataField label="Zeitrahmen" value={ownerData.zeitrahmen} />
                <DataField label="Budget-Range" value={ownerData.budgetRange} />
                <DataField label="Finanzierung gesichert" value={ownerData.finanzierungGesichert} />
              </div>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1.5">Geplante Maßnahmen</p>
                <div className="flex flex-wrap gap-1.5">
                  {ownerData.geplanteEntwicklung.map((e) => (
                    <Badge key={e} variant="secondary" className="text-[11px]">{e}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wünsche des Eigentümers */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-primary" /> Wünsche & Anforderungen des Eigentümers
              </h3>
              <p className="text-sm text-foreground leading-relaxed">{ownerData.wuensche}</p>
            </CardContent>
          </Card>

          {/* Dokumente */}
          <Card className="border-border">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-primary" /> Bereitgestellte Unterlagen
              </h3>
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
            </CardContent>
          </Card>

          {/* Kontaktdaten – geschwärzt */}
          <Card className="border-border">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                <Lock className="h-4 w-4 text-destructive" /> Kontaktdaten des Eigentümers
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Name</p>
                  <p className="font-medium text-foreground/60 select-none">{redactedName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">E-Mail</p>
                  <p className="font-medium text-foreground/40 select-none blur-[3px]">{redactedEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Telefon</p>
                  <p className="font-medium text-foreground/40 select-none blur-[3px]">{redactedPhone}</p>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border flex items-start gap-3">
                <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Die Kontaktdaten des Eigentümers sind aus Datenschutzgründen geschützt. Nutze den Chat, um Kontakt aufzunehmen.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              className="flex-1 gradient-brand border-0 text-primary-foreground gap-2"
              onClick={() => { onClose(); navigate("/chat"); }}
            >
              <MessageSquare className="h-4 w-4" /> Eigentümer kontaktieren
            </Button>
            <Button variant="outline" onClick={onClose}>Schließen</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
