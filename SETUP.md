# Detailed Setup Guide for CollabHub

This guide provides step-by-step instructions to set up CollabHub from scratch.

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- Python 3.9+ ([Download](https://www.python.org/downloads/))
- A Supabase account ([Sign up](https://supabase.com))
- A Google Cloud Project with OAuth credentials

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: `collabhub` (or your choice)
   - Database Password: Choose a strong password
   - Region: Choose closest to you
4. Wait for project to be created (takes 1-2 minutes)

### 1.2 Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open `database/schema.sql` from this project
4. Copy and paste the entire contents into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. Verify all tables were created by going to **Table Editor**

### 1.3 Enable Google OAuth

1. Go to **Authentication** > **Providers**
2. Find **Google** in the list and toggle it **ON**
3. You'll need Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - (Optional) Enable Identity Toolkit API (Google+ API is deprecated)
   - Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: `https://<your-project-ref>.supabase.co/auth/v1/callback`
     - Find your project ref in Supabase Settings > API
   - Copy the **Client ID** and **Client Secret**
4. Back in Supabase, paste the Client ID and Client Secret
5. Click **Save**

### 1.4 Get API Keys

1. Go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`, keep this secret!)

## Step 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 2.2 Configure Environment

1. Copy `env.example` to `.env`:
   ```bash
   # On Windows
   copy env.example .env
   
   # On Mac/Linux
   cp env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_KEY=your_anon_key_here
   SUPABASE_SERVICE_KEY=your_service_role_key_here
   ```

### 2.3 Run Backend

```bash
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

Test the API: Open http://localhost:8000 in your browser. You should see `{"message": "CollabHub API", "version": "1.0.0"}`

## Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
cd frontend
npm install
```

### 3.2 Configure Environment

1. Copy `env.example` to `.env`:
   ```bash
   # On Windows
   copy env.example .env
   
   # On Mac/Linux
   cp env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_API_URL=http://localhost:8000
   ```

### 3.3 Run Frontend

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open http://localhost:5173 in your browser.

## Step 4: Test the Application

1. **Login**: Click "Sign in with Google" and complete OAuth flow
2. **Create Project**: Click "Create Project" and fill in the form
3. **Browse Projects**: View projects on the dashboard
4. **Request to Join**: Click on a project and send a collaboration request
5. **Accept Request**: As project owner, accept/reject requests in the Requests tab

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (should be 3.9+)
- Verify `.env` file exists and has correct values
- Check if port 8000 is already in use

### Frontend won't start
- Check Node version: `node --version` (should be 18+)
- Delete `node_modules` and run `npm install` again
- Verify `.env` file exists in `frontend/` directory

### Google OAuth not working
- Verify redirect URI matches exactly in Google Cloud Console
- Check Supabase redirect URL format
- Clear browser cache and cookies

### Database errors
- Verify schema.sql was run successfully
- Check Supabase dashboard > Table Editor to see if tables exist
- Review SQL Editor for any error messages

### API connection errors
- Verify backend is running on port 8000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in `backend/main.py`

## Production Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Backend (Render)

1. Create new Web Service in Render
2. Connect your GitHub repo
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables
6. Deploy

### Update Environment Variables

After deployment, update:
- Frontend `VITE_API_URL` to your backend URL
- Backend CORS origins to include your frontend URL

## Security Notes

- Never commit `.env` files to git
- Never expose `SUPABASE_SERVICE_KEY` in frontend
- Use environment variables in production
- Enable RLS policies (already in schema.sql)
- For production, implement proper JWT verification with signature checking

