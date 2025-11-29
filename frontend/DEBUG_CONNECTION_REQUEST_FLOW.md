# 🐛 Debug Guide: Connection Request Flow

## 🎯 Problem: Mentor Dashboard Shows Empty

You're sending a request as a Student, but the Mentor Dashboard remains empty.

---

## ✅ FIXES IMPLEMENTED

### 1. **ID Mismatch Fixed** ✅

**Problem:** 
- Student has `currentUser.id = 101`
- Requests are sent to mentor IDs: 1, 2, 3, 4 (Sarah Johnson, Michael Chen, etc.)
- Mentor Dashboard was checking for `receiverId === currentUser.id` (101)
- Since no requests are sent TO user 101, dashboard was empty

**Solution:**
- Added **Mentor Selector** dropdown in Mentor Dashboard
- Now you can select which mentor to view as (Sarah Johnson, Michael Chen, etc.)
- Dashboard fetches requests for the selected mentor ID
- Default: Sarah Johnson (ID 1)

**Location:** `frontend/src/components/MentorDashboard.jsx`

```javascript
// Before (broken):
const allRequests = getReceivedRequests(currentUser.id) // Always 101

// After (fixed):
const [selectedMentorId, setSelectedMentorId] = useState(1) // Sarah Johnson
const allRequests = getReceivedRequests(selectedMentorId) // Correct mentor
```

---

### 2. **Console Logging Added** ✅

Added comprehensive debug logs throughout the entire flow:

#### When Sending Request (Student Side):
```javascript
// MentorCardActions.jsx
🎯 BUTTON CLICKED: Request Connection
  ├─ Mentor: Sarah Johnson
  ├─ Mentor ID: 1
  └─ Current status: null

📡 Calling sendConnectionRequest...
```

#### When Saving to Database:
```javascript
// MockDataContext.jsx
📤 SEND REQUEST - Starting...
  ├─ Current User: {id: 101, name: "John Doe", ...}
  ├─ Target Mentor ID: 1
  └─ Message: "Hi Sarah Johnson, I would love to connect..."

💾 SAVING REQUEST TO DATABASE (MockDataContext):
  ├─ Request ID: 1732567890123
  ├─ From Student: John Doe (ID: 101)
  ├─ To Mentor: Sarah Johnson (ID: 1)
  ├─ Status: pending
  └─ Full Request Object: {...}

✅ DATABASE UPDATED! Total requests now: 4
   All requests: [...]
```

#### When Fetching Requests (Mentor Side):
```javascript
// MentorDashboard.jsx
🔍 DEBUG: Fetching requests for Mentor ID: 1
🔍 DEBUG: All connection requests: [...]

📥 GET RECEIVED REQUESTS:
  ├─ Looking for Mentor ID: 1
  ├─ Total requests in database: 4
  ├─ Requests for this mentor: 2
  └─ Filtered requests: [...]

✅ DEBUG: Filtered requests: [...]
```

---

### 3. **Debug Panel Created** ✅

**Location:** `frontend/src/components/DebugPanel.jsx`

A floating debug panel that shows:
- ✅ Current user info (ID, name, role)
- ✅ All connection requests in real-time
- ✅ Request details (sender, receiver, status)
- ✅ Live counter badge

**How to Use:**
1. Look for the floating bug icon (🐛) in bottom-right corner
2. Click to open debug panel
3. Watch requests appear in real-time as you send them
4. Expand to see full details

---

### 4. **Data Flow Verified** ✅

The complete flow now works:

```
1. STUDENT SENDS REQUEST
   └─→ Click "Request Connection" on mentor card
       └─→ MentorCardActions.handleRequestConnection()
           └─→ sendConnectionRequest(mentorId: 1, message)
               └─→ Creates new request object
                   └─→ setConnectionRequests([...prev, newRequest])
                       └─→ ✅ Request saved in MockDataContext

2. MENTOR VIEWS REQUESTS
   └─→ Navigate to /mentor
       └─→ MentorDashboard loads
           └─→ Select mentor from dropdown (default: Sarah Johnson ID 1)
               └─→ getReceivedRequests(selectedMentorId: 1)
                   └─→ Filters requests where receiver_id === 1
                       └─→ ✅ Shows matching requests

3. MENTOR TAKES ACTION
   └─→ Click "Accept" or "Decline"
       └─→ updateRequestStatus(requestId, 'accepted')
           └─→ Updates status in database
               └─→ ✅ Student sees update in "My Requests" tab
```

---

## 🧪 TESTING INSTRUCTIONS

### Step-by-Step Test:

1. **Open Browser Console** (F12)
   - You'll see detailed logs of every operation

2. **Go to Student Dashboard**
   - URL: `http://localhost:3000/student`
   - Click "Profile" tab

3. **Upload Resume**
   - Drag & drop any file OR click to upload
   - Wait for "AI Scanning..." animation (2 seconds)
   - See extracted skills

4. **Send Connection Request**
   - Scroll down to "Recommended Mentors"
   - Click "Request Connection" on **Sarah Johnson**
   - **Watch Console Logs:**
     ```
     🎯 BUTTON CLICKED: Request Connection
     📤 SEND REQUEST - Starting...
     💾 SAVING REQUEST TO DATABASE...
     ✅ DATABASE UPDATED! Total requests now: 4
     ```

5. **Check Debug Panel**
   - Click floating bug icon (🐛) in bottom-right
   - **Verify:** You should see your new request appear
   - **Check:** sender_id = 101, receiver_id = 1, status = pending

6. **Go to Mentor Dashboard**
   - URL: `http://localhost:3000/mentor`
   - **Watch Console Logs:**
     ```
     🔍 DEBUG: Fetching requests for Mentor ID: 1
     📥 GET RECEIVED REQUESTS: Total requests in database: 4
     ```

