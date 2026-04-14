import { create } from 'zustand'

interface AppState {
  // Global state properties
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  isMenuOpen: false,
  setIsMenuOpen: (open) => set({ isMenuOpen: open }),
}))
