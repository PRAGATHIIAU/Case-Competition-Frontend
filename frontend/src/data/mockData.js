// Mock data for the application

export const mockEvents = [
  {
    id: 1,
    title: "Industry Mixer",
    description: "Connect with professionals from top companies in Texas. Great opportunity for networking and learning about industry trends.",
    date: "2024-01-15",
    time: "6:00 PM",
    location: "Mays Business School",
    type: "Mixer",
    category: "General", // Category for industry matching
    tags: ["Business Strategy", "Consulting", "Networking"], // Tags for expertise matching (alias for related_skills)
    related_skills: ["Business Strategy", "Consulting", "Networking"],
    rsvp_link: "/events/1/rsvp",
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
    category: "Technology", // Category for industry matching
    tags: ["Python", "SQL", "Data Analytics"], // Tags for expertise matching
    related_skills: ["Python", "SQL", "Data Analytics"],
    rsvp_link: "/events/2/rsvp",
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
    category: "General", // Category for industry matching
    tags: ["Networking", "Communication"], // Tags for expertise matching
    related_skills: ["Networking", "Communication"],
    rsvp_link: "/events/3/rsvp",
    registered: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 4,
    title: "FinTech Innovation Summit",
    description: "Explore the latest trends in financial technology, blockchain, and digital banking.",
    date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], // Future date
    time: "9:00 AM",
    location: "Virtual",
    type: "Summit",
    category: "Finance", // Matches Emily Rodriguez's industry
    tags: ["Finance", "FinTech", "Blockchain", "Business Strategy"], // Matches expertise
    related_skills: ["Finance", "FinTech", "Blockchain"],
    rsvp_link: "/events/4/rsvp",
    registered: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    title: "AI & Machine Learning Conference",
    description: "Deep dive into AI, ML, and data science applications in industry.",
    date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0], // Future date
    time: "10:00 AM",
    location: "Mays Business School",
    type: "Conference",
    category: "Technology", // Matches Michael Chen's industry
    tags: ["AI", "Data Analytics", "ML", "Python"], // Matches Sarah Johnson's expertise
    related_skills: ["AI", "ML", "Data Analytics", "Python"],
    rsvp_link: "/events/5/rsvp",
    registered: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    title: "Cybersecurity Roundtable",
    description: "Expert panel discussion on cybersecurity trends and best practices.",
    date: new Date(Date.now() + 86400000 * 21).toISOString().split('T')[0], // Future date
    time: "3:00 PM",
    location: "Virtual",
    type: "Roundtable",
    category: "Technology",
    tags: ["Cyber Security", "Network Security", "AI"], // Matches Sarah Johnson and David Park's expertise
    related_skills: ["Cyber Security", "Network Security"],
    rsvp_link: "/events/6/rsvp",
    registered: false,
    createdAt: new Date().toISOString()
  }
];

export const mockMentors = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Data Scientist",
    company: "ExxonMobil",
    expertise: "Cyber Security at Exxon",
    matchScore: 98,
    skills: ["Python", "Data Analytics", "ML"],
    bio: "10+ years in data science, specializing in cybersecurity applications.",
    linkedin_url: "https://www.linkedin.com/in/sarahjohnson"
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Tech Lead",
    company: "Microsoft",
    expertise: "Cloud Infrastructure",
    matchScore: 85,
    skills: ["Azure", "Python", "DevOps"],
    bio: "Leading cloud transformation initiatives.",
    linkedin_url: "https://www.linkedin.com/in/michaelchen"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "VP of Analytics",
    company: "Deloitte",
    expertise: "Consulting & Strategy",
    matchScore: 92,
    skills: ["SQL", "Business Strategy", "Consulting"],
    bio: "Helping businesses leverage data for strategic decisions.",
    linkedin_url: "https://www.linkedin.com/in/emilyrodriguez"
  },
  {
    id: 4,
    name: "David Park",
    title: "Cybersecurity Architect",
    company: "Lockheed Martin",
    expertise: "Cyber Security",
    matchScore: 95,
    skills: ["Cyber Security", "Python", "Network Security"],
    bio: "Expert in enterprise security solutions.",
    linkedin_url: "https://www.linkedin.com/in/davidpark"
  }
];

