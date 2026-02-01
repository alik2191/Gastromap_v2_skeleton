import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const GlassButton = React.forwardRef(({ className, variant = "primary", children, ...props }, ref) => {
    return (
        <Button
            ref={ref}
            className={cn(
                "relative overflow-hidden transition-all duration-300 rounded-full font-medium",
                // Primary: Clean Gradient
                variant === 'primary' && "bg-black text-white hover:bg-black/80 shadow-lg shadow-black/20 border-0",
                // Glass: Frosted look
                variant === 'glass' && "bg-white/50 backdrop-blur-md text-foreground border border-black/5 hover:bg-white/80",
                // Outline: Clean thin border
                variant === 'outline' && "bg-transparent border border-black/10 text-foreground hover:bg-black/5",
                className
            )}
            {...props}
        >
            {children}
        </Button>
    )
})
GlassButton.displayName = "GlassButton"

export { GlassButton }
