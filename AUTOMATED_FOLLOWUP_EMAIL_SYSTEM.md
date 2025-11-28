# Automated Follow-Up Email System - Implementation Summary

## Overview

This system automatically sends follow-up reminder emails to stakeholders who haven't replied to their judge invitations after 3 days. It includes a daily cron job simulation and a test endpoint for immediate testing.

---

## ✅ Implementation Complete

### 1. Database Schema Updates

**File**: `frontend/src/data/mockData.js`

**Added Fields to Invitation Schema**:
- `lastEmailSentAt: Date` - Timestamp of last email sent (invitation or follow-up)
- `followUpCount: Number` - Number of follow-up emails sent (default: 0, max: 2)

**Example**:
```javascript
{
  id: 1,
  competitionId: 1,
  stakeholderId: 201,
  status: "pending",
  sentAt: "2024-01-15T10:05:00",
  lastEmailSentAt: "2024-01-15T10:05:00", // Updated when follow-up is sent
  followUpCount: 0 // Incremented with each follow-up
}
```

### 2. Email Template Function

**File**: `frontend/src/utils/emailService.js`

- **Function**: `sendFollowUpEmail(stakeholderEmail, stakeholderName, competitionName, followUpCount)`
- **Subject**: "Follow Up: Invitation to Judge [Competition Name]"
- **Body**: Professional reminder message
- **Mode**: Supports Mock Mode (console logging) and Real Mode (EmailJS)

### 3. Follow-Up Scheduler Logic

**File**: `frontend/src/utils/followUpEmailScheduler.js`

- **Function**: `checkAndSendFollowUps(invitations, alumni, daysThreshold, maxFollowUps, updateInvitation)`
- **Logic**:
  1. Finds all invitations with `status: 'pending'`
  2. Calculates days since `lastEmailSentAt`
  3. Checks if `daysSinceLastEmail >= daysThreshold` (default: 3 days)
  4. Checks if `followUpCount < maxFollowUps` (default: 2)
  5. Sends follow-up email if conditions met
  6. Updates `lastEmailSentAt` and increments `followUpCount`

### 4. Backend API (Simulated)

**File**: `frontend/src/contexts/MockDataContext.jsx`

- **Function**: `triggerFollowUpEmails(daysThreshold, maxFollowUps, testMode)`
  - Production mode: Uses specified threshold (default: 3 days)
  - Test mode: Uses 0 days threshold for immediate testing

- **Function**: `testTriggerFollowUps()`
  - Test endpoint that triggers immediately (ignores 3-day rule)
  - Equivalent to `POST /api/test/trigger-followups`

### 5. Frontend UI (Admin Dashboard)

**File**: `frontend/src/components/admin/StakeholderInvitationsList.jsx`

- **Test Button**: "Test Follow-Up Emails" button in yellow box
- **Features**:
  - Triggers follow-up check immediately
  - Shows loading state while processing
  - Displays success/error toast notifications
  - Refreshes invitation list after completion
  - Shows count of emails sent and skipped

---

## 🔄 Workflow

### Daily Cron Job (Production):
```
Every day at 9:00 AM:
  1. checkAndSendFollowUps() runs automatically
  2. Finds pending invitations older than 3 days
  3. Sends follow-up emails (max 2 per invitation)
  4. Updates lastEmailSentAt and followUpCount
  5. Logs results
```

### Test Trigger (Development):
```
Admin clicks "Test Follow-Up Emails" button:
  1. testTriggerFollowUps() called immediately
  2. Uses 0-day threshold (ignores 3-day rule)
  3. Processes all eligible invitations
  4. Shows results in toast notification
  5. Refreshes invitation list
```

---

## 🧪 Testing

### Test the Follow-Up System:
1. **Navigate to**: `http://localhost:3000/faculty`
2. **Click**: "Judge Invitations" tab
3. **Scroll down**: Find the yellow "Follow-Up Email System" box
4. **Click**: "Test Follow-Up Emails" button
5. **See**: Loading spinner → Success toast
6. **Check Console**: See detailed logs of email sending
7. **Verify**: Invitations updated with new `followUpCount` and `lastEmailSentAt`

