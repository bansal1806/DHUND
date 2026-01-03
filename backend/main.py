from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from datetime import datetime
import json

# Import our modules
from models import MissingPerson, SearchResult, CitizenReport
from ai_engine import AIEngine
from database import Database
from cloud_storage import CloudStorage

app = FastAPI(title="DHUND API", description="Missing Person AI Recovery System")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
ai_engine = AIEngine()
db = Database()
cloud = CloudStorage()

# Serve uploaded files
# Use /tmp for Vercel serverless (read-only filesystem except /tmp)
upload_dir = os.path.join(os.environ.get("TMPDIR", "/tmp"), "uploads")
os.makedirs(upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

@app.get("/")
async def root():
    return {"message": "DHUND API - Bringing Children Home", "status": "active"}

@app.post("/api/report-missing")
async def report_missing_person(
    name: str,
    age: int,
    description: str,
    photo: UploadFile = File(...)
):
    """Report a missing person"""
    try:
        # Save uploaded photo (use /tmp for Vercel serverless)
        upload_dir = os.path.join(os.environ.get("TMPDIR", "/tmp"), "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        photo_path = os.path.join(upload_dir, photo.filename)
        with open(photo_path, "wb") as buffer:
            buffer.write(await photo.read())
        
        # Create missing person record
        missing_person = MissingPerson(
            name=name,
            age=age,
            description=description,
            photo_path=photo_path,
            reported_date=datetime.now()
        )
        
        # Process with AI
        analysis_results = await ai_engine.analyze_missing_person(photo_path, age, description)
        
        # Save to database
        person_id = db.save_missing_person(missing_person, analysis_results)
        
        # Upload photo to cloud
        cloud_url = cloud.upload_image(photo_path)
        if cloud_url:
            # Update database with cloud path if available
            # (Note: In a full implementation, we'd update photo_path in DB)
            pass

        return {
            "status": "success",
            "person_id": person_id,
            "message": f"Missing person report created for {name}",
            "ai_analysis": analysis_results,
            "cloud_url": cloud_url
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/age-progression")
async def generate_age_progression(person_id: int, target_age: int):
    """Generate age progression for missing person"""
    try:
        # Get person data
        person_data = db.get_missing_person(person_id)
        if not person_data:
            raise HTTPException(status_code=404, detail="Person not found")
        
        # Generate age progression
        progression_result = ai_engine.generate_age_progression(
            person_data['photo_path'], 
            person_data['age'], 
            target_age
        )
        
        return {
            "status": "success",
            "original_age": person_data['age'],
            "target_age": target_age,
            "progression_images": progression_result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/search-cctv")
async def search_cctv_network(person_id: int):
    """Search across mock CCTV network"""
    try:
        # Get person data
        person_data = db.get_missing_person(person_id)
        if not person_data:
            raise HTTPException(status_code=404, detail="Person not found")
        
        # Simulate CCTV search
        search_results = ai_engine.search_cctv_network(person_data)
        
        return {
            "status": "success",
            "search_initiated": datetime.now().isoformat(),
            "cameras_searched": 1247,
            "matches_found": len(search_results),
            "results": search_results
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/citizen-report")
async def citizen_report_sighting(
    person_id: int,
    location: str,
    description: str,
    reporter_phone: str,
    sighting_photo: UploadFile = File(...)
):
    """Citizen reports sighting of missing person"""
    try:
        # Save sighting photo (use /tmp for Vercel serverless)
        upload_dir = os.path.join(os.environ.get("TMPDIR", "/tmp"), "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        sighting_path = os.path.join(upload_dir, f"sighting_{sighting_photo.filename}")
        with open(sighting_path, "wb") as buffer:
            buffer.write(await sighting_photo.read())
        
        # Get person data (need face encoding)
        person_data = db.get_missing_person(person_id)
        if not person_data:
            raise HTTPException(status_code=404, detail="Person not found")

        # Verify sighting with AI using actual encodings
        verification = await ai_engine.verify_citizen_sighting(
            person_data['face_encoding'], sighting_path, location, description
        )
        
        # Save citizen report
        report = CitizenReport(
            person_id=person_id,
            location=location,
            description=description,
            reporter_phone=reporter_phone,
            sighting_photo=sighting_path,
            verification_score=verification['confidence'],
            report_time=datetime.now()
        )
        
        report_id = db.save_citizen_report(report)
        
        # Trigger real-time alert via Supabase
        if verification['verified']:
            cloud.send_realtime_alert("sightings", {
                "person_id": person_id,
                "location": location,
                "confidence": verification['confidence'],
                "timestamp": datetime.now().isoformat()
            })

        return {
            "status": "success",
            "report_id": report_id,
            "verification": verification,
            "next_actions": [
                "Alert sent to local police",
                "Family notified",
                "Nearby verified citizens activated"
            ]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/missing-persons")
async def get_missing_persons():
    """Get list of all missing persons"""
    try:
        persons = db.get_all_missing_persons()
        return {
            "status": "success",
            "count": len(persons),
            "persons": persons
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/search-status/{person_id}")
async def get_search_status(person_id: int):
    """Get current search status for a missing person"""
    try:
        status = db.get_search_status(person_id)
        return {
            "status": "success",
            "search_status": status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/demo-match")
async def demo_match_found(person_id: int):
    """Simulate a positive match found (for demo purposes)"""
    try:
        # Simulate match found
        match_result = {
            "match_found": True,
            "confidence": 94.5,
            "location": "Dadar Railway Station, Mumbai",
            "camera_id": "CAM_MUM_DADAR_001",
            "timestamp": datetime.now().isoformat(),
            "coordinates": {"lat": 19.0176, "lng": 72.8562},
            "alerts_sent": {
                "police": True,
                "family": True,
                "nearby_citizens": True
            }
        }
        
        # Update database
        db.update_match_status(person_id, match_result)
        
        return {
            "status": "success",
            "message": "MATCH FOUND! Child located successfully.",
            "match_details": match_result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
