# 🔧 Troubleshooting Guide

## Common Errors and Solutions

### Backend Errors

#### 1. "ModuleNotFoundError: No module named 'xxx'"
**Cause**: Missing Python packages

**Solution**:
```bash
cd backend
# Make sure virtual environment is activated
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Mac/Linux

# Reinstall dependencies
pip install -r requirements.txt
```

---

#### 2. "Error loading .env file" or Environment variables not loading
**Cause**: `.env` file missing or incorrectly formatted

**Solution**:
1. Check that `backend/.env` exists
2. Verify format (no spaces around `=`, no quotes needed):
   ```env
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Restart the server after changing `.env`

---

#### 3. "Address already in use" or Port 8000 already in use
**Cause**: Another process is using port 8000

**Solution**:
- **Windows**: Find and kill the process
  ```bash
  netstat -ano | findstr :8000
  taskkill /PID <PID_NUMBER> /F
  ```
- **Mac/Linux**:
  ```bash
  lsof -ti:8000 | xargs kill
  ```
- Or use a different port:
  ```bash
  uvicorn main:app --reload --port 8001
  ```
  Then update `frontend/.env`: `VITE_API_URL=http://localhost:8001`

---

#### 4. "AttributeError: 'NoneType' object has no attribute 'xxx'"
**Cause**: Environment variables not set (returning None)

**Solution**:
1. Check `.env` file exists and has all required variables
2. Verify no typos in variable names
3. Restart the server

---

#### 5. Supabase connection errors
**Cause**: Invalid Supabase URL or keys

**Solution**:
1. Verify Supabase URL format: `https://xxxxx.supabase.co` (no trailing slash)
2. Verify keys from Supabase Dashboard > Settings > API
3. Check that service_role key is used (not anon key) for backend

---

### Frontend Errors

#### 1. "Cannot find module 'xxx'" or "Module not found"
**Cause**: Missing Node.js packages

**Solution**:
```bash
cd frontend
# Delete node_modules and reinstall
rm -rf node_modules  # Mac/Linux
rmdir /s node_modules  # Windows
npm install
```

---

#### 2. "VITE_SUPABASE_URL is not defined" or environment variables undefined
**Cause**: `.env` file missing or incorrect variable names

**Solution**:
1. Check that `frontend/.env` exists
2. Verify all variables start with `VITE_`:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_API_URL=http://localhost:8000
   ```
3. **Restart the dev server** after changing `.env` files

---

#### 3. "Network Error" or "Failed to fetch" when calling API
**Cause**: Backend not running or CORS issues

**Solution**:
1. Verify backend is running: `http://localhost:8000`
2. Check `VITE_API_URL` in `frontend/.env` matches backend URL
3. Check browser console for specific error
4. Verify CORS settings in `backend/main.py`

---

#### 4. Port 5173 already in use
**Cause**: Another Vite dev server running

**Solution**:
- Kill the process using port 5173
- Or use a different port:
  ```bash
  npm run dev -- --port 5174
  ```

---

#### 5. "Invalid hook call" or React errors
**Cause**: React version mismatch or multiple React instances

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

### Authentication Errors

#### 1. "User profile not found" after login
**Cause**: Profile trigger didn't run or user not created in profiles table

**Solution**:
1. Check if trigger exists in Supabase SQL Editor:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
2. Manually create profile if needed:
   ```sql
   INSERT INTO profiles (id, email)
   VALUES ('user-id-from-auth-users', 'user@email.com');
   ```

---

#### 2. Google OAuth redirect error
**Cause**: Redirect URI mismatch

**Solution**:
1. In Google Cloud Console, verify redirect URI is exactly:
   `https://[your-project-ref].supabase.co/auth/v1/callback`
2. In Supabase, verify Google provider is enabled
3. Clear browser cache and cookies

---

#### 3. "Authentication failed: Invalid token"
**Cause**: JWT token parsing error

**Solution**:
1. Check browser console for token errors
2. Verify user is logged in (check Supabase session)
3. Check backend terminal for detailed error message
4. Try logging out and logging back in

---

### Database Errors

#### 1. "relation does not exist" or "table does not exist"
**Cause**: Schema not run or tables not created

**Solution**:
1. Go to Supabase SQL Editor
2. Verify tables exist: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`
3. If missing, run `database/schema.sql` again

---

#### 2. "permission denied for table"
**Cause**: Row Level Security (RLS) blocking access

**Solution**:
1. Verify RLS policies are enabled (check in Supabase Dashboard > Table Editor)
2. Check that user is authenticated
3. Verify policies in `database/schema.sql` were run correctly

---

## Quick Diagnostic Commands

### Backend
```bash
# Check Python version
python --version

# Check if virtual environment is activated (should show (venv))
echo $VIRTUAL_ENV  # Mac/Linux
echo %VIRTUAL_ENV%  # Windows

# Check installed packages
pip list

# Test Supabase connection (in Python shell)
python
>>> import os
>>> from dotenv import load_dotenv
>>> load_dotenv()
>>> print(os.getenv("SUPABASE_URL"))
```

### Frontend
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check installed packages
npm list --depth=0

# Test environment variables (in browser console after starting dev server)
console.log(import.meta.env.VITE_SUPABASE_URL)
```

---

## Still Having Issues?

1. **Check the terminal output** - Most errors show detailed messages
2. **Check browser console** (F12) - Frontend errors appear here
3. **Check network tab** (F12 > Network) - See API request failures
4. **Verify all environment variables** are set correctly
5. **Restart both servers** after changing configuration
6. **Check Supabase dashboard** - Verify tables and policies exist

---

## Getting Help

When asking for help, include:
- The exact error message from terminal/browser console
- Which step you're on (backend setup, frontend setup, running app)
- Your OS (Windows/Mac/Linux)
- Python and Node versions
- Relevant code/configuration if applicable

