import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, CheckCircle2, XCircle, Clock, Calendar, User, Sparkles, Loader2 } from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'

export default function SpeakerInvitations() {
  const { 
    currentUser, 
    getMySpeakerInvitations,
    acceptSpeakerInvitation, 
    declineSpeakerInvitation 
  } = useMockData()

  const [invitations, setInvitations] = useState([])
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  useEffect(() => {
    loadInvitations()
  }, [currentUser])

  const loadInvitations = () => {
    setLoading(true)
    setTimeout(() => {
      // For demo: Try to find speaker ID from current user or use default alumni IDs
      // Alumni IDs in mockData: 201 (Sarah), 202 (Michael), 203 (Emily), 204 (Robert), 205 (David)
      let speakerId = currentUser.id
      
      // If current user is not an alumni, check if they're in the alumni list
      if (currentUser.role !== 'alumni' && currentUser.role !== 'GuestSpeaker') {
        // For testing: Use first available alumni ID (201)
        speakerId = 201
        console.log('⚠️ Current user is not an alumni. Using default speaker ID:', speakerId)
        console.log('💡 To test: Change currentUser.id to 201-205 in MockDataContext.jsx')
      }
      
      console.log('🔍 Loading speaker invitations for speaker ID:', speakerId)
      const myInvites = getMySpeakerInvitations(speakerId)
      const pending = myInvites.filter(inv => inv.status === 'pending')
      
      console.log('📊 Found invitations:', {
        total: myInvites.length,
        pending: pending.length,
        accepted: myInvites.filter(inv => inv.status === 'accepted').length,
        declined: myInvites.filter(inv => inv.status === 'declined').length
      })
      
      setInvitations(myInvites)
      setPendingCount(pending.length)
      setLoading(false)
      
      console.log(`📬 Loaded ${myInvites.length} speaker invitations (${pending.length} pending)`)
    }, 500)
  }

  const handleAccept = async (invitationId) => {
    try {
      const result = await acceptSpeakerInvitation(invitationId)
      if (result.success) {
        loadInvitations() // Refresh invitations
        
        setToastMessage('Invitation accepted! You can now view this lecture in "My Speaking Sessions".')
        setToastType('success')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    } catch (error) {
      setToastMessage(error.message || 'Failed to accept invitation')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const handleDecline = async (invitationId) => {
    try {
      const result = await declineSpeakerInvitation(invitationId)
      if (result.success) {
        loadInvitations() // Refresh invitations
        
        setToastMessage('Invitation declined.')
        setToastType('success')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    } catch (error) {
      setToastMessage(error.message || 'Failed to decline invitation')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'declined':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 text-tamu-maroon mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Loading invitations...</p>
      </div>
    )
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
          <Mic className="w-8 h-8 text-tamu-maroon" />
          <h2 className="text-3xl font-bold text-gray-800">Speaker Invitations</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
            SPEAKER VIEW
          </span>
        </div>
        <p className="text-gray-600">Review and respond to speaking opportunity invitations</p>
        {pendingCount > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>{pendingCount} pending invitation{pendingCount !== 1 ? 's' : ''}</strong> awaiting your response
            </p>
          </div>
        )}
      </div>

      {/* Invitations List */}
      {invitations.length > 0 ? (
        <div className="grid gap-6">
          <AnimatePresence>
            {invitations.map((invitation) => (
              <motion.div
                key={invitation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Mic className="w-6 h-6 text-tamu-maroon" />
                      <h3 className="text-xl font-semibold text-gray-800">
                        {invitation.lectureTitle}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(invitation.status)}`}>
                        {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      {getStatusIcon(invitation.status)}
                      <span>
                        {invitation.status === 'pending' 
                          ? `Sent on ${new Date(invitation.sentAt).toLocaleDateString()}`
                          : `Responded on ${new Date(invitation.respondedAt).toLocaleDateString()}`
                        }
                      </span>
                    </div>

                    {/* Lecture Details */}
                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Professor: {invitation.professorName}</span>
                      </div>
                      {invitation.topicTags && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>Topics:</span>
                          {invitation.topicTags.split(', ').map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Match Reason */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900 mb-1">Why you were invited:</p>
                          <p className="text-sm text-blue-800">{invitation.matchReason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {invitation.status === 'pending' && (
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAccept(invitation.id)}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Accept Invitation</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDecline(invitation.id)}
                      className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Decline</span>
                    </motion.button>
                  </div>
                )}

                {invitation.status === 'accepted' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      ✅ You are confirmed as a speaker for this lecture. You can now view it in "My Speaking Sessions" tab.
                    </p>
                  </div>
                )}

                {invitation.status === 'declined' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      You declined this invitation.
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Mic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No invitations yet</p>
          <p className="text-gray-500 text-sm">
            You'll receive invitations to speak at lectures based on your expertise.
          </p>
        </div>
      )}
    </div>
  )
}

