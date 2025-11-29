import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gavel, Users, Trophy, LogOut, CheckCircle2, X, MessageCircle, Mail, MessageSquare, FileCheck, Mic, Settings, Calendar, BookOpen, Clock, FolderOpen, Download, FileText, Presentation, File, RefreshCw } from 'lucide-react'
import ScoringModal from './judge/ScoringModal'
import Leaderboard from './judge/Leaderboard'
import RubricsPanel from './judge/RubricsPanel'
import JudgeInvitations from './judge/JudgeInvitations'
import AlumniHistory from './alumni/AlumniHistory'
import JudgeFeedbackList from './judge/JudgeFeedbackList'
import SpeakerFeedbackList from './speaker/SpeakerFeedbackList'
import SpeakerDashboard from './speaker/SpeakerDashboard'
import SpeakerInvitations from './speaker/SpeakerInvitations'
import RecommendedEventsWidget from './alumni/RecommendedEventsWidget'
import MyRegisteredEvents from './alumni/MyRegisteredEvents'
import MyMentees from './mentor/MyMentees'
import SessionConfirmationModal from './mentor/SessionConfirmationModal'
import SearchInput from './common/SearchInput'
import Toast from './common/Toast'
import { mockTeams, mockMentorshipRequests } from '../data/mockData'
import { useMockData } from '../contexts/MockDataContext'

