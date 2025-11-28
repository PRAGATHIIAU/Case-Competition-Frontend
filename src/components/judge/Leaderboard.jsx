import { motion } from 'framer-motion'
import { Trophy, Medal, Award } from 'lucide-react'

export default function Leaderboard({ teams }) {
  const sortedTeams = [...teams].sort((a, b) => (b.score || 0) - (a.score || 0))

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
    }
  }

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return 'bg-yellow-50 border-yellow-200'
      case 1:
        return 'bg-gray-50 border-gray-200'
      case 2:
        return 'bg-amber-50 border-amber-200'
      default:
        return 'bg-white border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Leaderboard</h2>
        <p className="text-gray-600">Live team rankings based on current scores</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Team Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedTeams.map((team, index) => (
                <motion.tr
                  key={team.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 transition-colors ${getRankColor(index)}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getRankIcon(index)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{team.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {team.members.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
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

      {/* Stats Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Total Teams</p>
          <p className="text-3xl font-bold text-gray-800">{teams.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Average Score</p>
          <p className="text-3xl font-bold text-gray-800">
            {teams.filter(t => t.score).length > 0
              ? (teams.reduce((sum, t) => sum + (t.score || 0), 0) / teams.filter(t => t.score).length).toFixed(1)
              : '—'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Scored Teams</p>
          <p className="text-3xl font-bold text-gray-800">
            {teams.filter(t => t.score).length} / {teams.length}
          </p>
        </div>
      </div>
    </div>
  )
}

