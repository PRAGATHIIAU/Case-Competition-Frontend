# EmailJS Setup Guide - Frontend Email Integration

## 🎯 Overview

This guide will help you set up EmailJS to send confirmation emails when students register for competitions **without needing a backend server**.

---

## 📦 1. Installation

The required package is already added to your project. If you need to install it manually:

```bash
npm install @emailjs/browser
```

Or:

```bash
yarn add @emailjs/browser
```

---

## 🔧 2. EmailJS Account Setup

### Step 1: Create Account
1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Click "Sign Up" (free tier allows 200 emails/month)
3. Verify your email address

### Step 2: Add Email Service
1. Click "Add New Service"
2. Choose your email provider:
   - **Gmail** (recommended for testing)
   - Outlook
   - Yahoo
   - Or use a custom SMTP
3. Connect your email account
4. **Copy your Service ID** (looks like: `service_abc123xyz`)

### Step 3: Create Email Template
1. Click "Email Templates" → "Create New Template"
2. Name it: `competition_registration`
3. **Copy your Template ID** (looks like: `template_xyz789`)

#### Template Configuration:

**Subject:**
```
Registration Confirmed - {{competition_name}}
```

**Content (HTML):**
```html
<h2>Registration Confirmed!</h2>

<p>Hi {{to_name}},</p>

<p>Congratulations! Your team "<strong>{{team_name}}</strong>" has been successfully registered for <strong>{{competition_name}}</strong>.</p>

<h3>Team Details:</h3>
<ul>
  <li><strong>Team Name:</strong> {{team_name}}</li>
  <li><strong>Team ID:</strong> {{team_id}}</li>
  <li><strong>Competition:</strong> {{competition_name}}</li>
</ul>

<h3>Next Steps:</h3>
<ol>
  <li>Share your Team ID ({{team_id}}) with your team members</li>
  <li>Prepare your submission materials</li>
  <li>Check the competition deadline: {{submission_deadline}}</li>
  <li>Submit your final work through the platform: {{platform_url}}</li>
</ol>

<p>Good luck! We're excited to see what you create.</p>

<p><strong>Best regards,</strong><br>
CMIS Engagement Platform Team<br>
Texas A&M University - Mays Business School</p>
```

**To Email:**
```
{{to_email}}
```

**Template Variables (auto-filled by code):**
- `to_email` - Recipient email
- `to_name` - Student name
- `team_name` - Team name
- `team_id` - Generated team ID
- `competition_name` - Competition name
- `submission_deadline` - Deadline text
- `platform_url` - Platform URL

4. Click "Save"

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. Find **Public Key** (User ID)
3. **Copy this key** (looks like: `user_AbCdEfGhIjKlMnOp`)

---

## ⚙️ 3. Configure Your Project

### Update `src/utils/emailService.js`:

1. Open `frontend/src/utils/emailService.js`
2. Find the configuration section:

```javascript
// Toggle this to test without EmailJS account
const USE_MOCK_EMAIL = true  // ← Change to FALSE when ready

// EmailJS Credentials
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_xxxxxxx',      // ← Replace with YOUR Service ID
  TEMPLATE_ID: 'template_xxxxxxx',    // ← Replace with YOUR Template ID
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY_HERE'  // ← Replace with YOUR Public Key
}
```

3. Replace the placeholder values:

```javascript
const USE_MOCK_EMAIL = false  // ✅ Set to false to use real emails

const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc123xyz',           // ✅ Your actual Service ID
  TEMPLATE_ID: 'template_xyz789',            // ✅ Your actual Template ID
  PUBLIC_KEY: 'user_AbCdEfGhIjKlMnOp'        // ✅ Your actual Public Key
}
```

4. Save the file

---

## 🧪 4. Testing

### Test with Mock Mode (No EmailJS Account Needed)

**Current State:** `USE_MOCK_EMAIL = true`

1. Go to: `http://localhost:3000/student`
2. Click "Competitions" tab
3. Click "Register for Competition"
4. Open Browser Console (F12)
5. **See the email content logged:**

```
📧 SENDING REGISTRATION CONFIRMATION EMAIL
  ├─ To: john.doe@tamu.edu
  ├─ Student: John Doe
  ├─ Team: My Team
  ├─ Competition: Case Competition 2024
  └─ Team ID: TEAM-ABC123-XYZ4

🔧 MOCK MODE: Email would be sent with this content:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TO: john.doe@tamu.edu
SUBJECT: Registration Confirmed - Case Competition 2024

BODY:
Hi John Doe,

Congratulations! Your team "My Team" has been successfully registered...
```

### Test with Real EmailJS

**After Configuration:** `USE_MOCK_EMAIL = false`

1. Save `emailService.js` with your credentials
2. Refresh the app
3. Register for competition
4. **Check your email inbox!**
5. You should receive the confirmation email

---

## 📊 5. Verify Installation

### Check if EmailJS is configured:

Open Browser Console and type:

```javascript
import { getEmailServiceStatus } from './src/utils/emailService'

const status = getEmailServiceStatus()
console.log(status)
```

