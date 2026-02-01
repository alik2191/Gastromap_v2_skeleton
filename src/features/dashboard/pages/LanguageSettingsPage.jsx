import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Globe, Check } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

const LanguageSettingsPage = () => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const navigate = useNavigate()

    const [selectedLanguage, setSelectedLanguage] = useState('en')
    const [selectedRegion, setSelectedRegion] = useState('pl')

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'pl', name: 'Polski', flag: '🇵🇱' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'ua', name: 'Українська', flag: '🇺🇦' },
    ]

    const regions = [
        { code: 'pl', name: 'Poland' },
        { code: 'de', name: 'Germany' },
        { code: 'ua', name: 'Ukraine' },
        { code: 'gb', name: 'United Kingdom' },
    ]

    const textStyle = isDark ? "text-white" : "text-gray-900"
    const subTextStyle = isDark ? "text-gray-400" : "text-gray-500"
    const cardBg = isDark ? "bg-[#1f2128]/80 border-white/5" : "bg-white border-gray-100"
    const itemHover = isDark ? "hover:bg-white/5" : "hover:bg-gray-50"

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
                <h1 className={`text-2xl font-black ${textStyle}`}>Language & Region</h1>
            </div>

            <div className="px-5 space-y-8">
                {/* Language Section */}
                <div>
                    <h3 className={`text-[11px] font-black uppercase tracking-widest px-2 mb-3 ${subTextStyle}`}>Application Language</h3>
                    <div className={`rounded-[32px] overflow-hidden border backdrop-blur-sm ${cardBg}`}>
                        {languages.map((lang, idx) => (
                            <button
                                key={lang.code}
                                onClick={() => setSelectedLanguage(lang.code)}
                                className={`w-full flex items-center justify-between p-5 transition-colors ${itemHover} ${idx !== languages.length - 1 ? (isDark ? 'border-b border-white/5' : 'border-b border-gray-100') : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">{lang.flag}</span>
                                    <span className={`text-[16px] font-bold ${textStyle}`}>{lang.name}</span>
                                </div>
                                {selectedLanguage === lang.code && (
                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white scale-110 shadow-lg shadow-blue-500/30">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                    <p className={`mt-3 px-4 text-[12px] leading-relaxed ${subTextStyle}`}>
                        This will change the interface language. Search results and location descriptions will still be available in their original language.
                    </p>
                </div>

                {/* Region Section */}
                <div>
                    <h3 className={`text-[11px] font-black uppercase tracking-widest px-2 mb-3 ${subTextStyle}`}>Local Region</h3>
                    <div className={`rounded-[32px] overflow-hidden border backdrop-blur-sm ${cardBg}`}>
                        {regions.map((region, idx) => (
                            <button
                                key={region.code}
                                onClick={() => setSelectedRegion(region.code)}
                                className={`w-full flex items-center justify-between p-5 transition-colors ${itemHover} ${idx !== regions.length - 1 ? (isDark ? 'border-b border-white/5' : 'border-b border-gray-100') : ''}`}
                            >
                                <span className={`text-[16px] font-bold ${textStyle}`}>{region.name}</span>
                                {selectedRegion === region.code && (
                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white scale-110 shadow-lg shadow-blue-500/30">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LanguageSettingsPage
