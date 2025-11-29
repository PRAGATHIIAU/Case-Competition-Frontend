import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Clock, CheckCircle2, Users, Loader2, RefreshCw, Calendar } from 'lucide-react'
import CompetitionCenter from './CompetitionCenter'
import { useMockData } from '../../contexts/MockDataContext'

/**
 * StudentCompetitions Component
 * Real-time polling component that fetches competitions every 5 seconds
 * Automatically updates when admin/faculty creates new competitions
 */
export default function StudentCompetitions() {
  const [competitions, setCompetitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastFetchTime, setLastFetchTime] = useState(null)
  const { currentUser } = useMockData()

  // Fetch competitions from backend API
  const fetchCompetitions = async () => {
    try {
      console.log('🔄 StudentCompetitions: Fetching competitions from API...')
      
      // Fetch from backend API using the service
      const { competitionAPI } = await import('../../services/api')
      const response = await competitionAPI.getAll()
      
      // Handle different response formats
      let competitionsData = []
      if (response.competitions) {
        competitionsData = response.competitions
      } else if (response.data) {
        competitionsData = response.data
      } else if (Array.isArray(response)) {
        competitionsData = response
      }
      
      // If no competitions from API, use mock data as fallback
      if (competitionsData.length === 0) {
        console.log('⚠️ StudentCompetitions: No competitions from API, using mock data')
        competitionsData = getMockCompetitions()
      }

      // Transform backend data to frontend format
      const transformedCompetitions = competitionsData.map(comp => ({
        id: comp.id,
        name: comp.title || comp.name,
        description: comp.description || '',
        startDate: comp.start_date || comp.startDate,
        endDate: comp.end_date || comp.endDate,
        deadline: comp.deadline || comp.endDate,
        maxTeamSize: comp.max_team_size || comp.maxTeamSize || 4,
        prize: comp.prize || comp.prizePool || '',
        status: comp.status || 'active',
        registered: comp.registered || comp.is_registered || false,
        teamId: comp.team_id || comp.teamId || null,
        teamName: comp.team_name || comp.teamName || null,
        requiredExpertise: comp.required_expertise || comp.requiredExpertise || []
      }))

      setCompetitions(transformedCompetitions)
      setLastFetchTime(new Date())
      setError(null)
      console.log(`✅ StudentCompetitions: Fetched ${transformedCompetitions.length} competitions`)
    } catch (err) {
      console.error('❌ StudentCompetitions: Error fetching competitions:', err)
      const errorMessage = err.message || 'Failed to fetch competitions'
      setError(errorMessage)
      
      // Always fallback to mock data on error
      console.log('⚠️ StudentCompetitions: Using mock data as fallback due to error')
      setCompetitions(getMockCompetitions())
    } finally {
      setLoading(false)
    }
  }

  // Mock competitions fallback
  const getMockCompetitions = () => {
    return [
      {
        id: 1,
        name: 'Case Competition 2024',
        description: 'Annual case competition for students to showcase their problem-solving skills',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        deadline: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
        maxTeamSize: 4,
        prize: '$5,000',
        status: 'active',
        registered: false,
        teamId: null,
        teamName: null,
        requiredExpertise: ['Data Analysis', 'Business Strategy', 'Presentation']
      }
    ]
  }

  // Initial fetch on mount
  useEffect(() => {
    fetchCompetitions()
  }, [])

  // Set up polling interval (every 5 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('⏰ StudentCompetitions: Polling for new competitions...')
      fetchCompetitions()
    }, 5000) // 5000ms = 5 seconds

    // Cleanup interval on unmount
    return () => {
      console.log('🧹 StudentCompetitions: Cleaning up polling interval')
      clearInterval(intervalId)
    }
  }, []) // Empty dependency array - only set up once

  // Handle competition registration
  const handleRegister = async (competitionId, teamName, teamId) => {
    try {
      if (!currentUser?.id) {
        throw new Error('User not logged in')
      }

      // Use competition API to register
      const { competitionAPI } = await import('../../services/api')
      const competition = competitions.find(c => c.id === competitionId)
      const result = await competitionAPI.register(
        competitionId,
        currentUser.id,
        teamName,
        teamId,
        competition?.name || 'Case Competition 2024'
      )

      // Update local state to reflect registration
      setCompetitions(prevComps =>
        prevComps.map(comp =>
          comp.id === competitionId
            ? { ...comp, registered: true, teamId, teamName }
            : comp
        )
      )

      return result
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  // Manual refresh function
  const handleRefresh = () => {
    setLoading(true)
    fetchCompetitions()
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Competitions</h2>
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
      {loading && competitions.length === 0 && (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-tamu-maroon mx-auto mb-4" />
          <p className="text-gray-600">Loading competitions...</p>
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

      {/* Competitions List */}
      {competitions.length === 0 && !loading ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <p className="text-yellow-800 text-lg font-medium">No competitions available</p>
          <p className="text-yellow-700 text-sm mt-2">
            Competitions will appear here when they are created by admins or faculty.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {competitions.map((competition) => (
            <CompetitionCenter
              key={competition.id}
              competition={competition}
              onRegister={handleRegister}
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

