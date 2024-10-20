import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isCollapsed: boolean;
  isLoading: boolean;
  toggleCollapsed: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: true,
      isLoading: true,
      toggleCollapsed: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),
    }),
    {
      name: "sidebar-storage", // unique name for the storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    },
  ),
);