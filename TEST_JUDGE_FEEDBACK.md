# How to Test the Judge Feedback System

## 🎯 Multiple Ways to Access the Feedback Form

**Good news!** You no longer need to type the URL manually. The feedback form is now accessible from **3 different places** in the UI:

1. **⭐ Industry Dashboard → "Rate Experience" Tab** (Recommended)
2. **📊 Engagement History → "Rate Your Experience" Button** (On judging activities)
3. **📬 Judge Invitations → "Rate Your Experience" Button** (On accepted invitations)
4. **🔗 Direct URL** (Still works for testing)

---

## Quick Start: Easiest Method

1. Go to: `http://localhost:3000/industry`
2. Click **"Rate Experience"** in the sidebar (3rd tab)
3. Click **"Submit Feedback"** on any competition
4. Fill out the form and submit!

That's it! No need to remember URLs. 🎉

---

## Method 1: From Industry Dashboard (Recommended) ⭐

### Step 1: Navigate to Industry Dashboard
1. Go to: `http://localhost:3000/industry`
2. You should see the **Industry Partner Portal** with a sidebar

### Step 2: Click "Rate Experience" Tab
1. In the sidebar, click on **"Rate Experience"** (3rd tab, with MessageSquare icon)
2. You'll see a list of competitions you've judged

### Step 3: Submit Feedback
1. Find a competition (especially one that has ended)
2. Click **"Submit Feedback"** button
3. Fill out the form and submit

**What you'll see:**
- ✅ Competitions where you're a judge
- ✅ Status badges: "Feedback Submitted" (green) or "Feedback Pending" (yellow)
- ✅ "Submit Feedback" button for pending competitions
- ✅ Preview of existing feedback if already submitted

---

## Method 2: From Engagement History

### Step 1: Navigate to Engagement History
1. Go to: `http://localhost:3000/industry`
2. Click **"Engagement History"** tab (4th tab)

### Step 2: Find Judging Activity
1. Scroll through your timeline
2. Find a **"Judging"** activity (yellow badge)

### Step 3: Click "Rate Your Experience"
1. In the judging activity card, you'll see a **"Rate Your Experience"** button
2. Click it to open the feedback form
3. Fill out and submit

**What you'll see:**
- ✅ Timeline of all your activities
- ✅ "Rate Your Experience" button on judging activities
- ✅ "Feedback submitted" indicator if already done

---

## Method 3: From Judge Invitations

### Step 1: Navigate to Judge Invitations
1. Go to: `http://localhost:3000/industry`
2. Click **"Judge Invitations"** tab (2nd tab)

### Step 2: Find Accepted Invitation
1. Find an invitation with status **"Accepted"** (green badge)
2. Scroll down in the card

### Step 3: Click "Rate Your Experience"
1. You'll see a **"Rate Your Experience"** button at the bottom
2. Click it to open the feedback form
3. Fill out and submit

**What you'll see:**
- ✅ List of all your invitations
- ✅ "Rate Your Experience" button on accepted invitations
- ✅ "Feedback submitted" indicator if already done

---

## Method 4: Direct URL Access (For Testing)

1. **Open your browser** and go to:
   ```
   http://localhost:3000/stakeholder/feedback/1
   ```
   (Replace `1` with any competition ID - try 1, 2, or 3)

2. **You should see**:
   - Competition name at the top
   - 5-star rating system
   - Comments text area
   - Promotional consent checkbox
   - Submit button

3. **Fill out the form**:
   - Click on stars to rate (1-5 stars)
   - Type some comments (optional)
   - Check the promotional consent box
   - Click "Submit Feedback"

4. **See the result**:
   - Thank you screen appears
   - Shows your submitted feedback
   - "Back to Dashboard" button

---

### Method 2: Via Appreciation Email (Full Workflow)

#### Step 1: Set Current User to Alumni/Judge

1. **Open**: `frontend/src/contexts/MockDataContext.jsx`
2. **Find line 19-27** (currentUser state)
3. **Change to**:
   ```javascript
   const [currentUser, setCurrentUser] = useState({
     id: 201,  // Sarah Johnson (Alumni/Judge)
     name: "Sarah Johnson",
     email: "sarah.johnson@exxonmobil.com",
     role: "alumni",
     industry: "Energy",
     expertise: ["AI", "Data Analytics", "ML", "Cyber Security"]
   })
   ```

#### Step 2: Trigger Appreciation Emails

1. **Navigate to**: `http://localhost:3000/faculty`
2. **Click**: "Judge Invitations" tab (5th tab)
3. **Scroll down**: Find green "Appreciation Email System" box
4. **Click**: "Test Appreciation Emails" button
5. **Wait**: See success toast notification

#### Step 3: Check Console for Feedback Link

1. **Open Browser Console**: Press `F12` → Console tab
2. **Look for**: Email content with feedback link
3. **Find line**: `👉 Rate Your Experience: http://localhost:3000/stakeholder/feedback/1`
4. **Copy the link** and paste in browser

#### Step 4: Submit Feedback

1. **Fill out the form** (same as Method 1)
2. **Submit** and see thank you screen

---

### Method 3: Test Duplicate Prevention

1. **Submit feedback** using Method 1 or 2
2. **Try to submit again** (refresh page or go back)
3. **You should see**:
   - Thank you screen (already submitted)
   - Your previous feedback displayed
   - Cannot submit duplicate

