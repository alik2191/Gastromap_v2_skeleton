import React from 'react'
import PageHeader from '@/components/layout/public/PageHeader'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PricingPage = () => {
    return (
        <div className="bg-white">
            <PageHeader
                title="Simple Pricing"
                subtitle="Start for free, upgrade for the ultimate experience."
                highlight="Plans"
            />

            <section className="py-20 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                        {/* Basic */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 h-fit hover:shadow-xl transition-shadow duration-300">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Basic</div>
                            <div className="text-4xl font-bold mb-2">$9.99<span className="text-base font-normal text-gray-400">/mo</span></div>
                            <p className="text-xs text-gray-400 mb-8">For casual explorers</p>
                            <ul className="space-y-4 mb-8 text-sm font-medium text-gray-600">
                                <li className="flex gap-3"><Check className="w-4 h-4 text-blue-500" /> 5 Searches/day</li>
                                <li className="flex gap-3"><Check className="w-4 h-4 text-blue-500" /> Basic Maps</li>
                                <li className="flex gap-3"><Check className="w-4 h-4 text-blue-500" /> Read Reviews</li>
                            </ul>
                            <Button className="w-full bg-black text-white rounded-full h-12 hover:bg-gray-800 shadow-md">Start Free</Button>
                        </motion.div>

                        {/* Pro (Black) */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-black text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden transform md:-translate-y-4">
                            <div className="absolute top-6 right-6 bg-blue-600 text-[10px] font-bold px-3 py-1 rounded-full">POPULAR</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Pro</div>
                            <div className="text-5xl font-bold mb-2">$49.99<span className="text-base font-normal text-gray-400">/mo</span></div>
                            <p className="text-xs text-gray-400 mb-8">For serious foodies</p>
                            <ul className="space-y-4 mb-10 text-sm font-medium">
                                <li className="flex gap-3"><Check className="w-4 h-4 text-blue-500" /> Unlimited AI</li>
                                <li className="flex gap-3"><Check className="w-4 h-4 text-blue-500" /> Smart Lists</li>
                                <li className="flex gap-3"><Check className="w-4 h-4 text-blue-500" /> Offline Mode</li>
                                <li className="flex gap-3"><Check className="w-4 h-4 text-blue-500" /> No Ads</li>
                            </ul>
                            <Button className="w-full bg-white text-black rounded-full h-12 hover:bg-gray-100 font-bold shadow-lg">Choose Pro</Button>
                        </motion.div>

                        {/* Ultimate (Blue) */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-blue-600 text-white p-8 rounded-[40px] shadow-xl h-fit hover:shadow-2xl transition-shadow duration-300">
                            <div className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-4">Ultimate</div>
                            <div className="text-4xl font-bold mb-2">$149.99<span className="text-base font-normal text-blue-200">/mo</span></div>
                            <p className="text-xs text-blue-200 mb-8">For concierge service</p>
                            <ul className="space-y-4 mb-8 text-sm font-medium">
                                <li className="flex gap-3"><Check className="w-4 h-4 text-white" /> Priority Reservations</li>
                                <li className="flex gap-3"><Check className="w-4 h-4 text-white" /> 24/7 Support</li>
                                <li className="flex gap-3"><Check className="w-4 h-4 text-white" /> Exclusive Events</li>
                            </ul>
                            <Button className="w-full bg-white text-blue-600 rounded-full h-12 hover:bg-blue-50 font-bold shadow-lg">Choose Ultimate</Button>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PricingPage
