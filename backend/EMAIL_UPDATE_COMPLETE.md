# Email Configuration Updated ✅

## Changes Made:
- **EMAIL_USER**: Changed from `aupragathii@gmail.com` to `darshilrayjada4154@gmail.com`
- **FROM_EMAIL**: Changed from `aupragathii@gmail.com` to `darshilrayjada4154@gmail.com`
- **EMAIL_PASSWORD**: Kept the same (`dtwdupvkbgpsgnvl`)
- **ADMIN_EMAIL**: You may want to update this too if needed

## Important: Generate New Gmail App Password

Since you changed the email address, you need to generate a NEW App Password for `darshilrayjada4154@gmail.com`:

### Steps:
1. Go to: https://myaccount.google.com/apppasswords
2. Make sure you're logged in as: `darshilrayjada4154@gmail.com`
3. Generate App Password:
   - **App**: Mail
   - **Device**: Other (Custom name) → "Case Competition Backend"
4. **Copy the 16-character password** (remove spaces)
5. Update `.env` file:
   ```
   EMAIL_PASSWORD=your-new-16-char-password-no-spaces
   ```

## Next Steps:

1. **Generate new App Password** for `darshilrayjada4154@gmail.com`
2. **Update EMAIL_PASSWORD** in `.env` file with the new password
3. **Restart backend server** (Ctrl+C, then `npm start`)
4. **Test RSVP** - emails will now go to `darshilrayjada4154@gmail.com`

## Current Configuration:
```env
EMAIL_USER=darshilrayjada4154@gmail.com
EMAIL_PASSWORD=dtwdupvkbgpsgnvl  ← Update this with new App Password
FROM_EMAIL=darshilrayjada4154@gmail.com
ADMIN_EMAIL=aupragathii@gmail.com  ← You may want to change this too
```

