import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  UserCheck, 
  GraduationCap,
  Calendar, 
  Star,
  TrendingUp,
  MessageSquare,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'
import api from '../../services/api'

const COLORS = ['#500000', '#8B0000', '#A0522D', '#CD853F', '#D2691E']

export default function AdminAnalyticsDashboard() {
  const { getSystemAnalytics, competitions } = useMockData()
  const CustomMentorTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null

    const nonZero = payload.filter((entry) => Number(entry.value) > 0)
    if (nonZero.length === 0) return null

    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-3 text-sm">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {nonZero.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-gray-600">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              {entry.name}
            </span>
            <span className="font-medium text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    setError(null)
    try {
      const [systemResult, mentorEngagementResult] = await Promise.allSettled([
        getSystemAnalytics(),
        api.admin.getMentorEngagement(),
      ])

      if (systemResult.status === 'fulfilled' && systemResult.value?.success) {
        const baseAnalytics = systemResult.value.analytics || {}
        const mentorData = mentorEngagementResult.status === 'fulfilled' ? mentorEngagementResult.value : null

        const nextAnalytics = mentorData
          ? {
              ...baseAnalytics,
              users: {
                ...(baseAnalytics.users || {}),
                totalMentors:
                  mentorData.totalMentors ??
                  baseAnalytics.users?.totalMentors ??
                  0,
                activeMentors:
                  mentorData.activeMentors ??
                  baseAnalytics.users?.activeMentors ??
                  0,
                inactiveMentors:
                  mentorData.inactiveMentors ??
                  baseAnalytics.users?.inactiveMentors ??
                  0,
              },
              mentorEngagement: mentorData,
            }
          : baseAnalytics

        if (mentorEngagementResult.status === 'rejected') {
          console.warn('⚠️ Failed to load mentor engagement analytics:', mentorEngagementResult.reason)
        }

        setAnalytics(nextAnalytics)
      } else {
        const message =
          systemResult.status === 'fulfilled'
            ? systemResult.value?.message || 'Failed to load analytics'
            : systemResult.reason?.message || 'Failed to load analytics'
        setError(message)
        setToastMessage(message)
        setShowToast(true)
      }
    } catch (err) {
      setError(err.message || 'Failed to load analytics')
      setToastMessage(err.message || 'Failed to load analytics')
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }

  // Prepare data for charts
  const mentorStats = analytics
    ? analytics.mentorEngagement || {
        totalMentors: analytics.users?.totalMentors ?? 0,
        activeMentors: analytics.users?.activeMentors ?? 0,
        inactiveMentors: Math.max(
          (analytics.users?.totalMentors ?? 0) - (analytics.users?.activeMentors ?? 0),
          0
        ),
        acceptedRequests: analytics.engagement?.totalConnections ?? 0,
        pendingRequests: 0,
        rejectedRequests: 0,
      }
    : {
        totalMentors: 0,
        activeMentors: 0,
        inactiveMentors: 0,
        acceptedRequests: 0,
        pendingRequests: 0,
        rejectedRequests: 0,
      }

  const mentorshipChartData = [
    {
      category: 'Mentors',
      activeMentors: mentorStats.activeMentors ?? 0,
      inactiveMentors:
        mentorStats.inactiveMentors ??
        Math.max((mentorStats.totalMentors ?? 0) - (mentorStats.activeMentors ?? 0), 0),
      acceptedRequests: 0,
      pendingRequests: 0,
      rejectedRequests: 0,
    },
    {
      category: 'Mentorship Requests',
      activeMentors: 0,
      inactiveMentors: 0,
      acceptedRequests: mentorStats.acceptedRequests ?? 0,
      pendingRequests: mentorStats.pendingRequests ?? 0,
      rejectedRequests: mentorStats.rejectedRequests ?? 0,
    },
  ]

  const feedbackChartData = analytics ? [
    {
      name: 'Student Satisfaction',
      rating: analytics.feedback.studentAvg,
      count: analytics.feedback.studentCount
    },
    {
      name: 'Employer Satisfaction',
      rating: analytics.feedback.employerAvg,
      count: analytics.feedback.employerCount
    }
  ] : []

  const userTypeChartData = analytics ? [
    {
      name: 'Students',
      value: analytics.users.totalStudents,
      color: '#500000'
    },
    {
      name: 'Alumni',
      value: analytics.users.totalAlumni,
      color: '#8B0000'
    },
    {
      name: 'Faculty',
      value: analytics.users.totalFaculty,
      color: '#A0522D'
    }
  ] : []

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCompetitionName = (competitionId) => {
    const competition = competitions.find(c => c.id === competitionId)
    return competition ? competition.name : `Competition #${competitionId}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tamu-maroon"></div>
      </div>
    )
  }

  if (error && !analytics) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadAnalytics}
          className="mt-4 px-4 py-2 bg-tamu-maroon text-white rounded-lg hover:bg-tamu-maroon-light transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="error"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">System Analytics Dashboard</h2>
          <p className="text-gray-600">Monitor platform engagement and feedback</p>
        </div>
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 bg-tamu-maroon text-white rounded-lg hover:bg-tamu-maroon-light transition-colors flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* SECTION 1: At a Glance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-800">
                {analytics?.users.totalStudents || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Mentors</p>
              <p className="text-3xl font-bold text-gray-800">
                {mentorStats.totalMentors ?? analytics?.users.activeMentors ?? 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Alumni</p>
              <p className="text-3xl font-bold text-gray-800">
                {analytics?.users.totalAlumni || 0}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Events Hosted</p>
              <p className="text-3xl font-bold text-gray-800">
                {analytics?.engagement.totalEvents || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Event Rating</p>
              <p className="text-3xl font-bold text-gray-800">
                {analytics?.feedback.studentAvg ? analytics.feedback.studentAvg.toFixed(1) : '0.0'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(analytics?.feedback.studentAvg || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* SECTION 2: Mentor engagement and User Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mentor engagement chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-tamu-maroon" />
            <h3 className="text-xl font-semibold text-gray-800">Mentor Engagement Overview</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={mentorshipChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomMentorTooltip />} />
              <Legend />
              <Bar
                dataKey="activeMentors"
                stackId="mentors"
                fill="#7f1d1d"
                name="Active Mentors"
              />
              <Bar
                dataKey="inactiveMentors"
                stackId="mentors"
                fill="#fecdd3"
                name="Inactive Mentors"
              />
              <Bar
                dataKey="acceptedRequests"
                stackId="requests"
                fill="#500000"
                name="Accepted Requests"
              />
              <Bar
                dataKey="pendingRequests"
                stackId="requests"
                fill="#991b1b"
                name="Pending Requests"
              />
              <Bar
                dataKey="rejectedRequests"
                stackId="requests"
                fill="#f87171"
                name="Rejected Requests"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart: User Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-tamu-maroon" />
            <h3 className="text-xl font-semibold text-gray-800">User Types</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userTypeChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {userTypeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-center">
            <div>
              <p className="text-gray-600">Students</p>
              <p className="font-semibold text-gray-800">{analytics?.users.totalStudents || 0}</p>
            </div>
            <div>
              <p className="text-gray-600">Alumni</p>
              <p className="font-semibold text-gray-800">{analytics?.users.totalAlumni || 0}</p>
            </div>
            <div>
              <p className="text-gray-600">Faculty</p>
              <p className="font-semibold text-gray-800">{analytics?.users.totalFaculty || 0}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SECTION 3: Feedback Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-tamu-maroon" />
          <h3 className="text-xl font-semibold text-gray-800">Feedback Overview</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={feedbackChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="rating" fill="#500000" name="Average Rating" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-600">Student Feedback</p>
            <p className="text-lg font-semibold text-gray-800">
              {analytics?.feedback.studentCount || 0} responses
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Employer Feedback</p>
            <p className="text-lg font-semibold text-gray-800">
              {analytics?.feedback.employerCount || 0} responses
            </p>
          </div>
        </div>
      </motion.div>

      {/* SECTION 3: Recent Feedback List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-tamu-maroon" />
          <h3 className="text-xl font-semibold text-gray-800">Recent Employer Feedback</h3>
        </div>
        {analytics?.recentFeedback && analytics.recentFeedback.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {analytics.recentFeedback.map((feedback) => (
              <div
                key={feedback.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {getCompetitionName(feedback.competitionId)}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(feedback.submittedAt)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < feedback.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {feedback.rating}/5
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{feedback.comments}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No feedback available yet</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

