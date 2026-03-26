import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MapPin, ChevronRight, ArrowLeft, Building2, Star,
    Image as ImageIcon, Eye, EyeOff, Clock, Sun,
    Moon, Sunset, CloudSun, Edit, Trash2,
    Gem, Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocationsStore } from '@/features/public/hooks/useLocationsStore'
import { useNavigate } from 'react-router-dom'

// Country flag mapping
const COUNTRY_FLAGS = {
    Poland: '🇵🇱',
    Germany: '🇩🇪',
    Italy: '🇮🇹',
    France: '🇫🇷',
    Spain: '🇪🇸',
    Japan: '🇯🇵',
    USA: '🇺🇸',
    Ukraine: '🇺🇦',
}

// Country cover images (Unsplash)
const COUNTRY_IMAGES = {
    Poland: 'https://images.unsplash.com/photo-1519197924294-8ba991629d66?auto=format&fit=crop&q=80&w=600',
    Germany: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=600',
    Italy: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=600',
    France: 'https://images.unsplash.com/photo-1499856871958-5b9357976b82?auto=format&fit=crop&q=80&w=600',
    Spain: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&q=80&w=600',
    Japan: 'https://images.unsplash.com/photo-1528360983277-13d9b152cace?auto=format&fit=crop&q=80&w=600',
    USA: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&q=80&w=600',
    Ukraine: 'https://images.unsplash.com/photo-1580494025702-17f8fbd0c9ae?auto=format&fit=crop&q=80&w=600',
}

// City images fallback
const CITY_IMAGES = {
    Krakow: 'https://images.unsplash.com/photo-1519197924294-8ba991629d66?auto=format&fit=crop&q=80&w=600',
    Warsaw: 'https://images.unsplash.com/photo-1607427293702-036933bbf746?auto=format&fit=crop&q=80&w=600',
    Berlin: 'https://images.unsplash.com/photo-1560969184-10fe8719e654?auto=format&fit=crop&q=80&w=600',
    Rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600',
    Paris: 'https://images.unsplash.com/photo-1499856871958-5b9357976b82?auto=format&fit=crop&q=80&w=600',
    Tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=600',
}

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600'

