"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Loader2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Message {
  role: 'user' | 'assistant'
  content: string
  id: string
}

interface ChatProps {
  videoId: string
  transcriptData: any[]
  summary: string
}

export default function Chat({ videoId, transcriptData, summary }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [pendingScrollToMessage, setPendingScrollToMessage] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToMessage = (messageId: string) => {
    const messageElement = chatContainerRef.current?.querySelector(`[data-message-id="${messageId}"]`)
    const container = chatContainerRef.current
    
    if (messageElement && container) {
      const containerRect = container.getBoundingClientRect()
      const messageRect = messageElement.getBoundingClientRect()
      
      // Calculate the scroll position to show the message at the bottom of the container
      const scrollTop = container.scrollTop + (messageRect.bottom - containerRect.bottom) + 10
      
      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    if (pendingScrollToMessage) {
      const timeoutId = setTimeout(() => {
        scrollToMessage(pendingScrollToMessage)
        setPendingScrollToMessage(null)
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [pendingScrollToMessage])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const apiKey = localStorage.getItem("openai_api_key")
    if (!apiKey) {
      toast.error("Please save your OpenAI API key first")
      return
    }

    const userMessage = input.trim()
    const userMessageId = `user-${Date.now()}`
    const assistantMessageId = `assistant-${Date.now() + 1}`
    
    setInput("")
    setMessages(prev => [...prev, { role: 'user', content: userMessage, id: userMessageId }])
    setPendingScrollToMessage(userMessageId)
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage,
          video_id: videoId,
          transcript_data: transcriptData,
          summary: summary,
          api_key: apiKey
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer, id: assistantMessageId }])
      setPendingScrollToMessage(assistantMessageId)
    } catch (error) {
      const errorMessageId = `assistant-error-${Date.now()}`
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I couldn't process your question. Please try again.",
        id: errorMessageId
      }])
      setPendingScrollToMessage(errorMessageId)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="rounded-lg border bg-background shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50">
            <MessageCircle className="w-4 h-4 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold">Ask questions about this video</h3>
        </div>
      </div>

      <div ref={chatContainerRef} className="h-80 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-muted-foreground">Ask me anything about this video!</p>
            <p className="text-sm text-muted-foreground">
              Try: "What are the main points?" or "Can you explain the part about...?"
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              data-message-id={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'border bg-background'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="border bg-background rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t">
        <div className="flex items-center gap-3 p-2 rounded-full border bg-background shadow-sm">
          <input
            type="text"
            placeholder="Ask a question about the video..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
            disabled={isLoading}
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading || !input.trim()}
            className="rounded-full px-4"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 