import { THEME_DISPLAY_NAMES, THEME_DESCRIPTIONS } from '@/lib/theme.js'

export default function TransitionOverlay({ theme }) {
  return (
    <div className="fixed inset-0 glass backdrop-blur-xl z-50 transition-all duration-500">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-6 windows1992:rounded-none windows1992:border-2"></div>
          <div className="text-xl font-medium text-foreground mb-2 gradient-text animate-pulse windows1992:text-primary windows1992:text-sm">
            Switching to {THEME_DISPLAY_NAMES[theme]}
          </div>
          <div className="text-sm text-muted-foreground windows1992:text-xs">
            {THEME_DESCRIPTIONS[theme]}
          </div>
        </div>
        
        {/* Transition particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full opacity-60 animate-bounce windows1992:rounded-none"
              style={{
                left: `${10 + (i * 7)}%`,
                top: `${20 + (i % 3) * 30}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}