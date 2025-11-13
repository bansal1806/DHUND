# Vercel Deployment Guide for DHUND

This guide will help you deploy the DHUND project to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Vercel CLI installed (optional, for CLI deployment)
3. Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to Git**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect the configuration

3. **Configure Environment Variables**
   In the Vercel dashboard, go to Settings → Environment Variables and add:
   - `OPENAI_API_KEY` - Your OpenAI API key (required for AI features)
   - `REACT_APP_API_URL` - Leave empty for production (uses relative URLs)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add REACT_APP_API_URL
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Project Structure

The deployment is configured with:
- **Frontend**: React app in `frontend/` directory
- **Backend**: FastAPI serverless functions in `api/` directory
- **Configuration**: `vercel.json` handles routing

## Important Notes

### File Storage Limitations
- Vercel serverless functions have a read-only filesystem except `/tmp`
- Uploaded files are stored in `/tmp/uploads` (temporary storage)
- **For production**, consider using:
  - Vercel Blob Storage for file uploads
  - External database (PostgreSQL, MongoDB) instead of SQLite
  - Cloud storage (AWS S3, Cloudinary) for images

### Database Considerations
- SQLite database is stored in `/tmp` (ephemeral)
- **Data will be lost** on each serverless function restart
- **For production**, migrate to:
  - PostgreSQL (Vercel Postgres)
  - MongoDB Atlas
  - Supabase
  - PlanetScale

### API Endpoints
- All API routes are prefixed with `/api/`
- Frontend automatically uses relative URLs in production
- Development uses `http://localhost:8000`

## Troubleshooting

### Common Vercel Errors

#### Missing public directory / Missing build script
- ✅ **Fixed**: `vercel-build` script is configured in `frontend/package.json`
- ✅ **Fixed**: Build output directory is correctly set to `frontend/build` in `vercel.json`

#### Conflicting functions and builds configuration
- ✅ **Fixed**: Using `builds` configuration only (removed conflicting `functions` property)
- Note: Function timeout is configured via Vercel dashboard settings instead

#### Mixed routing properties
- ✅ **Fixed**: Only using `routes` property (no conflicting rewrites/redirects/headers)

### Build Errors

1. **Python dependencies not found / distutils error**
   - Ensure `requirements.txt` is in the root directory
   - **Python Version**: Created `runtime.txt` with `python-3.11` (Python 3.12 removed distutils)
   - Check that all dependencies are compatible with Python 3.11
   - If using Python 3.12, update all packages to latest versions

2. **Frontend build fails**
   - Check `frontend/package.json` has `vercel-build` script
   - Ensure all dependencies are listed
   - Verify build output directory exists: `frontend/build`

3. **API routes not working / 404 errors**
   - Verify `vercel.json` routing configuration
   - Check that `api/index.py` exists and exports `handler`
   - Ensure API routes start with `/api/`
   - **React Router 404**: All non-API routes must serve `index.html` (catch-all route)
   - Static assets should be served directly before the catch-all

### Runtime Errors

1. **Function timeout**
   - Default timeout is 10 seconds (Hobby plan)
   - **Configure in Vercel Dashboard**: Settings → Functions → Max Duration (set to 30s)
   - For longer operations, consider:
     - Background jobs
     - Queue system (Vercel Queue)
     - Separate API service
   - Pro plan allows up to 60 seconds, Enterprise allows up to 900 seconds

2. **File upload issues**
   - Check file size limits (4.5MB for Hobby plan)
   - Use `/tmp` directory for temporary storage
   - Consider streaming large files

3. **Database connection errors**
   - SQLite in `/tmp` is ephemeral
   - Migrate to external database for persistence

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `REACT_APP_API_URL` | API base URL (empty for production) | No |

## Post-Deployment

1. **Test all endpoints**
   - Visit your Vercel URL
   - Test missing person report
   - Test citizen reporting
   - Test demo functionality

2. **Monitor logs**
   - Check Vercel dashboard → Functions → Logs
   - Monitor for errors or timeouts

3. **Set up custom domain** (optional)
   - Go to Settings → Domains
   - Add your custom domain
   - Configure DNS records

## Production Recommendations

1. **Database**: Migrate from SQLite to PostgreSQL
2. **File Storage**: Use Vercel Blob or Cloudinary
3. **Error Monitoring**: Set up Sentry or similar
4. **Analytics**: Add Vercel Analytics
5. **Rate Limiting**: Implement API rate limiting
6. **Caching**: Use Vercel Edge Caching for static assets

## Support

For issues specific to:
- **Vercel**: Check [Vercel Documentation](https://vercel.com/docs)
- **FastAPI**: Check [FastAPI Documentation](https://fastapi.tiangolo.com)
- **React**: Check [React Documentation](https://react.dev)

## Next Steps

1. Set up production database
2. Configure file storage service
3. Add error monitoring
4. Set up CI/CD pipeline
5. Configure custom domain
6. Enable analytics

