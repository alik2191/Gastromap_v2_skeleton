import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MoveUp } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

// Animated Input Bar component that replaces navigation on AI Guide page
export function AnimatedInputBar({ input, onInputChange, onSubmit, isTyping }) {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const [isFocused, setIsFocused] = useState(false)

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
                onSubmit={onSubmit}
                className="max-w-md mx-auto pointer-events-auto"
            >
                {/* Прозрачный, минималистичный контейнер */}
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
                    <Button
                        type="submit"
                        size="icon"
                        className={`ml-2 w-10 h-10 rounded-full transition-all shadow-lg flex-shrink-0 ${input.trim()
                            ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white scale-100 hover:scale-110'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 scale-90'
                            }`}
                        disabled={!input.trim() || isTyping}
                    >
                        <MoveUp className="h-5 w-5" />
                    </Button>
                </div>
            </form>
        </motion.div>
    )
}
