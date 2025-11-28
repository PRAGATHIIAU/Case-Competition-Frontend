import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Star, 
  Trophy, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'

export default function JudgeFeedbackList() {
  const navigate = useNavigate()
  const { currentUser, competitions, getJudgeFeedback } = useMockData()
  
  const [judgedCompetitions, setJudgedCompetitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedbackStatus, setFeedbackStatus] = useState({}) // { competitionId: { submitted: bool, feedback: object } }

  useEffect(() => {
    loadCompetitions()
  }, [currentUser, competitions])

  const loadCompetitions = async () => {
    setLoading(true)
    
    try {
      // Find competitions where current user is a judge
      const userCompetitions = competitions.filter(comp => 
        comp.judges && comp.judges.includes(currentUser.id)
      )
      
      console.log('📊 Loading competitions for judge:', currentUser.id)
      console.log('  Found', userCompetitions.length, 'competitions')
      
      // Check feedback status for each competition
      const statusMap = {}
      for (const comp of userCompetitions) {
        const feedback = getJudgeFeedback(comp.id, currentUser.id)
        statusMap[comp.id] = {
          submitted: !!feedback,
          feedback: feedback || null
        }
      }
      
      setJudgedCompetitions(userCompetitions)
      setFeedbackStatus(statusMap)
      
      console.log('✅ Loaded', userCompetitions.length, 'competitions with feedback status')
    } catch (error) {
      console.error('❌ Error loading competitions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitFeedback = (competitionId) => {
    // Navigate to feedback form
    navigate(`/stakeholder/feedback/${competitionId}`)
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

  const isCompetitionPast = (deadline) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 text-tamu-maroon mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Loading your competitions...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-8 h-8 text-tamu-maroon" />
          <h2 className="text-3xl font-bold text-gray-800">Rate Your Experience</h2>
        </div>
        <p className="text-gray-600">
          Share your feedback on competitions you've judged to help us improve
        </p>
        <p className="text-sm text-gray-500 mt-2">
          💡 <strong>Tip:</strong> After judging a competition, you'll receive an email with a feedback link. 
          You can also submit feedback directly from here.
        </p>
      </div>

      {/* Competitions List */}
      {judgedCompetitions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No competitions yet</p>
          <p className="text-gray-500 text-sm">
            You haven't been assigned as a judge for any competitions. 
            Check the "Judge Invitations" tab to accept invitations.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {judgedCompetitions.map((competition) => {
            const status = feedbackStatus[competition.id]
            const isPast = isCompetitionPast(competition.deadline)
            const canSubmit = isPast || competition.status === 'completed'
            
            return (
              <motion.div
                key={competition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy className="w-6 h-6 text-tamu-maroon" />
                      <h3 className="text-xl font-semibold text-gray-800">
                        {competition.name}
                      </h3>
                      {status?.submitted && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Feedback Submitted
                        </span>
                      )}
                      {!status?.submitted && canSubmit && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Feedback Pending
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>Deadline: {formatDate(competition.deadline)}</span>
                      {competition.requiredExpertise && competition.requiredExpertise.length > 0 && (
                        <>
                          <span className="text-gray-400">•</span>
                          <div className="flex flex-wrap gap-2">
                            {competition.requiredExpertise.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {competition.requiredExpertise.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{competition.requiredExpertise.length - 3} more
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Existing Feedback Preview */}
                    {status?.submitted && status?.feedback && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <p className="text-sm font-medium text-green-900">Your Feedback</p>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < status.feedback.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-green-800">
                            {status.feedback.rating}/5 stars
                          </span>
                        </div>
                        {status.feedback.comments && (
                          <p className="text-sm text-green-700 italic mt-2">
                            "{status.feedback.comments}"
                          </p>
                        )}
                        <button
                          onClick={() => handleSubmitFeedback(competition.id)}
                          className="mt-3 text-sm text-green-700 hover:text-green-900 font-medium flex items-center gap-1"
                        >
                          View/Edit Feedback
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Pending Feedback */}
                    {!status?.submitted && canSubmit && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800 mb-3">
                          This competition has ended. Please share your feedback to help us improve future events.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSubmitFeedback(competition.id)}
                          className="bg-tamu-maroon text-white px-6 py-2 rounded-lg font-medium hover:bg-tamu-maroon-light transition-colors flex items-center gap-2"
                        >
                          <Star className="w-5 h-5" />
                          <span>Submit Feedback</span>
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    )}

                    {/* Competition Not Ended Yet */}
                    {!status?.submitted && !canSubmit && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          This competition is still ongoing. You'll be able to submit feedback after it ends.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

