import { createContext } from 'react';

export interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: 'revision' | 'approved' | 'assigned' | 'comment' | 'contract' | 'content' | 'upload' | 'general';
}

export interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  refetchNotifications: () => Promise<void>;
  refetchUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
