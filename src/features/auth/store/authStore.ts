import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User } from '../types/auth.types'

interface AuthState {
  user: Nullable<User>
  accessToken: Nullable<string>
  isAuthenticated: boolean

  setAuth: (user: User, accessToken: string) => void
  clearAuth: () => void
}

type Nullable<T> = T | null

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,

        setAuth: (user, accessToken) =>
          set({ user, accessToken, isAuthenticated: true }, false, 'auth/setAuth'),

        clearAuth: () =>
          set(
            { user: null, accessToken: null, isAuthenticated: false },
            false,
            'auth/clearAuth'
          ),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
)
