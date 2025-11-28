import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Save, Loader2 } from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'

export default function MentorshipPreferencesTab() {
  const { currentUser, updatePreferences } = useMockData()
  
  const [preferences, setPreferences] = useState({
    acceptingMentees: true,
    publicProfile: true
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  useEffect(() => {
    if (currentUser?.preferences) {
      setPreferences({
        acceptingMentees: currentUser.preferences.acceptingMentees ?? true,
        publicProfile: currentUser.preferences.publicProfile ?? true
      })
    }
  }, [currentUser])

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      const result = await updatePreferences(preferences)
      
      if (result.success) {
        setToastMessage('Mentorship preferences saved successfully!')
        setToastType('success')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      } else {
        throw new Error(result.message || 'Failed to save preferences')
      }
    } catch (error) {
      console.error('Preferences update error:', error)
      setToastMessage(error.message || 'Failed to save preferences')
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

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mentorship Preferences</h2>
      
      <div className="space-y-6">
        <p className="text-gray-600">
          Manage your mentorship availability and profile visibility.
        </p>
        
        {/* Toggle Switches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 mb-1">Accepting New Mentees</h3>
              <p className="text-sm text-gray-600">
                Allow students to send you connection requests for mentorship
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('acceptingMentees')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.acceptingMentees ? 'bg-tamu-maroon' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.acceptingMentees ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 mb-1">Public Profile</h3>
              <p className="text-sm text-gray-600">
                Make your profile visible to students searching for mentors
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('publicProfile')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.publicProfile ? 'bg-tamu-maroon' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.publicProfile ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> If you disable "Accepting New Mentees", students will not be able to send you connection requests. You can still manage existing mentee relationships.
          </p>
        </div>
        
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <motion.button
            onClick={handleSave}
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
                <span>Save Preferences</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

