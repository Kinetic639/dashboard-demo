import { create } from 'zustand';
import { Notification } from '@/lib/types/notifications';
import { mockNotifications } from '@/lib/mock/notifications';

interface NotificationsState {
  notifications: Notification[];
  isDrawerOpen: boolean;
  unreadCount: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  discardNotification: (id: string) => void;
  getUnreadCount: () => number;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: mockNotifications,
  isDrawerOpen: false,
  unreadCount: mockNotifications.filter(n => !n.read).length,
  
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  
  markAsRead: (id: string) => set((state) => {
    const updatedNotifications = state.notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    return {
      notifications: updatedNotifications,
      unreadCount: updatedNotifications.filter(n => !n.read).length,
    };
  }),
  
  markAsUnread: (id: string) => set((state) => {
    const updatedNotifications = state.notifications.map(notification =>
      notification.id === id ? { ...notification, read: false } : notification
    );
    return {
      notifications: updatedNotifications,
      unreadCount: updatedNotifications.filter(n => !n.read).length,
    };
  }),
  
  discardNotification: (id: string) => set((state) => {
    const updatedNotifications = state.notifications.filter(notification => notification.id !== id);
    return {
      notifications: updatedNotifications,
      unreadCount: updatedNotifications.filter(n => !n.read).length,
    };
  }),
  
  getUnreadCount: () => get().unreadCount,
}));