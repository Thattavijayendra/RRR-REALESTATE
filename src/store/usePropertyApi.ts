import { create } from 'zustand'
import { useDealerStore } from './useDealerStore'

export interface PropertyImage {
  url: string
  caption?: string
  isPrimary?: boolean
}

export interface PropertyVideo {
  url: string
  provider?: 'youtube' | 'vimeo' | 'direct'
}

export interface PropertyData {
  title: string
  description: string
  type: 'House' | 'Apartment' | 'Penthouse' | 'Villa' | 'Land'
  price: number
  area: number
  status: 'For Sale' | 'For Rent' | 'Sold' | 'Pending'
  beds?: number
  baths?: number
  location: {
    address: string
    city: string
    state?: string
    zipCode?: string
  }
  images: PropertyImage[]
  video?: PropertyVideo
  amenities?: string[]
  isChanceProperty: boolean
  featured: boolean
  yearBuilt?: number
  parkingSpaces?: number
  hasGarage?: boolean
  hasPool?: boolean
  hasGarden?: boolean
  hasElevator?: boolean
  isFurnished?: boolean
  petFriendly?: boolean
}

interface PropertyState {
  properties: any[]
  allProperties: any[]
  isLoading: boolean
  error: string | null
  success: string | null
  fetchProperties: (queryParams?: Record<string, string>) => Promise<void>
  createProperty: (data: PropertyData) => Promise<void>
  updateProperty: (id: string, data: Partial<PropertyData>) => Promise<void>
  uploadImages: (files: File[]) => Promise<string[]>
  uploadVideo: (file: File) => Promise<string>
  deleteProperty: (id: string) => Promise<void>
  toggleStatus: (id: string) => Promise<void>
  clearError: () => void
  clearSuccess: () => void
}

const API_URL = import.meta.env.VITE_API_URL

export const usePropertyApi = create<PropertyState>((set) => ({
  properties: [],
  allProperties: [],
  isLoading: false,
  error: null,
  success: null,

  fetchProperties: async (queryParams?: Record<string, string>) => {
    set({ isLoading: true, error: null })

    // Build URL with query params
    const url = new URL(`${API_URL}/properties`)
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value)
      })
    }

    try {
      const res = await fetch(url.toString())
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch properties')
      }

      set({
        properties: data.data.map((property: any) => ({
          ...property,
          sqft: property.area, // Map area to sqft for frontend compatibility
        })),
        allProperties: data.data.map((property: any) => ({
          ...property,
          sqft: property.area, // Map area to sqft for frontend compatibility
        })),
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch properties',
        isLoading: false,
      })
    }
  },

  uploadImages: async (files: File[]) => {
    const token = useDealerStore.getState().token
    if (!token) throw new Error('Not authenticated')

    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))

    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/uploads/images`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to upload images')
      }

      set({ isLoading: false })
      return responseData.data.map((item: any) => item.url)
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to upload images',
        isLoading: false,
      })
      throw error
    }
  },

  uploadVideo: async (file: File) => {
    const token = useDealerStore.getState().token
    if (!token) throw new Error('Not authenticated')

    const formData = new FormData()
    formData.append('video', file)

    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/uploads/video`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to upload video')
      }

      set({ isLoading: false })
      return responseData.data.url
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to upload video',
        isLoading: false,
      })
      throw error
    }
  },

  createProperty: async (data: PropertyData) => {
    const token = useDealerStore.getState().token
    if (!token) throw new Error('Not authenticated')

    set({ isLoading: true, error: null, success: null })

    // Build request body - only include non-empty values
    const requestBody: Record<string, any> = {
      title: data.title.trim(),
      description: data.description.trim(),
      type: data.type,
      price: data.price,
      area: data.area,
      status: data.status,
      location: {
        address: data.location.address.trim(),
        city: data.location.city.trim(),
        state: data.location.state?.trim() || '',
        zipCode: data.location.zipCode?.trim() || '',
      },
    }

    // Optional fields
    if (data.beds !== undefined && data.beds > 0) {
      requestBody.beds = data.beds
    }
    if (data.baths !== undefined && data.baths > 0) {
      requestBody.baths = data.baths
    }
    if (data.amenities && data.amenities.length > 0) {
      requestBody.amenities = data.amenities
    }
    if (data.images && data.images.length > 0) {
      requestBody.images = data.images
    }
    if (data.video?.url) {
      requestBody.video = data.video
    }
    if (data.yearBuilt) {
      requestBody.yearBuilt = data.yearBuilt
    }
    if (data.parkingSpaces) {
      requestBody.parkingSpaces = data.parkingSpaces
    }

    // Boolean flags
    requestBody.isChanceProperty = data.isChanceProperty
    requestBody.featured = data.featured
    requestBody.hasGarage = data.hasGarage || false
    requestBody.hasPool = data.hasPool || false
    requestBody.hasGarden = data.hasGarden || false
    requestBody.hasElevator = data.hasElevator || false
    requestBody.isFurnished = data.isFurnished || false
    requestBody.petFriendly = data.petFriendly || false

    try {
      const res = await fetch(`${API_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to create property')
      }

      set((state) => ({
        properties: [responseData.data, ...state.properties],
        isLoading: false,
        success: 'Property created successfully!',
      }))

      return responseData.data
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create property',
        isLoading: false,
      })
      throw error
    }
  },

  updateProperty: async (id: string, data: Partial<PropertyData>) => {
    const token = useDealerStore.getState().token
    if (!token) throw new Error('Not authenticated')

    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to update property')
      }

      set((state) => ({
        properties: state.properties.map((p) =>
          p._id === id ? responseData.data : p
        ),
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update',
        isLoading: false,
      })
      throw error
    }
  },

  deleteProperty: async (id: string) => {
    const token = useDealerStore.getState().token
    if (!token) throw new Error('Not authenticated')

    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete property')
      }

      set((state) => ({
        properties: state.properties.filter((p) => p._id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete',
        isLoading: false,
      })
      throw error
    }
  },

  toggleStatus: async (id: string) => {
    const token = useDealerStore.getState().token
    if (!token) throw new Error('Not authenticated')

    const property = usePropertyApi.getState().properties.find((p) => p._id === id)
    if (!property) throw new Error('Property not found')

    // Cycle through statuses: For Sale -> For Rent -> Pending -> Sold -> For Sale
    const statusCycle: Record<string, string> = {
      'For Sale': 'For Rent',
      'For Rent': 'Pending',
      'Pending': 'Sold',
      'Sold': 'For Sale',
    }

    const newStatus = statusCycle[property.status] || 'For Sale'

    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/properties/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to update status')
      }

      set((state) => ({
        properties: state.properties.map((p) =>
          p._id === id ? { ...p, status: newStatus } : p
        ),
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update status',
        isLoading: false,
      })
      throw error
    }
  },

  clearError: () => set({ error: null }),
  clearSuccess: () => set({ success: null }),
}))
