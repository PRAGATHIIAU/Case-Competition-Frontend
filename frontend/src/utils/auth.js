/**
 * Authentication utility functions
 */

/**
 * Logout user - clears localStorage and redirects to home
 */
export const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  window.location.href = '/'
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken')
  const user = localStorage.getItem('user')
  return !!(token && user)
}

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch (e) {
    return null
  }
}



