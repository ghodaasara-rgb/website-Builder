# Neon Postgres Setup Guide

This guide walks you through setting up Neon Postgres for your LWR Site Builder project - the recommended database solution for Vercel deployments.

## Why Neon Postgres?

- ✅ **Serverless-friendly**: Perfect for Vercel's serverless architecture
- ✅ **Persistent storage**: Unlike LowDB, data persists across deployments
- ✅ **Generous free tier**: Great for development and small projects
- ✅ **Auto-scaling**: Scales automatically based on usage
- ✅ **Official Vercel recommendation**: Replaces deprecated @vercel/postgres

---

## Step 1: Create a Neon Account

1. Go to [https://console.neon.tech/](https://console.neon.tech/)
2. Sign up for a free account (you can use GitHub, Google, or email)
3. Confirm your email address

---

## Step 2: Create a New Project

1. Click **"Create a project"** in the Neon dashboard
2. Configure your project:
   - **Project name**: `lwr-site-builder` (or your preferred name)
   - **Region**: Choose the region closest to your Vercel deployment region
   - **Postgres version**: Keep default (latest stable version)
3. Click **"Create project"**

> [!TIP]
> Choose the same region as your Vercel deployment for optimal latency.

---

## Step 3: Get Your Connection String

1. After creating the project, you'll see the dashboard
2. Click on **"Dashboard"** → **"Connection Details"**
3. Copy the **connection string** - it looks like this:

```
postgres://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

> [!IMPORTANT]
> **Keep this connection string secure!** Never commit it to version control or share it publicly.

---

## Step 4: Configure Local Environment

### Backend Configuration

1. Navigate to your backend directory:
```bash
cd backend
```

2. Create a `.env` file (if it doesn't exist):
```bash
cp .env.example .env
```

3. Edit `.env` and add your configuration:
```env
# Enable Postgres mode for production
USE_POSTGRES=true

# Your Neon connection string
POSTGRES_URL=postgres://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

# CORS configuration
FRONTEND_URL=http://localhost:3002
```

> [!NOTE]
> For local development, you can keep `USE_POSTGRES=false` to use LowDB, and only switch to `true` when testing Postgres locally or deploying to production.

---

## Step 5: Initialize Database Schema

The database tables will be automatically created when you start the server for the first time:

```bash
cd backend
npm start
```

You should see output like:
```
🔧 Database Mode: Neon Postgres
✓ Neon Postgres initialized
📦 Seeding default site...
✓ Default site created
🚀 Backend running on http://localhost:3001
```

---

## Step 6: Verify Database in Neon Console

1. Go back to [Neon Console](https://console.neon.tech/)
2. Select your project
3. Click on **"Tables"** in the left sidebar
4. You should see the following tables:
   - `sites`
   - `pages`
   - `components`
   - `drafts`
   - `versions`

---

## Step 7: Configure for Vercel Deployment

### Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `USE_POSTGRES` | `true` | Production, Preview, Development |
| `POSTGRES_URL` | `<your-connection-string>` | Production, Preview, Development |
| `FRONTEND_URL` | `<your-frontend-url>.vercel.app` | Production |

> [!CAUTION]
> Make sure to select the appropriate environments (Production, Preview, Development) when adding variables.

### Deploy Your Backend

```bash
cd backend
vercel --prod
```

Vercel will automatically use the environment variables you set.

---

## Database Management

### Viewing Data

**Option 1: Neon SQL Editor**
1. Go to Neon Console → SQL Editor
2. Run queries directly:
```sql
SELECT * FROM sites;
SELECT * FROM pages;
SELECT * FROM components;
```

**Option 2: TablePlus / DBeaver**
- Use any Postgres client
- Connect using your connection string

### Backup Data

Neon automatically creates backups, but you can also export manually:

```bash
# Using pg_dump (requires PostgreSQL installed locally)
pg_dump "your-connection-string" > backup.sql
```

### Reset Database

To clear all data and reinitialize:

```sql
DROP TABLE IF EXISTS versions CASCADE;
DROP TABLE IF EXISTS drafts CASCADE;
DROP TABLE IF EXISTS components CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS sites CASCADE;
```

Then restart your backend server to recreate tables.

---

## Switching Between LowDB and Neon Postgres

Your application supports both databases via the `USE_POSTGRES` environment variable:

### Use LowDB (Local Development)
```env
USE_POSTGRES=false
```
- Data stored in `backend/data/db.json`
- Fast for local development
- No internet connection required

### Use Neon Postgres (Production)
```env
USE_POSTGRES=true
POSTGRES_URL=<your-connection-string>
```
- Data stored in cloud
- Persistent across deployments
- Recommended for production

---

## Troubleshooting

### Connection Failed

**Error**: `connection to server failed`

**Solutions**:
1. Check your connection string is correct
2. Ensure SSL mode is included: `?sslmode=require`
3. Verify your IP is not blocked (Neon allows all IPs by default)
4. Check if Neon service is down: [https://neon.tech/status](https://neon.tech/status)

### Tables Not Created

**Error**: `relation "sites" does not exist`

**Solutions**:
1. Ensure `USE_POSTGRES=true` in your `.env`
2. Restart the backend server to trigger initialization
3. Check server logs for initialization errors

### Environment Variables Not Loaded

**Error**: Backend still using LowDB even with `USE_POSTGRES=true`

**Solutions**:
1. Verify `.env` file is in the `backend` directory
2. Restart your terminal/server after changing `.env`
3. In Vercel, redeploy after adding environment variables

### SSL/TLS Errors

**Error**: `SSL connection required`

**Solution**: Ensure your connection string ends with `?sslmode=require`

---

## Neon Free Tier Limits

- **Storage**: 3 GB
- **Compute time**: 300 hours/month (enough for small projects)
- **Projects**: 10
- **Branches**: 10 per project

For most small to medium projects, the free tier is sufficient.

---

## Next Steps

1. ✅ Test local connection with `npm start`
2. ✅ Verify tables are created in Neon Console
3. ✅ Configure Vercel environment variables
4. ✅ Deploy backend to Vercel
5. ✅ Test production deployment

Your LWR Site Builder is now ready for production with persistent database storage! 🎉

---

## Additional Resources

- [Neon Documentation](https://neon.tech/docs/introduction)
- [Neon + Vercel Guide](https://neon.tech/docs/guides/vercel)
- [PostgreSQL Official Docs](https://www.postgresql.org/docs/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
