import { useEffect } from 'react'

export default function LevelUpEffect({ newLevel, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="level-up text-center">
        <div className="text-6xl font-bold gradient-text mb-4 windows1992:text-2xl windows1992:text-primary">LEVEL UP!</div>
        <div className="text-2xl text-foreground windows1992:text-lg">Level {newLevel}</div>
        <div className="w-64 h-2 bg-muted rounded-full mt-4 overflow-hidden windows1992:rounded-none windows1992:border-2 windows1992:border-inset">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 progress-fill rounded-full windows1992:bg-primary windows1992:rounded-none"></div>
        </div>
      </div>
    </div>
  )
}