import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Mail, 
  Clock, 
  AlertCircle,
  Send,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Sparkles,
  X
} from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'
import api from '../../services/api'

export default function InactiveAlumniList() {
  const { getInactiveAlumni, sendReEngagementEmail } = useMockData()
  const [inactiveAlumni, setInactiveAlumni] = useState([])
  const [totalInactiveAlumni, setTotalInactiveAlumni] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sendingEmail, setSendingEmail] = useState(null) // Track which alumni email is being sent
  const [error, setError] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [selectedAlumni, setSelectedAlumni] = useState(null) // For email draft modal
  const [emailDraft, setEmailDraft] = useState('')
  const [generatingDraft, setGeneratingDraft] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)

  useEffect(() => {
    loadInactiveAlumni()
  }, [])

  const calculateMonthsInactive = (lastActiveAt) => {
    if (!lastActiveAt) return 6
    const parsedDate = new Date(lastActiveAt)
    if (Number.isNaN(parsedDate.getTime())) return 6

    const diffMs = Date.now() - parsedDate.getTime()
    const months = diffMs / (1000 * 60 * 60 * 24 * 30)
    return Math.max(1, Math.round(months))
  }

  const normalizeAlumniRecords = (records = []) =>
    records.map((record, index) => {
      const lastActiveAt =
        record.lastActiveAt ||
        record.lastLogin ||
        record.last_active_at ||
        record.lastSeen ||
        record.last_seen ||
        null

      const monthsInactive =
        record.monthsInactive !== undefined
          ? record.monthsInactive
          : calculateMonthsInactive(lastActiveAt)

      return {
        ...record,
        id: record.id || record.alumni_id || record.email || `alumni-${index}`,
        name: record.name || record.fullName || record.email || 'Unknown Alumni',
        email: record.email || record.contactEmail || 'N/A',
        company: record.company || record.organization || record.employer || '—',
        industry: record.industry || record.sector || 'General',
        title: record.title || record.role || '',
        lastActiveAt,
        monthsInactive,
      }
    })

  const loadInactiveAlumni = async () => {
    setLoading(true)
    setError(null)

    let pythonFallback = null
    let mockFallback = null

    try {
      const [inactiveResult, basicStatsResult] = await Promise.allSettled([
        api.admin.getInactiveAlumni(),
        api.admin.getBasicStats(),
      ])

      let normalizedRecords = []

      if (inactiveResult.status === 'fulfilled' && Array.isArray(inactiveResult.value)) {
        normalizedRecords = normalizeAlumniRecords(inactiveResult.value)
      } else {
        const pythonResponse = await api.python.fetchInactiveAlumni()
        pythonFallback = pythonResponse

        if (pythonResponse?.success && Array.isArray(pythonResponse.data)) {
          normalizedRecords = normalizeAlumniRecords(pythonResponse.data)
        } else {
          console.warn('Python backend not available, using mock data')
          const result = await getInactiveAlumni()
          mockFallback = result

          if (result.success && Array.isArray(result.inactiveAlumni)) {
            normalizedRecords = normalizeAlumniRecords(result.inactiveAlumni)
          } else {
            const message = result.message || 'Failed to load inactive alumni'
            throw new Error(message)
          }
        }
      }

      setInactiveAlumni(normalizedRecords)

      if (basicStatsResult.status === 'fulfilled' && typeof basicStatsResult.value?.inactiveAlumniCount === 'number') {
        setTotalInactiveAlumni(basicStatsResult.value.inactiveAlumniCount)
      } else if (inactiveResult.status === 'fulfilled' && Array.isArray(inactiveResult.value)) {
        setTotalInactiveAlumni(inactiveResult.value.length)
      } else if (pythonFallback?.success && Array.isArray(pythonFallback.data)) {
        setTotalInactiveAlumni(pythonFallback.data.length)
      } else if (mockFallback?.success && Array.isArray(mockFallback.inactiveAlumni)) {
        setTotalInactiveAlumni(mockFallback.inactiveAlumni.length)
      } else {
        setTotalInactiveAlumni(normalizedRecords.length)
      }
    } catch (err) {
      console.error('Error loading inactive alumni:', err)
      setInactiveAlumni([])
      setTotalInactiveAlumni(0)
      setError(err.message || 'Failed to load inactive alumni')
      setToastMessage(err.message || 'Failed to load inactive alumni')
      setToastType('error')
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }

  const handleDraftEmail = async (alumni) => {
    setSelectedAlumni(alumni)
    setGeneratingDraft(true)
    setShowEmailModal(true)
    setEmailDraft('')
    
    try {
      // Generate AI email draft from Python backend
      const response = await api.python.generateReengagementDraft({
        alumni_id: alumni.id,
        name: alumni.name,
        email: alumni.email,
        company: alumni.company,
        industry: alumni.industry || 'General',
        lastActiveAt: alumni.lastActiveAt,
      })
      
      if (response.success && response.data) {
        // Extract email draft (could be in email_draft field or personalized_content)
        const draft = response.data.email_draft || response.data.personalized_content || ''
        setEmailDraft(draft)
      } else {
        throw new Error('Failed to generate email draft')
      }
    } catch (err) {
      console.error('Error generating email draft:', err)
      setToastMessage(err.message || 'Failed to generate email draft')
      setToastType('error')
      setShowToast(true)
      // Set a fallback draft
      setEmailDraft(`Subject: Reconnecting with CMIS\n\nHi ${alumni.name},\n\nWe noticed it's been a while since we last connected...`)
    } finally {
      setGeneratingDraft(false)
    }
  }

  const handleSendEmail = async (alumniId, email, draft) => {
    setSendingEmail(alumniId)
    try {
      // Try Python backend first
      const response = await api.python.sendReengagementEmail(alumniId, email, draft)
      
      if (response.success) {
        setToastMessage('Re-engagement email sent successfully!')
        setToastType('success')
        setShowToast(true)
        setShowEmailModal(false)
        setSelectedAlumni(null)
        setEmailDraft('')
      } else {
        throw new Error(response.message || 'Failed to send email')
      }
    } catch (err) {
      console.error('Error sending email:', err)
      // Fallback to mock function
      try {
        const result = await sendReEngagementEmail(alumniId)
        if (result.success) {
          setToastMessage('Re-engagement email sent successfully!')
          setToastType('success')
          setShowToast(true)
          setShowEmailModal(false)
          setSelectedAlumni(null)
          setEmailDraft('')
        }
      } catch (fallbackErr) {
        setToastMessage(err.message || 'Failed to send email')
        setToastType('error')
        setShowToast(true)
      }
    } finally {
      setSendingEmail(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatMonthsAgo = (months) => {
    if (months < 1) return 'Less than 1 month'
    if (months === 1) return '1 month'
    return `${months} months`
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Inactive Alumni Detection</h2>
          <p className="text-gray-600">Alumni who haven't been active in the last 6 months</p>
        </div>
        <button
          onClick={loadInactiveAlumni}
          disabled={loading}
          className="px-4 py-2 bg-tamu-maroon text-white rounded-lg hover:bg-tamu-maroon-light transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Inactive Alumni</p>
            <p className="text-3xl font-bold text-gray-800">
              {typeof totalInactiveAlumni === 'number' ? totalInactiveAlumni : inactiveAlumni.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Last active more than 6 months ago</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-tamu-maroon" />
        </div>
      ) : error && inactiveAlumni.length === 0 ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadInactiveAlumni}
            className="mt-4 px-4 py-2 bg-tamu-maroon text-white rounded-lg hover:bg-tamu-maroon-light transition-colors"
          >
            Retry
          </button>
        </div>
      ) : inactiveAlumni.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">All Alumni Are Active!</h3>
          <p className="text-gray-600">
            Great news! All alumni have been active within the last 6 months.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inactiveAlumni.map((alumni) => (
                  <motion.tr
                    key={alumni.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-tamu-maroon/10 rounded-full flex items-center justify-center mr-3">
                          <Users className="w-5 h-5 text-tamu-maroon" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{alumni.name}</div>
                          <div className="text-sm text-gray-500">{alumni.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{alumni.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{alumni.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {formatDate(alumni.lastActiveAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex items-center gap-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Inactive ({formatMonthsAgo(alumni.monthsInactive)})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSendEmail(alumni.id)}
                        disabled={sendingEmail === alumni.id}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendingEmail === alumni.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Re-engagement Email
                          </>
                        )}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Email Draft Modal */}
      {showEmailModal && selectedAlumni && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowEmailModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    AI-Generated Email Draft
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowEmailModal(false)
                    setSelectedAlumni(null)
                    setEmailDraft('')
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">To:</p>
                <p className="font-medium text-gray-800">{selectedAlumni.name}</p>
                <p className="text-sm text-gray-600">{selectedAlumni.email}</p>
                <p className="text-sm text-gray-500 mt-1">{selectedAlumni.company}</p>
              </div>

              {generatingDraft ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <p className="ml-3 text-gray-600">Generating personalized email...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                      {emailDraft || 'No email draft available'}
                    </pre>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSendEmail(selectedAlumni.id, selectedAlumni.email, emailDraft)}
                      disabled={sendingEmail === selectedAlumni.id || !emailDraft}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingEmail === selectedAlumni.id ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Email
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowEmailModal(false)
                        setSelectedAlumni(null)
                        setEmailDraft('')
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

