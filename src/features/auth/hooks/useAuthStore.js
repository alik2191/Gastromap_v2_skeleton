import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    user: null, // null | { id, name, email, role }
    isAuthenticated: false,

    login: (email, password) => {
        // Mock login logic
        if (email === 'admin@gastromap.com') {
            set({
                user: { id: 'admin1', name: 'Admin User', email, role: 'admin' },
                isAuthenticated: true
            })
            return true
        } else if (email) {
            set({
                user: { id: 'user1', name: 'John Doe', email, role: 'user' },
                isAuthenticated: true
            })
            return true
        }
        return false
    },

    logout: () => {
        set({ user: null, isAuthenticated: false })
    },

    updateProfile: (updates) => {
        set((state) => ({
            user: { ...state.user, ...updates }
        }))
    }
}))
