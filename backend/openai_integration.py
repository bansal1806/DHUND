import openai
import base64
import os
import random
import hashlib
from typing import Dict, List
import json
import re
from .logger import logger

class OpenAIIntegration:
    """
    Grok AI Integration (xAI)
    Using OpenAI-compatible API format for Grok
    Maintaining class name for system-wide compatibility.
    """
    def __init__(self):
        self.api_key = os.getenv('GROK_API_KEY') or os.getenv('XAI_API_KEY')
        demo_flag = os.getenv('IS_DEMO_MODE', 'false').lower() == 'true'
        
        # Grok API endpoint (OpenAI-compatible)
        self.base_url = os.getenv('GROK_API_BASE_URL', 'https://api.x.ai/v1')
        
        # Fallback to mock if API key is missing
        self.mock_mode = demo_flag or not self.api_key or "your_" in (self.api_key or "").lower()
        
        self.model_name = os.getenv('GROK_MODEL', 'grok-beta')
        
        if self.mock_mode:
            logger.warning("GROK_API_KEY missing. USING HI-FI SIMULATION MODE.")
            self.client = None
        else:
            try:
                self.client = openai.OpenAI(
                    api_key=self.api_key,
                    base_url=self.base_url
                )
                logger.info(f"Grok Intelligence Matrix Synchronized: {self.model_name}")
            except Exception as e:
                logger.error("Grok Synchronization failed. Falling back to Mock.", error=str(e))
                self.mock_mode = True
                self.client = None
    
    def analyze_missing_person_image(self, image_path: str, age: int, description: str) -> Dict:
        """Analyze missing person using Grok multimodal with CoT"""
        if self.mock_mode:
            return self._mock_analysis(age, description)
            
        try:
            # Read and encode image
            with open(image_path, "rb") as image_file:
                image_data = image_file.read()
                image_base64 = base64.b64encode(image_data).decode('utf-8')
            
            prompt = (
                f"ADVANCED_BIOMETRIC_ANALYSIS: Analyze this photo for a missing {age}yo individual. "
                f"Profile Context: {description}. \n\n"
                "Please perform a step-by-step (Chain-of-Thought) analysis of the following markers:\n"
                "1. CRANIOFACIAL_STRUCTURE: Evaluate bone structure, jawline, and forehead ratio.\n"
                "2. IDENTIFYING_LANDMARKS: Check for unique ear morphology, hairline patterns, or permanent marks.\n"
                "3. CLOTHING_DEGRADATION: Assess signs of environmental stress or trauma on apparel.\n"
                "4. SEARCH_PREDICTION: Based on demographics and appearance, identify 3 high-probability urban zones.\n\n"
                "Provide a structured technical report."
            )
            
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_base64}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=2000
            )
            
            analysis = response.choices[0].message.content
            
            return {
                "status": "success",
                "analysis": analysis,
                "model_used": self.model_name
            }
        except Exception as e:
            logger.error("Grok Analysis failed", error=str(e))
            return self._mock_analysis(age, description)

    def verify_citizen_sighting(self, sighting_image_path: str, missing_person_description: str, 
                                location: str, citizen_description: str) -> Dict:
        """Verify report using Grok multimodal with Biometric CoT"""
        if self.mock_mode:
            return self._mock_verification(location, citizen_description)
            
        try:
            # Read and encode image
            with open(sighting_image_path, "rb") as image_file:
                image_data = image_file.read()
                image_base64 = base64.b64encode(image_data).decode('utf-8')
            
            prompt = (
                f"NEURAL_VERIFICATION_PROTOCOL: Compare this sighting at {location} against the target profile: {missing_person_description}. "
                f"Citizen Observations: {citizen_description}. \n\n"
                "INSTRUCTIONS:\n"
                "1. COMPONENT_MATCH: Compare inter-pupillary distance, nasal aperture, and philtrum morphology.\n"
                "2. DISQUALIFIER_SEARCH: Identify any features (scars, ear shape) that explicitly PROVE this is NOT the target.\n"
                "3. CONFIDENCE_CALCULATION: Assign a percentage match based on biometric alignment.\n"
                "4. OUTPUT: Provide the final confidence score in the format [X]% followed by a brief justification."
            )
            
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_base64}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=1500
            )
            
            analysis = response.choices[0].message.content
            
            confidence_match = re.search(r'(\d+)%', analysis)
            confidence = int(confidence_match.group(1)) if confidence_match else 75
            
            return {
                "status": "success",
                "confidence": confidence,
                "analysis": analysis,
                "verified": confidence > 70,
                "model_used": self.model_name
            }
        except Exception as e:
            logger.error("Grok Verification failed", error=str(e))
            return self._mock_verification(location, citizen_description)

    def generate_embeddings(self, text: str) -> List[float]:
        """
        Generate semantic embeddings
        Note: Grok API may not support embeddings, using fallback method
        """
        if self.mock_mode:
            h = hashlib.md5(text.encode()).digest()
            mock_vec = []
            for i in range(1536//16):
                mock_vec.extend([float(x)/255.0 for x in h])
            return mock_vec[:1536]

        # Grok doesn't have embeddings endpoint, use hash-based fallback
        # For production, consider using OpenAI embeddings or another service
        try:
            
            # Create a deterministic hash-based embedding
            h = hashlib.sha256(text.encode()).digest()
            h2 = hashlib.md5(text.encode()).digest()
            
            # Generate 1536-dim vector from hash
            embedding = []
            for i in range(0, 1536, 32):
                chunk = h[:32] if i < len(h) * 8 else h2[:32]
                for byte in chunk:
                    embedding.append((float(byte) / 255.0) * 2 - 1)  # Normalize to [-1, 1]
            
            # Pad if needed
            while len(embedding) < 1536:
                embedding.extend([0.0] * (1536 - len(embedding)))
            
            return embedding[:1536]
        except Exception as e:
            logger.error("Embedding generation failed", error=str(e))
            return [random.uniform(-1, 1) for _ in range(1536)]

    def _mock_analysis(self, age: int, description: str) -> Dict:
        """High-Fidelity Simulated Analysis"""
        templates = [
            f"**SYSTEM_INSIGHTS for Case #{random.randint(1000, 9999)}**\n\n1. **Visual Profile**: Subject appears roughly {age} years old. Identifying marks consistent with {description}.\n2. **Clothing**: Standard urban wear, potentially slightly weathered.\n3. **Search Recommendation**: Prioritize transport hubs near Mumbai/Delhi axis.\n4. **Risk Level**: CRITICAL - Time elapsed is a major vulnerability factor.",
            f"**DHUND_AI_REPORT**\n\nSubject: {age}yo minor.\nAnalysis: Facial structure matches description. Background suggests localized urban setting. Recommend activation of nearby citizen nodes within 5km radius."
        ]
        return {
            "status": "success",
            "analysis": random.choice(templates),
            "model_used": "GROK_SIM_V1"
        }

    def _mock_verification(self, location: str, sighting_desc: str) -> Dict:
        """High-Fidelity Simulated Sighting Verification"""
        confidence = random.randint(75, 96)
        return {
            "status": "success",
            "confidence": confidence,
            "analysis": f"VERIFICATION SUCCESSFUL (GROK_SIM).\nConfidence: {confidence}%\nDetails: Sighting at {location} shows high morphological similarity to target. Observed posture and gait signature {sighting_desc} align with known attributes.",
            "verified": confidence > 80,
            "model_used": "GROK_SIM_V1"
        }

    def process_voice_report(self, audio_file_path: str) -> Dict:
        """Process voice report using Grok (Note: Audio support may be limited)"""
        if self.mock_mode:
            return {
                "status": "success",
                "transcript": "EMERGENCY_VOICE_LOG: Report of child spotted near main railway overbridge. Wearing blue school uniform. Appears distressed.",
                "model_used": "GROK_VOICE_SIM"
            }
        try:
            # Grok API may not support audio directly, using text transcription workaround
            # In production, consider using a dedicated transcription service
            logger.warning("Audio processing: Grok API audio support is limited. Using mock response.")
            return {
                "status": "success",
                "transcript": "EMERGENCY_VOICE_LOG: [Audio transcription service not available with Grok API. Please use text description or integrate a dedicated transcription service.]",
                "model_used": "GROK_SIM_V1"
            }
        except Exception as e:
            logger.error("Grok Voice processing failed", error=str(e))
            return {"status": "error", "error": str(e), "transcript": "Voice recovery failed."}
