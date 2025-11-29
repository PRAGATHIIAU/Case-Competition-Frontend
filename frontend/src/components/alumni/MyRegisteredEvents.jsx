import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ExternalLink,
  Loader2,
  CheckCircle2,
  X
} from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'

export default function MyRegisteredEvents() {
  const { currentUser, events, toggleEventRSVP } = useMockData()
  
  const [registeredEvents, setRegisteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [rsvpLoading, setRsvpLoading] = useState({})

  useEffect(() => {
    loadRegisteredEvents()
  }, [currentUser, events])

  const loadRegisteredEvents = () => {
    setLoading(true)
    
    try {
      // Filter events where user has registered (registered: true or isRegistered: true)
      const myEvents = events.filter(event => 
        event.registered === true || event.isRegistered === true
      )
      
      // Sort by date (upcoming first)
      myEvents.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateA - dateB
      })
      
      setRegisteredEvents(myEvents)
      console.log('✅ Loaded', myEvents.length, 'registered events')
    } catch (error) {
      console.error('❌ Error loading registered events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRSVP = async (eventId) => {
    setRsvpLoading(prev => ({ ...prev, [eventId]: true }))
    
    try {
      // Toggle RSVP to cancel
      await toggleEventRSVP(eventId)
      
      // Refresh registered events
      loadRegisteredEvents()
    } catch (err) {
      console.error('❌ Error canceling RSVP:', err)
    } finally {
      setRsvpLoading(prev => ({ ...prev, [eventId]: false }))
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isEventPast = (dateString) => {
    if (!dateString) return false
    return new Date(dateString) < new Date()
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-tamu-maroon animate-spin" />
          <span className="ml-2 text-gray-600">Loading your events...</span>
        </div>
      </div>
    )
  }

  if (registeredEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">My Events</h3>
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No registered events</p>
          <p className="text-gray-500 text-sm">
            You haven't registered for any events yet. Check out "Recommended Events" to find events that match your interests.
          </p>
        </div>
      </div>
    )
  }

  // Separate upcoming and past events
  const upcomingEvents = registeredEvents.filter(event => !isEventPast(event.date))
  const pastEvents = registeredEvents.filter(event => isEventPast(event.date))

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">My Events</h3>
          <button
            onClick={loadRegisteredEvents}
            className="text-sm text-tamu-maroon hover:underline"
          >
            Refresh
          </button>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Upcoming Events</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Event Title */}
                  <h4 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                    {event.title}
                  </h4>

                  {/* Event Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Event Type */}
                  {event.type && (
                    <div className="mb-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {event.type}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCancelRSVP(event.id)}
                      disabled={rsvpLoading[event.id]}
                      className="flex-1 px-3 py-2 bg-red-100 text-red-800 border border-red-300 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 hover:bg-red-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {rsvpLoading[event.id] ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          <span>Cancel RSVP</span>
                        </>
                      )}
                    </motion.button>
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={event.rsvp_link || '#'}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Details</span>
                    </motion.a>
                  </div>

                  {/* Registered Badge */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-medium">Registered</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-3">Past Events</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow opacity-75"
                >
                  {/* Event Title */}
                  <h4 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                    {event.title}
                  </h4>

                  {/* Event Details */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Past Event Badge */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Event completed</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

