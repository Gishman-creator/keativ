import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, Play, Download, Trash2, Eye, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { MediaPreviewModal } from "./MediaPreviewModal"
import { api } from "@/lib/api"
import { showCustomToast, showSmallToast } from "../CustomToast"
import ConfirmDelete from "./ConfirmDelete"

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
  // onFileSelect: (fileId: string) => void
  onFileToggle: (fileId: string) => void
  selectedCount: number
  onBulkAction: (action: string, fileIds: string[]) => void
}

export function MediaGrid({
  files,
  onFileToggle,
  selectedCount,
  onBulkAction,
}: MediaGridProps) {
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false);

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

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const createZipAndDownload = async (files: MediaFile[]) => {
    try {
      // Dynamically import JSZip
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()

      // Add each file to the zip
      for (const file of files) {
        try {
          const response = await fetch(file.url)
          const blob = await response.blob()
          zip.file(file.name, blob)
        } catch (error) {
          console.error(`Failed to add ${file.name} to zip:`, error)
        }
      }

      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" })

      // Create download link
      const downloadUrl = window.URL.createObjectURL(content)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'keativ-media.zip'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Zip creation failed:', error)
      // Fallback: download files individually
      files.forEach(file => downloadFile(file.url, file.name))
    }
  }

  const handleDownload = (file: MediaFile) => {
    downloadFile(file.url, file.name)
    showSmallToast('Your files have started downloading.')
  }

  const handleBulkDownload = () => {
    if (selectedFiles.length === 1) {
      // Single file - download directly
      downloadFile(selectedFiles[0].url, selectedFiles[0].name)
      showSmallToast('Your files have started downloading.')
    } else if (selectedFiles.length > 1) {
      // Multiple files - create zip
      createZipAndDownload(selectedFiles)
      showSmallToast('Your files have started downloading.')
    }
    handleClearSelection()
  }

  // Unified function for single and bulk deletion
  const handleDelete = async (file?: MediaFile) => {
    const idsToDelete = file ? [file.id] : selectedFileIds;
    if (idsToDelete.length === 0) return;

    try {
      const response = await api.bulkMediaDelete(idsToDelete);
      if (response.success) {
        const message = idsToDelete.length === 1
          ? "File deleted successfully."
          : `${idsToDelete.length} files deleted successfully.`;
        // Notify parent to refresh the file list
        onBulkAction('delete', idsToDelete);
        showSmallToast('File(s) deleted successfully.');
        // Clear selection for bulk delete
        if (!file) {
          handleClearSelection();
        }
      } else {
        // Handle upload failure
        const error = response.error || 'Upload failed';
        console.error('Upload failed:', error);
        if (error === 'Network error') {
          showCustomToast('No Internet', 'Please check your internet connection and try again.', 'error');
        } else {
          // Check if error is an object with key-value pairs
          if (typeof error === 'object' && error !== null) {
            const errorMessages = Object.entries(error)
              .map(([key, value]) => {
                let message;
                if (Array.isArray(value)) {
                  message = value.join(', ');
                } else {
                  // Convert to string to handle numbers, booleans, etc.
                  message = String(value);
                }
                // Add period only if the message doesn't already end with one
                return message.endsWith('.') ? message : message + '.';
              })
              .join(' ');
            showCustomToast('Failed to delete file(s)', errorMessages || 'An unexpected error occurred deleting your file(s), please try again.', 'error');
          } else {
            // Generic upload failed message if error is not an object
            showCustomToast('Failed to delete file(s)', 'An unexpected error occurred deleting your file(s), please try again.', 'error');
          }
        }
      }
    } catch (error) {
      console.error("Deletion failed:", error);
      showCustomToast('Failed to delete file(s)', 'An unexpected error occurred deleting your file(s), please try again.', 'error');
    } finally {
      // This ensures the pop-up closes whether the API call succeeds or fails
      setShowConfirm(false);
    }
  };

  const handleClearSelection = () => {
    selectedFiles.forEach(file => onFileToggle(file.id))
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
        <div className="sticky top-[0rem] z-20 bg-white/20 backdrop-blur-sm pt-[1rem] pb-0 rounded-b-lg">
          <div className="flex items-center justify-between p-4 bg-white border border-border rounded-lg">
            <span className="font-medium text-foreground flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                className="w-8 h-8 p-0 hover:bg-gray-100 rounded-lg"
                title="Clear selection"
              >
                <X className="w-4 h-4" />
              </Button>
              {selectedCount} file{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleBulkDownload}
                className="hidden sm:inline-flex"
              >
                <Download className="w-4 h-4 mr-2" />
                Download {selectedCount > 1 ? 'as ZIP' : ''}
              </Button>
              <Button
                variant="outline"
                onClick={handleBulkDownload}
                className="h-10 w-10 p-0 bg-transparent hover:bg-gray-100 sm:hidden border-gray-200"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </Button>
              <div className="relative">
                <Button
                  variant="destructive"
                  onClick={() => setShowConfirm(true)}
                  className="hidden sm:inline-flex"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowConfirm(true)}
                  className="h-10 w-10 p-0 text-white sm:hidden"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {showConfirm && (
                  <ConfirmDelete
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                    message={`Are you sure you want to delete ${selectedCount} file(s)? This action cannot be undone.`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="flex-1 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-0.5">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => handleFileClick(file)}
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
                      "bg-white/20 backdrop-blur-md border-2 border-gray-300 hover:border-gray-600 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary flex items-center justify-center"
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
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
    </div>
  )
}