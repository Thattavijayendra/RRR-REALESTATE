import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Dealer {
  _id: string
  name: string
  email: string
  phone: string
  company?: {
    name?: string
    license?: string
  }
  role: 'admin' | 'dealer' | 'agent'
  profileImage?: string
}

interface DealerState {
  dealer: Dealer | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  clearError: () => void
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
  company?: {
    name?: string
  }
}

const API_URL = import.meta.env.VITE_API_URL

export const useDealerStore = create<DealerState>()(
  persist(
    (set) => ({
      dealer: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          const data = await res.json()

          if (!res.ok) {
            throw new Error(data.error || 'Login failed')
          }

          set({
            dealer: data.data.dealer,
            token: data.data.token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })
        try {
          const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })

          const responseData = await res.json()

          if (!res.ok) {
            throw new Error(responseData.error || 'Registration failed')
          }

          set({
            dealer: responseData.data.dealer,
            token: responseData.data.token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          })
          throw error
        }
      },

      logout: () => {
        set({
          dealer: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'dealer-auth',
    }
  )
)
