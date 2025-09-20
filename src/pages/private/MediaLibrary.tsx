import { useState, useMemo, useEffect } from "react"
import { FilterBar, type MediaType } from "@/components/media-library/FilterBar"
import { MediaGrid, type MediaFile } from "@/components/media-library/MediaGridProps"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Upload as UploadIcon, ChevronDown, HardDrive, LoaderCircle } from "lucide-react" // Import LoaderCircle
import { api } from "@/lib/api" // Import the api object
import { showCustomToast, showSmallToast } from "@/components/CustomToast"
import NetworkError from "../public/NetworkError"
import useGoogleDrivePicker from "@/components/media-library/GoogleDrivePicker"
import toast from 'react-hot-toast'

// Define the expected API response structure
interface UploadResultFile {
  id: string;
  name: string;
  media_type: MediaType;
  url: string;
  thumbnail: string | null;
  size: number;
  created_at: string;
}

interface UploadResult {
  file: UploadResultFile;
  filename: string;
  index: number;
  success: boolean;
}

interface UploadSummary {
  total_files: number;
  successful_uploads: number;
  failed_uploads: number;
}

interface StorageInfo {
  used_storage: number;
  total_storage: number;
  file_count: number;
  storage_percentage: number;
}

interface MediaLibraryApiResponse {
  data?: {
    files?: Array<{ // Keep existing files for initial fetch
      id: string;
      name: string;
      media_type: MediaType; // Use MediaType from FilterBar
      url: string;
      thumbnail: string | null;
      size: number;
      created_at: string;
    }>;
    results?: UploadResult[]; // Add results for upload response
    summary?: UploadSummary;
    storage_info?: StorageInfo;
  };
  success: boolean;
  error?: any; // Assuming error can be of any type
}

// Placeholder for skeleton component
const MediaCardSkeleton = () => (
  <div className="animate-pulse rounded-lg bg-gray-200 h-44 w-full"></div>
)

