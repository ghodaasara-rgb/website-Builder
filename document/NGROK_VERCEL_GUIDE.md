# 🔄 How to Restart Database & Update Vercel with Ngrok

This guide explains what to do every time you restart your PC or need to reconnect your local database to Vercel.

---

## 🚀 Step 1: Start Local MySQL (XAMPP)

1. Open **XAMPP Control Panel**.
2. Click **Start** next to **MySQL**.
3. Ensure it turns **green** (running on port 3306).

---

## 🌐 Step 2: Start Ngrok Tunnel

1. Open a terminal (Git Bash, PowerShell, or VS Code terminal).
2. Run this command to expose your local MySQL to the internet:

   ```bash
   ngrok tcp 3306
   ```

3. **Keep this terminal open!** If you close it, the connection stops.

---

## 🔍 Step 3: Get Your New Port

Look at the Ngrok output in your terminal. You need to find the **Forwarding** URL line, which looks like this:

```
Forwarding      tcp://0.tcp.in.ngrok.io:12345 -> localhost:3306
```

- **Host:** `0.tcp.in.ngrok.io` (Usually stays the same)
- **Port:** `12345` (This **CHANGES** every time you restart ngrok!)

> **Copy the new port number (e.g., `12345`).**

---

## ⚡ Step 4: Update Vercel

1. Go to your **Vercel Dashboard**.
2. Select your **Backend Project** (e.g., `backend-six-xi-72`).
3. Navigate to **Settings** → **Environment Variables**.
4. Find `MYSQL_PORT`:
   - Click **Edit**.
   - Paste the **NEW PORT** from Step 3.
   - Click **Save**.

---

## 🔄 Step 5: Redeploy Backend

Changing variables doesn't happen instantly. You must redeploy:

1. Go to the **Deployments** tab in your Vercel project.
2. Click the **three dots (⋮)** next to your latest deployment.
3. Select **Redeploy**.
4. Wait for it to finish (Status: `Ready`).

---

## ✅ Step 6: Verify Connection

1. Open your live website.
2. If data loads, you are successfully connected! 🎉
