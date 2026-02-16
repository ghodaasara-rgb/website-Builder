# 🗄️ Database Setup & Vercel Connection Guide

A complete guide to starting the database (local & remote) and connecting it to your Vercel deployment for the **LWR Website Builder** project.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Local Database Setup (XAMPP/WAMP)](#local-database-setup-xamppwamp)
3. [Remote Database Setup (FreeSQLDatabase)](#remote-database-setup-freesqldatabase)
4. [Connecting Database to Vercel](#connecting-database-to-vercel)
5. [Starting the Project Locally](#starting-the-project-locally)
6. [Vercel Deployment](#vercel-deployment)
7. [Switching Between Databases](#switching-between-databases)
8. [Database Schema Reference](#database-schema-reference)
9. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

The project supports **three database modes** controlled by environment variables:

```
┌──────────────────────────────────────────────────────────────┐
│                    LWR Website Builder                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │   LowDB     │    │  MySQL      │    │  Neon Postgres  │  │
│  │  (Fallback) │    │ (Primary)   │    │  (Alternative)  │  │
│  │  Local JSON  │    │ Local/Remote│    │   Cloud Only    │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
│                                                              │
│  db.js              mysql-db.js        postgres-db.js        │
│                     ↕                                        │
│              db-abstraction.js (Unified API Layer)            │
│                     ↕                                        │
│               server.js (Express Backend)                    │
│                     ↕                                        │
│              Vercel Serverless Functions                     │
└──────────────────────────────────────────────────────────────┘
```

### How the Database is Selected

The backend checks environment variables at startup in `server.js`:

```javascript
const USE_MYSQL = process.env.MYSQL_HOST && process.env.MYSQL_DATABASE;
```

| Condition | Database Used | Best For |
|-----------|--------------|----------|
| `MYSQL_HOST` + `MYSQL_DATABASE` are set | **MySQL** | Production (Vercel) & Local with XAMPP |
| Neither set | **LowDB** (JSON file) | Quick local dev, no DB install needed |

---

## Local Database Setup (XAMPP/WAMP)

### Step 1: Install XAMPP or WAMP

**XAMPP** (Recommended):
- Download from [https://www.apachefriends.org/](https://www.apachefriends.org/)
- Install with **MySQL/MariaDB** selected
- Works on Windows, Linux, macOS

**WAMP** (Windows Only):
- Download from [https://www.wampserver.com/](https://www.wampserver.com/)


### Step 2: Start MySQL Service

**For XAMPP:**
1. Open **XAMPP Control Panel**
2. Click **Start** next to **MySQL**
3. Status should turn **green** ✅

**For WAMP:**
1. Click the **WAMP tray icon**
2. Ensure **MySQL** service is running (green icon)

> [!TIP]
> You can also start MySQL from the command line:
> ```bash
> # Linux
> sudo systemctl start mysql
> 
> # Windows (XAMPP)
> C:\xampp\mysql\bin\mysqld.exe
> ```


### Step 3: Create the Database

Open **phpMyAdmin** at [http://localhost/phpmyadmin](http://localhost/phpmyadmin) or use the MySQL CLI:

```sql
-- Using phpMyAdmin or MySQL CLI
CREATE DATABASE IF NOT EXISTS `Website Builder`;
```

> [!NOTE]
> You **don't** need to create tables manually — the backend automatically creates all required tables when it starts for the first time.


### Step 4: Configure Local Environment

Edit `backend/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MySQL Configuration (Local XAMPP/WAMP)
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=Website Builder
MYSQL_PORT=3306

# CORS Configuration
FRONTEND_URL=http://localhost:3002

# Disable Postgres
USE_POSTGRES=false
```

> [!IMPORTANT]
> - Default XAMPP MySQL has **no password** for root user — leave `MYSQL_PASSWORD=` empty
> - If you set a password in phpMyAdmin, update `MYSQL_PASSWORD` accordingly


### Step 5: Start the Backend

```bash
cd backend
npm start
```

**Expected output:**
```
🔧 Database Mode: MySQL (Remote)
✓ MySQL Database initialized successfully
📦 Seeding default site...
✓ Default site created
🚀 Backend running on http://localhost:3001
```

---

## Remote Database Setup (FreeSQLDatabase)

[FreeSQLDatabase.com](https://www.freesqldatabase.com/) provides a **free remote MySQL** database — ideal for connecting to Vercel (since Vercel can't access your `localhost`).

### Step 1: Create an Account

1. Go to [https://www.freesqldatabase.com/](https://www.freesqldatabase.com/)
2. Sign up with your email
3. Click **"Create Account"**

### Step 2: Create a New Database

1. On the dashboard, click **"Create Database"** or it may auto-create one
2. You will receive an **email** with your credentials:

| Field | Example Value |
|-------|--------------|
| **Host** | `sql12.freesqldatabase.com` |
| **Database Name** | `sql12815850` |
| **Username** | `sql12815850` |
| **Password** | `YourPassword123` |
| **Port** | `3306` |

> [!CAUTION]
> Save these credentials immediately — you'll need them for Vercel configuration. **Never share your password publicly or commit it to Git.**

### Step 3: Access phpMyAdmin (Optional)

FreeSQLDatabase provides a web-based phpMyAdmin:
- URL: [https://www.phpmyadmin.co/](https://www.phpmyadmin.co/)
- Login with your database credentials
- Use this to **view data**, **run queries**, or **reset tables**

### Step 4: Test Connection Locally (Optional)

You can test the remote database locally before deploying to Vercel:

```env
# backend/.env - Testing remote DB locally
MYSQL_HOST=sql12.freesqldatabase.com
MYSQL_USER=sql12815850
MYSQL_PASSWORD=YourPassword123
MYSQL_DATABASE=sql12815850
MYSQL_PORT=3306
```

```bash
cd backend
npm start
```

If you see `✓ MySQL Database initialized successfully`, the connection works! ✅

---

## Connecting Database to Vercel

### Step 1: Access Vercel Dashboard

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **backend** project (e.g., `backend-six-xi-72`)

### Step 2: Add Environment Variables

Navigate to **Settings** → **Environment Variables** and add these:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `MYSQL_HOST` | `sql12.freesqldatabase.com` | ✅ Production, ✅ Preview, ✅ Development |
| `MYSQL_USER` | `sql12815850` | ✅ Production, ✅ Preview, ✅ Development |
| `MYSQL_PASSWORD` | `YourPassword123` | ✅ Production, ✅ Preview, ✅ Development |
| `MYSQL_DATABASE` | `sql12815850` | ✅ Production, ✅ Preview, ✅ Development |
| `MYSQL_PORT` | `3306` | ✅ Production, ✅ Preview, ✅ Development |
| `USE_POSTGRES` | `false` | ✅ Production, ✅ Preview, ✅ Development |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | ✅ Production, ✅ Preview, ✅ Development |
| `NODE_ENV` | `production` | ✅ Production |

> [!WARNING]
> Make sure to check **all three environment boxes** (Production, Preview, Development) when adding variables, otherwise the app will crash on certain deployments.

### Step 3: Configure Frontend Environment Variables

1. Go to your **frontend** project in Vercel (e.g., `lwr-project-smoky`)
2. Navigate to **Settings** → **Environment Variables**
3. Add:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `BACKEND_API_URL` | `https://your-backend.vercel.app` | ✅ Production, ✅ Preview, ✅ Development |

> [!IMPORTANT]
> **No trailing slash!** Use `https://backend-six-xi-72.vercel.app` **NOT** `https://backend-six-xi-72.vercel.app/`

### Step 4: Redeploy Both Projects

After adding environment variables, you **must redeploy** for changes to take effect:

```bash
# Deploy Backend
cd backend
vercel --prod

# Deploy Frontend
cd ../lwr-project
vercel --prod
```

### Step 5: Verify the Connection

1. Visit your backend health endpoint:
   ```
   https://your-backend.vercel.app/api/health
   ```
   
   Expected response:
   ```json
   {
     "status": "healthy",
     "dbType": "MySQL",
     "env": {
       "MYSQL_HOST": true,
       "MYSQL_USER": true,
       "MYSQL_DATABASE": true,
       "USE_MYSQL_FLAG": true
     }
   }
   ```

2. Visit your frontend URL and verify:
   - Components load in the sidebar ✅
   - You can create/edit pages ✅
   - Save works (data persists after page refresh) ✅

---

## Starting the Project Locally

### Quick Start (Full Stack)

**Terminal 1 — Start Database:**
```bash
# Start XAMPP MySQL (Linux)
sudo /opt/lampp/lampp startmysql

# OR start XAMPP MySQL (Windows)
# Open XAMPP Control Panel → Start MySQL
```

**Terminal 2 — Start Backend:**
```bash
cd backend
npm start
```

**Terminal 3 — Start Frontend:**
```bash
cd lwr-project
npm run dev
```

### Verify Everything is Running

| Service | URL | Expected |
|---------|-----|----------|
| MySQL | `localhost:3306` | Running via XAMPP |
| Backend API | `http://localhost:3001/api/health` | `{"status":"healthy","dbType":"MySQL"}` |
| Frontend | `http://localhost:3002` | Website Builder UI loads |

---

## Vercel Deployment

### Backend Deployment

The backend uses `vercel.json` for serverless configuration:

```json
{
    "version": 2,
    "builds": [
        {
            "src": "server.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "/server.js"
        }
    ],
    "env": {
        "NODE_ENV": "production"
    }
}
```

**Deploy command:**
```bash
cd backend
vercel --prod
```

### Frontend Deployment

```bash
cd lwr-project
vercel --prod
```

### Current Production URLs

| Service | URL |
|---------|-----|
| Frontend | `https://lwr-project-smoky.vercel.app` |
| Backend | `https://backend-six-xi-72.vercel.app` |
| Database | `sql12.freesqldatabase.com` (FreeSQLDatabase) |

---

## Switching Between Databases

### Option A: Local MySQL (XAMPP/WAMP)

```env
# backend/.env
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=Website Builder
MYSQL_PORT=3306
USE_POSTGRES=false
```

### Option B: Remote MySQL (FreeSQLDatabase)

```env
# backend/.env
MYSQL_HOST=sql12.freesqldatabase.com
MYSQL_USER=sql12815850
MYSQL_PASSWORD=YourPassword123
MYSQL_DATABASE=sql12815850
MYSQL_PORT=3306
USE_POSTGRES=false
```

### Option C: LowDB (No Database Install)

```env
# backend/.env — Comment out or remove MySQL variables
# MYSQL_HOST=
# MYSQL_USER=
# MYSQL_DATABASE=
USE_POSTGRES=false
```
- Data stored in `backend/data/db.json`
- No internet or database install required
- Good for quick prototyping

### Option D: Neon Postgres (Cloud)

```env
# backend/.env
USE_POSTGRES=true
POSTGRES_URL=postgres://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require
# Remove/comment MYSQL variables
```
- See [NEON_POSTGRES_SETUP.md](./NEON_POSTGRES_SETUP.md) for full setup

---

## Database Schema Reference

The following tables are auto-created by `mysql-db.js` when the backend starts:

### `sites` — Website Configuration
| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(255) PK | Unique site ID (e.g., `site_abc123`) |
| `name` | VARCHAR(255) | Site name |
| `domain` | VARCHAR(255) | Domain URL |
| `theme` | LONGTEXT (JSON) | Colors, typography, layout config |
| `created_at` | TIMESTAMP | Creation timestamp |

### `pages` — Site Pages
| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(255) PK | Unique page ID |
| `site_id` | VARCHAR(255) FK | References `sites.id` |
| `title` | VARCHAR(255) | Page title |
| `slug` | VARCHAR(255) | URL slug |
| `is_published` | BOOLEAN | Published status |
| `order` | INTEGER | Display order |
| `metadata` | LONGTEXT (JSON) | Additional page metadata |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Auto-updated on change |

### `components` — Page Components
| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(255) PK | Unique component ID |
| `page_id` | VARCHAR(255) FK | References `pages.id` |
| `type` | VARCHAR(100) | Component type (e.g., `hero`, `navbar`) |
| `order` | INTEGER | Display order |
| `props` | LONGTEXT (JSON) | Component properties |
| `created_at` | TIMESTAMP | Creation timestamp |

### `drafts` — Auto-saved Drafts
| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(255) PK | Unique draft ID |
| `page_id` | VARCHAR(255) FK | References `pages.id` |
| `content` | LONGTEXT (JSON) | Draft content |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Auto-updated on change |

### `versions` — Page Version History
| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(255) PK | Unique version ID |
| `page_id` | VARCHAR(255) FK | References `pages.id` |
| `version_number` | INTEGER | Version number |
| `content` | LONGTEXT (JSON) | Version content snapshot |
| `created_by` | VARCHAR(255) | Who created this version |
| `created_at` | TIMESTAMP | Creation timestamp |

> [!NOTE]
> All tables use `ON DELETE CASCADE` on foreign keys — deleting a site removes all its pages, components, drafts, and versions automatically.

---

## Troubleshooting

### ❌ "ECONNREFUSED 127.0.0.1:3306"

**Problem:** MySQL service is not running locally.

**Fix:**
1. Open XAMPP Control Panel → Start **MySQL**
2. Or run: `sudo systemctl start mysql` (Linux)
3. Verify: `mysql -u root -p` should connect successfully

---

### ❌ "Access denied for user 'root'@'localhost'"

**Problem:** Wrong MySQL credentials.

**Fix:**
1. Check `MYSQL_USER` and `MYSQL_PASSWORD` in `.env`
2. Default XAMPP: user=`root`, password=empty
3. Reset password in phpMyAdmin if needed

---

### ❌ "Unknown database 'Website Builder'"

**Problem:** Database doesn't exist yet.

**Fix:**
```sql
CREATE DATABASE IF NOT EXISTS `Website Builder`;
```

---

### ❌ "Can't connect to FreeSQLDatabase from Vercel"

**Problem:** Environment variables not set or wrong.

**Fix:**
1. Go to Vercel Dashboard → **Settings** → **Environment Variables**
2. Verify all `MYSQL_*` variables are correct
3. Make sure you checked **Production** environment
4. **Redeploy** after adding/changing variables:
   ```bash
   cd backend && vercel --prod
   ```

---

### ❌ "CORS Error: Not allowed by CORS"

**Problem:** Frontend URL not in allowed origins.

**Fix:**
1. Check `FRONTEND_URL` in Vercel backend environment variables
2. It should match your **exact frontend URL** (e.g., `https://lwr-project-smoky.vercel.app`)
3. For multiple origins, use comma separation:
   ```
   https://lwr-project-smoky.vercel.app,http://localhost:3002
   ```

---

### ❌ "Tables exist but data is empty after deploy"

**Problem:** First deployment — database is fresh and empty.

**Fix:** This is normal! The backend auto-seeds a default site on first run. Visit your frontend URL and you should see the default site created.

---

### ❌ FreeSQLDatabase "Database Expired"

**Problem:** FreeSQLDatabase free databases expire periodically.

**Fix:**
1. Log in to [FreeSQLDatabase.com](https://www.freesqldatabase.com/)
2. Renew or create a new database
3. Update Vercel environment variables with new credentials
4. Redeploy:
   ```bash
   cd backend && vercel --prod
   ```

---

## 📦 Quick Reference Commands

```bash
# ---- LOCAL DEVELOPMENT ----

# Start MySQL (XAMPP Linux)
sudo /opt/lampp/lampp startmysql

# Start Backend
cd backend && npm start

# Start Frontend
cd lwr-project && npm run dev


# ---- VERCEL DEPLOYMENT ----

# Deploy Backend to Production
cd backend && vercel --prod

# Deploy Frontend to Production
cd lwr-project && vercel --prod

# Check Backend Health
curl https://your-backend.vercel.app/api/health

# Check Ping (no DB dependency)
curl https://your-backend.vercel.app/api/ping


# ---- DATABASE MANAGEMENT ----

# Connect to local MySQL
mysql -u root -p

# Connect to remote MySQL
mysql -h sql12.freesqldatabase.com -u sql12815850 -p

# Reset all tables (run in MySQL)
DROP TABLE IF EXISTS versions, drafts, components, pages, sites;
# Then restart backend to recreate tables
```

---

## 🔗 Related Documents

- [MYSQL_INTEGRATION_GUIDE.md](./MYSQL_INTEGRATION_GUIDE.md) — Detailed MySQL driver code
- [NEON_POSTGRES_SETUP.md](./NEON_POSTGRES_SETUP.md) — Alternative Neon Postgres setup
- [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) — Vercel deployment basics
- [VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md) — Environment variable quick reference

---

*Last updated: February 14, 2026*
