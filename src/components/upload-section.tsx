import { useState, useRef } from "react"
import { Upload, FileText, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function UploadSection() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [textContent, setTextContent] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file)
    
    // Send file to webhook
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('https://yogesh322007.app.n8n.cloud/webhook/1b1bb27f-d4b9-45e4-9be6-77419beb6b12', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        toast({
          title: "File uploaded successfully!",
          description: `${file.name} has been uploaded and sent to webhook.`,
        })
      } else {
        throw new Error('Webhook failed')
      }
    } catch (error) {
      toast({
        title: "Upload successful, webhook failed",
        description: `${file.name} uploaded but couldn't send to webhook.`,
        variant: "destructive",
      })
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleTextSubmit = async () => {
    if (textContent.trim()) {
      try {
        const response = await fetch('https://yogesh322007.app.n8n.cloud/webhook/d5680e45-22cc-4fa8-8bab-518679fe75d6', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: textContent }),
        })
        
        if (response.ok) {
          toast({
            title: "Text submitted successfully!",
            description: "Your knowledge base content has been processed.",
          })
          setTextContent("")
        } else {
          throw new Error('Text webhook failed')
        }
      } catch (error) {
        toast({
          title: "Submission failed",
          description: "Failed to send text content to webhook.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Card className="card-elegant animate-fade-in">
      <CardHeader>
        <CardTitle className="gradient-text">📂 Upload Knowledge Base</CardTitle>
        <CardDescription>
          Upload a file or paste your content to create your knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            dragActive
              ? "border-primary bg-gradient-secondary"
              : uploadedFile
              ? "border-green-500 bg-green-50"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploadedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Check className="w-5 h-5" />
                <span className="font-medium">{uploadedFile.name}</span>
              </div>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="gradient-outline" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </Button>
                <Button 
                  variant="gradient" 
                  onClick={() => setUploadedFile(null)}
                >
                  Upload Another File
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Drag & drop your file here</p>
              <p className="text-muted-foreground mb-4">or</p>
              <Button 
                variant="gradient-outline" 
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileInputChange}
            accept=".pdf,.doc,.docx,.txt,.md"
          />
        </div>

        {/* Text Input Area */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-medium">Or paste your content</h3>
          </div>
          <Textarea
            placeholder="Paste your knowledge base content here..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <Button 
            variant="gradient" 
            onClick={handleTextSubmit}
            disabled={!textContent.trim()}
            className="w-full"
          >
            Submit Content
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}