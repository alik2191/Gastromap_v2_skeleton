import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Map, List, Globe, ArrowUpRight, Search, Check, ChevronDown, Coffee, Wine, Utensils, Award, Zap, Shield, Heart, User, Instagram, Twitter, Linkedin, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

// --- Animations ---
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

// --- Component: Hero (Bento) ---
const BentoHero = () => {
    // Stats Review Logic
    const [reviewIndex, setReviewIndex] = React.useState(0)
    // Smart List Toggle Logic
    const [listMode, setListMode] = React.useState('wishlist') // 'wishlist' | 'visited'

    const reviews = [
        { name: "Anna K.", loc: "Warsaw, Poland", text: "Found an amazing café in Warsaw! Incredible atmosphere ☕", img: "https://i.pravatar.cc/100?img=5" },
        { name: "James L.", loc: "London, UK", text: "Best hidden bar I've ever visited. Thanks for the tip! 🥃", img: "https://i.pravatar.cc/100?img=3" },
        { name: "Sarah M.", loc: "NYC, USA", text: "The vegan options here were outstanding. 🥗", img: "https://i.pravatar.cc/100?img=9" },
        { name: "David R.", loc: "Tokyo, Japan", text: "Sushi Arai was a life-changing experience. 🍣", img: "https://i.pravatar.cc/100?img=11" }
    ]

    React.useEffect(() => {
        // Stats rotation
        const statTimer = setInterval(() => {
            setReviewIndex((prev) => (prev + 1) % reviews.length)
        }, 4000)

        // Smart List rotation
        const listTimer = setInterval(() => {
            setListMode(prev => prev === 'wishlist' ? 'visited' : 'wishlist')
        }, 3000)

        return () => {
            clearInterval(statTimer)
            clearInterval(listTimer)
        }
    }, [])

    return (
        <section className="pt-32 pb-20 px-4 md:px-6 bg-blue-50/30 dark:bg-base-200 hero-section">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="lg:col-span-7 bg-base-100 rounded-[40px] p-10 md:p-16 flex flex-col justify-center shadow-sm relative overflow-hidden"
                    >
                        <div className="bg-blue-50 dark:bg-blue-900/20 w-fit px-3 py-1 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 mb-8 border border-blue-100 dark:border-blue-900/30">
                            ● Beta Version Live
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1] mb-8 text-base-content">
                            Explore flavors <br /> <span className="text-blue-600">without borders.</span>
                        </h1>
                        <p className="text-lg text-base-content/70 mb-10 max-w-md leading-relaxed">
                            AI-powered guide with route planning and personalized recommendations.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/explore">
                                <Button size="lg" className="rounded-full h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 dark:shadow-none transition-transform hover:scale-105">
                                    Get Started
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="btn btn-outline rounded-full h-14 px-8 text-base transition-transform hover:scale-105">
                                How it Works
                            </Button>
                        </div>
                    </motion.div>

                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="flex-1 bg-black rounded-[40px] relative overflow-hidden group min-h-[300px]"
                        >
                            <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2940&auto=format&fit=crop" alt="Bar" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
                            <div className="absolute bottom-6 left-6 right-6 z-10">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl text-white">
                                    <h3 className="font-bold text-lg mb-1">Hidden Bars</h3>
                                    <p className="text-sm text-white/70">For insiders only</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="bg-blue-100/50 rounded-[40px] p-8 relative overflow-hidden min-h-[260px] flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-5xl font-bold text-blue-900 mb-1 tracking-tight">200+</h3>
                                    <p className="text-blue-600 font-medium">Verified Locations</p>
                                </div>
                                <ArrowUpRight className="w-6 h-6 text-blue-600" />
                            </div>

                            <motion.div
                                key={reviewIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100 mt-4 relative"
                            >
                                <p className="text-sm text-gray-700 font-medium leading-relaxed h-[3.5rem] flex items-center">
                                    "{reviews[reviewIndex].text}"
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="text-xs font-bold text-blue-600">{reviews[reviewIndex].name}</div>
                                    <div className="text-xs text-blue-300">•</div>
                                    <div className="text-xs text-gray-400">{reviews[reviewIndex].loc}</div>
                                </div>
                            </motion.div>

                            <div className="flex -space-x-2 mt-4 items-center">
                                {reviews.map((r, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            scale: i === reviewIndex ? 1.2 : 1,
                                            zIndex: i === reviewIndex ? 10 : 0,
                                            borderColor: i === reviewIndex ? "rgb(37 99 235)" : "white"
                                        }}
                                        className="w-10 h-10 rounded-full border-2 bg-gray-200 overflow-hidden relative"
                                    >
                                        <img src={r.img} alt="User" className="w-full h-full object-cover" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {/* 1. AI Guide Card */}
                    <motion.div variants={fadeInUp} className="bg-base-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all feature-card-sm group overflow-hidden relative border border-base-200 h-full flex flex-col">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-base-content leading-tight">AI Guide</h3>
                                <p className="text-sm text-base-content/60">Routes & Memory</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100/50 mt-auto">
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-[11px] leading-relaxed text-gray-600 font-medium"
                            >
                                "Perfect! I'll plan a route for you: Start at <span className="font-bold text-pink-600">Cafe Mozart</span> (specialty coffee)..."
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="inline-block w-1.5 h-3 bg-pink-500 ml-1 align-middle"
                                />
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* 2. Smart Lists Card - Toggling content */}
                    <motion.div variants={fadeInUp} className="bg-base-100 rounded-[32px] p-6 border border-base-200 shadow-sm hover:shadow-xl transition-all feature-card-sm group overflow-hidden relative h-full flex flex-col">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                                <List size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">Smart Lists</h3>
                                <p className="text-sm text-gray-500">Wish-list & Visited</p>
                            </div>
                        </div>

                        <div className="h-24 relative mt-auto">
                            <AnimatePresence mode="wait">
                                {listMode === 'wishlist' ? (
                                    <motion.div
                                        key="wishlist"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-2 absolute inset-0"
                                    >
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Heart size={12} className="text-pink-400 fill-pink-400" />
                                            <span className="font-semibold text-gray-600 uppercase tracking-wider text-[10px]">Wish-list</span>
                                        </div>
                                        <div className="bg-gray-50 p-2.5 rounded-xl flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-pink-400" />
                                            <span className="text-xs font-medium text-gray-700">Hidden Jazz Club</span>
                                        </div>
                                        <div className="bg-gray-50 p-2.5 rounded-xl flex items-center gap-3 opacity-60">
                                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                                            <span className="text-xs font-medium text-gray-700">Ramen Shop</span>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="visited"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-2 absolute inset-0"
                                    >
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <CheckCircle2 size={12} className="text-green-500" />
                                            <span className="font-semibold text-gray-600 uppercase tracking-wider text-[10px]">Visited</span>
                                        </div>
                                        <div className="bg-green-50 p-2.5 rounded-xl flex items-center gap-3 border border-green-100">
                                            <motion.div
                                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                className="text-green-600"
                                            >
                                                <CheckCircle2 size={12} fill="currentColor" className="text-white" />
                                            </motion.div>
                                            <span className="text-xs font-medium text-green-800">Cafe Mozart</span>
                                        </div>
                                        <div className="bg-green-50 p-2.5 rounded-xl flex items-center gap-3 border border-green-100 opacity-80">
                                            <motion.div
                                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}
                                                className="text-green-600"
                                            >
                                                <CheckCircle2 size={12} fill="currentColor" className="text-white" />
                                            </motion.div>
                                            <span className="text-xs font-medium text-green-800">La Bottega</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* 3. Interactive Maps Card - 2D City Scheme */}
                    <motion.div variants={fadeInUp} className="bg-base-100 rounded-[32px] p-6 border border-base-200 shadow-sm hover:shadow-xl transition-all feature-card-sm hover:-translate-y-1 duration-300 h-full flex flex-col">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                                <Map size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">Interactive Maps</h3>
                                <p className="text-sm text-gray-500">Navigation</p>
                            </div>
                        </div>

                        {/* 2D Map Visualization */}
                        <div className="bg-blue-50/30 rounded-2xl mt-auto relative overflow-hidden h-28 border border-blue-100">
                            {/* Map Streets Style */}
                            <div className="absolute inset-0">
                                <svg width="100%" height="100%" className="opacity-20">
                                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-400" />
                                    </pattern>
                                    <rect width="100%" height="100%" fill="url(#grid)" />
                                    {/* Random Block Shapes */}
                                    <rect x="20" y="20" width="30" height="30" fill="currentColor" className="text-blue-200" />
                                    <rect x="80" y="50" width="40" height="20" fill="currentColor" className="text-blue-200" />
                                    <rect x="140" y="10" width="20" height="40" fill="currentColor" className="text-blue-200" />
                                </svg>
                            </div>

                            {/* Blinking Pins */}
                            {[
                                { t: '20%', l: '30%', d: 0, c: "bg-blue-500" },
                                { t: '60%', l: '60%', d: 1, c: "bg-purple-500" },
                                { t: '40%', l: '85%', d: 2, c: "bg-pink-500" },
                                { t: '75%', l: '20%', d: 0.5, c: "bg-blue-600" }
                            ].map((p, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, delay: p.d, repeatDelay: 1 }}
                                    className={`absolute w-3 h-3 ${p.c} rounded-full border-2 border-white shadow-md z-10`}
                                    style={{ top: p.t, left: p.l }}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* 4. Global Search Card */}
                    <motion.div variants={fadeInUp} className="bg-base-100 rounded-[32px] p-6 border border-base-200 shadow-sm hover:shadow-xl transition-all feature-card-sm hover:-translate-y-1 duration-300 h-full flex flex-col">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">Global Search</h3>
                                <p className="text-sm text-gray-500">Find anywhere</p>
                            </div>
                        </div>

                        {/* City Scroll Animation */}
                        <div className="relative h-24 overflow-hidden mt-auto mask-gradient rounded-xl bg-gray-50 border border-gray-100">
                            <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-gray-50 to-transparent z-10" />
                            <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-gray-50 to-transparent z-10" />

                            <motion.div
                                animate={{ y: [0, -120] }}
                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                className="py-2 px-4 space-y-3"
                            >
                                {[
                                    "New York, USA", "Paris, France", "Tokyo, Japan", "London, UK",
                                    "Berlin, Germany", "Rome, Italy", "Dubai, UAE", "Singapore",
                                    "New York, USA", "Paris, France", "Tokyo, Japan" // duplicates for loop
                                ].map((city, i) => (
                                    <div key={i} className="flex items-center gap-3 opacity-60">
                                        <Search size={12} className="text-gray-400" />
                                        <span className="text-sm font-medium text-gray-600">{city}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

// --- Component: Features Grid ---
const FeaturesGrid = () => {
    const features = [
        { icon: Award, title: "AI Rank", desc: "Grades locations based on your preferences." },
        { icon: Zap, title: "Instant Book", desc: "Reserve a table in seconds." },
        { icon: Shield, title: "Best Practices", desc: "Only verified, high-quality spots." },
        { icon: Utensils, title: "Local Gems", desc: "Discover places locals love." },
        { icon: Coffee, title: "Perfect Vibe", desc: "Filter by noise level, lighting, spacing." },
        { icon: Heart, title: "Health First", desc: "Detailed allergen and diet info." },
        { icon: User, title: "Made for You", desc: "The more you use it, the smarter it gets." },
        { icon: Map, title: "Multi-level", desc: "Floor plans and seat selection." },
        { icon: Globe, title: "Global Access", desc: "Works intl. with auto-translation." },
    ]

    return (
        <section className="py-24 bg-base-200">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">More than just a <span className="text-blue-600">guide.</span></h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">We curated the best features to ensure your culinary journey is seamless.</p>
                </motion.div>
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((f, i) => (
                        <motion.div variants={fadeInUp} key={i} className="bg-base-100 p-8 rounded-[32px] shadow-sm hover:shadow-md transition-all border border-base-200">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <f.icon size={20} />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-base-content">{f.title}</h3>
                            <p className="text-sm text-base-content/70 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

// --- Component: Collection ---
const CollectionPreview = () => (
    <section className="py-24 bg-base-100 collection-section">
        <div className="container mx-auto px-6 max-w-7xl">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Peek into the <span className="text-blue-600">collection.</span></h2>
                <p className="text-gray-500">Just a small sample of the 12,000+ curated locations waiting for you.</p>
            </motion.div>
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {[
                    { title: "La Delicaze del Caffe", sub: "Venice, Italy", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2947&auto=format&fit=crop" },
                    { title: "The Blind Tiger", sub: "New York, USA", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2940&auto=format&fit=crop" },
                    { title: "Mercardo San Miguel", sub: "Madrid, Spain", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2874&auto=format&fit=crop" },
                    { title: "Sushi Arai", sub: "Tokyo, Japan", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2940&auto=format&fit=crop" }
                ].map((item, i) => (
                    <motion.div key={i} variants={fadeInUp} className="group relative h-[300px] md:h-[400px] rounded-[40px] overflow-hidden bg-gray-100 cursor-pointer">
                        <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-8 left-8 text-white">
                            <span className="bg-blue-600 text-[10px] font-bold px-2 py-1 rounded-full mb-3 inline-block">MUST VISIT</span>
                            <h3 className="text-2xl font-bold">{item.title}</h3>
                            <p className="opacity-80 flex items-center gap-2 mt-1"><MapPinIcon className="w-3 h-3" /> {item.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
)

const MapPinIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>


// --- Component: Pricing ---
const Pricing = () => (
    <section className="py-24 bg-base-200 pricing-section">
        <div className="container mx-auto px-6 max-w-7xl">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Invest in <span className="text-blue-600">experiences.</span></h2>
            </motion.div>
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end"
            >
                {/* Basic */}
                <motion.div variants={fadeInUp} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 h-fit hover:shadow-xl transition-shadow duration-300">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Basic</div>
                    <div className="text-4xl font-bold mb-2">$9.99<span className="text-base font-normal text-gray-400">/mo</span></div>
                    <p className="text-xs text-gray-400 mb-8">For casual explorers</p>
                    <ul className="space-y-4 mb-8 text-sm font-medium">
                        <li className="flex gap-3"><Check className="w-4 h-4" /> 5 Searches/day</li>
                        <li className="flex gap-3"><Check className="w-4 h-4" /> Basic Maps</li>
                        <li className="flex gap-3"><Check className="w-4 h-4" /> Read Reviews</li>
                    </ul>
                    <Button className="w-full bg-black text-white rounded-full h-12 hover:bg-gray-800">Start Free</Button>
                </motion.div>

                {/* Pro (Black) */}
                <motion.div variants={fadeInUp} className="bg-black text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden transform md:-translate-y-4">
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
                    <Button className="w-full bg-white text-black rounded-full h-12 hover:bg-gray-100 font-bold">Choose Pro</Button>
                </motion.div>

                {/* Ultimate (Blue) */}
                <motion.div variants={fadeInUp} className="bg-blue-600 text-white p-8 rounded-[40px] shadow-xl h-fit hover:shadow-2xl transition-shadow duration-300">
                    <div className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-4">Ultimate</div>
                    <div className="text-4xl font-bold mb-2">$149.99<span className="text-base font-normal text-blue-200">/mo</span></div>
                    <p className="text-xs text-blue-200 mb-8">For concierge service</p>
                    <ul className="space-y-4 mb-8 text-sm font-medium">
                        <li className="flex gap-3"><Check className="w-4 h-4 text-white" /> Priority Reservations</li>
                        <li className="flex gap-3"><Check className="w-4 h-4 text-white" /> 24/7 Support</li>
                        <li className="flex gap-3"><Check className="w-4 h-4 text-white" /> Exclusive Events</li>
                    </ul>
                    <Button className="w-full bg-white text-blue-600 rounded-full h-12 hover:bg-blue-50 font-bold">Choose Ultimate</Button>
                </motion.div>
            </motion.div>
        </div>
    </section>
)

// --- Component: FAQ ---
const FAQ = () => {
    const [openIndex, setOpenIndex] = React.useState(null)

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const questions = [
        {
            category: "General Questions", icon: List, items: [
                { q: 'How does the AI Guide work?', a: 'Our AI analyzes your taste preferences and past visits to suggest perfect spots and even plans full day routes.' },
                { q: 'Can I book tables directly?', a: 'Yes! Pro and Ultimate users can book tables instantly at partner venues.' },
                { q: 'Is it available offline?', a: 'Absolutely. Download maps and lists for offline access in any city.' }
            ]
        },
        {
            category: "Account & Billing", icon: User, items: [
                { q: 'Do you offer a free trial?', a: 'Yes, try the Pro plan free for 14 days. No commitment.' },
                { q: 'Can I share my subscription?', a: 'Ultimate plans allow up to 3 family members to share one account.' },
                { q: 'Are there student discounts?', a: 'Valid students get 50% off the Pro plan with verified ID.' }
            ]
        }
    ]

    return (
        <section className="py-24 bg-base-200">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-2 text-base-content">Questions? <span className="text-blue-600">We've got answers.</span></h2>
                </div>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    {questions.map((section, secIdx) => (
                        <div key={secIdx} className="space-y-4">
                            <h3 className="font-bold text-sm text-base-content/50 uppercase mb-4 flex gap-2 items-center">
                                <section.icon size={14} /> {section.category}
                            </h3>
                            {section.items.map((item, i) => {
                                const index = `${secIdx}-${i}`
                                const isOpen = openIndex === index
                                return (
                                    <div
                                        key={i}
                                        onClick={() => toggleFAQ(index)}
                                        className={`bg-base-100 p-5 rounded-2xl cursor-pointer border transition-all duration-300 ${isOpen ? 'shadow-md border-blue-100 ring-1 ring-blue-50' : 'border-base-200 hover:border-base-300'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className={`font-medium text-sm transition-colors ${isOpen ? 'text-blue-600' : 'text-base-content'}`}>{item.q}</span>
                                            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                                        </div>
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="text-xs text-base-content/70 leading-relaxed">
                                                        {item.a}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}



export default function LandingPage() {
    return (
        <>
            <BentoHero />
            <FeaturesGrid />
            <CollectionPreview />
            <Pricing />
            <FAQ />
        </>
    )
}
