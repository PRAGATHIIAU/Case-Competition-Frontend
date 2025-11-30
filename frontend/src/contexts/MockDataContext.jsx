import { createContext, useContext, useState, useEffect } from 'react'
import { mockAlumni, mockJudgeInvitations, mockCompetitions } from '../data/mockData'
import { generateJudgeInvites, sendInvitationEmail } from '../utils/judgeInvitationMatching'
import { sendAcknowledgementEmail, sendSpeakerInvitationEmail, sendMentorInviteEmail } from '../utils/emailService'
import { checkAndSendFollowUps } from '../utils/followUpEmailScheduler'
import { processAppreciationEmails } from '../utils/appreciationEmailScheduler'

const MockDataContext = createContext()

export const useMockData = () => {
  const context = useContext(MockDataContext)
  if (!context) {
    throw new Error('useMockData must be used within MockDataProvider')
  }
  return context
}

export const MockDataProvider = ({ children }) => {
  // Get current user from localStorage (real authentication)
  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        // Map userType to role for frontend compatibility (check userType first, then role, then default)
        const userRole = user.userType || user.role || "student"
        const parsedUser = {
          id: user.id || user.userId || 101, // Support different ID field names
          name: user.name || "User",
          email: user.email || "",
          role: userRole,
          userType: user.userType || userRole, // Ensure both fields exist
          major: user.major || "", // Keep empty string if not set
          year: user.year || "", // Keep empty string if not set
          bio: user.bio || "",
          linkedinUrl: user.linkedinUrl || user.linkedin_url || "",
          portfolioUrl: user.portfolioUrl || user.portfolio_url || "",
          coursework: user.coursework || "", // Keep empty string if not set
          company: user.company || "",
          expertise: user.expertise || "",
          isMentor: user.isMentor || false,
          isJudge: user.isJudge || false,
          isSpeaker: user.isSpeaker || false,
          badges: user.badges || [],
          preferences: {
            emailNotifications: true,
            emailNewEvents: true,
            emailConnectionRequests: true,
            emailWeeklySummaries: false,
            publicProfile: true,
            acceptingMentees: true
          }
        }
        // Debug log to see what we're reading
        if (parsedUser.major || parsedUser.year || parsedUser.coursework) {
          console.log('📖 MockDataContext reading user from localStorage:', {
            major: parsedUser.major,
            year: parsedUser.year,
            coursework: parsedUser.coursework,
            'raw user.major': user.major,
            'raw user.year': user.year,
            'raw user.coursework': user.coursework
          })
        }
        return parsedUser
      }
    } catch (e) {
      console.error('Error parsing user from localStorage:', e)
    }
    // Fallback to default student user
    return {
      id: 101,
      name: "John Doe",
      email: "john.doe@tamu.edu",
      role: "student",
      major: "Computer Science",
      year: "Junior",
      bio: "",
      linkedinUrl: "",
      portfolioUrl: "",
      coursework: "",
      badges: [],
      preferences: {
        emailNotifications: true,
        emailNewEvents: true,
        emailConnectionRequests: true,
        emailWeeklySummaries: false,
        publicProfile: true,
        acceptingMentees: true
      }
    }
  }

  // Current User (from localStorage or fallback)
  const [currentUser, setCurrentUser] = useState(getUserFromStorage())

  // Update currentUser when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newUser = getUserFromStorage()
      // Only update if user data actually changed (compare serialized versions to avoid unnecessary re-renders)
      setCurrentUser(prevUser => {
        const prevStr = JSON.stringify(prevUser)
        const newStr = JSON.stringify(newUser)
        if (prevStr !== newStr) {
          console.log('🔄 MockDataContext: Updated currentUser from localStorage:', newUser)
          return newUser
        }
        return prevUser // Return previous to avoid re-render if nothing changed
      })
    }

    // Listen for storage events (when user logs in/out in another tab)
    window.addEventListener('storage', handleStorageChange)
    
    // Check on mount only (removed periodic checking to prevent constant re-renders)
    handleStorageChange()

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Teams State (shared across dashboards)
  const [teams, setTeams] = useState([
    { 
      id: 1, 
      name: "Data Warriors", 
      members: ["Alice Johnson", "Bob Smith", "Charlie Brown"], 
      fileSubmitted: true,
      fileName: "FinalPresentation.pdf",
      submittedAt: new Date(Date.now() - 7200000).toISOString(),
      score: 92.5,
      scores: {
        presentation: 9.5,
        feasibility: 9.0,
        innovation: 9.2,
        analysis: 9.3,
        recommendations: 9.0
      },
      feedback: "Excellent work! Strong data analysis and practical recommendations."
    },
    { 
      id: 2, 
      name: "Tech Titans", 
      members: ["Diana Lee", "Eve Martinez"], 
      fileSubmitted: true,
      fileName: "TechSolution.pptx",
      submittedAt: new Date(Date.now() - 10800000).toISOString(),
      score: 88.3,
      scores: {
        presentation: 8.8,
        feasibility: 8.5,
        innovation: 9.0,
        analysis: 8.5,
        recommendations: 8.5
      },
      feedback: "Great innovation, but feasibility needs more detail."
    },
    { 
      id: 3, 
      name: "Innovation Squad", 
      members: ["Frank Wilson", "Grace Taylor", "Henry Davis"], 
      fileSubmitted: false,
      fileName: null,
      submittedAt: null,
      score: 0,
      scores: null,
      feedback: ""
    },
    { 
      id: 4, 
      name: "Analytics Masters", 
      members: ["Ivy Chen", "Jack Rodriguez"], 
      fileSubmitted: true,
      fileName: "DataAnalysis.pdf",
      submittedAt: new Date(Date.now() - 3600000).toISOString(),
      score: 0,
      scores: null,
      feedback: ""
    },
    { 
      id: 5, 
      name: "Future Leaders", 
      members: ["Kevin Park", "Luna Kim", "Mike Anderson"], 
      fileSubmitted: false,
      fileName: null,
      submittedAt: null,
      score: 0,
      scores: null,
      feedback: ""
    }
  ])

  // Events State
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Industry Mixer",
      description: "Connect with professionals from top companies in Texas. Great opportunity for networking and learning about industry trends.",
      date: "2024-01-15",
      time: "6:00 PM",
      location: "Mays Business School",
      type: "Mixer",
      category: "General",
      tags: ["Business Strategy", "Consulting", "Networking"],
      related_skills: ["Business Strategy", "Consulting", "Networking"],
      rsvp_link: "/events/1/rsvp",
      rsvpCount: 45,
      isRegistered: false,
      registered: false,
      speakers: [201], // Sarah Johnson (Alumni ID)
      postEventEmailsSent: false, // Track if thank-you emails were sent
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 2,
      title: "Data Analytics Workshop",
      description: "Hands-on workshop covering Python, SQL, and data visualization techniques. Perfect for aspiring data scientists.",
      date: "2024-01-18",
      time: "2:00 PM",
      location: "Virtual",
      type: "Workshop",
      category: "Technology",
      tags: ["Python", "SQL", "Data Analytics"],
      related_skills: ["Python", "SQL", "Data Analytics"],
      rsvp_link: "/events/2/rsvp",
      rsvpCount: 78,
      isRegistered: true,
      registered: true,
      speakers: [203], // Emily Rodriguez (Alumni ID)
      postEventEmailsSent: false, // Track if thank-you emails were sent
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 3,
      title: "Networking Event",
      description: "Annual networking event featuring alumni and industry partners. Bring your resume!",
      date: "2024-01-20",
      time: "5:30 PM",
      location: "Reed Arena",
      type: "Mixer",
      category: "General",
      tags: ["Networking", "Communication"],
      related_skills: ["Networking", "Communication"],
      rsvp_link: "/events/3/rsvp",
      rsvpCount: 52,
      isRegistered: false,
      registered: false,
      speakers: [],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 4,
      title: "FinTech Innovation Summit",
      description: "Explore the latest trends in financial technology, blockchain, and digital banking.",
      date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      time: "9:00 AM",
      location: "Virtual",
      type: "Summit",
      category: "Finance",
      tags: ["Finance", "FinTech", "Blockchain", "Business Strategy"],
      related_skills: ["Finance", "FinTech", "Blockchain"],
      rsvp_link: "/events/4/rsvp",
      rsvpCount: 0,
      isRegistered: false,
      registered: false,
      speakers: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      title: "AI & Machine Learning Conference",
      description: "Deep dive into AI, ML, and data science applications in industry.",
      date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      time: "10:00 AM",
      location: "Mays Business School",
      type: "Conference",
      category: "Technology",
      tags: ["AI", "Data Analytics", "ML", "Python"],
      related_skills: ["AI", "ML", "Data Analytics", "Python"],
      rsvp_link: "/events/5/rsvp",
      rsvpCount: 0,
      isRegistered: false,
      registered: false,
      speakers: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 6,
      title: "Cybersecurity Roundtable",
      description: "Expert panel discussion on cybersecurity trends and best practices.",
      date: new Date(Date.now() + 86400000 * 21).toISOString().split('T')[0],
      time: "3:00 PM",
      location: "Virtual",
      type: "Roundtable",
      category: "Technology",
      tags: ["Cyber Security", "Network Security", "AI"],
      related_skills: ["Cyber Security", "Network Security"],
      rsvp_link: "/events/6/rsvp",
      rsvpCount: 0,
      isRegistered: false,
      registered: false,
      speakers: [],
      createdAt: new Date().toISOString()
    }
  ])

  // Mentors State
  const [mentors, setMentors] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      company: "ExxonMobil",
      role: "Senior Data Scientist",
      expertise: "Cyber Security at Exxon",
      matchScore: 98,
      skills: ["Python", "Data Analytics", "ML"],
      bio: "10+ years in data science, specializing in cybersecurity applications.",
      availability: "Available"
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "Microsoft",
      role: "Tech Lead",
      expertise: "Cloud Infrastructure",
      matchScore: 85,
      skills: ["Azure", "Python", "DevOps"],
      bio: "Leading cloud transformation initiatives.",
      availability: "Available"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      company: "Deloitte",
      role: "VP of Analytics",
      expertise: "Consulting & Strategy",
      matchScore: 92,
      skills: ["SQL", "Business Strategy", "Consulting"],
      bio: "Helping businesses leverage data for strategic decisions.",
      availability: "Busy"
    },
    {
      id: 4,
      name: "David Park",
      company: "Lockheed Martin",
      role: "Cybersecurity Architect",
      expertise: "Cyber Security",
      matchScore: 95,
      skills: ["Cyber Security", "Python", "Network Security"],
      bio: "Expert in enterprise security solutions.",
      availability: "Available"
    }
  ])

  // Student Skills (for matching)
  const [studentSkills, setStudentSkills] = useState(['Python', 'SQL', 'Data Analytics', 'Machine Learning'])

  // Resume Parsed Status
  const [resumeParsed, setResumeParsed] = useState(false)

  // Connection Requests (MentorshipRequests) - This is our "Database"
  const [connectionRequests, setConnectionRequests] = useState([
    {
      id: 1,
      sender_id: 101, // Student ID
      receiver_id: 1, // Mentor ID (Sarah Johnson)
      studentName: "John Doe",
      studentEmail: "john.doe@tamu.edu",
      studentMajor: "Computer Science",
      mentorName: "Sarah Johnson",
      message: "I'm interested in learning more about data science in cybersecurity.",
      status: "pending", // pending, accepted, declined, confirmed
      sessionStatus: null, // null, 'scheduled', 'confirmed'
      meetingTime: null, // ISO date string
      meetingLink: null, // Zoom/Meet URL
      calendarLink: null, // Google Calendar link
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: null
    },
    {
      id: 2,
      sender_id: 102, // Different student
      receiver_id: 2, // Michael Chen
      studentName: "Sarah Chen",
      studentEmail: "sarah.chen@tamu.edu",
      studentMajor: "Information Systems",
      mentorName: "Michael Chen",
      message: "I'd love to discuss cloud architecture opportunities.",
      status: "accepted",
      sessionStatus: null,
      meetingTime: null,
      meetingLink: null,
      calendarLink: null,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 3,
      sender_id: 101, // Current student (John Doe)
      receiver_id: 4, // David Park
      studentName: "John Doe",
      studentEmail: "john.doe@tamu.edu",
      studentMajor: "Computer Science",
      mentorName: "David Park",
      message: "I'm passionate about cybersecurity and would appreciate your guidance.",
      status: "declined",
      sessionStatus: null,
      meetingTime: null,
      meetingLink: null,
      calendarLink: null,
      created_at: new Date(Date.now() - 259200000).toISOString(),
      updated_at: new Date(Date.now() - 172800000).toISOString()
    }
  ])

  // Mentee Notes (Private notes mentors write about their students)
  const [menteeNotes, setMenteeNotes] = useState([
    {
      id: 1,
      mentorId: 1, // Sarah Johnson
      studentId: 101, // John Doe
      content: "Great progress on Python fundamentals. Showed strong interest in data science. Recommended exploring pandas library.",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      isPrivate: true
    },
    {
      id: 2,
      mentorId: 1,
      studentId: 101,
      content: "Discussed career paths in cybersecurity. Student is considering graduate school. Provided resources for GRE preparation.",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      isPrivate: true
    },
    {
      id: 3,
      mentorId: 2, // Michael Chen
      studentId: 102, // Sarah Chen
      content: "Excellent understanding of cloud architecture concepts. Assigned project to build a simple AWS deployment.",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      isPrivate: true
    }
  ])

  // KPI Metrics
  const [kpis, setKpis] = useState({
    activeStudents: 70,
    studentGrowth: 5,
    alumniEngagement: 45,
    partnerNPS: 4.8,
    totalEvents: 12
  })

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      userId: 101,
      type: "event",
      message: "New Event: Data Analytics Workshop matches your interest in Python!",
      link: "/events/2/rsvp",
      isRead: false,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 2,
      userId: 101,
      type: "reminder",
      message: "Reminder: Submission due in 1 hour",
      link: "/competitions",
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ])

  // All Students Database (for matching)
  // Judge Invitations State
  const [judgeInvitations, setJudgeInvitations] = useState(mockJudgeInvitations)
  const [alumni, setAlumni] = useState(mockAlumni)
  const [competitions, setCompetitions] = useState(mockCompetitions)
  
  // Judge Feedback State
  const [judgeFeedback, setJudgeFeedback] = useState([])
  
  // Lectures State
  const [lectures, setLectures] = useState([])
  
  // Speaker Invitations State
  const [speakerInvitations, setSpeakerInvitations] = useState([])

  // Messages State (Direct Messaging System)
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: 101, // John Doe (Student)
      receiverId: 1, // Sarah Johnson (Mentor)
      content: "Hi Sarah! Thank you for accepting my connection request. I'm really excited to learn from you!",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      isRead: true
    },
    {
      id: 2,
      senderId: 1, // Sarah Johnson (Mentor)
      receiverId: 101, // John Doe (Student)
      content: "Hi John! Great to connect with you. I'd love to help you with data science in cybersecurity. What specific areas are you most interested in?",
      timestamp: new Date(Date.now() - 3300000).toISOString(), // 55 minutes ago
      isRead: true
    },
    {
      id: 3,
      senderId: 101,
      receiverId: 1,
      content: "I'm particularly interested in anomaly detection and threat analysis. Do you have any recommended resources or projects I should look into?",
      timestamp: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
      isRead: false
    }
  ])

  const [allStudents] = useState([
    {
      id: 101,
      name: "John Doe",
      email: "john.doe@tamu.edu",
      major: "Computer Science",
      interests: ["Python", "SQL", "Data Analytics", "Machine Learning", "Cyber Security"]
    },
    {
      id: 102,
      name: "Sarah Chen",
      email: "sarah.chen@tamu.edu",
      major: "Business Analytics",
      interests: ["Python", "Tableau", "Business Strategy", "Data Analytics"]
    },
    {
      id: 103,
      name: "Michael Rodriguez",
      email: "michael.r@tamu.edu",
      major: "Information Systems",
      interests: ["Java", "Web Development", "Database Design", "SQL"]
    },
    {
      id: 104,
      name: "Emily Watson",
      email: "emily.w@tamu.edu",
      major: "Computer Science",
      interests: ["Python", "ML", "Azure", "DevOps"]
    },
    {
      id: 105,
      name: "David Kim",
      email: "david.k@tamu.edu",
      major: "MIS",
      interests: ["Consulting", "Business Strategy", "Networking"]
    }
  ])

  // Actions
  // Updated to support multiple files per team and create teams if they don't exist
  const submitTeamFile = (teamId, files, userInfo = null) => {
    // files can be a single fileName (string) or an array of file objects
    const fileArray = Array.isArray(files) 
      ? files 
      : [{ name: files, uploaded: true, uploadDate: new Date().toISOString() }]
    
    setTeams(prevTeams => {
      // Check if team exists
      const existingTeam = prevTeams.find(team => team.id === teamId)
      
      if (existingTeam) {
        // Update existing team
        const existingFiles = existingTeam.files || []
        const newFiles = fileArray.map(file => ({
          name: typeof file === 'string' ? file : file.name,
          uploaded: true,
          uploadDate: file.uploadDate || new Date().toISOString(),
          type: file.type || file.name.split('.').pop()?.toLowerCase() || 'file'
        }))
        
        // Merge with existing files, avoiding duplicates
        const allFiles = [...existingFiles]
        newFiles.forEach(newFile => {
          if (!allFiles.find(f => f.name === newFile.name)) {
            allFiles.push(newFile)
          }
        })
        
        const updatedTeams = prevTeams.map(team => 
          team.id === teamId
            ? {
                ...team,
                fileSubmitted: true,
                fileName: allFiles[0]?.name || team.fileName, // Keep for backward compatibility
                files: allFiles,
                submittedAt: new Date().toISOString()
              }
            : team
        )
        
        console.log('📝 Updated existing team:', { teamId, fileCount: allFiles.length })
        return updatedTeams
      } else {
        // Create new team if it doesn't exist
        console.log('🆕 Creating new team for submission:', { teamId, userInfo, fileCount: fileArray.length })
        
        const newFiles = fileArray.map(file => ({
          name: typeof file === 'string' ? file : file.name,
          uploaded: true,
          uploadDate: file.uploadDate || new Date().toISOString(),
          type: file.type || file.name.split('.').pop()?.toLowerCase() || 'file'
        }))
        
        const newTeam = {
          id: teamId,
          name: userInfo?.teamName || `Team ${teamId}`,
          members: userInfo?.members || [userInfo?.name || `User ${teamId}`],
          fileSubmitted: true,
          fileName: newFiles[0]?.name,
          files: newFiles,
          submittedAt: new Date().toISOString(),
          score: 0,
          scores: null,
          feedback: ""
        }
        
        console.log('✅ New team created:', newTeam)
        return [...prevTeams, newTeam]
      }
    })
  }

  const scoreTeam = (teamId, scores, feedback) => {
    const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0)
    setTeams(teams.map(team =>
      team.id === teamId
        ? { 
            ...team, 
            score: totalScore,
            scores,
            feedback,
            scoredAt: new Date().toISOString()
          }
        : team
    ))
  }

  const toggleEventRSVP = async (eventId) => {
    console.log('\n🎯 ========== toggleEventRSVP CALLED ==========');
    console.log('📋 Event ID received:', eventId, 'Type:', typeof eventId);
    
    // Get current user ID
    const userStr = localStorage.getItem('user')
    let userId = null
    let userEmail = null
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        userId = user.id || user.student_id
        userEmail = user.email
        console.log('👤 User from localStorage:');
        console.log('   ├─ ID:', userId, 'Type:', typeof userId);
        console.log('   ├─ Email:', userEmail);
        console.log('   └─ Full user:', user);
      } catch (e) {
        console.error('❌ Error parsing user data:', e)
      }
    } else {
      console.error('❌ No user data in localStorage!');
    }

    if (!userId) {
      console.error('❌ No user ID found. Cannot RSVP without authentication.')
      throw new Error('Please login to RSVP to events')
    }

    try {
      console.log('📤 Frontend: Calling RSVP API...');
      console.log('   ├─ Event ID:', eventId, '(will convert to string)');
      console.log('   ├─ User ID:', userId, '(will convert to number)');
      console.log('   └─ User Email:', userEmail);
      
      // Ensure eventId is a string and userId is a number
      const eventIdStr = String(eventId);
      const userIdNum = Number(userId);
      
      console.log('   └─ Converted - Event ID:', eventIdStr, 'User ID:', userIdNum);
      
      // Call backend API to RSVP (this will send confirmation email)
      const api = await import('../services/api')
      console.log('   └─ API imported, calling rsvp...');
      const response = await api.default.event.rsvp(eventIdStr, userIdNum)
      
      console.log('📥 Frontend: RSVP API response received:');
      console.log('   ├─ Success:', response?.success);
      console.log('   ├─ Message:', response?.message);
      console.log('   ├─ Email sent:', response?.emailSent);
      console.log('   └─ Full response:', response);
      
      // Update local state on success
      setEvents(events.map(event =>
        event.id === eventId
          ? { 
              ...event, 
              isRegistered: !event.isRegistered,
              rsvpCount: event.isRegistered ? event.rsvpCount - 1 : event.rsvpCount + 1
            }
          : event
      ))
      
      // Show success message
      const successMessage = response?.message || `✅ Successfully registered! Confirmation email sent to ${userEmail || 'your registered email'}.`
      console.log('✅ RSVP successful:', successMessage)
      
      // Return success with message for toast notification
      return {
        success: true,
        message: successMessage,
        email: userEmail
      }
    } catch (error) {
      console.error('❌ RSVP failed:', error)
      
      // Determine error message
      let errorMessage = 'Failed to RSVP to event. Please try again.'
      if (error.message) {
        if (error.message.includes('Already RSVP')) {
          errorMessage = 'You have already RSVP\'d to this event.'
        } else if (error.message.includes('login')) {
          errorMessage = 'Please login to RSVP to events.'
        } else {
          errorMessage = error.message
        }
      }
      
      // If API call fails, still update local state (fallback to mock behavior)
      setEvents(events.map(event =>
        event.id === eventId
          ? { 
              ...event, 
              isRegistered: !event.isRegistered,
              rsvpCount: event.isRegistered ? event.rsvpCount - 1 : event.rsvpCount + 1
            }
          : event
      ))
      
      throw new Error(errorMessage)
    }
  }

  const updateStudentSkills = (newSkills) => {
    setStudentSkills(newSkills)
    setResumeParsed(true)
    
    // Automatically update mentor match scores when skills change
    const updatedMentors = getRecommendedMentorsForStudent(newSkills)
    setMentors(updatedMentors)
  }

  const getRecommendedMentorsForStudent = (skills) => {
    // Import the matching logic
    const calculateMatchPercentage = (studentSkills, mentor) => {
      if (!studentSkills || !mentor.skills) return 0
      
      const studentSet = new Set(studentSkills.map(s => s.toLowerCase()))
      const mentorSet = new Set(mentor.skills.map(s => s.toLowerCase()))
      
      let matches = 0
      studentSet.forEach(skill => {
        if (mentorSet.has(skill)) matches++
      })
      
      if (matches === 0) return 0
      
      const maxPossible = Math.max(studentSkills.length, mentor.skills.length)
      const overlapScore = (matches / maxPossible) * 100
      const bonusPoints = matches >= 3 ? 10 : matches >= 2 ? 5 : 0
      
      return Math.min(100, Math.round(overlapScore + bonusPoints))
    }
    
    // Update all mentors with new match scores
    const updated = mentors.map(mentor => ({
      ...mentor,
      matchScore: calculateMatchPercentage(skills, mentor)
    }))
    
    // Sort by match score
    return updated.sort((a, b) => b.matchScore - a.matchScore)
  }

  // ============ CONNECTION REQUEST CRUD OPERATIONS ============
  
  // CREATE: Send connection request from student to mentor
  const sendConnectionRequest = async (mentorId, message = "") => {
    console.log('📤 SEND REQUEST - Starting...')
    console.log('  ├─ Current User:', currentUser)
    console.log('  ├─ Target Mentor ID:', mentorId)
    console.log('  └─ Message:', message)
    
    // Simulate API POST /api/send-request
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if request already exists
        const existingRequest = connectionRequests.find(
          req => req.sender_id === currentUser.id && req.receiver_id === mentorId
        )
        
        if (existingRequest) {
          console.log('❌ REQUEST FAILED: Request already exists')
          reject({ error: "Request already exists" })
          return
        }
        
        const mentor = mentors.find(m => m.id === mentorId)
        if (!mentor) {
          console.log('❌ REQUEST FAILED: Mentor not found')
          reject({ error: "Mentor not found" })
          return
        }
        
        // 1. Fetch full student profile
        const student = allStudents.find(s => s.id === currentUser.id) || currentUser
        console.log('📊 STUDENT PROFILE:')
        console.log('  ├─ Name:', student.name)
        console.log('  ├─ Major:', student.major || currentUser.major)
        console.log('  └─ Skills:', studentSkills)
        
        // 2. Fetch mentor skills/expertise
        const mentorSkills = mentor.skills || []
        const mentorExpertise = mentor.expertise ? (Array.isArray(mentor.expertise) ? mentor.expertise : [mentor.expertise]) : []
        const allMentorSkills = [...mentorSkills, ...mentorExpertise].filter(Boolean)
        console.log('📊 MENTOR PROFILE:')
        console.log('  ├─ Name:', mentor.name)
        console.log('  └─ Skills/Expertise:', allMentorSkills)
        
        // 3. Find shared skills (intersection)
        const studentSkillsArray = Array.isArray(studentSkills) ? studentSkills : []
        const sharedSkills = studentSkillsArray.filter(skill =>
          allMentorSkills.some(mentorSkill =>
            skill.toLowerCase() === mentorSkill.toLowerCase() ||
            skill.toLowerCase().includes(mentorSkill.toLowerCase()) ||
            mentorSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
        
        // Get top 3 shared skills
        const topSharedSkills = sharedSkills.slice(0, 3)
        
        console.log('🎯 SHARED SKILLS ANALYSIS:')
        console.log('  ├─ Student Skills:', studentSkillsArray)
        console.log('  ├─ Mentor Skills:', allMentorSkills)
        console.log('  ├─ Shared Skills:', sharedSkills)
        console.log('  └─ Top 3 Shared:', topSharedSkills)
        
        // Generate mentor email if not present
        const mentorEmail = mentor.email || (() => {
          const emailName = mentor.name.toLowerCase().replace(/\s+/g, '.')
          const companyDomain = mentor.company ? mentor.company.toLowerCase().replace(/\s+/g, '') + '.com' : 'example.com'
          return `${emailName}@${companyDomain}`
        })()
        
        const newRequest = {
          id: Date.now(),
          sender_id: currentUser.id,
          receiver_id: mentorId,
          studentName: currentUser.name,
          studentEmail: currentUser.email,
          studentMajor: currentUser.major || "Not specified",
          mentorName: mentor.name,
          mentorEmail: mentorEmail,
          message: message || `Hi ${mentor.name}, I would love to connect and learn from your experience.`,
          status: "pending",
          sharedSkills: sharedSkills, // Store shared skills in request
          created_at: new Date().toISOString(),
          updated_at: null
        }
        
        console.log('💾 SAVING REQUEST TO DATABASE (MockDataContext):')
        console.log('  ├─ Request ID:', newRequest.id)
        console.log('  ├─ From Student:', newRequest.studentName, '(ID:', newRequest.sender_id, ')')
        console.log('  ├─ To Mentor:', newRequest.mentorName, '(ID:', newRequest.receiver_id, ')')
        console.log('  ├─ Status:', newRequest.status)
        console.log('  └─ Full Request Object:', newRequest)
        
        setConnectionRequests(prev => {
          const updated = [...prev, newRequest]
          console.log('✅ DATABASE UPDATED! Total requests now:', updated.length)
          console.log('   All requests:', updated)
          return updated
        })
        
        // 4. Send personalized email to mentor (non-blocking)
        console.log('📧 SENDING EMAIL TO MENTOR...')
        sendMentorInviteEmail(
          newRequest.mentorEmail,
          mentor,
          {
            name: student.name,
            major: currentUser.major || "Not specified",
            email: currentUser.email
          },
          topSharedSkills
        ).then((emailResult) => {
          if (emailResult.success) {
            console.log('✅ EMAIL SENT SUCCESSFULLY!')
          } else {
            console.log('⚠️ EMAIL SENDING FAILED (but request still saved):', emailResult.message)
          }
        }).catch((emailError) => {
          console.error('❌ EMAIL ERROR (but request still saved):', emailError)
          // Don't block the request - email failure is non-critical
        })
        
        console.log('✅ REQUEST SENT SUCCESSFULLY!')
        
        resolve({ 
          success: true, 
          requestId: newRequest.id,
          message: "Connection request sent successfully!",
          sharedSkills: sharedSkills
        })
      }, 800) // Simulate network delay
    })
  }

  // READ: Get all requests sent by current student
  const getMyConnectionRequests = () => {
    return connectionRequests.filter(req => req.sender_id === currentUser.id)
  }

  // READ: Get all requests received by current mentor
  const getReceivedRequests = (mentorId = null) => {
    const targetMentorId = Number(mentorId || currentUser.id)
    
    console.log('📥 GET RECEIVED REQUESTS:')
    console.log('  ├─ Looking for Mentor ID:', targetMentorId, 'type:', typeof targetMentorId)
    console.log('  ├─ Current User ID:', currentUser.id, 'type:', typeof currentUser.id)
    console.log('  ├─ Total requests in database:', connectionRequests.length)
    
    // Filter with type-safe comparison
    const filtered = connectionRequests.filter(req => {
      const receiverId = Number(req.receiver_id)
      const match = receiverId === targetMentorId
      if (match) {
        console.log('  ✓ Found matching request:', req.id, 'receiver_id:', receiverId)
      }
      return match
    })
    
    console.log('  ├─ Requests for this mentor:', filtered.length)
    console.log('  └─ Filtered requests:', filtered.map(r => ({ id: r.id, receiver_id: r.receiver_id, status: r.status })))
    
    // If no requests found and user is a mentor/alumni, create a sample request for testing
    if (filtered.length === 0 && (currentUser.role === 'mentor' || currentUser.role === 'alumni' || currentUser.isMentor)) {
      console.log('⚠️ No requests found for mentor, creating sample request for testing')
      // Create a sample request with current user as receiver
      const sampleRequest = {
        id: Date.now(),
        sender_id: 101, // Sample student
        receiver_id: targetMentorId, // Current mentor
        studentName: "Sample Student",
        studentEmail: "student@tamu.edu",
        studentMajor: "Computer Science",
        mentorName: currentUser.name,
        message: "I'm interested in learning more about your expertise.",
        status: "pending",
        sessionStatus: null,
        meetingTime: null,
        meetingLink: null,
        calendarLink: null,
        created_at: new Date().toISOString(),
        updated_at: null
      }
      // Add to state
      setConnectionRequests(prev => [...prev, sampleRequest])
      return [sampleRequest]
    }
    
    return filtered
  }

  // READ: Get pending requests for a specific mentor
  const getPendingRequestsForMentor = (mentorId = null) => {
    const targetMentorId = Number(mentorId || currentUser.id)
    // Use type-safe comparison
    return connectionRequests.filter(req => {
      const receiverId = Number(req.receiver_id)
      return receiverId === targetMentorId && req.status === 'pending'
    })
  }

  // UPDATE: Accept or decline a request (Mentor action)
  const updateRequestStatus = async (requestId, newStatus) => {
    // Simulate API PUT /api/requests/:requestId
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const request = connectionRequests.find(req => req.id === requestId)
        
        if (!request) {
          reject({ error: "Request not found" })
          return
        }
        
        // Authorization check: Only the mentor (receiver) can update status
        console.log('🔐 Authorization check for updateRequestStatus:', {
          requestId: requestId,
          requestReceiverId: request.receiver_id,
          currentUserId: currentUser.id,
          match: request.receiver_id === currentUser.id
        })
        
        // Convert both to numbers for comparison (handle string/number mismatch)
        const receiverId = Number(request.receiver_id)
        const userId = Number(currentUser.id)
        
        if (receiverId !== userId) {
          console.error('❌ Authorization failed for updateRequestStatus')
          reject({ error: `Unauthorized: You can only update your own requests. Request receiver ID: ${receiverId}, Your ID: ${userId}` })
          return
        }
        
        console.log('✅ Authorization passed for updateRequestStatus')
        
        setConnectionRequests(prev => prev.map(req =>
          req.id === requestId
            ? { 
                ...req, 
                status: newStatus, 
                updated_at: new Date().toISOString() 
              }
            : req
        ))
        
        // Trigger badge check for both users when connection is accepted
        if (newStatus === 'accepted' || newStatus === 'confirmed') {
          triggerBadgeCheck(request.sender_id)
          triggerBadgeCheck(request.receiver_id)
        }
        
        resolve({ 
          success: true, 
          message: `Request ${newStatus} successfully!` 
        })
      }, 500)
    })
  }

  // PUT: Confirm session and schedule meeting
  const confirmSession = async (requestId, sessionData) => {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          console.log('📅 CONFIRM SESSION - Starting...')
          console.log('  ├─ Request ID:', requestId)
          console.log('  ├─ Meeting Time:', sessionData.meetingTime)
          console.log('  └─ Meeting Link:', sessionData.meetingLink)
          
          const request = connectionRequests.find(req => req.id === requestId)
          
          if (!request) {
            throw new Error('Request not found')
          }
          
          // Authorization check - mentor must be the receiver
          console.log('🔐 Authorization check for confirmSession:', {
            requestId: request.id,
            requestReceiverId: request.receiver_id,
            requestReceiverIdType: typeof request.receiver_id,
            currentUserId: currentUser.id,
            currentUserIdType: typeof currentUser.id,
            currentUserName: currentUser.name,
            currentUserRole: currentUser.role,
            match: request.receiver_id === currentUser.id,
            strictMatch: String(request.receiver_id) === String(currentUser.id)
          })
          
          // Convert both to numbers for comparison (handle string/number mismatch)
          const receiverId = Number(request.receiver_id)
          const userId = Number(currentUser.id)
          
          if (receiverId !== userId) {
            console.error('❌ Authorization failed:', {
              requestId: request.id,
              requestReceiverId: receiverId,
              currentUserId: userId,
              currentUser: currentUser
            })
            throw new Error(`Unauthorized: You can only confirm your own sessions. Request receiver ID: ${receiverId}, Your ID: ${userId}`)
          }
          
          console.log('✅ Authorization passed')
          
          // Generate Google Calendar link
          const { generateGoogleCalendarLink } = await import('../utils/calendarUtils')
          const calendarLink = generateGoogleCalendarLink(
            `Mentorship Session: ${request.studentName}`,
            `Mentorship session with ${request.studentName} (${request.studentMajor}).\n\n${request.message || 'Mentorship discussion'}`,
            sessionData.meetingTime,
            sessionData.durationMinutes || 60,
            sessionData.meetingLink || ''
          )
          
          // Update request with session details
          const updatedRequest = {
            ...request,
            status: 'confirmed',
            sessionStatus: 'confirmed',
            meetingTime: sessionData.meetingTime,
            meetingLink: sessionData.meetingLink || '',
            calendarLink: calendarLink,
            updated_at: new Date().toISOString()
          }
          
          setConnectionRequests(prev => prev.map(req =>
            req.id === requestId ? updatedRequest : req
          ))
          
          console.log('✅ Session confirmed and saved to database')
          
          // Send confirmation emails to both parties (non-blocking)
          const { sendSessionConfirmationEmail } = await import('../utils/emailService')
          
          // Email to Student
          sendSessionConfirmationEmail(
            request.studentEmail,
            {
              name: request.studentName,
              role: 'student'
            },
            {
              name: request.mentorName,
              role: 'mentor'
            },
            sessionData.meetingTime,
            sessionData.meetingLink || '',
            calendarLink,
            request.message || 'Mentorship discussion'
          ).then((result) => {
            if (result.success) {
              console.log('✅ Confirmation email sent to student')
            } else {
              console.log('⚠️ Failed to send email to student (non-critical)')
            }
          }).catch((error) => {
            console.error('❌ Email error (non-critical):', error)
          })
          
          // Email to Mentor
          const mentor = mentors.find(m => m.id === request.receiver_id)
          if (mentor) {
            const mentorEmail = mentor.email || `${mentor.name.toLowerCase().replace(/\s+/g, '.')}@${mentor.company?.toLowerCase().replace(/\s+/g, '') || 'example'}.com`
            sendSessionConfirmationEmail(
              mentorEmail,
              {
                name: request.mentorName,
                role: 'mentor'
              },
              {
                name: request.studentName,
                role: 'student'
              },
              sessionData.meetingTime,
              sessionData.meetingLink || '',
              calendarLink,
              request.message || 'Mentorship discussion'
            ).then((result) => {
              if (result.success) {
                console.log('✅ Confirmation email sent to mentor')
              } else {
                console.log('⚠️ Failed to send email to mentor (non-critical)')
              }
            }).catch((error) => {
              console.error('❌ Email error (non-critical):', error)
            })
          }
          
          resolve({
            success: true,
            message: 'Session confirmed successfully!',
            session: updatedRequest
          })
        } catch (error) {
          console.error('❌ Failed to confirm session:', error)
          // Throw an Error so the modal can catch it properly
          const errorMessage = error.message || 'Failed to confirm session'
          reject(new Error(errorMessage))
        }
      }, 800)
    })
  }

  // Helper: Check if current student has already requested a specific mentor
  const hasRequestedMentor = (mentorId) => {
    return connectionRequests.some(
      req => req.sender_id === currentUser.id && req.receiver_id === mentorId
    )
  }

  // Helper: Get request status for a specific mentor
  const getRequestStatus = (mentorId) => {
    const request = connectionRequests.find(
      req => req.sender_id === currentUser.id && req.receiver_id === mentorId
    )
    return request ? request.status : null
  }

  // ============ MENTEE TRACKER SYSTEM ============

  // GET: Get mentor dashboard data (accepted mentees + history + notes)
  const getMentorDashboardData = async (mentorId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('📊 GET MENTOR DASHBOARD DATA - Starting...')
        console.log('  └─ Mentor ID:', mentorId)

        // 1. Fetch all accepted connection requests for this mentor
        const acceptedRequests = connectionRequests.filter(
          req => req.receiver_id === mentorId && (req.status === 'accepted' || req.status === 'confirmed')
        )

        console.log('  ├─ Accepted Requests:', acceptedRequests.length)

        // 2. For each accepted request, build mentee profile
        const mentees = acceptedRequests.map(request => {
          // Get student profile
          const student = allStudents.find(s => s.id === request.sender_id) || {
            id: request.sender_id,
            name: request.studentName,
            email: request.studentEmail,
            major: request.studentMajor,
            photo: null
          }

          // Get session history (confirmed sessions)
          const sessions = connectionRequests
            .filter(req => 
              req.sender_id === request.sender_id && 
              req.receiver_id === mentorId && 
              req.status === 'confirmed' &&
              req.sessionStatus === 'confirmed'
            )
            .map(req => ({
              id: req.id,
              date: req.meetingTime,
              meetingLink: req.meetingLink,
              calendarLink: req.calendarLink,
              topic: req.message || 'Mentorship discussion',
              createdAt: req.created_at
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Most recent first

          // Get notes for this student
          const notes = menteeNotes
            .filter(note => note.mentorId === mentorId && note.studentId === request.sender_id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Most recent first

          return {
            studentId: request.sender_id,
            studentName: student.name,
            studentEmail: student.email,
            studentMajor: student.major,
            studentPhoto: student.photo || null,
            connectionDate: request.created_at,
            lastSessionDate: sessions.length > 0 ? sessions[0].date : null,
            sessions: sessions,
            notes: notes,
            totalSessions: sessions.length,
            totalNotes: notes.length
          }
        })

        console.log('  ├─ Mentees Found:', mentees.length)
        console.log('  └─ Full Data:', mentees)

        resolve({
          success: true,
          mentees: mentees,
          totalMentees: mentees.length
        })
      }, 500)
    })
  }

  // POST: Save a new mentee note
  const saveMenteeNote = async (mentorId, studentId, content) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('📝 SAVE MENTEE NOTE - Starting...')
          console.log('  ├─ Mentor ID:', mentorId)
          console.log('  ├─ Student ID:', studentId)
          console.log('  └─ Content:', content.substring(0, 50) + '...')

          if (!content || content.trim().length === 0) {
            throw new Error('Note content cannot be empty')
          }

          // Validate mentor has accepted connection with this student
          const hasConnection = connectionRequests.some(
            req => req.receiver_id === mentorId && 
                   req.sender_id === studentId && 
                   (req.status === 'accepted' || req.status === 'confirmed')
          )

          if (!hasConnection) {
            throw new Error('You can only add notes for your accepted mentees')
          }

          const newNote = {
            id: Date.now(),
            mentorId: mentorId,
            studentId: studentId,
            content: content.trim(),
            createdAt: new Date().toISOString(),
            isPrivate: true
          }

          setMenteeNotes(prev => [newNote, ...prev])

          console.log('✅ Note saved successfully!')
          console.log('  └─ Note ID:', newNote.id)

          resolve({
            success: true,
            note: newNote,
            message: 'Note saved successfully!'
          })
        } catch (error) {
          console.error('❌ Failed to save note:', error)
          reject({
            success: false,
            message: error.message || 'Failed to save note',
            error: error.message
          })
        }
      }, 500)
    })
  }

  // Legacy method for backward compatibility
  const handleMentorshipRequest = (requestId, action) => {
    updateRequestStatus(requestId, action)
  }

  // Legacy method
  const getMentorRequests = (mentorId) => {
    return getPendingRequestsForMentor(mentorId)
  }

  // ============ EVENT & NOTIFICATION SYSTEM ============

  // CREATE EVENT with automatic notification matching
  const createEvent = async (eventData) => {
    console.log('🎉 CREATE EVENT - Starting...')
    console.log('  ├─ Event:', eventData.title)
    console.log('  ├─ Related Skills:', eventData.related_skills)
    console.log('  └─ Students to check:', allStudents.length)

    try {
      // 1. Transform form data to backend format
      const dateTime = eventData.date && eventData.time
        ? `${eventData.date}T${eventData.time}:00` // Combine date and time into ISO format
        : eventData.date || new Date().toISOString()

      const backendEventData = {
        title: eventData.title,
        description: eventData.description || '',
        event_type: eventData.type || 'Workshop',
        date_time: dateTime,
        location: eventData.location || '',
        capacity: null, // Optional, can be null
        organizer_id: currentUser.id, // Current user (admin/faculty) creating the event
        skills_required: eventData.related_skills || []
      }

      console.log('📤 Sending event to backend:', backendEventData)

      // 2. Save event to database via API
      const api = await import('../services/api')
      let backendEvent = null
      try {
        const apiResponse = await api.eventAPI.create(backendEventData)
        if (apiResponse.success) {
          // Handle both 'event' and 'data' response formats
          backendEvent = apiResponse.event || apiResponse.data
          if (backendEvent) {
            console.log('✅ Event saved to database:', backendEvent)
          } else {
            console.warn('⚠️ Backend response missing event data:', apiResponse)
          }
        } else {
          console.warn('⚠️ Backend returned success=false:', apiResponse)
        }
      } catch (apiError) {
        console.error('❌ Failed to save event to database:', apiError)
        // Continue with local state update even if backend fails
      }

      // 3. Create local event object (for frontend state)
      const newEvent = {
        id: backendEvent?.id || Date.now(),
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time || "TBD",
        location: eventData.location,
        type: eventData.type || "Event",
        related_skills: eventData.related_skills || [],
        rsvp_link: `/events/${backendEvent?.id || Date.now()}/rsvp`,
        registered: false,
        createdAt: backendEvent?.created_at || new Date().toISOString()
      }

      console.log('💾 Event created locally:', newEvent)

      // 4. Save event to local state
      setEvents(prev => [newEvent, ...prev])

      // 5. MATCHING LOGIC: Find students with matching interests
      const matchedStudents = []
      const newNotifications = []

      allStudents.forEach(student => {
        // Calculate intersection between student interests and event skills
        const intersection = student.interests.filter(interest =>
          newEvent.related_skills.some(skill => 
            skill.toLowerCase() === interest.toLowerCase()
          )
        )

        console.log(`  📊 Student: ${student.name}`)
        console.log(`     ├─ Interests: ${student.interests.join(', ')}`)
        console.log(`     ├─ Event Skills: ${newEvent.related_skills.join(', ')}`)
        console.log(`     └─ Matched: ${intersection.length} skills (${intersection.join(', ')})`)

        // If match found, create notification
        if (intersection.length > 0) {
          const matchedSkill = intersection[0] // Primary matching skill
          const notification = {
            id: Date.now() + student.id, // Unique ID
            userId: student.id,
            type: "event",
            message: `New Event: ${newEvent.title} matches your interest in ${matchedSkill}!`,
            link: newEvent.rsvp_link,
            isRead: false,
            createdAt: new Date().toISOString()
          }

          newNotifications.push(notification)
          matchedStudents.push({
            studentId: student.id,
            studentName: student.name,
            matchedSkills: intersection
          })

          console.log(`  ✅ Created notification for ${student.name}`)
        }
      })

      // 6. Save notifications to local state
      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev])
        console.log(`📬 ${newNotifications.length} notifications created!`)
      } else {
        console.log('⚠️ No matching students found')
      }

      // 7. Return result
      return {
        success: true,
        event: newEvent,
        matchedStudents,
        notificationsCreated: newNotifications.length
      }
    } catch (error) {
      console.error('❌ Error creating event:', error)
      throw error
    }
  }

  // READ: Get notifications for current user
  const getMyNotifications = () => {
    return notifications
      .filter(notif => notif.userId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  // READ: Get unread notification count
  const getUnreadCount = () => {
    return notifications.filter(notif => 
      notif.userId === currentUser.id && !notif.isRead
    ).length
  }

  // UPDATE: Mark notification as read
  const markNotificationAsRead = (notificationId) => {
    console.log(`📖 Marking notification ${notificationId} as read`)
    setNotifications(prev => prev.map(notif =>
      notif.id === notificationId
        ? { ...notif, isRead: true }
        : notif
    ))
  }

  // UPDATE: Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    console.log('📖 Marking all notifications as read')
    setNotifications(prev => prev.map(notif =>
      notif.userId === currentUser.id
        ? { ...notif, isRead: true }
        : notif
    ))
  }

  // UPDATE: Update user profile
  const updateProfile = async (profileData) => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        try {
          console.log('📝 Updating profile:', profileData)
          
          // Update current user state
          setCurrentUser(prev => ({
            ...prev,
            ...profileData
          }))
          
          // Also update in allStudents if user exists there
          if (allStudents && allStudents.length > 0) {
            // This would typically be a backend update
            console.log('✅ Profile updated in database')
          }
          
          resolve({
            success: true,
            message: 'Profile updated successfully',
            user: { ...currentUser, ...profileData }
          })
        } catch (error) {
          console.error('❌ Profile update failed:', error)
          reject({
            success: false,
            message: 'Failed to update profile',
            error: error.message
          })
        }
      }, 800) // Simulate network delay
    })
  }

  // PUT: Update user preferences
  const updatePreferences = async (preferencesData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('⚙️ Updating preferences:', preferencesData)
          
          // Update current user preferences
          setCurrentUser(prev => ({
            ...prev,
            preferences: {
              ...prev.preferences,
              ...preferencesData
            }
          }))
          
          console.log('✅ Preferences updated in database')
          
          resolve({
            success: true,
            message: 'Preferences updated successfully',
            preferences: { ...currentUser.preferences, ...preferencesData }
          })
        } catch (error) {
          console.error('❌ Preferences update failed:', error)
          reject({
            success: false,
            message: 'Failed to update preferences',
            error: error.message
          })
        }
      }, 800) // Simulate network delay
    })
  }

  // ============ JUDGE INVITATION SYSTEM ============

  // CREATE: Create competition and auto-generate judge invitations
  const createCompetition = async (competitionData) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('🏆 Creating competition:', competitionData.name)
        
        // 1. Try to save to database first
        let dbCompetition = null
        try {
          const response = await fetch('/api/competitions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
            },
            body: JSON.stringify({
              title: competitionData.name,
              description: competitionData.description || '',
              start_date: competitionData.startDate || new Date().toISOString(),
              end_date: competitionData.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              deadline: competitionData.deadline || competitionData.endDate || new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
              max_team_size: competitionData.maxTeamSize || 4,
              prize: competitionData.prize || '',
              status: 'active',
              required_expertise: competitionData.requiredExpertise || []
            })
          })
          
          if (response.ok) {
            const data = await response.json()
            dbCompetition = data.competition || data
            console.log('  ✅ Competition saved to database with ID:', dbCompetition.id)
          } else {
            console.log('  ⚠️ Failed to save to database, using mock data only')
          }
        } catch (dbError) {
          console.log('  ⚠️ Database save error (using mock data):', dbError.message)
        }
        
        // 2. Create the competition in frontend state (use DB ID if available)
        const newCompetition = {
          id: dbCompetition?.id || competitions.length + 1,
          ...competitionData,
          judges: [],
          createdAt: new Date().toISOString()
        }
        
        setCompetitions(prev => [...prev, newCompetition])
        console.log('  ✅ Competition created in frontend with ID:', newCompetition.id)
        
        // 3. Generate judge invitations automatically
        const newInvitations = generateJudgeInvites(newCompetition, alumni)
        
        if (newInvitations.length > 0) {
          // 4. Send invitation emails (simulated)
          newInvitations.forEach(invitation => {
            sendInvitationEmail(invitation)
          })
          
          // 5. Save invitations
          setJudgeInvitations(prev => [...newInvitations, ...prev])
          console.log(`  ✅ ${newInvitations.length} judge invitations created and sent`)
        } else {
          console.log('  ⚠️ No matching stakeholders found for this competition')
        }
        
        resolve({
          success: true,
          competition: newCompetition,
          invitationsCreated: newInvitations.length,
          invitations: newInvitations
        })
      } catch (error) {
        console.error('❌ Competition creation failed:', error)
        reject({
          success: false,
          message: 'Failed to create competition',
          error: error.message
        })
      }
    })
  }

  // READ: Get invitations for current stakeholder
  const getMyInvitations = (stakeholderId) => {
    return judgeInvitations
      .filter(inv => inv.stakeholderId === stakeholderId)
      .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
  }

  // READ: Get pending invitations for stakeholder
  const getPendingInvitations = (stakeholderId) => {
    return judgeInvitations.filter(inv => 
      inv.stakeholderId === stakeholderId && inv.status === 'pending'
    )
  }

  // UPDATE: Accept invitation
  const acceptInvitation = async (invitationId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('✅ Accepting invitation:', invitationId)
          
          const invitation = judgeInvitations.find(inv => inv.id === invitationId)
          if (!invitation) {
            throw new Error('Invitation not found')
          }
          
          // Update invitation status
          setJudgeInvitations(prev => prev.map(inv =>
            inv.id === invitationId
              ? { ...inv, status: 'accepted', respondedAt: new Date().toISOString() }
              : inv
          ))
          
          // Add stakeholder to competition's judges list
          setCompetitions(prev => prev.map(comp =>
            comp.id === invitation.competitionId
              ? { ...comp, judges: [...comp.judges, invitation.stakeholderId] }
              : comp
          ))
          
          console.log(`  ✅ ${invitation.stakeholderName} accepted invitation to judge ${invitation.competitionName}`)
          
          resolve({
            success: true,
            message: 'Invitation accepted successfully'
          })
        } catch (error) {
          console.error('❌ Failed to accept invitation:', error)
          reject({
            success: false,
            message: 'Failed to accept invitation',
            error: error.message
          })
        }
      }, 500)
    })
  }

  // UPDATE: Decline invitation
  const declineInvitation = async (invitationId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('❌ Declining invitation:', invitationId)
          
          const invitation = judgeInvitations.find(inv => inv.id === invitationId)
          if (!invitation) {
            throw new Error('Invitation not found')
          }
          
          // Update invitation status
          setJudgeInvitations(prev => prev.map(inv =>
            inv.id === invitationId
              ? { ...inv, status: 'declined', respondedAt: new Date().toISOString() }
              : inv
          ))
          
          console.log(`  ✅ ${invitation.stakeholderName} declined invitation to judge ${invitation.competitionName}`)
          
          resolve({
            success: true,
            message: 'Invitation declined'
          })
        } catch (error) {
          console.error('❌ Failed to decline invitation:', error)
          reject({
            success: false,
            message: 'Failed to decline invitation',
            error: error.message
          })
        }
      }, 500)
    })
  }

  // ============ ACKNOWLEDGEMENT EMAIL SYSTEM ============

  // POST: Send acknowledgement email to stakeholder
  const sendAcknowledgement = async (stakeholderId, competitionId) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          console.log('📧 Sending acknowledgement email...')
          console.log('  ├─ Stakeholder ID:', stakeholderId)
          console.log('  ├─ Competition ID:', competitionId)

          // Find the stakeholder
          const stakeholder = alumni.find(a => a.id === stakeholderId)
          if (!stakeholder) {
            throw new Error('Stakeholder not found')
          }

          // Find the invitation
          const invitation = judgeInvitations.find(inv => 
            inv.stakeholderId === stakeholderId && inv.competitionId === competitionId
          )

          if (!invitation) {
            throw new Error('Invitation not found')
          }

          // Check if already acknowledged
          if (invitation.acknowledged) {
            throw new Error('Acknowledgement already sent')
          }

          // Send acknowledgement email
          const emailResult = await sendAcknowledgementEmail(
            stakeholder.email,
            stakeholder.name
          )

          if (!emailResult.success) {
            throw new Error(emailResult.message || 'Failed to send email')
          }

          // Update invitation status to 'under_review' and mark as acknowledged
          setJudgeInvitations(prev => prev.map(inv =>
            inv.id === invitation.id
              ? { 
                  ...inv, 
                  acknowledged: true,
                  acknowledgedAt: new Date().toISOString(),
                  status: inv.status === 'pending' ? 'under_review' : inv.status
                }
              : inv
          ))

          console.log(`  ✅ Acknowledgement email sent to ${stakeholder.name} (${stakeholder.email})`)

          resolve({
            success: true,
            message: `Acknowledgement email sent to ${stakeholder.name}`,
            stakeholderName: stakeholder.name,
            stakeholderEmail: stakeholder.email
          })
        } catch (error) {
          console.error('❌ Failed to send acknowledgement email:', error)
          reject({
            success: false,
            message: error.message || 'Failed to send acknowledgement email',
            error: error.message
          })
        }
      }, 1000) // Simulate API delay
    })
  }

  // READ: Get all invitations (for admin view)
  const getAllInvitations = () => {
    return judgeInvitations.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
  }

  // READ: Get invitations by competition
  const getInvitationsByCompetition = (competitionId) => {
    return judgeInvitations
      .filter(inv => inv.competitionId === competitionId)
      .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
  }

  // ============ FOLLOW-UP EMAIL SYSTEM ============

  // UPDATE: Update invitation fields (for follow-up tracking)
  const updateInvitationFields = (invitationId, updates) => {
    setJudgeInvitations(prev => prev.map(inv =>
      inv.id === invitationId
        ? { ...inv, ...updates }
        : inv
    ))
  }

  // POST: Check and send follow-up emails (Cron Job Logic)
  const triggerFollowUpEmails = async (daysThreshold = 3, maxFollowUps = 2, testMode = false) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('🚀 TRIGGERING FOLLOW-UP EMAIL CHECK...')
        if (testMode) {
          console.log('  ⚠️ TEST MODE: Ignoring 3-day threshold (using 0 days)')
        }

        // Use 0 days threshold for testing, or specified threshold for production
        const threshold = testMode ? 0 : daysThreshold

        const result = await checkAndSendFollowUps(
          judgeInvitations,
          alumni,
          threshold,
          maxFollowUps,
          (invitationId, updates) => {
            // Update invitation in state
            updateInvitationFields(invitationId, updates)
          }
        )

        console.log('✅ Follow-up email check completed:', result)

        resolve({
          success: true,
          message: `Follow-up email check completed. ${result.sentCount} email(s) sent, ${result.skippedCount} skipped.`,
          ...result
        })
      } catch (error) {
        console.error('❌ Follow-up email check failed:', error)
        reject({
          success: false,
          message: error.message || 'Failed to check and send follow-up emails',
          error: error.message
        })
      }
    })
  }

  // POST: Test endpoint to trigger follow-ups immediately (ignores 3-day rule)
  const testTriggerFollowUps = async () => {
    return await triggerFollowUpEmails(3, 2, true) // testMode = true
  }

  // ============ ALUMNI RECOMMENDED EVENTS ============

  // GET: Get recommended events for alumni based on industry/expertise
  const getRecommendedEventsForAlumni = async (alumniId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('🎯 Fetching recommended events for alumni:', alumniId)
          console.log('  ├─ Available alumni IDs:', mockAlumni.map(a => a.id))
          
          // 1. Fetch the alumni user
          const alumni = mockAlumni.find(a => a.id === alumniId)
          if (!alumni) {
            console.error('  ❌ Alumni not found for ID:', alumniId)
            console.error('  💡 Available alumni IDs:', mockAlumni.map(a => `${a.id} (${a.name})`))
            // Instead of throwing, return fallback events
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            
            const fallbackEvents = events
              .filter(event => {
                const eventDate = new Date(event.date)
                eventDate.setHours(0, 0, 0, 0)
                return eventDate > today
              })
              .map(event => ({
                ...event,
                matchReason: 'fallback',
                isDirectMatch: false
              }))
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 3)
            
            console.log(`  ⚠️ Using ${fallbackEvents.length} fallback events (alumni not found)`)
            
            return resolve({
              success: true,
              events: fallbackEvents,
              hasDirectMatches: false,
              warning: `Alumni ID ${alumniId} not found. Showing general events.`
            })
          }

          const userIndustry = alumni.industry || null
          const userExpertise = alumni.expertise || []
          
          console.log(`  ├─ Industry: ${userIndustry}`)
          console.log(`  └─ Expertise: ${userExpertise.join(', ')}`)

          // 2. Get current date for filtering future events
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          // 3. Query events: future events that match industry or expertise
          const matchingEvents = events
            .filter(event => {
              // Check if event date is in the future
              const eventDate = new Date(event.date)
              eventDate.setHours(0, 0, 0, 0)
              if (eventDate <= today) {
                return false
              }

              // Check if category matches industry
              const categoryMatch = userIndustry && event.category && 
                event.category.toLowerCase() === userIndustry.toLowerCase()

              // Check if tags overlap with expertise
              const eventTags = event.tags || event.related_skills || []
              const expertiseMatch = userExpertise.some(exp => 
                eventTags.some(tag => 
                  tag.toLowerCase().includes(exp.toLowerCase()) || 
                  exp.toLowerCase().includes(tag.toLowerCase())
                )
              )

              return categoryMatch || expertiseMatch
            })
            .map(event => ({
              ...event,
              matchReason: event.category && userIndustry && 
                event.category.toLowerCase() === userIndustry.toLowerCase()
                  ? 'industry'
                  : 'expertise',
              isDirectMatch: true
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date ascending
            .slice(0, 3) // Limit to top 3

          console.log(`  ✅ Found ${matchingEvents.length} matching events`)

          // 4. Fallback: If no matches, get generic "General" or "Networking" events
          let recommendedEvents = matchingEvents
          
          if (recommendedEvents.length === 0) {
            console.log('  ⚠️ No matches found, using fallback events')
            
            const fallbackEvents = events
              .filter(event => {
                const eventDate = new Date(event.date)
                eventDate.setHours(0, 0, 0, 0)
                return eventDate > today && (
                  event.category === 'General' || 
                  event.type === 'Mixer' || 
                  event.type === 'Networking'
                )
              })
              .map(event => ({
                ...event,
                matchReason: 'fallback',
                isDirectMatch: false
              }))
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 3)

            recommendedEvents = fallbackEvents
            console.log(`  ✅ Using ${fallbackEvents.length} fallback events`)
          }

          // 5. If still less than 3, fill with any future events
          if (recommendedEvents.length < 3) {
            const additionalEvents = events
              .filter(event => {
                const eventDate = new Date(event.date)
                eventDate.setHours(0, 0, 0, 0)
                return eventDate > today && 
                  !recommendedEvents.some(rec => rec.id === event.id)
              })
              .map(event => ({
                ...event,
                matchReason: 'fallback',
                isDirectMatch: false
              }))
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 3 - recommendedEvents.length)

            recommendedEvents = [...recommendedEvents, ...additionalEvents]
          }

          console.log(`  📊 Returning ${recommendedEvents.length} recommended events`)

          resolve({
            success: true,
            events: recommendedEvents,
            hasDirectMatches: matchingEvents.length > 0
          })
        } catch (error) {
          console.error('❌ Failed to fetch recommended events:', error)
          console.error('  ├─ Error message:', error.message)
          console.error('  ├─ Error stack:', error.stack)
          console.error('  └─ Alumni ID attempted:', alumniId)
          
          // Return fallback instead of rejecting
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          const fallbackEvents = events
            .filter(event => {
              const eventDate = new Date(event.date)
              eventDate.setHours(0, 0, 0, 0)
              return eventDate > today
            })
            .map(event => ({
              ...event,
              matchReason: 'fallback',
              isDirectMatch: false
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3)
          
          resolve({
            success: true,
            events: fallbackEvents,
            hasDirectMatches: false,
            error: error.message,
            warning: 'Error occurred, showing fallback events'
          })
        }
      }, 500) // Simulate API delay
    })
  }

  // ============ APPRECIATION EMAIL SYSTEM ============

  // UPDATE: Update event fields (for appreciation tracking)
  const updateEventFields = (eventId, updates) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId
        ? { ...event, ...updates }
        : event
    ))
  }

  // UPDATE: Update competition fields (for appreciation tracking)
  const updateCompetitionFields = (competitionId, updates) => {
    setCompetitions(prev => prev.map(comp =>
      comp.id === competitionId
        ? { ...comp, ...updates }
        : comp
    ))
  }

  // POST: Process appreciation emails (Cron Job Logic)
  const triggerAppreciationEmails = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('🚀 TRIGGERING APPRECIATION EMAIL CHECK...')

        const result = await processAppreciationEmails(
          events,
          competitions,
          alumni,
          (eventId, updates) => {
            // Update event in state
            updateEventFields(eventId, updates)
          },
          (competitionId, updates) => {
            // Update competition in state
            updateCompetitionFields(competitionId, updates)
          }
        )

        console.log('✅ Appreciation email check completed:', result)

        resolve({
          success: true,
          message: `Appreciation email check completed. ${result.sentCount} email(s) sent, ${result.skippedCount} skipped.`,
          ...result
        })
      } catch (error) {
        console.error('❌ Appreciation email check failed:', error)
        reject({
          success: false,
          message: error.message || 'Failed to process appreciation emails',
          error: error.message
        })
      }
    })
  }

  // POST: Test endpoint to trigger appreciation emails immediately
  const testTriggerAppreciation = async () => {
    return await triggerAppreciationEmails()
  }

  // Event Feedback (Student feedback on events)
  const [eventFeedback, setEventFeedback] = useState([
    {
      id: 1,
      eventId: 1,
      studentId: 101,
      rating: 5,
      comments: "Great event! Learned a lot about data science.",
      submittedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 2,
      eventId: 2,
      studentId: 102,
      rating: 4,
      comments: "Very informative session on cloud computing.",
      submittedAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 3,
      eventId: 3,
      studentId: 101,
      rating: 5,
      comments: "Excellent networking opportunity!",
      submittedAt: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      id: 4,
      eventId: 1,
      studentId: 103,
      rating: 4,
      comments: "Good content, but could use more hands-on examples.",
      submittedAt: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ])

  // ============ JUDGE FEEDBACK SYSTEM ============

  // POST: Submit judge feedback
  const submitJudgeFeedback = async (feedbackData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('📝 Submitting judge feedback:', feedbackData)
          
          // Validate required fields
          if (!feedbackData.competitionId || !feedbackData.judgeId || !feedbackData.rating) {
            throw new Error('Missing required fields: competitionId, judgeId, or rating')
          }

          // Check for duplicate feedback
          const existingFeedback = judgeFeedback.find(
            fb => fb.competitionId === feedbackData.competitionId && 
                  fb.judgeId === feedbackData.judgeId
          )

          if (existingFeedback) {
            console.log('⚠️ Feedback already exists for this competition')
            return resolve({
              success: false,
              message: 'You have already submitted feedback for this competition',
              feedback: existingFeedback
            })
          }

          // Create feedback object
          const newFeedback = {
            id: judgeFeedback.length + 1,
            competitionId: feedbackData.competitionId,
            judgeId: feedbackData.judgeId,
            rating: feedbackData.rating,
            comments: feedbackData.comments || '',
            promotionalConsent: feedbackData.promotionalConsent || false,
            submittedAt: new Date().toISOString()
          }

          // Save to state
          setJudgeFeedback(prev => [...prev, newFeedback])

          console.log('✅ Feedback submitted successfully:', newFeedback)

          resolve({
            success: true,
            message: 'Feedback submitted successfully',
            feedback: newFeedback
          })
        } catch (error) {
          console.error('❌ Failed to submit feedback:', error)
          reject({
            success: false,
            message: error.message || 'Failed to submit feedback',
            error: error.message
          })
        }
      }, 800) // Simulate API delay
    })
  }

  // READ: Get feedback for a specific competition and judge
  const getJudgeFeedback = (competitionId, judgeId) => {
    return judgeFeedback.find(
      fb => fb.competitionId === competitionId && fb.judgeId === judgeId
    )
  }

  // READ: Get all feedback for a competition (admin view)
  const getCompetitionFeedback = (competitionId) => {
    return judgeFeedback
      .filter(fb => fb.competitionId === competitionId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
  }

  // ============ SYSTEM ANALYTICS ============

  // GET: Get system analytics (aggregated data for admin dashboard)
  const getSystemAnalytics = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          console.log('📊 GET SYSTEM ANALYTICS - Starting...')

          // 1. User Stats: Count of total Students, Alumni, and Faculty
          const totalStudents = allStudents.length
          const totalAlumni = alumni.length
          const totalFaculty = 1 // Assuming current user is faculty/admin
          
          // Count active mentors (alumni who have accepted connections)
          const activeMentors = new Set(
            connectionRequests
              .filter(req => req.status === 'accepted' || req.status === 'confirmed')
              .map(req => req.receiver_id)
          ).size

          // 2. Engagement Stats: Count of total MentorshipSessions and Competitions
          const totalMentorshipSessions = connectionRequests.filter(
            req => req.status === 'confirmed' && req.sessionStatus === 'confirmed'
          ).length
          const totalCompetitions = competitions.length
          const totalEvents = events.length

          // 3. Student Feedback: Calculate average rating from EventFeedback
          const studentRatings = eventFeedback.map(fb => fb.rating)
          const studentAvgRating = studentRatings.length > 0
            ? studentRatings.reduce((sum, rating) => sum + rating, 0) / studentRatings.length
            : 0

          // 4. Employer Feedback: Calculate average rating from JudgeFeedback
          const employerRatings = judgeFeedback.map(fb => fb.rating)
          const employerAvgRating = employerRatings.length > 0
            ? employerRatings.reduce((sum, rating) => sum + rating, 0) / employerRatings.length
            : 0

          // 5. Get recent feedback comments (last 5 from JudgeFeedback)
          const recentFeedback = judgeFeedback
            .filter(fb => fb.comments && fb.comments.trim().length > 0)
            .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
            .slice(0, 5)
            .map(fb => ({
              id: fb.id,
              competitionId: fb.competitionId,
              judgeId: fb.judgeId,
              rating: fb.rating,
              comments: fb.comments,
              submittedAt: fb.submittedAt
            }))

          const analytics = {
            users: {
              totalStudents,
              totalAlumni,
              totalFaculty,
              activeMentors,
              totalUsers: totalStudents + totalAlumni + totalFaculty
            },
            engagement: {
              totalMentorshipSessions,
              totalCompetitions,
              totalEvents,
              totalConnections: connectionRequests.filter(
                req => req.status === 'accepted' || req.status === 'confirmed'
              ).length
            },
            feedback: {
              studentAvg: parseFloat(studentAvgRating.toFixed(2)),
              employerAvg: parseFloat(employerAvgRating.toFixed(2)),
              studentCount: eventFeedback.length,
              employerCount: judgeFeedback.length
            },
            recentFeedback: recentFeedback
          }

          console.log('✅ Analytics calculated:', analytics)

          resolve({
            success: true,
            analytics: analytics
          })
        } catch (error) {
          console.error('❌ Failed to get analytics:', error)
          resolve({
            success: false,
            message: 'Failed to get analytics',
            error: error.message,
            analytics: {
              users: { totalStudents: 0, totalAlumni: 0, totalFaculty: 0, activeMentors: 0, totalUsers: 0 },
              engagement: { totalMentorshipSessions: 0, totalCompetitions: 0, totalEvents: 0, totalConnections: 0 },
              feedback: { studentAvg: 0, employerAvg: 0, studentCount: 0, employerCount: 0 },
              recentFeedback: []
            }
          })
        }
      }, 500)
    })
  }

  // ============ INACTIVE ALUMNI DETECTION ============

  // GET: Get inactive alumni (haven't been active in last 6 months)
  const getInactiveAlumni = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          console.log('🔍 GET INACTIVE ALUMNI - Starting...')

          // Calculate threshold date (6 months ago)
          const thresholdDate = new Date()
          thresholdDate.setMonth(thresholdDate.getMonth() - 6)
          
          console.log('  ├─ Threshold Date (6 months ago):', thresholdDate.toISOString())
          console.log('  ├─ Current Date:', new Date().toISOString())

          // Query alumni with lastActiveAt < threshold
          const inactiveAlumni = alumni
            .filter(user => {
              // Only check alumni role
              if (user.role !== 'alumni') return false
              
              // If no lastActiveAt, consider inactive (very old)
              if (!user.lastActiveAt) {
                console.log(`  ⚠️ ${user.name} has no lastActiveAt - marking as inactive`)
                return true
              }
              
              const lastActive = new Date(user.lastActiveAt)
              const isInactive = lastActive < thresholdDate
              
              if (isInactive) {
                console.log(`  ✅ ${user.name} is inactive (last active: ${user.lastActiveAt})`)
              }
              
              return isInactive
            })
            .map(user => {
              const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : new Date(0)
              const monthsAgo = Math.floor((new Date() - lastActive) / (1000 * 60 * 60 * 24 * 30))
              
              return {
                ...user,
                monthsInactive: monthsAgo,
                lastActiveAt: user.lastActiveAt || null
              }
            })
            .sort((a, b) => {
              // Sort by lastActiveAt ascending (oldest first)
              const dateA = a.lastActiveAt ? new Date(a.lastActiveAt) : new Date(0)
              const dateB = b.lastActiveAt ? new Date(b.lastActiveAt) : new Date(0)
              return dateA - dateB
            })

          console.log(`  └─ Found ${inactiveAlumni.length} inactive alumni`)

          resolve({
            success: true,
            inactiveAlumni: inactiveAlumni,
            totalInactive: inactiveAlumni.length,
            thresholdDate: thresholdDate.toISOString()
          })
        } catch (error) {
          console.error('❌ Failed to get inactive alumni:', error)
          resolve({
            success: false,
            message: 'Failed to get inactive alumni',
            error: error.message,
            inactiveAlumni: [],
            totalInactive: 0
          })
        }
      }, 500)
    })
  }

  // POST: Send re-engagement email to inactive alumni
  const sendReEngagementEmail = async (alumniId) => {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          console.log('📧 SEND RE-ENGAGEMENT EMAIL - Starting...')
          console.log('  └─ Alumni ID:', alumniId)

          const alumniUser = alumni.find(a => a.id === alumniId)
          
          if (!alumniUser) {
            throw new Error('Alumni not found')
          }

          // Import email service
          const { sendReEngagementEmail: sendEmail } = await import('../utils/emailService')
          
          // Send email
          const result = await sendEmail(
            alumniUser.email,
            alumniUser.name
          )

          if (result.success) {
            console.log('✅ Re-engagement email sent successfully')
            resolve({
              success: true,
              message: 'Re-engagement email sent successfully',
              email: result.emailContent
            })
          } else {
            throw new Error(result.message || 'Failed to send email')
          }
        } catch (error) {
          console.error('❌ Failed to send re-engagement email:', error)
          reject({
            success: false,
            message: error.message || 'Failed to send re-engagement email',
            error: error.message
          })
        }
      }, 800)
    })
  }

  // ============ LECTURE & SPEAKER INVITATION SYSTEM ============

  // Helper: Find and invite speakers for a lecture
  const findAndInviteSpeakers = async (lecture) => {
    console.log('🎤 Finding and inviting speakers for lecture:', lecture.title)
    console.log('  ├─ Topic Tags:', lecture.topicTags)
    console.log('  └─ Professor ID:', lecture.professorId)
    
    // 1. Get professor name
    const professor = currentUser.id === lecture.professorId 
      ? currentUser 
      : { name: 'Professor', id: lecture.professorId }
    
    // 2. Query Alumni/Guest Speakers
    const potentialSpeakers = alumni.filter(user => 
      user.role === 'alumni' || user.role === 'GuestSpeaker'
    )
    
    console.log(`  📊 Found ${potentialSpeakers.length} potential speakers`)
    
    // 3. Calculate match scores based on expertise overlap
    const speakersWithScores = potentialSpeakers.map(speaker => {
      const speakerExpertise = Array.isArray(speaker.expertise) 
        ? speaker.expertise 
        : [speaker.expertise].filter(Boolean)
      
      const lectureTags = lecture.topicTags.map(tag => tag.trim().toLowerCase())
      const speakerTags = speakerExpertise.map(exp => exp.trim().toLowerCase())
      
      // Find overlapping tags
      const matches = lectureTags.filter(tag => 
        speakerTags.some(speakerTag => 
          speakerTag.includes(tag) || tag.includes(speakerTag)
        )
      )
      
      // Calculate past speaking count (from events)
      const pastSpeakingCount = events.filter(event => 
        event.speakers && event.speakers.includes(speaker.id)
      ).length
      
      return {
        speaker,
        matchCount: matches.length,
        matchedTags: matches,
        pastSpeakingCount,
        score: matches.length * 10 + (pastSpeakingCount > 0 ? 5 : 0) // Prioritize experienced speakers
      }
    })
    
    // 4. Filter: Only speakers with at least 1 match
    const matchedSpeakers = speakersWithScores.filter(s => s.matchCount > 0)
    
    // 5. Sort: By score (descending), then by pastSpeakingCount
    matchedSpeakers.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return b.pastSpeakingCount - a.pastSpeakingCount
    })
    
    // 6. Limit to top 5
    const topSpeakers = matchedSpeakers.slice(0, 5)
    
    console.log(`  ✅ Found ${topSpeakers.length} matching speakers (top 5)`)
    
    // 7. Create invitations and send emails
    const invitations = []
    
    for (const match of topSpeakers) {
      const speaker = match.speaker
      const invitationId = speakerInvitations.length + invitations.length + 1
      
      const invitation = {
        id: invitationId,
        lectureId: lecture.id,
        speakerId: speaker.id,
        speakerName: speaker.name,
        speakerEmail: speaker.email,
        lectureTitle: lecture.title,
        professorName: professor.name,
        professorId: lecture.professorId,
        topicTags: match.matchedTags.join(', '),
        lectureDate: lecture.date,
        lectureDescription: lecture.description,
        status: 'pending',
        sentAt: new Date().toISOString(),
        matchReason: `Matched based on expertise in ${match.matchedTags.join(', ')}`
      }
      
      invitations.push(invitation)
      
      // Send email
      console.log(`  📧 Sending invitation to ${speaker.name}...`)
      await sendSpeakerInvitationEmail(
        speaker.email,
        speaker.name,
        lecture.title,
        professor.name,
        match.matchedTags.join(', '),
        lecture.date
      )
    }
    
    // 8. Save invitations
    if (invitations.length > 0) {
      setSpeakerInvitations(prev => [...prev, ...invitations])
      console.log(`  ✅ Created ${invitations.length} speaker invitations`)
    }
    
    return {
      success: true,
      invitationsCreated: invitations.length,
      invitedSpeakers: topSpeakers.map(m => ({
        name: m.speaker.name,
        email: m.speaker.email,
        matchedTags: m.matchedTags
      }))
    }
  }

  // CREATE: Create lecture and auto-invite speakers
  const createLecture = async (lectureData) => {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          console.log('📚 Creating lecture:', lectureData.title)
          
          // Generate random 4-digit check-in code
          const generateCheckInCode = () => {
            return Math.floor(1000 + Math.random() * 9000).toString()
          }
          
          // 1. Create the lecture
          const newLecture = {
            id: lectures.length + 1,
            title: lectureData.title,
            description: lectureData.description || '',
            topicTags: lectureData.topicTags || [],
            date: lectureData.date,
            professorId: currentUser.id,
            professorName: currentUser.name,
            status: 'planning',
            resources: [], // Array of { name, url, uploadedAt }
            speakerConfirmed: false, // Default: speaker hasn't confirmed
            rsvpList: [], // Array of user IDs who RSVP'd
            attendanceList: [], // Array of user IDs who checked in
            checkInCode: generateCheckInCode(), // Random 4-digit code
            createdAt: new Date().toISOString()
          }
          
          // 2. Save lecture
          setLectures(prev => [...prev, newLecture])
          console.log('  ✅ Lecture created:', newLecture.id)
          
          // 3. Find and invite speakers (async, don't block)
          const invitationResult = await findAndInviteSpeakers(newLecture)
          
          resolve({
            success: true,
            lecture: newLecture,
            invitationsCreated: invitationResult.invitationsCreated,
            invitedSpeakers: invitationResult.invitedSpeakers
          })
        } catch (error) {
          console.error('❌ Failed to create lecture:', error)
          reject({
            success: false,
            message: 'Failed to create lecture',
            error: error.message
          })
        }
      }, 1000) // Simulate API delay
    })
  }

  // READ: Get lectures for professor
  const getMyLectures = (professorId) => {
    return lectures
      .filter(lecture => lecture.professorId === professorId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  // READ: Get speaker invitations for a lecture
  const getLectureInvitations = (lectureId) => {
    return speakerInvitations
      .filter(inv => inv.lectureId === lectureId)
      .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
  }

  // READ: Get lectures where user is invited as speaker
  const getMySpeakerLectures = (speakerId) => {
    // Find invitations for this speaker (accepted invitations)
    const myInvitations = speakerInvitations.filter(inv => 
      inv.speakerId === speakerId && inv.status === 'accepted'
    )
    
    // Get corresponding lectures
    const lectureIds = myInvitations.map(inv => inv.lectureId)
    return lectures
      .filter(lecture => lectureIds.includes(lecture.id))
      .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date (upcoming first)
  }

  // READ: Get speaker invitations for current user
  const getMySpeakerInvitations = (speakerId) => {
    return speakerInvitations
      .filter(inv => inv.speakerId === speakerId)
      .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
  }

  // UPDATE: Accept speaker invitation
  const acceptSpeakerInvitation = async (invitationId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('✅ Accepting speaker invitation:', invitationId)
          
          const invitation = speakerInvitations.find(inv => inv.id === invitationId)
          if (!invitation) {
            throw new Error('Invitation not found')
          }
          
          // Update invitation status
          setSpeakerInvitations(prev => prev.map(inv =>
            inv.id === invitationId
              ? { ...inv, status: 'accepted', respondedAt: new Date().toISOString() }
              : inv
          ))
          
          console.log(`  ✅ Speaker ${invitation.speakerName} accepted invitation for ${invitation.lectureTitle}`)
          
          resolve({
            success: true,
            message: 'Invitation accepted successfully'
          })
        } catch (error) {
          console.error('❌ Failed to accept speaker invitation:', error)
          reject({
            success: false,
            message: 'Failed to accept invitation',
            error: error.message
          })
        }
      }, 500)
    })
  }

  // UPDATE: Decline speaker invitation
  const declineSpeakerInvitation = async (invitationId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('❌ Declining speaker invitation:', invitationId)
          
          const invitation = speakerInvitations.find(inv => inv.id === invitationId)
          if (!invitation) {
            throw new Error('Invitation not found')
          }
          
          // Update invitation status
          setSpeakerInvitations(prev => prev.map(inv =>
            inv.id === invitationId
              ? { ...inv, status: 'declined', respondedAt: new Date().toISOString() }
              : inv
          ))
          
          console.log(`  ✅ Speaker ${invitation.speakerName} declined invitation for ${invitation.lectureTitle}`)
          
          resolve({
            success: true,
            message: 'Invitation declined'
          })
        } catch (error) {
          console.error('❌ Failed to decline speaker invitation:', error)
          reject({
            success: false,
            message: 'Failed to decline invitation',
            error: error.message
          })
        }
      }, 500)
    })
  }

  // UPDATE: Confirm speaker attendance
  const confirmSpeakerAttendance = async (lectureId, speakerId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('✅ Confirming speaker attendance:', { lectureId, speakerId })
          
          // Update lecture
          setLectures(prev => prev.map(lecture =>
            lecture.id === lectureId
              ? { ...lecture, speakerConfirmed: true }
              : lecture
          ))
          
          // Update invitation status if exists
          setSpeakerInvitations(prev => prev.map(inv =>
            inv.lectureId === lectureId && inv.speakerId === speakerId
              ? { ...inv, status: 'accepted', confirmedAt: new Date().toISOString() }
              : inv
          ))
          
          console.log('  ✅ Speaker attendance confirmed')
          
          resolve({
            success: true,
            message: 'Attendance confirmed successfully'
          })
        } catch (error) {
          console.error('❌ Failed to confirm attendance:', error)
          reject({
            success: false,
            message: 'Failed to confirm attendance',
            error: error.message
          })
        }
      }, 500)
    })
  }

  // CREATE: Upload resource to lecture
  const uploadLectureResource = async (lectureId, resourceData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('📎 Uploading resource to lecture:', lectureId)
          console.log('  ├─ Resource:', resourceData.name)
          console.log('  └─ URL:', resourceData.url)
          
          // Add resource to lecture
          setLectures(prev => prev.map(lecture =>
            lecture.id === lectureId
              ? {
                  ...lecture,
                  resources: [
                    ...(lecture.resources || []),
                    {
                      name: resourceData.name,
                      url: resourceData.url,
                      uploadedAt: new Date().toISOString()
                    }
                  ]
                }
              : lecture
          ))
          
          console.log('  ✅ Resource uploaded successfully')
          
          resolve({
            success: true,
            message: 'Resource uploaded successfully',
            resource: {
              name: resourceData.name,
              url: resourceData.url,
              uploadedAt: new Date().toISOString()
            }
          })
        } catch (error) {
          console.error('❌ Failed to upload resource:', error)
          reject({
            success: false,
            message: 'Failed to upload resource',
            error: error.message
          })
        }
      }, 800)
    })
  }

  // ============ ATTENDANCE TRACKING SYSTEM ============

  // POST: RSVP to lecture
  const rsvpToLecture = async (lectureId, userId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('📝 RSVP to lecture:', { lectureId, userId })
          
          const lecture = lectures.find(l => l.id === lectureId)
          if (!lecture) {
            throw new Error('Lecture not found')
          }
          
          // Check if already RSVP'd
          if (lecture.rsvpList && lecture.rsvpList.includes(userId)) {
            // Remove RSVP
            setLectures(prev => prev.map(l =>
              l.id === lectureId
                ? { ...l, rsvpList: l.rsvpList.filter(id => id !== userId) }
                : l
            ))
            console.log('  ✅ RSVP removed')
            resolve({ success: true, rsvpStatus: 'removed' })
          } else {
            // Add RSVP
            setLectures(prev => prev.map(l =>
              l.id === lectureId
                ? { ...l, rsvpList: [...(l.rsvpList || []), userId] }
                : l
            ))
            console.log('  ✅ RSVP added')
            resolve({ success: true, rsvpStatus: 'added' })
          }
        } catch (error) {
          console.error('❌ Failed to RSVP:', error)
          reject({
            success: false,
            message: 'Failed to RSVP',
            error: error.message
          })
        }
      }, 500)
    })
  }

  // POST: Check-in to lecture
  const checkInToLecture = async (lectureId, userId, code) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('✅ Check-in to lecture:', { lectureId, userId, code })
          
          const lecture = lectures.find(l => l.id === lectureId)
          if (!lecture) {
            throw new Error('Lecture not found')
          }
          
          // Verify check-in code
          if (lecture.checkInCode !== code) {
            console.log('  ❌ Wrong check-in code')
            reject({
              success: false,
              message: 'Wrong Check-in Code',
              error: 'Invalid code'
            })
            return
          }
          
          // Check if already checked in
          if (lecture.attendanceList && lecture.attendanceList.includes(userId)) {
            resolve({ success: true, message: 'Already checked in', alreadyCheckedIn: true })
            return
          }
          
          // Add to attendance list
          setLectures(prev => prev.map(l =>
            l.id === lectureId
              ? { ...l, attendanceList: [...(l.attendanceList || []), userId] }
              : l
          ))
          
          console.log('  ✅ Check-in successful')
          
          // Trigger badge check when user checks in
          triggerBadgeCheck(userId)
          
          resolve({ success: true, message: 'Marked Present ✅' })
        } catch (error) {
          console.error('❌ Failed to check-in:', error)
          reject({
            success: false,
            message: error.message || 'Failed to check-in',
            error: error.message
          })
        }
      }, 500)
    })
  }

  // READ: Get lecture by ID
  const getLectureById = (lectureId) => {
    return lectures.find(l => l.id === lectureId)
  }

  // READ: Get attendance report for lecture
  const getLectureAttendanceReport = (lectureId) => {
    const lecture = lectures.find(l => l.id === lectureId)
    if (!lecture) return null
    
    const rsvpCount = lecture.rsvpList ? lecture.rsvpList.length : 0
    const attendanceCount = lecture.attendanceList ? lecture.attendanceList.length : 0
    const turnoutRate = rsvpCount > 0 ? Math.round((attendanceCount / rsvpCount) * 100) : 0
    
    // Get student names from attendance list
    const attendeeNames = lecture.attendanceList
      ? lecture.attendanceList.map(userId => {
          const student = allStudents.find(s => s.id === userId)
          return student ? student.name : `User ${userId}`
        })
      : []
    
    return {
      lectureId,
      lectureTitle: lecture.title,
      rsvpCount,
      attendanceCount,
      turnoutRate,
      attendeeNames
    }
  }

  // ============ DIRECT MESSAGING SYSTEM ============

  // POST: Send a new message
  const sendMessage = async (receiverId, content) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('💬 SEND MESSAGE - Starting...')
          console.log('  ├─ Sender ID:', currentUser.id)
          console.log('  ├─ Receiver ID:', receiverId)
          console.log('  └─ Content:', content)

          if (!content || !content.trim()) {
            throw new Error('Message content cannot be empty')
          }

          // Check if users have an accepted connection
          const hasConnection = connectionRequests.some(req => 
            (req.sender_id === currentUser.id && req.receiver_id === receiverId && 
             (req.status === 'accepted' || req.status === 'confirmed')) ||
            (req.receiver_id === currentUser.id && req.sender_id === receiverId && 
             (req.status === 'accepted' || req.status === 'confirmed'))
          )

          if (!hasConnection) {
            throw new Error('You can only message users you have an accepted connection with')
          }

          const newMessage = {
            id: Date.now(),
            senderId: currentUser.id,
            receiverId: receiverId,
            content: content.trim(),
            timestamp: new Date().toISOString(),
            isRead: false
          }

          setMessages(prev => [...prev, newMessage])

          console.log('  ✅ Message sent successfully')

          resolve({
            success: true,
            message: newMessage
          })
        } catch (error) {
          console.error('❌ Failed to send message:', error)
          reject({
            success: false,
            message: error.message || 'Failed to send message',
            error: error.message
          })
        }
      }, 500) // Simulate API delay
    })
  }

  // GET: Get conversation history between current user and target user
  const getMessages = async (otherUserId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('📬 GET MESSAGES - Starting...')
          console.log('  ├─ Current User ID:', currentUser.id)
          console.log('  └─ Other User ID:', otherUserId)

          // Get all messages between current user and other user
          const conversation = messages
            .filter(msg => 
              (msg.senderId === currentUser.id && msg.receiverId === otherUserId) ||
              (msg.senderId === otherUserId && msg.receiverId === currentUser.id)
            )
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

          // Mark messages as read if they were sent to current user
          const unreadIds = conversation
            .filter(msg => msg.receiverId === currentUser.id && !msg.isRead)
            .map(msg => msg.id)

          if (unreadIds.length > 0) {
            setMessages(prev => prev.map(msg =>
              unreadIds.includes(msg.id) ? { ...msg, isRead: true } : msg
            ))
          }

          console.log(`  ✅ Found ${conversation.length} messages`)

          resolve({
            success: true,
            messages: conversation
          })
        } catch (error) {
          console.error('❌ Failed to fetch messages:', error)
          reject({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
          })
        }
      }, 300) // Simulate API delay
    })
  }

  // GET: Get list of contacts (people with accepted connections)
  const getMyContacts = () => {
    const contacts = []
    const contactIds = new Set()

    // Find all accepted/confirmed connections
    connectionRequests.forEach(req => {
      if (req.status === 'accepted' || req.status === 'confirmed') {
        let otherUserId = null
        let otherUserName = null
        let otherUserRole = null

        if (req.sender_id === currentUser.id) {
          // Current user is the sender, other user is the receiver (mentor)
          otherUserId = req.receiver_id
          otherUserName = req.mentorName
          otherUserRole = 'mentor'
        } else if (req.receiver_id === currentUser.id) {
          // Current user is the receiver, other user is the sender (student)
          otherUserId = req.sender_id
          otherUserName = req.studentName
          otherUserRole = 'student'
        }

        if (otherUserId && !contactIds.has(otherUserId)) {
          contactIds.add(otherUserId)
          
          // Get last message with this contact
          const lastMessage = messages
            .filter(msg =>
              (msg.senderId === currentUser.id && msg.receiverId === otherUserId) ||
              (msg.senderId === otherUserId && msg.receiverId === currentUser.id)
            )
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]

          // Count unread messages
          const unreadCount = messages.filter(msg =>
            msg.senderId === otherUserId &&
            msg.receiverId === currentUser.id &&
            !msg.isRead
          ).length

          contacts.push({
            userId: otherUserId,
            name: otherUserName,
            role: otherUserRole,
            lastMessage: lastMessage ? {
              content: lastMessage.content,
              timestamp: lastMessage.timestamp,
              isFromMe: lastMessage.senderId === currentUser.id
            } : null,
            unreadCount: unreadCount
          })
        }
      }
    })

    // Sort by last message timestamp (most recent first)
    contacts.sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0
      if (!a.lastMessage) return 1
      if (!b.lastMessage) return -1
      return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
    })

    return contacts
  }

  // ============ GAMIFICATION SYSTEM (BADGES) ============

  // Badge definitions
  const BADGE_DEFINITIONS = {
    'Event Superfan': {
      name: 'Event Superfan',
      icon: '🎉',
      description: 'Attended more than 5 events',
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    'Top Mentor': {
      name: 'Top Mentor',
      icon: '⭐',
      description: 'Has more than 3 accepted mentees',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    },
    'Champion': {
      name: 'Champion',
      icon: '🏆',
      description: 'Won a competition',
      color: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    'First Connection': {
      name: 'First Connection',
      icon: '🤝',
      description: 'Made your first mentor connection',
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    'Active Participant': {
      name: 'Active Participant',
      icon: '📚',
      description: 'Attended 3+ lectures',
      color: 'bg-green-100 text-green-800 border-green-300'
    }
  }

  // Check and award badges for a user
  const checkBadges = (userId) => {
    console.log('🏅 CHECKING BADGES - Starting...')
    console.log('  └─ User ID:', userId)

    const newBadges = []
    const user = userId === currentUser.id ? currentUser : allStudents.find(s => s.id === userId) || alumni.find(a => a.id === userId)
    
    if (!user) {
      console.log('  ⚠️ User not found')
      return []
    }

    const existingBadgeNames = (user.badges || []).map(b => b.name)
    console.log('  ├─ Existing badges:', existingBadgeNames)

    // 1. Check "Event Superfan" badge (> 5 events attended)
    if (!existingBadgeNames.includes('Event Superfan')) {
      const attendedEvents = lectures.filter(lecture => 
        lecture.attendanceList && lecture.attendanceList.includes(userId)
      ).length

      console.log(`  ├─ Events attended: ${attendedEvents}`)
      
      if (attendedEvents > 5) {
        newBadges.push({
          name: 'Event Superfan',
          icon: BADGE_DEFINITIONS['Event Superfan'].icon,
          earnedAt: new Date().toISOString()
        })
        console.log('  ✅ Awarded: Event Superfan')
      }
    }

    // 2. Check "Top Mentor" badge (> 3 accepted mentees)
    if (user.role === 'mentor' || user.role === 'alumni') {
      if (!existingBadgeNames.includes('Top Mentor')) {
        // Find mentor ID (mentors have IDs 1-4, alumni have IDs 201-204)
        const mentorId = user.role === 'alumni' ? userId - 200 : userId
        
        const acceptedMentees = connectionRequests.filter(req =>
          req.receiver_id === mentorId && 
          (req.status === 'accepted' || req.status === 'confirmed')
        ).length

        console.log(`  ├─ Accepted mentees: ${acceptedMentees}`)

        if (acceptedMentees > 3) {
          newBadges.push({
            name: 'Top Mentor',
            icon: BADGE_DEFINITIONS['Top Mentor'].icon,
            earnedAt: new Date().toISOString()
          })
          console.log('  ✅ Awarded: Top Mentor')
        }
      }
    }

    // 3. Check "Champion" badge (won a competition)
    if (user.role === 'student') {
      if (!existingBadgeNames.includes('Champion')) {
        // Find teams where user is a member and has highest score
        const userTeams = teams.filter(team => 
          team.members && team.members.some(member => 
            member.toLowerCase().includes(user.name.toLowerCase())
          )
        )

        if (userTeams.length > 0) {
          // Get highest scoring team
          const sortedTeams = [...teams].sort((a, b) => (b.score || 0) - (a.score || 0))
          const winningTeam = sortedTeams[0]
          
          const isWinner = userTeams.some(team => 
            team.id === winningTeam.id && (winningTeam.score || 0) > 0
          )

          console.log(`  ├─ Is competition winner: ${isWinner}`)

          if (isWinner) {
            newBadges.push({
              name: 'Champion',
              icon: BADGE_DEFINITIONS['Champion'].icon,
              earnedAt: new Date().toISOString()
            })
            console.log('  ✅ Awarded: Champion')
          }
        }
      }
    }

    // 4. Check "First Connection" badge (first accepted connection)
    if (!existingBadgeNames.includes('First Connection')) {
      const hasConnection = connectionRequests.some(req =>
        (req.sender_id === userId && (req.status === 'accepted' || req.status === 'confirmed')) ||
        (req.receiver_id === userId && (req.status === 'accepted' || req.status === 'confirmed'))
      )

      if (hasConnection) {
        newBadges.push({
          name: 'First Connection',
          icon: BADGE_DEFINITIONS['First Connection'].icon,
          earnedAt: new Date().toISOString()
        })
        console.log('  ✅ Awarded: First Connection')
      }
    }

    // 5. Check "Active Participant" badge (attended 3+ lectures)
    if (!existingBadgeNames.includes('Active Participant')) {
      const attendedLectures = lectures.filter(lecture =>
        lecture.attendanceList && lecture.attendanceList.includes(userId)
      ).length

      if (attendedLectures >= 3) {
        newBadges.push({
          name: 'Active Participant',
          icon: BADGE_DEFINITIONS['Active Participant'].icon,
          earnedAt: new Date().toISOString()
        })
        console.log('  ✅ Awarded: Active Participant')
      }
    }

    // Update user badges if new ones were earned
    if (newBadges.length > 0) {
      const updatedBadges = [...(user.badges || []), ...newBadges]
      
      if (userId === currentUser.id) {
        setCurrentUser(prev => ({
          ...prev,
          badges: updatedBadges
        }))
      }
      
      console.log(`  🎉 Total new badges: ${newBadges.length}`)
      console.log(`  📊 Total badges: ${updatedBadges.length}`)
    } else {
      console.log('  ℹ️ No new badges earned')
    }

    return newBadges
  }

  // Auto-check badges when user actions occur
  const triggerBadgeCheck = (userId) => {
    setTimeout(() => {
      const newBadges = checkBadges(userId)
      if (newBadges.length > 0 && userId === currentUser.id) {
        // Could trigger a notification here
        console.log('🎉 New badges earned!', newBadges)
      }
    }, 500)
  }

  // ============ GLOBAL SEARCH SYSTEM ============

  // GET: Global search across Users, Events, and Competitions
  const globalSearch = async (query) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('🔍 GLOBAL SEARCH - Starting...')
          console.log('  └─ Query:', query)

          if (!query || !query.trim()) {
            resolve({
              success: true,
              results: {
                users: [],
                events: [],
                competitions: []
              }
            })
            return
          }

          const searchTerm = query.toLowerCase().trim()

          // 1. Search Users (name OR skills/interests match)
          const matchingUsers = []
          
          // Search in students
          allStudents.forEach(student => {
            const nameMatch = student.name.toLowerCase().includes(searchTerm)
            const skillsMatch = student.interests?.some(skill => 
              skill.toLowerCase().includes(searchTerm)
            )
            
            if (nameMatch || skillsMatch) {
              matchingUsers.push({
                id: student.id,
                name: student.name,
                email: student.email,
                major: student.major,
                role: 'student',
                type: 'user',
                matchReason: nameMatch ? 'name' : 'skills'
              })
            }
          })

          // Search in alumni
          alumni.forEach(alum => {
            const nameMatch = alum.name.toLowerCase().includes(searchTerm)
            const expertiseMatch = alum.expertise?.some(exp => 
              exp.toLowerCase().includes(searchTerm)
            )
            const industryMatch = alum.industry?.toLowerCase().includes(searchTerm)
            
            if (nameMatch || expertiseMatch || industryMatch) {
              matchingUsers.push({
                id: alum.id,
                name: alum.name,
                email: alum.email,
                role: 'alumni',
                type: 'user',
                company: alum.company,
                expertise: alum.expertise,
                matchReason: nameMatch ? 'name' : (expertiseMatch ? 'expertise' : 'industry')
              })
            }
          })

          // Search in mentors
          mentors.forEach(mentor => {
            const nameMatch = mentor.name.toLowerCase().includes(searchTerm)
            const skillsMatch = mentor.skills?.some(skill => 
              skill.toLowerCase().includes(searchTerm)
            )
            const companyMatch = mentor.company?.toLowerCase().includes(searchTerm)
            
            if (nameMatch || skillsMatch || companyMatch) {
              matchingUsers.push({
                id: mentor.id,
                name: mentor.name,
                email: mentor.email || `${mentor.name.toLowerCase().replace(/\s+/g, '.')}@${mentor.company?.toLowerCase().replace(/\s+/g, '') || 'example'}.com`,
                role: 'mentor',
                type: 'user',
                company: mentor.company,
                skills: mentor.skills,
                matchReason: nameMatch ? 'name' : (skillsMatch ? 'skills' : 'company')
              })
            }
          })

          console.log(`  ✅ Found ${matchingUsers.length} matching users`)

          // 2. Search Events (title OR tags/related_skills match)
          const matchingEvents = events.filter(event => {
            const titleMatch = event.title?.toLowerCase().includes(searchTerm)
            const tagsMatch = event.tags?.some(tag => 
              tag.toLowerCase().includes(searchTerm)
            )
            const skillsMatch = event.related_skills?.some(skill => 
              skill.toLowerCase().includes(searchTerm)
            )
            const descriptionMatch = event.description?.toLowerCase().includes(searchTerm)
            
            return titleMatch || tagsMatch || skillsMatch || descriptionMatch
          }).map(event => ({
            ...event,
            type: 'event'
          }))

          console.log(`  ✅ Found ${matchingEvents.length} matching events`)

          // 3. Search Competitions (title OR description OR requiredExpertise match)
          const matchingCompetitions = competitions.filter(comp => {
            const titleMatch = comp.name?.toLowerCase().includes(searchTerm)
            const descriptionMatch = comp.description?.toLowerCase().includes(searchTerm)
            const expertiseMatch = comp.requiredExpertise?.some(exp => 
              exp.toLowerCase().includes(searchTerm)
            )
            
            return titleMatch || descriptionMatch || expertiseMatch
          }).map(comp => ({
            ...comp,
            type: 'competition'
          }))

          console.log(`  ✅ Found ${matchingCompetitions.length} matching competitions`)

          const results = {
            users: matchingUsers,
            events: matchingEvents,
            competitions: matchingCompetitions
          }

          console.log(`  📊 Total results: ${matchingUsers.length + matchingEvents.length + matchingCompetitions.length}`)

          resolve({
            success: true,
            results: results,
            query: query,
            totalResults: matchingUsers.length + matchingEvents.length + matchingCompetitions.length
          })
        } catch (error) {
          console.error('❌ Search failed:', error)
          reject({
            success: false,
            message: 'Search failed',
            error: error.message
          })
        }
      }, 500) // Simulate API delay
    })
  }

  // ============ ALUMNI ENGAGEMENT HISTORY ============

  // GET: Get aggregated engagement history for alumni
  const getAlumniEngagementHistory = async (alumniId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('📊 Fetching engagement history for alumni:', alumniId)
          
          const history = []
          
          // 1. Query MentorshipRequests: Find accepted requests where mentorId == alumniId
          // Note: Mentor IDs (1,2,3,4) map to Alumni IDs (201,202,203,204) - add 200 offset
          const mentorId = alumniId - 200 // Convert alumni ID to mentor ID
          const mentorshipActivities = connectionRequests
            .filter(req => req.receiver_id === mentorId && req.status === 'accepted')
            .map(req => ({
              id: `mentoring-${req.id}`,
              type: 'Mentoring',
              title: `Mentored ${req.studentName}`,
              description: req.message || `Mentored ${req.studentName} (${req.studentMajor})`,
              date: req.updated_at || req.created_at,
              status: 'completed',
              details: {
                studentName: req.studentName,
                studentEmail: req.studentEmail,
                studentMajor: req.studentMajor,
                message: req.message
              }
            }))
          
          console.log(`  ✅ Found ${mentorshipActivities.length} mentoring activities`)
          
          // 2. Query Competitions: Find competitions where judges array contains alumniId
          const judgingActivities = competitions
            .filter(comp => comp.judges && comp.judges.includes(alumniId))
            .map(comp => ({
              id: `judging-${comp.id}`,
              type: 'Judging',
              title: `Judged ${comp.name}`,
              description: `Served as a judge for ${comp.name}`,
              date: comp.createdAt || comp.deadline,
              status: 'completed',
              details: {
                competitionName: comp.name,
                competitionId: comp.id,
                deadline: comp.deadline
              }
            }))
          
          console.log(`  ✅ Found ${judgingActivities.length} judging activities`)
          
          // 3. Query Events: Find events where speakers array contains alumniId
          const speakingActivities = events
            .filter(event => event.speakers && event.speakers.includes(alumniId))
            .map(event => ({
              id: `speaking-${event.id}`,
              type: 'Speaking',
              title: `Spoke at ${event.title}`,
              description: `Delivered a presentation at ${event.title} (${event.type})`,
              date: event.date || event.createdAt,
              status: 'completed',
              details: {
                eventTitle: event.title,
                eventType: event.type,
                location: event.location,
                date: event.date,
                time: event.time
              }
            }))
          
          console.log(`  ✅ Found ${speakingActivities.length} speaking activities`)
          
          // 4. Combine all results
          const allActivities = [
            ...mentorshipActivities,
            ...judgingActivities,
            ...speakingActivities
          ]
          
          // 5. Sort by date (most recent first)
          allActivities.sort((a, b) => new Date(b.date) - new Date(a.date))
          
          console.log(`  📊 Total activities: ${allActivities.length}`)
          
          resolve({
            success: true,
            activities: allActivities,
            counts: {
              mentoring: mentorshipActivities.length,
              judging: judgingActivities.length,
              speaking: speakingActivities.length,
              total: allActivities.length
            }
          })
        } catch (error) {
          console.error('❌ Failed to fetch engagement history:', error)
          reject({
            success: false,
            message: 'Failed to fetch engagement history',
            error: error.message
          })
        }
      }, 500) // Simulate API delay
    })
  }

  const value = {
    // State
    currentUser,
    teams,
    events,
    mentors,
    studentSkills,
    resumeParsed,
    connectionRequests,
    menteeNotes,
    notifications,
    kpis,
    allStudents,
    
    // Actions - General
    setCurrentUser,
    updateProfile,              // UPDATE: Update user profile
    updatePreferences,          // PUT: Update user preferences
    submitTeamFile,
    scoreTeam,
    toggleEventRSVP,
    updateStudentSkills,
    getRecommendedMentorsForStudent,
    setKpis,
    
    // Actions - Connection Requests (Full CRUD)
    sendConnectionRequest,          // CREATE: Student sends request
    getMyConnectionRequests,        // READ: Student's sent requests
    getReceivedRequests,            // READ: Mentor's received requests
    getPendingRequestsForMentor,    // READ: Mentor's pending requests
    updateRequestStatus,            // UPDATE: Mentor accepts/declines
    confirmSession,                 // PUT: Confirm session and schedule meeting
    hasRequestedMentor,             // HELPER: Check if already requested
    getRequestStatus,               // HELPER: Get status for specific mentor
    
    // Actions - Mentee Tracker System
    getMentorDashboardData,         // GET: Get mentor dashboard data (mentees + history + notes)
    saveMenteeNote,                // POST: Save a new mentee note
    
    // Actions - Event & Notification System
    createEvent,                    // CREATE: Create event with auto-matching
    getMyNotifications,             // READ: Get user's notifications
    getUnreadCount,                 // READ: Get unread notification count
    markNotificationAsRead,         // UPDATE: Mark single notification as read
    markAllNotificationsAsRead,     // UPDATE: Mark all as read
    
    // Actions - Judge Invitation System
    judgeInvitations,               // State: All judge invitations
    alumni,                         // State: Alumni/Stakeholders database
    competitions,                   // State: All competitions
    createCompetition,              // CREATE: Create competition with auto-invitations
    getMyInvitations,               // READ: Get invitations for stakeholder
    getPendingInvitations,          // READ: Get pending invitations
    getAllInvitations,              // READ: Get all invitations (admin view)
    getInvitationsByCompetition,   // READ: Get invitations by competition
    acceptInvitation,              // UPDATE: Accept invitation
    declineInvitation,             // UPDATE: Decline invitation
    sendAcknowledgement,           // POST: Send acknowledgement email
    triggerFollowUpEmails,         // POST: Check and send follow-up emails (cron job)
    testTriggerFollowUps,          // POST: Test endpoint to trigger follow-ups immediately
    getAlumniEngagementHistory,     // GET: Get aggregated engagement history for alumni
    getRecommendedEventsForAlumni,  // GET: Get recommended events for alumni
    triggerAppreciationEmails,      // POST: Process appreciation emails (cron job)
    testTriggerAppreciation,        // POST: Test endpoint to trigger appreciation emails immediately
    submitJudgeFeedback,            // POST: Submit judge feedback
    getJudgeFeedback,               // READ: Get feedback for competition and judge
    getCompetitionFeedback,         // READ: Get all feedback for a competition (admin)
    
    // Actions - System Analytics
    getSystemAnalytics,             // GET: Get system analytics (aggregated data)
    eventFeedback,                  // State: Student feedback on events
    judgeFeedback,                  // State: Judge feedback on competitions
    
    // Actions - Inactive Alumni Detection
    getInactiveAlumni,              // GET: Get inactive alumni (6 months threshold)
    sendReEngagementEmail,          // POST: Send re-engagement email to inactive alumni
    
    // Actions - Direct Messaging System
    messages,                       // State: All messages
    sendMessage,                    // POST: Send a new message
    getMessages,                    // GET: Get conversation history with a user
    getMyContacts,                   // GET: Get list of contacts (accepted connections)
    
    // Actions - Gamification System
    checkBadges,                    // POST: Check and award badges for a user
    triggerBadgeCheck,              // Helper: Auto-check badges after actions
    BADGE_DEFINITIONS,              // Badge definitions and styling
    
    // Actions - Global Search System
    globalSearch,                   // GET: Global search across Users, Events, Competitions
    
    // Actions - Lecture & Speaker Invitation System
    lectures,                       // State: All lectures
    speakerInvitations,             // State: All speaker invitations
    createLecture,                   // CREATE: Create lecture with auto-invitations
    getMyLectures,                  // READ: Get lectures for professor
    getLectureInvitations,          // READ: Get invitations for a lecture
    getMySpeakerLectures,           // READ: Get lectures where user is speaker
    getMySpeakerInvitations,        // READ: Get speaker invitations for user
    acceptSpeakerInvitation,        // UPDATE: Accept speaker invitation
    declineSpeakerInvitation,       // UPDATE: Decline speaker invitation
    confirmSpeakerAttendance,        // UPDATE: Confirm speaker attendance
    uploadLectureResource,           // CREATE: Upload resource to lecture
    rsvpToLecture,                   // POST: RSVP to lecture
    checkInToLecture,                // POST: Check-in to lecture
    getLectureById,                  // READ: Get lecture by ID
    getLectureAttendanceReport,     // READ: Get attendance report for lecture
    
    // Legacy methods (backward compatibility)
    handleMentorshipRequest,
    getMentorRequests
  }

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  )
}

