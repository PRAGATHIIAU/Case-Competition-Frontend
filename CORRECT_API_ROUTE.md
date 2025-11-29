# ✅ Correct API Route

## Important: Use `/api` (NOT `/apis`)

### ✅ CORRECT:
```
http://localhost:5000/api
```
This shows all available API routes.

### ❌ WRONG:
```
http://localhost:5000/apis  ← Don't use this (has extra 's')
```

---

## All Routes Use `/api` (No 's')

### Correct Routes:
- ✅ `http://localhost:5000/api` - API info
- ✅ `http://localhost:5000/api/mentors` - Get mentors
- ✅ `http://localhost:5000/api/events` - Get events
- ✅ `http://localhost:5000/api/students` - Get students
- ✅ `http://localhost:5000/api/auth/signup` - Register
- ✅ `http://localhost:5000/api/auth/login` - Login

### Wrong Routes:
- ❌ `http://localhost:5000/apis` - Doesn't exist
- ❌ `http://localhost:5000/apis/mentors` - Doesn't exist

---

## Remember:
- **Always use `/api`** (singular, no 's')
- **Never use `/apis`** (plural, with 's')

---

**The correct route is: `http://localhost:5000/api`** ✅



