import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Users,
  TrendingUp,
  MapPin,
  Star,
  Verified,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { InfluencerProfile } from '@/types';
import { influencerApi } from '@/lib/influencerApi';
import { useToast } from '@/hooks/use-toast';

const NICHES = [
  'lifestyle', 'fashion', 'beauty', 'fitness', 'food', 'travel', 
  'tech', 'gaming', 'music', 'art', 'business', 'education',
  'health', 'parenting', 'pets'
];

const TIERS = [
  { value: 'nano', label: 'Nano (1K-10K)', color: 'bg-green-100 text-green-800' },
  { value: 'micro', label: 'Micro (10K-100K)', color: 'bg-blue-100 text-blue-800' },
  { value: 'macro', label: 'Macro (100K-1M)', color: 'bg-purple-100 text-purple-800' },
  { value: 'mega', label: 'Mega (1M+)', color: 'bg-orange-100 text-orange-800' },
];

 function Influencers() {
  const [influencers, setInfluencers] = useState<InfluencerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [minFollowers, setMinFollowers] = useState<string>('');
  const [maxFollowers, setMaxFollowers] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchInfluencers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await influencerApi.discoverInfluencers({
        search: searchTerm || undefined,
        niche: selectedNiche ? [selectedNiche] : undefined,
        tier: selectedTier ? [selectedTier] : undefined,
        min_followers: minFollowers ? parseInt(minFollowers) : undefined,
        max_followers: maxFollowers ? parseInt(maxFollowers) : undefined,
        page: currentPage,
        page_size: 12,
      });
      setInfluencers(response.results);
      setTotalPages(Math.ceil(response.count / 12));
      setTotalCount(response.count);
    } catch (error) {
      console.error('Failed to fetch influencers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load influencers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedNiche, selectedTier, minFollowers, maxFollowers, currentPage, toast]);

  useEffect(() => {
    fetchInfluencers();
  }, [fetchInfluencers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedNiche, selectedTier, minFollowers, maxFollowers]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTierInfo = (tier: string) => {
    return TIERS.find(t => t.value === tier) || TIERS[0];
  };

  const handleFollowInfluencer = async () => {
    try {
      // Implement follow functionality
      toast({
        title: 'Success',
        description: 'Influencer added to your watchlist',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to follow influencer',
        variant: 'destructive',
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedNiche('');
    setSelectedTier('');
    setMinFollowers('');
    setMaxFollowers('');
    setCurrentPage(1);
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-900">Discover Influencers</h1>
          <p className="text-gray-600 mt-1">
            Find and connect with {totalCount.toLocaleString()} influencers in your niche
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search influencers by name, bio, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filter Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedNiche} onValueChange={setSelectedNiche}>
              <SelectTrigger>
                <SelectValue placeholder="All Niches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Niches</SelectItem>
                {NICHES.map((niche) => (
                  <SelectItem key={niche} value={niche}>
                    {niche.charAt(0).toUpperCase() + niche.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger>
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tiers</SelectItem>
                {TIERS.map((tier) => (
                  <SelectItem key={tier.value} value={tier.value}>
                    {tier.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Filter Row 2 - Follower Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Followers
              </label>
              <Input
                type="number"
                placeholder="e.g., 1000"
                value={minFollowers}
                onChange={(e) => setMinFollowers(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Followers
              </label>
              <Input
                type="number"
                placeholder="e.g., 100000"
                value={maxFollowers}
                onChange={(e) => setMaxFollowers(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count and Loading */}
      {loading && currentPage > 1 && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}

      {/* Influencers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {influencers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No influencers found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          influencers.map((influencer) => (
            <Card key={influencer.id} className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader className="pb-3">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16 ring-2 ring-gray-100">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${influencer.user.username}`} />
                    <AvatarFallback className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {influencer.user.first_name[0]}{influencer.user.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg truncate">
                        {influencer.user.first_name} {influencer.user.last_name}
                      </h3>
                      {influencer.is_verified && (
                        <Verified className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">@{influencer.user.username}</p>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getTierInfo(influencer.tier).color} variant="secondary">
                        {influencer.tier.charAt(0).toUpperCase() + influencer.tier.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {influencer.niche}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Bio */}
                <p className="text-sm text-gray-700 line-clamp-2">{influencer.bio}</p>
                
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{formatNumber(influencer.total_followers)}</span>
                    <span className="text-gray-500">followers</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{(influencer.avg_engagement_rate * 100).toFixed(1)}%</span>
                    <span className="text-gray-500">engagement</span>
                  </div>
                </div>
                
                {/* Location */}
                {influencer.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{influencer.location}</span>
                  </div>
                )}
                
                {/* Languages */}
                {influencer.languages && influencer.languages.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {influencer.languages.slice(0, 2).map((language) => (
                      <Badge key={language} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                    {influencer.languages.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{influencer.languages.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                
                {/* Secondary Niches */}
                {influencer.secondary_niches && influencer.secondary_niches.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {influencer.secondary_niches.slice(0, 2).map((niche) => (
                      <Badge key={niche} variant="outline" className="text-xs bg-gray-50">
                        {niche}
                      </Badge>
                    ))}
                    {influencer.secondary_niches.length > 2 && (
                      <Badge variant="outline" className="text-xs bg-gray-50">
                        +{influencer.secondary_niches.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.open(`mailto:${influencer.user.email}`, '_blank')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    onClick={handleFollowInfluencer}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Pagination */}
      {influencers.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4">
          <Button 
            variant="outline" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-gray-500">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-10"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          
          <Button 
            variant="outline" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
      
      {/* Results Summary */}
      {influencers.length > 0 && (
        <div className="text-center text-sm text-gray-600 pb-4">
          Showing {((currentPage - 1) * 12) + 1} - {Math.min(currentPage * 12, totalCount)} of {totalCount.toLocaleString()} influencers
        </div>
      )}
    </div>
  );
}

export default Influencers;