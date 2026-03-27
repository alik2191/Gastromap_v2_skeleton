import React from 'react'
import { Bell, MapPin, Heart, CheckCircle } from 'lucide-react'
import { useLocationsStore } from '@/features/public/hooks/useLocationsStore'
import { useFavoritesStore } from '@/features/dashboard/hooks/useFavoritesStore'
import { useTheme } from '@/hooks/useTheme'

const NotificationsPage = () => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const locations = useLocationsStore(s => s.locations)
    const { favoriteIds } = useFavoritesStore()

    const pendingCount = locations.filter(l => l.status === 'Pending').length
    const favoritesCount = favoriteIds.length

    const notifications = []

    if (pendingCount > 0) {
        notifications.push({
            id: 'pending-locations',
            icon: MapPin,
            color: 'text-amber-500 bg-amber-500/10',
            title: `${pendingCount} location${pendingCount > 1 ? 's' : ''} pending review`,
            desc: 'Your submitted places are awaiting moderation.',
        })
    }

    if (favoritesCount > 0) {
        notifications.push({
            id: 'favorites',
            icon: Heart,
            color: 'text-rose-500 bg-rose-500/10',
            title: `You have ${favoritesCount} saved place${favoritesCount > 1 ? 's' : ''}`,
            desc: 'Check your saved locations for updates and new reviews.',
        })
    }

    const textStyle = isDark ? 'text-white' : 'text-gray-900'
    const subTextStyle = isDark ? 'text-gray-400' : 'text-gray-500'
    const cardBg = isDark ? 'bg-[#1f2128]/80 border-white/5' : 'bg-white border-gray-100'

    return (
        <div className="w-full min-h-screen font-sans pb-32">
            <div className="pt-16 px-5">
                <div className="flex items-center gap-3 mb-8">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'}`}>
                        <Bell size={20} />
                    </div>
                    <h1 className={`text-2xl font-black ${textStyle}`}>Notifications</h1>
                </div>

                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                            <CheckCircle size={28} className={isDark ? 'text-white/30' : 'text-gray-300'} />
                        </div>
                        <p className={`text-base font-bold ${textStyle}`}>No new notifications</p>
                        <p className={`text-sm ${subTextStyle}`}>You're all caught up!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`flex items-start gap-4 p-4 rounded-2xl border ${cardBg}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                                    <n.icon size={18} />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${textStyle}`}>{n.title}</p>
                                    <p className={`text-xs mt-0.5 ${subTextStyle}`}>{n.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotificationsPage
