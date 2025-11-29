# RSVP Email Debugging Guide

## Current Status
- ✅ Email configuration is working (test email sent successfully)
- ❌ RSVP emails not being sent when clicking RSVP button

## Debugging Steps

### 1. Check Frontend Console (Browser)
When you click RSVP, you should see:
```
🖱️ EventCard: RSVP button clicked!
📋 EnhancedStudentDashboard: handleRSVP called
🎯 ========== toggleEventRSVP CALLED ==========
📤 Frontend: Calling RSVP API...
🌐 API Request: POST /api/events/[id]/rsvp
📡 API Response status: [status]
```

### 2. Check Backend Console (Terminal)
When RSVP request reaches backend, you should see:
```
🎯 ========== RSVP REQUEST RECEIVED ==========
📥 Request details:
   ├─ Event ID: [id]
   ├─ User ID: [user_id]
📧 Attempting to send RSVP confirmation email...
✅ RSVP confirmation email sent successfully to [email]
```

### 3. Check Network Tab (Browser DevTools)
1. Open DevTools (F12)
2. Go to Network tab
3. Click RSVP
4. Look for request to `/api/events/[id]/rsvp`
5. Check:
   - Status code (should be 201)
   - Request payload (should have `user_id`)
   - Response (should have `emailSent: true`)

## Common Issues

### Issue 1: No Frontend Logs
**Symptom:** Clicking RSVP shows no console logs
**Cause:** Button click handler not firing
**Fix:** Check if button is disabled or event handler not attached

### Issue 2: Frontend Logs but No Backend Logs
**Symptom:** See frontend logs but backend shows nothing
**Cause:** Request not reaching backend (proxy/CORS issue)
**Fix:** 
- Check if backend is running on port 5000
- Check `vite.config.js` proxy settings
- Check browser Network tab for failed requests

### Issue 3: Backend Logs but Email Error
**Symptom:** See backend logs with email error
**Cause:** Email sending failed (check error message)
**Fix:** 
- Check error message in backend console
- Verify email config in `.env`
- Check if user email exists in database

### Issue 4: Event Not Found
**Symptom:** Backend shows "Event not found"
**Cause:** Event ID doesn't exist in database
**Fix:** 
- Check if events are seeded in database
- Verify event ID matches database ID
- Check if using string vs number ID mismatch

## Next Steps
1. Click RSVP and share ALL logs from:
   - Browser Console (F12 → Console)
   - Backend Terminal
   - Network Tab (F12 → Network → find `/api/events/.../rsvp` request)

This will help identify exactly where the issue is!



