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
  CheckCircle2
} from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'

export default function InactiveAlumniList() {
  const { getInactiveAlumni, sendReEngagementEmail } = useMockData()
  const [inactiveAlumni, setInactiveAlumni] = useState([])
  const [loading, setLoading] = useState(true)
  const [sendingEmail, setSendingEmail] = useState(null) // Track which alumni email is being sent
  const [error, setError] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  useEffect(() => {
    loadInactiveAlumni()
  }, [])

  const loadInactiveAlumni = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getInactiveAlumni()
      if (result.success) {
        setInactiveAlumni(result.inactiveAlumni)
      } else {
        setError(result.message || 'Failed to load inactive alumni')
        setToastMessage(result.message || 'Failed to load inactive alumni')
        setToastType('error')
        setShowToast(true)
      }
    } catch (err) {
      setError(err.message || 'Failed to load inactive alumni')
      setToastMessage(err.message || 'Failed to load inactive alumni')
      setToastType('error')
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = async (alumniId) => {
    setSendingEmail(alumniId)
    try {
      const result = await sendReEngagementEmail(alumniId)
      if (result.success) {
        setToastMessage('Re-engagement email sent successfully!')
        setToastType('success')
        setShowToast(true)
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to send email')
      setToastType('error')
      setShowToast(true)
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
            <p className="text-3xl font-bold text-gray-800">{inactiveAlumni.length}</p>
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
    </div>
  )
}

