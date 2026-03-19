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
  error: string | null;
  unreadCount: () => number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearError: () => void;
  hydrateFromDB: (notifications: Notification[]) => void;
}

function getUserId(): string | null {
  return useUserStore.getState().userId;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  error: null,

  hydrateFromDB: (notifications) => set({ notifications }),

  clearError: () => set({ error: null }),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  markAsRead: (id) => {
    const prev = get().notifications;
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      error: null,
    }));
    markNotificationRead(id).catch(() => {
      set({ notifications: prev, error: "Failed to mark notification as read" });
    });
  },

  markAllAsRead: () => {
    const prev = get().notifications;
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      error: null,
    }));
    const userId = getUserId();
    if (userId) {
      markAllNotificationsRead(userId).catch(() => {
        set({ notifications: prev, error: "Failed to mark notifications as read" });
      });
    }
  },
}));
