"use client"

import { useState } from "react"
import { Youtube, Loader2, Clock, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import Chat from "./Chat"

interface SummaryResponse {
  summary: string
  total_duration: string
  snippet_count: number
  video_id: string
  transcript_data: any[]
}

export default function VideoSummarizer() {
  const [videoUrl, setVideoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<SummaryResponse | null>(null)
  const [transcriptData, setTranscriptData] = useState<any[]>([])
  const [error, setError] = useState("")

  const handleSummarize = async () => {
    if (!videoUrl.trim()) {
      setError("Please enter a YouTube URL")
      return
    }

    setIsLoading(true)
    setError("")
    setSummary(null)
    setTranscriptData([])

    try {
      const response = await fetch("http://localhost:8000/process_video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_url: videoUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to process video")
      }

      const data: SummaryResponse = await response.json()
      setSummary(data)
      setTranscriptData(data.transcript_data)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center gap-3 p-2 rounded-full border bg-background shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50">
            <Youtube className="w-5 h-5 text-red-500" />
          </div>
          <input
            type="text"
            placeholder="Paste YouTube URL here..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
            disabled={isLoading}
          />
          <Button 
            className="rounded-full px-6" 
            onClick={handleSummarize}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Summarize"
            )}
          </Button>
        </div>
        
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Summary Display */}
      {summary && (
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="rounded-lg border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {summary.total_duration}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="w-4 h-4" />
                {summary.snippet_count} segments
              </div>
              <div className="text-sm text-muted-foreground">
                Video ID: {summary.video_id}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Summary</h3>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {summary.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          {transcriptData.length > 0 && (
            <Chat 
              videoId={summary.video_id}
              transcriptData={transcriptData}
              summary={summary.summary}
            />
          )}
        </div>
      )}
    </div>
  )
} 