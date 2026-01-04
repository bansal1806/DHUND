import os
from supabase import create_client, Client
from typing import Optional
import uuid
import requests
from .logger import logger

class CloudStorage:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL", "")
        self.key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
        self.bucket_name = "dhund-assets"
        
        if self.url and self.key:
            try:
                self.supabase: Client = create_client(self.url, self.key)
                logger.info("Supabase storage client initialized.")
            except Exception as e:
                self.supabase = None
                logger.error("Failed to initialize Supabase storage", error=str(e))
        else:
            self.supabase = None
            logger.warning("Supabase credentials missing. Cloud storage disabled.")

    def upload_image(self, file_path: str, folder: str = "uploads") -> Optional[str]:
        """Uploads a local file to Supabase Storage and returns the public URL."""
        if not self.supabase:
            logger.warning("Cloud upload skipped: Supabase not initialized.")
            return None
            
        try:
            if not os.path.exists(file_path):
                logger.error("Upload failed: File not found", path=file_path)
                return None

            file_ext = os.path.splitext(file_path)[1]
            file_name = f"{folder}/{uuid.uuid4()}{file_ext}"
            
            with open(file_path, 'rb') as f:
                self.supabase.storage.from_(self.bucket_name).upload(
                    path=file_name,
                    file=f,
                    file_options={"content-type": f"image/{file_ext[1:]}"}
                )
            
            # Get public URL
            response = self.supabase.storage.from_(self.bucket_name).get_public_url(file_name)
            logger.info("Cloud upload success", url=response)
            return response
        except Exception as e:
            logger.error("Cloud upload failed", error=str(e))
            return None

    def download_image(self, url: str, local_path: str) -> bool:
        """Download an image from a URL (cloud or HTTP) to local path"""
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            os.makedirs(os.path.dirname(local_path) if os.path.dirname(local_path) else '.', exist_ok=True)
            with open(local_path, 'wb') as f:
                f.write(response.content)
            return True
        except Exception as e:
            logger.error("Image download failed", url=url, error=str(e))
            return False

    def send_realtime_alert(self, topic: str, payload: dict):
        """Sends a real-time broadcast via Supabase table insertion."""
        if not self.supabase:
            return
            
        try:
            self.supabase.table("alerts").insert(payload).execute()
            logger.info("Real-time alert broadcasted", topic=topic)
        except Exception as e:
            logger.error("Real-time alert failed", error=str(e))
