import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
  getNotificationsApi,
  getUnreadCountApi,
  markAsReadApi,
  markAllAsReadApi,
  deleteNotificationApi,
  type BackendNotification,
} from '@/features/notifications/api/notificationsApi';
import { NotificationContext, type NotificationItem } from './NotificationContext';
import { useAuth } from '@/hooks/useAuth';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Helper function to format created_at to a relative time string
  const formatTime = (dateStr: string): string => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  // Mapper function to map backend notifications to frontend models
  const mapNotification = (n: BackendNotification): NotificationItem => {
    let type: 'revision' | 'approved' | 'assigned' | 'comment' | 'contract' | 'content' | 'upload' | 'general' = 'general';
    const titleLower = n.title.toLowerCase();

    if (titleLower.includes('revisi') || titleLower.includes('revision')) {
      type = 'revision';
    } else if (titleLower.includes('approved') || titleLower.includes('setuju') || titleLower.includes('disetujui')) {
      type = 'approved';
    } else if (n.source_type === 'task_output' || titleLower.includes('unggah') || titleLower.includes('upload')) {
      type = 'upload';
    } else if (n.source_type === 'task_comment' || titleLower.includes('komentar') || titleLower.includes('comment')) {
      type = 'comment';
    } else if (n.source_type === 'contract' || titleLower.includes('kontrak') || titleLower.includes('contract')) {
      type = 'contract';
    } else if (n.source_type === 'content_review' || titleLower.includes('konten') || titleLower.includes('content')) {
      type = 'content';
    } else if (n.source_type === 'task' || titleLower.includes('task') || titleLower.includes('tugas') || titleLower.includes('ditugaskan')) {
      type = 'assigned';
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

  // Query notifications list
  const {
    data: backendNotifications = [],
    isLoading: isLoadingList,
    refetch: refetchNotifications,
  } = useQuery<BackendNotification[]>({
    queryKey: ['notifications'],
    queryFn: () => getNotificationsApi(),
    enabled: isAuthenticated,
  });

  // Query unread notifications count (poll every 30 seconds)
  const {
    data: unreadCount = 0,
    isLoading: isLoadingCount,
    refetch: refetchUnreadCount,
  } = useQuery<number>({
    queryKey: ['unreadCount'],
    queryFn: getUnreadCountApi,
    refetchInterval: isAuthenticated ? 30_000 : false,
    enabled: isAuthenticated,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markAsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: deleteNotificationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });

  const markAsRead = async (id: number) => {
    await markAsReadMutation.mutateAsync(id);
  };

  const markAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync();
  };

  const deleteNotification = async (id: number) => {
    await deleteNotificationMutation.mutateAsync(id);
  };

  const notifications = backendNotifications.map(mapNotification);
  const isLoading = isLoadingList || isLoadingCount;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        refetchNotifications: async () => {
          await refetchNotifications();
        },
        refetchUnreadCount: async () => {
          await refetchUnreadCount();
        },
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
