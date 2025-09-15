# 🎯 DHUND - Missing Person AI Recovery System

## Prototype Overview
DHUND (ढूंढ़) is India's first privacy-first, AI-powered missing person recovery ecosystem.

## Features Demonstrated
- ✅ AI-powered facial recognition
- ✅ Age progression simulation
- ✅ Multi-modal recognition (face + description)
- ✅ Real-time search across mock CCTV network
- ✅ Crowdsource reporting system
- ✅ Privacy-preserving federated search simulation
- ✅ OpenAI API integration (GPT-4 Vision, DALL-E)

## Quick Start
```bash
# Backend
cd backend
pip install -r requirements.txt
python main.py

# Frontend
cd frontend
npm install
npm start
```

## Demo Scenarios
1. **Missing Child Report**: Upload photo, AI generates age progression
2. **CCTV Search**: Simulate search across camera network
3. **Citizen Report**: Crowdsourced sighting with verification
4. **Match Found**: Real-time alerts and notifications

## Technology Stack
- **Backend**: Python FastAPI, OpenCV, face_recognition
- **Frontend**: React.js with modern UI
- **AI**: OpenAI GPT-4 Vision, Custom ML models
- **Database**: SQLite for demo (PostgreSQL for production)

Built for OpenAI Academy x NxtWave Buildathon 2024
