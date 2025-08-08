import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Layers, 
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
  Trash2
} from 'lucide-react';
import { RootState } from '../../redux/store';
import { setActiveSocialSet } from '../../redux/slices/socialSetsSlice';
import type { SocialSet } from '@/types';

const SocialSets = () => {
  const dispatch = useDispatch();
  const { socialSets, activeSocialSet } = useSelector((state: RootState) => state.socialSets);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSetActiveSocialSet = (socialSet: SocialSet) => {
    dispatch(setActiveSocialSet(socialSet));
  };

  const filteredSocialSets = socialSets.filter(set =>
    set.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">Social Sets</h1>
          <p className="text-gray-600 mt-1">Organize your social media accounts into manageable groups</p>
        </div>
        <Button className="bg-red-500 hover:bg-red-600">
          <Plus className="mr-2 h-4 w-4" />
          Create New Set
        </Button>
      </div>

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSocialSets.map((socialSet) => (
          <Card key={socialSet.id} className={`border-0 shadow-sm hover:shadow-md transition-shadow ${
            activeSocialSet?.id === socialSet.id ? 'ring-2 ring-red-500' : ''
          }`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">{socialSet.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
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

      {/* Create New Set Card */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-red-400 transition-colors">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Create New Social Set</h3>
          <p className="text-gray-600 mb-4 max-w-sm">
            Group your social media accounts together to manage them more efficiently
          </p>
          <Button className="bg-red-500 hover:bg-red-600">
            <Plus className="mr-2 h-4 w-4" />
            Create Social Set
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <Layers className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{socialSets.length}</p>
            <p className="text-sm text-gray-600">Total Sets</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <LinkIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {socialSets.reduce((total, set) => total + set.platforms.length, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Platforms</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {socialSets.reduce((total, set) => total + set.platforms.filter(p => p.isConnected).length, 0)}
            </p>
            <p className="text-sm text-gray-600">Connected</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">45.2K</p>
            <p className="text-sm text-gray-600">Total Followers</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialSets;