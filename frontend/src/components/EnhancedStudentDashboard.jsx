import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Calendar, Trophy, Users, User, Upload, FileCheck, Sparkles, CheckCircle2 } from 'lucide-react'
import { useMockData } from '../contexts/MockDataContext'
import Confetti from './common/Confetti'
import Toast from './common/Toast'

export default function EnhancedStudentDashboard() {
  const { 
    events, 
    toggleEventRSVP, 
    mentors, 
    studentSkills, 
    updateStudentSkills, 
    teams,
    submitTeamFile,
    resumeParsed
  } = useMockData()

  const [activeTab, setActiveTab] = useState('home')
  const [isParsing, setIsParsing] = useState(false)
  const [showSkills, setShowSkills] = useState(resumeParsed)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Find current user's team (assume first team for demo)
  const myTeam = teams[0]

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0]
    if (!file) return

    setIsParsing(true)
    
    // Simulate AI Scanning (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Extract skills
    const extractedSkills = ['Python', 'SQL', 'Tableau', 'Machine Learning', 'React', 'Data Visualization']
    updateStudentSkills(extractedSkills)
    setShowSkills(true)
    setIsParsing(false)
    
    setToastMessage('Resume Parsed Successfully! ✨')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleRSVP = async (eventId) => {
    console.log('📋 EnhancedStudentDashboard: handleRSVP called');
    console.log('   ├─ Event ID:', eventId);
    const event = events.find(e => e.id === eventId)
    console.log('   ├─ Event found:', !!event);
    console.log('   └─ Event isRegistered:', event?.isRegistered);
    
    if (!event.isRegistered) {
      try {
        console.log('   └─ Calling toggleEventRSVP...');
        const result = await toggleEventRSVP(eventId)
        console.log('   └─ toggleEventRSVP returned:', result);
        setShowConfetti(true)
        const message = result?.message || `✅ Successfully registered! 🎉 Confirmation email sent to ${result?.email || 'your registered email'}.`
        setToastMessage(message)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 6000)
        // CRITICAL: Return the result so EventCard can use it
        return result;
      } catch (error) {
        console.error('❌ handleRSVP error:', error);
        setToastMessage(error.message || 'Failed to RSVP. Please try again.')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 5000)
        // Re-throw error so EventCard can handle it
        throw error;
      }
    } else {
      // For un-RSVPing, also return the result
      const result = await toggleEventRSVP(eventId)
      return result;
    }
  }

  const handleFileUpload = () => {
    submitTeamFile(myTeam.id, 'TeamSolution.pdf')
    setToastMessage('File submitted successfully!')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'competition', label: 'Competition', icon: Trophy },
    { id: 'mentors', label: 'Mentor Match', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />

      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-tamu-maroon">Student Portal</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        activeTab === item.id
                          ? 'border-tamu-maroon text-tamu-maroon'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center">
              <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-r from-tamu-maroon to-tamu-maroon-light text-white rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                <p className="text-lg opacity-90">Your dashboard for events, competitions, and mentorship</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Competition Center */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-tamu-maroon" />
                    Competition Center
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Team: {myTeam.name}</p>
                      <p className="text-sm text-gray-600">Members: {myTeam.members.join(', ')}</p>
                    </div>
                    {myTeam.fileSubmitted ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium">Solution Submitted!</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">{myTeam.fileName}</p>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleFileUpload}
                        className="w-full bg-tamu-maroon text-white px-4 py-3 rounded-lg font-medium hover:bg-tamu-maroon-light transition-colors flex items-center justify-center gap-2"
                      >
                        <Upload className="w-5 h-5" />
                        Upload Solution
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Events Preview */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-tamu-maroon" />
                    Upcoming Events
                  </h3>
                  <div className="space-y-3">
                    {events.slice(0, 2).map(event => (
                      <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">{event.title}</p>
                        <p className="text-sm text-gray-600">{event.rsvpCount} registered</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">Events</h2>
              <div className="grid gap-4">
                {events.map(event => (
                  <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <p className="text-gray-600">{event.date} at {event.time}</p>
                        <p className="text-sm text-gray-500">{event.location}</p>
                        <p className="text-sm text-tamu-maroon mt-2">{event.rsvpCount} RSVPs</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRSVP(event.id)}
                        className={`px-6 py-2 rounded-lg font-medium ${
                          event.isRegistered
                            ? 'bg-green-100 text-green-700'
                            : 'bg-tamu-maroon text-white'
                        }`}
                      >
                        {event.isRegistered ? 'Registered ✓' : 'RSVP'}
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'mentors' && (
            <motion.div
              key="mentors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">Mentor Match</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {mentors.slice(0, 3).map(mentor => (
                  <div key={mentor.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="px-4 py-2 bg-green-100 rounded-lg border-2 border-green-300">
                        <span className="text-lg font-bold text-green-700">{mentor.matchScore}% Match</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold">{mentor.name}</h3>
                    <p className="text-gray-600">{mentor.role} at {mentor.company}</p>
                    <p className="text-sm text-gray-500 mt-2">{mentor.bio}</p>
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {mentor.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-tamu-maroon/10 text-tamu-maroon text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button className="w-full mt-4 bg-tamu-maroon text-white px-4 py-2 rounded-lg">
                      Request Connection
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">Resume Upload</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-tamu-maroon transition-colors cursor-pointer"
                  onDrop={(e) => { e.preventDefault(); handleResumeUpload(e); }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {isParsing ? (
                    <div className="space-y-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mx-auto w-16 h-16 border-4 border-tamu-maroon border-t-transparent rounded-full"
                      />
                      <p className="text-lg font-medium text-gray-700">AI Scanning...</p>
                      <p className="text-sm text-gray-500">Extracting skills and experience</p>
                    </div>
                  ) : showSkills ? (
                    <div className="space-y-4">
                      <Sparkles className="w-16 h-16 text-green-600 mx-auto" />
                      <p className="text-lg font-medium text-green-700">Resume Parsed Successfully!</p>
                      <div>
                        <p className="text-sm text-gray-600 mb-3">Skills Detected:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {studentSkills.map((skill, idx) => (
                            <motion.span
                              key={skill}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.1 }}
                              className="px-4 py-2 bg-tamu-maroon text-white rounded-lg font-medium"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                      <p className="text-gray-600">Drop your resume here or click to upload</p>
                      <input
                        type="file"
                        onChange={handleResumeUpload}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="resume-upload"
                      />
                      <label
                        htmlFor="resume-upload"
                        className="inline-block bg-tamu-maroon text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-tamu-maroon-light"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

