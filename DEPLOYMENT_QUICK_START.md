# ⚡ Quick Deployment Guide

## 🎯 Fastest Path to Production

### Prerequisites
- [ ] Code pushed to GitHub
- [ ] Supabase project ready
- [ ] Google OAuth configured

---

## Frontend → Vercel (5 minutes)

1. **Go to [vercel.com](https://vercel.com)** → Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your `collabhub` repo
   - Configure:
     - Root Directory: `frontend`
     - Framework: Vite (auto-detected)
     - Build Command: `npm run build` (auto-detected)

3. **Add Environment Variables**
   ```
   VITE_SUPABASE_URL = [your-supabase-url]
   VITE_SUPABASE_ANON_KEY = [your-anon-key]
   VITE_API_URL = [will-update-after-backend-deploy]
   ```

4. **Deploy** → Wait 2 minutes → Get URL!

---

## Backend → Render (10 minutes)

1. **Create `backend/Procfile`** (already created for you)
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

2. **Go to [render.com](https://render.com)** → Sign in with GitHub

3. **New Web Service**
   - Connect repo
   - Settings:
     - Name: `collabhub-api`
     - Root Directory: `backend`
     - Build: `pip install -r requirements.txt`
     - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables**
   ```
   SUPABASE_URL = [your-supabase-url]
   SUPABASE_KEY = [your-anon-key]
   SUPABASE_SERVICE_KEY = [your-service-key]
   ALLOWED_ORIGINS = https://your-frontend.vercel.app,http://localhost:5173
   ```

5. **Deploy** → Wait 5-10 minutes → Get URL!

6. **Update Frontend**
   - Go back to Vercel
   - Update `VITE_API_URL` to your Render backend URL
   - Redeploy

---

## ✅ Done!

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-api.onrender.com`

**Next**: Update Google OAuth redirect URIs to include your production URLs!

---

For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

