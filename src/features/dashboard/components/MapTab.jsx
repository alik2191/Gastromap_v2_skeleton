import React, { useEffect } from 'react'
import { Navigation as NavIcon } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useTheme } from '@/hooks/useTheme'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { useLocationsStore } from '../../public/hooks/useLocationsStore'

// Fix for default Leaflet markers not showing in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map resize and theme updates
const MapUpdater = ({ theme }) => {
    const map = useMap()
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize()
        }, 300)
    }, [map])
    return null
}


// Sub-component to handle map interactions like FlyTo
const LocationController = ({ userPos, trigger }) => {
    const map = useMap()
    useEffect(() => {
        if (userPos && trigger) {
            map.flyTo(userPos, 15, { duration: 1.5 })
        }
    }, [userPos, trigger, map])
    return null
}

const MapTab = ({ activeFilter = 'All' }) => {
    const { theme } = useTheme()
    const { locations, filteredLocations: storeFiltered } = useLocationsStore()
    const [userPos, setUserPos] = React.useState(null)
    const [locateTrigger, setLocateTrigger] = React.useState(0)

    // Get User Location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserPos([pos.coords.latitude, pos.coords.longitude])
                },
                (err) => console.log(err),
                { enableHighAccuracy: true }
            )
        }
    }, [])

    const handleLocateMe = () => {
        if (userPos) {
            setLocateTrigger(prev => prev + 1)
        } else {
            // Retry fetching if not yet found
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserPos([pos.coords.latitude, pos.coords.longitude])
                    setLocateTrigger(prev => prev + 1)
                }
            )
        }
    }

    // Default center (Krakow) or User Pos
    const defaultCenter = [50.0614, 19.9366]

    // Custom Tile Layers for Light/Dark modes
    const lightTiles = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
    const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"

    // Apply Filter (respecting activeFilter prop if provided, else using store)
    const displayLocations = activeFilter === 'All'
        ? storeFiltered
        : storeFiltered.filter(loc => loc.category === activeFilter)

    // Pulsing User Marker Icon
    const userIcon = L.divIcon({
        className: 'user-marker-icon',
        html: `<div class="relative w-4 h-4">
                 <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                 <div class="absolute inset-0 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
               </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    return (
        <div className="w-full h-[600px] rounded-[32px] overflow-hidden shadow-xl border border-white/20 relative z-0 group">

            {/* Locate Me Floating Button */}
            {/* Locate Me Floating Button */}
            <button
                onClick={handleLocateMe}
                className={`
                    absolute top-1/2 -translate-y-1/2 right-4 md:top-4 md:right-4 md:translate-y-0 z-[500] 
                    p-2.5 rounded-full shadow-lg backdrop-blur-md border transition-all active:scale-95
                    ${theme === 'dark'
                        ? 'bg-black/50 border-white/20 text-white hover:bg-black/70'
                        : 'bg-white/90 border-white/50 text-blue-600 hover:bg-white'}
                `}
                title="Show my location"
            >
                <NavIcon size={20} className={userPos ? (theme === 'dark' ? "fill-white/80" : "fill-blue-600") : ""} />
            </button>

            <MapContainer
                center={defaultCenter}
                zoom={14}
                scrollWheelZoom={true}
                zoomControl={false}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <ZoomControl position="bottomright" />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url={theme === 'dark' ? darkTiles : lightTiles}
                />
                <MapUpdater theme={theme} />
                <LocationController userPos={userPos} trigger={locateTrigger} />

                {/* User Location Marker */}
                {userPos && (
                    <Marker position={userPos} icon={userIcon}>
                        <Popup className="custom-popup" closeButton={false}>
                            <div className="px-2 py-1 text-xs font-bold text-center">
                                You are here 📍
                            </div>
                        </Popup>
                    </Marker>
                )}

                {displayLocations.map((loc) => {
                    if (!loc.coordinates) return null;
                    return (
                        <Marker
                            key={loc.id}
                            position={[loc.coordinates.lat, loc.coordinates.lng]}
                            icon={L.divIcon({
                                className: 'custom-icon',
                                html: `<div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-lg transform hover:scale-110 transition-transform ${loc.category === 'Cafe' ? 'bg-orange-400' :
                                    loc.category === 'Dining' ? 'bg-blue-500' : 'bg-purple-500'
                                    }">
                                    ${loc.category === 'Cafe' ? '☕' : loc.category === 'Dining' ? '🍽️' : '🍸'}
                                </div>`,
                                iconSize: [32, 32],
                                iconAnchor: [16, 16],
                                popupAnchor: [0, -20]
                            })}
                        >
                            <Popup className="custom-popup" closeButton={false}>
                                <div className="w-48 p-1">
                                    <div className="h-24 rounded-t-xl overflow-hidden relative mb-2">
                                        <img src={loc.image} alt={loc.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-1 right-1 bg-white/90 px-1.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                                            <Star size={8} className="text-yellow-500 fill-yellow-500" /> {loc.rating}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{loc.title}</h3>
                                    <div className="flex justify-between items-center text-[10px] text-gray-500 mb-2">
                                        <span>{loc.category}</span>
                                        <span>{loc.price}</span>
                                    </div>
                                    <Link to={`/location/${loc.id}`} className="btn btn-xs btn-primary w-full text-white">View</Link>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    )
}

export default MapTab
