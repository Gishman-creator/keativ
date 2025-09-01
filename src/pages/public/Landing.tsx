import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar,
  BarChart3,
  Users,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  Play,
  CheckCircle,
  TrendingUp,
  MessageCircle,
  Image as ImageIcon,
  Bot,
  Globe,
  Target,
  Bell,
  Layers
} from 'lucide-react';
import Integrations from '@/components/landing/Integrations';
import TrustedBy from '@/components/landing/TrustedBy';

const Landing = () => {
  const [currentFeatureSlide, setCurrentFeatureSlide] = useState(0);
  const [currentBrandSlide, setCurrentBrandSlide] = useState(0);
  const [featuresPerSlide, setFeaturesPerSlide] = useState(3); // Default to largest

  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Plan and schedule posts across all platforms with our intuitive calendar view and AI-powered timing suggestions.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track performance, engagement, and growth with detailed insights and automated reports that matter.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work seamlessly with unlimited team members, shared calendars, and approval workflows.'
    },
    {
      icon: MessageCircle,
      title: 'Unified Inbox',
      description: 'Manage all your social media messages and comments from one centralized inbox across all platforms.'
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Get smart content suggestions, hashtag recommendations, and optimal posting times powered by AI.'
    },
    {
      icon: Globe,
      title: 'Multi-Platform Support',
      description: 'Connect and manage Instagram, Twitter, Facebook, LinkedIn, TikTok, and YouTube from one dashboard.'
    },
    {
      icon: Target,
      title: 'Audience Targeting',
      description: 'Reach the right audience with advanced targeting options and demographic insights.'
    },
    {
      icon: ImageIcon,
      title: 'Content Library',
      description: 'Store and organize all your media files with cloud sync from Google Drive and Dropbox.'
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      description: 'Stay updated with instant notifications for mentions, comments, and important social media activities.'
    }
  ];

  const brands = [
    // First row - moving right
    [
      { name: 'Netflix', logo: 'NETFLIX' },
      { name: 'Xbox', logo: 'XBOX' },
      { name: 'Disney+', logo: 'Disney+' },
      { name: 'YouTube', logo: 'YouTube' },
      { name: 'Hulu', logo: 'hulu' },
      { name: 'PlayStation', logo: 'PlayStation' }
    ],
    // Second row - moving left
    [
      { name: 'Apple TV+', logo: 'Apple TV+' },
      { name: 'Moonlight', logo: 'MOONLIGHT' },
      { name: 'FuboTV', logo: 'fuboTV' },
      { name: 'Prime Video', logo: 'Prime Video' },
      { name: 'Paramount+', logo: 'Paramount+' },
      { name: 'HBO Max', logo: 'HBO Max' }
    ]
  ];

  const brandsPerSlide = 4;
  const totalFeatureSlides = Math.ceil(features.length / featuresPerSlide);

  // Update featuresPerSlide based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setFeaturesPerSlide(3);
      } else if (window.innerWidth >= 640) { // sm breakpoint
        setFeaturesPerSlide(2);
      } else {
        setFeaturesPerSlide(1);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll features every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureSlide((prev) => (prev + 1) % Math.ceil(features.length / featuresPerSlide));
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length, featuresPerSlide]);

  const [brandRow1Position, setBrandRow1Position] = useState(0);
  const [brandRow2Position, setBrandRow2Position] = useState(0);

  // Auto-scroll brand rows continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setBrandRow1Position((prev) => prev - 1);
      setBrandRow2Position((prev) => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const benefits = [
    'Schedule unlimited posts across all platforms',
    'Get AI-powered insights and recommendations',
    'Collaborate with unlimited team members',
    'Access advanced analytics and reporting',
    'Manage multiple brand accounts',
    'Import media from Google Drive & Dropbox'
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '2M+', label: 'Posts Scheduled' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-10 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Social Media Management
                </span>
              </div>

              <h1 className="font-heading text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Manage all your
                <span className="text-red-500"> social media</span>
                <br />
                from one place
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline your social media workflow with Zenith's minimalist dashboard.
                Schedule posts, analyze performance, and collaborate with your team seamlessly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                {/* Mock Dashboard Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Content Calendar</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center font-medium">{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }, (_, i) => (
                      <div key={i} className="aspect-square border border-gray-100 rounded text-xs flex items-center justify-center relative">
                        {i > 6 && i < 28 && (
                          <span className="text-gray-700">{i - 6}</span>
                        )}
                        {[8, 12, 15, 19, 23].includes(i) && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-b"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">This month</span>
                      <span className="font-semibold text-gray-900">24 posts scheduled</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Analytics Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Engagement</p>
                    <p className="text-lg font-bold text-green-600">+24.5%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 mb-4">
              Why Choose Zenith
            </span>
            <h2 className="font-heading text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to
              <br />
              <span className="text-red-500">grow your presence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help you manage, analyze, and grow your social media presence
              with the simplicity you deserve.
            </p>
          </div>

          {/* Features Carousel */}
          <div className="relative mb-16">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentFeatureSlide * 100}%)` }}
              >
                {Array.from({ length: totalFeatureSlides }, (_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {features
                        .slice(slideIndex * featuresPerSlide, (slideIndex + 1) * featuresPerSlide)
                        .map((feature, index) => (
                          <Card key={index} className="border-0 shadow-sm">
                            <CardContent className="p-8 text-center">
                              <div className="bg-red-100 p-4 rounded-2xl w-fit mx-auto mb-6">
                                <feature.icon className="h-8 w-8 text-red-600" />
                              </div>
                              <h3 className="font-heading text-xl font-semibold text-gray-900 mb-4">
                                {feature.title}
                              </h3>
                              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Pagination Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: totalFeatureSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeatureSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${index === currentFeatureSlide ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Benefits List */}
          <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="font-heading text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  Built for modern teams who value simplicity
                </h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold text-gray-900">Analytics Overview</h4>
                    <span className="text-sm text-gray-500">Last 30 days</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">45.2K</div>
                      <div className="text-sm text-gray-600">Total Reach</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">+18%</div>
                      <div className="text-sm text-gray-600">Growth</div>
                    </div>
                  </div>

                  <div className="h-24 bg-gradient-to-r from-red-500 to-purple-600 rounded-lg opacity-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustedBy />

      <Integrations />

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-500 to-purple-600 rounded-3xl p-8 lg:p-12 text-center text-white">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white mb-6">
              Ready to get started?
            </span>

            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-6">
              Transform your social media strategy today
            </h2>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using Zenith to streamline their social media
              management and grow their online presence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-red-500 hover:bg-gray-100 px-8 py-4 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 w-fit px-8 py-4 text-lg">
                Schedule Demo
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-white/80">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
