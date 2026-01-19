import { forwardRef } from 'react'
import { cn } from '@/lib/utils.js'

const Card = forwardRef(
  ({ className, variant = 'glass', hover = true, interactive = false, glow = false, tilt = false, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          // Base styles with enhanced effects
          'rounded-2xl border transition-all duration-500 relative overflow-hidden group',
          
          // Variants with glassmorphism
          {
            // Default - Simple card
            'bg-card text-card-foreground border-border shadow-soft': variant === 'default',
            
            // Elevated - Higher shadow
            'bg-card text-card-foreground border-border shadow-large': variant === 'elevated',
            
            // Outlined - Emphasis on border
            'bg-card text-card-foreground border-2 border-border shadow-soft': variant === 'outlined',
            
            // Glass - Primary glassmorphism effect
            'glass text-card-foreground border-glass-border shadow-glass backdrop-blur-xl': variant === 'glass',
            
            // Gradient - Subtle gradient background
            'bg-gradient-to-br from-card via-card/95 to-card/90 text-card-foreground border-glass-border shadow-glass': variant === 'gradient',
            
            // Neon - Cyber theme special
            'glass text-card-foreground border-glass-border shadow-neon cyber:border-cyan-500/30': variant === 'neon',
            
            // Floating - Card that appears to float
            'glass text-card-foreground border-glass-border shadow-glass-lg float': variant === 'floating',
          },
          
          // Hover effects
          hover && !interactive && 'hover:shadow-glass-lg hover:-translate-y-2 hover:scale-[1.02]',
          
          // Interactive effects (more pronounced for clickable cards)
          interactive && 'cursor-pointer hover:shadow-glass-lg hover:-translate-y-3 hover:scale-[1.03] press-effect',
          
          // Glow effect
          glow && 'shadow-glow hover:shadow-xl hover:shadow-primary/40',
          
          // Tilt effect
          tilt && 'tilt-hover',
          
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Top border highlight with animation */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
        
        {/* Background pattern for special variants */}
        {variant === 'glass' && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
        )}
        
        {variant === 'neon' && (
          <>
            {/* Cyber grid pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40 animate-bounce"
                  style={{
                    left: `${10 + i * 40}%`,
                    top: `${20 + (i % 2) * 60}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '3s'
                  }}
                />
              ))}
            </div>
          </>
        )}
        
        {variant === 'floating' && (
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)

Card.displayName = 'Card'

const CardHeader = forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-2 p-6', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-bold leading-none tracking-tight text-lg gradient-text', className)}
      {...props}
    >
      {children}
    </h3>
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground leading-relaxed', className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }