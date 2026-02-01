import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Map, Sparkles, Heart, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'

export function BottomNav() {
    const location = useLocation()
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const [isCompact] = useState(true)


    const navItems = [
        { icon: Home, label: 'Overview', path: '/dashboard' },
        { icon: Map, label: 'Explore', path: '/explore' },
        { icon: Sparkles, label: 'AI Guide', path: '/ai-guide' },
        { icon: Heart, label: 'Saved', path: '/saved' },
        { icon: CheckCircle, label: 'Visited', path: '/visited' },
    ]

    return (
        <div className={cn(
            "fixed left-0 right-0 z-[70] px-4 md:hidden pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
            isCompact ? "bottom-6" : "bottom-6"
        )}>
            <motion.nav
                initial={false}
                animate={{
                    height: isCompact ? '60px' : '88px',
                }}
                transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                className={cn(
                    "max-w-md mx-auto pointer-events-auto rounded-[32px] border backdrop-blur-2xl shadow-2xl overflow-hidden",
                    isDark
                        ? "bg-black/60 border-white/10 shadow-black/40"
                        : "bg-white/70 border-white/40 shadow-blue-500/10"
                )}
            >
                <div className="flex justify-around items-center h-full px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path || (item.path === '/explore' && location.pathname.startsWith('/location'))

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex flex-col items-center justify-center flex-1 h-full relative group",
                                    isActive
                                        ? (isDark ? "text-white" : "text-blue-600")
                                        : (isDark ? "text-gray-500 hover:text-white/70" : "text-gray-400 hover:text-gray-600")
                                )}
                            >
                                <div className={cn(
                                    "relative flex items-center justify-center rounded-full",
                                    isCompact ? "w-10 h-10" : "w-10 h-10"
                                )}>
                                    {isActive && (
                                        <motion.div
                                            layoutId="bottomNavActiveTab"
                                            className="absolute inset-0 bg-blue-600 shadow-lg shadow-blue-600/40 rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    <div className={cn(
                                        "relative z-10 flex items-center justify-center w-full h-full rounded-full transition-colors duration-300",
                                        isActive ? "text-white" : "text-gray-500 group-hover:bg-white/5"
                                    )}>
                                        {isActive && (
                                            <motion.div
                                                layoutId="bottomNavGlow"
                                                className="absolute inset-0 bg-white/20 blur-md rounded-full"
                                            />
                                        )}
                                        <motion.div
                                            animate={item.label === 'AI Guide' && !isActive ? {
                                                opacity: [0.4, 1, 0.4],
                                                scale: [0.95, 1.05, 0.95]
                                            } : {}}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="relative z-20 flex items-center justify-center"
                                        >
                                            <Icon className={cn(
                                                "transition-transform duration-300",
                                                isActive && "scale-110",
                                                "h-5 w-5",
                                                item.label === 'AI Guide' && !isActive && "text-blue-400"
                                            )} />
                                        </motion.div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {!isCompact && (
                                        <motion.span
                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
                                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                                            className={cn(
                                                "text-[9px] font-black uppercase tracking-widest block whitespace-nowrap overflow-hidden",
                                                isActive ? "opacity-100 scale-105" : "opacity-40 scale-100"
                                            )}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        )
                    })}
                </div>
            </motion.nav>
        </div>
    )
}
