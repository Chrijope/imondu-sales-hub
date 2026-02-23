// Chat notification system – stores pending system messages for specific chat targets

const CHAT_NOTIFICATIONS_KEY = "chat-system-notifications";

export interface ChatNotification {
  id: string;
  targetChatId: string; // e.g. "bew-admin-1" for Bewerber, or a user-specific chat
  targetRole?: string; // optional role filter (e.g. "bewerber", "vertriebspartner")
  text: string;
  sender: string;
  senderInitials: string;
  timestamp: string;
  type: "onboarding-einladung" | "dokument-freigabe" | "dokument-abgelehnt" | "system";
}

export function getChatNotifications(): ChatNotification[] {
  try {
    return JSON.parse(localStorage.getItem(CHAT_NOTIFICATIONS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addChatNotification(notification: Omit<ChatNotification, "id" | "timestamp">) {
  const notifications = getChatNotifications();
  notifications.push({
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
  });
  localStorage.setItem(CHAT_NOTIFICATIONS_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new Event("storage"));
}

export function consumeChatNotifications(targetChatId?: string, targetRole?: string): ChatNotification[] {
  const all = getChatNotifications();
  const matched = all.filter(
    (n) =>
      (targetChatId && n.targetChatId === targetChatId) ||
      (targetRole && n.targetRole === targetRole)
  );
  const remaining = all.filter((n) => !matched.includes(n));
  localStorage.setItem(CHAT_NOTIFICATIONS_KEY, JSON.stringify(remaining));
  return matched;
}

export function clearChatNotifications() {
  localStorage.removeItem(CHAT_NOTIFICATIONS_KEY);
}