const MediaLibrary = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[] | undefined>(undefined) // Initialize with undefined
  const [selectedType, setSelectedType] = useState<MediaType>("all")
  const [isLoading, setIsLoading] = useState(true) // Add loading state
  const [isUploading, setIsUploading] = useState(false) // State for upload loading
  const [hasNetworkError, setHasNetworkError] = useState(false) // State for network error

  // Add Google Drive picker hook
  const { openGoogleDrivePicker } = useGoogleDrivePicker(
    (files) => {
      // This callback will be called when files are selected from Google Drive
      console.log('Files selected from Google Drive:', files);
      handleSubmit(files); // Use your existing handleSubmit function
    },
    setIsUploading // Pass setIsUploading to manage loading state
  );

    // Effect to handle loading toast based on isUploading state
  useEffect(() => {
    if (isUploading) {
      showSmallToast("Uploading files...", 'loading', 300000000) // Duration 0 means it won't auto-dismiss
    } else {
      // Dismiss any existing toasts when upload is complete
      toast.dismiss()
    }
  }, [isUploading])

  // Filter files based on selected criteria
  const filteredFiles = useMemo(() => {
    if (!mediaFiles) return [] // Return empty array if mediaFiles is undefined
    let filtered = mediaFiles

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(file => file.type === selectedType)
    }

    return filtered
  }, [mediaFiles, selectedType])

  // Safely calculate selectedCount
  const selectedCount = useMemo(() => {
    if (!mediaFiles) return 0
    return mediaFiles.filter(file => file.selected).length
  }, [mediaFiles])

  // Fetch media library data on component mount
  useEffect(() => {
    const fetchMediaLibrary = async () => {
      setIsLoading(true) // Set loading to true before fetching
      try {
        // Explicitly type the response
        const response = await api.getMediaLibrary() as MediaLibraryApiResponse
        console.log("Media Library API Response:", response)
        if (response.success && response.data && response.data.files) {
          // Map the API response to the MediaFile type
          const fetchedFiles: MediaFile[] = response.data.files.map((file: any) => ({
            id: file.id,
            name: file.name,
            type: file.media_type, // Use media_type from response
            url: file.url,
            thumbnailUrl: file.thumbnail || undefined, // Use thumbnail if available
            size: file.size,
            uploadDate: new Date(file.created_at), // Use created_at for upload date
            selected: false,
          }))
          setMediaFiles(fetchedFiles)
        } else {
          // Handle upload failure
          const error = response.error || 'Upload failed';
          console.error('Upload failed:', error);
          if (error === 'Network error') {
            setHasNetworkError(true)
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
              showCustomToast('Failed to get your files', errorMessages || 'Failed to get your files. Please try again.', 'error');
            } else {
              // Generic upload failed message if error is not an object
              showCustomToast('Failed to get your files', 'Failed to get your files. Please try again.', 'error');
            }
          }
        }
      } catch (error) {
        console.error("Error fetching media library:", error)
        showCustomToast('Error', 'An error occurred while fetching media library. Displaying sample data.', 'error')
        // In a real scenario, you might want to set some default sample files here
      } finally {
        setIsLoading(false) // Set loading to false after fetching (success or error)
      }
    }
    fetchMediaLibrary()
  }, [])

  const handleFileToggle = (fileId: string) => {
    setMediaFiles(prev => {
      if (!prev) return undefined // Return undefined if mediaFiles is not yet initialized
      return prev.map(file =>
        file.id === fileId ? { ...file, selected: !file.selected } : file
      )
    })
  }

  const handleClearFilters = () => {
    setSelectedType("all")
  }

  // Function to handle file upload from device using the provided fetch logic
  async function handleSubmit(files: File[]) {
    !isUploading && setIsUploading(true) // Set uploading state to true

    // Create a new FormData object to hold the files.
    // FormData is used to send files and other data in a multipart/form-data format.
    const formData = new FormData();

    // Iterate over the FileList and append each file to the FormData object.
    // The key 'files' is used here, assuming the backend's BulkMediaUploadView
    // is configured to accept multiple files under this key.
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      // Send a POST request to the '/upload/bulk' endpoint.
      // The 'body' is the FormData object containing the files.
      const response = await api.uploadbulk(files) as MediaLibraryApiResponse; // Add type assertion here

      // Check if the request was successful (status code 2xx).
      if (response.success && response.data && response.data.results && response.data.results.length > 0) {
        console.log('Files uploaded successfully:', response.data);

        // Map the newly uploaded files to MediaFile type and append to existing mediaFiles
        const newFiles: MediaFile[] = response.data.results.map((result: any) => ({
          id: result.file.id,
          name: result.file.name,
          type: result.file.media_type,
          url: result.file.url,
          thumbnailUrl: result.file.thumbnail || undefined,
          size: result.file.size,
          uploadDate: new Date(result.file.created_at),
          selected: false, // New files are not selected by default
        }));

        setMediaFiles(prevMediaFiles => {
          // If prevMediaFiles is undefined, initialize with newFiles, otherwise append
          if (!prevMediaFiles) {
            return newFiles;
          }
          return [...newFiles, ...prevMediaFiles];
        });

        showSmallToast('File(s) uploaded successfully!');

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
            showCustomToast('Upload Failed', errorMessages || 'Upload failed. Please check the file types and try again.', 'error');
          } else {
            // Generic upload failed message if error is not an object
            showCustomToast('Upload Failed', 'Upload failed. Please check the file types and try again.', 'error');
          }
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      showCustomToast('Error', 'An unexpected error occurred during upload.', 'error');
    } finally {
      setIsUploading(false) // Set uploading state to false
    }
  };

  const handleUploadFromDevice = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,video/*' // Accept image and video files
    input.multiple = true
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      if (files.length > 0) {
        // Call the new handleSubmit function
        handleSubmit(files)
      }
    }
    input.click()
  }

  // Update the Google Drive dropdown item click handler
  const handleUploadFromGoogleDrive = () => {
    openGoogleDrivePicker();
  };

  // Define handleBulkAction
  const handleBulkAction = (action: string, fileIds: string[]) => {
    if (fileIds.length === 0) {
      showCustomToast('No Files Selected', 'Please select files to perform an action.', 'warning');
      return;
    }

    // Check if the action is one of the supported actions
    const supportedActions = ['delete'];
    if (!supportedActions.includes(action)) {
      console.error(`Unsupported bulk action: ${action}`);
      showCustomToast('Error', `Unsupported action: ${action}`, 'error');
      return;
    }

    // If the action is 'delete', remove the files from the state
    if (action === 'delete') {
      setMediaFiles(prevFiles => {
        if (!prevFiles) return undefined;
        // Filter out the files whose IDs are in the fileIds array
        return prevFiles.filter(file => !fileIds.includes(file.id));
      });
    }
  };

  // Determine what to render: skeletons or actual files
  const renderMediaGridContent = () => {
    if (isLoading) {
      // Render skeleton loaders
      return <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
        {Array.from({ length: 12 }).map((_, index) => ( // Render 12 skeletons as a placeholder
          <MediaCardSkeleton key={index} />
        ))}
      </div>
    } else if (hasNetworkError) {
      return <NetworkError noIcon={true} />;
    } else if (!mediaFiles || mediaFiles.length === 0 || filteredFiles.length === 0) {
      // Render a message if no files are found after filtering or if mediaFiles is not yet loaded
      return <div className="text-center text-muted-foreground py-8 mt-6">No media files found.</div>
    } else {
      // Render actual media files
      return (
        <MediaGrid
          files={filteredFiles}
          onFileToggle={handleFileToggle}
          selectedCount={selectedCount}
          onBulkAction={(action, fileIds) => handleBulkAction(action, fileIds)} // Pass fileIds to handleBulkAction
        />
      )
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col p-6">
      {/* Header */}
      <div>
        <div className="container mx-auto min-w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Media Library</h1>
              <p className="text-muted-foreground">
                Manage your images, videos, and other media files for social media posts
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="mt-4 md:mt-0 w-fit" disabled={isUploading}>
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Upload Media
                  {isUploading ? ( // Conditionally render LoaderCircle or ChevronDown
                    <LoaderCircle className="w-4 h-4 ml-2 animate-spin" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleUploadFromDevice}>
                  <HardDrive className="w-4 h-4 mr-2" />
                  From Device
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleUploadFromGoogleDrive}>
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
      </div>

      {/* Filter Bar */}
      <FilterBar
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        onClearFilters={handleClearFilters}
      />

      {/* Media Grid */}
      {renderMediaGridContent()}
    </div>
  )
}

export default MediaLibrary
