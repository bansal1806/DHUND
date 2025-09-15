from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class MissingPerson(BaseModel):
    id: Optional[int] = None
    name: str
    age: int
    description: str
    photo_path: str
    reported_date: datetime
    status: str = "missing"
    
class SearchResult(BaseModel):
    camera_id: str
    location: str
    timestamp: datetime
    confidence: float
    image_path: Optional[str] = None
    coordinates: Optional[dict] = None

class CitizenReport(BaseModel):
    id: Optional[int] = None
    person_id: int
    location: str
    description: str
    reporter_phone: str
    sighting_photo: str
    verification_score: float
    report_time: datetime
    status: str = "pending"

class AgeProgressionResult(BaseModel):
    original_age: int
    target_age: int
    progression_images: List[str]
    confidence: float

class AIAnalysis(BaseModel):
    facial_features: dict
    predicted_locations: List[str]
    risk_factors: List[str]
    search_priority: str
