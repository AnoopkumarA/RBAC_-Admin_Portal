import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Notification } from '../types';

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'New User Registration',
    message: 'John Doe has registered as a new user',
    type: 'info',
    read: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Role Updated',
    message: 'Editor role permissions have been modified',
    type: 'warning',
    read: false,
    createdAt: new Date(),
  },
];

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    setNotifications(prev => [
      {
        ...notification,
        id: String(prev.length + 1),
        createdAt: new Date(),
      },
      ...prev,
    ]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}