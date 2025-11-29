# Deployment Guide - CMIS Engagement Platform

This guide will help you deploy your React app to GitHub and make it live on the web.

## Option 1: Deploy to Vercel (Easiest - Recommended)

### Steps:

1. **Push your code to GitHub first** (see "Upload to GitHub" section below)

2. **Go to [vercel.com](https://vercel.com)** and sign up/login with your GitHub account

3. **Click "New Project"**

4. **Import your GitHub repository**
   - Select the repository: `MCP-server--datathon-main`
   - Root Directory: Set to `frontend`
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Click "Deploy"**
   - Vercel will automatically deploy your app
   - You'll get a live URL like: `https://your-project-name.vercel.app`

6. **Done!** Your app is now live! 🎉

---

## Option 2: Deploy to Netlify

### Steps:

1. **Push your code to GitHub** (see below)

2. **Go to [netlify.com](https://netlify.com)** and sign up/login with GitHub

3. **Click "Add new site" → "Import an existing project"**

4. **Select your GitHub repository**

5. **Configure build settings:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

6. **Click "Deploy site"**
   - Your app will be live at: `https://random-name.netlify.app`

---

## Option 3: GitHub Pages (Free but more setup)

### Step 1: Install GitHub Pages Plugin

In your `frontend` folder, run:
```bash
npm install --save-dev gh-pages
```

### Step 2: Update package.json

Add these lines to the `scripts` section:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

And add this at the top level (outside of scripts):
```json
"homepage": "https://your-username.github.io/MCP-server--datathon-main"
```
*(Replace `your-username` with your GitHub username)*

### Step 3: Deploy

```bash
npm run deploy
```

### Step 4: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under "Source", select **gh-pages** branch
4. Click **Save**
5. Your site will be at: `https://your-username.github.io/MCP-server--datathon-main`

---

## Upload to GitHub (If you haven't already)

### Step 1: Create a GitHub Account
- Go to [github.com](https://github.com) and sign up

### Step 2: Create a New Repository
1. Click the **+** icon in the top right
2. Click **New repository**
3. Name it: `cmis-engagement-platform` (or any name you like)
4. Don't initialize with README (you already have files)
5. Click **Create repository**

### Step 3: Upload Your Code

#### Using GitHub Desktop (Easiest for beginners):

1. **Download GitHub Desktop** from [desktop.github.com](https://desktop.github.com)

2. **Open GitHub Desktop** → File → Add Local Repository

3. **Select your folder**: `C:\Users\darsh\Downloads\MCP-server--datathon-main`

4. **Click "Publish repository"** and select your GitHub account

#### Using Git Command Line:

Open terminal in your project root folder and run:

```bash
# Initialize git (only first time)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: CMIS Engagement Platform"

# Add your repository (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/your-repo-name.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Build for Production (Local Testing)

To test the production build locally:

```bash
cd frontend
npm run build
npm run preview
```

This creates an optimized production build and lets you preview it at `http://localhost:4173`

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Chose deployment platform (Vercel/Netlify/GitHub Pages)
- [ ] Configured build settings
- [ ] Deployment successful
- [ ] Tested live URL
- [ ] Shared with your team! 🎉

---

## Troubleshooting Deployment

### Build Fails on Vercel/Netlify
- Check that you set the **Root Directory** to `frontend`
- Verify build command: `npm run build`
- Check build logs for specific errors

### 404 Errors on GitHub Pages
- Make sure you set `homepage` in package.json correctly
- Update `vite.config.js` to add base path (see below)

### Add this to vite.config.js for GitHub Pages:

```javascript
export default defineConfig({
  base: '/MCP-server--datathon-main/',  // Your repo name
  plugins: [react()],
  // ... rest of config
})
```

---

## Recommended: Vercel

**Why Vercel?**
- ✅ Free for personal projects
- ✅ Automatic deployments on every push
- ✅ Easy setup (just connect GitHub)
- ✅ Fast CDN
- ✅ HTTPS included
- ✅ Custom domains supported

**Get started in 5 minutes!**

