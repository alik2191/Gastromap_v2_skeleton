import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun, ShieldCheck } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useAuthStore } from '@/features/auth/hooks/useAuthStore'

export function UniversalHeader() {
    const { theme, toggleTheme } = useTheme()
    const { user: authUser } = useAuthStore()
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

    const isAIGuide = location.pathname === '/ai-guide'

    const headerBg = isScrolled
        ? (isDark
            ? 'bg-black/40 backdrop-blur-3xl border-b border-white/10 shadow-2xl'
            : 'bg-white/60 backdrop-blur-3xl border-b border-white/20 shadow-sm')
        : 'bg-transparent'

    const finalHeaderClass = `fixed top-0 left-0 right-0 z-[100] px-[2.5vw] md:px-[20px] py-4 transition-all duration-700 ${headerBg}`

    return (
        <header className={finalHeaderClass}>
            <div className="flex justify-between items-center max-w-[1400px] mx-auto relative h-10">
                <AnimatePresence mode="wait">
                    {!isAIGuide ? (
                        <motion.div
                            key="standard-header"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            className="flex justify-between items-center w-full"
                        >
                            {/* Logo Capsule */}
                            <Link to="/dashboard" className={`flex items-center gap-2 hover:scale-105 transition-all backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/40 border-white/40'}`}>
                                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-inner">G</div>
                                <span className={`font-bold text-xs tracking-tight ${textStyle}`}>GastroMap</span>
                            </Link>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {isAdmin && (
                                    <Link to="/admin" className={`p-2 rounded-full backdrop-blur-md transition-all border ${glassStyle}`}>
                                        <ShieldCheck size={18} className="text-blue-500" />
                                    </Link>
                                )}
                                <button onClick={toggleTheme} className={`p-2 rounded-full backdrop-blur-md transition-all border ${glassStyle}`}>
                                    {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-600" />}
                                </button>
                                <Link to="/profile" className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white/20 hover:scale-110 transition-transform">
                                    {user.name.charAt(0)}
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="ai-header"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="flex items-center w-full"
                        >
                            <div className="flex items-center gap-2.5">
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center justify-center"
                                >
                                    <ShieldCheck size={18} className="text-blue-600 dark:text-blue-500" />
                                </motion.div>
                                <motion.h1
                                    className="text-sm font-black text-slate-900 dark:text-white tracking-widest uppercase"
                                >
                                    Gastro Guide
                                </motion.h1>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    )
}
