import React from 'react'
import { Send, Sparkles } from 'lucide-react'

const AIGuidePage = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-[2.5vw] min-h-screen flex flex-col relative z-10 pt-24 pb-24">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-blue-600 rounded-[32px] flex items-center justify-center shadow-2xl animate-pulse">
                    <Sparkles size={40} className="text-white" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white">AI Guide</h1>
                    <p className="text-white/60 text-sm max-w-xs">Your personal culinary assistant is ready. Ask anything about Krakow's food scene.</p>
                </div>
            </div>

            <div className="w-full max-w-lg mx-auto mb-4 px-4">
                <div className="relative flex items-center h-16 px-6 rounded-[32px] glass border border-white/20 shadow-2xl">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="bg-transparent flex-1 outline-none text-white font-bold placeholder:text-white/40"
                    />
                    <button className="p-3 bg-white rounded-2xl text-blue-600 shadow-lg active:scale-90 transition-transform">
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AIGuidePage
