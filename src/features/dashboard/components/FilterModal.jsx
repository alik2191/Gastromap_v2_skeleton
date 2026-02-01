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
                                <div className="space-y-4 text-left md:col-span-2">
                                    <label className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Establishment Type</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                        {/* Type blocks */}
                                        {[
                                            { id: 'all', label: 'All', icon: '🌎' },
                                            { id: 'cafe', label: 'Cafe', icon: '☕' },
                                            { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
                                            { id: 'street_food', label: 'Street', icon: '🍕' },
                                            { id: 'bar', label: 'Bar', icon: '🍸' },
                                            { id: 'market', label: 'Market', icon: '🛒' },
                                            { id: 'bakery', label: 'Bakery', icon: '🥐' },
                                            { id: 'winery', label: 'Winery', icon: '🍷' },
                                            { id: 'coffee', label: 'Coffee', icon: '☕' },
                                            { id: 'pastry', label: 'Pastry', icon: '🍰' }
                                        ].map(type => (
                                            <button
                                                key={type.id}
                                                className={`p-2 rounded-[16px] border transition-all duration-500 group cursor-pointer flex items-center gap-3 ${isDark
                                                    ? 'bg-white/[0.05] border-white/10 text-white/80 hover:bg-white/[0.1] hover:border-white/20 hover:shadow-lg'
                                                    : 'bg-white border-gray-100 text-gray-900 shadow-sm hover:shadow-lg hover:border-blue-500/30'
                                                    }`}
                                            >
                                                <span className="text-xl group-hover:scale-110 transition-transform duration-500">{type.icon}</span>
                                                <span className="text-[11px] font-bold">{type.label}</span>
                                            </button>
                                        ))}
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

                            {/* Best Time to Visit */}
                            <div className="space-y-4 text-left">
                                <label className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Best Time to Visit</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'morning', label: 'Morning', icon: '🌅' },
                                        { id: 'day', label: 'Day', icon: '☀️' },
                                        { id: 'evening', label: 'Evening', icon: '🌙' },
                                        { id: 'late_night', label: 'Night', icon: '✨' }
                                    ].map(time => (
                                        <button
                                            key={time.id}
                                            className={`p-2 rounded-[16px] border transition-all duration-500 group cursor-pointer flex items-center gap-3 ${isDark
                                                ? 'bg-white/[0.05] border-white/10 text-white/80 hover:bg-white/[0.1] hover:border-white/20 hover:shadow-lg'
                                                : 'bg-white border-gray-100 text-gray-900 shadow-sm hover:shadow-lg hover:border-blue-500/30'
                                                }`}
                                        >
                                            <span className="text-xl group-hover:scale-110 transition-transform duration-500">{time.icon}</span>
                                            <span className="text-[11px] font-bold">{time.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Establishment Features (Labels) */}
                            <div className="space-y-6 text-left">
                                <label className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Special Features & Labels</label>

                                <div className="space-y-6">
                                    {[
                                        {
                                            group: "Cuisine & Menu",
                                            items: ["Signature Cuisine", "Vegan Menu", "Delicious Desserts", "All Day Breakfast", "Imported Products", "Local Products", "Breakfast Menu", "Lunch Menu", "Fusion"]
                                        },
                                        {
                                            group: "Bar & Drinks",
                                            items: ["Signature Cocktails", "Wine List", "Guest Shifts", "Wine Tasting", "DJ Sets", "Craft Beer", "Mixology", "Specialty Coffee", "Wide Gin Selection"]
                                        },
                                        {
                                            group: "Atmosphere",
                                            items: ["Scenic View", "Live Music", "Coworking", "Board Games", "Lively", "Romantic", "Speakeasy", "Happy Hours", "Themed Interior", "Quiet Atmosphere", "Cozy"]
                                        },
                                        {
                                            group: "Amenities & Service",
                                            items: ["Balconies", "Kids Area", "High Chairs", "Delivery", "Inclusive", "Local Favorite", "Parking", "Pet friendly", "Takeaway", "Courtyard Terrace", "Rooftop Terrace", "WiFi"]
                                        },
                                        {
                                            group: "Awards & Special",
                                            items: ["Michelin Guide", "Michelin Star", "Hookah", "Late Dinner"]
                                        }
                                    ].map(cat => (
                                        <div key={cat.group} className="space-y-3">
                                            <h4 className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-white/50' : 'text-gray-300'}`}>{cat.group}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {cat.items.sort().map(chip => (
                                                    <button key={chip} className={`px-4 py-2 rounded-xl font-bold text-[11px] border transition-all ${isDark ? 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10' : 'bg-gray-50/50 border-gray-100 text-gray-500 hover:border-blue-500/30 hover:text-blue-600'}`}>
                                                        {chip}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
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
