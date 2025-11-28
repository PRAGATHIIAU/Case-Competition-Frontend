import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, CheckCircle2, CalendarPlus } from 'lucide-react'
import Confetti from '../common/Confetti'
import Toast from '../common/Toast'

export default function EventCard({ event, onRSVP }) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleRSVPClick = () => {
    if (!event.registered) {
      // Show confetti and toast when registering
      setShowConfetti(true)
      setShowToast(true)
      onRSVP(event.id)
      
      // Auto-hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000)
    } else {
      onRSVP(event.id)
    }
  }

  return (
    <>
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      <Toast
        message="Successfully registered! 🎉"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-xl font-semibold text-gray-800">{event.title}</h4>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-tamu-maroon/10 text-tamu-maroon">
              {event.type}
            </span>
          </div>
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRSVPClick}
          className={`ml-4 px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            event.registered
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-tamu-maroon text-white hover:bg-tamu-maroon-light'
          }`}
        >
          {event.registered ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Registered
            </>
          ) : (
            <>
              <CalendarPlus className="w-5 h-5" />
              RSVP
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
    </>
  )
}