export const mockCompetition = {
  id: 1,
  name: "Case Competition 2024",
  deadline: "2024-01-25T23:59:59",
  teamName: "Data Warriors",
  submissionStatus: "Submitted",
  submittedAt: "2024-01-24T21:30:00",
  requiredExpertise: ["AI", "Finance", "Healthcare", "Data Analytics"], // New field
  judges: [], // Will be populated when invitations are accepted
  deliverables: [
    { name: "Presentation.pptx", uploaded: true, uploadDate: "2024-01-24T21:30:00" },
    { name: "Report.pdf", uploaded: true, uploadDate: "2024-01-24T21:30:00" }
  ]
};

// Mock Competitions (for admin to create)
export const mockCompetitions = [
  {
    id: 1,
    name: "Case Competition 2024",
    deadline: "2024-01-25T23:59:59",
    requiredExpertise: ["AI", "Finance", "Healthcare", "Data Analytics"],
    judges: [201], // Sarah Johnson accepted invitation
    judgeThankYouSent: false, // Track if thank-you emails were sent
    createdAt: "2024-01-15T10:00:00"
  },
  {
    id: 2,
    name: "FinTech Innovation Challenge",
    deadline: "2024-02-15T23:59:59",
    requiredExpertise: ["Finance", "FinTech", "Blockchain", "Business Strategy"],
    judges: [],
    createdAt: "2024-01-20T10:00:00"
  },
  {
    id: 3,
    name: "Cybersecurity Hackathon",
    deadline: "2024-03-01T23:59:59",
    requiredExpertise: ["Cyber Security", "Network Security", "Python", "DevOps"],
    judges: [],
    createdAt: "2024-01-22T10:00:00"
  }
];

