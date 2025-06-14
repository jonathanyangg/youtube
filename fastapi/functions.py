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
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that creates concise summaries of video transcripts. Always structure your response with a brief general overview followed by detailed points with timestamps."
                },
                {
                    "role": "user",
                    "content": f"Please summarize this video transcript in the following format:\n\n1. First, provide a 3-sentence general overview of what the video is about\n2. Then provide detailed key points with their timestamps\n\nTranscript:\n{formatted_transcript}"
                }
            ],
            max_tokens=600,
            temperature=0.6
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


def answer_video_question(question: str, transcript_data: List[Dict[str, Any]], summary: str) -> str:
    """
    Answer questions about the video using transcript and summary context.
    """
    if not question or not transcript_data:
        raise ValueError("Question and transcript data are required")
    
    # Format transcript for context
    formatted_transcript = ""
    for snippet in transcript_data:
        timestamp = format_timestamp(snippet['start'])
        formatted_transcript += f"[{timestamp}] {snippet['text']}\n"
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that answers questions about video content. Use the provided transcript and summary to give accurate, specific answers. Include timestamps when relevant."
                },
                {
                    "role": "user",
                    "content": f"Video Summary:\n{summary}\n\nVideo Transcript:\n{formatted_transcript}\n\nQuestion: {question}"
                }
            ],
            max_tokens=400,
            temperature=0.7
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        raise Exception(f"Failed to answer question: {str(e)}")