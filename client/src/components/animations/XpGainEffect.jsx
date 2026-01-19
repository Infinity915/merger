import { useEffect } from 'react'

export default function XPGainEffect({ amount, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 600)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed top-20 right-8 z-50 pointer-events-none">
      <div className="xp-gain text-xl font-bold text-green-400 drop-shadow-lg windows1992:text-sm windows1992:text-green-600">
        +{amount} XP
      </div>
    </div>
  )
}