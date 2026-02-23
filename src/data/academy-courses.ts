export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  description?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  modules: Module[];
  totalDuration: string;
  mandatory?: boolean;
  hasQuiz?: boolean;
  hasCertificate?: boolean;
}

export const ONBOARDING_COURSE: Course = {
  id: "backoffice-onboarding",
  title: "Backoffice Onboarding – Geprüfter imondu Vertriebspartner",
  description: "Lerne alle Funktionen des imondu Backoffice kennen. Nach Abschluss des Kurses und bestandener Prüfung erhältst du dein Zertifikat als geprüfter imondu Vertriebspartner und das Backoffice wird vollständig freigeschaltet.",
  thumbnail: "🎓",
  category: "Pflicht",
  totalDuration: "6h 45min",
  mandatory: true,
  hasQuiz: true,
  hasCertificate: true,
  modules: [
    // ── Modul 1: Übersicht ──
    {
      id: "ob-m1",
      title: "Übersicht – Dein Arbeitsbereich",
      description: "Lerne die zentralen Übersichts-Tools kennen, die dir den täglichen Arbeitsablauf erleichtern.",
      lessons: [
        { id: "ob-l1", title: "Dashboard – Deine Zentrale", duration: "10:00", completed: false, locked: false, description: "Erfahre wie du dein personalisiertes Dashboard nutzt, KPIs im Blick behältst und deinen Tagesstart optimierst." },
        { id: "ob-l2", title: "Inbox – Alle Nachrichten im Überblick", duration: "8:00", completed: false, locked: false, description: "So nutzt du die Inbox, um keine wichtigen Nachrichten, Benachrichtigungen und Aufgaben zu verpassen." },
        { id: "ob-l3", title: "Anrufe – Telefonie effizient nutzen", duration: "12:00", completed: false, locked: false, description: "Lerne die Anruf-Funktion kennen: eingehende/ausgehende Anrufe, Anrufprotokoll und Gesprächsnotizen." },
        { id: "ob-l4", title: "E-Mail – Geschäftliche Kommunikation", duration: "10:00", completed: false, locked: false, description: "Richte deine E-Mail ein, nutze Vorlagen und verwalte deine geschäftliche Korrespondenz professionell." },
        { id: "ob-l5", title: "Kalender – Termine & Planung", duration: "8:00", completed: false, locked: false, description: "Verbinde deinen Kalender, erstelle Termine und nutze die Synchronisation mit externen Kalendern." },
        { id: "ob-l6", title: "News – Immer auf dem Laufenden", duration: "5:00", completed: false, locked: true, description: "Bleibe über Unternehmens-News, Updates und wichtige Ankündigungen informiert." },
      ],
    },
    // ── Modul 2: Vertrieb ──
    {
      id: "ob-m2",
      title: "Vertrieb – Leads & Pipeline",
      description: "Meistere die Vertriebs-Tools: von der Kontaktverwaltung über die Lead-Bearbeitung bis zur Pipeline.",
      lessons: [
        { id: "ob-l7", title: "Kontakte – Deine Datenbank", duration: "12:00", completed: false, locked: true, description: "Lerne wie du Kontakte anlegst, bearbeitest, filterst und für deine Vertriebsarbeit optimal nutzt." },
        { id: "ob-l8", title: "B2C – Eigentümer-Leads bearbeiten", duration: "18:00", completed: false, locked: true, description: "Verstehe den B2C-Bereich: Neue Leads, Hot Leads, Follow-Up, Termine und den Weg zum gewonnenen Inserat." },
        { id: "ob-l9", title: "B2C – Lead-Phasen im Detail", duration: "15:00", completed: false, locked: true, description: "Vertiefung: Wie du Leads durch die Phasen Neu → Hot → Termin → Gewonnen → Bestand führst." },
        { id: "ob-l10", title: "B2B – Partner akquirieren", duration: "18:00", completed: false, locked: true, description: "Der B2B-Bereich erklärt: Handwerker, Dienstleister und Firmen als Partner gewinnen und betreuen." },
        { id: "ob-l11", title: "Pipeline – Visuelles Deal-Management", duration: "14:00", completed: false, locked: true, description: "Nutze das Kanban-Board, um deine Deals zu tracken, Phasen zu verschieben und den Überblick zu behalten." },
        { id: "ob-l12", title: "Powerdialer – Effizient telefonieren", duration: "10:00", completed: false, locked: true, description: "Der Powerdialer hilft dir, Anruflisten abzuarbeiten und deine Telefonie-Effizienz deutlich zu steigern." },
      ],
    },
    // ── Modul 3: Immobilien ──
    {
      id: "ob-m3",
      title: "Immobilien – Inserate & Entwickler",
      description: "Erfahre wie du Immobilieninserate verwaltest und mit Entwicklern zusammenarbeitest.",
      lessons: [
        { id: "ob-l13", title: "Inserate – Objekte verwalten", duration: "15:00", completed: false, locked: true, description: "Erstelle, bearbeite und veröffentliche Immobilieninserate. Lerne die Inseratsdetails und Statusverwaltung." },
        { id: "ob-l14", title: "Entwickler registrieren", duration: "10:00", completed: false, locked: true, description: "So registrierst du neue Projektentwickler und pflegst deren Daten im System." },
      ],
    },
    // ── Modul 4: Auswertungen & Finanzen ──
    {
      id: "ob-m4",
      title: "Auswertungen & Finanzen",
      description: "Verstehe deine Zahlen: Statistiken, Abrechnungen und Wettbewerbe im Überblick.",
      lessons: [
        { id: "ob-l15", title: "Statistik – Deine Performance", duration: "12:00", completed: false, locked: true, description: "Analysiere deine Vertriebs-KPIs, Anrufstatistiken und Conversion-Rates." },
        { id: "ob-l16", title: "Abrechnungen – Provisionen verstehen", duration: "15:00", completed: false, locked: true, description: "So funktioniert die Provisionsabrechnung: B2C-Staffel, B2B-Umsatzbeteiligung und Quartals-Boni." },
        { id: "ob-l17", title: "Wettbewerb – Rankings & Challenges", duration: "8:00", completed: false, locked: true, description: "Nimm an Wettbewerben teil, vergleiche dich mit anderen Partnern und gewinne Preise." },
      ],
    },
    // ── Modul 5: Tools & Ressourcen ──
    {
      id: "ob-m5",
      title: "Tools & Ressourcen",
      description: "Nutze die vielfältigen Tools, die dir imondu für deinen Erfolg bereitstellt.",
      lessons: [
        { id: "ob-l18", title: "Immorechner – Immobilien bewerten", duration: "12:00", completed: false, locked: true, description: "Berechne Grunddaten, Aufwendungen, Hebel, Steuern und das Gesamtergebnis für Immobilien." },
        { id: "ob-l19", title: "Entwicklungsrechner – Projekte kalkulieren", duration: "12:00", completed: false, locked: true, description: "Kalkuliere Wohnungen, Grundstücke und Mehrfamilienhäuser mit dem Entwicklungsrechner." },
        { id: "ob-l20", title: "Zielplanung – Deine Ziele setzen", duration: "10:00", completed: false, locked: true, description: "Setze dir realistische Ziele, tracke deinen Fortschritt und plane deine Karriere bei imondu." },
        { id: "ob-l21", title: "Immobilien-Lexikon – Fachwissen", duration: "6:00", completed: false, locked: true, description: "Schlage Fachbegriffe nach und erweitere dein Immobilienwissen mit dem integrierten Lexikon." },
        { id: "ob-l22", title: "Präsentation – Professionell auftreten", duration: "8:00", completed: false, locked: true, description: "Nutze die Präsentationsvorlage für Kundentermine und Partnervorstellungen." },
        { id: "ob-l23", title: "Unterlagen – Dokumente verwalten", duration: "6:00", completed: false, locked: true, description: "Finde alle wichtigen Vertragsvorlagen, Leitfäden und Formulare an einem Ort." },
        { id: "ob-l24", title: "Chat & Support KI", duration: "8:00", completed: false, locked: true, description: "Nutze den internen Chat für Teamkommunikation und die KI-gestützte Support-Funktion für schnelle Hilfe." },
        { id: "ob-l25", title: "Webinar – Schulungen besuchen", duration: "5:00", completed: false, locked: true, description: "Melde dich zu Live-Webinaren an und schaue vergangene Aufzeichnungen an." },
      ],
    },
    // ── Modul 6: Team & Netzwerk ──
    {
      id: "ob-m6",
      title: "Team & Netzwerk",
      description: "Lerne die Team-Features kennen und baue dein Netzwerk bei imondu auf.",
      lessons: [
        { id: "ob-l26", title: "Teampartner – Dein Netzwerk", duration: "10:00", completed: false, locked: true, description: "Überblick über dein Team: Hierarchie, Rollen und Zusammenarbeit mit deinen Teampartnern." },
        { id: "ob-l27", title: "Berater-Microseite – Dein Profil", duration: "8:00", completed: false, locked: true, description: "Gestalte deine persönliche Berater-Microseite als digitale Visitenkarte für Kunden und Partner." },
        { id: "ob-l28", title: "Ansprechpartner – Hilfe finden", duration: "5:00", completed: false, locked: true, description: "Finde die richtigen Ansprechpartner bei imondu für verschiedene Anliegen und Fragen." },
      ],
    },
    // ── Modul 7: Shop & Einstellungen ──
    {
      id: "ob-m7",
      title: "Shop & Einstellungen",
      description: "Entdecke den imondu Shop und konfiguriere deine persönlichen Einstellungen.",
      lessons: [
        { id: "ob-l29", title: "Lead-Kauf – Zusätzliche Leads erwerben", duration: "8:00", completed: false, locked: true, description: "So kaufst du zusätzliche qualifizierte Leads über den imondu Marktplatz." },
        { id: "ob-l30", title: "Merchandise – imondu Produkte", duration: "5:00", completed: false, locked: true, description: "Bestelle gebrandete Materialien: Visitenkarten, Poloshirts, Roll-Ups und mehr." },
        { id: "ob-l31", title: "Einstellungen – Dein Account", duration: "8:00", completed: false, locked: true, description: "Passe dein Profil, E-Mail-Signatur, Benachrichtigungen und Sicherheitseinstellungen an." },
      ],
    },
    // ── Modul 8: Quiz & Abschlussprüfung ──
    {
      id: "ob-m8",
      title: "Abschlussprüfung & Zertifikat",
      description: "Teste dein Wissen in einem Quiz und bestehe die Abschlussprüfung, um dein Zertifikat als geprüfter imondu Vertriebspartner zu erhalten.",
      lessons: [
        { id: "ob-l32", title: "Wissens-Quiz – Backoffice Grundlagen", duration: "10:00", completed: false, locked: true, description: "20 Fragen zu allen Modulen: Teste dein Wissen über Dashboard, CRM, Vertrieb und Tools." },
        { id: "ob-l33", title: "Abschlussprüfung – Praxisaufgaben", duration: "15:00", completed: false, locked: true, description: "Löse praxisnahe Aufgaben: Erstelle einen Beispiel-Lead, navigiere die Pipeline und erstelle eine Kalkulation." },
        { id: "ob-l34", title: "Zertifikat – Geprüfter imondu Vertriebspartner 🏆", duration: "2:00", completed: false, locked: true, description: "Herzlichen Glückwunsch! Lade dein Zertifikat herunter und starte als geprüfter imondu Vertriebspartner durch." },
      ],
    },
  ],
};

