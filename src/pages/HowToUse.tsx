import { Upload, MessageSquare, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const steps = [
  {
    icon: Upload,
    title: "📂 Upload File",
    description: "Upload your documents or paste your content to create a knowledge base",
    details: [
      "Drag and drop files or click browse",
      "Supports PDF, DOC, TXT, and MD formats",
      "Or paste text directly into the text area"
    ]
  },
  {
    icon: MessageSquare,
    title: "💬 Ask Question",
    description: "Type your questions in the chat interface",
    details: [
      "Ask specific questions about your content",
      "Use natural language - no special syntax needed",
      "Get contextual answers based on your uploaded knowledge"
    ]
  },
  {
    icon: Zap,
    title: "⚡ Get Answers",
    description: "Receive instant, accurate responses from your AI assistant",
    details: [
      "AI processes your knowledge base in real-time",
      "Answers are based on your specific content",
      "Fast, reliable, and contextually relevant responses"
    ]
  }
]

export default function HowToUse() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            How to Use KnowledgeBase AI
          </h1>
          <p className="text-xl text-muted-foreground">
            Get started in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <Card 
              key={step.title} 
              className="card-elegant animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 ml-16">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></div>
                      <span className="text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 animate-fade-in">
          <Card className="card-elegant bg-gradient-secondary border-none">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 gradient-text">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground mb-6">
                Upload your first document and start asking questions!
              </p>
              <a 
                href="/" 
                className="inline-flex items-center justify-center gap-2 h-11 rounded-lg px-8 bg-gradient-primary text-white shadow-elegant hover:shadow-glow hover:scale-105 transition-all duration-300 font-medium"
              >
                Go to Overview
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}