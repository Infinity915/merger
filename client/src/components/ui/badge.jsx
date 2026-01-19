import { forwardRef } from 'react'
import { cn } from '@/lib/utils.js'

const Badge = forwardRef(
  ({ className, variant = 'glass', size = 'default', interactive = false, pulse = false, dot = false, earned = false, level, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          // Base styles with enhanced animations
          'inline-flex items-center font-semibold transition-all duration-300 select-none relative overflow-hidden group',

          // Sizes with better proportions
          {
            'px-3 py-1.5 text-xs rounded-xl': size === 'sm',
            'px-4 py-2 text-sm rounded-xl': size === 'default',
            'px-5 py-2.5 text-base rounded-2xl': size === 'lg',
          },

          // Variants with glassmorphism
          {
            // Default - Primary gradient
            'bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/30': variant === 'default',

            // Secondary - Subtle glass
            'glass-subtle text-secondary-foreground hover:shadow-glass': variant === 'secondary',

            // Destructive - Danger styling
            'bg-destructive text-destructive-foreground shadow-md hover:shadow-lg hover:shadow-destructive/30': variant === 'destructive',

            // Outline - Glass border
            'border-2 border-glass-border glass text-foreground hover:shadow-glass hover:bg-glass-bg': variant === 'outline',

            // Success - Green glass
            'glass text-green-700 border border-green-200/50 bg-green-100/30 hover:bg-green-200/40 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/50': variant === 'success',

            // Warning - Yellow glass
            'glass text-yellow-700 border border-yellow-200/50 bg-yellow-100/30 hover:bg-yellow-200/40 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700/50': variant === 'warning',

            // Info - Blue glass
            'glass text-blue-700 border border-blue-200/50 bg-blue-100/30 hover:bg-blue-200/40 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700/50': variant === 'info',

            // Gradient - Multi-color gradient
            'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/40 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600': variant === 'gradient',

            // Glass - Primary glassmorphism
            'glass text-foreground border border-glass-border hover:shadow-glass-lg': variant === 'glass',

            // Neon - Cyber theme special
            'glass text-cyan-400 border border-cyan-500/30 shadow-neon hover:shadow-xl hover:shadow-cyan-500/40 cyber:animate-pulse': variant === 'neon',
          },

          // Interactive styles
          interactive && 'cursor-pointer hover:scale-110 press-effect hover-lift',

          // Pulse animation
          pulse && 'animate-pulse',

          // Earned badge special effects
          earned && 'badge-earn shadow-glow',

          className
        )}
        ref={ref}
        {...props}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>

        {/* Level indicator for leveled badges */}
        {level && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
            {level}
          </div>
        )}

        {/* Dot indicator with enhanced styling */}
        {dot && (
          <div className={cn(
            'w-2.5 h-2.5 rounded-full mr-2 relative',
            {
              'bg-primary-foreground': variant === 'default',
              'bg-secondary-foreground': variant === 'secondary',
              'bg-destructive-foreground': variant === 'destructive',
              'bg-slate-200': variant === 'outline',
              'bg-green-600 dark:bg-green-400': variant === 'success',
              'bg-yellow-600 dark:bg-yellow-400': variant === 'warning',
              'bg-blue-600 dark:bg-blue-400': variant === 'info',
              'bg-white': variant === 'gradient',
              'bg-foreground': variant === 'glass',
              'bg-cyan-400 shadow-neon': variant === 'neon',
            }
          )}>
            {/* Pulse effect for dot */}
            <div className="absolute inset-0 rounded-full bg-current animate-ping opacity-30"></div>
          </div>
        )}

        {/* Content with enhanced styling */}
        <span className="relative z-10 flex items-center space-x-1">
          {children}
        </span>

        {/* Special effects for different variants */}
        {variant === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out opacity-0 hover:opacity-100 rounded-xl"></div>
        )}

        {variant === 'neon' && (
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        )}

        {earned && (
          <>
            {/* Sparkle effects for earned badges */}
            <div className="absolute -inset-2 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60 animate-bounce"
                  style={{
                    left: `${10 + i * 15}%`,
                    top: `${10 + (i % 2) * 80}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-xl blur opacity-50 animate-pulse -z-10"></div>
          </>
        )}
      </div>
    )
  }
)

Badge.displayName = 'Badge'

// Enhanced Badge Group with better spacing and effects
const BadgeGroup = forwardRef(
  ({ className, spacing = 'normal', wrap = true, animated = false, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'inline-flex items-center',
          {
            'gap-2': spacing === 'tight',
            'gap-3': spacing === 'normal',
            'gap-4': spacing === 'loose',
            'flex-wrap': wrap,
            'flex-nowrap': !wrap,
          },
          animated && 'animate-in',
          className
        )}
        ref={ref}
        {...props}
      >
        {animated
          ? React.Children.map(children, (child, index) => (
            <div
              key={index}
              className="animate-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {child}
            </div>
          ))
          : children
        }
      </div>
    )
  }
)

BadgeGroup.displayName = 'BadgeGroup'

// Enhanced Counter Badge with glassmorphism
const CounterBadge = forwardRef(
  ({ count, max = 99, showZero = false, ...props }, ref) => {
    if (count === 0 && !showZero) return null

    const displayCount = count > max ? `${max}+` : count.toString()

    return (
      <Badge
        ref={ref}
        size="sm"
        variant="destructive"
        className="min-w-6 h-6 px-2 py-0 text-xs font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-110 press-effect"
        pulse={count > 0}
        {...props}
      >
        {displayCount}
      </Badge>
    )
  }
)

CounterBadge.displayName = 'CounterBadge'

// Progress Badge for showing completion status
const ProgressBadge = forwardRef(
  ({ progress, label, className, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        variant="glass"
        className={cn('px-4 py-2 space-x-2', className)}
        {...props}
      >
        <span className="text-xs">{label}</span>
        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-1000 ease-out progress-fill"
            style={{ '--progress-width': `${progress}%` }}
          />
        </div>
        <span className="text-xs font-bold">{progress}%</span>
      </Badge>
    )
  }
)

ProgressBadge.displayName = 'ProgressBadge'

export { Badge, BadgeGroup, CounterBadge, ProgressBadge }