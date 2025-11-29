import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  User, 
  BookOpen,
  Bell,
  Calendar,
  MessageSquare,
  UserCheck,
  UserX,
  ChevronDown,
  LogOut
} from 'lucide-react'
import { useMockData } from '../contexts/MockDataContext'
import SessionConfirmationModal from './mentor/SessionConfirmationModal'
import ChatBox from './messaging/ChatBox'
import { logout } from '../utils/auth'

export default function MentorDashboard() {
  const { 
    currentUser, 
    getPendingRequestsForMentor,
    getReceivedRequests,
    updateRequestStatus,
    connectionRequests, // This will trigger re-render when updated
    mentors
  } = useMockData()

  // Demo Mode: Allow selecting which mentor to view as
  const [selectedMentorId, setSelectedMentorId] = useState(1) // Default: Sarah Johnson (ID 1)
  const [activeTab, setActiveTab] = useState('pending') // 'pending', 'accepted', 'declined', 'all'
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState(null)
  const [notification, setNotification] = useState(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  // Fetch requests based on active tab
  useEffect(() => {
    console.log('🔍 DEBUG: Fetching requests for Mentor ID:', selectedMentorId)
    console.log('🔍 DEBUG: All connection requests:', connectionRequests)
    
    const allRequests = getReceivedRequests(selectedMentorId)
    
    let filtered = allRequests
    if (activeTab === 'pending') {
      filtered = allRequests.filter(req => req.status === 'pending')
    } else if (activeTab === 'accepted') {
      filtered = allRequests.filter(req => req.status === 'accepted')
    } else if (activeTab === 'declined') {
      filtered = allRequests.filter(req => req.status === 'declined')
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    
    console.log('✅ DEBUG: Filtered requests:', filtered)
    console.log('✅ DEBUG: Active tab:', activeTab)
    
    setRequests(filtered)
  }, [activeTab, connectionRequests, selectedMentorId, getReceivedRequests])

  const handleAccept = async (requestId) => {
    // Open confirmation modal instead of directly accepting
    const request = requests.find(r => r.id === requestId)
    if (request) {
      setSelectedRequest(request)
      setConfirmModalOpen(true)
    }
  }

  const handleConfirmSession = (session) => {
    showNotification('Session confirmed! Confirmation emails sent to both parties.', 'success')
    setConfirmModalOpen(false)
    setSelectedRequest(null)
  }

  const handleDecline = async (requestId) => {
    setProcessingId(requestId)
    setLoading(true)
    
    try {
      await updateRequestStatus(requestId, 'declined')
      showNotification('Request declined.', 'info')
    } catch (error) {
      showNotification(error.error || 'Failed to decline request', 'error')
    } finally {
      setLoading(false)
      setProcessingId(null)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        )
      case 'accepted':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <UserCheck className="w-4 h-4" />
            Accepted
          </span>
        )
      case 'declined':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
            <UserX className="w-4 h-4" />
            Declined
          </span>
        )
      default:
        return null
    }
  }

  const pendingCount = getReceivedRequests(selectedMentorId).filter(r => r.status === 'pending').length
  const selectedMentor = mentors.find(m => m.id === selectedMentorId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-tamu-maroon to-tamu-maroon-light text-white py-8 px-6 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">Mentor Dashboard</h1>
              <p className="text-gray-100 text-lg mb-4">Manage your mentorship connections</p>
              
              {/* Mentor Selector (Demo Mode) */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 inline-block">
                <label className="text-sm text-gray-200 block mb-1">🧪 Demo Mode - View as:</label>
                <select
                  value={selectedMentorId}
                  onChange={(e) => {
                    const newId = parseInt(e.target.value)
                    console.log('🔄 Switching to Mentor ID:', newId)
                    setSelectedMentorId(newId)
                  }}
                  className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold cursor-pointer"
                >
                  {mentors.map(mentor => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name} - {mentor.company}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  <span className="text-2xl font-bold">{pendingCount}</span>
                </div>
                <p className="text-sm text-gray-100">Pending Requests</p>
              </div>
              <button
                onClick={logout}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-6 z-50"
          >
            <div className={`rounded-lg shadow-xl px-6 py-4 flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}>
              {notification.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {notification.type === 'error' && <XCircle className="w-5 h-5" />}
              <span className="font-medium">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-6">
          <div className="flex gap-2">
            {[
              { id: 'pending', label: 'Pending', count: getReceivedRequests(selectedMentorId).filter(r => r.status === 'pending').length },
              { id: 'accepted', label: 'Accepted', count: getReceivedRequests(selectedMentorId).filter(r => r.status === 'accepted').length },
              { id: 'declined', label: 'Declined', count: getReceivedRequests(selectedMentorId).filter(r => r.status === 'declined').length },
              { id: 'all', label: 'All Requests', count: getReceivedRequests(selectedMentorId).length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-tamu-maroon text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-md p-12 text-center"
          >
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No {activeTab !== 'all' ? activeTab : ''} requests
            </h3>
            <p className="text-gray-500">
              {activeTab === 'pending' 
                ? "You don't have any pending mentorship requests at the moment."
                : `You don't have any ${activeTab} requests.`
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      {/* Student Avatar */}
                      <div className="w-16 h-16 bg-gradient-to-br from-tamu-maroon to-tamu-maroon-light rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {request.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      {/* Student Info */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {request.studentName}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {request.studentEmail}
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {request.studentMajor}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(request.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>

                  {/* Message */}
                  {request.message && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-700 italic">"{request.message}"</p>
                    </div>
                  )}

                  {/* Action Buttons (only for pending requests) */}
                  {request.status === 'pending' && (
                    <div className="flex gap-3 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAccept(request.id)}
                        disabled={loading && processingId === request.id}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading && processingId === request.id ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Confirm & Schedule
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDecline(request.id)}
                        disabled={loading && processingId === request.id}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-5 h-5" />
                        Decline
                      </motion.button>
                    </div>
                  )}

                  {/* Session Details (for confirmed sessions) */}
                  {request.status === 'confirmed' && request.sessionStatus === 'confirmed' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">Session Scheduled</h4>
                      </div>
                      <div className="space-y-2 text-sm text-blue-800">
                        {request.meetingTime && (
                          <p>
                            <strong>Time:</strong> {new Date(request.meetingTime).toLocaleString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                        {request.meetingLink && (
                          <p>
                            <strong>Meeting Link:</strong>{' '}
                            <a 
                              href={request.meetingLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {request.meetingLink}
                            </a>
                          </p>
                        )}
                        {request.calendarLink && (
                          <a
                            href={request.calendarLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            <Calendar className="w-4 h-4" />
                            Add to Google Calendar
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status Message (for accepted/declined) */}
                  {request.status !== 'pending' && request.status !== 'confirmed' && request.updated_at && (
                    <div className={`mt-4 p-3 rounded-lg ${
                      request.status === 'accepted' 
                        ? 'bg-green-50 text-green-800' 
                        : 'bg-gray-50 text-gray-600'
                    }`}>
                      <p className="text-sm font-medium">
                        {request.status === 'accepted' 
                          ? `✓ You accepted this request on ${formatDate(request.updated_at)}`
                          : `You declined this request on ${formatDate(request.updated_at)}`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Session Confirmation Modal */}
      {selectedRequest && (
        <SessionConfirmationModal
          request={selectedRequest}
          isOpen={confirmModalOpen}
          onClose={() => {
            setConfirmModalOpen(false)
            setSelectedRequest(null)
          }}
          onSuccess={handleConfirmSession}
        />
      )}

      {/* ChatBox - Floating at bottom right */}
      <ChatBox />
    </div>
  )
}

