export type Gewerk =
  | 'Projektentwickler'
  | 'Architekt'
  | 'Fensterbauer'
  | 'Energieberater'
  | 'Dachdecker'
  | 'SHK'
  | 'Elektriker'
  | 'Maler'
  | 'Zimmerer'
  | 'Bauträger'
  | 'Immobilienmakler'
  | 'Sonstige';

export type Objekttyp =
  | 'Wohnung'
  | 'Einfamilienhaus'
  | 'Mehrfamilienhaus'
  | 'Gewerbeobjekt'
  | 'Grundstück'
  | 'Mischobjekt';

export type Sanierungsstatus = 'Unsaniert' | 'Teilsaniert' | 'Vollsaniert';
export type Eigentuemertyp = 'Selbstnutzer' | 'Vermieter' | 'Leerstand';
export type Interesse = 'Sanierung' | 'Verkauf' | 'Energieberatung' | 'Fenstertausch' | 'Dachsanierung' | 'Heizungstausch' | 'Sonstige';

export interface Lead {
  id: string;
  type: 'b2c' | 'b2b';
  status: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  value: number;
  notes: string;
  phone?: string;
  email?: string;

  // B2C – Immobilieneigentümer
  firstName?: string;
  lastName?: string;
  address?: string;
  objekttyp?: Objekttyp;
  objektAdresse?: string;
  baujahr?: number;
  wohnflaeche?: number;
  grundstuecksflaeche?: number;
  anzahlEinheiten?: number;
  energieausweis?: boolean;
  sanierungsstatus?: Sanierungsstatus;
  eigentuemertyp?: Eigentuemertyp;
  interesse?: Interesse;

  // B2B – Entwicklungspartner / Gewerke
  companyName?: string;
  gewerk?: Gewerk;
  contactPerson?: string;
  position?: string;
  website?: string;
  region?: string;
  companySize?: string;
  partnerStatus?: 'Interessent' | 'Aktiver Partner' | 'Inaktiv';
  // legacy compat
  industry?: string;
  revenue?: number;
  decisionStatus?: string;
}

export interface Activity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change';
  description: string;
  createdAt: string;
  createdBy: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
}

export const B2C_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'b2c_new', name: 'Neuer Lead', order: 0, color: 'hsl(220 10% 46%)' },
  { id: 'b2c_contact', name: 'Kontaktversuch', order: 1, color: 'hsl(210 80% 52%)' },
  { id: 'b2c_reached', name: 'Erreicht', order: 2, color: 'hsl(250 60% 52%)' },
  { id: 'b2c_interested', name: 'Interesse geweckt', order: 3, color: 'hsl(38 92% 50%)' },
  { id: 'b2c_followup', name: 'Follow-Up', order: 4, color: 'hsl(280 60% 55%)' },
  { id: 'b2c_registered', name: 'Registriert', order: 5, color: 'hsl(195 70% 45%)' },
  { id: 'b2c_inserat', name: 'Inserat erstellt', order: 6, color: 'hsl(152 60% 42%)' },
  { id: 'b2c_lost', name: 'Kein Interesse', order: 7, color: 'hsl(0 72% 51%)' },
];

export const B2B_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'b2b_new', name: 'Neuer Lead', order: 0, color: 'hsl(220 10% 46%)' },
  { id: 'b2b_contact', name: 'Kontaktversuch', order: 1, color: 'hsl(210 80% 52%)' },
  { id: 'b2b_reached', name: 'Erreicht', order: 2, color: 'hsl(250 60% 52%)' },
  { id: 'b2b_qualified', name: 'Qualifiziert', order: 3, color: 'hsl(38 92% 50%)' },
  { id: 'b2b_demo', name: 'Präsentation/Demo', order: 4, color: 'hsl(280 60% 55%)' },
  { id: 'b2b_offer', name: 'Angebot Mitgliedschaft', order: 5, color: 'hsl(340 75% 55%)' },
  { id: 'b2b_followup', name: 'Follow-Up', order: 6, color: 'hsl(195 70% 45%)' },
  { id: 'b2b_negotiation', name: 'Verhandlung', order: 7, color: 'hsl(30 80% 50%)' },
  { id: 'b2b_won', name: 'Mitgliedschaft verkauft', order: 8, color: 'hsl(152 60% 42%)' },
  { id: 'b2b_lost', name: 'Verloren', order: 9, color: 'hsl(0 72% 51%)' },
];

