import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { FileText } from "lucide-react";

interface Section {
  title: string;
  items: string[];
}

const sections: Section[] = [
  {
    title: "Präsentation",
    items: [
      "Imondu Präsentation kurz (Keynote)",
      "Imondu Präsentation kurz (PDF)",
      "Imondu Präsentation mittel (Keynote)",
      "Imondu Präsentation mittel (PDF)",
      "Imondu Präsentation lang (Keynote)",
      "Imondu Präsentation lang (PDF)",
      "Imondu Konzeptpräsentation Sprechskript (kurz bis lang)",
      "Hintergründe Imondu",
      "Hintergründe Immobilien-Markt",
    ],
  },
  {
    title: "Bonitätsunterlagen",
    items: [
      'Checkliste „Imondu"',
      'Checkliste „Bankprüfung"',
      "Selbstauskunft",
      "Schufa-Bestellung",
      "Mietfreibestätigung",
      "Negativ-Erklärung Steuer",
      "Vollmacht für Objekteigentümer",
      "Aufstellung Immobilienvermögen",
      "Haushaltsrechner (BoniTool)",
    ],
  },
  {
    title: "Beratung / Abschluss",
    items: [
      "Beispielberechnung (NUMBERS)",
      "Immobilienkalkulator (NUMBERS)",
      "Imondu Immorechner",
      "Reservierung",
      "Beratungsprotokoll",
      "Mietausfallversicherung",
    ],
  },
  {
    title: "After Sales",
    items: [
      "Mietkonto-Datenblatt",
      "Beratungsprotokoll",
      "Auszahlungsauftrag",
      "Schadensersatzantrag",
    ],
  },
  {
    title: "Steuerliche Themen",
    items: [
      "Steuerwissen kompakt",
      "Steuersätze nach Einkommenshöhe",
      "Zusammenfassung – Checkliste für die maximale Steuerersparnis",
      "Lohnsteueroptimierung (Video)",
      "Senkung der Lohnsteuer in Elster (Video)",
      "Ehegattenschaukel & Verkauf Eltern an Kinder (Video)",
    ],
  },
  {
    title: "Wissenswert",
    items: [
      "Abschreibung Allgemein",
      "Abschreibung bei Renovierung",
      "Entwicklung der Immobilienpreise",
      "Grundbuch",
      "Hier lohnt sich der Immobilienkauf",
      "Immobilie als Altersvorsorge",
      "Immobilien vs Aktien",
      "Immobilienpreise – Langfristtrend",
      "Inflation",
      "Kaufpreisentwicklung bis 2030",
      "Kaufpreisentwicklung ländliche Gegenden",
      "Ländliche Gegenden & der Wohnungsmangel",
      "Renditeerwartung",
      "Vergleich Immobilien, Aktien, Gold, Bargeld",
      "Wohnungsmangel Bedarfsdeckung",
    ],
  },
  {
    title: "Karriere",
    items: [
      "Imondu Vertriebs- & Karriereplan",
      "Imondu Assistenten Vertrag (Blanko)",
      "Imondu VP-Vertrag (Blanko)",
      "VP-AGB",
      "Karriereantrag (Neueinstufung/Beförderung)",
      "Zielplanung (Vorlage, Pages)",
      "Antrag auf Sonderleistungen",
    ],
  },
  {
    title: "Teamaufbau",
    items: [
      "Vertriebsleitung Startergespräch",
      "Vertriebsleitung Follow-up-Gespräch",
      "Vertriebsleitung Halbjahres-/Jahres-Gespräch",
    ],
  },
  {
    title: "Organisation",
    items: [
      "Kunden- & Umsatzliste (NUMBERS)",
      "E-Mail-Signatur (Vorlage, Word)",
      "Imondu Logo (PSD)",
      "Imondu Logo Screen",
      "Gesprächsprotokoll",
      "Anmeldung E-Mail-Postfach",
      "Rechnungsvorlage (Pages)",
      "Rechnungsvorlage (Word)",
    ],
  },
  {
    title: "Marketing",
    items: [
      "Social Media Management Antrag (Coming Soon)",
      "Antrag auf eigenes Marketing (Coming Soon)",
    ],
  },
  {
    title: "Vorlagen & Leitfäden",
    items: [
      "Leitfaden für Neukunden Anwerbung/Akquise",
      "Leitfaden für Imondu-Partner Anwerbung/Akquise",
    ],
  },
];

function CollapsibleCard({ section }: { section: Section }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card rounded-xl shadow-crm-sm border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-5 py-4 hover:bg-muted/30 transition-colors text-left"
      >
        <span className="text-accent text-sm">{open ? "⊖" : "⊕"}</span>
        <span className="text-sm font-semibold text-accent">{section.title}</span>
      </button>
      <div className="mx-5 border-t border-accent/30" />
      {open && (
        <ul className="px-5 py-3 space-y-2">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
              <button className="text-sm text-foreground hover:text-accent transition-colors text-left flex items-center gap-2">
                {item}
                <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Unterlagen() {
  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-4 animate-fade-in max-w-4xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-1 rounded-full gradient-brand" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Unterlagen</h1>
          <p className="text-sm text-muted-foreground mt-1">Alle Dokumente und Vorlagen für deinen Vertriebsalltag</p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <CollapsibleCard key={section.title} section={section} />
          ))}
        </div>
      </div>
    </CRMLayout>
  );
}
