/**
 * Permissions System for Role-Based Access Control
 * 
 * Handles granular permissions for Faculty vs Admin roles
 * Special handling for student assistants (admins who are also participants)
 */

/**
 * Get user from localStorage
 */
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      return JSON.parse(userStr)
    }
  } catch (e) {
    console.error('Error parsing user data:', e)
  }
  return null
}

/**
 * Permission definitions
 */
export const PERMISSIONS = {
  // Analytics & Overview
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_OVERVIEW: 'view_overview',
  VIEW_INACTIVE_ALUMNI: 'view_inactive_alumni',
  
  // Event Management
  CREATE_EVENT: 'create_event',
  MANAGE_EVENTS: 'manage_events',
  
  // Lecture Management
  CREATE_LECTURE: 'create_lecture',
  MANAGE_ATTENDANCE: 'manage_attendance',
  
  // Competition Management
  CREATE_COMPETITION: 'create_competition',
  MANAGE_COMPETITIONS: 'manage_competitions',
  VIEW_JUDGE_COMMENTS: 'view_judge_comments', // SENSITIVE: Only faculty, not student admins
  VIEW_COMPETITION_SCORES: 'view_competition_scores', // SENSITIVE: Only faculty, not student admins
  VIEW_LEADERBOARD: 'view_leaderboard', // SENSITIVE: Only faculty, not student admins
  
  // Judge Management
  MANAGE_JUDGE_INVITATIONS: 'manage_judge_invitations',
  VIEW_JUDGE_FEEDBACK: 'view_judge_feedback', // SENSITIVE: Only faculty
  
  // Communication
  ACCESS_COMMUNICATION_CENTER: 'access_communication_center',
  SEND_REENGAGEMENT_EMAILS: 'send_reengagement_emails',
  
  // Team Management
  CREATE_TEAMS: 'create_teams',
  MANAGE_TEAMS: 'manage_teams',
  UPLOAD_CASE_FILES: 'upload_case_files',
}

/**
 * Permission matrix: role -> permissions
 * 
 * Faculty: Full access to everything
 * Admin (not participant): Full access to everything
 * Admin (participant): Limited access (no judge comments, no sensitive competition data)
 */
const PERMISSION_MATRIX = {
  faculty: [
    // Full access
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_OVERVIEW,
    PERMISSIONS.VIEW_INACTIVE_ALUMNI,
    PERMISSIONS.CREATE_EVENT,
    PERMISSIONS.MANAGE_EVENTS,
    PERMISSIONS.CREATE_LECTURE,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.CREATE_COMPETITION,
    PERMISSIONS.MANAGE_COMPETITIONS,
    PERMISSIONS.VIEW_JUDGE_COMMENTS, // ✅ Faculty can see judge comments
    PERMISSIONS.VIEW_COMPETITION_SCORES, // ✅ Faculty can see scores
    PERMISSIONS.VIEW_LEADERBOARD, // ✅ Faculty can see leaderboard
    PERMISSIONS.MANAGE_JUDGE_INVITATIONS,
    PERMISSIONS.VIEW_JUDGE_FEEDBACK, // ✅ Faculty can see judge feedback
    PERMISSIONS.ACCESS_COMMUNICATION_CENTER,
    PERMISSIONS.SEND_REENGAGEMENT_EMAILS,
    PERMISSIONS.CREATE_TEAMS,
    PERMISSIONS.MANAGE_TEAMS,
    PERMISSIONS.UPLOAD_CASE_FILES,
  ],
  admin_full: [ // Admin who is NOT a participant
    // Full access (same as faculty)
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_OVERVIEW,
    PERMISSIONS.VIEW_INACTIVE_ALUMNI,
    PERMISSIONS.CREATE_EVENT,
    PERMISSIONS.MANAGE_EVENTS,
    PERMISSIONS.CREATE_LECTURE,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.CREATE_COMPETITION,
    PERMISSIONS.MANAGE_COMPETITIONS,
    PERMISSIONS.VIEW_JUDGE_COMMENTS, // ✅ Full admin can see judge comments
    PERMISSIONS.VIEW_COMPETITION_SCORES, // ✅ Full admin can see scores
    PERMISSIONS.VIEW_LEADERBOARD, // ✅ Full admin can see leaderboard
    PERMISSIONS.MANAGE_JUDGE_INVITATIONS,
    PERMISSIONS.VIEW_JUDGE_FEEDBACK, // ✅ Full admin can see judge feedback
    PERMISSIONS.ACCESS_COMMUNICATION_CENTER,
    PERMISSIONS.SEND_REENGAGEMENT_EMAILS,
    PERMISSIONS.CREATE_TEAMS,
    PERMISSIONS.MANAGE_TEAMS,
    PERMISSIONS.UPLOAD_CASE_FILES,
  ],
  admin_limited: [ // Admin who IS a participant (student assistant)
    // Limited access (no sensitive competition data)
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_OVERVIEW,
    PERMISSIONS.VIEW_INACTIVE_ALUMNI,
    PERMISSIONS.CREATE_EVENT,
    PERMISSIONS.MANAGE_EVENTS,
    PERMISSIONS.CREATE_LECTURE,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.CREATE_COMPETITION,
    PERMISSIONS.MANAGE_COMPETITIONS,
    // ❌ NO VIEW_JUDGE_COMMENTS (student assistant can't see judge comments)
    // ❌ NO VIEW_COMPETITION_SCORES (student assistant can't see scores)
    // ❌ NO VIEW_LEADERBOARD (student assistant can't see leaderboard)
    PERMISSIONS.MANAGE_JUDGE_INVITATIONS,
    // ❌ NO VIEW_JUDGE_FEEDBACK (student assistant can't see judge feedback)
    PERMISSIONS.ACCESS_COMMUNICATION_CENTER,
    PERMISSIONS.SEND_REENGAGEMENT_EMAILS,
    PERMISSIONS.CREATE_TEAMS,
    PERMISSIONS.MANAGE_TEAMS,
    PERMISSIONS.UPLOAD_CASE_FILES,
  ],
}

