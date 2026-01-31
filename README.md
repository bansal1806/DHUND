# 🎯 DHUND - Missing Person AI Recovery System

> AI-powered missing person recovery system built with FastAPI + React

## 🚀 Quick Deploy to Vercel

### Step 1: Push to GitHub

```bash
cd f:\PROJECTS\DHUND
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/DHUND.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. **Root Directory**: Leave as `.` (root)
5. **Framework Preset**: Select **"Other"**
6. Add Environment Variables (see below)
7. Click **Deploy**

### Step 3: Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `GROK_API_KEY` | ✅ | Get from [console.x.ai](https://console.x.ai) |
| `SUPABASE_URL` | ✅ | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key |
| `IS_DEMO_MODE` | ❌ | Set `true` for demo without API keys |
| `ALLOWED_ORIGINS` | ❌ | CORS origins (default: `*`) |

## 📁 Project Structure

```
DHUND/
├── api/                    # Vercel serverless API
│   ├── index.py           # FastAPI entry point
│   └── requirements.txt   # Python dependencies
├── backend/               # Python backend code
│   ├── main.py           # FastAPI app with all endpoints
│   ├── ai_engine.py      # AI analysis engine
│   ├── database.py       # Supabase integration
│   └── ...
├── frontend/              # React frontend
│   ├── src/              # React source code
│   └── package.json      # Node dependencies
└── vercel.json           # Vercel configuration
```

## 🛠️ Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install
npm start
# App: http://localhost:3000
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/api/report-missing` | Report missing person |
| POST | `/api/citizen-report` | Submit sighting |
| GET | `/api/missing-persons` | List all cases |
| POST | `/api/semantic-search` | AI-powered search |
| POST | `/api/search-cctv` | CCTV network search |
| POST | `/api/age-progression` | Age progression |

## 🗄️ Database Setup (Supabase)

1. Create project at [supabase.com](https://supabase.com)
2. Run `SUPABASE_SCHEMA.sql` in SQL Editor
3. Create storage bucket named `dhund-assets`
4. Copy URL and service role key to Vercel

---

Built for OpenAI Academy x NxtWave Buildathon 2024
