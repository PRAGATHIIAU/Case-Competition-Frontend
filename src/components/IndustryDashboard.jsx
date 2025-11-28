import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gavel, Users, Trophy, LogOut, CheckCircle2, X, MessageCircle, Mail, MessageSquare, FileCheck, Mic, Settings } from 'lucide-react'
import ScoringModal from './judge/ScoringModal'
import Leaderboard from './judge/Leaderboard'
import RubricsPanel from './judge/RubricsPanel'
import JudgeInvitations from './judge/JudgeInvitations'
import AlumniHistory from './alumni/AlumniHistory'
import JudgeFeedbackList from './judge/JudgeFeedbackList'
import SpeakerDashboard from './speaker/SpeakerDashboard'
import SpeakerInvitations from './speaker/SpeakerInvitations'
import MyMentees from './mentor/MyMentees'
import SearchInput from './common/SearchInput'
import { mockTeams, mockMentorshipRequests } from '../data/mockData'

export default function IndustryDashboard() {
  const [activeTab, setActiveTab] = useState('judging')
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mentorshipRequests, setMentorshipRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setTeams(mockTeams)
      setMentorshipRequests(mockMentorshipRequests)
      setLoading(false)
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
  }

  const handleMentorshipAction = (requestId, action) => {
    setMentorshipRequests(mentorshipRequests.map(req =>
      req.id === requestId
        ? { ...req, status: action }
        : req
    ))
  }

  const navItems = [
    { id: 'judging', label: 'Judging Center', icon: Gavel },
    { id: 'rubrics', label: 'Rubrics', icon: FileCheck },
    { id: 'invitations', label: 'Judge Invitations', icon: Mail },
    { id: 'speaker-invitations', label: 'Speaker Invitations', icon: Mic },
    { id: 'speaking', label: 'My Speaking Sessions', icon: Mic },
    { id: 'feedback', label: 'Rate Experience', icon: MessageSquare },
    { id: 'mentorship', label: 'Mentorship', icon: Users },
    { id: 'mentees', label: 'My Mentees', icon: Users },
    { id: 'history', label: 'Engagement History', icon: Trophy },
    { id: 'leaderboard', label: 'Live Leaderboard', icon: Trophy },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl font-bold text-tamu-maroon">Industry Partner Portal</h1>
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
                <span className="font-medium text-left">{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 flex-shrink-0 space-y-2">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Settings</span>
          </Link>
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
        {/* Search Bar Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <SearchInput />
          </div>
        </div>
        
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
              {/* Judging Center */}
              {activeTab === 'judging' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Judging Center</h2>
                    <p className="text-gray-600">Review and score team submissions</p>
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Your Assigned Teams:</strong> You have {teams.length} teams assigned for evaluation.
                        Click on a team to open the scoring panel with range sliders.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {teams.map((team) => (
                      <motion.div
                        key={team.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleScoreTeam(team)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                              {team.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Members: {team.members.join(', ')}</span>
                              <span className="text-gray-400">•</span>
                              <span>Current Score: {team.score ? `${team.score.toFixed(1)}/50` : 'Not scored'}</span>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-tamu-maroon text-white px-6 py-2 rounded-lg font-medium"
                          >
                            {team.score ? 'Update Score' : 'Score Team'}
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rubrics */}
              {activeTab === 'rubrics' && (
                <RubricsPanel />
              )}

              {/* Judge Invitations */}
              {activeTab === 'invitations' && (
                <JudgeInvitations />
              )}

              {/* Speaker Invitations */}
              {activeTab === 'speaker-invitations' && (
                <SpeakerInvitations />
              )}

              {/* Speaking Sessions */}
              {activeTab === 'speaking' && (
                <SpeakerDashboard />
              )}

              {/* Rate Experience / Feedback */}
              {activeTab === 'feedback' && (
                <JudgeFeedbackList />
              )}

              {/* Mentorship */}
              {activeTab === 'mentorship' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Mentorship Requests</h2>
                    <p className="text-gray-600">Manage mentorship connections with students</p>
                  </div>

                  <div className="space-y-4">
                    {mentorshipRequests
                      .filter(req => req.status === 'pending')
                      .map((request) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-lg shadow-md p-6"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-tamu-maroon/10 rounded-full flex items-center justify-center">
                                  <Users className="w-6 h-6 text-tamu-maroon" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    {request.studentName} requested to connect
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {request.studentEmail} • {request.studentYear} • {request.studentMajor}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="ml-16 space-y-3">
                                <p className="text-gray-700">{request.requestMessage}</p>
                                
                                <div className="flex flex-wrap gap-2">
                                  {request.studentSkills.map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 text-xs font-medium bg-tamu-maroon/10 text-tamu-maroon rounded-full"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                                
                                <p className="text-xs text-gray-500">
                                  Requested {new Date(request.requestedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex gap-3 ml-4">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleMentorshipAction(request.id, 'accepted')}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                                Accept
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleMentorshipAction(request.id, 'declined')}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                              >
                                <X className="w-5 h-5" />
                                Decline
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    
                    {mentorshipRequests.filter(req => req.status === 'pending').length === 0 && (
                      <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No pending mentorship requests</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* My Mentees */}
              {activeTab === 'mentees' && (
                <MyMentees />
              )}

              {/* Engagement History */}
              {activeTab === 'history' && (
                <div>
                  <AlumniHistory />
                </div>
              )}

              {/* Live Leaderboard */}
              {activeTab === 'leaderboard' && (
                <div>
                  <Leaderboard teams={teams} />
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