const LocationHierarchyExplorer = ({ className }) => {
    const navigate = useNavigate()
    const locations = useLocationsStore(s => s.locations)

    const [level, setLevel] = useState('countries') // countries | cities | locations | details
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [selectedCity, setSelectedCity] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [timeOfDay, setTimeOfDay] = useState('day')
    const [search, setSearch] = useState('')

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour >= 5 && hour < 12) setTimeOfDay('morning')
        else if (hour >= 12 && hour < 17) setTimeOfDay('day')
        else if (hour >= 17 && hour < 21) setTimeOfDay('evening')
        else setTimeOfDay('night')
    }, [])

    // Derive countries from real location data
    const countries = useMemo(() => {
        const map = new Map()
        locations.forEach(loc => {
            const c = loc.country || 'Unknown'
            if (!map.has(c)) map.set(c, [])
            map.get(c).push(loc)
        })
        return Array.from(map.entries()).map(([name, locs]) => ({
            id: name,
            name,
            code: COUNTRY_FLAGS[name] ?? '🌍',
            count: locs.length,
            image: COUNTRY_IMAGES[name] ?? DEFAULT_IMG,
        }))
    }, [locations])

    // Derive cities for selected country
    const cities = useMemo(() => {
        if (!selectedCountry) return []
        const cityMap = new Map()
        locations
            .filter(l => l.country === selectedCountry)
            .forEach(loc => {
                const c = loc.city || 'Unknown'
                if (!cityMap.has(c)) cityMap.set(c, [])
                cityMap.get(c).push(loc)
            })
        return Array.from(cityMap.entries()).map(([name, locs]) => ({
            id: name,
            name,
            count: locs.length,
            image: CITY_IMAGES[name] ?? DEFAULT_IMG,
        }))
    }, [locations, selectedCountry])

    // Locations for selected city
    const cityLocations = useMemo(() => {
        if (!selectedCountry || !selectedCity) return []
        return locations.filter(
            l => l.country === selectedCountry && l.city === selectedCity
        )
    }, [locations, selectedCountry, selectedCity])

    // Filtered by search
    const filteredLocations = useMemo(() => {
        if (!search.trim()) return cityLocations
        const q = search.toLowerCase()
        return cityLocations.filter(l =>
            l.title?.toLowerCase().includes(q) ||
            l.category?.toLowerCase().includes(q) ||
            l.address?.toLowerCase().includes(q)
        )
    }, [cityLocations, search])

    const handleSelectCountry = (country) => {
        setSelectedCountry(country.id)
        setLevel('cities')
    }

    const handleSelectCity = (city) => {
        setSelectedCity(city.id)
        setSearch('')
        setLevel('locations')
    }

    const handleSelectLocation = (loc) => {
        setSelectedLocation(loc)
        setLevel('details')
    }

    const handleBack = () => {
        if (level === 'details') {
            setSelectedLocation(null)
            setLevel('locations')
        } else if (level === 'locations') {
            setSelectedCity(null)
            setSearch('')
            setLevel('cities')
        } else if (level === 'cities') {
            setSelectedCountry(null)
            setLevel('countries')
        }
    }

    const headerTitle = () => {
        if (level === 'countries') return 'География'
        if (level === 'cities') return selectedCountry
        if (level === 'locations') return selectedCity
        if (level === 'details') return selectedLocation?.title ?? 'Объект'
        return ''
    }

    const headerSub = () => {
        if (level === 'cities') return 'Выберите город'
        if (level === 'locations') return `${filteredLocations.length} локаци${filteredLocations.length === 1 ? 'я' : filteredLocations.length < 5 ? 'и' : 'й'}`
        if (level === 'details') return selectedLocation?.category ?? ''
        return null
    }

    return (
        <div className={cn(
            "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-[32px] p-2 lg:p-6 shadow-sm flex flex-col min-h-[460px] w-full relative transition-all",
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 lg:mb-6 px-1 shrink-0">
                <div className="flex items-center gap-3">
                    {level !== 'countries' ? (
                        <button
                            onClick={handleBack}
                            className="p-1.5 -ml-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                        >
                            <ArrowLeft size={18} />
                        </button>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <Globe size={16} />
                        </div>
                    )}
                    <div>
                        <h2 className="text-[10px] lg:text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                            {headerTitle()}
                            {level === 'cities' && (
                                <span className="hidden sm:inline-flex p-0.5 px-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[9px] text-slate-400 items-center gap-1">
                                    {timeOfDay === 'morning' && <CloudSun size={10} />}
                                    {timeOfDay === 'day' && <Sun size={10} />}
                                    {timeOfDay === 'evening' && <Sunset size={10} />}
                                    {timeOfDay === 'night' && <Moon size={10} />}
                                    {timeOfDay}
                                </span>
                            )}
                        </h2>
                        {headerSub() && (
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide opacity-60">
                                {headerSub()}
                            </p>
                        )}
                    </div>
                </div>
                {level === 'locations' && (
                    <div className="hidden lg:flex gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Поиск..."
                            className="bg-slate-50 dark:bg-slate-950/50 px-3 py-1.5 rounded-xl text-[10px] font-bold border-none outline-none w-32 focus:w-48 transition-all"
                        />
                    </div>
                )}
            </div>

            {/* Details view */}
            {level === 'details' && selectedLocation ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row gap-6 h-full p-2"
                >
                    <div className="w-full lg:w-1/3 aspect-video lg:aspect-auto lg:h-64 rounded-[24px] overflow-hidden relative group border border-slate-100 dark:border-slate-800 shrink-0">
                        <img
                            src={selectedLocation.image ?? DEFAULT_IMG}
                            className="w-full h-full object-cover"
                            alt={selectedLocation.title}
                        />
                        <button
                            onClick={() => navigate('/admin/locations')}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold uppercase tracking-widest text-xs"
                        >
                            Открыть в редакторе
                        </button>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                                        {selectedLocation.category ?? '—'}
                                    </span>
                                    {selectedLocation.cuisine && (
                                        <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                                            {selectedLocation.cuisine}
                                        </span>
                                    )}
                                    {selectedLocation.priceLevel && (
                                        <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[9px] font-bold uppercase tracking-widest text-emerald-600">
                                            {selectedLocation.priceLevel}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                                    {selectedLocation.title}
                                </h2>
                                <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                    <MapPin size={12} /> {selectedLocation.city}, {selectedLocation.address}
                                </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => navigate('/admin/locations')}
                                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white transition-all text-slate-400"
                                    title="Редактировать"
                                >
                                    <Edit size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-50 dark:border-slate-800/50">
                            <div className="space-y-1">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Рейтинг</p>
                                <div className="flex items-center gap-1 text-yellow-500 font-bold text-lg">
                                    <Star size={16} className="fill-current" /> {selectedLocation.rating ?? '—'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Открыто</p>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                    {selectedLocation.openingHours ?? '—'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Теги</p>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                                    {selectedLocation.tags?.slice(0, 2).join(', ') ?? '—'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">ID</p>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono">#{selectedLocation.id}</p>
                            </div>
                        </div>

                        {selectedLocation.description && (
                            <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-50 dark:border-slate-800/50 line-clamp-2">
                                {selectedLocation.description}
                            </p>
                        )}
                    </div>
                </motion.div>

            ) : level === 'locations' ? (
                /* Locations table */
                <div className="flex-1 overflow-x-auto no-scrollbar -mx-2 px-2 pb-2">
                    <table className="w-full border-collapse min-w-[580px]">
                        <thead>
                            <tr className="border-b border-slate-50 dark:border-slate-800/50 text-left">
                                <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-slate-400 w-[35%]">Название</th>
                                <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-slate-400">Адрес</th>
                                <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-slate-400">Рейтинг</th>
                                <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-slate-400">Цена</th>
                                <th className="py-3 px-4 text-right text-[9px] font-bold uppercase tracking-widest text-slate-400 w-20">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
                            {filteredLocations.map(loc => (
                                <tr
                                    key={loc.id}
                                    onClick={() => handleSelectLocation(loc)}
                                    className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                                >
                                    <td className="py-3 px-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                                                <img
                                                    src={loc.image ?? DEFAULT_IMG}
                                                    alt={loc.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight">{loc.title}</p>
                                                <span className="inline-flex px-1.5 py-0.5 rounded-[6px] bg-slate-100 dark:bg-slate-800 text-[9px] font-bold uppercase tracking-wide text-slate-500">{loc.category}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 align-middle">
                                        <span className="text-[11px] text-slate-500 leading-tight line-clamp-1">{loc.address ?? '—'}</span>
                                    </td>
                                    <td className="py-3 px-4 align-middle">
                                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                                            <Star size={10} className="fill-current" />
                                            {loc.rating ?? '—'}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 align-middle">
                                        <span className="text-[11px] font-bold text-slate-500">{loc.priceLevel ?? '—'}</span>
                                    </td>
                                    <td className="py-3 px-4 text-right align-middle">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={e => { e.stopPropagation(); navigate('/admin/locations') }}
                                                className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
                                                title="Редактировать"
                                            >
                                                <Edit size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredLocations.length === 0 && (
                        <div className="py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50">
                            {search ? 'Ничего не найдено' : 'Нет локаций в этом городе'}
                        </div>
                    )}
                </div>

            ) : (
                /* Countries or Cities card grid */
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 flex-1 overflow-y-auto min-h-0">
                    <AnimatePresence mode="popLayout">
                        {(level === 'countries' ? countries : cities).map(item => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={() => level === 'countries' ? handleSelectCountry(item) : handleSelectCity(item)}
                                className="group relative aspect-[4/5] rounded-[24px] overflow-hidden border border-slate-100 dark:border-slate-800/50 transition-all cursor-pointer bg-slate-50 dark:bg-slate-800"
                            >
                                {/* Background image */}
                                <div className="absolute inset-0">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <ImageIcon className="text-slate-300" size={32} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                </div>

                                {/* Card content */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 transition-transform duration-300 group-hover:-translate-y-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        {item.code && <span className="text-lg">{item.code}</span>}
                                        <h3 className="text-lg font-bold leading-none translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            {item.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-white/60">
                                            {item.count} {level === 'countries' ? 'лок.' : 'мест'}
                                        </p>
                                        <ChevronRight size={14} className="text-white/60" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {(level === 'countries' ? countries : cities).length === 0 && (
                        <div className="col-span-3 py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50">
                            {level === 'countries' ? 'Нет данных' : 'Нет городов'}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default LocationHierarchyExplorer
