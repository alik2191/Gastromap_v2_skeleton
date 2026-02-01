import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdminStatsPage from '../pages/AdminStatsPage'

describe('AdminStatsPage', () => {
    it('renders analytics page and main stats', () => {
        render(<AdminStatsPage />)

        expect(screen.getByText(/Аналитика/i)).toBeInTheDocument()
        expect(screen.getByText(/Юзеры/i)).toBeInTheDocument()
        expect(screen.getByText(/Конверсия/i)).toBeInTheDocument()
    })

    it('renders city popularity chart', () => {
        render(<AdminStatsPage />)
        expect(screen.getByText(/Популярность по городам/i)).toBeInTheDocument()
        expect(screen.getByText(/Краков/i)).toBeInTheDocument()
    })

    it('renders AI Impact block', () => {
        render(<AdminStatsPage />)
        expect(screen.getByText(/AI Impact/i)).toBeInTheDocument()
        expect(screen.getByText(/CTR AI REC/i)).toBeInTheDocument()
    })

    it('renders recent subscriptions table', () => {
        render(<AdminStatsPage />)
        expect(screen.getByText(/Последние подписки/i)).toBeInTheDocument()
        expect(screen.getByText(/Алексей Иванов/i)).toBeInTheDocument()
    })
})
