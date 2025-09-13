import { useState, useMemo } from "react"
import { FilterBar, type MediaType } from "@/components/media-library/FilterBar"
import { UploadArea } from "@/components/media-library/UploadArea"
import { MediaGrid, type MediaFile } from "@/components/media-library/MediaGridProps"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { FolderOpen, Upload as UploadIcon, ChevronDown, HardDrive, Cloud } from "lucide-react"

// Sample media files for demonstration
const generateSampleFiles = (): MediaFile[] => {
  const files: MediaFile[] = []
  const baseDate = new Date()

  // Sample images
  for (let i = 1; i <= 12; i++) {
    files.push({
      id: `img-${i}`,
      name: `image-${i}.jpg`,
      type: "image",
      url: `/image-placeholder.png?id=${i}`,
      size: Math.floor(Math.random() * 5000000) + 500000, // 0.5MB to 5MB
      uploadDate: new Date(baseDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
      selected: false,
    })
  }

  // Sample videos
  for (let i = 1; i <= 6; i++) {
    files.push({
      id: `vid-${i}`,
      name: `video-${i}.mp4`,
      type: "video",
      url: `/video-placeholder.mp4?id=${i}`,
      thumbnailUrl: `/image-placeholder.png?id=vid-${i}`,
      size: Math.floor(Math.random() * 50000000) + 10000000, // 10MB to 50MB
      uploadDate: new Date(baseDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
      selected: false,
    })
  }

  return files.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
}

const MediaLibrary = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(generateSampleFiles())
  const [selectedType, setSelectedType] = useState<MediaType>("all")
  const [tempSelectedFiles, setTempSelectedFiles] = useState<File[]>([])
  const [showUploadArea, setShowUploadArea] = useState(false)
  const { toast } = useToast()

  // Filter files based on selected criteria
  const filteredFiles = useMemo(() => {
    let filtered = mediaFiles

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(file => file.type === selectedType)
    }

    return filtered
  }, [mediaFiles, selectedType])

  const selectedCount = mediaFiles.filter(file => file.selected).length

  const handleFilesUploaded = (files: File[]) => {
    const newMediaFiles: MediaFile[] = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      url: URL.createObjectURL(file),
      thumbnailUrl: file.type.startsWith('video/') ? '/image-placeholder.png' : undefined,
      size: file.size,
      uploadDate: new Date(),
      selected: false,
    }))

    setMediaFiles(prev => [...newMediaFiles, ...prev])
    setShowUploadArea(false)

    toast({
      title: "Upload successful",
      description: `${files.length} file${files.length !== 1 ? 's' : ''} uploaded successfully.`,
    })
  }

  const handleFileSelect = (fileId: string) => {
    // View file logic would go here
    console.log("View file:", fileId)
  }

  const handleFileToggle = (fileId: string) => {
    setMediaFiles(prev =>
      prev.map(file =>
        file.id === fileId ? { ...file, selected: !file.selected } : file
      )
    )
  }

  const handleBulkAction = (action: string, fileIds: string[]) => {
    if (action === 'delete') {
      setMediaFiles(prev => prev.filter(file => !fileIds.includes(file.id)))
      toast({
        title: "Files deleted",
        description: `${fileIds.length} file${fileIds.length !== 1 ? 's' : ''} deleted successfully.`,
      })
    } else if (action === 'download') {
      toast({
        title: "Download started",
        description: `Downloading ${fileIds.length} file${fileIds.length !== 1 ? 's' : ''}...`,
      })
    }
  }

  const handleClearFilters = () => {
    setSelectedType("all")
  }

  const handleUploadFromDevice = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,video/*'
    input.multiple = true
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      if (files.length > 0) {
        handleFilesUploaded(files)
      }
    }
    input.click()
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col p-6">
      {/* Header */}
      <header className="bg-transparent">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Media Library</h1>
              <p className="text-muted-foreground">
                Manage your images, videos, and other media files for social media posts
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Upload Media
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleUploadFromDevice}>
                  <HardDrive className="w-4 h-4 mr-2" />
                  From Device
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { }}>
                  <img src="/integrated apps/google-drive-logo.png" alt="" className="w-4 h-4 mr-2 object-cover" />
                  Google Drive
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { }}>
                  <img src="/integrated apps/dropbox-logo.png" alt="" className="w-4 h-4 mr-2 object-cover" />
                  Dropbox
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Upload Area */}
      {showUploadArea && (
        <UploadArea
          onFilesSelected={handleFilesUploaded}
          tempSelectedFiles={tempSelectedFiles}
          setTempSelectedFiles={setTempSelectedFiles}
        />
      )}

      {/* Filter Bar */}
      <FilterBar
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        onClearFilters={handleClearFilters}
        counter={filteredFiles.length}
        total={mediaFiles.length}
      />

      {/* Media Grid */}
      <MediaGrid
        files={filteredFiles}
        onFileSelect={handleFileSelect}
        onFileToggle={handleFileToggle}
        selectedCount={selectedCount}
        onBulkAction={handleBulkAction}
      />
    </div>
  )
}

export default MediaLibrary