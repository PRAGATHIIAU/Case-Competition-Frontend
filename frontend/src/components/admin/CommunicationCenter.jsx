import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, Users, Sparkles, MessageSquare } from 'lucide-react'

export default function CommunicationCenter() {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [emailPreview, setEmailPreview] = useState('')
  
  // Hardcoded hyper-personalized email preview (always visible for demo)
  const hyperPersonalizedEmail = `Subject: Mentorship Opportunity - Python Data Structures

Hi Sarah,

Seeing your recent project on Python Data Structures, I thought you'd be the perfect mentor for John (Class of '26). He is currently struggling with Big O notation.

Given your expertise and his learning goals, this seems like an ideal match. Would you be open to connecting with him?

Best regards,
CMIS Engagement Team`

  const mockStudents = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@tamu.edu',
      interest: 'Data Analytics',
      skills: ['Python', 'SQL', 'Tableau'],
      recentActivity: 'Attended Data Analytics Workshop'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob.smith@tamu.edu',
      interest: 'Cyber Security',
      skills: ['Python', 'Network Security', 'Linux'],
      recentActivity: 'Completed Case Competition submission'
    },
    {
      id: 3,
      name: 'Charlie Brown',
      email: 'charlie.brown@tamu.edu',
      interest: 'Consulting',
      skills: ['Business Strategy', 'Excel', 'Presentation'],
      recentActivity: 'Connected with mentor Sarah Johnson'
    }
  ]

  const generateEmailPreview = (student) => {
    setSelectedStudent(student)
    // Simulate AI-powered email generation
    const preview = `Subject: Personalized Opportunity: ${student.interest} at CMIS

Hi ${student.name.split(' ')[0]},

Based on your interest in ${student.interest} and your skills in ${student.skills.slice(0, 2).join(' and ')}, we have an exciting opportunity that aligns perfectly with your career goals.

We noticed your recent activity: "${student.recentActivity}" and thought you might be interested in:

• Upcoming ${student.interest} Workshop (Next week)
• Mentorship matching with industry professionals in ${student.interest}
• Exclusive networking event for ${student.interest} students

Your profile shows strong potential in this field, and we'd love to help you connect with the right opportunities.

Best regards,
CMIS Engagement Team

---
This email was automatically personalized based on your profile and interests.`

    setEmailPreview(preview)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Communication Center</h2>
        <p className="text-gray-600">Send personalized communications to students</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Student List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-tamu-maroon" />
            <h3 className="text-xl font-semibold text-gray-800">Students</h3>
          </div>
          <div className="space-y-3">
            {mockStudents.map((student) => (
              <motion.div
                key={student.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => generateEmailPreview(student)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedStudent?.id === student.id
                    ? 'border-tamu-maroon bg-tamu-maroon/5'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.email}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        {student.interest}
                      </span>
                      {student.skills.slice(0, 2).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{student.recentActivity}</p>
                  </div>
                  <Sparkles className="w-5 h-5 text-tamu-maroon" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Email Preview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-tamu-maroon" />
            <h3 className="text-xl font-semibold text-gray-800">Email Preview</h3>
          </div>
          
          {/* Always-visible Hyper-Personalized Email Example */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <p className="text-sm font-semibold text-purple-900">Context-Aware AI Communication</p>
            </div>
            <div className="border border-purple-200 rounded-lg p-4 bg-white">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                {hyperPersonalizedEmail}
              </pre>
            </div>
            <p className="text-xs text-purple-700 mt-3 italic">
              ✨ This email demonstrates AI understanding of context: Sarah's recent project, John's specific struggle, and the perfect match opportunity.
            </p>
          </div>
          
          {selectedStudent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <p className="text-sm font-medium text-blue-900">
                    Drafting email to {selectedStudent.name} regarding {selectedStudent.interest}...
                  </p>
                </div>
                <p className="text-xs text-blue-700">
                  AI-powered personalization based on profile and activity
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                  {emailPreview}
                </pre>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-tamu-maroon text-white px-4 py-2 rounded-lg font-medium hover:bg-tamu-maroon-light transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Email
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Edit
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>Select a student to generate personalized email</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

