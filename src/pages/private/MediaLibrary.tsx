import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MediaLibrary as MediaLibraryComponent, MediaItem } from '@/components/media';

const MediaLibrary: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);

  const handleMediaSelect = (media: MediaItem[]) => {
    setSelectedMedia(media);
  };

  const handleUseInPost = () => {
    if (selectedMedia.length === 0) return;
    
    // Here you would integrate with your post creation flow
    console.log('Using media in post:', selectedMedia);
    
    // Example: Navigate to create post with selected media
    // navigate('/dashboard/calendar/new', { state: { selectedMedia } });
  };

  const handleDownloadSelected = () => {
    selectedMedia.forEach(item => {
      const link = document.createElement('a');
      link.href = item.original;
      link.download = item.title || 'media-file';
      link.click();
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your images, videos, and other media files for social media posts
          </p>
        </div>
        
        {/* Action buttons for selected media */}
        {selectedMedia.length > 0 && (
          <div className="flex gap-2">
            <Button onClick={handleUseInPost} className="flex items-center gap-2">
              Use in Post
              <Badge variant="secondary" className="ml-1">
                {selectedMedia.length}
              </Badge>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDownloadSelected}
              className="flex items-center gap-2"
            >
              Download Selected
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedMedia([])}
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {selectedMedia.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              Selected Media
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
          </CardContent>
        </Card>
      )}

      {/* Main Media Library Component */}
      <Card>
        <CardContent className="p-0">
          <MediaLibraryComponent
            onMediaSelect={handleMediaSelect}
            allowMultiSelect={true}
            maxFiles={100}
            maxFileSize={100 * 1024 * 1024} // 100MB
            acceptedTypes={{
              'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
              'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'],
              'application/pdf': ['.pdf']
            }}
            className="p-6"
          />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 GB</div>
            <p className="text-xs text-muted-foreground">of 10 GB limit</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '24%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">in the last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Most Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Images</div>
            <p className="text-xs text-muted-foreground">65% of your library</p>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="border-muted bg-muted/20">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">💡 Pro Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Use descriptive names for easier searching</li>
              <li>• Optimize images before uploading to save space</li>
              <li>• Tag your media for better organization</li>
            </ul>
            <ul className="space-y-2">
              <li>• Crop images to social media aspect ratios</li>
              <li>• Keep videos under 50MB for better performance</li>
              <li>• Use the gallery view for quick previews</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaLibrary;
