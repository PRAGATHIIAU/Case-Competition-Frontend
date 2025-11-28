/**
 * EmailJS Service for Frontend-Only Email Sending
 * 
 * CURRENT STATUS: Mock Mode (No Package Required)
 * 
 * To Enable Real Emails:
 * 1. Run: npm install @emailjs/browser
 * 2. Uncomment the import and code sections marked with "UNCOMMENT WHEN PACKAGE INSTALLED"
 * 3. Create EmailJS account at https://www.emailjs.com
 * 4. Update EMAILJS_CONFIG with your credentials
 * 5. Set USE_MOCK_EMAIL = false
 */

// ============ CONFIGURATION ============

// Toggle this to test without EmailJS account
const USE_MOCK_EMAIL = true  // Set to FALSE when EmailJS is configured and package installed

// EmailJS Credentials (get from https://dashboard.emailjs.com)
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_xxxxxxx',      // Replace with your Service ID
  TEMPLATE_ID: 'template_xxxxxxx',    // Replace with your Template ID
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY_HERE'  // Replace with your Public Key (User ID)
}

// ============ EMAILJS INTEGRATION ============
// UNCOMMENT WHEN PACKAGE INSTALLED: npm install @emailjs/browser

/*
import emailjs from '@emailjs/browser'

// Initialize EmailJS
if (!USE_MOCK_EMAIL) {
  try {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
    console.log('✅ EmailJS initialized')
  } catch (error) {
    console.error('❌ EmailJS initialization failed:', error)
  }
}
*/

// ============ EMAIL TEMPLATES ============

/**
 * Send Competition Registration Confirmation Email
 * 
 * @param {string} studentEmail - Student's email address
 * @param {string} studentName - Student's full name
 * @param {string} teamName - Team name
 * @param {string} competitionName - Competition name
 * @param {string} teamId - Generated team ID
 * @returns {Promise<Object>} - Result object with success status
 */
export async function sendRegistrationConfirmation(
  studentEmail,
  studentName,
  teamName,
  competitionName,
  teamId
) {
  console.log('📧 SENDING REGISTRATION CONFIRMATION EMAIL')
  console.log('  ├─ To:', studentEmail)
  console.log('  ├─ Student:', studentName)
  console.log('  ├─ Team:', teamName)
  console.log('  ├─ Competition:', competitionName)
  console.log('  └─ Team ID:', teamId)

  // MOCK MODE: Just log and return success
  if (USE_MOCK_EMAIL) {
    console.log('🔧 MOCK MODE: Email would be sent with this content:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('TO:', studentEmail)
    console.log('SUBJECT: Registration Confirmed - ' + competitionName)
    console.log('\nBODY:')
    console.log(`Hi ${studentName},

Congratulations! Your team "${teamName}" has been successfully registered for ${competitionName}.

Team Details:
• Team Name: ${teamName}
• Team ID: ${teamId}
• Competition: ${competitionName}

Next Steps:
1. Share your Team ID (${teamId}) with your team members
2. Prepare your submission materials
3. Check the competition deadline
4. Submit your final work through the platform

Good luck! We're excited to see what you create.

Best regards,
CMIS Engagement Platform Team
Texas A&M University - Mays Business School
`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      message: 'Email sent successfully (MOCK MODE)',
      mode: 'mock'
    }
  }

  // REAL MODE: Actually send email via EmailJS
  // UNCOMMENT THIS SECTION AFTER INSTALLING: npm install @emailjs/browser
  
  console.log('⚠️ Real email mode requires @emailjs/browser package')
  console.log('💡 Run: npm install @emailjs/browser')
  console.log('📝 Then uncomment the code section in emailService.js')
  
  return {
    success: true,
    message: 'EmailJS package not installed - using mock mode',
    mode: 'fallback'
  }
  
  /* UNCOMMENT WHEN PACKAGE INSTALLED:
  
  try {
    // Template parameters that map to EmailJS template variables
    const templateParams = {
      to_email: studentEmail,
      to_name: studentName,
      team_name: teamName,
      team_id: teamId,
      competition_name: competitionName,
      submission_deadline: 'Check platform for deadline',
      platform_url: window.location.origin
    }

    console.log('📤 Sending email via EmailJS...')
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    )

    console.log('✅ Email sent successfully:', response)

    return {
      success: true,
      message: 'Email sent successfully',
      response,
      mode: 'real'
    }

  } catch (error) {
    console.error('❌ Email sending failed:', error)
    
    return {
      success: false,
      message: 'Failed to send email',
      error: error.message || error.text || 'Unknown error',
      mode: 'real'
    }
  }
  
  */
}

/**
 * Send Team Member Invitation Email
 * 
 * @param {string} memberEmail - Team member's email
 * @param {string} memberName - Team member's name
 * @param {string} teamName - Team name
 * @param {string} teamId - Team ID
 * @param {string} invitedBy - Name of person who sent invitation
 * @returns {Promise<Object>} - Result object
 */
export async function sendTeamInvitation(
  memberEmail,
  memberName,
  teamName,
  teamId,
  invitedBy
) {
  if (USE_MOCK_EMAIL) {
    console.log('🔧 MOCK: Team invitation email to', memberEmail)
    await new Promise(resolve => setTimeout(resolve, 500))
    return { success: true, mode: 'mock' }
  }

  return { success: true, message: 'EmailJS not installed', mode: 'fallback' }
  
  /* UNCOMMENT WHEN PACKAGE INSTALLED:
  try {
    const templateParams = {
      to_email: memberEmail,
      to_name: memberName,
      team_name: teamName,
      team_id: teamId,
      invited_by: invitedBy,
      join_url: `${window.location.origin}/teams/join/${teamId}`
    }

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      'template_team_invite',
      templateParams
    )

    return { success: true, response, mode: 'real' }

  } catch (error) {
    console.error('❌ Team invitation failed:', error)
    return { success: false, error: error.message, mode: 'real' }
  }
  */
}

/**
 * Send Submission Confirmation Email
 * 
 * @param {string} studentEmail - Student's email
 * @param {string} teamName - Team name
 * @param {string} fileName - Submitted file name
 * @returns {Promise<Object>} - Result object
 */
export async function sendSubmissionConfirmation(
  studentEmail,
  teamName,
  fileName
) {
  if (USE_MOCK_EMAIL) {
    console.log('🔧 MOCK: Submission confirmation to', studentEmail)
    console.log('  Team:', teamName, '| File:', fileName)
    await new Promise(resolve => setTimeout(resolve, 500))
    return { success: true, mode: 'mock' }
  }

  return { success: true, message: 'EmailJS not installed', mode: 'fallback' }
  
  /* UNCOMMENT WHEN PACKAGE INSTALLED:
  try {
    const templateParams = {
      to_email: studentEmail,
      team_name: teamName,
      file_name: fileName,
      submitted_at: new Date().toLocaleString(),
      dashboard_url: `${window.location.origin}/student`
    }

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      'template_submission',
      templateParams
    )

    return { success: true, response, mode: 'real' }

  } catch (error) {
    console.error('❌ Submission email failed:', error)
    return { success: false, error: error.message, mode: 'real' }
  }
  */
}

/**
 * Send Acknowledgement Email to Stakeholder
 * 
 * @param {string} stakeholderEmail - Stakeholder's email address
 * @param {string} stakeholderName - Stakeholder's full name
 * @returns {Promise<Object>} - Result object with success status
 */
export async function sendAcknowledgementEmail(stakeholderEmail, stakeholderName) {
  console.log('📧 SENDING ACKNOWLEDGEMENT EMAIL')
  console.log('  ├─ To:', stakeholderEmail)
  console.log('  ├─ Name:', stakeholderName)

  // MOCK MODE: Just log and return success
  if (USE_MOCK_EMAIL) {
    console.log('🔧 MOCK MODE: Email would be sent with this content:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('TO:', stakeholderEmail)
    console.log('SUBJECT: Received: Thank you for your response')
    console.log('\nBODY:')
    console.log(`Dear ${stakeholderName},

We have received your reply regarding the upcoming competition. Our team is reviewing the details and will get back to you shortly with the final schedule.

Thank you for your interest and prompt response.

Best regards,
CMIS Engagement Platform Team
Texas A&M University - Mays Business School
`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      message: 'Acknowledgement email sent successfully',
      mode: 'mock',
      emailContent: {
        to: stakeholderEmail,
        subject: 'Received: Thank you for your response',
        body: `Dear ${stakeholderName},\n\nWe have received your reply regarding the upcoming competition. Our team is reviewing the details and will get back to you shortly with the final schedule.\n\nThank you for your interest and prompt response.\n\nBest regards,\nCMIS Engagement Platform Team\nTexas A&M University - Mays Business School`
      }
    }
  }

  // REAL MODE: Actually send email via EmailJS
  console.log('⚠️ Real email mode requires @emailjs/browser package')
  console.log('💡 Run: npm install @emailjs/browser')
  console.log('📝 Then uncomment the code section in emailService.js')
  
  return {
    success: true,
    message: 'EmailJS package not installed - using mock mode',
    mode: 'fallback'
  }
  
  /* UNCOMMENT WHEN PACKAGE INSTALLED:
  
  try {
    const templateParams = {
      to_email: stakeholderEmail,
      to_name: stakeholderName,
      subject: 'Received: Thank you for your response',
      message: `Dear ${stakeholderName},\n\nWe have received your reply regarding the upcoming competition. Our team is reviewing the details and will get back to you shortly with the final schedule.\n\nThank you for your interest and prompt response.\n\nBest regards,\nCMIS Engagement Platform Team`
    }

    console.log('📤 Sending acknowledgement email via EmailJS...')
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      'template_acknowledgement', // Create this template in EmailJS
      templateParams
    )

    console.log('✅ Acknowledgement email sent successfully:', response)

    return {
      success: true,
      message: 'Acknowledgement email sent successfully',
      response,
      mode: 'real'
    }

  } catch (error) {
    console.error('❌ Acknowledgement email failed:', error)
    
    return {
      success: false,
      message: 'Failed to send acknowledgement email',
      error: error.message || error.text || 'Unknown error',
      mode: 'real'
    }
  }
  
  */
}

// ============ HELPER FUNCTIONS ============

/**
 * Validate email address format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Check if EmailJS is properly configured
 */
export function isEmailJSConfigured() {
  if (USE_MOCK_EMAIL) return false
  
  return (
    EMAILJS_CONFIG.SERVICE_ID !== 'service_xxxxxxx' &&
    EMAILJS_CONFIG.TEMPLATE_ID !== 'template_xxxxxxx' &&
    EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE'
  )
}

/**
 * Get current email service status
 */
export function getEmailServiceStatus() {
  return {
    mockMode: USE_MOCK_EMAIL,
    configured: isEmailJSConfigured(),
    ready: USE_MOCK_EMAIL || isEmailJSConfigured()
  }
}

/**
 * Send Follow-Up Email to Stakeholder
 * 
 * @param {string} stakeholderEmail - Stakeholder's email address
 * @param {string} stakeholderName - Stakeholder's full name
 * @param {string} competitionName - Competition name
 * @param {number} followUpCount - Number of follow-ups sent so far (1 or 2)
 * @returns {Promise<Object>} - Result object with success status
 */
export async function sendFollowUpEmail(stakeholderEmail, stakeholderName, competitionName, followUpCount = 1) {
  console.log('📧 SENDING FOLLOW-UP EMAIL')
  console.log('  ├─ To:', stakeholderEmail)
  console.log('  ├─ Name:', stakeholderName)
  console.log('  ├─ Competition:', competitionName)
  console.log('  └─ Follow-up #:', followUpCount)

  // MOCK MODE: Just log and return success
  if (USE_MOCK_EMAIL) {
    console.log('🔧 MOCK MODE: Email would be sent with this content:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('TO:', stakeholderEmail)
    console.log('SUBJECT: Follow Up: Invitation to Judge ' + competitionName)
    console.log('\nBODY:')
    console.log(`Hi ${stakeholderName},

Just floating this to the top of your inbox. We would love to have you as a judge for our upcoming competition:

Competition: ${competitionName}

Your expertise would be invaluable in evaluating the submissions. We understand you're busy, but we'd greatly appreciate your participation.

Please let us know if you're available by responding to this email or through the platform dashboard.

Thank you for your consideration!

Best regards,
CMIS Engagement Platform Team
Texas A&M University - Mays Business School
`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      message: 'Follow-up email sent successfully',
      mode: 'mock',
      emailContent: {
        to: stakeholderEmail,
        subject: `Follow Up: Invitation to Judge ${competitionName}`,
        body: `Hi ${stakeholderName},\n\nJust floating this to the top of your inbox. We would love to have you as a judge for our upcoming competition:\n\nCompetition: ${competitionName}\n\nYour expertise would be invaluable in evaluating the submissions. We understand you're busy, but we'd greatly appreciate your participation.\n\nPlease let us know if you're available by responding to this email or through the platform dashboard.\n\nThank you for your consideration!\n\nBest regards,\nCMIS Engagement Platform Team\nTexas A&M University - Mays Business School`
      }
    }
  }

  // REAL MODE: Actually send email via EmailJS
  console.log('⚠️ Real email mode requires @emailjs/browser package')
  console.log('💡 Run: npm install @emailjs/browser')
  console.log('📝 Then uncomment the code section in emailService.js')
  
  return {
    success: true,
    message: 'EmailJS package not installed - using mock mode',
    mode: 'fallback'
  }
  
  /* UNCOMMENT WHEN PACKAGE INSTALLED:
  
  try {
    const templateParams = {
      to_email: stakeholderEmail,
      to_name: stakeholderName,
      competition_name: competitionName,
      follow_up_number: followUpCount,
      subject: `Follow Up: Invitation to Judge ${competitionName}`,
      message: `Hi ${stakeholderName},\n\nJust floating this to the top of your inbox. We would love to have you as a judge for our upcoming competition: ${competitionName}...`
    }

    console.log('📤 Sending follow-up email via EmailJS...')
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      'template_followup', // Create this template in EmailJS
      templateParams
    )

    console.log('✅ Follow-up email sent successfully:', response)

    return {
      success: true,
      message: 'Follow-up email sent successfully',
      response,
      mode: 'real'
    }

  } catch (error) {
    console.error('❌ Follow-up email failed:', error)
    
    return {
      success: false,
      message: 'Failed to send follow-up email',
      error: error.message || error.text || 'Unknown error',
      mode: 'real'
    }
  }
  
  */
}

/**
 * Send Speaker Thank You Email
 * 
 * @param {string} speakerEmail - Speaker's email address
 * @param {string} speakerName - Speaker's full name
 * @param {string} eventTitle - Event title
 * @returns {Promise<Object>} - Result object with success status
 */
export async function sendSpeakerThankYou(speakerEmail, speakerName, eventTitle) {
  console.log('📧 SENDING SPEAKER THANK YOU EMAIL')
  console.log('  ├─ To:', speakerEmail)
  console.log('  ├─ Name:', speakerName)
  console.log('  └─ Event:', eventTitle)

  // MOCK MODE: Just log and return success
  if (USE_MOCK_EMAIL) {
    console.log('🔧 MOCK MODE: Email would be sent with this content:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('TO:', speakerEmail)
    console.log('SUBJECT: Thank you for speaking at ' + eventTitle)
    console.log('\nBODY:')
    console.log(`Dear ${speakerName},

Thank you for taking the time to speak at ${eventTitle}. Your insights and expertise were invaluable to our students and made a significant impact on their learning experience.

Your willingness to share your knowledge and experiences helps bridge the gap between academia and industry, and we are truly grateful for your contribution to our community.

We hope to have the opportunity to work with you again in the future. If you have any feedback or suggestions, please don't hesitate to reach out.

Thank you once again for your time and dedication.

Best regards,
CMIS Engagement Platform Team
Texas A&M University - Mays Business School
`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      message: 'Speaker thank you email sent successfully',
      mode: 'mock',
      emailContent: {
        to: speakerEmail,
        subject: `Thank you for speaking at ${eventTitle}`,
        body: `Dear ${speakerName},\n\nThank you for taking the time to speak at ${eventTitle}. Your insights and expertise were invaluable to our students and made a significant impact on their learning experience.\n\nYour willingness to share your knowledge and experiences helps bridge the gap between academia and industry, and we are truly grateful for your contribution to our community.\n\nWe hope to have the opportunity to work with you again in the future. If you have any feedback or suggestions, please don't hesitate to reach out.\n\nThank you once again for your time and dedication.\n\nBest regards,\nCMIS Engagement Platform Team\nTexas A&M University - Mays Business School`
      }
    }
  }

  // REAL MODE: Actually send email via EmailJS
  console.log('⚠️ Real email mode requires @emailjs/browser package')
  console.log('💡 Run: npm install @emailjs/browser')
  console.log('📝 Then uncomment the code section in emailService.js')
  
  return {
    success: true,
    message: 'EmailJS package not installed - using mock mode',
    mode: 'fallback'
  }
}

/**
 * Send Judge Thank You Email
 * 
 * @param {string} judgeEmail - Judge's email address
 * @param {string} judgeName - Judge's full name
 * @param {string} competitionName - Competition name
 * @param {number} competitionId - Competition ID (for feedback link)
 * @returns {Promise<Object>} - Result object with success status
 */
export async function sendJudgeThankYou(judgeEmail, judgeName, competitionName, competitionId = null) {
  console.log('📧 SENDING JUDGE THANK YOU EMAIL')
  console.log('  ├─ To:', judgeEmail)
  console.log('  ├─ Name:', judgeName)
  console.log('  └─ Competition:', competitionName)

  // MOCK MODE: Just log and return success
  if (USE_MOCK_EMAIL) {
    console.log('🔧 MOCK MODE: Email would be sent with this content:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    const feedbackLink = competitionId 
      ? `http://localhost:3000/stakeholder/feedback/${competitionId}`
      : '#'
    
    console.log('TO:', judgeEmail)
    console.log('SUBJECT: Appreciation for judging ' + competitionName)
    console.log('\nBODY:')
    console.log(`Dear ${judgeName},

Thank you for your time and expertise in evaluating the projects for ${competitionName}. Your thoughtful feedback and professional insights were instrumental in helping our students grow and improve their work.

Your dedication to mentoring the next generation of professionals is truly appreciated. The quality of your evaluations helped ensure that the competition was fair, meaningful, and educational for all participants.

We recognize that your time is valuable, and we are grateful that you chose to invest it in our students' development. Your contribution makes a real difference in their academic and professional journey.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Help Us Improve!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We would love to hear your feedback on the competition organization and your experience as a judge. Your insights help us improve future events.

👉 Rate Your Experience: ${feedbackLink}

Thank you once again for your commitment and support.

Best regards,
CMIS Engagement Platform Team
Texas A&M University - Mays Business School
`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      message: 'Judge thank you email sent successfully',
      mode: 'mock',
      emailContent: {
        to: judgeEmail,
        subject: `Appreciation for judging ${competitionName}`,
        body: `Dear ${judgeName},\n\nThank you for your time and expertise in evaluating the projects for ${competitionName}. Your thoughtful feedback and professional insights were instrumental in helping our students grow and improve their work.\n\nYour dedication to mentoring the next generation of professionals is truly appreciated. The quality of your evaluations helped ensure that the competition was fair, meaningful, and educational for all participants.\n\nWe recognize that your time is valuable, and we are grateful that you chose to invest it in our students' development. Your contribution makes a real difference in their academic and professional journey.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📝 Help Us Improve!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nWe would love to hear your feedback on the competition organization and your experience as a judge. Your insights help us improve future events.\n\n👉 Rate Your Experience: ${feedbackLink}\n\nThank you once again for your commitment and support.\n\nBest regards,\nCMIS Engagement Platform Team\nTexas A&M University - Mays Business School`,
        feedbackLink
      }
    }
  }

  // REAL MODE: Actually send email via EmailJS
  console.log('⚠️ Real email mode requires @emailjs/browser package')
  console.log('💡 Run: npm install @emailjs/browser')
  console.log('📝 Then uncomment the code section in emailService.js')
  
  return {
    success: true,
    message: 'EmailJS package not installed - using mock mode',
    mode: 'fallback'
  }
}

/**
 * Send Speaker Invitation Email
 * 
 * @param {string} speakerEmail - Speaker's email address
 * @param {string} speakerName - Speaker's full name
 * @param {string} lectureTitle - Lecture title
 * @param {string} professorName - Professor's name
 * @param {string} topicTags - Comma-separated topic tags
 * @param {string} lectureDate - Lecture date
 * @returns {Promise<Object>} - Result object with success status
 */
export async function sendSpeakerInvitationEmail(
  speakerEmail,
  speakerName,
  lectureTitle,
  professorName,
  topicTags,
  lectureDate
) {
  console.log('📧 SENDING SPEAKER INVITATION EMAIL')
  console.log('  ├─ To:', speakerEmail)
  console.log('  ├─ Name:', speakerName)
  console.log('  ├─ Lecture:', lectureTitle)
  console.log('  ├─ Professor:', professorName)
  console.log('  └─ Topics:', topicTags)

  // MOCK MODE: Just log and return success
  if (USE_MOCK_EMAIL) {
    console.log('🔧 MOCK MODE: Email would be sent with this content:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('TO:', speakerEmail)
    console.log('SUBJECT: Speaking Opportunity: ' + lectureTitle)
    console.log('\nBODY:')
    console.log(`Dear ${speakerName},

Professor ${professorName} is hosting a lecture on ${lectureTitle} scheduled for ${lectureDate}.

Given your expertise in ${topicTags}, we would love to have you as a guest speaker for this event. Your insights and real-world experience would be invaluable to our students.

This is a great opportunity to:
- Share your knowledge and expertise with the next generation
- Connect with students interested in your field
- Give back to the Texas A&M community

Please review the invitation in your dashboard and let us know if you're available.

We look forward to hearing from you!

Best regards,
CMIS Engagement Platform Team
Texas A&M University - Mays Business School
`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      mode: 'mock',
      emailContent: {
        to: speakerEmail,
        subject: `Speaking Opportunity: ${lectureTitle}`,
        body: `Dear ${speakerName}, Professor ${professorName} is hosting a lecture on ${lectureTitle}. Given your expertise in ${topicTags}, we would love to have you as a guest speaker.`
      }
    }
  }

  // Real EmailJS implementation would go here
  console.log('⚠️ Real email mode requires @emailjs/browser package')
  
  return {
    success: true,
    message: 'EmailJS package not installed - using mock mode',
    mode: 'fallback'
  }
}

/**
 * Send Mentor Invitation Email (Personalized)
 * 
 * @param {string} mentorEmail - Mentor's email address
 * @param {Object} mentor - Mentor object with name, skills, etc.
 * @param {Object} student - Student object with name, major, email
 * @param {Array<string>} sharedSkills - Array of shared skills (top 3)
 * @returns {Promise<Object>} - Result object with success status
 */
export async function sendMentorInviteEmail(
  mentorEmail,
  mentor,
  student,
  sharedSkills
) {
  console.log('📧 SENDING MENTOR INVITATION EMAIL')
  console.log('  ├─ To:', mentorEmail)
  console.log('  ├─ Mentor:', mentor.name)
  console.log('  ├─ Student:', student.name)
  console.log('  └─ Shared Skills:', sharedSkills)

  // MOCK MODE: Just log and return success
  if (USE_MOCK_EMAIL) {
    console.log('🔧 MOCK MODE: Email would be sent with this content:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('TO:', mentorEmail)
    console.log('SUBJECT: ' + student.name + ' requested you as a Mentor')
    console.log('\nBODY:')
    
    const sharedSkillsText = sharedSkills.length > 0
      ? sharedSkills.slice(0, 3).join(', ')
      : 'various areas'
    
    const emailBody = `Hello ${mentor.name},

${student.name} (Major: ${student.major}) would like to connect with you.

System Analysis: You are a great match because you both have skills in: ${sharedSkillsText}.

${student.name} is interested in learning from your experience and expertise. This could be a great opportunity to mentor the next generation of professionals.

Please review this request in your dashboard and let us know if you're available to connect.

[Link to Dashboard to Accept/Decline]
${typeof window !== 'undefined' ? window.location.origin + '/mentor' : 'http://localhost:3000/mentor'}

Best regards,
CMIS Engagement Platform Team
Texas A&M University - Mays Business School
`
    console.log(emailBody)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      mode: 'mock',
      emailContent: {
        to: mentorEmail,
        subject: `${student.name} requested you as a Mentor`,
        body: emailBody
      }
    }
  }

  // Real EmailJS implementation would go here
  console.log('⚠️ Real email mode requires @emailjs/browser package')
  
  return {
    success: true,
    message: 'EmailJS package not installed - using mock mode',
    mode: 'fallback'
  }
}

/**
 * Send Session Confirmation Email
 * 
 * @param {string} recipientEmail - Recipient's email (student or mentor)
 * @param {Object} recipient - Recipient object with name and role
 * @param {Object} otherParty - Other party object (mentor or student)
 * @param {string} meetingTime - Meeting date/time (ISO string)
 * @param {string} meetingLink - Zoom/Meet link (optional)
 * @param {string} calendarLink - Google Calendar link
 * @param {string} topic - Session topic/description
 * @returns {Promise<Object>} - Result object with success status
 */
export async function sendSessionConfirmationEmail(
  recipientEmail,
  recipient,
  otherParty,
  meetingTime,
  meetingLink,
  calendarLink,
  topic
) {
  console.log('📧 SENDING SESSION CONFIRMATION EMAIL')
  console.log('  ├─ To:', recipientEmail)
  console.log('  ├─ Recipient:', recipient.name, `(${recipient.role})`)
  console.log('  ├─ Other Party:', otherParty.name, `(${otherParty.role})`)
  console.log('  ├─ Meeting Time:', meetingTime)
  console.log('  └─ Meeting Link:', meetingLink || 'Not provided')

  // Format meeting time
  const meetingDate = new Date(meetingTime)
  const formattedTime = meetingDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  // MOCK MODE: Just log and return success
  if (USE_MOCK_EMAIL) {
    console.log('🔧 MOCK MODE: Email would be sent with this content:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('TO:', recipientEmail)
    console.log('SUBJECT: Session Confirmed: ' + topic + ' with ' + otherParty.name)
    console.log('\nBODY:')
    
    const emailBody = `Your mentorship session is set!

Time: ${formattedTime}
${meetingLink ? `Link: ${meetingLink}` : 'Location: To be determined'}

Topic: ${topic}

You'll be meeting with ${otherParty.name} (${otherParty.role === 'student' ? 'Student' : 'Mentor'}).

---

[Add to Google Calendar]
${calendarLink}

Click the link above to add this session to your Google Calendar.

We look forward to a productive session!

Best regards,
CMIS Engagement Platform Team
Texas A&M University - Mays Business School
`
    console.log(emailBody)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      mode: 'mock',
      emailContent: {
        to: recipientEmail,
        subject: `Session Confirmed: ${topic} with ${otherParty.name}`,
        body: emailBody,
        calendarLink: calendarLink
      }
    }
  }

  // Real EmailJS implementation would go here
  console.log('⚠️ Real email mode requires @emailjs/browser package')
  
  return {
    success: true,
    message: 'EmailJS package not installed - using mock mode',
    mode: 'fallback'
  }
}

/**
 * Send Re-engagement Email to Inactive Alumni
 * 
 * @param {string} alumniEmail - Alumni's email address
 * @param {string} alumniName - Alumni's name
 * @returns {Promise<Object>} - Result object with success status
 */
export async function sendReEngagementEmail(alumniEmail, alumniName) {
  console.log('📧 SENDING RE-ENGAGEMENT EMAIL')
  console.log('  ├─ To:', alumniEmail)
  console.log('  └─ Name:', alumniName)

  // MOCK MODE: Just log and return success
  if (USE_MOCK_EMAIL) {
    console.log('🔧 MOCK MODE: Email would be sent with this content:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('TO:', alumniEmail)
    console.log('SUBJECT: We miss you at Texas A&M University!')
    console.log('\nBODY:')
    
    const emailBody = `Hi ${alumniName},

It's been a while since we've seen you on the CMIS Engagement Platform! We miss your valuable contributions and expertise.

We have some exciting new student competitions coming up that could use your expertise as a judge or mentor. Your insights and experience would be incredibly valuable to our students.

Here's what's happening:
• New case competitions seeking industry judges
• Student mentorship opportunities
• Networking events and workshops
• Speaking opportunities

We'd love to have you back and re-engage with our community. Your participation makes a real difference in our students' professional development.

Click here to log in and see what's new: ${typeof window !== 'undefined' ? window.location.origin + '/industry' : 'http://localhost:3000/industry'}

If you have any questions or would like to discuss how you can get involved, please don't hesitate to reach out.

Looking forward to seeing you back on the platform!

Best regards,
CMIS Engagement Platform Team
Texas A&M University - Mays Business School
`
    console.log(emailBody)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      mode: 'mock',
      emailContent: {
        to: alumniEmail,
        subject: 'We miss you at Texas A&M University!',
        body: emailBody
      }
    }
  }

  // Real EmailJS implementation would go here
  console.log('⚠️ Real email mode requires @emailjs/browser package')
  
  return {
    success: true,
    message: 'EmailJS package not installed - using mock mode',
    mode: 'fallback'
  }
}

// Export configuration check
export { USE_MOCK_EMAIL }

