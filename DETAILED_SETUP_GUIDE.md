# 📘 Detailed Setup Guide - Step by Step

This guide walks you through each step of setting up CollabHub in detail.

---

## Step 1: Set Up Supabase Project and Run Database Schema

### 1.1 Create a Supabase Account and Project

1. **Sign up for Supabase**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "Start your project" or "Sign up"
   - You can sign up with:
     - GitHub account (recommended)
     - Email and password
     - Google account

2. **Create a New Project**
   - After signing in, click the **"New Project"** button (green button in top right)
   - Fill in the project details:
     ```
     Organization: Select or create one
     Name: collabhub (or any name you prefer)
     Database Password: [Create a strong password - SAVE THIS!]
     Region: Choose the region closest to you
     Pricing Plan: Free tier is fine for development
     ```
   - Click **"Create new project"**
   - Wait 1-2 minutes for the project to be provisioned

3. **Access Your Project Dashboard**
   - Once created, you'll be redirected to the project dashboard
   - This is your main control center

### 1.2 Access the SQL Editor

1. **Navigate to SQL Editor**
   - In the left sidebar, click **"SQL Editor"** (icon looks like a document/terminal)
   - This is where you'll run SQL commands

2. **Create a New Query**
   - Click the **"New query"** button
   - A new tab will open where you can write SQL

### 1.3 Run the Database Schema

1. **Open the Schema File**
   - In your project files, locate `database/schema.sql`
   - Open it in a text editor
   - Select all the contents (Ctrl+A / Cmd+A)
   - Copy it (Ctrl+C / Cmd+C)

2. **Paste into SQL Editor**
   - Go back to Supabase SQL Editor
   - Paste the entire schema (Ctrl+V / Cmd+V)
   - You should see SQL commands for:
     - Creating the `profiles` table
     - Creating the `projects` table
     - Creating the `collaboration_requests` table
     - Creating the `team_members` table
     - Creating indexes
     - Setting up RLS policies
     - Creating triggers

3. **Execute the Schema**
   - Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
   - Wait a few seconds
   - You should see a success message: "Success. No rows returned"

4. **Verify Tables Were Created**
   - In the left sidebar, click **"Table Editor"**
   - You should see these tables:
     - `profiles`
     - `projects`
     - `collaboration_requests`
     - `team_members`
   - If you see all four tables, ✅ Step 1 is complete!

---

## Step 2: Configure Google OAuth in Supabase

### 2.1 Set Up Google Cloud Project (If You Don't Have One)

