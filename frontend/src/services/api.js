/**
 * API Service Layer
 * Centralized API calls to backend
 * All frontend components should use this service instead of direct fetch calls
 */

const API_BASE_URL = '/api';
const ADMIN_API_BASE_URL =
  import.meta.env.VITE_ADMIN_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  'http://localhost:3000';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken') || null;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  console.log('📥 API Response:', response.status, response.statusText);
  
  // Try to parse JSON, but handle non-JSON responses
  let data;
  const contentType = response.headers.get('content-type');
  
  try {
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('❌ Non-JSON response:', text);
      
      // Try to extract error message from HTML or text
      let errorMessage = 'Server returned non-JSON response';
      if (text.includes('Email already exists') || text.includes('email already exists')) {
        errorMessage = 'Email already exists. Please use a different email or login instead.';
      } else if (text.length < 500) {
        // If response is short, might be an error message
        errorMessage = text;
      }
      
      throw new Error(errorMessage);
    }
  } catch (parseError) {
    // If JSON parsing failed, but we got an error message, use it
    if (parseError.message && parseError.message !== 'Unexpected end of JSON input') {
      throw parseError;
    }
    throw new Error('Server returned invalid response. Please try again.');
  }
  
  console.log('📥 Response data:', data);
  
  if (!response.ok) {
    console.error('❌ API Error:', data);
    
    // Handle specific error cases
    if (response.status === 409) {
      // Conflict - usually means email already exists
      throw new Error(data.message || data.error || 'Email already exists. Please use a different email or login instead.');
    }
    
    if (response.status === 400) {
      // Bad request
      throw new Error(data.message || data.error || 'Invalid request. Please check your input.');
    }
    
    // Generic error
    throw new Error(data.error || data.message || `API request failed (${response.status})`);
  }
  
  return data;
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('🌐 API Request:', options.method || 'GET', url);
  if (options.body) {
    console.log('   └─ Body:', options.body);
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  console.log('📡 API Response status:', response.status, response.statusText);
  
  return handleResponse(response);
};

// Helper function for admin endpoints (direct to backend base URL)
const adminRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const url = `${ADMIN_API_BASE_URL}${endpoint}`;
  console.log('🌐 Admin API Request:', options.method || 'GET', url);
  if (options.body) {
    console.log('   └─ Body:', options.body);
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  console.log('📡 Admin API Response status:', response.status, response.statusText);
  
  return handleResponse(response);
};

// Helper function for FormData requests (file uploads)
const apiFormDataRequest = async (endpoint, formData, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    ...options.headers,
  };
  
  // IMPORTANT: Don't set Content-Type for FormData - browser will set it with boundary
  // Setting it manually will break the request!
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('📤 API Request:', options.method || 'POST', url);
  console.log('📤 FormData entries:');
  for (const [key, value] of formData.entries()) {
    console.log(`   ${key}:`, value);
  }
  
  const response = await fetch(url, {
    method: options.method || 'POST',
    headers,
    body: formData,
  });
  
  return handleResponse(response);
};

/**
 * Student API
 */
export const studentAPI = {
  // Get all students
  getAll: async () => {
    return apiRequest('/students');
  },
  
  // Get student by ID
  getById: async (studentId) => {
    return apiRequest(`/students/${studentId}`);
  },
  
  // Create/Update student profile
  updateProfile: async (studentId, profileData) => {
    // Map frontend fields to backend fields
    // Handle year field - convert "Junior", "Senior", etc. to grad_year
    let gradYear = null;
    if (profileData.year) {
      // Try to extract year number from strings like "Junior", "2025", etc.
      const yearMatch = profileData.year.match(/\d{4}/);
      if (yearMatch) {
        gradYear = parseInt(yearMatch[0]);
      } else {
        // Map common year strings to approximate graduation years
        const currentYear = new Date().getFullYear();
        const yearMap = {
          'Freshman': currentYear + 3,
          'Sophomore': currentYear + 2,
          'Junior': currentYear + 1,
          'Senior': currentYear,
        };
        gradYear = yearMap[profileData.year] || null;
      }
    }
    
    const backendData = {
      name: profileData.name,
      email: profileData.email,
      major: profileData.major,
      grad_year: gradYear,
      contact: profileData.contact || null,
      linkedin_url: profileData.linkedinUrl || null,
      skills: profileData.skills || [],
    };
    
    console.log('📦 Mapped profile data:', backendData);
    
    // Always use form-data for student endpoints (required by backend)
    const formData = new FormData();
    Object.keys(backendData).forEach(key => {
      if (backendData[key] !== null && backendData[key] !== undefined) {
        if (Array.isArray(backendData[key])) {
          formData.append(key, JSON.stringify(backendData[key]));
        } else {
          formData.append(key, backendData[key]);
        }
      }
    });
    
    // Use create-or-update endpoint (no auth required, handles both create and update)
    // This endpoint will create if email doesn't exist, or update if it does
    return apiFormDataRequest('/students/create-or-update', formData);
  },
  
  // Signup new user (uses new simple endpoint)
  signup: async (signupData) => {
    // Try new simple endpoint first
    try {
      return await apiFormDataRequest('/api/signup', 'POST', signupData);
    } catch (error) {
      // Fallback to old endpoint
      console.warn('New signup endpoint failed, trying old endpoint:', error);
      return await apiFormDataRequest('/api/auth/signup', 'POST', signupData);
    }
  },
  
  // Signup new student (old method - kept for backward compatibility)
  signupOld: async (signupData) => {
    const formData = new FormData();
    Object.keys(signupData).forEach(key => {
      if (signupData[key] !== null && signupData[key] !== undefined) {
        if (Array.isArray(signupData[key])) {
          formData.append(key, JSON.stringify(signupData[key]));
        } else {
          formData.append(key, signupData[key]);
        }
      }
    });
    
    return apiFormDataRequest('/students/signup', formData);
  },
};

