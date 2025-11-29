import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mic, 
  Calendar, 
  CheckCircle2, 
  Upload, 
  FileText, 
  Presentation,
  Loader2,
  Clock,
  X,
  AlertCircle,
  Users,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'
import SpeakerResourceUpload from './SpeakerResourceUpload'
import AttendanceReport from './AttendanceReport'

export default function SpeakerDashboard() {
  const { currentUser, getMySpeakerLectures, confirmSpeakerAttendance, uploadLectureResource, getLectureAttendanceReport } = useMockData()
  
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmingId, setConfirmingId] = useState(null)
  const [uploadingLectureId, setUploadingLectureId] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  useEffect(() => {
    loadLectures()
  }, [currentUser])

  const loadLectures = () => {
    setLoading(true)
    setTimeout(() => {
      // For demo: Try to find speaker ID from current user or use default alumni IDs
      let speakerId = currentUser.id
      
      // If current user is not an alumni, check if they're in the alumni list
      if (currentUser.role !== 'alumni' && currentUser.role !== 'GuestSpeaker') {
        // For testing: Use first available alumni ID (201)
        speakerId = 201
        console.log('⚠️ Current user is not an alumni. Using default speaker ID:', speakerId)
        console.log('💡 To test: Change currentUser.id to 201-205 in MockDataContext.jsx')
      }
      
      console.log('🔍 Loading lectures for speaker ID:', speakerId)
      const myLectures = getMySpeakerLectures(speakerId)
      setLectures(myLectures)
      setLoading(false)
      console.log('📚 Loaded', myLectures.length, 'lectures for speaker:', speakerId)
      
      if (myLectures.length === 0) {
        console.log('💡 No lectures found. Make sure you have accepted speaker invitations first.')
        console.log('   Go to "Speaker Invitations" tab to accept invitations.')
      }
    }, 500)
  }

  const handleConfirmAttendance = async (lectureId) => {
    setConfirmingId(lectureId)
    try {
      const result = await confirmSpeakerAttendance(lectureId, currentUser.id)
      if (result.success) {
        // Refresh lectures
        loadLectures()
        setToastMessage('Attendance confirmed! You can now upload your slides.')
        setToastType('success')
        setShowToast(true)
      }
    } catch (error) {
      setToastMessage(error.message || 'Failed to confirm attendance')
      setToastType('error')
      setShowToast(true)
    } finally {
      setConfirmingId(null)
    }
  }

  const handleResourceUpload = async (lectureId, fileData) => {
    setUploadingLectureId(lectureId)
    try {
      // Simulate file upload (in real app, this would upload to cloud storage)
      const fileUrl = `https://storage.example.com/lectures/${lectureId}/${fileData.name}`
      
      const result = await uploadLectureResource(lectureId, {
        name: fileData.name,
        url: fileUrl
      })
      
      if (result.success) {
        // Refresh lectures
        loadLectures()
        setToastMessage('Slides uploaded successfully!')
        setToastType('success')
        setShowToast(true)
      }
    } catch (error) {
      setToastMessage(error.message || 'Failed to upload resource')
      setToastType('error')
      setShowToast(true)
    } finally {
      setUploadingLectureId(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 text-tamu-maroon mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Loading your sessions...</p>
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
          <h2 className="text-3xl font-bold text-gray-800">My Speaking Sessions</h2>
        </div>
        <p className="text-gray-600">
          Manage your upcoming lectures and upload presentation materials
        </p>
      </div>

      {/* Lectures List */}
      {lectures.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Mic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No upcoming sessions</p>
          <p className="text-gray-500 text-sm mb-4">
            You haven't been invited to speak at any lectures yet.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 text-left max-w-md mx-auto">
            <p className="text-sm text-blue-800 font-medium mb-2">💡 How to get started:</p>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Go to <strong>"Speaker Invitations"</strong> tab to see pending invitations</li>
              <li>Accept an invitation to add it to your sessions</li>
              <li>Then you can confirm attendance and upload slides</li>
            </ol>
            <p className="text-xs text-blue-600 mt-3">
              <strong>Note:</strong> Make sure you're logged in as an Alumni (ID: 201-205) to see invitations.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {lectures.map((lecture) => (
            <motion.div
              key={lecture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {/* Lecture Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Mic className="w-6 h-6 text-tamu-maroon" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {lecture.title}
                    </h3>
                    {lecture.speakerConfirmed && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmed
                      </span>
                    )}
                    {!lecture.speakerConfirmed && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending Confirmation
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 ml-9">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(lecture.date)}</span>
                    </div>
                    {lecture.professorName && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Professor:</span>
                        <span>{lecture.professorName}</span>
                      </div>
                    )}
                    {lecture.topicTags && lecture.topicTags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">Topics:</span>
                        {lecture.topicTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {lecture.description && (
                      <p className="text-gray-700 mt-2">{lecture.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Resources Section */}
              {lecture.resources && lecture.resources.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-green-900">Slides Uploaded</p>
                  </div>
                  <div className="space-y-2">
                    {lecture.resources.map((resource, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-green-800">
                        {resource.name.endsWith('.pptx') || resource.name.endsWith('.ppt') ? (
                          <Presentation className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                        <span>{resource.name}</span>
                        <span className="text-green-600 text-xs">
                          (Uploaded {new Date(resource.uploadedAt).toLocaleDateString()})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attendance Report (for past events) */}
              {(() => {
                const isPast = new Date(lecture.date) < new Date()
                if (isPast) {
                  const report = getLectureAttendanceReport(lecture.id)
                  return report && <AttendanceReport report={report} />
                }
                return null
              })()}

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                {!lecture.speakerConfirmed ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleConfirmAttendance(lecture.id)}
                    disabled={confirmingId === lecture.id}
                    className="w-full bg-tamu-maroon text-white px-6 py-3 rounded-lg font-medium hover:bg-tamu-maroon-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {confirmingId === lecture.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Confirming...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Confirm Attendance</span>
                      </>
                    )}
                  </motion.button>
                ) : (
                  <div className="space-y-3">
                    {uploadingLectureId === lecture.id ? (
                      <div className="text-center py-4">
                        <Loader2 className="w-8 h-8 text-tamu-maroon mx-auto mb-2 animate-spin" />
                        <p className="text-sm text-gray-600">Uploading...</p>
                      </div>
                    ) : (
                      <SpeakerResourceUpload
                        lectureId={lecture.id}
                        onUploadComplete={(fileData) => handleResourceUpload(lecture.id, fileData)}
                      />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

