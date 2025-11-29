import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, AlertCircle, Users, Calendar } from 'lucide-react'

export default function NotificationsPanel({ notifications, onMarkRead }) {
  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type) => {
    switch (type) {
      case 'reminder':
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      case 'match':
        return <Users className="w-5 h-5 text-green-600" />
      case 'event':
        return <Calendar className="w-5 h-5 text-blue-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-tamu-maroon" />
          <h3 className="text-xl font-semibold text-gray-800">Notifications</h3>
        </div>
        {unreadCount > 0 && (
          <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-4 rounded-lg border ${
                notification.read
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {getIcon(notification.type)}
                <div className="flex-1">
                  <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => onMarkRead(notification.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

