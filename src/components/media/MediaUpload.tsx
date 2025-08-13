import React, { useCallback, useState } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, Video, File, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface MediaFile extends FileWithPath {
  id: string;
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

interface MediaUploadProps {
  onFilesSelect: (files: MediaFile[]) => void;
  onFilesRemove: (fileIds: string[]) => void;
  acceptedFileTypes?: {
    'image/*': string[];
    'video/*': string[];
    'application/pdf'?: string[];
  };
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  multiple?: boolean;
  className?: string;
}

const defaultAcceptedTypes = {
  'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
  'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
  'application/pdf': ['.pdf']
};

export const MediaUpload: React.FC<MediaUploadProps> = ({
  onFilesSelect,
  onFilesRemove,
  acceptedFileTypes = defaultAcceptedTypes,
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  maxFiles = 10,
  multiple = true,
  className
}) => {
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const generateFileId = () => Math.random().toString(36).substr(2, 9);

  const getFileIcon = (file: MediaFile) => {
    if (file.type.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (file.type.startsWith('video/')) return <Video className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  const getFilePreview = (file: MediaFile) => {
    if (file.type.startsWith('image/') && file.preview) {
      return (
        <img
          src={file.preview}
          alt={file.name}
          className="w-full h-24 object-cover rounded"
        />
      );
    }
    if (file.type.startsWith('video/') && file.preview) {
      return (
        <video
          src={file.preview}
          className="w-full h-24 object-cover rounded"
          muted
        />
      );
    }
    return (
      <div className="w-full h-24 bg-muted rounded flex items-center justify-center">
        {getFileIcon(file)}
      </div>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const newFiles: MediaFile[] = acceptedFiles.map(file => {
      const fileWithId: MediaFile = Object.assign(file, {
        id: generateFileId(),
        uploadStatus: 'pending' as const
      });

      // Create preview for images and videos
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        fileWithId.preview = URL.createObjectURL(file);
      }

      return fileWithId;
    });

    const updatedFiles = multiple ? [...selectedFiles, ...newFiles] : newFiles;
    setSelectedFiles(updatedFiles);
    onFilesSelect(updatedFiles);
  }, [selectedFiles, multiple, onFilesSelect]);

  const removeFile = useCallback((fileId: string) => {
    const fileToRemove = selectedFiles.find(f => f.id === fileId);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = selectedFiles.filter(f => f.id !== fileId);
    setSelectedFiles(updatedFiles);
    onFilesRemove([fileId]);
  }, [selectedFiles, onFilesRemove]);

  const clearAllFiles = useCallback(() => {
    selectedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setSelectedFiles([]);
    onFilesRemove(selectedFiles.map(f => f.id));
  }, [selectedFiles, onFilesRemove]);

  const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: maxFileSize,
    maxFiles,
    multiple,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  });

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
          dropzoneActive || isDragActive
            ? "border-primary bg-primary/5 scale-105"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-full"
        >
          <input {...getInputProps()} />
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: dropzoneActive ? 1.1 : 1 }}
            className="space-y-4"
          >
          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <p className="text-lg font-semibold">
              {dropzoneActive ? "Drop files here" : "Upload Media Files"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports images, videos, and PDFs up to {formatFileSize(maxFileSize)}
            </p>
          </div>
        </motion.div>
        </motion.div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Selected Files ({selectedFiles.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFiles}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 space-y-3"
                >
                  {/* File Preview */}
                  <div className="relative">
                    {getFilePreview(file)}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* File Info */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <div className="ml-2">
                        {file.uploadStatus === 'success' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {file.uploadStatus === 'error' && (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </div>

                    {/* Upload Progress */}
                    {file.uploadStatus === 'uploading' && (
                      <div className="space-y-1">
                        <Progress value={file.uploadProgress || 0} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Uploading... {file.uploadProgress || 0}%
                        </p>
                      </div>
                    )}

                    {/* Error Message */}
                    {file.uploadStatus === 'error' && file.errorMessage && (
                      <p className="text-xs text-destructive">{file.errorMessage}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaUpload;
