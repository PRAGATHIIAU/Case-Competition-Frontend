import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Tag, Plus, X, CheckCircle2, Loader2, Users } from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'

export default function AdminEventForm() {
  const { createEvent } = useMockData()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'Workshop',
    related_skills: []
  })

  const [skillInput, setSkillInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)

  // Predefined skill suggestions
  const skillSuggestions = [
    'Python', 'SQL', 'Data Analytics', 'Machine Learning', 'Java',
    'Business Strategy', 'Consulting', 'Networking', 'Azure', 'DevOps',
    'Cyber Security', 'Web Development', 'Tableau', 'Communication'
  ]

  const eventTypes = ['Workshop', 'Mixer', 'Seminar', 'Competition', 'Networking', 'Career Fair']

  const handleAddSkill = (skill) => {
    if (skill && !formData.related_skills.includes(skill)) {
      setFormData({
        ...formData,
        related_skills: [...formData.related_skills, skill]
      })
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      related_skills: formData.related_skills.filter(skill => skill !== skillToRemove)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      console.log('📝 Submitting event:', formData)
      
      // Call the createEvent function (which will auto-match students)
      const result = await createEvent(formData)
      
      console.log('✅ Event created successfully:', result)
      
      setSubmitResult({
        success: true,
        message: `Event created! ${result.notificationsCreated} student${result.notificationsCreated !== 1 ? 's' : ''} notified.`,
        matchedStudents: result.matchedStudents
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'Workshop',
        related_skills: []
      })
    } catch (error) {
      console.error('❌ Error creating event:', error)
      setSubmitResult({
        success: false,
        message: 'Failed to create event. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-tamu-maroon" />
          Create New Event
        </h2>
        <p className="text-gray-600 mt-1">
          Students with matching interests will automatically be notified
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Event Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="e.g., Python Workshop for Beginners"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-tamu-maroon focus:ring-2 focus:ring-tamu-maroon/20 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            placeholder="Describe the event, what students will learn, and who should attend..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-tamu-maroon focus:ring-2 focus:ring-tamu-maroon/20 transition-all resize-none"
          />
        </div>

        {/* Date and Time */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-tamu-maroon focus:ring-2 focus:ring-tamu-maroon/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Time *
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-tamu-maroon focus:ring-2 focus:ring-tamu-maroon/20 transition-all"
            />
          </div>
        </div>

        {/* Location and Type */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              placeholder="e.g., Mays Business School or Virtual"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-tamu-maroon focus:ring-2 focus:ring-tamu-maroon/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-tamu-maroon focus:ring-2 focus:ring-tamu-maroon/20 transition-all"
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Related Skills (For Matching) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Related Skills (for auto-matching) *
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Students with these skills will automatically receive a notification
          </p>
          
          {/* Skill Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSkill(skillInput)
                }
              }}
              placeholder="Type a skill and press Enter"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-tamu-maroon focus:ring-2 focus:ring-tamu-maroon/20 transition-all"
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddSkill(skillInput)}
              className="px-4 py-3 bg-tamu-maroon text-white rounded-lg hover:bg-tamu-maroon-light transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add
            </motion.button>
          </div>

          {/* Skill Suggestions */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Quick Add:</p>
            <div className="flex flex-wrap gap-2">
              {skillSuggestions
                .filter(skill => !formData.related_skills.includes(skill))
                .slice(0, 8)
                .map(skill => (
                  <motion.button
                    key={skill}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddSkill(skill)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  >
                    + {skill}
                  </motion.button>
                ))}
            </div>
          </div>

          {/* Selected Skills */}
          {formData.related_skills.length > 0 && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-900 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Selected Skills ({formData.related_skills.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {formData.related_skills.map(skill => (
                  <motion.div
                    key={skill}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <motion.button
            type="submit"
            disabled={isSubmitting || formData.related_skills.length === 0}
            whileHover={!isSubmitting && formData.related_skills.length > 0 ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting && formData.related_skills.length > 0 ? { scale: 0.98 } : {}}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
              isSubmitting || formData.related_skills.length === 0
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-tamu-maroon to-tamu-maroon-light text-white hover:shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Creating Event & Notifying Students...
              </>
            ) : (
              <>
                <Calendar className="w-6 h-6" />
                Create Event
              </>
            )}
          </motion.button>
          
          {formData.related_skills.length === 0 && (
            <p className="text-sm text-red-600 mt-2 text-center">
              Please add at least one skill for student matching
            </p>
          )}
        </div>

        {/* Success/Error Message */}
        {submitResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 ${
              submitResult.success
                ? 'bg-green-100 border-2 border-green-300'
                : 'bg-red-100 border-2 border-red-300'
            }`}
          >
            <div className="flex items-start gap-3">
              {submitResult.success ? (
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <X className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${
                  submitResult.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {submitResult.message}
                </p>
                
                {submitResult.success && submitResult.matchedStudents && submitResult.matchedStudents.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Notified Students:
                    </p>
                    <div className="space-y-1">
                      {submitResult.matchedStudents.map((match, idx) => (
                        <div key={idx} className="text-sm text-green-700 bg-white rounded-lg p-2">
                          <span className="font-medium">{match.studentName}</span>
                          <span className="text-xs text-green-600 ml-2">
                            ({match.matchedSkills.join(', ')})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  )
}