// Legacy compat
export const PIPELINE_STAGES: PipelineStage[] = [
  ...B2C_PIPELINE_STAGES,
  ...B2B_PIPELINE_STAGES,
];

export const GEWERK_OPTIONS: Gewerk[] = [
  'Projektentwickler', 'Architekt', 'Fensterbauer', 'Energieberater',
  'Dachdecker', 'SHK', 'Elektriker', 'Maler', 'Zimmerer',
  'Bauträger', 'Immobilienmakler', 'Sonstige',
];

export const OBJEKTTYP_OPTIONS: Objekttyp[] = [
  'Wohnung', 'Einfamilienhaus', 'Mehrfamilienhaus',
  'Gewerbeobjekt', 'Grundstück', 'Mischobjekt',
];

export const SAMPLE_LEADS: Lead[] = [
  // B2C – Immobilieneigentümer
  {
    id: '1', type: 'b2c', status: 'b2c_new', priority: 'high', assignee: 'Max Müller', source: 'Website',
    createdAt: '2026-02-18', updatedAt: '2026-02-18', value: 10, notes: '',
    firstName: 'Anna', lastName: 'Schmidt', phone: '+49 170 1234567', email: 'anna@email.de',
    address: 'Berliner Str. 12, 10115 Berlin',
    objekttyp: 'Einfamilienhaus', objektAdresse: 'Berliner Str. 12, 10115 Berlin',
    baujahr: 1978, wohnflaeche: 145, grundstuecksflaeche: 420,
    energieausweis: false, sanierungsstatus: 'Unsaniert', eigentuemertyp: 'Selbstnutzer', interesse: 'Sanierung',
  },
  {
    id: '3', type: 'b2c', status: 'b2c_contact', priority: 'medium', assignee: 'Max Müller', source: 'Empfehlung',
    createdAt: '2026-02-16', updatedAt: '2026-02-18', value: 10, notes: '',
    firstName: 'Peter', lastName: 'Klein', phone: '+49 151 7654321', email: 'peter.klein@web.de',
    address: 'Münchner Weg 5, 80331 München',
    objekttyp: 'Mehrfamilienhaus', objektAdresse: 'Münchner Weg 5, 80331 München',
    baujahr: 1965, wohnflaeche: 480, anzahlEinheiten: 6,
    energieausweis: true, sanierungsstatus: 'Teilsaniert', eigentuemertyp: 'Vermieter', interesse: 'Fenstertausch',
  },
  {
    id: '5', type: 'b2c', status: 'b2c_interested', priority: 'medium', assignee: 'Jan Fischer', source: 'Google Ads',
    createdAt: '2026-02-08', updatedAt: '2026-02-16', value: 10, notes: '',
    firstName: 'Maria', lastName: 'Hoffmann', phone: '+49 160 3334455', email: 'maria.h@gmail.com',
    address: 'Elbchaussee 88, 22763 Hamburg',
    objekttyp: 'Wohnung', objektAdresse: 'Elbchaussee 88, 22763 Hamburg',
    baujahr: 1992, wohnflaeche: 95,
    energieausweis: true, sanierungsstatus: 'Teilsaniert', eigentuemertyp: 'Selbstnutzer', interesse: 'Heizungstausch',
  },
  {
    id: '7', type: 'b2c', status: 'b2c_inserat', priority: 'high', assignee: 'Max Müller', source: 'Website',
    createdAt: '2026-01-20', updatedAt: '2026-02-14', value: 10, notes: 'Inserat aktiv seit 14.02.',
    firstName: 'Klaus', lastName: 'Wagner', phone: '+49 172 8889900', email: 'k.wagner@outlook.de',
    address: 'Mainzer Landstr. 40, 60325 Frankfurt',
    objekttyp: 'Einfamilienhaus', objektAdresse: 'Mainzer Landstr. 40, 60325 Frankfurt',
    baujahr: 1971, wohnflaeche: 160, grundstuecksflaeche: 550,
    energieausweis: false, sanierungsstatus: 'Unsaniert', eigentuemertyp: 'Selbstnutzer', interesse: 'Dachsanierung',
  },
  {
    id: '9', type: 'b2c', status: 'b2c_followup', priority: 'low', assignee: 'Jan Fischer', source: 'Social Media',
    createdAt: '2026-01-25', updatedAt: '2026-02-10', value: 10, notes: 'Nochmal anrufen nächste Woche',
    firstName: 'Sophie', lastName: 'Becker', phone: '+49 176 4445566', email: 'sophie.b@email.de',
    address: 'Venloer Str. 200, 50823 Köln',
    objekttyp: 'Wohnung', objektAdresse: 'Venloer Str. 200, 50823 Köln',
    baujahr: 2005, wohnflaeche: 72,
    energieausweis: true, sanierungsstatus: 'Vollsaniert', eigentuemertyp: 'Vermieter', interesse: 'Energieberatung',
  },
  {
    id: '11', type: 'b2c', status: 'b2c_reached', priority: 'medium', assignee: 'Max Müller', source: 'Empfehlung',
    createdAt: '2026-02-17', updatedAt: '2026-02-19', value: 10, notes: '',
    firstName: 'Thomas', lastName: 'Meier', phone: '+49 171 2223344', email: 't.meier@gmx.de',
    address: 'Schillerstr. 15, 70173 Stuttgart',
    objekttyp: 'Mehrfamilienhaus', objektAdresse: 'Schillerstr. 15, 70173 Stuttgart',
    baujahr: 1955, wohnflaeche: 320, anzahlEinheiten: 4,
    energieausweis: false, sanierungsstatus: 'Unsaniert', eigentuemertyp: 'Vermieter', interesse: 'Sanierung',
  },
  {
    id: '12', type: 'b2c', status: 'b2c_registered', priority: 'high', assignee: 'Jan Fischer', source: 'Website',
    createdAt: '2026-02-10', updatedAt: '2026-02-18', value: 10, notes: 'Registrierung abgeschlossen, wartet auf Inserat',
    firstName: 'Sabine', lastName: 'Richter', phone: '+49 163 5556677', email: 's.richter@email.de',
    address: 'Am Rhein 22, 40213 Düsseldorf',
    objekttyp: 'Gewerbeobjekt', objektAdresse: 'Am Rhein 22, 40213 Düsseldorf',
    baujahr: 2001, wohnflaeche: 250,
    energieausweis: true, sanierungsstatus: 'Teilsaniert', eigentuemertyp: 'Vermieter', interesse: 'Verkauf',
  },

  // B2B – Entwicklungspartner / Gewerke
  {
    id: '2', type: 'b2b', status: 'b2b_qualified', priority: 'high', assignee: 'Lisa Weber', source: 'LinkedIn',
    createdAt: '2026-02-15', updatedAt: '2026-02-17', value: 1250, notes: '',
    companyName: 'Architektur Bauer GmbH', gewerk: 'Architekt',
    contactPerson: 'Dr. Thomas Bauer', position: 'Geschäftsführer',
    phone: '+49 30 9876543', email: 'bauer@architektur-bauer.de',
    website: 'www.architektur-bauer.de', region: 'Berlin / Brandenburg',
    companySize: '20-50', partnerStatus: 'Interessent',
  },
  {
    id: '4', type: 'b2b', status: 'b2b_offer', priority: 'high', assignee: 'Lisa Weber', source: 'Messe',
    createdAt: '2026-02-10', updatedAt: '2026-02-17', value: 1250, notes: '',
    companyName: 'FensterPro AG', gewerk: 'Fensterbauer',
    contactPerson: 'Sandra Meier', position: 'VP Sales',
    phone: '+49 89 1112233', email: 'meier@fensterpro.de',
    website: 'www.fensterpro.de', region: 'Bayern',
    companySize: '200-500', partnerStatus: 'Interessent',
  },
  {
    id: '6', type: 'b2b', status: 'b2b_new', priority: 'low', assignee: 'Jan Fischer', source: 'Cold Outreach',
    createdAt: '2026-02-19', updatedAt: '2026-02-19', value: 1250, notes: '',
    companyName: 'EnergyCheck Solutions', gewerk: 'Energieberater',
    contactPerson: 'Michael Braun', position: 'Geschäftsführer',
    phone: '+49 221 5556677', email: 'braun@energycheck.de',
    website: 'www.energycheck.de', region: 'NRW',
    companySize: '10-50', partnerStatus: 'Interessent',
  },
  {
    id: '8', type: 'b2b', status: 'b2b_contact', priority: 'medium', assignee: 'Lisa Weber', source: 'Partner',
    createdAt: '2026-02-12', updatedAt: '2026-02-18', value: 1250, notes: '',
    companyName: 'DachTech GmbH', gewerk: 'Dachdecker',
    contactPerson: 'Eva Schulz', position: 'Projektleiterin',
    phone: '+49 40 2223344', email: 'schulz@dachtech.de',
    website: 'www.dachtech.de', region: 'Hamburg / Schleswig-Holstein',
    companySize: '50-100', partnerStatus: 'Aktiver Partner',
  },
  {
    id: '10', type: 'b2b', status: 'b2b_negotiation', priority: 'high', assignee: 'Max Müller', source: 'Webinar',
    createdAt: '2026-02-05', updatedAt: '2026-02-19', value: 1250, notes: '',
    companyName: 'Projektbau Süd GmbH', gewerk: 'Projektentwickler',
    contactPerson: 'Robert Lang', position: 'Einkaufsleiter',
    phone: '+49 711 6667788', email: 'lang@projektbau-sued.de',
    website: 'www.projektbau-sued.de', region: 'Baden-Württemberg',
    companySize: '100-200', partnerStatus: 'Interessent',
  },
  {
    id: '13', type: 'b2b', status: 'b2b_won', priority: 'high', assignee: 'Lisa Weber', source: 'Empfehlung',
    createdAt: '2026-01-15', updatedAt: '2026-02-01', value: 1250, notes: 'Mitgliedschaft aktiv seit 01.02.2026',
    companyName: 'SHK Meisterbetrieb Weber', gewerk: 'SHK',
    contactPerson: 'Frank Weber', position: 'Inhaber',
    phone: '+49 69 7778899', email: 'weber@shk-weber.de',
    website: 'www.shk-weber.de', region: 'Hessen',
    companySize: '10-20', partnerStatus: 'Aktiver Partner',
  },
  {
    id: '14', type: 'b2b', status: 'b2b_followup', priority: 'medium', assignee: 'Max Müller', source: 'LinkedIn',
    createdAt: '2026-02-14', updatedAt: '2026-02-19', value: 1250, notes: 'Nächste Woche nochmal anrufen',
    companyName: 'Elektro Schmidt GmbH', gewerk: 'Elektriker',
    contactPerson: 'Jürgen Schmidt', position: 'Geschäftsführer',
    phone: '+49 351 1234567', email: 'j.schmidt@elektro-schmidt.de',
    website: 'www.elektro-schmidt.de', region: 'Sachsen',
    companySize: '20-50', partnerStatus: 'Interessent',
  },
  {
    id: '15', type: 'b2b', status: 'b2b_demo', priority: 'high', assignee: 'Lisa Weber', source: 'Messe',
    createdAt: '2026-02-11', updatedAt: '2026-02-18', value: 1250, notes: 'Demo am 20.02. geplant',
    companyName: 'Maler Krause & Söhne', gewerk: 'Maler',
    contactPerson: 'Andreas Krause', position: 'Geschäftsführer',
    phone: '+49 511 8889900', email: 'krause@maler-krause.de',
    website: 'www.maler-krause.de', region: 'Niedersachsen',
    companySize: '10-20', partnerStatus: 'Interessent',
  },
];
