import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Home, Map, Heart, CheckCircle, MoveUp } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useNavigate } from 'react-router-dom'

// Animated Input Bar component that replaces navigation on AI Guide page
export function AnimatedInputBar({ input, onInputChange, onSubmit, isTyping }) {
    const { theme } = useTheme()
    const navigate = useNavigate()
    const isDark = theme === 'dark'
    const [isFocused, setIsFocused] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)

    // Joystick logic refs
    const longPressTimer = useRef(null)
    const buttonRef = useRef(null)
    const isLongPressing = useRef(false)

    const navItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard', angle: -45 },
        { icon: Map, label: 'Explore', path: '/explore', angle: -15 },
        { icon: Heart, label: 'Saved', path: '/saved', angle: 15 },
        { icon: CheckCircle, label: 'Visited', path: '/visited', angle: 45 },
    ]

    const handlePointerDown = (e) => {
        // Only trigger joystick if NOT typing
        if (isTyping) return

        isLongPressing.current = false
        longPressTimer.current = setTimeout(() => {
            setIsMenuOpen(true)
            isLongPressing.current = true
            if (window.navigator.vibrate) window.navigator.vibrate(10)
        }, 300)
    }

    const handlePointerMove = (e) => {
        if (!isMenuOpen) return

        // Calculate angle from button center
        const rect = buttonRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const dx = e.clientX - centerX
        const dy = e.clientY - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Only trigger if dragged far enough
        if (distance > 30) {
            const rad = Math.atan2(dy, dx)
            const deg = rad * (180 / Math.PI)

            // Find closest item by angle (offset by 90 to make up = -90)
            let closest = -1
            let minDiff = Infinity

            navItems.forEach((item, index) => {
                const diff = Math.abs(deg - (item.angle - 90))
                if (diff < minDiff && diff < 35) {
                    minDiff = diff
                    closest = index
                }
            })

            if (closest !== selectedIndex) {
                setSelectedIndex(closest)
                if (window.navigator.vibrate) window.navigator.vibrate(5)
            }
        } else {
            setSelectedIndex(-1)
        }
    }

    const handlePointerUp = (e) => {
        clearTimeout(longPressTimer.current)

        if (isMenuOpen) {
            if (selectedIndex !== -1) {
                navigate(navItems[selectedIndex].path)
            }
            setIsMenuOpen(false)
            setSelectedIndex(-1)
        }
    }

    // New form submit handler to prevent empty sends
    const handleLocalSubmit = (e) => {
        e.preventDefault()
        if (isLongPressing.current) return
        if (!input.trim() || isTyping) return
        onSubmit(e)
    }

    // Cleanup timers
    useEffect(() => {
        return () => clearTimeout(longPressTimer.current)
    }, [])

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
                <div className={`relative flex items-center h-[60px] px-5 rounded-[32px] border backdrop-blur-md transition-all duration-300 ${isDark
                    ? 'bg-black/30 border-white/10 shadow-lg shadow-black/20'
                    : 'bg-white/40 border-white/30 shadow-lg shadow-black/5'
                    } ${isFocused
                        ? 'border-white/40 ring-1 ring-white/20'
                        : 'border-white/10'
                    }`}>
                    <Input
                        value={input}
                        onChange={onInputChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Ask about Krakow's food scene..."
                        className="flex-1 bg-transparent border-none shadow-none outline-none focus:outline-none focus:border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full text-base py-2 px-3 placeholder:font-medium text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400"
                    />

                    <div className="relative">
                        {/* Joystick Menu Items */}
                        <AnimatePresence>
                            {isMenuOpen && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-14 pointer-events-none">
                                    {navItems.map((item, idx) => {
                                        const isActive = selectedIndex === idx
                                        const angle = item.angle - 90 // align to top
                                        const dist = isActive ? 95 : 75

                                        return (
                                            <motion.div
                                                key={item.path}
                                                initial={{ scale: 0.5, opacity: 0, x: 0, y: 0 }}
                                                animate={{
                                                    scale: isActive ? 1.4 : 1,
                                                    opacity: 1,
                                                    x: Math.cos(angle * Math.PI / 180) * dist,
                                                    y: Math.sin(angle * Math.PI / 180) * dist
                                                }}
                                                exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border transition-colors ${isActive
                                                    ? 'bg-blue-600 border-white/40 text-white z-20 shadow-blue-500/40'
                                                    : 'bg-black/60 border-white/10 text-white/70 z-10 backdrop-blur-md'
                                                    }`}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="joystick-label"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: -45 }}
                                                        className="absolute whitespace-nowrap bg-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 shadow-lg"
                                                    >
                                                        {item.label}
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )
                                    })}

                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-white/5 bg-white/5 -z-10"
                                    />
                                </div>
                            )}
                        </AnimatePresence>

                        <Button
                            ref={buttonRef}
                            type="submit"
                            size="icon"
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerLeave={handlePointerUp}
                            className={`w-10 h-10 rounded-full transition-all shadow-lg flex-shrink-0 touch-none active:scale-95 ${isMenuOpen ? 'scale-125 bg-blue-600 shadow-blue-500/30' :
                                input.trim()
                                    ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white'
                                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                                }`}
                        >
                            <MoveUp className={`h-5 w-5 transition-transform ${isMenuOpen ? 'scale-0' : 'scale-100'}`} />
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                                </motion.div>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </motion.div>
    );
}

export default AnimatedInputBar;
