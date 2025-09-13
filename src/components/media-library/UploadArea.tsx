import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Plus, Upload, HardDrive } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void
  tempSelectedFiles: File[]
  setTempSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>
}

export function UploadArea({
  onFilesSelected,
  tempSelectedFiles,
  setTempSelectedFiles,
}: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/') || file.type.startsWith('video/')
    )
    
    if (files.length > 0) {
      setTempSelectedFiles(prev => [...prev, ...files])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setTempSelectedFiles(prev => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setTempSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const confirmUpload = () => {
    if (tempSelectedFiles.length > 0) {
      onFilesSelected(tempSelectedFiles)
      setTempSelectedFiles([])
    }
  }

  return (
    <div className="p-6 border-b border-border bg-gradient-subtle">
      {/* Drag & Drop Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-accent/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-heading text-lg font-semibold mb-2">
          Drag & drop your media files here
        </h3>
        <p className="text-muted-foreground mb-4">
          Support for images and videos up to 50MB each
        </p>
        
        {/* Upload Options */}
        <div className="flex justify-center gap-4">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="default"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="shadow-soft"
          >
            <HardDrive className="w-4 h-4 mr-2" />
            Browse Files
          </Button>
          
          <Button variant="outline">
            <img 
              src="/integrated apps/google-drive-logo.png" 
              alt="Google Drive" 
              className="w-4 h-4 mr-2"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            Google Drive
          </Button>
          
          <Button variant="outline">
            <img 
              src="/integrated apps/dropbox-logo.png" 
              alt="Dropbox" 
              className="w-4 h-4 mr-2"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            Dropbox
          </Button>
        </div>
      </div>

      {/* Selected Files Preview */}
      {tempSelectedFiles.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-heading font-medium">
              Selected Files ({tempSelectedFiles.length})
            </h4>
            <Button
              onClick={confirmUpload}
              className="shadow-soft"
            >
              Upload {tempSelectedFiles.length} file{tempSelectedFiles.length !== 1 ? 's' : ''}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {tempSelectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-accent rounded-lg overflow-hidden border border-border">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/10">
                      <div className="text-center">
                        <Upload className="w-6 h-6 mx-auto mb-1 text-secondary" />
                        <span className="text-xs text-muted-foreground">Video</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
                
                <p className="mt-1 text-xs text-muted-foreground truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}