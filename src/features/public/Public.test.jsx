import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '@/App'

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
})

vi.mock('@/components/auth/SubscriptionGate', () => ({
    default: ({ children }) => children
}))

describe('Public Features Integration', () => {
    it('navigates from Landing to Explore and then to Details', async () => {
        render(
            <QueryClientProvider client={createTestQueryClient()}>
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            </QueryClientProvider>
        )

        // 1. Verify Landing Page
        expect(screen.getByText(/Explore flavors/i)).toBeInTheDocument()

        // 2. Click "Get Started"
        const browseBtn = screen.getByText(/Get Started/i)
        fireEvent.click(browseBtn)

        // 3. Verify Explore Page (LocationsPage)
        const searchInput = await screen.findByPlaceholderText(/Search in/i, {}, { timeout: 4000 })
        expect(searchInput).toBeInTheDocument()
        expect(screen.getAllByText(/Dining/i)[0]).toBeInTheDocument()

        // 4. Click on a Location Card
        // The cards have titles like "La Mammola"
        const locationCard = await screen.findAllByText(/La Mammola/i, {}, { timeout: 4000 })
        fireEvent.click(locationCard[0])

        // 5. Verify Details Page
        // Should show "In Development" for reservation or "Overview"
        expect(await screen.findByText(/In Development/i, {}, { timeout: 4000 })).toBeInTheDocument()
        expect(screen.getAllByText(/Experience/i)[0]).toBeInTheDocument()
    })
})
