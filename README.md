# 🚀 CollabHub – Project Collaboration Platform

A full-stack web application where users can post project ideas, discover others' ideas, and collaborate in teams — powered by Google Auth + Supabase.

## 🌐 Tech Stack

### Frontend
- **React (Vite)**
- **Tailwind CSS**
- **Supabase Auth (Google OAuth)**
- **React Router**
- **Axios**

### Backend
- **Python (FastAPI)**
- **Supabase PostgreSQL**
- **Supabase Auth**
- **Row Level Security (RLS)**

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.9+
- Supabase account and project
- Google OAuth credentials

## 🚀 Quick Start

> **📘 For detailed step-by-step instructions, see [DETAILED_SETUP_GUIDE.md](./DETAILED_SETUP_GUIDE.md)**  
> **⚡ For a quick reference, see [QUICK_START.md](./QUICK_START.md)**

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `database/schema.sql`
3. Enable Google OAuth:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials (Client ID and Client Secret)
   - Add authorized redirect URLs: `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Copy your Supabase URL and anon key from Settings > API
5. Copy your service_role key from Settings > API (keep this secret, used only in backend)

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

Run the backend:

```bash
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
```

Run the frontend:

```bash
npm run dev
```

## 📁 Project Structure

```
collabhub2/
├── frontend/          # React + Vite frontend
├── backend/           # FastAPI backend
├── database/          # SQL schema files
└── README.md
```

## 🔐 Features

- ✅ Google OAuth authentication
- ✅ User profiles
- ✅ Create and browse projects
- ✅ Collaboration requests
- ✅ Team management
- ✅ Row Level Security (RLS)

## 🔒 Security

- Supabase Row Level Security (RLS) enabled
- Only project owners can accept/reject requests
- Auth middleware on backend
- Input validation with Pydantic

## 🚀 Deployment

Ready to deploy? See our comprehensive guides:

- **📘 Full Deployment Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Step-by-step instructions for all platforms
- **⚡ Quick Start**: [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md) - Fastest path to production
- **✅ Checklist**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Ensure nothing is missed

### Recommended Platforms

* **Frontend:** [Vercel](https://vercel.com) (free, easy, automatic deployments)
* **Backend:** [Render](https://render.com) (free tier available, Python-friendly)
* **Database:** Supabase (already cloud-hosted, no deployment needed)

### Quick Deploy

**Frontend (Vercel):**
1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Add environment variables
5. Deploy!

**Backend (Render):**
1. `Procfile` already created in `backend/`
2. New Web Service in Render
3. Set root directory to `backend`
4. Add environment variables
5. Deploy!

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📝 License

MIT

