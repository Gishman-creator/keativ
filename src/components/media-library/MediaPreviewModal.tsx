import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Download, Trash2 } from "lucide-react"
import type { MediaFile } from "./MediaGridProps"
import { useState } from "react"
import ConfirmDelete from "./ConfirmDelete"

interface MediaPreviewModalProps {
  file: MediaFile | null
  isOpen: boolean
  onClose: () => void
  onDelete?: (file: MediaFile) => void
  onDownload?: (file: MediaFile) => void
}

export function MediaPreviewModal({ file, isOpen, onClose, onDelete, onDownload }: MediaPreviewModalProps) {
  if (!file) return null

  const [showConfirm, setShowConfirm] = useState(false);

  const handleDownload = () => {
    if (onDownload) {
      onDownload(file)
    }
  }

  const handleConfirmDelete = async () => {
    if (onDelete) {
      try {
        await onDelete(file); // onDelete is now an async function passed from MediaGrid
      } catch (error) {
        console.error("Deletion failed from modal:", error);
      } finally {
        // Close both the confirmation dialog and the main modal
        setShowConfirm(false);
        onClose();
      }
    }
  };

  const handleContentAreaClick = (e: React.MouseEvent) => {
    // Close if clicking on the content area div, but not on the image/video itself
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleHeaderClick = (e: React.MouseEvent) => {
    // Prevent closing when clicking anywhere in the header
    e.stopPropagation()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-h-[100vh] min-w-[100vw] flex flex-col p-0 bg-transparent shadow-lg border-none [&>button]:hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-sm text-white z-50"
          onClick={handleHeaderClick}
        >
          <h3 className="text-lg font-semibold truncate flex-1 mr-4">
            {file.name || 'Media Preview'}
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="none"
              onClick={handleDownload}
              className="h-10 w-10 p-0 bg-transparent hover:bg-white/20 hover:text-white"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirm(true)}
                className="h-10 w-10 p-0 text-destructive hover:text-destructive bg-transparent hover:bg-white/20"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              {showConfirm && (
                <ConfirmDelete
                  onConfirm={handleConfirmDelete}
                  onCancel={() => setShowConfirm(false)}
                  message="Are you sure you want to delete this file? This action cannot be undone."
                />
              )}
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 bg-transparent hover:bg-white/20 hover:text-white"
                title="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>
        </div>

        {/* Content */}
        <div
          className="flex-1 flex items-center justify-center py-4 bg-transparent cursor-pointer"
          onClick={handleContentAreaClick}
        >
          <div className="relative max-h-[70vh]">
            {file.type === "image" ? (
              <img
                src={file.url}
                alt=""
                className="max-h-[70vh] w-auto h-auto object-contain cursor-default bg-white"
                onError={(e) => {
                  e.currentTarget.src = "/image-placeholder.png"
                }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
              />
            ) : (
              <div
                className="relative max-h-[70vh] cursor-default"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the video container
              >
                <video
                  src={file.url}
                  controls
                  autoPlay
                  muted
                  loop
                  className="max-h-[70vh] w-auto h-auto object-contain"
                  poster={file.thumbnailUrl || "/image-placeholder.png"}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
