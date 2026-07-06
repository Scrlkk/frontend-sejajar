import { create } from "zustand";
import { formatDistanceToNow } from "date-fns";
import {
  getNotificationsApi,
  getUnreadCountApi,
  markAsReadApi,
  markAllAsReadApi,
  deleteNotificationApi,
  type BackendNotification,
} from "@/features/notifications/api/notificationsApi";
export interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: "revision" | "approved" | "assigned" | "comment" | "contract" | "content" | "upload" | "general";
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
}

const formatTime = (dateStr: string): string => {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "";
  }
};

const mapNotification = (n: BackendNotification): NotificationItem => {
  let type: "revision" | "approved" | "assigned" | "comment" | "contract" | "content" | "upload" | "general" = "general";
  const titleLower = n.title.toLowerCase();

  if (titleLower.includes("revisi") || titleLower.includes("revision")) {
    type = "revision";
  } else if (titleLower.includes("approved") || titleLower.includes("setuju") || titleLower.includes("disetujui")) {
    type = "approved";
  } else if (n.source_type === "task_output" || titleLower.includes("unggah") || titleLower.includes("upload")) {
    type = "upload";
  } else if (n.source_type === "task_comment" || titleLower.includes("komentar") || titleLower.includes("comment")) {
    type = "comment";
  } else if (n.source_type === "contract" || titleLower.includes("kontrak") || titleLower.includes("contract")) {
    type = "contract";
  } else if (n.source_type === "content_review" || titleLower.includes("konten") || titleLower.includes("content")) {
    type = "content";
  } else if (n.source_type === "task" || titleLower.includes("task") || titleLower.includes("tugas") || titleLower.includes("ditugaskan")) {
    type = "assigned";
  }

  return {
    id: n.id,
    title: n.title,
    description: n.message,
    time: formatTime(n.created_at),
    isRead: n.is_read,
    type,
  };
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const [notificationsData, countData] = await Promise.all([
        getNotificationsApi().catch(() => [] as BackendNotification[]),
        getUnreadCountApi().catch(() => 0),
      ]);
      set({
        notifications: notificationsData.map(mapNotification),
        unreadCount: countData,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: number) => {
    try {
      await markAsReadApi(id);
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  },

  markAllAsRead: async () => {
    try {
      await markAllAsReadApi();
      set((state) => ({
        notifications: state.notifications.map((notif) => ({
          ...notif,
          isRead: true,
        })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  },

  deleteNotification: async (id: number) => {
    try {
      const target = get().notifications.find((n) => n.id === id);
      const isUnread = target ? !target.isRead : false;

      await deleteNotificationApi(id);
      set((state) => ({
        notifications: state.notifications.filter((notif) => notif.id !== id),
        unreadCount: isUnread
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      }));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  },
}));
