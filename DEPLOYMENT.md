# Deployment Guide for RGIPT Alumni Page on Vercel

## Quick Fix Summary

I've made the following changes to fix your Vercel deployment issues:

### 1. Images Not Showing

**Problem:** Images were not loading on Vercel because static files weren't properly configured.

**Solution:**

- Updated `vercel.json` to properly route images and static files
- Modified `server.js` to serve images directory
- Created `.vercelignore` to exclude unnecessary files

### 2. Pages Not Routing Correctly

**Problem:** SPA (Single Page Application) routing wasn't working on Vercel.

**Solution:**

- Configured `vercel.json` with proper routes for HTML files
- Added fallback to `index.html` for all non-API routes

## Files Modified

1. ✅ `vercel.json` - Added proper routing configuration
2. ✅ `server.js` - Added image serving middleware
3. ✅ `.vercelignore` - Excludes unnecessary files from deployment

## Deployment Steps

1. **Commit your changes:**

   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   ```

2. **Push to GitHub:**

   ```bash
   git push origin main
   ```

3. **Deploy on Vercel:**

   - Go to https://vercel.com
   - Import your GitHub repository
   - Vercel will automatically detect the configuration
   - Add your environment variables:
     - `MONGODB_URI` - Your MongoDB connection string
     - `EMAIL_USER` - Your email for sending notifications
     - `EMAIL_PASSWORD` - Your email password
     - `ADMIN_EMAIL` - Admin email address

4. **Verify Deployment:**
   - Your site should be live at: `https://your-project.vercel.app`
   - Images should load correctly
   - Navigation should work properly

## Environment Variables Needed

Create a `.env` file locally and add these to Vercel Environment Variables:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/rgipt-alumni
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@rgipt.ac.in
PORT=3000
```

## Testing Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` file with your configuration

3. Run the server:

   ```bash
   npm start
   ```

4. Open http://localhost:3000 in your browser

## Common Issues Fixed

✅ Images now load from `/images/` directory
✅ HTML pages route correctly
✅ API endpoints work at `/api/*`
✅ Static assets (CSS, JS) are served properly
✅ Admin panel accessible at `/admin.html`

## Notes

- All images are in the `images/` folder
- The site uses client-side routing with hash navigation
- API calls go to `/api/*` endpoints
- Static files are served directly
