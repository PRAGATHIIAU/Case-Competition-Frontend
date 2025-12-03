import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, Loader2, AlertCircle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { getAdminParticipantFlag } from '../utils/adminParticipant'

export default function LoginForm({ onLoginSuccess, onClose = null, loginContext = 'general' }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Reset form when the login context changes (user clicked different portal)
  useEffect(() => {
    setFormData({
      email: '',
      password: ''
    })
    setError('')
    setIsLoading(false)
  }, [loginContext])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error when user types
    if (error) setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      console.log('🔐 Attempting login...', { email: formData.email, context: loginContext })
      
      const adminContexts = ['admin', 'faculty']
      const normalizedContext = typeof loginContext === 'string' ? loginContext.toLowerCase() : 'general'
      const shouldUseAdminApi = adminContexts.includes(normalizedContext)
      
      // Call login API (admin/faculty portals use Case-Competition backend)
      const loginResponse = shouldUseAdminApi
        ? await api.admin.login(formData.email, formData.password)
        : await api.auth.login(formData.email, formData.password)
      
      console.log('✅ Login API response:', loginResponse)
      
      // Extract token and user/admin payload
      const token = loginResponse?.token
      const rawUser = loginResponse?.user || loginResponse?.admin || loginResponse
      const user = rawUser ? { ...rawUser } : null
      
      if (!token) {
        throw new Error('No token received from server')
      }
      
      if (!user) {
        throw new Error('No user data returned from server')
      }

      const adminParticipantFlag = getAdminParticipantFlag(user.email)
      if (adminParticipantFlag === true) {
        user.isParticipant = true
        user.userType = user.userType || user.role || 'admin'
      }
      
      // Map userType to role for frontend compatibility
      if (user && !user.role && user.userType) {
        user.role = user.userType
      }
      if (user && !user.userType && user.role) {
        user.userType = user.role
      }
      
      const normalizeBool = (value) => {
        if (value === undefined || value === null) return false
        if (typeof value === 'string') {
          return ['true', 'yes', '1'].includes(value.trim().toLowerCase())
        }
        return Boolean(value)
      }

      // Get user role from response (check userType first, then role, then default)
      let userRole = user?.userType || user?.role || 'student'
      const alumniSignals =
        !!user?.isMentor ||
        !!user?.isJudge ||
        !!user?.isSpeaker ||
        (typeof user?.willing_to_be_mentor === 'string' && user.willing_to_be_mentor.toLowerCase() === 'yes') ||
        (typeof user?.willing_to_be_judge === 'string' && user.willing_to_be_judge.toLowerCase() === 'yes')

      if ((userRole?.toLowerCase() === 'student' || !userRole) && alumniSignals) {
        userRole = 'alumni'
      }

      console.log('👤 User role:', userRole)

      const normalizedRole = (userRole || '').toLowerCase()
      const contextRoleMap = {
        student: ['student'],
        alumni: ['alumni', 'mentor', 'judge', 'guest_speaker'],
        admin: ['admin', 'faculty'],
        faculty: ['faculty', 'admin'],
      }
      const allowedRoles =
        loginContext?.toLowerCase?.() === 'alumni'
          ? null
          : contextRoleMap[loginContext?.toLowerCase?.()] || null
      if (allowedRoles && !allowedRoles.includes(normalizedRole)) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        const contextLabel = loginContext === 'alumni'
          ? 'Alumni/Industry'
          : loginContext?.charAt(0)?.toUpperCase() + loginContext?.slice(1) || 'selected'
        throw new Error(
          `These credentials are registered as "${userRole}". Please login through the ${contextLabel} portal with the matching account.`
        )
      }

      let derivedIsMentor =
        normalizeBool(user.isMentor) ||
        normalizeBool(user.is_mentor) ||
        normalizeBool(user.willing_to_be_mentor)
      let derivedIsJudge =
        normalizeBool(user.isJudge) ||
        normalizeBool(user.is_judge) ||
        normalizeBool(user.willing_to_be_judge)
      let derivedIsSpeaker =
        normalizeBool(user.isSpeaker) ||
        normalizeBool(user.is_speaker) ||
        normalizeBool(user.willing_to_be_speaker)

      if (!derivedIsMentor && !derivedIsJudge && !derivedIsSpeaker && normalizedRole === 'alumni') {
        derivedIsMentor = true
      }

      user.isMentor = derivedIsMentor
      user.isJudge = derivedIsJudge
      user.isSpeaker = derivedIsSpeaker

      // Store token and user data (after successful validation and normalization)
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      console.log('💾 Token and user data stored:', {
        userType: user.userType,
        role: user.role,
        isMentor: user.isMentor,
        isJudge: user.isJudge,
        isSpeaker: user.isSpeaker,
      })

      // Role-based redirect
      // SPECIAL: Faculty and Admin share login - redirect based on their actual role
      let redirectPath = '/'
      
      // Always redirect based on user's actual role, not which portal they clicked
      switch (userRole.toLowerCase()) {
        case 'student':
          redirectPath = '/student/dashboard'
          break
        case 'mentor':
          redirectPath = '/alumni/dashboard' // Industry Partner Portal (unified)
          break
        case 'alumni':
          // Unified Identity: Alumni with multiple roles go to unified dashboard
          redirectPath = '/alumni/dashboard'
          break
        case 'judge':
        case 'guest_speaker':
          // All industry partner roles go to alumni dashboard (unified)
          redirectPath = '/alumni/dashboard'
          break
        case 'faculty':
          redirectPath = '/faculty/dashboard'
          break
        case 'admin':
          redirectPath = '/admin/dashboard'
          break
        default:
          console.warn('⚠️ Unknown role, defaulting to student dashboard')
          redirectPath = '/student/dashboard'
      }

      console.log('🚀 Redirecting to:', redirectPath)
      
      // Call onLoginSuccess callback if provided
      if (onLoginSuccess) {
        onLoginSuccess(user)
      }

      // Navigate to appropriate dashboard
      navigate(redirectPath)
      
    } catch (error) {
      console.error('❌ Login failed:', error)
      setError(error.message || 'Invalid email or password. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative"
    >
      {/* Close Button */}
      {onClose && (
        <button
          onClick={() => {
            // Clear form data when closing
            setFormData({
              email: '',
              password: ''
            })
            setError('')
            setIsLoading(false)
            onClose()
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close login form"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-tamu-maroon/10 rounded-full mb-4">
          <LogIn className="w-8 h-8 text-tamu-maroon" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
        {loginContext && loginContext !== 'general' ? (
          <p className="text-gray-600 capitalize">
            Logging into the <span className="font-semibold text-tamu-maroon">{loginContext}</span> portal
          </p>
        ) : (
          <p className="text-gray-600">Access your dashboard</p>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
              placeholder="your.email@tamu.edu"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          className={`w-full py-3 px-4 bg-tamu-maroon text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            isLoading
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:bg-tamu-maroon-light shadow-md hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="#" className="text-tamu-maroon hover:underline font-medium">
            Contact Administrator
          </a>
        </p>
      </div>
    </motion.div>
  )
}