export const mockNotifications = [
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
  },
  {
    id: 3,
    userId: 101,
    type: "match",
    message: "New Mentor Match found: Sarah Johnson",
    link: "/student?tab=mentors",
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 4,
    userId: 101,
    type: "event",
    message: "You registered for Data Analytics Workshop",
    link: "/events/2/rsvp",
    isRead: true,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

export const mockTeams = [
  { id: 1, name: "Data Warriors", score: 92.5, members: ["Alice", "Bob", "Charlie"] },
  { id: 2, name: "Tech Titans", score: 88.3, members: ["Diana", "Eve"] },
  { id: 3, name: "Innovation Squad", score: 85.7, members: ["Frank", "Grace", "Henry"] },
  { id: 4, name: "Analytics Masters", score: 82.1, members: ["Ivy", "Jack"] },
  { id: 5, name: "Future Leaders", score: 79.5, members: ["Kevin", "Luna", "Mike"] }
];

export const mockEngagementData = [
  { month: "Sep", engagement: 65 },
  { month: "Oct", engagement: 72 },
  { month: "Nov", engagement: 78 },
  { month: "Dec", engagement: 85 },
  { month: "Jan", engagement: 92 }
];

// Alternative low engagement data for testing warnings (uncomment to test)
// export const mockEngagementData = [
//   { month: "Sep", engagement: 65 },
//   { month: "Oct", engagement: 58 },
//   { month: "Nov", engagement: 52 },
//   { month: "Dec", engagement: 48 },
//   { month: "Jan", engagement: 45 }
// ];

export const mockIndustryInterest = [
  { name: "Consulting", value: 35, color: "#500000" },
  { name: "Cyber Security", value: 28, color: "#700000" },
  { name: "Data Analytics", value: 22, color: "#900000" },
  { name: "Software Development", value: 15, color: "#B00000" }
];

export const mockAdminStats = {
  activeStudents: 1247,
  inactiveStudents: 0,
  studentEngagementPercent: 72,
  alumniEngagement: 68,
  partnerNPS: 84,
  activeEvents: 12
};

export const mockMentorshipRequests = [
  {
    id: 1,
    studentName: "John Doe",
    studentEmail: "john.doe@tamu.edu",
    studentYear: "Junior",
    studentMajor: "Computer Information Systems",
    studentSkills: ["Python", "SQL", "Data Analytics"],
    requestMessage: "I'm interested in learning more about data science careers and would love guidance on building my portfolio.",
    requestedAt: "2024-01-20T10:30:00",
    status: "pending"
  },
  {
    id: 2,
    studentName: "Sarah Chen",
    studentEmail: "sarah.chen@tamu.edu",
    studentYear: "Senior",
    studentMajor: "Business Analytics",
    studentSkills: ["Python", "Tableau", "Machine Learning"],
    requestMessage: "Looking for mentorship in transitioning from academia to industry, specifically in consulting roles.",
    requestedAt: "2024-01-19T14:20:00",
    status: "pending"
  },
  {
    id: 3,
    studentName: "Michael Rodriguez",
    studentEmail: "michael.r@tamu.edu",
    studentYear: "Sophomore",
    studentMajor: "Information Systems",
    studentSkills: ["Java", "Web Development", "Database Design"],
    requestMessage: "I'd appreciate guidance on cybersecurity career paths and certifications to pursue.",
    requestedAt: "2024-01-18T09:15:00",
    status: "pending"
  }
];

export const mockLiveFeed = [
  { id: 1, action: "Team 7 submitted a file", timestamp: new Date(Date.now() - 300000), type: "submission" },
  { id: 2, action: "ExxonMobil signed up as a sponsor", timestamp: new Date(Date.now() - 600000), type: "sponsor" },
  { id: 3, action: "Sarah Johnson accepted mentorship request", timestamp: new Date(Date.now() - 900000), type: "mentorship" },
  { id: 4, action: "Data Warriors updated their submission", timestamp: new Date(Date.now() - 1200000), type: "submission" },
  { id: 5, action: "Microsoft registered for Industry Mixer", timestamp: new Date(Date.now() - 1800000), type: "event" },
  { id: 6, action: "Tech Titans scored 88.3 points", timestamp: new Date(Date.now() - 2400000), type: "scoring" }
];

export const mockAlumniVsStudent = [
  { name: "Alumni Participation", value: 42, color: "#500000" },
  { name: "Student Participation", value: 58, color: "#700000" }
];

// Mock Students Database (for notification matching)
export const mockStudents = [
  {
    id: 101,
    name: "John Doe",
    email: "john.doe@tamu.edu",
    major: "Computer Science",
    year: "Junior",
    interests: ["Python", "SQL", "Data Analytics", "Machine Learning", "Cyber Security"]
  },
  {
    id: 102,
    name: "Sarah Chen",
    email: "sarah.chen@tamu.edu",
    major: "Business Analytics",
    year: "Senior",
    interests: ["Python", "Tableau", "Business Strategy", "Data Analytics"]
  },
  {
    id: 103,
    name: "Michael Rodriguez",
    email: "michael.r@tamu.edu",
    major: "Information Systems",
    year: "Sophomore",
    interests: ["Java", "Web Development", "Database Design", "SQL"]
  },
  {
    id: 104,
    name: "Emily Watson",
    email: "emily.w@tamu.edu",
    major: "Computer Science",
    year: "Freshman",
    interests: ["Python", "ML", "Azure", "DevOps"]
  },
  {
    id: 105,
    name: "David Kim",
    email: "david.k@tamu.edu",
    major: "MIS",
    year: "Senior",
    interests: ["Consulting", "Business Strategy", "Networking"]
  }
];

// Mock Projects (Submitted by Students)
export const mockProjects = [
  {
    id: 1,
    teamName: "Team Alpha",
    projectTitle: "AI Drone",
    submittedAt: "2024-01-24T10:30:00",
    files: [
      { name: "slide.pptx", link: "#", type: "pptx" },
      { name: "code.zip", link: "#", type: "zip" }
    ]
  },
  {
    id: 2,
    teamName: "Team Beta",
    projectTitle: "Health App",
    submittedAt: "2024-01-24T14:20:00",
    files: [
      { name: "pitch.pdf", link: "#", type: "pdf" },
      { name: "presentation.pptx", link: "#", type: "pptx" },
      { name: "source_code.zip", link: "#", type: "zip" }
    ]
  },
  {
    id: 3,
    teamName: "Data Warriors",
    projectTitle: "Predictive Analytics Platform",
    submittedAt: "2024-01-23T16:45:00",
    files: [
      { name: "FinalPresentation.pptx", link: "#", type: "pptx" },
      { name: "Report.pdf", link: "#", type: "pdf" },
      { name: "Codebase.zip", link: "#", type: "zip" }
    ]
  },
  {
    id: 4,
    teamName: "Tech Titans",
    projectTitle: "Smart City Solution",
    submittedAt: "2024-01-24T09:15:00",
    files: [
      { name: "Demo.pptx", link: "#", type: "pptx" },
      { name: "Documentation.docx", link: "#", type: "docx" }
    ]
  },
  {
    id: 5,
    teamName: "Innovation Squad",
    projectTitle: "Blockchain Voting System",
    submittedAt: "2024-01-24T11:00:00",
    files: [
      { name: "Presentation.pptx", link: "#", type: "pptx" },
      { name: "TechnicalSpecs.pdf", link: "#", type: "pdf" },
      { name: "Implementation.zip", link: "#", type: "zip" }
    ]
  },
  {
    id: 6,
    teamName: "Analytics Masters",
    projectTitle: "Customer Behavior Analysis",
    submittedAt: "2024-01-23T20:30:00",
    files: [
      { name: "AnalysisReport.pdf", link: "#", type: "pdf" },
      { name: "Slides.pptx", link: "#", type: "pptx" }
    ]
  }
];

// Mock Alumni/Stakeholders (for judge invitations)
export const mockAlumni = [
  {
    id: 201,
    name: "Sarah Johnson",
    email: "sarah.johnson@exxonmobil.com",
    role: "alumni", // 'alumni' or 'mentor'
    title: "Senior Data Scientist",
    company: "ExxonMobil",
    industry: "Energy", // Industry field for event matching
    expertise: ["AI", "Data Analytics", "ML", "Cyber Security"], // Array of expertise
    skills: ["Python", "Data Analytics", "ML"],
    bio: "10+ years in data science, specializing in cybersecurity applications.",
    lastActiveAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago (Active)
  },
  {
    id: 202,
    name: "Michael Chen",
    email: "michael.chen@microsoft.com",
    role: "alumni",
    title: "Tech Lead",
    company: "Microsoft",
    industry: "Technology", // Industry field
    expertise: ["Cloud Infrastructure", "DevOps", "Azure", "Python"],
    skills: ["Azure", "Python", "DevOps"],
    bio: "Leading cloud transformation initiatives.",
    lastActiveAt: new Date(Date.now() - 86400000 * 10).toISOString() // 10 days ago (Active)
  },
  {
    id: 203,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@deloitte.com",
    role: "alumni",
    title: "VP of Analytics",
    company: "Deloitte",
    industry: "Finance", // Industry field
    expertise: ["Finance", "Business Strategy", "Consulting", "SQL"],
    skills: ["SQL", "Business Strategy", "Consulting"],
    bio: "Helping businesses leverage data for strategic decisions.",
    lastActiveAt: new Date(Date.now() - 86400000 * 200).toISOString() // ~7 months ago (Inactive)
  },
  {
    id: 204,
    name: "David Park",
    email: "david.park@lockheed.com",
    role: "alumni",
    title: "Cybersecurity Architect",
    company: "Lockheed Martin",
    expertise: ["Cyber Security", "Network Security", "Python", "DevOps"],
    skills: ["Cyber Security", "Python", "Network Security"],
    bio: "Expert in enterprise security solutions.",
    lastActiveAt: new Date(Date.now() - 86400000 * 250).toISOString() // ~8 months ago (Inactive)
  },
  {
    id: 205,
    name: "Jennifer Lee",
    email: "jennifer.lee@jpmorgan.com",
    role: "alumni",
    title: "VP of FinTech",
    company: "JPMorgan Chase",
    expertise: ["Finance", "FinTech", "Blockchain", "Business Strategy"],
    skills: ["Blockchain", "Finance", "Business Strategy"],
    bio: "Leading FinTech innovation initiatives.",
    lastActiveAt: new Date(Date.now() - 86400000 * 180).toISOString() // ~6 months ago (Inactive - threshold)
  },
  {
    id: 206,
    name: "Robert Kim",
    email: "robert.kim@healthcare.com",
    role: "alumni",
    title: "Healthcare Data Analyst",
    company: "Baylor Healthcare",
    expertise: ["Healthcare", "Data Analytics", "AI", "Python"],
    skills: ["Python", "Data Analytics", "Healthcare"],
    bio: "Specializing in healthcare data analytics and AI applications.",
    lastActiveAt: new Date(Date.now() - 86400000 * 300).toISOString() // ~10 months ago (Inactive)
  }
];

// Mock Judge Invitations
export const mockJudgeInvitations = [
  {
    id: 1,
    competitionId: 1,
    competitionName: "Case Competition 2024",
    stakeholderId: 201,
    stakeholderName: "Sarah Johnson",
    stakeholderEmail: "sarah.johnson@exxonmobil.com",
    status: "pending", // 'pending', 'accepted', 'declined', 'under_review'
    matchReason: "Matched based on your expertise in AI, Data Analytics",
    matchedSkills: ["AI", "Data Analytics"],
    sentAt: "2024-01-15T10:05:00",
    respondedAt: null,
    acknowledged: false,
    acknowledgedAt: null,
    lastEmailSentAt: "2024-01-15T10:05:00", // When last email (invitation or follow-up) was sent
    followUpCount: 0 // Number of follow-up emails sent (max 2)
  },
  {
    id: 2,
    competitionId: 1,
    competitionName: "Case Competition 2024",
    stakeholderId: 203,
    stakeholderName: "Emily Rodriguez",
    stakeholderEmail: "emily.rodriguez@deloitte.com",
    status: "accepted", // Stakeholder replied via email, admin needs to acknowledge
    matchReason: "Matched based on your expertise in Finance, Business Strategy",
    matchedSkills: ["Finance", "Business Strategy"],
    sentAt: "2024-01-15T10:05:00",
    respondedAt: "2024-01-16T09:30:00", // Stakeholder replied via email
    acknowledged: false, // Admin hasn't sent acknowledgement yet
    acknowledgedAt: null,
    lastEmailSentAt: "2024-01-15T10:05:00",
    followUpCount: 0
  },
  {
    id: 3,
    competitionId: 2,
    competitionName: "FinTech Innovation Challenge",
    stakeholderId: 205,
    stakeholderName: "Jennifer Lee",
    stakeholderEmail: "jennifer.lee@jpmorgan.com",
    status: "accepted",
    matchReason: "Matched based on your expertise in Finance, FinTech, Blockchain",
    matchedSkills: ["Finance", "FinTech", "Blockchain"],
    sentAt: "2024-01-20T10:10:00",
    respondedAt: "2024-01-20T14:30:00",
    acknowledged: true, // Acknowledgement already sent
    acknowledgedAt: "2024-01-20T15:00:00",
    lastEmailSentAt: "2024-01-20T10:10:00",
    followUpCount: 0
  },
  {
    id: 4,
    competitionId: 3,
    competitionName: "Cybersecurity Hackathon",
    stakeholderId: 204,
    stakeholderName: "David Park",
    stakeholderEmail: "david.park@lockheed.com",
    status: "accepted",
    matchReason: "Matched based on your expertise in Cyber Security, Network Security",
    matchedSkills: ["Cyber Security", "Network Security"],
    sentAt: "2024-01-22T10:15:00",
    respondedAt: "2024-01-22T16:45:00",
    acknowledged: false, // Needs acknowledgement
    acknowledgedAt: null,
    lastEmailSentAt: "2024-01-22T10:15:00",
    followUpCount: 0
  },
  {
    id: 5,
    competitionId: 1,
    competitionName: "Case Competition 2024",
    stakeholderId: 202,
    stakeholderName: "Michael Chen",
    stakeholderEmail: "michael.chen@microsoft.com",
    status: "pending", // This one needs follow-up (old invitation)
    matchReason: "Matched based on your expertise in Cloud Infrastructure, DevOps",
    matchedSkills: ["Cloud Infrastructure", "DevOps"],
    sentAt: "2024-01-10T10:00:00", // Sent 5+ days ago
    respondedAt: null,
    acknowledged: false,
    acknowledgedAt: null,
    lastEmailSentAt: "2024-01-10T10:00:00", // Old date - needs follow-up
    followUpCount: 0 // Will be incremented when follow-up is sent
  }
];

