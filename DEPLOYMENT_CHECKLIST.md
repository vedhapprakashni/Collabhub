# ✅ Deployment Checklist

Use this checklist to ensure everything is ready for deployment.

## Pre-Deployment

### Code Preparation
- [ ] Code is working locally (frontend and backend)
- [ ] All features tested
- [ ] Code pushed to GitHub/GitLab
- [ ] `.env` files are NOT committed (check `.gitignore`)
- [ ] `Procfile` created in `backend/` directory
- [ ] CORS settings updated in `backend/main.py` (or use `ALLOWED_ORIGINS` env var)

### Supabase Setup
- [ ] Supabase project created
- [ ] Database schema run (`database/schema.sql`)
- [ ] RLS policies enabled
- [ ] API keys copied (anon key and service_role key)
- [ ] Project URL noted

### Google OAuth
- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 Client ID created
- [ ] Redirect URI added: `https://xxxxx.supabase.co/auth/v1/callback`
- [ ] Client ID and Secret copied

---

## Frontend Deployment (Vercel)

### Setup
- [ ] Vercel account created (GitHub login)
- [ ] Repository connected
- [ ] Root directory set to `frontend`
- [ ] Build settings configured:
  - [ ] Framework: Vite
  - [ ] Build command: `npm run build`
  - [ ] Output directory: `dist`

### Environment Variables
- [ ] `VITE_SUPABASE_URL` added
- [ ] `VITE_SUPABASE_ANON_KEY` added
- [ ] `VITE_API_URL` added (will update after backend deploy)

### Deployment
- [ ] First deployment successful
- [ ] Frontend URL received (e.g., `https://collabhub.vercel.app`)
- [ ] Frontend loads correctly
- [ ] No console errors

---

## Backend Deployment (Render)

### Setup
- [ ] Render account created (GitHub login)
- [ ] New Web Service created
- [ ] Repository connected
- [ ] Root directory set to `backend`
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Environment Variables
- [ ] `SUPABASE_URL` added
- [ ] `SUPABASE_KEY` added (anon key)
- [ ] `SUPABASE_SERVICE_KEY` added (service_role key - keep secret!)
- [ ] `ALLOWED_ORIGINS` added (include frontend URL and localhost)

### Deployment
- [ ] First deployment successful
- [ ] Backend URL received (e.g., `https://collabhub-api.onrender.com`)
- [ ] API health check works: `https://your-api.onrender.com/`
- [ ] API docs accessible: `https://your-api.onrender.com/docs`

---

## Post-Deployment Configuration

### Update Frontend
- [ ] `VITE_API_URL` updated in Vercel to point to deployed backend
- [ ] Frontend redeployed with new API URL

### Update Google OAuth
- [ ] Production frontend URL added to Google OAuth redirect URIs
- [ ] Supabase callback URL still present
- [ ] Both URLs tested

### Testing
- [ ] Frontend loads at production URL
- [ ] Google login works
- [ ] User can create profile
- [ ] User can create projects
- [ ] User can browse projects
- [ ] User can send collaboration requests
- [ ] Project owners can accept/reject requests
- [ ] Team members can view projects they joined

### Security
- [ ] Environment variables not exposed in code
- [ ] Service role key only in backend (never in frontend)
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] CORS configured correctly
- [ ] RLS policies active in Supabase

---

## Monitoring

### Set Up Monitoring
- [ ] Vercel analytics enabled (optional)
- [ ] Render logs accessible
- [ ] Supabase dashboard monitoring active
- [ ] Error tracking set up (optional: Sentry, etc.)

### Documentation
- [ ] Production URLs documented
- [ ] Environment variables documented
- [ ] Deployment process documented for team

---

## Troubleshooting

If something doesn't work:

1. **Check Logs**
   - [ ] Vercel deployment logs
   - [ ] Render service logs
   - [ ] Browser console errors
   - [ ] Network tab in browser dev tools

2. **Verify Configuration**
   - [ ] Environment variables correct
   - [ ] URLs match exactly (no typos)
   - [ ] CORS origins include frontend URL
   - [ ] Google OAuth redirect URIs correct

3. **Test Locally**
   - [ ] Test with production environment variables
   - [ ] Verify database connection
   - [ ] Check API endpoints

---

## 🎉 Deployment Complete!

Once all items are checked:
- ✅ Your app is live!
- ✅ Share your production URL
- ✅ Monitor usage and errors
- ✅ Plan for scaling if needed

---

**Need help?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

