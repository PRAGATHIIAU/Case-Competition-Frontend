# Email Troubleshooting Guide

## ✅ Email Test Passed!

The email test script (`node test-email.js`) shows that emails **ARE being sent successfully** from your backend.

**Message ID from test:** `<17386650-4ac8-ec74-ffe3-a144ed85f381@gmail.com>`

## 🔍 Why You Might Not See Emails

### 1. **Check Spam/Junk Folder** ⚠️
Gmail often filters automated emails to spam. Check:
- **Spam folder** in `darshilrayjada4154@gmail.com`
- **Promotions tab** (if using Gmail tabs)
- **All Mail** folder

### 2. **Email Delivery Delay**
- Gmail can take 1-5 minutes to deliver emails
- Sometimes longer during high traffic

### 3. **RSVP Endpoint Not Being Called**
Check backend logs when you click RSVP:
- Look for: `📧 Attempting to send RSVP confirmation email...`
- If you see: `❌ Failed to send RSVP confirmation email` → Check the error message

### 4. **User Email Mismatch**
The email is sent to the email address in the user's profile. Verify:
- The logged-in user's email matches `darshilrayjada4154@gmail.com`
- Or check the email in the user's profile settings

## 🧪 How to Test RSVP Email

1. **Make sure backend is running:**
   ```bash
   cd backend
   npm start
   ```

2. **Login as a student** with email: `darshilrayjada4154@gmail.com` (or update your profile email)

3. **Click RSVP** on any event

4. **Check backend console** for:
   ```
   📧 Attempting to send RSVP confirmation email...
   ✅ RSVP confirmation email sent successfully to [email]
   ```

5. **Check your inbox** (and spam folder) at `darshilrayjada4154@gmail.com`

## 🔧 Quick Fixes

### If emails are going to spam:
- Mark the email as "Not Spam"
- Add `darshilrayjada4154@gmail.com` to your contacts
- Gmail will learn to deliver future emails to inbox

### If RSVP endpoint is not being called:
- Check browser console for errors
- Verify you're logged in (check localStorage for `user` object)
- Check network tab in browser DevTools to see if `/api/events/:id/rsvp` is being called

### If you see authentication errors:
- Verify `EMAIL_PASSWORD` in `.env` is correct (no spaces)
- Generate a new Gmail App Password if needed
- Restart backend after updating `.env`

## 📊 Current Configuration

```env
EMAIL_USER=darshilrayjada4154@gmail.com ✅
EMAIL_PASSWORD=krmbwqpfbusmwdsg ✅
FROM_EMAIL=darshilrayjada4154@gmail.com ✅
SMTP_HOST=smtp.gmail.com ✅
SMTP_PORT=587 ✅
```

## 🎯 Next Steps

1. **Check spam folder** in `darshilrayjada4154@gmail.com`
2. **Click RSVP** on an event while logged in
3. **Watch backend console** for email logs
4. **Check browser console** for any frontend errors

If you still don't receive emails after checking spam, let me know what you see in the backend console when you click RSVP!



