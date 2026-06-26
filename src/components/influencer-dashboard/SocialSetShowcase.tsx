import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Twitter, Linkedin, Instagram, Facebook, Youtube, Link as LinkIcon } from 'lucide-react';
import { SocialAccount } from '@/lib/api';

interface SocialSetShowcaseProps {
  activeAccounts?: SocialAccount[];
}

const getPlatformIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'twitter':
    case 'x':
      return Twitter;
    case 'linkedin':
      return Linkedin;
    case 'instagram':
      return Instagram;
    case 'facebook':
      return Facebook;
    case 'youtube':
      return Youtube;
    default:
      return LinkIcon;
  }
};

const getPlatformColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'twitter':
    case 'x':
      return '#1DA1F2';
    case 'linkedin':
      return '#0A66C2';
    case 'instagram':
      return '#E4405F';
    case 'facebook':
      return '#1877F2';
    case 'youtube':
      return '#FF0000';
    default:
      return '#6B7280';
  }
};

const SocialSetShowcase = ({ activeAccounts = [] }: SocialSetShowcaseProps) => {
  const activeSocialSet = useSelector((state: RootState) => state.socialSets.activeSocialSet);

  // If there is an active social set, use its platforms
  // Otherwise, map the activeAccounts
  const title = activeSocialSet ? activeSocialSet.name : 'Connected Accounts';
  
  const profiles = activeSocialSet 
    ? activeSocialSet.platforms.map(platform => ({
        image: platform.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(platform.name)}&background=random`,
        name: platform.name,
        username: platform.accountName ? `@${platform.accountName}` : '',
        socialIcon: getPlatformIcon(platform.type),
        socialHref: '#',
        color: getPlatformColor(platform.type)
      }))
    : activeAccounts.map(acc => ({
        image: acc.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.username || acc.platform)}&background=random`,
        name: acc.username || acc.platform,
        username: acc.username ? `@${acc.username}` : '',
        socialIcon: getPlatformIcon(acc.platform),
        socialHref: '#',
        color: getPlatformColor(acc.platform)
      }));

  return (
    <div className="w-full max-w-xs mx-auto bg-white rounded-2xl p-4 shadow-lg border border-red-500/10 hover:shadow-xl transition-all duration-300">
      {/* Title */}
      <div className="text-left">
        <h2 className="text-lg font-semibold text-red-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {title}
        </h2>
      </div>

      {/* Horizontal Rule */}
      <div className="w-full h-px bg-red-100 mt-1 mb-3"></div>

      {/* Profile Circles */}
      {profiles.length > 0 ? (
        <div className="flex flex-wrap justify-start items-start gap-3">
          {profiles.map((profile, index) => (
            <div key={index} className="relative group">
              {/* Profile Circle */}
              <div className="relative w-12 h-12 rounded-full border-2 border-red-500/20 group-hover:border-red-500/50 transition-all duration-300 shadow-md">
                <img 
                  src={profile.image} 
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              {/* Social Media Icon - Outside bottom right */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 z-10" style={{ backgroundColor: profile.color }}>
                <profile.socialIcon 
                  size={10} 
                  className="text-white"
                />
              </div>

              {/* Tooltip on Hover */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                <div className="bg-card border border-primary/20 rounded-lg px-2 py-1 shadow-soft whitespace-nowrap">
                  <p className="text-xs font-medium text-foreground">{profile.name}</p>
                  {profile.username && <p className="text-xs text-muted-foreground">{profile.username}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 py-2">
          No accounts connected.
        </div>
      )}
    </div>
  );
};

export default SocialSetShowcase;
