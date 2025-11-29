# 🚀 Backend - Start Here!

## Quick Start

### 1. Install Dependencies
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm install
```

### 2. Configure Environment
Create or update `.env` file:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=alumni_portal
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

### 3. Initialize Database (Optional)
```cmd
npm run init-all
```

### 4. Start Server
```cmd
npm run dev
```

You should see:
```
🚀 Server is running on port 5000 in development mode
📊 Health check: http://localhost:5000/health
🔗 API base: http://localhost:5000/api
```

## ✅ Test It Works

Open in browser:
- `http://localhost:5000/` → Should show `{"message":"Hello world"}`
- `http://localhost:5000/health` → Should show health status
- `http://localhost:5000/api/mentors` → Should show `{"success":true,"count":0,"mentors":[]}`

## 📝 Important Notes

1. **Port**: Backend runs on **5000**, Frontend runs on **3000**
2. **API Routes**: All API routes start with `/api`
3. **Frontend Routes**: Routes like `/student` are handled by React Router (frontend), not backend

## 🆘 Troubleshooting

**"Route not found" error?**
- Make sure you're using `/api/` prefix for API routes
- Frontend routes (like `/student`) are handled by React Router, not backend

**Port already in use?**
- Change `PORT` in `.env` file
- Or kill the process using port 5000

**Database errors?**
- Make sure PostgreSQL is running
- Check `.env` file has correct database credentials

## 📚 More Help

- See `ROUTE_TESTING.md` for complete route list
- See `README.md` for full documentation
- See `QUICK_FIX.md` for common fixes


