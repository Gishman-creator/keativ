import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Image as ImageIcon,
  Video,
  Download,
  Trash2,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { mockMediaItems } from '../../data/mockData';

const MediaLibrary = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'image' | 'video'>('all');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'gdrive':
        return 'bg-blue-100 text-blue-700';
      case 'dropbox':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredMedia = mockMediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="mb-4 sm:mb-0">
          <h1 className="font-heading text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Manage your images, videos, and other media files</p>
        </div>
        <Button className="bg-red-500 hover:bg-red-600 w-full sm:w-auto mb-5 md:mb-0">
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search media files..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={selectedFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={selectedFilter === 'image' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter('image')}
                >
                  <ImageIcon className="mr-1 h-4 w-4" />
                  Images
                </Button>
                <Button
                  variant={selectedFilter === 'video' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter('video')}
                >
                  <Video className="mr-1 h-4 w-4" />
                  Videos
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid/List */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMedia.map((item) => (
                <div key={item.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {item.type === 'image' ? (
                      <img 
                        src={item.url} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Video className="h-12 w-12 mb-2" />
                        <span className="text-sm">Video File</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getSourceBadgeColor(item.source)}`}
                      >
                        {item.source === 'gdrive' ? 'Drive' : 
                         item.source === 'dropbox' ? 'Dropbox' : 'Local'}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span>{formatFileSize(item.size)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uploaded:</span>
                        <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-500 border-b border-gray-200">
                <div className="col-span-1">Type</div>
                <div className="col-span-4">Name</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-2">Source</div>
                <div className="col-span-2">Uploaded</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              {filteredMedia.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 rounded-lg items-center">
                  <div className="col-span-1">
                    {item.type === 'image' ? (
                      <ImageIcon className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Video className="h-5 w-5 text-purple-500" />
                    )}
                  </div>
                  <div className="col-span-4">
                    <div className="flex items-center space-x-3">
                      {item.type === 'image' && (
                        <img 
                          src={item.url} 
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <span className="font-medium text-gray-900 truncate">{item.name}</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">
                    {formatFileSize(item.size)}
                  </div>
                  <div className="col-span-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getSourceBadgeColor(item.source)}`}
                    >
                      {item.source === 'gdrive' ? 'Google Drive' : 
                       item.source === 'dropbox' ? 'Dropbox' : 'Local'}
                    </Badge>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">
                    {new Date(item.uploadedAt).toLocaleDateString()}
                  </div>
                  <div className="col-span-1">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaLibrary;
