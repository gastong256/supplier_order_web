import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AppState {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: AppState['theme']) => void

  isGlobalLoading: boolean
  setGlobalLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }, false, 'setTheme'),

      isGlobalLoading: false,
      setGlobalLoading: (loading) =>
        set({ isGlobalLoading: loading }, false, 'setGlobalLoading'),
    }),
    { name: 'AppStore' }
  )
)
