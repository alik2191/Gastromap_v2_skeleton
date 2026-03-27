import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_LOCATIONS } from '@/mocks/locations'
import { getLocations, getLocationsAdmin, createLocation, updateLocation as apiUpdateLocation, deleteLocation as apiDeleteLocation } from '@/shared/api/locations.api'

/**
 * useLocationsStore — client-side filter state for the locations list.
 *
 * This store manages UI filter state only (active filters, search query).
 * The actual data fetching is done by React Query hooks in @/shared/api/queries.js.
 *
 * For components that need the full filtered dataset without React Query
 * (e.g. map markers, quick counts), the store also caches filteredLocations.
 *
 * @typedef {Object} LocationFiltersState
 * @property {string}   activeCategory
 * @property {string}   searchQuery
 * @property {string[]} activePriceLevels   - e.g. ['$', '$$']
 * @property {number|null} minRating        - 0–5
 * @property {string[]} activeVibes         - e.g. ['Romantic', 'Casual']
 * @property {'rating'|'price_asc'|'price_desc'|'name'} sortBy
 */

const DEFAULT_FILTERS = {
    activeCategory: 'All',
    searchQuery: '',
    activePriceLevels: [],
    minRating: null,
    activeVibes: [],
    sortBy: 'rating',
}

/** Compare price levels for sort: $ < $$ < $$$ */
const PRICE_ORDER = { '$': 1, '$$': 2, '$$$': 3 }

function applyAllFilters(locations, filters) {
    const {
        activeCategory,
        searchQuery,
        activePriceLevels,
        minRating,
        activeVibes,
        sortBy,
    } = filters

    let result = [...locations]

    if (activeCategory && activeCategory !== 'All') {
        result = result.filter(loc => loc.category === activeCategory)
    }

    if (searchQuery) {
        const q = searchQuery.toLowerCase()
        result = result.filter(
            loc =>
                loc.title.toLowerCase().includes(q) ||
                loc.description.toLowerCase().includes(q) ||
                loc.cuisine?.toLowerCase().includes(q) ||
                loc.tags?.some(tag => tag.toLowerCase().includes(q))
        )
    }

    if (activePriceLevels?.length) {
        result = result.filter(loc => activePriceLevels.includes(loc.priceLevel))
    }

    if (minRating != null) {
        result = result.filter(loc => loc.rating >= minRating)
    }

    if (activeVibes?.length) {
        result = result.filter(loc => activeVibes.includes(loc.vibe))
    }

    // ─── Sort ────────────────────────────────────────────────────────────
    switch (sortBy) {
        case 'rating':
            result.sort((a, b) => b.rating - a.rating)
            break
        case 'price_asc':
            result.sort(
                (a, b) => (PRICE_ORDER[a.priceLevel] ?? 0) - (PRICE_ORDER[b.priceLevel] ?? 0)
            )
            break
        case 'price_desc':
            result.sort(
                (a, b) => (PRICE_ORDER[b.priceLevel] ?? 0) - (PRICE_ORDER[a.priceLevel] ?? 0)
            )
            break
        case 'name':
            result.sort((a, b) => a.title.localeCompare(b.title))
            break
        default:
            break
    }

    return result
}

export const useLocationsStore = create(
    persist(
        (set, get) => ({
    locations: MOCK_LOCATIONS,
    filteredLocations: MOCK_LOCATIONS,
    isLoading: false,

    ...DEFAULT_FILTERS,

    // ─── Filter setters ───────────────────────────────────────────────────

    setCategory: (activeCategory) =>
        set(state => ({
            activeCategory,
            filteredLocations: applyAllFilters(state.locations, { ...state, activeCategory }),
        })),

    setSearchQuery: (searchQuery) =>
        set(state => ({
            searchQuery,
            filteredLocations: applyAllFilters(state.locations, { ...state, searchQuery }),
        })),

    setPriceLevels: (activePriceLevels) =>
        set(state => ({
            activePriceLevels,
            filteredLocations: applyAllFilters(state.locations, { ...state, activePriceLevels }),
        })),

    setMinRating: (minRating) =>
        set(state => ({
            minRating,
            filteredLocations: applyAllFilters(state.locations, { ...state, minRating }),
        })),

    setVibes: (activeVibes) =>
        set(state => ({
            activeVibes,
            filteredLocations: applyAllFilters(state.locations, { ...state, activeVibes }),
        })),

    setSortBy: (sortBy) =>
        set(state => ({
            sortBy,
            filteredLocations: applyAllFilters(state.locations, { ...state, sortBy }),
        })),

    /**
     * Apply multiple filter changes at once — single set() call, one re-render.
     * @param {Partial<LocationFiltersState>} updates
     */
    applyFilters: (updates = {}) =>
        set(state => {
            const next = { ...state, ...updates }
            return { ...updates, filteredLocations: applyAllFilters(state.locations, next) }
        }),

    /** Reset all filters to defaults — single re-render */
    resetFilters: () =>
        set(state => ({
            ...DEFAULT_FILTERS,
            filteredLocations: state.locations,
        })),

    // ─── Data mutations (used by Admin) ──────────────────────────────────

    setLocations: (locations) =>
        set((state) => ({
            locations,
            filteredLocations: applyAllFilters(locations, state),
        })),

    addLocation: async (location) => {
        try {
            const created = await createLocation(location)
            set((state) => {
                const locations = [...state.locations, created]
                return { locations, filteredLocations: applyAllFilters(locations, state) }
            })
            return { success: true, data: created }
        } catch (err) {
            // Offline fallback
            const loc = {
                ...location,
                id: Math.random().toString(36).slice(2, 11),
                status: location.status || 'Pending'
            }
            set((state) => {
                const locations = [...state.locations, loc]
                return { locations, filteredLocations: applyAllFilters(locations, state) }
            })
            console.warn('[Store] addLocation API failed, added locally:', err.message)
            return { success: true, data: loc, offline: true }
        }
    },

    updateLocation: async (id, updates) => {
        // Optimistic update immediately
        set((state) => {
            const locations = state.locations.map(loc =>
                loc.id === id ? { ...loc, ...updates } : loc
            )
            return { locations, filteredLocations: applyAllFilters(locations, state) }
        })
        try {
            await apiUpdateLocation(id, updates)
            return { success: true }
        } catch (err) {
            console.warn('[Store] updateLocation API failed, keeping local update:', err.message)
            return { success: true, offline: true }
        }
    },

    deleteLocation: async (id) => {
        set((state) => {
            const locations = state.locations.filter(loc => loc.id !== id)
            return { locations, filteredLocations: applyAllFilters(locations, state) }
        })
        try {
            await apiDeleteLocation(id)
            return { success: true }
        } catch (err) {
            console.warn('[Store] deleteLocation API failed, keeping local delete:', err.message)
            return { success: true, offline: true }
        }
    },

    /** Load all locations from Supabase (or mocks) and populate the store. */
    initialize: async (isAdmin = false) => {
        if (get().isLoading) return
        set({ isLoading: true })
        try {
            const fetchFn = isAdmin ? getLocationsAdmin : getLocations
            const { data } = await fetchFn({ limit: 1000 })
            if (data?.length) {
                set((state) => ({
                    locations: data,
                    filteredLocations: applyAllFilters(data, state),
                    isLoading: false,
                }))
            } else {
                set({ isLoading: false })
            }
        } catch {
            set({ isLoading: false })
        }
    },
        }),
        { name: 'locations-storage' }
    )
)
