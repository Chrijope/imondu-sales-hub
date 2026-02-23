export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  description?: string;
  exercise?: string;
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
      description: "In diesem Modul lernst du die zentralen Werkzeuge kennen, mit denen du jeden Arbeitstag startest. Du erfährst, wie du das Dashboard als Kommandozentrale nutzt, Nachrichten im Blick behältst und deine Kommunikation über Anrufe, E-Mails und den Kalender effizient organisierst.",
      lessons: [
        {
          id: "ob-l1", title: "Dashboard – Deine Zentrale", duration: "10:00", completed: false, locked: false,
          description: "Das Dashboard ist deine persönliche Startseite im Backoffice. Hier siehst du auf einen Blick deine wichtigsten Kennzahlen (KPIs): offene Leads, anstehende Termine, aktuelle Provision und deine Abschlussquote. Du lernst, wie du die einzelnen Widgets liest, was die Zahlen bedeuten und wie du das Dashboard als Ausgangspunkt für deinen Arbeitstag nutzt.",
          exercise: "Öffne dein Dashboard und identifiziere die folgenden KPIs: Anzahl offener Leads, geplante Termine heute und deine aktuelle Monats-Provision. Notiere dir die Werte und vergleiche sie morgen erneut.",
        },
        {
          id: "ob-l2", title: "Inbox – Alle Nachrichten im Überblick", duration: "8:00", completed: false, locked: false,
          description: "Die Inbox bündelt alle eingehenden Benachrichtigungen, Systemnachrichten und Aufgaben an einem Ort. Du lernst, wie du zwischen verschiedenen Nachrichtentypen filterst, einzelne Nachrichten als gelesen markierst und direkt aus der Inbox heraus auf Leads oder Termine zugreifst, ohne den Kontext zu wechseln.",
          exercise: "Navigiere zur Inbox und filtere nach ungelesenen Nachrichten. Markiere mindestens zwei Nachrichten als gelesen und öffne eine Nachricht, um den zugehörigen Lead direkt aufzurufen.",
        },
        {
          id: "ob-l3", title: "Anrufe – Telefonie effizient nutzen", duration: "12:00", completed: false, locked: false,
          description: "Die Anruf-Seite zeigt dir dein vollständiges Anrufprotokoll mit eingehenden und ausgehenden Anrufen. Du erfährst, wie du direkt aus dem Backoffice heraus Anrufe tätigst, Gesprächsnotizen anlegst und Anrufe bestimmten Leads zuordnest. Außerdem lernst du, wie du verpasste Anrufe nachverfolgst und Rückrufe planst.",
          exercise: "Rufe die Anruf-Seite auf und betrachte dein Anrufprotokoll. Klicke auf einen vergangenen Anruf und füge eine Gesprächsnotiz hinzu. Erstelle anschließend eine Rückruf-Erinnerung für morgen.",
        },
        {
          id: "ob-l4", title: "E-Mail – Geschäftliche Kommunikation", duration: "10:00", completed: false, locked: false,
          description: "Als imondu-Partner erhältst du eine professionelle geschäftliche E-Mail-Adresse (vorname.nachname@imondu.de). In dieser Lektion lernst du, wie du dein E-Mail-Konto einrichtest, E-Mail-Vorlagen nutzt, eine professionelle Signatur anlegst und E-Mails direkt aus dem CRM an Kontakte versendest.",
          exercise: "Gehe in die Einstellungen → E-Mail und überprüfe, ob deine E-Mail-Signatur korrekt eingerichtet ist. Passe sie an, falls nötig, und versende eine Test-E-Mail an dich selbst.",
        },
        {
          id: "ob-l5", title: "Kalender – Termine & Planung", duration: "8:00", completed: false, locked: false,
          description: "Der integrierte Kalender hilft dir, Termine mit Eigentümern, Follow-ups und Teamaktivitäten zu organisieren. Du lernst, wie du deinen externen Kalender (Google, Outlook, Apple) verbindest, neue Termine anlegst und die bidirektionale Synchronisation nutzt, damit kein Termin verloren geht.",
          exercise: "Verbinde einen externen Kalender (Google Calendar, Outlook oder Apple) über die Einstellungen → Kalender. Erstelle anschließend einen Testtermin im Backoffice und prüfe, ob er in deinem externen Kalender erscheint.",
        },
        {
          id: "ob-l6", title: "News – Immer auf dem Laufenden", duration: "5:00", completed: false, locked: true,
          description: "Im News-Bereich veröffentlicht das imondu-Team regelmäßig Unternehmens-Updates, neue Feature-Ankündigungen, Erfolgsgeschichten und wichtige Änderungen. Du lernst, wie du dich über Neuigkeiten informierst und welche Ankündigungen für deine tägliche Arbeit relevant sind.",
        },
      ],
    },
    // ── Modul 2: Vertrieb ──
    {
      id: "ob-m2",
      title: "Vertrieb – Leads & Pipeline",
      description: "Der Vertrieb ist das Herzstück deiner Arbeit bei imondu. In diesem Modul lernst du den gesamten Vertriebsprozess kennen: von der ersten Kontaktaufnahme über die Lead-Qualifizierung bis hin zum erfolgreichen Abschluss. Du wirst die Kontaktverwaltung, das B2C- und B2B-Lead-Management, die visuelle Pipeline und den Powerdialer beherrschen.",
      lessons: [
        {
          id: "ob-l7", title: "Kontakte – Deine Datenbank", duration: "12:00", completed: false, locked: true,
          description: "Die Kontaktverwaltung ist das Fundament deiner Vertriebsarbeit. Hier speicherst du alle Informationen zu Eigentümern, Interessenten und Geschäftspartnern. Du lernst, wie du neue Kontakte manuell anlegst, bestehende Kontakte bearbeitest, nach bestimmten Kriterien filterst (z.B. PLZ, Status, letzter Kontakt) und Kontakte mit Leads oder Deals verknüpfst.",
          exercise: "Lege einen neuen Testkontakt an mit vollständigem Namen, Telefonnummer, E-Mail-Adresse und Adresse. Nutze anschließend die Filterfunktion, um den Kontakt über die PLZ-Suche wiederzufinden.",
        },
        {
          id: "ob-l8", title: "B2C – Eigentümer-Leads bearbeiten", duration: "18:00", completed: false, locked: true,
          description: "Im B2C-Bereich verwaltest du deine Eigentümer-Leads – also Privatpersonen, die ihre Immobilie verkaufen möchten. Du lernst die verschiedenen Lead-Status kennen (Neu, Hot, Follow-Up, Termin, Gewonnen, Bestand), wie du neue Leads entgegennimmst, Notizen hinzufügst und den Lead Schritt für Schritt durch den Vertriebsprozess führst.",
          exercise: 'Öffne den B2C-Bereich und wähle einen Lead im Status „Neu" aus. Füge eine Gesprächsnotiz hinzu und ändere den Status auf „Hot". Trage einen Follow-Up-Termin ein.',
        },
        {
          id: "ob-l9", title: "B2C – Lead-Phasen im Detail", duration: "15:00", completed: false, locked: true,
          description: 'In dieser Vertiefungslektion gehst du durch jede einzelne Phase des B2C-Lead-Prozesses. Du verstehst, wann ein Lead von „Neu" auf „Hot" wechselt, welche Kriterien für einen „Termin" erfüllt sein müssen und was passiert, wenn ein Lead „Gewonnen" wird und in den „Bestand" übergeht. Außerdem lernst du, wie du verlorene Leads dokumentierst und reaktivierst.',
        },
        {
          id: "ob-l10", title: "B2B – Partner akquirieren", duration: "18:00", completed: false, locked: true,
          description: "Der B2B-Bereich dient der Akquise von Geschäftspartnern wie Handwerkern, Hausverwaltungen, Maklern und Dienstleistern. Du lernst, wie sich B2B-Leads von B2C unterscheiden, wie du Firmen als Partner gewinnst und betreust und wie die Umsatzbeteiligung bei B2B-Partnerschaften funktioniert.",
          exercise: "Öffne den B2B-Bereich und lege einen neuen B2B-Lead an (z.B. einen fiktiven Handwerksbetrieb). Füge Firmenname, Ansprechpartner und Branche hinzu.",
        },
        {
          id: "ob-l11", title: "Pipeline – Visuelles Deal-Management", duration: "14:00", completed: false, locked: true,
          description: "Die Pipeline gibt dir eine visuelle Übersicht über alle deine laufenden Deals in einem Kanban-Board. Jede Spalte repräsentiert eine Phase im Vertriebsprozess. Du lernst, wie du Deals zwischen den Phasen verschiebst, Deal-Werte einträgst und die Pipeline nutzt, um auf einen Blick zu sehen, wo deine Umsatzpotenziale liegen.",
          exercise: "Öffne die Pipeline-Ansicht und verschiebe einen bestehenden Deal von einer Phase in die nächste. Trage einen geschätzten Deal-Wert ein, falls noch keiner vorhanden ist.",
        },
        {
          id: "ob-l12", title: "Powerdialer – Effizient telefonieren", duration: "10:00", completed: false, locked: true,
          description: "Der Powerdialer ist dein Werkzeug für effiziente Telefonie-Blöcke. Statt jeden Kontakt einzeln herauszusuchen, arbeitest du eine vorbereitete Anrufliste automatisch ab. Du lernst, wie du Anruflisten erstellst, den Dialer startest, Gesprächsergebnisse direkt dokumentierst und deine Telefonie-Effizienz mit dem integrierten Call-Script steigerst.",
          exercise: 'Erstelle eine Anrufliste mit mindestens 3 Kontakten und starte den Powerdialer. Dokumentiere bei jedem simulierten Anruf ein Gesprächsergebnis (z.B. „Erreicht", „Nicht erreicht", „Rückruf").',
        },
      ],
    },
    // ── Modul 3: Immobilien ──
    {
      id: "ob-m3",
      title: "Immobilien – Inserate & Entwickler",
      description: "In diesem Modul lernst du, wie du Immobilieninserate im Backoffice verwaltest und mit Projektentwicklern zusammenarbeitest. Du verstehst den Weg vom gewonnenen Lead zum veröffentlichten Inserat und wie du Entwickler für die Plattform registrierst.",
      lessons: [
        {
          id: "ob-l13", title: "Inserate – Objekte verwalten", duration: "15:00", completed: false, locked: true,
          description: "Sobald du einen Eigentümer gewonnen hast, erstellst du ein Immobilieninserat im System. Du lernst, wie du ein neues Inserat anlegst, Objektdaten (Wohnfläche, Grundstücksgröße, Baujahr, Ausstattung) einträgst, Fotos hochlädst, den Inserat-Status verwaltest (Entwurf, Aktiv, Verkauft) und das Inserat einem Entwickler zuordnest.",
          exercise: "Öffne die Inserat-Übersicht und erstelle ein neues Testinserat. Trage mindestens die Adresse, Objektart, Wohnfläche und einen Angebotspreis ein. Lade ein Beispielfoto hoch.",
        },
        {
          id: "ob-l14", title: "Entwickler registrieren", duration: "10:00", completed: false, locked: true,
          description: "Projektentwickler sind die Käuferseite auf der imondu-Plattform. In dieser Lektion lernst du, wie du einen neuen Entwickler im System registrierst, dessen Firmenprofil anlegst und ihm Zugang zur Entwickler-Übersicht gibst, in der er Inserate einsehen und Angebote abgeben kann.",
        },
      ],
    },
    // ── Modul 4: Auswertungen & Finanzen ──
    {
      id: "ob-m4",
      title: "Auswertungen & Finanzen",
      description: "Zahlen lügen nicht – in diesem Modul lernst du, wie du deine persönliche Performance analysierst, deine Provisionen nachvollziehst und an Wettbewerben teilnimmst. Diese Tools helfen dir, datenbasiert zu arbeiten und deine Ziele im Blick zu behalten.",
      lessons: [
        {
          id: "ob-l15", title: "Statistik – Deine Performance", duration: "12:00", completed: false, locked: true,
          description: "Die Statistik-Seite zeigt dir deine persönlichen Vertriebskennzahlen in übersichtlichen Diagrammen. Du siehst Anrufanzahl, Erreichbarkeitsquote, Terminquote, Abschlussquote und Umsatzentwicklung über verschiedene Zeiträume. Du lernst, wie du Schwachstellen erkennst und gezielt an deiner Conversion-Rate arbeitest.",
          exercise: "Öffne die Statistik-Seite und analysiere deine Werte der letzten 30 Tage. Identifiziere die Kennzahl, die am meisten Verbesserungspotenzial hat, und formuliere ein konkretes Ziel dafür.",
        },
        {
          id: "ob-l16", title: "Abrechnungen – Provisionen verstehen", duration: "15:00", completed: false, locked: true,
          description: "Die Provisionsabrechnung zeigt dir detailliert, wie sich deine Vergütung zusammensetzt. Du lernst die B2C-Provisionsstaffel (je mehr Abschlüsse, desto höher dein Anteil), die B2B-Umsatzbeteiligung und mögliche Quartals-Boni kennen. Außerdem erfährst du, wie du deine Gutschriften herunterlädst und an die Buchhaltung weitergibst.",
          exercise: "Öffne die Abrechnungsseite und sichte deine letzte Abrechnung. Identifiziere die einzelnen Provisionsposten und prüfe, welcher Provisionsstaffel du aktuell zugeordnet bist.",
        },
        {
          id: "ob-l17", title: "Wettbewerb – Rankings & Challenges", duration: "8:00", completed: false, locked: true,
          description: "Die Wettbewerbsseite zeigt aktuelle Challenges und Rankings unter allen Vertriebspartnern. Du lernst, wie du dein Ranking einsehst, an laufenden Wettbewerben teilnimmst und welche Preise und Anreize es gibt. Wettbewerbe motivieren und helfen dir, dich mit den Besten zu messen.",
        },
      ],
    },
    // ── Modul 5: Tools & Ressourcen ──
    {
      id: "ob-m5",
      title: "Tools & Ressourcen",
      description: "imondu stellt dir eine Reihe professioneller Tools zur Verfügung, die deinen Arbeitsalltag erleichtern. Von Immobilienrechnern über Zielplanung bis hin zu Dokumentenvorlagen – in diesem Modul lernst du jedes Werkzeug kennen und wann du es am besten einsetzt.",
      lessons: [
        {
          id: "ob-l18", title: "Immorechner – Immobilien bewerten", duration: "12:00", completed: false, locked: true,
          description: "Der Immorechner ist dein Tool zur schnellen Immobilienbewertung im Kundengespräch. Du gibst Grunddaten wie Lage, Wohnfläche und Baujahr ein und erhältst eine Einschätzung zu Kaufpreis, Aufwendungen, steuerlichen Hebeln und Gesamtergebnis. Das Tool hilft dir, Eigentümern fundierte Zahlen zu präsentieren und Vertrauen aufzubauen.",
          exercise: "Öffne den Immorechner und berechne ein Beispielobjekt: Wohnung, 85 m\u00B2, Baujahr 1998, München. Notiere dir den geschätzten Kaufpreis und die Renditekennzahlen.",
        },
        {
          id: "ob-l19", title: "Entwicklungsrechner – Projekte kalkulieren", duration: "12:00", completed: false, locked: true,
          description: "Der Entwicklungsrechner richtet sich an die Kalkulation von Neubauprojekten und Bestandsentwicklungen. Du kannst Wohnungen, Grundstücke und Mehrfamilienhäuser durchrechnen, inklusive Baukosten, Verkaufspreise und erwarteter Marge. Dieses Tool nutzt du, wenn du mit Projektentwicklern über konkrete Vorhaben sprichst.",
          exercise: "Kalkuliere ein Beispiel-Mehrfamilienhaus mit 6 Wohneinheiten. Trage geschätzte Baukosten und geplante Verkaufspreise ein und prüfe die berechnete Marge.",
        },
        {
          id: "ob-l20", title: "Zielplanung – Deine Ziele setzen", duration: "10:00", completed: false, locked: true,
          description: "In der Zielplanung definierst du deine persönlichen Vertriebs- und Karriereziele. Du lernst, wie du monatliche und quartalsweise Ziele für Anrufe, Termine und Abschlüsse setzt, deinen Fortschritt trackst und bei Bedarf nachsteuerst. Eine klare Zielplanung ist die Grundlage für nachhaltigen Erfolg.",
          exercise: "Öffne die Zielplanung und setze dir drei konkrete Ziele für den laufenden Monat: Anzahl Anrufe pro Tag, Anzahl Termine pro Woche und angestrebte Abschlüsse im Monat.",
        },
        {
          id: "ob-l21", title: "Immobilien-Lexikon – Fachwissen", duration: "6:00", completed: false, locked: true,
          description: "Das Immobilien-Lexikon enthält alle wichtigen Fachbegriffe der Branche – von A wie Auflassung bis Z wie Zwangsversteigerung. Nutze es als Nachschlagewerk, wenn dir im Kundengespräch oder bei der Recherche ein Begriff unklar ist. Das Lexikon wird regelmäßig erweitert und aktualisiert.",
        },
        {
          id: "ob-l22", title: "Präsentation – Professionell auftreten", duration: "8:00", completed: false, locked: true,
          description: "Die Präsentationsvorlage ist dein professioneller Auftritt bei Kundenterminen und Partnervorstellungen. Du lernst, wie du die imondu-Präsentation an dein Gespräch anpasst, welche Folien du wann zeigst und wie du die wichtigsten Argumente für eine Zusammenarbeit strukturiert vermittelst.",
          exercise: "Öffne die Präsentation und gehe alle Folien durch. Übe den Vortrag der ersten drei Folien laut – stell dir vor, du sitzt einem Eigentümer gegenüber, der seine Immobilie verkaufen möchte.",
        },
        {
          id: "ob-l23", title: "Unterlagen – Dokumente verwalten", duration: "6:00", completed: false, locked: true,
          description: "Im Unterlagen-Bereich findest du alle wichtigen Vorlagen und Dokumente: Vertragsmuster, Checklisten, Leitfäden und Formulare. Du lernst, wo du welches Dokument findest, wie du Vorlagen herunterlädst und wie du eigene Unterlagen für den Kundenkontakt vorbereitest.",
        },
        {
          id: "ob-l24", title: "Chat & Support KI", duration: "8:00", completed: false, locked: true,
          description: "Der interne Chat ermöglicht dir die direkte Kommunikation mit deinem Team, deinem Teamleiter und der imondu-Zentrale. Die Support-KI steht dir rund um die Uhr für schnelle Fragen zur Verfügung – sie kennt das Backoffice und kann dir Schritt-für-Schritt-Anleitungen geben.",
          exercise: 'Sende eine Testnachricht im Chat an deinen Teamleiter. Stelle anschließend der Support-KI eine Frage, z.B. „Wie ändere ich den Status eines Leads?".',
        },
        {
          id: "ob-l25", title: "Webinar – Schulungen besuchen", duration: "5:00", completed: false, locked: true,
          description: "Im Webinar-Bereich findest du anstehende Live-Schulungen und Aufzeichnungen vergangener Webinare. imondu bietet regelmäßig Schulungen zu Vertriebstechniken, neuen Features und Best Practices an. Du lernst, wie du dich anmeldest und vergangene Aufzeichnungen abrufst.",
        },
      ],
    },
    // ── Modul 6: Team & Netzwerk ──
    {
      id: "ob-m6",
      title: "Team & Netzwerk",
      description: "Bei imondu arbeitest du nie allein. In diesem Modul lernst du die Team-Features kennen, richtest deine persönliche Berater-Microseite ein und erfährst, an wen du dich bei verschiedenen Anliegen wendest.",
      lessons: [
        {
          id: "ob-l26", title: "Teampartner – Dein Netzwerk", duration: "10:00", completed: false, locked: true,
          description: "Die Teampartner-Übersicht zeigt dir deine Position im Vertriebsnetzwerk: dein direkter Teamleiter, deine Teamkollegen und ggf. deine eigenen Partner. Du lernst, wie die Teamstruktur aufgebaut ist, welche Rollen es gibt und wie du von der Zusammenarbeit im Team profitierst.",
        },
        {
          id: "ob-l27", title: "Berater-Microseite – Dein Profil", duration: "8:00", completed: false, locked: true,
          description: "Deine Berater-Microseite ist deine digitale Visitenkarte. Hier präsentierst du dich potenziellen Kunden und Partnern mit Foto, Kurzvorstellung und Kontaktdaten. Du lernst, wie du die Seite individuell gestaltest und den Link z.B. in deiner E-Mail-Signatur oder auf Social Media verwendest.",
          exercise: "Öffne deine Berater-Microseite und fülle alle Felder aus: Profilbild, Vorstellung (2-3 Sätze über dich und deine Stärken) und Kontaktdaten. Kopiere den Link zu deiner Seite.",
        },
        {
          id: "ob-l28", title: "Ansprechpartner – Hilfe finden", duration: "5:00", completed: false, locked: true,
          description: "Auf der Ansprechpartner-Seite findest du alle wichtigen Kontaktpersonen bei imondu: dein Teamleiter für fachliche Fragen, das Backoffice-Team für administrative Anliegen, die Technik für Systemprobleme und die Geschäftsführung für strategische Themen. So weißt du immer, an wen du dich wenden kannst.",
        },
      ],
    },
    // ── Modul 7: Shop & Einstellungen ──
    {
      id: "ob-m7",
      title: "Shop & Einstellungen",
      description: "In diesem Modul lernst du den imondu Marktplatz für zusätzliche Leads kennen, bestellst gebrandete Vertriebsmaterialien und konfigurierst deine persönlichen Account-Einstellungen optimal für deinen Arbeitsalltag.",
      lessons: [
        {
          id: "ob-l29", title: "Lead-Kauf – Zusätzliche Leads erwerben", duration: "8:00", completed: false, locked: true,
          description: "Über den imondu-Marktplatz kannst du zusätzliche qualifizierte Eigentümer-Leads erwerben, die über Marketing-Kampagnen generiert wurden. Du lernst, wie du verfügbare Leads nach Region und Objektart filterst, den Kaufprozess durchführst und die gekauften Leads direkt in deinem CRM bearbeitest.",
          exercise: "Öffne den Lead-Kauf-Bereich und mache dich mit den verfügbaren Filtern vertraut: Region, Objektart und Preiskategorie. Merke dir, welche Leads in deiner Zielregion verfügbar wären.",
        },
        {
          id: "ob-l30", title: "Merchandise – imondu Produkte", duration: "5:00", completed: false, locked: true,
          description: "Im Merchandise-Shop findest du professionell gebrandete Materialien für deinen Vertriebsalltag: Visitenkarten, Poloshirts, Notizblöcke, Kugelschreiber, Roll-Ups und Messestände. Ein einheitliches Auftreten stärkt die Marke und dein professionelles Image beim Kunden.",
        },
        {
          id: "ob-l31", title: "Einstellungen – Dein Account", duration: "8:00", completed: false, locked: true,
          description: "In den Einstellungen verwaltest du alles rund um deinen Account: Profildaten, E-Mail-Konfiguration, Kalenderverbindung, Gewerbedaten, Steuer- und Bankdaten, Pflichtdokumente und Benachrichtigungspräferenzen. Ein vollständig eingerichteter Account ist Voraussetzung für den Start als Vertriebspartner.",
          exercise: "Gehe in die Einstellungen und prüfe, ob alle Tabs vollständig ausgefüllt sind: Profil, E-Mail, Kalender, Gewerbedaten, Steuer & Bank und Unterlagen. Ergänze fehlende Angaben.",
        },
      ],
    },
    // ── Modul 8: Quiz & Abschlussprüfung ──
    {
      id: "ob-m8",
      title: "Abschlussprüfung & Zertifikat",
      description: "Du hast alle Module durchgearbeitet – jetzt ist es Zeit, dein Wissen unter Beweis zu stellen. Bestehe das Wissens-Quiz und die Praxisaufgaben, um dein Zertifikat als geprüfter imondu Vertriebspartner zu erhalten und das Backoffice vollständig freizuschalten.",
      lessons: [
        {
          id: "ob-l32", title: "Wissens-Quiz – Backoffice Grundlagen", duration: "10:00", completed: false, locked: true,
          description: "20 Multiple-Choice-Fragen zu allen vorherigen Modulen: Dashboard & Kommunikation, CRM & Lead-Management, Immobilien & Inserate, Auswertungen & Finanzen sowie Tools & Team. Du benötigst mindestens 80 % richtige Antworten (16 von 20), um zu bestehen. Bei Nichtbestehen kannst du das Quiz nach 24 Stunden wiederholen.",
        },
        {
          id: "ob-l33", title: "Abschlussprüfung – Praxisaufgaben", duration: "15:00", completed: false, locked: true,
          description: "In der Abschlussprüfung zeigst du, dass du das Backoffice praktisch beherrschst. Du wirst gebeten, einen Beispiel-Lead anzulegen und durch die Pipeline zu führen, eine Immobilienbewertung mit dem Immorechner durchzuführen und eine Präsentation für ein simuliertes Kundengespräch vorzubereiten. Die Prüfung wird manuell durch dein Team bewertet.",
        },
        {
          id: "ob-l34", title: "Zertifikat – Geprüfter imondu Vertriebspartner 🏆", duration: "2:00", completed: false, locked: true,
          description: 'Herzlichen Glückwunsch – du hast alle Module abgeschlossen und die Prüfung bestanden! Hier lädst du dein offizielles Zertifikat als „Geprüfter imondu Vertriebspartner" herunter. Das Zertifikat bestätigt, dass du das Backoffice sicher beherrschst. Dein Backoffice ist ab sofort vollständig freigeschaltet.',
        },
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
