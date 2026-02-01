import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdminDashboardPage from '../pages/AdminDashboardPage'

describe('AdminDashboardPage', () => {
    it('renders dashboard with stats', () => {
        render(<AdminDashboardPage />)

        expect(screen.getByText(/Панель управления/i)).toBeInTheDocument()
        expect(screen.getByText(/Юзеры/i)).toBeInTheDocument()
        expect(screen.getByText(/Места/i)).toBeInTheDocument()
        expect(screen.getByText(/Визиты/i)).toBeInTheDocument()
    })

    it('displays welcome message and activity feed', () => {
        render(<AdminDashboardPage />)
        expect(screen.getByText(/Активность/i)).toBeInTheDocument()
        expect(screen.getByText(/Дмитрий С./i)).toBeInTheDocument()
    })

    it('renders performance snapshot', () => {
        render(<AdminDashboardPage />)
        expect(screen.getByText(/Продажи/i)).toBeInTheDocument()
        expect(screen.getByText(/Цель месяца/i)).toBeInTheDocument()
    })

    it('renders AI Analyst block', () => {
        render(<AdminDashboardPage />)
        expect(screen.getByText(/AI Аналитик/i)).toBeInTheDocument()
        expect(screen.getByText(/Отчет готов/i)).toBeInTheDocument()
    })
})
