/**
 * Media API Service for SMMS Frontend
 * Handles media upload, management, and operations
 */

import { api } from './api';
import type { ApiResponse } from './api';

// Media-related types
export interface MediaFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnail?: string;
  duration?: number; // for videos
  dimensions?: {
    width: number;
    height: number;
  };
  created_at: string;
  user_id: string;
  tags?: string[];
}

export interface MediaUploadResponse {
  file: MediaFile;
  message: string;
}

export interface MediaLibraryResponse {
  files: MediaFile[];
  total_count: number;
  page: number;
  total_pages: number;
}

export interface MediaUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface MediaFilters {
  type?: 'image' | 'video' | 'audio';
  tag?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

// Media API endpoints
const MEDIA_ENDPOINTS = {
  UPLOAD: '/api/media/upload/',
  LIBRARY: '/api/media/library/',
  DETAIL: (id: string) => `/api/media/${id}/`,
  DELETE: (id: string) => `/api/media/${id}/delete/`,
  BULK_DELETE: '/api/media/bulk-delete/',
  UPDATE_TAGS: (id: string) => `/api/media/${id}/tags/`,
  CROP: (id: string) => `/api/media/${id}/crop/`,
  RESIZE: (id: string) => `/api/media/${id}/resize/`,
  STORAGE_INFO: '/api/media/storage/',
};

class MediaApiService {
  /**
   * Upload media file with progress tracking
   */
  async uploadFile(
    file: File,
    options: {
      tags?: string[];
      onProgress?: (progress: MediaUploadProgress) => void;
    } = {}
  ): Promise<ApiResponse<MediaUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.tags && options.tags.length > 0) {
      formData.append('tags', JSON.stringify(options.tags));
    }

    // Create XMLHttpRequest for progress tracking
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      
      // Progress tracking
      if (options.onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress: MediaUploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100)
            };
            options.onProgress!(progress);
          }
        };
      }
      
      // Handle response
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({
                success: true,
                data: response
              });
            } else {
              resolve({
                success: false,
                error: response.error || `Upload failed: ${xhr.status}`
              });
            }
          } catch {
            resolve({
              success: false,
              error: 'Failed to parse response'
            });
          }
        }
      };
      
      // Handle network errors
      xhr.onerror = () => {
        resolve({
          success: false,
          error: 'Network error during upload'
        });
      };
      
      // Send request
      const token = api.getToken();
      const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      
      xhr.open('POST', `${baseURL}${MEDIA_ENDPOINTS.UPLOAD}`);
      if (token) {
        xhr.setRequestHeader('Authorization', `Token ${token}`);
      }
      xhr.send(formData);
    });
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: File[],
    options: {
      tags?: string[];
      onProgress?: (fileIndex: number, progress: MediaUploadProgress) => void;
      onFileComplete?: (fileIndex: number, result: ApiResponse<MediaUploadResponse>) => void;
    } = {}
  ): Promise<ApiResponse<MediaUploadResponse[]>> {
    const results: MediaUploadResponse[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await this.uploadFile(file, {
          tags: options.tags,
          onProgress: (progress) => options.onProgress?.(i, progress)
        });

        if (result.success && result.data) {
          results.push(result.data);
        } else {
          errors.push(`${file.name}: ${result.error || 'Unknown error'}`);
        }

        options.onFileComplete?.(i, result);
      } catch (error) {
        const errorMessage = `${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMessage);
        
        options.onFileComplete?.(i, {
          success: false,
          error: errorMessage
        });
      }
    }

    if (results.length === 0) {
      return {
        success: false,
        error: `All uploads failed: ${errors.join(', ')}`
      };
    }

    return {
      success: true,
      data: results,
      ...(errors.length > 0 && { 
        error: `Some files failed: ${errors.join(', ')}` 
      })
    };
  }

  /**
   * Get media library with filters
   */
  async getMediaLibrary(filters: MediaFilters = {}): Promise<ApiResponse<MediaLibraryResponse>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const url = `${MEDIA_ENDPOINTS.LIBRARY}${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<MediaLibraryResponse>(url);
  }

  /**
   * Get media file details
   */
  async getMediaFile(id: string): Promise<ApiResponse<MediaFile>> {
    return api.get<MediaFile>(MEDIA_ENDPOINTS.DETAIL(id));
  }

  /**
   * Delete media file
   */
  async deleteMediaFile(id: string): Promise<ApiResponse<void>> {
    return api.delete(MEDIA_ENDPOINTS.DELETE(id));
  }

  /**
   * Bulk delete media files
   */
  async bulkDeleteFiles(ids: string[]): Promise<ApiResponse<{ deleted_count: number }>> {
    return api.post<{ deleted_count: number }>(MEDIA_ENDPOINTS.BULK_DELETE, { ids });
  }

  /**
   * Update media file tags
   */
  async updateTags(id: string, tags: string[]): Promise<ApiResponse<MediaFile>> {
    return api.put<MediaFile>(MEDIA_ENDPOINTS.UPDATE_TAGS(id), { tags });
  }

  /**
   * Crop image
   */
  async cropImage(
    id: string,
    cropData: {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  ): Promise<ApiResponse<MediaFile>> {
    return api.post<MediaFile>(MEDIA_ENDPOINTS.CROP(id), cropData);
  }

  /**
   * Resize image
   */
  async resizeImage(
    id: string,
    dimensions: {
      width?: number;
      height?: number;
      maintain_aspect_ratio?: boolean;
    }
  ): Promise<ApiResponse<MediaFile>> {
    return api.post<MediaFile>(MEDIA_ENDPOINTS.RESIZE(id), dimensions);
  }

  /**
   * Get storage information
   */
  async getStorageInfo(): Promise<ApiResponse<{
    used_storage: number;
    total_storage: number;
    file_count: number;
    storage_percentage: number;
  }>> {
    return api.get(MEDIA_ENDPOINTS.STORAGE_INFO);
  }

  /**
   * Convert file to MediaLibraryFile format for component compatibility
   */
  static convertToMediaLibraryFile(mediaFile: MediaFile): import('@/components/media-library/FilterBar').MediaLibraryFile {
    return {
      id: mediaFile.id,
      name: mediaFile.name,
      size: mediaFile.size,
      type: mediaFile.type as 'image' | 'video',
      url: mediaFile.url,
      thumbnail: mediaFile.thumbnail,
      lastModified: new Date(mediaFile.created_at).getTime(),
      tags: mediaFile.tags || [],
      dimensions: mediaFile.dimensions,
      duration: mediaFile.duration
    };
  }

  /**
   * Convert File to MediaLibraryFile format for component compatibility
   */
  static convertFileToMediaLibraryFile(file: File): import('@/components/media-library/FilterBar').MediaLibraryFile {
    const fileType = file.type.startsWith('image/') ? 'image' : 'video';
    const previewUrl = URL.createObjectURL(file);
    
    return {
      id: `temp-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: fileType,
      url: previewUrl,
      lastModified: file.lastModified,
      tags: [],
      file: file // Include original file for upload
    };
  }
}

export const mediaApi = new MediaApiService();
export { MediaApiService };
export default mediaApi;
