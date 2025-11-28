import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, 
  Users, 
  Trophy, 
  Mic, 
  Calendar,
  CheckCircle2,
  Loader2,
  TrendingUp,
  Star,
  ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMockData } from '../../contexts/MockDataContext'
import RecommendedEventsWidget from './RecommendedEventsWidget'

export default function AlumniHistory() {
  const navigate = useNavigate()
  const { currentUser, getAlumniEngagementHistory, getJudgeFeedback } = useMockData()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({
    mentoring: 0,
    judging: 0,
    speaking: 0,
    total: 0
  })
  const [error, setError] = useState(null)
  const [feedbackStatus, setFeedbackStatus] = useState({}) // { competitionId: bool }

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('📊 Loading engagement history for:', currentUser.id)
      const result = await getAlumniEngagementHistory(currentUser.id)
      
      if (result.success) {
        setActivities(result.activities)
        setCounts(result.counts)
        
        // Check feedback status for judging activities
        const statusMap = {}
        result.activities
          .filter(act => act.type === 'Judging' && act.details?.competitionId)
          .forEach(act => {
            const feedback = getJudgeFeedback(act.details.competitionId, currentUser.id)
            statusMap[act.details.competitionId] = !!feedback
          })
        setFeedbackStatus(statusMap)
        
        console.log('✅ History loaded:', result.activities.length, 'activities')
      } else {
        setError(result.message || 'Failed to load history')
      }
    } catch (err) {
      console.error('❌ Error loading history:', err)
      setError(err.message || 'Failed to load engagement history')
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Mentoring':
        return <Users className="w-5 h-5" />
      case 'Judging':
        return <Trophy className="w-5 h-5" />
      case 'Speaking':
        return <Mic className="w-5 h-5" />
      default:
        return <CheckCircle2 className="w-5 h-5" />
    }
  }

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'Mentoring':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Judging':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Speaking':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Recommended Events Widget */}
        <div className="mb-6">
          <RecommendedEventsWidget />
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Engagement History</h1>
              <p className="text-gray-600">
                Your complete timeline of mentoring, judging, and speaking activities
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadHistory}
              disabled={loading}
              className="px-4 py-2 bg-tamu-maroon text-white rounded-lg hover:bg-tamu-maroon-light transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
              <span>Refresh</span>
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Mentoring</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{counts.mentoring}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Judging</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">{counts.judging}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mic className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Speaking</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{counts.speaking}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Loader2 className="w-12 h-12 text-tamu-maroon mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading your engagement history...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium mb-2">Error loading history</p>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={loadHistory}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && activities.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="max-w-md mx-auto">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                No Engagement History Yet
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't participated in any activities yet. Check out the 'Opportunities' tab to get started!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/industry'}
                className="px-6 py-3 bg-tamu-maroon text-white rounded-lg hover:bg-tamu-maroon-light transition-colors font-medium"
              >
                View Opportunities
              </motion.button>
            </div>
          </div>
        )}

        {/* Timeline */}
        {!loading && !error && activities.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Activity Timeline</h2>
            
            {/* Timeline Container */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              
              {/* Timeline Items */}
              <div className="space-y-6">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-tamu-maroon border-4 border-white shadow-md"></div>
                    
                    <div className="ml-12">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border ${getTypeBadgeColor(activity.type)}`}>
                            {getTypeIcon(activity.type)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {activity.title}
                            </h3>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeBadgeColor(activity.type)}`}>
                          {activity.type}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(activity.date)}</span>
                        </div>

                        {/* Type-Specific Details */}
                        {activity.type === 'Mentoring' && activity.details && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-900">
                              <strong>Student:</strong> {activity.details.studentName}
                            </p>
                            <p className="text-sm text-blue-800 mt-1">
                              <strong>Major:</strong> {activity.details.studentMajor}
                            </p>
                            {activity.details.message && (
                              <p className="text-sm text-blue-700 mt-2 italic">
                                "{activity.details.message}"
                              </p>
                            )}
                          </div>
                        )}

                        {activity.type === 'Judging' && activity.details && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-900">
                              <strong>Competition:</strong> {activity.details.competitionName}
                            </p>
                            {activity.details.deadline && (
                              <p className="text-sm text-yellow-800 mt-1">
                                <strong>Deadline:</strong> {formatDate(activity.details.deadline)}
                              </p>
                            )}
                            {/* Rate Experience Button */}
                            {activity.details.competitionId && (
                              <div className="mt-3 pt-3 border-t border-yellow-200">
                                {feedbackStatus[activity.details.competitionId] ? (
                                  <div className="flex items-center gap-2 text-sm text-green-700">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Feedback submitted</span>
                                    <button
                                      onClick={() => navigate(`/stakeholder/feedback/${activity.details.competitionId}`)}
                                      className="ml-auto text-yellow-700 hover:text-yellow-900 font-medium flex items-center gap-1"
                                    >
                                      View Feedback
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/stakeholder/feedback/${activity.details.competitionId}`)}
                                    className="w-full bg-tamu-maroon text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-tamu-maroon-light transition-colors flex items-center justify-center gap-2"
                                  >
                                    <Star className="w-4 h-4" />
                                    <span>Rate Your Experience</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </motion.button>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {activity.type === 'Speaking' && activity.details && (
                          <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <p className="text-sm text-purple-900">
                              <strong>Event:</strong> {activity.details.eventTitle}
                            </p>
                            <p className="text-sm text-purple-800 mt-1">
                              <strong>Type:</strong> {activity.details.eventType}
                            </p>
                            {activity.details.location && (
                              <p className="text-sm text-purple-800 mt-1">
                                <strong>Location:</strong> {activity.details.location}
                              </p>
                            )}
                            {activity.details.time && (
                              <p className="text-sm text-purple-800 mt-1">
                                <strong>Time:</strong> {activity.details.time}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

