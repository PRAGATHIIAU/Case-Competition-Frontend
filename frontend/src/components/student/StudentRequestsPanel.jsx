import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Building2,
  Calendar,
  MessageSquare,
  AlertCircle,
  PartyPopper
} from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'

export default function StudentRequestsPanel() {
  const { 
    getMyConnectionRequests,
    connectionRequests, // For reactivity
    currentUser
  } = useMockData()

  const [requests, setRequests] = useState([])

  useEffect(() => {
    const myRequests = getMyConnectionRequests()
    // Sort by date (newest first)
    myRequests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    setRequests(myRequests)
  }, [connectionRequests])

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

  const getStatusDisplay = (status, mentorName, updatedAt) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-5 h-5" />,
          bgColor: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-800',
          badge: 'bg-yellow-100',
          message: 'Waiting for response',
          description: `Your request is pending. ${mentorName} will respond soon.`
        }
      case 'accepted':
        return {
          icon: <PartyPopper className="w-5 h-5" />,
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-800',
          badge: 'bg-green-100',
          message: '🎉 Request Accepted!',
          description: `${mentorName} accepted your request ${updatedAt ? `on ${formatDate(updatedAt)}` : ''}! Check your email for next steps.`
        }
      case 'declined':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-700',
          badge: 'bg-gray-100',
          message: 'Request Declined',
          description: `${mentorName} declined this request. Don't worry - keep exploring other mentors!`
        }
      default:
        return {
          icon: <MessageSquare className="w-5 h-5" />,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600',
          badge: 'bg-gray-100',
          message: 'Unknown Status',
          description: ''
        }
    }
  }

  const getStats = () => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      accepted: requests.filter(r => r.status === 'accepted').length,
      declined: requests.filter(r => r.status === 'declined').length
    }
  }

  const stats = getStats()

  if (requests.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-8 text-center"
      >
        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Connection Requests Yet</h3>
        <p className="text-gray-500 mb-6">
          Start connecting with mentors to see your requests here.
        </p>
        <p className="text-sm text-gray-400">
          Tip: Upload your resume in the Profile tab to get personalized mentor recommendations!
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-md"
        >
          <MessageSquare className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-sm opacity-90">Total Requests</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 shadow-md"
        >
          <Clock className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-3xl font-bold">{stats.pending}</p>
          <p className="text-sm opacity-90">Pending</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-md"
        >
          <CheckCircle2 className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-3xl font-bold">{stats.accepted}</p>
          <p className="text-sm opacity-90">Accepted</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-xl p-4 shadow-md"
        >
          <XCircle className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-3xl font-bold">{stats.declined}</p>
          <p className="text-sm opacity-90">Declined</p>
        </motion.div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Your Connection Requests</h3>
        
        {requests.map((request, index) => {
          const statusInfo = getStatusDisplay(request.status, request.mentorName, request.updated_at)
          
          return (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border-2 rounded-xl p-6 ${statusInfo.bgColor} transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                {/* Mentor Info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-tamu-maroon to-tamu-maroon-light rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {request.mentorName.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {request.mentorName}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Sent {formatDate(request.created_at)}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.badge} ${statusInfo.textColor} font-semibold`}>
                  {statusInfo.icon}
                  <span>{statusInfo.message}</span>
                </div>
              </div>

              {/* Message Sent */}
              {request.message && (
                <div className="bg-white/60 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 font-medium mb-1">Your Message:</p>
                  <p className="text-gray-700 italic">"{request.message}"</p>
                </div>
              )}

              {/* Status Description */}
              <div className={`flex items-start gap-2 ${statusInfo.textColor}`}>
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{statusInfo.description}</p>
              </div>

              {/* Next Steps for Accepted Requests */}
              {request.status === 'accepted' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-green-200"
                >
                  <p className="text-sm font-semibold text-green-800 mb-2">Next Steps:</p>
                  <ul className="text-sm text-green-700 space-y-1 ml-4">
                    <li>• Check your email ({currentUser.email}) for an introduction message</li>
                    <li>• Schedule a meeting with {request.mentorName}</li>
                    <li>• Prepare questions about your career goals</li>
                  </ul>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">Need help?</p>
            <p className="text-sm text-blue-800">
              If a mentor accepts your request, you'll receive an email introduction. 
              If you don't hear back within a week, consider reaching out to other mentors with similar expertise.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

