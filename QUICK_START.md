# ⚡ Quick Start Guide

For detailed instructions, see [DETAILED_SETUP_GUIDE.md](./DETAILED_SETUP_GUIDE.md)

## 🚀 5 Steps to Get Running

### Step 1: Supabase Setup ⏱️ 5-10 minutes

**What you're doing**: Creating database and configuring authentication

1. Create account at [supabase.com](https://supabase.com)
2. Create new project → Wait 1-2 minutes
3. Go to **SQL Editor** → Run `database/schema.sql`
4. Go to **Settings > API** → Copy your keys (you'll need them)

**✅ Checkpoint**: You should see 4 tables in Table Editor

---

### Step 2: Google OAuth Setup ⏱️ 10-15 minutes

**What you're doing**: Enabling Google login

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → (Optional) Enable Identity Toolkit API
3. Create OAuth 2.0 Client ID (Web application)
4. Add redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
5. Copy Client ID & Secret → Paste into Supabase (Authentication > Providers > Google)
6. Enable Google provider → Save

**✅ Checkpoint**: Google provider shows as "Enabled" in Supabase

---

### Step 3: Backend Setup ⏱️ 5 minutes

**What you're doing**: Setting up Python API server

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from env.example)
copy env.example .env  # Windows
cp env.example .env    # Mac/Linux

# Edit .env - add your Supabase keys (from Step 1)

# Run server
uvicorn main:app --reload --port 8000
```

**✅ Checkpoint**: Visit `http://localhost:8000` → See `{"message":"CollabHub API"}`

---

### Step 4: Frontend Setup ⏱️ 3-5 minutes

**What you're doing**: Setting up React app

```bash
# Open NEW terminal window (keep backend running!)

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
copy env.example .env  # Windows
cp env.example .env    # Mac/Linux

# Edit .env - add your Supabase keys and API URL

# Run dev server
npm run dev
```

**✅ Checkpoint**: Visit `http://localhost:5173` → See login page

---

### Step 5: Environment Variables ⏱️ 2 minutes

**What you're doing**: Connecting everything together

#### Backend `.env` (`backend/.env`)
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ Get from: Supabase Dashboard > Settings > API

#### Frontend `.env` (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:8000
```
→ Get from: Supabase Dashboard > Settings > API (same as backend, except API URL)

**✅ Checkpoint**: Both servers running, `.env` files configured

---

## 🎯 Test It Out!

1. **Login**: Go to `http://localhost:5173` → Click "Sign in with Google"
2. **Create Project**: Click "Create Project" → Fill form → Submit
3. **Browse**: View projects on dashboard
4. **Join**: Click a project → Request to join
5. **Accept**: As project owner, go to Requests tab → Accept/Reject

---

## 🔧 Common Issues

| Problem | Solution |
|---------|----------|
| Backend won't start | Check Python version (3.9+), activate venv, check .env exists |
| Frontend won't start | Check Node version (18+), run `npm install`, check .env exists |
| Google OAuth fails | Verify redirect URI matches exactly, check browser console |
| API errors | Check backend terminal, verify environment variables |
| "Module not found" | Run `pip install -r requirements.txt` (backend) or `npm install` (frontend) |

---

## 📚 Need More Help?

- **Detailed Guide**: See [DETAILED_SETUP_GUIDE.md](./DETAILED_SETUP_GUIDE.md)
- **Architecture**: See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- **Full README**: See [README.md](./README.md)

---

## 🎉 You're Ready!

Once both servers are running:
- ✅ Backend: `http://localhost:8000`
- ✅ Frontend: `http://localhost:5173`

Start building! 🚀

