import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trophy, 
  Send, 
  User, 
  Building2, 
  Sparkles,
  Check,
  Loader2
} from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'

export default function StakeholderInvitationsList() {
  const { getAllInvitations, sendAcknowledgement, testTriggerFollowUps, testTriggerAppreciation, judgeInvitations } = useMockData()
  
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const [sendingIds, setSendingIds] = useState(new Set()) // Track which invitations are being processed
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'accepted', 'needs_acknowledgement'
  const [isTriggeringFollowUps, setIsTriggeringFollowUps] = useState(false)
  const [isTriggeringAppreciation, setIsTriggeringAppreciation] = useState(false)

  const loadInvitations = () => {
    setLoading(true)
    setTimeout(() => {
      try {
        const allInvites = getAllInvitations()
        console.log('📬 getAllInvitations() returned:', allInvites)
        console.log('📬 Raw judgeInvitations state:', judgeInvitations)
        console.log(`📬 Loaded ${allInvites.length} invitations for admin review`)
        setInvitations(allInvites)
        setLoading(false)
      } catch (error) {
        console.error('❌ Error loading invitations:', error)
        setLoading(false)
      }
    }, 500)
  }

  const handleTriggerFollowUps = async () => {
    setIsTriggeringFollowUps(true)
    try {
      const result = await testTriggerFollowUps()
      if (result.success) {
        // Refresh invitations to show updated follow-up counts
        setTimeout(() => {
          const updatedInvites = getAllInvitations()
          setInvitations(updatedInvites)
        }, 500)

        setToastMessage(
          `Follow-up check completed! ${result.sentCount} email(s) sent, ${result.skippedCount} skipped.`
        )
        setToastType('success')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 5000)
      }
    } catch (error) {
      setToastMessage(error.message || 'Failed to trigger follow-up emails')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setIsTriggeringFollowUps(false)
    }
  }

  const handleTriggerAppreciation = async () => {
    setIsTriggeringAppreciation(true)
    try {
      const result = await testTriggerAppreciation()
      if (result.success) {
        setToastMessage(
          `Appreciation emails processed! ${result.sentCount} email(s) sent, ${result.skippedCount} skipped.`
        )
        setToastType('success')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 5000)
      }
    } catch (error) {
      setToastMessage(error.message || 'Failed to trigger appreciation emails')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setIsTriggeringAppreciation(false)
    }
  }

  useEffect(() => {
    loadInvitations()
  }, []) // Empty dependency array - only run once on mount

  const handleSendAcknowledgement = async (stakeholderId, competitionId, stakeholderName) => {
    // Prevent double-clicking
    const key = `${stakeholderId}-${competitionId}`
    if (sendingIds.has(key)) {
      return
    }

    setSendingIds(prev => new Set(prev).add(key))

    try {
      const result = await sendAcknowledgement(stakeholderId, competitionId)
      
      if (result.success) {
        // Refresh invitations after a short delay to ensure state is updated
        setTimeout(() => {
          const updatedInvites = getAllInvitations()
          console.log('🔄 Refreshed invitations after acknowledgement:', updatedInvites)
          setInvitations(updatedInvites)
        }, 100)
        
        setToastMessage(`Acknowledgement email sent to ${result.stakeholderName}`)
        setToastType('success')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    } catch (error) {
      setToastMessage(error.message || 'Failed to send acknowledgement email')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setSendingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(key)
        return newSet
      })
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'declined':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'under_review':
        return <Clock className="w-5 h-5 text-blue-600" />
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
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
  }

  // Filter invitations
  const filteredInvitations = invitations.filter(inv => {
    if (filter === 'all') return true
    if (filter === 'pending') return inv.status === 'pending'
    if (filter === 'accepted') return inv.status === 'accepted'
    if (filter === 'needs_acknowledgement') {
      // Show invitations that have been responded to but not acknowledged
      return (inv.status === 'accepted' || inv.status === 'declined') && !inv.acknowledged
    }
    return true
  })

  // Count invitations needing acknowledgement
  const needsAcknowledgementCount = invitations.filter(inv => 
    (inv.status === 'accepted' || inv.status === 'declined') && !inv.acknowledged
  ).length

  return (
    <div className="space-y-6">
      {/* Test: Verify component is rendering */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-green-800">
          ✅ <strong>Component Loaded!</strong> If you see this, the component is working.
        </p>
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tamu-maroon mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invitations...</p>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-gray-800">Stakeholder Invitations (Admin View)</h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                ADMIN ONLY
              </span>
            </div>
            <p className="text-gray-600">Review and manage judge invitations, send acknowledgement emails</p>
            <p className="text-sm text-gray-500 mt-1">
              💡 <strong>Note:</strong> This is the admin view. Stakeholders see a different view on the Industry Dashboard.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadInvitations}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            Refresh
          </motion.button>
        </div>
        {needsAcknowledgementCount > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>{needsAcknowledgementCount} invitation{needsAcknowledgementCount !== 1 ? 's' : ''}</strong> need acknowledgement emails
            </p>
          </div>
        )}
        {/* Debug Info */}
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
          Total Invitations: {invitations.length} | Filter: {filter}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'all', label: 'All', count: invitations.length },
          { id: 'pending', label: 'Pending', count: invitations.filter(i => i.status === 'pending').length },
          { id: 'accepted', label: 'Accepted', count: invitations.filter(i => i.status === 'accepted').length },
          { id: 'needs_acknowledgement', label: 'Needs Acknowledgement', count: needsAcknowledgementCount }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              filter === tab.id
                ? 'border-tamu-maroon text-tamu-maroon'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label} {tab.count > 0 && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Invitations List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading invitations...</p>
        </div>
      ) : filteredInvitations.length > 0 ? (
        <div className="grid gap-6">
          <AnimatePresence>
            {filteredInvitations.map((invitation) => {
              const key = `${invitation.stakeholderId}-${invitation.competitionId}`
              const isSending = sendingIds.has(key)
              const needsAck = (invitation.status === 'accepted' || invitation.status === 'declined') && !invitation.acknowledged

              return (
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
                          {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1).replace('_', ' ')}
                        </span>
                        {invitation.acknowledged && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Acknowledged
                          </span>
                        )}
                      </div>

                      {/* Stakeholder Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{invitation.stakeholderName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="text-xs">{invitation.stakeholderEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invitation.status)}
                          <span className="text-xs">
                            Sent: {new Date(invitation.sentAt).toLocaleDateString()}
                          </span>
                        </div>
                        {invitation.followUpCount > 0 && invitation.lastEmailSentAt && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="text-xs text-orange-600">
                              Last Follow-up: {new Date(invitation.lastEmailSentAt).toLocaleDateString()} ({invitation.followUpCount} sent)
                            </span>
                          </div>
                        )}
                        {invitation.respondedAt && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600">
                              Responded: {new Date(invitation.respondedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Match Reason */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-900 mb-1">Match Reason:</p>
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

                      {/* Acknowledgement Status */}
                      {invitation.acknowledged && invitation.acknowledgedAt && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-green-800">
                            ✅ Acknowledgement email sent on {new Date(invitation.acknowledgedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {needsAck && (
                      <motion.button
                        whileHover={!isSending ? { scale: 1.02 } : {}}
                        whileTap={!isSending ? { scale: 0.98 } : {}}
                        onClick={() => handleSendAcknowledgement(
                          invitation.stakeholderId,
                          invitation.competitionId,
                          invitation.stakeholderName
                        )}
                        disabled={isSending}
                        className={`w-full bg-tamu-maroon text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                          isSending
                            ? 'opacity-70 cursor-not-allowed'
                            : 'hover:bg-tamu-maroon-light shadow-md hover:shadow-lg'
                        }`}
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Send Acknowledgement Email</span>
                          </>
                        )}
                      </motion.button>
                    )}

                    {invitation.status === 'pending' && !needsAck && (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-2">
                            ⏳ Waiting for stakeholder response
                          </p>
                          <p className="text-xs text-gray-500">
                            Acknowledgement email will be available after they reply via email.
                          </p>
                        </div>
                        {invitation.followUpCount < 2 && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              // Manual reminder trigger (could be implemented)
                              alert(`Manual reminder feature coming soon. Use "Test Follow-Up Emails" button below to send automated reminders.`)
                            }}
                            className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium text-sm hover:bg-orange-200 transition-colors border border-orange-300"
                          >
                            Send Reminder
                          </motion.button>
                        )}
                      </div>
                    )}

                    {invitation.status === 'accepted' && !needsAck && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <p className="text-sm font-medium text-green-800">
                            Confirmed - Stakeholder accepted invitation
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      ) : !loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No invitations found</p>
          <p className="text-gray-500 text-sm mb-4">
            {filter === 'needs_acknowledgement' 
              ? 'All invitations have been acknowledged.'
              : filter === 'all'
              ? 'No invitations have been created yet. Create a competition to generate invitations.'
              : 'No invitations match the selected filter.'}
          </p>
          {invitations.length === 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left max-w-md mx-auto">
              <p className="text-sm text-blue-800 font-semibold mb-2">Debug Info:</p>
              <p className="text-xs text-blue-700">Total invitations in state: {invitations.length}</p>
              <p className="text-xs text-blue-700">Filter: {filter}</p>
              <p className="text-xs text-blue-700">Loading: {loading ? 'Yes' : 'No'}</p>
              <p className="text-xs text-blue-700 mt-2">
                💡 Tip: Go to "Create Competition" tab and create a competition to generate invitations automatically.
              </p>
            </div>
          )}
        </div>
      ) : null}

      {/* Follow-Up Email Trigger (Test) - Moved to bottom */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mb-1">Follow-Up Email System</h4>
            <p className="text-xs text-yellow-800">
              Test the automated follow-up email system. This will check for pending invitations older than 3 days and send reminder emails.
            </p>
          </div>
          <motion.button
            whileHover={!isTriggeringFollowUps ? { scale: 1.05 } : {}}
            whileTap={!isTriggeringFollowUps ? { scale: 0.95 } : {}}
            onClick={handleTriggerFollowUps}
            disabled={isTriggeringFollowUps}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              isTriggeringFollowUps
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-yellow-600 text-white hover:bg-yellow-700 shadow-md'
            }`}
          >
            {isTriggeringFollowUps ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Test Follow-Up Emails</span>
              </>
            )}
          </motion.button>
        </div>
          <p className="text-xs text-yellow-700 mt-2">
            ⚠️ <strong>Test Mode:</strong> This triggers immediately (ignores 3-day threshold) for testing purposes.
          </p>
        </div>

        {/* Appreciation Email Trigger (Test) */}
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-green-900 mb-1">Appreciation Email System</h4>
              <p className="text-xs text-green-800">
                Send thank-you emails to alumni after they complete activities (speaking at events or judging competitions).
              </p>
            </div>
            <motion.button
              whileHover={!isTriggeringAppreciation ? { scale: 1.05 } : {}}
              whileTap={!isTriggeringAppreciation ? { scale: 0.95 } : {}}
              onClick={handleTriggerAppreciation}
              disabled={isTriggeringAppreciation}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                isTriggeringAppreciation
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
              }`}
            >
              {isTriggeringAppreciation ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Test Appreciation Emails</span>
                </>
              )}
            </motion.button>
          </div>
          <p className="text-xs text-green-700 mt-2">
            ✅ <strong>Test Mode:</strong> This processes all past events and competitions immediately for testing purposes.
          </p>
        </div>
      </div>
  )
}

