"""
Vercel Serverless Function Handler for FastAPI
"""
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from mangum import Mangum
from main import app

# Create handler for Vercel
handler = Mangum(app, lifespan="off")

# Export handler for Vercel
__all__ = ["handler"]

