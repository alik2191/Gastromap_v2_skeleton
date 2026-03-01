import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin, Info, Tag, Coffee, CheckCircle2, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AddPlacePage() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState('')

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault()
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()])
            }
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSuccess(true)
        }, 1500)
    }

    if (isSuccess) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 mt-16 md:mt-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-900 rounded-[40px] p-10 md:p-16 text-center border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 max-w-xl mx-auto"
                >
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Заведение отправлено!</h2>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
                        Спасибо за ваш вклад в сообщество GastroMap. Наша команда модераторов проверит информацию, и вы получите пуш-уведомление, как только место появится на карте!
                    </p>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => { setIsSuccess(false); setTags([]) }}
                            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg active:scale-95"
                        >
                            Добавить еще одно
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all active:scale-95"
                        >
                            Вернуться на главную
                        </button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 mt-16 md:mt-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-200 dark:border-indigo-500/30">
                    <MapPin size={24} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                    Добавить Заведение
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                    Поделитесь своей находкой с сообществом. Получите баллы рейтинга после успешной модерации.
                </p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-10"
            >
                {/* 1. Basic Info */}
                <section>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm">1</span>
                        Основная информация
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Название места *</label>
                            <input
                                required
                                type="text"
                                placeholder="Например: The Artisan Bakery"
                                className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Тип заведения *</label>
                            <div className="relative">
                                <Coffee className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <select required className="w-full h-14 pl-12 pr-5 appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-slate-700 dark:text-slate-200">
                                    <option value="">Выберите тип...</option>
                                    <option value="Restaurant">Ресторан</option>
                                    <option value="Cafe">Кофейня</option>
                                    <option value="Bar">Бар</option>
                                    <option value="StreetFood">Стритфуд</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Город *</label>
                            <input
                                required
                                type="text"
                                placeholder="Например: Москва"
                                className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Точный адрес *</label>
                            <input
                                required
                                type="text"
                                placeholder="Например: ул. Ленина, 10"
                                className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </section>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* 2. Insider Details */}
                <section>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm">2</span>
                        Секреты для своих
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center justify-between">
                                Insider Tip (Советуй как бро)
                                <span className="text-xs font-normal text-slate-400">Необязательно</span>
                            </label>
                            <div className="relative">
                                <Info className="absolute left-5 top-5 text-slate-400" size={18} />
                                <textarea
                                    placeholder="Например: приходите до 9 утра за свежими круассанами, и просите столик у окна."
                                    className="w-full py-4 pl-12 pr-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400 min-h-[120px] resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center justify-between">
                                Must Try (Что обязательно заказать)
                                <span className="text-xs font-normal text-slate-400">Необязательно</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Например: Миндальный круассан и флэт уайт"
                                className="w-full h-14 px-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </section>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* 3. Vibe & Tags */}
                <section>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm">3</span>
                        Атмосфера
                    </h3>
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Теги (нажмите Enter)</label>
                        <div className="relative">
                            <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Например: Cozy, Датский стиль, Для работы..."
                                className="w-full h-14 pl-12 pr-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>

                        {/* Tags display */}
                        <AnimatePresence>
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {tags.map(tag => (
                                        <motion.span
                                            key={tag}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 rounded-xl text-sm font-semibold"
                                        >
                                            {tag}
                                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-900 dark:hover:text-indigo-200">
                                                <X size={14} />
                                            </button>
                                        </motion.span>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-lg shadow-xl shadow-slate-900/10 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>Отправить на модерацию <ChevronRight size={20} /></>
                        )}
                    </button>
                    <p className="text-center text-xs font-medium text-slate-400 mt-4">
                        Добавляя заведение, вы соглашаетесь с правилами сообщества GastroMap.
                    </p>
                </div>
            </motion.form>
        </div>
    )
}
