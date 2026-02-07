import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, MapPin, ChefHat, X, MoveUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useLocationsStore } from '@/features/public/hooks/useLocationsStore'
import { useAuthStore } from '@/features/auth/hooks/useAuthStore'

// Shared AI Logic Hook
export const useGastroAI = () => {
    const { user, addToChatHistory } = useAuthStore()
    const [messages, setMessages] = useState([
        { id: 1, role: 'ai', content: `Hi ${user?.name || 'there'}! I'm GastroGuide. Ask me anything about dining in Krakow.` }
    ])
    const [isTyping, setIsTyping] = useState(false)
    const { locations } = useLocationsStore()
    const [sessionContext, setSessionContext] = useState({})

    // Helper function to analyze the query
    const analyzeQuery = (query) => {
        const context = { ...sessionContext };
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes("pizza")) {
            context.wantsPizza = true;
        }
        if (lowerQuery.includes("coffee") || lowerQuery.includes("cafe")) {
            context.wantsCoffee = true;
        }
        if (lowerQuery.includes("cheap") || lowerQuery.includes("budget")) {
            context.budget = true;
        }

        return { sessionContext: context };
    };

    // Helper function to get personalized recommendations
    const getPersonalizedRecommendation = (query, currentSessionContext) => {
        let aiResponse = { id: Date.now() + 1, role: 'ai', content: "I'm looking for the best matches..." };

        let filteredLocations = [...locations];

        // Apply user's long-term preferences first (if available)
        if (user?.preferences?.longTerm?.favoriteCuisines?.length > 0) {
            const favCuisines = user.preferences.longTerm.favoriteCuisines.map(c => c.toLowerCase());
            filteredLocations = filteredLocations.sort((a, b) => {
                const aMatch = favCuisines.some(cuisine =>
                    a.category.toLowerCase().includes(cuisine) ||
                    a.tags.some(t => t.toLowerCase().includes(cuisine))
                );
                const bMatch = favCuisines.some(cuisine =>
                    b.category.toLowerCase().includes(cuisine) ||
                    b.tags.some(t => t.toLowerCase().includes(cuisine))
                );
                return bMatch - aMatch;
            });
        }

        // Filter locations based on short-term context
        if (currentSessionContext.wantsPizza) {
            filteredLocations = filteredLocations.filter(loc =>
                loc.category.toLowerCase().includes('pizza') ||
                loc.tags.some(t => t.toLowerCase().includes('pizza'))
            );
        }

        if (currentSessionContext.wantsCoffee) {
            filteredLocations = filteredLocations.filter(loc =>
                loc.category.toLowerCase().includes('cafe') ||
                loc.category.toLowerCase().includes('coffee') ||
                loc.tags.some(t => t.toLowerCase().includes('coffee'))
            );
        }

        // Fallback search
        if (!currentSessionContext.wantsPizza && !currentSessionContext.wantsCoffee) {
            const lowerText = query.toLowerCase();
            filteredLocations = filteredLocations.filter(loc =>
                lowerText.includes(loc.category.toLowerCase()) ||
                loc.tags.some(tag => lowerText.includes(tag.toLowerCase())) ||
                loc.title.toLowerCase().includes(lowerText)
            );
        }

        // Format response
        if (filteredLocations.length > 0) {
            aiResponse = {
                id: Date.now() + 1,
                role: 'ai',
                content: `Based on your preferences, I found ${filteredLocations.length} places for you!`,
                attachments: filteredLocations.slice(0, 3)
            };
        } else if (query.toLowerCase().includes('hello') || query.toLowerCase().includes('hi')) {
            aiResponse = { id: Date.now() + 1, role: 'ai', content: `Hello ${user?.name || 'there'}! Ready for a culinary adventure?` }
        } else {
            aiResponse = { id: Date.now() + 1, role: 'ai', content: "I didn't find specific matches, but I can recommend some great cafes generally." };
        }

        return aiResponse;
    };

    const sendMessage = async (text) => {
        const userMsg = { id: Date.now(), role: 'user', content: text }
        setMessages(prev => [...prev, userMsg])
        setIsTyping(true)

        if (addToChatHistory) {
            addToChatHistory({ role: 'user', content: text, timestamp: Date.now() })
        }

        const { sessionContext: newContext } = analyzeQuery(text);
        setSessionContext(newContext);

        setTimeout(() => {
            const aiResponse = getPersonalizedRecommendation(text, newContext);
            setMessages(prev => [...prev, aiResponse])

            if (addToChatHistory) {
                addToChatHistory({ role: 'ai', content: aiResponse.content, timestamp: Date.now() })
            }

            setIsTyping(false)
        }, 1500)
    }

    return { messages, isTyping, sendMessage }
}

