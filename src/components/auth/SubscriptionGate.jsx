import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Check, ShieldCheck, Zap, Sparkles } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

const SubscriptionGate = ({ children }) => {
    // This is a MOCK subscription state. 
    // In a real app, you would fetch this from your auth/user store.
    const [hasSubscription, setHasSubscription] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const handleSelectPlan = () => {
        setIsTransitioning(true)
        // Artificial delay to smooth out the transition and let the browser prepare
        setTimeout(() => {
            setHasSubscription(true)
            setIsTransitioning(false)
        }, 800)
    }

    if (hasSubscription) return children

    if (isTransitioning) {
        return (
            <div className="fixed inset-0 z-[110] bg-white dark:bg-[#0F1115] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"
                />
            </div>
        )
    }

    const plans = [
        { name: 'Basic', price: '$9.99', features: ['Explore 10,000+ locations', 'Save your favorites', 'Basic AI Search'], color: 'from-blue-500/10 to-blue-600/10' },
        { name: 'Premium', price: '$89.99', features: ['All Basic features', 'GastroGuide Pro Assistant', 'Offline Maps', 'Insider Tips'], color: 'from-purple-500/15 to-blue-600/15', popular: true },
    ]

    return (
        <div className="fixed inset-0 z-[100] bg-[#F8FAFC] dark:bg-[#0F1115] overflow-y-auto">
            <div className="min-h-screen flex flex-col items-center justify-center p-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-2xl mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black uppercase tracking-widest mb-6">
                        <Sparkles size={14} />
                        Exclusive Access
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                        Explore flavors without <span className="text-blue-600">borders.</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg px-4">
                        Join our community of food enthusiasts. Choose a plan to unlock full access to curated gastro-maps, AI insights, and hidden gems.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-1 rounded-[40px] bg-gradient-to-br ${plan.popular ? 'from-blue-600 to-purple-600' : 'from-slate-200 to-slate-300 dark:from-white/10 dark:to-white/5 shadow-xl shadow-blue-500/5'}`}
                        >
                            <div className="bg-white dark:bg-[#1a1c22] rounded-[38px] p-10 h-full flex flex-col">
                                {plan.popular && (
                                    <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full w-fit mb-6 uppercase tracking-wider">Most Popular</span>
                                )}
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                                    <span className="text-slate-400 font-bold">/ year</span>
                                </div>

                                <div className="space-y-4 mb-10 flex-1">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                                                <Check size={12} strokeWidth={4} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleSelectPlan}
                                    className={`w-full py-5 rounded-[24px] font-black text-sm transition-all active:scale-[0.98] ${plan.popular ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white'}`}
                                >
                                    Get Started
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center">
                    <div className="flex items-center gap-6 mb-8 text-slate-300 dark:text-white/10">
                        <Zap size={32} fill="currentColor" />
                        <ShieldCheck size={32} fill="currentColor" />
                        <CreditCard size={32} fill="currentColor" />
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Secure payment processing • Cancel anytime • 24/7 Support
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SubscriptionGate
