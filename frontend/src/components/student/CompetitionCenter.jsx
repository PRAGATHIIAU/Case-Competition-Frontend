import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Upload, Clock, CheckCircle2, FileText, Users, Lock, Unlock, Mail, Loader2 } from 'lucide-react'
import { generateTeamID } from '../../utils/businessLogic'
// Removed mock email service - now using backend API
import { useMockData } from '../../contexts/MockDataContext'

export default function CompetitionCenter({ competition, onRegister }) {
  const { currentUser, submitTeamFile } = useMockData()
  // Start with empty files array - no fake data
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  
  // Check registration status from localStorage and competition prop
  const getStoredRegistration = () => {
    try {
      const stored = localStorage.getItem(`competition_${competition.id}_registration`)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          isRegistered: true,
          teamId: parsed.teamId,
          teamName: parsed.teamName
        }
      }
    } catch (e) {
      console.error('Error reading stored registration:', e)
    }
    // Fallback to competition prop
    return {
      isRegistered: !!competition.teamId || !!competition.registered,
      teamId: competition.teamId || null,
      teamName: competition.teamName || null
    }
  }
  
  const initialRegistration = getStoredRegistration()
  const [isRegistered, setIsRegistered] = useState(initialRegistration.isRegistered)
  const [teamId, setTeamId] = useState(initialRegistration.teamId)
  const [teamName, setTeamName] = useState(initialRegistration.teamName)
  const [submissionUnlocked, setSubmissionUnlocked] = useState(initialRegistration.isRegistered)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState(null)
  
  // Load files from localStorage for this specific competition
  useEffect(() => {
    try {
      const storedFiles = localStorage.getItem(`competition_${competition.id}_files`)
      if (storedFiles) {
        const parsed = JSON.parse(storedFiles)
        setFiles(parsed)
        console.log(`📁 Loaded ${parsed.length} files for competition ${competition.id}`)
      }
    } catch (e) {
      console.error('Error loading stored files:', e)
    }
  }, [competition.id])
  
  // Track submission status and timestamp - start with no submission
  const [submissionStatus, setSubmissionStatus] = useState('Not Submitted')
  const [submittedAt, setSubmittedAt] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Update current time every 10 seconds for live time display
  useEffect(() => {
    // Update immediately on mount
    setCurrentTime(new Date())
    
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 10000) // Update every 10 seconds for better UX
    
    return () => clearInterval(interval)
  }, [])
  
  // Initialize submission status from files if they exist
  useEffect(() => {
    if (files.length > 0) {
      const latestFile = files.reduce((latest, file) => {
        if (!file.uploadDate) return latest
        return (!latest || new Date(file.uploadDate) > new Date(latest.uploadDate)) ? file : latest
      }, null)
      
      if (latestFile && latestFile.uploadDate) {
        setSubmittedAt(latestFile.uploadDate)
        setSubmissionStatus('Submitted')
        setCurrentTime(new Date()) // Update current time
      }
    } else {
      // Reset status if no files
      setSubmissionStatus('Not Submitted')
      setSubmittedAt(null)
    }
  }, [files]) // Update when files change

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
    const now = new Date()
    
    // Simulate file upload
    const newFiles = droppedFiles.map((file, index) => ({
      name: file.name,
      uploaded: true,
      uploadDate: now.toISOString()
    }))
    
    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    
    // Save files to localStorage for this specific competition
    try {
      localStorage.setItem(`competition_${competition.id}_files`, JSON.stringify(updatedFiles))
      console.log(`💾 Saved ${updatedFiles.length} files for competition ${competition.id}`)
    } catch (e) {
      console.error('Failed to save files to localStorage:', e)
    }
    
    // Update submission status when files are uploaded
    if (updatedFiles.length > 0) {
      // Always update to the latest file's upload time
      const latestFile = updatedFiles.reduce((latest, file) => {
        return (!latest || new Date(file.uploadDate) > new Date(latest.uploadDate)) ? file : latest
      }, null)
      
      if (latestFile && latestFile.uploadDate) {
        setSubmissionStatus('Submitted')
        setSubmittedAt(latestFile.uploadDate)
        setCurrentTime(now) // Update current time immediately
      }
    }
  }
  
  // Handle file input (click to select)
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length === 0) return
    
    const now = new Date()
    
    const newFiles = selectedFiles.map((file) => ({
      name: file.name,
      uploaded: true,
      uploadDate: now.toISOString()
    }))
    
    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    
    // Save files to localStorage for this specific competition
    try {
      localStorage.setItem(`competition_${competition.id}_files`, JSON.stringify(updatedFiles))
      console.log(`💾 Saved ${updatedFiles.length} files for competition ${competition.id}`)
    } catch (e) {
      console.error('Failed to save files to localStorage:', e)
    }
    
    // Update submission status when files are uploaded
    if (updatedFiles.length > 0) {
      // Always update to the latest file's upload time
      const latestFile = updatedFiles.reduce((latest, file) => {
        return (!latest || new Date(file.uploadDate) > new Date(latest.uploadDate)) ? file : latest
      }, null)
      
      if (latestFile && latestFile.uploadDate) {
        setSubmissionStatus('Submitted')
        setSubmittedAt(latestFile.uploadDate)
        setCurrentTime(now) // Update current time immediately
        
        // Notify shared context so judges can see the submission
        // Use currentUser.id as team ID (or create a team entry)
        if (submitTeamFile && currentUser?.id) {
          // Use user ID as team ID, or use teamId if it's numeric
          const teamIdToUse = teamId && !isNaN(parseInt(teamId)) ? parseInt(teamId) : currentUser.id
          
          // Prepare user info for team creation
          const userInfo = {
            name: currentUser.name || 'Student',
            teamName: teamName || competition.teamName || `Team ${teamId || currentUser.id}`,
            members: [currentUser.name || 'Student']
          }
          
          console.log('📤 Submitting files to shared context:', {
            competitionId: competition.id,
            teamId: teamIdToUse,
            fileCount: updatedFiles.length,
            files: updatedFiles.map(f => f.name),
            userInfo
          })
          
          submitTeamFile(teamIdToUse, updatedFiles, userInfo)
        }
      }
    }
  }
  
  const handleRegister = async () => {
    console.log('🎯 COMPETITION REGISTRATION STARTING...')
    console.log('  ├─ Competition ID:', competition.id)
    console.log('  ├─ Competition Name:', competition.name)
    
    // 1. Generate Team ID
    const newTeamId = generateTeamID()
    const newTeamName = competition.teamName || `Team ${newTeamId.substring(0, 8)}`
    console.log('  ├─ Team ID generated:', newTeamId)
    console.log('  ├─ Team Name:', newTeamName)
    
    // 2. Perform registration logic (save to state/local storage)
    setTeamId(newTeamId)
    setTeamName(newTeamName)
    setIsRegistered(true)
    setSubmissionUnlocked(true)
    
    // Save registration to localStorage for persistence
    try {
      localStorage.setItem(`competition_${competition.id}_registration`, JSON.stringify({
        teamId: newTeamId,
        teamName: newTeamName,
        registeredAt: new Date().toISOString()
      }))
      console.log('  ├─ Registration saved to localStorage')
    } catch (e) {
      console.error('  ├─ Failed to save to localStorage:', e)
    }
    
    // Notify parent component
    if (onRegister) {
      onRegister(competition.id, newTeamName, newTeamId)
    }
    
    console.log('  ├─ Registration saved to state')
    
    // 3. Send confirmation email via backend API (don't block user if this fails)
    try {
      setIsSendingEmail(true)
      setEmailError(null)
      
      console.log('  ├─ Sending confirmation email via backend API...')
      
      // Call backend API to register (this will send confirmation email)
      const api = await import('../../services/api')
      const response = await api.default.competition.register(
        competition.id || 1, // Competition ID (use 1 as default if not set)
        currentUser.id,
        newTeamName, // Use the generated team name
        newTeamId,
        competition.name || competition.title || 'Case Competition 2024' // Pass competition name
      )
      
      if (response.success && response.emailSent) {
        console.log('  ├─ ✅ Email sent successfully!')
        setEmailSent(true)
        
        // Show success message with email notification
        alert(`✅ Successfully registered!\n\nTeam ID: ${newTeamId}\n\n📧 Confirmation email sent to ${currentUser.email}!`)
      } else {
        console.log('  ├─ ⚠️ Email failed but registration succeeded')
        setEmailError(response.emailError || 'Email could not be sent')
        
        // Still show success for registration, just mention email issue
        alert(`✅ Successfully registered!\n\nTeam ID: ${newTeamId}\n\n⚠️ Note: Confirmation email could not be sent, but your registration is complete.`)
      }
      
    } catch (error) {
      console.error('  ├─ ❌ Competition registration API error:', error)
      console.error('  ├─ Error details:', error.message)
      console.error('  ├─ Full error:', error)
      setEmailError(error.message || 'Failed to send confirmation email')
      
      // Registration still successful even if email fails
      alert(`✅ Successfully registered!\n\nTeam ID: ${newTeamId}\n\n⚠️ Note: There was an issue sending the confirmation email, but your registration is complete.\n\nError: ${error.message}`)
    } finally {
      setIsSendingEmail(false)
      console.log('  └─ ✅ Registration complete!')
    }
  }

  // Helper function to calculate time ago for any date
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    const now = currentTime // Use currentTime state for live updates
    const diffMs = now - date
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor(diffMs / (1000 * 60)) % 60
    const seconds = Math.floor(diffMs / 1000) % 60
    
    if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    }
    if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    }
    if (seconds > 0) {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`
    }
    return 'Just now'
  }
  
  const timeSinceSubmission = () => {
    if (!submittedAt) return null
    return getTimeAgo(submittedAt)
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
                  <p className="font-medium text-gray-700">Team: {teamName || competition.teamName || 'My Team'}</p>
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
                {emailSent && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Confirmation email sent to {currentUser?.email}
                  </p>
                )}
                {emailError && (
                  <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email could not be sent, but registration is complete
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
      {submissionStatus === 'Submitted' && submittedAt && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-green-800">Submission Status: Submitted</p>
              <p className="text-sm text-green-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {timeSinceSubmission() || 'Just now'}
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
              <p className="text-sm text-gray-500 mb-2">Accepted formats: PDF, PPTX, DOCX</p>
              <input
                type="file"
                multiple
                accept=".pdf,.pptx,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload-input"
              />
              <label
                htmlFor="file-upload-input"
                className="inline-block px-4 py-2 bg-tamu-maroon text-white rounded-lg cursor-pointer hover:bg-tamu-maroon-light transition-colors"
              >
                Select Files
              </label>
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
                  <div className="flex-1">
                    <p className="font-medium text-gray-700">{file.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Uploaded {getTimeAgo(file.uploadDate)}
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

