import React from 'react'
import { Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MobileHeader({ title = "GastroMap" }) {
    return (
        <header className="navbar sticky top-0 z-40 w-full border-b border-base-200 bg-base-100/80 backdrop-blur-lg">
            <div className="flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                    <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {title}
                    </span>
                </div>

                <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5" />
                </Button>
            </div>
        </header>
    )
}