/**
 * Connection API
 */
export const connectionAPI = {
  // Send connection request
  sendRequest: async (mentorId, message = '', studentId = null) => {
    const body = {
      mentor_id: mentorId,
      message: message,
    };
    
    // Include student_id if provided (for authenticated requests)
    if (studentId) {
      body.student_id = studentId;
    }
    
    return apiRequest('/send-request', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  
  // Get my connection requests
  getMyRequests: async () => {
    return apiRequest('/my-requests');
  },
  
  // Get mentor's connection requests
  getMentorRequests: async () => {
    return apiRequest('/mentor/requests');
  },
  
  // Accept connection request
  acceptRequest: async (requestId) => {
    return apiRequest(`/connection-requests/${requestId}/accept`, {
      method: 'PUT',
    });
  },
  
  // Decline connection request
  declineRequest: async (requestId) => {
    return apiRequest(`/connection-requests/${requestId}/decline`, {
      method: 'PUT',
    });
  },
};

/**
 * Mentor API
 */
export const mentorAPI = {
  // Get all mentors
  getAll: async () => {
    return apiRequest('/mentors');
  },
  
  // Get mentor by ID
  getById: async (mentorId) => {
    return apiRequest(`/mentors/${mentorId}`);
  },
  
  // Recommend mentors based on skills
  recommend: async (skills) => {
    return apiRequest('/mentors/recommend', {
      method: 'POST',
      body: JSON.stringify({ skills }),
    });
  },
};

/**
 * Notification API
 */
export const notificationAPI = {
  // Get all notifications
  getAll: async () => {
    return apiRequest('/notifications');
  },
  
  // Mark notification as read
  markRead: async (notificationId) => {
    return apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },
};

/**
 * Search API
 */
export const searchAPI = {
  // Global search
  global: async (query) => {
    return apiRequest(`/search?q=${encodeURIComponent(query)}`);
  },
};

/**
 * Auth API
 */
export const authAPI = {
  // Signup - uses new simple endpoint at /api/signup
  signup: async (signupData) => {
    const formData = new FormData();
    Object.keys(signupData).forEach(key => {
      if (signupData[key] !== null && signupData[key] !== undefined) {
        if (Array.isArray(signupData[key])) {
          formData.append(key, JSON.stringify(signupData[key]));
        } else {
          formData.append(key, signupData[key]);
        }
      }
    });
    
    // Try new simple endpoint first
    try {
      return await apiFormDataRequest('/signup', formData, { method: 'POST' });
    } catch (error) {
      // Fallback to old endpoint
      console.warn('New signup endpoint failed, trying old endpoint:', error);
      return await apiFormDataRequest('/auth/signup', formData, { method: 'POST' });
    }
  },
  
  // Login - returns { token, user: { id, email, name, role, ... } }
  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Extract token and user from response
    // Backend returns: { success: true, message: 'Login successful', data: { token, user } }
    if (response.data) {
      return response.data; // { token, user }
    }
    
    // Fallback: if response structure is different
    return response;
  },
  
  // Update user profile
  updateProfile: async (userId, profileData) => {
    console.log('📤 updateProfile called with:', { userId, profileData });
    const formData = new FormData();
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        if (Array.isArray(profileData[key])) {
          formData.append(key, JSON.stringify(profileData[key]));
        } else if (typeof profileData[key] === 'boolean') {
          formData.append(key, profileData[key] ? 'true' : 'false');
        } else {
          formData.append(key, profileData[key]);
        }
      }
    });
    
    console.log('📤 FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(`   ${key}:`, value);
    }
    
    try {
      const response = await apiFormDataRequest(`/auth/user/${userId}`, formData, { method: 'PUT' });
      console.log('✅ updateProfile success:', response);
      return response;
    } catch (error) {
      console.error('❌ updateProfile error:', error);
      throw error;
    }
  },
};

