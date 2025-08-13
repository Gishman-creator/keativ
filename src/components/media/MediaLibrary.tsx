import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Edit, Play, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

import MediaUpload from './MediaUpload';
import MediaGallery, { MediaItem } from './MediaGallery';
import ImageEditor from './ImageEditor';
import VideoPlayer from './VideoPlayer';

interface MediaLibraryFile {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

interface MediaLibraryProps {
  onMediaSelect?: (media: MediaItem[]) => void;
  allowMultiSelect?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: {
    'image/*': string[];
    'video/*': string[];
    'application/pdf'?: string[];
  };
  className?: string;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onMediaSelect,
  allowMultiSelect = true,
  maxFiles = 50,
  maxFileSize = 50 * 1024 * 1024, // 50MB
  acceptedTypes,
  className
}) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [currentTab, setCurrentTab] = useState<'upload' | 'gallery'>('gallery');
  const [selectedForEdit, setSelectedForEdit] = useState<MediaItem | null>(null);
  const [selectedForView, setSelectedForView] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Convert uploaded files to MediaItems
  const convertFilesToMediaItems = useCallback((files: MediaLibraryFile[]): MediaItem[] => {
    return files.map(file => {
      // Create URL for preview if we don't have one
      const previewUrl = file.preview || `data:${file.type};base64,placeholder`;
      
      return {
        id: file.id,
        original: previewUrl,
        thumbnail: previewUrl,
        title: file.name.split('.')[0],
        description: `${file.type} - ${formatFileSize(file.size)}`,
        size: file.size,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        uploadDate: new Date(),
        tags: [file.type.split('/')[1].toUpperCase()],
        duration: file.type.startsWith('video/') ? Math.random() * 300 : undefined // Mock duration for demo
      };
    });
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file uploads
  const handleFilesSelect = useCallback(async (files: MediaLibraryFile[]) => {
    setIsUploading(true);
    
    try {
      // Simulate upload process with progress
      const uploadedFiles = await Promise.all(
        files.map(async (file, index) => {
          // Simulate upload delay
          await new Promise(resolve => setTimeout(resolve, 1000 + index * 500));
          
          return {
            ...file,
            uploadStatus: 'success' as const,
            uploadProgress: 100
          };
        })
      );

      const newMediaItems = convertFilesToMediaItems(uploadedFiles);
      setMediaItems(prev => [...newMediaItems, ...prev]);
      
      toast({
        title: "Upload completed",
        description: `Successfully uploaded ${files.length} files`,
      });

      // Switch to gallery view to show uploaded files
      setCurrentTab('gallery');
    } catch {
      toast({
        title: "Upload failed",
        description: "Some files failed to upload. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [convertFilesToMediaItems]);

  const handleFilesRemove = useCallback((fileIds: string[]) => {
    // Handle file removal during upload phase
    console.log('Removing files:', fileIds);
  }, []);

  // Handle media gallery actions
  const handleMediaSelect = useCallback((item: MediaItem) => {
    setSelectedForView(item);
  }, []);

  const handleMediaEdit = useCallback((item: MediaItem) => {
    if (item.type === 'image') {
      setSelectedForEdit(item);
    } else {
      toast({
        title: "Edit not supported",
        description: "Video editing is not yet supported",
        variant: "destructive"
      });
    }
  }, []);

  const handleMediaDelete = useCallback((itemId: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Media deleted",
      description: "The media item has been removed from your library",
    });
  }, []);

  const handleMediaDownload = useCallback((item: MediaItem) => {
    const link = document.createElement('a');
    link.href = item.original;
    link.download = item.title || 'media-file';
    link.click();
  }, []);

  const handleMultipleMediaSelect = useCallback((items: MediaItem[]) => {
    onMediaSelect?.(items);
  }, [onMediaSelect]);

  // Handle image editing
  const handleImageSave = useCallback((editedImageUrl: string) => {
    if (!selectedForEdit) return;

    const updatedItem: MediaItem = {
      ...selectedForEdit,
      original: editedImageUrl,
      thumbnail: editedImageUrl,
      title: `${selectedForEdit.title} (edited)`,
      uploadDate: new Date()
    };

    setMediaItems(prev => prev.map(item => 
      item.id === selectedForEdit.id ? updatedItem : item
    ));

    setSelectedForEdit(null);
    toast({
      title: "Image saved",
      description: "Your edited image has been saved to the library",
    });
  }, [selectedForEdit]);

  const getMediaStats = useCallback(() => {
    const images = mediaItems.filter(item => item.type === 'image').length;
    const videos = mediaItems.filter(item => item.type === 'video').length;
    const totalSize = mediaItems.reduce((acc, item) => acc + (item.size || 0), 0);
    
    return { images, videos, total: mediaItems.length, totalSize };
  }, [mediaItems]);

  const stats = getMediaStats();

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your images, videos, and other media files
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Files</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.images}</div>
              <div className="text-sm text-muted-foreground">Images</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.videos}</div>
              <div className="text-sm text-muted-foreground">Videos</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as 'upload' | 'gallery')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery">
            Media Gallery ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-6">
          <MediaGallery
            items={mediaItems}
            onItemSelect={handleMediaSelect}
            onItemEdit={handleMediaEdit}
            onItemDelete={handleMediaDelete}
            onItemDownload={handleMediaDownload}
            onMultipleSelect={handleMultipleMediaSelect}
            allowMultiSelect={allowMultiSelect}
            showSearch={true}
            showFilters={true}
          />
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Media</CardTitle>
            </CardHeader>
            <CardContent>
              <MediaUpload
                onFilesSelect={handleFilesSelect}
                onFilesRemove={handleFilesRemove}
                acceptedFileTypes={acceptedTypes}
                maxFileSize={maxFileSize}
                maxFiles={maxFiles}
                multiple={true}
              />
              
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="font-medium">Uploading your files...</span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Editor Dialog */}
      <Dialog open={!!selectedForEdit} onOpenChange={() => setSelectedForEdit(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Image
            </DialogTitle>
          </DialogHeader>
          {selectedForEdit && (
            <ImageEditor
              imageUrl={selectedForEdit.original}
              imageName={selectedForEdit.title}
              onSave={handleImageSave}
              onCancel={() => setSelectedForEdit(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Media Viewer Dialog */}
      <Dialog open={!!selectedForView} onOpenChange={() => setSelectedForView(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                {selectedForView?.title}
              </span>
              <div className="flex gap-2">
                {selectedForView?.type === 'image' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedForEdit(selectedForView);
                      setSelectedForView(null);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => selectedForView && handleMediaDownload(selectedForView)}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (selectedForView) {
                      handleMediaDelete(selectedForView.id);
                      setSelectedForView(null);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedForView && (
            <div className="space-y-4">
              {selectedForView.type === 'image' ? (
                <img
                  src={selectedForView.original}
                  alt={selectedForView.title}
                  className="w-full max-h-[60vh] object-contain rounded-lg"
                />
              ) : (
                <VideoPlayer
                  url={selectedForView.original}
                  title={selectedForView.title}
                  poster={selectedForView.thumbnail}
                  controls={true}
                />
              )}
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">{selectedForView.title}</h3>
                <p className="text-muted-foreground mb-4">{selectedForView.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedForView.tags?.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaLibrary;
