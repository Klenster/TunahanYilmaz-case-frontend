'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'auditor'
  is_active: boolean
  created_at: string
}

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      updateUser: (user) => set({ user }),
    }),
    { name: 'dpp-auth' }
  )
)

interface ThemeState {
  dark: boolean
  toggle: () => void
  init: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      dark: false,
      toggle: () => {
        const next = !get().dark
        set({ dark: next })
        document.documentElement.classList.toggle('dark', next)
      },
      init: () => {
        document.documentElement.classList.toggle('dark', get().dark)
      },
    }),
    { name: 'dpp-theme' }
  )
)

interface LangState {
  lang: 'tr' | 'en'
  setLang: (lang: 'tr' | 'en') => void
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: 'tr',
      setLang: (lang) => {
        set({ lang })
        localStorage.setItem('dpp-lang', lang)
        // i18n'i dinamik import ile çağır (SSR sorununu önler)
        import('../lib/i18n').then((mod) => {
          mod.default.changeLanguage(lang)
        })
      },
    }),
    { name: 'dpp-lang' }
  )
)