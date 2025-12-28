# 🚀 Deployment Guide - CollabHub

This guide covers deploying CollabHub to production platforms.

## 📋 Pre-Deployment Checklist

- [ ] Backend tested locally and working
- [ ] Frontend tested locally and working
- [ ] Supabase project created and schema run
- [ ] Google OAuth configured
- [ ] Environment variables documented
- [ ] Code pushed to GitHub/GitLab

---

## 🌐 Frontend Deployment (Vercel - Recommended)

### Why Vercel?
- Free tier with generous limits
- Automatic deployments from GitHub
- Built-in CI/CD
- Easy environment variable management
- Great for React/Vite apps

### Step 1: Prepare Frontend for Production

1. **Update API URL** (we'll set this via environment variables)
   - The frontend already uses `VITE_API_URL` from `.env`
   - No code changes needed!

2. **Build Test** (optional but recommended)
   ```bash
   cd frontend
   npm run build
   ```
   - This creates a `dist` folder
   - Test that it builds without errors

### Step 2: Push to GitHub

1. **Initialize Git** (if not already done)
   ```bash
   cd d:\collabhub2
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name: `collabhub`
   - Make it **Public** (or Private if you have GitHub Pro)
   - Don't initialize with README
   - Click "Create repository"

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/collabhub.git
   git branch -M main
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your GitHub username)

### Step 3: Deploy to Vercel

1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (recommended)

2. **Import Project**
   - Click "Add New..." > "Project"
   - Select your `collabhub` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (click "Edit" and set to `frontend`)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add these three:
     ```
     VITE_SUPABASE_URL = https://xxxxx.supabase.co
     VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     VITE_API_URL = https://your-backend-url.com
     ```
   - ⚠️ **Note**: `VITE_API_URL` should point to your deployed backend (we'll deploy that next)

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - You'll get a URL like: `https://collabhub.vercel.app`

6. **Update Google OAuth Redirect URI**
   - Go to Google Cloud Console > Credentials > OAuth Client
   - Add your Vercel URL to authorized redirect URIs:
     ```
     https://collabhub.vercel.app
     ```
   - Also keep the Supabase callback URL:
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```

✅ **Frontend deployed!** You'll get a URL like `https://collabhub.vercel.app`

---

## 🖥️ Backend Deployment (Render - Recommended)

### Why Render?
- Free tier available
- Easy Python/FastAPI deployment
- Automatic HTTPS
- Environment variable management
- Good free tier limits

### Step 1: Prepare Backend

1. **Create `Procfile`** (tells Render how to run the app)
   - Create file: `backend/Procfile` (no extension)
   - Add this line:
     ```
     web: uvicorn main:app --host 0.0.0.0 --port $PORT
     ```

2. **Update CORS** (allow your frontend domain)
   - We'll do this via environment variables, but you can also update `backend/main.py`:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "http://localhost:5173",
           "http://localhost:3000",
           "https://collabhub.vercel.app",  # Add your Vercel URL
           "https://*.vercel.app",  # Allow all Vercel previews
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

### Step 2: Deploy to Render

1. **Sign up/Login to Render**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" > "Web Service"
   - Connect your GitHub repository
   - Select your `collabhub` repo

3. **Configure Service**
   - **Name**: `collabhub-api` (or any name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free (or paid if you need more resources)

4. **Add Environment Variables**
   - Click "Environment" tab
   - Add these:
     ```
     SUPABASE_URL = https://xxxxx.supabase.co
     SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (anon key)
     SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service key)
     ```
   - ⚠️ **Important**: Use service_role key for `SUPABASE_SERVICE_KEY`

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for first deployment
   - You'll get a URL like: `https://collabhub-api.onrender.com`

6. **Update Frontend Environment Variable**
   - Go back to Vercel
   - Update `VITE_API_URL` to your Render backend URL:
     ```
     VITE_API_URL = https://collabhub-api.onrender.com
     ```
   - Redeploy frontend (Vercel auto-deploys on env var changes)

✅ **Backend deployed!**

---

## 🔄 Alternative Platforms

### Frontend Alternatives

#### Netlify
1. Sign up at [netlify.com](https://netlify.com)
2. Connect GitHub repo
3. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. Add environment variables (same as Vercel)
5. Deploy!

#### GitHub Pages (Static)
- Requires build step
- Free but less features
- Good for simple static sites

### Backend Alternatives

#### Railway
1. Sign up at [railway.app](https://railway.app)
2. New Project > Deploy from GitHub
3. Select repo > Add Service > GitHub Repo
4. Set root directory to `backend`
5. Add environment variables
6. Railway auto-detects Python and runs it

#### Fly.io
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Sign up: `fly auth signup`
3. In `backend/` directory:
   ```bash
   fly launch
   ```
4. Follow prompts
5. Add secrets:
   ```bash
   fly secrets set SUPABASE_URL=xxx SUPABASE_KEY=xxx SUPABASE_SERVICE_KEY=xxx
   ```

#### Heroku (Paid)
- Requires credit card for free tier
- Similar process to Render
- Use `Procfile` and environment variables

---

## 🔧 Post-Deployment Configuration

### 1. Update Supabase RLS (if needed)
- Your RLS policies should work as-is
- Test that authenticated requests work

### 2. Update Google OAuth
- Add your production frontend URL to authorized redirect URIs
- Keep Supabase callback URL

### 3. Test Everything
- [ ] Frontend loads
- [ ] Google login works
- [ ] Can create projects
- [ ] Can send collaboration requests
- [ ] Can accept/reject requests

### 4. Set Up Custom Domain (Optional)
- **Vercel**: Settings > Domains > Add your domain
- **Render**: Settings > Custom Domains > Add domain
- Update DNS records as instructed

---

## 🐛 Troubleshooting Deployment

### Frontend Issues

**Build fails:**
- Check build logs in Vercel/Netlify
- Verify all environment variables are set
- Check that `npm install` completes successfully

**Environment variables not working:**
- Must start with `VITE_` for Vite
- Restart deployment after adding variables
- Check for typos

**API calls fail:**
- Verify `VITE_API_URL` points to deployed backend
- Check CORS settings in backend
- Check browser console for errors

### Backend Issues

**Service won't start:**
- Check logs in Render/Railway dashboard
- Verify `Procfile` or start command is correct
- Check Python version compatibility

**Database connection fails:**
- Verify environment variables are set correctly
- Check Supabase project is active
- Verify service_role key (not anon key) for backend

**CORS errors:**
- Update `allow_origins` in `backend/main.py` to include frontend URL
- Restart backend after changes

---

## 📊 Monitoring & Maintenance

### Vercel
- View deployments in dashboard
- Check function logs
- Monitor bandwidth usage

### Render
- View service logs
- Monitor uptime
- Check resource usage

### Supabase
- Monitor database usage
- Check API requests
- View authentication logs

---

## 🔒 Security Checklist

- [ ] Environment variables set (never commit `.env` files)
- [ ] Service role key only in backend (never in frontend)
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] CORS configured correctly
- [ ] RLS policies enabled in Supabase
- [ ] Google OAuth redirect URIs restricted to your domains

---

## 💰 Cost Estimation

### Free Tier (Development/Small Projects)
- **Vercel**: Free (generous limits)
- **Render**: Free (with limitations)
- **Supabase**: Free tier (500MB database, 2GB bandwidth)
- **Google OAuth**: Free
- **Total**: $0/month

### Paid Tier (Production)
- **Vercel Pro**: $20/month
- **Render**: $7-25/month (depending on needs)
- **Supabase Pro**: $25/month
- **Total**: ~$50-70/month

---

## 🎉 You're Deployed!

Your app should now be live at:
- **Frontend**: `https://collabhub.vercel.app`
- **Backend**: `https://collabhub-api.onrender.com`

Share your app with the world! 🚀

