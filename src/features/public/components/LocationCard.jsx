import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { useFavoritesStore } from '@/features/dashboard/hooks/useFavoritesStore'
import { cn } from '@/lib/utils'

export default function LocationCard({ location }) {
    const navigate = useNavigate()
    const { isFavorite, toggleFavorite } = useFavoritesStore()
    const isFav = isFavorite(location.id)

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={location.image}
                    alt={location.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("bg-background/80 backdrop-blur-sm hover:bg-background/90 rounded-full", isFav && "text-red-500 hover:text-red-600")}
                        onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(location.id)
                        }}
                    >
                        <Heart className={cn("h-5 w-5", isFav && "fill-current")} />
                    </Button>
                </div>
                <Badge className="absolute top-2 left-2 bg-background/80 text-foreground backdrop-blur-sm border-none">
                    {location.category}
                </Badge>
            </div>

            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                        {location.title}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium text-foreground">{location.rating}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{location.address}</span>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 flex-1" onClick={() => navigate(`/location/${location.id}`)}>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {location.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                    {location.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-[10px] h-5 px-1.5">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto">
                <Link to={`/location/${location.id}`} className="w-full">
                    <Button className="w-full" size="sm" variant="secondary">
                        View Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
