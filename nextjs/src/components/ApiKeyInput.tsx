"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Key } from "lucide-react"

export default function ApiKeyInput() {
  const [apiKey, setApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8000/validate_api_key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ api_key: apiKey }),
      })

      const data = await response.json()
      
      if (data.valid) {
        localStorage.setItem("openai_api_key", apiKey)
        toast.success("API key saved successfully")
      } else {
        toast.error("Invalid API key")
      }
    } catch (error) {
      toast.error("Failed to validate API key")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded-full border bg-background shadow-sm max-w-2xl mx-auto">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
        <Key className="w-5 h-5 text-muted-foreground" />
      </div>
      <input
        type="password"
        placeholder="Enter your OpenAI API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
        autoComplete="off"
      />
      <Button onClick={handleSave} disabled={isLoading} className="rounded-full px-6">
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </div>
  )
} 