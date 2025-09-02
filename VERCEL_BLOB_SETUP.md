# Vercel Blob Storage Setup Guide

## Overview
This application uses Vercel Blob Storage for handling image uploads in production. Vercel Blob is a serverless object storage solution that works seamlessly with Vercel deployments.

## Setup Instructions

### 1. Enable Vercel Blob Storage

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`barnevelds-dagblad`)
3. Navigate to the **Storage** tab
4. Click on **Create Database**
5. Select **Blob** from the options
6. Choose a name for your store (e.g., `barnevelds-images`)
7. Select your preferred region (closest to your users)
8. Click **Create**

### 2. Environment Variables

After creating the Blob store, Vercel automatically adds the required environment variables to your project:

- `BLOB_READ_WRITE_TOKEN` - Authentication token for read/write access

These are automatically available in your production environment. No manual configuration needed!

### 3. Local Development

For local development, the application will work without Vercel Blob configured. It will return mock URLs instead of uploading files.

If you want to test with actual Vercel Blob in development:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Find `BLOB_READ_WRITE_TOKEN`
4. Copy the value
5. Add it to your local `.env.local` file:
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
   ```

## How It Works

### Upload Endpoints

The application has three upload endpoints that use Vercel Blob:

1. **Admin Article Images**: `/api/admin/upload`
   - Used for article images in the admin panel
   - Requires authentication
   - 5MB file size limit
   - Accepts: JPG, PNG, WebP, GIF

2. **Public Uploads**: `/api/upload`
   - General purpose upload endpoint
   - Requires authentication
   - 5MB file size limit
   - Accepts: JPG, PNG, WebP

3. **Logo Uploads**: `/api/upload/logo`
   - Used for business logos
   - Requires authentication
   - 5MB file size limit
   - Accepts: JPG, PNG, WebP, SVG

### File Storage Structure

Files are organized in folders within the Blob storage:

```
articles/
  article-1234567890-abc123.jpg
  article-1234567891-def456.png
logos/
  logo-1234567892-ghi789.svg
  logo-1234567893-jkl012.png
```

### URLs

Uploaded files receive permanent URLs in this format:
```
https://[your-blob-store].public.blob.vercel-storage.com/[folder]/[filename]
```

These URLs are:
- Globally distributed via CDN
- Permanently accessible
- Optimized for performance

## Monitoring & Management

### View Uploaded Files

1. Go to your Vercel Dashboard
2. Navigate to Storage → Your Blob Store
3. Click on **Browse** to see all uploaded files

### Storage Limits

- Free tier: 1GB storage, 1TB bandwidth/month
- Pro tier: 100GB storage, 5TB bandwidth/month
- Check your usage in the Vercel Dashboard under Storage

### Delete Files

Files can be deleted through:
1. Vercel Dashboard (Storage → Browse → Delete)
2. Programmatically using the Vercel Blob SDK

## Troubleshooting

### "Storage not configured" Error

This means the `BLOB_READ_WRITE_TOKEN` is not set. Follow the setup instructions above.

### Upload Fails in Production

1. Check that Blob storage is enabled in Vercel Dashboard
2. Verify environment variables are set
3. Check Vercel Function logs for errors

### Files Not Displaying

1. Ensure the URLs are being saved correctly to your database
2. Check browser console for CORS errors
3. Verify the file was uploaded successfully in Vercel Dashboard

## Migration from Local Storage

If migrating from local file storage:

1. Upload existing images to Vercel Blob manually or via script
2. Update database records with new Blob URLs
3. Remove old `/public/uploads` folder from repository

## Cost Optimization

To minimize costs:

1. Implement image optimization before upload
2. Set appropriate cache headers
3. Use image formats like WebP for smaller file sizes
4. Regularly clean up unused images

## Support

For issues with Vercel Blob:
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Support](https://vercel.com/support)

For application-specific issues:
- Check the application logs in Vercel Dashboard
- Review the upload endpoint code in `/src/app/api/`