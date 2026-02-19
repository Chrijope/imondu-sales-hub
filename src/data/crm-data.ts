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
  // B2C fields
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  // B2B fields
  companyName?: string;
  industry?: string;
  contactPerson?: string;
  position?: string;
  companySize?: string;
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

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'new', name: 'Neuer Lead', order: 0, color: 'hsl(220 10% 46%)' },
  { id: 'contact', name: 'Kontaktversuch', order: 1, color: 'hsl(210 80% 52%)' },
  { id: 'qualified', name: 'Qualifiziert', order: 2, color: 'hsl(250 60% 52%)' },
  { id: 'offer', name: 'Angebot erstellt', order: 3, color: 'hsl(38 92% 50%)' },
  { id: 'negotiation', name: 'Verhandlung', order: 4, color: 'hsl(340 75% 55%)' },
  { id: 'won', name: 'Gewonnen', order: 5, color: 'hsl(152 60% 42%)' },
  { id: 'lost', name: 'Verloren', order: 6, color: 'hsl(0 72% 51%)' },
];

export const SAMPLE_LEADS: Lead[] = [
  { id: '1', type: 'b2c', status: 'new', priority: 'high', assignee: 'Max Müller', source: 'Website', createdAt: '2026-02-18', updatedAt: '2026-02-18', value: 2500, notes: '', firstName: 'Anna', lastName: 'Schmidt', phone: '+49 170 1234567', email: 'anna@email.de', address: 'Berlin' },
  { id: '2', type: 'b2b', status: 'qualified', priority: 'high', assignee: 'Lisa Weber', source: 'LinkedIn', createdAt: '2026-02-15', updatedAt: '2026-02-17', value: 45000, notes: '', companyName: 'TechVision GmbH', industry: 'Software', contactPerson: 'Dr. Thomas Bauer', position: 'CTO', phone: '+49 30 9876543', email: 'bauer@techvision.de', companySize: '50-200', decisionStatus: 'Evaluierung' },
  { id: '3', type: 'b2c', status: 'contact', priority: 'medium', assignee: 'Max Müller', source: 'Empfehlung', createdAt: '2026-02-16', updatedAt: '2026-02-18', value: 3200, notes: '', firstName: 'Peter', lastName: 'Klein', phone: '+49 151 7654321', email: 'peter.klein@web.de', address: 'München' },
  { id: '4', type: 'b2b', status: 'offer', priority: 'high', assignee: 'Lisa Weber', source: 'Messe', createdAt: '2026-02-10', updatedAt: '2026-02-17', value: 120000, notes: '', companyName: 'InnoWare AG', industry: 'Manufacturing', contactPerson: 'Sandra Meier', position: 'VP Sales', phone: '+49 89 1112233', email: 'meier@innoware.de', companySize: '200-500', decisionStatus: 'Angebot prüfend' },
  { id: '5', type: 'b2c', status: 'negotiation', priority: 'medium', assignee: 'Jan Fischer', source: 'Google Ads', createdAt: '2026-02-08', updatedAt: '2026-02-16', value: 4800, notes: '', firstName: 'Maria', lastName: 'Hoffmann', phone: '+49 160 3334455', email: 'maria.h@gmail.com', address: 'Hamburg' },
  { id: '6', type: 'b2b', status: 'new', priority: 'low', assignee: 'Jan Fischer', source: 'Cold Outreach', createdAt: '2026-02-19', updatedAt: '2026-02-19', value: 25000, notes: '', companyName: 'DataFlow Solutions', industry: 'IT Services', contactPerson: 'Michael Braun', position: 'Geschäftsführer', phone: '+49 221 5556677', email: 'braun@dataflow.de', companySize: '10-50' },
  { id: '7', type: 'b2c', status: 'won', priority: 'high', assignee: 'Max Müller', source: 'Website', createdAt: '2026-01-20', updatedAt: '2026-02-14', value: 5500, notes: '', firstName: 'Klaus', lastName: 'Wagner', phone: '+49 172 8889900', email: 'k.wagner@outlook.de', address: 'Frankfurt' },
  { id: '8', type: 'b2b', status: 'contact', priority: 'medium', assignee: 'Lisa Weber', source: 'Partner', createdAt: '2026-02-12', updatedAt: '2026-02-18', value: 67000, notes: '', companyName: 'CloudPeak Systems', industry: 'Cloud Computing', contactPerson: 'Eva Schulz', position: 'Head of IT', phone: '+49 40 2223344', email: 'schulz@cloudpeak.io', companySize: '100-200' },
  { id: '9', type: 'b2c', status: 'lost', priority: 'low', assignee: 'Jan Fischer', source: 'Social Media', createdAt: '2026-01-25', updatedAt: '2026-02-10', value: 1800, notes: 'Kein Budget', firstName: 'Sophie', lastName: 'Becker', phone: '+49 176 4445566', email: 'sophie.b@email.de', address: 'Köln' },
  { id: '10', type: 'b2b', status: 'negotiation', priority: 'high', assignee: 'Max Müller', source: 'Webinar', createdAt: '2026-02-05', updatedAt: '2026-02-19', value: 89000, notes: '', companyName: 'GreenEnergy Corp', industry: 'Energie', contactPerson: 'Robert Lang', position: 'Einkaufsleiter', phone: '+49 711 6667788', email: 'lang@greenenergy.de', companySize: '500+', decisionStatus: 'Finale Verhandlung' },
];
