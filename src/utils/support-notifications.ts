// Utility for bidirectional Support-KI ↔ Helpdesk notifications

const SUPPORT_TICKETS_KEY = "support-ki-tracked-tickets";
const SUPPORT_UNREAD_KEY = "support-ki-unread-count";
const HELPDESK_UNREAD_KEY = "helpdesk-unread-count";

export interface TrackedTicket {
  id: string;
  betreff: string;
  status: string;
  lastSupportMsgCount: number;
  lastKundeMsgCount: number;
}

// ── Tracked Tickets (for Support-KI persistence across remounts) ──

export function getTrackedTickets(): TrackedTicket[] {
  try {
    return JSON.parse(localStorage.getItem(SUPPORT_TICKETS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveTrackedTickets(tickets: TrackedTicket[]) {
  localStorage.setItem(SUPPORT_TICKETS_KEY, JSON.stringify(tickets));
}

// ── Unread Counts ──

export function getSupportUnreadCount(): number {
  try {
    return parseInt(localStorage.getItem(SUPPORT_UNREAD_KEY) || "0", 10);
  } catch {
    return 0;
  }
}

export function setSupportUnreadCount(count: number) {
  localStorage.setItem(SUPPORT_UNREAD_KEY, String(count));
  window.dispatchEvent(new Event("storage"));
}

export function incrementSupportUnread(by = 1) {
  setSupportUnreadCount(getSupportUnreadCount() + by);
}

export function clearSupportUnread() {
  setSupportUnreadCount(0);
}

export function getHelpdeskUnreadCount(): number {
  try {
    return parseInt(localStorage.getItem(HELPDESK_UNREAD_KEY) || "0", 10);
  } catch {
    return 0;
  }
}

export function setHelpdeskUnreadCount(count: number) {
  localStorage.setItem(HELPDESK_UNREAD_KEY, String(count));
  window.dispatchEvent(new Event("storage"));
}

export function incrementHelpdeskUnread(by = 1) {
  setHelpdeskUnreadCount(getHelpdeskUnreadCount() + by);
}

export function clearHelpdeskUnread() {
  setHelpdeskUnreadCount(0);
}

// ── Hook helper to listen for changes ──
export function useUnreadListener(callback: () => void) {
  // Call this in useEffect with storage + focus listeners
  return callback;
}
