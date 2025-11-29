import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Star, 
  Trophy, 
  CheckCircle2, 
  Loader2,
  ArrowLeft,
  MessageSquare
} from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'

export default function StakeholderFeedback() {
  const { competitionId } = useParams()
  const navigate = useNavigate()
  const { currentUser, competitions, submitJudgeFeedback, getJudgeFeedback } = useMockData()
  
  const [competition, setCompetition] = useState(null)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comments, setComments] = useState('')
  const [promotionalConsent, setPromotionalConsent] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [existingFeedback, setExistingFeedback] = useState(null)

  useEffect(() => {
    loadCompetition()
    checkExistingFeedback()
  }, [competitionId])

  const loadCompetition = () => {
    setLoading(true)
    setTimeout(() => {
      const comp = competitions.find(c => c.id === parseInt(competitionId))
      if (comp) {
        setCompetition(comp)
      } else {
        setError('Competition not found')
      }
      setLoading(false)
    }, 500)
  }

  const checkExistingFeedback = () => {
    const feedback = getJudgeFeedback(parseInt(competitionId), currentUser.id)
    if (feedback) {
      setExistingFeedback(feedback)
      setRating(feedback.rating)
      setComments(feedback.comments || '')
      setPromotionalConsent(feedback.promotionalConsent || false)
      setSubmitted(true) // Show thank you message
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      setToastMessage('Please provide a rating')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const result = await submitJudgeFeedback({
        competitionId: parseInt(competitionId),
        judgeId: currentUser.id,
        rating,
        comments: comments.trim(),
        promotionalConsent
      })

      if (result.success) {
        setSubmitted(true)
        setToastMessage('Thank you for your feedback!')
        setToastType('success')
        setShowToast(true)
        
        // Update existing feedback state
        setExistingFeedback(result.feedback)
      } else {
        setError(result.message || 'Failed to submit feedback')
        setToastMessage(result.message || 'Failed to submit feedback')
        setToastType('error')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    } catch (err) {
      console.error('Error submitting feedback:', err)
      setError(err.message || 'Failed to submit feedback')
      setToastMessage(err.message || 'Failed to submit feedback')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-tamu-maroon mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading feedback form...</p>
        </div>
      </div>
    )
  }

  if (error && !competition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/industry')}
            className="px-4 py-2 bg-tamu-maroon text-white rounded-lg hover:bg-tamu-maroon-light"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (submitted && existingFeedback) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full text-center"
        >
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Thank You for Helping Us Improve!
          </h1>
          <p className="text-gray-600 mb-6">
            Your feedback has been received and will help us enhance future competitions.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">Your Feedback:</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-600">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= existingFeedback.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            {existingFeedback.comments && (
              <div className="mb-3">
                <span className="text-sm text-gray-600">Comments:</span>
                <p className="text-gray-800 mt-1">{existingFeedback.comments}</p>
              </div>
            )}
            {existingFeedback.promotionalConsent && (
              <p className="text-sm text-green-600">✓ You opted in for future event notifications</p>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/industry')}
              className="px-6 py-3 bg-tamu-maroon text-white rounded-lg hover:bg-tamu-maroon-light transition-colors font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="w-12 h-12 text-tamu-maroon" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Judge Feedback</h1>
              <p className="text-gray-600">
                Help us improve future competitions by sharing your experience
              </p>
            </div>
          </div>
          
          {competition && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Competition:</strong> {competition.name}
              </p>
              {competition.deadline && (
                <p className="text-sm text-blue-700 mt-1">
                  <strong>Deadline:</strong> {new Date(competition.deadline).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you rate your experience? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-4 text-sm text-gray-600">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </span>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="mb-6">
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
              What could we improve? (Optional)
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent resize-none"
              placeholder="Share your thoughts on the competition organization, judging process, or any suggestions for improvement..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {comments.length} characters
            </p>
          </div>

          {/* Promotional Consent */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={promotionalConsent}
                onChange={(e) => setPromotionalConsent(e.target.checked)}
                className="mt-1 w-5 h-5 text-tamu-maroon border-gray-300 rounded focus:ring-tamu-maroon"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Keep me updated on future events
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  We'll notify you about upcoming competitions and opportunities to judge
                </p>
              </div>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <motion.button
              type="submit"
              disabled={submitting || rating === 0}
              whileHover={!submitting && rating > 0 ? { scale: 1.02 } : {}}
              whileTap={!submitting && rating > 0 ? { scale: 0.98 } : {}}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                submitting || rating === 0
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-tamu-maroon text-white hover:bg-tamu-maroon-light shadow-md hover:shadow-lg'
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5" />
                  <span>Submit Feedback</span>
                </>
              )}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => navigate('/industry')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Cancel</span>
            </motion.button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}

