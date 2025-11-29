# ✅ Fix EmailJS Import Error - Quick Solution

## 🐛 The Error You're Seeing

```
Failed to resolve import "@emailjs/browser" from "src/utils/emailService.js"
```

**Cause:** The `@emailjs/browser` package is not installed yet.

---

## ✅ Quick Fix (Choose ONE method)

### Method 1: Use the Batch File (Easiest)

1. **Double-click:** `install-emailjs.bat` (in the frontend folder)
2. Wait for installation to complete
3. Press any key to close
4. **Double-click:** `start.bat` to restart server
5. Done! ✅

### Method 2: Manual Command

1. **Open Command Prompt** (not PowerShell)
   - Press `Win + R`
   - Type: `cmd`
   - Press Enter

2. **Navigate to frontend folder:**
   ```cmd
   cd C:\Users\darsh\Downloads\MCP-server--datathon-main\frontend
   ```

3. **Install package:**
   ```cmd
   npm install
   ```

4. **Start server:**
   ```cmd
   npm run dev
   ```

5. Done! ✅

### Method 3: PowerShell (With Admin Rights)

1. **Open PowerShell as Administrator**
   - Right-click PowerShell
   - Select "Run as administrator"

2. **Enable script execution:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Navigate and install:**
   ```powershell
   cd C:\Users\darsh\Downloads\MCP-server--datathon-main\frontend
   npm install
   ```

4. **Start server:**
   ```powershell
   npm run dev
   ```

---

## ✅ Verification

After installation, you should see:

```
✓ @emailjs/browser installed
✓ Vite server starting...
✓ Local: http://localhost:3000
```

**No more errors!** The EmailJS package is now available.

---

## 🧪 Test the Email Feature

1. **Go to:** `http://localhost:3000/student`
2. **Click:** "Competitions" tab
3. **Click:** "Register for Competition"
4. **Open Console (F12):**
   - You'll see the full email content logged
   - Mock mode is enabled by default

5. **See Success Message:**
   ```
   ✅ Successfully registered!
   
   Team ID: TEAM-ABC123-XYZ4
   
   📧 Email confirmation logged to console (Mock Mode).
   ```

---

## 📝 What Was Updated

I've already updated your `package.json` to include:

```json
"dependencies": {
  "@emailjs/browser": "^4.3.3",  ← Added this line
  "react": "^18.2.0",
  ...
}
```

**All you need to do:** Run `npm install` to install it!

---

## 🎯 Next Steps

1. ✅ Install package (using method above)
2. ✅ Restart dev server
3. ✅ Test registration with mock emails
4. 🔜 Later: Configure EmailJS account (see `EMAILJS_SETUP_GUIDE.md`)

---

**Choose a method above and you'll be running in 1 minute! 🚀**

