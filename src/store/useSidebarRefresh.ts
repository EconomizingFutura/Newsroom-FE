import { create } from "zustand";

interface SidebarRefreshState {
  refreshToken: number;
  triggerRefresh: () => void;
}

export const useSidebarRefresh = create<SidebarRefreshState>((set) => ({
  refreshToken: 0,
  triggerRefresh: () => set((s) => ({ refreshToken: s.refreshToken + 1 })),
}));
