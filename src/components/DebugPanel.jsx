import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useMockData } from '../contexts/MockDataContext'

export default function DebugPanel() {
  const { connectionRequests, currentUser } = useMockData()
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  if (process.env.NODE_ENV === 'production') {
    return null // Don't show in production
  }

  return (
    <>
      {/* Floating Debug Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-tamu-maroon text-white p-4 rounded-full shadow-2xl hover:bg-tamu-maroon-light transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Open Debug Panel"
      >
        <Bug className="w-6 h-6" />
        {connectionRequests.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {connectionRequests.length}
          </span>
        )}
      </motion.button>

      {/* Debug Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed bottom-6 right-24 z-50 bg-white rounded-xl shadow-2xl w-96 max-h-[80vh] overflow-hidden border-2 border-tamu-maroon"
          >
            {/* Header */}
            <div className="bg-tamu-maroon text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5" />
                <h3 className="font-bold">Debug Panel</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(80vh-64px)]">
              {/* Current User Info */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  👤 Current User
                </h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">ID:</span> {currentUser.id}</p>
                  <p><span className="font-medium">Name:</span> {currentUser.name}</p>
                  <p><span className="font-medium">Role:</span> {currentUser.role}</p>
                  <p><span className="font-medium">Email:</span> {currentUser.email}</p>
                </div>
              </div>

              {/* Connection Requests */}
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-yellow-900 flex items-center gap-2">
                    📬 Connection Requests ({connectionRequests.length})
                  </h4>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-yellow-900 hover:bg-yellow-100 rounded p-1 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {connectionRequests.length === 0 ? (
                  <p className="text-sm text-yellow-700 italic">No requests yet</p>
                ) : (
                  <div className="text-sm space-y-2">
                    {connectionRequests.map((req, index) => (
                      <div
                        key={req.id}
                        className="bg-white rounded p-2 border border-yellow-300"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">Request #{index + 1}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            req.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                            req.status === 'accepted' ? 'bg-green-200 text-green-800' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-700">
                          <p><span className="font-medium">From:</span> {req.studentName} (ID: {req.sender_id})</p>
                          <p><span className="font-medium">To:</span> {req.mentorName} (ID: {req.receiver_id})</p>
                          
                          {isExpanded && (
                            <>
                              <p><span className="font-medium">Email:</span> {req.studentEmail}</p>
                              <p><span className="font-medium">Major:</span> {req.studentMajor}</p>
                              <p><span className="font-medium">Message:</span> {req.message}</p>
                              <p><span className="font-medium">Created:</span> {new Date(req.created_at).toLocaleString()}</p>
                              {req.updated_at && (
                                <p><span className="font-medium">Updated:</span> {new Date(req.updated_at).toLocaleString()}</p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">📝 How to Test</h4>
                <ol className="text-xs text-green-800 space-y-1 list-decimal list-inside">
                  <li>Go to Student Dashboard</li>
                  <li>Upload resume & click "Request Connection"</li>
                  <li>Watch this panel - request should appear</li>
                  <li>Go to Mentor Dashboard</li>
                  <li>Select the mentor you requested</li>
                  <li>See the request appear in the list</li>
                </ol>
              </div>

              {/* Console Note */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600">
                  💡 <strong>Tip:</strong> Open browser DevTools (F12) and check the Console tab for detailed logs of all operations.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

