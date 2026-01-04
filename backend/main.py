import os
from datetime import datetime
import json
from fastapi import FastAPI, File, UploadFile, HTTPException, Request, Form
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import shutil
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import our modules
from .models import MissingPerson, SearchResult, CitizenReport
from .ai_engine import AIEngine
from .database import Database
from .cloud_storage import CloudStorage
from .logger import logger

app = FastAPI(
    title="DHUND API", 
    description="Production-grade AI Recovery System for Missing Persons",
    version="2.0.0"
)

# CORS middleware - In production, this should be restricted to specific domains
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
ai_engine = AIEngine()
db = Database()
cloud = CloudStorage()

# Setup upload directory
TMP_DIR = os.environ.get("TMPDIR", "/tmp")
UPLOADS_DIR = os.path.join(TMP_DIR, "dhund_uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Mount static files for local development/debugging
app.mount("/local-uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.now()
    response = await call_next(request)
    duration = (datetime.now() - start_time).total_seconds()
    
    logger.info(
        f"API Request: {request.method} {request.url.path}",
        status_code=response.status_code,
        duration=f"{duration:.3f}s",
        client_ip=request.client.host
    )
    return response

@app.get("/")
async def root():
    matrix_mode = "MOCK_SIMULATION" if ai_engine.openai_service.mock_mode else "LIVE_NEURAL_LINK"
    return {
        "system": "DHUND_SYS.CORE",
        "status": "OPERATIONAL",
        "intelligence_matrix": ai_engine.openai_service.model_name,
        "matrix_mode": matrix_mode,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/report-missing")
async def report_missing_person(
    name: str,
    age: int,
    description: str,
    photo: UploadFile = File(...)
):
    """Report a missing person with AI analysis and cloud persistence"""
    photo_path = None
    try:
        # 1. Securely save uploaded photo to temporary storage for processing
        os.makedirs(UPLOADS_DIR, exist_ok=True)
        photo_path = os.path.join(UPLOADS_DIR, f"report_{datetime.now().timestamp()}_{photo.filename}")
        with open(photo_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
        
        # 2. Upload to persistent Cloud Storage immediately
        cloud_url = cloud.upload_image(photo_path, folder="reports")
        if not cloud_url:
            logger.warning("Cloud upload failed during reporting, falling back to local path")
        
        # 3. Process with AI Engine (Intelligence Matrix)
        analysis_results = await ai_engine.analyze_missing_person(photo_path, age, description)
        
        # 4. Generate semantic embedding for search
        from .openai_integration import OpenAIIntegration
        openai_service = OpenAIIntegration()
        searchable_text = f"Name: {name}, Age: {age}, Context: {description}"
        embedding = openai_service.generate_embeddings(searchable_text)
        
        # 5. Save to persistent Database
        missing_person = MissingPerson(
            name=name,
            age=age,
            description=description,
            photo_path=cloud_url or photo_path,
            reported_date=datetime.now()
        )
        
        person_id = db.save_missing_person(missing_person, analysis_results, embedding)
        
        if not person_id:
            raise HTTPException(status_code=500, detail="Database persistence failed")

        return {
            "status": "success",
            "person_id": person_id,
            "cloud_url": cloud_url,
            "ai_analysis": analysis_results
        }
    
    except Exception as e:
        logger.error("Error in report_missing_person", error=str(e))
        raise HTTPException(status_code=500, detail=f"System error during reporting: {str(e)}")
    finally:
        # Cleanup temporary files
        if photo_path and os.path.exists(photo_path):
            try: os.remove(photo_path)
            except: pass

@app.post("/api/citizen-report")
async def citizen_report_sighting(
    person_id: int,
    location: str,
    description: str,
    reporter_phone: str,
    sighting_photo: UploadFile = File(...)
):
    """Citizen reports sighting with Multi-Modal AI verification"""
    sighting_path = None
    try:
        # 1. Save sighting photo temporarily
        sighting_path = os.path.join(UPLOADS_DIR, f"sighting_{datetime.now().timestamp()}_{sighting_photo.filename}")
        with open(sighting_path, "wb") as buffer:
            shutil.copyfileobj(sighting_photo.file, buffer)
        
        # 2. Get person data for comparison
        person_data = db.get_missing_person(person_id)
        if not person_data:
            raise HTTPException(status_code=404, detail="Target person ID not found in neural network")

        # 3. Verify sighting with Multi-Modal AI
        verification = await ai_engine.verify_citizen_sighting(
            person_data.get('face_encoding', []), 
            sighting_path, 
            location, 
            description
        )
        
        # 4. Upload to Cloud
        cloud_url = cloud.upload_image(sighting_path, folder="sightings")
        
        # 5. Save Report
        report = CitizenReport(
            person_id=person_id,
            location=location,
            description=description,
            reporter_phone=reporter_phone,
            sighting_photo=cloud_url or sighting_path,
            verification_score=verification['confidence'],
            report_time=datetime.now()
        )
        
        # Generate embedding for report context
        from .openai_integration import OpenAIIntegration
        openai_service = OpenAIIntegration()
        embedding = openai_service.generate_embeddings(f"Location: {location}, Observations: {description}")
        
        report_id = db.save_citizen_report(report, embedding)
        
        # 6. Trigger Real-time Alerts if verified
        if verification['verified']:
            cloud.send_realtime_alert("sightings", {
                "person_id": person_id,
                "location": location,
                "confidence": verification['confidence'],
                "ai_insight": verification.get('ai_analysis', ""),
                "timestamp": datetime.now().isoformat()
            })

        return {
            "status": "success",
            "report_id": report_id,
            "verification": verification,
            "persistence": "cloud_verified" if cloud_url else "local_fallback"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error in citizen_report_sighting", error=str(e))
        raise HTTPException(status_code=500, detail="Neural Verification Interface Error")
    finally:
        if sighting_path and os.path.exists(sighting_path):
            try: os.remove(sighting_path)
            except: pass

@app.get("/api/missing-persons")
async def get_missing_persons():
    """Batch fetch all active missing person cases"""
    try:
        persons = db.get_all_missing_persons()
        return {"status": "success", "count": len(persons), "data": persons}
    except Exception as e:
        logger.error("Error fetching missing persons", error=str(e))
        raise HTTPException(status_code=500, detail="Database retrieval error")

@app.get("/api/sightings")
async def get_sightings():
    """Fetch all citizen-reported sightings"""
    try:
        sightings = db.get_all_citizen_reports()
        return {"status": "success", "count": len(sightings), "data": sightings}
    except Exception as e:
        logger.error("Error fetching sightings", error=str(e))
        raise HTTPException(status_code=500, detail="Sighting retrieval error")

@app.get("/api/sightings/{report_id}")
async def get_sighting_details(report_id: int):
    """Detailed telemetry for a specific sighting"""
    try:
        report = db.get_citizen_report(report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Sighting report not found")
        return {"status": "success", "data": report}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error fetching sighting details", report_id=report_id, error=str(e))
        raise HTTPException(status_code=500, detail="Neural Link Error")

@app.post("/api/semantic-search")
async def semantic_search(query: str, limit: int = 10):
    """Multi-modal semantic search using OpenAI Intelligence Matrix"""
    try:
        from .openai_integration import OpenAIIntegration
        openai_service = OpenAIIntegration()
        
        query_embedding = openai_service.generate_embeddings(query)
        results = db.semantic_search(query_embedding, limit)
        
        return {
            "status": "success",
            "query": query,
            "results": results,
            "engine": "pgvector_similarity"
        }
    except Exception as e:
        logger.error("Semantic search failed", error=str(e))
        raise HTTPException(status_code=500, detail="Intelligence Matrix Search Error")

@app.post("/api/search-cctv")
async def search_cctv_network(person_id: int = Form(...)):
    """Search CCTV network for missing person"""
    try:
        # Get person data from database
        person_data = db.get_missing_person(person_id)
        if not person_data:
            raise HTTPException(status_code=404, detail="Person not found")
        
        # Search CCTV network
        results = ai_engine.search_cctv_network(person_data)
        
        # Save search results to database
        for result in results:
            if "error" not in result:
                db.save_search_result(person_id, result)
        
        # Update search status
        if db.supabase:
            try:
                db.supabase.table("search_status").update({
                    "cameras_searched": len(results),
                    "matches_found": len([r for r in results if "error" not in r]),
                    "last_updated": datetime.now().isoformat()
                }).eq("person_id", person_id).execute()
            except:
                pass  # Continue even if status update fails
        
        return {
            "status": "success",
            "person_id": person_id,
            "results": results,
            "matches_found": len([r for r in results if "error" not in r])
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("CCTV search failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"CCTV search error: {str(e)}")

@app.post("/api/ai/process-voice")
async def process_voice_report(audio: UploadFile = File(...)):
    """Process voice report using AI transcription"""
    audio_path = None
    try:
        # Save uploaded audio file temporarily
        os.makedirs(UPLOADS_DIR, exist_ok=True)
        audio_path = os.path.join(UPLOADS_DIR, f"voice_{datetime.now().timestamp()}_{audio.filename}")
        
        with open(audio_path, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)
        
        # Process voice report
        from .openai_integration import OpenAIIntegration
        openai_service = OpenAIIntegration()
        result = openai_service.process_voice_report(audio_path)
        
        return {
            "status": "success",
            "transcript": result.get("transcript", ""),
            "model_used": result.get("model_used", "unknown")
        }
    except Exception as e:
        logger.error("Voice processing failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"Voice processing error: {str(e)}")
    finally:
        # Cleanup temporary files
        if audio_path and os.path.exists(audio_path):
            try:
                os.remove(audio_path)
            except:
                pass

@app.post("/api/age-progression")
async def generate_age_progression(
    person_id: Optional[int] = Form(None),
    photo: Optional[UploadFile] = File(None),
    current_age: int = Form(...),
    target_age: int = Form(...)
):
    """Generate age progression variations"""
    photo_path = None
    downloaded_photo = False
    try:
        # Either use person_id to get existing photo or use uploaded photo
        if person_id:
            person_data = db.get_missing_person(person_id)
            if not person_data:
                raise HTTPException(status_code=404, detail="Person not found")
            # Use photo from database (download if cloud URL)
            photo_path = person_data.get('photo_path')
            if not photo_path:
                raise HTTPException(status_code=400, detail="Person photo not available. Please upload a photo instead.")
            
            # If it's a URL (cloud storage), download it
            if photo_path.startswith('http://') or photo_path.startswith('https://'):
                downloaded_photo = True
                local_photo_path = os.path.join(UPLOADS_DIR, f"progression_downloaded_{datetime.now().timestamp()}.jpg")
                if not cloud.download_image(photo_path, local_photo_path):
                    raise HTTPException(status_code=500, detail="Failed to download photo from cloud storage")
                photo_path = local_photo_path
            elif not os.path.exists(photo_path):
                raise HTTPException(status_code=400, detail="Person photo not available locally. Please upload a photo instead.")
        elif photo:
            # Save uploaded photo temporarily
            os.makedirs(UPLOADS_DIR, exist_ok=True)
            photo_path = os.path.join(UPLOADS_DIR, f"progression_{datetime.now().timestamp()}_{photo.filename}")
            downloaded_photo = True
            with open(photo_path, "wb") as buffer:
                shutil.copyfileobj(photo.file, buffer)
        else:
            raise HTTPException(status_code=400, detail="Either person_id or photo must be provided")
        
        # Generate age progression
        result = ai_engine.generate_age_progression(photo_path, current_age, target_age)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return {
            "status": "success",
            "person_id": person_id,
            "current_age": current_age,
            "target_age": target_age,
            **result
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Age progression failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"Age progression error: {str(e)}")
    finally:
        # Cleanup temporary files (only if we downloaded/created them)
        if photo_path and downloaded_photo and os.path.exists(photo_path):
            try:
                os.remove(photo_path)
            except:
                pass

@app.post("/api/ai/target-reconstruction")
async def target_reconstruction(
    person_id: Optional[int] = Form(None),
    photo: Optional[UploadFile] = File(None),
    current_age: Optional[int] = Form(None),
    target_age: Optional[int] = Form(None),
    description: Optional[str] = Form(None)
):
    """Generate target reconstruction (age progression with enhanced AI analysis)"""
    photo_path = None
    downloaded_photo = False
    try:
        # Either use person_id to get existing photo or use uploaded photo
        if person_id:
            person_data = db.get_missing_person(person_id)
            if not person_data:
                raise HTTPException(status_code=404, detail="Person not found")
            photo_path = person_data.get('photo_path')
            if not photo_path:
                raise HTTPException(status_code=400, detail="Person photo not available. Please upload a photo instead.")
            
            # If it's a URL (cloud storage), download it
            if photo_path.startswith('http://') or photo_path.startswith('https://'):
                downloaded_photo = True
                local_photo_path = os.path.join(UPLOADS_DIR, f"reconstruction_downloaded_{datetime.now().timestamp()}.jpg")
                if not cloud.download_image(photo_path, local_photo_path):
                    raise HTTPException(status_code=500, detail="Failed to download photo from cloud storage")
                photo_path = local_photo_path
            elif not os.path.exists(photo_path):
                raise HTTPException(status_code=400, detail="Person photo not available locally. Please upload a photo instead.")
            
            current_age = current_age or person_data.get('age')
            description = description or person_data.get('description', '')
        elif photo:
            if not current_age:
                raise HTTPException(status_code=400, detail="current_age is required when uploading a photo")
            # Save uploaded photo temporarily
            os.makedirs(UPLOADS_DIR, exist_ok=True)
            photo_path = os.path.join(UPLOADS_DIR, f"reconstruction_{datetime.now().timestamp()}_{photo.filename}")
            downloaded_photo = True
            with open(photo_path, "wb") as buffer:
                shutil.copyfileobj(photo.file, buffer)
            description = description or ''
        else:
            raise HTTPException(status_code=400, detail="Either person_id or photo must be provided")
        
        if not current_age:
            raise HTTPException(status_code=400, detail="current_age is required")
        
        target_age = target_age or (current_age + 5)  # Default to 5 years progression
        
        # Generate age progression (reconstruction uses the same method)
        progression_result = ai_engine.generate_age_progression(photo_path, current_age, target_age)
        
        if "error" in progression_result:
            raise HTTPException(status_code=500, detail=progression_result["error"])
        
        # Enhanced analysis using Grok for reconstruction insights
        from .openai_integration import OpenAIIntegration
        openai_service = OpenAIIntegration()
        
        try:
            analysis_result = openai_service.analyze_missing_person_image(photo_path, current_age, description)
            reconstruction_insights = analysis_result.get('analysis', '')
        except:
            reconstruction_insights = "Reconstruction analysis pending."
        
        return {
            "status": "success",
            "person_id": person_id,
            "current_age": current_age,
            "target_age": target_age,
            "reconstruction_insights": reconstruction_insights,
            "age_progression": progression_result,
            "model_used": openai_service.model_name if hasattr(openai_service, 'model_name') else "unknown"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Target reconstruction failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"Target reconstruction error: {str(e)}")
    finally:
        # Cleanup temporary files (only if we downloaded/created them)
        if photo_path and downloaded_photo and os.path.exists(photo_path):
            try:
                os.remove(photo_path)
            except:
                pass

@app.get("/api/search-status/{person_id}")
async def get_search_status(person_id: int):
    """Get search status for a missing person"""
    try:
        status = db.get_search_status(person_id)
        
        if status.get('status') == 'error':
            raise HTTPException(status_code=500, detail="Failed to fetch search status")
        elif status.get('status') == 'not_found':
            raise HTTPException(status_code=404, detail="Search status not found for this person")
        
        return {
            "status": "success",
            "person_id": person_id,
            "data": status
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to fetch search status", person_id=person_id, error=str(e))
        raise HTTPException(status_code=500, detail="Search status retrieval error")

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
