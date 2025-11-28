import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, Tag, FileText, Loader2, CheckCircle2, Users } from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'

export default function CreateLectureForm() {
  const { currentUser, createLecture } = useMockData()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    topicTags: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [result, setResult] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    
    try {
      // Parse topic tags (comma-separated)
      const topicTags = formData.topicTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
      
      if (topicTags.length === 0) {
        setToastMessage('Please enter at least one topic tag')
        setToastType('error')
        setShowToast(true)
        setLoading(false)
        return
      }
      
      // Create lecture
      const response = await createLecture({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        topicTags
      })
      
      if (response.success) {
        setResult({
          lecture: response.lecture,
          invitationsCreated: response.invitationsCreated,
          invitedSpeakers: response.invitedSpeakers
        })
        
        setToastMessage(
          `Lecture created! We sent invitations to ${response.invitationsCreated} matching expert${response.invitationsCreated !== 1 ? 's' : ''}.`
        )
        setToastType('success')
        setShowToast(true)
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          date: '',
          topicTags: ''
        })
      }
    } catch (error) {
      console.error('❌ Failed to create lecture:', error)
      setToastMessage(error.message || 'Failed to create lecture')
      setToastType('error')
      setShowToast(true)
    } finally {
      setLoading(false)
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

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-tamu-maroon" />
          <h2 className="text-3xl font-bold text-gray-800">Create Lecture</h2>
        </div>
        <p className="text-gray-600">
          Create a lecture and automatically find matching guest speakers based on topic expertise
        </p>
        <p className="text-sm text-gray-500 mt-2">
          💡 <strong>Tip:</strong> Enter topic tags (e.g., "Cybersecurity, Ethics, AI") and the system will automatically find and invite relevant alumni/speakers.
        </p>
      </div>

      {/* Success Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-6"
        >
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Lecture Created Successfully!
              </h3>
              <p className="text-green-800 mb-4">
                <strong>{result.lecture.title}</strong> has been created and invitations have been sent to {result.invitationsCreated} matching expert{result.invitationsCreated !== 1 ? 's' : ''}.
              </p>
              
              {result.invitedSpeakers && result.invitedSpeakers.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-green-900 mb-2">Invited Speakers:</p>
                  <div className="space-y-2">
                    {result.invitedSpeakers.map((speaker, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-green-800 bg-green-100 rounded px-3 py-2">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">{speaker.name}</span>
                        <span className="text-green-700">({speaker.matchedTags.join(', ')})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Lecture Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
            placeholder="e.g., Introduction to Cybersecurity Ethics"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
            placeholder="Brief description of the lecture topic and objectives..."
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Lecture Date *
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
          />
        </div>

        {/* Topic Tags */}
        <div>
          <label htmlFor="topicTags" className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-2" />
            Topic Tags * (Comma-separated)
          </label>
          <input
            type="text"
            id="topicTags"
            name="topicTags"
            value={formData.topicTags}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
            placeholder="e.g., Cybersecurity, Ethics, AI, Data Privacy"
          />
          <p className="mt-2 text-sm text-gray-500">
            Enter topics separated by commas. The system will match speakers based on their expertise in these areas.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-4 pt-4">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="flex items-center gap-2 bg-tamu-maroon text-white px-6 py-3 rounded-lg font-medium hover:bg-tamu-maroon-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating & Finding Speakers...</span>
              </>
            ) : (
              <>
                <BookOpen className="w-5 h-5" />
                <span>Create & Find Speakers</span>
              </>
            )}
          </motion.button>
          
          {loading && (
            <p className="text-sm text-gray-600">
              Matching speakers based on expertise...
            </p>
          )}
        </div>
      </form>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">How It Works</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Enter your lecture details and topic tags</li>
          <li>• The system searches alumni/speakers with matching expertise</li>
          <li>• Top 5 matches are automatically invited via email</li>
          <li>• Speakers with past speaking experience are prioritized</li>
          <li>• Invitations appear in the speaker's dashboard</li>
        </ul>
      </div>
    </div>
  )
}

