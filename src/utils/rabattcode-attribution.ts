// Shared Rabattcode attribution data for VP provisioning
// Links VP's Rabattcodes to their registrations/inserate across the system

export interface RabattCode {
  id: string;
  code: string;
  type: "developer" | "customer";
  rabattProzent: number;
  nutzungen: number;
  zahlend: number;
  promo: number;
  mitarbeiterId?: string;
}

// Central code registry – single source of truth
export const RABATT_CODES: RabattCode[] = [
  { id: "1", code: "K4P4", type: "customer", rabattProzent: 0, nutzungen: 14, zahlend: 8, promo: 6, mitarbeiterId: "u3" },
  { id: "2", code: "H991", type: "developer", rabattProzent: 25, nutzungen: 5, zahlend: 3, promo: 2, mitarbeiterId: "u3" },
  { id: "3", code: "5Y31", type: "developer", rabattProzent: 10, nutzungen: 7, zahlend: 4, promo: 3, mitarbeiterId: "u1" },
  { id: "4", code: "27J5", type: "developer", rabattProzent: 20, nutzungen: 3, zahlend: 2, promo: 1, mitarbeiterId: "u1" },
  { id: "5", code: "178D", type: "developer", rabattProzent: 50, nutzungen: 2, zahlend: 1, promo: 1, mitarbeiterId: "u2" },
  { id: "6", code: "6L7Y", type: "developer", rabattProzent: 30, nutzungen: 4, zahlend: 2, promo: 2, mitarbeiterId: "u3" },
  { id: "7", code: "B8N8", type: "developer", rabattProzent: 100, nutzungen: 1, zahlend: 0, promo: 1, mitarbeiterId: "u2" },
  { id: "8", code: "J9B3", type: "developer", rabattProzent: 25, nutzungen: 6, zahlend: 4, promo: 2, mitarbeiterId: "u3" },
  { id: "9", code: "J12Q", type: "developer", rabattProzent: 40, nutzungen: 2, zahlend: 1, promo: 1, mitarbeiterId: "u1" },
  { id: "10", code: "M3X7", type: "customer", rabattProzent: 0, nutzungen: 9, zahlend: 6, promo: 3, mitarbeiterId: "u4" },
  { id: "11", code: "R2D4", type: "developer", rabattProzent: 20, nutzungen: 3, zahlend: 2, promo: 1, mitarbeiterId: "u4" },
  { id: "12", code: "W8K2", type: "customer", rabattProzent: 0, nutzungen: 6, zahlend: 4, promo: 2, mitarbeiterId: "u2" },
];

export interface VPAttribution {
  userId: string;
  // Customer codes (B2C)
  customerCodes: RabattCode[];
  totalCustomerNutzungen: number;
  totalCustomerZahlend: number; // = abrechenbare Inserate
  totalCustomerPromo: number;
  // Developer codes (B2B)
  developerCodes: RabattCode[];
  totalDevNutzungen: number;
  totalDevZahlend: number; // = zahlende Mitgliedschaften
  totalDevPromo: number;
  // XP from code-based activities
  codeXP: number;
}

const B2B_MITGLIEDSCHAFT = 1250; // netto

export function getVPAttribution(userId: string): VPAttribution {
  const myCodes = RABATT_CODES.filter(c => c.mitarbeiterId === userId);
  const customerCodes = myCodes.filter(c => c.type === "customer");
  const developerCodes = myCodes.filter(c => c.type === "developer");

  const totalCustomerNutzungen = customerCodes.reduce((s, c) => s + c.nutzungen, 0);
  const totalCustomerZahlend = customerCodes.reduce((s, c) => s + c.zahlend, 0);
  const totalCustomerPromo = customerCodes.reduce((s, c) => s + c.promo, 0);

  const totalDevNutzungen = developerCodes.reduce((s, c) => s + c.nutzungen, 0);
  const totalDevZahlend = developerCodes.reduce((s, c) => s + c.zahlend, 0);
  const totalDevPromo = developerCodes.reduce((s, c) => s + c.promo, 0);

  // XP: 50 per customer inserat, 200 per developer registration
  const codeXP = totalCustomerZahlend * 50 + totalDevZahlend * 200;

  return {
    userId,
    customerCodes,
    totalCustomerNutzungen,
    totalCustomerZahlend,
    totalCustomerPromo,
    developerCodes,
    totalDevNutzungen,
    totalDevZahlend,
    totalDevPromo,
    codeXP,
  };
}

export function getAllVPAttributions(): VPAttribution[] {
  const vpIds = [...new Set(RABATT_CODES.map(c => c.mitarbeiterId).filter(Boolean))] as string[];
  return vpIds.map(id => getVPAttribution(id));
}

// Calculate provision from code-based registrations
export function getCodeBasedProvision(attr: VPAttribution, b2cRate: number, b2bRate: number): {
  b2cCodeProvision: number;
  b2bCodeProvision: number;
  totalCodeProvision: number;
} {
  const b2cCodeProvision = attr.totalCustomerZahlend * b2cRate;
  const b2bCodeProvision = attr.totalDevZahlend * (B2B_MITGLIEDSCHAFT * (b2bRate / 100));
  return {
    b2cCodeProvision,
    b2bCodeProvision,
    totalCodeProvision: b2cCodeProvision + b2bCodeProvision,
  };
}
