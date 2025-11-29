# 🔌 How to Connect to Remote PostgreSQL Database (AWS RDS)

## Connection Details

| Setting | Value |
|---------|-------|
| **Host** | `alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com` |
| **Port** | `5432` |
| **Database** | `alumni_portal` |
| **Username** | `postgres` |
| **Password** | `*Uvpt1077` |

---

## Method 1: Using pgAdmin (GUI - Recommended)

### Step 1: Open pgAdmin
1. Launch **pgAdmin 4**
2. Right-click on **"Servers"** in the left panel
3. Select **"Create" → "Server..."**

### Step 2: General Tab
- **Name:** `AWS RDS - Alumni Portal` (or any name you prefer)

### Step 3: Connection Tab
Fill in the following:

- **Host name/address:** `alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com`
- **Port:** `5432`
- **Maintenance database:** `alumni_portal`
- **Username:** `postgres`
- **Password:** `*Uvpt1077`
- ✅ **Save password** (optional, but convenient)

### Step 4: SSL Tab (Important!)
- **SSL mode:** Select **"Require"** or **"Prefer"**
- This is required for AWS RDS connections

### Step 5: Click "Save"
You should now see the database in pgAdmin!

---

## Method 2: Using psql (Command Line)

### Windows Command Prompt or PowerShell:

```cmd
psql -h alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com -p 5432 -U postgres -d alumni_portal
```

When prompted, enter password: `*Uvpt1077`

### Or with password in command (less secure):

```cmd
set PGPASSWORD=*Uvpt1077
psql -h alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com -p 5432 -U postgres -d alumni_portal
```

---

## Method 3: Using Connection String

### PostgreSQL Connection String:
```
postgresql://postgres:*Uvpt1077@alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com:5432/alumni_portal?sslmode=require
```

---

## Update Your .env File

Make sure your `backend/.env` file has these settings:

```env
# Database Configuration (Remote AWS RDS)
DB_HOST=alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=alumni_portal
DB_USER=postgres
DB_PASSWORD=*Uvpt1077
DB_SSL=true

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2

# AWS Configuration
AWS_REGION=us-east-1
API_GATEWAY_UPLOAD_URL=https://zyvoa629f8.execute-api.us-east-1.amazonaws.com/dev/upload
API_GATEWAY_DYNAMODB_URL=https://uesvq6c260.execute-api.us-east-1.amazonaws.com/dev/events
API_GATEWAY_STUDENT_PROFILES_URL=https://934mmrcmpj.execute-api.us-east-1.amazonaws.com/dev/profiles
S3_BUCKET_NAME=cmis-portal-resumes
EVENTS_TABLE_NAME=Events

# Email Configuration
EMAIL_USER=aupragathii@gmail.com
EMAIL_PASSWORD=wbka fydp pioz lmtj
FROM_EMAIL=aupragathii@gmail.com
ADMIN_EMAIL=aupragathii@gmail.com
```

**⚠️ Important:** Change `PORT=3000` to `PORT=5000` in your .env file!

---

## Test Connection

### From Backend:
```cmd
cd C:\Users\darsh\Downloads\Case-competition_frontend\backend
npm run dev
```

You should see:
```
Connected to PostgreSQL database
🚀 Server is running on port 5000
```

### From pgAdmin:
1. Expand your server connection
2. Expand **"Databases"**
3. Expand **"alumni_portal"**
4. Expand **"Schemas" → "public" → "Tables"**
5. You should see all your tables!

---

## Troubleshooting

### Connection Timeout
- Check if your IP is whitelisted in AWS RDS security groups
- Verify AWS RDS instance is running

### SSL Required Error
- Make sure `DB_SSL=true` in .env
- In pgAdmin, set SSL mode to "Require"

### Authentication Failed
- Double-check username and password
- Verify database name is correct

### Port 5432 Blocked
- Check firewall settings
- Verify AWS RDS security group allows port 5432

---

## Quick Connection Test (psql)

```cmd
psql "host=alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com port=5432 dbname=alumni_portal user=postgres password=*Uvpt1077 sslmode=require"
```

If successful, you'll see:
```
psql (version)
SSL connection (protocol: TLSv1.2, ...)
Type "help" for help.

alumni_portal=#
```

---

**🎉 You're now connected to the remote database!**



