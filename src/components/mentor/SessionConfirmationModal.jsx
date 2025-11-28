import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Calendar, 
  Link as LinkIcon, 
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'

export default function SessionConfirmationModal({ request, isOpen, onClose, onSuccess }) {
  const { confirmSession } = useMockData()
  
  const [meetingTime, setMeetingTime] = useState('')
  const [meetingLink, setMeetingLink] = useState('')
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!meetingTime) {
      setError('Please select a meeting time')
      return
    }

    // Validate meeting time is in the future
    const selectedTime = new Date(meetingTime)
    if (selectedTime < new Date()) {
      setError('Meeting time must be in the future')
      return
    }

    setLoading(true)
    
    try {
      const result = await confirmSession(request.id, {
        meetingTime: meetingTime,
        meetingLink: meetingLink.trim() || '',
        durationMinutes: durationMinutes
      })
      
      if (result.success) {
        setToastMessage('Session confirmed! Confirmation emails sent to both parties.')
        setShowToast(true)
        
        // Reset form
        setMeetingTime('')
        setMeetingLink('')
        setDurationMinutes(60)
        
        // Call success callback
        if (onSuccess) {
          onSuccess(result.session)
        }
        
        // Close modal after a short delay
        setTimeout(() => {
          onClose()
        }, 1500)
      }
    } catch (error) {
      setError(error.message || 'Failed to confirm session')
      setToastMessage(error.message || 'Failed to confirm session')
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setMeetingTime('')
      setMeetingLink('')
      setDurationMinutes(60)
      setError('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <Toast
            message={toastMessage}
            isVisible={showToast}
            onClose={() => setShowToast(false)}
            type={error ? 'error' : 'success'}
          />

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Confirm & Schedule Session</h2>
              <p className="text-sm text-gray-600 mt-1">
                Schedule a mentorship session with {request.studentName}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Student Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Student Information</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Name:</strong> {request.studentName}</p>
                <p><strong>Major:</strong> {request.studentMajor}</p>
                <p><strong>Email:</strong> {request.studentEmail}</p>
              </div>
              {request.message && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-sm text-blue-700 italic">"{request.message}"</p>
                </div>
              )}
            </div>

            {/* Meeting Time */}
            <div>
              <label htmlFor="meetingTime" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Meeting Date & Time *
              </label>
              <input
                type="datetime-local"
                id="meetingTime"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                required
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Select a date and time for the mentorship session
              </p>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Duration (minutes)
              </label>
              <select
                id="duration"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
                disabled={loading}
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            {/* Meeting Link */}
            <div>
              <label htmlFor="meetingLink" className="block text-sm font-medium text-gray-700 mb-2">
                <LinkIcon className="w-4 h-4 inline mr-2" />
                Meeting Link (Optional)
              </label>
              <input
                type="url"
                id="meetingLink"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Add a Zoom, Google Meet, or other video conferencing link
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>What happens next:</strong>
              </p>
              <ul className="text-sm text-green-700 mt-2 space-y-1 list-disc list-inside">
                <li>Session will be confirmed and saved</li>
                <li>Confirmation emails will be sent to both you and the student</li>
                <li>Google Calendar links will be included in the emails</li>
                <li>The student will be notified of the scheduled time</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading || !meetingTime}
                className="flex-1 px-6 py-3 bg-tamu-maroon text-white rounded-lg font-medium hover:bg-tamu-maroon-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm & Schedule</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

