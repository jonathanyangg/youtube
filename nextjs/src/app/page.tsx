"use client"

import Link from "next/link"
import { CheckCircle, Youtube } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 flex h-20 items-center">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center space-x-2">
            <Youtube className="h-6 w-6 text-red-500" />
            <span className="font-semibold">VideoSummarizer</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Features
            </button>
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              How It Works
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-24 space-y-8 md:space-y-16 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Summarize YouTube Videos in Seconds
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Get the key points from any YouTube video without watching the whole thing. Save time and stay informed.
            </p>

          </div>
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-3 p-2 rounded-full border bg-background shadow-sm">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50">
                <Youtube className="w-5 h-5 text-red-500" />
              </div>
              <input
                type="text"
                placeholder="Paste YouTube URL here..."
                className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              <Button className="rounded-full px-6">
                Summarize
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="container pt-8 pb-16 md:pt-12 md:pb-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">Features</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Our AI-powered tool extracts the most important information from any YouTube video
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-16">
            {features.map((feature) => (
              <div key={feature.title} className="relative overflow-hidden rounded-lg border bg-background p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">{feature.icon}</div>
                <div className="mt-4 space-y-2">
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="container py-16 md:py-24 bg-muted/50">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">How It Works</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Get your video summary in three simple steps
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 mt-16">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-background text-lg font-bold">
                  {index + 1}
                </div>
                <h3 className="mt-4 font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>



        <section className="container py-16 md:py-24 bg-muted/50">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">Ready to save time on YouTube?</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Join thousands of users who are getting the most out of their video content
            </p>
            <Button size="lg" className="mt-4">
              Get Started for Free
            </Button>
          </div>
        </section>
      </main>
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
    </div>
  )
}

const features = [
  {
    title: "AI-Powered Summaries",
    description: "Our advanced AI extracts key points and insights from any YouTube video.",
    icon: <CheckCircle className="h-5 w-5 text-primary" />,
  },
  {
    title: "Time Stamps",
    description: "Jump directly to important moments in the video with our smart time stamps.",
    icon: <CheckCircle className="h-5 w-5 text-primary" />,
  },
  {
    title: "Multiple Languages",
    description: "Get summaries in your preferred language, regardless of the video's original language.",
    icon: <CheckCircle className="h-5 w-5 text-primary" />,
  },
  {
    title: "Save Summaries",
    description: "Create a library of your summarized videos for easy reference.",
    icon: <CheckCircle className="h-5 w-5 text-primary" />,
  },
  {
    title: "Share Summaries",
    description: "Share video summaries with friends or colleagues with a single click.",
    icon: <CheckCircle className="h-5 w-5 text-primary" />,
  },
  {
    title: "Works with Any Video",
    description: "Compatible with all public YouTube videos, regardless of length or topic.",
    icon: <CheckCircle className="h-5 w-5 text-primary" />,
  },
]

const steps = [
  {
    title: "Paste YouTube URL",
    description: "Simply copy and paste the URL of any YouTube video you want to summarize.",
  },
  {
    title: "Our AI Analyzes the Video",
    description: "Our advanced AI watches and analyzes the entire video content.",
  },
  {
    title: "Get Your Summary",
    description: "Receive a concise summary with key points and timestamps in seconds.",
  },
]