### Expected Console Output:
```
🚀 TRIGGERING FOLLOW-UP EMAIL CHECK...
  ⚠️ TEST MODE: Ignoring 3-day threshold (using 0 days)
🔍 CHECKING FOR FOLLOW-UP EMAILS...
  ├─ Threshold: 0 days
  ├─ Max Follow-ups: 2
  └─ Total invitations: 5
  📋 Found 2 pending invitations
  📊 Sarah Johnson: 5 days since last email, 0 follow-ups sent
  📧 Sending follow-up #1 to Sarah Johnson...
📧 SENDING FOLLOW-UP EMAIL
  ├─ To: sarah.johnson@exxonmobil.com
  ├─ Name: Sarah Johnson
  ├─ Competition: Case Competition 2024
  └─ Follow-up #: 1
  ✅ Follow-up #1 sent to Sarah Johnson

📊 FOLLOW-UP EMAIL SUMMARY:
  ├─ Sent: 1
  └─ Skipped: 1
✅ Follow-up email check completed
```

---

## 📁 Files Created/Modified

### New Files:
1. `frontend/src/utils/followUpEmailScheduler.js` - Follow-up email logic and cron job simulation

### Modified Files:
1. `frontend/src/data/mockData.js` - Added `lastEmailSentAt` and `followUpCount` to invitations
2. `frontend/src/utils/emailService.js` - Added `sendFollowUpEmail()` function
3. `frontend/src/contexts/MockDataContext.jsx` - Added `triggerFollowUpEmails()` and `testTriggerFollowUps()`
4. `frontend/src/components/admin/StakeholderInvitationsList.jsx` - Added test trigger button

---

## 🎯 Key Features

✅ **Automatic Checking**: Finds pending invitations older than threshold  
✅ **Smart Filtering**: Only sends if follow-up count < max (prevents spam)  
✅ **Email Tracking**: Updates `lastEmailSentAt` and `followUpCount`  
✅ **Test Mode**: Immediate trigger for testing (ignores 3-day rule)  
✅ **Detailed Logging**: Console logs show full process  
✅ **UI Integration**: Test button in admin dashboard  
✅ **Success Feedback**: Toast notifications with results  

---

## 📝 Email Template

**Subject**: `Follow Up: Invitation to Judge [Competition Name]`

**Body**:
```
Hi [Stakeholder Name],

Just floating this to the top of your inbox. We would love to have you as a judge for our upcoming competition:

Competition: [Competition Name]

Your expertise would be invaluable in evaluating the submissions. We understand you're busy, but we'd greatly appreciate your participation.

Please let us know if you're available by responding to this email or through the platform dashboard.

Thank you for your consideration!

Best regards,
CMIS Engagement Platform Team
Texas A&M University - Mays Business School
```

---

## 🔧 Backend Integration (For Real Backend)

### Install node-cron:
```bash
npm install node-cron
```

### Setup Cron Job:
```javascript
// jobs/emailScheduler.js
const cron = require('node-cron')
const { checkAndSendFollowUps } = require('../utils/followUpEmailScheduler')
const Invitation = require('../models/Invitation')
const Alumni = require('../models/Alumni')

// Run daily at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('⏰ Running daily follow-up email check...')
  
  const invitations = await Invitation.find({ status: 'pending' })
  const alumni = await Alumni.find({ role: { $in: ['alumni', 'mentor'] } })
  
  await checkAndSendFollowUps(
    invitations,
    alumni,
    3, // 3 days threshold
    2, // max 2 follow-ups
    async (invitationId, updates) => {
      await Invitation.findByIdAndUpdate(invitationId, updates)
    }
  )
})
```

### Test Endpoint:
```javascript
// routes/test.js
router.post('/api/test/trigger-followups', async (req, res) => {
  try {
    const invitations = await Invitation.find({ status: 'pending' })
    const alumni = await Alumni.find({ role: { $in: ['alumni', 'mentor'] } })
    
    const result = await checkAndSendFollowUps(
      invitations,
      alumni,
      0, // 0 days for testing
      2,
      async (invitationId, updates) => {
        await Invitation.findByIdAndUpdate(invitationId, updates)
      }
    )
    
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

---

## 📊 Sample Data

The system includes a test invitation that's ready for follow-up:
- **Michael Chen** - Case Competition 2024
- Sent: 5+ days ago
- Status: pending
- Follow-up Count: 0
- **Will trigger follow-up in test mode**

---

## 🔮 Future Enhancements

- Customizable follow-up intervals (e.g., 3 days, 7 days, 14 days)
- Different email templates for 1st vs 2nd follow-up
- Automatic escalation to admin after max follow-ups
- Analytics dashboard showing follow-up effectiveness
- Integration with real email service (Nodemailer/EmailJS)

---

**Implementation Status**: ✅ Complete and Ready for Testing

