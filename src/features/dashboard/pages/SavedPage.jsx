import React from 'react'
import { Heart } from 'lucide-react'

const SavedPage = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-[2.5vw] min-h-screen flex flex-col relative z-10 pt-24">
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-20">
                <Heart size={48} className="text-red-500 opacity-50" />
                <h2 className="text-xl font-black text-white">Your Saved Places</h2>
                <p className="text-white/40 text-sm">Save places to see them here.</p>
            </div>
        </div>
    )
}

export default SavedPage
