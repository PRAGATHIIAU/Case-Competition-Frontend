# PostgreSQL Setup Guide for CMIS Platform

This guide will help you install and configure PostgreSQL for the CMIS Engagement Platform.

## 📥 Installation

### Windows

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the installer (recommended: PostgreSQL 15 or 16)

2. **Run the Installer:**
   - Run the downloaded `.exe` file
   - Follow the installation wizard
   - **Important:** Remember the password you set for the `postgres` superuser
   - Default port: `5432` (keep this unless you have a conflict)
   - Default installation location: `C:\Program Files\PostgreSQL\15\`

3. **Verify Installation:**
   - Open Command Prompt or PowerShell
   - Navigate to PostgreSQL bin directory:
     ```powershell
     cd "C:\Program Files\PostgreSQL\15\bin"
     ```
   - Test connection:
     ```powershell
     .\psql -U postgres
     ```
   - Enter your password when prompted
   - You should see: `postgres=#`

### macOS

1. **Using Homebrew (Recommended):**
   ```bash
   # Install PostgreSQL
   brew install postgresql@15
   
   # Start PostgreSQL service
   brew services start postgresql@15
   
   # Verify installation
   psql postgres
   ```

2. **Using Official Installer:**
   - Download from: https://www.postgresql.org/download/macosx/
   - Run the installer
   - Follow the setup wizard

### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql

# Enable PostgreSQL to start on boot
sudo systemctl enable postgresql

# Verify installation
sudo -u postgres psql
```

## 🗄️ Create Database

### Method 1: Using psql (Command Line)

1. **Connect to PostgreSQL:**
   ```bash
   # Windows (in PostgreSQL bin directory)
   psql -U postgres
   
   # Mac/Linux
   sudo -u postgres psql
   # OR
   psql -U postgres
   ```

2. **Create Database:**
   ```sql
   CREATE DATABASE cmis_db;
   ```

3. **Verify:**
   ```sql
   \l
   ```
   You should see `cmis_db` in the list.

4. **Exit:**
   ```sql
   \q
   ```

### Method 2: Using pgAdmin (GUI)

1. **Open pgAdmin:**
   - Windows: Start Menu → pgAdmin 4
   - Mac: Applications → pgAdmin 4
   - Linux: `pgadmin4` command

2. **Connect to Server:**
   - Right-click "Servers" → Create → Server
   - Name: `PostgreSQL` (or any name)
   - Connection tab:
     - Host: `localhost`
     - Port: `5432`
     - Username: `postgres`
     - Password: (your password)
   - Click "Save"

3. **Create Database:**
   - Right-click "Databases" → Create → Database
   - Name: `cmis_db`
   - Click "Save"

## ⚙️ Configure Backend Connection

1. **Edit Backend `.env` file:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=cmis_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password_here
   ```

2. **Test Connection:**
   ```bash
   cd backend
   npm run migrate
   ```
   
   If successful, you'll see:
   ```
   ✅ Connected to PostgreSQL database
   ✅ Database migrations completed successfully!
   ```

## 🔧 Common Issues & Solutions

### Issue: "password authentication failed"

**Solution:**
1. Check your password in `.env` matches the PostgreSQL password
2. Reset PostgreSQL password:
   ```sql
   -- Connect as postgres user
   ALTER USER postgres WITH PASSWORD 'new_password';
   ```

### Issue: "database does not exist"

**Solution:**
```sql
-- Create the database
CREATE DATABASE cmis_db;
```

### Issue: "connection refused"

**Solution:**
1. Check if PostgreSQL is running:
   ```bash
   # Windows
   # Check Services: Win+R → services.msc → Look for "postgresql"
   
   # Mac
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Start PostgreSQL if not running:
   ```bash
   # Mac
   brew services start postgresql@15
   
   # Linux
   sudo systemctl start postgresql
   ```

### Issue: "port 5432 already in use"

**Solution:**
1. Check what's using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5432
   
   # Mac/Linux
   lsof -i :5432
   ```

2. Either:
   - Stop the conflicting service
   - Or change PostgreSQL port in `postgresql.conf` and update `.env`

## 📊 Useful PostgreSQL Commands

```sql
-- List all databases
\l

-- Connect to a database
\c cmis_db

-- List all tables
\dt

-- Describe a table
\d table_name

-- List all users
\du

-- Exit psql
\q
```

## 🔐 Security Best Practices

1. **Change Default Password:**
   ```sql
   ALTER USER postgres WITH PASSWORD 'strong_password_here';
   ```

2. **Create Application User (Recommended):**
   ```sql
   -- Create a dedicated user for the application
   CREATE USER cmis_user WITH PASSWORD 'app_password_here';
   
   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE cmis_db TO cmis_user;
   
   -- Connect to database and grant schema privileges
   \c cmis_db
   GRANT ALL ON SCHEMA public TO cmis_user;
   ```

3. **Update `.env` with new user:**
   ```env
   DB_USER=cmis_user
   DB_PASSWORD=app_password_here
   ```

## ✅ Verification Checklist

- [ ] PostgreSQL installed successfully
- [ ] PostgreSQL service is running
- [ ] Can connect using `psql -U postgres`
- [ ] Database `cmis_db` created
- [ ] Backend `.env` configured with correct credentials
- [ ] Can run `npm run migrate` successfully
- [ ] Tables created in database (check with `\dt` in psql)

## 🆘 Getting Help

- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **Stack Overflow:** Tag `postgresql`
- **PostgreSQL Community:** https://www.postgresql.org/community/

---

Once PostgreSQL is set up, proceed to the [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for next steps.




