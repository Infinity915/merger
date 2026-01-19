import { THEME_DISPLAY_NAMES, THEME_DESCRIPTIONS } from '@/lib/theme.js'

export default function FloatingThemeSwitcher({ theme, onToggleTheme }) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="glass rounded-full p-2 shadow-glass hover:shadow-glass-lg transition-all duration-300 group hover-lift windows1992:rounded-none windows1992:p-1 windows1992:border-2 windows1992:border-outset">
        <button
          onClick={onToggleTheme}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary via-primary to-purple-600 text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 press-effect shadow-lg hover:shadow-neon group relative overflow-hidden windows1992:rounded-none windows1992:bg-primary windows1992:border-2 windows1992:border-outset windows1992:w-12 windows1992:h-8"
          title={`Current: ${THEME_DISPLAY_NAMES[theme]} (click to cycle)`}
        >
          {/* Button shine effect (not in windows1992) */}
          {theme !== 'windows1992' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          )}
          
          <span className="text-xl relative z-10 windows1992:text-sm">
            {theme === 'light' && '☀️'}
            {theme === 'windows1992' && '🖥️'}
            {theme === 'cyber' && '🔮'}
          </span>
        </button>
        
        {/* Enhanced tooltip */}
        <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
          <div className="glass-strong rounded-xl px-4 py-3 shadow-glass text-sm whitespace-nowrap windows1992:rounded-none windows1992:border-2 windows1992:border-outset windows1992:text-xs">
            <div className="font-semibold text-foreground">{THEME_DISPLAY_NAMES[theme]}</div>
            <div className="text-xs text-muted-foreground mt-1">{THEME_DESCRIPTIONS[theme]}</div>
            <div className="text-xs text-primary mt-1 font-medium">Click to cycle themes</div>
            
            {/* Tooltip arrow */}
            {theme !== 'windows1992' && (
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-card"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}