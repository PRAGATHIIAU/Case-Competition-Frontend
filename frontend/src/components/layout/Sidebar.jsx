import { Link, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  BookOpen, 
  UserCheck, 
  Trophy, 
  Mail, 
  Settings, 
  LogOut,
  ClipboardList,
  MessageSquare,
  Award
} from 'lucide-react'

const Sidebar = ({ userRole = 'faculty', view = 'Full Faculty Access' }) => {
  const location = useLocation()

  const facultyMenuItems = [
    { path: '/faculty/dashboard', label: 'Overview', icon: BarChart3 },
    { path: '/faculty/analytics', label: 'Analytics', icon: TrendingUp },
    { path: '/faculty/inactive-alumni', label: 'Inactive Alumni', icon: Users },
    { path: '/faculty/create-event', label: 'Create Event', icon: Calendar },
    { path: '/faculty/create-lecture', label: 'Create Lecture', icon: BookOpen },
    { path: '/faculty/attendance', label: 'Attendance Management', icon: UserCheck },
    { path: '/faculty/create-competition', label: 'Create Competition', icon: Trophy },
    { path: '/faculty/judge-invitations', label: 'Judge Invitations', icon: Mail },
    { path: '/faculty/settings', label: 'Settings', icon: Settings },
  ]

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Overview', icon: BarChart3 },
    { path: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
    { path: '/admin/competition-scores', label: 'Competition Scores', icon: Trophy },
    { path: '/admin/judge-feedback', label: 'Judge Feedback', icon: MessageSquare },
    { path: '/admin/judge-comments', label: 'Judge Comments', icon: ClipboardList },
    { path: '/admin/leaderboard', label: 'Leaderboard', icon: Award },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const menuItems = userRole === 'admin' ? adminMenuItems : facultyMenuItems
  const hubTitle = userRole === 'admin' ? 'Admin Hub' : 'Faculty & Admin Hub'

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    window.location.href = '/login'
  }

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-tamu-maroon mb-1">{hubTitle}</h1>
        <p className="text-sm text-gray-400">CMIS Engagement Platform</p>
        {view && <p className="text-xs text-gray-500 mt-1">{view}</p>}
      </div>

      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-tamu-maroon"
          />
          <button className="bg-tamu-maroon hover:bg-tamu-maroon-light px-4 py-2 rounded text-sm">
            Search
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-tamu-maroon text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white w-full transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar


