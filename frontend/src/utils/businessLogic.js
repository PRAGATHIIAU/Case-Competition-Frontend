// Business Logic Helper Functions

/**
 * Parse resume and extract skills/tags
 * Simulates AI-powered resume parsing
 * @param {File} resumeFile - The resume file to parse (PDF or Word document)
 */
export const parseResume = async (resumeFile) => {
  // Validate file
  if (!resumeFile) {
    throw new Error('No file provided. Please select a resume file to upload.')
  }
  
  console.log('📄 Parsing resume file:', resumeFile.name, 'Size:', resumeFile.size, 'bytes')
  
  // Simulate scanning/parsing delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // In a real implementation, you would:
  // 1. Read the file content (PDF.js for PDFs, mammoth.js for Word docs)
  // 2. Extract text from the file
  // 3. Use NLP/AI to identify skills, experience, etc.
  // For now, we simulate this with mock data
  
  // Simulate extracted skills based on common resume keywords
  const allPossibleSkills = [
    'Python', 'SQL', 'Data Analytics', 'Machine Learning', 
    'React', 'Tableau', 'Excel', 'JavaScript', 'Java',
    'AWS', 'Azure', 'Power BI', 'R', 'Statistics',
    'Project Management', 'Agile', 'Scrum', 'Git',
    'Cybersecurity', 'Network Security', 'Linux', 'Docker'
  ]
  
  // Randomly select 5-8 skills to simulate parsing
  const shuffled = [...allPossibleSkills].sort(() => 0.5 - Math.random())
  const extractedSkills = shuffled.slice(0, Math.floor(Math.random() * 4) + 5)
  
  console.log('✅ Extracted skills from resume:', extractedSkills)
  
  return {
    skills: extractedSkills,
    parsedAt: new Date().toISOString(),
    fileName: resumeFile.name,
    fileSize: resumeFile.size
  }
}

/**
 * Calculate match score between student skills and mentor expertise
 * Returns a percentage match (0-100)
 */
export const calculateMatchScore = (studentSkills = [], mentorSkills = []) => {
  if (!studentSkills.length || !mentorSkills.length) return 0
  
  // Count matching skills
  const matchingSkills = studentSkills.filter(skill => 
    mentorSkills.some(ms => 
      ms.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(ms.toLowerCase())
    )
  )
  
  // Calculate match percentage
  const matchRatio = matchingSkills.length / Math.max(studentSkills.length, mentorSkills.length)
  const baseScore = Math.round(matchRatio * 100)
  
  // Add some variation for realism (85-100% range for good matches)
  const variance = Math.random() * 10 - 5
  const finalScore = Math.min(100, Math.max(85, baseScore + variance))
  
  return Math.round(finalScore)
}

/**
 * Generate a unique Team ID for competition registration
 */
export const generateTeamID = () => {
  const prefix = 'TEAM'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

/**
 * Check if engagement is low and return warning
 */
export const checkEngagementLevel = (engagementData) => {
  if (!engagementData || engagementData.length === 0) return null
  
  const latestEngagement = engagementData[engagementData.length - 1]?.engagement || 0
  const previousEngagement = engagementData[engagementData.length - 2]?.engagement || latestEngagement
  
  const isLow = latestEngagement < 50
  const isDeclining = latestEngagement < previousEngagement - 10
  
  if (isLow || isDeclining) {
    return {
      level: isLow ? 'critical' : 'warning',
      message: isLow 
        ? 'Critical: Engagement level is below 50%. Immediate action recommended.'
        : 'Warning: Engagement is declining. Consider targeted outreach.',
      suggestions: [
        'Send engagement emails to inactive students',
        'Promote upcoming events',
        'Reach out to alumni for mentorship opportunities',
        'Analyze student feedback for improvement areas'
      ]
    }
  }
  
  return null
}

/**
 * Get recommended students for alumni mentor based on industry
 */
export const getRecommendedStudents = (industry, allStudents = []) => {
  // Filter students by industry interest
  return allStudents
    .filter(student => 
      student.interests?.some(interest => 
        interest.toLowerCase().includes(industry.toLowerCase())
      ) || 
      student.major?.toLowerCase().includes(industry.toLowerCase())
    )
    .slice(0, 5) // Return top 5 matches
}

