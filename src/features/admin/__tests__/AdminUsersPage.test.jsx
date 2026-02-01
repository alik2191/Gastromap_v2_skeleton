import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AdminUsersPage from '../pages/AdminUsersPage'

describe('AdminUsersPage', () => {
    it('renders users page and stats', () => {
        render(<AdminUsersPage />)

        expect(screen.getByText(/Пользователи/i)).toBeInTheDocument()
        expect(screen.getByText(/Pro/i)).toBeInTheDocument()
        expect(screen.getByText(/Online/i)).toBeInTheDocument()
    })

    it('renders user table with data', () => {
        render(<AdminUsersPage />)
        expect(screen.getByText(/Алексей Иванов/i)).toBeInTheDocument()
        expect(screen.getByText(/alex@example.com/i)).toBeInTheDocument()
    })

    it('opens user profile slide-over', () => {
        render(<AdminUsersPage />)
        const userRow = screen.getByText(/Алексей Иванов/i)
        fireEvent.click(userRow)

        expect(screen.getByText(/Профиль юзера/i)).toBeInTheDocument()
        expect(screen.getByText(/ID: #USER-1/i)).toBeInTheDocument()
    })
})