// Unified Chat Interface Component
export function ChatInterface({ messages, isTyping, onSendMessage, transparent = false, className = "" }) {
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
        onSendMessage(input)
        setInput('')
    }

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Chat Area */}
            <div className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-4 ${transparent ? 'pb-24' : ''}`} ref={scrollRef}>
                {messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                            className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed max-w-[85%] shadow-lg backdrop-blur-sm ${msg.role === 'user'
                                    ? transparent
                                        ? 'bg-white/90 dark:bg-white/95 text-gray-900 rounded-br-none border border-white/40'
                                        : 'bg-black text-white rounded-br-none'
                                    : transparent
                                        ? 'bg-white/80 dark:bg-black/60 text-gray-900 dark:text-white rounded-bl-none border border-white/30 dark:border-white/20'
                                        : 'bg-white border border-black/5 text-gray-800 rounded-bl-none'
                                }`}
                        >
                            {msg.content}
                        </div>

                        {/* Attachments (Cards) */}
                        {msg.attachments && (
                            <div className="mt-2 space-y-3 w-full max-w-[85%]">
                                {msg.attachments.map(loc => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={loc.id}
                                        className={`rounded-2xl p-3 flex gap-3 items-center shadow-lg backdrop-blur-sm cursor-pointer group transition-all hover:scale-[1.02] ${transparent
                                                ? 'bg-white/90 dark:bg-black/70 border border-white/40 dark:border-white/20'
                                                : 'bg-white border border-gray-100'
                                            }`}
                                    >
                                        <img src={loc.image} alt="" className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-bold text-sm truncate ${transparent ? 'text-gray-900 dark:text-white' : 'text-gray-900'}`}>
                                                {loc.title}
                                            </h4>
                                            <p className={`text-xs flex items-center gap-1 mt-1 ${transparent ? 'text-gray-700 dark:text-gray-300' : 'text-muted-foreground'}`}>
                                                <ChefHat className="h-3 w-3" /> {loc.category} • ⭐ {loc.rating}
                                            </p>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${transparent
                                                ? 'bg-gray-100/50 dark:bg-white/10 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black'
                                                : 'bg-gray-50 group-hover:bg-black group-hover:text-white'
                                            }`}>
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
                        <div className={`w-2 h-2 rounded-full animate-bounce delay-0 ${transparent ? 'bg-white/80' : 'bg-gray-400'}`} />
                        <div className={`w-2 h-2 rounded-full animate-bounce delay-100 ${transparent ? 'bg-white/80' : 'bg-gray-400'}`} />
                        <div className={`w-2 h-2 rounded-full animate-bounce delay-200 ${transparent ? 'bg-white/80' : 'bg-gray-400'}`} />
                    </div>
                )}
            </div>

            {/* Input Area - Fixed at bottom on mobile */}
            <form
                onSubmit={handleSend}
                className={`flex-shrink-0 p-3 md:p-4 border-t backdrop-blur-xl ${transparent
                        ? 'bg-white/20 dark:bg-black/30 border-white/20 dark:border-white/10 md:relative md:bottom-0 fixed bottom-0 left-0 right-0 md:left-auto md:right-auto z-[60]'
                        : 'bg-white/80 dark:bg-gray-900/80 border-black/5 dark:border-white/5'
                    }`}
            >
                <div className={`relative flex items-center rounded-full border transition-all shadow-lg ${transparent
                        ? 'bg-white/90 dark:bg-black/70 border-white/40 dark:border-white/20 focus-within:border-white/60 focus-within:bg-white/95 dark:focus-within:bg-black/80 focus-within:shadow-2xl'
                        : 'bg-gray-100/50 dark:bg-gray-800/50 border-transparent focus-within:border-purple-200 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:shadow-md'
                    }`}>
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Message..."
                        className={`bg-transparent border-none shadow-none focus-visible:ring-0 text-base py-5 md:py-6 pl-5 md:pl-6 pr-12 placeholder:font-medium ${transparent
                                ? 'text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400'
                                : 'text-gray-900 dark:text-white placeholder:text-gray-400'
                            }`}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className={`absolute right-2 w-9 h-9 rounded-full transition-all shadow-lg ${input.trim()
                                ? transparent
                                    ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white scale-100 hover:scale-110'
                                    : 'bg-black text-white scale-100'
                                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 scale-90'
                            }`}
                        disabled={!input.trim() || isTyping}
                    >
                        <MoveUp className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}
