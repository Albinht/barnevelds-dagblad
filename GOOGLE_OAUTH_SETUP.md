# Google OAuth Setup for Barnevelds Dagblad

## Fix for Error: 400 redirect_uri_mismatch

This guide will help you configure Google OAuth correctly to fix the redirect URI mismatch error.

## Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one if you haven't already)
3. Navigate to **APIs & Services** → **Credentials**

## Step 2: Configure OAuth 2.0 Client ID

1. Find your OAuth 2.0 Client ID (or create one if needed)
2. Click on the client ID to edit it

## Step 3: Add Authorized Redirect URIs

Add ALL of the following redirect URIs to your OAuth client:

### Production URIs (REQUIRED):
```
https://www.barneveldsdagblad.nl/api/auth/callback/google
https://barneveldsdagblad.nl/api/auth/callback/google
```

### Development URIs (for local testing):
```
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

### Important Notes:
- Add BOTH www and non-www versions for production
- The URIs must match EXACTLY (including https/http and trailing slashes)
- Save the changes after adding all URIs

## Step 4: Configure Vercel Environment Variables

In your Vercel dashboard, set these environment variables:

```bash
# MUST match your actual production domain
NEXTAUTH_URL=https://www.barneveldsdagblad.nl

# From Google Cloud Console
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Generate a secure secret
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
```

### To generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Step 5: Verify Configuration

After making these changes:

1. Wait 5-10 minutes for Google's changes to propagate
2. Clear your browser cache and cookies
3. Try logging in again at https://www.barneveldsdagblad.nl

## Troubleshooting

If you still get redirect_uri_mismatch error:

1. **Check the exact error message** - it shows which redirect_uri is being sent
2. **Verify NEXTAUTH_URL** - ensure it matches your production domain exactly
3. **Check for typos** - URIs must match character-for-character
4. **WWW vs non-WWW** - make sure you're accessing the site with the same subdomain as configured in NEXTAUTH_URL

## Common Issues and Solutions

### Issue: Still getting redirect_uri_mismatch
**Solution:** The error message shows the exact URI being used. Copy it exactly and add it to Google Cloud Console.

### Issue: Works locally but not in production
**Solution:** Verify that NEXTAUTH_URL in Vercel matches your production domain exactly.

### Issue: Redirect to wrong domain
**Solution:** Check if you have a custom domain redirect (www to non-www or vice versa) and ensure NEXTAUTH_URL matches the final domain.

## Additional Security Notes

- Never commit your GOOGLE_CLIENT_SECRET to git
- Use strong, unique values for NEXTAUTH_SECRET
- Consider restricting OAuth to specific domains in Google Cloud Console for added security

## Support

If you continue to have issues:
1. Check the Vercel deployment logs for any configuration errors
2. Verify all environment variables are set correctly in Vercel
3. Ensure your Google Cloud project is not in testing mode (should be in production for public access)