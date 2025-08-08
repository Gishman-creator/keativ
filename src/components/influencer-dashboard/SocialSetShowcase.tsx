import { Twitter, Linkedin, Instagram } from 'lucide-react';

const SocialSetShowcase = () => {
  const profiles = [
    {
      image: "https://picsum.photos/id/1005/200/200",
      name: "Sarah Johnson",
      username: "@SarahJohnson",
      socialIcon: Twitter,
      socialHref: "#",
      color: "#1DA1F2"
    },
    {
      image: "https://picsum.photos/id/1011/200/200",
      name: "Michael Chen",
      username: "@MichaelChen",
      socialIcon: Linkedin,
      socialHref: "#",
      color: "#0A66C2"
    },
    {
      image: "https://picsum.photos/id/1012/200/200",
      name: "Alex Rivera",
      username: "@AlexRivera",
      socialIcon: Instagram,
      socialHref: "#",
      color: "#E4405F"
    }
  ];

  return (
    <div className="w-full max-w-xs mx-auto bg-white rounded-2xl p-4 shadow-lg border border-red-500/10 hover:shadow-xl transition-all duration-300">
      {/* Title */}
      <div className="text-left">
        <h2 className="text-lg font-semibold text-red-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Main Brand
        </h2>
      </div>

      {/* Horizontal Rule */}
      <div className="w-full h-px bg-red-100 mt-1 mb-3"></div>

      {/* Profile Circles */}
      <div className="flex justify-start items-start gap-3">
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
              <a href={profile.socialHref} target="_blank" rel="noopener noreferrer">
                <profile.socialIcon 
                  size={10} 
                  className="text-white"
                />
              </a>
            </div>

            {/* Tooltip on Hover */}
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
              <div className="bg-card border border-primary/20 rounded-lg px-2 py-1 shadow-soft whitespace-nowrap">
                <p className="text-xs font-medium text-foreground">{profile.name}</p>
                <p className="text-xs text-muted-foreground">{profile.username}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialSetShowcase;
