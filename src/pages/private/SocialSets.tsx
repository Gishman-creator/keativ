import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Settings, 
  Users, 
  Link as LinkIcon,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Edit,
  Trash2,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { RootState } from '../../redux/store';
import { 
  setSocialSets, 
  setActiveSocialSet, 
  setLoading, 
  setError 
} from '../../redux/slices/socialSetsSlice';
import { socialSetsApi } from '@/lib/socialSetsApi';
import CreateSocialSetDialog from '@/components/social-sets/CreateSocialSetDialog';

import type { SocialSet } from '@/types';

const SocialSets = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { socialSets, activeSocialSet, isLoading, error } = useSelector((state: RootState) => state.socialSets);
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingSocialSet, setEditingSocialSet] = useState<SocialSet | null>(null);

  const loadSocialSets = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      // Load social sets from API
      const sets = await socialSetsApi.getSocialSets();
      dispatch(setSocialSets(sets));
      
      if (sets.length === 0) {
        toast({
          title: "No Social Sets",
          description: "You haven't created any social sets yet. Create your first one to get started!",
        });
      }
    } catch (error) {
      console.error('Failed to load social sets:', error);
      dispatch(setError('Failed to load social sets. Please check your connection and try again.'));
      dispatch(setSocialSets([])); // Set empty array instead of mock data
      
      toast({
        title: "Connection Error",
        description: "Unable to load social sets. Please check your internet connection.",
        variant: "destructive",
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, toast]);

  // Load social sets when component mounts
  useEffect(() => {
    loadSocialSets();
  }, [loadSocialSets]);

  const handleRefresh = () => {
    loadSocialSets();
    toast({
      title: "Refreshed",
      description: "Social sets have been refreshed.",
    });
  };

  const handleCreateNew = () => {
    setEditingSocialSet(null);
    setCreateDialogOpen(true);
  };

  const handleEdit = (socialSet: SocialSet) => {
    setEditingSocialSet(socialSet);
    setCreateDialogOpen(true);
  };

  const handleSocialSetCreated = () => {
    loadSocialSets();
  };

  const handleDelete = async (socialSet: SocialSet) => {
    try {
      await socialSetsApi.deleteSocialSet(socialSet.id);
      await loadSocialSets(); // Refresh the list
      toast({
        title: "Deleted",
        description: `"${socialSet.name}" has been deleted.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete social set.",
        variant: "destructive",
      });
    }
  };

  const getPlatformIcon = (type: string) => {
    switch (type) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      default:
        return <LinkIcon className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (type: string) => {
    switch (type) {
      case 'instagram':
        return 'text-pink-600 bg-pink-100';
      case 'twitter':
        return 'text-blue-600 bg-blue-100';
      case 'facebook':
        return 'text-blue-700 bg-blue-100';
      case 'linkedin':
        return 'text-blue-800 bg-blue-100';
      case 'youtube':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSetActiveSocialSet = async (socialSet: SocialSet) => {
    try {
      // Update the social set to active in backend
      await socialSetsApi.setActive(socialSet.id, true);
      
      // Set the active social set in Redux
      dispatch(setActiveSocialSet(socialSet));
      
      toast({
        title: "Set Active",
        description: `"${socialSet.name}" is now your active social set.`,
      });
    } catch {
      // If API fails, still update Redux for demo purposes
      dispatch(setActiveSocialSet(socialSet));
      toast({
        title: "Set Active (Demo)",
        description: `"${socialSet.name}" is now your active social set.`,
      });
    }
  };

  const filteredSocialSets = socialSets.filter(set =>
    set.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="mb-4 sm:mb-0">
          <h1 className="font-heading text-3xl font-bold text-gray-900">Social Sets</h1>
          <p className="text-gray-600 mt-1">Organize your social media accounts into manageable groups</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            className="bg-red-500 hover:bg-red-600" 
            onClick={handleCreateNew}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Set
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading social sets...</span>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="border-red-200 bg-red-50 shadow-sm">
          <CardContent className="p-6">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={handleRefresh}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Input
              placeholder="Search social sets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4"
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Social Set */}
      {activeSocialSet && (
        <Card className="border-2 border-red-200 bg-red-50 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-red-500 text-white">Active</Badge>
                <CardTitle className="text-lg font-semibold">{activeSocialSet.name}</CardTitle>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSocialSet.platforms.map((platform) => (
                <div key={platform.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${getPlatformColor(platform.type)}`}>
                        {getPlatformIcon(platform.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{platform.name}</h3>
                        <p className="text-sm text-gray-600">{platform.accountName}</p>
                      </div>
                    </div>
                    <Badge variant={platform.isConnected ? 'default' : 'secondary'}>
                      {platform.isConnected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  {platform.isConnected && platform.followers && (
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{platform.followers.toLocaleString()} followers</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Social Sets */}
      {!isLoading && filteredSocialSets.length === 0 && !error && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Social Sets Yet</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Create your first social set to organize your social media accounts and streamline your posting workflow.
            </p>
            <Button 
              className="bg-red-500 hover:bg-red-600" 
              onClick={handleCreateNew}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Social Set
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Social Sets Grid */}
      {!isLoading && filteredSocialSets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSocialSets.map((socialSet) => (
          <Card key={socialSet.id} className={`border-0 shadow-sm hover:shadow-md transition-shadow ${
            activeSocialSet?.id === socialSet.id ? 'ring-2 ring-red-500' : ''
          }`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">{socialSet.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEdit(socialSet)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(socialSet)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {socialSet.platforms.map((platform) => (
                  <div key={platform.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getPlatformColor(platform.type)}`}>
                        {getPlatformIcon(platform.type)}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{platform.name}</p>
                        <p className="text-xs text-gray-600">{platform.accountName || 'Not connected'}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={platform.isConnected ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {platform.isConnected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>Connected Platforms:</span>
                  <span>{socialSet.platforms.filter(p => p.isConnected).length}/{socialSet.platforms.length}</span>
                </div>
                
                <div className="flex space-x-2">
                  {activeSocialSet?.id !== socialSet.id ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSetActiveSocialSet(socialSet)}
                    >
                      Set Active
                    </Button>
                  ) : (
                    <Button variant="default" size="sm" className="flex-1" disabled>
                      Currently Active
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {/* Create/Edit Social Set Dialog */}
      <CreateSocialSetDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSocialSetCreated={handleSocialSetCreated}
        editingSocialSet={editingSocialSet}
      />
    </div>
  );
};

export default SocialSets;
