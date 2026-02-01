import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Settings, Globe, Shield, Activity,
    Save, AlertTriangle, Power, Hammer,
    CheckCircle2, Search, Info, Image as ImageIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppConfigStore } from '@/store/useAppConfigStore'

const SettingSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Icon size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{title}</h2>
        </div>
        {children}
    </div>
)

const StatusOption = ({ status, currentStatus, title, description, icon: Icon, color, onClick }) => {
    const isActive = currentStatus === status
    return (
        <button
            onClick={() => onClick(status)}
            className={cn(
                "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left",
                isActive
                    ? cn("bg-white dark:bg-slate-800 shadow-xl scale-[1.02]", color.replace('text-', 'border-'))
                    : "bg-slate-50 dark:bg-slate-800/30 border-transparent hover:bg-white dark:hover:bg-slate-800"
            )}
        >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", isActive ? color : "bg-slate-200 dark:bg-slate-700 text-slate-400")}>
                <Icon size={24} />
            </div>
            <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-black leading-none mb-1", isActive ? "text-slate-900 dark:text-white" : "text-slate-500")}>{title}</p>
                <p className="text-[10px] text-slate-400 font-medium truncate">{description}</p>
            </div>
            {isActive && <CheckCircle2 size={20} className={cn("shrink-0", color)} />}
        </button>
    )
}

const AdminSettingsPage = () => {
    const config = useAppConfigStore()
    const [formData, setFormData] = useState({
        appName: config.appName,
        appDescription: config.appDescription,
        seoKeywords: config.seoKeywords,
        maintenanceMessage: config.maintenanceMessage
    })

    const handleSave = () => {
        config.updateSettings(formData)
        // Add toast notification logic if available
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Настройки системы</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Конфигурация GastroOS • v2.1.0</p>
                </div>
                <button
                    onClick={handleSave}
                    className="h-12 px-8 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                >
                    <Save size={18} /> Сохранить изменения
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="space-y-8">
                    <SettingSection title="Общие настройки" icon={Settings}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Название приложения</label>
                                <input
                                    type="text"
                                    value={formData.appName}
                                    onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                                    className="w-full h-14 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                                    placeholder="GastroMap"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Логотип (Dark)</label>
                                    <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-all group">
                                        <ImageIcon size={24} className="text-slate-300 group-hover:text-indigo-500" />
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Загрузить</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Логотип (Light)</label>
                                    <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-all group">
                                        <ImageIcon size={24} className="text-slate-300 group-hover:text-indigo-500" />
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Загрузить</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SettingSection>

                    <SettingSection title="SEO & Описание" icon={Globe}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Мета-описание (SEO)</label>
                                <textarea
                                    value={formData.appDescription}
                                    onChange={(e) => setFormData({ ...formData, appDescription: e.target.value })}
                                    rows={4}
                                    className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ключевые слова (через запятую)</label>
                                <input
                                    type="text"
                                    value={formData.seoKeywords}
                                    onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                                    className="w-full h-14 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                                />
                            </div>
                        </div>
                    </SettingSection>
                </div>

                {/* Status & Maintenance */}
                <div className="space-y-8">
                    <SettingSection title="Статус приложения" icon={Activity}>
                        <div className="flex flex-col gap-3">
                            <StatusOption
                                status="active"
                                currentStatus={config.appStatus}
                                title="Включено и работает"
                                description="Приложение полностью доступно для всех пользователей."
                                icon={Power}
                                color="bg-emerald-500 text-emerald-500"
                                onClick={config.setAppStatus}
                            />
                            <StatusOption
                                status="maintenance"
                                currentStatus={config.appStatus}
                                title="Техническое обслуживание"
                                description="Доступ ограничен, пользователи видят уведомление."
                                icon={Hammer}
                                color="bg-amber-500 text-amber-500"
                                onClick={config.setAppStatus}
                            />
                            <StatusOption
                                status="down"
                                currentStatus={config.appStatus}
                                title="Выключено"
                                description="Приложение полностью недоступно."
                                icon={AlertTriangle}
                                color="bg-rose-500 text-rose-500"
                                onClick={config.setAppStatus}
                            />
                        </div>

                        <AnimatePresence>
                            {config.appStatus !== 'active' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800/50 space-y-4"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Сообщение для пользователей</label>
                                        <textarea
                                            value={formData.maintenanceMessage}
                                            onChange={(e) => setFormData({ ...formData, maintenanceMessage: e.target.value })}
                                            rows={3}
                                            className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-6 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner resize-none"
                                        />
                                    </div>
                                    <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl p-6 flex gap-4">
                                        <Info className="text-indigo-500 shrink-0" size={20} />
                                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                            Администраторы и сотрудники будут продолжать видеть приложение в обычном режиме.
                                            Это уведомление увидят только внешние пользователи.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </SettingSection>

                    <SettingSection title="Безопасность" icon={Shield}>
                        <div className="bg-rose-50 dark:bg-rose-500/10 rounded-3xl p-8 border border-rose-100 dark:border-rose-500/20">
                            <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest mb-4">Опасная зона</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                Полная очистка кэша приложения, сброс SEO-данных или удаление глобальных настроек приведет к необратимым последствиям.
                            </p>
                            <button className="w-full h-12 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl border border-rose-500/20 font-black text-[10px] uppercase tracking-widest transition-all">
                                Очистить системный кэш
                            </button>
                        </div>
                    </SettingSection>
                </div>
            </div>
        </div>
    )
}

export default AdminSettingsPage
