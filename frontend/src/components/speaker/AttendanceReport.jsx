import { motion } from 'framer-motion'
import { Users, CheckCircle2, Calendar, TrendingUp, BarChart3 } from 'lucide-react'

export default function AttendanceReport({ report }) {
  if (!report) return null

  const { lectureTitle, rsvpCount, attendanceCount, turnoutRate, attendeeNames } = report

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mt-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Attendance Report</h3>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* RSVP Count */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">RSVP Count</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{rsvpCount}</p>
          <p className="text-xs text-gray-500 mt-1">Students who registered</p>
        </div>

        {/* Actual Attendees */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Actual Attendees</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{attendanceCount}</p>
          <p className="text-xs text-gray-500 mt-1">Students who checked in</p>
        </div>

        {/* Turnout Rate */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Turnout Rate</span>
          </div>
          <p className="text-3xl font-bold text-purple-600">{turnoutRate}%</p>
          <p className="text-xs text-gray-500 mt-1">
            {turnoutRate >= 80 ? 'Excellent!' : turnoutRate >= 60 ? 'Good' : 'Needs improvement'}
          </p>
        </div>
      </div>

      {/* Attendee List */}
      {attendeeNames.length > 0 ? (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Students Who Attended ({attendeeNames.length})
          </h4>
          <div className="space-y-2">
            {attendeeNames.map((name, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded px-3 py-2"
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <p className="text-sm text-gray-500">No students checked in yet</p>
        </div>
      )}
    </motion.div>
  )
}

