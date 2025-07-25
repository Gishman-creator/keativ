import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  BarChart3, 
  Users, 
  MessageCircle,
  Image,
  Zap,
  Clock,
  Shield,
  Layers,
  Bot,
  Globe,
  Target
} from 'lucide-react';

const Features = () => {
  const mainFeatures = [
    {
      icon: Calendar,
      title: 'Smart Content Scheduling',
      description: 'Plan and schedule posts across all your social platforms with our intuitive drag-and-drop calendar. Get AI-powered suggestions for optimal posting times.',
      features: ['Visual calendar interface', 'Bulk scheduling', 'Time zone optimization', 'Recurring posts'],
      badge: 'Core'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics & Insights',
      description: 'Track performance with detailed analytics, engagement metrics, and automated reports. Understand what content resonates with your audience.',
      features: ['Real-time analytics', 'Custom reports', 'Competitor analysis', 'ROI tracking'],
      badge: 'Analytics'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work seamlessly with unlimited team members. Assign roles, review content, and maintain brand consistency across all your social channels.',
      features: ['Unlimited collaborators', 'Role-based permissions', 'Approval workflows', 'Team calendars'],
      badge: 'Collaboration'
    }
  ];

  const additionalFeatures = [
    { icon: MessageCircle, title: 'Unified Inbox', description: 'Manage all social messages in one place' },
    { icon: Image, title: 'Media Library', description: 'Cloud storage with Google Drive & Dropbox sync' },
    { icon: Bot, title: 'AI Assistant', description: 'Smart hashtag and content suggestions' },
    { icon: Clock, title: 'Auto-Publishing', description: 'Reliable posting across time zones' },
    { icon: Shield, title: 'Enterprise Security', description: 'SOC 2 compliant with 2FA protection' },
    { icon: Layers, title: 'Multi-Brand Management', description: 'Manage multiple brands from one dashboard' },
    { icon: Globe, title: 'Platform Coverage', description: 'Support for all major social networks' },
    { icon: Target, title: 'Audience Targeting', description: 'Advanced targeting and segmentation tools' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="text-red-500"> Social Media Success</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to plan, publish, and analyze your social media content. 
            Built for teams who value simplicity and effectiveness.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {mainFeatures.map((feature, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <feature.icon className="h-8 w-8 text-red-600" />
                    </div>
                    <Badge variant="outline">{feature.badge}</Badge>
                  </div>
                  
                  <h2 className="font-heading text-3xl font-bold text-gray-900">
                    {feature.title}
                  </h2>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {feature.features.map((item, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                    <div className="text-center">
                      <feature.icon className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Feature preview</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
              Plus Much More
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools to elevate your social media strategy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="bg-red-100 p-3 rounded-lg w-fit">
                    <feature.icon className="h-6 w-6 text-red-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Support */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative min-h-[400px] flex items-center justify-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4 relative z-10">
              Connect All Your Favorite Platforms
            </h2>
            <p className="text-xl text-gray-600 mb-12 relative z-10">
              Keativ supports all major social media platforms,<br />so you can manage everything from one dashboard.
            </p>
            
            {/* Platforms arranged in a circle around the text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-[500px] h-[500px]">
                {[
                  { name: 'Instagram', color: '#E4405F', logo: '📷' },
                  { name: 'Twitter', color: '#1DA1F2', logo: '🐦' },
                  { name: 'Facebook', color: '#1877F2', logo: '👥' },
                  { name: 'LinkedIn', color: '#0A66C2', logo: '💼' },
                  { name: 'TikTok', color: '#000000', logo: '🎵' },
                  { name: 'YouTube', color: '#FF0000', logo: '📺' },
                  { name: 'Pinterest', color: '#BD081C', logo: '📌' },
                  { name: 'Snapchat', color: '#FFFC00', logo: '👻' }
                ].map((platform, index) => {
                  const angle = (index * 45) * (Math.PI / 180); // 45 degrees apart
                  const radius = 200;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <div
                      key={platform.name}
                      className="absolute w-20 h-20 rounded-full flex items-center justify-center shadow-lg animate-pulse"
                      style={{ 
                        backgroundColor: `${platform.color}20`,
                        left: `calc(50% + ${x}px - 40px)`,
                        top: `calc(50% + ${y}px - 40px)`,
                        animationDelay: `${index * 0.2}s`
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                        style={{ backgroundColor: platform.color }}
                      >
                        {platform.logo}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Curved connecting lines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg width="500" height="500" className="opacity-20">
                <circle 
                  cx="250" 
                  cy="250" 
                  r="200" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="2" 
                  strokeDasharray="10,5"
                  className="animate-spin"
                  style={{ animationDuration: '20s' }}
                />
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center mt-20">
            {[
              { name: 'Instagram', color: '#E4405F', logo: '📷' },
              { name: 'Twitter', color: '#1DA1F2', logo: '🐦' },
              { name: 'Facebook', color: '#1877F2', logo: '👥' },
              { name: 'LinkedIn', color: '#0A66C2', logo: '💼' },
              { name: 'TikTok', color: '#000000', logo: '🎵' },
              { name: 'YouTube', color: '#FF0000', logo: '📺' }
            ].map((platform, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center text-white text-2xl"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.logo}
                </div>
                <p className="text-sm font-medium text-gray-700">{platform.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;