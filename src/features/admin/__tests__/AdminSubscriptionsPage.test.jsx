import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdminSubscriptionsPage from '../pages/AdminSubscriptionsPage'

describe('AdminSubscriptionsPage', () => {
    it('renders plans and billing info', () => {
        render(<AdminSubscriptionsPage />)

        expect(screen.getByText(/Биллинг/i)).toBeInTheDocument()
        // Use getAllByText as these appear in cards and table
        expect(screen.getAllByText(/Basic/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/Premium/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/Lifetime/i).length).toBeGreaterThan(0)
    })

    it('renders transaction table', () => {
        render(<AdminSubscriptionsPage />)
        expect(screen.getByText(/Транзакции/i)).toBeInTheDocument()
        expect(screen.getByText(/Алексей Иванов/i)).toBeInTheDocument()
    })
})
