from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from functions import get_video_id, get_video_transcript, summarize_video

app = FastAPI(title="YouTube Video Summarizer API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    video_url: str

class VideoResponse(BaseModel):
    summary: str
    total_duration: str
    snippet_count: int
    video_id: str

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
        summary_result = summarize_video(transcript_data)
        
        return VideoResponse(
            summary=summary_result["summary"],
            total_duration=summary_result["total_duration"],
            snippet_count=summary_result["snippet_count"],
            video_id=video_id
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy"}