export default function IndustryDashboard({ currentView = null }) {
  // Get mock data context for mentor functionality
  const { 
    getReceivedRequests,
    updateRequestStatus,
    connectionRequests,
    mentors,
    teams: contextTeams,  // Get teams from shared context
    scoreTeam  // Get scoreTeam function for updating scores
  } = useMockData()

  // Effective role view (from AlumniDashboard switcher or user flags)
  const [effectiveRole, setEffectiveRole] = useState('mentor')
  const [activeTab, setActiveTab] = useState('mentorship')
  // Use contextTeams directly instead of local state for real-time updates
  const teams = contextTeams
  const [selectedTeam, setSelectedTeam] = useState(null)
  
  // Debug: Log teams whenever they change
  useEffect(() => {
    const teamsWithSubmissions = teams.filter(t => {
      const hasFiles = t.files && Array.isArray(t.files) && t.files.length > 0
      const hasFileName = t.fileName && String(t.fileName).trim() !== ''
      const isSubmitted = t.fileSubmitted === true
      return hasFiles || hasFileName || isSubmitted
    })
    
    console.log('🔄 IndustryDashboard - Teams updated:', {
      totalTeams: teams.length,
      teamsWithSubmissions: teamsWithSubmissions.length,
      allTeams: teams.map(t => ({
        id: t.id,
        name: t.name,
        fileSubmitted: t.fileSubmitted,
        filesCount: t.files?.length || 0,
        fileName: t.fileName,
        hasFiles: !!(t.files && Array.isArray(t.files) && t.files.length > 0),
        hasFileName: !!(t.fileName && String(t.fileName).trim() !== ''),
        willShow: !!(t.files && Array.isArray(t.files) && t.files.length > 0) || !!(t.fileName && String(t.fileName).trim() !== '') || t.fileSubmitted === true
      }))
    })
  }, [teams])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mentorshipRequests, setMentorshipRequests] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Mentor-specific state (for full MentorDashboard functionality)
  const [mentorActiveTab, setMentorActiveTab] = useState('pending') // 'pending', 'accepted', 'declined', 'all'
  
  // Get current user ID from localStorage for selectedMentorId
  const getCurrentUserId = () => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        return user.id || user.userId || null
      }
    } catch (e) {
      console.error('Error parsing user data:', e)
    }
    return null
  }
  
  const [selectedMentorId, setSelectedMentorId] = useState(getCurrentUserId()) // Use current user's ID
  const [processingId, setProcessingId] = useState(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user')
    let user = null
    if (userStr) {
      try {
        user = JSON.parse(userStr)
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }

    // Determine effective role: Use currentView if provided, otherwise use user flags
    let role = 'mentor' // Default
    
    if (currentView) {
      // Use the view from AlumniDashboard role switcher
      role = currentView
    } else if (user) {
      // Fallback: determine from user flags
      if (user.isJudge) {
        role = 'judge'
      } else if (user.isSpeaker) {
        role = 'speaker'
      } else if (user.isMentor) {
        role = 'mentor'
      } else if (user.role === 'judge') {
        role = 'judge'
      } else if (user.role === 'guest_speaker') {
        role = 'speaker'
      } else if (user.role === 'mentor') {
        role = 'mentor'
      }
    }
    
    console.log('🔍 IndustryDashboard - Effective role:', role, 'currentView:', currentView)
    setEffectiveRole(role)
    
    // Set selectedMentorId to current user's ID (for mentor/alumni)
    if (user && user.id) {
      const userId = user.id || user.userId
      setSelectedMentorId(userId)
      console.log('🔧 Set selectedMentorId to:', userId)
    }
    
    // Set default tab based on effective role (always reset when role changes)
    if (role === 'judge') {
      setActiveTab('judging')
    } else if (role === 'speaker') {
      setActiveTab('speaking')
    } else if (role === 'mentor') {
      setActiveTab('mentorship')
    }
    
    // Use teams from shared context (updated when students submit files)
    console.log('🔄 IndustryDashboard - Teams updated:', {
      totalTeams: contextTeams.length,
      teamsWithFiles: contextTeams.filter(t => {
        const hasFiles = t.files && t.files.length > 0
        const hasFileName = t.fileName
        return hasFiles || hasFileName
      }).length,
      teams: contextTeams.map(t => ({
        id: t.id,
        name: t.name,
        fileSubmitted: t.fileSubmitted,
        filesCount: t.files?.length || 0,
        fileName: t.fileName
      }))
    })
    // Teams come directly from contextTeams, no need to set local state
    setMentorshipRequests(mockMentorshipRequests)
    setLoading(false)
  }, [currentView]) // Only run when currentView changes, teams update automatically from context

  const handleScoreTeam = (team) => {
    setSelectedTeam(team)
    setIsModalOpen(true)
  }

  const handleSaveScore = (scores) => {
    // Use shared context function to update scores (this updates contextTeams automatically)
    if (scoreTeam && selectedTeam) {
      scoreTeam(selectedTeam.id, scores, scores.feedback || '')
    }
    
    setIsModalOpen(false)
    setSelectedTeam(null)
    
    // Show success message
    alert(`Score saved! ${selectedTeam.name} now has a score of ${scores.total.toFixed(1)}. Leaderboard updated.`)
  }

  // Full mentor functionality - handle accept with modal
  const handleMentorAccept = async (requestId) => {
    // Open confirmation modal instead of directly accepting
    const allRequests = getReceivedRequests(selectedMentorId)
    const request = allRequests.find(r => r.id === requestId)
    if (request) {
      setSelectedRequest(request)
      setConfirmModalOpen(true)
    }
  }

  const handleConfirmSession = async (session) => {
    try {
      // Refresh requests after confirmation
      loadMentorRequests()
      setConfirmModalOpen(false)
      setSelectedRequest(null)
      showNotification('Session confirmed! Confirmation emails sent to both parties.', 'success')
    } catch (error) {
      console.error('Error confirming session:', error)
      showNotification(error.message || 'Failed to confirm session', 'error')
    }
  }

  const handleMentorDecline = async (requestId) => {
    setProcessingId(requestId)
    setLoading(true)
    
    try {
      await updateRequestStatus(requestId, 'declined')
      showNotification('Request declined successfully.', 'info')
      
      // Refresh requests after decline
      const allRequests = getReceivedRequests(selectedMentorId)
      let filtered = allRequests
      if (mentorActiveTab === 'pending') {
        filtered = allRequests.filter(req => req.status === 'pending')
      } else if (mentorActiveTab === 'accepted') {
        filtered = allRequests.filter(req => req.status === 'accepted')
      } else if (mentorActiveTab === 'declined') {
        filtered = allRequests.filter(req => req.status === 'declined')
      }
      
      // Sort by date (newest first) - handle multiple possible date field names
      filtered.sort((a, b) => {
        const dateA = new Date(a.created_at || a.requestedAt || a.createdAt || 0)
        const dateB = new Date(b.created_at || b.requestedAt || b.createdAt || 0)
        return dateB - dateA
      })
      
      setMentorshipRequests(filtered)
    } catch (error) {
      console.error('Failed to decline request:', error)
      const errorMessage = error.error || error.message || 'Failed to decline request'
      showNotification(errorMessage, 'error')
    } finally {
      setLoading(false)
      setProcessingId(null)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  // Load mentor requests with tabs
  const loadMentorRequests = () => {
    const allRequests = getReceivedRequests(selectedMentorId)
    
    let filtered = allRequests
    if (mentorActiveTab === 'pending') {
      filtered = allRequests.filter(req => req.status === 'pending')
    } else if (mentorActiveTab === 'accepted') {
      filtered = allRequests.filter(req => req.status === 'accepted')
    } else if (mentorActiveTab === 'declined') {
      filtered = allRequests.filter(req => req.status === 'declined')
    }
    
    // Sort by date (newest first) - handle multiple possible date field names
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || a.requestedAt || a.createdAt || 0)
      const dateB = new Date(b.created_at || b.requestedAt || b.createdAt || 0)
      return dateB - dateA
    })
    
    setMentorshipRequests(filtered)
  }

  // Refresh requests when tab or mentor changes
  useEffect(() => {
    if (effectiveRole === 'mentor' && activeTab === 'mentorship') {
      loadMentorRequests()
    }
  }, [mentorActiveTab, selectedMentorId, effectiveRole, activeTab])

  // Load mentor requests when tab or mentor changes
  useEffect(() => {
    if (effectiveRole === 'mentor' && activeTab === 'mentorship') {
      loadMentorRequests()
    }
  }, [mentorActiveTab, selectedMentorId, effectiveRole, activeTab, connectionRequests])

  // Legacy handler for simple accept/decline (kept for compatibility)
  const handleMentorshipAction = (requestId, action) => {
    if (action === 'accepted') {
      handleMentorAccept(requestId)
    } else if (action === 'declined') {
      handleMentorDecline(requestId)
    }
  }

  // Role-based navigation items - organized by view
  const getNavItems = () => {
    // Define all menu items organized by role view
    const menuByRole = {
      mentor: [
        { id: 'mentorship', label: 'Mentorship Requests', icon: Users },
        { id: 'mentees', label: 'My Mentees', icon: Users },
        { id: 'history', label: 'Engagement History', icon: Trophy },
        { id: 'recommended-events', label: 'Recommended Events', icon: Calendar },
        { id: 'my-events', label: 'My Events', icon: Calendar },
      ],
      judge: [
        { id: 'judging', label: 'Judging Center', icon: Gavel },
        { id: 'rubrics', label: 'Rubrics', icon: FileCheck },
        { id: 'invitations', label: 'Judge Invitations', icon: Mail },
        { id: 'leaderboard', label: 'Live Leaderboard', icon: Trophy },
        { id: 'recommended-events', label: 'Recommended Events', icon: Calendar },
        { id: 'my-events', label: 'My Events', icon: Calendar },
        { id: 'feedback', label: 'Rate Experience', icon: MessageSquare },
      ],
      speaker: [
        { id: 'speaking', label: 'My Speaking Sessions', icon: Mic },
        { id: 'speaker-invitations', label: 'Speaker Invitations', icon: Mail },
        { id: 'recommended-events', label: 'Recommended Events', icon: Calendar },
        { id: 'my-events', label: 'My Events', icon: Calendar },
        { id: 'speaker-feedback', label: 'Rate Experience', icon: MessageSquare },
      ],
    }
    
    // Return menu items for current effective role
    return menuByRole[effectiveRole] || menuByRole.mentor
  }

  const navItems = getNavItems()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Toast Notification */}
      {notification && (
        <Toast
          message={notification.message}
          isVisible={!!notification}
          onClose={() => setNotification(null)}
          type={notification.type}
        />
      )}
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl font-bold text-tamu-maroon">Industry Partner Portal</h1>
          <p className="text-sm text-gray-600 mt-1">CMIS Engagement Platform</p>
          <p className="text-xs text-gray-500 mt-1 capitalize">View: {effectiveRole}</p>
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
          <button
            onClick={() => {
              localStorage.removeItem('authToken')
              localStorage.removeItem('user')
              window.location.href = '/'
            }}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
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
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800">Judging Center</h2>
                        <p className="text-gray-600">Review and score team submissions</p>
                      </div>
                      <button
                        onClick={() => {
                          console.log('🔄 Manual refresh - Current teams:', teams)
                          // Force component to check for updates
                          window.dispatchEvent(new Event('storage'))
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-tamu-maroon text-white rounded-lg hover:bg-tamu-maroon-light transition-colors text-sm"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                      </button>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Your Assigned Teams:</strong> You have {teams.filter(t => {
                          const hasFiles = t.files && t.files.length > 0
                          const hasFileName = t.fileName
                          const isSubmitted = t.fileSubmitted
                          return (isSubmitted || hasFiles || hasFileName) && (hasFiles || hasFileName)
                        }).length} teams with submissions out of {teams.length} total teams.
                        Click on a team to open the scoring panel with range sliders.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {(() => {
                      // VERY SIMPLE filter: Show ANY team with ANY submission indicator
                      const teamsWithSubmissions = teams.filter(team => {
                        const hasFiles = team.files && Array.isArray(team.files) && team.files.length > 0
                        const hasFileName = team.fileName && String(team.fileName).trim() !== '' && team.fileName !== null && team.fileName !== undefined
                        const isSubmitted = team.fileSubmitted === true
                        
                        return hasFiles || hasFileName || isSubmitted
                      })
                      
                      console.log('📊 Judging Center - Filtering teams:', {
                        totalTeams: teams.length,
                        teamsWithSubmissions: teamsWithSubmissions.length,
                        showingTeamIds: teamsWithSubmissions.map(t => `${t.id} (${t.name})`),
                        allTeamIds: teams.map(t => `${t.id} (${t.name})`)
                      })
                      
                      if (teamsWithSubmissions.length === 0) {
                        return (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                            <p className="text-yellow-800">No team submissions available yet. Submissions will appear here when students upload their files.</p>
                            <p className="text-sm text-yellow-700 mt-2">Total teams in system: {teams.length}</p>
                          </div>
                        )
                      }
                      
                      return teamsWithSubmissions.map((team) => {
                        const teamFiles = team.files || (team.fileName ? [{ name: team.fileName, uploadDate: team.submittedAt }] : [])
                        const getFileIcon = (fileName) => {
                          const ext = fileName.split('.').pop()?.toLowerCase()
                          if (ext === 'pdf') return <FileText className="w-5 h-5 text-red-600" />
                          if (ext === 'pptx' || ext === 'ppt') return <Presentation className="w-5 h-5 text-orange-600" />
                          if (ext === 'docx' || ext === 'doc') return <FileText className="w-5 h-5 text-blue-600" />
                          return <File className="w-5 h-5 text-gray-600" />
                        }
                        
                        return (
                          <motion.div
                            key={team.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                  {team.name}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span>Members: {team.members?.join(', ') || 'N/A'}</span>
                                  <span className="text-gray-400">•</span>
                                  <span>Current Score: {team.score ? `${team.score.toFixed(1)}/50` : 'Not scored'}</span>
                                  {team.submittedAt && (
                                    <>
                                      <span className="text-gray-400">•</span>
                                      <span>Submitted: {new Date(team.submittedAt).toLocaleDateString()}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleScoreTeam(team)}
                                className="bg-tamu-maroon text-white px-6 py-2 rounded-lg font-medium"
                              >
                                {team.score ? 'Update Score' : 'Score Team'}
                              </motion.button>
                            </div>

                            {/* Submitted Files Section */}
                            {teamFiles.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                  <FolderOpen className="w-4 h-4" />
                                  Submitted Files ({teamFiles.length})
                                </h4>
                                <div className="space-y-2">
                                  {teamFiles.map((file, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                                    >
                                      <div className="flex-shrink-0">
                                        {getFileIcon(file.name)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-tamu-maroon transition-colors">
                                          {file.name}
                                        </p>
                                        {file.uploadDate && (
                                          <p className="text-xs text-gray-500">
                                            Uploaded: {new Date(file.uploadDate).toLocaleString()}
                                          </p>
                                        )}
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          // In a real app, this would download the file
                                          alert(`Downloading ${file.name}...`)
                                        }}
                                        className="flex-shrink-0 p-2 text-gray-400 hover:text-tamu-maroon transition-colors"
                                      >
                                        <Download className="w-4 h-4" />
                                      </button>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {teamFiles.length === 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500 italic">No files submitted yet</p>
                              </div>
                            )}
                          </motion.div>
                        )
                      })
                    })()}
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

              {/* Recommended Events */}
              {activeTab === 'recommended-events' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Recommended Events</h2>
                    <p className="text-gray-600">Discover events that match your interests and expertise</p>
                  </div>
                  <RecommendedEventsWidget />
                </div>
              )}

              {/* My Events (Registered Events) */}
              {activeTab === 'my-events' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">My Events</h2>
                    <p className="text-gray-600">View and manage events you've registered for</p>
                  </div>
                  <MyRegisteredEvents />
                </div>
              )}


              {/* Rate Experience / Feedback - Judge */}
              {activeTab === 'feedback' && (
                <JudgeFeedbackList />
              )}

              {/* Rate Experience / Feedback - Speaker */}
              {activeTab === 'speaker-feedback' && (
                <SpeakerFeedbackList />
              )}

              {/* Mentorship - Full MentorDashboard Functionality */}
              {activeTab === 'mentorship' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Mentorship Requests</h2>
                    <p className="text-gray-600">Manage mentorship connections with students</p>
                  </div>

                  {/* Tabs (Pending, Accepted, Declined, All) */}
                  <div className="bg-white rounded-xl shadow-md p-2">
                    <div className="flex gap-2">
                      {[
                        { id: 'pending', label: 'Pending', count: getReceivedRequests(selectedMentorId).filter(r => r.status === 'pending').length },
                        { id: 'accepted', label: 'Accepted', count: getReceivedRequests(selectedMentorId).filter(r => r.status === 'accepted').length },
                        { id: 'declined', label: 'Declined', count: getReceivedRequests(selectedMentorId).filter(r => r.status === 'declined').length },
                        { id: 'all', label: 'All Requests', count: getReceivedRequests(selectedMentorId).length }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setMentorActiveTab(tab.id)}
                          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                            mentorActiveTab === tab.id
                              ? 'bg-tamu-maroon text-white shadow-md'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {tab.label}
                          {tab.count > 0 && (
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                              mentorActiveTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                            }`}>
                              {tab.count}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Requests List */}
                  {mentorshipRequests.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-xl shadow-md p-12 text-center"
                    >
                      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No {mentorActiveTab !== 'all' ? mentorActiveTab : ''} requests
                      </h3>
                      <p className="text-gray-500">
                        {mentorActiveTab === 'pending' 
                          ? "You don't have any pending mentorship requests at the moment."
                          : `You don't have any ${mentorActiveTab} requests.`
                        }
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {mentorshipRequests.map((request, index) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start gap-4">
                                {/* Student Avatar */}
                                <div className="w-16 h-16 bg-gradient-to-br from-tamu-maroon to-tamu-maroon-light rounded-full flex items-center justify-center text-white text-xl font-bold">
                                  {(request.studentName || request.student_name || 'Student').split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                
                                {/* Student Info */}
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {request.studentName || request.student_name || 'Student'}
                                  </h3>
                                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Mail className="w-4 h-4" />
                                      {request.studentEmail || request.student_email || 'N/A'}
                                    </div>
                                    {(request.studentMajor || request.student_major) && (
                                      <div className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4" />
                                        {request.studentMajor || request.student_major}
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {new Date(request.created_at || request.requestedAt || request.createdAt || Date.now()).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Status Badge */}
                              <div>
                                {request.status === 'pending' && (
                                  <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                    <Clock className="w-4 h-4" />
                                    Pending
                                  </span>
                                )}
                                {request.status === 'accepted' && (
                                  <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Accepted
                                  </span>
                                )}
                                {request.status === 'declined' && (
                                  <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                                    <X className="w-4 h-4" />
                                    Declined
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Message */}
                            {(request.message || request.requestMessage) && (
                              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <p className="text-gray-700 italic">"{request.message || request.requestMessage}"</p>
                              </div>
                            )}

                            {/* Skills */}
                            {(request.studentSkills || request.student_skills || []).length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {(request.studentSkills || request.student_skills || []).map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 text-xs font-medium bg-tamu-maroon/10 text-tamu-maroon rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Action Buttons (only for pending requests) */}
                            {request.status === 'pending' && (
                              <div className="flex gap-3 pt-2">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleMentorAccept(request.id)}
                                  disabled={processingId === request.id}
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {processingId === request.id ? (
                                    <>
                                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="w-5 h-5" />
                                      Confirm & Schedule
                                    </>
                                  )}
                                </motion.button>

                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleMentorDecline(request.id)}
                                  disabled={processingId === request.id}
                                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <X className="w-5 h-5" />
                                  Decline
                                </motion.button>
                              </div>
                            )}

                            {/* Session Details (for confirmed sessions) */}
                            {request.status === 'confirmed' && request.sessionStatus === 'confirmed' && (
                              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Calendar className="w-5 h-5 text-blue-600" />
                                  <h4 className="font-semibold text-blue-900">Session Scheduled</h4>
                                </div>
                                <div className="space-y-2 text-sm text-blue-800">
                                  {request.meetingTime && (
                                    <p>
                                      <strong>Time:</strong> {new Date(request.meetingTime).toLocaleString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  )}
                                  {request.meetingLink && (
                                    <p>
                                      <strong>Meeting Link:</strong>{' '}
                                      <a 
                                        href={request.meetingLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        {request.meetingLink}
                                      </a>
                                    </p>
                                  )}
                                  {request.calendarLink && (
                                    <a
                                      href={request.calendarLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                      <Calendar className="w-4 h-4" />
                                      Add to Google Calendar
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Status Message (for accepted/declined) */}
                            {request.status !== 'pending' && request.status !== 'confirmed' && request.updated_at && (
                              <div className={`mt-4 p-3 rounded-lg ${
                                request.status === 'accepted' 
                                  ? 'bg-green-50 text-green-800' 
                                  : 'bg-gray-50 text-gray-600'
                              }`}>
                                <p className="text-sm font-medium">
                                  {request.status === 'accepted' 
                                    ? `✓ You accepted this request on ${new Date(request.updated_at).toLocaleDateString()}`
                                    : `You declined this request on ${new Date(request.updated_at).toLocaleDateString()}`
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
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

      {/* Session Confirmation Modal (for mentors) */}
      {selectedRequest && (
        <SessionConfirmationModal
          request={selectedRequest}
          isOpen={confirmModalOpen}
          onClose={() => {
            setConfirmModalOpen(false)
            setSelectedRequest(null)
          }}
          onSuccess={handleConfirmSession}
        />
      )}
    </div>
  )
}

