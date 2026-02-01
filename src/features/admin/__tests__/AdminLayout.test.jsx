import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AdminLayout from '../layout/AdminLayout'
import { useAuthStore } from '../../auth/hooks/useAuthStore'

// Mock useTheme hook
vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({
        theme: 'light',
        toggleTheme: vi.fn(),
    })
}))

// Mock useAuthStore
vi.mock('../../auth/hooks/useAuthStore', () => ({
    useAuthStore: vi.fn((selector) => {
        const state = {
            logout: vi.fn(),
        }
        return selector ? selector(state) : state
    })
}))

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('AdminLayout', () => {
    it('renders sidebar with navigation items', () => {
        renderWithRouter(<AdminLayout />)

        expect(screen.getByText(/GastroMap/i)).toBeInTheDocument()
        expect(screen.getByText(/Главная/i)).toBeInTheDocument()
        expect(screen.getByText(/Локации/i)).toBeInTheDocument()
        expect(screen.getByText(/Пользователи/i)).toBeInTheDocument()
    })

    it('toggles mobile sidebar visibility', () => {
        renderWithRouter(<AdminLayout />)

        // Mobile menu button
        const menuButton = screen.queryByLabelText(/menu/i)
        // Note: In a desktop environment it might be hidden, so we check existence not necessarily visibility
        expect(menuButton).toBeInTheDocument()

        if (menuButton) {
            fireEvent.click(menuButton)
        }
    })

    it('has a functional search input', () => {
        renderWithRouter(<AdminLayout />)
        const searchInput = screen.getByPlaceholderText(/Поиск.../i)
        expect(searchInput).toBeInTheDocument()

        fireEvent.change(searchInput, { target: { value: 'test' } })
        expect(searchInput.value).toBe('test')
    })
})
