# Vercel Deployment Guide

This guide explains how to deploy your backend to Vercel effectively.

## 1. Prepare for Serverless

I have updated your `server.js` to support Vercel's Serverless environment.
- On Vercel, it exports a handler function.
- Locally, it starts the server with `app.listen` as usual.

## 2. Vercel Configuration Setup

You already have a `vercel.json` file. Ensure it remains as follows (I have verified it):

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
    ]
}
```

## 3. Environment Variables (CRITICAL)

When you deploy to Vercel, you **MUST** add your environment variables in the Vercel Dashboard settings for your project.

**Go to:** `Settings` > `Environment Variables`

Add the following:

| Key | Value |
| --- | --- |
| `MYSQL_HOST` | `sql12.freesqldatabase.com` |
| `MYSQL_USER` | `sql12815850` |
| `MYSQL_PASSWORD` | `XrshGNyNX9` |
| `MYSQL_DATABASE` | `sql12815850` |
| `MYSQL_PORT` | `3306` |
| `USE_POSTGRES` | `false` |
| `FRONTEND_URL` | `https://your-frontend-domain.vercel.app` (Add your deployed frontend URL here) |

## 4. Deploy

Run the following command in your `backend` directory:

```bash
vercel
```


Follow the prompts to link your project.

## 5. Deploy Frontend (lwr-project)

After the backend is deployed, you will get a URL (e.g., `https://your-backend.vercel.app`). You need this for the frontend.

1.  Navigate to `lwr-project` folder:
    ```bash
    cd ../lwr-project
    ```
2.  Deploy to Vercel:
    ```bash
    vercel
    ```
3.  **Configure Frontend Environment:**
    *   Go to Vercel Dashboard -> Project Settings -> Environment Variables.
    *   Add `API_URL` and set it to your **Backend URL** (e.g., `https://your-backend.vercel.app`). **Do not add a trailing slash.**
    *   Redeploy the frontend for changes to take effect.
