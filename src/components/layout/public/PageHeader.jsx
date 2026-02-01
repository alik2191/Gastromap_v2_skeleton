import React from 'react'
import { motion } from 'framer-motion'

const PageHeader = ({ title, subtitle, highlight }) => (
    <section className="pt-32 pb-12 px-6 bg-blue-50/30">
        <div className="container mx-auto max-w-7xl text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="bg-blue-50 w-fit mx-auto px-3 py-1 rounded-full text-xs font-semibold text-blue-600 mb-6 border border-blue-100 uppercase tracking-wider">
                    {highlight || "GastroMap"}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-gray-900">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </motion.div>
        </div>
    </section>
)

export default PageHeader
