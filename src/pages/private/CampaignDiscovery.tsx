import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Filter, 
  DollarSign, 
  Calendar, 
  Users,
  Briefcase,
  Clock,
  Send
} from 'lucide-react';
import { Campaign } from '@/types';
import { influencerApi } from '@/lib/influencerApi';
import { useToast } from '@/hooks/use-toast';

const CAMPAIGN_TYPES = [
  { value: 'sponsored_post', label: 'Sponsored Post' },
  { value: 'product_review', label: 'Product Review' },
  { value: 'brand_ambassador', label: 'Brand Ambassador' },
  { value: 'event_promotion', label: 'Event Promotion' },
  { value: 'giveaway', label: 'Giveaway' },
  { value: 'other', label: 'Other' },
];

export default function CampaignDiscoveryPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [applicationModal, setApplicationModal] = useState<{
    open: boolean;
    campaign: Campaign | null;
  }>({ open: false, campaign: null });
  const [applicationData, setApplicationData] = useState({
    message: '',
    proposed_rate: '',
  });
  const [applying, setApplying] = useState(false);
  const { toast } = useToast();

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const response = await influencerApi.getCampaigns({
        status: selectedStatus,
        campaign_type: selectedType || undefined,
      });
      setCampaigns(response.results);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      toast({
        title: 'Error',
        description: 'Failed to load campaigns',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedType, toast]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyToCampaign = async () => {
    if (!applicationModal.campaign) return;

    try {
      setApplying(true);
      await influencerApi.applyToCampaign({
        campaign: applicationModal.campaign.id,
        message: applicationData.message,
        proposed_rate: applicationData.proposed_rate ? parseFloat(applicationData.proposed_rate) : undefined,
      });

      toast({
        title: 'Success',
        description: 'Application submitted successfully!',
      });

      setApplicationModal({ open: false, campaign: null });
      setApplicationData({ message: '', proposed_rate: '' });
      fetchCampaigns(); // Refresh to remove applied campaign
    } catch (error) {
      console.error('Failed to apply to campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit application',
        variant: 'destructive',
      });
    } finally {
      setApplying(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCampaignTypeColor = (type: string) => {
    const colors = {
      sponsored_post: 'bg-blue-100 text-blue-800',
      product_review: 'bg-green-100 text-green-800',
      brand_ambassador: 'bg-purple-100 text-purple-800',
      event_promotion: 'bg-orange-100 text-orange-800',
      giveaway: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campaign Discovery</h1>
        <p className="text-gray-600">Find and apply to brand campaigns that match your niche</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Campaign Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {CAMPAIGN_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCampaigns.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No campaigns found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{campaign.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {campaign.description}
                    </CardDescription>
                  </div>
                  {campaign.is_paid && (
                    <Badge variant="default" className="ml-2">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Paid
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className={getCampaignTypeColor(campaign.campaign_type)} variant="secondary">
                    {CAMPAIGN_TYPES.find(t => t.value === campaign.campaign_type)?.label || campaign.campaign_type}
                  </Badge>
                  {campaign.target_niches.map((niche) => (
                    <Badge key={niche} variant="outline" className="text-xs">
                      {niche}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    {campaign.budget > 0 && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatCurrency(campaign.budget)}
                      </span>
                    )}
                    
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {campaign.creator.username}
                    </span>
                  </div>
                  
                  {campaign.application_deadline && (
                    <span className="flex items-center gap-1 text-orange-600">
                      <Clock className="h-4 w-4" />
                      {new Date(campaign.application_deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                {campaign.requirements && (
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-1">Requirements:</p>
                    <p>{campaign.requirements}</p>
                  </div>
                )}
                
                {campaign.deliverables && (
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-1">Deliverables:</p>
                    <p>{campaign.deliverables}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    Posted {new Date(campaign.created_at).toLocaleDateString()}
                  </div>
                  
                  <Dialog 
                    open={applicationModal.open && applicationModal.campaign?.id === campaign.id} 
                    onOpenChange={(open) => setApplicationModal({ open, campaign: open ? campaign : null })}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Send className="h-4 w-4 mr-2" />
                        Apply
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Apply to Campaign</DialogTitle>
                        <DialogDescription>
                          Submit your application for "{campaign.title}"
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Cover Message *
                          </label>
                          <Textarea
                            placeholder="Tell the brand why you're perfect for this campaign..."
                            value={applicationData.message}
                            onChange={(e) => setApplicationData({
                              ...applicationData,
                              message: e.target.value
                            })}
                            rows={4}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Proposed Rate (Optional)
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type="number"
                              placeholder="0"
                              value={applicationData.proposed_rate}
                              onChange={(e) => setApplicationData({
                                ...applicationData,
                                proposed_rate: e.target.value
                              })}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setApplicationModal({ open: false, campaign: null })}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleApplyToCampaign}
                          disabled={!applicationData.message || applying}
                        >
                          {applying ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
