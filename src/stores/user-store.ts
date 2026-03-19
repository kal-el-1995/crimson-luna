"use client";

import { create } from "zustand";
import { UserProfile } from "@/types";
import { updateUserProfile } from "@/actions/user-actions";

interface UserState {
  userId: string | null;
  profile: UserProfile | null;
  error: string | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  clearProfile: () => void;
  clearError: () => void;
  hydrateFromDB: (profile: UserProfile) => void;
}

export const useUserStore = create<UserState>()((set, get) => ({
  userId: null,
  profile: null,
  error: null,

  hydrateFromDB: (profile) => set({ userId: profile.id, profile }),

  clearError: () => set({ error: null }),

  setProfile: (profile) => {
    const prev = get().profile;
    set({ userId: profile.id, profile, error: null });
    updateUserProfile(profile.id, profile).catch(() => {
      set({ profile: prev, error: "Failed to save profile" });
    });
  },

  updateProfile: (data) => {
    const prev = get().profile;
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...data } : null,
      error: null,
    }));
    const { userId } = get();
    if (userId) {
      updateUserProfile(userId, data).catch(() => {
        set({ profile: prev, error: "Failed to save profile" });
      });
    }
  },

  clearProfile: () => set({ userId: null, profile: null, error: null }),
}));
