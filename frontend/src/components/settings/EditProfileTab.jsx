import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, GraduationCap, Save, Loader2, FileText, Linkedin, Github, BookOpen, Building2, Briefcase, Users, Gavel, Mic, Phone } from 'lucide-react'
import Toast from '../common/Toast'
import api from '../../services/api'

export default function EditProfileTab() {
  // Get user from localStorage (from login/signup)
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState('student')
  
  // Profile data - role-specific
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    contact: '',
    // Student fields
    major: '',
    year: '',
    coursework: '',
    // Alumni/Mentor fields
    company: '',
    expertise: '',
    // Unified Identity flags (for alumni)
    isMentor: false,
    isJudge: false,
    isSpeaker: false,
    // Common fields
    bio: '',
    linkedinUrl: '',
    portfolioUrl: '',
    skills: []
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  // Function to load user data from localStorage
  const loadUserData = () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        setUser(userData)
        const role = userData.role || 'student'
        setUserRole(role)
        
        // Initialize profile data based on role
        // CRITICAL: Email should come from userData, not be editable
        setProfileData({
          name: userData.name || '',
          email: userData.email || '', // Email from localStorage (login identifier)
          contact: userData.contact || '',
          // Student fields
          major: userData.major || '',
          year: userData.year || '',
          coursework: userData.coursework || '',
          // Alumni/Mentor fields
          company: userData.company || '',
          expertise: Array.isArray(userData.expertise) 
            ? userData.expertise.join(', ') 
            : (userData.expertise || ''),
          // Unified Identity flags
          isMentor: userData.isMentor || false,
          isJudge: userData.isJudge || false,
          isSpeaker: userData.isSpeaker || false,
          // Common fields
          bio: userData.bio || '',
          linkedinUrl: userData.linkedinUrl || userData.linkedin_url || '',
          portfolioUrl: userData.portfolioUrl || userData.portfolio_url || '',
          skills: Array.isArray(userData.skills) ? userData.skills : []
        })
        
        console.log('📥 Loaded user data into form:', {
          name: userData.name,
          email: userData.email,
          major: userData.major
        })
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }

  const [hasLoaded, setHasLoaded] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  useEffect(() => {
    // Only load user data once on mount, and NOT when saving
    if (!hasLoaded && !isSavingProfile) {
      loadUserData()
      setHasLoaded(true)
    }
    
    // CRITICAL: Do NOT reload form data after save - it will overwrite the form state
    // The form state already has the correct values, so we don't want to reload from localStorage
    
    // Also listen for storage changes (in case user updates profile in another tab)
    // Note: storage event only fires for changes from OTHER tabs/windows, not current tab
    const handleStorageChange = (e) => {
      // Only reload from OTHER tabs, not from our own saves
      if (e.key === 'user' && hasLoaded && !isSavingProfile && e.newValue) {
        // Only reload if we've already loaded once and not currently saving
        // But check if the data is actually different to avoid unnecessary reloads
        try {
          const newUserData = JSON.parse(e.newValue)
          // Only reload if the data is significantly different (from another tab)
          // Don't reload if it's just our own save (which would reset the form)
          // Compare user ID to ensure it's the same user
          if (user && newUserData.id === user.id) {
            // Only reload if we detect a meaningful change from another tab
            // Skip if we're currently editing (hasLoaded means we've started editing)
            console.log('🔄 Storage change detected from another tab, but skipping reload to preserve form state')
          }
        } catch (err) {
          console.error('Error parsing storage change:', err)
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoaded, isSavingProfile]) // REMOVED profileData.major and user - these were causing form resets!

  const handleProfileChange = (field, value) => {
    console.log(`📝 Form field changed: ${field} = "${value}"`)
    setProfileData(prev => {
      const updated = {
        ...prev,
        [field]: value
      }
      console.log(`📝 Updated profileData.${field}:`, updated[field])
      console.log(`📝 Full profileData state after update:`, updated)
      return updated
    })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    
    if (!profileData.name.trim() || !profileData.email.trim()) {
      setToastMessage('Please fill in all required fields')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }
    
    setIsSaving(true)
    setIsSavingProfile(true) // Prevent useEffect from reloading during save
    
    try {
      // Prepare update data based on role
      // NOTE: Don't send email or role - these shouldn't be updated via profile update
      // Only send fields that have values (don't send empty strings as they might clear the field)
      const updateData = {
        name: profileData.name.trim(),
        contact: profileData.contact?.trim() || null,
        linkedinUrl: profileData.linkedinUrl?.trim() || null,
        portfolioUrl: profileData.portfolioUrl?.trim() || null,
        bio: profileData.bio?.trim() || null,
        skills: profileData.skills || []
      }

      // Add role-specific fields (always send them, even if empty, so backend can update them)
      if (userRole === 'student') {
        // Always send these fields - if empty, send empty string (backend will handle)
        updateData.major = profileData.major?.trim() || ''
        updateData.year = profileData.year?.trim() || ''
        updateData.coursework = profileData.coursework?.trim() || ''
      } else if (userRole === 'alumni' || userRole === 'mentor') {
        updateData.company = profileData.company?.trim() || ''
        if (profileData.expertise?.trim()) {
          updateData.expertise = profileData.expertise.split(',').map(e => e.trim()).filter(e => e)
        } else {
          updateData.expertise = []
        }
        // Unified Identity: Add role flags for alumni
        if (userRole === 'alumni') {
          updateData.isMentor = profileData.isMentor
          updateData.isJudge = profileData.isJudge
          updateData.isSpeaker = profileData.isSpeaker
        }
      }
      
      console.log('📤 Complete updateData being sent:', updateData)

      // Call API to update profile
      console.log('📤 Updating profile:', updateData)
      console.log('📤 Current profileData state:', profileData)
      console.log('📤 User from localStorage:', {
        id: user?.id,
        idType: typeof user?.id,
        email: user?.email,
        role: user?.role
      })
      
      if (!user || !user.id) {
        throw new Error('User not found. Please login again.')
      }

      // Ensure user ID is a number (backend expects integer)
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id
      if (isNaN(userId)) {
        throw new Error('Invalid user ID. Please login again.')
      }
      
      console.log('📤 Calling API with userId:', userId, 'type:', typeof userId)

      // Call backend API to update profile
      const response = await api.auth.updateProfile(userId, updateData)
      
      console.log('📥 Full API response:', response)
      
      // Get the updated user data from response
      // Response structure: {success: true, message: '...', data: {user object}}
      const updatedUserData = response.data || (response.success && response.data ? response.data : response)
      
      console.log('📥 Extracted user data from backend:', updatedUserData)
      console.log('📥 Backend response fields:', {
        hasMajor: 'major' in (updatedUserData || {}),
        hasYear: 'year' in (updatedUserData || {}),
        hasCoursework: 'coursework' in (updatedUserData || {}),
        majorValue: updatedUserData?.major,
        yearValue: updatedUserData?.year,
        courseworkValue: updatedUserData?.coursework,
      })
      
      // Update localStorage with complete user data
      // CRITICAL: Form values are the ABSOLUTE source of truth - they override everything
      // Build the updated user object with form values taking absolute precedence
      const formValues = {
        // CRITICAL: Name MUST be included and MUST come from form
        name: profileData.name.trim(), // This is what user entered
        contact: profileData.contact?.trim() || '',
        major: profileData.major?.trim() || '',
        year: profileData.year?.trim() || '',
        coursework: profileData.coursework?.trim() || '',
        company: profileData.company?.trim() || '',
        expertise: profileData.expertise?.trim() 
          ? profileData.expertise.split(',').map(e => e.trim()).filter(e => e)
          : [],
        isMentor: profileData.isMentor || false,
        is_mentor: profileData.isMentor || false,
        isMentor: profileData.isMentor || false,
        is_judge: profileData.isJudge || false,
        isJudge: profileData.isJudge || false,
        is_speaker: profileData.isSpeaker || false,
        isSpeaker: profileData.isSpeaker || false,
        bio: profileData.bio?.trim() || '',
        linkedinUrl: profileData.linkedinUrl?.trim() || '',
        linkedin_url: profileData.linkedinUrl?.trim() || '',
        portfolioUrl: profileData.portfolioUrl?.trim() || '',
        portfolio_url: profileData.portfolioUrl?.trim() || '',
        skills: profileData.skills || [],
      }
      
      console.log('🔍 Form values being merged:', {
        name: formValues.name,
        'profileData.name': profileData.name,
        'formValues object': formValues
      })
      
      // Merge: user (base) -> backend response -> form values (wins)
      // CRITICAL: Email and role should NEVER be updated - preserve from original user
      const updatedUser = {
        ...user, // Base: existing user data (includes email, id, role)
        ...(updatedUserData || {}), // Backend response (may have additional fields)
        ...formValues, // Form values ALWAYS win (overwrite everything, including name)
        // CRITICAL: Preserve email and role from original user - these should NEVER change
        email: user.email, // Always use original email (email is login identifier, can't be changed)
        role: user.role, // Always use original role (role is set during signup)
      }
      
      // CRITICAL: Ensure name is definitely set from form
      updatedUser.name = profileData.name.trim()
      
      console.log('🔍 Final updatedUser before save:', {
        name: updatedUser.name,
        email: updatedUser.email,
        'original user.email': user.email,
        'backend response email': updatedUserData?.email,
        major: updatedUser.major,
        'full object keys': Object.keys(updatedUser)
      })
      
      console.log('💾 Saving to localStorage (form values as source of truth):', updatedUser)
      console.log('💾 Form values that were saved:', {
        name: profileData.name,
        major: profileData.major,
        year: profileData.year,
        coursework: profileData.coursework,
        contact: profileData.contact,
        bio: profileData.bio,
        linkedinUrl: profileData.linkedinUrl,
        portfolioUrl: profileData.portfolioUrl,
      })
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      // CRITICAL: Verify localStorage was updated correctly
      const verifyStorage = JSON.parse(localStorage.getItem('user'))
      console.log('🔍 VERIFICATION - localStorage after save:', {
        major: verifyStorage?.major,
        year: verifyStorage?.year,
        coursework: verifyStorage?.coursework,
        'full user object': verifyStorage
      })
      
      if (verifyStorage?.major !== profileData.major?.trim()) {
        console.error('❌ CRITICAL: localStorage major mismatch!', {
          'expected (form)': profileData.major?.trim(),
          'actual (storage)': verifyStorage?.major
        })
        // Force update again
        const correctedUser = { ...updatedUser, major: profileData.major?.trim() || '' }
        localStorage.setItem('user', JSON.stringify(correctedUser))
        console.log('🔧 Corrected localStorage with form values')
      }
      
      setUser(updatedUser)
      
      // CRITICAL: DO NOT reload form data - the form already has the correct values
      // The profileData state already contains what the user entered, so we keep it as-is
      // This prevents the form from reverting to old values
      
      console.log('✅ Profile saved. Form state preserved:', {
        name: profileData.name,
        major: profileData.major,
        year: profileData.year,
        coursework: profileData.coursework,
      })
      
      // Force a re-render to ensure form shows updated values
      console.log('🔄 Form will maintain these values:', {
        major: profileData.major,
        year: profileData.year,
        coursework: profileData.coursework
      })
      
      setToastMessage('Profile Updated Successfully!')
      setToastType('success')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (error) {
      console.error('❌ Profile update error:', error)
      console.error('   ├─ Error message:', error.message)
      console.error('   ├─ Error stack:', error.stack)
      console.error('   ├─ Full error:', error)
      console.error('   └─ Form state at error time:', profileData)
      
      // Show detailed error message
      let errorMessage = '❌ FAILED TO UPDATE PROFILE: '
      if (error.message) {
        if (error.message.includes('401')) {
          errorMessage += 'Authentication failed. Please login again.'
        } else if (error.message.includes('403')) {
          errorMessage += 'You can only update your own profile.'
        } else if (error.message.includes('404')) {
          errorMessage += 'User not found. Please login again.'
        } else if (error.message.includes('Network') || error.message.includes('fetch')) {
          errorMessage += 'Network error. Please check your connection and try again.'
        } else {
          errorMessage += error.message
        }
      } else {
        errorMessage += 'An unexpected error occurred. Please try again or contact support.'
      }
      
      setToastMessage(errorMessage)
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 10000) // Show for 10 seconds
      
      // Also log to console for debugging
      console.error('🚨 ERROR DISPLAYED TO USER:', errorMessage)
    } finally {
      setIsSaving(false)
      // Delay resetting isSavingProfile to ensure form state is preserved
      setTimeout(() => {
        setIsSavingProfile(false)
      }, 100)
    }
  }

  return (
    <div>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Edit Profile</h2>
        <p className="text-sm text-gray-600 mt-1">
          Update your {userRole === 'student' ? 'student' : userRole === 'alumni' ? 'alumni' : userRole === 'mentor' ? 'mentor' : userRole === 'faculty' ? 'faculty' : 'profile'} information
        </p>
      </div>
      
      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {/* Common Fields: Name, Email, Contact */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={profileData.email || user?.email || ''}
              readOnly
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
              placeholder="your.email@tamu.edu"
              title="Email cannot be changed. It is your login identifier."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contact
          </label>
          <input
            type="text"
            value={profileData.contact}
            onChange={(e) => handleProfileChange('contact', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
            placeholder="Phone number or contact info"
          />
        </div>

        {/* Student-Specific Fields */}
        {userRole === 'student' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Major
              </label>
              <input
                type="text"
                value={profileData.major}
                onChange={(e) => handleProfileChange('major', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
                placeholder="Computer Science"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Year
              </label>
              <select
                value={profileData.year}
                onChange={(e) => handleProfileChange('year', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
              >
                <option value="">Select year</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>
        )}

        {/* Alumni/Mentor-Specific Fields */}
        {(userRole === 'alumni' || userRole === 'mentor') && (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Company
                </label>
                <input
                  type="text"
                  value={profileData.company}
                  onChange={(e) => handleProfileChange('company', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
                  placeholder="Google, Microsoft, etc."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Expertise (comma-separated)
                </label>
                <input
                  type="text"
                  value={profileData.expertise}
                  onChange={(e) => handleProfileChange('expertise', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
                  placeholder="AI, Machine Learning, Data Science"
                />
                <p className="text-xs text-gray-500">Separate expertise areas with commas</p>
              </div>
            </div>

            {/* Unified Identity: Alumni Role Flags */}
            {userRole === 'alumni' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  How would you like to contribute?
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileData.isMentor}
                      onChange={(e) => handleProfileChange('isMentor', e.target.checked)}
                      className="w-5 h-5 text-tamu-maroon border-gray-300 rounded focus:ring-tamu-maroon"
                    />
                    <Users className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Mentor Students</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileData.isJudge}
                      onChange={(e) => handleProfileChange('isJudge', e.target.checked)}
                      className="w-5 h-5 text-tamu-maroon border-gray-300 rounded focus:ring-tamu-maroon"
                    />
                    <Gavel className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Judge Competitions</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileData.isSpeaker}
                      onChange={(e) => handleProfileChange('isSpeaker', e.target.checked)}
                      className="w-5 h-5 text-tamu-maroon border-gray-300 rounded focus:ring-tamu-maroon"
                    />
                    <Mic className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Guest Speaker</span>
                  </label>
                </div>
              </div>
            )}
          </>
        )}

        {/* Faculty-Specific Fields */}
        {userRole === 'faculty' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Department
            </label>
            <input
              type="text"
              value={profileData.major || ''}
              onChange={(e) => handleProfileChange('major', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
              placeholder="Computer Science, Business, etc."
            />
          </div>
        )}

        {/* Common Fields: Bio */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Bio / About Me
          </label>
          <textarea
            value={profileData.bio}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                handleProfileChange('bio', e.target.value)
              }
            }}
            maxLength={500}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent resize-none"
            placeholder="Tell us about yourself, your background, and interests (max 500 characters)"
          />
          <p className="text-xs text-gray-500 text-right">{profileData.bio.length}/500</p>
        </div>

        {/* Common Fields: LinkedIn & Portfolio */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn URL
            </label>
            <input
              type="url"
              value={profileData.linkedinUrl}
              onChange={(e) => handleProfileChange('linkedinUrl', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Github className="w-4 h-4" />
              Portfolio / GitHub URL
            </label>
            <input
              type="url"
              value={profileData.portfolioUrl}
              onChange={(e) => handleProfileChange('portfolioUrl', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
              placeholder="https://github.com/username or https://yourportfolio.com"
            />
          </div>
        </div>

        {/* Student-Specific: Coursework */}
        {userRole === 'student' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Relevant Coursework
            </label>
            <input
              type="text"
              value={profileData.coursework}
              onChange={(e) => handleProfileChange('coursework', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
              placeholder="e.g., Data Structures, Machine Learning, Database Systems (comma-separated)"
            />
            <p className="text-xs text-gray-500">Separate courses with commas</p>
          </div>
        )}
        
        <div className="flex justify-end pt-4 border-t border-gray-200 mt-6 sticky bottom-0 bg-white pb-4">
          <motion.button
            type="submit"
            disabled={isSaving}
            onClick={() => {
              console.log('🖱️ Save button clicked!')
              console.log('🖱️ Current profileData state:', profileData)
            }}
            whileHover={!isSaving ? { scale: 1.02 } : {}}
            whileTap={!isSaving ? { scale: 0.98 } : {}}
            className={`flex items-center gap-2 px-6 py-3 bg-tamu-maroon text-white rounded-lg font-medium transition-all ${
              isSaving
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-tamu-maroon-light shadow-md hover:shadow-lg'
            }`}
            style={{ minWidth: '150px', zIndex: 10 }}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  )
}
