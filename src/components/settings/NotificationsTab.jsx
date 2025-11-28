import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Mail, Save, Loader2, CheckCircle2 } from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'

export default function NotificationsTab() {
  const { currentUser, updatePreferences } = useMockData()
  
  const [preferences, setPreferences] = useState({
    emailNewEvents: true,
    emailConnectionRequests: true,
    emailWeeklySummaries: false
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  useEffect(() => {
    if (currentUser?.preferences) {
      setPreferences({
        emailNewEvents: currentUser.preferences.emailNewEvents ?? true,
        emailConnectionRequests: currentUser.preferences.emailConnectionRequests ?? true,
        emailWeeklySummaries: currentUser.preferences.emailWeeklySummaries ?? false
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
        setToastMessage('Notification preferences saved successfully!')
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

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>
      
      <div className="space-y-6">
        <p className="text-gray-600">
          Choose which email notifications you'd like to receive from the platform.
        </p>
        
        {/* Toggle Switches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 mb-1">Email me about new Events</h3>
              <p className="text-sm text-gray-600">
                Get notified when new events matching your interests are created
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('emailNewEvents')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.emailNewEvents ? 'bg-tamu-maroon' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.emailNewEvents ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 mb-1">Email me when I get a Connection Request</h3>
              <p className="text-sm text-gray-600">
                Receive notifications when students request to connect with you
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('emailConnectionRequests')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.emailConnectionRequests ? 'bg-tamu-maroon' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.emailConnectionRequests ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 mb-1">Email me weekly summaries</h3>
              <p className="text-sm text-gray-600">
                Receive a weekly digest of platform activity and updates
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('emailWeeklySummaries')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.emailWeeklySummaries ? 'bg-tamu-maroon' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.emailWeeklySummaries ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
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

