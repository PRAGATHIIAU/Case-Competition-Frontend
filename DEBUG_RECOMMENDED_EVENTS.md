# Debug Guide: Recommended Events Widget

## Issue: "Failed to fetch recommended events" Error

### Root Cause

The `currentUser.id` is set to **101** (a student) by default, but the `getRecommendedEventsForAlumni()` function expects an **alumni ID** (201-205).

### Solution Applied

1. **Enhanced Error Handling**: The function now returns fallback events instead of throwing errors
2. **Better Logging**: Added extensive console logs to track the issue
3. **Graceful Degradation**: Shows general events when alumni not found

---

## Debugging Steps

### Step 1: Check Console Logs

Open browser DevTools (F12) and check the Console tab. You should see:

```
🔍 RecommendedEventsWidget mounted
  ├─ Current User ID: 101
  ├─ Current User Name: John Doe
  └─ Current User Role: student

📅 Loading recommended events for: 101
  ├─ Current user: {id: 101, name: "John Doe", ...}
  └─ User role: student

🎯 Fetching recommended events for alumni: 101
  ├─ Available alumni IDs: [201, 202, 203, 204, 205]
  ❌ Alumni not found for ID: 101
  💡 Available alumni IDs: ["201 (Sarah Johnson)", "202 (Michael Chen)", ...]
  ⚠️ Using 3 fallback events (alumni not found)
```

### Step 2: Fix the User ID

**Option A: Update MockDataContext (Temporary for Testing)**

In `frontend/src/contexts/MockDataContext.jsx`, change:

```javascript
const [currentUser, setCurrentUser] = useState({
  id: 201,  // Changed from 101 to 201 (Sarah Johnson - Alumni)
  name: "Sarah Johnson",
  email: "sarah.johnson@exxonmobil.com",
  role: "alumni",  // Changed from "student" to "alumni"
  industry: "Energy",
  expertise: ["AI", "Data Analytics", "ML", "Cyber Security"]
})
```

**Option B: Set User Based on Route (Better Solution)**

Update `IndustryDashboard.jsx` to set the user when the component mounts:

```javascript
import { useMockData } from '../contexts/MockDataContext'

export default function IndustryDashboard() {
  const { currentUser, setCurrentUser } = useMockData()
  
  useEffect(() => {
    // Set to alumni user when viewing industry dashboard
    if (currentUser.role !== 'alumni' && currentUser.role !== 'mentor') {
      setCurrentUser({
        id: 201, // Sarah Johnson
        name: "Sarah Johnson",
        email: "sarah.johnson@exxonmobil.com",
        role: "alumni",
        industry: "Energy",
        expertise: ["AI", "Data Analytics", "ML", "Cyber Security"]
      })
    }
  }, [])
  
  // ... rest of component
}
```

---

## Available Alumni IDs

- **201**: Sarah Johnson (Energy, AI/Data Analytics)
- **202**: Michael Chen (Technology, Cloud/DevOps)
- **203**: Emily Rodriguez (Finance, Business Strategy)
- **204**: David Park (Technology, Cyber Security)
- **205**: Jennifer Lee (Finance, FinTech)

---

## Expected Behavior After Fix

### With Alumni ID (201-205):
```
✅ Recommended events loaded: 3
  ├─ Direct matches found
  └─ Events show "🎯 Matches your Industry" badges
```

### With Student ID (101):
```
⚠️ Using 3 fallback events (alumni not found)
  ├─ No direct matches
  └─ Events show "🔥 Popular Event" badges
```

---

## Console Logs to Look For

### Success Case:
```
🎯 Fetching recommended events for alumni: 201
  ├─ Industry: Energy
  └─ Expertise: AI, Data Analytics, ML, Cyber Security
  ✅ Found 2 matching events
  📊 Returning 3 recommended events
```

### Fallback Case:
```
🎯 Fetching recommended events for alumni: 101
  ├─ Available alumni IDs: [201, 202, 203, 204, 205]
  ❌ Alumni not found for ID: 101
  ⚠️ Using 3 fallback events (alumni not found)
```

---

## Quick Fix Commands

### Test with Alumni User (Temporary):
1. Open `frontend/src/contexts/MockDataContext.jsx`
2. Find line 19-26 (currentUser state)
3. Change `id: 101` to `id: 201`
4. Change `role: "student"` to `role: "alumni"`
5. Save and refresh browser

### Verify Fix:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to `/industry` → "Engagement History" tab
4. Check console logs - should see success messages
5. Widget should show 3 events with match badges

---

## Common Issues

### Issue 1: "Alumni not found"
- **Cause**: User ID is not 201-205
- **Fix**: Update `currentUser.id` to an alumni ID

### Issue 2: "No events found"
- **Cause**: All events are in the past
- **Fix**: Check event dates in `mockData.js` - ensure some are future dates

### Issue 3: "Failed to load recommended events"
- **Cause**: Function threw an error
- **Fix**: Check console for specific error message

---

## Testing Checklist

- [ ] Console shows "RecommendedEventsWidget mounted"
- [ ] Current User ID is logged
- [ ] Function is called with correct ID
- [ ] Alumni lookup succeeds or fallback is used
- [ ] Events are returned (3 or less)
- [ ] Widget displays events correctly
- [ ] Match badges show correctly
- [ ] RSVP buttons work

---

**Status**: ✅ Fixed - Function now handles non-alumni users gracefully with fallback events

