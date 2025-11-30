import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, Loader2, AlertCircle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function LoginForm({ onLoginSuccess, requiredRole = null, onClose = null }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Reset form when requiredRole changes (user clicked different portal)
  useEffect(() => {
    setFormData({
      email: '',
      password: ''
    })
    setError('')
    setIsLoading(false)
  }, [requiredRole])

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
      console.log('🔐 Attempting login...', { email: formData.email })
      
      // Call login API
      const loginResponse = await api.auth.login(formData.email, formData.password)
      
      console.log('✅ Login API response:', loginResponse)
      
      // Extract token and user from response
      // Response structure: { token: "...", user: { id, email, name, role, ... } }
      const token = loginResponse.token
      const user = loginResponse.user || loginResponse
      
      if (!token) {
        throw new Error('No token received from server')
      }
      
      // Map userType to role for frontend compatibility
      if (user && !user.role && user.userType) {
        user.role = user.userType
      }
      
      // Store token and user data
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      console.log('💾 Token and user data stored:', { userType: user.userType, role: user.role })

      // Get user role from response (check userType first, then role, then default)
      const userRole = user?.userType || user?.role || 'student'
      console.log('👤 User role:', userRole)
      console.log('🔒 Required role for this portal:', requiredRole)

      // Validate role if required (user clicked on specific portal)
      // SPECIAL CASE 1: Faculty and Admin share the same login - allow both roles
      // SPECIAL CASE 2: If user is 'alumni' with unified identity flags, allow access to any industry partner portal
      if (requiredRole) {
        const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
        
        // Faculty and Admin can access each other's portals (shared login)
        // If portal accepts either faculty OR admin, then both roles should be allowed
        const portalAcceptsFacultyOrAdmin = allowedRoles.includes('faculty') || allowedRoles.includes('admin')
        const isFacultyOrAdmin = (userRole === 'faculty' || userRole === 'admin')
        const canAccessFacultyAdminHub = portalAcceptsFacultyOrAdmin && isFacultyOrAdmin
        
        // Check if user role matches OR if alumni has any of the unified identity flags
        const isAlumniWithFlags = userRole === 'alumni' && (user.isMentor || user.isJudge || user.isSpeaker)
        const roleMatches = allowedRoles.includes(userRole) || 
          canAccessFacultyAdminHub ||
          (isAlumniWithFlags && allowedRoles.some(role => 
            role === 'mentor' || role === 'judge' || role === 'alumni' || role === 'guest_speaker'
          ))
        
        if (!roleMatches) {
          // Wrong role for this portal - login succeeded but role doesn't match
          let roleName = Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole
          // Make error message more user-friendly
          if (Array.isArray(requiredRole) && requiredRole.includes('faculty') && requiredRole.includes('admin')) {
            roleName = 'Faculty or Admin'
          }
          // Clear the stored credentials since login succeeded but role is wrong
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          throw new Error(`These login credentials do not exist for ${roleName}. The account you entered is registered as ${userRole}. Please login with ${roleName} credentials or use the appropriate portal.`)
        }
      }

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
        {requiredRole ? (
          <p className="text-gray-600">
            Please login as <span className="font-semibold text-tamu-maroon capitalize">{requiredRole}</span> to continue
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

