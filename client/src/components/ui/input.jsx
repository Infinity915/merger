import * as React from "react"
import { cn } from "@/lib/utils.js"

const Input = React.forwardRef(
  ({ 
    className, 
    type, 
    variant = 'default',
    size = 'default',
    icon,
    iconPosition = 'left',
    error = false,
    success = false,
    ...props 
  }, ref) => {
    return (
      <div className="relative">
        {/* Left icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          className={cn(
            // Base styles
            "flex w-full rounded-xl border bg-input-background text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            
            // Variants
            {
              'border-border hover:border-primary/50 focus-visible:border-primary': variant === 'default',
              'border-2 border-border hover:border-primary/50 focus-visible:border-primary': variant === 'outline',
              'border-transparent bg-muted hover:bg-muted/80 focus-visible:bg-background focus-visible:border-primary': variant === 'filled',
              'border-transparent bg-transparent hover:bg-muted/30 focus-visible:bg-muted/50 focus-visible:border-border': variant === 'ghost',
            },
            
            // Sizes
            {
              'h-8 px-3 py-1 text-xs': size === 'sm',
              'h-10 px-3 py-2': size === 'default',
              'h-12 px-4 py-3 text-base': size === 'lg',
            },
            
            // Icon padding
            icon && iconPosition === 'left' && 'pl-10',
            icon && iconPosition === 'right' && 'pr-10',
            
            // State colors
            error && 'border-destructive focus-visible:ring-destructive/50',
            success && 'border-green-500 focus-visible:ring-green-500/50',
            
            className
          )}
          ref={ref}
          {...props}
        />
        
        {/* Right icon */}
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        
        {/* Focus ring animation */}
        <div className="absolute inset-0 rounded-xl transition-all duration-200 pointer-events-none opacity-0 focus-within:opacity-100 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"></div>
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }