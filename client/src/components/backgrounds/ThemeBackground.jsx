export default function ThemeBackground({ theme }) {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Base gradient background */}
      <div className="absolute inset-0" style={{ background: 'var(--background)' }}></div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0" style={{ backgroundImage: 'var(--background-pattern)' }}></div>
      
      {/* Theme-specific animated elements */}
      {theme === 'cyber' && <CyberBackground />}
      {theme === 'windows1992' && <Windows1992Background />}
    </div>
  )
}

function CyberBackground() {
  return (
    <>
      {/* Cyber grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      {/* Floating orbs */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-2xl opacity-20 float"
          style={{
            width: '300px',
            height: '300px',
            background: i % 2 === 0 ? 'radial-gradient(circle, #00ffff, transparent)' : 
                       'radial-gradient(circle, #ff00ff, transparent)',
            left: `${10 + i * 25}%`,
            top: `${5 + i * 30}%`,
            animationDelay: `${i * 2}s`,
            animationDuration: '8s'
          }}
        />
      ))}
    </>
  )
}

function Windows1992Background() {
  return (
    <>
      {/* Windows 95 style desktop pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #c0c0c0 0px, #c0c0c0 2px, #808080 2px, #808080 4px)',
          backgroundSize: '8px 8px'
        }}></div>
      </div>
      {/* Retro floating windows */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute opacity-10 pointer-events-none"
          style={{
            width: '120px',
            height: '80px',
            left: `${20 + i * 30}%`,
            top: `${10 + i * 25}%`,
            border: '2px outset #c0c0c0',
            background: '#c0c0c0',
            animation: 'float 4s ease-in-out infinite',
            animationDelay: `${i * 1.5}s`
          }}
        >
          <div className="window-header bg-blue-800 text-white px-2 py-1 text-xs">
            Window {i + 1}
          </div>
        </div>
      ))}
    </>
  )
}