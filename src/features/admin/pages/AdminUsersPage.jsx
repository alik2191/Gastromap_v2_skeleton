import React, { useState } from 'react'
import {
    Users, Search, Filter, MoreHorizontal, UserPlus,
    Mail, Shield, Calendar, ChevronRight, X,
    ArrowUpRight, Clock, Star, MapPin, Building2, Zap
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const AdminUsersPage = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)

    const usersList = [
        { id: 1, name: 'Алексей Иванов', email: 'alex@example.com', role: 'Premium', status: 'Active', joined: '12.01.2024', visits: 45, reviews: 12 },
        { id: 2, name: 'Мария Петрова', email: 'maria@example.com', role: 'User', status: 'Active', joined: '15.01.2024', visits: 12, reviews: 3 },
        { id: 3, name: 'Дмитрий С.', email: 'dima@example.com', role: 'Moderator', status: 'Active', joined: '05.01.2024', visits: 89, reviews: 45 },
        { id: 4, name: 'Елена С.', email: 'elena@example.com', role: 'Premium', status: 'Inactive', joined: '20.12.2023', visits: 5, reviews: 1 },
    ]

    const stats = [
        { label: 'Юзеры', val: '1,284', icon: Users, bg: 'bg-blue-50 dark:bg-blue-500/10', color: 'text-blue-600' },
        { label: 'Pro', val: '854', icon: Star, bg: 'bg-yellow-50 dark:bg-yellow-500/10', color: 'text-yellow-600' },
        { label: 'Online', val: '42', icon: Zap, bg: 'bg-green-50 dark:bg-green-500/10', color: 'text-green-600' },
    ]

    return (
        <div className="space-y-6 lg:space-y-10 pb-12 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div>
                    <h1 className="text-xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">Пользователи</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1.5 text-xs lg:text-base">База участников и права доступа.</p>
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3 bg-indigo-600 text-white rounded-[20px] font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-[0.97] transition-all">
                    <UserPlus size={16} />
                    Добавить
                </button>
            </div>

            {/* Stats - Compact Grid */}
            <div className="grid grid-cols-3 gap-3 lg:gap-8">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900/50 p-3 lg:p-7 rounded-[28px] lg:rounded-[40px] border border-slate-100 dark:border-slate-800/50 shadow-sm flex flex-col sm:flex-row items-center gap-2 lg:gap-5 group hover:border-indigo-500/10 transition-all overflow-hidden relative">
                        <div className={cn("w-10 h-10 lg:w-16 lg:h-16 rounded-[18px] lg:rounded-[24px] flex items-center justify-center relative z-10 shrink-0 shadow-inner", s.bg, s.color)}>
                            <s.icon size={18} className="lg:w-7 lg:h-7" />
                        </div>
                        <div className="text-center sm:text-left relative z-10 min-w-0">
                            <p className="text-[8px] lg:text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-0.5">{s.label}</p>
                            <p className="text-sm lg:text-3xl font-bold text-slate-900 dark:text-white leading-none tracking-tighter truncate">{s.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[32px] lg:rounded-[48px] border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden flex flex-col flex-1">
                <div className="p-4 lg:p-10 border-b border-slate-50 dark:border-slate-800/50 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-5">
                    <div className="relative flex-1 lg:max-w-md group leading-none">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <input type="text" placeholder="Поиск (имя, email)..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/30 border-none rounded-2xl text-[13px] font-medium outline-none focus:ring-2 ring-indigo-500/10 transition-all shadow-inner" />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors shadow-sm">
                        <Filter size={16} />Фильтры
                    </button>
                </div>

                <div className="overflow-x-auto custom-scrollbar font-black leading-none">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-10 lg:pl-12">Участник</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">Роль</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">Активность</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">Статус</th>
                                <th className="px-6 py-4 text-right pr-10 lg:pr-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {usersList.map((user) => (
                                <tr key={user.id} onClick={() => { setSelectedUser(user); setIsSlideOverOpen(true); }} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all group cursor-pointer border-none leading-none">
                                    <td className="px-6 py-5 pl-10 lg:pl-12">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs shadow-inner group-hover:scale-110 transition-transform">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 font-medium">
                                                    <Mail size={10} className="opacity-50" />{user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant="outline" className={cn(
                                            "bg-transparent border border-slate-100 dark:border-slate-800/50 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest",
                                            user.role === 'Premium' ? 'text-yellow-600' : user.role === 'Moderator' ? 'text-indigo-500' : 'text-slate-400'
                                        )}>
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-1 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-[60px]">
                                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(user.visits, 100)}%` }} />
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-500">{user.visits}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={cn(
                                            "inline-flex items-center p-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider",
                                            user.status === 'Active' ? 'bg-green-50 dark:bg-green-500/5 text-green-600' : 'bg-red-50 text-red-500'
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full mr-2", user.status === 'Active' ? 'bg-green-500' : 'bg-red-500')} />
                                            {user.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right pr-10 lg:pr-12">
                                        <button className="p-2 rounded-xl text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Slide Over */}
            <AnimatePresence>
                {isSlideOverOpen && selectedUser && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSlideOverOpen(false)} className="fixed inset-0 z-[100] bg-slate-900/10 backdrop-blur-md" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 250 }} className="fixed top-0 right-0 w-full sm:w-[500px] bg-white dark:bg-slate-900 h-full z-[110] flex flex-col shadow-2xl">

                            <div className="p-8 lg:p-12 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                                <div>
                                    <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-none mb-1.5">Профиль юзера</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">ID: #USER-{selectedUser.id}</p>
                                </div>
                                <button onClick={() => setIsSlideOverOpen(false)} aria-label="close-panel" className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all"><X size={20} /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 lg:p-14 space-y-12 custom-scrollbar">
                                <div className="flex flex-col items-center py-10 bg-slate-50/50 dark:bg-slate-800/30 rounded-[40px] border border-slate-100 dark:border-slate-800/50 shadow-inner group">
                                    <div className="w-28 h-28 rounded-[36px] bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold shadow-2xl shadow-indigo-500/20 mb-6 group-hover:scale-105 transition-transform">{selectedUser.name.charAt(0)}</div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{selectedUser.name}</h3>
                                    <p className="text-[13px] font-medium text-slate-400 mt-2">{selectedUser.email}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6 leading-none">
                                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Визиты</p>
                                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{selectedUser.visits}</p>
                                    </div>
                                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Отзывы</p>
                                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{selectedUser.reviews}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 leading-none font-black leading-none">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-2">Уровень доступа</label>
                                        <select className="w-full px-6 py-4.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none font-bold text-sm text-slate-900 dark:text-white appearance-none outline-none focus:ring-2 ring-indigo-500/10 shadow-inner cursor-pointer">
                                            <option value="User">Regular User</option>
                                            <option value="Premium">Premium Member</option>
                                            <option value="Moderator">System Moderator</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-2">Статус</label>
                                        <select className="w-full px-6 py-4.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none font-bold text-sm text-slate-900 dark:text-white appearance-none outline-none focus:ring-2 ring-indigo-500/10 shadow-inner cursor-pointer">
                                            <option value="Active">Operational</option>
                                            <option value="Blocked">Restricted</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 lg:p-12 border-t border-slate-100 dark:border-slate-800/50 flex gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shrink-0">
                                <button className="flex-1 py-4.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[28px] font-bold text-[11px] uppercase tracking-widest shadow-2xl active:scale-[0.97] transition-all">Обновить</button>
                                <button onClick={() => setIsSlideOverOpen(false)} className="px-10 py-4.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-[28px] font-bold text-[11px] uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-all">Закрыть</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminUsersPage
