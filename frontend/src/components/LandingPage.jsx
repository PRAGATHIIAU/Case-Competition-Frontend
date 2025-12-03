import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Building2, BarChart3, Users, Gavel, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import Toast from './Toast'

export default function LandingPage() {
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [toast, setToast] = useState(null)

  // Check if user is already logged in and redirect to their dashboard
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    const token = localStorage.getItem('authToken')
    
    if (userStr && token) {
      try {
        const user = JSON.parse(userStr)
        const role = user.role || 'student'
        
        // Redirect to appropriate dashboard based on role
        let dashboardPath = '/student/dashboard'
        
        switch (role.toLowerCase()) {
          case 'student':
            dashboardPath = '/student/dashboard'
            break
          case 'mentor':
          case 'alumni':
          case 'judge':
          case 'guest_speaker':
            // All industry partner roles go to unified Alumni Dashboard
            dashboardPath = '/alumni/dashboard'
            break
          case 'faculty':
            dashboardPath = '/faculty/dashboard'
            break
          case 'admin':
            dashboardPath = '/admin/dashboard'
            break
          default:
            dashboardPath = '/student/dashboard'
        }
        
        console.log(`✅ User already logged in as ${role}, redirecting to ${dashboardPath}`)
        navigate(dashboardPath, { replace: true })
      } catch (e) {
        console.error('Error parsing user data:', e)
        // Clear invalid data
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
      }
    }
  }, [navigate])

  const [loginContext, setLoginContext] = useState('general')

  const openLoginModal = (context = 'general', roleName = '') => {
    setLoginContext(context)
    setToast({
      message: `Please login to continue.${roleName ? ` This portal is for ${roleName} users.` : ''}`,
      type: 'error'
    })
    setShowLogin(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header with Login Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex-1"></div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSignup(true)}
                className="px-6 py-3 bg-white text-tamu-maroon border-2 border-tamu-maroon rounded-lg font-semibold hover:bg-tamu-maroon/5 shadow-md hover:shadow-lg transition-all"
              >
                Sign Up
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setLoginContext('general')
                  setShowLogin(true)
                }}
                className="px-6 py-3 bg-tamu-maroon text-white rounded-lg font-semibold hover:bg-tamu-maroon-light shadow-md hover:shadow-lg transition-all"
              >
                Login
              </motion.button>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-tamu-maroon mb-4">
            CMIS Engagement Platform
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Connecting Students, Faculty, Alumni, and Industry Partners
          </p>
          <p className="text-gray-500">Texas A&M University - Mays Business School</p>
        </motion.div>

        {/* Login Modal */}
        <AnimatePresence>
          {showLogin && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowLogin(false)
                }}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowLogin(false)
                    }}
                    className="absolute -top-12 right-0 text-white hover:text-gray-200 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <LoginForm 
                    key={`login-${loginContext}-${showLogin}`} // Force re-render when context changes or modal opens
                    loginContext={loginContext}
                    onClose={() => {
                      setShowLogin(false)
                    }}
                    onLoginSuccess={() => {
                      setShowLogin(false)
                    }} 
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Signup Modal */}
        <AnimatePresence>
          {showSignup && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSignup(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="relative">
                  <button
                    onClick={() => setShowSignup(false)}
                    className="absolute -top-12 right-0 text-white hover:text-gray-200 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <SignupForm 
                    onClose={() => {
                      setShowSignup(false)
                    }}
                    onSignupSuccess={(user) => {
                      setShowSignup(false)
                      if (!user) {
                        // User clicked "Login instead"
                        setLoginContext('general')
                        setShowLogin(true)
                      }
                    }} 
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Portals */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {/* Student Portal - Protected */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              openLoginModal('student', 'Student')
            }}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full"
          >
            <GraduationCap className="w-16 h-16 text-tamu-maroon mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-center mb-2 text-tamu-maroon">Student Portal</h2>
            <p className="text-gray-600 text-center">
              Events, Case Competitions & Career Profile
            </p>
          </motion.div>

          {/* Industry Partner Portal (Alumni/Stakeholder) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              openLoginModal('alumni', 'Alumni/Industry partners')
            }}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full"
          >
            <Building2 className="w-16 h-16 text-tamu-maroon mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-center mb-2 text-tamu-maroon">Alumni Portal</h2>
            <p className="text-gray-600 text-center">
              Unified dashboard for Mentors, Judges, and Speakers
            </p>
          </motion.div>

          {/* Faculty & Admin Hub */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              openLoginModal('admin', 'Faculty/Admin')
            }}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full"
          >
            <BarChart3 className="w-16 h-16 text-tamu-maroon mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-center mb-2 text-tamu-maroon">Faculty & Admin Hub</h2>
            <p className="text-gray-600 text-center">
              Platform analytics, Student tracking, and Event management
            </p>
          </motion.div>
        </div>

      </div>
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

