# Troubleshooting: Judge Invitations Not Showing

## Quick Checks

### 1. Verify You're on the Correct Route
- **URL should be**: `http://localhost:3000/faculty`
- If you're on a different route, navigate to `/faculty`

### 2. Check the Sidebar Tab
- Look for **"Judge Invitations"** tab in the left sidebar
- It should be the 5th tab (after "Create Competition")
- Click on it to activate

### 3. Check Browser Console
- Press `F12` to open Developer Tools
- Go to the **Console** tab
- Look for these messages:
  - `📬 getAllInvitations() returned: [...]`
  - `📬 Loaded X invitations for admin review`
- If you see errors, note them down

### 4. Verify Data is Loading
- You should see a debug section showing:
  - `Total Invitations: X | Filter: all`
- If it shows `Total Invitations: 0`, the data might not be initialized

## Common Issues & Solutions

### Issue 1: Tab Not Visible
**Solution**: 
- Refresh the page (`Ctrl + Shift + R` or `Cmd + Shift + R`)
- Check if the tab exists in `FacultyDashboard.jsx`

### Issue 2: No Invitations Showing
**Possible Causes**:
1. **No competitions created yet**
   - Go to "Create Competition" tab
   - Create a competition with expertise areas
   - This will auto-generate invitations

2. **Data not initialized**
   - Check browser console for errors
   - Try clicking the "Refresh" button in the component

3. **Filter is hiding invitations**
   - Make sure you're on "All" filter tab
   - Try clicking different filter tabs

### Issue 3: Component Not Rendering
**Solution**:
- Check if `StakeholderInvitationsList` is imported in `FacultyDashboard.jsx`
- Verify the route `/faculty` is working
- Check for JavaScript errors in console

## Step-by-Step Test

1. **Navigate to Faculty Dashboard**:
   ```
   http://localhost:3000/faculty
   ```

2. **Check Sidebar**:
   - You should see these tabs:
     - Overview
     - Analytics
     - Create Event
     - Create Competition
     - **Judge Invitations** ← This should be visible

3. **Click "Judge Invitations" Tab**

4. **What You Should See**:
   - Header: "Stakeholder Invitations"
   - Filter tabs: All, Pending, Accepted, Needs Acknowledgement
   - Debug info showing invitation count
   - List of invitation cards (if any exist)

5. **If No Invitations**:
   - Go to "Create Competition" tab
   - Create a competition
   - Return to "Judge Invitations" tab
   - You should now see invitations

## Expected Console Output

When the component loads, you should see:
```
📬 getAllInvitations() returned: [Array of invitations]
📬 Raw judgeInvitations state: [Array]
📬 Loaded X invitations for admin review
```

## Manual Test Data

If you want to test without creating a competition, you can check the mock data:
- File: `frontend/src/data/mockData.js`
- Look for `mockJudgeInvitations` array
- Should have 4 sample invitations

## Still Not Working?

1. **Check Network Tab** (F12 → Network):
   - Look for any failed requests
   - Check if files are loading correctly

2. **Check React DevTools**:
   - Install React DevTools extension
   - Inspect the component tree
   - Check if `StakeholderInvitationsList` is mounted

3. **Verify Imports**:
   - Check `FacultyDashboard.jsx` has:
     ```javascript
     import StakeholderInvitationsList from './admin/StakeholderInvitationsList'
     ```

4. **Check Context**:
   - Verify `MockDataContext` is providing:
     - `getAllInvitations`
     - `sendAcknowledgement`
     - `judgeInvitations`

## Quick Fix: Force Refresh

1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Restart dev server:
   ```bash
   # Stop server (Ctrl + C)
   # Then restart:
   npm run dev
   ```

