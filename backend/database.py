import os
import json
from datetime import datetime
from typing import Dict, List, Optional
from supabase import create_client, Client
from .logger import logger

class Database:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not self.url or not self.key:
            logger.warning("Supabase credentials missing. Database operations will fail.")
            self.supabase = None
        else:
            self.supabase = create_client(self.url, self.key)
            logger.info("Supabase client initialized successfully.")

    def save_missing_person(self, person, ai_analysis: Dict, embedding: List[float] = None) -> int:
        """Save missing person to Supabase with semantic embedding"""
        if not self.supabase:
            return 0
            
        try:
            data = {
                "name": person.name,
                "age": person.age,
                "description": person.description,
                "photo_path": person.photo_path,
                "reported_date": person.reported_date.isoformat(),
                "ai_analysis": ai_analysis,
                "face_encoding": ai_analysis.get('face_encoding', []),
                "embedding": embedding,
                "status": "missing"
            }
            
            response = self.supabase.table("missing_persons").insert(data).execute()
            person_id = response.data[0]['id']
            
            # Initialize search status
            self.supabase.table("search_status").insert({
                "person_id": person_id,
                "status": "searching",
                "last_updated": datetime.now().isoformat(),
                "cameras_searched": 0,
                "matches_found": 0
            }).execute()
            
            logger.info("Missing person saved to Supabase", person_id=person_id)
            return person_id
        except Exception as e:
            logger.error("Failed to save missing person", error=str(e))
            return 0

    def get_missing_person(self, person_id: int) -> Optional[Dict]:
        """Get missing person by ID from Supabase"""
        if not self.supabase:
            return None
            
        try:
            response = self.supabase.table("missing_persons").select("*").eq("id", person_id).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            logger.error("Failed to fetch missing person", person_id=person_id, error=str(e))
            return None

    def get_all_missing_persons(self) -> List[Dict]:
        """Get all missing persons from Supabase"""
        if not self.supabase:
            return []
            
        try:
            response = self.supabase.table("missing_persons").select("id, name, age, description, photo_path, reported_date, status").order("reported_date", desc=True).execute()
            return response.data
        except Exception as e:
            logger.error("Failed to fetch all missing persons", error=str(e))
            return []

    def save_citizen_report(self, report, embedding: List[float] = None) -> int:
        """Save citizen report to Supabase with optional semantic embedding"""
        if not self.supabase:
            return 0
            
        try:
            data = {
                "person_id": report.person_id,
                "location": report.location,
                "description": report.description,
                "reporter_phone": report.reporter_phone,
                "sighting_photo": report.sighting_photo,
                "verification_score": report.verification_score,
                "report_time": report.report_time.isoformat(),
                "embedding": embedding,
                "status": "pending"
            }
            
            response = self.supabase.table("citizen_reports").insert(data).execute()
            return response.data[0]['id']
        except Exception as e:
            logger.error("Failed to save citizen report", error=str(e))
            return 0

    def get_all_citizen_reports(self) -> List[Dict]:
        """Get all citizen reports from Supabase"""
        if not self.supabase:
            return []
            
        try:
            response = self.supabase.table("citizen_reports").select("*").order("report_time", desc=True).execute()
            return response.data
        except Exception as e:
            logger.error("Failed to fetch all citizen reports", error=str(e))
            return []

    def get_citizen_report(self, report_id: int) -> Optional[Dict]:
        """Get detailed citizen report by ID"""
        if not self.supabase:
            return None
            
        try:
            response = self.supabase.table("citizen_reports").select("*").eq("id", report_id).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            logger.error("Failed to fetch citizen report", report_id=report_id, error=str(e))
            return None

    def save_search_result(self, person_id: int, result: Dict):
        """Save search result to Supabase"""
        if not self.supabase:
            return
            
        try:
            data = {
                "person_id": person_id,
                "camera_id": result.get('camera_id'),
                "location": result.get('location'),
                "confidence": result.get('confidence'),
                "timestamp": result.get('timestamp') or datetime.now().isoformat(),
                "match_data": result
            }
            self.supabase.table("search_results").insert(data).execute()
        except Exception as e:
            logger.error("Failed to save search result", person_id=person_id, error=str(e))

    def get_search_status(self, person_id: int) -> Dict:
        """Get current search status from Supabase"""
        if not self.supabase:
            return {'status': 'error'}
            
        try:
            # Get search status
            status_res = self.supabase.table("search_status").select("*").eq("person_id", person_id).execute()
            
            # Get counts
            report_count = self.supabase.table("citizen_reports").select("id", count="exact").eq("person_id", person_id).execute()
            result_count = self.supabase.table("search_results").select("id", count="exact").eq("person_id", person_id).execute()
            
            if status_res.data:
                status = status_res.data[0]
                status['citizen_reports'] = report_count.count
                status['search_results'] = result_count.count
                return status
            
            return {'status': 'not_found'}
        except Exception as e:
            logger.error("Failed to fetch search status", person_id=person_id, error=str(e))
            return {'status': 'error'}

    def update_match_status(self, person_id: int, match_result: Dict):
        """Update when a match is found in Supabase"""
        if not self.supabase:
            return
            
        try:
            # Update missing person status
            self.supabase.table("missing_persons").update({"status": "found"}).eq("id", person_id).execute()
            
            # Update search status
            self.supabase.table("search_status").update({
                "status": "found", 
                "last_updated": datetime.now().isoformat(),
            }).eq("person_id", person_id).execute()
            
            # Note: We can't easily increment with current supabase-py without RPC, 
            # so we'll just update the status for now. In production, an RPC would be better.
            
            # Save the match result
            self.save_search_result(person_id, match_result)
        except Exception as e:
            logger.error("Failed to update match status", person_id=person_id, error=str(e))

    def semantic_search(self, query_embedding: List[float], limit: int = 10, threshold: float = 0.7) -> List[Dict]:
        """Semantic search using Supabase RPC for vector similarity (pgvector)"""
        if not self.supabase:
            return []
            
        try:
            # This assumes an RPC named 'match_missing_persons' is defined in Supabase
            # If not, we download and compare locally as fallback (advanced!)
            try:
                response = self.supabase.rpc('match_missing_persons', {
                    'query_embedding': query_embedding,
                    'match_threshold': threshold,
                    'match_count': limit
                }).execute()
                return response.data
            except:
                # Fallback to local comparison (less efficient but reliable if RPC isn't set up yet)
                return self._local_semantic_search_fallback(query_embedding, limit, threshold)
        except Exception as e:
            logger.error("Semantic search failed", error=str(e))
            return []

    def _local_semantic_search_fallback(self, query_embedding: List[float], limit: int, threshold: float) -> List[Dict]:
        """Local fallback for semantic search when RPC is unavailable"""
        import numpy as np
        try:
            # Get all missing persons with embeddings
            response = self.supabase.table("missing_persons").select("id, name, age, description, embedding").eq("status", "missing").not_.is_("embedding", "null").execute()
            
            results = []
            query_vec = np.array(query_embedding)
            
            for row in response.data:
                stored_embedding = np.array(row['embedding'])
                
                # Cosine similarity
                dot_product = np.dot(query_vec, stored_embedding)
                norm_query = np.linalg.norm(query_vec)
                norm_stored = np.linalg.norm(stored_embedding)
                
                if norm_query > 0 and norm_stored > 0:
                    similarity = dot_product / (norm_query * norm_stored)
                    if similarity >= threshold:
                        results.append({
                            'id': row['id'],
                            'name': row['name'],
                            'age': row['age'],
                            'description': row['description'],
                            'similarity': float(similarity),
                            'match_confidence': f"{similarity * 100:.1f}%"
                        })
            
            results.sort(key=lambda x: x['similarity'], reverse=True)
            return results[:limit]
        except Exception as e:
            logger.error("Local semantic search fallback failed", error=str(e))
            return []
