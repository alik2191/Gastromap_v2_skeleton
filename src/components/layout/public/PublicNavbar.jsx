import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const PublicNavbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 pointer-events-none">
        <div className="container mx-auto flex justify-between items-center pointer-events-auto">
            <Link to="/" className="bg-base-100/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm flex items-center gap-2 hover:scale-105 transition-transform text-base-content">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-primary-content font-bold text-xs">G</div>
                <span className="font-semibold text-sm">GastroMap</span>
            </Link>
            <Link to="/login">
                <Button className="rounded-full hover:scale-105 active:scale-95 bg-neutral text-neutral-content px-6 h-10 font-medium shadow-xl border border-white/10">
                    Dashboard
                </Button>
            </Link>
        </div>
    </nav>
)

export default PublicNavbar
