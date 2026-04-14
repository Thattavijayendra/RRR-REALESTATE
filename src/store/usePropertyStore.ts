import { create } from 'zustand'

export type PropertyType = 'House' | 'Apartment' | 'Penthouse' | 'Villa' | 'Land'
export type PropertyStatus = 'For Sale' | 'For Rent' | 'Sold' | 'Pending'
export type SizeRange = 'Any' | '0-1000' | '1000-2500' | '2500-5000' | '5000+'
export type PriceRange = 'Any' | '0-500k' | '500k-1M' | '1M-3M' | '3M-5M' | '5M+'

export interface PropertyImage {
  url: string
  caption?: string
  isPrimary?: boolean
}

export interface PropertyVideo {
  url: string
  provider?: 'youtube' | 'vimeo' | 'direct'
}

export interface Property {
  id: string
  _id?: string
  image?: string
  images?: PropertyImage[]
  video?: PropertyVideo
  title: string
  type: PropertyType
  status: PropertyStatus
  price: number
  beds: number
  baths: number
  sqft: number
  area?: number
  location:
    | string
    | {
        address: string
        city: string
        state?: string
        zipCode?: string
      }
  description: string
  amenities?: string[]
  isChanceProperty?: boolean
  featured?: boolean
}

interface Filters {
  type: PropertyType | 'Any'
  size: SizeRange
  price: PriceRange
  status: PropertyStatus | 'Any'
}

interface PropertyState {
  filters: Filters
  properties: Property[]
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void
  resetFilters: () => void
  getFilteredProperties: () => Property[]
}

const sampleProperties: Property[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    title: 'The Grand Estate',
    type: 'Villa',
    status: 'For Sale',
    price: 4250000,
    beds: 5,
    baths: 6,
    sqft: 6500,
    location: 'Beverly Hills, CA',
    description: 'Stunning estate with panoramic views and world-class amenities.',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    title: 'Modern Skyline Penthouse',
    type: 'Penthouse',
    status: 'For Rent',
    price: 2890000,
    beds: 3,
    baths: 3,
    sqft: 3200,
    location: 'Manhattan, NY',
    description: 'Luxury penthouse in the heart of Manhattan with skyline views.',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    title: 'Coastal Villa Retreat',
    type: 'Villa',
    status: 'For Sale',
    price: 3150000,
    beds: 4,
    baths: 4,
    sqft: 4800,
    location: 'Malibu, CA',
    description: 'Beachfront villa with private access and stunning ocean views.',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    title: 'Urban Contemporary',
    type: 'House',
    status: 'Pending',
    price: 1850000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    location: 'Austin, TX',
    description: 'Modern design meets comfort in this urban masterpiece.',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    title: 'Mountain View Estate',
    type: 'House',
    status: 'For Sale',
    price: 5200000,
    beds: 6,
    baths: 7,
    sqft: 8500,
    location: 'Aspen, CO',
    description: 'Expansive estate with breathtaking mountain vistas.',
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    title: 'Garden Apartment',
    type: 'Apartment',
    status: 'For Rent',
    price: 450000,
    beds: 2,
    baths: 2,
    sqft: 1200,
    location: 'San Francisco, CA',
    description: 'Charming apartment with private garden in prime location.',
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d26bde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    title: 'Desert Oasis',
    type: 'Villa',
    status: 'Sold',
    price: 2100000,
    beds: 3,
    baths: 4,
    sqft: 3500,
    location: 'Palm Springs, CA',
    description: 'Mid-century modern villa with pool and desert landscaping.',
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    title: 'Historic Brownstone',
    type: 'House',
    status: 'For Sale',
    price: 3800000,
    beds: 5,
    baths: 4,
    sqft: 4200,
    location: 'Boston, MA',
    description: 'Beautifully restored brownstone with modern amenities.',
  },
]

export const usePropertyStore = create<PropertyState>((set, get) => ({
  filters: {
    type: 'Any',
    size: 'Any',
    price: 'Any',
    status: 'Any',
  },
  properties: sampleProperties,
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () =>
    set({
      filters: {
        type: 'Any',
        size: 'Any',
        price: 'Any',
        status: 'Any',
      },
    }),
  getFilteredProperties: () => {
    const { filters, properties } = get()
    return properties.filter((property) => {
      // Type filter
      if (filters.type !== 'Any' && property.type !== filters.type) {
        return false
      }

      // Status filter
      if (filters.status !== 'Any' && property.status !== filters.status) {
        return false
      }

      // Size filter
      if (filters.size !== 'Any') {
        const sqft = property.sqft
        switch (filters.size) {
          case '0-1000':
            if (sqft > 1000) return false
            break
          case '1000-2500':
            if (sqft < 1000 || sqft > 2500) return false
            break
          case '2500-5000':
            if (sqft < 2500 || sqft > 5000) return false
            break
          case '5000+':
            if (sqft < 5000) return false
            break
        }
      }

      // Price filter
      if (filters.price !== 'Any') {
        const price = property.price
        switch (filters.price) {
          case '0-500k':
            if (price > 500000) return false
            break
          case '500k-1M':
            if (price < 500000 || price > 1000000) return false
            break
          case '1M-3M':
            if (price < 1000000 || price > 3000000) return false
            break
          case '3M-5M':
            if (price < 3000000 || price > 5000000) return false
            break
          case '5M+':
            if (price < 5000000) return false
            break
        }
      }

      return true
    })
  },
}))
