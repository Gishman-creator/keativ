/**
 * MediaLibrary Component - Main interface for media management
 * Integrated with Django backend API
 */

import React, { useState, useEffect } from 'react';
import { Grid3x3, List, Search, Filter, X, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/lib/utils';
import { mediaApi, type MediaFilters, MediaApiService } from '@/lib/mediaApi';

// Types for component state
export interface MediaLibraryFile {
  id: string;
  name: string;
  size: number;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  lastModified: number;
  tags?: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
  file?: File; // Original file object for uploads
}

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'images' | 'videos';

interface MediaLibraryProps {
  onSelect?: (files: MediaLibraryFile[]) => void;
  multiSelect?: boolean;
  maxFiles?: number;
  acceptedTypes?: string[];
  className?: string;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onSelect,
  multiSelect = false,
  maxFiles = 10,
  acceptedTypes = ['image/*', 'video/*'],
  className = ''
}) => {
  // Component state
  const [files, setFiles] = useState<MediaLibraryFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<MediaLibraryFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<MediaLibraryFile[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load media library from backend
  const loadMediaLibrary = async (page = 1, filters: Partial<MediaFilters> = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mediaFilters: MediaFilters = {
        page,
        page_size: 20,
        ...filters
      };

      const response = await mediaApi.getMediaLibrary(mediaFilters);
      
      if (response.success && response.data) {
        const mediaFiles = response.data.files.map(file => 
          MediaApiService.convertToMediaLibraryFile(file)
        ) as MediaLibraryFile[];
        
        if (page === 1) {
          setFiles(mediaFiles);
        } else {
          // Append for pagination
          setFiles(prev => [...prev, ...mediaFiles]);
        }
        
        setTotalPages(response.data.total_pages);
        setTotalCount(response.data.total_count);
        setCurrentPage(page);
      } else {
        setError(response.error || 'Failed to load media library');
        toast({
          title: 'Error',
          description: response.error || 'Failed to load media library',
          variant: 'destructive'
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: 'Failed to connect to media service',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadMediaLibrary();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...files];

    // Apply type filter
    if (activeFilter !== 'all') {
      const filterType = activeFilter === 'images' ? 'image' : 'video';
      filtered = filtered.filter(file => file.type === filterType);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchLower) ||
        (file.tags && file.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    setFilteredFiles(filtered);
  }, [files, activeFilter, searchTerm]);

  // Handle file uploads
  const handleUpload = async (uploadedFiles: File[]) => {
    setIsUploading(true);
    setUploadProgress({});

    try {
      const response = await mediaApi.uploadMultipleFiles(uploadedFiles, {
        onProgress: (fileIndex, progress) => {
          const fileName = uploadedFiles[fileIndex]?.name;
          if (fileName) {
            setUploadProgress(prev => ({
              ...prev,
              [fileName]: progress.percentage
            }));
          }
        },
        onFileComplete: (fileIndex, result) => {
          const fileName = uploadedFiles[fileIndex]?.name;
          if (fileName) {
            if (result.success) {
              toast({
                title: 'Success',
                description: `${fileName} uploaded successfully`,
              });
            } else {
              toast({
                title: 'Upload Failed',
                description: result.error || `Failed to upload ${fileName}`,
                variant: 'destructive'
              });
            }
          }
        }
      });

      if (response.success && response.data) {
        // Add successfully uploaded files to the library
        const newFiles = response.data.map(item => 
          MediaApiService.convertToMediaLibraryFile(item.file)
        );
        
        setFiles(prev => [...newFiles, ...prev]);
        
        toast({
          title: 'Upload Complete',
          description: `Successfully uploaded ${response.data.length} file(s)`,
        });
      } else if (response.error) {
        toast({
          title: 'Upload Error',
          description: response.error,
          variant: 'destructive'
        });
      }
    } catch (err) {
      toast({
        title: 'Upload Error',
        description: err instanceof Error ? err.message : 'Failed to upload files',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  // Handle file selection
  const handleFileSelect = (file: MediaLibraryFile) => {
    if (!multiSelect) {
      setSelectedFiles([file]);
      onSelect?.([file]);
      return;
    }

    const isSelected = selectedFiles.some(f => f.id === file.id);
    let newSelection: MediaLibraryFile[];

    if (isSelected) {
      newSelection = selectedFiles.filter(f => f.id !== file.id);
    } else {
      if (selectedFiles.length >= maxFiles) {
        toast({
          title: 'Selection Limit',
          description: `You can only select up to ${maxFiles} files`,
          variant: 'destructive'
        });
        return;
      }
      newSelection = [...selectedFiles, file];
    }

    setSelectedFiles(newSelection);
    onSelect?.(newSelection);
  };

  // Handle file deletion
  const handleFileDelete = async (fileId: string) => {
    try {
      const response = await mediaApi.deleteMediaFile(fileId);
      
      if (response.success) {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
        
        toast({
          title: 'Success',
          description: 'File deleted successfully',
        });
      } else {
        toast({
          title: 'Delete Failed',
          description: response.error || 'Failed to delete file',
          variant: 'destructive'
        });
      }
    } catch (err) {
      toast({
        title: 'Delete Error',
        description: err instanceof Error ? err.message : 'Failed to delete file',
        variant: 'destructive'
      });
    }
  };

  // Load more files (pagination)
  const loadMore = () => {
    if (currentPage < totalPages) {
      loadMediaLibrary(currentPage + 1);
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedFiles([]);
    onSelect?.([]);
  };

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Media Library</h2>
            {totalCount > 0 && (
              <span className="text-sm text-gray-500">({totalCount} files)</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex border rounded">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Filters Toggle */}
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex gap-2">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
              >
                All Files
              </Button>
              <Button
                variant={activeFilter === 'images' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('images')}
              >
                Images
              </Button>
              <Button
                variant={activeFilter === 'videos' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('videos')}
              >
                Videos
              </Button>
            </div>
          </div>
        )}

        {/* Selection Info */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="text-blue-700 hover:text-blue-800"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div className="p-4 border-b">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) {
                handleUpload(files);
              }
            }}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer ${isUploading ? 'opacity-50' : ''}`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="text-gray-400">
                📁
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isUploading ? 'Uploading...' : 'Click to upload files'}
                </p>
                <p className="text-xs text-gray-500">
                  Drag & drop or browse your files
                </p>
              </div>
            </div>
          </label>
          
          {/* Progress indicators */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-4 space-y-2">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span>{fileName}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div className="p-4">
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => loadMediaLibrary()}>
              Try Again
            </Button>
          </div>
        )}

        {!error && (
          <div>
            {loading && filteredFiles.length === 0 && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Loading media library...</p>
              </div>
            )}
            
            {filteredFiles.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                <p>No files found</p>
                {searchTerm && (
                  <p className="text-sm mt-2">Try adjusting your search or filters</p>
                )}
              </div>
            )}

            {filteredFiles.length > 0 && (
              <div>
                <div className={`
                  ${viewMode === 'grid' 
                    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4' 
                    : 'space-y-2'
                  }
                `}>
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`
                        relative border rounded-lg overflow-hidden cursor-pointer transition-all
                        ${selectedFiles.some(f => f.id === file.id)
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:shadow-md'
                        }
                        ${viewMode === 'list' ? 'flex items-center p-2' : 'aspect-square'}
                      `}
                      onClick={() => handleFileSelect(file)}
                    >
                      {/* File Preview */}
                      <div className={viewMode === 'list' ? 'w-16 h-16 flex-shrink-0' : 'w-full h-full'}>
                        {file.type === 'image' ? (
                          <img
                            src={file.thumbnail || file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <span className="text-2xl">🎥</span>
                          </div>
                        )}
                      </div>
                      
                      {/* File Info */}
                      <div className={`
                        ${viewMode === 'list' 
                          ? 'ml-3 flex-1 min-w-0' 
                          : 'absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2'
                        }
                      `}>
                        <p className={`
                          ${viewMode === 'list' ? 'text-sm font-medium' : 'text-xs'}
                          truncate
                        `}>
                          {file.name}
                        </p>
                        {viewMode === 'list' && (
                          <p className="text-xs text-gray-500 mt-1">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                            {file.dimensions && ` • ${file.dimensions.width}×${file.dimensions.height}`}
                            {file.duration && ` • ${Math.round(file.duration)}s`}
                          </p>
                        )}
                      </div>

                      {/* Selection Indicator */}
                      {selectedFiles.some(f => f.id === file.id) && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}

                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileDelete(file.id);
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {currentPage < totalPages && (
                  <div className="text-center mt-6">
                    <Button
                      onClick={loadMore}
                      disabled={loading}
                      className="min-w-32"
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;
