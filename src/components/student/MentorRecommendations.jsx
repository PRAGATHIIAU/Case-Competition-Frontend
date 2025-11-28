import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { calculateMatchScore } from '../../utils/businessLogic'
import { useEffect, useState } from 'react'
import MentorCardActions from './MentorCardActions'

export default function MentorRecommendations({ mentors, studentSkills = [] }) {
  const [mentorsWithScores, setMentorsWithScores] = useState(mentors)

  useEffect(() => {
    // Recalculate match scores when student skills change
    if (studentSkills.length > 0) {
      const updatedMentors = mentors.map(mentor => ({
        ...mentor,
        matchScore: calculateMatchScore(studentSkills, mentor.skills)
      }))
      // Sort by match score (highest first)
      updatedMentors.sort((a, b) => b.matchScore - a.matchScore)
      setMentorsWithScores(updatedMentors)
    } else {
      setMentorsWithScores(mentors)
    }
  }, [studentSkills, mentors])

  // Helper function to calculate shared skills
  const getSharedSkills = (mentor) => {
    if (!studentSkills || studentSkills.length === 0 || !mentor.skills) return []
    
    const studentSkillsLower = studentSkills.map(s => s.toLowerCase())
    return mentor.skills.filter(skill => 
      studentSkillsLower.includes(skill.toLowerCase())
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {mentorsWithScores.map((mentor, index) => (
        <motion.div
          key={mentor.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          {/* Match Badge - Prominently Displayed */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-300">
                <TrendingUp className="w-5 h-5 text-green-700" />
                <span className="text-lg font-bold text-green-700">
                  {mentor.matchScore}% Match
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {studentSkills.length > 0 
                  ? `Based on ${studentSkills.slice(0, 2).join(' & ')} skills`
                  : `Based on ${mentor.skills[0]} skills`
                }
              </span>
            </div>
          </div>

          {/* Mentor Info */}
          <div className="mb-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-1">{mentor.name}</h4>
            <p className="text-gray-600 font-medium">{mentor.title}</p>
            <p className="text-sm text-gray-500">{mentor.expertise}</p>
            <p className="text-sm text-gray-600 mt-2">{mentor.company}</p>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {mentor.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs font-medium bg-tamu-maroon/10 text-tamu-maroon rounded"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Bio */}
          <p className="text-sm text-gray-600 mb-4">{mentor.bio}</p>

          {/* Matching Skills Display */}
          {getSharedSkills(mentor).length > 0 && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs font-semibold text-green-800 mb-1">
                🎯 {getSharedSkills(mentor).length} Skills Match:
              </p>
              <div className="flex flex-wrap gap-1">
                {getSharedSkills(mentor).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <MentorCardActions 
            mentor={mentor}
            sharedSkills={getSharedSkills(mentor)}
            onRequestSent={() => {
              console.log(`Connection request sent to ${mentor.name}`)
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

