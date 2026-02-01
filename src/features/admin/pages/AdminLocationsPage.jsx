import React, { useState } from 'react'
import {
    Plus, Search, Filter, MoreHorizontal, Edit, Trash2,
    Download, Upload, ChevronRight, Globe, Building2, MapPin,
    CheckCircle, Clock, AlertCircle, Star, ChevronDown, ArrowRight,
    X, LayoutGrid, List as ListIcon, Activity, Zap
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import LocationHierarchyExplorer from '../components/LocationHierarchyExplorer'

const AdminLocationsPage = () => {
    const [view, setView] = useState('list')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)

    const [locationsList, setLocationsList] = useState([
        { id: 1, name: 'Zen Garden', category: 'Restaurant', city: 'Krakow', country: 'Poland', status: 'Active', rating: 4.8, description: 'Лучший дзен в Кракове', address: 'ul. Kanonicza 12' },
        { id: 2, name: 'Coffee Hub', category: 'Cafe', city: 'Warsaw', country: 'Poland', status: 'Pending', rating: 4.5, description: 'Кофе и работа', address: 'ul. Marszałkowska 8' },
        { id: 3, name: 'Pasta Viva', category: 'Restaurant', city: 'Berlin', country: 'Germany', status: 'Active', rating: 4.2, description: 'Итальянская страсть', address: 'Müllerstraße 15' },
        { id: 4, name: 'Sushi Wave', category: 'Sushi', city: 'Krakow', country: 'Poland', status: 'Draft', rating: 0.0, description: 'Японская волна', address: 'ul. Grodzka 3' },
    ])

    const stats = [
        { label: 'Всего', val: '456', icon: MapPin, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
        { label: 'В очереди', val: '12', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
        { label: 'Сегодня', val: '+5', icon: Zap, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
    ]

    const handleApprove = (id) => setLocationsList(prev => prev.map(l => l.id === id ? { ...l, status: 'Active' } : l))

    const renderListView = (filtered) => (
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-8 lg:pl-10">Объект</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">Локация</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">Рейтинг</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">Статус</th>
                        <th className="px-6 py-4 text-right pr-8 lg:pr-10"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {filtered.map((loc, i) => (
                        <tr key={loc.id} onClick={() => { setSelectedLocation(loc); setIsSlideOverOpen(true); }} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all group cursor-pointer border-none leading-none">
                            <td className="px-6 py-4 pl-8 lg:pl-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner shrink-0">
                                        <Building2 size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate leading-tight">{loc.name}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest font-bold">{loc.category}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-[11px] font-bold flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                    <MapPin size={12} className="text-slate-300 dark:text-slate-600" />
                                    <span>{loc.city}</span>
                                    <span className="opacity-30">/</span>
                                    <span className="opacity-60">{loc.country}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                    <Star size={12} className={cn("fill-current", loc.rating > 0 ? "text-yellow-500" : "text-slate-200 dark:text-slate-800")} />
                                    <span className="text-[11px] font-bold">{loc.rating > 0 ? loc.rating : '—'}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className={cn(
                                    "inline-flex items-center p-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider",
                                    loc.status === 'Active' ? 'bg-green-50 dark:bg-green-500/5 text-green-600' :
                                        loc.status === 'Pending' ? 'bg-orange-50 dark:bg-orange-500/5 text-orange-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                                )}>
                                    <div className={cn("w-1.5 h-1.5 rounded-full mr-2", loc.status === 'Active' ? 'bg-green-500' : loc.status === 'Pending' ? 'bg-orange-500' : 'bg-slate-300')} />
                                    {loc.status}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right pr-8 lg:pr-10">
                                <button className="p-2 rounded-xl text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all">
                                    <MoreHorizontal size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

    return (
        <div className="space-y-6 lg:space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div>
                    <h1 className="text-xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">Локации</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1.5 text-xs lg:text-base">База объектов и инструменты модерации.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto p-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/20 dark:border-slate-800/50">
                    <button className="flex-1 sm:px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-all">Импорт</button>
                    <button className="flex-1 sm:px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">Создать</button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 lg:gap-8">
                {stats.map((s, i) => (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white dark:bg-slate-900/50 p-4 lg:p-6 rounded-[28px] lg:rounded-[40px] border border-slate-100 dark:border-slate-800/50 shadow-sm flex flex-col sm:flex-row items-center gap-3 lg:gap-5 group hover:border-indigo-500/10 transition-all">
                        <div className={cn("w-10 h-10 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden relative", s.bg, s.color)}>
                            <s.icon size={20} className="lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-center sm:text-left min-w-0">
                            <p className="text-[9px] lg:text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1">{s.label}</p>
                            <p className="text-sm lg:text-2xl font-bold text-slate-900 dark:text-white leading-none tracking-tight truncate">{s.val}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Content Card */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[32px] lg:rounded-[48px] border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-4 lg:p-10 border-b border-slate-50 dark:border-slate-800/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex gap-1.5 p-1 bg-slate-50 dark:bg-slate-950/50 rounded-2xl w-full lg:w-fit overflow-x-auto no-scrollbar border border-slate-100/50 dark:border-slate-800/50">
                        {[
                            { id: 'list', label: 'Все объекты', icon: ListIcon },
                            { id: 'moderation', label: 'В очереди', icon: AlertCircle, count: 2 },
                            { id: 'hierarchy', label: 'География', icon: Globe }
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setView(tab.id)} className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                                view === tab.id ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            )}>
                                <tab.icon size={14} />{tab.label}
                                {tab.count > 0 && <span className="w-5 h-5 flex items-center justify-center bg-indigo-500 text-white rounded-lg text-[9px] ml-1 shadow-lg shadow-indigo-500/20">{tab.count}</span>}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <input type="text" placeholder="Поиск объектов..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/30 border-none rounded-2xl text-[13px] font-medium outline-none focus:ring-2 ring-indigo-500/10 transition-all font-black leading-none" />
                    </div>
                </div>

                <div className="flex-1 flex flex-col pt-2 font-black leading-none">
                    <AnimatePresence mode="wait">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={view}>
                            {view === 'list' && renderListView(locationsList)}
                            {view === 'moderation' && (
                                <div className="p-8 lg:p-14 space-y-6">
                                    {locationsList.filter(l => l.status === 'Pending').map(loc => (
                                        <div key={loc.id} className="bg-slate-50/50 dark:bg-slate-800/30 rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-indigo-500/10 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-[24px] bg-white dark:bg-slate-800 flex items-center justify-center text-slate-300 shadow-sm group-hover:scale-105 transition-transform"><Building2 size={24} /></div>
                                                <div>
                                                    <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white leading-none mb-2">{loc.name}</h3>
                                                    <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5"><MapPin size={12} /> {loc.city}, {loc.country}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 w-full sm:w-auto">
                                                <button onClick={() => handleApprove(loc.id)} className="flex-1 sm:px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[20px] font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all">Одобрить</button>
                                                <button className="flex-1 sm:px-8 py-3.5 bg-white dark:bg-slate-800 text-red-500 rounded-[20px] font-bold text-[10px] uppercase tracking-widest border border-slate-100 dark:border-slate-700 transition-all">Отмена</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {view === 'hierarchy' && <LocationHierarchyExplorer className="border-none shadow-none bg-transparent p-0" />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {isSlideOverOpen && selectedLocation && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSlideOverOpen(false)} className="fixed inset-0 z-[100] bg-slate-900/10 backdrop-blur-md" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 250 }} className="fixed top-0 right-0 w-full sm:w-[540px] bg-white dark:bg-slate-900 h-full z-[110] flex flex-col shadow-2xl overflow-hidden">

                            <div className="p-8 lg:p-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center shrink-0">
                                <div>
                                    <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-none mb-1.5">Редактирование</h2>
                                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] leading-none">ID: #{selectedLocation.id}</p>
                                </div>
                                <button onClick={() => setIsSlideOverOpen(false)} aria-label="close-panel" className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:rotate-90 transition-all"><X size={20} /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-10 custom-scrollbar relative">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] ml-1.5">Название объекта</label>
                                    <input type="text" defaultValue={selectedLocation.name} className="w-full px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border-2 border-transparent focus:border-indigo-500/10 focus:bg-white dark:focus:bg-slate-800 font-bold text-sm outline-none transition-all shadow-inner" />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] ml-1.5 font-black leading-none">Город</label>
                                        <input type="text" defaultValue={selectedLocation.city} className="w-full px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border-none font-bold text-sm outline-none shadow-inner" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] ml-1.5">Рейтинг</label>
                                        <div className="w-full px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-2">
                                            <Star size={14} className="text-yellow-500 fill-current" />
                                            <span className="font-bold text-sm">{selectedLocation.rating || '0.0'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] ml-1.5 font-black leading-none">Описание</label>
                                    <textarea rows={5} defaultValue={selectedLocation.description} className="w-full px-6 py-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border-none font-medium text-[13px] leading-relaxed outline-none shadow-inner resize-none" />
                                </div>

                                <div className="p-6 rounded-[32px] bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                                    <div className="flex items-center gap-3 text-indigo-500">
                                        <Zap size={18} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">GastroAI Статус</span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic opacity-80 pl-1">"Все данные выглядят корректно. Рекомендую обновить фото интерьера."</p>
                                </div>
                            </div>

                            <div className="p-8 lg:p-12 border-t border-slate-50 dark:border-slate-800/50 flex gap-4 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl relative z-10">
                                <button className="flex-1 py-4.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-bold text-[11px] uppercase tracking-widest shadow-2xl active:scale-[0.97] transition-all">Сохранить</button>
                                <button onClick={() => setIsSlideOverOpen(false)} className="px-10 py-4.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-3xl font-bold text-[11px] uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-all">Отмена</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminLocationsPage
