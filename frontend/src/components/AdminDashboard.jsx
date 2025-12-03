import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Users, TrendingUp, MessageSquare, LogOut, Mail, Filter, AlertTriangle, X, Calendar, BookOpen, UserCheck, Trophy, Settings, Shield, MessageCircle } from 'lucide-react'
import EngagementCharts from './admin/EngagementCharts'
import StatsCards from './admin/StatsCards'
import CommunicationCenter from './admin/CommunicationCenter'
import AdminEventForm from './admin/AdminEventForm'
import CompetitionForm from './admin/CompetitionForm'
import StakeholderInvitationsList from './admin/StakeholderInvitationsList'
import CreateLectureForm from './admin/CreateLectureForm'
import LectureAttendanceManagement from './admin/LectureAttendanceManagement'
import AdminAnalyticsDashboard from './admin/AdminAnalyticsDashboard'
import InactiveAlumniList from './admin/InactiveAlumniList'
import SearchInput from './common/SearchInput'
import { mockAdminStats, mockEngagementData, mockIndustryInterest } from '../data/mockData'
import { checkEngagementLevel } from '../utils/businessLogic'
import { hasPermission, isStudentAssistant, getAccessLevelDescription, PERMISSIONS } from '../utils/permissions'
import { adminAPI, pythonAPI } from '../services/api'
import JudgeCommentsView from './admin/JudgeCommentsView'
import CompetitionScoresView from './admin/CompetitionScoresView'
import JudgeFeedbackView from './admin/JudgeFeedbackView'
import Leaderboard from './judge/Leaderboard'
import { mockTeams } from '../data/mockData'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [engagementWarning, setEngagementWarning] = useState(null)
  const [warningDismissed, setWarningDismissed] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  
  useEffect(() => {
    // Get current user for permission checks
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        setCurrentUser(JSON.parse(userStr))
      }
    } catch (e) {
      console.error('Error parsing user data:', e)
    }
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch dashboard stats from Python backend
      const pythonStats = await pythonAPI.fetchDashboardStats().catch((err) => {
        console.warn('⚠️ Python dashboard stats failed, continuing with backend data', err?.message)
        return null
      })
      const [basicStats, studentEngagement, alumniEngagement] = await Promise.allSettled([
        adminAPI.getBasicStats(),
        adminAPI.getStudentEngagement(),
        adminAPI.getAlumniEngagement(),
      ])
      
      const resolvedBasic = basicStats.status === 'fulfilled' ? basicStats.value : null
      const resolvedStudentEngagement = studentEngagement.status === 'fulfilled' ? studentEngagement.value : null
      const resolvedAlumniEngagement = alumniEngagement.status === 'fulfilled' ? alumniEngagement.value : null
      const pythonData = pythonStats?.success && pythonStats?.data ? pythonStats.data : null

      const activeStudentsValue =
        resolvedStudentEngagement?.activeStudents ??
        pythonData?.activeStudents ??
        mockAdminStats.activeStudents

      const inactiveStudentsValue =
        resolvedStudentEngagement?.inactiveStudents ??
        pythonData?.inactiveStudents ??
        mockAdminStats.inactiveStudents ??
        0

      const totalTrackedStudents = activeStudentsValue + inactiveStudentsValue
      const studentEngagementPercent =
        totalTrackedStudents > 0
          ? Math.round((activeStudentsValue / totalTrackedStudents) * 100)
          : pythonData?.studentEngagementPercent ??
            mockAdminStats.studentEngagementPercent ??
            null

      setStats({
        activeStudents: activeStudentsValue,
        inactiveStudents: inactiveStudentsValue,
        studentEngagementPercent,
        alumniEngagement: resolvedAlumniEngagement?.activeAlumni
          ?? pythonData?.alumniEngagement
          ?? mockAdminStats.alumniEngagement,
        partnerNPS: pythonData?.partnerNPS ?? mockAdminStats.partnerNPS,
        activeEvents: resolvedBasic?.activeEvents
          ?? pythonData?.activeEvents
          ?? mockAdminStats.activeEvents,
        totalStudents: resolvedBasic?.totalStudents ?? mockAdminStats.activeStudents,
        totalAlumni: resolvedBasic?.totalAlumni ?? mockAdminStats.activeStudents,
        inactiveAlumniCount: resolvedBasic?.inactiveAlumniCount ?? mockAdminStats.activeStudents,
      })

      // Check for low engagement - Trigger when dashboard opens
      const warning = checkEngagementLevel(mockEngagementData)
      setEngagementWarning(warning)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Fallback to mock data on error
      setStats(mockAdminStats)
    } finally {
      setLoading(false)
    }
  }

  // Build navigation items based on permissions
  const getNavItems = () => {
    const items = [
      { id: 'overview', label: 'Overview', icon: BarChart3, permission: PERMISSIONS.VIEW_OVERVIEW },
      { id: 'analytics', label: 'Analytics', icon: TrendingUp, permission: PERMISSIONS.VIEW_ANALYTICS },
      { id: 'inactive-alumni', label: 'Inactive Alumni', icon: Users, permission: PERMISSIONS.VIEW_INACTIVE_ALUMNI },
      { id: 'events', label: 'Create Event', icon: Calendar, permission: PERMISSIONS.CREATE_EVENTS },
      { id: 'lectures', label: 'Create Lecture', icon: BookOpen, permission: PERMISSIONS.CREATE_LECTURES },
      { id: 'attendance', label: 'Attendance Management', icon: UserCheck, permission: PERMISSIONS.MANAGE_ATTENDANCE },
      { id: 'competitions', label: 'Create Competition', icon: Trophy, permission: PERMISSIONS.CREATE_COMPETITIONS },
      { id: 'invitations', label: 'Judge Invitations', icon: Mail, permission: PERMISSIONS.MANAGE_JUDGE_INVITATIONS },
      { id: 'communication', label: 'Communication Center', icon: MessageSquare, permission: PERMISSIONS.SEND_REENGAGEMENT_EMAILS },
      // Sensitive pages - only for Faculty and Full Admins
      { id: 'judge-comments', label: 'Judge Comments', icon: MessageCircle, permission: PERMISSIONS.VIEW_JUDGE_COMMENTS },
      { id: 'competition-scores', label: 'Competition Scores', icon: Trophy, permission: PERMISSIONS.VIEW_COMPETITION_SCORES },
      { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp, permission: PERMISSIONS.VIEW_LEADERBOARD },
      { id: 'judge-feedback', label: 'Judge Feedback', icon: MessageSquare, permission: PERMISSIONS.VIEW_JUDGE_FEEDBACK },
    ]
    
    // Filter items based on permissions
    return items.filter(item => hasPermission(item.permission, currentUser))
  }
  
  const navItems = getNavItems()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl font-bold text-tamu-maroon">Admin Portal</h1>
          <p className="text-sm text-gray-600 mt-1">CMIS Engagement Platform</p>
          {currentUser && (
            <div className="mt-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">{getAccessLevelDescription(currentUser)}</span>
            </div>
          )}
          {isStudentAssistant(currentUser) && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              ⚠️ Limited Access: You are a participant and cannot view judge comments or competition scores.
            </div>
          )}
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
            <LogOut className="w-5 h-5" />
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
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
                    <p className="text-gray-600">Key metrics and engagement insights</p>
                  </div>

                  {/* Low Engagement Warning Alert */}
                  <AnimatePresence>
                    {engagementWarning && !warningDismissed && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`rounded-lg shadow-md p-6 border-2 ${
                          engagementWarning.level === 'critical'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-orange-50 border-orange-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <AlertTriangle 
                              className={`w-6 h-6 ${
                                engagementWarning.level === 'critical'
                                  ? 'text-red-600'
                                  : 'text-orange-600'
                              }`}
                            />
                            <div className="flex-1">
                              <h3 className={`text-lg font-semibold mb-2 ${
                                engagementWarning.level === 'critical'
                                  ? 'text-red-800'
                                  : 'text-orange-800'
                              }`}>
                                {engagementWarning.level === 'critical' ? 'Critical Alert' : 'Warning'}
                              </h3>
                              <p className={`text-sm mb-4 ${
                                engagementWarning.level === 'critical'
                                  ? 'text-red-700'
                                  : 'text-orange-700'
                              }`}>
                                {engagementWarning.message}
                              </p>
                              <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Suggested Actions:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {engagementWarning.suggestions.map((suggestion, idx) => (
                                    <li 
                                      key={idx}
                                      className={`text-sm ${
                                        engagementWarning.level === 'critical'
                                          ? 'text-red-600'
                                          : 'text-orange-600'
                                      }`}
                                    >
                                      {suggestion}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setWarningDismissed(true)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Stats Cards */}
                  <StatsCards stats={stats} />

                  {/* Charts */}
                  <EngagementCharts
                    engagementData={mockEngagementData}
                    industryInterest={mockIndustryInterest}
                  />
                </div>
              )}

              {activeTab === 'communication' && (
                <div>
                  <CommunicationCenter />
                </div>
              )}

              {activeTab === 'analytics' && (
                <AdminAnalyticsDashboard />
              )}

              {/* Events Tab */}
              {activeTab === 'events' && hasPermission('create_event', currentUser) && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Event</h2>
                    <p className="text-gray-600">Create events and automatically notify matching students</p>
                  </div>
                  <AdminEventForm />
                </div>
              )}

              {/* Lectures Tab */}
              {activeTab === 'lectures' && hasPermission('create_lecture', currentUser) && (
                <CreateLectureForm />
              )}

              {/* Attendance Management Tab */}
              {activeTab === 'attendance' && hasPermission('manage_attendance', currentUser) && (
                <LectureAttendanceManagement />
              )}

              {/* Competitions Tab */}
              {activeTab === 'competitions' && hasPermission('create_competition', currentUser) && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Competition</h2>
                    <p className="text-gray-600">
                      {isStudentAssistant(currentUser) 
                        ? 'Create and manage competitions. Note: You cannot view judge comments or scores as you are a participant.'
                        : 'Create and manage case competitions'}
                    </p>
                  </div>
                  <CompetitionForm />
                </div>
              )}

              {/* Inactive Alumni Tab */}
              {activeTab === 'inactive-alumni' && hasPermission('view_inactive_alumni', currentUser) && (
                <InactiveAlumniList />
              )}

              {/* Invitations Tab */}
              {activeTab === 'invitations' && hasPermission(PERMISSIONS.MANAGE_JUDGE_INVITATIONS, currentUser) && (
                <StakeholderInvitationsList />
              )}

              {/* Judge Comments Tab - Only for Faculty and Full Admins */}
              {activeTab === 'judge-comments' && hasPermission(PERMISSIONS.VIEW_JUDGE_COMMENTS, currentUser) && (
                <JudgeCommentsView />
              )}

              {/* Competition Scores Tab - Only for Faculty and Full Admins */}
              {activeTab === 'competition-scores' && hasPermission(PERMISSIONS.VIEW_COMPETITION_SCORES, currentUser) && (
                <CompetitionScoresView />
              )}

              {/* Leaderboard Tab - Only for Faculty and Full Admins */}
              {activeTab === 'leaderboard' && hasPermission(PERMISSIONS.VIEW_LEADERBOARD, currentUser) && (
                <Leaderboard teams={mockTeams} />
              )}

              {/* Judge Feedback Tab - Only for Faculty and Full Admins */}
              {activeTab === 'judge-feedback' && hasPermission(PERMISSIONS.VIEW_JUDGE_FEEDBACK, currentUser) && (
                <JudgeFeedbackView />
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

