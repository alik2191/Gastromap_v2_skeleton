import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, User, Mail, UserCircle, Save, Utensils, Sparkles, Heart } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useAuthStore } from '../../auth/hooks/useAuthStore'

const ProfileEditPage = () => {
    const { user: authUser, updateProfile } = useAuthStore()
    const user = authUser || {
        name: 'Alex Johnson',
        email: 'alex@gastromap.com',
        preferences: {
            longTerm: {
                favoriteCuisines: ['Israeli', 'Modern Polish', 'Coffee'],
                atmospherePreference: ['cozy', 'modern', 'quiet'],
                features: ['wifi', 'pet-friendly']
            }
        }
    }

    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        bio: user.bio || 'Food enthusiast traveling the world for the best flavors.',
        preferences: user.preferences || {
            longTerm: {
                favoriteCuisines: [],
                atmospherePreference: [],
                features: []
            }
        }
    })

    const textStyle = isDark ? "text-white" : "text-gray-900"
    const subTextStyle = isDark ? "text-gray-400" : "text-gray-500"
    const cardBg = isDark ? "bg-[#1f2128]/80 border-white/5" : "bg-white border-gray-100"
    const inputBg = isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"

    const handleSave = () => {
        updateProfile(formData)
        navigate('/profile')
    }

    // Toggle helper for preferences
    const togglePreference = (category, value) => {
        const current = formData.preferences.longTerm[category] || []
        const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value]

        setFormData({
            ...formData,
            preferences: {
                ...formData.preferences,
                longTerm: {
                    ...formData.preferences.longTerm,
                    [category]: updated
                }
            }
        })
    }

    const CUISINES = [
        'Italian', 'Japanese', 'Modern Polish', 'Israeli', 'Coffee', 'French', 'Georgian',
        'Chinese', 'Greek', 'Spanish', 'Mexican', 'Thai', 'American', 'Mediterranean', 'Indian', 'Vietnamese', 'Turkish'
    ]
    const ATMOSPHERES = ['cozy', 'modern', 'quiet', 'vibrant', 'romantic', 'family-friendly']
    const FEATURES = ['wifi', 'pet-friendly', 'outdoor seating', 'vegan-options', 'live music']

    return (
        <div className="w-full min-h-screen relative z-10 pb-32">
            {/* Header */}
            <div className="pt-24 px-6 mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate('/profile')}
                    className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className={`text-2xl font-black ${textStyle}`}>Edit Profile</h1>
            </div>

            <div className="px-5 space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                            {formData.name.charAt(0)}
                        </div>
                        <button className="absolute -bottom-1 -right-1 bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg border-[4px] border-[#0F1115] hover:scale-105 transition-transform">
                            <Camera size={18} />
                        </button>
                    </div>
                </div>

                {/* Basic Info */}
                <div className={`p-6 rounded-[32px] border ${cardBg} space-y-5`}>
                    <h3 className={`text-[11px] font-black uppercase tracking-widest ml-2 mb-2 ${subTextStyle}`}>Basic Information</h3>

                    <div className="space-y-2">
                        <label className={`text-[10px] font-bold uppercase tracking-tight ml-2 ${subTextStyle}`}>Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold outline-none border transition-all focus:border-blue-500 ${inputBg} ${textStyle}`}
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`text-[10px] font-bold uppercase tracking-tight ml-2 ${subTextStyle}`}>Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold outline-none border transition-all focus:border-blue-500 ${inputBg} ${textStyle}`}
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`text-[10px] font-bold uppercase tracking-tight ml-2 ${subTextStyle}`}>Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className={`w-full p-4 rounded-2xl text-sm font-bold outline-none border transition-all focus:border-blue-500 h-24 resize-none ${inputBg} ${textStyle}`}
                            placeholder="Tell us about yourself"
                        />
                    </div>
                </div>

                {/* Taste Profile Editor */}
                <div className={`p-6 rounded-[32px] border ${cardBg} space-y-6`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} className="text-yellow-500" />
                        <h3 className={`text-[11px] font-black uppercase tracking-widest ${subTextStyle}`}>Taste Profile DNA</h3>
                    </div>

                    {/* Cuisines Editor */}
                    <div className="space-y-3">
                        <label className={`text-[10px] font-black uppercase tracking-widest opacity-40 ml-1 ${textStyle}`}>Favorite Cuisines</label>
                        <div className="flex flex-wrap gap-2">
                            {CUISINES.map(cuisine => {
                                const isSelected = formData.preferences?.longTerm?.favoriteCuisines?.includes(cuisine)
                                return (
                                    <button
                                        key={cuisine}
                                        onClick={() => togglePreference('favoriteCuisines', cuisine)}
                                        className={`px-4 py-2 rounded-xl text-[11px] font-bold border transition-all ${isSelected
                                            ? (isDark ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-blue-600 border-blue-600 text-white')
                                            : (isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-gray-100 border-gray-200 text-gray-500')
                                            }`}
                                    >
                                        {cuisine}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Atmosphere Editor */}
                    <div className="space-y-3">
                        <label className={`text-[10px] font-black uppercase tracking-widest opacity-40 ml-1 ${textStyle}`}>Atmosphere Style</label>
                        <div className="flex flex-wrap gap-2">
                            {ATMOSPHERES.map(style => {
                                const isSelected = formData.preferences?.longTerm?.atmospherePreference?.includes(style)
                                return (
                                    <button
                                        key={style}
                                        onClick={() => togglePreference('atmospherePreference', style)}
                                        className={`px-4 py-2 rounded-xl text-[11px] font-bold border transition-all ${isSelected
                                            ? (isDark ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-purple-600 border-purple-600 text-white')
                                            : (isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-gray-100 border-gray-200 text-gray-500')
                                            }`}
                                    >
                                        #{style}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Features Editor */}
                    <div className="space-y-3">
                        <label className={`text-[10px] font-black uppercase tracking-widest opacity-40 ml-1 ${textStyle}`}>Must-have Features</label>
                        <div className="flex flex-wrap gap-2">
                            {FEATURES.map(feature => {
                                const isSelected = formData.preferences?.longTerm?.features?.includes(feature)
                                return (
                                    <button
                                        key={feature}
                                        onClick={() => togglePreference('features', feature)}
                                        className={`px-4 py-2 rounded-xl text-[11px] font-bold border transition-all ${isSelected
                                            ? (isDark ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-green-600 border-green-600 text-white')
                                            : (isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-gray-100 border-gray-200 text-gray-500')
                                            }`}
                                    >
                                        {feature}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="w-full py-4 rounded-[24px] bg-blue-600 text-white font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all"
                >
                    <Save size={18} />
                    Save Changes
                </button>
            </div>
        </div>
    )
}

export default ProfileEditPage
