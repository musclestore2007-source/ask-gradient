import { UploadSection } from "@/components/upload-section"
import { ChatSection } from "@/components/chat-section"

export default function Overview() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            Upload, Ask, Get Instant Answers
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your knowledge base and interact instantly with our AI assistant. 
            Get precise answers from your documents in seconds.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <UploadSection />
          </div>

          {/* Chat Section */}
          <div className="space-y-6">
            <ChatSection />
          </div>
        </div>
      </div>
    </div>
  )
}