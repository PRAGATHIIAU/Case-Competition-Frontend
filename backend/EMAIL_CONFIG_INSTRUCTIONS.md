# Email Configuration Instructions

## Your Gmail App Password
You have: `dtwd upvk bgps gnvl`

**IMPORTANT:** Remove the spaces when adding to .env file:
```
dtwdupvkbgpsgnvl
```

## Step-by-Step Instructions

### Step 1: Open/Create .env file
Navigate to: `backend/.env`

### Step 2: Add these lines (replace with your actual values)

```env
# Email Configuration (Gmail)
EMAIL_USER=aupragathii@gmail.com
EMAIL_PASSWORD=dtwdupvkbgpsgnvl
FROM_EMAIL=aupragathii@gmail.com
ADMIN_EMAIL=aupragathii@gmail.com
```

**Important Notes:**
- `EMAIL_USER`: Your Gmail address (aupragathii@gmail.com)
- `EMAIL_PASSWORD`: Remove spaces from your app password → `dtwdupvkbgpsgnvl`
- `FROM_EMAIL`: Same as EMAIL_USER
- `ADMIN_EMAIL`: Can be the same or different email

### Step 3: Save the file

### Step 4: Restart Backend
1. Stop the backend (Ctrl+C in the terminal)
2. Start it again: `npm start` or `node server.js`

### Step 5: Test
1. Click RSVP on any event
2. Check your email inbox (aupragathii@gmail.com)
3. Check spam folder if not in inbox

## Verification

After restarting, check:
- Backend console should show: `📧 Email Configuration Check: ✅ Using Gmail SMTP configuration`
- When you RSVP, you should see: `✅ RSVP confirmation email sent successfully to [your email]`

## Troubleshooting

If emails still don't arrive:
1. Check backend console for error messages
2. Verify password has NO spaces: `dtwdupvkbgpsgnvl` (not `dtwd upvk bgps gnvl`)
3. Make sure 2-Step Verification is enabled on your Google account
4. Check spam/junk folder



