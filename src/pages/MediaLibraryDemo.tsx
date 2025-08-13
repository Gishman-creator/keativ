import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MediaLibrary, MediaItem } from '@/components/media';

const MediaLibraryDemo: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);

  const handleMediaSelect = (media: MediaItem[]) => {
    setSelectedMedia(media);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Media Library Integration</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive media management solution for your social media content. 
          Upload, edit, organize, and manage all your images and videos in one place.
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">📤 Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Drag & drop multiple files with preview and progress tracking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">✏️ Edit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Crop, resize, and transform images with social media presets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">🎬 Play</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Advanced video player with custom controls and formats
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">📁 Organize</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Search, filter, and organize media with multiple view modes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Selection Display */}
      {selectedMedia.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Selected Media</span>
              <Badge variant="secondary">{selectedMedia.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {selectedMedia.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium truncate" title={item.title}>
                      {item.title}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={() => setSelectedMedia([])}>
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Media Library */}
      <Card>
        <CardContent className="p-6">
          <MediaLibrary
            onMediaSelect={handleMediaSelect}
            allowMultiSelect={true}
            maxFiles={100}
            maxFileSize={100 * 1024 * 1024} // 100MB
            acceptedTypes={{
              'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
              'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv']
            }}
          />
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-muted bg-muted/20">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">📁 Gallery View</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Browse your media in grid, list, or gallery mode</li>
                <li>• Search and filter by type, name, or tags</li>
                <li>• Select multiple items for bulk actions</li>
                <li>• Preview, edit, download, or delete items</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">⬆️ Upload Media</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Drag and drop files or click to browse</li>
                <li>• Supports images, videos, and PDFs</li>
                <li>• Real-time upload progress tracking</li>
                <li>• Automatic file type detection and previews</li>
              </ul>
            </div>
          </div>
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">✨ Advanced Features</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <strong>Image Editing:</strong> Crop, rotate, flip, and resize images with preset aspect ratios for social media platforms.
              </div>
              <div>
                <strong>Video Player:</strong> Custom video player with playback controls, volume, speed adjustment, and fullscreen support.
              </div>
              <div>
                <strong>Performance:</strong> Virtualized rendering for large media libraries with smooth scrolling and animations.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaLibraryDemo;
