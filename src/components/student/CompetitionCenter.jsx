import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Upload, Clock, CheckCircle2, FileText, Users, Lock, Unlock, Mail, Loader2 } from 'lucide-react'
import { generateTeamID } from '../../utils/businessLogic'
import { sendRegistrationConfirmation, USE_MOCK_EMAIL } from '../../utils/emailService'
import { useMockData } from '../../contexts/MockDataContext'

export default function CompetitionCenter({ competition, onRegister }) {
  const { currentUser } = useMockData()
  const [files, setFiles] = useState(competition.deliverables || [])
  const [isDragging, setIsDragging] = useState(false)
  const [isRegistered, setIsRegistered] = useState(!!competition.teamId)
  const [teamId, setTeamId] = useState(competition.teamId || null)
  const [submissionUnlocked, setSubmissionUnlocked] = useState(!!competition.teamId)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    // Check if submission is unlocked
    if (!submissionUnlocked) {
      alert('Please register for the competition first to unlock submissions.')
      return
    }
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    // Simulate file upload
    const newFiles = droppedFiles.map((file, index) => ({
      name: file.name,
      uploaded: true,
      uploadDate: new Date().toISOString()
    }))
    setFiles([...files, ...newFiles])
  }

  const handleRegister = async () => {
    console.log('🎯 COMPETITION REGISTRATION STARTING...')
    
    // 1. Generate Team ID
    const newTeamId = generateTeamID()
    console.log('  ├─ Team ID generated:', newTeamId)
    
    // 2. Perform registration logic (save to state/local storage)
    setTeamId(newTeamId)
    setIsRegistered(true)
    setSubmissionUnlocked(true)
    
    // Notify parent component
    if (onRegister) {
      onRegister(newTeamId)
    }
    
    console.log('  ├─ Registration saved to state')
    
    // 3. Send confirmation email (don't block user if this fails)
    try {
      setIsSendingEmail(true)
      setEmailError(null)
      
      console.log('  ├─ Sending confirmation email...')
      
      const emailResult = await sendRegistrationConfirmation(
        currentUser.email,
        currentUser.name,
        competition.teamName || 'My Team',
        competition.name,
        newTeamId
      )
      
      if (emailResult.success) {
        console.log('  ├─ ✅ Email sent successfully!')
        setEmailSent(true)
        
        // Show success message with email notification
        if (USE_MOCK_EMAIL) {
          alert(`✅ Successfully registered!\n\nTeam ID: ${newTeamId}\n\n📧 Email confirmation logged to console (Mock Mode).\nCheck your browser console for email details.`)
        } else {
          alert(`✅ Successfully registered!\n\nTeam ID: ${newTeamId}\n\n📧 Check your email (${currentUser.email}) for confirmation and next steps!`)
        }
      } else {
        console.log('  ├─ ⚠️ Email failed but registration succeeded')
        setEmailError(emailResult.message)
        
        // Still show success for registration, just mention email issue
        alert(`✅ Successfully registered!\n\nTeam ID: ${newTeamId}\n\n⚠️ Note: Confirmation email could not be sent, but your registration is complete.`)
      }
      
    } catch (error) {
      console.error('  ├─ ❌ Email error (non-blocking):', error)
      setEmailError(error.message)
      
      // Registration still successful even if email fails
      alert(`✅ Successfully registered!\n\nTeam ID: ${newTeamId}\n\n⚠️ Note: There was an issue sending the confirmation email, but your registration is complete.`)
    } finally {
      setIsSendingEmail(false)
      console.log('  └─ ✅ Registration complete!')
    }
  }

  const timeSinceSubmission = () => {
    if (!competition.submittedAt) return null
    const submitted = new Date(competition.submittedAt)
    const now = new Date()
    const hours = Math.floor((now - submitted) / (1000 * 60 * 60))
    const minutes = Math.floor((now - submitted) / (1000 * 60)) % 60
    
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-tamu-maroon" />
        <div>
          <h3 className="text-2xl font-semibold text-gray-800">Competition Center</h3>
          <p className="text-gray-600">{competition.name}</p>
        </div>
      </div>

      {/* Team Registration Status */}
      <div className={`mb-6 p-4 rounded-lg border ${
        isRegistered 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isRegistered ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <p className="font-medium text-gray-700">Team: {competition.teamName || 'My Team'}</p>
                </div>
                <p className="text-sm text-gray-600">Team ID: <span className="font-mono font-semibold">{teamId}</span></p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Status: Registered
                </p>
                {emailSent && (
                  <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Confirmation email sent to {currentUser.email}
                  </p>
                )}
                {emailError && (
                  <p className="text-xs text-orange-600 mt-2">
                    ⚠️ Email notification failed (registration still successful)
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="font-medium text-gray-700 mb-2">Not Registered Yet</p>
                <p className="text-sm text-gray-600 mb-3">Register to unlock submission folder and get your Team ID</p>
                <motion.button
                  whileHover={!isSendingEmail ? { scale: 1.05 } : {}}
                  whileTap={!isSendingEmail ? { scale: 0.95 } : {}}
                  onClick={handleRegister}
                  disabled={isSendingEmail}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    isSendingEmail
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-tamu-maroon text-white hover:bg-tamu-maroon-light'
                  }`}
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Registering & Sending Email...
                    </>
                  ) : (
                    'Register for Competition'
                  )}
                </motion.button>
                
                {/* Email Status Info */}
                {USE_MOCK_EMAIL && (
                  <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email will be logged to console (Mock Mode)
                  </p>
                )}
              </>
            )}
          </div>
          {isRegistered && (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          )}
        </div>
      </div>

      {/* Submission Status */}
      {competition.submissionStatus === 'Submitted' && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Submission Status: Submitted</p>
              <p className="text-sm text-green-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {timeSinceSubmission()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Deliverables */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-gray-800">Upload Deliverables</h4>
          {submissionUnlocked ? (
            <div className="flex items-center gap-2 text-green-600">
              <Unlock className="w-5 h-5" />
              <span className="text-sm font-medium">Submission Unlocked</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <Lock className="w-5 h-5" />
              <span className="text-sm font-medium">Locked - Register to unlock</span>
            </div>
          )}
        </div>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            !submissionUnlocked
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
              : isDragging
              ? 'border-tamu-maroon bg-tamu-maroon/5'
              : 'border-gray-300 hover:border-tamu-maroon hover:bg-gray-50'
          }`}
        >
          {submissionUnlocked ? (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Drag and drop files here, or click to select
              </p>
              <p className="text-sm text-gray-500">Accepted formats: PDF, PPTX, DOCX</p>
            </>
          ) : (
            <>
              <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">
                Register for the competition to unlock file uploads
              </p>
            </>
          )}
        </div>
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Uploaded Files</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-tamu-maroon" />
                  <div>
                    <p className="font-medium text-gray-700">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded {new Date(file.uploadDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                {file.uploaded && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Deadline */}
      <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <p className="text-sm font-medium text-orange-800">
          Deadline: {new Date(competition.deadline).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

