import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppConfigStore = create(
    persist(
        (set) => ({
            appName: 'GastroMap',
            appDescription: 'Discover the world through taste. Local guides, hidden gems, and the best gastromap for foodies.',
            appStatus: 'active', // 'active', 'maintenance', 'down'
            maintenanceMessage: 'Мы проводим технические работы, чтобы стать лучше. Приложение скоро вернется!',
            downMessage: 'Приложение временно недоступно. Мы скоро вернемся!',
            seoKeywords: 'food, gastromap, restaurants, local food, travel, foodie',

            updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
            setAppStatus: (status) => set({ appStatus: status }),
        }),
        {
            name: 'app-config-storage',
        }
    )
)
