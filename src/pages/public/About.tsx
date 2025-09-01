import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, Users, Target, Award, Heart } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Former social media manager with 8+ years of experience helping brands grow their online presence.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Full-stack developer passionate about creating intuitive tools for content creators and marketers.'
    },
    {
      name: 'Emma Wilson',
      role: 'Head of Design',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'UI/UX designer focused on creating beautiful, user-friendly interfaces that make work enjoyable.'
    }
  ];

  const values = [
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in building tools that bring people together and help creators connect with their audiences.'
    },
    {
      icon: Target,
      title: 'Simplicity',
      description: 'Complex problems deserve simple solutions. We focus on making social media management effortless.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from our product to our customer support.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We are passionate about helping creators and businesses succeed in the digital world.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Story Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Zenith was born out of frustration with existing social media management tools. 
                  As content creators ourselves, we found most platforms to be overly complex, 
                  expensive, or lacking the features we actually needed.
                </p>
                <p>
                  In 2023, we decided to build the tool we wished existed - something beautiful, 
                  intuitive, and powerful enough to handle the demands of modern social media 
                  marketing, yet simple enough that anyone could use it.
                </p>
                <p>
                  Today, Zenith helps thousands of creators and businesses streamline their 
                  social media workflow, save time, and grow their online presence.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/public images/about-image-1.webp" 
                alt="Team working together" 
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-transparent border-none shadow-none text-center">
                <CardHeader>
                  <div className="bg-red-100 p-4 rounded-lg w-fit mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The people behind Zenith
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-sm text-center">
                <CardHeader>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto">
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {member.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-red-500 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-red-100 mb-8">
            To empower creators and businesses with simple, powerful tools that make 
            social media management effortless and enjoyable.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Share2 className="h-8 w-8 text-white" />
            <span className="font-heading text-2xl font-bold text-white">
              Zenith
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;