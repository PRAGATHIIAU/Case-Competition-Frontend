import { Link } from 'react-router-dom'
import { GraduationCap, Building2, BarChart3, Users, Gavel } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-tamu-maroon mb-4">
            CMIS Engagement Platform
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Connecting Students, Faculty, Alumni, and Industry Partners
          </p>
          <p className="text-gray-500">Texas A&M University - Mays Business School</p>
        </motion.div>

        {/* Main Portals */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {/* Student Portal */}
          <Link to="/student">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full"
            >
              <GraduationCap className="w-16 h-16 text-tamu-maroon mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-center mb-2 text-tamu-maroon">Student Portal</h2>
              <p className="text-gray-600 text-center">
                Events, Case Competitions & Career Profile
              </p>
            </motion.div>
          </Link>

          {/* Industry Partner Portal */}
          <Link to="/industry">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full"
            >
              <Building2 className="w-16 h-16 text-tamu-maroon mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-center mb-2 text-tamu-maroon">Industry Partner Portal</h2>
              <p className="text-gray-600 text-center">
                Judge competitions, Manage mentorships, and Speaker schedules
              </p>
            </motion.div>
          </Link>

          {/* Faculty & Admin Hub */}
          <Link to="/faculty">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer h-full"
            >
              <BarChart3 className="w-16 h-16 text-tamu-maroon mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-center mb-2 text-tamu-maroon">Faculty & Admin Hub</h2>
              <p className="text-gray-600 text-center">
                Platform analytics, Student tracking, and Event management
              </p>
            </motion.div>
          </Link>
        </div>

        {/* Additional Dashboards (Testing) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6"
        >
          {/* Judge Dashboard */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
            <p className="text-sm text-purple-800 font-semibold mb-3 text-center">
              ⚖️ Judge Portal: View Submitted Projects
            </p>
            <Link to="/judge">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <Gavel className="w-12 h-12 text-purple-600" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Judge Dashboard</h3>
                    <p className="text-gray-600 text-sm">
                      Review submitted projects, download files, and score team submissions
                    </p>
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
                    Projects
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Mentor Dashboard */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
            <p className="text-sm text-blue-800 font-semibold mb-3 text-center">
              🧪 Testing Mode: View as Mentor
            </p>
            <Link to="/mentor">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <Users className="w-12 h-12 text-blue-600" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Mentor Dashboard</h3>
                    <p className="text-gray-600 text-sm">
                      View and manage student connection requests, accept/decline mentorship opportunities
                    </p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                    Demo Mode
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

