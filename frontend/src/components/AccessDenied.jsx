import { motion } from 'framer-motion'
import { AlertTriangle, Home, LogOut, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { logout, getCurrentUser } from '../utils/auth'

export default function AccessDenied({ requiredRole, userRole }) {
  const navigate = useNavigate()
  const currentUser = getCurrentUser()
  const userRoleActual = userRole || currentUser?.role || 'Unknown'

  // Get the correct dashboard path for the user's role
  const getDashboardPath = (role) => {
    switch (role?.toLowerCase()) {
      case 'student':
        return '/student/dashboard'
      case 'mentor':
        return '/mentor/dashboard'
      case 'alumni':
        return '/alumni/dashboard'
      case 'faculty':
        return '/faculty/dashboard'
      case 'admin':
        return '/admin/dashboard'
      case 'judge':
        return '/judge'
      default:
        return '/student/dashboard'
    }
  }

  const handleGoToMyDashboard = () => {
    const dashboardPath = getDashboardPath(userRoleActual)
    navigate(dashboardPath)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        
        <p className="text-gray-600 mb-4">
          You don't have permission to access this page.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Your Role:</span> <span className="capitalize">{userRoleActual}</span>
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Required Role:</span> {requiredRole || 'N/A'}
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoToMyDashboard}
            className="w-full px-4 py-2 bg-tamu-maroon text-white rounded-lg font-semibold hover:bg-tamu-maroon-light transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            Go to My Dashboard
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

