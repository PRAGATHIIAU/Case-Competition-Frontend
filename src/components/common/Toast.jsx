import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, X, AlertCircle } from 'lucide-react'

export default function Toast({ message, isVisible, onClose, type = 'success' }) {
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          icon: <CheckCircle2 className="w-6 h-6" />
        }
      case 'error':
        return {
          bg: 'bg-red-500',
          icon: <AlertCircle className="w-6 h-6" />
        }
      default:
        return {
          bg: 'bg-blue-500',
          icon: <CheckCircle2 className="w-6 h-6" />
        }
    }
  }

  const styles = getToastStyles()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed top-4 left-1/2 z-50"
        >
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${styles.bg} text-white`}>
            {styles.icon}
            <span className="font-medium">{message}</span>
            <button
              onClick={onClose}
              className="ml-2 hover:opacity-80 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

