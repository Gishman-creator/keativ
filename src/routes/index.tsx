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
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import TermsOfService from '../pages/public/TermsOfService';
import NotFound from '../pages/public/NotFound';

// Email verification components
import { EmailVerification, VerificationPending, ResendVerification } from '../components/auth';

// Import the Enhanced Pricing component
import EnhancedPricing from '../pages/public/EnhancedPricing';

// Import the Plan Selection component
import PlanSelection from '../pages/auth/PlanSelection';

// Private pages
import Dashboard from '../pages/private/Dashboard';
// Calendar is integrated into Planner via tabs
import Planner from '../pages/private/Planner';
import Analytics from '../pages/private/Analytics';
import MediaLibrary from '../pages/private/MediaLibrary';
import SocialSets from '../pages/private/SocialSets';
import Posts from '../pages/private/Posts';
import SettingsPage from '../pages/private/SettingsPage';
import IntegrationsPage from '../pages/private/IntegrationsPage';
import Notifications from '../pages/private/Notifications';
import Automations from '../pages/private/Automations';
import TwitterCallback from '../pages/private/integrations/TwitterCallback';
import LinkedInCallback from '../pages/private/integrations/LinkedInCallback';
import CreatePost from '../pages/private/CreatePost';
import PostAnalyticsPage from '@/pages/private/PostAnalyticsPage';
// import Influencers from '@/pages/private/Influencers';
import InfluencerDashboardPage from '@/pages/private/InfluencerDashboard';
import Messages from '../pages/private/Messages';

// Payment and CRM imports
import BillingDashboard from '../pages/private/billing/BillingDashboard';
import EnhancedBillingDashboard from '../pages/private/billing/EnhancedBillingDashboard';
import BillingPlanSelection from '../pages/private/billing/PlanSelection';
import CRMDashboard from '../pages/private/crm/CRMDashboard';
import GoHighLevelIntegration from '../components/crm/GoHighLevelIntegration';
import CRMContactsList from '../components/crm/CRMContactsList';

// Demo page for dialog components
import DialogsDemoPage from '../pages/private/demo/DialogsDemoPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'features', element: <Features /> },
      { path: 'pricing', element: <Pricing /> },
      { path: 'pricing-enhanced', element: <EnhancedPricing /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'privacy', element: <PrivacyPolicy /> },
      { path: 'terms', element: <TermsOfService /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'plan-selection', element: <PlanSelection /> },
      { path: 'verify-email/:token', element: <EmailVerification /> },
      { path: 'verification-pending', element: <VerificationPending /> },
      { path: 'resend-verification', element: <ResendVerification /> },
    ],
  },
  {
    path: '/dashboard',
    element: <PrivateLayout />,
    // element: (
    //   <ProtectedRoute>
    //     <PrivateLayout />
    //   </ProtectedRoute>
    // ),
    children: [
      { index: true, element: <Dashboard /> },
  { path: 'planner', element: <Planner /> },
  { path: 'calendar', element: <Planner /> },
      { path: 'calendar/new', element: <CreatePost /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'analytics/posts/:id', element: <PostAnalyticsPage /> },
  { path: 'messages', element: <Messages /> },
      { path: 'automations', element: <Automations /> },
      { path: 'media', element: <MediaLibrary /> },
      { path: 'influencers', element: <InfluencerDashboardPage /> },
      { path: 'social-sets', element: <SocialSets /> },
  { path: 'posts', element: <Planner /> },
  { path: 'posts/new', element: <Posts /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'integrations', element: <IntegrationsPage /> },
      { path: 'integrations/twitter/callback', element: <TwitterCallback /> },
      { path: 'integrations/linkedin/callback', element: <LinkedInCallback /> },
      { path: 'notifications', element: <Notifications /> },
      
      // Billing and subscription routes
      { path: 'billing', element: <EnhancedBillingDashboard /> },
      { path: 'billing/legacy', element: <BillingDashboard /> },
      { path: 'billing/plans', element: <BillingPlanSelection /> },
      
      // CRM routes
      { path: 'crm', element: <CRMDashboard /> },
      { path: 'crm/contacts', element: <CRMContactsList /> },
      { path: 'crm/integration', element: <GoHighLevelIntegration /> },
      
      // Demo routes (development/testing)
      { path: 'demo/dialogs', element: <DialogsDemoPage /> },
      
      {
        path: 'createpost',
        element: <CreatePost />,
      }
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
