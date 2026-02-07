import React from 'react'
import { Sparkles } from 'lucide-react'
import { useGastroAI, ChatInterface } from '@/features/shared/components/GastroAIChat'

const AIGuidePage = () => {
    const { messages, isTyping, sendMessage } = useGastroAI()

    return (
        <div className="w-full h-screen flex flex-col relative z-10 pt-20 pb-2 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-black/5 dark:from-black/20 dark:to-black/20" />

            {/* Header Section */}
            <div className="relative flex-shrink-0 px-6 py-4 text-center border-b border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-xl">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Sparkles size={24} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-white drop-shadow-lg">AI Guide</h1>
                </div>
                <p className="text-sm text-white/80 drop-shadow max-w-md mx-auto font-medium">
                    Your personal culinary assistant for Krakow's food scene
                </p>
            </div>

            {/* Chat Interface - Full Screen with padding for bottom nav */}
            <div className="relative flex-1 flex flex-col overflow-hidden pb-20 md:pb-0">
                <ChatInterface
                    messages={messages}
                    isTyping={isTyping}
                    onSendMessage={sendMessage}
                    transparent={true}
                />
            </div>
        </div>
    )
}

export default AIGuidePage
