import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  BookOpen, 
  Calendar, 
  FileText, 
  Plus, 
  Save,
  Clock,
  Mail,
  GraduationCap,
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import Toast from '../common/Toast'

export default function MyMentees() {
  const { 
    currentUser, 
    getMentorDashboardData, 
    saveMenteeNote,
    mentors
  } = useMockData()

  // Demo Mode: Allow selecting which mentor to view as
  const [selectedMentorId, setSelectedMentorId] = useState(1) // Default: Sarah Johnson (ID 1)
  const [mentees, setMentees] = useState([])
  const [selectedMentee, setSelectedMentee] = useState(null)
  const [activeTab, setActiveTab] = useState('history') // 'history' or 'notes'
  const [loading, setLoading] = useState(true)
  const [savingNote, setSavingNote] = useState(false)
  
  // Note form state
  const [newNote, setNewNote] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  // Fetch mentor dashboard data
  useEffect(() => {
    loadMentees()
  }, [selectedMentorId])

  const loadMentees = async () => {
    setLoading(true)
    try {
      const result = await getMentorDashboardData(selectedMentorId)
      if (result.success) {
        setMentees(result.mentees)
        // Auto-select first mentee if available
        if (result.mentees.length > 0 && !selectedMentee) {
          setSelectedMentee(result.mentees[0])
        }
      }
    } catch (error) {
      console.error('Failed to load mentees:', error)
      setToastMessage('Failed to load mentees')
      setToastType('error')
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectMentee = (mentee) => {
    setSelectedMentee(mentee)
    setActiveTab('history') // Reset to history tab
    setNewNote('') // Clear note form
  }

  const handleSaveNote = async () => {
    if (!newNote.trim() || !selectedMentee) return

    setSavingNote(true)
    try {
      const result = await saveMenteeNote(
        selectedMentorId,
        selectedMentee.studentId,
        newNote
      )

      if (result.success) {
        // Add new note to local state immediately
        const updatedMentee = {
          ...selectedMentee,
          notes: [result.note, ...selectedMentee.notes],
          totalNotes: selectedMentee.totalNotes + 1
        }
        setSelectedMentee(updatedMentee)
        
        // Update mentees list
        setMentees(prev => prev.map(m => 
          m.studentId === selectedMentee.studentId ? updatedMentee : m
        ))

        setNewNote('')
        setToastMessage('Note saved successfully!')
        setToastType('success')
        setShowToast(true)
      }
    } catch (error) {
      setToastMessage(error.message || 'Failed to save note')
      setToastType('error')
      setShowToast(true)
    } finally {
      setSavingNote(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateShort = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const selectedMentor = mentors.find(m => m.id === selectedMentorId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Mentees</h1>
            <p className="text-gray-600 mt-1">Track your students' progress and manage mentorship sessions</p>
          </div>
          
          {/* Mentor Selector (Demo Mode) */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">View as:</label>
            <select
              value={selectedMentorId}
              onChange={(e) => {
                setSelectedMentorId(Number(e.target.value))
                setSelectedMentee(null)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
            >
              {mentors.map(mentor => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Mentees</p>
                <p className="text-2xl font-bold text-gray-800">{mentees.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-800">
                  {mentees.reduce((sum, m) => sum + m.totalSessions, 0)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Notes</p>
                <p className="text-2xl font-bold text-gray-800">
                  {mentees.reduce((sum, m) => sum + m.totalNotes, 0)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-tamu-maroon" />
        </div>
      ) : mentees.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Active Mentees</h3>
          <p className="text-gray-600">
            You don't have any accepted mentorship requests yet. Check your connection requests to accept students.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Mentee List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Mentees</h2>
              <div className="space-y-3">
                {mentees.map((mentee) => (
                  <motion.button
                    key={mentee.studentId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectMentee(mentee)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedMentee?.studentId === mentee.studentId
                        ? 'border-tamu-maroon bg-tamu-maroon/5'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-tamu-maroon/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-tamu-maroon" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">{mentee.studentName}</h3>
                        <p className="text-sm text-gray-600 truncate">{mentee.studentMajor}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {mentee.totalSessions} sessions
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {mentee.totalNotes} notes
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Mentee Details */}
          {selectedMentee && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                {/* Mentee Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-tamu-maroon/10 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-tamu-maroon" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-800">{selectedMentee.studentName}</h2>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />
                          {selectedMentee.studentMajor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {selectedMentee.studentEmail}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Connected since {formatDateShort(selectedMentee.connectionDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex gap-2 p-4">
                    <button
                      onClick={() => setActiveTab('history')}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'history'
                          ? 'bg-tamu-maroon text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Calendar className="w-4 h-4 inline mr-2" />
                      History ({selectedMentee.totalSessions})
                    </button>
                    <button
                      onClick={() => setActiveTab('notes')}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'notes'
                          ? 'bg-tamu-maroon text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <FileText className="w-4 h-4 inline mr-2" />
                      Notes ({selectedMentee.totalNotes})
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'history' ? (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Session History</h3>
                      {selectedMentee.sessions.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No sessions scheduled yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {selectedMentee.sessions.map((session) => (
                            <motion.div
                              key={session.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="font-semibold text-gray-800">
                                      {formatDate(session.date)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{session.topic}</p>
                                  {session.meetingLink && (
                                    <a
                                      href={session.meetingLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                                    >
                                      <Calendar className="w-3 h-3" />
                                      Meeting Link
                                    </a>
                                  )}
                                </div>
                                {session.calendarLink && (
                                  <a
                                    href={session.calendarLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                    Add to Calendar
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Private Notes</h3>
                      
                      {/* New Note Form */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MessageSquare className="w-4 h-4 inline mr-2" />
                          Add New Note
                        </label>
                        <textarea
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Write your notes about this mentee's progress, goals, or any observations..."
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent resize-none"
                        />
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-gray-500">
                            {newNote.length} characters • Private notes are only visible to you
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSaveNote}
                            disabled={!newNote.trim() || savingNote}
                            className="px-6 py-2 bg-tamu-maroon text-white rounded-lg font-medium hover:bg-tamu-maroon-light transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {savingNote ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Save Note
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>

                      {/* Notes List */}
                      {selectedMentee.notes.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No notes yet. Add your first note above!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {selectedMentee.notes.map((note) => (
                            <motion.div
                              key={note.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-500">
                                    {formatDateShort(note.createdAt)}
                                  </span>
                                  {note.isPrivate && (
                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                                      Private
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

