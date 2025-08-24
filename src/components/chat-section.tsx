import { useState } from "react"
import { Send, User, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const question = inputValue
    setInputValue("")
    setIsLoading(true)

    // Send question to webhook
    try {
      const response = await fetch('https://yogesh322007.app.n8n.cloud/webhook/1aa67438-d3d3-4980-9b2b-72be14b7c602', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question }),
      })
      
      if (response.ok) {
        const data = await response.json()
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.answer || `Question "${question}" has been sent to the AI. Processing your knowledge base...`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('Question webhook failed')
      }
    } catch (error) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I received your question: "${question}". However, there was an issue connecting to the AI service. Please try again.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      
      toast({
        title: "Connection issue",
        description: "Failed to send question to AI service.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="card-elegant animate-fade-in">
      <CardHeader>
        <CardTitle className="gradient-text">💬 Chat Interface</CardTitle>
        <CardDescription>
          Ask questions about your uploaded knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <ScrollArea className="h-96 w-full rounded-lg border p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Start a conversation by asking a question about your knowledge base</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 animate-slide-in ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-muted text-foreground'
                        : 'bg-gradient-secondary text-foreground border'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 animate-slide-in">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gradient-secondary border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="spinner-neumorphic w-4 h-4"></div>
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            variant="gradient" 
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}