1. **Go to Google Cloud Console**
   - Visit [https://console.cloud.google.com](https://console.cloud.google.com)
   - Sign in with your Google account

2. **Create a New Project**
   - Click the project dropdown at the top
   - Click **"New Project"**
   - Enter project name: `CollabHub` (or any name)
   - Click **"Create"**
   - Wait a few seconds, then select the new project from the dropdown

3. **Enable Identity Toolkit API (Optional but Recommended)**
   - **Note**: You don't strictly need to enable any API for OAuth 2.0 to work, but it's recommended
   - In the left sidebar, go to **"APIs & Services" > "Library"**
   - Search for **"Identity Toolkit API"**
   - Click on it and click **"Enable"**
   - ⚠️ **Important**: Google+ API is deprecated - use Identity Toolkit API instead

### 2.2 Create OAuth 2.0 Credentials

1. **Navigate to Credentials**
   - Go to **"APIs & Services" > "Credentials"** (in left sidebar)

2. **Configure OAuth Consent Screen** (First Time Only)
   - Click **"OAuth consent screen"** tab
   - Select **"External"** (unless you have a Google Workspace)
   - Click **"Create"**
   - Fill in required fields:
     ```
     App name: CollabHub
     User support email: Your email
     Developer contact information: Your email
     ```
   - Click **"Save and Continue"**
   - On "Scopes" page, click **"Save and Continue"**
   - On "Test users" page, click **"Save and Continue"**
   - On "Summary" page, click **"Back to Dashboard"**

3. **Create OAuth Client ID**
   - Go back to **"Credentials"** tab
   - Click **"+ Create Credentials"** > **"OAuth client ID"**
   - Application type: Select **"Web application"**
   - Name: `CollabHub Web Client`
   - **Authorized redirect URIs**: This is CRITICAL! ⚠️ Must be EXACTLY correct!
     - **Easiest way**: Get the redirect URI directly from Supabase:
       1. Go to Supabase dashboard
       2. Click **"Authentication"** > **"Providers"** tab
       3. Find **"Google"** provider
       4. Look for the redirect URL shown there (usually displayed near the provider settings)
       5. Copy that EXACT URL - it will be: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
     - **Alternative method**: Construct it manually:
       - Go to Supabase: **Settings** > **API**
       - Find **"Project URL"** - it looks like: `https://xxxxxxxxxxxxx.supabase.co`
       - The redirect URI format is: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
       - Example: If your project URL is `https://abc123xyz.supabase.co`, then redirect URI is:
         ```
         https://abc123xyz.supabase.co/auth/v1/callback
         ```
     - ⚠️ **CRITICAL FORMATTING:**
       - Must start with `https://` (not `http://`)
       - Must NOT have a trailing slash at the end
       - Must include the full path `/auth/v1/callback`
       - Case-sensitive - copy exactly as shown
     - Click **"+ Add URI"** and paste this URL
   - Click **"Create"**
   - A popup will appear with your credentials:
     - **Client ID** (starts with numbers, ends with `.apps.googleusercontent.com`)
     - **Client Secret** (looks like: `GOCSPX-xxxxxxxxxxxxx`)
   - **COPY BOTH** - you'll need them in the next step!
   - Click **"OK"**

### 2.3 Configure Google Provider in Supabase

1. **Go to Supabase Authentication Settings**
   - In Supabase dashboard, click **"Authentication"** (lock icon in sidebar)
   - Click **"Providers"** tab

2. **Enable Google Provider**
   - Scroll down to find **"Google"** in the providers list
   - Toggle the switch to **ON** (it will turn green/blue)

3. **Enter Google Credentials**
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
   - **Authorized Client IDs**: Leave empty (unless you have multiple)
   - **Enable Sign Up**: Leave this **ON** (so new users can sign up)

4. **Save**
   - Click **"Save"** button at the bottom
   - You should see a success message

✅ **Step 2 is complete!** Google OAuth is now configured.

---

## Step 3: Set Up Backend

### 3.1 Prerequisites Check

1. **Check Python Installation**
   ```bash
   python --version
   # Should show Python 3.9 or higher (e.g., Python 3.11.5)
   ```
   - If you get an error, download Python from [python.org](https://www.python.org/downloads/)
   - During installation, check "Add Python to PATH"

2. **Check pip (Python Package Manager)**
   ```bash
   pip --version
   # Should show pip version (e.g., pip 23.2.1)
   ```

### 3.2 Navigate to Backend Directory

1. **Open Terminal/Command Prompt**
   - **Windows**: Press `Win + R`, type `cmd`, press Enter
   - **Mac/Linux**: Open Terminal app
   - **VS Code**: Open integrated terminal (Ctrl+` or Terminal > New Terminal)

2. **Navigate to Backend Folder**
   ```bash
   cd D:\collabhub2\backend
   ```
   (Adjust path based on where you saved the project)

### 3.3 Create Virtual Environment

**Why?** Virtual environments keep your project dependencies isolated from other Python projects.

1. **Create Virtual Environment**
   ```bash
   python -m venv venv
   ```
   - This creates a `venv` folder in your backend directory

2. **Activate Virtual Environment**
   
   **On Windows:**
   ```bash
   venv\Scripts\activate
   ```
   - You should see `(venv)` appear at the start of your command prompt
   
   **On Mac/Linux:**
   ```bash
   source venv/bin/activate
   ```
   - You should see `(venv)` appear at the start of your terminal

   **Note**: If you close the terminal, you'll need to activate again:
   ```bash
   cd D:\collabhub2\backend
   venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # Mac/Linux
   ```

### 3.4 Install Python Dependencies

1. **Install Requirements**
   ```bash
   pip install -r requirements.txt
   ```
   - This installs all packages listed in `requirements.txt`:
     - `fastapi` - Web framework
     - `uvicorn` - ASGI server
     - `python-dotenv` - Environment variable management
     - `supabase` - Supabase Python client
     - `pydantic` - Data validation
     - And more...
   - Wait for installation to complete (may take 1-2 minutes)

2. **Verify Installation** (Optional)
   ```bash
   pip list
   ```
   - You should see all the installed packages

### 3.5 Create Environment Variables File

1. **Copy Example File**
   
   **Windows:**
   ```bash
   copy env.example .env
   ```
   
   **Mac/Linux:**
   ```bash
   cp env.example .env
   ```

2. **Get Your Supabase Keys**
   - Go to Supabase dashboard
   - Click **"Settings"** (gear icon)
   - Click **"API"**
   - You'll see several keys:
     - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
     - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)
     - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (different long string)
       - ⚠️ **WARNING**: Service role key bypasses RLS - keep it SECRET!

3. **Edit .env File**
   - Open `.env` file in your backend directory (use any text editor)
   - Replace the placeholder values:
     ```env
     SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
     SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (anon public key)
     SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role key)
     ```
   - Save the file

### 3.6 Run the Backend Server

1. **Start the Server**
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   - `uvicorn` - The ASGI server
   - `main:app` - Run the `app` from `main.py`
   - `--reload` - Auto-reload on code changes (development mode)
   - `--port 8000` - Run on port 8000

2. **Verify It's Running**
   - You should see output like:
     ```
     INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
     INFO:     Started reloader process [12345]
     INFO:     Started server process [12346]
     INFO:     Waiting for application startup.
     INFO:     Application startup complete.
     ```
   - The server is now running!

3. **Test the API**
   - Open your browser
   - Go to: `http://localhost:8000`
   - You should see: `{"message":"CollabHub API","version":"1.0.0"}`
   - Also try: `http://localhost:8000/docs` - This opens interactive API documentation!

4. **Keep Terminal Open**
   - ⚠️ Don't close this terminal - the server needs to keep running
   - To stop: Press `Ctrl+C`
   - To restart: Run the command again

✅ **Step 3 is complete!** Backend is running.

---

## Step 4: Set Up Frontend

### 4.1 Prerequisites Check

1. **Check Node.js Installation**
   ```bash
   node --version
   # Should show v18.0.0 or higher (e.g., v20.10.0)
   ```
   - If you get an error, download from [nodejs.org](https://nodejs.org/)
   - Install the LTS (Long Term Support) version

2. **Check npm (Node Package Manager)**
   ```bash
   npm --version
   # Should show version (e.g., 10.2.3)
   ```
   - npm comes with Node.js

### 4.2 Navigate to Frontend Directory

1. **Open a NEW Terminal Window** (keep backend terminal running!)
   - In VS Code: Click the `+` button in terminal to open a new tab
   - Or open a completely new terminal window

2. **Navigate to Frontend Folder**
   ```bash
   cd D:\collabhub2\frontend
   ```

### 4.3 Install Node Dependencies

1. **Install Packages**
   ```bash
   npm install
   ```
   - This reads `package.json` and installs all dependencies:
     - `react` - UI library
     - `react-dom` - React DOM renderer
     - `react-router-dom` - Routing
     - `@supabase/supabase-js` - Supabase client
     - `axios` - HTTP client
     - `tailwindcss` - CSS framework
     - `vite` - Build tool
     - And more...
   - Wait for installation (may take 2-3 minutes)
   - You'll see a `node_modules` folder created (this contains all packages)

2. **Verify Installation** (Optional)
   ```bash
   npm list --depth=0
   ```
   - Shows installed packages

### 4.4 Create Environment Variables File

1. **Copy Example File**
   
   **Windows:**
   ```bash
   copy env.example .env
   ```
   
   **Mac/Linux:**
   ```bash
   cp env.example .env
   ```

2. **Get Your Supabase Keys** (Same as backend setup)
   - Go to Supabase dashboard > Settings > API
   - Copy the same values:
     - **Project URL**
     - **anon public key**

3. **Edit .env File**
   - Open `.env` file in your frontend directory
   - Replace the placeholder values:
     ```env
     VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (anon public key)
     VITE_API_URL=http://localhost:8000
     ```
   - **Important**: All Vite environment variables must start with `VITE_`
   - `VITE_API_URL` points to your backend (running on port 8000)
   - Save the file

### 4.5 Run the Frontend Development Server

1. **Start the Dev Server**
   ```bash
   npm run dev
   ```
   - This starts the Vite development server
   - You should see output like:
     ```
     VITE v5.0.8  ready in 500 ms

     ➜  Local:   http://localhost:5173/
     ➜  Network: use --host to expose
     ```

2. **Open in Browser**
   - The browser should open automatically
   - Or manually go to: `http://localhost:5173`
   - You should see the CollabHub login page!

3. **Keep Terminal Open**
   - ⚠️ Don't close this terminal either
   - The dev server needs to keep running
   - To stop: Press `Ctrl+C`
   - To restart: Run `npm run dev` again

✅ **Step 4 is complete!** Frontend is running.

---

## Step 5: Add Environment Variables (Summary)

### 5.1 Backend .env File
**Location**: `backend/.env`

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your_anon_public_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

**Where to find:**
- Supabase Dashboard > Settings > API

### 5.2 Frontend .env File
**Location**: `frontend/.env`

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
VITE_API_URL=http://localhost:8000
```

**Where to find:**
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`: Same as backend (Supabase Dashboard > Settings > API)
- `VITE_API_URL`: Your backend server URL (localhost:8000 for development)

### 5.3 Important Notes

1. **Never commit .env files to Git**
   - They're already in `.gitignore`
   - These files contain secrets!

2. **Different Environments**
   - Development: Use `localhost:8000` for API
   - Production: Use your deployed backend URL (e.g., `https://your-api.railway.app`)

3. **Restart Required**
   - After changing `.env` files:
     - Backend: Stop (`Ctrl+C`) and restart (`uvicorn main:app --reload`)
     - Frontend: Stop (`Ctrl+C`) and restart (`npm run dev`)

---

## 🎉 You're All Set!

### What Should Be Running:

1. ✅ Backend server on `http://localhost:8000`
2. ✅ Frontend server on `http://localhost:5173`
3. ✅ Supabase project configured
4. ✅ Google OAuth configured

### Next Steps:

1. **Test Login**
   - Go to `http://localhost:5173`
   - Click "Sign in with Google"
   - Complete Google OAuth flow
   - You should be redirected back and logged in!

2. **Create Your First Project**
   - Click "Create Project"
   - Fill in the form
   - Submit

3. **Explore the App**
   - Browse projects
   - Send collaboration requests
   - Accept/reject requests

### Troubleshooting

- **Backend won't start**: Check Python version, virtual environment activated, `.env` file exists
- **Frontend won't start**: Check Node version, `npm install` completed, `.env` file exists
- **Google OAuth redirect_uri_mismatch error**: 
  - See [FIX_OAUTH_REDIRECT.md](./FIX_OAUTH_REDIRECT.md) for detailed fix instructions
  - Verify redirect URI in Google Cloud Console matches EXACTLY: `https://xxxxx.supabase.co/auth/v1/callback`
  - Must include `https://`, no trailing slash, exact path `/auth/v1/callback`
- **API errors**: Check backend terminal for error messages, verify environment variables

---

## Quick Reference Commands

### Backend
```bash
cd backend
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Mac/Linux
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm run dev
```

---

Happy coding! 🚀

