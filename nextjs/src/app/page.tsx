"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import VideoSummarizer from "@/components/VideoSummarizer"
import FeaturesSection from "@/components/FeaturesSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import Footer from "@/components/Footer"

export default function LandingPage() {

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 space-y-8 md:space-y-16 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Summarize YouTube Videos in Seconds
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Get the key points from any YouTube video without watching the whole thing. Save time and stay informed.
            </p>
          </div>
          
          <VideoSummarizer />
        </section>

        <FeaturesSection />
        <HowItWorksSection />
      </main>
      
      <Footer />
    </div>
  )
}




