import os
from supabase import create_client, Client
from typing import Optional
import uuid

class CloudStorage:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL", "")
        self.key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
        self.bucket_name = "dhund-assets"
        
        if self.url and self.key:
            self.supabase: Client = create_client(self.url, self.key)
        else:
            self.supabase = None
            print("WARNING: Supabase credentials not found. Cloud storage disabled.")

    def upload_image(self, file_path: str, folder: str = "uploads") -> Optional[str]:
        """Uploads a local file to Supabase Storage and returns the public URL."""
        if not self.supabase:
            return None
            
        try:
            file_name = f"{folder}/{uuid.uuid4()}_{os.path.basename(file_path)}"
            
            with open(file_path, 'rb') as f:
                self.supabase.storage.from_(self.bucket_name).upload(
                    path=file_name,
                    file=f
                )
            
            # Get public URL
            response = self.supabase.storage.from_(self.bucket_name).get_public_url(file_name)
            return response
        except Exception as e:
            print(f"Cloud upload failed: {str(e)}")
            return None

    def send_realtime_alert(self, topic: str, payload: dict):
        """Sends a real-time broadcast via Supabase."""
        if not self.supabase:
            return
            
        try:
            self.supabase.table("alerts").insert(payload).execute()
        except Exception as e:
            print(f"Real-time alert failed: {str(e)}")
