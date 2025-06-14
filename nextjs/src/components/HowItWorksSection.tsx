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

export default function HowItWorksSection() {
  return (
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
  )
} 