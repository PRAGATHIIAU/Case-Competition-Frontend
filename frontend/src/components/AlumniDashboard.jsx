import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Gavel, Mic, LogOut, Settings, ChevronDown, Check } from 'lucide-react'
import IndustryDashboard from './IndustryDashboard'

/**
 * Unified Alumni Dashboard with Role Switcher
 * Allows alumni users to switch between different role views (Mentor, Judge, Speaker)
 * based on their isMentor, isJudge, isSpeaker flags
 */
export default function AlumniDashboard() {
  const [user, setUser] = useState(null)
  // Load saved view from localStorage, or default to 'mentor'
  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem('alumniDashboardView')
    return savedView || 'mentor'
  })
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false)
  const [availableRoles, setAvailableRoles] = useState([])

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        setUser(userData)
        
        // Determine available roles based on flags
        const roles = []
        if (userData.isMentor) roles.push({ id: 'mentor', label: 'Mentor View', icon: Users })
        if (userData.isJudge) roles.push({ id: 'judge', label: 'Judge View', icon: Gavel })
        if (userData.isSpeaker) roles.push({ id: 'speaker', label: 'Speaker View', icon: Mic })
        
        setAvailableRoles(roles)
        
        // Load saved view from localStorage, or set to first available role
        const savedView = localStorage.getItem('alumniDashboardView')
        if (savedView && roles.find(r => r.id === savedView)) {
          // Use saved view if it's still valid
          setCurrentView(savedView)
        } else if (roles.length > 0) {
          // Otherwise use first available role
          const defaultView = roles[0].id
          setCurrentView(defaultView)
          localStorage.setItem('alumniDashboardView', defaultView)
        }
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [])

  // Save view to localStorage whenever it changes
  const handleViewChange = (newView) => {
    setCurrentView(newView)
    localStorage.setItem('alumniDashboardView', newView)
    console.log('💾 Saved view to localStorage:', newView)
  }

  // If no user or no roles available, show error
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please login to continue</p>
          <Link to="/" className="text-tamu-maroon hover:underline mt-2 inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  if (availableRoles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-md p-8 max-w-md">
          <p className="text-gray-600 mb-4">
            No roles assigned. Please contact administrator to enable your roles.
          </p>
          <Link to="/settings" className="text-tamu-maroon hover:underline">
            Go to Settings
          </Link>
        </div>
      </div>
    )
  }

  // Get current role label
  const currentRoleLabel = availableRoles.find(r => r.id === currentView)?.label || 'Alumni Dashboard'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Role Switcher Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-tamu-maroon">Alumni Dashboard</h1>
              <p className="text-sm text-gray-600">Unified Portal for All Your Roles</p>
            </div>
            
            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-2 px-4 py-2 bg-tamu-maroon text-white rounded-lg hover:bg-tamu-maroon-light transition-colors"
              >
                <span>{currentRoleLabel}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showRoleSwitcher ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showRoleSwitcher && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowRoleSwitcher(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  >
                    <div className="py-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                        Switch View
                      </div>
                      {availableRoles.map((role) => {
                        const Icon = role.icon
                        return (
                          <button
                            key={role.id}
                            onClick={() => {
                              handleViewChange(role.id)
                              setShowRoleSwitcher(false)
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                              currentView === role.id ? 'bg-tamu-maroon/10' : ''
                            }`}
                          >
                            <Icon className="w-5 h-5 text-tamu-maroon" />
                            <span className="flex-1 text-gray-700">{role.label}</span>
                            {currentView === role.id && (
                              <Check className="w-5 h-5 text-tamu-maroon" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Render appropriate dashboard based on current view */}
      <div className="min-h-screen">
        {/* Pass currentView as prop to IndustryDashboard so it can adjust its default tab */}
        <IndustryDashboard currentView={currentView} />
      </div>
    </div>
  )
}

