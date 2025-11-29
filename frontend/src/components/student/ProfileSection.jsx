import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, User, Mail, GraduationCap, FileText, Sparkles, Scan, Users, TrendingUp, Save, Loader2, Linkedin, Github, BookOpen, Trophy } from 'lucide-react'
import { parseResume } from '../../utils/businessLogic'
import { getRecommendedMentors } from '../../utils/smartMatching'
import MentorCardActions from './MentorCardActions'
import Toast from '../common/Toast'
import { useMockData } from '../../contexts/MockDataContext'
import api from '../../services/api'

export default function ProfileSection({ onSkillsUpdated, allMentors = [] }) {
  const { currentUser, updateProfile, checkBadges, BADGE_DEFINITIONS } = useMockData()
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    major: '',
    year: '',
    bio: '',
    linkedinUrl: '',
    portfolioUrl: '',
    coursework: ''
  })
  
  // Initialize profile data from currentUser
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        major: currentUser.major || '',
        year: currentUser.year || 'Junior',
        bio: currentUser.bio || '',
        linkedinUrl: currentUser.linkedinUrl || '',
        portfolioUrl: currentUser.portfolioUrl || '',
        coursework: currentUser.coursework || ''
      })
      
      // Auto-check badges when profile loads
      if (currentUser.id) {
        setTimeout(() => {
          checkBadges(currentUser.id)
        }, 1000)
      }
    }
  }, [currentUser, checkBadges])
  
  // Profile save state
  const [isSaving, setIsSaving] = useState(false)
  
  // Resume parsing state
  const [isParsing, setIsParsing] = useState(false)
  const [parsed, setParsed] = useState(false)
  const [skills, setSkills] = useState(['Python', 'SQL', 'Data Analytics', 'Machine Learning'])
  const [parsingProgress, setParsingProgress] = useState('')
  const [recommendedMentors, setRecommendedMentors] = useState([])
  const [isLoadingMentors, setIsLoadingMentors] = useState(false)
  
  // Toast state
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  
  // Handle profile form input changes
  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!profileData.name.trim() || !profileData.email.trim()) {
      setToastMessage('Please fill in all required fields')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }
    
    setIsSaving(true)
    
    try {
      // ALWAYS use real API (create-or-update endpoint handles both create and update)
      let result;
      const profileUpdateData = {
        ...profileData,
        skills: skills, // Include extracted skills
      };
      
      console.log('📤 Sending profile data to API...', profileUpdateData);
      
      try {
        // Use create-or-update endpoint (no auth required, handles both create and update)
        // Pass null as studentId - endpoint will create or update based on email
        result = await api.student.updateProfile(null, profileUpdateData);
        console.log('✅ Profile saved to PostgreSQL:', result);
        
        // Update currentUser with returned student_id if we got one
        if (result && result.data && result.data.student_id && !currentUser?.student_id) {
          console.log('📝 Student ID from response:', result.data.student_id);
        }
      } catch (apiError) {
        console.error('❌ API save failed:', apiError);
        console.warn('Falling back to mock data');
        // Fallback to mock if API fails
        result = await updateProfile(profileData);
      }
      
      if (result.success || result.data) {
        setToastMessage('Profile Updated Successfully!')
        setToastType('success')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      } else {
        throw new Error(result.message || 'Update failed')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setToastMessage(error.message || 'Failed to update profile')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleResumeUpload = async () => {
    setIsParsing(true)
    setParsingProgress('Scanning resume...')
    
    // Simulate parsing stages
    setTimeout(() => setParsingProgress('Extracting skills...'), 700)
    setTimeout(() => setParsingProgress('Analyzing experience...'), 1400)
    setTimeout(() => setParsingProgress('Finding mentor matches...'), 2100)
    
    try {
      // Step 1: Parse resume and extract skills
      const result = await parseResume(null)
      setSkills(result.skills)
      setParsed(true)
      setIsParsing(false)
      setParsingProgress('')
      
      // Step 2: Immediately fetch recommended mentors based on skills
      setIsLoadingMentors(true)
      
      // Try real API first, fallback to local matching
      try {
        const apiResult = await api.mentor.recommend(result.skills);
        if (apiResult.success && apiResult.mentors && apiResult.mentors.length > 0) {
          setRecommendedMentors(apiResult.mentors);
          console.log('✅ Got mentor recommendations from API:', apiResult.mentors);
        } else {
          // Fallback to local matching
          const recommendations = getRecommendedMentors(result.skills, allMentors);
          setRecommendedMentors(recommendations);
        }
      } catch (apiError) {
        console.warn('API recommendation failed, using local matching:', apiError);
        // Fallback to local matching
        const recommendations = getRecommendedMentors(result.skills, allMentors);
        setRecommendedMentors(recommendations);
      } finally {
        setIsLoadingMentors(false);
      }
      
      // Notify parent component of updated skills
      if (onSkillsUpdated) {
        onSkillsUpdated(result.skills)
      }
    } catch (error) {
      console.error('Resume parsing failed:', error)
      setIsParsing(false)
      setParsingProgress('')
      setIsLoadingMentors(false)
    }
  }

  return (
    <div className="space-y-8">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
      <div className="bg-gradient-to-r from-tamu-maroon to-tamu-maroon-light text-white rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Profile</h2>
        <p className="text-lg opacity-90">Manage your profile and showcase your skills</p>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Personal Information</h3>
        <form onSubmit={handleUpdateProfile}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Name <span className="text-red-500">*</span>
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
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
                placeholder="your.email@tamu.edu"
              />
            </div>
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
                placeholder="Your major"
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
                <optgroup label="Undergraduate">
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </optgroup>
                <optgroup label="Graduate">
                  <option value="Master's (1st Year)">Master's (1st Year)</option>
                  <option value="Master's (2nd Year)">Master's (2nd Year)</option>
                  <option value="PhD Candidate">PhD Candidate</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="Alumni">Alumni</option>
                  <option value="Faculty">Faculty</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Bio / About Me */}
          <div className="space-y-2 mt-6">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Bio / About Me
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => {
                if (e.target.value.length <= 300) {
                  handleProfileChange('bio', e.target.value)
                }
              }}
              maxLength={300}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent resize-none"
              placeholder="Tell us about yourself, your interests, and goals (max 300 characters)"
            />
            <p className="text-xs text-gray-500 text-right">{profileData.bio.length}/300</p>
          </div>

          {/* LinkedIn & Portfolio URLs */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
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

          {/* Relevant Coursework */}
          <div className="space-y-2 mt-6">
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
          
          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <motion.button
              type="submit"
              disabled={isSaving}
              whileHover={!isSaving ? { scale: 1.02 } : {}}
              whileTap={!isSaving ? { scale: 0.98 } : {}}
              className={`flex items-center gap-2 px-6 py-3 bg-tamu-maroon text-white rounded-lg font-medium transition-all ${
                isSaving
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-tamu-maroon-light shadow-md hover:shadow-lg'
              }`}
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

      {/* Trophy Case - Badges Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-tamu-maroon" />
            Trophy Case
          </h3>
          <button
            onClick={() => {
              checkBadges(currentUser.id)
              // Show toast notification
              setShowToast(true)
              setToastMessage('Checking for new badges...')
              setToastType('success')
              setTimeout(() => setShowToast(false), 3000)
            }}
            className="text-sm text-tamu-maroon hover:text-tamu-maroon-light font-medium"
          >
            Check Badges
          </button>
        </div>

        {currentUser.badges && currentUser.badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {currentUser.badges.map((badge, index) => {
              const badgeDef = BADGE_DEFINITIONS[badge.name] || {
                icon: '🏅',
                description: badge.name,
                color: 'bg-gray-100 text-gray-800 border-gray-300'
              }
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div
                    className={`${badgeDef.color} border-2 rounded-lg p-4 text-center cursor-pointer hover:scale-105 transition-transform shadow-md`}
                    title={badgeDef.description}
                  >
                    <div className="text-4xl mb-2">{badge.icon || badgeDef.icon}</div>
                    <p className="text-xs font-semibold mt-2">{badge.name}</p>
                    {badge.earnedAt && (
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(badge.earnedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap shadow-lg">
                      {badgeDef.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No badges yet</p>
            <p className="text-sm">Participate in events, connect with mentors, and compete to earn badges!</p>
            <button
              onClick={() => checkBadges(currentUser.id)}
              className="mt-4 px-4 py-2 bg-tamu-maroon text-white rounded-lg hover:bg-tamu-maroon-light transition-colors text-sm font-medium"
            >
              Check for Badges
            </button>
          </div>
        )}
      </div>

      {/* Resume Upload & Parsing */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-tamu-maroon" />
          Resume Upload
        </h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-tamu-maroon transition-colors">
          {isParsing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Scan className="w-12 h-12 text-tamu-maroon" />
                </motion.div>
                <div className="animate-pulse">
                  <div className="w-3 h-3 bg-tamu-maroon rounded-full"></div>
                </div>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700 mb-2">{parsingProgress || 'Scanning...'}</p>
                <p className="text-sm text-gray-500">AI is extracting your skills and experience</p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-tamu-maroon h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                  />
                </div>
              </div>
            </div>
          ) : parsed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Sparkles className="w-8 h-8" />
                <p className="text-lg font-medium">Resume Parsed Successfully!</p>
              </div>
              <p className="text-sm text-gray-600">Skills extracted from your resume:</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-gray-600 mb-2">Upload your resume for AI-powered parsing</p>
                <p className="text-sm text-gray-500 mb-4">
                  We'll automatically extract your skills and experience
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResumeUpload}
                  className="bg-tamu-maroon text-white px-6 py-2 rounded-lg font-medium hover:bg-tamu-maroon-light transition-colors"
                >
                  Upload Resume
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Skills Display */}
        <AnimatePresence>
          {parsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Extracted Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-4 py-2 bg-tamu-maroon/10 text-tamu-maroon rounded-lg font-medium"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recommended Mentors Section */}
      {parsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-tamu-maroon" />
            <h3 className="text-2xl font-semibold text-gray-800">Recommended Mentors</h3>
            {isLoadingMentors && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-tamu-maroon"></div>
            )}
          </div>

          {isLoadingMentors ? (
            <div className="text-center py-8 text-gray-500">
              <p>Finding best matches based on your skills...</p>
            </div>
          ) : recommendedMentors.length > 0 ? (
            <>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Smart Match:</strong> Found {recommendedMentors.length} mentor(s) with overlapping skills. 
                  Sorted by match score.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {recommendedMentors.slice(0, 4).map((mentor, index) => (
                  <motion.div
                    key={mentor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-lg border-2 border-green-300">
                        <TrendingUp className="w-4 h-4 text-green-700" />
                        <span className="text-lg font-bold text-green-700">{mentor.matchScore}% Match</span>
                      </div>
                      {mentor.skillOverlap && (
                        <span className="text-xs text-gray-500">
                          {mentor.skillOverlap} skill{mentor.skillOverlap !== 1 ? 's' : ''} match
                        </span>
                      )}
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-800">{mentor.name}</h4>
                    <p className="text-sm text-gray-600">{mentor.role} at {mentor.company}</p>
                    
                    {mentor.matchingSkills && mentor.matchingSkills.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Matching skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {mentor.matchingSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <MentorCardActions 
                      mentor={mentor} 
                      onRequestSent={() => {
                        // Refresh recommendations or show toast
                        setToastMessage(`Connection request sent to ${mentor.name}!`)
                        setShowToast(true)
                        setTimeout(() => setShowToast(false), 3000)
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No mentor matches found. Try uploading a resume with more skills.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

