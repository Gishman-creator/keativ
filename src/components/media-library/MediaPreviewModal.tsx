import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Play } from "lucide-react"
import type { MediaFile } from "./MediaGridProps" 

interface MediaPreviewModalProps {
  file: MediaFile | null
  isOpen: boolean
  onClose: () => void
}

export function MediaPreviewModal({ file, isOpen, onClose }: MediaPreviewModalProps) {
  if (!file) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0 bg-background">
        <div className="relative w-full h-full flex items-center justify-center">
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogClose>
          
          {file.type === "image" ? (
            <img
              src={file.url}
              alt=""
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "/image-placeholder.png"
              }}
            />
          ) : (
            <div className="relative max-w-full max-h-full">
              <video
                src={file.url}
                controls
                className="max-w-full max-h-full"
                poster={file.thumbnailUrl || "/image-placeholder.png"}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}