import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Instagram, Twitter, Linkedin } from 'lucide-react'

const PublicFooter = () => (
    <div className="bg-slate-50 dark:bg-slate-950 transition-colors duration-500 mt-auto">
        <footer className="relative bg-black text-white py-12 md:py-20 rounded-t-[30px] md:rounded-t-[40px] overflow-hidden">
            {/* Aurora Background Effect */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        backgroundColor: ["#1e3a8a", "#581c87", "#1e3a8a"] // Blue-900 to Purple-900
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-50%] left-[-20%] w-[80%] h-[150%] rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.4, 0.2],
                        backgroundColor: ["#581c87", "#0f172a", "#581c87"] // Purple-900 to Slate-900
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[150%] rounded-full blur-[120px]"
                />
            </div>

            <div className="w-full relative z-10 px-4 md:px-8">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                    <div>
                        <div className="bg-white/10 w-fit px-4 py-2 rounded-full flex items-center gap-2 mb-6 backdrop-blur-md border border-white/5">
                            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">G</div>
                            <span className="font-semibold text-sm">GastroMap</span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                            The world's most intelligent culinary guide. <br className="hidden sm:block" />
                            Made with love for foodies.
                        </p>
                        <div className="flex gap-4 mt-8">
                            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer backdrop-blur-md border border-white/5">
                                    <Icon size={18} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 md:gap-12 w-full lg:w-auto">
                        {/* 
                      Note: Using real Links here so they basically work in SPA navigation. 
                      Need to ensure these routes exist in App.jsx.
                     */}
                        {[
                            {
                                head: "Product", links: [
                                    { name: 'Features', path: '/features' },
                                    { name: 'Pricing', path: '/pricing' },
                                    { name: 'API', path: '/api' },
                                    { name: 'Showcase', path: '/showcase' }
                                ]
                            },
                            {
                                head: "Company", links: [
                                    { name: 'About', path: '/about' },
                                    { name: 'Careers', path: '/careers' },
                                    { name: 'Blog', path: '/blog' },
                                    { name: 'Contact', path: '/contact' }
                                ]
                            },
                            {
                                head: "Legal", links: [
                                    { name: 'Privacy', path: '/privacy' },
                                    { name: 'Terms', path: '/terms' },
                                    { name: 'Security', path: '/security' },
                                    { name: 'Cookies', path: '/cookies' }
                                ]
                            },
                            {
                                head: "Support", links: [
                                    { name: 'Help Center', path: '/help' },
                                    { name: 'Status', path: '/status' },
                                    { name: 'Community', path: '/community' },
                                    { name: 'Discord', path: '#' }
                                ]
                            },
                        ].map((col, i) => (
                            <div key={i} className="min-w-[120px]">
                                <h4 className="font-bold mb-4 md:mb-6 text-sm md:text-base">{col.head}</h4>
                                <ul className="space-y-4 text-sm text-gray-400">
                                    {col.links.map(l => (
                                        <li key={l.name}>
                                            <Link to={l.path} className="hover:text-white cursor-pointer transition-colors">
                                                {l.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border-t border-white/10 mt-12 md:mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-[10px] md:text-xs text-gray-500">
                    <p>© 2025 GastroMap Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    </div>
)

export default PublicFooter
