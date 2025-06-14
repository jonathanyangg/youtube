import re
from typing import Dict, List, Any
from youtube_transcript_api import YouTubeTranscriptApi
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


def get_video_id(url: str) -> str:
    """
    Extract YouTube video ID from various URL formats.
    Supports: youtube.com, youtu.be, m.youtube.com
    """
    if not url or not isinstance(url, str):
        raise ValueError("Invalid URL provided")
    
    # YouTube URL patterns
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})',
        r'youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    raise ValueError("Invalid YouTube URL format")


def get_video_transcript(video_id: str) -> List[Dict[str, Any]]:
    """
    Fetch YouTube video transcript with timestamps.
    Returns list of transcript snippets with text, start time, and duration.
    """
    if not video_id:
        raise ValueError("Video ID is required")
    
    try:
        ytt_api = YouTubeTranscriptApi()
        fetched_transcript = ytt_api.fetch(video_id, languages=['en'])
        
        # Convert to raw data format for easier processing
        transcript_data = fetched_transcript.to_raw_data()
        
        return transcript_data
        
    except Exception as e:
        raise Exception(f"Failed to fetch transcript: {str(e)}")


def summarize_video(transcript_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generate AI summary of video transcript with key timestamps.
    """
    if not transcript_data:
        raise ValueError("Transcript data is required")
    
    # Format transcript for ChatGPT
    formatted_transcript = ""
    for snippet in transcript_data:
        timestamp = format_timestamp(snippet['start'])
        formatted_transcript += f"[{timestamp}] {snippet['text']}\n"
    
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that creates concise summaries of video transcripts. Include key timestamps in your summary."
                },
                {
                    "role": "user",
                    "content": f"Please provide a brief summary of this video transcript with the most important points and their timestamps:\n\n{formatted_transcript}"
                }
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        summary = response.choices[0].message.content
        
        return {
            "summary": summary,
            "total_duration": format_timestamp(transcript_data[-1]['start'] + transcript_data[-1]['duration']),
            "snippet_count": len(transcript_data)
        }
        
    except Exception as e:
        raise Exception(f"Failed to generate summary: {str(e)}")


def format_timestamp(seconds: float) -> str:
    """Convert seconds to MM:SS format."""
    minutes = int(seconds // 60)
    seconds = int(seconds % 60)
    return f"{minutes:02d}:{seconds:02d}"