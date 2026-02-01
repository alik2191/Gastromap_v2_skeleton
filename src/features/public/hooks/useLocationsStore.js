import { create } from 'zustand'
import { MOCK_LOCATIONS } from '@/mocks/locations'

export const useLocationsStore = create((set, get) => ({
    locations: MOCK_LOCATIONS,
    filteredLocations: MOCK_LOCATIONS,
    activeCategory: 'All',
    searchQuery: '',

    setCategory: (category) => {
        set({ activeCategory: category })
        get().applyFilters()
    },

    setSearchQuery: (query) => {
        set({ searchQuery: query })
        get().applyFilters()
    },

    applyFilters: () => {
        const { locations, activeCategory, searchQuery } = get()
        let result = locations

        if (activeCategory !== 'All') {
            result = result.filter(loc => loc.category === activeCategory)
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(loc =>
                loc.title.toLowerCase().includes(q) ||
                loc.description.toLowerCase().includes(q)
            )
        }

        set({ filteredLocations: result })
    },
    addLocation: (location) => set((state) => ({ locations: [...state.locations, { ...location, id: Math.random().toString(36).substr(2, 9) }] })),

    updateLocation: (id, updates) => set((state) => ({
        locations: state.locations.map(loc => loc.id === id ? { ...loc, ...updates } : loc)
    })),

    deleteLocation: (id) => set((state) => ({
        locations: state.locations.filter(loc => loc.id !== id)
    }))
}))
