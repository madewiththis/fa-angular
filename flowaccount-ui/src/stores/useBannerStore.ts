import { create } from "zustand";

interface BannerState {
  isBannerVisible: boolean;
  setIsBannerVisible: (isVisible: boolean) => void;
}

export const useBannerStore = create<BannerState>((set) => ({
  isBannerVisible: false,
  setIsBannerVisible: (isVisible) => set({ isBannerVisible: isVisible }),
}));
