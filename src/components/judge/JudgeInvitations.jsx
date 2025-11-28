import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle2, XCircle, Clock, Trophy, User, Building2, Sparkles, Star, ArrowRight } from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'

export default function JudgeInvitations() {
  const navigate = useNavigate()
  const { 
    currentUser, 
    getMyInvitations, 
    getPendingInvitations,
    acceptInvitation, 
    declineInvitation,
    getJudgeFeedback
  } = useMockData()

  const [invitations, setInvitations] = useState([])
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      // For demo: Use stakeholder ID from currentUser or default to an alumni ID
      const stakeholderId = currentUser.role === 'alumni' || currentUser.role === 'mentor' 
        ? currentUser.id 
        : 201 // Default to Sarah Johnson for demo
      
      const myInvites = getMyInvitations(stakeholderId)
      const pending = getPendingInvitations(stakeholderId)
      
      setInvitations(myInvites)
      setPendingCount(pending.length)
      setLoading(false)
      
      console.log(`📬 Loaded ${myInvites.length} invitations (${pending.length} pending)`)
    }, 500)
  }, [currentUser, getMyInvitations, getPendingInvitations])

  const handleAccept = async (invitationId) => {
    try {
      const result = await acceptInvitation(invitationId)
      if (result.success) {
        // Refresh invitations
        const stakeholderId = currentUser.role === 'alumni' || currentUser.role === 'mentor' 
          ? currentUser.id 
          : 201
        const updatedInvites = getMyInvitations(stakeholderId)
        const pending = getPendingInvitations(stakeholderId)
        setInvitations(updatedInvites)
        setPendingCount(pending.length)
        
        setToastMessage('Invitation accepted! You are now a judge for this competition.')
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
      const result = await declineInvitation(invitationId)
      if (result.success) {
        // Refresh invitations
        const stakeholderId = currentUser.role === 'alumni' || currentUser.role === 'mentor' 
          ? currentUser.id 
          : 201
        const updatedInvites = getMyInvitations(stakeholderId)
        const pending = getPendingInvitations(stakeholderId)
        setInvitations(updatedInvites)
        setPendingCount(pending.length)
        
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tamu-maroon mx-auto"></div>
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
          <h2 className="text-3xl font-bold text-gray-800">Judge Invitations</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
            STAKEHOLDER VIEW
          </span>
        </div>
        <p className="text-gray-600">Review and respond to competition judging invitations</p>
        <p className="text-sm text-gray-500 mt-1">
          💡 <strong>Note:</strong> This is the stakeholder view. Admins can manage all invitations from the Faculty Dashboard.
        </p>
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
                      <Trophy className="w-6 h-6 text-tamu-maroon" />
                      <h3 className="text-xl font-semibold text-gray-800">
                        {invitation.competitionName}
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

                    {/* Match Reason */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900 mb-1">Why you were invited:</p>
                          <p className="text-sm text-blue-800">{invitation.matchReason}</p>
                          {invitation.matchedSkills && invitation.matchedSkills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {invitation.matchedSkills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
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
                    <p className="text-sm text-green-800 mb-3">
                      ✅ You are confirmed as a judge for this competition. You can now access the scoring dashboard.
                    </p>
                    {/* Check if feedback already submitted */}
                    {(() => {
                      const feedback = getJudgeFeedback(invitation.competitionId, currentUser.id)
                      const hasFeedback = !!feedback
                      
                      return hasFeedback ? (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Feedback submitted</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/stakeholder/feedback/${invitation.competitionId}`)}
                            className="w-full bg-tamu-maroon text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-tamu-maroon-light transition-colors flex items-center justify-center gap-2"
                          >
                            <Star className="w-4 h-4" />
                            <span>View/Edit Feedback</span>
                            <ArrowRight className="w-3 h-3" />
                          </motion.button>
                        </div>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <p className="text-xs text-green-700 mb-2">
                            After the competition ends, you can share your feedback to help us improve.
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/stakeholder/feedback/${invitation.competitionId}`)}
                            className="w-full bg-tamu-maroon text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-tamu-maroon-light transition-colors flex items-center justify-center gap-2"
                          >
                            <Star className="w-4 h-4" />
                            <span>Rate Your Experience</span>
                            <ArrowRight className="w-3 h-3" />
                          </motion.button>
                        </div>
                      )
                    })()}
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
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No invitations yet</p>
          <p className="text-gray-500 text-sm">
            You'll receive invitations to judge competitions based on your expertise.
          </p>
        </div>
      )}
    </div>
  )
}

