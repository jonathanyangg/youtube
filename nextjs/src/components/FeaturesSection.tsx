import { CheckCircle } from "lucide-react"

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

export default function FeaturesSection() {
  return (
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
  )
} 