import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdminDashboardPage from '../pages/AdminDashboardPage'

describe('AdminDashboardPage', () => {
    it('renders dashboard with stats', () => {
        render(<AdminDashboardPage />)

        expect(screen.getByText(/Панель управления/i)).toBeInTheDocument()
        expect(screen.getByText(/Пользователей/i)).toBeInTheDocument()
        expect(screen.getByText(/Локаций/i)).toBeInTheDocument()
        expect(screen.getByText(/Просмотры/i)).toBeInTheDocument()
    })

    it('displays welcome message and activity feed', () => {
        render(<AdminDashboardPage />)
        expect(screen.getByText(/Последняя активность/i)).toBeInTheDocument()
        expect(screen.getByText(/Дмитрий С./i)).toBeInTheDocument()
    })

    it('renders AI Insight block', () => {
        render(<AdminDashboardPage />)
        expect(screen.getByText(/GastroAI/i)).toBeInTheDocument()
    })
})
