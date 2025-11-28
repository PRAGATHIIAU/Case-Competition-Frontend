import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Confetti({ onComplete }) {
  const confettiColors = ['#500000', '#700000', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            left: `${Math.random() * 100}%`,
            top: '-10px',
          }}
          initial={{ y: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            rotate: 360,
            opacity: 0,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            delay: Math.random() * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

