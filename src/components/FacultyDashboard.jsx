import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Users, TrendingUp, LogOut, Activity, Clock, Calendar, Trophy, Mail, BookOpen, UserCheck, Settings } from 'lucide-react'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { mockEngagementData, mockAlumniVsStudent, mockLiveFeed } from '../data/mockData'
import AdminEventForm from './admin/AdminEventForm'
import CompetitionForm from './admin/CompetitionForm'
import StakeholderInvitationsList from './admin/StakeholderInvitationsList'
import CreateLectureForm from './admin/CreateLectureForm'
import LectureAttendanceManagement from './admin/LectureAttendanceManagement'
import AdminAnalyticsDashboard from './admin/AdminAnalyticsDashboard'
import InactiveAlumniList from './admin/InactiveAlumniList'
import SearchInput from './common/SearchInput'

export default function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [liveFeed, setLiveFeed] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLiveFeed(mockLiveFeed)
      setLoading(false)
    }, 500)
  }, [])

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'inactive-alumni', label: 'Inactive Alumni', icon: Users },
    { id: 'events', label: 'Create Event', icon: Calendar },
    { id: 'lectures', label: 'Create Lecture', icon: BookOpen },
    { id: 'attendance', label: 'Attendance Management', icon: UserCheck },
    { id: 'competitions', label: 'Create Competition', icon: Trophy },
    { id: 'invitations', label: 'Judge Invitations', icon: Mail },
  ]

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const diff = Math.floor((now - timestamp) / 1000)
    if (diff < 60) return `${diff} seconds ago`
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    return `${Math.floor(diff / 3600)} hours ago`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl font-bold text-tamu-maroon">Faculty & Admin Hub</h1>
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
        <div className="p-4 border-t border-gray-200 flex-shrink-0 space-y-2">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
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
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Platform Overview</h2>
                    <p className="text-gray-600">Analytics, tracking, and event management</p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Charts - Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Engagement Trends Chart */}
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <TrendingUp className="w-6 h-6 text-tamu-maroon" />
                          <h3 className="text-2xl font-semibold text-gray-800">Engagement Trends</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={mockEngagementData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                              }}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="engagement"
                              stroke="#500000"
                              strokeWidth={3}
                              name="Engagement Score"
                              dot={{ fill: '#500000', r: 5 }}
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        <p className="text-sm text-gray-500 mt-4 text-center">
                          Engagement trends showing spikes during major events
                        </p>
                      </div>

                      {/* Alumni vs Student Participation Chart */}
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Users className="w-6 h-6 text-tamu-maroon" />
                          <h3 className="text-2xl font-semibold text-gray-800">Alumni vs Student Participation</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={350}>
                          <PieChart>
                            <Pie
                              data={mockAlumniVsStudent}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={120}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {mockAlumniVsStudent.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-6 flex flex-wrap justify-center gap-4">
                          {mockAlumniVsStudent.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <span className="text-sm text-gray-700">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Live Feed - Right Column */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                        <div className="flex items-center gap-3 mb-6">
                          <Activity className="w-6 h-6 text-tamu-maroon" />
                          <h3 className="text-xl font-semibold text-gray-800">Live Feed</h3>
                        </div>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                          <AnimatePresence>
                            {liveFeed.map((item) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${
                                    item.type === 'submission' ? 'bg-blue-500' :
                                    item.type === 'sponsor' ? 'bg-green-500' :
                                    item.type === 'mentorship' ? 'bg-purple-500' :
                                    item.type === 'event' ? 'bg-orange-500' :
                                    'bg-red-500'
                                  }`}></div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{item.action}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                      <Clock className="w-3 h-3" />
                                      {formatTimeAgo(item.timestamp)}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <AdminAnalyticsDashboard />
              )}

              {/* Events Tab */}
              {activeTab === 'events' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Event</h2>
                    <p className="text-gray-600">Create events and automatically notify matching students</p>
                  </div>
                  
                  <AdminEventForm />
                </div>
              )}

              {/* Lectures Tab */}
              {activeTab === 'lectures' && (
                <CreateLectureForm />
              )}

              {/* Attendance Management Tab */}
              {activeTab === 'attendance' && (
                <LectureAttendanceManagement />
              )}

              {/* Competitions Tab */}
              {activeTab === 'competitions' && (
                <CompetitionForm />
              )}

              {/* Inactive Alumni Tab */}
              {activeTab === 'inactive-alumni' && (
                <InactiveAlumniList />
              )}

              {/* Invitations Tab */}
              {activeTab === 'invitations' && (
                <StakeholderInvitationsList />
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

