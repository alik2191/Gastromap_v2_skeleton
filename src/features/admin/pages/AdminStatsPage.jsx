import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
    MapPin, CreditCard, TrendingUp,
    ArrowUpRight, ArrowDownRight, Calendar, Download,
    MousePointer2, Clock, Star, Globe, UtensilsCrossed
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocationsStore } from '@/features/public/hooks/useLocationsStore'

const COLORS = ['bg-indigo-500', 'bg-blue-500', 'bg-purple-500', 'bg-violet-500', 'bg-fuchsia-500', 'bg-pink-500']

const AdminStatsPage = () => {
    const locations = useLocationsStore(s => s.locations)
    const [dateRange, setDateRange] = useState('30')

    // --- Real derived stats ---
    const stats = useMemo(() => {
        const cityCount = new Set(locations.map(l => l.city).filter(Boolean)).size
        const avgRating = locations.length > 0
            ? (locations.reduce((s, l) => s + (l.rating ?? 0), 0) / locations.length).toFixed(2)
            : 0
        const topRated = locations.filter(l => l.rating >= 4.8).length

        return [
            {
                label: 'Локации',
                value: locations.length.toLocaleString(),
                change: locations.length > 0 ? `${locations.length} в базе` : '—',
                isPositive: true,
                icon: MapPin,
                color: 'indigo',
                isReal: true,
            },
            {
                label: 'Городов',
                value: cityCount.toLocaleString(),
                change: cityCount > 0 ? `${cityCount} город${cityCount === 1 ? '' : 'а'}` : '—',
                isPositive: true,
                icon: Globe,
                color: 'purple',
                isReal: true,
            },
            {
                label: 'Ср. Рейтинг',
                value: avgRating > 0 ? `★ ${avgRating}` : '—',
                change: topRated > 0 ? `${topRated} выше 4.8` : 'нет данных',
                isPositive: avgRating >= 4.5,
                icon: Star,
                color: 'orange',
                isReal: true,
            },
            {
                label: 'Выручка',
                value: '$0',
                change: 'Est. — нет данных',
                isPositive: true,
                icon: CreditCard,
                color: 'emerald',
                isReal: false,
            },
        ]
    }, [locations])

    // City distribution from real data
    const locationsByCity = useMemo(() => {
        const map = new Map()
        locations.forEach(l => {
            if (!l.city) return
            map.set(l.city, (map.get(l.city) || 0) + 1)
        })
        return Array.from(map.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([city, count], i) => ({ city, count, color: COLORS[i] ?? 'bg-slate-400' }))
    }, [locations])

    // Category distribution from real data
    const locationsByCategory = useMemo(() => {
        const map = new Map()
        locations.forEach(l => {
            if (!l.category) return
            map.set(l.category, (map.get(l.category) || 0) + 1)
        })
        return Array.from(map.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([cat, count], i) => ({ cat, count, color: COLORS[i] ?? 'bg-slate-400' }))
    }, [locations])

    // Top 5 locations by rating
    const topLocations = useMemo(() => {
        return [...locations]
            .filter(l => l.rating > 0)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5)
    }, [locations])

    const maxCityCount = locationsByCity[0]?.count || 1
    const maxCatCount = locationsByCategory[0]?.count || 1

    // Export CSV
    const handleExport = () => {
        const rows = [
            ['Название', 'Город', 'Страна', 'Категория', 'Рейтинг', 'Цена'],
            ...locations.map(l => [
                l.title || l.name || '',
                l.city || '',
                l.country || '',
                l.category || '',
                l.rating ?? '',
                l.priceLevel || l.price_range || '',
            ])
        ]
        const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = `gastromap-stats-${new Date().toISOString().slice(0,10)}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    const colorMap = {
        indigo:  { glow: 'bg-indigo-500',  icon: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
        purple:  { glow: 'bg-purple-500',  icon: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
        emerald: { glow: 'bg-emerald-500', icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
        orange:  { glow: 'bg-orange-500',  icon: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
    }

    return (
        <div className="space-y-6 lg:space-y-8 pb-10 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-tight">Аналитика</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-0.5 text-xs lg:text-sm">
                        Реальные данные из базы · {locations.length} локаций
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        value={dateRange}
                        onChange={e => setDateRange(e.target.value)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest grow sm:grow-0 outline-none"
                    >
                        <option value="7">7 Дней</option>
                        <option value="30">30 Дней</option>
                        <option value="90">90 Дней</option>
                        <option value="all">Всё время</option>
                    </select>
                    <button
                        onClick={handleExport}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                    >
                        <Download size={16} />
                        Экспорт
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-[20px] lg:rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-500/10 transition-colors"
                    >
                        <div className={cn(
                            "absolute -top-4 -right-4 w-20 lg:w-32 h-20 lg:h-32 rounded-full blur-[40px] lg:blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity",
                            colorMap[stat.color]?.glow
                        )} />

                        <div className="flex justify-between items-start mb-4 lg:mb-6 relative z-10">
                            <div className={cn(
                                "p-2.5 lg:p-3 rounded-xl lg:rounded-[18px] shadow-inner",
                                colorMap[stat.color]?.icon
                            )}>
                                <stat.icon size={20} className="lg:w-6 lg:h-6" />
                            </div>
                            {!stat.isReal && (
                                <span className="text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">Est.</span>
                            )}
                        </div>

                        <div className="relative z-10">
                            <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-0.5 lg:mb-1">{stat.label}</p>
                            <h3 className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white leading-tight truncate">{stat.value}</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{stat.change}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* Locations by city chart (real data) */}
                <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-5 lg:p-10 rounded-[32px] lg:rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-8 pl-1">
                        <div>
                            <h2 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">Локации по городам</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Реальное распределение из базы</p>
                        </div>
                    </div>

                    {locationsByCity.length > 0 ? (
                        <div className="space-y-6">
                            {locationsByCity.map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] lg:text-xs font-bold uppercase tracking-wider">
                                        <span className="text-slate-500 dark:text-slate-400">{item.city}</span>
                                        <span className="text-slate-900 dark:text-white">{item.count} лок.</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-full overflow-hidden shadow-inner border border-slate-200/5 dark:border-slate-700/50">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.count / maxCityCount) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                                            className={cn("h-full rounded-full shadow-lg", item.color)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50">
                            Нет данных
                        </div>
                    )}

                    {/* Category distribution */}
                    {locationsByCategory.length > 0 && (
                        <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 pl-1">По категориям</h3>
                            <div className="space-y-4">
                                {locationsByCategory.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", item.color)} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider mb-1">
                                                <span className="text-slate-500 dark:text-slate-400 truncate">{item.cat}</span>
                                                <span className="text-slate-900 dark:text-white ml-2">{item.count}</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(item.count / maxCatCount) * 100}%` }}
                                                    transition={{ duration: 0.8, delay: 0.5 + i * 0.08 }}
                                                    className={cn("h-full rounded-full", item.color)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Impact panel */}
                <div className="bg-slate-950 dark:bg-black p-6 lg:p-10 rounded-[32px] lg:rounded-[48px] text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 lg:w-64 h-48 lg:h-64 bg-indigo-500/10 blur-[60px] lg:blur-[100px] -mr-16 -mt-16" />

                    <div className="flex items-center gap-3 mb-8 pl-1 relative z-10">
                        <h2 className="text-lg lg:text-xl font-bold leading-tight">AI Impact</h2>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full">Demo</span>
                    </div>
                    <div className="space-y-4 lg:space-y-6 relative z-10">
                        <div className="p-5 lg:p-6 rounded-[24px] lg:rounded-[32px] bg-white/5 border border-white/5 backdrop-blur-xl group hover:border-white/10 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><MousePointer2 size={20} /></div>
                                <div>
                                    <p className="text-[9px] lg:text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-0.5">CTR AI REC</p>
                                    <p className="text-xl lg:text-2xl font-bold italic">24.8%</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-400 uppercase tracking-widest">
                                <ArrowUpRight size={12} />
                                <span>+4.2%</span>
                            </div>
                        </div>

                        <div className="p-5 lg:p-6 rounded-[24px] lg:rounded-[32px] bg-white/5 border border-white/5 backdrop-blur-xl group hover:border-white/10 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Clock size={20} /></div>
                                <div>
                                    <p className="text-[9px] lg:text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-0.5">Retention</p>
                                    <p className="text-xl lg:text-2xl font-bold italic">68.2%</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-400 uppercase tracking-widest leading-none">
                                <ArrowUpRight size={12} />
                                <span>Healthy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Locations by Rating */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] lg:rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 lg:p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/20 dark:bg-slate-800/20">
                    <h2 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">Топ локаций по рейтингу</h2>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Реальные данные</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                                <th className="px-6 lg:px-10 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">#</th>
                                <th className="px-6 lg:px-10 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Название</th>
                                <th className="px-6 lg:px-10 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Город</th>
                                <th className="px-6 lg:px-10 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Категория</th>
                                <th className="px-6 lg:px-10 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Рейтинг</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {topLocations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50">Нет данных</td>
                                </tr>
                            ) : topLocations.map((loc, i) => (
                                <tr key={loc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                                    <td className="px-6 lg:px-10 py-4 text-[11px] font-bold text-slate-300 dark:text-slate-600">#{i + 1}</td>
                                    <td className="px-6 lg:px-10 py-4">
                                        <div className="flex items-center gap-3">
                                            {loc.image && <img src={loc.image} alt={loc.title} className="w-8 h-8 rounded-lg object-cover" />}
                                            <span className="text-[13px] font-bold text-slate-900 dark:text-white">{loc.title || loc.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 lg:px-10 py-4 text-[11px] font-bold text-slate-500">{loc.city}</td>
                                    <td className="px-6 lg:px-10 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{loc.category}</td>
                                    <td className="px-6 lg:px-10 py-4">
                                        <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                                            <Star size={14} className="fill-current" />
                                            {loc.rating}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminStatsPage
