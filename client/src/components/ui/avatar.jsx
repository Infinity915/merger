import { forwardRef } from 'react'
import { cn, getInitials, getRandomGradient } from '@/lib/utils.js'

const Avatar = forwardRef(
  ({ 
    className, 
    size = 'default', 
    variant = 'default',
    status,
    name,
    src,
    fallback,
    children,
    ...props 
  }, ref) => {
    const initials = name ? getInitials(name) : fallback

    return (
      <div
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center font-medium text-foreground select-none overflow-hidden transition-all duration-200',
          
          // Sizes
          {
            'w-6 h-6 text-xs rounded-md': size === 'xs',
            'w-8 h-8 text-sm rounded-lg': size === 'sm',
            'w-10 h-10 text-sm rounded-xl': size === 'default',
            'w-12 h-12 text-base rounded-xl': size === 'lg',
            'w-16 h-16 text-lg rounded-2xl': size === 'xl',
            'w-20 h-20 text-xl rounded-2xl': size === 'xxl',
          },
          
          // Variants
          {
            'bg-muted hover:bg-muted/80 shadow-soft hover:shadow-medium': variant === 'default',
            'bg-gradient-to-br from-primary via-purple-600 to-pink-600 text-white shadow-md hover:shadow-lg hover:shadow-primary/30 hover:scale-105': variant === 'gradient',
            'bg-background border-2 border-primary shadow-md hover:shadow-lg hover:border-primary/80': variant === 'ring',
            'bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg hover:shadow-xl hover:shadow-primary/40 hover:scale-105': variant === 'glow',
          },
          
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Avatar content */}
        {src ? (
          <img 
            src={src} 
            alt={name || 'Avatar'} 
            className="w-full h-full object-cover"
          />
        ) : children ? (
          children
        ) : (
          <span className="font-semibold">
            {initials || '?'}
          </span>
        )}
        
        {/* Status indicator */}
        {status && (
          <div className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center">
            <div className={cn(
              'rounded-full border-2 border-background',
              {
                'w-3 h-3': size === 'xs' || size === 'sm',
                'w-3.5 h-3.5': size === 'default' || size === 'lg',
                'w-4 h-4': size === 'xl' || size === 'xxl',
              },
              {
                'bg-green-500 animate-pulse': status === 'online',
                'bg-yellow-500': status === 'away',
                'bg-red-500': status === 'busy',
                'bg-gray-400': status === 'offline',
              }
            )} />
          </div>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

// AvatarImage component for compatibility with existing code
const AvatarImage = forwardRef(
  ({ className, src, alt, ...props }, ref) => (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn('w-full h-full object-cover rounded-inherit', className)}
      {...props}
    />
  )
)

AvatarImage.displayName = 'AvatarImage'

// AvatarFallback component for compatibility with existing code
const AvatarFallback = forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-center w-full h-full bg-muted text-muted-foreground font-medium text-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)

AvatarFallback.displayName = 'AvatarFallback'

// Avatar Group for displaying multiple avatars
const AvatarGroup = forwardRef(
  ({ className, limit = 5, spacing = 'normal', size = 'default', children, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children)
    const displayChildren = limit ? childrenArray.slice(0, limit) : childrenArray
    const hiddenCount = limit ? Math.max(0, childrenArray.length - limit) : 0

    return (
      <div
        className={cn(
          'flex items-center',
          {
            '-space-x-1': spacing === 'tight',
            '-space-x-2': spacing === 'normal',
            '-space-x-3': spacing === 'loose',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {displayChildren.map((child, index) => (
          <div
            key={index}
            className="relative border-2 border-background rounded-full transition-transform duration-200 hover:scale-110 hover:z-10"
            style={{ zIndex: displayChildren.length - index }}
          >
            {React.cloneElement(child, { size })}
          </div>
        ))}
        
        {hiddenCount > 0 && (
          <div
            className={cn(
              'relative border-2 border-background rounded-full bg-muted text-muted-foreground flex items-center justify-center font-medium transition-all duration-200 hover:scale-110 hover:bg-muted/80 cursor-pointer',
              {
                'w-6 h-6 text-xs rounded-md': size === 'xs',
                'w-8 h-8 text-sm rounded-lg': size === 'sm',
                'w-10 h-10 text-sm rounded-xl': size === 'default',
                'w-12 h-12 text-base rounded-xl': size === 'lg',
                'w-16 h-16 text-lg rounded-2xl': size === 'xl',
                'w-20 h-20 text-xl rounded-2xl': size === 'xxl',
              }
            )}
            title={`+${hiddenCount} more`}
          >
            +{hiddenCount}
          </div>
        )}
      </div>
    )
  }
)

AvatarGroup.displayName = 'AvatarGroup'

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup }