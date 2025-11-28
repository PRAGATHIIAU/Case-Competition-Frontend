/**
 * Automated Follow-Up Email Scheduler
 * 
 * This simulates a cron job system for sending follow-up emails to stakeholders
 * who haven't replied to their invitations.
 * 
 * In a real backend, this would use node-cron to run daily.
 * For frontend testing, we provide a manual trigger function.
 */

import { sendFollowUpEmail } from './emailService'

/**
 * Check and send follow-up emails for pending invitations
 * 
 * @param {Array} invitations - Array of invitation objects
 * @param {Array} alumni - Array of stakeholder/alumni objects
 * @param {number} daysThreshold - Number of days to wait before sending follow-up (default: 3)
 * @param {number} maxFollowUps - Maximum number of follow-ups to send (default: 2)
 * @param {Function} updateInvitation - Function to update invitation in database
 * @returns {Promise<Object>} - Result with sent emails count and details
 */
export async function checkAndSendFollowUps(
  invitations,
  alumni,
  daysThreshold = 3,
  maxFollowUps = 2,
  updateInvitation
) {
  console.log('🔍 CHECKING FOR FOLLOW-UP EMAILS...')
  console.log(`  ├─ Threshold: ${daysThreshold} days`)
  console.log(`  ├─ Max Follow-ups: ${maxFollowUps}`)
  console.log(`  └─ Total invitations: ${invitations.length}`)

  const now = new Date()
  const sentEmails = []
  const skippedEmails = []

  // Find all pending invitations
  const pendingInvitations = invitations.filter(inv => inv.status === 'pending')
  console.log(`  📋 Found ${pendingInvitations.length} pending invitations`)

  for (const invitation of pendingInvitations) {
    try {
      // Find stakeholder
      const stakeholder = alumni.find(a => a.id === invitation.stakeholderId)
      if (!stakeholder) {
        console.log(`  ⚠️ Stakeholder not found for invitation ${invitation.id}`)
        continue
      }

      // Check if already sent max follow-ups
      if (invitation.followUpCount >= maxFollowUps) {
        skippedEmails.push({
          invitation,
          reason: `Already sent ${invitation.followUpCount} follow-ups (max: ${maxFollowUps})`
        })
        console.log(`  ⏭️ Skipping ${stakeholder.name} - max follow-ups reached`)
        continue
      }

      // Calculate days since last email
      const lastEmailDate = new Date(invitation.lastEmailSentAt || invitation.sentAt)
      const daysSinceLastEmail = Math.floor((now - lastEmailDate) / (1000 * 60 * 60 * 24))

      console.log(`  📊 ${stakeholder.name}: ${daysSinceLastEmail} days since last email, ${invitation.followUpCount} follow-ups sent`)

      // Check if threshold is met
      if (daysSinceLastEmail >= daysThreshold) {
        // Send follow-up email
        const followUpNumber = invitation.followUpCount + 1
        console.log(`  📧 Sending follow-up #${followUpNumber} to ${stakeholder.name}...`)

        const emailResult = await sendFollowUpEmail(
          stakeholder.email,
          stakeholder.name,
          invitation.competitionName,
          followUpNumber
        )

        if (emailResult.success) {
          // Update invitation
          if (updateInvitation) {
            updateInvitation(invitation.id, {
              lastEmailSentAt: now.toISOString(),
              followUpCount: followUpNumber
            })
          }

          sentEmails.push({
            invitation,
            stakeholder,
            followUpNumber,
            emailResult
          })

          console.log(`  ✅ Follow-up #${followUpNumber} sent to ${stakeholder.name}`)
        } else {
          console.log(`  ❌ Failed to send follow-up to ${stakeholder.name}`)
          skippedEmails.push({
            invitation,
            reason: `Email sending failed: ${emailResult.message}`
          })
        }
      } else {
        const daysRemaining = daysThreshold - daysSinceLastEmail
        console.log(`  ⏳ ${stakeholder.name}: ${daysRemaining} days remaining before follow-up`)
        skippedEmails.push({
          invitation,
          reason: `Only ${daysSinceLastEmail} days since last email (need ${daysThreshold})`
        })
      }
    } catch (error) {
      console.error(`  ❌ Error processing invitation ${invitation.id}:`, error)
      skippedEmails.push({
        invitation,
        reason: `Error: ${error.message}`
      })
    }
  }

  console.log(`\n📊 FOLLOW-UP EMAIL SUMMARY:`)
  console.log(`  ├─ Sent: ${sentEmails.length}`)
  console.log(`  └─ Skipped: ${skippedEmails.length}`)

  return {
    success: true,
    sentCount: sentEmails.length,
    skippedCount: skippedEmails.length,
    sentEmails,
    skippedEmails,
    timestamp: now.toISOString()
  }
}

/**
 * Simulated Cron Job Runner
 * 
 * In a real backend, this would be set up with node-cron:
 * 
 * ```javascript
 * const cron = require('node-cron')
 * 
 * // Run daily at 9:00 AM
 * cron.schedule('0 9 * * *', async () => {
 *   console.log('Running daily follow-up email check...')
 *   await checkAndSendFollowUps(invitations, alumni, 3, 2, updateInvitation)
 * })
 * ```
 * 
 * For frontend testing, this is called manually via the test endpoint.
 */
export function setupDailyCronJob(checkAndSendFollowUpsFn) {
  console.log('⏰ Setting up daily cron job (simulated)')
  console.log('  ├─ Schedule: Daily at 9:00 AM')
  console.log('  ├─ Function: checkAndSendFollowUps')
  console.log('  └─ Note: In production, use node-cron on backend')
  
  // In a real backend, you would use:
  // const cron = require('node-cron')
  // cron.schedule('0 9 * * *', checkAndSendFollowUpsFn)
  
  // For frontend, we'll use setInterval (runs every 24 hours)
  // Note: This is just for demonstration - in production, use backend cron
  const intervalId = setInterval(() => {
    console.log('⏰ Daily cron job triggered (simulated)')
    checkAndSendFollowUpsFn()
  }, 24 * 60 * 60 * 1000) // 24 hours in milliseconds
  
  return intervalId
}

