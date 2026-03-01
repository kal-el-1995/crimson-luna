"use client";

import { create } from "zustand";
import { Notification } from "@/types";
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/actions/notification-actions";
import { useUserStore } from "@/stores/user-store";

interface NotificationState {
  notifications: Notification[];
  unreadCount: () => number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  hydrateFromDB: (notifications: Notification[]) => void;
}

function getUserId(): string | null {
  return useUserStore.getState().userId;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],

  hydrateFromDB: (notifications) => set({ notifications }),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
    markNotificationRead(id).catch(console.error);
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
    const userId = getUserId();
    if (userId) markAllNotificationsRead(userId).catch(console.error);
  },
}));
