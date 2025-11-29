import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Linkedin, CheckCircle2, Loader2 } from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import LinkedInConnectionModal from '../common/LinkedInConnectionModal'
import api from '../../services/api'

export default function MentorCardActions({ mentor, onRequestSent, sharedSkills = [] }) {
  const { 
    sendConnectionRequest, 
    hasRequestedMentor,
    getRequestStatus,
    currentUser,
    studentSkills
  } = useMockData()
  
  const [isRequesting, setIsRequesting] = useState(false)
  const [requestStatus, setRequestStatus] = useState(null) // null, 'pending', 'accepted', 'declined'
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false)

  // Check if already requested on mount and whenever connection requests change
  useEffect(() => {
    const status = getRequestStatus(mentor.id)
    setRequestStatus(status)
  }, [mentor.id, getRequestStatus])

  const handleRequestConnection = async () => {
    console.log('🎯 BUTTON CLICKED: Request Connection')
    console.log('  ├─ Mentor:', mentor.name)
    console.log('  ├─ Mentor ID:', mentor.id)
    console.log('  └─ Current status:', requestStatus)
    
    setIsRequesting(true)

    try {
      // Try real API first, fallback to mock if needed
      let result;
      const message = `Hi ${mentor.name}, I would love to connect and learn from your experience.`;
      
      if (currentUser?.student_id || currentUser?.id) {
        try {
          // Use real API to save to PostgreSQL
          const studentId = currentUser.student_id || currentUser.id;
          result = await api.connection.sendRequest(mentor.id, message, studentId);
          console.log('✅ Connection request saved to PostgreSQL:', result);
        } catch (apiError) {
          console.warn('API request failed, using mock fallback:', apiError);
          // Fallback to mock if API fails
          result = await sendConnectionRequest(mentor.id, message);
        }
      } else {
        // No user ID, use mock for now
        result = await sendConnectionRequest(mentor.id, message);
      }
      
      setRequestStatus('pending')
      setIsRequesting(false)
      
      if (onRequestSent) {
        onRequestSent()
      }
    } catch (error) {
      console.error('Error sending connection request:', error)
      setIsRequesting(false)
      
      if (error.error === "Request already exists" || error.message?.includes('already')) {
        alert('You have already sent a request to this mentor.')
        setRequestStatus('pending') // Update UI
      } else {
        alert('Failed to send request. Please try again.')
      }
    }
  }

  const handleLinkedInClick = () => {
    // Open the smart connection modal instead of directly opening LinkedIn
    setIsLinkedInModalOpen(true)
  }

  // Calculate shared skills between student and mentor
  const getSharedSkills = () => {
    if (!studentSkills || !mentor.skills) return []
    
    const studentSkillsLower = studentSkills.map(s => s.toLowerCase())
    const mentorSkillsLower = mentor.skills.map(s => s.toLowerCase())
    
    return mentor.skills.filter(skill => 
      studentSkillsLower.includes(skill.toLowerCase())
    )
  }

  const getButtonState = () => {
    if (isRequesting) {
      return {
        disabled: true,
        className: 'bg-gray-300 text-gray-600 cursor-not-allowed',
        icon: <Loader2 className="w-5 h-5 animate-spin" />,
        text: 'Sending...'
      }
    }
    
    switch (requestStatus) {
      case 'pending':
        return {
          disabled: true,
          className: 'bg-yellow-100 text-yellow-700 cursor-not-allowed',
          icon: <CheckCircle2 className="w-5 h-5" />,
          text: 'Request Pending'
        }
      case 'accepted':
        return {
          disabled: true,
          className: 'bg-green-100 text-green-700 cursor-not-allowed',
          icon: <CheckCircle2 className="w-5 h-5" />,
          text: 'Request Accepted ✓'
        }
      case 'declined':
        return {
          disabled: true,
          className: 'bg-gray-100 text-gray-600 cursor-not-allowed',
          icon: <CheckCircle2 className="w-5 h-5" />,
          text: 'Request Declined'
        }
      default:
        return {
          disabled: false,
          className: 'bg-tamu-maroon text-white hover:bg-tamu-maroon-light',
          icon: <MessageCircle className="w-5 h-5" />,
          text: 'Request Connection'
        }
    }
  }

  const buttonState = getButtonState()
  const calculatedSharedSkills = sharedSkills.length > 0 ? sharedSkills : getSharedSkills()

  return (
    <>
      <div className="mt-4 flex gap-2">
        <motion.button
          whileHover={!buttonState.disabled ? { scale: 1.05 } : {}}
          whileTap={!buttonState.disabled ? { scale: 0.95 } : {}}
          onClick={handleRequestConnection}
          disabled={buttonState.disabled}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${buttonState.className}`}
        >
          {buttonState.icon}
          {buttonState.text}
        </motion.button>

        {mentor.linkedin_url && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLinkedInClick}
            className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
            title="Smart LinkedIn Connect"
          >
            <Linkedin className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Smart LinkedIn Connection Modal */}
      <LinkedInConnectionModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
        mentor={mentor}
        student={currentUser}
        sharedSkills={calculatedSharedSkills}
      />
    </>
  )
}

