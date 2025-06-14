import Link from "next/link"
import { Youtube } from "lucide-react"

export default function Header() {
  return (
    <header className="container z-40 flex h-20 items-center">
      <div className="flex items-center justify-between w-full">
        <Link href="/" className="flex items-center space-x-2">
          <Youtube className="h-6 w-6 text-red-500" />
          <span className="font-semibold">VideoSummarizer</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <button 
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            How It Works
          </button>
        </nav>

      </div>
    </header>
  )
} 