# Vercel Configuration Errors - Fixed

This document lists the common Vercel errors and how they've been addressed in the DHUND project configuration.

## ✅ Fixed Issues

### 0. Dependency Conflict (React 18 vs React 19)
**Error**: `@react-three/drei@10.7.6` requires React 19, but project uses React 18.2.0

**Fix Applied**:
- ✅ **Removed** `@react-three/drei` entirely (not used in codebase)
- ✅ Downgraded `@react-three/fiber` from `^9.3.0` to `^8.15.19` (React 18 compatible)
- ✅ Added `frontend/.npmrc` with `legacy-peer-deps=true` as fallback
- ✅ Verified code only uses `@react-three/fiber` (no drei imports found)

### 1. Missing public directory / Missing build script
**Error**: The build step fails if output directory is missing or build script is not defined.

**Fix Applied**:
- ✅ Added `vercel-build` script in `frontend/package.json`
- ✅ Configured correct output directory: `frontend/build` in `vercel.json`
- ✅ Updated route destination to match: `frontend/build/$1`

### 2. Conflicting functions and builds configuration
**Error**: Cannot use both `functions` and `builds` properties simultaneously.

**Fix Applied**:
- ✅ Removed `functions` property from `vercel.json`
- ✅ Using `builds` configuration only (backward compatible)
- ⚠️ **Note**: Function timeout (maxDuration) must be configured in Vercel Dashboard:
  - Go to: Settings → Functions → Max Duration
  - Set to 30 seconds (or desired value)

### 3. Mixed routing properties
**Error**: Cannot use `routes` with `rewrites`, `redirects`, `headers`, `cleanUrls`, or `trailingSlash`.

**Fix Applied**:
- ✅ Using only `routes` property in `vercel.json`
- ✅ No conflicting routing properties defined

### 4. Invalid route destination segment
**Error**: Named segment parameters in destination must match source.

**Fix Applied**:
- ✅ Routes use wildcard patterns: `/api/(.*)` and `/(.*)`
- ✅ Destinations correctly reference the captured groups

## ⚠️ Important Notes

### Function Timeout Configuration
Since we're using `builds` instead of `functions`, you need to configure timeout in the Vercel Dashboard:
1. Go to your project settings
2. Navigate to: Settings → Functions
3. Set "Max Duration" to 30 seconds (or your desired value)
4. Hobby plan: max 10s (upgrade needed for longer)
5. Pro plan: up to 60s
6. Enterprise: up to 900s

### Build Output Directory
- React builds to: `frontend/build/`
- Vercel is configured to use: `frontend/build` as `distDir`
- Routes serve from: `frontend/build/$1`

### API Routes
- All API endpoints must start with `/api/`
- Backend handler: `api/index.py`
- Routes pattern: `/api/(.*)` → `api/index.py`

## 🔍 Verification Checklist

Before deploying, verify:

- [ ] `vercel.json` exists and is valid JSON
- [ ] `frontend/package.json` has `vercel-build` script
- [ ] `api/index.py` exists and exports `handler`
- [ ] `requirements.txt` is in root directory
- [ ] No `now.json` file exists (conflicts with `vercel.json`)
- [ ] No `.now` directory exists (conflicts with `.vercel`)
- [ ] Build output directory path is correct: `frontend/build`

## 📝 Additional Configuration

### Environment Variables
Set these in Vercel Dashboard → Settings → Environment Variables:
- `OPENAI_API_KEY` - Required for AI features
- `REACT_APP_API_URL` - Optional (leave empty for production)

### Project Settings
Configure in Vercel Dashboard:
- **Root Directory**: Leave empty (project root)
- **Build Command**: Auto-detected from `vercel-build` script
- **Output Directory**: Auto-detected from `vercel.json`
- **Install Command**: Auto-detected (`npm install`)
- **Function Max Duration**: Set to 30s (or desired value)

## 🚀 Deployment

After fixing these issues, deploy using:

```bash
# Via CLI
vercel --prod

# Or via Dashboard
# Push to Git → Vercel auto-deploys
```

## 📚 References

- [Vercel Error Codes Documentation](https://vercel.com/docs/errors)
- [Vercel Configuration Reference](https://vercel.com/docs/projects/project-configuration)
- [Python Functions on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/python)

