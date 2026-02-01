import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const GlassCard = React.forwardRef(({ className, children, hoverEffect = true, ...props }, ref) => {
    const Component = props.onClick ? motion.div : 'div'

    return (
        <Component
            ref={ref}
            className={cn(
                "bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl relative overflow-hidden",
                hoverEffect && "hover:bg-white/80 hover:shadow-md cursor-pointer transition-all duration-300",
                className
            )}
            whileHover={props.onClick && hoverEffect ? { y: -4 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            {...props}
        >
            {/* Subtle shine for light mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {children}
        </Component>
    )
})
GlassCard.displayName = "GlassCard"

export { GlassCard }
