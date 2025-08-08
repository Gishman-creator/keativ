import React, { useState } from 'react';
import slackLogo from '/integrated apps/slack-logo.png';
import canvaLogo from '/integrated apps/canva-logo.png';
import googleDriveLogo from '/integrated apps/google-drive-logo.png';
import dropboxLogo from '/integrated apps/dropbox-logo.png';

const integrations = [
  { name: 'Slack', logo: slackLogo, description: 'Team Communication', position: 'left-[5%] top-[35%]', rotation: '-rotate-12' },
  { name: 'Canva', logo: canvaLogo, description: 'Graphic Design', position: 'left-[29%] top-[15%]', rotation: '-rotate-3' },
  { name: 'Google Drive', logo: googleDriveLogo, description: 'Cloud Storage', position: 'right-[29%] top-[15%]', rotation: 'rotate-3' },
  { name: 'Dropbox', logo: dropboxLogo, description: 'File Hosting', position: 'right-[5%] top-[35%]', rotation: 'rotate-12' },
];

const Integrations = () => {
  const [hovered, setHovered] = useState<(typeof integrations[0])>(integrations[0]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 mb-0">
          Integrate with your existing
          <br />
          <span className="text-red-500">tools in seconds</span>
        </h2>

        {/* Desktop and larger screens layout */}
        <div className="relative h-96 flex flex-col items-center justify-center mt-0 hidden md:flex">
          <div className="relative w-full h-full max-w-3xl mx-auto">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                onMouseEnter={() => setHovered(integration)}
                className={`absolute w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110 hover:shadow-xl border border-gray-100 ${integration.position} ${integration.rotation}`}
              >
                <img src={integration.logo} alt={integration.name} className="h-16 w-16 object-contain" />
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 text-center h-16">
            <div className="transition-opacity duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {hovered.name}
              </h3>
              <p className="text-gray-500">
                {hovered.description}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile and small screens layout */}
        <div className="grid grid-cols-2 gap-8 mt-12 md:hidden">
          {integrations.map((integration) => (
            <div>
              <div
                key={integration.name}
                className="flex flex-col items-center p-4  rounded-2xl"
              >
                <img src={integration.logo} alt={integration.name} className="h-20 w-20 object-contain mb-2" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {integration.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Integrations;
