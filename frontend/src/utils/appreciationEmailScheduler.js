/**
 * Automated Appreciation Email Scheduler
 * 
 * This simulates a cron job system for sending thank-you emails to alumni
 * after they complete activities (speaking at events or judging competitions).
 * 
 * In a real backend, this would use node-cron to run daily.
 * For frontend testing, we provide a manual trigger function.
 */

import { sendSpeakerThankYou, sendJudgeThankYou } from './emailService'

/**
 * Process appreciation emails for completed activities
 * 
 * @param {Array} events - Array of event objects
 * @param {Array} competitions - Array of competition objects
 * @param {Array} alumni - Array of alumni/stakeholder objects
 * @param {Function} updateEvent - Function to update event in database
 * @param {Function} updateCompetition - Function to update competition in database
 * @returns {Promise<Object>} - Result with sent emails count and details
 */
export async function processAppreciationEmails(
  events,
  competitions,
  alumni,
  updateEvent,
  updateCompetition
) {
  console.log('🎉 PROCESSING APPRECIATION EMAILS...')
  console.log(`  ├─ Total events: ${events.length}`)
  console.log(`  ├─ Total competitions: ${competitions.length}`)
  console.log(`  └─ Total alumni: ${alumni.length}`)

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const sentEmails = []
  const skippedEmails = []

  // ============ PROCESS EVENTS ============
  
  // Find all events where date < Now (in the past) AND postEventEmailsSent is false
  const pastEvents = events.filter(event => {
    if (event.postEventEmailsSent) {
      return false // Already sent
    }
    
    const eventDate = new Date(event.date)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate < now
  })

  console.log(`  📅 Found ${pastEvents.length} past events needing thank-you emails`)

  for (const event of pastEvents) {
    try {
      // Check if event has speakers
      if (!event.speakers || event.speakers.length === 0) {
        console.log(`  ⏭️ Skipping ${event.title} - no speakers`)
        skippedEmails.push({
          type: 'event',
          event,
          reason: 'No speakers assigned'
        })
        continue
      }

      console.log(`  📧 Processing event: ${event.title} (${event.speakers.length} speaker(s))`)

      // Loop through speakers
      for (const speakerId of event.speakers) {
        try {
          // Find speaker in alumni database
          const speaker = alumni.find(a => a.id === speakerId)
          if (!speaker) {
            console.log(`  ⚠️ Speaker ${speakerId} not found in alumni database`)
            skippedEmails.push({
              type: 'speaker',
              event,
              speakerId,
              reason: 'Speaker not found in alumni database'
            })
            continue
          }

          console.log(`  📤 Sending thank-you email to ${speaker.name}...`)

          // Send thank-you email
          const emailResult = await sendSpeakerThankYou(
            speaker.email,
            speaker.name,
            event.title
          )

          if (emailResult.success) {
            sentEmails.push({
              type: 'speaker',
              event,
              speaker,
              emailResult
            })
            console.log(`  ✅ Thank-you email sent to ${speaker.name}`)
          } else {
            console.log(`  ❌ Failed to send email to ${speaker.name}`)
            skippedEmails.push({
              type: 'speaker',
              event,
              speaker,
              reason: `Email sending failed: ${emailResult.message}`
            })
          }
        } catch (error) {
          console.error(`  ❌ Error processing speaker ${speakerId}:`, error)
          skippedEmails.push({
            type: 'speaker',
            event,
            speakerId,
            reason: `Error: ${error.message}`
          })
        }
      }

      // Update event: mark postEventEmailsSent as true
      if (updateEvent) {
        updateEvent(event.id, { postEventEmailsSent: true })
        console.log(`  ✅ Marked ${event.title} as processed`)
      }
    } catch (error) {
      console.error(`  ❌ Error processing event ${event.id}:`, error)
      skippedEmails.push({
        type: 'event',
        event,
        reason: `Error: ${error.message}`
      })
    }
  }

  // ============ PROCESS COMPETITIONS ============
  
  // Find all competitions where endDate < Now (in the past) AND judgeThankYouSent is false
  const pastCompetitions = competitions.filter(competition => {
    if (competition.judgeThankYouSent) {
      return false // Already sent
    }
    
    // Use deadline as endDate if endDate doesn't exist
    const endDate = competition.endDate || competition.deadline
    if (!endDate) {
      return false // No end date
    }
    
    const competitionEndDate = new Date(endDate)
    competitionEndDate.setHours(0, 0, 0, 0)
    return competitionEndDate < now
  })

  console.log(`  🏆 Found ${pastCompetitions.length} past competitions needing thank-you emails`)

  for (const competition of pastCompetitions) {
    try {
      // Check if competition has judges
      if (!competition.judges || competition.judges.length === 0) {
        console.log(`  ⏭️ Skipping ${competition.name} - no judges`)
        skippedEmails.push({
          type: 'competition',
          competition,
          reason: 'No judges assigned'
        })
        continue
      }

      console.log(`  📧 Processing competition: ${competition.name} (${competition.judges.length} judge(s))`)

      // Loop through judges
      for (const judgeId of competition.judges) {
        try {
          // Find judge in alumni database
          const judge = alumni.find(a => a.id === judgeId)
          if (!judge) {
            console.log(`  ⚠️ Judge ${judgeId} not found in alumni database`)
            skippedEmails.push({
              type: 'judge',
              competition,
              judgeId,
              reason: 'Judge not found in alumni database'
            })
            continue
          }

          console.log(`  📤 Sending thank-you email to ${judge.name}...`)

          // Send thank-you email with feedback link
          const emailResult = await sendJudgeThankYou(
            judge.email,
            judge.name,
            competition.name,
            competition.id // Pass competition ID for feedback link
          )

          if (emailResult.success) {
            sentEmails.push({
              type: 'judge',
              competition,
              judge,
              emailResult
            })
            console.log(`  ✅ Thank-you email sent to ${judge.name}`)
          } else {
            console.log(`  ❌ Failed to send email to ${judge.name}`)
            skippedEmails.push({
              type: 'judge',
              competition,
              judge,
              reason: `Email sending failed: ${emailResult.message}`
            })
          }
        } catch (error) {
          console.error(`  ❌ Error processing judge ${judgeId}:`, error)
          skippedEmails.push({
            type: 'judge',
            competition,
            judgeId,
            reason: `Error: ${error.message}`
          })
        }
      }

      // Update competition: mark judgeThankYouSent as true
      if (updateCompetition) {
        updateCompetition(competition.id, { judgeThankYouSent: true })
        console.log(`  ✅ Marked ${competition.name} as processed`)
      }
    } catch (error) {
      console.error(`  ❌ Error processing competition ${competition.id}:`, error)
      skippedEmails.push({
        type: 'competition',
        competition,
        reason: `Error: ${error.message}`
      })
    }
  }

  console.log(`\n📊 APPRECIATION EMAIL SUMMARY:`)
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
 * // Run daily at 10:00 AM
 * cron.schedule('0 10 * * *', async () => {
 *   console.log('Running daily appreciation email check...')
 *   await processAppreciationEmails(events, competitions, alumni, updateEvent, updateCompetition)
 * })
 * ```
 * 
 * For frontend testing, this is called manually via the test endpoint.
 */
export function setupDailyAppreciationCronJob(processAppreciationEmailsFn) {
  console.log('⏰ Setting up daily appreciation cron job (simulated)')
  console.log('  ├─ Schedule: Daily at 10:00 AM')
  console.log('  ├─ Function: processAppreciationEmails')
  console.log('  └─ Note: In production, use node-cron on backend')
  
  // In a real backend, you would use:
  // const cron = require('node-cron')
  // cron.schedule('0 10 * * *', processAppreciationEmailsFn)
  
  // For frontend, we'll use setInterval (runs every 24 hours)
  // Note: This is just for demonstration - in production, use backend cron
  const intervalId = setInterval(() => {
    console.log('⏰ Daily appreciation cron job triggered (simulated)')
    processAppreciationEmailsFn()
  }, 24 * 60 * 60 * 1000) // 24 hours in milliseconds
  
  return intervalId
}

