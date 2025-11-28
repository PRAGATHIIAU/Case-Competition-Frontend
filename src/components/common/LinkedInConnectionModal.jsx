import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Linkedin, CheckCircle2, Sparkles, Edit3, ExternalLink } from 'lucide-react'

/**
 * Smart LinkedIn Connection Modal
 * Helps students draft personalized connection requests with AI assistance
 */
export default function LinkedInConnectionModal({ 
  isOpen, 
  onClose, 
  mentor, 
  student,
  sharedSkills = []
}) {
  const [draftMessage, setDraftMessage] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Generate AI-powered draft message
  useEffect(() => {
    if (isOpen && mentor && student) {
      const generated = generateDraftMessage(student, mentor, sharedSkills)
      setDraftMessage(generated)
      setIsCopied(false)
      setIsEditing(false)
    }
  }, [isOpen, mentor, student, sharedSkills])

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(draftMessage)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 3000)
    } catch (error) {
      console.error('Failed to copy:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = draftMessage
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 3000)
    }
  }

  const handleOpenLinkedIn = () => {
    if (mentor.linkedin_url) {
      window.open(mentor.linkedin_url, '_blank', 'noopener,noreferrer')
      // Keep modal open so user can still reference the message
    }
  }

  const handleCopyAndOpenLinkedIn = async () => {
    await handleCopyToClipboard()
    setTimeout(() => {
      handleOpenLinkedIn()
    }, 500)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Linkedin className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Draft Your Connection Request</h2>
              </div>
              <button
                onClick={onClose}
                className="hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-blue-100 text-sm">
              AI-powered personalized message for {mentor?.name}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* AI Badge */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">AI-Generated Message</span>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="ml-auto text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>
              <p className="text-sm text-purple-700">
                Based on your profile and {mentor?.name}'s expertise, we've crafted a personalized connection message.
              </p>
            </div>

            {/* Draft Message */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Your Connection Message
              </label>
              <textarea
                value={draftMessage}
                onChange={(e) => {
                  setDraftMessage(e.target.value)
                  setIsEditing(true)
                }}
                rows={8}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none font-sans text-gray-800"
                placeholder="Your personalized message will appear here..."
              />
              <p className="text-xs text-gray-500">
                💡 LinkedIn connection notes have a 300-character limit. Current: {draftMessage.length} characters
              </p>
            </div>

            {/* Shared Skills Highlight */}
            {sharedSkills && sharedSkills.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-green-900 mb-2">
                  🎯 Shared Skills Mentioned:
                </p>
                <div className="flex flex-wrap gap-2">
                  {sharedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                📋 How to Use This Message:
              </p>
              <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                <li>Click "Copy to Clipboard" below</li>
                <li>Click "Go to LinkedIn Profile"</li>
                <li>On LinkedIn, click the "Connect" button</li>
                <li>Select "Add a note"</li>
                <li>Paste your message (Ctrl+V or Cmd+V)</li>
                <li>Send your personalized request!</li>
              </ol>
            </div>

            {/* Copy Success Message */}
            <AnimatePresence>
              {isCopied && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-100 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Message Copied!</p>
                    <p className="text-sm text-green-700">Ready to paste on LinkedIn</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyToClipboard}
                className="flex-1 bg-tamu-maroon hover:bg-tamu-maroon-light text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy to Clipboard
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenLinkedIn}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                Go to LinkedIn Profile
              </motion.button>
            </div>

            {/* Quick Action Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleCopyAndOpenLinkedIn}
              className="w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Copy & Open LinkedIn (Quick Action)
              <ExternalLink className="w-4 h-4" />
            </motion.button>

            <p className="text-xs text-gray-500 text-center mt-3">
              This modal will stay open so you can reference your message
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

/**
 * AI-powered message generation
 * Creates personalized LinkedIn connection requests based on student and mentor profiles
 */
function generateDraftMessage(student, mentor, sharedSkills = []) {
  // Get the top shared skill (most relevant)
  const primarySkill = sharedSkills.length > 0 ? sharedSkills[0] : null
  const secondarySkill = sharedSkills.length > 1 ? sharedSkills[1] : null
  
  // Get student info with defaults
  const studentName = student?.name || "Student"
  const studentMajor = student?.major || "Computer Science"
  const university = "Texas A&M University"
  
  // Get mentor info
  const mentorName = mentor?.name?.split(' ')[0] || "there" // First name only
  const mentorCompany = mentor?.company || "your company"
  const mentorRole = mentor?.role || "your field"
  
  // Template variations based on available data
  let message = `Hi ${mentorName}, I'm a ${studentMajor} student at ${university}.`
  
  // Add company/role context
  if (mentor?.company) {
    message += ` I'm really inspired by your work as ${mentorRole} at ${mentorCompany}.`
  }
  
  // Add shared skills context
  if (primarySkill && secondarySkill) {
    message += ` I noticed we both have experience in ${primarySkill} and ${secondarySkill}, and I'd love to learn from your journey in these areas.`
  } else if (primarySkill) {
    message += ` I saw we share an interest in ${primarySkill}, and I'd love to connect and learn from your experience.`
  } else {
    message += ` I'd love to connect and learn from your professional journey.`
  }
  
  // Closing
  message += ` Would you be open to connecting?`
  
  // Check character limit (LinkedIn allows 300 characters in connection notes)
  if (message.length > 300) {
    // Simplified version for long messages
    message = `Hi ${mentorName}, I'm a ${studentMajor} student at ${university}.`
    
    if (primarySkill) {
      message += ` I noticed we both work with ${primarySkill}.`
    }
    
    message += ` I'd love to connect and learn from your experience at ${mentorCompany}. Would you be open to connecting?`
  }
  
  return message
}

/**
 * Alternative message templates (can be used for variation)
 */
export const messageTemplates = {
  formal: (student, mentor, skill) => 
    `Dear ${mentor.name}, I am ${student.name}, a ${student.major} student at Texas A&M University. I am reaching out because I admire your work at ${mentor.company} and would appreciate the opportunity to connect and learn from your experience.`,
  
  casual: (student, mentor, skill) =>
    `Hi ${mentor.name}! I'm ${student.name}, studying ${student.major} at Texas A&M. Your work at ${mentor.company} really resonates with me${skill ? `, especially in ${skill}` : ''}. Would love to connect!`,
  
  skillFocused: (student, mentor, skill) =>
    `Hi ${mentor.name}, I'm ${student.name}, a ${student.major} student. I noticed we both have expertise in ${skill}. I'd love to connect and learn from your experience at ${mentor.company}.`,
  
  aspirational: (student, mentor, skill) =>
    `Hi ${mentor.name}, I'm ${student.name}, aspiring to work in ${mentor.role}. Your career path at ${mentor.company} is inspiring. Would you be open to connecting so I can learn from your journey?`
}

