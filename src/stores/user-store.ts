"use client";

import { create } from "zustand";
import { UserProfile } from "@/types";
import { updateUserProfile } from "@/actions/user-actions";

interface UserState {
  userId: string | null;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  clearProfile: () => void;
  hydrateFromDB: (profile: UserProfile) => void;
}

export const useUserStore = create<UserState>()((set, get) => ({
  userId: null,
  profile: null,

  hydrateFromDB: (profile) => set({ userId: profile.id, profile }),

  setProfile: (profile) => {
    set({ userId: profile.id, profile });
    updateUserProfile(profile.id, profile).catch(console.error);
  },

  updateProfile: (data) => {
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...data } : null,
    }));
    const { userId } = get();
    if (userId) {
      updateUserProfile(userId, data).catch(console.error);
    }
  },

  clearProfile: () => set({ userId: null, profile: null }),
}));
