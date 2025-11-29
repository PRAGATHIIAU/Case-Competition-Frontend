# pgAdmin Connection Guide for AWS RDS PostgreSQL

## Quick Connection Steps

### 1. Open pgAdmin
- Launch pgAdmin 4 application

### 2. Create New Server
- Right-click on **"Servers"** in the left panel
- Select **"Create"** → **"Server..."**

### 3. Server Configuration

#### **General Tab:**
- **Name:** `AWS RDS Alumni Portal` (or any name you prefer)

#### **Connection Tab:**
- **Host name/address:** `alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com`
- **Port:** `5432`
- **Maintenance database:** `alumni_portal`
- **Username:** `postgres`
- **Password:** `*Uvpt1077`
- ✅ **Save password:** Check this box

#### **SSL Tab (IMPORTANT for AWS RDS):**
- **SSL mode:** Select `Require` or `Prefer`
- This is **required** for AWS RDS connections

#### **Advanced Tab (Optional):**
- Leave defaults

### 4. Save and Connect
- Click **"Save"** button
- pgAdmin will attempt to connect to your database

---

## Troubleshooting

### Issue: "Connection timeout" or "Could not connect"
**Solutions:**
1. **Check Security Group:** Ensure your AWS RDS security group allows inbound connections from your IP address on port 5432
2. **Check Firewall:** Your local firewall might be blocking the connection
3. **Check VPN:** If you're on a VPN, it might need to be connected

### Issue: "Password authentication failed"
**Solutions:**
1. Double-check the password: `*Uvpt1077`
2. Ensure there are no extra spaces in the password field
3. Try copying and pasting the password directly

### Issue: "SSL connection required"
**Solutions:**
1. Go to **SSL tab** in server properties
2. Set **SSL mode** to `Require` or `Prefer`
3. Save and reconnect

### Issue: "Database does not exist"
**Solutions:**
1. Verify database name: `alumni_portal`
2. Check if the database was created on the RDS instance
3. Try connecting to `postgres` database first, then create `alumni_portal` if needed

---

## AWS RDS Security Group Configuration

If you can't connect, you may need to update the RDS Security Group:

1. Go to **AWS Console** → **RDS** → **Databases**
2. Select your database instance
3. Click on **"VPC security groups"**
4. Click on the security group
5. Go to **"Inbound rules"** tab
6. Click **"Edit inbound rules"**
7. Add a new rule:
   - **Type:** PostgreSQL
   - **Protocol:** TCP
   - **Port:** 5432
   - **Source:** Your IP address (or `0.0.0.0/0` for testing - **NOT recommended for production**)

---

## Testing Connection from Command Line

You can also test the connection using `psql`:

```bash
psql -h alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com -p 5432 -U postgres -d alumni_portal
```

When prompted, enter password: `*Uvpt1077`

---

## Connection String Format

If you need a connection string for other tools:

```
postgresql://postgres:*Uvpt1077@alumni-portal.cy7wwmkqs2ax.us-east-1.rds.amazonaws.com:5432/alumni_portal?sslmode=require
```

---

## Notes

- The database is hosted on **AWS RDS** in the **us-east-1** region
- SSL is **required** for RDS connections
- Make sure your IP address is whitelisted in the RDS security group
- The password contains special characters, so be careful when typing

