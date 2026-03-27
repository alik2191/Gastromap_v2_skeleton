import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircle2, XCircle, Search, Filter,
    MapPin, User, Calendar, MessageSquare, AlertCircle,
    Star, Tag, Clock, ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocationsStore } from '@/features/public/hooks/useLocationsStore'

const STATUS_FILTERS = ['Все', 'Pending', 'Draft', 'Revision']

export default function AdminModerationPage() {
    const { locations, updateLocation, deleteLocation } = useLocationsStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('Все')
    const [showFilters, setShowFilters] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [revisionNote, setRevisionNote] = useState('')
    const [toast, setToast] = useState(null)

    // Auto-dismiss toast
    React.useEffect(() => {
        if (!toast) return
        const t = setTimeout(() => setToast(null), 3000)
        return () => clearTimeout(t)
    }, [toast])

    // Queue = locations that are Pending, Draft, or Revision
    const queue = useMemo(() => {
        return locations.filter(l =>
            l.status === 'Pending' || l.status === 'Draft' || l.status === 'Revision'
        )
    }, [locations])

    const filteredQueue = useMemo(() => {
        let result = queue
        if (statusFilter !== 'Все') {
            result = result.filter(l => l.status === statusFilter)
        }
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase()
            result = result.filter(l =>
                (l.title || l.name || '').toLowerCase().includes(q) ||
                l.city?.toLowerCase().includes(q) ||
                l.category?.toLowerCase().includes(q)
            )
        }
        return result
    }, [queue, statusFilter, searchTerm])

    const handleApprove = (id) => {
        updateLocation(id, { status: 'Active' })
        setSelectedItem(null)
        setToast({ message: '✓ Объект одобрен и опубликован' })
    }

    const handleRequestRevision = (id) => {
        if (!revisionNote.trim()) return
        updateLocation(id, { status: 'Revision', adminComment: revisionNote })
        setSelectedItem(null)
        setRevisionNote('')
        setToast({ message: '✓ Запрос на правку отправлен' })
    }

    const handleReject = (id) => {
        deleteLocation(id)
        setSelectedItem(null)
        setToast({ message: '✓ Объект отклонён и удалён' })
    }

    const getStatusLabel = (status) => {
        if (status === 'Pending') return 'На проверке'
        if (status === 'Draft') return 'Черновик'
        if (status === 'Revision') return 'Запрошена правка'
        return status
    }

    const getStatusColor = (status) => {
        if (status === 'Pending') return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
        if (status === 'Draft') return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
        if (status === 'Revision') return 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
        return 'bg-slate-100 text-slate-500'
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">Модерация</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-xs lg:text-sm font-medium">
                        {queue.length > 0
                            ? `${queue.length} объект${queue.length === 1 ? '' : queue.length < 5 ? 'а' : 'ов'} ожидают проверки`
                            : 'Очередь модерации пуста — все объекты проверены'}
                    </p>
                </div>
            </header>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Поиск по названию, городу, категории..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium shrink-0 transition-colors",
                            showFilters
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:text-indigo-400'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        )}
                    >
                        <Filter size={16} />
                        {statusFilter !== 'Все' ? statusFilter : 'Фильтр'}
                        <ChevronDown size={14} className={cn("transition-transform", showFilters && "rotate-180")} />
                    </button>
                    {showFilters && (
                        <div className="absolute right-0 top-12 z-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden min-w-[160px]">
                            {STATUS_FILTERS.map(f => (
                                <button
                                    key={f}
                                    onClick={() => { setStatusFilter(f); setShowFilters(false) }}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors",
                                        statusFilter === f
                                            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    )}
                                >
                                    {f === 'Все' ? 'Все статусы' : getStatusLabel(f)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Queue Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                                <th className="p-4 pl-6">Заведение</th>
                                <th className="p-4">Категория</th>
                                <th className="p-4">Рейтинг</th>
                                <th className="p-4">Статус</th>
                                <th className="p-4 pr-6 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            <AnimatePresence>
                                {filteredQueue.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50">
                                            {searchTerm || statusFilter !== 'Все' ? 'Ничего не найдено' : 'Очередь пуста — все объекты проверены'}
                                        </td>
                                    </tr>
                                ) : filteredQueue.map(item => (
                                    <motion.tr
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.title || item.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                                                        <MapPin size={18} />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                                                        {item.title || item.name}
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                        <MapPin size={10} /> {item.city}, {item.country}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.category || '—'}</span>
                                        </td>
                                        <td className="p-4">
                                            {item.rating > 0 ? (
                                                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                                                    <Star size={12} className="fill-current" /> {item.rating}
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 dark:text-slate-700 text-xs font-bold">—</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                                                getStatusColor(item.status)
                                            )}>
                                                <AlertCircle size={10} />
                                                {getStatusLabel(item.status)}
                                            </div>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedItem(item) }}
                                                className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 rounded-lg transition-colors uppercase tracking-widest"
                                            >
                                                Проверить
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedItem(null)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800 flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/20">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            getStatusColor(selectedItem.status)
                                        )}>
                                            {getStatusLabel(selectedItem.status)}
                                        </div>
                                        {selectedItem.priceLevel && (
                                            <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                                {selectedItem.priceLevel}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedItem.title || selectedItem.name}</h2>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-2 flex-wrap">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {selectedItem.city}, {selectedItem.country}</span>
                                        <span className="flex items-center gap-1 uppercase tracking-widest text-[11px] font-bold">{selectedItem.category}</span>
                                        {selectedItem.rating > 0 && (
                                            <span className="flex items-center gap-1 text-amber-500 font-bold"><Star size={12} className="fill-current" /> {selectedItem.rating}</span>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => setSelectedItem(null)} className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shadow-sm">
                                    <XCircle size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto space-y-5 flex-1">
                                {selectedItem.description && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{selectedItem.description}</p>
                                )}

                                <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    {selectedItem.insider_tip && (
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Insider Tip</h4>
                                            <p className="text-slate-800 dark:text-slate-300 flex items-start gap-2 text-sm">
                                                <MessageSquare size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                                                <span className="italic">"{selectedItem.insider_tip}"</span>
                                            </p>
                                        </div>
                                    )}
                                    {(selectedItem.what_to_try?.length > 0 || selectedItem.must_try) && (
                                        <div className={selectedItem.insider_tip ? "pt-4 border-t border-slate-200 dark:border-slate-700/50" : ""}>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Must Try</h4>
                                            <p className="text-slate-800 dark:text-slate-300 font-medium text-sm">
                                                {Array.isArray(selectedItem.what_to_try)
                                                    ? selectedItem.what_to_try.join(', ')
                                                    : selectedItem.must_try || '—'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {selectedItem.tags?.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Теги</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedItem.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedItem.adminComment && (
                                    <div className="bg-rose-50 dark:bg-rose-500/10 p-4 rounded-xl border border-rose-100 dark:border-rose-500/20">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">Предыдущий запрос на правку:</h4>
                                        <p className="text-sm text-rose-700 dark:text-rose-400">{selectedItem.adminComment}</p>
                                    </div>
                                )}

                                {/* Revision request area */}
                                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Запросить правку</label>
                                    <textarea
                                        value={revisionNote}
                                        onChange={(e) => setRevisionNote(e.target.value)}
                                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl resize-none h-20 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        placeholder="Укажите, что нужно исправить..."
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleRequestRevision(selectedItem.id)}
                                            disabled={!revisionNote.trim()}
                                            className="px-4 py-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            Отправить на доработку
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex justify-between items-center gap-3">
                                <button
                                    onClick={() => handleReject(selectedItem.id)}
                                    className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                >
                                    Отклонить
                                </button>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors uppercase tracking-widest"
                                    >
                                        Закрыть
                                    </button>
                                    <button
                                        onClick={() => handleApprove(selectedItem.id)}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/30 transition-all active:scale-95 uppercase tracking-widest"
                                    >
                                        <CheckCircle2 size={16} />
                                        Одобрить
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 right-6 z-[200] px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl text-[11px] font-bold uppercase tracking-widest"
                    >
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
