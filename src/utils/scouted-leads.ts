import { Lead } from "@/data/crm-data";

const STORAGE_KEY = "scouted-leads";

export function getScoutedLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveScoutedLeads(leads: Lead[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  // Notify other components
  window.dispatchEvent(new Event("scouted-leads-updated"));
}

export function addScoutedLeads(newLeads: Lead[]) {
  const existing = getScoutedLeads();
  const existingIds = new Set(existing.map((l) => l.id));
  const toAdd = newLeads.filter((l) => !existingIds.has(l.id));
  saveScoutedLeads([...existing, ...toAdd]);
}
