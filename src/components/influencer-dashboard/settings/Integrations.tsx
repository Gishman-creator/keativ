import React from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Settings, Plus, ExternalLink } from 'lucide-react';

import googleDriveLogo from '/public/integrated apps/google-drive-logo.png';
import dropboxLogo from '/public/integrated apps/dropbox-logo.png';
import canvaLogo from '/public/integrated apps/canva-logo.png';
import slackLogo from '/public/integrated apps/slack-logo.png';

interface IntegrationCardProps {
  logo: string;
  name: string;
  description: string;
  link: string;
  isIntegrated: boolean;
}

const integrationsData: IntegrationCardProps[] = [
  {
    logo: googleDriveLogo,
    name: 'Google Drive',
    description: 'Securely store, share, and access your files from anywhere.',
    link: 'drive.google.com',
    isIntegrated: true,
  },
  {
    logo: dropboxLogo,
    name: 'Dropbox',
    description: 'Cloud storage, file synchronization, personal cloud, and client software.',
    link: 'dropbox.com',
    isIntegrated: false,
  },
  {
    logo: canvaLogo,
    name: 'Canva',
    description: 'Graphic design platform for creating social media graphics, presentations, posters, documents and other visual content.',
    link: 'canva.com',
    isIntegrated: true,
  },
  {
    logo: slackLogo,
    name: 'Slack',
    description: 'A channel-based messaging platform.',
    link: 'slack.com',
    isIntegrated: false,
  },
];

const IntegrationCard: React.FC<IntegrationCardProps> = ({ logo, name, description, link, isIntegrated }) => {
  const [checked, setChecked] = React.useState(isIntegrated);

  return (
    <Card className="p-6 flex flex-col border border-gray-200 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col items-start gap-2">
          <img src={logo} alt={`${name} logo`} className="w-12 h-12 object-contain mb-2" />
        </div>
        <div className="group relative flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 hover:bg-gray-100">
          {isIntegrated ? (
            <a href={`https://${link}`} target="_blank" rel="noopener noreferrer" className="text-gray-500">
              <ExternalLink size={24} strokeWidth={2} />
              <span className="absolute top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">{link}</span>
            </a>
          ) : (
            <div className="text-gray-500">
              <Plus size={24} strokeWidth={2} />
              <span className="absolute top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">Connect {name}</span>
            </div>
          )}
        </div>
      </div>
      <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
      <p className="text-sm text-gray-600 mb-4 flex-grow">{description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <button className="text-gray-600 text-sm flex items-center gap-1 hover:text-gray-800">
          <Settings size={16} />
          Manage
        </button>
        <Switch
          checked={checked}
          onCheckedChange={setChecked}
          style={{ '--tw-ring-color': '#8B5CF6' } as React.CSSProperties}
        />
      </div>
    </Card>
  );
};

const Integrations: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Integrations</h2>
        <p className="text-gray-600">Connect your favorite apps to enhance your workflow.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrationsData.map((integration, index) => (
          <IntegrationCard key={index} {...integration} />
        ))}
      </div>
    </div>
  );
};

export default Integrations;
