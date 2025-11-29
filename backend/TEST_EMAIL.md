# Test Email Configuration

## Your Current Setup ✅
- Email User: `aupragathii@gmail.com`
- Email Password: `dtwdupvkbgpsgnvl` (correctly formatted, no spaces)
- From Email: `aupragathii@gmail.com`

## Next Steps:

### 1. Restart Backend Server
**IMPORTANT:** After updating .env, you MUST restart the backend:
- Stop the backend (Ctrl+C in the terminal where it's running)
- Start it again: `npm start` or `node server.js`

### 2. Test RSVP
1. Go to your frontend
2. Click RSVP on any event
3. Check the **backend console** for these logs:
   ```
   📧 Email Configuration Check:
      ├─ EMAIL_USER: aup*** ✅
      ├─ EMAIL_PASSWORD: ***SET*** ✅
      ├─ FROM_EMAIL: aupragathii@gmail.com ✅
   📧 Attempting to send RSVP confirmation email...
   ✅ RSVP confirmation email sent successfully to [your email]
   ```

### 3. Check Your Email
- Check inbox: `aupragathii@gmail.com`
- Check **Spam/Junk** folder (Gmail sometimes filters automated emails)
- Subject line: "Event Registration Confirmation: [Event Name]"

### 4. If Still Not Working

**Check backend console for errors:**
- If you see: `❌ Failed to send RSVP confirmation email`
- Look for the error message below it
- Common errors:
  - "Email authentication failed" → Password might be wrong
  - "Could not connect to SMTP server" → Internet/firewall issue
  - "Email configuration not set" → .env file not loaded (restart backend)

**Verify Gmail App Password:**
1. Go to: https://myaccount.google.com/apppasswords
2. Make sure the password you're using matches
3. If you generated a new one, update .env and restart backend

## Quick Test Command
After restarting backend, visit:
```
http://localhost:5000/api/email/check
```

Should show: `"emailConfigured": true`



