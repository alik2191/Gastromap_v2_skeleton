import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGastroAI, ChatInterface } from '@/features/shared/components/GastroAIChat'
import { AnimatedInputBar } from '@/components/layout/AnimatedInputBar'

const AIGuidePage = () => {
    const { messages, isTyping, sendMessage } = useGastroAI()
    const [input, setInput] = useState('')
    const navigate = useNavigate()

    const handleSend = (e) => {
        e.preventDefault()
        if (!input.trim()) return
        sendMessage(input)
        setInput('')
    }

    return (
        <div className="w-full h-[100dvh] flex flex-col relative">
            {/* Aurora Animation when typing - Full Screen Premium Effect */}
            {isTyping && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute bottom-[-10%] left-[-10%] w-[120%] h-[60%] bg-gradient-to-t from-indigo-500/20 via-purple-500/10 to-transparent blur-[120px] animate-pulse" />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            x: [0, 50, 0],
                            y: [0, -30, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.2, 0.4, 0.2],
                            x: [0, -40, 0],
                            y: [0, 20, 0]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]"
                    />
                </div>
            )}

            {/* Fixed Header Section - Minimalist & Animated */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-12 left-0 right-0 z-[60]"
            >
                <div className="relative px-4 py-3 bg-white/5 dark:bg-black/5 backdrop-blur-3xl backdrop-saturate-[180%] border-b border-white/10">
                    <div className="flex items-center justify-center max-w-lg mx-auto">
                        {/* Centered Logo & Title */}
                        <div className="flex items-center gap-3">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20"
                            >
                                <Sparkles size={20} className="text-white" />
                            </motion.div>
                            <motion.div
                                initial={{ x: 10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">GastroGuide</h1>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Chat Interface - Positioned absolutely to fill screen, content padded internally */}
            <div className="absolute inset-0 z-0">
                <ChatInterface
                    messages={messages}
                    isTyping={isTyping}
                    onSendMessage={sendMessage}
                    className="[&_form]:hidden md:[&_form]:block"
                    transparent={true}
                    contentClassName="pt-32 md:pt-40" // Internal padding for content to clear fixed headers
                />
            </div>

            {/* Animated Input Bar - Replaces Bottom Nav on Mobile */}
            <AnimatedInputBar
                input={input}
                onInputChange={(e) => setInput(e.target.value)}
                onSubmit={handleSend}
                isTyping={isTyping}
            />
        </div>
    )
}

export default AIGuidePage
