import { useContext } from 'react';
import { NotificationContext } from '@/contexts/NotificationContext';
import type { NotificationContextType } from '@/contexts/NotificationContext';

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
