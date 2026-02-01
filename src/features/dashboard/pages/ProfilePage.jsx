import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
    Star, MapPin, Utensils, Coffee, ChevronRight, Award,
    Settings, LogOut, User, Lock, MessageSquare, FileText,
    HelpCircle, Mail, Shield, Globe, UserX
} from 'lucide-react'
import { useAuthStore } from '../../auth/hooks/useAuthStore'
import { useTheme } from '@/hooks/useTheme'
import { createPortal } from 'react-dom'

// Simple Feedback Modal Component nested for convenience
const FeedbackModal = ({ isOpen, onClose, theme }) => {
    const isDark = theme === 'dark'
    if (!isOpen || typeof document === 'undefined') return null

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className={`relative w-full max-w-md p-6 rounded-[32px] overflow-hidden shadow-2xl border ${isDark ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                >
                    <h3 className="text-2xl font-bold mb-2">Send Feedback</h3>
                    <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>We'd love to hear your thoughts, suggestions, or bug reports.</p>

                    <textarea
                        className={`w-full h-32 p-4 rounded-2xl resize-none text-sm outline-none border focus:border-blue-500 transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                        placeholder="Type your message here..."
                    />

                    <div className="flex gap-3 mt-6">
                        <button onClick={onClose} className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>Cancel</button>
                        <button onClick={onClose} className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700">Send</button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    )
}

const ProfilePage = () => {
    const { user: authUser } = useAuthStore()
    const user = authUser || { name: 'Alex Johnson', email: 'alex@gastromap.com' }
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const navigate = useNavigate()

    // State for Feedback
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

    // Styling
    const textStyle = isDark ? "text-white" : "text-gray-900"
    const subTextStyle = isDark ? "text-gray-400" : "text-gray-500"
    const cardBg = isDark ? "bg-[#1f2128]/80 border-white/5" : "bg-white border-gray-100"
    const itemHover = isDark ? "hover:bg-white/5" : "hover:bg-gray-50"

    const stats = [
        { label: 'Level', val: 'Expert', icon: Star, color: 'text-yellow-500 bg-yellow-500/10' },
        { label: 'Visited', val: '12', icon: MapPin, color: 'text-blue-500 bg-blue-500/10' },
        { label: 'Reviews', val: '8', icon: Utensils, color: 'text-green-500 bg-green-500/10' },
        { label: 'Reward', val: 'Coffee', icon: Coffee, color: 'text-purple-500 bg-purple-500/10' },
    ]

    const menuItems = [
        {
            section: "Account",
            items: [
                { icon: User, label: "Personal Information", link: "/profile/edit" },
                { icon: Globe, label: "Language & Region", link: "/profile/language", value: "English" },
                { icon: Lock, label: "Security & Privacy", link: "/profile/security" },
            ]
        },
        {
            section: "Support & Feedback",
            items: [
                { icon: MessageSquare, label: "Send Feedback", action: () => setIsFeedbackOpen(true) },
                { icon: HelpCircle, label: "Help Center", link: "/help" },
            ]
        },
        {
            section: "Legal & Privacy",
            items: [
                { icon: FileText, label: "Terms of Service", link: "/terms" },
                { icon: Shield, label: "Privacy Policy", link: "/privacy" },
                { icon: UserX, label: "Request Data Deletion (GDPR)", link: "/privacy/delete-request" },
            ]
        }
    ];

    return (
        <div className="w-full min-h-screen relative z-10 pb-32">
            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} theme={theme} />

            {/* Profile Header - Compact */}
            <div className="pt-24 px-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-blue-500/30">
                        {user.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-1.5 rounded-full text-white shadow-lg border-[3px] border-[#0F1115]">
                        <Award size={14} />
                    </div>
                </div>
                <h1 className={`text-2xl font-black mb-1 ${textStyle}`}>{user.name}</h1>
                <p className={`text-sm font-medium ${subTextStyle}`}>{user.email}</p>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>Foodie</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-600'}`}>Reviewer</span>
                </div>
            </div>

            {/* Compact Stats Grid */}
            <div className="px-5 mt-8">
                <div className="grid grid-cols-2 gap-3">
                    {stats.map((stat, i) => (
                        <div key={i} className={`p-4 rounded-2xl border flex items-center gap-3 ${cardBg}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                                <stat.icon size={18} />
                            </div>
                            <div className="flex flex-col items-start overflow-hidden">
                                <span className={`text-[10px] font-bold uppercase opacity-50 truncate w-full text-left ${textStyle}`}>{stat.label}</span>
                                <span className={`text-base font-black truncate w-full text-left ${textStyle}`}>{stat.val}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Settings Menu Groups */}
            <div className="px-5 mt-8 space-y-6">
                {menuItems.map((group, groupIdx) => (
                    <div key={groupIdx}>
                        <h3 className={`text-[11px] font-black uppercase tracking-widest px-2 mb-3 ${subTextStyle}`}>{group.section}</h3>
                        <div className={`rounded-[24px] overflow-hidden border backdrop-blur-sm ${cardBg}`}>
                            {group.items.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => item.action ? item.action() : navigate(item.link)}
                                    className={`w-full flex items-center justify-between p-4 transition-colors ${itemHover} ${idx !== group.items.length - 1 ? (isDark ? 'border-b border-white/5' : 'border-b border-gray-100') : ''}`}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className={`p-2 rounded-xl ${isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                            <item.icon size={18} />
                                        </div>
                                        <span className={`text-[15px] font-bold ${textStyle}`}>{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.value && <span className={`text-xs font-medium ${subTextStyle}`}>{item.value}</span>}
                                        <ChevronRight size={16} className={isDark ? "text-white/30" : "text-gray-300"} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sign Out Action */}
            <div className="px-5 mt-8">
                <button className={`w-full p-4 rounded-[24px] border flex items-center justify-center gap-2 font-black text-red-500 transition-all active:scale-[0.98] ${isDark ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20' : 'bg-red-50 border-red-100 hover:bg-red-100'}`}>
                    <LogOut size={18} />
                    Sign Out
                </button>

                <div className="text-center mt-6">
                    <p className={`text-[10px] font-medium ${isDark ? 'text-white/20' : 'text-gray-300'}`}>GastroMap v2.0.4 • 2026</p>
                </div>
            </div>

        </div>
    )
}

export default ProfilePage