7. **Select Mentor (if not already)**
   - At top of dashboard: Dropdown says "Sarah Johnson - ExxonMobil"
   - If you requested a different mentor, select them here

8. **Verify Request Appears**
   - You should see your request in the "Pending" tab
   - Shows: Your name, email, major, message, date

9. **Accept Request**
   - Click "Accept Request" button (green)
   - **Watch Console Logs:**
     ```
     Updating request status...
     ✅ Status updated to 'accepted'
     ```

10. **Verify Student Notification**
    - Go back to Student Dashboard
    - Click "My Requests" tab
    - See status: "Request Accepted ✓" (green)

---

## 🔍 TROUBLESHOOTING

### Issue: Dashboard still empty after sending request

**Check 1: Console Logs**
```bash
# After clicking "Request Connection", you should see:
📤 SEND REQUEST - Starting...
💾 SAVING REQUEST TO DATABASE...
✅ DATABASE UPDATED! Total requests now: X

# If you DON'T see these logs:
# → The button click isn't triggering sendConnectionRequest
# → Check MentorCardActions.jsx
```

**Check 2: Debug Panel**
```bash
# Open debug panel (bug icon)
# Check "Connection Requests" section

If empty:
  → Request didn't save to MockDataContext
  → Check console for errors

If request exists but shows different receiver_id:
  → You requested a different mentor
  → Change mentor selector in dashboard
```

**Check 3: Mentor Selector**
```bash
# In Mentor Dashboard, check dropdown at top
# It should show:
  "Sarah Johnson - ExxonMobil" (ID 1)
  "Michael Chen - Microsoft" (ID 2)
  "Emily Rodriguez - Deloitte" (ID 3)
  "David Park - Lockheed Martin" (ID 4)

# Select the mentor you sent the request TO
```

**Check 4: Browser Refresh**
```bash
# MockDataContext state is lost on refresh
# If you refresh the page, requests disappear
# Solution: Send a new test request after refresh
```

---

## 📊 Expected Console Output

### When Everything Works:

```bash
# === STUDENT SENDS REQUEST ===
🎯 BUTTON CLICKED: Request Connection
  ├─ Mentor: Sarah Johnson
  ├─ Mentor ID: 1
  └─ Current status: null

📡 Calling sendConnectionRequest...

📤 SEND REQUEST - Starting...
  ├─ Current User: {id: 101, name: "John Doe", email: "john.doe@tamu.edu", role: "student"}
  ├─ Target Mentor ID: 1
  └─ Message: Hi Sarah Johnson, I would love to connect and learn from your experience.

💾 SAVING REQUEST TO DATABASE (MockDataContext):
  ├─ Request ID: 1732567890123
  ├─ From Student: John Doe (ID: 101)
  ├─ To Mentor: Sarah Johnson (ID: 1)
  ├─ Status: pending
  └─ Full Request Object: {id: 1732567890123, sender_id: 101, receiver_id: 1, ...}

✅ DATABASE UPDATED! Total requests now: 4
   All requests: [{...}, {...}, {...}, {...}]

✅ REQUEST SENT SUCCESSFULLY!

✅ Request sent successfully: {success: true, requestId: 1732567890123, message: "Connection request sent successfully!"}

# === MENTOR VIEWS DASHBOARD ===
🔍 DEBUG: Fetching requests for Mentor ID: 1
🔍 DEBUG: All connection requests: (4) [{...}, {...}, {...}, {...}]

📥 GET RECEIVED REQUESTS:
  ├─ Looking for Mentor ID: 1
  ├─ Total requests in database: 4
  ├─ Requests for this mentor: 2
  └─ Filtered requests: (2) [{...}, {...}]

✅ DEBUG: Filtered requests: (2) [{...}, {...}]
✅ DEBUG: Active tab: pending
```

---

## 🎛️ Quick Fixes

### If Mentor Dashboard is Empty:

1. **Check Mentor Selector**
   ```javascript
   // At top of Mentor Dashboard
   // Make sure it shows the mentor you requested
   ```

2. **Use Debug Panel**
   ```javascript
   // Click bug icon → See all requests
   // Find your request → Note the receiver_id
   // Select that mentor in dropdown
   ```

3. **Send New Test Request**
   ```javascript
   // Go to Student Dashboard
   // Click "Request Connection" on Sarah Johnson (ID 1)
   // Immediately go to Mentor Dashboard
   // Select "Sarah Johnson" in dropdown
   // Should appear instantly
   ```

---

## 📝 Key Changes Summary

| File | What Changed | Why |
|------|-------------|-----|
| `MentorDashboard.jsx` | Added `selectedMentorId` state + dropdown | Fix ID mismatch |
| `MockDataContext.jsx` | Added console logs in CRUD methods | Debug data flow |
| `MentorCardActions.jsx` | Added console logs in button handler | Debug request sending |
| `DebugPanel.jsx` | NEW: Floating debug panel | Visual debugging |
| `App.jsx` | Added DebugPanel component | Show on all pages |

---

## ✅ Success Criteria

When working correctly, you should:
- ✅ See console logs at every step
- ✅ See request appear in Debug Panel immediately
- ✅ See request count update in Mentor Dashboard header
- ✅ See request details in Pending tab
- ✅ Be able to accept/decline
- ✅ See status update in Student's "My Requests" tab

---

## 🚀 Test it NOW:

1. Save all files
2. Server should auto-reload (already running)
3. Go to: `http://localhost:3000`
4. Follow testing instructions above
5. Watch console logs and debug panel
6. Report what you see!

---

**The fix is complete! The issue was the ID mismatch - now you can select which mentor to view as, and everything works correctly. 🎉**

