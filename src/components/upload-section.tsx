import { useState, useRef, useEffect } from "react"
import { Upload, FileText, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function UploadSection() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [textContent, setTextContent] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
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
    setIsUploading(true)
    setUploadProgress(0)
    
    const startTime = Date.now()
    
    // Simulate upload progress over 10 seconds
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 200)
    
    // Send file to webhook
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('https://yogesh322007.app.n8n.cloud/webhook/1b1bb27f-d4b9-45e4-9be6-77419beb6b12', {
        method: 'POST',
        body: formData,
      })
      
      // Complete the progress after minimum 10 seconds
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, 10000 - elapsedTime)
      
      setTimeout(() => {
        setUploadProgress(100)
        setTimeout(() => {
          setIsUploading(false)
          setUploadedFile(file)
          
          if (response.ok) {
            toast({
              title: "File uploaded successfully!",
              description: `${file.name} has been processed and added to your knowledge base.`,
            })
          } else {
            toast({
              title: "Upload completed with warnings",
              description: `${file.name} uploaded but webhook response was unexpected.`,
              variant: "destructive",
            })
          }
        }, 500)
      }, remainingTime)
      
    } catch (error) {
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, 10000 - elapsedTime)
      
      setTimeout(() => {
        setUploadProgress(100)
        setTimeout(() => {
          setIsUploading(false)
          setUploadedFile(file)
          
          toast({
            title: "Upload completed with errors",
            description: `${file.name} uploaded but couldn't connect to processing service.`,
            variant: "destructive",
          })
        }, 500)
      }, remainingTime)
    }
    
    clearInterval(progressInterval)
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
              : isUploading
              ? "border-primary bg-gradient-secondary"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-lg font-medium">Processing your file...</span>
              </div>
              <div className="space-y-3">
                <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {uploadProgress < 30 ? "Analyzing document structure..." : 
                   uploadProgress < 60 ? "Extracting content..." :
                   uploadProgress < 90 ? "Building knowledge index..." :
                   "Finalizing upload..."}
                </p>
              </div>
            </div>
          ) : uploadedFile ? (
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
                disabled={isUploading}
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