import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, User, Calendar, Trophy, Users, MapPin, Clock, Mail, Building, GraduationCap, X } from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { globalSearch } = useMockData()
  
  const [results, setResults] = useState({
    users: [],
    events: [],
    competitions: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchQuery) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await globalSearch(searchQuery)
      if (response.success) {
        setResults(response.results)
      } else {
        setError(response.message || 'Search failed')
      }
    } catch (err) {
      setError(err.message || 'An error occurred during search')
    } finally {
      setLoading(false)
    }
  }

  const totalResults = results.users.length + results.events.length + results.competitions.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Search className="w-6 h-6 text-tamu-maroon" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Search Results</h1>
                {query && (
                  <p className="text-sm text-gray-600 mt-1">
                    Results for "<span className="font-semibold">{query}</span>"
                  </p>
                )}
              </div>
            </div>
            <Link
              to="/student"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-tamu-maroon transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Close</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tamu-maroon mx-auto"></div>
            <p className="text-gray-600 mt-4">Searching...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-800 font-medium">Error: {error}</p>
            </div>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <Search className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No matches found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any results for "<span className="font-semibold">{query}</span>"
              </p>
              <p className="text-sm text-gray-500">
                Try searching with different keywords or check your spelling.
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Results Summary */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600">
                Found <span className="font-semibold text-tamu-maroon">{totalResults}</span> result{totalResults !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Users Section */}
            {results.users.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-tamu-maroon" />
                  <h2 className="text-2xl font-bold text-gray-800">Users</h2>
                  <span className="px-3 py-1 bg-tamu-maroon/10 text-tamu-maroon rounded-full text-sm font-medium">
                    {results.users.length}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.users.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-tamu-maroon/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-tamu-maroon" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">{user.name}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{user.email}</span>
                          </p>
                          {user.major && (
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <GraduationCap className="w-3 h-3" />
                              {user.major}
                            </p>
                          )}
                          {user.company && (
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <Building className="w-3 h-3" />
                              {user.company}
                            </p>
                          )}
                          <div className="mt-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {user.role === 'student' ? 'Student' : user.role === 'mentor' ? 'Mentor' : 'Alumni'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Events Section */}
            {results.events.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-tamu-maroon" />
                  <h2 className="text-2xl font-bold text-gray-800">Events</h2>
                  <span className="px-3 py-1 bg-tamu-maroon/10 text-tamu-maroon rounded-full text-sm font-medium">
                    {results.events.length}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.events.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-gray-800 mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                      <div className="space-y-1 text-xs text-gray-500">
                        {event.date && (
                          <p className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        )}
                        {event.location && (
                          <p className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </p>
                        )}
                      </div>
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {event.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Competitions Section */}
            {results.competitions.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="w-6 h-6 text-tamu-maroon" />
                  <h2 className="text-2xl font-bold text-gray-800">Competitions</h2>
                  <span className="px-3 py-1 bg-tamu-maroon/10 text-tamu-maroon rounded-full text-sm font-medium">
                    {results.competitions.length}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.competitions.map((comp) => (
                    <motion.div
                      key={comp.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-gray-800 mb-2">{comp.name}</h3>
                      {comp.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{comp.description}</p>
                      )}
                      {comp.deadline && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                          <Clock className="w-3 h-3" />
                          Deadline: {new Date(comp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      )}
                      {comp.requiredExpertise && comp.requiredExpertise.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {comp.requiredExpertise.slice(0, 3).map((exp, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

