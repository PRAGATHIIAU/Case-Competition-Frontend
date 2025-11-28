import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  MapPin, 
  User, 
  CheckCircle2, 
  CalendarPlus,
  Key,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'

export default function LectureDetails({ lectureId }) {
  const { currentUser, getLectureById, rsvpToLecture, checkInToLecture } = useMockData()
  
  const [lecture, setLecture] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isRSVPing, setIsRSVPing] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [checkInCode, setCheckInCode] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  useEffect(() => {
    loadLecture()
  }, [lectureId])

  const loadLecture = () => {
    setLoading(true)
    setTimeout(() => {
      const foundLecture = getLectureById(lectureId)
      setLecture(foundLecture)
      setLoading(false)
    }, 300)
  }

  const handleRSVP = async () => {
    setIsRSVPing(true)
    try {
      const result = await rsvpToLecture(lectureId, currentUser.id)
      if (result.success) {
        loadLecture() // Refresh lecture data
        setToastMessage(
          result.rsvpStatus === 'added' 
            ? 'Successfully RSVP\'d! 🎉' 
            : 'RSVP removed'
        )
        setToastType('success')
        setShowToast(true)
      }
    } catch (error) {
      setToastMessage(error.message || 'Failed to RSVP')
      setToastType('error')
      setShowToast(true)
    } finally {
      setIsRSVPing(false)
    }
  }

  const handleCheckIn = async (e) => {
    e.preventDefault()
    if (!checkInCode.trim()) {
      setToastMessage('Please enter a check-in code')
      setToastType('error')
      setShowToast(true)
      return
    }

    setIsCheckingIn(true)
    try {
      const result = await checkInToLecture(lectureId, currentUser.id, checkInCode.trim())
      if (result.success) {
        setCheckInCode('')
        loadLecture() // Refresh lecture data
        setToastMessage(result.message || 'Marked Present ✅')
        setToastType('success')
        setShowToast(true)
      }
    } catch (error) {
      setToastMessage(error.message || 'Failed to check in')
      setToastType('error')
      setShowToast(true)
    } finally {
      setIsCheckingIn(false)
    }
  }

  const isEventTime = () => {
    if (!lecture || !lecture.date) return false
    const eventDate = new Date(lecture.date)
    const now = new Date()
    // Check if event is happening now (within 2 hours before/after)
    const timeDiff = Math.abs(eventDate - now)
    return timeDiff < 2 * 60 * 60 * 1000 // Within 2 hours
  }

  const isEventPast = () => {
    if (!lecture || !lecture.date) return false
    return new Date(lecture.date) < new Date()
  }

  const hasRSVPd = () => {
    return lecture && lecture.rsvpList && lecture.rsvpList.includes(currentUser.id)
  }

  const hasCheckedIn = () => {
    return lecture && lecture.attendanceList && lecture.attendanceList.includes(currentUser.id)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 text-tamu-maroon mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Loading lecture details...</p>
      </div>
    )
  }

  if (!lecture) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Lecture not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />

      {/* Lecture Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{lecture.title}</h2>
        
        <div className="space-y-3 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>{new Date(lecture.date).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          
          {lecture.professorName && (
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>Professor: {lecture.professorName}</span>
            </div>
          )}
          
          {lecture.topicTags && lecture.topicTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span>Topics:</span>
              {lecture.topicTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {lecture.description && (
          <p className="mt-4 text-gray-700">{lecture.description}</p>
        )}
      </div>

      {/* RSVP Section */}
      {!isEventPast() && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">RSVP</h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRSVP}
            disabled={isRSVPing}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              hasRSVPd()
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-tamu-maroon text-white hover:bg-tamu-maroon-light'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRSVPing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : hasRSVPd() ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>RSVP'd ✓</span>
              </>
            ) : (
              <>
                <CalendarPlus className="w-5 h-5" />
                <span>RSVP</span>
              </>
            )}
          </motion.button>
        </div>
      )}

      {/* Check-In Section */}
      {(isEventTime() || isEventPast()) && hasRSVPd() && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Check In</h3>
          
          {hasCheckedIn() ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-medium">Marked Present ✅</p>
              <p className="text-sm text-green-700 mt-1">You've successfully checked in</p>
            </div>
          ) : (
            <form onSubmit={handleCheckIn} className="space-y-4">
              <div>
                <label htmlFor="checkInCode" className="block text-sm font-medium text-gray-700 mb-2">
                  <Key className="w-4 h-4 inline mr-2" />
                  Enter Check-in Code
                </label>
                <input
                  type="text"
                  id="checkInCode"
                  value={checkInCode}
                  onChange={(e) => setCheckInCode(e.target.value)}
                  placeholder="Enter 4-digit code"
                  maxLength={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent text-center text-2xl tracking-widest"
                  disabled={isCheckingIn}
                />
                <p className="mt-2 text-sm text-gray-500">
                  The check-in code will be provided at the event
                </p>
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isCheckingIn || !checkInCode.trim()}
                className="w-full bg-tamu-maroon text-white px-6 py-3 rounded-lg font-medium hover:bg-tamu-maroon-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Checking in...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Check In</span>
                  </>
                )}
              </motion.button>
            </form>
          )}
        </div>
      )}

      {/* Info Message */}
      {!hasRSVPd() && (isEventTime() || isEventPast()) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ You need to RSVP first before you can check in.
          </p>
        </div>
      )}
    </div>
  )
}

