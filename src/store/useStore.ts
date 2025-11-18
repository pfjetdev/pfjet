import { create } from 'zustand'

// Определяем типы для состояния
interface User {
  id: number
  name: string
  email: string
  age: number
}

interface AppState {
  // Состояние пользователя
  user: User | null
  isAuthenticated: boolean
  
  // Состояние счетчика для демонстрации
  count: number
  
  // Состояние загрузки
  isLoading: boolean
  
  // Действия для управления пользователем
  setUser: (user: User) => void
  logout: () => void
  
  // Действия для счетчика
  increment: () => void
  decrement: () => void
  reset: () => void
  
  // Действия для загрузки
  setLoading: (loading: boolean) => void
}

// Создаем Zustand store
export const useStore = create<AppState>((set) => ({
  // Начальное состояние
  user: null,
  isAuthenticated: false,
  count: 0,
  isLoading: false,
  
  // Действия для пользователя
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  
  // Действия для счетчика
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  
  // Действия для загрузки
  setLoading: (isLoading) => set({ isLoading }),
}))

// Селекторы для удобства использования
export const useUser = () => useStore((state) => state.user)
export const useIsAuthenticated = () => useStore((state) => state.isAuthenticated)
export const useCount = () => useStore((state) => state.count)
export const useIsLoading = () => useStore((state) => state.isLoading)