/**
 * Check if user has a specific permission
 * @param {string} permission - Permission to check
 * @param {Object} user - User object (optional, will fetch from localStorage if not provided)
 * @returns {boolean} - True if user has permission
 */
export const hasPermission = (permission, user = null) => {
  const currentUser = user || getCurrentUser()
  
  if (!currentUser) {
    return false
  }
  
  const role = currentUser.role?.toLowerCase()
  const isParticipant = currentUser.isParticipant === true || currentUser.is_participant === true
  
  // Determine permission set based on role and participant status
  let permissionSet = []
  
  if (role === 'faculty') {
    permissionSet = PERMISSION_MATRIX.faculty
  } else if (role === 'admin') {
    if (isParticipant) {
      // Student assistant (admin who is also a participant)
      permissionSet = PERMISSION_MATRIX.admin_limited
    } else {
      // Full admin (not a participant)
      permissionSet = PERMISSION_MATRIX.admin_full
    }
  } else {
    // Other roles have no admin permissions
    return false
  }
  
  return permissionSet.includes(permission)
}

/**
 * Check if user is a student assistant (admin who is also a participant)
 * @param {Object} user - User object (optional)
 * @returns {boolean}
 */
export const isStudentAssistant = (user = null) => {
  const currentUser = user || getCurrentUser()
  if (!currentUser) return false
  
  return currentUser.role?.toLowerCase() === 'admin' && 
         (currentUser.isParticipant === true || currentUser.is_participant === true)
}

/**
 * Check if user is full faculty (not a student assistant)
 * @param {Object} user - User object (optional)
 * @returns {boolean}
 */
export const isFullFaculty = (user = null) => {
  const currentUser = user || getCurrentUser()
  if (!currentUser) return false
  
  return currentUser.role?.toLowerCase() === 'faculty'
}

/**
 * Get all permissions for current user
 * @param {Object} user - User object (optional)
 * @returns {Array<string>} - Array of permission strings
 */
export const getUserPermissions = (user = null) => {
  const currentUser = user || getCurrentUser()
  
  if (!currentUser) {
    return []
  }
  
  const role = currentUser.role?.toLowerCase()
  const isParticipant = currentUser.isParticipant === true || currentUser.is_participant === true
  
  if (role === 'faculty') {
    return PERMISSION_MATRIX.faculty
  } else if (role === 'admin') {
    if (isParticipant) {
      return PERMISSION_MATRIX.admin_limited
    } else {
      return PERMISSION_MATRIX.admin_full
    }
  }
  
  return []
}

/**
 * Get a human-readable description of user's access level
 * @param {Object} user - User object (optional)
 * @returns {string}
 */
export const getAccessLevelDescription = (user = null) => {
  const currentUser = user || getCurrentUser()
  
  if (!currentUser) {
    return 'No access'
  }
  
  if (isFullFaculty(currentUser)) {
    return 'Full Faculty Access'
  } else if (isStudentAssistant(currentUser)) {
    return 'Student Assistant (Limited Access)'
  } else if (currentUser.role?.toLowerCase() === 'admin') {
    return 'Full Admin Access'
  }
  
  return 'Limited Access'
}

