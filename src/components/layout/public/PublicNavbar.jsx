import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const PublicNavbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 w-full px-4 md:px-8 pointer-events-none">
        <div className="w-full pointer-events-auto">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-2 pl-5 pr-2 rounded-[24px] md:rounded-full shadow-2xl shadow-black/5 flex justify-between items-center transition-all duration-500">
                <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform text-base-content group">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-sm md:text-base shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">G</div>
                    <span className="font-bold text-sm md:text-lg tracking-tight">GastroMap</span>
                </Link>

                <div className="flex items-center gap-2 md:gap-4">
                    <Link to="/explore" className="hidden md:block text-[11px] font-bold uppercase tracking-widest text-base-content/40 hover:text-blue-600 transition-colors px-2">
                        Browse
                    </Link>
                    <Link to="/login">
                        <Button className="rounded-[18px] md:rounded-full hover:scale-105 active:scale-95 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 md:px-8 h-10 md:h-12 text-xs md:text-sm font-bold shadow-xl transition-all">
                            Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    </nav>
)

export default PublicNavbar