**Expected Output:**

```javascript
{
  mockMode: false,
  configured: true,
  ready: true
}
```

---

## 🔍 6. Debugging

### Email Not Sending?

**Check 1: Console Logs**
```
Look for:
✅ "Email sent successfully"
OR
❌ "Email sending failed: [error message]"
```

**Check 2: EmailJS Dashboard**
1. Go to EmailJS Dashboard
2. Click "Email History"
3. See if request was received
4. Check for errors

**Check 3: Credentials**
```javascript
// In emailService.js
console.log('Service ID:', EMAILJS_CONFIG.SERVICE_ID)
console.log('Template ID:', EMAILJS_CONFIG.TEMPLATE_ID)
console.log('Public Key:', EMAILJS_CONFIG.PUBLIC_KEY)
```

**Common Issues:**

| Error | Solution |
|-------|----------|
| "Service ID is not valid" | Check Service ID from EmailJS dashboard |
| "Template ID is not found" | Verify Template ID matches template name |
| "Public Key is invalid" | Copy Public Key from Account settings |
| "Limit reached" | Free tier: 200 emails/month - upgrade or wait |
| "Invalid template variables" | Ensure template uses {{variable_name}} syntax |

---

## 🎨 7. Customization

### Change Email Template Style

In EmailJS Dashboard → Your Template:

**Add CSS styling:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background-color: white; padding: 30px; border-radius: 10px;">
    <div style="background-color: #500000; color: white; padding: 20px; text-align: center; border-radius: 5px;">
      <h2>Registration Confirmed!</h2>
    </div>
    
    <p>Hi {{to_name}},</p>
    
    <div style="background-color: #f0f0f0; padding: 15px; border-left: 4px solid #500000; margin: 20px 0;">
      <strong>Team ID:</strong> {{team_id}}
    </div>
    
    <!-- Rest of content -->
  </div>
</div>
```

### Add More Email Types

**In `emailService.js`:**

```javascript
export async function sendSubmissionConfirmation(email, teamName, fileName) {
  // Already implemented - see file
}

export async function sendTeamInvitation(email, teamName, inviterName) {
  // Already implemented - see file
}

// Add your own:
export async function sendDeadlineReminder(email, competitionName, hoursLeft) {
  const templateParams = {
    to_email: email,
    competition_name: competitionName,
    hours_remaining: hoursLeft
  }
  
  await emailjs.send(
    EMAILJS_CONFIG.SERVICE_ID,
    'template_deadline_reminder',  // Create this template
    templateParams
  )
}
```

---

## 💰 8. Pricing & Limits

### Free Tier:
- ✅ 200 emails/month
- ✅ 2 email services
- ✅ 2 email templates
- ✅ 50 emails/day max

### Paid Plans:
- **Personal:** $7/month - 1,000 emails
- **Professional:** $15/month - 5,000 emails
- **Enterprise:** Custom pricing

**For Demo/Competition:** Free tier is sufficient!

---

## 📚 9. Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS React Guide](https://www.emailjs.com/docs/examples/reactjs/)
- [Template Variables Guide](https://www.emailjs.com/docs/user-guide/template-variables/)
- [Email History & Analytics](https://dashboard.emailjs.com/admin/history)

---

## ✅ 10. Quick Start Checklist

- [ ] Create EmailJS account
- [ ] Add email service (Gmail recommended)
- [ ] Create email template with variables
- [ ] Copy Service ID, Template ID, Public Key
- [ ] Update `emailService.js` with credentials
- [ ] Change `USE_MOCK_EMAIL` to `false`
- [ ] Test registration with real email
- [ ] Check inbox for confirmation email
- [ ] Verify in EmailJS dashboard

---

## 🎯 Current Status

### ✅ Already Implemented:
- Email service utility (`emailService.js`)
- Mock mode for testing without account
- Registration confirmation integration
- Loading states and error handling
- Console logging for debugging
- Multiple email types (registration, submission, invitation)

### 🔧 You Need To Do:
1. Create EmailJS account (5 minutes)
2. Configure credentials (2 minutes)
3. Test with real email (1 minute)

**Total setup time: ~10 minutes**

---

## 💡 Tips

1. **Use Mock Mode First**: Test the UI flow before setting up EmailJS
2. **Gmail Works Best**: For testing, Gmail is the easiest to set up
3. **Check Spam Folder**: First emails might land in spam
4. **Test Template Variables**: Send a test email from EmailJS dashboard first
5. **Monitor Usage**: Check EmailJS dashboard to avoid hitting limits

---

## 🆘 Need Help?

**If emails aren't sending:**
1. Check browser console for errors
2. Verify credentials in `emailService.js`
3. Check EmailJS dashboard → Email History
4. Ensure template variables match
5. Try sending test email from EmailJS dashboard first

**Still stuck?**
- EmailJS has great support: [https://www.emailjs.com/contact](https://www.emailjs.com/contact)
- Check their documentation: [https://www.emailjs.com/docs](https://www.emailjs.com/docs)

---

**You're all set! The email system is ready to go once you add your EmailJS credentials. 🎉**

