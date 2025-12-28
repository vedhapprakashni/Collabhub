# 🔧 Fix Google OAuth Redirect URI Mismatch Error

## The Error
`Error 400: redirect_uri_mismatch`

This happens when the redirect URI in Google Cloud Console doesn't exactly match what Supabase sends.

## Step-by-Step Fix

### Step 1: Get Your Supabase Redirect URI

1. Go to your **Supabase Dashboard**
2. Click **"Authentication"** in the left sidebar
3. Click **"Providers"** tab
4. Find **"Google"** in the list
5. Look for the redirect URL shown there - it should be something like:
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```
   **Copy this exact URL** (including `https://` and no trailing slash)

### Step 2: Add/Update Redirect URI in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (collabhub)
3. Go to **"APIs & Services" > "Credentials"** (left sidebar)
4. Find your **OAuth 2.0 Client ID** (should be named something like "CollabHub Web Client")
5. Click on the **pencil icon** (edit) next to it
6. Scroll down to **"Authorized redirect URIs"**
7. **Delete any existing entries** that might be wrong
8. Click **"+ Add URI"**
9. Paste the exact URL from Step 1:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
   ⚠️ **IMPORTANT:**
   - Must be **exactly** the same (case-sensitive)
   - Must include `https://`
   - Must NOT have a trailing slash
   - Must be the full path `/auth/v1/callback`
10. Click **"Save"**

### Step 3: Wait a Few Minutes

Google sometimes takes 1-2 minutes to propagate changes. Wait a minute or two before trying again.

### Step 4: Try Again

1. Go back to your app
2. Try logging in with Google again
3. It should work now!

---

## Common Mistakes to Avoid

❌ **Wrong:**
- `http://xxxxx.supabase.co/auth/v1/callback` (missing 's' in https)
- `https://xxxxx.supabase.co/auth/v1/callback/` (trailing slash)
- `https://xxxxx.supabase.co/callback` (missing /auth/v1/)
- `xxxxx.supabase.co/auth/v1/callback` (missing https://)

✅ **Correct:**
- `https://xxxxx.supabase.co/auth/v1/callback` (exact format)

---

## Still Not Working?

1. **Double-check the URL** character by character
2. **Clear browser cache** and cookies
3. **Try in an incognito/private window**
4. **Wait a few more minutes** for Google to update
5. **Verify the project reference** in Supabase matches what you entered

---

## Quick Checklist

- [ ] Found redirect URI from Supabase (Authentication > Providers > Google)
- [ ] Copied the EXACT URL (with https://, no trailing slash)
- [ ] Added it to Google Cloud Console (APIs & Services > Credentials > OAuth Client)
- [ ] Clicked "Save"
- [ ] Waited 1-2 minutes
- [ ] Tried logging in again

