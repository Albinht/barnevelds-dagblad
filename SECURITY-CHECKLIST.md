# Security Checklist for Barnevelds Dagblad Production

## Critical Security Fixes Applied

### ✅ Fixed Security Vulnerabilities
1. **Removed wildcard image domains** - Previously allowed loading images from ANY website (major security risk)
2. **Added Content Security Policy (CSP)** - Restricts what resources can be loaded
3. **Added HTTPS enforcement headers** - Forces secure connections
4. **Added comprehensive security headers** - Protection against common attacks

## Chrome "Dangerous Site" Warning - Resolution Steps

### Immediate Actions Required:

#### 1. Deploy Security Fixes
```bash
git pull origin main
npm run build
# Deploy to Vercel
```

#### 2. Verify SSL Certificate
- Ensure your SSL certificate is valid and not self-signed
- Check certificate expiration date
- Verify certificate chain is complete

#### 3. Clear Chrome's Warning
After deploying fixes:
1. Visit: https://safebrowsing.google.com/safebrowsing/report_error/
2. Enter your URL: https://www.barneveldsdagblad.nl
3. Request a review
4. Wait 24-72 hours for Google to re-scan

#### 4. Clear Browser Data
- Clear cache and cookies for your domain
- Try accessing in incognito mode
- Test on different browsers

## Security Configuration Checklist

### ✅ Image Security
- [x] Only allow images from trusted domains
- [x] Remove wildcard hostname patterns
- [x] Disable dangerous SVG loading
- [ ] Audit all external image sources

### ✅ HTTP Headers
- [x] X-Content-Type-Options: nosniff
- [x] X-Frame-Options: DENY
- [x] X-XSS-Protection: 1; mode=block
- [x] Strict-Transport-Security (HSTS)
- [x] Content-Security-Policy (CSP)
- [x] Referrer-Policy
- [x] Permissions-Policy

### ✅ Content Security Policy
The CSP now includes:
- Default: Only allow resources from same origin
- Scripts: Allow Google OAuth scripts
- Styles: Allow Google Fonts
- Images: Allow HTTPS images only
- Connections: Allow Google APIs
- Objects: Blocked (prevents Flash/Java)
- Frames: Only Google OAuth

### Environment Variables Security
Verify in Vercel dashboard:
- [ ] DATABASE_URL is set and secure
- [ ] NEXTAUTH_SECRET is strong (32+ characters)
- [ ] NEXTAUTH_URL matches production domain
- [ ] GOOGLE_CLIENT_ID is correct
- [ ] GOOGLE_CLIENT_SECRET is secure
- [ ] No sensitive data in logs

### SSL/TLS Configuration
- [ ] Valid SSL certificate installed
- [ ] Certificate not expired
- [ ] Strong cipher suites only
- [ ] TLS 1.2 or higher enforced
- [ ] No mixed content warnings

### Additional Security Measures
- [ ] Rate limiting enabled (100 requests/15 min)
- [ ] Input validation on all forms
- [ ] SQL injection prevention (Prisma parameterized queries)
- [ ] XSS protection enabled
- [ ] CSRF protection active
- [ ] Authentication required for admin routes

## Testing Security

### Manual Tests
1. **Check Security Headers**
   - Visit: https://securityheaders.com
   - Enter your URL
   - Should score A or better

2. **SSL Test**
   - Visit: https://www.ssllabs.com/ssltest/
   - Enter your URL
   - Should score A or better

3. **Google Safe Browsing**
   - Visit: https://transparencyreport.google.com/safe-browsing/search
   - Enter your URL
   - Should show "No unsafe content found"

### Browser Console Checks
Open browser console and verify:
- No mixed content warnings
- No CSP violations
- No CORS errors for legitimate resources

## If Warning Persists

If Chrome still shows the warning after 72 hours:

1. **Check for malware**
   - Scan all uploaded files
   - Check for suspicious JavaScript
   - Audit third-party scripts

2. **Review server logs**
   - Look for suspicious activity
   - Check for spam content
   - Review user-generated content

3. **Contact hosting provider**
   - Ask if server is blacklisted
   - Check for server-level issues
   - Verify IP reputation

4. **Google Search Console**
   - Add site to Search Console
   - Check Security Issues section
   - Request manual review if needed

## Monitoring

### Set up alerts for:
- SSL certificate expiration
- Security header changes
- Unusual traffic patterns
- Failed login attempts
- CSP violations

### Regular audits:
- Monthly security header check
- Quarterly dependency updates
- Annual penetration testing
- Regular backup verification

## Emergency Contacts

- Vercel Support: https://vercel.com/support
- Google Safe Browsing: https://safebrowsing.google.com/
- SSL Provider: [Your SSL provider support]

## Notes

The security fixes implemented should resolve the Chrome warning within 24-72 hours after deployment and Google's re-scan. The warning was likely triggered by the wildcard image domain configuration that allowed loading resources from any website, which is a major security vulnerability often associated with compromised sites.