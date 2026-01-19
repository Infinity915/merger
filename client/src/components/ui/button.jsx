import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center whitespace-nowrap rounded-2xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group press-effect hover-lift',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-primary via-primary to-purple-600 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/30 hover:scale-105 hover:from-primary/90 hover:to-purple-600/90',
        gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700',
        glass: 'glass text-foreground hover:shadow-glass-lg hover:scale-105 border border-glass-border backdrop-blur-xl',
        neon: 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-neon hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-105 cyber:animate-pulse',
        destructive: 'bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/30 hover:scale-105',
        outline: 'border-2 border-border glass text-foreground hover:bg-glass-bg hover:text-accent-foreground hover:border-primary/50 hover:shadow-glass hover:scale-105',
        secondary: 'glass-subtle text-secondary-foreground hover:shadow-glass hover:scale-105',
        ghost: 'text-foreground hover:bg-glass-subtle hover:text-accent-foreground hover:shadow-sm hover:scale-105',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80 hover:scale-105',
      },
      size: {
        sm: 'h-10 px-5 py-2 text-sm',
        default: 'h-12 px-8 py-3',
        lg: 'h-14 px-10 py-4 text-lg',
        xl: 'h-16 px-12 py-5 text-xl',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, loading = false, glow = false, children, ...props }, ref) => {
  if (asChild) {
    return (
      <Slot
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Slot>
    )
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size, className }), {
        'shadow-glow hover:shadow-xl hover:shadow-primary/60 animate-pulse': glow,
        'cursor-not-allowed opacity-70': loading,
      })}
      ref={ref}
      disabled={loading || props.disabled}
      {...props}
    >
      {/* Enhanced shine effect for gradient buttons */}
      {(variant === 'default' || variant === 'gradient' || variant === 'neon') && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
        </div>
      )}

      {/* Glass shimmer effect */}
      {(variant === 'glass' || variant === 'outline' || variant === 'secondary') && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
        </div>
      )}

      {/* Ripple effect container */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/10 scale-0 group-active:scale-100 transition-transform duration-200 rounded-full origin-center"></div>
      </div>

      {/* Floating particles for special variants */}
      {variant === 'neon' && (
        <div className="absolute -inset-2 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-bounce"
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + (i % 2) * 80}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}

      {/* Content with enhanced loading state */}
      <div className="relative flex items-center space-x-2 z-10">
        {loading && (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin">
            <div className="absolute inset-0 border-2 border-transparent border-t-current/40 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
          </div>
        )}
        {children}
      </div>

      {/* Level up effect for special interactions */}
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
      )}
    </button>
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }