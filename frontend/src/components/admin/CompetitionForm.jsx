import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Plus, X, Loader2, CheckCircle2 } from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'

const EXPERTISE_OPTIONS = [
  'AI', 'Finance', 'Healthcare', 'Data Analytics', 'Cyber Security',
  'Network Security', 'FinTech', 'Blockchain', 'Business Strategy',
  'Consulting', 'Cloud Infrastructure', 'DevOps', 'Python', 'SQL',
  'Machine Learning', 'ML', 'Azure', 'Web Development'
]

export default function CompetitionForm() {
  const { createCompetition } = useMockData()
  
  const [formData, setFormData] = useState({
    name: '',
    deadline: '',
    requiredExpertise: []
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [successData, setSuccessData] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleExpertise = (expertise) => {
    setFormData(prev => ({
      ...prev,
      requiredExpertise: prev.requiredExpertise.includes(expertise)
        ? prev.requiredExpertise.filter(e => e !== expertise)
        : [...prev.requiredExpertise, expertise]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      setToastMessage('Please enter a competition name')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }
    
    if (!formData.deadline) {
      setToastMessage('Please select a deadline')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }
    
    if (formData.requiredExpertise.length === 0) {
      setToastMessage('Please select at least one required expertise area')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    setIsSubmitting(true)
    
    try {
      const result = await createCompetition({
        name: formData.name,
        deadline: formData.deadline,
        requiredExpertise: formData.requiredExpertise
      })
      
      if (result.success) {
        setSuccessData(result)
        setToastMessage(`Competition created! ${result.invitationsCreated} judge invitations sent automatically.`)
        setToastType('success')
        setShowToast(true)
        
        // Reset form
        setFormData({
          name: '',
          deadline: '',
          requiredExpertise: []
        })
        
        setTimeout(() => {
          setShowToast(false)
          setSuccessData(null)
        }, 5000)
      }
    } catch (error) {
      setToastMessage(error.message || 'Failed to create competition')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />

      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create New Competition</h2>
        <p className="text-gray-600">
          Create a competition and automatically invite relevant judges based on expertise
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Competition Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Competition Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
            placeholder="e.g., Case Competition 2024"
          />
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Submission Deadline <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) => handleInputChange('deadline', e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
          />
        </div>

        {/* Required Expertise */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Required Expertise <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-2">
              (Select areas to automatically match judges)
            </span>
          </label>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_OPTIONS.map((expertise) => (
                <motion.button
                  key={expertise}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleExpertise(expertise)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.requiredExpertise.includes(expertise)
                      ? 'bg-tamu-maroon text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {expertise}
                </motion.button>
              ))}
            </div>
          </div>

          {formData.requiredExpertise.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Selected expertise:</p>
              <div className="flex flex-wrap gap-2">
                {formData.requiredExpertise.map((expertise) => (
                  <span
                    key={expertise}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-tamu-maroon/10 text-tamu-maroon rounded-lg text-sm font-medium"
                  >
                    {expertise}
                    <button
                      type="button"
                      onClick={() => toggleExpertise(expertise)}
                      className="hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Success Message */}
        {successData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-800 mb-1">Competition Created Successfully!</p>
                <p className="text-sm text-green-700">
                  <strong>{successData.invitationsCreated} judge invitation{successData.invitationsCreated !== 1 ? 's' : ''}</strong> were automatically generated and sent to matching stakeholders.
                </p>
                {successData.invitations && successData.invitations.length > 0 && (
                  <div className="mt-2 text-xs text-green-600">
                    <p>Invited judges:</p>
                    <ul className="list-disc list-inside mt-1">
                      {successData.invitations.slice(0, 3).map(inv => (
                        <li key={inv.id}>{inv.stakeholderName}</li>
                      ))}
                      {successData.invitations.length > 3 && (
                        <li>...and {successData.invitations.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          className={`w-full bg-tamu-maroon text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            isSubmitting
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:bg-tamu-maroon-light shadow-md hover:shadow-lg'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating Competition...</span>
            </>
          ) : (
            <>
              <Trophy className="w-5 h-5" />
              <span>Create Competition & Send Invitations</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  )
}

