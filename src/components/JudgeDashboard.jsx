import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, FileCheck, BarChart3, Trophy, LogOut, FolderOpen, Download, FileText, FileArchive, Presentation, File } from 'lucide-react'
import ScoringModal from './judge/ScoringModal'
import Leaderboard from './judge/Leaderboard'
import RubricsPanel from './judge/RubricsPanel'
import { mockTeams, mockProjects } from '../data/mockData'

export default function JudgeDashboard() {
  const [activeTab, setActiveTab] = useState('projects') // Default to Projects tab
  const [teams, setTeams] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data fetching - Judge logs in and sees assigned teams + rubrics
    setTimeout(() => {
      setTeams(mockTeams)
      setProjects(mockProjects)
      setLoading(false)
      console.log('✅ Judge Dashboard loaded:', {
        teams: mockTeams.length,
        projects: mockProjects.length
      })
      // Auto-show rubrics on first load (as per requirement)
      // The rubrics tab is visible in sidebar, user can click to view
    }, 500)
  }, [])

  const handleScoreTeam = (team) => {
    setSelectedTeam(team)
    setIsModalOpen(true)
  }

  const handleSaveScore = (scores) => {
    // Update team score - System auto-calculates totals and updates Leaderboard in real-time
    const updatedTeams = teams.map(team =>
      team.id === selectedTeam.id
        ? { 
            ...team, 
            score: scores.total, 
            ...scores,
            lastScoredAt: new Date().toISOString()
          }
        : team
    )
    
    // Sort teams by score for real-time leaderboard update
    updatedTeams.sort((a, b) => (b.score || 0) - (a.score || 0))
    
    setTeams(updatedTeams)
    setIsModalOpen(false)
    setSelectedTeam(null)
    
    // Show success message
    alert(`Score saved! ${selectedTeam.name} now has a score of ${scores.total.toFixed(1)}. Leaderboard updated.`)
  }

  const navItems = [
    { id: 'scoring', label: 'Scoring Dashboard', icon: FileCheck },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'rubrics', label: 'Rubrics', icon: FileCheck },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'events', label: 'My Events', icon: Calendar },
  ]

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pptx':
        return <Presentation className="w-5 h-5 text-orange-600" />
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />
      case 'zip':
        return <FileArchive className="w-5 h-5 text-purple-600" />
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-600" />
      default:
        return <File className="w-5 h-5 text-gray-600" />
    }
  }

  // Handle file download
  const handleFileDownload = (fileName) => {
    alert(`Downloading ${fileName}...`)
    // In production, this would trigger actual file download
  }

  // Handle grade/score button
  const handleGradeProject = (project) => {
    // Find corresponding team for scoring
    const team = teams.find(t => t.name === project.teamName)
    if (team) {
      setSelectedTeam(team)
      setIsModalOpen(true)
    } else {
      alert(`Opening scoring modal for ${project.teamName}...`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl font-bold text-tamu-maroon">Judge Portal</h1>
          <p className="text-sm text-gray-600 mt-1">CMIS Engagement Platform</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-tamu-maroon text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tamu-maroon mx-auto"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'scoring' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Scoring Dashboard</h2>
                    <p className="text-gray-600">Review and score team submissions</p>
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Your Assigned Teams:</strong> You have {teams.length} teams assigned for evaluation.
                        Use the rubrics panel to review scoring criteria before scoring.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {teams.map((team) => (
                      <motion.div
                        key={team.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-md p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                              {team.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Members: {team.members.join(', ')}</span>
                              <span className="text-gray-400">•</span>
                              <span>Current Score: {team.score || 'Not scored'}</span>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleScoreTeam(team)}
                            className="bg-tamu-maroon text-white px-6 py-2 rounded-lg font-medium hover:bg-tamu-maroon-light transition-colors"
                          >
                            {team.score ? 'Update Score' : 'Score Team'}
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'rubrics' && (
                <div>
                  <RubricsPanel />
                </div>
              )}

              {activeTab === 'leaderboard' && (
                <div>
                  <Leaderboard teams={teams} />
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Submitted Projects</h2>
                    <p className="text-gray-600">Review and download project materials from student teams</p>
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Total Submissions:</strong> {projects.length} project{projects.length !== 1 ? 's' : ''} submitted
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: project.id * 0.1 }}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                      >
                        {/* Team Name & Project Title */}
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {project.teamName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{project.projectTitle}</p>
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(project.submittedAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Submitted Files Section */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <FolderOpen className="w-4 h-4" />
                            Submitted Files
                          </h4>
                          <div className="space-y-2">
                            {project.files.map((file, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleFileDownload(file.name)}
                                className="w-full flex items-center gap-3 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left group"
                              >
                                <div className="flex-shrink-0">
                                  {getFileIcon(file.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 truncate group-hover:text-tamu-maroon transition-colors">
                                    {file.name}
                                  </p>
                                </div>
                                <Download className="w-4 h-4 text-gray-400 group-hover:text-tamu-maroon transition-colors flex-shrink-0" />
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Grade/Score Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleGradeProject(project)}
                          className="w-full bg-tamu-maroon text-white px-4 py-2 rounded-lg font-medium hover:bg-tamu-maroon-light transition-colors flex items-center justify-center gap-2"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span>Grade / Score</span>
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>

                  {projects.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                      <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No projects submitted yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'events' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">My Events</h2>
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No upcoming judging events scheduled</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* Scoring Modal */}
      {isModalOpen && selectedTeam && (
        <ScoringModal
          team={selectedTeam}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveScore}
        />
      )}
    </div>
  )
}

