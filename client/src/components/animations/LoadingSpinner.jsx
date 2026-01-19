export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center glass backdrop-blur-xl z-50">
      <div className="relative">
        {/* Main spinner */}
        <div className="w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin windows1992:rounded-none"></div>
        
        {/* Secondary glow effect */}
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary/40 rounded-full animate-spin windows1992:rounded-none" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        
        {/* Inner pulse */}
        <div className="absolute inset-2 w-12 h-12 bg-primary/20 rounded-full animate-pulse windows1992:rounded-none"></div>
        
        {/* Floating particles */}
        <div className="absolute -inset-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full opacity-60 animate-bounce windows1992:rounded-none"
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Loading text */}
      <div className="absolute mt-32 text-center">
        <div className="text-lg font-medium text-foreground mb-2 shimmer windows1992:text-sm">Loading Platform...</div>
        <div className="text-sm text-muted-foreground windows1992:text-xs">Preparing your collaboration space</div>
      </div>
    </div>
  )
}