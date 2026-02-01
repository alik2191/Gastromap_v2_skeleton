import React from 'react'
import { motion } from 'framer-motion'

const variants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
        filter: 'blur(10px)'
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)'
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.98,
        filter: 'blur(10px)'
    }
}

const transition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 1
}

export const PageTransition = ({ children, className }) => {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={transition}
            className={className}
        >
            {children}
        </motion.div>
    )
}
