import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, CheckCircle2, CalendarPlus, Loader2, RefreshCw } from 'lucide-react'
import { eventAPI } from '../../services/api'
import EventCard from './EventCard'
import { useMockData } from '../../contexts/MockDataContext'

/**
 * StudentEvents Component
 * Real-time polling component that fetches events every 5 seconds
 * Automatically updates when admin/faculty creates new events
 */
export default function StudentEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastFetchTime, setLastFetchTime] = useState(null)
  const { currentUser, toggleEventRSVP } = useMockData()

  // Fetch events from backend API
  const fetchEvents = async () => {
    try {
      console.log('🔄 StudentEvents: Fetching events from API...')
      const response = await eventAPI.getAll()
      
      // Handle different response formats
      let eventsData = []
      if (response.events) {
        eventsData = response.events
      } else if (response.data) {
        eventsData = response.data
      } else if (Array.isArray(response)) {
        eventsData = response
      }

      // Transform backend data to frontend format
      const transformedEvents = eventsData.map(event => {
        // Parse date_time properly
        let eventDate = null
        let eventTime = ''
        
        if (event.date_time) {
          try {
            const dateObj = new Date(event.date_time)
            if (!isNaN(dateObj.getTime())) {
              eventDate = dateObj.toISOString().split('T')[0] // YYYY-MM-DD format
              eventTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }
          } catch (e) {
            console.warn('Failed to parse date_time:', event.date_time, e)
          }
        }
        
        // Fallback to other date fields
        if (!eventDate) {
          if (event.date) {
            try {
              const dateObj = new Date(event.date)
              if (!isNaN(dateObj.getTime())) {
                eventDate = dateObj.toISOString().split('T')[0]
                eventTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              }
            } catch (e) {
              console.warn('Failed to parse date:', event.date, e)
            }
          }
        }
        
        // If still no date, use current date as fallback
        if (!eventDate) {
          eventDate = new Date().toISOString().split('T')[0]
          eventTime = 'TBD'
        }

        return {
          id: event.id,
          title: event.title || event.name || 'Untitled Event',
          description: event.description || '',
          date: eventDate,
          time: eventTime || event.time || 'TBD',
          location: event.location || event.venue || 'TBD',
          type: event.type || event.event_type || 'Event',
          rsvpCount: event.rsvp_count || event.rsvpCount || 0,
          registered: event.registered || event.is_registered || false,
          category: event.category || '',
          tags: event.tags || [],
          related_skills: event.related_skills || []
        }
      })

      setEvents(transformedEvents)
      setLastFetchTime(new Date())
      setError(null)
      console.log(`✅ StudentEvents: Fetched ${transformedEvents.length} events`)
    } catch (err) {
      console.error('❌ StudentEvents: Error fetching events:', err)
      const errorMessage = err.message || 'Failed to fetch events'
      setError(errorMessage)
      
      // If API fails, try to use mock data as fallback
      if (events.length === 0) {
        console.log('⚠️ StudentEvents: Using mock data as fallback')
        const { mockEvents } = await import('../../data/mockData')
        setEvents(mockEvents || [])
      }
      // Don't clear events on error - keep showing last successful fetch
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch on mount
  useEffect(() => {
    fetchEvents()
  }, [])

  // Set up polling interval (every 5 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('⏰ StudentEvents: Polling for new events...')
      fetchEvents()
    }, 5000) // 5000ms = 5 seconds

    // Cleanup interval on unmount
    return () => {
      console.log('🧹 StudentEvents: Cleaning up polling interval')
      clearInterval(intervalId)
    }
  }, []) // Empty dependency array - only set up once

  // Handle RSVP
  const handleRSVP = async (eventId) => {
    try {
      if (!currentUser?.id) {
        throw new Error('User not logged in')
      }

      // Use context method for RSVP (handles both API and mock data)
      const result = await toggleEventRSVP(eventId)
      
      // Update local state to reflect RSVP status
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId
            ? { ...event, registered: !event.registered }
            : event
        )
      )

      return result
    } catch (error) {
      console.error('RSVP error:', error)
      throw error
    }
  }

  // Manual refresh function
  const handleRefresh = () => {
    setLoading(true)
    fetchEvents()
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Events</h2>
          <p className="text-gray-600 mt-1">
            Real-time updates every 5 seconds
            {lastFetchTime && (
              <span className="text-sm text-gray-500 ml-2">
                • Last updated: {lastFetchTime.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-tamu-maroon text-white rounded-lg hover:bg-tamu-maroon-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && events.length === 0 && (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-tamu-maroon mx-auto mb-4" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Events List */}
      {events.length === 0 && !loading ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Calendar className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <p className="text-yellow-800 text-lg font-medium">No events available</p>
          <p className="text-yellow-700 text-sm mt-2">
            Events will appear here when they are created by admins or faculty.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRSVP={handleRSVP}
            />
          ))}
        </div>
      )}

      {/* Polling Indicator */}
      <div className="text-center text-xs text-gray-500 mt-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Auto-refreshing every 5 seconds</span>
        </div>
      </div>
    </div>
  )
}

