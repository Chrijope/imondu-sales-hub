import { useState } from "react";
import { Link } from "react-router-dom";
import CRMLayout from "@/components/CRMLayout";
import {
  ChevronDown,
  ChevronUp,
  Play,
  Download,
  ExternalLink,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollapsibleSection {
  id: string;
  title: string;
  items: { label: string; type?: "link" | "video" | "doc"; url?: string }[];
}

const sections: CollapsibleSection[] = [
  {
    id: "praesentation",
    title: "Präsentation",
    items: [
      { label: "Imondu Präsentation kurz (Keynote)", type: "doc" },
      { label: "Imondu Präsentation kurz (PDF)", type: "doc" },
      { label: "Imondu Präsentation mittel (Keynote)", type: "doc" },
      { label: "Imondu Präsentation mittel (PDF)", type: "doc" },
      { label: "Imondu Präsentation lang (Keynote)", type: "doc" },
      { label: "Imondu Präsentation lang (PDF)", type: "doc" },
      { label: "Hintergründe Imondu", type: "doc" },
      { label: "Hintergründe Immobilien-Markt", type: "doc" },
    ],
  },
  {
    id: "bonitaetscheck",
    title: "Bonitätscheck",
    items: [
      { label: 'Checkliste „Imondu"', type: "doc" },
      { label: 'Checkliste „Bankprüfung"', type: "doc" },
      { label: "Selbstauskunft", type: "doc" },
      { label: "Schufa-Bestellung", type: "doc" },
      { label: "Mietfreibestätigung", type: "doc" },
      { label: "Negativ-Erklärung Steuer", type: "doc" },
      { label: "Vollmacht für Objekteigentümer", type: "doc" },
      { label: "Aufstellung Immobilienvermögen", type: "doc" },
      { label: "Haushaltsrechner (BoniTool)", type: "doc" },
    ],
  },
  {
    id: "objektbeispiele",
    title: "Objektbeispiele",
    items: [
      { label: "Beispielobjekt München-Schwabing", type: "doc" },
      { label: "Beispielobjekt Berlin-Mitte", type: "doc" },
      { label: "Beispielobjekt Hamburg-Eimsbüttel", type: "doc" },
      { label: "Beispielobjekt Frankfurt-Sachsenhausen", type: "doc" },
    ],
  },
  {
    id: "kundenstimmen",
    title: "Kundenstimmen",
    items: [
      { label: "Kundenstimme Marco – Erste Immobilie über Imondu", type: "video" },
      { label: "Kundenstimme Sarah – Sanierung mit Imondu-Partner", type: "video" },
      { label: "Kundenstimme Familie Weber – Mehrfamilienhaus inseriert", type: "video" },
    ],
  },
  {
    id: "wissenswert",
    title: "Wissenswert",
    items: [
      { label: "Abschreibung Allgemein", type: "doc" },
      { label: "Abschreibung bei Renovierung", type: "doc" },
      { label: "Entwicklung der Immobilienpreise", type: "doc" },
      { label: "Grundbuch", type: "doc" },
      { label: "Hier lohnt sich der Immobilienkauf", type: "doc" },
      { label: "Immobilie als Altersvorsorge", type: "doc" },
      { label: "Immobilien vs Aktien", type: "doc" },
      { label: "Immobilienpreise – Langfristtrend", type: "doc" },
      { label: "Inflation", type: "doc" },
      { label: "Kaufpreisentwicklung bis 2030", type: "doc" },
      { label: "Kaufpreisentwicklung ländliche Gegenden", type: "doc" },
      { label: "Ländliche Gegenden & der Wohnungsmangel", type: "doc" },
      { label: "Renditeerwartung", type: "doc" },
      { label: "Vergleich Immobilien, Aktien, Gold, Bargeld", type: "doc" },
      { label: "Wohnungsmangel Bedarfsdeckung", type: "doc" },
    ],
  },
];

function CollapsibleCard({ section }: { section: CollapsibleSection }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
      >
        <span className="text-sm font-semibold text-accent">{open ? "⊖" : "⊕"} {section.title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && (
        <>
          <div className="mx-5 border-t border-accent/30" />
          <ul className="px-5 py-3 space-y-2">
            {section.items.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                <button className="text-sm text-foreground hover:text-accent transition-colors text-left flex items-center gap-2">
                  {item.label}
                  {item.type === "video" && <Play className="h-3.5 w-3.5 text-muted-foreground" />}
                  {item.type === "doc" && <FileText className="h-3.5 w-3.5 text-muted-foreground" />}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default function Praesentation() {
  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in min-h-screen dashboard-mesh-bg">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-1 rounded-full gradient-brand" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Präsentation</h1>
          <p className="text-sm text-muted-foreground mt-1">Vertriebsmaterialien, Videos und Unterlagen für deine Kundengespräche</p>
        </div>

        {/* Erklärvideo */}
        <div className="glass-card-static rounded-xl overflow-hidden">
          <div className="bg-muted/30 flex items-center justify-center py-8 px-6">
            <div className="w-full max-w-3xl aspect-video bg-foreground/5 rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 gradient-brand opacity-10" />
              <div className="text-center z-10">
                <div className="h-16 w-16 rounded-full bg-card/90 shadow-crm-md flex items-center justify-center mx-auto mb-3 cursor-pointer hover:scale-105 transition-transform">
                  <Play className="h-7 w-7 text-accent ml-1" />
                </div>
                <p className="text-lg font-display font-bold text-foreground">Imondu Erklärvideo</p>
                <p className="text-sm text-muted-foreground mt-1">So funktioniert Imondu – für Vertriebspartner</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 py-4 border-t border-border">
            <Button variant="outline" size="sm" className="text-xs border-accent text-accent hover:bg-accent/10">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Video herunterladen
            </Button>
            <Button variant="outline" size="sm" className="text-xs border-accent text-accent hover:bg-accent/10">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Auf YouTube ansehen
            </Button>
          </div>
        </div>

        {/* Collapsible Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {sections.map((section) => (
            <CollapsibleCard key={section.id} section={section} />
          ))}

          {/* Kontakt anlegen CTA */}
          <Link
            to="/leads"
            className="glass-card rounded-xl flex items-center justify-between px-5 py-4 hover:shadow-crm-md transition-all group"
          >
            <span className="text-sm font-semibold text-accent flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Kontakt anlegen
            </span>
          </Link>
        </div>
      </div>
    </CRMLayout>
  );
}
