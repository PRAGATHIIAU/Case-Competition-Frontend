# Fix Email Password in .env

## Problem
Your `.env` file has the password with spaces, which won't work.

## Solution

### Current (WRONG):
```
EMAIL_PASSWORD=wbka fydp pioz lmtj
```

### Should be (CORRECT - no spaces):
```
EMAIL_PASSWORD=dtwdupvkbgpsgnvl
```

## Steps to Fix:

1. Open `backend/.env` file
2. Find the line: `EMAIL_PASSWORD=wbka fydp pioz lmtj`
3. Replace it with: `EMAIL_PASSWORD=dtwdupvkbgpsgnvl` (remove all spaces)
4. Save the file
5. Restart your backend server

## Your Complete Email Config Should Look Like:

```env
EMAIL_USER=aupragathii@gmail.com
EMAIL_PASSWORD=dtwdupvkbgpsgnvl
FROM_EMAIL=aupragathii@gmail.com
ADMIN_EMAIL=aupragathii@gmail.com
```

**Important:** The password must have NO SPACES!

