/**
 * Automated Stakeholder Invitation System
 * 
 * This utility handles the matching logic for automatically inviting
 * Alumni/Judges to competitions based on their expertise.
 */

/**
 * Find matching stakeholders for a competition
 * @param {Object} competition - Competition object with requiredExpertise array
 * @param {Array} stakeholders - Array of alumni/mentor objects with expertise array
 * @returns {Array} Array of matched stakeholders with match details
 */
export function findMatchingStakeholders(competition, stakeholders) {
  if (!competition.requiredExpertise || competition.requiredExpertise.length === 0) {
    console.log('⚠️ Competition has no requiredExpertise specified')
    return []
  }

  if (!stakeholders || stakeholders.length === 0) {
    console.log('⚠️ No stakeholders available for matching')
    return []
  }

  const matches = []

  stakeholders.forEach(stakeholder => {
    // Check if stakeholder has expertise array
    if (!stakeholder.expertise || stakeholder.expertise.length === 0) {
      return // Skip stakeholders without expertise
    }

    // Find intersection between competition requirements and stakeholder expertise
    const matchedSkills = competition.requiredExpertise.filter(skill =>
      stakeholder.expertise.some(exp => 
        exp.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(exp.toLowerCase())
      )
    )

    // If there's at least one match, add to results
    if (matchedSkills.length > 0) {
      matches.push({
        stakeholder,
        matchedSkills,
        matchCount: matchedSkills.length,
        matchReason: `Matched based on your expertise in ${matchedSkills.join(', ')}`
      })
    }
  })

  // Sort by number of matches (descending)
  matches.sort((a, b) => b.matchCount - a.matchCount)

  console.log(`✅ Found ${matches.length} matching stakeholders for competition: ${competition.name}`)
  matches.forEach(match => {
    console.log(`  ├─ ${match.stakeholder.name}: ${match.matchedSkills.join(', ')}`)
  })

  return matches
}

/**
 * Generate judge invitations for a competition
 * @param {Object} competition - Competition object
 * @param {Array} stakeholders - Array of alumni/mentor objects
 * @returns {Array} Array of invitation objects
 */
export function generateJudgeInvites(competition, stakeholders) {
  const matches = findMatchingStakeholders(competition, stakeholders)
  
  const invitations = matches.map((match, index) => ({
    id: Date.now() + index, // Generate unique ID
    competitionId: competition.id,
    competitionName: competition.name,
    stakeholderId: match.stakeholder.id,
    stakeholderName: match.stakeholder.name,
    stakeholderEmail: match.stakeholder.email,
    status: 'pending',
    matchReason: match.matchReason,
    matchedSkills: match.matchedSkills,
    sentAt: new Date().toISOString(),
    respondedAt: null
  }))

  return invitations
}

/**
 * Simulate sending invitation email
 * @param {Object} invitation - Invitation object
 */
export function sendInvitationEmail(invitation) {
  const emailContent = {
    to: invitation.stakeholderEmail,
    subject: `Invitation to Judge: ${invitation.competitionName}`,
    body: `
Hello ${invitation.stakeholderName},

Given your background in ${invitation.matchedSkills.join(', ')}, we would love for you to judge our upcoming competition:

Competition: ${invitation.competitionName}
Match Reason: ${invitation.matchReason}

We believe your expertise would be invaluable in evaluating the submissions.

Please review the invitation in your dashboard and let us know if you're available.

Best regards,
CMIS Engagement Platform Team
    `.trim()
  }

  // In production, this would use EmailJS or a backend email service
  console.log('📧 SENDING JUDGE INVITATION EMAIL')
  console.log('  ├─ To:', emailContent.to)
  console.log('  ├─ Subject:', emailContent.subject)
  console.log('  └─ Body:', emailContent.body)

  return {
    success: true,
    emailContent
  }
}

