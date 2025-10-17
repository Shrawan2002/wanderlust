'use client'

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoaderProps {
  message?: string
  className?: string
}

export function Loader({ message = "Loading...", className }: LoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full min-h-[calc(100vh-5rem)]", // subtract ~header height
        "bg-gradient-to-br from-background via-background/70 to-muted/40 backdrop-blur-sm",
        "transition-all duration-300",
        className
      )}
    >
      {/* Subtle fade-in for loader container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        {/* Animated spinner with gradient ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="relative h-16 w-16"
        >
          {/* Gradient ring background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-indigo-500 blur-sm opacity-75" />
          {/* Core spinner icon */}
          <Loader2 className="absolute inset-0 h-16 w-16 text-primary drop-shadow-md" strokeWidth={2.5} />
        </motion.div>

        {/* Message with breathing pulse animation */}
        <motion.p
          className="text-base font-medium text-muted-foreground tracking-wide"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  )
}
