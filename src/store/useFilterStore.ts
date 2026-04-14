import { create } from 'zustand'

export type PropertyType = 'House' | 'Apartment' | 'Penthouse' | 'Villa' | 'Land'
export type PropertyStatus = 'For Sale' | 'For Rent' | 'Sold' | 'Pending'

interface FilterState {
  type: PropertyType | 'Any'
  status: PropertyStatus | 'Any'
  priceMin: string
  priceMax: string

  // Computed query params
  getQueryParams: () => Record<string, string>

  // Actions
  setType: (type: PropertyType | 'Any') => void
  setStatus: (status: PropertyStatus | 'Any') => void
  setPriceMin: (price: string) => void
  setPriceMax: (price: string) => void
  resetFilters: () => void

  // Check if any filter is active
  hasActiveFilters: () => boolean
}

export const useFilterStore = create<FilterState>((set, get) => ({
  type: 'Any',
  status: 'Any',
  priceMin: '',
  priceMax: '',

  getQueryParams: () => {
    const state = get()
    const params: Record<string, string> = {}

    if (state.type !== 'Any') {
      params.type = state.type
    }
    if (state.status !== 'Any') {
      params.status = state.status
    }
    if (state.priceMin) {
      params.priceMin = state.priceMin
    }
    if (state.priceMax) {
      params.priceMax = state.priceMax
    }

    return params
  },

  setType: (type) => set({ type }),
  setStatus: (status) => set({ status }),
  setPriceMin: (priceMin) => set({ priceMin }),
  setPriceMax: (priceMax) => set({ priceMax }),

  resetFilters: () => set({
    type: 'Any',
    status: 'Any',
    priceMin: '',
    priceMax: '',
  }),

  hasActiveFilters: () => {
    const state = get()
    return (
      state.type !== 'Any' ||
      state.status !== 'Any' ||
      state.priceMin !== '' ||
      state.priceMax !== ''
    )
  },
}))
