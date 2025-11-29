import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function BackButton({ label = 'Back', className = '', showIcon = true }) {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <motion.button
      onClick={handleBack}
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-tamu-maroon hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium ${className}`}
      aria-label={label}
    >
      {showIcon && (
        <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
      )}
      <span>{label}</span>
    </motion.button>
  )
}

