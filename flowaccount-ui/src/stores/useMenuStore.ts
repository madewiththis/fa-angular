import { create } from "zustand";

interface MenuState {
  isMenuCollapsed: boolean;
  setIsMenuCollapsed: (isCollapsed: boolean) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  isMenuCollapsed: false,
  setIsMenuCollapsed: (isCollapsed) => set({ isMenuCollapsed: isCollapsed }),
}));
