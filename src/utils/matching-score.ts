/**
 * Deterministic Matching Score Calculator
 * 
 * Matches Entwickler profiles against Eigentümer inserat parameters.
 * No AI needed – pure weighted overlap calculation.
 * 
 * Matching dimensions (weights sum to 100):
 *  1. Objekttyp match       (25%)
 *  2. Sanierungsarten match (30%)
 *  3. Region match          (25%)
 *  4. Budget match          (10%)
 *  5. Zeitrahmen match      (10%)
 */

export interface EntwicklerMatchProfil {
  leistungsObjekttypen: string[];
  leistungsSanierungsarten: string[];
  leistungsRegionen: string[];
  budgetMin: string; // e.g. "<50k", "50-100k", ...
  budgetMax: string;
  verfuegbarkeit: string; // e.g. "sofort", "3-6", "6-12", "12+"
}

export interface InseratMatchProfil {
  objekttyp: string;
  geplanteEntwicklung: string[];
  region: string; // Bundesland / Region
  budgetRange: string;
  zeitrahmen: string;
}

const BUDGET_ORDER = ["<50k", "50-100k", "100-250k", "250-500k", ">500k", "unklar"];

function budgetIndex(val: string): number {
  const idx = BUDGET_ORDER.indexOf(val);
  return idx === -1 ? -1 : idx;
}

function calcObjekttypScore(entwickler: string[], inserat: string): number {
  if (!inserat || entwickler.length === 0) return 0;
  return entwickler.some(o => o.toLowerCase() === inserat.toLowerCase()) ? 1 : 0;
}

function calcSanierungScore(entwickler: string[], inserat: string[]): number {
  if (inserat.length === 0 || entwickler.length === 0) return 0;
  const matches = inserat.filter(s => entwickler.includes(s)).length;
  return matches / inserat.length;
}

function calcRegionScore(entwickler: string[], inseratRegion: string): number {
  if (!inseratRegion || entwickler.length === 0) return 0;
  // "Deutschlandweit" / "Österreichweit" / "Schweizweit" matches everything in that country
  if (entwickler.includes("Deutschlandweit") || entwickler.includes("Österreichweit") || entwickler.includes("Schweizweit") || entwickler.includes("DACH-weit")) return 1;
  return entwickler.some(r => r.toLowerCase() === inseratRegion.toLowerCase()) ? 1 : 0;
}

function calcBudgetScore(entwicklerMin: string, entwicklerMax: string, inseratBudget: string): number {
  if (!inseratBudget || inseratBudget === "unklar") return 0.5; // neutral
  const iIdx = budgetIndex(inseratBudget);
  const minIdx = budgetIndex(entwicklerMin);
  const maxIdx = budgetIndex(entwicklerMax);
  if (iIdx === -1 || minIdx === -1 || maxIdx === -1) return 0.5;
  return (iIdx >= minIdx && iIdx <= maxIdx) ? 1 : 0;
}

function calcZeitrahmenScore(entwicklerVerfuegbarkeit: string, inseratZeitrahmen: string): number {
  if (!inseratZeitrahmen || inseratZeitrahmen === "unklar" || !entwicklerVerfuegbarkeit) return 0.5;
  const ORDER = ["sofort", "3-6", "6-12", "12+"];
  const eIdx = ORDER.indexOf(entwicklerVerfuegbarkeit);
  const iIdx = ORDER.indexOf(inseratZeitrahmen);
  if (eIdx === -1 || iIdx === -1) return 0.5;
  // Perfect if entwickler is available at or before inserat wants
  if (eIdx <= iIdx) return 1;
  // Partial if only 1 step behind
  if (eIdx - iIdx === 1) return 0.5;
  return 0;
}

export function calculateMatchingScore(
  entwickler: EntwicklerMatchProfil,
  inserat: InseratMatchProfil
): number {
  const weights = { objekttyp: 25, sanierung: 30, region: 25, budget: 10, zeitrahmen: 10 };

  const scores = {
    objekttyp: calcObjekttypScore(entwickler.leistungsObjekttypen, inserat.objekttyp),
    sanierung: calcSanierungScore(entwickler.leistungsSanierungsarten, inserat.geplanteEntwicklung),
    region: calcRegionScore(entwickler.leistungsRegionen, inserat.region),
    budget: calcBudgetScore(entwickler.budgetMin, entwickler.budgetMax, inserat.budgetRange),
    zeitrahmen: calcZeitrahmenScore(entwickler.verfuegbarkeit, inserat.zeitrahmen),
  };

  const totalScore =
    scores.objekttyp * weights.objekttyp +
    scores.sanierung * weights.sanierung +
    scores.region * weights.region +
    scores.budget * weights.budget +
    scores.zeitrahmen * weights.zeitrahmen;

  return Math.round(totalScore); // 0-100
}

// All DACH regions for dropdown
export const DACH_LAENDER: { land: string; regionen: string[] }[] = [
  {
    land: "Deutschland",
    regionen: [
      "Deutschlandweit", "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
      "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
      "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
      "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen",
    ],
  },
  {
    land: "Österreich",
    regionen: [
      "Österreichweit", "Burgenland", "Kärnten", "Niederösterreich", "Oberösterreich",
      "Salzburg", "Steiermark", "Tirol", "Vorarlberg", "Wien",
    ],
  },
  {
    land: "Schweiz",
    regionen: [
      "Schweizweit", "Aargau", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "Basel-Landschaft",
      "Basel-Stadt", "Bern", "Freiburg", "Genf", "Glarus", "Graubünden",
      "Jura", "Luzern", "Neuenburg", "Nidwalden", "Obwalden", "Schaffhausen",
      "Schwyz", "Solothurn", "St. Gallen", "Tessin", "Thurgau", "Uri",
      "Waadt", "Wallis", "Zug", "Zürich",
    ],
  },
];

// Flat list for backward compat
export const DACH_REGIONEN = [...DACH_LAENDER.flatMap(l => l.regionen), "DACH-weit"];