export const COURSES: Course[] = [
  ONBOARDING_COURSE,
  {
    id: "onboarding",
    title: "Onboarding – Dein Start bei imondu",
    description: "Lerne die Basics: Plattform, Tools und erste Schritte als Vertriebspartner.",
    thumbnail: "🚀",
    category: "Pflicht",
    totalDuration: "2h 15min",
    modules: [
      {
        id: "m1",
        title: "Willkommen bei imondu",
        description: "Überblick über die Plattform und erste Orientierung im System.",
        lessons: [
          { id: "l1", title: "Was ist imondu?", duration: "8:30", completed: true, locked: false, description: "Erfahre die Vision, das Geschäftsmodell und was imondu von anderen Plattformen unterscheidet." },
          { id: "l2", title: "Dein Dashboard erklärt", duration: "12:00", completed: true, locked: false, description: "Eine Führung durch dein persönliches Dashboard: KPIs, Schnellzugriffe und Tagesübersicht." },
          { id: "l3", title: "Dein erster Lead", duration: "15:00", completed: false, locked: false, description: "Schritt für Schritt: So bearbeitest du deinen ersten Lead von der Zuweisung bis zum Erstkontakt." },
        ],
      },
      {
        id: "m2",
        title: "Das CRM nutzen",
        description: "Kontakte, Pipeline & Leads professionell verwalten und organisieren.",
        lessons: [
          { id: "l4", title: "Kontakte anlegen & verwalten", duration: "10:00", completed: false, locked: false, description: "Erstelle neue Kontakte, füge Notizen hinzu und nutze Filter für effiziente Kontaktverwaltung." },
          { id: "l5", title: "Pipeline-Management", duration: "14:00", completed: false, locked: false, description: "Das Kanban-Board erklärt: Deals verschieben, Phasen anpassen und den Überblick behalten." },
          { id: "l6", title: "Follow-Up Strategie", duration: "11:00", completed: false, locked: true, description: "Entwickle eine systematische Follow-Up-Strategie, die deine Abschlussquote steigert." },
        ],
      },
      {
        id: "m3",
        title: "Abschluss & Zertifikat",
        description: "Teste dein Grundwissen und erhalte dein erstes Zertifikat.",
        lessons: [
          { id: "l7", title: "Quiz: CRM Grundlagen", duration: "5:00", completed: false, locked: true, description: "10 Fragen zu den CRM-Grundlagen – bestehe mit mindestens 80% um fortzufahren." },
          { id: "l8", title: "Dein Zertifikat 🎓", duration: "2:00", completed: false, locked: true, description: "Lade dein CRM-Grundlagen-Zertifikat herunter und teile deinen Erfolg." },
        ],
      },
    ],
  },
  {
    id: "b2c-mastery",
    title: "B2C Mastery – Eigentümer gewinnen",
    description: "Fortgeschrittene Techniken zur Eigentümer-Akquise und Inserat-Optimierung.",
    thumbnail: "🏠",
    category: "Vertrieb",
    totalDuration: "3h 40min",
    modules: [
      {
        id: "m4",
        title: "Eigentümer ansprechen",
        description: "Gesprächsleitfäden und Best Practices für den erfolgreichen Erstkontakt mit Eigentümern.",
        lessons: [
          { id: "l9", title: "Der perfekte Erstkontakt", duration: "18:00", completed: true, locked: false, description: "Die ersten 30 Sekunden entscheiden: So baust du sofort Vertrauen auf und weckst Interesse." },
          { id: "l10", title: "Einwandbehandlung", duration: "22:00", completed: false, locked: false, description: "Die häufigsten Einwände von Eigentümern und wie du sie souverän und überzeugend behandelst." },
          { id: "l11", title: "Vom Lead zum Inserat", duration: "20:00", completed: false, locked: false, description: "Der komplette Prozess: Vom Erstgespräch über die Objektaufnahme bis zum fertigen Inserat." },
        ],
      },
      {
        id: "m5",
        title: "Inserate optimieren",
        description: "Mehr Sichtbarkeit und bessere Ergebnisse durch professionelle Inserat-Gestaltung.",
        lessons: [
          { id: "l12", title: "Professionelle Objektfotos", duration: "15:00", completed: false, locked: true, description: "Tipps für überzeugende Immobilienfotos: Belichtung, Perspektive und Bildbearbeitung." },
          { id: "l13", title: "Inserat-Texte die verkaufen", duration: "12:00", completed: false, locked: true, description: "Schreibe Inserat-Beschreibungen, die Emotionen wecken und Interessenten zum Handeln bewegen." },
        ],
      },
    ],
  },
  {
    id: "b2b-pro",
    title: "B2B Pro – Partner akquirieren",
    description: "Handwerksbetriebe und Dienstleister als Partner gewinnen.",
    thumbnail: "🤝",
    category: "Vertrieb",
    totalDuration: "2h 50min",
    modules: [
      {
        id: "m6",
        title: "B2B Akquise Grundlagen",
        description: "Zielgruppe definieren, Ansprache optimieren und B2B-Partnerschaften aufbauen.",
        lessons: [
          { id: "l14", title: "Zielgruppen-Analyse", duration: "14:00", completed: false, locked: false, description: "Identifiziere die besten B2B-Zielgruppen: Handwerker, Makler, Hausverwaltungen und mehr." },
          { id: "l15", title: "Kaltakquise Masterclass", duration: "25:00", completed: false, locked: false, description: "Telefonische und persönliche Kaltakquise: Skripte, Techniken und Erfolgsmessung." },
          { id: "l16", title: "Pitch-Deck & Präsentation", duration: "18:00", completed: false, locked: true, description: "Erstelle ein überzeugendes Pitch-Deck und führe B2B-Präsentationen professionell durch." },
        ],
      },
    ],
  },
  {
    id: "leadership",
    title: "Leadership – Team aufbauen",
    description: "Lerne wie du ein erfolgreiches Vertriebsteam aufbaust und führst.",
    thumbnail: "👑",
    category: "Führung",
    totalDuration: "4h 10min",
    modules: [
      {
        id: "m7",
        title: "Recruiting & Onboarding",
        description: "Die richtigen Partner finden, überzeugen und erfolgreich ins Team integrieren.",
        lessons: [
          { id: "l17", title: "Wo finde ich Partner?", duration: "16:00", completed: false, locked: false, description: "Die besten Kanäle und Strategien um qualifizierte Vertriebspartner zu rekrutieren." },
          { id: "l18", title: "Das Erstgespräch führen", duration: "20:00", completed: false, locked: false, description: "Struktur und Gesprächsleitfaden für überzeugende Recruiting-Gespräche." },
          { id: "l19", title: "Onboarding-Prozess", duration: "22:00", completed: false, locked: true, description: "So begleitest du neue Partner durch das Onboarding und sicherst einen erfolgreichen Start." },
        ],
      },
    ],
  },
];
