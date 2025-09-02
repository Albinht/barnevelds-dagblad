# Google OAuth Setup Instructions

## 🔐 **Google OAuth is now configured!** 

## 🚀 **Setup Steps:**

### 1. **Google Cloud Console Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** → **Credentials** 
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Choose **Web application**
   - Add authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://yourdomain.com/api/auth/callback/google`

### 2. **Environment Variables**

Add these to your `.env` file:

```bash
# Google OAuth (for admin login)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000  # Change to your domain in production
NEXTAUTH_SECRET=your_nextauth_secret_32_chars_minimum
```

### 3. **Authorized Emails**

Update the email whitelist in `src/lib/nextauth.ts`:

```typescript
const ADMIN_EMAIL_WHITELIST = [
  'your.email@gmail.com',        // ← Add your email here
  'editor@barneveldsdagblad.nl',
  // Add more authorized email addresses
]
```

### 4. **Database Migration**

Run the database migration to add NextAuth tables:

```bash
npm run db:migrate
```

### 5. **Test the Login**

1. Start the development server: `npm run dev`
2. Go to: `http://localhost:3000/login`
3. Click "Sign in with Google"
4. Sign in with an authorized Google account

## ✅ **What Changed:**

- **Login Method**: Username/password → Google OAuth
- **Security**: Email whitelist for admin access
- **Database**: Added NextAuth.js tables (Account, Session, VerificationToken)
- **Middleware**: Now uses NextAuth.js sessions
- **UI**: New Google login button

## 🎯 **Benefits:**

- **Veiliger**: No more hardcoded passwords
- **Professioneler**: Modern OAuth flow
- **Gemakkelijker**: One-click Google login
- **Controleerbaar**: Only whitelisted emails get access

## 🚨 **Important Notes:**

- Only emails in the whitelist can access admin functions
- First-time users automatically get ADMIN role
- All session management is handled by NextAuth.js
- Rate limiting and security headers still active

---

**Ready to test!** Just add your Google credentials and authorized emails! 🚀