import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, TrendingUp, BarChart3, AlertCircle } from 'lucide-react'
import { mockTeams } from '../../data/mockData'

/**
 * Competition Scores View
 * Shows all competition scores for all teams
 * Only visible to Faculty and Full Admins (not Student Assistants)
 */
export default function CompetitionScoresView() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading scores
    setTimeout(() => {
      // Add mock scores to teams
      const teamsWithScores = mockTeams.map((team, idx) => ({
        ...team,
        score: 35 + Math.random() * 15, // Random score between 35-50
        breakdown: {
          presentation: 8.5 + Math.random() * 1.5,
          analysis: 8.0 + Math.random() * 2.0,
          innovation: 7.5 + Math.random() * 2.5,
          feasibility: 8.0 + Math.random() * 2.0
        }
      }))
      // Sort by score
      teamsWithScores.sort((a, b) => (b.score || 0) - (a.score || 0))
      setTeams(teamsWithScores)
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

  const averageScore = teams.length > 0
    ? teams.reduce((sum, t) => sum + (t.score || 0), 0) / teams.length
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Competition Scores</h2>
        <p className="text-gray-600">View detailed scoring breakdown for all teams</p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Confidential:</strong> This information is only visible to Faculty and Full Administrators. 
            Student Assistants cannot view competition scores to maintain fairness.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-tamu-maroon" />
            <p className="text-sm text-gray-600">Total Teams</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">{teams.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <p className="text-sm text-gray-600">Average Score</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">{averageScore.toFixed(1)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <p className="text-sm text-gray-600">Highest Score</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {teams.length > 0 ? teams[0].score.toFixed(1) : '—'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-gray-400" />
            <p className="text-sm text-gray-600">Lowest Score</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {teams.length > 0 ? teams[teams.length - 1].score.toFixed(1) : '—'}
          </p>
        </div>
      </div>

      {/* Teams with Scores */}
      {teams.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No scores yet</p>
          <p className="text-gray-500 text-sm">
            Competition scores will appear here once judges submit their evaluations.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Team</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Members</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Presentation</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Analysis</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Innovation</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Feasibility</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Total Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teams.map((team, index) => (
                  <motion.tr
                    key={team.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:bg-gray-50 transition-colors ${
                      index === 0 ? 'bg-yellow-50' : index === 1 ? 'bg-gray-50' : index === 2 ? 'bg-amber-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-gray-800">#{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{team.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{team.members.join(', ')}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-800">
                        {team.breakdown?.presentation.toFixed(1) || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-800">
                        {team.breakdown?.analysis.toFixed(1) || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-800">
                        {team.breakdown?.innovation.toFixed(1) || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-800">
                        {team.breakdown?.feasibility.toFixed(1) || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-bold text-tamu-maroon">
                        {team.score ? team.score.toFixed(1) : '—'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

