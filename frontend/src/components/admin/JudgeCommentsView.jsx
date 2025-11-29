import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, User, Calendar, Trophy, AlertCircle } from 'lucide-react'
import { mockTeams } from '../../data/mockData'

/**
 * Judge Comments View
 * Shows all judge comments on team submissions
 * Only visible to Faculty and Full Admins (not Student Assistants)
 */
export default function JudgeCommentsView() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState(null)

  useEffect(() => {
    // Simulate loading judge comments
    setTimeout(() => {
      // Mock judge comments data
      const teamsWithComments = mockTeams.map(team => ({
        ...team,
        judgeComments: [
          {
            judgeName: 'Dr. Smith',
            comment: 'Excellent analysis of the market trends. The financial projections are well-researched.',
            score: 8.5,
            date: new Date().toISOString()
          },
          {
            judgeName: 'Jane Doe',
            comment: 'Strong presentation skills. However, the risk assessment could be more detailed.',
            score: 7.5,
            date: new Date().toISOString()
          }
        ]
      }))
      setTeams(teamsWithComments)
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Judge Comments</h2>
        <p className="text-gray-600">View all judge comments and feedback on team submissions</p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Confidential:</strong> This information is only visible to Faculty and Full Administrators. 
            Student Assistants cannot view judge comments to maintain competition fairness.
          </p>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No judge comments yet</p>
          <p className="text-gray-500 text-sm">
            Judge comments will appear here once judges submit their evaluations.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {teams.map((team) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-6 h-6 text-tamu-maroon" />
                    <h3 className="text-xl font-semibold text-gray-800">{team.name}</h3>
                    <span className="px-3 py-1 bg-tamu-maroon/10 text-tamu-maroon rounded-full text-xs font-medium">
                      {team.members.length} members
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Members: {team.members.join(', ')}</span>
                    {team.score && (
                      <span className="text-tamu-maroon font-semibold">
                        Total Score: {team.score.toFixed(1)}/50
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Judge Comments */}
              {team.judgeComments && team.judgeComments.length > 0 ? (
                <div className="mt-4 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Judge Comments:</h4>
                  {team.judgeComments.map((comment, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-800">{comment.judgeName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>Score: {comment.score}/10</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(comment.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 italic mt-2">"{comment.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">No comments yet from judges</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

