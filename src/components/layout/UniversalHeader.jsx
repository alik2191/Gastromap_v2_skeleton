import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun, ShieldCheck, Download, PlusCircle } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useAuthStore } from '@/features/auth/hooks/useAuthStore'
import { usePWA } from '@/hooks/usePWA'

export function UniversalHeader() {
    const { theme, toggleTheme } = useTheme()
    const { user: authUser } = useAuthStore()
    const { isInstallable, installPWA } = usePWA()
    const user = authUser || { name: 'Alex Johnson', email: 'alex@gastromap.com' }
    const isAdmin = true // Placeholder for admin check
    const isDark = theme === 'dark'

    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const glassStyle = isDark
        ? "bg-black/20 border-white/5 text-white hover:bg-white/10"
        : "bg-white/20 border-white/20 text-gray-900 hover:bg-gray-100/50"

    const textStyle = isDark ? "text-white" : "text-gray-900"

    const headerBg = isScrolled
        ? (isDark
            ? 'bg-[#121212]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl md:bg-[#121212]/80'
            : 'bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm md:bg-white/80')
        : 'bg-transparent'

    // Force transparency on mobile regardless of scroll
    const finalHeaderClass = `fixed top-0 left-0 right-0 z-[100] px-[2.5vw] md:px-[10px] py-3 transition-all duration-500 ${isScrolled ? 'md:' + headerBg : 'bg-transparent md:bg-transparent'} ${!isScrolled ? '' : 'max-md:bg-transparent max-md:border-none max-md:shadow-none'}`

    return (
        <header className={finalHeaderClass}>
            <div className="flex justify-between items-center max-w-[1400px] mx-auto">
                {/* Logo Capsule (PC Style) */}
                <Link to="/dashboard" className={`flex items-center gap-2 hover:scale-105 transition-all backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/40 border-white/40'}`}>
                    <img src="/pwa-icon-192.png" alt="GastroMap Logo" className="w-7 h-7 md:w-8 md:h-8 object-cover rounded-full" />
                    <span className={`font-bold text-xs md:text-sm tracking-tight ${textStyle}`}>GastroMap</span>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-3">
                    {isInstallable && (
                        <button
                            onClick={installPWA}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md transition-all border group bg-blue-600 border-blue-500/50 text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95`}
                        >
                            <Download size={16} className="group-hover:bounce" />
                            <span className="text-[10px] font-black uppercase tracking-tighter hidden sm:inline">Скачать</span>
                        </button>
                    )}
                    {isAdmin && (
                        <Link to="/admin" className={`p-2 rounded-full backdrop-blur-md transition-all border ${glassStyle}`}>
                            <ShieldCheck size={18} className="text-blue-500" />
                        </Link>
                    )}
                    <button onClick={toggleTheme} className={`p-2 rounded-full backdrop-blur-md transition-all border ${glassStyle}`}>
                        {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-600" />}
                    </button>
                    <Link to="/dashboard/add-place" className="flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs md:text-sm shadow-md shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 border border-indigo-500/50">
                        <PlusCircle size={16} />
                        <span className="hidden sm:inline">Add Place</span>
                    </Link>
                    <Link to="/profile" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-md border-2 border-white/20 hover:scale-110 transition-transform">
                        {user.name.charAt(0)}
                    </Link>
                </div>
            </div>
        </header>
    )
}
