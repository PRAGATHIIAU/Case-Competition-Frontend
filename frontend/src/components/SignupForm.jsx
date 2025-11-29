import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Mail, Lock, User, Loader2, AlertCircle, GraduationCap, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function SignupForm({ onSignupSuccess, onClose = null }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    // Student fields
    major: '',
    year: '',
    // Mentor/Alumni fields
    company: '',
    expertise: '',
    // Unified Identity: Alumni role flags
    isMentor: false,
    isJudge: false,
    isSpeaker: false,
    // Admin/Participant flag: For admins who are also participants (student assistants)
    isParticipant: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (error) setError('')
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Unified Identity: Alumni must select at least one role
    if (formData.role === 'alumni' && !formData.isMentor && !formData.isJudge && !formData.isSpeaker) {
      setError('Please select at least one contribution option (Mentor, Judge, or Speaker)')
      return
    }
    
    setIsLoading(true)

    try {
      console.log('📝 Attempting signup...', { email: formData.email, role: formData.role })
      
      // Prepare signup data based on role
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        contact: '',
      }
      
      // Add role-specific fields
      if (formData.role === 'student') {
        signupData.major = formData.major
        signupData.year = formData.year
        signupData.grad_year = formData.year === 'Senior' ? 2025 : formData.year === 'Junior' ? 2026 : 2027
      } else if (formData.role === 'mentor' || formData.role === 'alumni') {
        signupData.company = formData.company
        if (formData.expertise) {
          signupData.expertise = formData.expertise.split(',').map(e => e.trim())
        }
        // Unified Identity: Add role flags for alumni
        if (formData.role === 'alumni') {
          signupData.isMentor = formData.isMentor || false
          signupData.isJudge = formData.isJudge || false
          signupData.isSpeaker = formData.isSpeaker || false
        }
      } else if (formData.role === 'admin') {
        // Admin/Participant flag: If admin is also a participant (student assistant)
        signupData.isParticipant = formData.isParticipant || false
        console.log('🔐 Admin signup - isParticipant:', signupData.isParticipant)
      }
      
      // Call signup API
      const response = await api.auth.signup(signupData)
      
      console.log('✅ Signup successful:', response)
      
      // Check if response indicates success
      if (!response || (response.success === false)) {
        throw new Error(response?.message || response?.error || 'Signup failed. Please try again.')
      }
      
      // Auto-login after signup
      const loginResponse = await api.auth.login(formData.email, formData.password)
      
      const token = loginResponse.token
      const user = loginResponse.user || loginResponse
      
      if (token) {
        localStorage.setItem('authToken', token)
        localStorage.setItem('user', JSON.stringify(user))
        console.log('💾 Token and user data stored')
      }
      
      // Redirect based on role
      const userRole = user?.role || formData.role
      let redirectPath = '/'
      
      switch (userRole.toLowerCase()) {
        case 'student':
          redirectPath = '/student/dashboard'
          break
        case 'mentor':
          redirectPath = '/mentor/dashboard'
          break
        case 'alumni':
          redirectPath = '/alumni/dashboard'
          break
        case 'faculty':
          redirectPath = '/faculty/dashboard'
          break
        case 'admin':
          redirectPath = '/admin/dashboard'
          break
        default:
          redirectPath = '/student/dashboard'
      }
      
      if (onSignupSuccess) {
        onSignupSuccess(user)
      }
      
      navigate(redirectPath)
      
    } catch (error) {
      console.error('❌ Signup failed:', error)
      
      // Provide user-friendly error messages
      let errorMessage = error.message || 'Failed to create account. Please try again.'
      
      if (errorMessage.includes('Email already exists') || errorMessage.includes('email already exists')) {
        errorMessage = 'This email is already registered. Please use a different email or login instead.'
      } else if (errorMessage.includes('non-JSON')) {
        errorMessage = 'Server error occurred. Please check if the backend is running and try again.'
      }
      
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative"
    >
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 z-10"
          aria-label="Close signup form"
        >
          <X className="w-6 h-6" />
        </button>
      )}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-tamu-maroon/10 rounded-full mb-4">
          <UserPlus className="w-8 h-8 text-tamu-maroon" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
        <p className="text-gray-600">Join the CMIS platform</p>
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

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
        </div>

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
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            I am a
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={(e) => {
              setFormData(prev => ({ 
                ...prev, 
                role: e.target.value,
                // Reset participant flag when role changes
                isParticipant: false
              }))
            }}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
          >
            <option value="student">Student</option>
            <option value="alumni">Alumni / Industry Partner (Mentor, Judge, Speaker)</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
          {formData.role === 'alumni' && (
            <p className="text-xs text-gray-500 mt-1">
              Select your contribution options below
            </p>
          )}
          {formData.role === 'admin' && (
            <p className="text-xs text-gray-500 mt-1">
              Select if you are also a participant in competitions
            </p>
          )}
        </div>

        {/* Student-specific fields */}
        {formData.role === 'student' && (
          <>
            <div>
              <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-2">
                Major
              </label>
              <input
                type="text"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
                placeholder="Computer Science"
              />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
              >
                <option value="">Select year</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </>
        )}

        {/* Alumni/Industry Partner-specific fields */}
        {formData.role === 'alumni' && (
          <>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
                placeholder="Google, Microsoft, etc."
              />
            </div>
            <div>
              <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">
                Expertise (comma-separated)
              </label>
              <input
                type="text"
                id="expertise"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
                placeholder="AI, Machine Learning, Data Science"
              />
            </div>
          </>
        )}

        {/* Unified Identity: Alumni Role Selection */}
        {formData.role === 'alumni' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              How would you like to contribute?
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isMentor"
                  checked={formData.isMentor}
                  onChange={(e) => setFormData(prev => ({ ...prev, isMentor: e.target.checked }))}
                  className="w-5 h-5 text-tamu-maroon border-gray-300 rounded focus:ring-tamu-maroon"
                />
                <span className="text-gray-700">Mentor Students</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isJudge"
                  checked={formData.isJudge}
                  onChange={(e) => setFormData(prev => ({ ...prev, isJudge: e.target.checked }))}
                  className="w-5 h-5 text-tamu-maroon border-gray-300 rounded focus:ring-tamu-maroon"
                />
                <span className="text-gray-700">Judge Competitions</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isSpeaker"
                  checked={formData.isSpeaker}
                  onChange={(e) => setFormData(prev => ({ ...prev, isSpeaker: e.target.checked }))}
                  className="w-5 h-5 text-tamu-maroon border-gray-300 rounded focus:ring-tamu-maroon"
                />
                <span className="text-gray-700">Guest Speaker</span>
              </label>
            </div>
            {!formData.isMentor && !formData.isJudge && !formData.isSpeaker && (
              <p className="text-xs text-blue-600 mt-2">
                Please select at least one contribution option
              </p>
            )}
          </div>
        )}

        {/* Admin: Participant Checkbox */}
        {formData.role === 'admin' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isParticipant"
                checked={formData.isParticipant}
                onChange={(e) => setFormData(prev => ({ ...prev, isParticipant: e.target.checked }))}
                className="w-5 h-5 text-tamu-maroon border-gray-300 rounded focus:ring-tamu-maroon mt-0.5"
              />
              <div className="flex-1">
                <span className="text-sm font-semibold text-gray-800 block mb-1">
                  I am also a participant in competitions
                </span>
                <p className="text-xs text-gray-600">
                  Check this if you are a student assistant who will also participate in competitions. 
                  You will have limited access and cannot view judge comments or competition scores.
                </p>
                {formData.isParticipant && (
                  <p className="text-xs text-yellow-700 mt-2 font-medium">
                    ⚠️ Limited Access: You will not be able to see judge comments or competition scores.
                  </p>
                )}
              </div>
            </label>
          </div>
        )}

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
              minLength={6}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
              placeholder="At least 6 characters"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
              placeholder="Re-enter password"
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
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              <span>Create Account</span>
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => onSignupSuccess && onSignupSuccess(null)}
            className="text-tamu-maroon hover:underline font-medium"
          >
            Login instead
          </button>
        </p>
      </div>
    </motion.div>
  )
}

