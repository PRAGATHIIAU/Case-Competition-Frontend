import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AccessDenied from './AccessDenied'

/**
 * Protected Route Component
 * Checks localStorage for user authentication AND role
 * Shows Access Denied page if wrong role, redirects to home if not logged in
 */
export default function ProtectedRoute({ children, requiredRole = null, allowedRoles = null }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [userRole, setUserRole] = useState(null)
  const [accessDenied, setAccessDenied] = useState(false)
  
  useEffect(() => {
    // Check if user is authenticated
    const userStr = localStorage.getItem('user')
    const token = localStorage.getItem('authToken')
    
    if (!userStr || !token) {
      console.log('🔒 Protected route: No user found, redirecting to home')
      setIsAuthenticated(false)
      setIsChecking(false)
      setAccessDenied(false)
      return
    }
    
    // Parse user data
    let user
    try {
      user = JSON.parse(userStr)
      // Check userType first (new backend format), then role (old format), then default to 'student'
      const role = user.userType || user.role || 'student'
      setUserRole(role)
      
      // Update localStorage with role if it's missing but userType exists (for backward compatibility)
      if (!user.role && user.userType) {
        user.role = user.userType
        localStorage.setItem('user', JSON.stringify(user))
      }
      
      // Check role - either specific role or allowed roles array
      let hasAccess = false
      
      if (requiredRole) {
        // Single required role
        hasAccess = role === requiredRole
        if (!hasAccess) {
          console.log(`🔒 Access denied: User role "${role}" does not match required "${requiredRole}"`)
          setAccessDenied(true)
        }
      } else if (allowedRoles && Array.isArray(allowedRoles)) {
        // Multiple allowed roles
        hasAccess = allowedRoles.includes(role)
        if (!hasAccess) {
          console.log(`🔒 Access denied: User role "${role}" not in allowed roles:`, allowedRoles)
          setAccessDenied(true)
        }
      } else {
        // No role requirement, just need to be authenticated
        hasAccess = true
      }
      
      if (hasAccess) {
        setIsAuthenticated(true)
        setAccessDenied(false)
      } else {
        setIsAuthenticated(false)
        setAccessDenied(true)
      }
      
      setIsChecking(false)
    } catch (e) {
      console.error('Error parsing user from localStorage:', e)
      localStorage.removeItem('user')
      localStorage.removeItem('authToken')
      setIsAuthenticated(false)
      setIsChecking(false)
      setAccessDenied(false)
      return
    }
  }, [requiredRole, allowedRoles])
  
  if (isChecking) {
    // Show loading state while checking
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tamu-maroon mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }
  
  if (accessDenied) {
    // Wrong role - show access denied page
    return <AccessDenied requiredRole={requiredRole || (allowedRoles ? allowedRoles.join(' or ') : null)} userRole={userRole} />
  }
  
  if (!isAuthenticated) {
    // No user found, redirect to home
    return <Navigate to="/" replace />
  }
  
  // User is authenticated and has correct role, render the protected component
  return children
}

