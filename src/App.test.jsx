import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

// Mock the nested components to isolate App logic if needed, 
// but for integration smoke test we can render them.
// We need a wrapper for providers since App expects them or provides them?
// Actually App.jsx does NOT contain the providers (main.jsx does), 
// so we must provide them here.

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
})

describe('App Component', () => {
    it('renders landing page by default', () => {
        render(
            <QueryClientProvider client={createTestQueryClient()}>
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            </QueryClientProvider>
        )

        // Check for "GastroMap" text which is in the Header and Landing Page
        expect(screen.getAllByText(/GastroMap/i).length).toBeGreaterThan(0)

        // Check for "Discover" text from Landing Page
        expect(screen.getByText(/Discover/i)).toBeInTheDocument()
    })
})
