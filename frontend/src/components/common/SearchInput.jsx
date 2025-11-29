import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SearchInput({ className = '' }) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex items-center ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-40 xl:w-52 px-2.5 py-1.5 pl-8 pr-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tamu-maroon focus:border-transparent text-xs xl:text-sm"
        />
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
      </div>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={!searchQuery.trim()}
        className={`ml-1 px-2.5 py-1.5 bg-tamu-maroon text-white rounded-lg font-medium transition-all text-xs xl:text-sm whitespace-nowrap ${
          !searchQuery.trim()
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-tamu-maroon-light'
        }`}
      >
        Search
      </motion.button>
    </form>
  )
}

