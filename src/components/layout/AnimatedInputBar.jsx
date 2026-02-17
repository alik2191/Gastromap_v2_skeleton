import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Home, Heart, MoveUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useNavigate } from 'react-router-dom'

// Animated Input Bar component that replaces navigation on AI Guide page
export function AnimatedInputBar({ input, onInputChange, onSubmit, isTyping }) {
    const { theme } = useTheme()
    const navigate = useNavigate()
    const isDark = theme === 'dark'
    const [isFocused, setIsFocused] = useState(false)
    const [dragX, setDragX] = useState(0)
    const DRAG_THRESHOLD = 80

    const navItems = {
        left: { icon: Home, label: 'Dashboard', path: '/dashboard' },
        right: { icon: Heart, label: 'Saved', path: '/saved' }
    }
    // New form submit handler
    const handleLocalSubmit = (e) => {
        e.preventDefault()
        if (!input.trim() || isTyping) return
        onSubmit(e)
    }

    return (
        <motion.div
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.6
            }}
            className="fixed left-0 right-0 bottom-6 z-[70] px-4 md:hidden pointer-events-none"
            style={{ perspective: 1000 }}
        >
            <form
                onSubmit={handleLocalSubmit}
                className="max-w-md mx-auto pointer-events-auto"
            >
                <motion.div
                    onPan={(e, info) => setDragX(info.offset.x)}
                    onPanEnd={(e, info) => {
                        if (info.offset.x > DRAG_THRESHOLD) {
                            navigate(navItems.left.path)
                        } else if (info.offset.x < -DRAG_THRESHOLD) {
                            navigate(navItems.right.path)
                        }
                        setDragX(0)
                    }}
                    animate={{
                        x: dragX * 0.4,
                        backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)'
                    }}
                    className={`relative flex items-center h-[60px] px-5 rounded-[32px] border backdrop-blur-md transition-all duration-300 ${isDark
                        ? 'border-white/10 shadow-2xl shadow-black/40'
                        : 'border-white/20 shadow-xl shadow-black/5'
                        } ${isFocused
                            ? 'border-blue-500/50 ring-4 ring-blue-500/10'
                            : 'border-white/10'
                        }`}
                >
                    <Input
                        value={input}
                        onChange={onInputChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Ask about Krakow's food scene..."
                        className="flex-1 bg-transparent border-none shadow-none outline-none focus:outline-none focus:border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full text-base py-2 px-3 placeholder:font-medium text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400"
                    />

                    <div className="relative">
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!input.trim() || isTyping}
                            className={`w-10 h-10 rounded-full transition-all shadow-lg flex-shrink-0 touch-none active:scale-95 ${input.trim()
                                ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/40'
                                : 'bg-gray-300 dark:bg-zinc-800 text-gray-500 dark:text-zinc-600'
                                }`}
                        >
                            <MoveUp className={`h-5 w-5`} />
                        </Button>
                    </div>

                    {/* Permanent Subtle Hints */}
                    <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity">
                        <ChevronLeft className="w-5 h-5 text-current" />
                    </div>
                    <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity">
                        <ChevronRight className="w-5 h-5 text-current" />
                    </div>
                </motion.div>

                {/* Visual Feedback Overlays - Premium Indicators */}
                <AnimatePresence>
                    {Math.abs(dragX) > 10 && (
                        <>
                            {/* Left Side: Back to Dashboard */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: Math.min(dragX / DRAG_THRESHOLD, 1),
                                    x: -10 + (dragX * 0.1)
                                }}
                                exit={{ opacity: 0, x: -20 }}
                                className="fixed left-4 bottom-7 flex items-center gap-2 pointer-events-none z-[80]"
                            >
                                <div className="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                                    <Home className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Swipe Back</span>
                                    <span className="text-sm font-bold text-white uppercase tracking-wider">Dashboard</span>
                                </div>
                            </motion.div>

                            {/* Right Side: To Saved */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{
                                    opacity: Math.min(-dragX / DRAG_THRESHOLD, 1),
                                    x: 10 + (dragX * 0.1)
                                }}
                                exit={{ opacity: 0, x: 20 }}
                                className="fixed right-4 bottom-7 flex items-center gap-2 flex-row-reverse pointer-events-none z-[80]"
                            >
                                <div className="p-3 rounded-full bg-blue-600/20 backdrop-blur-xl border border-blue-400/30 shadow-2xl shadow-blue-500/20">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Next Tab</span>
                                    <span className="text-sm font-bold text-white uppercase tracking-wider">Saved</span>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </form>
        </motion.div>
    );
}

export default AnimatedInputBar;
