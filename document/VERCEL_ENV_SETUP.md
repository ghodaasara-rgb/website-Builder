# 🚀 Final Configuration Steps

## ✅ What's Deployed So Far

- **Frontend**: https://lwr-project-smoky.vercel.app ✅
- **Backend**: https://backend-six-xi-72.vercel.app ✅  
- **Database**: Neon Postgres (configured) ✅

## ⚠️ Issue: Missing Environment Variables

Your deployments are live but can't communicate because environment variables aren't set yet.

---

## 🔧 Step 1: Configure Backend Environment Variables

1. Go to: https://vercel.com/dashboard
2. Click on **"backend"** project
3. Go to **Settings** → **Environment Variables**
4. Add these variables (click "Add" for each):

| Variable Name | Value | Apply to |
|---------------|-------|----------|
| `USE_POSTGRES` | `true` | Production, Preview, Development |
| `POSTGRES_URL` | `postgresql://neondb_owner:npg_LIBRW8l3vtSK@ep-twilight-fog-a1l13485-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Production, Preview, Development |
| `FRONTEND_URL` | `https://lwr-project-smoky.vercel.app` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

5. After adding all variables, **redeploy backend**:

```bash
cd /mnt/D82041E62041CBE6/Prince\ Kalavadia/Custom\ CSS/29012026/website\ builder\ with\ custom\ framework\ 29012026/website\ builder\ with\ custom\ framework/backend
vercel --prod
```

---

## 🔧 Step 2: Configure Frontend Environment Variable

1. Go to: https://vercel.com/dashboard
2. Click on **"lwr-project"** 
3. Go to **Settings** → **Environment Variables**
4. Add this variable:

| Variable Name | Value | Apply to |
|---------------|-------|----------|
| `BACKEND_API_URL` | `https://backend-six-xi-72.vercel.app` | Production, Preview, Development |

5. After adding, **redeploy frontend**:

```bash
cd /mnt/D82041E62041CBE6/Prince\ Kalavadia/Custom\ CSS/29012026/website\ builder\ with\ custom\ framework\ 29012026/website\ builder\ with\ custom\ framework/lwr-project
vercel --prod
```

---

## ✅ Verification

After both redeployments complete:

1. Visit: https://lwr-project-smoky.vercel.app
2. The website should load without errors
3. Components should be visible in the sidebar
4. Saving should work (data persists to Neon Postgres)

---

## 🎯 Quick Commands

**Redeploy Backend:**
```bash
cd /mnt/D82041E62041CBE6/Prince\ Kalavadia/Custom\ CSS/29012026/website\ builder\ with\ custom\ framework\ 29012026/website\ builder\ with\ custom\ framework/backend && vercel --prod
```

**Redeploy Frontend:**
```bash
cd /mnt/D82041E62041CBE6/Prince\ Kalavadia/Custom\ CSS/29012026/website\ builder\ with\ custom\ framework\ 29012026/website\ builder\ with\ custom\ framework/lwr-project && vercel --prod
```

---

## 📝 Important Notes

> [!IMPORTANT]
> - You MUST add environment variables through Vercel dashboard first
> - Then redeploy for changes to take effect
> - Both backend and frontend need their respective environment variables

> [!TIP]
> When adding environment variables in Vercel dashboard, check all three boxes:
> - ✅ Production
> - ✅ Preview  
> - ✅ Development

---

## ❓ Need Help?

If you see errors after configuration:
1. Check Vercel deployment logs: https://vercel.com/dashboard
2. Verify environment variables are saved correctly
3. Make sure you redeployed after adding variables

Ready to configure? Start with **Step 1** above! 🚀
