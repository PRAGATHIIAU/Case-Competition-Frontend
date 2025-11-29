import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Star, User, Calendar, Trophy, AlertCircle } from 'lucide-react'

/**
 * Judge Feedback View
 * Shows feedback from judges about the competition experience
 * Only visible to Faculty and Full Admins (not Student Assistants)
 */
export default function JudgeFeedbackView() {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading judge feedback
    setTimeout(() => {
      // Mock judge feedback data
      const mockFeedback = [
        {
          id: 1,
          judgeName: 'Dr. Smith',
          competitionName: 'Spring 2024 Case Competition',
          rating: 5,
          comments: 'Excellent organization and clear communication throughout. The teams were well-prepared and the scoring rubric was comprehensive.',
          date: new Date('2024-03-15').toISOString(),
          suggestions: 'Consider adding more time for Q&A sessions.'
        },
        {
          id: 2,
          judgeName: 'Jane Doe',
          competitionName: 'Spring 2024 Case Competition',
          rating: 4,
          comments: 'Great experience overall. The platform made it easy to review submissions and provide feedback.',
          date: new Date('2024-03-15').toISOString(),
          suggestions: 'Would be helpful to have more detailed rubrics upfront.'
        },
        {
          id: 3,
          judgeName: 'John Johnson',
          competitionName: 'Fall 2023 Case Competition',
          rating: 5,
          comments: 'Outstanding event! The quality of submissions was impressive and the judging process was smooth.',
          date: new Date('2023-11-20').toISOString(),
          suggestions: null
        }
      ]
      setFeedback(mockFeedback)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tamu-maroon mx-auto"></div>
      </div>
    )
  }

  const averageRating = feedback.length > 0
    ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Judge Feedback</h2>
        <p className="text-gray-600">View feedback from judges about competition experiences</p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Confidential:</strong> This information is only visible to Faculty and Full Administrators. 
            Student Assistants cannot view judge feedback to maintain confidentiality.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-6 h-6 text-tamu-maroon" />
            <p className="text-sm text-gray-600">Total Feedback</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">{feedback.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-6 h-6 text-yellow-500" />
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {averageRating > 0 ? averageRating.toFixed(1) : '—'} / 5
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-green-600" />
            <p className="text-sm text-gray-600">5-Star Reviews</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {feedback.filter(f => f.rating === 5).length}
          </p>
        </div>
      </div>

      {/* Feedback List */}
      {feedback.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No feedback yet</p>
          <p className="text-gray-500 text-sm">
            Judge feedback will appear here once judges submit their evaluations.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {feedback.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-800">{item.judgeName}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < item.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      <span>{item.competitionName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="mb-4">
                <p className="text-gray-700 italic">"{item.comments}"</p>
              </div>

              {/* Suggestions */}
              {item.suggestions && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">Suggestions:</p>
                  <p className="text-sm text-blue-800">{item.suggestions}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

