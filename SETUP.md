# Setup Guide - CMIS Engagement Platform

## Step-by-Step Instructions to Run the Application

### Prerequisites

Before you start, make sure you have installed:
- **Node.js** (version 18 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

### How to Check if Node.js is Installed

Open your terminal/command prompt and type:
```bash
node --version
npm --version
```

If you see version numbers, you're good to go! If not, install Node.js first.

---

## Step 1: Open the Project Folder

### On Windows:
1. Press `Windows Key + E` to open File Explorer
2. Navigate to: `C:\Users\darsh\Downloads\MCP-server--datathon-main\frontend`
3. In the address bar, type `cmd` and press Enter (this opens Command Prompt in that folder)
   - OR right-click in the folder, select "Open in Terminal" or "Open PowerShell window here"

### On Mac/Linux:
1. Open Terminal
2. Type: `cd ~/Downloads/MCP-server--datathon-main/frontend`
3. Press Enter

---

## Step 2: Install Dependencies

In the terminal/command prompt (make sure you're in the `frontend` folder), type:

```bash
npm install
```

This will download all the required packages. Wait for it to finish (it may take 2-5 minutes).

**You'll know it's done when you see:**
- ✅ "added X packages"
- No error messages

---

## Step 3: Run the Application

Once installation is complete, type:

```bash
npm run dev
```

**You'll see output like:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 4: Open in Browser

1. The app will automatically open in your browser
2. If it doesn't, open your browser and go to: **http://localhost:3000**

---

## What You Should See

1. **Landing Page** with three role options:
   - Student
   - Judge
   - Admin

2. Click on any role to see that dashboard!

---

## Stopping the Application

To stop the server, go back to your terminal and press:
- **Ctrl + C** (Windows/Linux)
- **Cmd + C** (Mac)

---

## Troubleshooting

### Problem: "npm: command not found"
**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

### Problem: "Error: EACCES: permission denied"
**Solution:** Try using `sudo` on Mac/Linux, or run Command Prompt as Administrator on Windows

### Problem: Port 3000 is already in use
**Solution:** 
- Close other applications using port 3000
- Or edit `vite.config.js` and change the port number

### Problem: "Cannot find module"
**Solution:** Delete the `node_modules` folder and `package-lock.json`, then run `npm install` again

---

## Next Steps

Once the app is running locally, you can:
- Test all features
- Make changes to the code
- See changes instantly in the browser (hot reload)

When ready, check **DEPLOYMENT.md** to deploy to GitHub Pages or Vercel!

