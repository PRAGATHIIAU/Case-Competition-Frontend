# Quick Email Setup for RSVP Confirmations

## Problem
You're not receiving RSVP confirmation emails because email configuration is missing.

## Solution: Set Up Gmail (5 minutes)

### Step 1: Generate Gmail App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Enable **2-Step Verification** if not already enabled
3. Generate App Password:
   - **App**: Mail
   - **Device**: Other (Custom name) → "Case Competition Backend"
4. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Add to .env File
Create or edit `backend/.env` file and add:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
FROM_EMAIL=your-email@gmail.com
ADMIN_EMAIL=admin@example.com
```

**Important:**
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASSWORD`: The 16-character App Password (remove spaces: `abcdefghijklmnop`)
- `FROM_EMAIL`: Same as EMAIL_USER
- `ADMIN_EMAIL`: Where admin notifications go

### Step 3: Restart Backend
```bash
# Stop the backend (Ctrl+C)
# Then restart:
cd backend
npm start
```

### Step 4: Test
1. Click RSVP on any event
2. Check your email inbox (and spam folder)
3. Check backend console for email logs

## Troubleshooting

### Check Backend Console
When you click RSVP, you should see:
```
📧 Email Configuration Check:
   ├─ EMAIL_USER: abc*** (should show, not "NOT SET")
   ├─ EMAIL_PASSWORD: ***SET*** (should show, not "NOT SET")
   ├─ FROM_EMAIL: your-email@gmail.com
```

If you see "NOT SET", your .env file is not configured correctly.

### Common Errors

**"Email configuration not set"**
- Solution: Add to `backend/.env` file (not `.env.example`)

**"Email authentication failed"**
- Solution: Use App Password, not your regular Gmail password

**"Could not connect to SMTP server"**
- Solution: Check internet connection and firewall settings

## Alternative: Use Outlook
If you prefer Outlook, use:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-outlook-app-password
FROM_EMAIL=your-email@outlook.com
```



