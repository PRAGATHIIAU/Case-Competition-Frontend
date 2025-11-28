import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  CheckCircle2, 
  Calendar, 
  TrendingUp,
  BarChart3,
  UserCheck,
  UserX,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'

export default function LectureAttendanceManagement() {
  const { lectures, allStudents, getLectureAttendanceReport } = useMockData()
  
  const [selectedLectureId, setSelectedLectureId] = useState(null)
  const [attendanceReport, setAttendanceReport] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedLectureId) {
      loadAttendanceReport()
    }
  }, [selectedLectureId])

  const loadAttendanceReport = () => {
    setLoading(true)
    setTimeout(() => {
      const report = getLectureAttendanceReport(selectedLectureId)
      setAttendanceReport(report)
      setLoading(false)
    }, 300)
  }

  const getStudentName = (userId) => {
    const student = allStudents.find(s => s.id === userId)
    return student ? student.name : `User ${userId}`
  }

  const getStudentEmail = (userId) => {
    const student = allStudents.find(s => s.id === userId)
    return student ? student.email : `user${userId}@tamu.edu`
  }

  const selectedLecture = lectures.find(l => l.id === selectedLectureId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-tamu-maroon" />
          <h2 className="text-3xl font-bold text-gray-800">Lecture Attendance Management</h2>
        </div>
        <p className="text-gray-600">
          View and manage student attendance for lectures and events
        </p>
      </div>

      {/* Lecture Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <label htmlFor="lectureSelect" className="block text-sm font-medium text-gray-700 mb-2">
          Select Lecture
        </label>
        <select
          id="lectureSelect"
          value={selectedLectureId || ''}
          onChange={(e) => setSelectedLectureId(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent"
        >
          <option value="">-- Select a lecture --</option>
          {lectures.map(lecture => (
            <option key={lecture.id} value={lecture.id}>
              {lecture.title} - {new Date(lecture.date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {/* Attendance Report */}
      {selectedLectureId && (
        <div>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-tamu-maroon mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading attendance data...</p>
            </div>
          ) : attendanceReport ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* RSVP Count */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-600">RSVP Count</span>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-blue-600">{attendanceReport.rsvpCount}</p>
                  <p className="text-xs text-gray-500 mt-2">Students who registered</p>
                </div>

                {/* Actual Attendees */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-600">Actual Attendees</span>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-green-600">{attendanceReport.attendanceCount}</p>
                  <p className="text-xs text-gray-500 mt-2">Students who checked in</p>
                </div>

                {/* Turnout Rate */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-600">Turnout Rate</span>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-purple-600">{attendanceReport.turnoutRate}%</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {attendanceReport.turnoutRate >= 80 ? 'Excellent!' : attendanceReport.turnoutRate >= 60 ? 'Good' : 'Needs improvement'}
                  </p>
                </div>
              </div>

              {/* Detailed Lists */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* RSVP List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      RSVP List ({selectedLecture.rsvpList?.length || 0})
                    </h3>
                  </div>
                  
                  {selectedLecture.rsvpList && selectedLecture.rsvpList.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {selectedLecture.rsvpList.map((userId, idx) => {
                        const hasAttended = selectedLecture.attendanceList?.includes(userId)
                        return (
                          <div
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              hasAttended
                                ? 'bg-green-50 border-green-200'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {hasAttended ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <UserX className="w-5 h-5 text-gray-400" />
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  {getStudentName(userId)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {getStudentEmail(userId)}
                                </p>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${
                              hasAttended
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {hasAttended ? 'Attended' : 'No Show'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>No RSVPs yet</p>
                    </div>
                  )}
                </div>

                {/* Attendance List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-green-600" />
                      Attendance List ({selectedLecture.attendanceList?.length || 0})
                    </h3>
                  </div>
                  
                  {selectedLecture.attendanceList && selectedLecture.attendanceList.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {selectedLecture.attendanceList.map((userId, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {getStudentName(userId)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {getStudentEmail(userId)}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                            Present
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <UserX className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>No check-ins yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Attendance Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedLecture.rsvpList?.length || 0}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Total RSVPs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedLecture.attendanceList?.length || 0}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Attended</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {(selectedLecture.rsvpList?.length || 0) - (selectedLecture.attendanceList?.length || 0)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">No Shows</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {attendanceReport.turnoutRate}%
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Turnout Rate</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No attendance data available for this lecture</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!selectedLectureId && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">Select a lecture to view attendance</p>
          <p className="text-gray-500 text-sm">
            Choose a lecture from the dropdown above to see RSVP and attendance data
          </p>
        </div>
      )}
    </div>
  )
}

