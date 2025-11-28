/**
 * Smart Matching Algorithm
 * Simulates backend recommendation logic
 */

/**
 * Calculate overlap between student skills and mentor skills
 * Returns number of matching skills
 */
export const calculateSkillOverlap = (studentSkills, mentorSkills) => {
  if (!studentSkills || !mentorSkills) return 0
  
  const studentSet = new Set(studentSkills.map(s => s.toLowerCase()))
  const mentorSet = new Set(mentorSkills.map(s => s.toLowerCase()))
  
  let matches = 0
  studentSet.forEach(skill => {
    if (mentorSet.has(skill)) matches++
  })
  
  return matches
}

/**
 * Calculate match percentage (0-100)
 * Based on skill overlap and other factors
 */
export const calculateMatchPercentage = (studentSkills, mentor) => {
  const overlap = calculateSkillOverlap(studentSkills, mentor.skills)
  
  if (overlap === 0) return 0
  
  // Base score from overlap
  const maxPossible = Math.max(studentSkills.length, mentor.skills.length)
  const overlapScore = (overlap / maxPossible) * 100
  
  // Bonus for high overlap
  const bonusPoints = overlap >= 3 ? 10 : overlap >= 2 ? 5 : 0
  
  // Final score (capped at 100)
  return Math.min(100, Math.round(overlapScore + bonusPoints))
}

/**
 * Get recommended mentors sorted by match score
 * This simulates the backend /api/recommend-mentors endpoint
 */
export const getRecommendedMentors = (studentSkills, allMentors) => {
  if (!studentSkills || studentSkills.length === 0) {
    return []
  }
  
  // Calculate match score for each mentor
  const mentorsWithScores = allMentors.map(mentor => {
    const matchScore = calculateMatchPercentage(studentSkills, mentor)
    const skillOverlap = calculateSkillOverlap(studentSkills, mentor.skills)
    const matchingSkills = studentSkills.filter(skill =>
      mentor.skills.some(ms => ms.toLowerCase() === skill.toLowerCase())
    )
    
    return {
      ...mentor,
      matchScore,
      skillOverlap,
      matchingSkills
    }
  })
  
  // Sort by match score (descending), then by skill overlap
  const sorted = mentorsWithScores
    .filter(m => m.matchScore > 0) // Only show mentors with at least 1 match
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore
      }
      return b.skillOverlap - a.skillOverlap
    })
  
  return sorted
}

/**
 * API Integration (for when you connect to real backend)
 * Uncomment and modify when backend is ready
 */
export const fetchRecommendedMentorsFromAPI = async (extractedSkills) => {
  try {
    const response = await fetch('/api/recommend-mentors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ skills: extractedSkills })
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch recommendations')
    }
    
    const data = await response.json()
    return data.mentors // Assuming API returns { mentors: [...] }
  } catch (error) {
    console.error('Error fetching mentor recommendations:', error)
    return []
  }
}

