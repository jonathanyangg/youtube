import Link from "next/link"
import { Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t py-8 md:py-12">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-500" />
          <span className="font-semibold">VideoSummarizer</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} VideoSummarizer. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="#" className="text-sm text-muted-foreground hover:underline">
            Terms
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:underline">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
} 