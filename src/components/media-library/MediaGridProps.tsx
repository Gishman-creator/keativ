import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, Play, Download, Trash2, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { MediaPreviewModal } from "./MediaPreviewModal" 

export interface MediaFile {
  id: string
  name: string
  type: "image" | "video"
  url: string
  thumbnailUrl?: string
  size: number
  uploadDate: Date
  selected: boolean
}

interface MediaGridProps {
  files: MediaFile[]
  onFileSelect: (fileId: string) => void
  onFileToggle: (fileId: string) => void
  selectedCount: number
  onBulkAction: (action: string, fileIds: string[]) => void
}

export function MediaGrid({
  files,
  onFileSelect,
  onFileToggle,
  selectedCount,
  onBulkAction,
}: MediaGridProps) {
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  
  const selectedFiles = files.filter(file => file.selected)
  const selectedFileIds = selectedFiles.map(file => file.id)

  const handleFileClick = (file: MediaFile) => {
    if (selectedCount > 0) {
      // If any files are selected, clicking selects/deselects
      onFileToggle(file.id)
    } else {
      // If no files are selected, clicking opens preview
      setPreviewFile(file)
      setIsPreviewOpen(true)
    }
  }

  const handleCheckboxChange = (fileId: string, checked: boolean) => {
    onFileToggle(fileId)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  if (files.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-lg flex items-center justify-center">
            <Eye className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-heading text-lg font-semibold mb-2">No media files found</h3>
          <p className="text-muted-foreground">
            Upload some files or adjust your filters to see content here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Action Bar */}
      {selectedCount > 0 && (
        <div className="sticky top-[1rem] z-20 flex items-center justify-between p-4 mb-6 bg-white backdrop-blur-sm border border-border rounded-lg">
          <span className="font-medium text-foreground">
            {selectedCount} file{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onBulkAction('download', selectedFileIds)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="destructive"
              onClick={() => onBulkAction('delete', selectedFileIds)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className={cn(
                "group relative cursor-pointer transition-all hover:scale-[1.02]",
                file.selected && "ring-1 ring-secondary rounded-lg"
              )}
            >
              {/* Media Preview */}
              <div className="aspect-square bg-accent rounded-lg overflow-hidden border border-border">
                {file.type === "image" ? (
                  <img
                    src={file.url}
                    alt=""
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/image-placeholder.png"
                    }}
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={file.thumbnailUrl || "/image-placeholder.png"}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-5 h-5 text-gray-800 ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Checkbox */}
                <div 
                  className={cn(
                    "absolute top-2 left-2 transition-opacity",
                    file.selected ? "opacity-100" : selectedCount > 0 ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCheckboxChange(file.id, !file.selected)
                  }}
                >
                  <Checkbox
                    checked={file.selected}
                    className={cn(
                      "bg-background border border-gray-300 hover:border-gray-500 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MediaPreviewModal 
        file={previewFile}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  )
}