import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    CreditCard, Check, ArrowUpRight, TrendingUp,
    Users, Calendar, Download, Filter, Search,
    Crown, Zap, Star, ChevronDown, X
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const AdminSubscriptionsPage = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const filterRef = useRef(null)

    useEffect(() => {
        const handler = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setShowFilterDropdown(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const plans = [
        { name: 'Basic', price: '$12', period: 'monthly', users: '345', color: 'bg-slate-400', icon: Zap },
        { name: 'Premium', price: '$99', period: 'yearly', users: '854', color: 'bg-indigo-600', icon: Crown, popular: true },
        { name: 'Lifetime', price: '$499', period: 'once', users: '92', color: 'bg-purple-600', icon: Star },
    ]

    const allTransactions = [
        { user: 'Alex Johnson', plan: 'Premium Yearly', date: 'Today, 14:20', amount: '$99.00', status: 'Success' },
        { user: 'Maria Peters', plan: 'Basic Monthly', date: 'Today, 11:05', amount: '$12.00', status: 'Success' },
        { user: 'Dmitri S.', plan: 'Lifetime', date: 'Yesterday, 19:45', amount: '$499.00', status: 'Pending' },
        { user: 'Anna Kowalska', plan: 'Premium Yearly', date: 'Mar 24, 09:30', amount: '$99.00', status: 'Success' },
        { user: 'Jan Nowak', plan: 'Basic Monthly', date: 'Mar 23, 17:12', amount: '$12.00', status: 'Refunded' },
        { user: 'Sofia Müller', plan: 'Lifetime', date: 'Mar 22, 15:00', amount: '$499.00', status: 'Success' },
        { user: 'Pavel Horák', plan: 'Basic Monthly', date: 'Mar 21, 08:45', amount: '$12.00', status: 'Success' },
        { user: 'Laura Bianchi', plan: 'Premium Yearly', date: 'Mar 20, 21:30', amount: '$99.00', status: 'Pending' },
    ]

    const STATUS_OPTIONS = ['All', 'Success', 'Pending', 'Refunded']

    const transactions = allTransactions.filter(tx => {
        const matchesSearch = !searchQuery.trim() ||
            tx.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.plan.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'All' || tx.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleExportCSV = () => {
        const csv = ['User,Plan,Date,Amount,Status', ...transactions.map(t =>
            `"${t.user}","${t.plan}","${t.date}","${t.amount}","${t.status}"`
        )].join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'subscriptions-report.csv'
        a.click()
        URL.revokeObjectURL(url)
    }

    const statusColors = {
        Success: 'bg-green-50 dark:bg-green-500/10 text-green-600',
        Pending: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600',
        Refunded: 'bg-red-50 dark:bg-red-500/10 text-red-500',
    }
    const statusDotColors = {
        Success: 'bg-green-500',
        Pending: 'bg-orange-500',
        Refunded: 'bg-red-500',
    }

    return (
        <div className="space-y-6 lg:space-y-10 pb-12 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div>
                    <h1 className="text-xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">Billing</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1.5 text-xs lg:text-base">Monitor revenue and manage subscription plans.</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center justify-center gap-2.5 px-8 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white rounded-[20px] font-bold text-[10px] uppercase tracking-widest shadow-sm active:scale-[0.97] transition-all"
                >
                    <Download size={16} />Export CSV
                </button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
                {plans.map((plan, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                            "bg-white dark:bg-slate-900/50 p-6 lg:p-10 rounded-[32px] lg:rounded-[44px] border relative overflow-hidden group hover:shadow-2xl transition-all h-full flex flex-col",
                            plan.popular ? 'border-indigo-500/20 ring-1 ring-indigo-500/10' : 'border-slate-100 dark:border-slate-800/50'
                        )}
                    >
                        {plan.popular && (
                            <div className="absolute top-6 right-6 px-3 py-1 bg-indigo-600 text-[8px] font-bold text-white uppercase tracking-widest rounded-lg shadow-lg">Popular</div>
                        )}
                        <div className={cn("w-12 h-12 lg:w-16 lg:h-16 rounded-[20px] lg:rounded-[24px] flex items-center justify-center text-white mb-8 shadow-xl", plan.color)}>
                            <plan.icon size={22} className="lg:w-8 lg:h-8" />
                        </div>
                        <h3 className="text-xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2 leading-none">{plan.name}</h3>
                        <div className="flex items-baseline gap-1.5 mb-10">
                            <span className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-none tracking-tighter">{plan.price}</span>
                            <span className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">/ {plan.period}</span>
                        </div>

                        <div className="mt-auto pt-8 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Users</span>
                            <span className="text-sm lg:text-lg font-bold text-slate-900 dark:text-white">{plan.users}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Transactions Table */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[32px] lg:rounded-[48px] border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden flex flex-col flex-1">
                <div className="p-4 lg:p-10 border-b border-slate-50 dark:border-slate-800/50 flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white pl-2 leading-none">Transactions</h2>
                        {statusFilter !== 'All' && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                                {statusFilter}
                                <button onClick={() => setStatusFilter('All')} className="hover:opacity-70 transition-opacity"><X size={10} /></button>
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-72 leading-none group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                aria-label="Search transactions"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950/30 border-none rounded-2xl text-[12px] font-medium outline-none focus:ring-2 ring-indigo-500/10 shadow-inner"
                            />
                        </div>
                        <div ref={filterRef} className="relative">
                            <button
                                aria-label="Filter transactions"
                                onClick={() => setShowFilterDropdown(v => !v)}
                                className={cn(
                                    "p-2.5 dark:bg-slate-800 rounded-2xl transition-all font-black leading-none flex items-center gap-1",
                                    showFilterDropdown || statusFilter !== 'All'
                                        ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                                        : 'text-slate-400 hover:text-indigo-500'
                                )}
                            >
                                <Filter size={18} />
                            </button>
                            {showFilterDropdown && (
                                <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-20 overflow-hidden">
                                    {STATUS_OPTIONS.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => { setStatusFilter(opt); setShowFilterDropdown(false) }}
                                            className={cn(
                                                "w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors",
                                                statusFilter === opt
                                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600'
                                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            )}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar font-black leading-none">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-10 lg:pl-12">Payer</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">Plan</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {transactions.length > 0 ? transactions.map((tx, i) => (
                                <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all border-none leading-none">
                                    <td className="px-6 py-5 pl-10 lg:pl-12 font-bold text-[13px] text-slate-900 dark:text-white truncate leading-tight">{tx.user}</td>
                                    <td className="px-6 py-5">
                                        <Badge variant="outline" className="bg-transparent border border-slate-100 dark:border-slate-800/50 text-slate-400 font-bold text-[9px] px-2 py-0.5 rounded-lg uppercase tracking-wider">{tx.plan}</Badge>
                                    </td>
                                    <td className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate leading-none">{tx.date}</td>
                                    <td className="px-6 py-5 text-sm lg:text-lg font-bold text-slate-900 dark:text-white tracking-tighter leading-none">{tx.amount}</td>
                                    <td className="px-6 py-5">
                                        <div className={cn(
                                            "inline-flex items-center p-1.5 px-3 rounded-lg text-[9px] font-bold uppercase tracking-wider",
                                            statusColors[tx.status] || 'bg-slate-50 text-slate-500'
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full mr-2", statusDotColors[tx.status] || 'bg-slate-400')} />
                                            {tx.status}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50">
                                        No transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminSubscriptionsPage
