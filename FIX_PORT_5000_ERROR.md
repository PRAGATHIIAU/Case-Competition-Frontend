# Fix "Port 5000 Already in Use" Error

## ❌ Error:
```
Error: listen EADDRINUSE: address already in use :::5000
```

## ✅ Quick Fix Options:

### Option 1: Kill the Process (Easiest)

**Double-click:** `KILL_PORT_5000.bat` (I created this for you)

**OR manually:**
```cmd
netstat -ano | findstr :5000
taskkill /F /PID <PID_NUMBER>
```

### Option 2: Use Command Prompt

1. Open Command Prompt (not PowerShell)
2. Run:
   ```cmd
   netstat -ano | findstr :5000
   ```
3. Note the PID (last number)
4. Run:
   ```cmd
   taskkill /F /PID <PID_NUMBER>
   ```

### Option 3: Restart Computer
(Not recommended, but works)

---

## 🔍 Find What's Using Port 5000

```cmd
netstat -ano | findstr :5000
```

This shows:
- `TCP    0.0.0.0:5000` - Port 5000 is in use
- Last number is the Process ID (PID)

---

## ✅ After Killing Process

Then start backend:
```cmd
cd backend
npm start
```

---

## 💡 Prevention

The backend is probably still running from before. Always:
1. Stop backend with `Ctrl+C` before closing terminal
2. Or use the batch file to kill it

---

**Use the `KILL_PORT_5000.bat` file I created - just double-click it!**



