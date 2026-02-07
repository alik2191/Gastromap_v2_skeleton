import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Default preferences for new users
const DEFAULT_PREFERENCES = {
    longTerm: {
        favoriteCuisines: [],
        atmospherePreference: [],
        priceRange: ['$', '$$'],
        features: []
    },
    shortTerm: {}
}

const DEFAULT_AI_HISTORY = {
    chatHistory: [],
    lastVisited: [],
    frequentSearches: []
}

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null, // null | { id, name, email, role, avatar, preferences, aiHistory }
            isAuthenticated: false,

            login: (email, password) => {
                // Mock login logic
                if (email === 'admin@gastromap.com') {
                    set({
                        user: {
                            id: 'admin1',
                            name: 'Admin User',
                            email,
                            role: 'admin',
                            avatar: null,
                            preferences: DEFAULT_PREFERENCES,
                            aiHistory: DEFAULT_AI_HISTORY
                        },
                        isAuthenticated: true
                    })
                    return true
                } else if (email) {
                    // Extract name from email (before @) or use default
                    const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                    set({
                        user: {
                            id: 'user1',
                            name: nameFromEmail || 'Guest',
                            email,
                            role: 'user',
                            avatar: null,
                            preferences: {
                                longTerm: {
                                    favoriteCuisines: ['Israeli', 'Modern Polish', 'Coffee'],
                                    atmospherePreference: ['cozy', 'modern', 'quiet'],
                                    priceRange: ['$', '$$'],
                                    features: ['wifi', 'pet-friendly']
                                },
                                shortTerm: {}
                            },
                            aiHistory: DEFAULT_AI_HISTORY
                        },
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
            },

            updatePreferences: (preferences) => {
                set((state) => ({
                    user: {
                        ...state.user,
                        preferences: {
                            ...state.user.preferences,
                            ...preferences
                        }
                    }
                }))
            },

            addToChatHistory: (message) => {
                set((state) => ({
                    user: {
                        ...state.user,
                        aiHistory: {
                            ...state.user.aiHistory,
                            chatHistory: [...(state.user.aiHistory?.chatHistory || []), message]
                        }
                    }
                }))
            }
        }),
        {
            name: 'auth-storage'
        }
    )
)