---

## Step-by-Step Visual Guide

### Step 1: Access the Form

**Option A - Direct URL**:
```
http://localhost:3000/stakeholder/feedback/1
```

**Option B - From Email Link**:
- Trigger appreciation emails
- Copy link from console
- Open in browser

### Step 2: Fill Out the Form

1. **Star Rating** (Required):
   - Click on stars (1-5)
   - See rating label update (Poor, Fair, Good, Very Good, Excellent)
   - Stars turn yellow when selected

2. **Comments** (Optional):
   - Type in text area
   - Character count shown below
   - Example: "Great organization! The scoring rubric was clear."

3. **Promotional Consent** (Optional):
   - Check the box
   - "Keep me updated on future events"

4. **Submit**:
   - Click "Submit Feedback" button
   - See loading spinner
   - Wait for confirmation

### Step 3: See Confirmation

- ✅ Green checkmark icon
- "Thank You for Helping Us Improve!" message
- Your feedback summary displayed
- "Back to Dashboard" button

---

## Testing Checklist

- [ ] Form loads correctly
- [ ] Competition name displays
- [ ] Star rating works (click to select)
- [ ] Comments field accepts text
- [ ] Promotional consent checkbox works
- [ ] Submit button disabled until rating selected
- [ ] Loading spinner shows during submission
- [ ] Thank you screen appears after submission
- [ ] Feedback saved correctly
- [ ] Duplicate submission prevented
- [ ] Existing feedback displays if already submitted
- [ ] Error handling works (try invalid data)

---

## Common Test Scenarios

### Scenario 1: First Time Submission
1. Go to `/stakeholder/feedback/1`
2. Rate 5 stars
3. Add comment: "Excellent organization!"
4. Check promotional consent
5. Submit
6. ✅ Should see thank you screen

### Scenario 2: Duplicate Prevention
1. Submit feedback (Scenario 1)
2. Refresh page or go back to form
3. ✅ Should see thank you screen with existing feedback
4. ✅ Should NOT allow duplicate submission

### Scenario 3: Minimum Required
1. Go to form
2. Only select rating (no comments, no consent)
3. Submit
4. ✅ Should work (rating is only required field)

### Scenario 4: Invalid Rating
1. Go to form
2. Don't select any stars
3. Try to submit
4. ✅ Should show error: "Please provide a rating"
5. ✅ Submit button should be disabled

---

## Expected Console Output

### When Form Loads:
```
📝 Loading feedback form for competition: 1
  ├─ Competition: Case Competition 2024
  └─ Judge ID: 201
```

### When Submitting:
```
📝 Submitting judge feedback:
  ├─ Competition ID: 1
  ├─ Judge ID: 201
  ├─ Rating: 5
  ├─ Comments: "Great organization!"
  └─ Promotional Consent: true
✅ Feedback submitted successfully
```

### When Duplicate:
```
⚠️ Feedback already exists for this competition
  └─ Returning existing feedback
```

---

## Troubleshooting

### Issue: Form doesn't load
- **Check**: Is the server running? (`npm run dev`)
- **Check**: Is the route correct? (`/stakeholder/feedback/1`)
- **Check**: Browser console for errors (F12)

### Issue: Competition not found
- **Check**: Competition ID exists in `mockCompetitions`
- **Try**: Different ID (1, 2, or 3)
- **Check**: Console for available competition IDs

### Issue: Can't submit
- **Check**: Did you select a rating? (Required)
- **Check**: Browser console for errors
- **Check**: Network tab for failed requests

### Issue: Duplicate not working
- **Check**: Are you using the same `competitionId` and `judgeId`?
- **Check**: Console for existing feedback check
- **Try**: Clear browser cache and try again

---

## Quick Test Commands

### Test URL (Copy & Paste):
```
http://localhost:3000/stakeholder/feedback/1
```

### Test with Different Competition IDs:
```
http://localhost:3000/stakeholder/feedback/1  (Case Competition 2024)
http://localhost:3000/stakeholder/feedback/2  (FinTech Innovation Challenge)
http://localhost:3000/stakeholder/feedback/3  (Cybersecurity Hackathon)
```

---

## What to Look For

✅ **Form Elements**:
- Competition name displayed
- 5 interactive stars
- Text area for comments
- Checkbox for promotional consent
- Submit and Cancel buttons

✅ **Functionality**:
- Stars change color when clicked
- Rating label updates (Poor, Fair, Good, etc.)
- Character counter for comments
- Submit button disabled until rating selected
- Loading spinner during submission

✅ **After Submission**:
- Thank you screen appears
- Feedback summary shown
- Cannot submit duplicate
- "Back to Dashboard" button works

---

## Next Steps After Testing

1. **Check Feedback in State**:
   - Open browser console
   - Type: `localStorage` or check React DevTools
   - Feedback should be in `judgeFeedback` state

2. **View in Admin Dashboard** (Future):
   - Admin can see all feedback
   - Filter by competition
   - View average ratings

3. **Test Email Integration**:
   - Trigger appreciation emails
   - Verify feedback link in email
   - Click link to open form

---

**Ready to Test!** 🚀

Start with Method 1 (Direct URL) for the quickest test, then try Method 2 for the full workflow.

