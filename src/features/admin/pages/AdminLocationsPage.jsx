import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Plus, Search, Filter, MoreHorizontal, Edit, Trash2,
    Download, Upload, ChevronRight, Globe, Building2, MapPin,
    CheckCircle, Clock, AlertCircle, Star, ChevronDown, ArrowRight,
    X, LayoutGrid, List as ListIcon, Activity, Zap, Phone, Link as LinkIcon, Tag, Sparkles,
    Instagram, Facebook, Wand2, Image as ImageIcon, Map, CalendarCheck, Brain
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { cn } from '@/lib/utils'
import LocationHierarchyExplorer from '../components/LocationHierarchyExplorer'
import ImportWizard from '../components/ImportWizard'
import MapTab from '@/features/dashboard/components/MapTab'
import { useLocationsStore } from '@/features/public/hooks/useLocationsStore'
import { useAppConfigStore } from '@/store/useAppConfigStore'

// Fix for default marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationPicker({ position, onLocationSelect }) {
    const map = useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
        },
    });

    useEffect(() => {
        if (position) {
            map.setView(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

const AdminLocationsPage = () => {
    const [view, setView] = useState('list')
    const [searchQuery, setSearchQuery] = useState('')
    const [filterCategory, setFilterCategory] = useState('All')
    const [filterStatus, setFilterStatus] = useState('All')
    const [filterCity, setFilterCity] = useState('All')
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
    const [isImportWizardOpen, setIsImportWizardOpen] = useState(false)
    const [viewMode, setViewMode] = useState('list') // 'list' | 'map'
    const [formData, setFormData] = useState(null)
    const [openMenuId, setOpenMenuId] = useState(null) // MoreHorizontal dropdown
    const [toast, setToast] = useState(null) // { message, type }
    const [aiPrompt, setAiPrompt] = useState('')
    const [isAiFilling, setIsAiFilling] = useState(false)
    const [isAiEnhancing, setIsAiEnhancing] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const menuRef = useRef(null)

    // Real locations from store
    const { locations, addLocation, updateLocation, deleteLocation } = useLocationsStore()

    // Close menu on outside click
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Auto-dismiss toast
    useEffect(() => {
        if (!toast) return
        const t = setTimeout(() => setToast(null), 3000)
        return () => clearTimeout(t)
    }, [toast])

    const handleCreateNew = () => {
        const emptyLocation = {
            id: 'NEW',
            name: '',
            category: 'Cafe',
            city: '',
            country: '',
            address: '',
            description: '',
            insider_tip: '',
            must_try: '',
            price_range: '$$',
            website: '',
            phone: '',
            opening_hours: '',
            booking_url: '',
            social_instagram: '',
            social_facebook: '',
            image_url: '',
            images: [],
            latitude: 50.0647,
            longitude: 19.9450,
            tags: [],
            best_time: [],
            special_labels: [],
            cuisine: '',
            ai_keywords: '',
            is_hidden_gem: false,
            is_featured: false,
            status: 'Active',
            occasions: [],
            mealTimes: [],
            noiseLevel: 'moderate',
            ambiance: [],
            pricePerPerson: '',
            reservationPolicy: 'not_required',
            avgVisitDuration: '1-2h',
            instagramScore: 3,
            hiddenGem: false,
            aiSummary: '',
            dishMenu: [],
        }
        setSelectedLocation(emptyLocation)
        setFormData(emptyLocation)
        setIsSlideOverOpen(true)
    }

    const handleExport = () => {
        const rows = [
            ['Название', 'Город', 'Страна', 'Категория', 'Рейтинг', 'Цена'],
            ...locations.map(l => [
                l.title || l.name || '',
                l.city || '',
                l.country || '',
                l.category || '',
                l.rating ?? '',
                l.priceLevel || l.price_range || '',
            ])
        ]
        const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `gastromap-locations-${new Date().toISOString().slice(0,10)}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    // Map store location fields → form fields
    const handleEdit = (loc) => {
        setSelectedLocation(loc)
        setFormData({
            id: loc.id,
            name: loc.title || loc.name || '',
            category: loc.category || 'Cafe',
            city: loc.city || '',
            country: loc.country || '',
            address: loc.address || '',
            description: loc.description || '',
            insider_tip: loc.insider_tip || '',
            must_try: Array.isArray(loc.what_to_try)
                ? loc.what_to_try.join(', ')
                : (loc.must_try || loc.what_to_try || ''),
            ai_keywords: Array.isArray(loc.ai_keywords)
                ? loc.ai_keywords.join(', ')
                : (loc.ai_keywords || ''),
            price_range: loc.priceLevel || loc.price_range || '$$',
            website: loc.website || '',
            phone: loc.phone || '',
            opening_hours: loc.openingHours || loc.opening_hours || '',
            booking_url: loc.booking_url || loc.bookingUrl || '',
            social_instagram: loc.social_instagram || loc.socialLinks?.instagram || '',
            social_facebook: loc.social_facebook || loc.socialLinks?.facebook || '',
            image_url: loc.image || loc.image_url || '',
            images: loc.images || (loc.image ? [loc.image] : loc.image_url ? [loc.image_url] : []),
            latitude: loc.coordinates?.lat || loc.latitude || 50.0647,
            longitude: loc.coordinates?.lng || loc.longitude || 19.9450,
            tags: loc.tags || [],
            best_time: loc.best_time || [],
            special_labels: loc.special_labels || [],
            cuisine: loc.cuisine || '',
            is_hidden_gem: loc.is_hidden_gem || false,
            is_featured: loc.is_featured || false,
            status: loc.status || 'Active',
            occasions: loc.occasions || [],
            mealTimes: loc.mealTimes || [],
            noiseLevel: loc.noiseLevel || 'moderate',
            ambiance: loc.ambiance || [],
            pricePerPerson: loc.pricePerPerson || '',
            reservationPolicy: loc.reservationPolicy || 'not_required',
            avgVisitDuration: loc.avgVisitDuration || '1-2h',
            instagramScore: loc.instagramScore || 3,
            hiddenGem: loc.hiddenGem || false,
            aiSummary: loc.aiSummary || '',
            dishMenu: loc.dishMenu || [],
        })
        setIsSlideOverOpen(true)
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        if (params.get('create') === 'true') {
            handleCreateNew()
            // Clear params to prevent re-triggering on refresh
            navigate(location.pathname, { replace: true })
        } else if (params.get('import') === 'true') {
            setIsImportWizardOpen(true)
            navigate(location.pathname, { replace: true })
        } else if (params.get('export') === 'true') {
            handleExport()
            navigate(location.pathname, { replace: true })
        }
    }, [location.search])


    // Save form → store
    const handleSave = () => {
        if (!formData?.name?.trim()) return
        const locationData = {
            title: formData.name,
            name: formData.name,
            category: formData.category,
            city: formData.city,
            country: formData.country,
            address: formData.address,
            description: formData.description,
            insider_tip: formData.insider_tip,
            what_to_try: formData.must_try
                ? formData.must_try.split(',').map(s => s.trim()).filter(Boolean)
                : [],
            must_try: formData.must_try,
            ai_keywords: formData.ai_keywords
                ? formData.ai_keywords.split(',').map(s => s.trim()).filter(Boolean)
                : [],
            priceLevel: formData.price_range,
            price_range: formData.price_range,
            website: formData.website,
            phone: formData.phone,
            openingHours: formData.opening_hours,
            opening_hours: formData.opening_hours,
            booking_url: formData.booking_url,
            bookingUrl: formData.booking_url || null,
            social_instagram: formData.social_instagram,
            social_facebook: formData.social_facebook,
            socialLinks: {
                instagram: formData.social_instagram || null,
                facebook: formData.social_facebook || null,
                twitter: null,
            },
            image: formData.image_url || formData.images?.[0] || '',
            image_url: formData.image_url,
            images: formData.images || [],
            coordinates: { lat: Number(formData.latitude), lng: Number(formData.longitude) },
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            tags: formData.tags || [],
            best_time: formData.best_time || [],
            special_labels: formData.special_labels || [],
            cuisine: formData.cuisine,
            is_hidden_gem: formData.is_hidden_gem || false,
            is_featured: formData.is_featured || false,
            status: formData.status || 'Active',
            rating: selectedLocation?.rating || 0,
            occasions: formData.occasions || [],
            mealTimes: formData.mealTimes || [],
            noiseLevel: formData.noiseLevel || 'moderate',
            ambiance: formData.ambiance || [],
            pricePerPerson: formData.pricePerPerson || '',
            reservationPolicy: formData.reservationPolicy || 'not_required',
            avgVisitDuration: formData.avgVisitDuration || '1-2h',
            instagramScore: formData.instagramScore || 3,
            hiddenGem: formData.hiddenGem || false,
            aiSummary: formData.aiSummary || '',
            dishMenu: formData.dishMenu || [],
        }
        const isNew = selectedLocation?.id === 'NEW'
        if (isNew) {
            addLocation(locationData)
        } else {
            updateLocation(selectedLocation.id, locationData)
        }
        setIsSlideOverOpen(false)
        setToast({ message: isNew ? '✓ Объект создан' : '✓ Изменения сохранены', type: 'success' })
    }

    // Approve from moderation queue → update status in store
    const handleApprove = (id) => {
        updateLocation(id, { status: 'Active' })
        setToast({ message: '✓ Объект одобрен', type: 'success' })
    }

    // Derived stats from real data
    const pendingCount = useMemo(
        () => locations.filter(l => l.status === 'Pending').length,
        [locations]
    )
    const categoryCount = useMemo(
        () => new Set(locations.map(l => l.category).filter(Boolean)).size,
        [locations]
    )
    const stats = useMemo(() => [
        { label: 'Всего', val: locations.length > 0 ? locations.length.toLocaleString() : '—', icon: MapPin, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
        { label: 'В очереди', val: pendingCount > 0 ? pendingCount.toString() : '0', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
        { label: 'Категории', val: categoryCount > 0 ? categoryCount.toString() : '—', icon: Zap, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
    ], [locations, pendingCount, categoryCount])

    // Filtered list by search query and dropdowns
    const filteredLocations = useMemo(() => {
        let result = locations
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            result = result.filter(l =>
                (l.title || l.name || '').toLowerCase().includes(q) ||
                l.category?.toLowerCase().includes(q) ||
                l.city?.toLowerCase().includes(q) ||
                l.cuisine?.toLowerCase().includes(q)
            )
        }
        return result
            .filter(loc => filterCategory === 'All' || loc.category === filterCategory)
            .filter(loc => filterStatus === 'All' || loc.status === filterStatus)
            .filter(loc => filterCity === 'All' || loc.city === filterCity)
    }, [locations, searchQuery, filterCategory, filterStatus, filterCity])

    const categories = [
        'Cafe', 'Restaurant', 'Street Food', 'Bar', 'Market',
        'Bakery', 'Winery', 'Store', 'Coffee Shop', 'Pastry Shop'
    ]

    const LABEL_GROUPS = {
        "Кухня и Меню": [
            "Авторская кухня", "Веганское меню", "Вкусные десерты", "Завтраки целый день",
            "Импортные продукты", "Местные продукты", "Меню завтраков", "Меню ланча", "Фьюжен",
            "Итальянская", "Французская", "Японская", "Китайская", "Греческая", "Испанская",
            "Мексиканская", "Тайская", "Грузинская", "Польская", "Израильская", "Американская",
            "Средиземноморская", "Индийская", "Вьетнамская", "Турецкая"
        ].sort(),
        "Бар и Напитки": [
            "Авторские коктейли", "Винная карта", "Гостевые смены", "Дегустация вин",
            "DJ сеты", "Крафтовое пиво", "Миксология (без меню)", "Спешиалти кофе", "Широкий выбор джина"
        ].sort(),
        "Атмосфера": [
            "Живописный вид", "Живая музыка", "Коворкинг", "Настольные игры",
            "Оживленная атмосфера", "Романтическая атмосфера", "Скрытый вход (Speakeasy)",
            "Счастливые часы", "Тематический интерьер", "Тихая атмосфера", "Уютно"
        ].sort(),
        "Удобства и Сервис": [
            "Балкончики", "Детская игровая зона", "Детские стульчики", "Доставка",
            "Инклюзивность", "Любимое у местных", "Парковка", "Pet friendly",
            "Самовывоз", "Терраса во дворе", "Терраса на крыше", "WiFi"
        ].sort(),
        "Награды и Особое": [
            "Гид Мишлен", "Звезда Мишлен", "Кальян", "Поздний ужин"
        ].sort()
    }

    const BEST_TIMES = [
        { id: 'morning', label: 'Утро', icon: Clock },
        { id: 'day', label: 'День', icon: Clock },
        { id: 'evening', label: 'Вечер', icon: Clock },
        { id: 'late_night', label: 'Поздняя ночь', icon: Clock }
    ]

    const addImageUrl = (url) => {
        if (!url) return;
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, url],
            image_url: prev.image_url || url // Set as main if it's the first one
        }))
    }

    const removeImage = (index) => {
        setFormData(prev => {
            const newImages = prev.images.filter((_, i) => i !== index);
            return {
                ...prev,
                images: newImages,
                image_url: prev.image_url === prev.images[index] ? (newImages[0] || '') : prev.image_url
            }
        })
    }

    const handleAIFill = async (prompt) => {
        if (!prompt.trim()) {
            setToast({ message: '⚠ Введите название и город', type: 'error' })
            return
        }
        setIsAiFilling(true)
        try {
            const appCfg = useAppConfigStore.getState()
            const apiKey = appCfg.aiApiKey || import.meta.env.VITE_OPENROUTER_API_KEY || ''
            if (!apiKey) {
                setToast({ message: '⚠ Укажите API ключ в разделе AI', type: 'error' })
                setIsAiFilling(false)
                return
            }
            const model = appCfg.aiPrimaryModel || 'meta-llama/llama-3.3-70b-instruct:free'
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'GastroMap',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a gastro data assistant. When given a restaurant name and city, return a JSON object with these exact fields: name (string), category (one of: Cafe, Restaurant, Street Food, Bar, Market, Bakery, Winery, Store, Coffee Shop, Pastry Shop), city (string), country (string), description (string, 2-3 vivid appetizing sentences), price_range (one of: $, $$, $$$, $$$$), must_try (comma-separated string of 2-4 signature dishes), insider_tip (string, one sentence local secret), ai_keywords (comma-separated string of 5-8 mood/vibe tags), website (string URL or empty string). Return ONLY valid JSON, no markdown fences, no explanation.'
                        },
                        { role: 'user', content: `Restaurant: ${prompt}` }
                    ],
                    max_tokens: 700,
                    temperature: 0.4,
                })
            })
            if (!res.ok) throw new Error(`OpenRouter error ${res.status}`)
            const data = await res.json()
            const raw = data.choices?.[0]?.message?.content ?? ''
            const jsonStr = raw.replace(/```json?\n?/gi, '').replace(/```/g, '').trim()
            const parsed = JSON.parse(jsonStr)
            setFormData(prev => ({
                ...prev,
                name: parsed.name || prev.name,
                category: parsed.category || prev.category,
                city: parsed.city || prev.city,
                country: parsed.country || prev.country,
                description: parsed.description || prev.description,
                price_range: parsed.price_range || prev.price_range,
                must_try: parsed.must_try || prev.must_try,
                insider_tip: parsed.insider_tip || prev.insider_tip,
                ai_keywords: parsed.ai_keywords || prev.ai_keywords,
                website: parsed.website || prev.website,
            }))
            setAiPrompt('')
            setToast({ message: '✓ AI заполнил форму', type: 'success' })
        } catch (err) {
            console.error('[AI Fill]', err)
            setToast({ message: '⚠ Ошибка AI. Проверьте API ключ', type: 'error' })
        } finally {
            setIsAiFilling(false)
        }
    }

    const handleAIEnhanceDescription = async () => {
        const currentDesc = formData?.description?.trim()
        if (!currentDesc) {
            setToast({ message: '⚠ Введите описание для улучшения', type: 'error' })
            return
        }
        setIsAiEnhancing(true)
        try {
            const appCfg = useAppConfigStore.getState()
            const apiKey = appCfg.aiApiKey || import.meta.env.VITE_OPENROUTER_API_KEY || ''
            if (!apiKey) {
                setToast({ message: '⚠ Укажите API ключ в разделе AI', type: 'error' })
                setIsAiEnhancing(false)
                return
            }
            const model = appCfg.aiPrimaryModel || 'meta-llama/llama-3.3-70b-instruct:free'
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'GastroMap',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a gastro copywriter. Enhance the given restaurant description to be vivid, appetizing, and evocative. Keep it exactly 2-3 sentences. Return only the enhanced text with no quotes, no explanation, no prefix.'
                        },
                        { role: 'user', content: `Enhance this restaurant description: ${currentDesc}` }
                    ],
                    max_tokens: 250,
                    temperature: 0.7,
                })
            })
            if (!res.ok) throw new Error(`OpenRouter error ${res.status}`)
            const data = await res.json()
            const enhanced = data.choices?.[0]?.message?.content?.trim() ?? ''
            if (enhanced) {
                setFormData(prev => ({ ...prev, description: enhanced }))
                setToast({ message: '✓ Описание улучшено', type: 'success' })
            }
        } catch (err) {
            console.error('[AI Enhance]', err)
            setToast({ message: '⚠ Ошибка AI при улучшении', type: 'error' })
        } finally {
            setIsAiEnhancing(false)
        }
    }

    const renderListView = (filtered) => (
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-8 lg:pl-10">Объект</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">Локация</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">Рейтинг</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest">Статус</th>
                        <th className="px-6 py-4 text-right pr-8 lg:pr-10"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-16 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50">
                                {searchQuery ? 'Ничего не найдено' : 'Нет локаций'}
                            </td>
                        </tr>
                    ) : filtered.map((loc) => (
                        <tr key={loc.id} onClick={() => handleEdit(loc)} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all group cursor-pointer border-none leading-none">
                            <td className="px-6 py-4 pl-8 lg:pl-10">
                                <div className="flex items-center gap-4">
                                    {loc.image ? (
                                        <img src={loc.image} alt={loc.title || loc.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner shrink-0">
                                            <Building2 size={18} />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate leading-tight">{loc.title || loc.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black shrink-0">{loc.category}</p>
                                            {loc.cuisine && (
                                                <Badge variant="secondary" className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[8px] h-4 px-1.5 font-black border-none uppercase tracking-widest shrink-0">
                                                    {loc.cuisine}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-[11px] font-bold flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                    <MapPin size={12} className="text-slate-300 dark:text-slate-600" />
                                    <span>{loc.city}</span>
                                    <span className="opacity-30">/</span>
                                    <span className="opacity-60">{loc.country}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                    <Star size={12} className={cn("fill-current", loc.rating > 0 ? "text-yellow-500" : "text-slate-200 dark:text-slate-800")} />
                                    <span className="text-[11px] font-bold">{loc.rating > 0 ? loc.rating : '—'}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className={cn(
                                    "inline-flex items-center p-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider",
                                    loc.status === 'Active' ? 'bg-green-50 dark:bg-green-500/5 text-green-600' :
                                    loc.status === 'Pending' ? 'bg-orange-50 dark:bg-orange-500/5 text-orange-600' :
                                    'bg-slate-50 dark:bg-slate-800 text-slate-400'
                                )}>
                                    <div className={cn("w-1.5 h-1.5 rounded-full mr-2",
                                        loc.status === 'Active' ? 'bg-green-500' :
                                        loc.status === 'Pending' ? 'bg-orange-500' : 'bg-slate-300'
                                    )} />
                                    {loc.status || 'Active'}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right pr-8 lg:pr-10 relative">
                                <div ref={openMenuId === loc.id ? menuRef : null} className="inline-block">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === loc.id ? null : loc.id) }}
                                        className="p-2 rounded-xl text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>
                                    {openMenuId === loc.id && (
                                        <div
                                            onClick={e => e.stopPropagation()}
                                            className="absolute right-8 top-12 z-50 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden min-w-[140px]"
                                        >
                                            <button
                                                onClick={() => { setOpenMenuId(null); handleEdit(loc) }}
                                                className="flex items-center gap-2.5 w-full px-4 py-3 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors uppercase tracking-widest"
                                            >
                                                <Edit size={13} /> Редактировать
                                            </button>
                                            <button
                                                onClick={() => { setOpenMenuId(null); deleteLocation(loc.id); setToast({ message: '✓ Объект удалён', type: 'success' }) }}
                                                className="flex items-center gap-2.5 w-full px-4 py-3 text-[11px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors uppercase tracking-widest border-t border-slate-50 dark:border-slate-700"
                                            >
                                                <Trash2 size={13} /> Удалить
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

    return (
        <div className="space-y-6 lg:space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div>
                    <h1 className="text-xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">Локации</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1.5 text-xs lg:text-base">База объектов и инструменты модерации.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto p-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/20 dark:border-slate-800/50">
                    <button
                        onClick={handleExport}
                        className="flex-1 sm:px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-all flex items-center gap-1.5 justify-center"
                    >
                        <Download size={12} />
                        Экспорт
                    </button>
                    <button
                        onClick={() => setIsImportWizardOpen(true)}
                        className="flex-1 sm:px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-all"
                    >
                        Импорт
                    </button>
                    <button
                        onClick={handleCreateNew}
                        className="flex-1 sm:px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                    >
                        Создать
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 lg:gap-8">
                {stats.map((s, i) => (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white dark:bg-slate-900/50 p-4 lg:p-6 rounded-[28px] lg:rounded-[40px] border border-slate-100 dark:border-slate-800/50 shadow-sm flex flex-col sm:flex-row items-center gap-3 lg:gap-5 group hover:border-indigo-500/10 transition-all">
                        <div className={cn("w-10 h-10 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden relative", s.bg, s.color)}>
                            <s.icon size={20} className="lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-center sm:text-left min-w-0">
                            <p className="text-[9px] lg:text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1">{s.label}</p>
                            <p className="text-sm lg:text-2xl font-bold text-slate-900 dark:text-white leading-none tracking-tight truncate">{s.val}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Content Card */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[32px] lg:rounded-[48px] border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-4 lg:p-10 border-b border-slate-50 dark:border-slate-800/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex gap-1.5 p-1 bg-slate-50 dark:bg-slate-950/50 rounded-2xl w-full lg:w-fit overflow-x-auto no-scrollbar border border-slate-100/50 dark:border-slate-800/50">
                        {[
                            { id: 'list', label: 'Все объекты', icon: ListIcon },
                            { id: 'moderation', label: 'В очереди', icon: AlertCircle, count: pendingCount }
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setView(tab.id)} className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                                view === tab.id ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            )}>
                                <tab.icon size={14} />{tab.label}
                                {tab.count > 0 && <span className="w-5 h-5 flex items-center justify-center bg-indigo-500 text-white rounded-lg text-[9px] ml-1 shadow-lg shadow-indigo-500/20">{tab.count}</span>}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="flex gap-1.5 p-1 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                    viewMode === 'list' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-400'
                                )}
                            >
                                Список
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                    viewMode === 'map' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-400'
                                )}
                            >
                                Карта
                            </button>
                        </div>

                        <div className="relative flex-1 lg:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Поиск объектов..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/30 border-none rounded-2xl text-[13px] font-medium outline-none focus:ring-2 ring-indigo-500/10 transition-all font-black leading-none"
                            />
                        </div>
                    </div>

                    {/* Filter dropdowns */}
                    <div className="flex gap-2 flex-wrap px-4 lg:px-10 pb-4">
                        <select
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value)}
                            className="text-[10px] font-bold uppercase tracking-wide bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 ring-indigo-500/20 text-slate-600 dark:text-slate-300"
                        >
                            <option value="All">Все категории</option>
                            {[...new Set(locations.map(l => l.category).filter(Boolean))].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="text-[10px] font-bold uppercase tracking-wide bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 ring-indigo-500/20 text-slate-600 dark:text-slate-300"
                        >
                            <option value="All">Все статусы</option>
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Draft">Draft</option>
                        </select>
                        <select
                            value={filterCity}
                            onChange={e => setFilterCity(e.target.value)}
                            className="text-[10px] font-bold uppercase tracking-wide bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 ring-indigo-500/20 text-slate-600 dark:text-slate-300"
                        >
                            <option value="All">Все города</option>
                            {[...new Set(locations.map(l => l.city).filter(Boolean))].sort().map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        {(filterCategory !== 'All' || filterStatus !== 'All' || filterCity !== 'All') && (
                            <button
                                onClick={() => { setFilterCategory('All'); setFilterStatus('All'); setFilterCity('All') }}
                                className="text-[9px] font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-700 transition-colors px-2 py-1"
                            >
                                Сбросить
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col pt-2 font-black leading-none">
                    <AnimatePresence mode="wait">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={view}>
                            {view === 'list' && (
                                viewMode === 'list' ? renderListView(filteredLocations) : (
                                    <div className="h-[600px] w-full p-4 lg:p-10">
                                        <MapTab />
                                    </div>
                                )
                            )}
                            {view === 'moderation' && (() => {
                                const pending = locations.filter(l => l.status === 'Pending')
                                return pending.length === 0 ? (
                                    <div className="py-16 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50">
                                        Нет объектов на модерации
                                    </div>
                                ) : (
                                    <div className="p-8 lg:p-14 space-y-6">
                                        {pending.map(loc => (
                                            <div key={loc.id} className="bg-slate-50/50 dark:bg-slate-800/30 rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-indigo-500/10 transition-all">
                                                <div className="flex items-center gap-6">
                                                    {loc.image ? (
                                                        <img src={loc.image} alt={loc.title || loc.name} className="w-16 h-16 rounded-[24px] object-cover shadow-sm" />
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-[24px] bg-white dark:bg-slate-800 flex items-center justify-center text-slate-300 shadow-sm"><Building2 size={24} /></div>
                                                    )}
                                                    <div>
                                                        <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white leading-none mb-2">{loc.title || loc.name}</h3>
                                                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5"><MapPin size={12} /> {loc.city}, {loc.country}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{loc.category} · {loc.priceLevel || loc.price_range || ''}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 w-full sm:w-auto">
                                                    <button
                                                        onClick={() => handleApprove(loc.id)}
                                                        className="flex-1 sm:px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[20px] font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                                                    >
                                                        Одобрить
                                                    </button>
                                                    <button
                                                        onClick={() => { deleteLocation(loc.id); setToast({ message: '✓ Объект отклонён', type: 'success' }) }}
                                                        className="flex-1 sm:px-8 py-3.5 bg-white dark:bg-slate-800 text-red-500 rounded-[20px] font-bold text-[10px] uppercase tracking-widest border border-slate-100 dark:border-slate-700 transition-all active:scale-95"
                                                    >
                                                        Отклонить
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            })()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {isSlideOverOpen && formData && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSlideOverOpen(false)} className="fixed inset-0 z-[100] bg-slate-900/10 backdrop-blur-md" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 250 }} className="fixed top-0 right-0 w-full sm:w-[600px] bg-white dark:bg-slate-900 h-full z-[110] flex flex-col shadow-2xl overflow-hidden font-sans">

                            {/* Header */}
                            <div className="p-6 lg:p-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-4 lg:gap-5">
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                        <Building2 size={20} className="lg:w-6 lg:h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white leading-none mb-1.5">
                                            {selectedLocation.id === 'NEW' ? 'Новый объект' : 'Редактирование'}
                                        </h2>
                                        <p className="text-[9px] lg:text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] leading-none">
                                            {selectedLocation.id === 'NEW' ? 'Черновик Gastro AI' : `ID: #${selectedLocation.id}`}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setIsSlideOverOpen(false)} aria-label="close-panel" className="p-2.5 lg:p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl lg:rounded-2xl hover:rotate-90 transition-all"><X size={18} className="lg:w-5 lg:h-5" /></button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-10 lg:space-y-12 custom-scrollbar relative">

                                {/* Section: AI Magic */}
                                <div className="p-6 rounded-[28px] bg-gradient-to-br from-indigo-600 to-indigo-700 text-white relative overflow-hidden shadow-lg shadow-indigo-500/20 group border border-white/10 transition-all hover:shadow-indigo-500/30">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-white/20 transition-all duration-700" />
                                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-all">
                                                <Sparkles size={18} className="text-amber-300 animate-pulse" />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">Gastro AI</h4>
                                                <p className="text-[8px] font-bold text-white/50 whitespace-nowrap">Умное заполнение</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 w-full flex gap-3">
                                            <div className="relative flex-1 group/input">
                                                <input
                                                    type="text"
                                                    className="w-full pl-5 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold placeholder:text-white/30 outline-none focus:bg-white/10 focus:border-white/20 transition-all"
                                                    placeholder="Название и город..."
                                                    value={aiPrompt}
                                                    onChange={e => setAiPrompt(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && !isAiFilling && handleAIFill(aiPrompt)}
                                                    disabled={isAiFilling}
                                                />
                                                <Wand2 size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-white/60 group-focus-within/input:scale-110 transition-all" />
                                            </div>
                                            <button
                                                className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-[0.96] hover:bg-indigo-50 transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                onClick={() => handleAIFill(aiPrompt)}
                                                disabled={isAiFilling || !aiPrompt.trim()}
                                            >
                                                {isAiFilling ? (
                                                    <svg className="animate-spin w-3 h-3 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                                                ) : null}
                                                Заполнить
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: General */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 border-l-4 border-indigo-500 pl-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">Основная информация</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Название объекта *</label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-6 py-4.5 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border-2 border-transparent focus:border-indigo-500/20 focus:bg-white dark:focus:bg-slate-800 font-bold text-sm outline-none transition-all"
                                                    placeholder="Напр. Zen Garden"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Тип / Категория</label>
                                                <div className="relative">
                                                    <select
                                                        value={formData.category}
                                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                        className="w-full px-6 py-4 bg-slate-50/40 dark:bg-slate-800/40 rounded-2xl border-none font-bold text-xs outline-none focus:ring-4 ring-indigo-500/5 transition-all appearance-none"
                                                    >
                                                        {categories.map(cat => (
                                                            <option key={cat} value={cat}>{cat}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Основная кухня</label>
                                                <div className="relative">
                                                    <select
                                                        value={formData.cuisine}
                                                        onChange={e => setFormData({ ...formData, cuisine: e.target.value })}
                                                        className="w-full px-6 py-4 bg-slate-50/40 dark:bg-slate-800/40 rounded-2xl border-none font-bold text-xs outline-none focus:ring-4 ring-indigo-500/5 transition-all appearance-none"
                                                    >
                                                        <option value="">Не выбрано</option>
                                                        {[
                                                            "Итальянская", "Французская", "Японская", "Китайская", "Греческая", "Испанская",
                                                            "Мексиканская", "Тайская", "Грузинская", "Польская", "Израильская", "Американская",
                                                            "Средиземноморская", "Индийская", "Вьетнамская", "Турецкая"
                                                        ].sort().map(cuisine => (
                                                            <option key={cuisine} value={cuisine}>{cuisine}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Диапазон цен</label>
                                            <div className="relative">
                                                <select
                                                    value={formData.price_range}
                                                    onChange={e => setFormData({ ...formData, price_range: e.target.value })}
                                                    className="w-full px-6 py-4 bg-slate-50/40 dark:bg-slate-800/40 rounded-2xl border-none font-bold text-xs outline-none focus:ring-4 ring-indigo-500/5 transition-all appearance-none"
                                                >
                                                    <option value="$">$ (Дешево)</option>
                                                    <option value="$$">$$ (Средне)</option>
                                                    <option value="$$$">$$$ (Дорого)</option>
                                                    <option value="$$$$">$$$$ (Люкс)</option>
                                                </select>
                                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Location */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 border-l-4 border-indigo-500 pl-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">Геопозиция и Адрес</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Страна</label>
                                                <input
                                                    type="text"
                                                    value={formData.country}
                                                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                                                    className="w-full px-6 py-4 bg-slate-50/40 dark:bg-slate-800/40 rounded-2xl border-none font-bold text-xs outline-none focus:ring-4 ring-indigo-500/5 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Город</label>
                                                <input
                                                    type="text"
                                                    value={formData.city}
                                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                    className="w-full px-6 py-4 bg-slate-50/40 dark:bg-slate-800/40 rounded-2xl border-none font-bold text-xs outline-none focus:ring-4 ring-indigo-500/5 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Полный адрес</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors w-4 h-4" />
                                                <input
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                    className="w-full pl-14 pr-6 py-4.5 bg-slate-50/40 dark:bg-slate-800/40 rounded-2xl border-none font-bold text-xs outline-none focus:ring-4 ring-indigo-500/5 transition-all"
                                                    placeholder="Улица, дом, район..."
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1 text-emerald-500/80">Широта (Lat)</label>
                                                <input
                                                    type="number"
                                                    step="0.000001"
                                                    value={formData.latitude}
                                                    onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                                                    className="w-full px-6 py-4 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border-none font-bold text-xs outline-none focus:ring-4 ring-emerald-500/10 transition-all font-mono"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1 text-emerald-500/80">Долгота (Lng)</label>
                                                <input
                                                    type="number"
                                                    step="0.000001"
                                                    value={formData.longitude}
                                                    onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                                                    className="w-full px-6 py-4 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border-none font-bold text-xs outline-none focus:ring-4 ring-emerald-500/10 transition-all font-mono"
                                                />
                                            </div>
                                        </div>

                                        {/* Mini Map */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Предпросмотр на карте</label>
                                            <div className="h-[220px] w-full rounded-[32px] border-4 border-slate-50 dark:border-slate-800/50 relative z-0 overflow-hidden shadow-inner">
                                                <MapContainer
                                                    center={[formData.latitude || 50.0647, formData.longitude || 19.9450]}
                                                    zoom={15}
                                                    style={{ height: '100%', width: '100%' }}
                                                >
                                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                    <LocationPicker
                                                        position={[formData.latitude, formData.longitude]}
                                                        onLocationSelect={(latlng) => setFormData({ ...formData, latitude: latlng.lat, longitude: latlng.lng })}
                                                    />
                                                </MapContainer>
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-[0.2em] italic mt-2 opacity-60">Кликните по карте, чтобы изменить координаты</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Contacts & Socials */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 border-l-4 border-indigo-500 pl-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">Контакты и Сети</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Сайт</label>
                                                <div className="relative group">
                                                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors w-4 h-4" />
                                                    <input
                                                        type="url"
                                                        value={formData.website}
                                                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                                                        className="w-full pl-14 pr-6 py-4.5 bg-slate-50/40 dark:bg-slate-800/40 rounded-2xl border-none font-bold text-xs outline-none focus:ring-4 ring-indigo-500/5 transition-all"
                                                        placeholder="Website URL"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Телефон</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors w-4 h-4" />
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full pl-14 pr-6 py-4.5 bg-slate-50/40 dark:bg-slate-800/40 rounded-2xl border-none font-bold text-xs outline-none focus:ring-4 ring-indigo-500/5 transition-all"
                                                        placeholder="Телефон"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em] ml-1">Забронировать столик (URL / API)</label>
                                            <div className="relative group">
                                                <CalendarCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:scale-110 transition-all w-4 h-4" />
                                                <input
                                                    type="url"
                                                    value={formData.booking_url}
                                                    onChange={e => setFormData({ ...formData, booking_url: e.target.value })}
                                                    className="w-full pl-14 pr-6 py-5 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-[28px] border-2 border-indigo-500/10 font-bold text-xs outline-none focus:ring-4 ring-indigo-500/20 transition-all text-indigo-900 dark:text-indigo-200"
                                                    placeholder="Ссылка на бронирование..."
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Instagram</label>
                                                <div className="relative group">
                                                    <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 text-pink-500 group-focus-within:scale-110 transition-all w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        value={formData.social_instagram}
                                                        onChange={e => setFormData({ ...formData, social_instagram: e.target.value })}
                                                        className="w-full pl-14 pr-6 py-4 bg-slate-50/40 dark:bg-slate-800/40 rounded-2xl border-none font-bold text-xs outline-none focus:ring-4 ring-pink-500/10 transition-all"
                                                        placeholder="@username"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Facebook</label>
                                                <div className="relative group">
                                                    <Facebook className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 group-focus-within:scale-110 transition-all w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        value={formData.social_facebook}
                                                        onChange={e => setFormData({ ...formData, social_facebook: e.target.value })}
                                                        className="w-full pl-14 pr-6 py-4 bg-slate-50/40 dark:bg-slate-800/40 rounded-2xl border-none font-bold text-xs outline-none focus:ring-4 ring-blue-500/10 transition-all"
                                                        placeholder="facebook.com/..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Media Gallery */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 border-l-4 border-indigo-500 pl-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">Медиа-галерея</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] ml-1">Фотографии ({formData.images.length})</label>

                                                <div className="grid grid-cols-4 gap-4">
                                                    {formData.images.map((img, idx) => (
                                                        <div key={idx} className={cn(
                                                            "relative aspect-square rounded-2xl overflow-hidden group border-2 transition-all",
                                                            formData.image_url === img ? "border-indigo-500 shadow-lg shadow-indigo-500/10" : "border-transparent"
                                                        )}>
                                                            <img src={img} alt="Location photo option" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => setFormData({ ...formData, image_url: img })}
                                                                    className="p-2 bg-indigo-500 text-white rounded-lg hover:scale-110 transition-transform"
                                                                >
                                                                    <Star size={12} fill={formData.image_url === img ? "white" : "none"} />
                                                                </button>
                                                                <button
                                                                    onClick={() => removeImage(idx)}
                                                                    className="p-2 bg-red-500 text-white rounded-lg hover:scale-110 transition-transform"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                            {formData.image_url === img && (
                                                                <div className="absolute top-2 left-2 bg-indigo-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-md">Main</div>
                                                            )}
                                                        </div>
                                                    ))}

                                                    <button
                                                        onClick={() => {
                                                            const url = prompt('Введите URL изображения:');
                                                            if (url) addImageUrl(url);
                                                        }}
                                                        className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-500 transition-all"
                                                    >
                                                        <Plus size={20} />
                                                        <span className="text-[8px] font-black uppercase mt-1">Добавить</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {/* Section: Content & AI */}
                                <div className="space-y-8 pb-10">
                                    <div className="flex items-center gap-3 border-l-4 border-indigo-500 pl-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">Описание и контент</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2.5">
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] ml-1">Описание</label>
                                                <button
                                                    className="flex items-center gap-1.5 text-indigo-500 text-[9px] font-black uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={handleAIEnhanceDescription}
                                                    disabled={isAiEnhancing || !formData?.description?.trim()}
                                                >
                                                    {isAiEnhancing ? (
                                                        <svg className="animate-spin w-3 h-3 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                                                    ) : (
                                                        <Sparkles size={12} />
                                                    )}
                                                    AI Улучшить
                                                </button>
                                            </div>
                                            <textarea
                                                rows={4}
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-6 py-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border-none font-medium text-[13px] leading-relaxed outline-none shadow-inner resize-y min-h-[120px] focus:ring-2 ring-indigo-500/10 transition-all font-sans"
                                            />
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] ml-1 text-orange-400">Insider Tip</label>
                                            <textarea
                                                rows={2}
                                                value={formData.insider_tip}
                                                onChange={e => setFormData({ ...formData, insider_tip: e.target.value })}
                                                className="w-full px-6 py-4 bg-orange-500/5 rounded-2xl border border-orange-500/10 font-medium text-[12px] leading-relaxed outline-none focus:ring-2 ring-orange-500/10 transition-all italic text-orange-900 dark:text-orange-200 resize-y min-h-[80px]"
                                                placeholder="Секреты, лучшие места, лайфхаки..."
                                            />
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] ml-1 text-emerald-500">Must Try</label>
                                            <textarea
                                                rows={2}
                                                value={formData.must_try}
                                                onChange={e => setFormData({ ...formData, must_try: e.target.value })}
                                                className="w-full px-6 py-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 font-bold text-xs outline-none focus:ring-2 ring-emerald-500/10 transition-all text-emerald-900 dark:text-emerald-200 resize-y min-h-[80px]"
                                                placeholder="Напр. Фирменный латте, Краковская паста"
                                            />
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] ml-1 text-indigo-400">AI Keywords (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={formData.ai_keywords}
                                                onChange={e => setFormData({ ...formData, ai_keywords: e.target.value })}
                                                className="w-full px-6 py-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 font-bold text-xs outline-none focus:ring-2 ring-indigo-500/10 transition-all text-indigo-900 dark:text-indigo-200"
                                                placeholder="romantic, cozy, date night, hidden gem..."
                                            />
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] ml-1">Теги (Tags)</label>
                                            <div className="flex flex-wrap gap-2 p-1">
                                                <div className="flex items-center gap-2 w-full">
                                                    <Tag size={14} className="text-slate-300" />
                                                    <input
                                                        type="text"
                                                        value={formData.tags.join(', ')}
                                                        onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                                                        className="flex-1 bg-transparent border-none outline-none font-bold text-xs text-slate-600 dark:text-slate-400"
                                                        placeholder="coffee, cozy, work, pizza..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Options */}
                                <div className="p-8 rounded-[40px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <Activity className="text-indigo-400" size={20} />
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Настройки публикации</h4>
                                        </div>

                                        <div className="flex flex-col gap-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Sparkles className="text-amber-400" size={16} />
                                                    <span className="text-[11px] font-bold uppercase tracking-widest">Hidden Gem</span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_hidden_gem}
                                                    onChange={e => setFormData({ ...formData, is_hidden_gem: e.target.checked })}
                                                    className="w-10 h-5 rounded-full appearance-none bg-slate-800 dark:bg-slate-200 checked:bg-indigo-500 relative transition-all cursor-pointer before:content-[''] before:absolute before:left-1 before:top-1 before:w-3 before:h-3 before:bg-white dark:before:bg-slate-900 before:rounded-full before:transition-all checked:before:translate-x-5"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Star className="text-indigo-400" size={16} />
                                                    <span className="text-[11px] font-bold uppercase tracking-widest">Featured (Рекомендуемое)</span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_featured}
                                                    onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                                                    className="w-10 h-5 rounded-full appearance-none bg-slate-800 dark:bg-slate-200 checked:bg-indigo-500 relative transition-all cursor-pointer before:content-[''] before:absolute before:left-1 before:top-1 before:w-3 before:h-3 before:bg-white dark:before:bg-slate-900 before:rounded-full before:transition-all checked:before:translate-x-5"
                                                />
                                            </div>
                                            {/* Status */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">Статус</span>
                                                <select
                                                    value={formData.status || 'Active'}
                                                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                                    className="bg-white/10 text-white text-[10px] font-bold uppercase rounded-xl px-3 py-1.5 border border-white/10 outline-none focus:ring-2 ring-indigo-500/30 cursor-pointer"
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Draft">Draft</option>
                                                    <option value="Revision">Revision</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Best Time & Special Labels */}
                                <div className="space-y-10 pb-10">
                                    <div className="flex items-center gap-3 border-l-4 border-indigo-500 pl-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">Метки и Особенности</h3>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Best Time to Visit */}
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] ml-1">Лучшее время для посещения</label>
                                            <div className="flex flex-wrap gap-3">
                                                {BEST_TIMES.map(time => {
                                                    const isSelected = formData.best_time?.includes(time.id);
                                                    return (
                                                        <button
                                                            key={time.id}
                                                            type="button"
                                                            onClick={() => {
                                                                const current = formData.best_time || [];
                                                                const next = isSelected
                                                                    ? current.filter(t => t !== time.id)
                                                                    : [...current, time.id];
                                                                setFormData({ ...formData, best_time: next });
                                                            }}
                                                            className={cn(
                                                                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                                                                isSelected
                                                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                                                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-indigo-500/30"
                                                            )}
                                                        >
                                                            <time.icon size={14} />
                                                            {time.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Specialized Labels */}
                                        <div className="space-y-8">
                                            {Object.entries(LABEL_GROUPS).map(([group, labels]) => (
                                                <div key={group} className="space-y-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-600">{group}</span>
                                                        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {labels.map(label => {
                                                            const isSelected = formData.special_labels?.includes(label);
                                                            return (
                                                                <button
                                                                    key={label}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const current = formData.special_labels || [];
                                                                        const next = isSelected
                                                                            ? current.filter(l => l !== label)
                                                                            : [...current, label];
                                                                        setFormData({ ...formData, special_labels: next });
                                                                    }}
                                                                    className={cn(
                                                                        "px-4 py-2 rounded-lg text-[10px] font-bold transition-all border",
                                                                        isSelected
                                                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md shadow-slate-900/10"
                                                                            : "bg-slate-50/50 dark:bg-slate-800/50 border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                                    )}
                                                                >
                                                                    {label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 lg:p-10 border-t border-slate-50 dark:border-slate-800/50 flex gap-4 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl relative z-10">
                                <button
                                    onClick={handleSave}
                                    disabled={!formData?.name?.trim()}
                                    className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[20px] lg:rounded-[24px] font-bold text-[10px] lg:text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-[0.97] transition-all hover:shadow-indigo-500/20 border-none outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {selectedLocation.id === 'NEW' ? 'Создать объект' : 'Сохранить изменения'}
                                </button>
                                <button onClick={() => setIsSlideOverOpen(false)} className="px-6 lg:px-10 py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-[20px] lg:rounded-[24px] font-bold text-[10px] lg:text-[11px] uppercase tracking-[0.2em] hover:text-slate-900 dark:hover:text-white transition-all border-none outline-none">Отмена</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Import Wizard Modal */}
            <AnimatePresence>
                {isImportWizardOpen && (
                    <ImportWizard
                        isOpen={isImportWizardOpen}
                        onClose={() => setIsImportWizardOpen(false)}
                        onImportComplete={() => {
                            setIsImportWizardOpen(false)
                            setToast({ message: '✓ Импорт завершён', type: 'success' })
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Toast notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 right-6 z-[200] px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl text-[11px] font-bold uppercase tracking-widest"
                    >
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminLocationsPage
