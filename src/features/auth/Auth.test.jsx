import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '@/app/App'
import { useAuthStore } from './hooks/useAuthStore'

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

describe('Auth Features Integration', () => {
    beforeEach(() => {
        // Reset auth store before each test
        const store = useAuthStore.getState()
        store.logout()
    })

    it('allows user login and redirects to dashboard', async () => {
        render(
            <QueryClientProvider client={createTestQueryClient()}>
                <MemoryRouter initialEntries={['/login']}>
                    <App includeRouter={false} />
                </MemoryRouter>
            </QueryClientProvider>
        )

        // 1. Fill Login Form
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@example.com' } })
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } })

        // 2. Click Login
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

        // 3. Verify Dashboard
        // Increase timeout to account for the mock 1.5s delay in handleLogin
        expect(await screen.findByText(/What are we eating today?/i, {}, { timeout: 3000 })).toBeInTheDocument()
        expect(screen.getAllByText(/Explore by Country/i)[0]).toBeInTheDocument()
    })

    it('allows admin login and redirects to admin panel', async () => {
        render(
            <QueryClientProvider client={createTestQueryClient()}>
                <MemoryRouter initialEntries={['/login']}>
                    <App includeRouter={false} />
                </MemoryRouter>
            </QueryClientProvider>
        )

        // 1. Fill Login Form as Admin
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'admin@gastromap.com' } })
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'adminpass' } })

        // 2. Click Login
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

        // 3. Verify Admin Panel
        expect(await screen.findByText(/Панель управления/i, {}, { timeout: 4000 })).toBeInTheDocument()
        expect(screen.getAllByText(/Локации/i)[0]).toBeInTheDocument()
    })
})
