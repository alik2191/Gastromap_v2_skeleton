import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, MapPin, ChefHat, X, MoveUp } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useLocationsStore } from '@/features/public/hooks/useLocationsStore'

// Mock AI Logic (Unchanged logic, just UI update)
const useGastroAI = () => {
    const [messages, setMessages] = useState([
        { id: 1, role: 'ai', content: "Hi! I'm GastroGuide. Ask me anything about dining in Krakow." }
    ])
    const [isTyping, setIsTyping] = useState(false)
    const { locations } = useLocationsStore()

    const sendMessage = async (text) => {
        const userMsg = { id: Date.now(), role: 'user', content: text }
        setMessages(prev => [...prev, userMsg])
        setIsTyping(true)

        setTimeout(() => {
            const lowerText = text.toLowerCase()
            let aiResponse = { id: Date.now() + 1, role: 'ai', content: "I'm looking for the best matches..." }

            const matches = locations.filter(loc =>
                lowerText.includes(loc.category.toLowerCase()) ||
                loc.tags.some(tag => lowerText.includes(tag.toLowerCase())) ||
                loc.title.toLowerCase().includes(lowerText)
            )

            if (matches.length > 0) {
                aiResponse = {
                    id: Date.now() + 1,
                    role: 'ai',
                    content: `Here are ${matches.length} spots that match your vibe.`,
                    attachments: matches.slice(0, 3)
                }
            } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
                aiResponse = { id: Date.now() + 1, role: 'ai', content: "Hello! Ready for a culinary adventure?" }
            } else {
                aiResponse = { id: Date.now() + 1, role: 'ai', content: "I didn't find specific matches, but I can recommend some great cafes generally." }
            }

            setMessages(prev => [...prev, aiResponse])
            setIsTyping(false)
        }, 1500)
    }

    return { messages, isTyping, sendMessage }
}

export default function GastroGuideChat({ isOpen, onClose }) {
    const { messages, isTyping, sendMessage } = useGastroAI()
    const [input, setInput] = useState('')
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = (e) => {
        e.preventDefault()
        if (!input.trim()) return
        sendMessage(input)
        setInput('')
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="fixed inset-0 z-50 flex flex-col items-center justify-center sm:inset-auto sm:right-6 sm:bottom-24 sm:w-[420px] sm:h-[650px] pointer-events-none"
            >
                {/* The "Siri" Glow Container */}
                <div className={`pointer-events-auto relative w-full h-full bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/50 overflow-hidden flex flex-col ${isTyping ? 'ring-2 ring-purple-400/50' : ''}`}>

                    {/* Aurora Animation when typing */}
                    {isTyping && (
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-purple-200/50 via-pink-100/30 to-transparent blur-2xl animate-pulse pointer-events-none" />
                    )}

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-black/5 bg-white/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-200">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-semibold text-sm tracking-tight">Gastro Intelligence</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-black/5 w-8 h-8">
                            <X className="h-4 w-4 opacity-50" />
                        </Button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`px-5 py-3 rounded-2xl text-[15px] leading-relaxed max-w-[90%] shadow-sm ${msg.role === 'user'
                                            ? 'bg-black text-white rounded-br-none'
                                            : 'bg-white border border-black/5 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>

                                {/* Attachments (Cards) */}
                                {msg.attachments && (
                                    <div className="mt-2 space-y-3 w-full">
                                        {msg.attachments.map(loc => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={loc.id}
                                                className="bg-white border border-gray-100 rounded-2xl p-3 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                                            >
                                                <img src={loc.image} alt="" className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm truncate text-gray-900">{loc.title}</h4>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                        <ChefHat className="h-3 w-3" /> {loc.category} • ⭐ {loc.rating}
                                                    </p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                                    <MoveUp className="h-4 w-4 rotate-45" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-1 px-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white/80 border-t border-black/5 backdrop-blur-md">
                        <div className="relative flex items-center bg-gray-100/50 rounded-full border border-transparent focus-within:border-purple-200 focus-within:bg-white focus-within:shadow-md transition-all">
                            <Input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Message..."
                                className="bg-transparent border-none shadow-none focus-visible:ring-0 text-base py-6 pl-6 pr-12 placeholder:text-gray-400"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className={`absolute right-2 w-8 h-8 rounded-full transition-all ${input.trim() ? 'bg-black text-white scale-100' : 'bg-gray-200 text-gray-400 scale-90'}`}
                                disabled={!input.trim() || isTyping}
                            >
                                <MoveUp className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
