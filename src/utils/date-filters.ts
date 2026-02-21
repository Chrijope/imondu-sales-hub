import {
  startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, subMonths,
  startOfYear, isWithinInterval, parseISO,
} from "date-fns";

export const TIME_RANGE_OPTIONS = [
  "Heute",
  "Letzte 7 Tage",
  "Letzte 30 Tage",
  "Aktueller Monat",
  "Vorheriger Monat",
  "Letzte 3 Monate",
  "Letzte 12 Monate",
  "Aktuelles Jahr",
  "Seit Anfang",
  "Individuell",
] as const;

export type TimeRangeKey = (typeof TIME_RANGE_OPTIONS)[number];

export interface DateRange {
  from: Date;
  to: Date;
}

/** Compute a concrete DateRange from a named time range key, relative to `today`. */
export function getDateRange(key: TimeRangeKey, today: Date = new Date()): DateRange | null {
  const t = endOfDay(today);

  switch (key) {
    case "Heute":
      return { from: startOfDay(today), to: t };
    case "Letzte 7 Tage":
      return { from: startOfDay(subDays(today, 6)), to: t };
    case "Letzte 30 Tage":
      return { from: startOfDay(subDays(today, 29)), to: t };
    case "Aktueller Monat":
      return { from: startOfMonth(today), to: endOfMonth(today) };
    case "Vorheriger Monat": {
      const prev = subMonths(today, 1);
      return { from: startOfMonth(prev), to: endOfMonth(prev) };
    }
    case "Letzte 3 Monate":
      return { from: startOfDay(subMonths(today, 3)), to: t };
    case "Letzte 12 Monate":
      return { from: startOfDay(subMonths(today, 12)), to: t };
    case "Aktuelles Jahr":
      return { from: startOfYear(today), to: t };
    case "Seit Anfang":
      return null; // no filter
    case "Individuell":
      return null; // handled externally via custom range
    default:
      return null;
  }
}

/** Check whether a date string (ISO) falls within a DateRange. Returns true if range is null (= no filter). */
export function isInRange(dateStr: string, range: DateRange | null): boolean {
  if (!range) return true;
  try {
    const d = parseISO(dateStr);
    return isWithinInterval(d, { start: range.from, end: range.to });
  } catch {
    return true;
  }
}
