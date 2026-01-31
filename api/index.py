"""
Vercel Serverless Function Handler for FastAPI
This file serves as the entry point for all API routes on Vercel.
"""
import sys
import os

# Get absolute paths
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(root_dir, 'backend')

# Add paths to sys.path for imports
for path in [root_dir, backend_dir]:
    if path not in sys.path:
        sys.path.insert(0, path)

# Import FastAPI app and create Mangum handler
from mangum import Mangum
from backend.main import app

# Create handler for Vercel serverless
handler = Mangum(app, lifespan="off")

# Required export for Vercel
def main(request, context):
    return handler(request, context)
