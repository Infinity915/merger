import * as React from "react"
import { cn } from "@/lib/utils.js"

const Textarea = React.forwardRef(
  ({ 
    className, 
    variant = 'default',
    size = 'default',
    error = false,
    success = false,
    resize = true,
    ...props 
  }, ref) => {
    return (
      <div className="relative">
        <textarea
          className={cn(
            // Base styles
            "flex w-full rounded-xl border bg-input-background text-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            
            // Variants
            {
              'border-border hover:border-primary/50 focus-visible:border-primary': variant === 'default',
              'border-2 border-border hover:border-primary/50 focus-visible:border-primary': variant === 'outline',
              'border-transparent bg-muted hover:bg-muted/80 focus-visible:bg-background focus-visible:border-primary': variant === 'filled',
              'border-transparent bg-transparent hover:bg-muted/30 focus-visible:bg-muted/50 focus-visible:border-border': variant === 'ghost',
            },
            
            // Sizes
            {
              'min-h-[60px] px-3 py-2 text-xs': size === 'sm',
              'min-h-[80px] px-3 py-2': size === 'default',
              'min-h-[100px] px-4 py-3 text-base': size === 'lg',
            },
            
            // Resize behavior
            resize ? 'resize-y' : 'resize-none',
            
            // State colors
            error && 'border-destructive focus-visible:ring-destructive/50',
            success && 'border-green-500 focus-visible:ring-green-500/50',
            
            className
          )}
          ref={ref}
          {...props}
        />
        
        {/* Focus ring animation */}
        <div className="absolute inset-0 rounded-xl transition-all duration-200 pointer-events-none opacity-0 focus-within:opacity-100 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"></div>
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }