import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AdminAIPage from '../pages/AdminAIPage'

describe('AdminAIPage', () => {
    it('renders AI page with agent cards', () => {
        render(<AdminAIPage />)

        expect(screen.getByText(/Управление ИИ/i)).toBeInTheDocument()
        expect(screen.getAllByText(/AI Guide/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/AI Assistant/i).length).toBeGreaterThan(0)
    })

    it('displays status tags', () => {
        render(<AdminAIPage />)
        expect(screen.getAllByText(/ACTIVE/i).length).toBeGreaterThan(0)
    })

    it('renders global settings sliders', () => {
        render(<AdminAIPage />)
        expect(screen.getByText(/Параметры моделей/i)).toBeInTheDocument()
        expect(screen.getByText(/Креативность/i)).toBeInTheDocument()
    })

    it('renders system status', () => {
        render(<AdminAIPage />)
        expect(screen.getByText(/Статус систем/i)).toBeInTheDocument()
        expect(screen.getByText(/Latency/i)).toBeInTheDocument()
    })
})
