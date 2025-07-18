from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from functions import get_video_id, get_video_transcript, summarize_video, answer_video_question, validate_api_key
from typing import List, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="YouTube Video Summarizer API")

frontend_urls = os.getenv("FRONTEND_URLS", "http://localhost:3000")
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins = frontend_urls.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    video_url: str
    api_key: str = None

class VideoResponse(BaseModel):
    summary: str
    total_duration: str
    snippet_count: int
    video_id: str
    transcript_data: List[Dict[str, Any]]

class ChatRequest(BaseModel):
    question: str
    video_id: str
    transcript_data: List[Dict[str, Any]]
    summary: str
    api_key: str = None

class ChatResponse(BaseModel):
    answer: str

class APIKeyRequest(BaseModel):
    api_key: str

class APIKeyResponse(BaseModel):
    valid: bool
    message: str

@app.get("/")
def read_root():
    return {"message": "YouTube Video Summarizer API"}

@app.post("/process_video", response_model=VideoResponse)
def process_video(request: VideoRequest):
    """
    Process a YouTube video URL and return an AI-generated summary with timestamps.
    """
    try:
        # Step 1: Extract video ID and validate URL
        video_id = get_video_id(request.video_url)
        
        # Step 2: Get video transcript with timestamps
        transcript_data = get_video_transcript(video_id)
        
        # Step 3: Generate AI summary
        summary_result = summarize_video(transcript_data, request.api_key)
        
        return VideoResponse(
            summary=summary_result["summary"],
            total_duration=summary_result["total_duration"],
            snippet_count=summary_result["snippet_count"],
            video_id=video_id,
            transcript_data=transcript_data
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
def chat_about_video(request: ChatRequest):
    """
    Answer questions about a video using its transcript and summary.
    """
    try:
        answer = answer_video_question(
            question=request.question,
            transcript_data=request.transcript_data,
            summary=request.summary,
            api_key=request.api_key
        )
        
        return ChatResponse(answer=answer)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/validate_api_key", response_model=APIKeyResponse)
def validate_api_key_endpoint(request: APIKeyRequest):
    """
    Validate the OpenAI API key provided by the user.
    """
    try:
        is_valid = validate_api_key(request.api_key)
        return APIKeyResponse(
            valid=is_valid,
            message="API key is valid" if is_valid else "Invalid API key"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}