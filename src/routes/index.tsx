import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import PrivateLayout from '../layouts/PrivateLayout';

// Public pages
import Landing from '../pages/public/Landing';
import Features from '../pages/public/Features';
import Pricing from '../pages/public/Pricing';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Login from '../pages/public/Login';
import Signup from '../pages/public/Signup';
import NotFound from '../pages/public/NotFound';

// Email verification components
import { EmailVerification, VerificationPending, ResendVerification } from '../components/auth';

// Private pages
import Dashboard from '../pages/private/Dashboard';
import Calendar from '../pages/private/Calendar';
import Analytics from '../pages/private/Analytics';
import Messages from '../pages/private/Messages';
import MediaLibrary from '../pages/private/MediaLibrary';
import Influencers from '../pages/private/Influencers';
import SocialSets from '../pages/private/SocialSets';
import SettingsPage from '../pages/private/SettingsPage';
import IntegrationsPage from '../pages/private/IntegrationsPage';
import Notifications from '../pages/private/Notifications';
import Automations from '../pages/private/Automations';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'features', element: <Features /> },
      { path: 'pricing', element: <Pricing /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'verify-email/:token', element: <EmailVerification /> },
      { path: 'verification-pending', element: <VerificationPending /> },
      { path: 'resend-verification', element: <ResendVerification /> },
    ],
  },
  {
    path: '/dashboard',
    element: <PrivateLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'calendar', element: <Calendar /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'messages', element: <Messages /> },
      { path: 'automations', element: <Automations /> },
      { path: 'media', element: <MediaLibrary /> },
      { path: 'influencers', element: <Influencers /> },
      { path: 'social-sets', element: <SocialSets /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'integrations', element: <IntegrationsPage /> },
      { path: 'notifications', element: <Notifications /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);