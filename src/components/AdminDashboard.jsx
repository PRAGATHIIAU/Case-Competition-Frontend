import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Users, TrendingUp, MessageSquare, LogOut, Mail, Filter, AlertTriangle, X } from 'lucide-react'
import EngagementCharts from './admin/EngagementCharts'
import StatsCards from './admin/StatsCards'
import CommunicationCenter from './admin/CommunicationCenter'
import { mockAdminStats, mockEngagementData, mockIndustryInterest } from '../data/mockData'
import { checkEngagementLevel } from '../utils/businessLogic'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [engagementWarning, setEngagementWarning] = useState(null)
  const [warningDismissed, setWarningDismissed] = useState(false)

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setStats(mockAdminStats)
      // Check for low engagement - Trigger when dashboard opens
      const warning = checkEngagementLevel(mockEngagementData)
      setEngagementWarning(warning)
      setLoading(false)
    }, 500)
  }, [])

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'communication', label: 'Communication Center', icon: Mail },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-tamu-maroon">Admin Portal</h1>
          <p className="text-sm text-gray-600 mt-1">CMIS Engagement Platform</p>
        </div>
        <nav className="p-4 space-y-2">
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
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
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
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Analytics</h2>
                    <p className="text-gray-600">Deep dive into engagement trends and patterns</p>
                  </div>
                  <EngagementCharts
                    engagementData={mockEngagementData}
                    industryInterest={mockIndustryInterest}
                  />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

