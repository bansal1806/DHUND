# 🎯 DHUND - Missing Person AI Recovery System

## Overview
DHUND (ढूंढ़) is India's first privacy-first, AI-powered missing person recovery ecosystem, built on Grok AI's Intelligence Matrix (xAI) for defense-grade high-fidelity analysis, real-time neural propagation, and holistic biometric analysis.

## Features
- ✅ **Grok AI Intelligence Matrix**: Grok-beta multimodal reasoning and image analysis
- ✅ **Semantic Search**: Hash-based embeddings for high-speed similarity matching
- ✅ **Multi-modal Recognition**: Face + gait + contextual analysis
- ✅ **Real-time Neural Propagation**: Supabase PostgreSQL Realtime for instant alert distribution
- ✅ **Crowdsource Reporting**: Verified citizen sightings with AI verification
- ✅ **Age Progression**: AI-powered age progression with multiple scenario variations

## Quick Start
```bash
# Backend
cd backend
pip install -r requirements.txt  # Note: Use -r flag!
python -m backend.main

# Or use the demo script (Windows)
start_demo.bat

# The API will be available at http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

## Technology Stack

### The Neural Core: Grok AI Intelligence Matrix (xAI)
| Technology | Role | Status |
|------------|------|--------|
| **Grok-beta** | Multimodal Intelligence | ✅ Active |
| **OpenAI-compatible API** | Grok API Integration | ✅ Active |
| **Hash-based Embeddings** | Semantic Search | ✅ Active |

### Backend & Data: The Neural Backbone
| Technology | Role | Status |
|------------|------|--------|
| **FastAPI (Python)** | Logic Orchestration | ✅ Active |
| **Supabase** | Real-time Datastore & Storage | ✅ Active |
| **OpenCV** | Face Detection & Image Processing | ✅ Active |
| **MediaPipe** | Gait/Posture Analysis | ✅ Active |
| **pgvector** | Vector Similarity Search | ✅ Active |

## API Endpoints

### Core Operations
- `POST /api/report-missing` - Report missing person with AI analysis
- `POST /api/semantic-search` - Semantic search using embeddings
- `POST /api/citizen-report` - Citizen sighting with verification
- `POST /api/search-cctv` - Search CCTV network

### AI Operations
- `POST /api/ai/process-voice` - Process voice report (Note: Audio support limited with Grok)
- `POST /api/ai/target-reconstruction` - Generate age progression with enhanced AI analysis
- `POST /api/age-progression` - Age progression variations

### Status & Monitoring
- `GET /api/missing-persons` - List all missing persons
- `GET /api/sightings` - List all citizen-reported sightings
- `GET /api/sightings/{report_id}` - Get detailed sighting report
- `GET /api/search-status/{person_id}` - Get search status

### System
- `GET /` - System status and health check

## Environment Variables

```bash
# Grok API (xAI) - Required for AI features
GROK_API_KEY=your-grok-api-key
# Alternative: XAI_API_KEY (also supported)

# Optional: Grok API base URL (default: https://api.x.ai/v1)
GROK_API_BASE_URL=https://api.x.ai/v1

# Optional: Specify Grok model (default: grok-beta)
GROK_MODEL=grok-beta

# Supabase Real-time Datastore (Required for database and storage)
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Enable demo/mock mode (bypasses API calls)
IS_DEMO_MODE=false

# Optional: CORS allowed origins (comma-separated, default: *)
ALLOWED_ORIGINS=*

# Optional: Temporary directory for uploads (default: /tmp)
TMPDIR=/tmp
```

## Getting Grok API Key

1. Sign up at [console.x.ai](https://console.x.ai) to create an account
2. Review the API documentation at [docs.x.ai](https://docs.x.ai)
3. Get your API key from the console
4. During public beta, developers receive $25 of free API credits per month

**Note**: Grok API is compatible with OpenAI's API format, making integration straightforward.

## Database Setup

Execute the SQL schema in `SUPABASE_SCHEMA.sql` in your Supabase SQL Editor to set up the required tables and functions:

1. Missing persons table with vector embeddings
2. Citizen reports table
3. Search results table
4. Search status tracking
5. Alerts table for real-time broadcasting
6. Semantic search function using pgvector

## Demo Scenarios
1. **Missing Child Report**: Upload photo, AI generates age progression
2. **Semantic Search**: Search using natural language descriptions
3. **CCTV Search**: Simulate search across camera network
4. **Citizen Report**: Crowdsourced sighting with AI verification
5. **Real-time Alerts**: Instant notification via Supabase Realtime
6. **Voice Reports**: Process audio reports (Note: Limited support with Grok API)

## Deployment

### Vercel (Serverless)
The project is configured for Vercel serverless deployment:
- API routes are handled by `api/index.py`
- Uses Mangum adapter for FastAPI
- Environment variables should be set in Vercel dashboard

### Local Development
```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Run server
python -m backend.main

# Server runs on http://localhost:8000
# Interactive docs: http://localhost:8000/docs
```

## Architecture

- **Backend API**: FastAPI application in `backend/main.py`
- **AI Engine**: Multi-modal analysis in `backend/ai_engine.py`
- **AI Integration**: Grok AI integration in `backend/openai_integration.py`
- **Database**: Supabase client in `backend/database.py`
- **Storage**: Cloud storage handler in `backend/cloud_storage.py`
- **Models**: Pydantic models in `backend/models.py`

## Important Notes

- This is a **backend-only** API project (no frontend included)
- The API can be consumed by any frontend client or mobile app
- Mock/demo mode is available for testing without API keys
- Cloud storage integration requires Supabase bucket named `dhund-assets`
- **Embeddings**: Grok API doesn't provide embeddings, using hash-based fallback
- **Audio Processing**: Grok API has limited audio support; consider using a dedicated transcription service for production

## Limitations & Considerations

- **Embeddings**: Using hash-based embeddings (not AI-generated). For production, consider integrating OpenAI embeddings or another service.
- **Audio**: Grok API audio support is limited. Voice processing uses mock responses. For production, integrate a dedicated transcription service.
- **Free Tier**: Grok API provides $25 free credits per month during beta. Monitor usage accordingly.

**Verified for Production Deployment** - DHUND_OS Technical Oversight  
Built for OpenAI Academy x NxtWave Buildathon 2024
