import React, { useState, useCallback } from 'react';
import ImageGallery from 'react-image-gallery';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid, 
  List, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit, 
  Eye,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import 'react-image-gallery/styles/css/image-gallery.css';

export interface MediaItem {
  id: string;
  original: string;
  thumbnail: string;
  originalAlt?: string;
  thumbnailAlt?: string;
  title?: string;
  description?: string;
  size?: number;
  type: 'image' | 'video';
  uploadDate?: Date;
  tags?: string[];
  duration?: number; // for videos
}

interface MediaGalleryProps {
  items: MediaItem[];
  onItemSelect?: (item: MediaItem) => void;
  onItemDelete?: (itemId: string) => void;
  onItemEdit?: (item: MediaItem) => void;
  onItemDownload?: (item: MediaItem) => void;
  onMultipleSelect?: (items: MediaItem[]) => void;
  allowMultiSelect?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  className?: string;
}

type ViewMode = 'gallery' | 'grid' | 'list';
type FilterType = 'all' | 'image' | 'video';
type SortBy = 'date' | 'name' | 'size' | 'type';

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  items = [],
  onItemSelect,
  onItemDelete,
  onItemEdit,
  onItemDownload,
  onMultipleSelect,
  allowMultiSelect = false,
  showSearch = true,
  showFilters = true,
  className
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);

  // Filter and search logic
  const filteredItems = items.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Sort logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.title || '').localeCompare(b.title || '');
      case 'size':
        return (b.size || 0) - (a.size || 0);
      case 'type':
        return a.type.localeCompare(b.type);
      case 'date':
      default:
        return (b.uploadDate?.getTime() || 0) - (a.uploadDate?.getTime() || 0);
    }
  });

  // Convert items to react-image-gallery format
  const galleryImages = sortedItems.map(item => ({
    original: item.original,
    thumbnail: item.thumbnail,
    originalAlt: item.originalAlt,
    thumbnailAlt: item.thumbnailAlt,
    description: item.title,
    originalClass: item.type === 'video' ? 'video-item' : 'image-item',
    renderItem: item.type === 'video' ? () => (
      <div className="image-gallery-video-wrapper">
        <video
          controls
          className="image-gallery-video"
          poster={item.thumbnail}
        >
          <source src={item.original} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    ) : undefined
  }));

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleItemSelect = useCallback((item: MediaItem) => {
    if (allowMultiSelect) {
      const newSelected = selectedItems.includes(item.id)
        ? selectedItems.filter(id => id !== item.id)
        : [...selectedItems, item.id];
      
      setSelectedItems(newSelected);
      onMultipleSelect?.(items.filter(i => newSelected.includes(i.id)));
    } else {
      onItemSelect?.(item);
    }
  }, [allowMultiSelect, selectedItems, items, onItemSelect, onMultipleSelect]);

  const clearSelection = () => {
    setSelectedItems([]);
    onMultipleSelect?.([]);
  };

  // Gallery View
  const renderGalleryView = () => (
    <div className="w-full">
      <ImageGallery
        items={galleryImages}
        showThumbnails={showThumbnails}
        showPlayButton={false}
        showNav={true}
        showBullets={false}
        showFullscreenButton={true}
        showIndex={true}
        autoPlay={isAutoPlay}
        slideDuration={500}
        slideInterval={3000}
        onSlide={(currentIndex: number) => {
          const currentItem = sortedItems[currentIndex];
          if (currentItem) {
            onItemSelect?.(currentItem);
          }
        }}
        additionalClass="custom-image-gallery"
      />
      
      {/* Gallery Controls */}
      <div className="mt-4 flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAutoPlay(!isAutoPlay)}
        >
          {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowThumbnails(!showThumbnails)}
        >
          {showThumbnails ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );

  // Grid View
  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {sortedItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className={cn(
            "cursor-pointer transition-all hover:shadow-lg",
            selectedItems.includes(item.id) && "ring-2 ring-primary"
          )}>
            <CardContent className="p-2">
              <div 
                className="relative aspect-square rounded overflow-hidden mb-2"
                onClick={() => handleItemSelect(item)}
              >
                <img
                  src={item.thumbnail}
                  alt={item.thumbnailAlt || item.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Media Type Indicator */}
                <Badge 
                  variant="secondary" 
                  className="absolute top-2 left-2 text-xs"
                >
                  {item.type}
                </Badge>

                {/* Video Duration */}
                {item.type === 'video' && item.duration && (
                  <Badge 
                    variant="secondary" 
                    className="absolute bottom-2 right-2 text-xs"
                  >
                    {formatDuration(item.duration)}
                  </Badge>
                )}

                {/* Selection Checkbox */}
                {allowMultiSelect && (
                  <div className="absolute top-2 right-2">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemSelect(item);
                      }}
                    />
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex gap-1">
                    <Button size="sm" variant="secondary" onClick={(e) => {
                      e.stopPropagation();
                      onItemSelect?.(item);
                    }}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    {onItemEdit && (
                      <Button size="sm" variant="secondary" onClick={(e) => {
                        e.stopPropagation();
                        onItemEdit(item);
                      }}>
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                    {onItemDownload && (
                      <Button size="sm" variant="secondary" onClick={(e) => {
                        e.stopPropagation();
                        onItemDownload(item);
                      }}>
                        <Download className="h-3 w-3" />
                      </Button>
                    )}
                    {onItemDelete && (
                      <Button size="sm" variant="destructive" onClick={(e) => {
                        e.stopPropagation();
                        onItemDelete(item.id);
                      }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium truncate" title={item.title}>
                  {item.title || 'Untitled'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(item.size)}
                </p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs px-1">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-1">
                        +{item.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  // List View
  const renderListView = () => (
    <div className="space-y-2">
      {sortedItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.02 }}
        >
          <Card className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            selectedItems.includes(item.id) && "ring-2 ring-primary"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4" onClick={() => handleItemSelect(item)}>
                {allowMultiSelect && (
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemSelect(item);
                    }}
                  />
                )}
                
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.thumbnailAlt || item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{item.title || 'Untitled'}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {item.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatFileSize(item.size)}
                    </span>
                    {item.type === 'video' && item.duration && (
                      <span className="text-sm text-muted-foreground">
                        {formatDuration(item.duration)}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" onClick={(e) => {
                    e.stopPropagation();
                    onItemSelect?.(item);
                  }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {onItemEdit && (
                    <Button size="sm" variant="ghost" onClick={(e) => {
                      e.stopPropagation();
                      onItemEdit(item);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onItemDownload && (
                    <Button size="sm" variant="ghost" onClick={(e) => {
                      e.stopPropagation();
                      onItemDownload(item);
                    }}>
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {onItemDelete && (
                    <Button size="sm" variant="ghost" onClick={(e) => {
                      e.stopPropagation();
                      onItemDelete(item.id);
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Media Gallery</h2>
          <Badge variant="secondary">{sortedItems.length} items</Badge>
          {selectedItems.length > 0 && (
            <Badge variant="default">
              {selectedItems.length} selected
              <Button
                size="sm"
                variant="ghost"
                onClick={clearSelection}
                className="ml-2 h-4 w-4 p-0"
              >
                ×
              </Button>
            </Badge>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'gallery' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('gallery')}
              className="rounded-r-none"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col sm:flex-row gap-4">
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {showFilters && (
            <div className="flex gap-2">
              <select
                title="Filter by media type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>

              <select
                title="Sort media items"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
                <option value="type">Sort by Type</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {sortedItems.length > 0 ? (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === 'gallery' && renderGalleryView()}
              {viewMode === 'grid' && renderGridView()}
              {viewMode === 'list' && renderListView()}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No media found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Upload some media files to get started'
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MediaGallery;
