import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Lock, 
  Bell, 
  Users,
  Settings as SettingsIcon
} from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import EditProfileTab from './EditProfileTab'
import SecurityTab from './SecurityTab'
import NotificationsTab from './NotificationsTab'
import MentorshipPreferencesTab from './MentorshipPreferencesTab'
import BackButton from '../ui/BackButton'

export default function SettingsPage() {
  const { currentUser } = useMockData()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Edit Profile', icon: User },
    { id: 'security', label: 'Account Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    ...(currentUser?.role === 'mentor' || currentUser?.role === 'alumni' 
      ? [{ id: 'mentorship', label: 'Mentorship Preferences', icon: Users }]
      : [])
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-tamu-maroon" />
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          </div>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-tamu-maroon text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Right Content Area */}
          <main className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              {activeTab === 'profile' && <EditProfileTab />}
              {activeTab === 'security' && <SecurityTab />}
              {activeTab === 'notifications' && <NotificationsTab />}
              {activeTab === 'mentorship' && <MentorshipPreferencesTab />}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}

