import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star } from 'lucide-react'

const FilterModal = ({ isOpen, onClose, theme }) => {
    const isDark = theme === 'dark'

    // Layout configurations for Mobile vs Desktop
    const modalVariants = {
        hidden: {
            y: "100%",
            opacity: 1,
            scale: 1
        },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring", damping: 25, stiffness: 200 }
        },
        desktopHidden: {
            opacity: 0,
            scale: 0.95,
            y: 0
        },
        desktopVisible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.2 }
        }
    }

    if (typeof document === 'undefined') return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center pointer-events-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className={`relative w-full md:max-w-2xl overflow-hidden shadow-2xl border transition-colors duration-300
                            ${isDark
                                ? 'bg-[#1a1a1a] border-white/10 text-white'
                                : 'bg-white border-gray-200 text-gray-900'}
                            rounded-t-[32px] md:rounded-[32px]
                        `}
                        style={{ maxHeight: '90vh' }}
                    >
                        {/* Header */}
                        <div className={`p-6 flex justify-between items-center border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                            <h2 className="text-[20px] font-bold">Filters</h2>
                            <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'bg-white/5 text-white/60 hover:text-white' : 'bg-gray-100 text-gray-400 hover:text-gray-900'}`}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-6 md:p-8 overflow-y-auto space-y-8 pb-40 custom-scrollbar" style={{ maxHeight: 'calc(90vh - 80px)' }}>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Type Selection */}
                                <div className="space-y-4 text-left">
                                    <label className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Type</label>
                                    <div className="relative">
                                        <select className={`w-full h-14 border rounded-2xl px-4 font-medium appearance-none outline-none focus:border-blue-500 transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                                            <option>All Types</option>
                                            <option>Fine Dining</option>
                                            <option>Cafe</option>
                                            <option>Bar</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <X size={16} className="rotate-45" />
                                        </div>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="space-y-4 text-left">
                                    <label className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Rating</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button className="h-14 rounded-2xl bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/20">Any</button>
                                        <button className={`h-14 rounded-2xl border flex items-center justify-center gap-1.5 font-semibold text-sm transition-all ${isDark ? 'bg-white/5 border-white/5 text-white shadow-none' : 'bg-white border-gray-100 text-gray-600 shadow-sm'}`}>
                                            <Star size={16} className="text-yellow-500 fill-yellow-500" /> 4+
                                        </button>
                                        <button className={`h-14 rounded-2xl border flex items-center justify-center gap-1.5 font-semibold text-sm transition-all ${isDark ? 'bg-white/5 border-white/5 text-white shadow-none' : 'bg-white border-gray-100 text-gray-600 shadow-sm'}`}>
                                            <Star size={16} className="text-yellow-500 fill-yellow-500" /> 4.5+
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-4 text-left">
                                <label className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Price Range</label>
                                <div className="pt-2 relative">
                                    <input type="range" className="w-full h-2 bg-blue-600/10 rounded-full appearance-none cursor-pointer accent-blue-600" />
                                    <div className={`flex justify-between mt-3 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                                        <span>$ Budget</span>
                                        <span>$$ Mid</span>
                                        <span>$$$ High</span>
                                        <span>$$$$ Luxury</span>
                                    </div>
                                </div>
                            </div>

                            {/* Special Features */}
                            <div className="space-y-4 text-left">
                                <label className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Establishment Features</label>
                                <div className="flex flex-wrap gap-2.5">
                                    {[
                                        'All Day Breakfast', 'Board Games', 'Breakfast Menu', 'Business Lunch',
                                        'Scenic View', 'Seasonal Menu', 'Specialty Coffee', 'Sports Broadcasts',
                                        'Pet Friendly', 'Free Wi-Fi', 'Outdoor Seating', 'Live Music'
                                    ].map(chip => (
                                        <button key={chip} className={`px-5 py-3 rounded-2xl font-semibold text-[12px] border transition-all ${isDark ? 'bg-white/5 border-white/5 text-white/80 hover:bg-white/10' : 'bg-white border-gray-100 text-gray-600 hover:border-blue-500 hover:text-blue-600'}`}>
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Distance */}
                            <div className="space-y-4 text-left pt-6 border-t border-white/5">
                                <div className="flex justify-between items-center">
                                    <label className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Search Radius</label>
                                    <span className="text-blue-500 font-bold text-sm">10 km</span>
                                </div>
                                <input type="range" className="w-full h-2 bg-blue-600/10 rounded-full appearance-none cursor-pointer accent-blue-600" />
                                <div className={`flex justify-between text-[10px] font-bold uppercase ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                                    <span>Nearby</span>
                                    <span>City-wide</span>
                                    <span>Regional</span>
                                </div>
                            </div>

                        </div>

                        {/* Footer Action */}
                        <div className={`absolute bottom-0 left-0 right-0 p-6 pb-8 md:p-8 backdrop-blur-md border-t ${isDark ? 'bg-[#1a1a1a]/80 border-white/5' : 'bg-white/80 border-gray-100'}`}>
                            <button
                                onClick={onClose}
                                className="w-full h-16 bg-blue-600 text-white font-bold rounded-[20px] shadow-xl shadow-blue-500/30 active:scale-[0.98] hover:bg-blue-700 transition-all text-base"
                            >
                                Apply 12 Filters
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    )
}

export default FilterModal