/**
 * Admin API (Case-Competition backend)
 */
export const adminAPI = {
  login: async (email, password) => {
    const response = await adminRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    return response.data ?? response;
  },
  signup: async (payload) => {
    const response = await adminRequest('/admin/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response.data ?? response;
  },
  getBasicStats: async () => {
    return adminRequest('/admin/analytics/basic-stats', {
      method: 'GET',
    });
  },
  getStudentEngagement: async () => {
    return adminRequest('/admin/analytics/student-engagement', {
      method: 'GET',
    });
  },
  getAlumniEngagement: async () => {
    return adminRequest('/admin/analytics/alumni-engagement', {
      method: 'GET',
    });
  },
  getMentorEngagement: async () => {
    return adminRequest('/admin/analytics/mentor-engagement', {
      method: 'GET',
    });
  },
  getAlumniRoles: async () => {
    return adminRequest('/admin/analytics/alumni-roles', {
      method: 'GET',
    });
  },
  getEventSummaries: async () => {
    return adminRequest('/admin/analytics/events/summary', {
      method: 'GET',
    });
  },
  getStudentEventTrends: async () => {
    return adminRequest('/admin/analytics/student-event-trends', {
      method: 'GET',
    });
  },
  getFeedbackSummary: async () => {
    return adminRequest('/admin/analytics/feedback-summary', {
      method: 'GET',
    });
  },
  getInactiveAlumni: async () => {
    return adminRequest('/admin/analytics/inactive-alumni', {
      method: 'GET',
    });
  },
  getSystemHealth: async () => {
    return adminRequest('/admin/analytics/system-health', {
      method: 'GET',
    });
  },
  getAdminActivity: async () => {
    return adminRequest('/admin/analytics/admin-activity', {
      method: 'GET',
    });
  },
};

/**
 * Python Backend API (Admin Dashboard & Alumni Engagement)
 * These endpoints connect to the Python Flask backend
 */
export const pythonAPI = {
  // Get dashboard statistics
  fetchDashboardStats: async () => {
    return apiRequest('/stats', {
      method: 'GET',
    });
  },

  // Get inactive alumni list
  fetchInactiveAlumni: async () => {
    return apiRequest('/alumni/inactive', {
      method: 'GET',
    });
  },

  // Generate AI re-engagement email draft
  generateReengagementDraft: async (alumniData) => {
    // alumniData should contain: { alumni_id, name, email, company, industry, lastActiveAt }
    // Or minimal: { name, industry, company }
    return apiRequest('/alumni/generate-email', {
      method: 'POST',
      body: JSON.stringify(alumniData),
    });
  },

  // Send re-engagement email
  sendReengagementEmail: async (alumniId, email, emailDraft) => {
    return apiRequest('/alumni/send-email', {
      method: 'POST',
      body: JSON.stringify({
        alumni_id: alumniId,
        email: email,
        email_draft: emailDraft,
      }),
    });
  },
};

/**
 * Event API
 */
export const eventAPI = {
  // Get all events
  getAll: async () => {
    return apiRequest('/events');
  },

  // Get event by ID
  getById: async (eventId) => {
    return apiRequest(`/events/${eventId}`);
  },

  // Create a new event
  create: async (eventData) => {
    console.log('📝 Creating event via API:', eventData);
    const result = await apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
    console.log('✅ Event created via API:', result);
    return result;
  },

  // RSVP to an event (sends confirmation email automatically)
  rsvp: async (eventId, userId) => {
    console.log('📧 RSVP Request - Event ID:', eventId, 'User ID:', userId);
    const result = await apiRequest(`/events/${eventId}/rsvp`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
    console.log('📧 RSVP Response:', result);
    return result;
  },
};

/**
 * Competition API
 */
export const competitionAPI = {
  // Get all competitions
  getAll: async () => {
    return apiRequest('/competitions');
  },

  // Register for a competition (sends confirmation email automatically)
  register: async (competitionId, userId, teamName, teamId, competitionName = 'Case Competition 2024') => {
    console.log('🏆 Competition Registration Request - Competition ID:', competitionId, 'User ID:', userId, 'Team:', teamName, 'Team ID:', teamId, 'Competition Name:', competitionName);
    const result = await apiRequest(`/competitions/${competitionId}/register`, {
      method: 'POST',
      body: JSON.stringify({ 
        user_id: userId,
        team_name: teamName,
        team_id: teamId,
        competition_name: competitionName
      }),
    });
    console.log('🏆 Competition Registration Response:', result);
    return result;
  },
};

// Default export with all APIs
const api = {
  student: studentAPI,
  connection: connectionAPI,
  mentor: mentorAPI,
  notification: notificationAPI,
  search: searchAPI,
  auth: authAPI,
  admin: adminAPI,
  event: eventAPI, // Event API
  competition: competitionAPI, // Competition API
  python: pythonAPI, // Python backend API
};

export default api;

