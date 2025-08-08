import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import PrivateLayout from '../layouts/PrivateLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Public pages
import Landing from '../pages/public/Landing';
import Features from '../pages/public/Features';
import Pricing from '../pages/public/Pricing';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Login from '../pages/public/Login';
import Signup from '../pages/public/Signup';
import NotFound from '../pages/public/NotFound';

// Private pages
import Dashboard from '../pages/private/Dashboard';
import Calendar from '../pages/private/Calendar';
import Analytics from '../pages/private/Analytics';
import Messages from '../pages/private/Messages';
import MediaLibrary from '../pages/private/MediaLibrary';
import Influencers from '../pages/private/Influencers';
import SocialSets from '../pages/private/SocialSets';
import Settings from '../pages/private/Settings';
import PostAnalyticsPage from '../pages/private/PostAnalyticsPage';

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
      { path: 'settings', element: <Settings /> },
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
      { path: 'calendar', element: <Calendar /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'analytics/posts/:id', element: <PostAnalyticsPage /> },
      { path: 'messages', element: <Messages /> },
      { path: 'media', element: <MediaLibrary /> },
      { path: 'influencers', element: <Influencers /> },
      { path: 'social-sets', element: <SocialSets /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
