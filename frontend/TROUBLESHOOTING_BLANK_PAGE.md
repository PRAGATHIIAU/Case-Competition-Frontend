# Troubleshooting: Blank Page Issue

## Quick Fixes

### Step 1: Check Browser Console
1. **Open Browser DevTools**: Press `F12` or `Ctrl+Shift+I`
2. **Go to Console Tab**
3. **Look for Red Errors**
4. **Copy any error messages** you see

### Step 2: Check Network Tab
1. **Open Browser DevTools**: Press `F12`
2. **Go to Network Tab**
3. **Refresh the page** (F5)
4. **Look for Red/Failed Requests**
5. **Check if files are loading** (main.jsx, App.jsx, etc.)

### Step 3: Clear Browser Cache
1. **Press `Ctrl+Shift+Delete`**
2. **Select "Cached images and files"**
3. **Click "Clear data"**
4. **Refresh the page** (Ctrl+F5 for hard refresh)

### Step 4: Check Terminal Output
Look at the terminal where `npm run dev` is running:
- **Are there any error messages?**
- **Does it say "ready" or "Local: http://localhost:3000"?**
- **Any red error text?**

---

## Common Issues & Solutions

### Issue 1: "Cannot find module" Error
**Solution**: Reinstall dependencies
```powershell
cd frontend
npm install
npm run dev
```

### Issue 2: "Port 3000 already in use"
**Solution**: Change port or close other apps
- Edit `vite.config.js` and change `port: 3000` to `port: 3001`
- Or close the app using port 3000

### Issue 3: Tailwind CSS not loading
**Solution**: Check if Tailwind is configured
```powershell
# Verify tailwind.config.js exists
# Verify postcss.config.js exists
# Check if index.css has @tailwind directives
```

### Issue 4: React not mounting
**Solution**: Check if root element exists
- Open `index.html` - should have `<div id="root"></div>`
- Check browser console for mounting errors

### Issue 5: Import errors
**Solution**: Check all imports are correct
- Look for red errors in terminal
- Check if all files exist

---

## Debug Steps

1. **Open Browser Console** (F12)
2. **Type this in console**:
   ```javascript
   document.getElementById('root')
   ```
   - Should return: `<div id="root"></div>`
   - If `null`, the HTML isn't loading

3. **Check if React is loading**:
   ```javascript
   window.React
   ```
   - Should return an object (React library)

4. **Check terminal for build errors**:
   - Look for compilation errors
   - Check for missing dependencies

---

## Quick Test

Create a simple test file to verify React is working:

1. **Temporarily replace `App.jsx` content with**:
```javascript
function App() {
  return (
    <div style={{ padding: '20px', fontSize: '24px' }}>
      <h1>React is Working!</h1>
      <p>If you see this, React is loading correctly.</p>
    </div>
  )
}

export default App
```

2. **Save and refresh browser**
3. **If you see the message**: React is working, issue is in components
4. **If still blank**: Issue is with React setup or build

---

## Still Not Working?

**Share these details**:
1. **Browser Console Errors** (screenshot or copy text)
2. **Terminal Output** (from `npm run dev`)
3. **Browser Name & Version** (Chrome, Firefox, Edge, etc.)
4. **Node.js Version** (run `node --version`)

