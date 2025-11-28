import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Calendar, Trophy, Users, User, Bell, Upload, CheckCircle2, MessageSquare, Settings, Search } from 'lucide-react'
import BackButton from './ui/BackButton'
import EventCard from './student/EventCard'
import CompetitionCenter from './student/CompetitionCenter'
import MentorRecommendations from './student/MentorRecommendations'
import NotificationsPanel from './student/NotificationsPanel'
import ProfileSection from './student/ProfileSection'
import StudentRequestsPanel from './student/StudentRequestsPanel'
import SubmissionUpload from './student/SubmissionUpload'
import NotificationBell from './common/NotificationBell'
import ChatBox from './messaging/ChatBox'
import SearchInput from './common/SearchInput'
import { mockEvents, mockCompetition, mockMentors, mockNotifications } from '../data/mockData'

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('home')
  const [events, setEvents] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [studentSkills, setStudentSkills] = useState(['Python', 'SQL', 'Data Analytics', 'Machine Learning'])
  const [competition, setCompetition] = useState(mockCompetition)

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setEvents(mockEvents)
      setNotifications(mockNotifications)
      setLoading(false)
    }, 500)
  }, [])

  const handleRSVP = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, registered: !event.registered }
        : event
    ))
  }

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const handleSkillsUpdated = (newSkills) => {
    setStudentSkills(newSkills)
    // Add notification for new mentor matches
    const newNotification = {
      id: Date.now(),
      type: 'match',
      message: `Resume parsed! Your skills have been updated. Check Mentor Match for new recommendations.`,
      timestamp: new Date().toISOString(),
      read: false
    }
    setNotifications([newNotification, ...notifications])
  }

  const handleCompetitionRegister = (teamId) => {
    setCompetition({
      ...competition,
      teamId,
      teamName: 'My Team'
    })
    // Add notification
    const newNotification = {
      id: Date.now(),
      type: 'event',
      message: `Successfully registered for ${competition.name}! Team ID: ${teamId}`,
      timestamp: new Date().toISOString(),
      read: false
    }
    setNotifications([newNotification, ...notifications])
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'competitions', label: 'Competitions', icon: Trophy },
    { id: 'mentors', label: 'Mentor Match', icon: Users },
    { id: 'requests', label: 'My Requests', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-2 sm:px-3 lg:px-4">
          <div className="flex justify-between items-center h-12 sm:h-14 gap-1.5 sm:gap-2">
            {/* Left Side: Logo + Navigation */}
            <div className="flex items-center flex-shrink-0 min-w-0 flex-1 overflow-hidden">
              <div className="flex-shrink-0 flex items-center mr-1.5 sm:mr-2">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-tamu-maroon whitespace-nowrap">CMIS Platform</h1>
              </div>
              <div className="hidden md:flex items-center space-x-0 overflow-x-auto scrollbar-hide flex-1 min-w-0">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex-shrink-0 inline-flex items-center justify-center px-1.5 sm:px-2 py-1 border-b-2 text-xs font-medium whitespace-nowrap ${
                        activeTab === item.id
                          ? 'border-tamu-maroon text-tamu-maroon'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      title={item.label}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="hidden xl:inline ml-1">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* Right Side: Search + Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              {/* Search Input - Only on 2xl screens */}
              <div className="hidden 2xl:block">
                <SearchInput className="flex" />
              </div>
              
              {/* Search Icon */}
              <Link
                to="/search"
                className="2xl:hidden p-1 sm:p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 flex-shrink-0"
                aria-label="Search"
                title="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              
              {/* Notification Bell */}
              <div className="flex-shrink-0">
                <NotificationBell />
              </div>
              
              {/* Settings - Icon only */}
              <Link 
                to="/settings" 
                className="p-1 sm:p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 flex-shrink-0"
                aria-label="Settings"
                title="Settings"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              
              {/* Logout - Compact */}
              <Link 
                to="/" 
                className="p-1 sm:p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 flex-shrink-0 text-xs sm:text-sm font-medium whitespace-nowrap"
                aria-label="Logout"
                title="Logout"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Out</span>
              </Link>
            </div>
          </div>
          
          {/* Mobile Navigation - Horizontal Scroll */}
          <div className="md:hidden border-t border-gray-200 py-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center space-x-1 min-w-max px-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex-shrink-0 inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                      activeTab === item.id
                        ? 'bg-tamu-maroon text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tamu-maroon mx-auto"></div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Back Button - Only show on non-home tabs */}
                    {activeTab !== 'home' && (
                      <div className="mb-6">
                        <BackButton />
                      </div>
                    )}

                    {activeTab === 'home' && (
              <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-tamu-maroon to-tamu-maroon-light text-white rounded-lg p-8 shadow-lg">
                  <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                  <p className="text-lg opacity-90">
                    Stay engaged with upcoming events, competitions, and mentor opportunities.
                  </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left Column - Main Content */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Upcoming Events */}
                    <section>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                        Upcoming Events
                      </h3>
                      <div className="space-y-4">
                        {events.map((event) => (
                          <EventCard
                            key={event.id}
                            event={event}
                            onRSVP={handleRSVP}
                          />
                        ))}
                      </div>
                    </section>

                    {/* Competition Center */}
                    <section>
                      <CompetitionCenter 
                        competition={competition} 
                        onRegister={handleCompetitionRegister}
                      />
                    </section>

                    {/* Mentor Recommendations */}
                    <section>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                        Mentor Recommendations
                      </h3>
                      <MentorRecommendations 
                        mentors={mockMentors} 
                        studentSkills={studentSkills}
                      />
                    </section>
                  </div>

                  {/* Right Column - Notifications */}
                  <div className="lg:col-span-1">
                    <NotificationsPanel
                      notifications={notifications}
                      onMarkRead={markNotificationRead}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">All Events</h2>
                <div className="space-y-4">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'competitions' && (
              <div className="space-y-6">
                <CompetitionCenter 
                  competition={competition} 
                  onRegister={handleCompetitionRegister}
                />
                
                {/* Project Submission Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Submission</h2>
                  <p className="text-gray-600 mb-6">Upload your project materials (Code and Presentations)</p>
                  <SubmissionUpload 
                    onSubmissionComplete={(files) => {
                      console.log('Project files submitted:', files)
                      // Add notification
                      const newNotification = {
                        id: Date.now(),
                        type: 'submission',
                        message: `Project submitted successfully with ${files.length} file${files.length !== 1 ? 's' : ''}`,
                        timestamp: new Date().toISOString(),
                        read: false
                      }
                      setNotifications([newNotification, ...notifications])
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'mentors' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Mentor Match</h2>
                <MentorRecommendations 
                  mentors={mockMentors} 
                  studentSkills={studentSkills}
                />
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Connection Requests</h2>
                <StudentRequestsPanel />
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <ProfileSection 
                  onSkillsUpdated={handleSkillsUpdated} 
                  allMentors={mockMentors}
                />
              </div>
            )}
                  </motion.div>
                )}
      </div>
      
      {/* ChatBox - Floating at bottom right (always visible, outside loading state) */}
      <ChatBox />
    </div>
  )
}

