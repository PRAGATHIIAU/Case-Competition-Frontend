import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, Calendar, Users, Trophy, MessageSquare } from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import { useNavigate } from 'react-router-dom'

export default function NotificationBell() {
  const navigate = useNavigate()
  const {
    getMyNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useMockData()

  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef(null)

  // Update notifications and count
  useEffect(() => {
    const myNotifications = getMyNotifications()
    setNotifications(myNotifications)
    setUnreadCount(getUnreadCount())
  }, [getMyNotifications, getUnreadCount])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleNotificationClick = (notification) => {
    // Mark as read
    markNotificationAsRead(notification.id)
    
    // Navigate to link
    if (notification.link) {
      navigate(notification.link)
    }
    
    // Close dropdown
    setIsOpen(false)
  }

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation()
    markAllNotificationsAsRead()
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-5 h-5 text-blue-600" />
      case 'match':
        return <Users className="w-5 h-5 text-green-600" />
      case 'competition':
        return <Trophy className="w-5 h-5 text-yellow-600" />
      case 'reminder':
        return <Bell className="w-5 h-5 text-orange-600" />
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1 sm:p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-tamu-maroon to-tamu-maroon-light text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Notifications</h3>
                <p className="text-sm text-gray-100">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No notifications yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    We'll notify you about important updates
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification, index) => (
                    <motion.button
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${
                            !notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimestamp(notification.createdAt)}
                          </p>
                        </div>

                        {/* Unread Indicator */}
                        {!notification.isRead && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="bg-gray-50 p-3 text-center border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    navigate('/notifications')
                  }}
                  className="text-sm text-tamu-maroon hover:text-tamu-maroon-light font-semibold"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

