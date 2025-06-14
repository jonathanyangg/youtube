"use client"

import { useState, useEffect } from "react"
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
  const [apiKey, setApiKey] = useState("")
  const [apiKeySaved, setApiKeySaved] = useState(false)

  useEffect(() => {
    const storedKey = localStorage.getItem("openai_api_key")
    if (storedKey) setApiKey(storedKey)
  }, [])

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value)
    setApiKeySaved(false)
  }

  const handleApiKeySave = () => {
    localStorage.setItem("openai_api_key", apiKey)
    setApiKeySaved(true)
    setTimeout(() => setApiKeySaved(false), 1500)
  }

  const handleSummarize = async () => {
    if (!videoUrl.trim()) {
      setError("Please enter a YouTube URL")
      return
    }
    if (!apiKey.trim()) {
      setError("Please enter your OpenAI API key above")
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
        body: JSON.stringify({ video_url: videoUrl, openai_api_key: apiKey }),
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
      {/* API Key Section */}
      <div className="mx-auto max-w-2xl space-y-2">
        <label className="block text-sm font-medium mb-1" htmlFor="openai-api-key">
          OpenAI API Key
        </label>
        <div className="flex items-center gap-2">
          <input
            id="openai-api-key"
            type="password"
            value={apiKey}
            onChange={handleApiKeyChange}
            className="flex-1 px-3 py-2 border rounded-md bg-background text-sm focus:outline-none"
            placeholder="sk-..."
            autoComplete="off"
          />
          <button
            type="button"
            onClick={handleApiKeySave}
            className="rounded-md px-4 py-2 bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 focus:outline-none"
          >
            Save
          </button>
          {apiKeySaved && <span className="text-green-600 text-sm ml-2">Saved!</span>}
        </div>
      </div>

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
                <p className="whitespace-pre-wrap text-foreground leading-relaxed">
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