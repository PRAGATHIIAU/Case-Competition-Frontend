import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ExternalLink,
  Loader2,
  Target,
  Flame
} from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'

export default function RecommendedEventsWidget() {
  const { currentUser, getRecommendedEventsForAlumni, toggleEventRSVP } = useMockData()
  
  // Debug: Log current user on mount
  useEffect(() => {
    console.log('🔍 RecommendedEventsWidget mounted')
    console.log('  ├─ Current User ID:', currentUser?.id)
    console.log('  ├─ Current User Name:', currentUser?.name)
    console.log('  └─ Current User Role:', currentUser?.role)
  }, [currentUser])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rsvpLoading, setRsvpLoading] = useState({})

  useEffect(() => {
    // Only load if we have a valid user ID
    if (currentUser?.id) {
      loadRecommendedEvents()
    } else {
      setError('User not logged in')
      setLoading(false)
    }
  }, [currentUser?.id])

  const loadRecommendedEvents = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('📅 Loading recommended events for:', currentUser.id)
      console.log('  ├─ Current user:', currentUser)
      console.log('  └─ User role:', currentUser.role)
      
      const result = await getRecommendedEventsForAlumni(currentUser.id)
      
      console.log('📅 API Response:', result)
      
      if (result.success) {
        setEvents(result.events || [])
        console.log('✅ Recommended events loaded:', result.events?.length || 0)
        
        if (result.warning) {
          console.warn('⚠️ Warning:', result.warning)
        }
      } else {
        const errorMsg = result.message || result.error || 'Failed to load events'
        console.error('❌ API returned error:', errorMsg)
        setError(errorMsg)
      }
    } catch (err) {
      console.error('❌ Error loading recommended events:', err)
      console.error('  ├─ Error type:', err.constructor.name)
      console.error('  ├─ Error message:', err.message)
      console.error('  └─ Error stack:', err.stack)
      setError(err.message || 'Failed to load recommended events')
    } finally {
      setLoading(false)
    }
  }

  const handleRSVP = async (eventId) => {
    setRsvpLoading(prev => ({ ...prev, [eventId]: true }))
    
    try {
      // Use the existing toggleEventRSVP function
      await toggleEventRSVP(eventId)
      
      // Update local state
      setEvents(prev => prev.map(event =>
        event.id === eventId
          ? { ...event, registered: !event.registered }
          : event
      ))
    } catch (err) {
      console.error('❌ Error toggling RSVP:', err)
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

  const getMatchBadge = (event) => {
    if (event.isDirectMatch) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-300">
          <Target className="w-3 h-3" />
          Matches your Industry
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium border border-orange-300">
          <Flame className="w-3 h-3" />
          Popular Event
        </span>
      )
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-tamu-maroon animate-spin" />
          <span className="ml-2 text-gray-600">Loading recommended events...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-4">
          <p className="text-red-600 text-sm mb-2">{error}</p>
          {currentUser?.id && currentUser.id < 200 && (
            <p className="text-xs text-gray-500 mb-3">
              💡 Tip: Current user ID ({currentUser.id}) is not an alumni ID. 
              Alumni IDs are 201-205. Showing general events.
            </p>
          )}
          <button
            onClick={loadRecommendedEvents}
            className="mt-2 text-sm text-tamu-maroon hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended Events</h3>
        <p className="text-gray-600 text-sm">No upcoming events found.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recommended Events</h3>
        <button
          onClick={loadRecommendedEvents}
          className="text-sm text-tamu-maroon hover:underline"
        >
          Refresh
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* Match Badge */}
            <div className="mb-3">
              {getMatchBadge(event)}
            </div>

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
                onClick={() => handleRSVP(event.id)}
                disabled={rsvpLoading[event.id]}
                className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  event.registered
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-tamu-maroon text-white hover:bg-tamu-maroon-light'
                } ${rsvpLoading[event.id] ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {rsvpLoading[event.id] ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : event.registered ? (
                  <>
                    <span>✓ RSVP'd</span>
                  </>
                ) : (
                  <>
                    <span>RSVP</span>
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
          </motion.div>
        ))}
      </div>
    </div>
  )
}

