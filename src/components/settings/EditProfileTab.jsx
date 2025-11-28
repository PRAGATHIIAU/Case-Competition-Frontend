import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, GraduationCap, Save, Loader2, FileText, Linkedin, Github, BookOpen } from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'

export default function EditProfileTab() {
  const { currentUser, updateProfile } = useMockData()
  
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
  
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

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
    }
  }, [currentUser])

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
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
    
    try {
      const result = await updateProfile(profileData)
      
      if (result.success) {
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

  return (
    <div>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
      
      <form onSubmit={handleUpdateProfile} className="space-y-6">
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
        <div className="space-y-2">
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

        {/* Relevant Coursework */}
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
        
        <div className="flex justify-end pt-4 border-t border-gray-200">
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
  )
}

